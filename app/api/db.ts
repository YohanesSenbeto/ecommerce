// api/db.ts
import { MongoClient, Db, ServerApiVersion } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDb() {
  if (cachedClient && cachedDb) {
    console.log("✅ Using cached MongoDB client and database");
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.DATABASE_URL;
  const dbName = process.env.MONGODB_DB || "Ecommerce-nextjs";

  if (!uri) throw new Error("❌ DATABASE_URL not defined in .env.local");

  console.log("🔌 Connecting to MongoDB...");

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    tls: true,               // Use TLS if your MongoDB requires SSL
    // tlsAllowInvalidCertificates: true, // optionally for local dev with self-signed certs (NOT recommended in prod)
  });

  try {
    await client.connect();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err; // throw to propagate error
  }

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  if (process.env.NODE_ENV === "development") {
    console.log("✅ MongoDB connected to DB:", db.databaseName);
  }

  return { client, db };
}

export type { Db };
