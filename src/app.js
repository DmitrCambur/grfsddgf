const express = require("express");
const connectDB = require("./db");
const userRoutes = require("./routes/user");
const monthRoutes = require("./routes/month");
const currentExpenseRoutes = require("./routes/currentExpense");
const currentIncomeRoutes = require("./routes/currentIncome");
const historyExpenseRoutes = require("./routes/historyExpense");
const historyIncomeRoutes = require("./routes/historyIncome");
const indexRoutes = require("./routes/index");
const cors = require("cors");

const app = express();
app.use(express.json());

connectDB();

app.use(cors());
app.use("/", indexRoutes);
app.use("/api/users", userRoutes);
app.use("/api/months", monthRoutes);
app.use("/api/current-expenses", currentExpenseRoutes);
app.use("/api/current-incomes", currentIncomeRoutes);
app.use("/api/history-expenses", historyExpenseRoutes);
app.use("/api/history-incomes", historyIncomeRoutes);

module.exports = app;
