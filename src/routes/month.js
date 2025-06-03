const express = require("express");
const router = express.Router();
const Month = require("../models/Month");

// Create a new month
router.post("/", async (req, res) => {
  try {
    const month = await Month.create(req.body);
    res.json(month);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all months
router.get("/", async (req, res) => {
  const months = await Month.find();
  res.json(months);
});

// Get months for a specific user
router.get("/user/:userId", async (req, res) => {
  const months = await Month.find({ user_id: req.params.userId });
  res.json(months);
});

module.exports = router;
