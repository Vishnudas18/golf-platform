const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.warn('WARNING: MONGO_URI or MONGODB_URI is not defined. Database functionality will be unavailable.');
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // process.exit(1); // Removed to prevent crashing the Vercel Serverless Function
  }
};

module.exports = connectDB;
