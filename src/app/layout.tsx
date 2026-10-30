import type { Metadata } from "next";
import { Inria_Serif, Inter, Manrope, Montserrat } from "next/font/google";
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
import { isIndexableHost, jsonLdScript, organizationJsonLd, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Rebranding (Figma): títulos en Fieldwork (Montserrat hasta tener la licencia), acentos en Inria Serif Bold Italic */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const accentSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-accent-serif",
  display: "swap",
});

/** Base para todas las páginas; cada una completa título, descripción y canonical. */
export async function generateMetadata(): Promise<Metadata> {
  const indexable = await isIndexableHost();
  return {
    metadataBase: new URL(SITE_URL),
    title: "Top Rentals",
    description: "Departamentos temporarios con servicio de hotel en Buenos Aires y Quito.",
    applicationName: "Top Rentals",
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
  };
}

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
    <html lang={language} className={`${inter.variable} ${manrope.variable} ${montserrat.variable} ${accentSerif.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://assets.gnahs.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://hostalric.gnahs.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.gnahs.com" />
        <link rel="dns-prefetch" href="https://hostalric.gnahs.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(
            organizationJsonLd([footer.instagramUrl, footer.facebookUrl]),
          )}
        />
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
