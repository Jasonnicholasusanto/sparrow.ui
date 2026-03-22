"use server";

import { UserPublicResponse } from "@/schemas/publicUser";
import { Endpoints } from "@/lib/api/endpoints";
import { serverApiClient } from "@/lib/api/server";

export async function getUserByUsername(
  username: string,
): Promise<UserPublicResponse | null> {
  try {
    return await serverApiClient<UserPublicResponse>(
      `${Endpoints.Users.Base}${Endpoints.Users.UserByUsername(username)}`,
      {
        version: Endpoints.Users.BaseVersion,
      },
    );
  } catch (e: any) {
    if (e?.status === 404) return null;
    throw e;
  }
}
