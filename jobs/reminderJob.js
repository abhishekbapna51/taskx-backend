require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Task = require("../models/Task");
const User = require("../models/User");
const sendReminderEmail = require("../utils/emailService");




(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔁 Running email reminder job...");

    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    console.log(`🕒 Time window: ${now.toISOString()} → ${next24h.toISOString()}`);

    // 🔍 Find tasks due in next 24h, and populate user info
    const tasks = await Task.find({
      dueDate: { $gte: now, $lte: next24h },
      status: { $ne: "Done" },
    }).populate("user"); // ✅ Populates the user field

    console.log(`📌 ${tasks.length} task(s) found due in next 24h`);

    for (const task of tasks) {
      const user = task.user;

      if (!user || !user.email) {
        console.log(`⚠️ No email found for task "${task.title}" (user: ${user?._id || "undefined"})`);
        continue;
      }

      const subject = `🔔 Reminder: "${task.title}" is due soon!`;
      const text = `Hello ${user.name},\n\nThis is a reminder that your task "${task.title}" is due on ${new Date(task.dueDate).toDateString()}.\n\n– TaskX Pro`;

      console.log(`📧 Sending reminder to ${user.email} for task: "${task.title}"`);
      await sendReminderEmail(user.email, subject, text);
    }

    console.log("✅ Reminder job finished");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error in reminder job:", err);
    await mongoose.disconnect();
  }
})();