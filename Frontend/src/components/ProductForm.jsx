import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Modal from "../components/Modal";

export default function ProductForm({ showModal, onCancel, onSubmit, product }) {
  const [name, setName] = useState(product?.name ?? "");
  const [amount, setAmount] = useState(product?.amount ?? "");

  useEffect(() => {
    setName(product?.name ?? "");
    setAmount(product?.amount ?? "");
  }, [product]);

  const handleSubmit = () => {
    onSubmit({ product,
      name, 
      amount: parseFloat(
        amount.replace(/\./g, "").replace(",", ".").replace("R$", "")
      ), });
  };

  return (
    <Modal
        title={product?.name ? "Edit Product" : "Add Product"}
        open={showModal}
        onClose={onCancel}
        onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <NumericFormat
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={amount}
          onValueChange={(values) => setAmount(values.formattedValue)}
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          allowNegative={false}
        />
      </div>
    </Modal>
  );
}
