import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GnahsMetasearchTracker } from "@/components/gnahs/GnahsMetasearchTracker";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Top Rentals",
  description: "Alquileres temporarios en Buenos Aires y Quito",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <GnahsMetasearchTracker />
        {children}
      </body>
    </html>
  );
}
