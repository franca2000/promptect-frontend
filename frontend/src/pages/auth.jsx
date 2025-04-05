// src/pages/Auth.jsx
import React from "react";
import LoginForm from "../LoginForm";

export default function AuthPage() {
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    window.location.href = "/dashboard"; // o usar useNavigate si querés
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}
