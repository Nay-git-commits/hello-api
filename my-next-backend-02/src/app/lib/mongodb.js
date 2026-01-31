import { MongoClient } from "mongodb";
const options = {};
let globalClientPromise;
export function getClientPromise() {
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("mongodb+srv://nay_db_user:passwordMongoDB123@cluster0.lqqbts6.mongodb.net/?appName=Cluster0");
 }
if (process.env.NODE_ENV === "development") {
  if (!globalClientPromise) {
    const client = new MongoClient(uri, options);
    globalClientPromise = client.connect();
  }
  return globalClientPromise;
}else {
  const client = new MongoClient(uri, options);
  return client.connect();
 }
} 