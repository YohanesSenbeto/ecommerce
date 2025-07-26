"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
    _id: string;
    name: string;
    price: number;
    image: string;
    description: string;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");

                if (!res.ok) {
                    throw new Error("Failed to fetch products: " + res.status);
                }

                const data = await res.json();
                setProducts(data);
            } catch (err: any) {
                console.error("Products error:", err);
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p className="text-center p-10">Loading products...</p>;
    if (error)
        return <p className="text-center p-10 text-red-500">Error: {error}</p>;

    return (
        <div className="min-h-screen px-6 py-10 sm:px-20 font-sans bg-gray-50">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                Products
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={300}
                            className="object-cover w-full h-52"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {product.name}
                            </h3>
                            <p className="text-gray-600">
                                ${product.price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
