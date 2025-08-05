using Azure.Messaging.ServiceBus;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using OrderManagement.Data;
using OrderManagement.Models;
using OrderManagement.Models.DTOs;
using OrderManagement.Models.Enums;

public class OrderProcessingWorker : BackgroundService
{
    private readonly ServiceBusClient _client;
    private readonly string _queueName;
    private readonly IServiceScopeFactory _scopeFactory;
    private ServiceBusProcessor? _processor;
    private readonly IHubContext<OrderHub> _hubContext;

    public OrderProcessingWorker(ServiceBusClient client, IConfiguration configuration, IServiceScopeFactory scopeFactory, IHubContext<OrderHub> hubContext)
    {
        _client = client;
        _queueName = configuration.GetValue<string>("AzureServiceBus:QueueName");
        _scopeFactory = scopeFactory;
        _hubContext = hubContext;
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        var options = new ServiceBusProcessorOptions
        {
            MaxConcurrentCalls = 1,
            AutoCompleteMessages = false
        };

        _processor = _client.CreateProcessor(_queueName, options);
        _processor.ProcessMessageAsync += ProcessMessageHandler;
        _processor.ProcessErrorAsync += ErrorHandler;

        await _processor.StartProcessingAsync(cancellationToken);
    }

    private async Task ProcessMessageHandler(ProcessMessageEventArgs args)
    {
        var body = args.Message.Body.ToString();

        if (Guid.TryParse(body, out var orderId))
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var order = await db.Orders.Include(o => o.Client).Include(o => o.Product).FirstOrDefaultAsync(o => o.Id == orderId && !o.IsDeleted);
            if (order != null)
            {
                order.Status = OrderStatus.Processing;
                order.UpdatedAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
                await _hubContext.Clients.All.SendAsync("UpdateOrder", OrderReadDto(order));

                await Task.Delay(5000);

                order.Status = OrderStatus.Finished;
                order.UpdatedAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
                await _hubContext.Clients.All.SendAsync("UpdateOrder", OrderReadDto(order));
            }
        }

        await args.CompleteMessageAsync(args.Message);
    }

    private OrderReadDto OrderReadDto(Order order)
    {
        return new OrderReadDto
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
    }

    private Task ErrorHandler(ProcessErrorEventArgs args)
    {
        return Task.CompletedTask;
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_processor != null)
        {
            await _processor.StopProcessingAsync(cancellationToken);
            await _processor.DisposeAsync();
        }
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.CompletedTask;
    }
}