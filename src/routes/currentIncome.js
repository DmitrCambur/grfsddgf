const express = require("express");
const router = express.Router();
const CurrentIncome = require("../models/CurrentIncomes");

// Create a new current income for a user (salary, monthly, auto dates)
router.post("/:userId", async (req, res) => {
  try {
    const { amount } = req.body;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const income = await CurrentIncome.create({
      user_id: req.params.userId,
      title: "salary",
      amount,
      frequency: "monthly",
      started_at: startOfMonth,
      ended_at: endOfMonth,
    });
    res.json(income);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all current incomes for a user
router.get("/user/:userId", async (req, res) => {
  const incomes = await CurrentIncome.find({ user_id: req.params.userId });
  res.json(incomes);
});

module.exports = router;
