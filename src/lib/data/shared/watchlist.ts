import { Endpoints } from "@/lib/api/endpoints";

export const watchlistDataPaths = {
  types: () =>
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.WatchlistTypes}`,
  quantityTypes: () =>
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.WatchlistQuantityTypes}`,
  myWatchlists: () =>
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.MyWatchlists}`,
  create: () => `${Endpoints.Watchlists.Base}`,
  addWatchlistItem: (watchlistId: number) =>
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.AddWatchlistItem(
      watchlistId,
    ).replace("{watchlistId}", String(watchlistId))}`,
  addWatchlistItemsBulk: (watchlistId: number) =>
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.AddWatchlistItemsBulk(
      watchlistId,
    ).replace("{watchlistId}", String(watchlistId))}`,
};
