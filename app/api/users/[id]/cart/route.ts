// /app/api/users/[id]/cart/route.ts
import { NextResponse } from "next/server";

// Simulated in-memory cart data (replace with your DB calls)
const carts: Record<string, Array<{ productId: string; name: string; price: number; quantity: number }>> = {
  "2": [
    { productId: "1", name: "Product 1", price: 10, quantity: 1 },
    { productId: "3", name: "Product 3", price: 15, quantity: 2 },
  ],
};

// GET /api/users/:id/cart
export async function GET(
  _request: Request,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const cart = carts[userId] || [];
  return NextResponse.json(cart);
}

// POST /api/users/:id/cart
// Adds a product or increases quantity in cart
export async function POST(
  request: Request,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.productId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid productId in request body" },
      { status: 400 }
    );
  }

  const productId = body.productId;
  if (!carts[userId]) carts[userId] = [];

  // Find product in user's cart
  const productInCart = carts[userId].find((p) => p.productId === productId);

  if (productInCart) {
    productInCart.quantity += 1; // Increase quantity
  } else {
    // Add new product - you might fetch product details from DB here
    carts[userId].push({
      productId,
      name: `Product ${productId}`,
      price: 10,
      quantity: 1,
    });
  }

  return NextResponse.json(carts[userId]);
}

// DELETE /api/users/:id/cart?productId=...
// Remove a product from cart
export async function DELETE(
  request: Request,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "Missing productId in query parameters" },
      { status: 400 }
    );
  }

  if (!carts[userId]) {
    return NextResponse.json([], { status: 200 }); // Empty cart
  }

  carts[userId] = carts[userId].filter((p) => p.productId !== productId);

  return NextResponse.json(carts[userId]);
}
