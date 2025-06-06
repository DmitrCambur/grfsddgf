const mongoose = require("mongoose");

const CurrentIncomeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Month",
    required: true,
  },
  title: String,
  amount: Number,
  frequency: String,
  started_at: Date,
  ended_at: Date,
});

module.exports = mongoose.model("currentIncome", CurrentIncomeSchema);
