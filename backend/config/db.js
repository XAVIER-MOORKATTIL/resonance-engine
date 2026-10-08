const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`⚡ [RESONANCE COIL]: Connected to MongoDB Atlas Cloud: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [ELECTRICAL DISCHARGE ERROR]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;