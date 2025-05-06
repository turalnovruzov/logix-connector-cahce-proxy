import { MongoClient, Collection } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

let client: MongoClient;
let cacheCollection: Collection;

export async function getCacheCollection() {
  try {
    if (!uri) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    if (!dbName) {
      throw new Error("MONGO_DB environment variable is not set");
    }

    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      const db = client.db(dbName);
      cacheCollection = db.collection("cache");
    }
    return cacheCollection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}
