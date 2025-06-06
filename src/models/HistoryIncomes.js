const mongoose = require("mongoose");

const HistoryIncomeSchema = new mongoose.Schema({
  month_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Month",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  amount: Number,
  frequency: String,
  started_at: Date,
  ended_at: Date,
});

module.exports = mongoose.model("historyIncome", HistoryIncomeSchema);
