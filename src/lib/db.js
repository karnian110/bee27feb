import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global cache to prevent multiple connections during hot reloads
 * and repeated serverless function calls.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  // 1. If already connected, reuse it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. If no connection promise exists, create one
  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      maxPoolSize: 10, // prevent connection explosion
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // reset so future attempts can retry
    throw error;
  }

  return cached.conn;
}

export default dbConnect;