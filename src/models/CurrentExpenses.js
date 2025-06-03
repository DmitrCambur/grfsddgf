const mongoose = require("mongoose");

const CurrentExpenseSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  category: String,
  isSubscription: Boolean,
  amount: Number,
  recurs: Boolean,
  interval: String, // 'monthly', 'yearly', etc.
  started_at: Date,
});

module.exports = mongoose.model("currentExpense", CurrentExpenseSchema);
