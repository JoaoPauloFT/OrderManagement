using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderManagement.Data;
using OrderManagement.Models.DTOs;
using OrderManagement.Models;

namespace OrderManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        var products = await _context.Products.ToListAsync();

        var productDtos = products.Select(product => new ProductReadDto
        {
            Id = product.Id,
            Name = product.Name,
            Amount = product.Amount,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        }).ToList();

        return Ok(productDtos);
    }

    // GET: api/products/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Product>> GetProduct(Guid id)
    {
        var product = await _context.Products.FirstOrDefaultAsync(c => c.Id == id);

        if (product == null)
            return NotFound();

        var dto = new ProductReadDto
        {
            Id = product.Id,
            Name = product.Name,
            Amount = product.Amount,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };

        return Ok(dto);
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] ProductCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Amount = dto.Amount,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    // PUT: api/products/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] ProductUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var product = await _context.Products.FirstOrDefaultAsync(c => c.Id == id);
        if (product == null)
            return NotFound();

        product.Name = dto.Name;
        product.Amount = dto.Amount;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/products/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> SoftDeleteProduct(Guid id)
    {
        var product = await _context.Products.FirstOrDefaultAsync(c => c.Id == id);
        if (product == null)
            return NotFound();

        product.IsDeleted = true;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
