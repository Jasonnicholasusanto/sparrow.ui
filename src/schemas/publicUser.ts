import { WatchlistSummary } from "./watchlist";

export interface UserProfile {
  id: string;
  authId: string;
  username: string;
  fullName: string;
  displayName: string | null;
  bio: string | null;
  profilePicture: string | null;
  backgroundPicture: string | null;
  location: string | null;
  createdAt: string;
}

export interface UserActivityPointsBreakdown {
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
}

export interface UserPublicResponse {
  profile: UserProfile;
  activityPointsBreakdown: UserActivityPointsBreakdown;
  followersCount: number;
  followingCount: number;
  watchlists: WatchlistSummary;
}

export class PublicUser {
  profile: UserProfile;
  activityPointsBreakdown: UserActivityPointsBreakdown;
  followersCount: number;
  followingCount: number;

  constructor(
    profile: UserProfile,
    activity: UserActivityPointsBreakdown,
    followersCount: number,
    followingCount: number,
  ) {
    this.profile = profile;
    this.activityPointsBreakdown = activity;
    this.followersCount = followersCount;
    this.followingCount = followingCount;
  }

  static fromJSON(json: UserPublicResponse): PublicUser {
    return new PublicUser(
      json.profile,
      json.activityPointsBreakdown,
      json.followersCount,
      json.followingCount,
    );
  }

  get userFirstName(): string {
    return this.profile.fullName.split(" ")[0];
  }

  get displayName(): string {
    if (this.profile.displayName) {
      return this.profile.displayName;
    }
    return this.profile.fullName;
  }

  get totalPoints(): number {
    return this.activityPointsBreakdown.totalPoints;
  }

  get avatar(): string | null {
    return this.profile.profilePicture;
  }
}
