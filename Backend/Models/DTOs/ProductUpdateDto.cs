using System.ComponentModel.DataAnnotations;

namespace OrderManagement.Models.DTOs;

public class ProductUpdateDto
{
    [Required(ErrorMessage = "Name is required.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Amount is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
    public decimal Amount { get; set; } = 0.00m;
}
