export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

export const environment = {
  nextPublicFinforumApiUrl:
    process.env.NEXT_PUBLIC_FINFORUM_API_URL || "http://localhost:8000",
  apiVersion: process.env.API_VERSION || "",
  nextPublicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  nextPublicSupabasePublishableOrAnonKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY || "",
  nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
  logoKitTickerApiUrl: process.env.NEXT_PUBLIC_LOGO_KIT_TICKER_API_URL || "",
  logoKitTickerApiToken:
    process.env.NEXT_PUBLIC_LOGO_KIT_TICKER_API_TOKEN || "",
  nodeEnv: process.env.NODE_ENV || "development",
};
