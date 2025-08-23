import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("❌ MONGODB_URI is not set");

  cached.promise = mongoose
  .connect(uri, {
    dbName: process.env.DB_NAME || "appDataBase",
    bufferCommands: false,
  })
  .then((m) => m);
}
cached.conn = await cached.promise;
console.log("✅ Success: Connected to MongoDB");
return cached.conn;
};

export default connectDB;