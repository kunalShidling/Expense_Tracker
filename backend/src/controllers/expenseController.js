import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const userId = req.user.userId;

    if (!amount || !category) {
      return res.status(400).json({ error: "Amount and category are required" });
    }

    const expense = await Expense.create({
      userId,
      amount: parseFloat(amount),
      category,
      description: description || "",
      date: date || new Date(),
    });

    res.status(201).json({ id: expense.id.toString(), _id: expense.id.toString(), ...expense.toJSON() });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Failed to add expense" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const expenses = await Expense.findAll({ 
      where: { userId },
      order: [['date', 'DESC']]
    });

    const serializedExpenses = expenses.map(expense => ({
      ...expense.toJSON(),
      _id: expense.id.toString(),
      id: expense.id.toString()
    }));

    res.json(serializedExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    const userId = req.user.userId;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    if (expense.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (amount !== undefined) expense.amount = parseFloat(amount);
    if (category) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (date) expense.date = date;

    await expense.save();
    res.json({ id: expense.id.toString(), _id: expense.id.toString(), ...expense.toJSON() });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Failed to update expense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    if (expense.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await expense.destroy();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};