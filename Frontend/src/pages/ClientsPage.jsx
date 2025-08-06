import React, { useEffect, useState } from "react";
import moment from "moment";
import DataTable from "../components/DataTable";
import ClientForm from "../components/ClientForm";
import { IconEdit, IconTrash } from '@tabler/icons-react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const API_BASE = "http://localhost:5000";

export default function ClientsPage() {
  const [showModal, setShowModal] = useState(false);
  const [client, setClient] = useState([]);
  const [clients, setClients] = useState([]);

  const handleClient = async (c) => {
    try {
      const url = c.client?.id ? `${API_BASE}/api/clients/${c.client?.id}` : `${API_BASE}/api/clients`;
      const res = await fetch(url, {
        method: c.client?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      if (!res.ok) throw new Error("Error creating client");

      if(c.client?.id) {
        setClients((prev) => prev.map((cli) => (cli.id === c.client?.id ? c : cli)));
      } else {
        setClients((prev) => [c, ...prev]);
      }
    } catch (err) {
      console.error("POST /clients error:", err);
    }
  };

  const showSwal = (id) => {
    withReactContent(Swal).fire({
      title: "Do you really want to delete this information?",
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: "Delete",
    }).then(async (result) => {
      if (result.isDenied) {
        // tenta deletar na API
        try {
          const res = await fetch(`${API_BASE}/api/clients/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) throw new Error("Error deleting client");

          setClients((prev) => prev.filter((c) => c.id !== id));

          Swal.fire("Deleted!", "The client was removed.", "success");
        } catch (err) {
          throw new Error("Error deleting client:" + err);
        }
      }
    });
  };

  const openModal = (c) => {
    setClient(c)
    setShowModal(true);
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/clients`)
      .then((r) => r.json())
      .then(setClients)
      .catch((err) => console.error("GET /clients:", err));
  }, []);

  const columns = [
    { header: "Name", accessor: (c) => c.name },
    { header: "Phone", accessor: (c) => c.phone ?? "-" },
    { header: "Email", accessor: (c) => c.email },
    { header: "Birth Date", accessor: (c) => c.birthDate ? moment(c.birthDate).format("MM/DD/YYYY") : "-" },
    { header: "Created At", accessor: (c) => moment(c.createdAt).format("MM/DD/YYYY HH:mm") },
    { header: "Actions", 
      accessor: (c) => (
        <div className="flex text-gray-400">
          <IconEdit stroke={2} onClick={() => openModal(c)} />
          <IconTrash stroke={2} onClick={() => showSwal(c.id)} />
        </div>
      ),
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between mb-8 mt-2">
        <h1 className="text-2xl font-bold text-blue-950">Clients</h1>
        <button
          className="bg-blue-950 text-white rounded-lg py-2 px-4 hover:bg-blue-900"
          onClick={() => openModal("")}
        >
          Add Client
        </button>
      </div>

      <DataTable
        items={clients}
        columns={columns}
        rowKey={(c) => c.id}
        onRowClick={(c) => console.log("clicked", c.id)}
      />
      <ClientForm
        showModal={showModal}
        onCancel={() => setShowModal(false)}
        client={client}
        onSubmit={(cli) => {
          handleClient(cli);
          setShowModal(false);
        }}
      />
    </div>
  );
}
