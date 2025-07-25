import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/app/api/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // params is a Promise
) {
  try {
    const resolvedParams = await params;  // Await the params
    const productId = resolvedParams.id;

    const { db } = await connectToDb();

    const product = await db.collection('products').findOne({ id: productId });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
