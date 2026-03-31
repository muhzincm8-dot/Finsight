import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables!');
      return;
    }
    // Reuse existing connection on Vercel (serverless warm starts)
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB already connected');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Do NOT call process.exit() on Vercel — it will crash the function
  }
};

export default connectDB;
