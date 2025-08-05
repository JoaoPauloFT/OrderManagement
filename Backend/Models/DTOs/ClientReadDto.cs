namespace OrderManagement.Models.DTOs;

public class ClientReadDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Phone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public DateOnly? BirthDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
