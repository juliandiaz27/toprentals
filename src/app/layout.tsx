import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GnahsMetasearchTracker } from "@/components/gnahs/GnahsMetasearchTracker";
import { SiteFooter } from "@/components/home/SiteFooter";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { loadMarketingConfig } from "@/lib/marketing/load";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeFooter } from "@/lib/pageContent/homeTypes";
import { getSiteLanguage } from "@/lib/i18nServer";
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
  const [content, marketing, language] = await Promise.all([
    readPageContent("home"),
    loadMarketingConfig(),
    getSiteLanguage(),
  ]);
  const footer = pickHomeFooter(content);

  return (
    <html lang={language} className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://assets.gnahs.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://hostalric.gnahs.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.gnahs.com" />
        <link rel="dns-prefetch" href="https://hostalric.gnahs.app" />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <GnahsMetasearchTracker />
        <RevealOnScroll />
        <MarketingChrome config={marketing} />
        {children}
        <SiteFooter footer={footer} />
      </body>
    </html>
  );
}
