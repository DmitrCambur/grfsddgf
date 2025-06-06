const express = require("express");
const router = express.Router();
const Month = require("../models/Month");
const mongoose = require("mongoose");

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
  const filter = { user_id: new mongoose.Types.ObjectId(req.params.userId) };
  if (month) filter.month = month;
  if (year) filter.year = year;
  console.log("Month filter:", filter); // Debug
  const months = await Month.find(filter);
  res.json(months);
});

router.put("/:monthId/saving-percentage", async (req, res) => {
  try {
    const { savingPercentage } = req.body;
    const updated = await Month.findByIdAndUpdate(
      req.params.monthId,
      { savingPercentage },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Month not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
