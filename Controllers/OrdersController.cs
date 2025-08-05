using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderManagement.Data;
using OrderManagement.Models.DTOs;
using OrderManagement.Models;
using OrderManagement.Models.Enums;
using Microsoft.AspNetCore.SignalR;
using Azure.Messaging.ServiceBus;

namespace OrderManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<OrderHub> _hubContext;
    private readonly ServiceBusClient _serviceBusClient;
    private readonly string _queueName;

    public OrdersController(AppDbContext context, IHubContext<OrderHub> hubContext, ServiceBusClient serviceBusClient, IConfiguration config)
    {
        _context = context;
        _hubContext = hubContext;
        _serviceBusClient = serviceBusClient;
        _queueName = config.GetValue<string>("AzureServiceBus:QueueName");
    }

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        var orders = await _context.Orders.Include(o => o.Client).Include(o => o.Product).ToListAsync();

        var orderDtos = orders.Select(order => new OrderReadDto
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            Client = new ClientReadDto
            {
                Id = order.Client?.Id ?? Guid.Empty,
                Name = order.Client?.Name ?? string.Empty,
                Phone = order.Client?.Phone ?? string.Empty,
                Email = order.Client?.Email ?? string.Empty,
                BirthDate = order.Client?.BirthDate ?? DateOnly.MinValue,
                CreatedAt = order.Client?.CreatedAt ?? DateTime.MinValue,
                UpdatedAt = order.Client?.UpdatedAt ?? DateTime.MinValue
            },
            Product = new ProductReadDto
            {
                Id = order.Product?.Id ?? Guid.Empty,
                Name = order.Product?.Name ?? string.Empty,
                Amount = order.Product?.Amount ?? 0,
                CreatedAt = order.Product?.CreatedAt ?? DateTime.MinValue,
                UpdatedAt = order.Product?.UpdatedAt ?? DateTime.MinValue
            }
        }).ToList();

        return Ok(orderDtos);
    }

    // GET: api/orders/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Order>> GetOrder(Guid id)
    {
        var order = await _context.Orders.Include(o => o.Client).Include(o => o.Product).FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound();

        var dto = new OrderReadDto
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            Client = new ClientReadDto
            {
                Id = order.Client?.Id ?? Guid.Empty,
                Name = order.Client?.Name ?? string.Empty,
                Phone = order.Client?.Phone,
                Email = order.Client?.Email ?? string.Empty,
                BirthDate = order.Client?.BirthDate,
                CreatedAt = order.Client?.CreatedAt ?? DateTime.MinValue,
                UpdatedAt = order.Client?.UpdatedAt ?? DateTime.MinValue
            },
            Product = new ProductReadDto
            {
                Id = order.Product?.Id ?? Guid.Empty,
                Name = order.Product?.Name ?? string.Empty,
                Amount = order.Product?.Amount ?? 0,
                CreatedAt = order.Product?.CreatedAt ?? DateTime.MinValue,
                UpdatedAt = order.Product?.UpdatedAt ?? DateTime.MinValue
            }
        };

        return Ok(dto);
    }

    // POST: api/orders
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] OrderCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var client = await _context.Clients
            .FirstOrDefaultAsync(c => c.Id == dto.ClientId && !c.IsDeleted);
        if (client == null)
            return NotFound($"Client with ID {dto.ClientId} not found.");

        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == dto.ProductId && !p.IsDeleted);
        if (product == null)
            return NotFound($"Product with ID {dto.ProductId} not found.");

        var order = new Order
        {
            Id = Guid.NewGuid(),
            ClientId = dto.ClientId,
            ProductId = dto.ProductId,
            TotalAmount = dto.TotalAmount,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var sender = _serviceBusClient.CreateSender(_queueName);
        var message = new ServiceBusMessage(order.Id.ToString())
        {
            ContentType = "text/plain",
            Subject = "OrderCreated"
        };
        await sender.SendMessageAsync(message);

        var orderDto = new OrderReadDto
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            Client = new ClientReadDto
            {
                Id = order.Client?.Id ?? Guid.Empty,
                Name = order.Client?.Name ?? string.Empty,
                Phone = order.Client?.Phone,
                Email = order.Client?.Email ?? string.Empty,
                BirthDate = order.Client?.BirthDate,
                CreatedAt = order.Client?.CreatedAt ?? DateTime.MinValue,
                UpdatedAt = order.Client?.UpdatedAt ?? DateTime.MinValue
            },
            Product = new ProductReadDto
            {
                Id = order.Product?.Id ?? Guid.Empty,
                Name = order.Product?.Name ?? string.Empty,
                Amount = order.Product?.Amount ?? 0,
                CreatedAt = order.Product?.CreatedAt ?? DateTime.MinValue,
                UpdatedAt = order.Product?.UpdatedAt ?? DateTime.MinValue
            }
        };
        await _hubContext.Clients.All.SendAsync("ReceiveOrder", orderDto);

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
    }
}
