import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import Modal from "../components/Modal";

export default function OrderForm({ clients, products, showModal, onCancel, onSubmit }) {
  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const handleSubmit = () => {
    onSubmit({
      clientId,
      productId,
      totalAmount: parseFloat(
        totalAmount.replace(/\./g, "").replace(",", ".").replace("R$", "")
      ),
    });
  };

  return (
    <Modal
        title="Add Order"
        open={showModal}
        onClose={onCancel}
        onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Client</label>
        <select
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
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
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Total Amount
        </label>
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
    </Modal>
  );
}
