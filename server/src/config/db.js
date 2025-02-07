import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `\n MongoDB Connected!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Error while connecting to databse. ", error.message);
    process.exit(1);
  }
};

export default connectDB;
