import mongoose from "mongoose";

export const connectMongoDB = async (MONGODB_URI) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  }
  catch (err) {
    console.log("MongoDB Connection Failed: ", err.message);
    process.exit(1);
  }
}