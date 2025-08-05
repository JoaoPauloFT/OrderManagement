using OrderManagement.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace OrderManagement.Models.DTOs;

public class OrderCreateDto
{
    [Required(ErrorMessage = "ClientId is required.")]
    public Guid ClientId { get; set; }

    [Required(ErrorMessage = "ProductId is required.")]
    public Guid ProductId { get; set; }

    [Required(ErrorMessage = "TotalAmount is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "TotalAmount must be greater than zero.")]
    public decimal TotalAmount { get; set; }
}
