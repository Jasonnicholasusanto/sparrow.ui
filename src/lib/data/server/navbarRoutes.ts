"use server";

import { NavbarRoute, NavbarRouteResponse } from "@/schemas/navbarRoute";
import { Endpoints } from "@/lib/api/endpoints";
import { serverApiClient } from "@/lib/api/server";

export async function getNavbarRoutes(): Promise<NavbarRoute[] | null> {
  try {
    const data = await serverApiClient<NavbarRouteResponse>(
      `${Endpoints.Navbar.Base}${Endpoints.Navbar.Routes}`,
      {
        version: Endpoints.Navbar.BaseVersion,
      },
    );
    return data?.navbar_routes ?? null;
  } catch (e: any) {
    if (e?.status === 404) {
      return null;
    }
    throw e;
  }
}
