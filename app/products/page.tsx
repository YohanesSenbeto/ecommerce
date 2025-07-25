// app/products/page.tsx or pages/products.tsx (Next.js)
"use client";

import ProductsList from "../productList";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const productRes = await fetch(`${baseUrl}/api/products`, {
                    cache: "no-cache",
                });

                if (!productRes.ok) {
                    throw new Error(
                        `Failed to fetch products: ${productRes.status}`
                    );
                }

                const productData = await productRes.json();
                setProducts(productData);
            } catch (err: any) {
                console.error("Products error:", err.message);
                setError(err.message);
            }

            try {
                const cartRes = await fetch(`${baseUrl}/api/users/2/cart`, {
                    cache: "no-cache",
                });

                if (!cartRes.ok) {
                    throw new Error(`Failed to fetch cart: ${cartRes.status}`);
                }

                const cartData = await cartRes.json();
                setCartProducts(cartData);
            } catch (err: any) {
                console.error("Cart error:", err.message);
            }

            setLoading(false);
        };

        fetchData();
    }, [baseUrl]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">🛒 Products</h1>

            {products.length > 0 ? (
                <ProductsList
                    products={products}
                    initialCartProducts={cartProducts}
                />
            ) : (
                <p className="text-red-500">
                    No products available or failed to load.
                </p>
            )}
        </div>
    );
}
