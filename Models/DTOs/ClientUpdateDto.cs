using System.ComponentModel.DataAnnotations;

namespace OrderManagement.Models.DTOs;

public class ClientUpdateDto
{
    [Required(ErrorMessage = "Name is required.")]
    public string Name { get; set; } = string.Empty;

    public string? Phone { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string Email { get; set; } = string.Empty;

    public DateOnly? BirthDate { get; set; }
}
