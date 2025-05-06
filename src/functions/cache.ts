import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getCacheCollection } from "../utils/mongo";

/**
 * Get a value from the cache
 * @param req - The HTTP request
 * @param context - The invocation context
 * @returns The HTTP response
 */
async function getValue(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const key = req.params.key;
  let client = null;

  context.log(`Getting value for key: ${key}`);

  try {
    const { cacheCollection, client: mongoClient } = await getCacheCollection();
    client = mongoClient;
    const doc = await cacheCollection.findOne({ key });

    if (!doc) {
      return {
        status: 404,
        body: "Key not found",
      };
    }

    return {
      status: 200,
      body: doc.value,
    };
  } catch (error) {
    context.error(`Error getting value for key ${key}: ${error.message}`);
    return {
      status: 500,
      body: `Internal server error`,
    };
  } finally {
    // Close the MongoDB connection
    if (client) {
      try {
        await client.close();
      } catch (err) {
        context.error(`Error closing MongoDB connection: ${err.message}`);
      }
    }
  }
}

/**
 * Put a value into the cache
 * @param req - The HTTP request
 * @param context - The invocation context
 * @returns The HTTP response
 */
async function putValue(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const key = req.params.key;
  const value = await req.text();
  let client = null;

  context.log(`Putting value for key: ${key} with value: ${value}`);

  try {
    const { cacheCollection, client: mongoClient } = await getCacheCollection();
    client = mongoClient;
    await cacheCollection.updateOne(
      { key },
      { $set: { value } },
      { upsert: true }
    );

    return {
      status: 200,
      body: "Value put successfully",
    };
  } catch (error) {
    context.error(`Error putting value for key ${key}: ${error.message}`);
    return {
      status: 500,
      body: `Internal server error`,
    };
  } finally {
    // Close the MongoDB connection
    if (client) {
      try {
        await client.close();
      } catch (err) {
        context.error(`Error closing MongoDB connection: ${err.message}`);
      }
    }
  }
}

/**
 * Delete a value from the cache
 * @param req - The HTTP request
 * @param context - The invocation context
 * @returns The HTTP response
 */
async function deleteValue(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const key = req.params.key;
  let client = null;

  context.log(`Deleting value for key: ${key}`);

  try {
    const { cacheCollection, client: mongoClient } = await getCacheCollection();
    client = mongoClient;
    const result = await cacheCollection.deleteOne({ key });

    if (result.deletedCount === 0) {
      return {
        status: 404,
        body: "Key not found",
      };
    }

    return {
      status: 200,
      body: "Value deleted successfully",
    };
  } catch (error) {
    context.error(`Error deleting value for key ${key}: ${error.message}`);
    return {
      status: 500,
      body: `Internal server error`,
    };
  } finally {
    // Close the MongoDB connection
    if (client) {
      try {
        await client.close();
      } catch (err) {
        context.error(`Error closing MongoDB connection: ${err.message}`);
      }
    }
  }
}

/**
 * Get all keys from the cache
 * @param req - The HTTP request
 * @param context - The invocation context
 * @returns The HTTP response
 */
async function getAllKeys(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  let client = null;

  context.log(`Getting all cache keys`);

  try {
    const { cacheCollection, client: mongoClient } = await getCacheCollection();
    client = mongoClient;

    // Find all documents but only return the key field
    const keys = await cacheCollection
      .find({})
      .project({ key: 1, _id: 0 })
      .toArray();

    return {
      status: 200,
      jsonBody: keys.map((doc) => doc.key),
    };
  } catch (error) {
    context.error(`Error getting all keys: ${error.message}`);
    return {
      status: 500,
      body: `Internal server error`,
    };
  } finally {
    // Close the MongoDB connection
    if (client) {
      try {
        await client.close();
      } catch (err) {
        context.error(`Error closing MongoDB connection: ${err.message}`);
      }
    }
  }
}

// Register HTTP functions
app.http("getValue", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "cache/{key}",
  handler: getValue,
});

app.http("putValue", {
  methods: ["PUT", "POST"],
  authLevel: "anonymous",
  route: "cache/{key}",
  handler: putValue,
});

app.http("deleteValue", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "cache/{key}",
  handler: deleteValue,
});

app.http("getAllKeys", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "cache/keys",
  handler: getAllKeys,
});
