import React from "react";

export default function dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Panel de Control</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido a Promptect. Aquí podrás visualizar el estado de tu seguridad.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">Últimos análisis</h2>
          <p className="text-sm text-gray-600">0 reportes en las últimas 24h</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">Nivel de riesgo promedio</h2>
          <p className="text-sm text-gray-600">Bajo</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">Activaciones recientes</h2>
          <p className="text-sm text-gray-600">3 nuevos usuarios se registraron</p>
        </div>
      </section>
    </div>
  );
}
