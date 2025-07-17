// app/products/ProductsList.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "./product-data";

export default function ProductsList({
    products = [],
    initialCartProducts = [],
}: {
    products?: Product[];
    initialCartProducts?: Product[];
}) {
    const [cartProducts, setCartProducts] = useState(initialCartProducts);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    async function addToCart(productId: string) {
        try {
            setLoadingIds((ids) => [...ids, productId]);
            const response = await fetch(`${baseUrl}/api/users/2/cart`, {
                method: "POST",
                body: JSON.stringify({ productId }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const updatedCartProducts = await response.json();
            setCartProducts(updatedCartProducts);
        } catch (err) {
            console.error("Failed to add to cart", err);
        } finally {
            setLoadingIds((ids) => ids.filter((id) => id !== productId));
        }
    }

    async function removeFromCart(productId: string) {
        try {
            setLoadingIds((ids) => [...ids, productId]);
            const response = await fetch(`${baseUrl}/api/users/2/cart`, {
                method: "DELETE",
                body: JSON.stringify({ productId }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const updatedCartProducts = await response.json();
            setCartProducts(updatedCartProducts);
        } catch (err) {
            console.error("Failed to remove from cart", err);
        } finally {
            setLoadingIds((ids) => ids.filter((id) => id !== productId));
        }
    }

    function productIsInCart(productId: string) {
        return cartProducts.some((cp) => cp.id === productId);
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {(products ?? []).map((product) => {
                const inCart = productIsInCart(product.id);
                const loading = loadingIds.includes(product.id);

                return (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
                    >
                        <Link href={`/products/${product.id}`}>
                            <div className="flex justify-center mb-4 h-48 relative">
                                <Image
                                    src={"/" + product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">
                                {product.name}
                            </h2>
                            <p className="text-gray-600">${product.price}</p>
                        </Link>

                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-2 disabled:opacity-50"
                            disabled={loading}
                            onClick={() =>
                                inCart
                                    ? removeFromCart(product.id)
                                    : addToCart(product.id)
                            }
                        >
                            {loading
                                ? "Processing..."
                                : inCart
                                ? "Remove from Cart"
                                : "Add to Cart"}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
