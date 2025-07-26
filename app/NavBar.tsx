"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function NavBar() {
    const { data: session, status } = useSession();

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <ul className="flex space-x-4">
                    <li>
                        <Link
                            href="/products"
                            className="text-gray-700 hover:text-black"
                        >
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/cart"
                            className="text-gray-700 hover:text-black"
                        >
                            Cart
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/checkout"
                            className="text-gray-700 hover:text-black"
                        >
                            Checkout
                        </Link>
                    </li>

                    {/* Conditionally render links based on session */}
                    {status === "loading" ? null : session ? (
                        <>
                            <li>
                                <button
                                    onClick={() =>
                                        signOut({ callbackUrl: "/" })
                                    }
                                    className="text-gray-700 hover:text-black"
                                >
                                    Logout
                                </button>
                            </li>
                            <li>
                                <span className="text-gray-700">
                                    Hi,{" "}
                                    {session.user?.name || session.user?.email}
                                </span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-black mr-4"
                                >
                                    Login
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
