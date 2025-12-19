import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <span>💰</span>
          <NavLink to="/dashboard">Expense Tracker</NavLink>
        </div>
        <div className="navbar-links">
          <NavLink to="/dashboard">📊 Dashboard</NavLink>
          <NavLink to="/expenses">💵 Expenses</NavLink>
          <NavLink to="/categories">🏷️ Categories</NavLink>
          <NavLink to="/predict">🤖 AI Predict</NavLink>
          <button onClick={logout} className="logout-btn">
            Logout →
          </button>
        </div>
      </div>
    </nav>
  );
}