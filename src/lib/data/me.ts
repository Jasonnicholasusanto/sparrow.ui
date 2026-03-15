"use server";

import { UserResponse } from "@/schemas/user";
import { apiClient } from "@/services/api/client";
import { Endpoints } from "@/services/api/endpoints";

export async function getUserProfile(): Promise<UserResponse | null> {
  try {
    return await apiClient<UserResponse>(
      `${Endpoints.Me.Base}${Endpoints.Me.Profile}`,
      {
        version: Endpoints.Me.BaseVersion,
      },
    );
  } catch (e: any) {
    if (e?.status === 404) return null;
    throw e;
  }
}

export async function createProfile(data: {
  full_name: string;
  birth_date: string;
  username: string;
  phone_number: string;
  email_address: string;
}) {
  return apiClient<UserResponse>(
    `${Endpoints.Me.Base}${Endpoints.Me.Profile}`,
    {
      method: "POST",
      body: JSON.stringify(data),
      version: Endpoints.Me.BaseVersion,
    },
  );
}

export async function softDeleteProfile() {
  return apiClient<void>(`${Endpoints.Me.Base}${Endpoints.Me.Profile}`, {
    method: "DELETE",
    version: Endpoints.Me.BaseVersion,
  });
}

// export async function updateProfile(data: UpdateUserProfilePayload) {
//   const filteredData = Object.fromEntries(
//     Object.entries(data).filter((entry) => {
//       const [, v] = entry;
//       return v != null && v !== "";
//     }),
//   );
//   return apiClient<UserResponse>(
//     `${Endpoints.Me.Base}${Endpoints.Me.Profile}`,
//     {
//       method: "PATCH",
//       body: JSON.stringify(filteredData),
//       version: Endpoints.Me.BaseVersion,
//     },
//   );
// }

export async function getFollowers() {
  return apiClient<any[]>(`${Endpoints.Me.Base}${Endpoints.Me.Followers}`, {
    version: Endpoints.Me.BaseVersion,
  });
}

export async function getFollowing() {
  return apiClient<any[]>(`${Endpoints.Me.Base}${Endpoints.Me.Following}`, {
    version: Endpoints.Me.BaseVersion,
  });
}

export async function updateEmail(data: { email_address: string }) {
  return apiClient<UserResponse>(`${Endpoints.Me.Base}${Endpoints.Me.Email}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    version: Endpoints.Me.BaseVersion,
  });
}

export async function uploadBannerImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<{ banner_image_url: string }>(
    `${Endpoints.Me.Base}${Endpoints.Me.UploadBannerImage}`,
    {
      method: "POST",
      body: formData,
      headers: {},
      version: Endpoints.Me.BaseVersion,
    },
  );
}

export async function deleteBannerImage() {
  return apiClient<void>(
    `${Endpoints.Me.Base}${Endpoints.Me.DeleteBannerImage}`,
    {
      method: "DELETE",
      version: Endpoints.Me.BaseVersion,
    },
  );
}

export async function uploadProfilePicture(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<{ profile_picture_url: string }>(
    `${Endpoints.Me.Base}${Endpoints.Me.UploadProfilePicture}`,
    {
      method: "POST",
      body: formData,
      version: Endpoints.Me.BaseVersion,
    },
  );
}

export async function deleteProfilePicture() {
  return apiClient<void>(
    `${Endpoints.Me.Base}${Endpoints.Me.DeleteProfilePicture}`,
    {
      method: "DELETE",
      version: Endpoints.Me.BaseVersion,
    },
  );
}

export async function reactivateAccount() {
  return apiClient<UserResponse>(
    `${Endpoints.Me.Base}${Endpoints.Me.Profile}${Endpoints.Me.Reactivate}`,
    {
      method: "POST",
      version: Endpoints.Me.BaseVersion,
    },
  );
}
