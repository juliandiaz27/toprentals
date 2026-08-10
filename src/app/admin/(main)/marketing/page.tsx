import { loadMarketingConfig } from "@/lib/marketing/load";
import { normalizeSiteLanguage } from "@/lib/i18n";
import { MarketingManager } from "../../MarketingManager";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function AdminMarketingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const language = normalizeSiteLanguage(sp.lang);
  const initial = await loadMarketingConfig();
  return (
    <MarketingManager key={language} initial={initial} language={language} />
  );
}
