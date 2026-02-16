import mongoose from "mongoose";

const buildUris = () => {
  const uris = [];

  if (process.env.MONGO_URI) {
    uris.push(process.env.MONGO_URI);
  }

  if (process.env.MONGO_URI_FALLBACK) {
    uris.push(process.env.MONGO_URI_FALLBACK);
  }

  const localDefault = "mongodb://127.0.0.1:27017/istore";
  if (!uris.includes(localDefault)) {
    uris.push(localDefault);
  }

  return uris;
};

export const connectDB = async () => {
  const uris = buildUris();
  let lastError = null;

  for (const uri of uris) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 7000
      });

      console.log(`MongoDB connected (${uri.includes("127.0.0.1") ? "local" : "primary"})`);
      return;
    } catch (err) {
      lastError = err;
      console.error(`MongoDB connection failed for ${uri}: ${err.message}`);
    }
  }

  throw lastError || new Error("Unable to connect to MongoDB");
};
