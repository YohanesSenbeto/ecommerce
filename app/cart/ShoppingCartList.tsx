"use client";

import React, { useState, useEffect } from "react";

type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string; // image URL added
    category: string;
    description: string;
};

export default function ShoppingCartList() {
    const userId = "2"; // example user id
    const [cartProducts, setCartProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedProductId, setExpandedProductId] = useState<string | null>(
        null
    );

    // Fetch cart products on mount
    useEffect(() => {
        fetchCartProducts();
    }, []);

    async function fetchCartProducts() {
        try {
            const res = await fetch(`/api/users/${userId}/cart`);
            if (!res.ok) throw new Error("Failed to fetch cart");
            const data = await res.json();

            // Log data to check structure (optional)
            console.log("Cart Products fetched:", data);

            // Map data to ensure every product has an `id`
            setCartProducts(
                data.map((p: any, index: number) => ({
                    id: p.id ?? p.productId ?? `fallback-id-${index}`, // fallback key if missing
                    name: p.name ?? "Unknown Product",
                    price: p.price ?? 0,
                    imageUrl: p.imageUrl ?? "/default-image.png",
                    category: p.category ?? "General",
                    description: p.description ?? "No description available",
                }))
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function removeFromCart(productId: string) {
        setLoading(true);
        try {
            const response = await fetch(`/api/users/${userId}/cart`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error("Failed to remove product from cart");
            }

            const updatedCartProducts: Product[] = await response.json();
            setCartProducts(updatedCartProducts);

            // Collapse details if removed product was expanded
            if (expandedProductId === productId) {
                setExpandedProductId(null);
            }
        } catch (error) {
            console.error("Remove from cart error:", error);
        } finally {
            setLoading(false);
        }
    }

    function toggleDetails(productId: string) {
        setExpandedProductId((prev) => (prev === productId ? null : productId));
    }

    return (
        <div className="bg-gray-50 p-6 rounded-md shadow-sm max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
                Your Shopping Cart
            </h2>

            {loading && (
                <p className="text-center text-blue-600 font-medium mb-4">
                    Loading...
                </p>
            )}

            {cartProducts.length === 0 && !loading && (
                <p className="text-center text-gray-500">
                    No products in cart.
                </p>
            )}

            <ul className="space-y-6">
                {cartProducts.map((product, idx) => {
                    const isExpanded = expandedProductId === product.id;

                    return (
                        <li
                            key={product.id ?? `fallback-key-${idx}`} // Unique key fallback
                            className="bg-white rounded-md shadow p-4 cursor-pointer"
                        >
                            <div
                                className="flex justify-between items-center"
                                onClick={() => toggleDetails(product.id)}
                                aria-expanded={isExpanded}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        toggleDetails(product.id);
                                    }
                                }}
                            >
                                <div className="text-lg font-medium">
                                    {product.name} - ${product.price.toFixed(2)}
                                </div>

                                <button
                                    className="text-red-600 hover:text-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromCart(product.id);
                                    }}
                                    disabled={loading}
                                    aria-label={`Remove ${product.name} from cart`}
                                >
                                    Remove
                                </button>
                            </div>

                            {isExpanded && (
                                <div
                                    id={`product-details-${product.id}`}
                                    className="flex flex-col md:flex-row items-center md:items-start gap-6 border-t border-gray-200 bg-indigo-50 rounded-b-xl px-6 py-5 mt-4"
                                >
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-32 h-32 object-cover rounded-lg shadow-md flex-shrink-0 transform transition-transform duration-300 ease-in-out hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="flex-1 text-gray-800">
                                        <p className="text-sm font-semibold mb-2 text-indigo-700 uppercase tracking-wide">
                                            Category: {product.category}
                                        </p>
                                        <p className="text-base leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
