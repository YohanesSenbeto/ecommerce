"use client";

import Image from "next/image";
import { useState } from "react";

type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
};

const products: Product[] = [
    {
        id: 1,
        name: "Custom Apron",
        price: 25.99,
        image: "/apron.jpg",
        description:
            "High-quality kitchen apron, great for chefs and grill masters.",
    },
    {
        id: 2,
        name: "Classic Hat",
        price: 19.99,
        image: "/hat.jpg",
        description: "Stylish and comfortable hat for everyday wear.",
    },
    {
        id: 3,
        name: "Coffee Mug",
        price: 12.49,
        image: "/mug.jpg",
        description:
            "Ceramic coffee mug. Holds up to 350ml of your favorite drink.",
    },
    {
        id: 4,
        name: "T-Shirt",
        price: 29.99,
        image: "/shirt.jpg",
        description: "100% cotton t-shirt. Available in all sizes.",
    },
];

export default function Home() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );

    return (
        <div className="min-h-screen px-6 py-10 sm:px-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold text-center mb-10">
                Featured Products
            </h1>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={300}
                            className="object-cover w-full h-52 hover:scale-105 transition-transform duration-300"
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

            {/* Selected Product Details */}
            {selectedProduct && (
                <div className="mt-12 border-t pt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Product Details
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
                        <Image
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            width={400}
                            height={400}
                            className="rounded-xl shadow-md object-cover max-h-[400px]"
                        />
                        <div className="max-w-md space-y-4 text-center sm:text-left">
                            <h3 className="text-xl font-semibold">
                                {selectedProduct.name}
                            </h3>
                            <p className="text-gray-600">
                                {selectedProduct.description}
                            </p>
                            <p className="text-lg font-bold text-green-600">
                                ${selectedProduct.price.toFixed(2)}
                            </p>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
