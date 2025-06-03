const mongoose = require("mongoose");

const HistoryExpenseSchema = new mongoose.Schema({
  month_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Month",
    required: true,
  },
  title: String,
  category: String,
  isSubscription: Boolean,
  amount: Number,
  recurs: Boolean,
  interval: String,
  started_at: Date,
});

module.exports = mongoose.model("historyExpense", HistoryExpenseSchema);
