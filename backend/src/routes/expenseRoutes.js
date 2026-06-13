

import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth, addExpense);
router.get("/", auth, getExpenses);
router.patch("/:id", auth, updateExpense);
router.delete("/:id", auth, deleteExpense);

export default router;