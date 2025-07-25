import React from "react";
import NotFoundPage from "../../not-found"; // Adjust path as needed

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    try {
        const response = await fetch(`${baseUrl}/api/products/${params.id}`, {
            cache: "no-cache", // or "no-store" if you want no cache
        });

        if (!response.ok) {
            // API returned an error status, show Not Found or error UI
            return <NotFoundPage />;
        }

        const product = await response.json();

        if (!product) {
            return <NotFoundPage />;
        }

        return (
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg mb-2">${product.price}</p>
                <p>{product.description}</p>
                {/* Render other product details as needed */}
            </div>
        );
    } catch (error) {
        // Handle fetch/network error here
        console.error("Failed to fetch product:", error);
        return <NotFoundPage />;
    }
}
