// import { useEffect, useState } from "react";
// import { get, del } from "../components/api/apiClient";

// export default function Expenses() {
//   const [list, setList] = useState([]);

//   const load = async () => {
//     const res = await get("/expenses");
//     setList(res);
//   };

//   const remove = async (id) => {
//     await del(`/expenses/${id}`);
//     load();
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <div>
//       <h2>Your Expenses</h2>

//       {list.map(e => (
//         <div key={e._id} style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
//           <p><b>Category:</b> {e.category}</p>
//           <p><b>Amount:</b> ₹{e.amount}</p>
//           <p><b>Note:</b> {e.note}</p>
//           <button onClick={() => remove(e._id)}>Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { get, post, patch, del } from "../components/api/apiClient";
import "../styles/Expenses.css";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      const [expensesData, categoriesData] = await Promise.all([
        get("/expenses"),
        get("/categories"),
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await post("/expenses", {
        amount: parseFloat(amount),
        category,
        date,
        description,
      });
      
      setAmount("");
      setCategory("");
      setDate("");
      setDescription("");
      setSuccess("Expense added successfully!");
      load();
    } catch (err) {
      setError(err.message || "Failed to add expense");
    }
  };

  const startEdit = (expense) => {
    setEditId(expense._id);
    setEditData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async (id) => {
    setError("");
    setSuccess("");

    try {
      await patch(`/expenses/${id}`, {
        amount: parseFloat(editData.amount),
        category: editData.category,
        date: editData.date,
        description: editData.description,
      });

      setEditId(null);
      setEditData({});
      setSuccess("Expense updated successfully!");
      load();
    } catch (err) {
      setError(err.message || "Failed to update expense");
    }
  };

  const remove = async (id, amount) => {
    if (!window.confirm(`Delete expense of ₹${amount}?`)) return;

    setError("");
    setSuccess("");

    try {
      await del(`/expenses/${id}`);
      setSuccess("Expense deleted successfully!");
      load();
    } catch (err) {
      setError(err.message || "Failed to delete expense");
    }
  };

  return (
    <div className="expenses-container">
      <h2>Manage Expenses</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={add} className="expense-form">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          step="0.01"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
        <button type="submit">Add Expense</button>
      </form>

      <div className="expenses-list">
        {expenses.length === 0 ? (
          <p className="no-data">No expenses yet. Add one above!</p>
        ) : (
          expenses.map((exp) => (
            <div key={exp._id} className="expense-item">
              {editId === exp._id ? (
                <div className="edit-mode">
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) =>
                      setEditData({ ...editData, amount: e.target.value })
                    }
                    step="0.01"
                  />
                  <select
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value })
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    placeholder="Description"
                  />
                  <button onClick={() => saveEdit(exp._id)} className="save-btn">
                    Save
                  </button>
                  <button onClick={cancelEdit} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="view-mode">
                  <div className="expense-info">
                    <span className="expense-amount">₹{exp.amount}</span>
                    <span className="expense-category">{exp.category}</span>
                    <span className="expense-date">{exp.date}</span>
                    {exp.description && (
                      <span className="expense-description">{exp.description}</span>
                    )}
                  </div>
                  <div className="expense-actions">
                    <button onClick={() => startEdit(exp)} className="edit-btn">
                      Edit
                    </button>
                    <button
                      onClick={() => remove(exp._id, exp.amount)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}