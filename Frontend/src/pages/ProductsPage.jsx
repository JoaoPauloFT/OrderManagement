import React, { useEffect, useState } from "react";
import moment from "moment";
import DataTable from "../components/DataTable";
import ProductForm from "../components/ProductForm";
import { IconEdit, IconTrash } from '@tabler/icons-react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const API_BASE = "http://localhost:5000";

export default function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState([]);
  const [products, setProducts] = useState([]);

  const handleProduct = async (p) => {
    try {
      const url = p.product?.id ? `${API_BASE}/api/products/${p.product?.id}` : `${API_BASE}/api/products`;
      const res = await fetch(url, {
        method: p.product?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (!res.ok) throw new Error("Error creating product");

      if(p.product?.id) {
        setProducts((prev) => prev.map((pd) => (pd.id === p.product?.id ? p : pd)));
      } else {
        setProducts((prev) => [p, ...prev]);
      }
    } catch (err) {
      console.error("POST /products error:", err);
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
        try {
          const res = await fetch(`${API_BASE}/api/products/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) throw new Error("Error deleting product");

          setProducts((prev) => prev.filter((p) => p.id !== id));

          Swal.fire("Deleted!", "The product was removed.", "success");
        } catch (err) {
          throw new Error("Error deleting product:" + err);
        }
      }
    });
  };

  const openModal = (p) => {
    setProduct(p)
    setShowModal(true);
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then(setProducts)
      .catch((err) => console.error("GET /products:", err));
  }, []);

  const columns = [
    { header: "Name", accessor: (p) => p.name },
    { header: "Amount", accessor: (p) => `R$ ${p.amount.toFixed(2)}` },
    { header: "Created At", accessor: (p) => moment(p.createdAt).format("MM/DD/YYYY HH:mm") },
    { header: "Actions", 
      accessor: (p) => (
        <div className="flex text-gray-400">
          <IconEdit stroke={2} onClick={() => openModal(p)} />
          <IconTrash stroke={2} onClick={() => showSwal(p.id)} />
        </div>
      ),
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between mb-8 mt-2">
        <h1 className="text-2xl font-bold text-blue-950">Products</h1>
        <button
          className="bg-blue-950 text-white rounded-lg py-2 px-4 hover:bg-blue-900"
          onClick={() => openModal("")}
        >
          Add Product
        </button>
      </div>

      <DataTable
        items={products}
        columns={columns}
        rowKey={(p) => p.id}
        onRowClick={(p) => console.log("clicked", p.id)}
      />
      <ProductForm
        showModal={showModal}
        onCancel={() => setShowModal(false)}
        product={product}
        onSubmit={(pd) => {
          handleProduct(pd);
          setShowModal(false);
        }}
      />
    </div>
  );
}
