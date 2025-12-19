import Expense from "../models/Expense.js";

export const predictExpense = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log("Fetching expenses for user:", userId);

    const expenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(50);

    console.log("Found expenses:", expenses.length);

    if (expenses.length === 0) {
      return res.status(400).json({ 
        error: "No expense history found. Add some expenses first to get predictions." 
      });
    }

    // Calculate predictions based on historical data
    const categoryTotals = {};
    const categoryCount = {};

    expenses.forEach(expense => {
      const cat = expense.category || "Uncategorized";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + expense.amount;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    // Generate predictions based on averages
    const predictions = Object.keys(categoryTotals).map(category => {
      const avgAmount = Math.round(categoryTotals[category] / categoryCount[category]);
      const predictedAmount = Math.round(avgAmount * 1.1); // Predict 10% increase
      
      return {
        category,
        amount: predictedAmount,
        confidence: categoryCount[category] > 5 ? "high" : categoryCount[category] > 2 ? "medium" : "low"
      };
    });

    const totalPredicted = predictions.reduce((sum, pred) => sum + pred.amount, 0);

    const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    const prediction = {
      predictions,
      totalPredicted,
      insights: `Based on your spending history of ${expenses.length} transactions, your highest expense category is ${topCategory} (₹${Math.round(categoryTotals[topCategory])}). We predict similar patterns next month with a slight increase of 10% across categories.`
    };

    console.log("Prediction generated successfully");
    res.json(prediction);

  } catch (error) {
    console.error("Error predicting expenses:", error.message);
    res.status(500).json({ 
      error: "Failed to generate prediction",
      details: error.message 
    });
  }
};
