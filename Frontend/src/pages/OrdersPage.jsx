import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import moment from "moment";
import DataTable from "../components/DataTable";
import OrderForm from "../components/OrderForm";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function OrdersPage() {
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  const handleAddOrder = async (order) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error("Error creating order");
    } catch (err) {
      console.error("POST /orders error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, productsData] = await Promise.all([
          fetch(`${API_BASE}/api/clients`).then((r) => r.json()),
          fetch(`${API_BASE}/api/products`).then((r) => r.json()),
        ]);
        setClients(clientsData);
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching clients/products:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/orders`)
      .then((r) => r.json())
      .then(setOrders)
      .catch((err) => console.error("GET /orders:", err));

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE}/orderHub`)
      .withAutomaticReconnect()
      .build();

    connection.start().catch(console.error);

    connection.on("ReceiveOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    connection.on("UpdateOrder", (order) => {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    });

    return () => connection.stop();
  }, []);

  const columns = [
    { header: "Client", accessor: (o) => o.client?.name ?? "-" },
    { header: "Product", accessor: (o) => o.product?.name ?? "-" },
    {
      header: "Created At",
      accessor: (o) =>
        o.createdAt ? moment(o.createdAt).format("MM/DD/YYYY HH:mm") : "-",
    },
    {
      header: "Total Amount",
      accessor: (o) => `R$ ${o.totalAmount.toFixed(2)}`,
    },
    {
      header: "Status",
      accessor: (o) => (
        <span
          className={`px-2 py-1 rounded text-white text-xs font-semibold ${
            o.status === "Pending"
              ? "bg-yellow-500"
              : o.status === "Processing"
              ? "bg-orange-500"
              : "bg-green-500"
          }`}
        >
          {o.status}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between mb-8 mt-2">
        <h1 className="text-2xl font-bold text-blue-950">Orders</h1>
        <button
          className="bg-blue-950 text-white rounded-lg py-2 px-4 hover:bg-blue-900"
          onClick={() => setShowModal(true)}
        >
          Add Order
        </button>
      </div>

      <DataTable
        items={orders}
        columns={columns}
        rowKey={(o) => o.id}
        onRowClick={(o) => console.log("clicked", o.id)}
      />
      <OrderForm
        clients={clients}
        products={products}
        showModal={showModal}
        onCancel={() => setShowModal(false)}
        onSubmit={(order) => {
          handleAddOrder(order);
          setShowModal(false);
        }}
      />
    </div>
  );
}
