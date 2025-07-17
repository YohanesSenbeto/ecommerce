import ProductsList from "../productList";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
    let products = [];
    let cartProducts = [];

    try {
        const productsResponse = await fetch(
            "process.env.NEXT_PUBLIC_SITE_URL + '/api/products",
            {
                cache: "no-cache",
            }
        );

        if (!productsResponse.ok) {
            throw new Error(
                `Failed to fetch products: ${productsResponse.status}`
            );
        }

        products = await productsResponse.json();
    } catch (error) {
        console.error("Error loading products:", error);
    }

    try {
        const cartResponse = await fetch(
            "process.env.NEXT_PUBLIC_SITE_URL + '/api/users/2/cart",
            {
                cache: "no-cache",
            }
        );

        if (!cartResponse.ok) {
            throw new Error(`Failed to fetch cart: ${cartResponse.status}`);
        }

        cartProducts = await cartResponse.json();
    } catch (error) {
        console.error("Error loading cart:", error);
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">🛒 Products</h1>

            {products.length > 0 ? (
                <>
                    <ProductsList
                        products={products}
                        initialCartProducts={cartProducts}
                    />
                </>
            ) : (
                <p className="text-red-500">
                    No products available or failed to load.
                </p>
            )}
        </div>
    );
}
