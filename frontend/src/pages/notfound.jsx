import React from "react";
import { Link } from "react-router-dom";

export default function notfound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        La página que estás buscando no existe o fue movida.
      </p>
      <Link
        to="/"
        className="text-blue-600 hover:underline text-base font-medium"
      >
        Volver al inicio
      </Link>
    </div>
  );
}