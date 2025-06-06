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

router.post("/get-or-create", async (req, res) => {
  const { userId, month, year } = req.body;
  let doc = await Month.findOne({ userId, month, year });
  if (!doc) {
    doc = await Month.create({ userId, month, year });
  }
  res.json(doc);
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
