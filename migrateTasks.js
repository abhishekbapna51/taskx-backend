const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Task = require("./models/Task");

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔄 Starting migration...");

    const result = await Task.updateMany(
      { user: { $exists: false }, userId: { $exists: true } },
      [{ $set: { user: "$userId" } }] // Set 'user' to value of 'userId'
    );

    console.log(`✅ Migration complete. Modified ${result.modifiedCount} document(s).`);

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Migration error:", err);
    await mongoose.disconnect();
  }
})();
