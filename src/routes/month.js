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
  let doc = await Month.findOne({ user_id: userId, month, year });
  if (!doc) {
    doc = await Month.create({ user_id: userId, month, year });
  }
  res.json(doc);
});

router.get("/", async (req, res) => {
  const months = await Month.find();
  res.json(months);
});

router.get("/user/:userId", async (req, res) => {
  const { month, year } = req.query;
  const filter = { user_id: req.params.userId };
  if (month) filter.month = month;
  if (year) filter.year = year;
  const months = await Month.find(filter);
  res.json(months);
});

module.exports = router;
