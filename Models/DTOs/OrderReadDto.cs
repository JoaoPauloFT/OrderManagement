using OrderManagement.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace OrderManagement.Models.DTOs;

public class OrderReadDto
{
    public Guid Id { get; set; }

    public OrderStatus Status { get; set; }

    public ClientReadDto Client { get; set; } = null!;

    public ProductReadDto Product { get; set; } = null!;

    public decimal TotalAmount { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
