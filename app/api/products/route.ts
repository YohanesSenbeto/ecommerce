// app/api/products/route.ts

import { connectToDb } from "../db";

export async function GET() {
  try {
    const { db } = await connectToDb();
    const products = await db.collection("products").find({}).toArray();

    console.log("Fetched products:", products);

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
