import ShoppingCartList from "./ShoppingCartList";

export const dynamic = "force-dynamic"; // always fetch fresh on server

export default async function CartPage() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Fetch cart for user with id 2
    const response = await fetch(`${baseUrl}/api/users/2/cart`, {
        cache: "no-cache", // disable caching to get fresh data
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status}`);
    }

    const cartProducts = await response.json();

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow-md mt-8">
            <ShoppingCartList initialCartProducts={cartProducts} />
        </div>
    );
}
