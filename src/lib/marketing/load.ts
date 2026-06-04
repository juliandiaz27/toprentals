import { readMarketingConfig } from "./storage";
import type { MarketingConfigFile } from "./types";

export {
  getActiveAnnouncement,
  getStickyReserveForPath,
  pathMatchesAudience,
} from "./runtime";

export async function loadMarketingConfig(): Promise<MarketingConfigFile> {
  return readMarketingConfig();
}
