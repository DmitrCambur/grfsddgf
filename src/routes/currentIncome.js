const express = require("express");
const router = express.Router();
const CurrentIncome = require("../models/CurrentIncomes");
const mongoose = require("mongoose");

// Create a new current income for a user (salary, monthly, auto dates)
router.post("/:userId", async (req, res) => {
  try {
    const { amount, month_id } = req.body;
    if (!month_id) {
      return res.status(400).json({ error: "month_id is required" });
    }
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const income = await CurrentIncome.create({
      user_id: req.params.userId,
      month_id,
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

// Get all current incomes for a user, optionally filter by month_id
router.get("/user/:userId", async (req, res) => {
  const { month_id } = req.query;
  const filter = { user_id: req.params.userId };
  if (month_id) filter.month_id = month_id;
  const incomes = await CurrentIncome.find(filter);
  res.json(incomes);
});

module.exports = router;
