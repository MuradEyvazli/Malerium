import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo connected");
  } catch (error) {
    throw new Error("Error is connecting");
  }
};

export default dbConnect;