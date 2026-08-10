import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GnahsMetasearchTracker } from "@/components/gnahs/GnahsMetasearchTracker";
import { SiteFooter } from "@/components/home/SiteFooter";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { loadMarketingConfig } from "@/lib/marketing/load";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeFooter } from "@/lib/pageContent/homeTypes";
import { getSiteLanguage } from "@/lib/i18nServer";
import { getUiMessages } from "@/lib/i18n/ui";
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
  const language = await getSiteLanguage();
  const [content, marketing] = await Promise.all([
    readPageContent("home", language),
    loadMarketingConfig(),
  ]);
  const footer = pickHomeFooter(content);
  const ui = getUiMessages(language);

  return (
    <html lang={language} className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://assets.gnahs.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://hostalric.gnahs.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.gnahs.com" />
        <link rel="dns-prefetch" href="https://hostalric.gnahs.app" />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <LanguageProvider lang={language}>
          <GnahsMetasearchTracker />
          <RevealOnScroll />
          <MarketingChrome config={marketing} />
          {children}
          <SiteFooter footer={footer} designedByLabel={ui.common.designedBy} />
        </LanguageProvider>
      </body>
    </html>
  );
}
