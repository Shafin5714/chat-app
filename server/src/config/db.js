import mongoose from 'mongoose';
import 'colors';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}.red.underline.bold`);
    process.exit(1);
  }
};
