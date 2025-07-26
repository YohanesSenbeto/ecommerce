"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export type Product = {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    // add other product properties here
};

type ProductsListProps = {
    products?: Product[];
    initialCartProducts?: Product[];
};

export default function ProductsList({
    products = [],
    initialCartProducts = [],
}: ProductsListProps) {
    // Cart products state
    const [cartProducts, setCartProducts] =
        useState<Product[]>(initialCartProducts);

    // To track which product IDs are loading
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    // Get baseUrl once on mount (client-side only)
    const [baseUrl, setBaseUrl] = useState("");
    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    // Add product to cart (POST)
    async function addToCart(productId: string) {
        try {
            setLoadingIds((ids) => [...ids, productId]);

            const response = await fetch(`${baseUrl}/api/users/2/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to add product to cart");
            }

            const updatedCartProducts: Product[] = await response.json();
            setCartProducts(updatedCartProducts);
        } catch (err) {
            console.error("🚫 Failed to add to cart", err);
            alert("Failed to add to cart. Please try again.");
        } finally {
            setLoadingIds((ids) => ids.filter((id) => id !== productId));
        }
    }

    // Remove product from cart (DELETE)
    async function removeFromCart(productId: string) {
        try {
            setLoadingIds((ids) => [...ids, productId]);

            const response = await fetch(
                `${baseUrl}/api/users/2/cart?productId=${productId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    errorText || "Failed to remove product from cart"
                );
            }

            const updatedCartProducts: Product[] = await response.json();
            setCartProducts(updatedCartProducts);
        } catch (err) {
            console.error("🚫 Failed to remove from cart", err);
            alert("Failed to remove from cart. Please try again.");
        } finally {
            setLoadingIds((ids) => ids.filter((id) => id !== productId));
        }
    }

    // Check if a product is currently in the cart
    function productIsInCart(productId: string) {
        return cartProducts.some((cp) => cp.id === productId);
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => {
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
                            disabled={loading}
                            onClick={() =>
                                inCart
                                    ? removeFromCart(product.id)
                                    : addToCart(product.id)
                            }
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-2 disabled:opacity-50"
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
