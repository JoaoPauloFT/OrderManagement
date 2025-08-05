import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import moment from 'moment';

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5117/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error("Error /orders:", err));
      
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5117/orderHub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("Connected to SignalR!");
    }).catch(console.error);

    connection.on("ReceiveOrder", (order) => {
      setOrders(prev => [order, ...prev]);
    });

    connection.on("UpdateOrder", (order) => {
      setOrders(prev => prev.map(o => (o.id === order.id ? { ...o, ...order } : o)));
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="bg-white shadow rounded-lg overflow-x-auto">
    <table className="min-w-full table-auto text-sm">
        <thead>
        <tr className="bg-blue-950 text-left text-white">
            <th className="px-4 py-2">Client</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Total Amount</th>
            <th className="px-4 py-2">Status</th>
        </tr>
        </thead>
        <tbody>
        {orders.map((order, index) => (
            <tr className="cursor-pointer hover:bg-gray-100" key={index}>
            <td className="px-4 py-2">{order.client.name}</td>
            <td className="px-4 py-2">{order.product.name}</td>
            <td className="px-4 py-2">{moment(order.createdAt).format('MM/DD/YYYY HH:mm')}</td>
            <td className="px-4 py-2">R$ {order.totalAmount.toFixed(2)}</td>
            <td className="px-4 py-2">
                <span
                className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                    order.status === "Pending"
                    ? "bg-yellow-500"
                    : order.status === "Processing"
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
                >
                {order.status}
                </span>
            </td>
            </tr>
        ))}
        {orders.length === 0 && (
            <tr>
            <td colSpan={4} className="text-center py-4 text-gray-500">
                No orders found.
            </td>
            </tr>
        )}
        </tbody>
    </table>
    </div>
  );
}
