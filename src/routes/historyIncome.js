const express = require("express");
const router = express.Router();
const HistoryIncome = require("../models/HistoryIncomes");
const mongoose = require("mongoose");

// Create a new history income
router.post("/", async (req, res) => {
  try {
    const income = await HistoryIncome.create(req.body);
    res.json(income);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all history incomes for a month
router.get("/month/:monthId", async (req, res) => {
  const incomes = await HistoryIncome.find({ month_id: req.params.monthId });
  res.json(incomes);
});

router.get("/user/:userId", async (req, res) => {
  const { month_id } = req.query;
  const filter = { user_id: req.params.userId };
  if (month_id) filter.month_id = month_id;
  const incomes = await HistoryIncome.find(filter);
  res.json(incomes);
});

module.exports = router;
