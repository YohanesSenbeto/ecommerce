import ShoppingCartList from "./ShoppingCartList";

export const dynamic = "force-dynamic";

export default async function CartPage() {
    const response = await fetch(
        "http://nextjs-ecommerce-fawn-iota.vercel.app/api/users/2/cart",
        {
            cache: "no-cache",
        }
    );

    const cartProducts = await response.json();

    return <ShoppingCartList initialCartProducts={cartProducts} />;
}
