const express = require("express");
const router = express.Router();
const CurrentIncome = require("../models/CurrentIncomes");

// Create a new current income
router.post("/", async (req, res) => {
  try {
    const income = await CurrentIncome.create(req.body);
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
