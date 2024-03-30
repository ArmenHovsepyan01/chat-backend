import mongoose from 'mongoose';

async function connectDB() {
  try {
    const url = process.env.MONGO_URI || '';
    await mongoose.connect(url);
    console.log(`Connected to database successfully.`);
  } catch (err) {
    throw new Error(err);
  }
}

export default connectDB;
