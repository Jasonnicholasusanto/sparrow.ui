import { WatchlistSummary } from "./watchlist";

export interface UserProfile {
  id: string;
  auth_id: string;
  username: string;
  full_name: string;
  display_name: string | null;
  bio: string | null;
  profile_picture: string | null;
  background_picture: string | null;
  location: string | null;
  created_at: string;
}

export interface UserActivityPointsBreakdown {
  total_points: number;
  weekly_points: number;
  monthly_points: number;
}

export interface UserPublicResponse {
  profile: UserProfile;
  activityPointsBreakdown: UserActivityPointsBreakdown;
  followers_count: number;
  following_count: number;
  watchlists: WatchlistSummary;
}

export class PublicUser {
  profile: UserProfile;
  activityPointsBreakdown: UserActivityPointsBreakdown;
  followers_count: number;
  following_count: number;

  constructor(
    profile: UserProfile,
    activity: UserActivityPointsBreakdown,
    followers_count: number,
    following_count: number,
  ) {
    this.profile = profile;
    this.activityPointsBreakdown = activity;
    this.followers_count = followers_count;
    this.following_count = following_count;
  }

  static fromJSON(json: UserPublicResponse): PublicUser {
    return new PublicUser(
      json.profile,
      json.activityPointsBreakdown,
      json.followers_count,
      json.following_count,
    );
  }

  get userFirstName(): string {
    return this.profile.full_name.split(" ")[0];
  }

  get displayName(): string {
    if (this.profile.display_name) {
      return this.profile.display_name;
    }
    return this.profile.full_name;
  }

  get totalPoints(): number {
    return this.activityPointsBreakdown.total_points;
  }

  get avatar(): string | null {
    return this.profile.profile_picture;
  }
}
