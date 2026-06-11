import { readMarketingConfig } from "./storage";
import type { MarketingConfigFile } from "./types";

export {
  getActiveAnnouncement,
  getActiveScrollPopup,
  getStickyReserveForPath,
  pathMatchesAudience,
} from "./runtime";

export async function loadMarketingConfig(): Promise<MarketingConfigFile> {
  return readMarketingConfig();
}
