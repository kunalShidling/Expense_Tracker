import { useEffect, useState } from "react";
import { get } from "../components/api/apiClient";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total: 0,
    last7days: 0,
    avgWeek: 0,
  });

  const load = async () => {
    try {
      const data = await get("/expenses");
      setExpenses(data);
      calculateSummary(data);
      calculateCategoryTotals(data);
      calculateMonthlyTotals(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (list) => {
    const total = list.reduce((sum, e) => sum + Number(e.amount), 0);

    // last 7 days
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const last7 = list
      .filter((e) => new Date(e.date || e.createdAt).getTime() >= weekAgo)
      .reduce((s, e) => s + Number(e.amount), 0);

    setSummary({
      total,
      last7days: last7,
      avgWeek: Math.round(total / 4),
    });
  };

  const calculateCategoryTotals = (list) => {
    const totals = {};
    list.forEach((e) => {
      if (!totals[e.category]) totals[e.category] = 0;
      totals[e.category] += Number(e.amount);
    });
    setCategoryTotals(totals);
  };

  const calculateMonthlyTotals = (list) => {
    const months = {};
    list.forEach((e) => {
      const date = new Date(e.date || e.createdAt);
      const label = date.toLocaleString("default", { month: "short" });

      if (!months[label]) months[label] = 0;
      months[label] += Number(e.amount);
    });

    setMonthlyTotals(months);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back! 👋</h1>
        <p>Here's your financial overview</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">₹{summary.total.toFixed(2)}</div>
          <div className="stat-trend">
            <span>📈</span> Track your spending
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">📊</div>
          </div>
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-trend">
            <span>✨</span> Keep it up!
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">📉</div>
          </div>
          <div className="stat-label">Last 7 Days</div>
          <div className="stat-value">₹{summary.last7days.toFixed(2)}</div>
          <div className="stat-trend">
            <span>💡</span> Recent spending
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">🏷️</div>
          </div>
          <div className="stat-label">Categories</div>
          <div className="stat-value">{Object.keys(categoryTotals).length}</div>
          <div className="stat-trend">
            <span>🎯</span> Active categories
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>📊 Expenses by Category</h3>
          {Object.keys(categoryTotals).length > 0 ? (
            <CategoryPieChart data={categoryTotals} />
          ) : (
            <div className="no-data">
              <div className="no-data-icon">📊</div>
              <p>No category data yet</p>
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3>📈 Monthly Trends</h3>
          {Object.keys(monthlyTotals).length > 0 ? (
            <MonthlyBarChart monthlyTotals={monthlyTotals} />
          ) : (
            <div className="no-data">
              <div className="no-data-icon">📈</div>
              <p>No monthly data yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="recent-expenses">
        <h3>🕒 Recent Expenses</h3>
        {recentExpenses.length > 0 ? (
          <div className="expense-list">
            {recentExpenses.map((exp) => (
              <div key={exp._id} className="expense-item-dash">
                <div className="expense-info-dash">
                  <span className="expense-category-dash">{exp.category}</span>
                  <span className="expense-date-dash">{exp.date || exp.createdAt}</span>
                </div>
                <div className="expense-amount-dash">₹{exp.amount}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">💸</div>
            <p>No expenses yet</p>
            <small>Add your first expense to get started</small>
          </div>
        )}
      </div>
    </div>
  );
}