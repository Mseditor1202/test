import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://webery122:BNmXZidSUpD1RCyx@cluster0.enn79e6.mongodb.net/appDataBase?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Success:Connected to MongoDB");
  } catch (err) {
    console.log("Failure:Connected to MongoDB");
    throw new Error();
  }
};

export default connectDB;
