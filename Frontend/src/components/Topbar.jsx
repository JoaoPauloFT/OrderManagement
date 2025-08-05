import React from "react";
import { NavLink } from "react-router-dom";

const linkBase = "px-4 py-2 rounded-md font-medium";

function ActiveLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? `${linkBase} bg-blue-950 text-white shadow`
          : `${linkBase} text-gray-700 hover:bg-gray-200`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Topbar() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold text-blue-950">Order Management System</div>
            <nav className="hidden md:flex items-center gap-2">
              <ActiveLink to="/clients">Clients</ActiveLink>
              <ActiveLink to="/products">Products</ActiveLink>
              <ActiveLink to="/orders">Orders</ActiveLink>
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
          <nav className="flex flex-col">
            <NavLink
              to="/clients"
              onClick={() => setOpen(false)}
              className="px-4 py-2 hover:bg-gray-100"
            >
              Clients
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setOpen(false)}
              className="px-4 py-2 hover:bg-gray-100"
            >
              Products
            </NavLink>
            <NavLink
              to="/orders"
              onClick={() => setOpen(false)}
              className="px-4 py-2 hover:bg-gray-100"
            >
              Orders
            </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
}
