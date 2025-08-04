using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderManagement.Data;
using OrderManagement.Models.DTOs;
using OrderManagement.Models;

namespace OrderManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClientsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/clients
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Client>>> GetClients()
    {
        return await _context.Clients.ToListAsync();
    }

    // GET: api/clients/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Client>> GetClient(Guid id)
    {
        var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);

        if (client == null)
            return NotFound();

        return client;
    }

    // POST: api/clients
    [HttpPost]
    public async Task<ActionResult<Client>> CreateClient([FromBody] ClientCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            BirthDate = dto.BirthDate ?? default,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Clients.Add(client);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetClient), new { id = client.Id }, client);
    }

    // PUT: api/clients/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateClient(Guid id, [FromBody] ClientUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);
        if (client == null)
            return NotFound();

        client.Name = dto.Name;
        client.Phone = dto.Phone;
        client.Email = dto.Email;
        client.BirthDate = dto.BirthDate ?? default;
        client.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/clients/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> SoftDeleteClient(Guid id)
    {
        var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);
        if (client == null)
            return NotFound();

        client.IsDeleted = true;
        client.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
