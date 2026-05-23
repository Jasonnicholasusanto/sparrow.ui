import { environment } from "./env";

export function getLogoUrl(symbol: string) {
  return `${environment.logoKitTickerApiUrl}/${symbol}?token=${environment.logoKitTickerApiToken}`;
}
