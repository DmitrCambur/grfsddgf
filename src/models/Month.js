const mongoose = require("mongoose");

const MonthSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: String,
  year: String,
  status: String,
  savingPercentage: Number,
});

module.exports = mongoose.model("Month", MonthSchema);
