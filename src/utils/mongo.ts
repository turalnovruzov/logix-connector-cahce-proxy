import { MongoClient, Collection } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

export async function getCacheCollection() {
  try {
    if (!uri) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    if (!dbName) {
      throw new Error("MONGO_DB environment variable is not set");
    }

    // Create a new client for each operation
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const cacheCollection = db.collection("cache");

    // Return both the collection and client so we can close it later
    return { cacheCollection, client };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}
