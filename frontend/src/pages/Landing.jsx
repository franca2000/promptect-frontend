import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight">
          Protege tu infraestructura con inteligencia artificial.
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8">
          Promptect es la nueva plataforma de ciberseguridad inteligente diseñada para empresas que no pueden permitirse fallos.
        </p>
        <Link to="/register" className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
          Solicitar demo personalizada
        </Link>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-12">Diseñado para seguridad real</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold mb-3">Detección proactiva con IA</h3>
            <p>Detectamos amenazas antes de que ocurran gracias a nuestros modelos predictivos entrenados con millones de señales.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold mb-3">Cumplimiento y auditoría</h3>
            <p>Automatiza controles de cumplimiento normativo (ISO, GDPR, NIST, SOC2) y genera reportes en segundos.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold mb-3">Visibilidad total</h3>
            <p>Panel de control en tiempo real para ver el estado de tu infraestructura, alertas, recomendaciones y métricas clave.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center bg-white">
        <h2 className="text-3xl font-bold mb-6">Confiado por empresas que priorizan la seguridad</h2>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Descubrí por qué los líderes IT eligen Promptect como su aliado estratégico. Somos más que una herramienta: somos tu socio.
        </p>
        <Link to="/contact" className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition">
          Agendar llamada con un experto
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 bg-gray-900 text-gray-400 text-sm">
        © {new Date().getFullYear()} Promptect. Todos los derechos reservados.
      </footer>
    </div>
  );
}


