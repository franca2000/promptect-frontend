import React from "react";

export default function DateFilter({ value, onChange }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Rango de fechas
      </label>
      <select
        className="border rounded px-3 py-2 text-sm text-gray-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="7">Últimos 7 días</option>
        <option value="30">Últimos 30 días</option>
        <option value="90">Últimos 90 días</option>
      </select>
    </div>
  );
}
