import { Suspense } from "react";

import { PageMotion } from "@/components/layout/motion-wrapper";

import { DashboardHero } from "./components/dashboard-hero";
import { MyWatchlistsSection } from "./components/my-watchlists-section";
import { AiInsightsSection } from "./components/ai-insights-section";
import { NewsAffectingWatchlistsSection } from "./components/news-affecting-watchlists-section";
import { MarketPulseSection } from "./components/market-pulse-section";
import { DiscoverWatchlistsSection } from "./components/discover-watchlists-section";

import { DashboardHeroSkeleton } from "./components/skeletons/dashboard-hero-skeleton";
import { WatchlistsSectionSkeleton } from "./components/skeletons/watchlist-section-skeleton";
import { InsightsSectionSkeleton } from "./components/skeletons/insights-section-skeleton";
import { NewsSectionSkeleton } from "./components/skeletons/news-section-skeleton";
import { MarketPulseSkeleton } from "./components/skeletons/market-pulse-skeleton";

import {
  aiInsights,
  discoverWatchlists,
  heroStats,
  marketPulse,
  newsItems,
  userName,
  watchlists,
} from "./components/dashboardMockData";

export default function DashboardPage() {
  return (
    <PageMotion>
      <main className="space-y-8">
        <Suspense fallback={<DashboardHeroSkeleton />}>
          <DashboardHeroServer />
        </Suspense>

        <Suspense fallback={<WatchlistsSectionSkeleton />}>
          <MyWatchlistsServer />
        </Suspense>

        <Suspense fallback={<InsightsSectionSkeleton />}>
          <AiInsightsServer />
        </Suspense>

        <Suspense fallback={<NewsSectionSkeleton />}>
          <NewsAffectingWatchlistsServer />
        </Suspense>

        <Suspense fallback={<MarketPulseSkeleton />}>
          <MarketPulseServer />
        </Suspense>

        <Suspense fallback={<WatchlistsSectionSkeleton />}>
          <DiscoverWatchlistsServer />
        </Suspense>
      </main>
    </PageMotion>
  );
}

async function DashboardHeroServer() {
  return <DashboardHero userName={userName} stats={heroStats} />;
}

async function MyWatchlistsServer() {
  return <MyWatchlistsSection watchlists={watchlists} />;
}

async function AiInsightsServer() {
  return <AiInsightsSection insights={aiInsights} />;
}

async function NewsAffectingWatchlistsServer() {
  return <NewsAffectingWatchlistsSection newsItems={newsItems} />;
}

async function MarketPulseServer() {
  return <MarketPulseSection marketPulse={marketPulse} />;
}

async function DiscoverWatchlistsServer() {
  return <DiscoverWatchlistsSection watchlists={discoverWatchlists} />;
}

// async function DashboardHeroServer() {
//   const data = await getDashboardOverview();

//   return <DashboardHero userName={data.userName} stats={data.heroStats} />;
// }

// async function MyWatchlistsServer() {
//   const data = await getDashboardWatchlists();

//   return <MyWatchlistsSection watchlists={data.watchlists} />;
// }

// async function AiInsightsServer() {
//   const data = await getDashboardInsights();

//   return <AiInsightsSection insights={data.insights} />;
// }

// async function NewsAffectingWatchlistsServer() {
//   const data = await getDashboardNews();

//   return <NewsAffectingWatchlistsSection newsItems={data.newsItems} />;
// }

// async function MarketPulseServer() {
//   const data = await getMarketPulse();

//   return <MarketPulseSection marketPulse={data.marketPulse} />;
// }

// async function DiscoverWatchlistsServer() {
//   const data = await getDiscoverWatchlists();

//   return <DiscoverWatchlistsSection watchlists={data.watchlists} />;
// }
