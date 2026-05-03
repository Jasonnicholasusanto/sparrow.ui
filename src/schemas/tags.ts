export interface Tags {
  id: number;
  name: string;
  slug: string;
  category: string;
  createdAt: string;
}

export interface TagSearchResult {
  id: number;
  name: string;
  slug: string;
  category?: string | null;
  isSystem: boolean;
  createdAt: string;
  publicWatchlistCount: number;
}
