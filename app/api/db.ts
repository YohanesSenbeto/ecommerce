import { MongoClient, Db, ServerApiVersion } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDb() {
  // If cached connection exists, return it immediately
  if (cachedClient && cachedDb) {
    console.log("✅ Using cached MongoDB client and database");
    return { client: cachedClient, db: cachedDb };
  }

  // Read connection URI and DB name from environment variables
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "Ecommerce-nextjs";

  if (!uri) throw new Error("❌ MONGODB_URI not defined in .env.local");

  console.log("🔌 Connecting to MongoDB...");
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  // Connect to MongoDB server
  await client.connect();

  // Select database by name
  const db = client.db(dbName);

  // Cache client and db for future reuse
  cachedClient = client;
  cachedDb = db;

  if (process.env.NODE_ENV === "development") {
    console.log("✅ MongoDB connected to DB:", db.databaseName);
  }

  return { client, db };
}

// Export Db type for TypeScript
export type { Db };
