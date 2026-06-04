import { loadMarketingConfig } from "@/lib/marketing/load";
import { MarketingManager } from "../../MarketingManager";

export const dynamic = "force-dynamic";

export default async function AdminMarketingPage() {
  const initial = await loadMarketingConfig();
  return <MarketingManager initial={initial} />;
}
