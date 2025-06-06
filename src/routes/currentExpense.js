const express = require("express");
const router = express.Router();
const CurrentExpense = require("../models/CurrentExpenses");
const mongoose = require("mongoose");

// Create a new current expense
router.post("/", async (req, res) => {
  try {
    const { userId, expenses, month_id } = req.body;
    if (!userId || !Array.isArray(expenses) || !month_id) {
      return res
        .status(400)
        .json({ error: "userId, month_id, and expenses array required" });
    }
    const docs = expenses.map((exp) => ({
      ...exp,
      userId,
      month_id,
      category: "expenses",
      started_at: exp.started_at || new Date(),
    }));
    const saved = await CurrentExpense.insertMany(docs);
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all current expenses for a user, optionally filter by month_id
router.get("/user/:userId", async (req, res) => {
  const { month_id } = req.query;
  const filter = { userId: req.params.userId };
  if (month_id) filter.month_id = month_id;
  const expenses = await CurrentExpense.find(filter);
  res.json(expenses);
});

router.delete("/:expenseId", async (req, res) => {
  try {
    const deleted = await CurrentExpense.findByIdAndDelete(
      req.params.expenseId
    );
    if (!deleted) return res.status(404).json({ error: "Expense not found" });
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
