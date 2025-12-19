import Category from "../models/Category.js";
import Expense from "../models/Expense.js";

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ userId, name });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = new Category({
      userId,
      name,
    });

    await category.save();

    res.status(201).json({
      message: "Category created successfully",
      category: { ...category.toObject(), _id: category._id.toString() },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;

    const categories = await Category.find({ userId }).sort({ createdAt: -1 });

    // Get expense count for each category
    const expenses = await Expense.find({ userId });

    const categoriesWithCount = categories.map((cat) => {
      const expenseCount = expenses.filter(
        (exp) => exp.category === cat.name
      ).length;

      return {
        ...cat.toObject(),
        expenseCount,
      };
    });

    res.json(categoriesWithCount);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name: newName } = req.body;
    const userId = req.user.userId;

    if (!newName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Get old category
    const oldCategory = await Category.findById(id);
    
    if (!oldCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    if (oldCategory.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const oldName = oldCategory.name;

    // Check if new name already exists
    const existingCategory = await Category.findOne({ userId, name: newName });

    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    // Update category
    oldCategory.name = newName;
    await oldCategory.save();

    // CASCADE UPDATE: Update all expenses with this category
    const updateResult = await Expense.updateMany(
      { userId, category: oldName },
      { $set: { category: newName } }
    );

    console.log(`Cascading update: ${updateResult.modifiedCount} expenses updated from "${oldName}" to "${newName}"`);

    res.json({
      message: "Category updated successfully",
      category: { ...oldCategory.toObject(), _id: id },
      expensesUpdated: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // CHECK CASCADE: Check if category is used in expenses
    const expenseCount = await Expense.countDocuments({ userId, category: category.name });

    if (expenseCount > 0) {
      return res.status(400).json({
        error: `Cannot delete category "${category.name}". It is used in ${expenseCount} expense(s). Please reassign or delete those expenses first.`,
        expenseCount: expenseCount,
      });
    }

    // Delete category
    await category.deleteOne();

    res.json({ 
      message: "Category deleted successfully",
      category: category.name 
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
