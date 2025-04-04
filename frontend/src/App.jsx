// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import Scanner from "./Scanner";
import Landing from "./pages/Landing";

export default function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("jwt");
    if (stored) {
      setToken(stored);
      navigate("/app");
    }
  }, [navigate]);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem("jwt", token);
    navigate("/app");
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("jwt");
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/app"
        element={token ? <Scanner token={token} onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
      />
    </Routes>
  );
}
