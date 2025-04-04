// src/Scanner.jsx
import React, { useEffect, useState } from "react";

export default function Scanner({ token, onLogout }) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [userEmail, setUserEmail] = useState(null);

  const fetchUserEmail = async () => {
    try {
      const res = await fetch("http://localhost:8000/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUserEmail(data.email);
    } catch (err) {
      console.error("Failed to load user info");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8000/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  useEffect(() => {
    fetchUserEmail();
    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = [...history];
    if (searchTerm) {
      filtered = filtered.filter((h) =>
        h.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (riskFilter) {
      filtered = filtered.filter((h) => h.risk_level === riskFilter);
    }
    setFilteredHistory(filtered);
  }, [searchTerm, riskFilter, history]);

  const analyzePrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data);
      fetchHistory();
    } catch (err) {
      setResult({ error: "Error connecting to API." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 grid gap-6">
      <header className="text-center relative">
        <h1 className="text-4xl font-bold mb-1">Promptect</h1>
        <p className="text-lg text-gray-400">
          AI Prompt Security & Monitoring Platform
        </p>
        {userEmail && (
          <div className="absolute top-2 right-6 text-sm text-gray-300">
            Hola, <span className="font-semibold">{userEmail}</span>
          </div>
        )}
        <button
          onClick={onLogout}
          className="absolute top-2 left-6 text-sm text-red-400 hover:underline"
        >
          Logout
        </button>
      </header>

      <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Prompt Scanner</h2>
        <textarea
          className="w-full min-h-[120px] bg-gray-800 p-4 rounded text-white mb-4"
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          onClick={analyzePrompt}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Prompt"}
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Risk Summary</h2>
        <div className="text-sm text-gray-300">
          {!result && "No prompt analyzed yet."}
          {result?.error && <p className="text-red-500">{result.error}</p>}
          {result && !result.error && (
            <>
              <p><strong>Risk Level:</strong> {result.risk_level}</p>
              <p><strong>Detected Issues:</strong> {result.detected_issues.length > 0 ? result.detected_issues.join(", ") : "None"}</p>
              <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
            </>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Analysis History</h2>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search prompt text..."
            className="bg-gray-800 text-white px-3 py-2 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-gray-800 text-white px-3 py-2 rounded"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredHistory.length === 0 && <p className="text-gray-500">No matching results.</p>}
          {filteredHistory.map((entry) => (
            <div key={entry.id} className="bg-gray-800 p-4 rounded shadow text-sm">
              <p className="text-gray-400 text-xs mb-1">
                {new Date(entry.timestamp).toLocaleString()} - <span className="uppercase font-semibold">{entry.risk_level}</span>
              </p>
              <p className="text-gray-200"><strong>Prompt:</strong> {entry.prompt}</p>
              <p className="text-gray-400"><strong>Issues:</strong> {entry.detected_issues.join(", ") || "None"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
