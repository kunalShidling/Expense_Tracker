import { useState } from "react";
import { post } from "../components/api/apiClient";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { token } = await post("/auth/login", { email, password });
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    } catch (error) {
      setErr(error.message || "Login failed");
    }
  };

  const signup = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await post("/auth/signup", { email, password });
      const { token } = await post("/auth/login", { email, password });
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    } catch (error) {
      setErr(error.message || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>💰 Expense Tracker</h1>
          <p>Manage your finances with ease</p>
        </div>

        {err && <div className="error-message">{err}</div>}

        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" onClick={login} className="btn btn-primary">
              Login
            </button>
            <button type="button" onClick={signup} className="btn btn-secondary">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}