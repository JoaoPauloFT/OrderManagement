import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./components/Topbar";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </main>
    </div>
  );
}
