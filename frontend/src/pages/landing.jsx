import React from "react";
import { Link } from "react-router-dom";

export default function landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold mb-6">Bienvenido a Promptect</h1>
      <p className="text-lg text-gray-300 max-w-2xl mb-8">
        Plataforma de análisis y protección de prompts basada en inteligencia artificial para entornos empresariales. Detectá riesgos, gestioná usuarios y optimizá la seguridad de tus modelos de lenguaje.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-xl"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}
