import { Endpoints } from "@/lib/api/endpoints";

export const watchlistDataPaths = {
  types: () =>
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.WatchlistTypes}`,
  quantityTypes: () =>
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.WatchlistQuantityTypes}`,
  myWatchlists: () =>
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.MyWatchlists}`,
  create: () => `${Endpoints.Watchlists.Base}`,
};
