import React, { useState } from "react";

export default function settings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      {/* Preferencias de cuenta */}
      <section className="mb-10 max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={emailNotif}
            onChange={() => setEmailNotif(!emailNotif)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Recibir alertas por correo electrónico</span>
        </label>
      </section>

      {/* Gestión de API key */}
      <section className="max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Clave de API</h2>
        <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
          <span className="text-sm text-gray-700">
            {apiKeyVisible ? "pk_live_abcd1234efgh5678" : "••••••••••••••••••••"}
          </span>
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setApiKeyVisible(!apiKeyVisible)}
          >
            {apiKeyVisible ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </section>
    </div>
  );
}
