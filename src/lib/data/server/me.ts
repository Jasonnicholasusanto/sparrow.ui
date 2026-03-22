import { UserResponse } from "@/schemas/user";
import { Endpoints } from "@/lib/api/endpoints";
import { serverApiClient } from "@/lib/api/server";
import { UserFollowDataResponse } from "@/schemas/userFollow";
import { ApiError } from "@/lib/api/errors";

export async function getUserProfile(): Promise<UserResponse | null> {
  try {
    return await serverApiClient<UserResponse>(
      `${Endpoints.Me.Base}${Endpoints.Me.Profile}`,
      {
        version: Endpoints.Me.BaseVersion,
      },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getFollowers(): Promise<UserFollowDataResponse> {
  try {
    return await serverApiClient<UserFollowDataResponse>(
      `${Endpoints.Me.Base}${Endpoints.Me.Followers}`,
      {
        version: Endpoints.Me.BaseVersion,
      },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { total: 0, limit: 0, offset: 0, data: [] };
    }
    throw error;
  }
}

export async function getFollowing(): Promise<UserFollowDataResponse> {
  try {
    return await serverApiClient<UserFollowDataResponse>(
      `${Endpoints.Me.Base}${Endpoints.Me.Following}`,
      {
        version: Endpoints.Me.BaseVersion,
      },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { total: 0, limit: 0, offset: 0, data: [] };
    }
    throw error;
  }
}
