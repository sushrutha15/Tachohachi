const mongoose = require("mongoose");
require("dotenv").config();

console.log("🧪 Testing MongoDB connection...");
console.log("Connection string exists:", !!process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    console.log("📊 Database:", mongoose.connection.name);
    console.log("🌐 Host:", mongoose.connection.host);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:");
    console.error("Error:", error.message);
    console.error("Connection string:", process.env.MONGODB_URI?.substring(0, 50) + "...");
    process.exit(1);
  });
