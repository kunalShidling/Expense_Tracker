import Category from "../models/Category.js";
import Expense from "../models/Expense.js";

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ where: { userId, name } });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await Category.create({
      userId,
      name,
    });

    res.status(201).json({
      message: "Category created successfully",
      category: { ...category.toJSON(), _id: category.id.toString(), id: category.id.toString() },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;

    const categories = await Category.findAll({ 
      where: { userId }, 
      order: [['createdAt', 'DESC']] 
    });

    const expenses = await Expense.findAll({ where: { userId } });

    const categoriesWithCount = categories.map((cat) => {
      const expenseCount = expenses.filter(
        (exp) => exp.category === cat.name
      ).length;

      return {
        ...cat.toJSON(),
        _id: cat.id.toString(),
        id: cat.id.toString(),
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

    const oldCategory = await Category.findByPk(id);
    
    if (!oldCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    if (oldCategory.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const oldName = oldCategory.name;

    const existingCategory = await Category.findOne({ where: { userId, name: newName } });

    if (existingCategory && existingCategory.id.toString() !== id) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    oldCategory.name = newName;
    await oldCategory.save();

    const updateResult = await Expense.update(
      { category: newName },
      { where: { userId, category: oldName } }
    );

    console.log(`Cascading update: ${updateResult[0]} expenses updated from "${oldName}" to "${newName}"`);

    res.json({
      message: "Category updated successfully",
      category: { ...oldCategory.toJSON(), _id: id.toString(), id: id.toString() },
      expensesUpdated: updateResult[0],
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

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const expenseCount = await Expense.count({ where: { userId, category: category.name } });

    if (expenseCount > 0) {
      return res.status(400).json({
        error: `Cannot delete category "${category.name}". It is used in ${expenseCount} expense(s). Please reassign or delete those expenses first.`,
        expenseCount: expenseCount,
      });
    }

    await category.destroy();

    res.json({ 
      message: "Category deleted successfully",
      category: category.name 
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};