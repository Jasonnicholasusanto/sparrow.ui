import { WatchlistSummary } from "./watchlist";

export interface UserProfile {
  id: string;
  authId: string;
  username: string;
  fullName: string;
  displayName: string | null;
  bio: string | null;
  birthDate: string | null;
  phoneNumber: string | null;
  profilePicture: string | null;
  backgroundPicture: string | null;
  emailAddress: string;
  location: string | null;
  createdAt: string;
}

export interface UpdateUserProfilePayload {
  username: string;
  fullName: string;
  displayName?: string;
  bio?: string;
  birthDate?: string;
  phoneNumber?: string;
  location?: string;
}

export interface UserActivity {
  topicsCreated: number;
  entriesCreated: number;
  commentsCreated: number;
  topicUpvotes: number;
  topicDownvotes: number;
  entryUpvotes: number;
  entryDownvotes: number;
  commentUpvotes: number;
  commentDownvotes: number;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  userId: string;
  updatedAt: string;
}

export interface UserResponse {
  profile: UserProfile;
  activity: UserActivity;
  followersCount: number;
  followingCount: number;
  watchlists: WatchlistSummary;
}

export class User {
  profile: UserProfile;
  activity: UserActivity;
  followersCount: number;
  followingCount: number;
  watchlists: WatchlistSummary;

  constructor(
    profile: UserProfile,
    activity: UserActivity,
    followersCount: number,
    followingCount: number,
    watchlists: WatchlistSummary,
  ) {
    this.profile = profile;
    this.activity = activity;
    this.followersCount = followersCount;
    this.followingCount = followingCount;
    this.watchlists = watchlists;
  }

  static fromJSON(json: UserResponse): User {
    return new User(
      json.profile,
      json.activity,
      json.followersCount,
      json.followingCount,
      json.watchlists,
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
    return this.activity.totalPoints;
  }

  get avatar(): string | null {
    return this.profile.profilePicture;
  }

  get userWatchlists(): WatchlistSummary {
    return this.watchlists;
  }
}
