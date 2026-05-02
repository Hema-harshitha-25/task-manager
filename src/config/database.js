const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}`;

    console.log("Connecting with URI:", uri); // DEBUG

    await mongoose.connect(uri);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;