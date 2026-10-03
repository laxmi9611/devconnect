const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      "mongodb+srv://rachottymahalaxmi_db_user:SuojNWBnKxgPfgJj@cluster0.gf8qyxp.mongodb.net/devconnect?retryWrites=true&w=majority";

    console.log("🔍 Connecting to MongoDB...");
    console.log("📍 URI exists:", !!uri);

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;