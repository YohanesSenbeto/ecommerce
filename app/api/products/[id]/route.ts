import { NextRequest } from 'next/server';
import { connectToDb } from '../../db'; // adjust if db is not inside /app/api

type Params = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { db } = await connectToDb();
    const productId = params.id;

    const product = await db.collection('products').findOne({ id: productId });

    if (!product) {
      return new Response('Product not found!', {
        status: 404,
      });
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to get product:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
