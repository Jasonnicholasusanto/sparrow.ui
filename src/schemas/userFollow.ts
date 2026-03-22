export interface UserFollow {
  id: string;
  auth_id: string;
  username: string;
  full_name: string;
  display_name: string;
  bio: string | null;
  profile_picture: string | null;
  background_picture: string | null;
}

export interface UserFollowDataResponse {
  total: number;
  limit: number;
  offset: number;
  data: UserFollow[];
}
