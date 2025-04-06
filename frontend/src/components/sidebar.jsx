import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Perfil", path: "/profile" },
    { label: "Configuración", path: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-6 fixed top-0 left-0 shadow-lg">
      <h1 className="text-2xl font-bold mb-10">Promptect</h1>
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded hover:bg-gray-700 transition ${
              location.pathname === item.path ? "bg-gray-800" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-6 left-6">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
