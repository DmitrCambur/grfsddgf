const express = require("express");
const router = express.Router();
const CurrentExpense = require("../models/CurrentExpenses");

// Create a new current expense
router.post("/", async (req, res) => {
  try {
    const { userId, expenses } = req.body;
    if (!userId || !Array.isArray(expenses)) {
      return res
        .status(400)
        .json({ error: "userId and expenses array required" });
    }
    const docs = expenses.map((exp) => ({
      ...exp,
      userId,
      category: "expenses",
      started_at: exp.started_at || new Date(),
    }));
    const saved = await CurrentExpense.insertMany(docs);
    res.json(saved);
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
