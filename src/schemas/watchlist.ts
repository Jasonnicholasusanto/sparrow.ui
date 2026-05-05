import { Tags } from "./tags";

export interface WatchlistOut {
  id: number;
  name: string;
  description?: string | null;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  originalAuthorId: string;
  forkCount: boolean;
  forkedAt?: string | null;
  forkedFromId?: string | null;
  isDefault: boolean;
  allocationType: string;
}

export interface WatchlistDetailOut extends WatchlistOut {
  items: WatchlistItemOut[];
  tags: Tags[];
}

export interface WatchlistSummary {
  total: number;
  watchlists: WatchlistDetailOut[];
}

export interface UserWatchlistCounts {
  owned: number;
  forked: number;
  shared: number;
  bookmarked: number;
}

export interface UserWatchlistGroups {
  created: WatchlistDetailOut[];
  forked: WatchlistDetailOut[];
  shared: WatchlistDetailOut[];
  bookmarked: WatchlistDetailOut[];

  totalCount: number;

  counts: UserWatchlistCounts;
}

export interface GetMyWatchlistsResponse {
  limit: number;
  offset: number;
  results: UserWatchlistGroups;
}

export interface WatchlistDataCreate {
  name: string;
  description?: string | null;
  visibility: string;
  allocationType: string;
  isDefault: boolean;
}

export interface WatchlistItemBase {
  symbol: string;
  exchange: string;
  note?: string | null;
  position?: number | null;
  quantity?: number | null;
  referencePrice?: number | null;
}

export interface WatchlistItemOut extends WatchlistItemBase {
  id: number;
  createdAt: string;
  updatedAt: string;
  tickerDetails: TickerMarketSnapshotResponse;
}

export interface WatchlistDetailCreatePayload {
  watchlist_data: {
    name: string;
    description?: string | null;
    visibility: string;
    allocation_type: string;
    is_default: boolean;
    original_author_id?: string | null;
  };
  tags?: string[];
  items?: Array<{
    symbol: string;
    exchange: string;
    note?: string | null;
    position?: number | null;
    quantity?: number | null;
    reference_price?: number | null;
  }>;
}

export interface CreatedWatchlistResponse {
  message: string;
  watchlist: WatchlistOut;
  watchlistItems: WatchlistItemBase[];
}

export interface WatchlistRowItem {
  symbol: string;
  displayName: string;
  exchange?: string | null;
  currency?: string | null;
  marketPrice?: number | null;
  marketChange?: number | null;
  marketChangePercent?: number | null;
}

export interface TickerMarketSnapshotResponse {
  lastPrice: number | null;
  currency: string | null;
  volume: number | null;
  previousClose: number | null;
  regularMarketChange: number | null;
  regularMarketChangePercent: number | null;
}

export interface TickerDetails extends TickerMarketSnapshotResponse {
  symbol: string;
}

export interface WatchlistItem {
  symbol: string;
  exchange: string;
  note?: string | null;
  position?: number | null;
  referencePrice?: number | null;
  quantity?: number | null;
  id: number;
  watchlistId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddWatchlistItem {
  symbol: string;
  exchange: string;
  note?: string | null;
  position?: number | null;
  quantity?: number | null;
  referencePrice?: number | null;
}

export interface Watchlist {
  id: number;
  userId: string;
  name: string;
  description?: string | null;
  visibility: string;
  forkedFromId?: number | null;
  forkedAt?: string | null;
  forkCount: number;
  originalAuthorId?: string | null;
  allocationType: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  items: WatchlistItem[];
  tags: Tags[];
}

export interface WatchlistCounts {
  owned: number;
  forked: number;
  shared: number;
  bookmarked: number;
}

export interface UserWatchlistsGroupedResultsOut {
  created: Watchlist[];
  forked: Watchlist[];
  shared: Watchlist[];
  bookmarked: Watchlist[];
  totalCount: number;
  counts: WatchlistCounts;
}

export interface UserWatchlistsResponse {
  limit: number;
  offset: number;
  results: UserWatchlistsGroupedResultsOut;
}
