const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");

const { sendReminderEmail } = require("./utils/emailService");
const Task = require("./models/Task");
const User = require("./models/User");

dotenv.config();
console.log("Loaded EMAIL_USER:", process.env.EMAIL_USER ? true : false);
console.log("Loaded EMAIL_PASS:", process.env.EMAIL_PASS ? true : false);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // 🕒 Run every day at 8 AM server time
    cron.schedule("0 8 * * *", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const tasksDue = await Task.find({ dueDate: { $eq: tomorrow } });

      for (const task of tasksDue) {
        const user = await User.findById(task.user);
        if (user?.email) {
          await sendReminderEmail(
  user.email,
  `Task Reminder: ${task.title}`,
  `Your task "${task.title}" is due on ${task.dueDate.toDateString()}`
);

          console.log(`📧 Reminder sent to ${user.email} for task "${task.title}"`);
        }
      }
    });
  })
  .catch((err) => console.log("MongoDB Error:", err));
