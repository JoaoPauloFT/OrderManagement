import React, { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";

export default function OrderModal({ onClose, onSubmit }) {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const handleSubmit = () => {
    const order = {
      clientId,
      productId,
      totalAmount: parseFloat(
        totalAmount.replace(/\./g, "").replace(",", ".").replace("R$", "")
      ),
    };

    onSubmit(order);
    onClose();
  };

  useEffect(() => {
    fetch("http://localhost:5117/api/clients")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setClients(sorted);
      })
      .catch((err) => console.error("Error /clients:", err));

    fetch("http://localhost:5117/api/products")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setProducts(sorted);
      })
      .catch((err) => console.error("Error /products:", err));
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl text-blue-950 font-bold mb-4">Add Order</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Total Amount</label>
          <NumericFormat
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={totalAmount}
            onValueChange={(values) => setTotalAmount(values.formattedValue)}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            allowNegative={false}
          />
        </div>


        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-white text-gray-700 border-1 border-bg-gray-700 border-solid rounded-lg py-2 px-4 cursor-pointer mr-2 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-950 text-white border-1 border-bg-red-500 border-solid rounded-lg py-2 px-4 cursor-pointer hover:bg-blue-900"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}