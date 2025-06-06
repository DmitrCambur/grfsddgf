const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Month = require("../models/Month");
const CurrentIncome = require("../models/CurrentIncomes");
const CurrentExpense = require("../models/CurrentExpenses");
const HistoryIncome = require("../models/HistoryIncomes");
const HistoryExpense = require("../models/HistoryExpenses");

function getMonthLabel(month, year) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[parseInt(month, 10) - 1]} '${year.toString().slice(-2)}`;
}

async function getUserMonths(userId) {
  return Month.find({ user_id: userId }).sort({ year: 1, month: 1 }).lean();
}

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Optionally, don't return the password
    const userObj = user.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Optionally, don't return the password
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(userObj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:userId/saving-percentage", async (req, res) => {
  try {
    const { percentage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { currentSavingPercentage: percentage },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:userId/savings-history", async (req, res) => {
  try {
    const userId = req.params.userId;
    const months = await getUserMonths(userId);

    // Get all incomes and expenses for these months
    const monthIds = months.map((m) => m._id);

    // Get all incomes and expenses (current + history)
    const [incomes, historyIncomes, expenses, historyExpenses] =
      await Promise.all([
        CurrentIncome.find({
          user_id: userId,
          month_id: { $in: monthIds },
        }).lean(),
        HistoryIncome.find({
          user_id: userId,
          month_id: { $in: monthIds },
        }).lean(),
        CurrentExpense.find({
          userId: userId,
          month_id: { $in: monthIds },
        }).lean(),
        HistoryExpense.find({
          userId: userId,
          month_id: { $in: monthIds },
        }).lean(),
      ]);

    // Combine all incomes and expenses by month_id
    const incomeByMonth = {};
    [...incomes, ...historyIncomes].forEach((i) => {
      const key = i.month_id.toString();
      incomeByMonth[key] = (incomeByMonth[key] || 0) + (i.amount || 0);
    });

    const expenseByMonth = {};
    [...expenses, ...historyExpenses].forEach((e) => {
      const key = e.month_id.toString();
      expenseByMonth[key] = (expenseByMonth[key] || 0) + (e.amount || 0);
    });

    // Calculate savings per month
    const savingsHistory = [];
    const monthLabels = [];
    let total = 0;

    months.forEach((m) => {
      const monthId = m._id.toString();
      const income = incomeByMonth[monthId] || 0;
      const expense = expenseByMonth[monthId] || 0;
      const saved = income - expense;
      savingsHistory.push(saved);
      monthLabels.push(getMonthLabel(m.month, m.year));
      total += saved;
    });

    // Helper to get last N months
    function lastN(n) {
      return {
        history: savingsHistory.slice(-n),
        months: monthLabels.slice(-n),
      };
    }

    // Build the response
    res.json({
      total,
      history: {
        "6m": lastN(6),
        "1y": lastN(12),
        "2y": lastN(24),
        "3y": lastN(36),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate savings history" });
  }
});

module.exports = router;
