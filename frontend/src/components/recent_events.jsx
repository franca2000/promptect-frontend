import React, { useEffect, useState } from "react";

export default function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/recent-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error al obtener eventos recientes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow mt-10">
      <h2 className="text-xl font-semibold mb-4">Eventos recientes</h2>
      {loading ? (
        <p className="text-gray-500">Cargando eventos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 pr-4">🕒 Fecha</th>
                <th className="py-2 pr-4">👤 Usuario</th>
                <th className="py-2 pr-4">🧾 Prompt</th>
                <th className="py-2">🧠 Riesgo</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4 text-gray-700">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4 text-gray-800">{event.user}</td>
                  <td className="py-2 pr-4 text-gray-600 truncate max-w-xs">
                    {event.prompt}
                  </td>
                  <td className="py-2 text-red-600 font-medium">{event.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
