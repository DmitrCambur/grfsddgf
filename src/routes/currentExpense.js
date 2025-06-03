const express = require("express");
const router = express.Router();
const CurrentExpense = require("../models/CurrentExpenses");

// Create a new current expense
router.post("/", async (req, res) => {
  try {
    const expense = await CurrentExpense.create(req.body);
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all current expenses for a user
router.get("/user/:userId", async (req, res) => {
  const expenses = await CurrentExpense.find({ user_id: req.params.userId });
  res.json(expenses);
});

module.exports = router;
