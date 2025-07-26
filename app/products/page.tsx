"use client";

import ProductsList from "../productList";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cartProducts, setCartProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const productRes = await fetch(`${baseUrl}/api/products`, {
                    cache: "no-cache",
                });

                if (!productRes.ok) {
                    const errorText = await productRes.text();
                    throw new Error(
                        `Failed to fetch products: ${productRes.status} ${errorText}`
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
                    const errorText = await cartRes.text();
                    throw new Error(
                        `Failed to fetch cart: ${cartRes.status} ${errorText}`
                    );
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
