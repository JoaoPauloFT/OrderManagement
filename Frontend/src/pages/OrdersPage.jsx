import { useState } from "react";
import OrdersTable from "../components/OrdersTable";
import OrderModal from "../components/OrderModal";
import "../index.css";

export default function OrdersPage() {
  const [showModal, setShowModal] = useState(false);

  const handleAddOrder = async (order) => {
    try {
      const response = await fetch("http://localhost:5117/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Error to create a order");
      }
    } catch (error) {
      console.error("Error POST /orders:", error);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex align-center justify-between mb-8 mt-2">
        <h1 className="text-2xl font-bold text-blue-950 m-0">Orders</h1>
        <button className="bg-blue-950 text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-blue-900" onClick={() => setShowModal(true)}>Add Order</button>
      </div>
      <OrdersTable />
      {showModal && (
        <OrderModal onClose={() => setShowModal(false)} onSubmit={handleAddOrder} />
      )}
    </div>
  );
}