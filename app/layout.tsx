// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import Providers from "./providers"; // ✅ Import client wrapper

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Next-js-Ecommerce-app",
    description: "Next-js-Ecommerce-app with Tailwind CSS and Geist UI",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white`}
            >
                <Providers>
                    {" "}
                    {/* ✅ Context now works in client */}
                    <NavBar />
                    <main className="min-h-screen">{children}</main>
                </Providers>
            </body>
        </html>
    );
}
