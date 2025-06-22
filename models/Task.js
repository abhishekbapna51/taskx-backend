const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Todo", "In Progress", "Done"], default: "Todo" },
  dueDate: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ use 'user' not 'userId'
}, {
  timestamps: true,
});

module.exports = mongoose.model("Task", taskSchema);
