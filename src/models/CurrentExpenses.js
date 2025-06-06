// models/CurrentExpense.js
const mongoose = require("mongoose");

const CurrentExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  category: { type: String, default: "expenses" },
  isSubscription: { type: Boolean, default: false },
  amount: { type: Number, required: true },
  recurs: { type: Boolean, default: false },
  interval: { type: String, default: "monthly" },
  started_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CurrentExpense", CurrentExpenseSchema);
