export interface WatchlistAuditEventOut {
  id: number;
  watchlistId: number | null;
  userProfileId: string;
  action: string;
  itemId: number | null;
  beforeData: Record<string, unknown> | null;
  afterData: Record<string, unknown> | null;
  metaData: Record<string, unknown> | null;
  createdAt: string;
}
