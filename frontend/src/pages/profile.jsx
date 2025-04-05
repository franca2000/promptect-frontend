import React from "react";

export default function profile() {
  const user = {
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "Administrador",
    joined: "2024-08-01"
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-6">Perfil de usuario</h1>

      <div className="bg-gray-100 rounded-xl p-6 max-w-xl">
        <p className="mb-4"><strong>Nombre:</strong> {user.name}</p>
        <p className="mb-4"><strong>Email:</strong> {user.email}</p>
        <p className="mb-4"><strong>Rol:</strong> {user.role}</p>
        <p className="mb-4"><strong>Miembro desde:</strong> {user.joined}</p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Editar perfil
        </button>
      </div>
    </div>
  );
}