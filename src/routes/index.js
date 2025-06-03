const express = require("express");
const router = express.Router();
const { IndexController } = require("../controllers/index");
const mongoose = require("mongoose");

const indexController = new IndexController();

router.get("/", (req, res) => indexController.getIndex(req, res));

// Health check route
router.get("/health", (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({ mongoConnected: state === 1 });
});

module.exports = router;
