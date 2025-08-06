import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";

function formatPhone(value) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").slice(0, 11); // limite 11 dígitos
  const d1 = digits.slice(0, 2);
  const d2 = digits.slice(2, 7);
  const d3 = digits.slice(7, 11);

  if (!d2) return d1 ? `(${d1}` : "";
  if (!d3) return `(${d1}) ${d2}`;
  return `(${d1}) ${d2}-${d3}`;
}

export default function ClientForm({ showModal, onCancel, onSubmit, client }) {
  const [name, setName] = useState(client?.name ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [birthDate, setBirthDate] = useState(client?.birthDate ?? "");

  useEffect(() => {
    setName(client?.name ?? "");
    setPhone(client?.phone ?? "");
    setEmail(client?.email ?? "");
    setBirthDate(client?.birthDate ?? "");
  }, [client]);

  const handleSubmit = () => {
    onSubmit({ client, name, phone, email, birthDate });
  };

  return (
    <Modal
        title={client?.name ? "Edit Client" : "Add Client"}
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
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="(99) 99999-9999"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Birth Date</label>
        <input
          type="date"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>
    </Modal>
  );
}
