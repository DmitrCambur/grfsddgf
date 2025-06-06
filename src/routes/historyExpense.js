const express = require("express");
const router = express.Router();
const HistoryExpense = require("../models/HistoryExpenses");
const mongoose = require("mongoose");

// Create a new history expense
router.post("/", async (req, res) => {
  try {
    const expense = await HistoryExpense.create(req.body);
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all history expenses for a month
router.get("/month/:monthId", async (req, res) => {
  const expenses = await HistoryExpense.find({ month_id: req.params.monthId });
  res.json(expenses);
});

router.get("/user/:userId", async (req, res) => {
  const { month_id } = req.query;
  const filter = { userId: req.params.userId };
  if (month_id) filter.month_id = month_id;
  const expenses = await HistoryExpense.find(filter);
  res.json(expenses);
});

module.exports = router;
