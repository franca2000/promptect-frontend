import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import RiskPieChart from "../components/risk_pie_chart";
import DateFilter from "../components/date_filter_dropdown";
import RecentEvents from "../components/recent_events";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState({
    reports: 0,
    riskLevel: "Desconocido",
    newUsers: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/dashboard-data?range=${range}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        setData({
          reports: json.reports,
          riskLevel: json.risk_level,
          newUsers: json.new_users,
        });
        setChartData(json.chart);
      } catch (err) {
        console.error("Error al obtener datos del dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [range]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50 text-gray-800 p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold">Panel de Control</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido a Promptect. Aquí podrás visualizar el estado de tu seguridad.
          </p>
        </header>

        <DateFilter value={range} onChange={setRange} />

        {loading ? (
          <p className="text-gray-500">Cargando información del dashboard...</p>
        ) : (
          <>
            <section className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
                <h2 className="text-lg font-semibold mb-2">Últimos análisis</h2>
                <p className="text-sm text-gray-600">{data.reports} reportes en los últimos {range} días</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
                <h2 className="text-lg font-semibold mb-2">Nivel de riesgo promedio</h2>
                <p className="text-sm text-gray-600">{data.riskLevel}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
                <h2 className="text-lg font-semibold mb-2">Activaciones recientes</h2>
                <p className="text-sm text-gray-600">{data.newUsers} nuevos usuarios en los últimos {range} días</p>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Riesgos detectados en los últimos {range} días</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="riesgos" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="mt-10">
              <RiskPieChart />
            </section>

            <section className="mt-10">
              <RecentEvents />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
