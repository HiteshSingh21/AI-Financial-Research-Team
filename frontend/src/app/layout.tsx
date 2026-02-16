import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/toaster";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "FinAI Suite — Financial Intelligence Platform",
    description:
        "AI-powered financial analysis using multi-agent research teams. Technical, fundamental, and sentiment analysis in one unified dashboard.",
    keywords: [
        "financial analysis",
        "AI",
        "stock analysis",
        "investment research",
        "sentiment analysis",
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} font-sans`}>
                <Providers>
                    <Toaster>
                        <Sidebar />
                        <main className="lg:ml-[260px] min-h-screen pt-14 lg:pt-0">
                            {children}
                        </main>
                    </Toaster>
                </Providers>
            </body>
        </html>
    );
}
