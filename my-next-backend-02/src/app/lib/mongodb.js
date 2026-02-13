import { MongoClient } from "mongodb";
import mongoose from "mongoose";
let globalClientPromise;

export function getClientPromise() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://nay_db_user:passwordMongoDB123@cluster0.lqqbts6.mongodb.net/?appName=Cluster0";
  if (!process.env.MONGODB_URI) {
    console.warn('[mongodb] MONGODB_URI not set — using embedded default URI (dev only)');
  }

  // Dev-friendly options to avoid TLS problems when connecting to Atlas locally.
  const insecureTls = process.env.MONGO_INSECURE_TLS === '1' || process.env.NODE_ENV !== 'production';
  const options = {
    serverSelectionTimeoutMS: 10000,
    tls: uri.startsWith('mongodb+srv'),
  };
  if (options.tls && insecureTls) {
    console.warn('[mongodb] using insecure TLS (dev). Set MONGO_INSECURE_TLS=0 in production');
    options.tlsAllowInvalidCertificates = true;
  }
  // Attempt connection; for dev try relaxed TLS then local fallback if needed
  async function connectWith(uriToUse, opts) {
    const client = new MongoClient(uriToUse, opts);
    await client.connect();
    return client;
  }

  if (process.env.NODE_ENV === "development") {
    if (!globalClientPromise) {
      globalClientPromise = (async () => {
        try {
          console.log('[mongodb] connecting to', uri);
          const client = await connectWith(uri, options);
          console.log('[mongodb] connected to', uri);
          return client;
        } catch (err) {
          console.error('[mongodb] initial connect failed:', err && err.message ? err.message : err);
          // If using SRV/Atlas, retry with more relaxed TLS options (dev only)
          if (uri.startsWith('mongodb+srv')) {
            try {
              const relaxed = { ...options, tlsAllowInvalidCertificates: true, tlsAllowInvalidHostnames: true };
              console.warn('[mongodb] retrying with relaxed TLS options (dev)');
              const client = await connectWith(uri, relaxed);
              console.log('[mongodb] connected with relaxed TLS options');
              return client;
            } catch (err2) {
              console.error('[mongodb] relaxed TLS connect failed:', err2 && err2.message ? err2.message : err2);
            }
          }
          // Final fallback: attempt local MongoDB
          try {
            const localUri = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017';
            console.warn('[mongodb] attempting local fallback:', localUri);
            const client = await connectWith(localUri, { serverSelectionTimeoutMS: 5000 });
            console.log('[mongodb] connected to local MongoDB', localUri);
            return client;
          } catch (localErr) {
            console.error('[mongodb] local fallback failed:', localErr && localErr.message ? localErr.message : localErr);
            throw new Error('All MongoDB connection attempts failed');
          }
        }
      })();
    }
    return globalClientPromise;
  } else {
    const client = new MongoClient(uri, options);
    return client.connect();
  }
}

// Default helper used by routes that expect a `connectToDatabase()` default export.
// Ensures the native MongoClient connection is established and also connects Mongoose
// so mongoose models (like `src/app/lib/models/User.js`) can be used immediately.
export default async function connectToDatabase() {
  const client = await getClientPromise();
  const uri = process.env.MONGODB_URI || "mongodb+srv://nay_db_user:passwordMongoDB123@cluster0.lqqbts6.mongodb.net/?appName=Cluster0";
  try {
    if (!mongoose?.connection || mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
      console.log('[mongodb] mongoose connected');
    }
  } catch (err) {
    console.error('[mongodb] mongoose connect failed:', err && err.message ? err.message : err);
    throw err;
  }

  return client;
}
