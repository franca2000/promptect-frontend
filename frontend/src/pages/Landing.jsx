// src/pages/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12 flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-4">Promptect</h1>
      <p className="text-xl text-gray-400 mb-8 max-w-2xl">
        AI Prompt Security & Monitoring — detecta inyecciones, fugas de información sensible y anomalías en prompts antes de que sea tarde.
      </p>

      <button
        onClick={() => navigate("/app")}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-lg rounded-xl mb-12"
      >
        Ingresar a la plataforma
      </button>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Análisis en Tiempo Real</h2>
          <p className="text-gray-400 text-sm">
            Detectá inyecciones, tokens, claves API y contenido riesgoso en tus prompts al instante.
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Historial Inteligente</h2>
          <p className="text-gray-400 text-sm">
            Accedé al historial filtrable por riesgo, fecha o texto. Todo asociado a tu usuario.
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Infraestructura Escalable</h2>
          <p className="text-gray-400 text-sm">
            Construido con FastAPI + React + MongoDB. Optimizado para crecer desde el día uno.
          </p>
        </div>
      </div>
    </div>
  );
}
