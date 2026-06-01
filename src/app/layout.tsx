import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GnahsMetasearchTracker } from "@/components/gnahs/GnahsMetasearchTracker";
import { SiteFooter } from "@/components/home/SiteFooter";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeFooter } from "@/lib/pageContent/homeTypes";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Top Rentals",
  description: "Alquileres temporarios en Buenos Aires y Quito",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await readPageContent("home");
  const footer = pickHomeFooter(content);

  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <GnahsMetasearchTracker />
        {children}
        <SiteFooter footer={footer} />
      </body>
    </html>
  );
}
