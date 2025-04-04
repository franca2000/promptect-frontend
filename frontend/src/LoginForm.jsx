// src/LoginForm.jsx
import React, { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const url = isRegister
      ? "http://localhost:8000/register"
      : "http://localhost:8000/login";

    const body = isRegister
      ? JSON.stringify({ email, password })
      : new URLSearchParams({ username: email, password });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": isRegister
            ? "application/json"
            : "application/x-www-form-urlencoded",
        },
        body,
      });

      const data = await res.json();
      if (res.ok && data.access_token) {
        setMessage(isRegister ? "Account created successfully!" : "Login successful!");
        setTimeout(() => onLogin(data.access_token), 1000);
      } else {
        setError(data.detail || "Authentication failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-xl text-white mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isRegister ? "Create Account" : "Log In"}
      </h2>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="bg-gray-800 p-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          className="bg-gray-800 p-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : isRegister ? "Register" : "Login"}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}
      </form>
      <div className="text-center mt-4">
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
            setMessage(null);
          }}
          className="text-sm text-gray-400 hover:underline"
        >
          {isRegister ? "Already have an account? Log in" : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}