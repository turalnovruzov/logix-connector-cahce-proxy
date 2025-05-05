import { MongoClient, Collection } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

let client: MongoClient;
let cacheCollection: Collection;

export async function getCacheCollection() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    cacheCollection = db.collection("cache");
  }
  return cacheCollection;
}
