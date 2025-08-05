using Microsoft.AspNetCore.SignalR;
using OrderManagement.Models.DTOs;
using System.Threading.Tasks;

public class OrderHub : Hub
{
    public async Task SendOrder(OrderReadDto order)
    {
        await Clients.All.SendAsync("ReceiveOrder", order);
    }
}
