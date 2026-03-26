"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TraderProfileTabs } from "./trader-profile-tabs";
import { TraderProfileEmptyState } from "./trader-profile-empty-state";
import { TraderProfileBio } from "./trader-profile-bio";
import { TraderProfileStats } from "./trader-profile-stats";
import TraderProfileHeader from "./trader-profile-header";
import CropProfileImageComponent from "./crop-profile-photo-component";
import { UserPublicResponse } from "@/schemas/publicUser";
import { useUser } from "@/providers/user-provider";
import { UpdateUserProfilePayload, User } from "@/schemas/user";
import { getUserProfile } from "@/lib/data/server/me";
import {
  deleteBannerImage,
  deleteProfilePicture,
  updateProfile,
  uploadBannerImage,
  uploadProfilePicture,
} from "@/lib/actions/me";
import EditProfileDialog from "./edit-profile-dialog";

export function TraderProfileView({
  username,
  profile,
}: {
  username: string;
  profile: UserPublicResponse;
}) {
  const { user, setUser, refreshUser } = useUser();

  const parsedUser = user ? User.fromJSON(user) : null;
  const profileData = parsedUser?.profile ?? profile.profile;

  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    profileData?.profile_picture || undefined,
  );
  const [bannerUrl, setBannerUrl] = useState<string | null>(
    profileData?.background_picture || null,
  );

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const [bannerCropSrc, setBannerCropSrc] = useState<string | null>(null);
  const [bannerCropOpen, setBannerCropOpen] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const isOwner =
    parsedUser?.profile?.username?.toLowerCase() === username?.toLowerCase();

  useEffect(() => {
    setAvatarUrl(profileData?.profile_picture || undefined);
    setBannerUrl(profileData?.background_picture || null);
  }, [profileData]);

  async function refreshCurrentUser() {
    const freshUser = await getUserProfile();
    setUser(freshUser);
    return freshUser;
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);

    // allow selecting same file again later
    e.target.value = "";
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBannerCropSrc(reader.result as string);
      setBannerCropOpen(true);
    };
    reader.readAsDataURL(file);

    // allow selecting same file again later
    e.target.value = "";
  }

  async function handleAvatarRemove() {
    const removeTask = (async () => {
      try {
        setProfileLoading(true);
        await deleteProfilePicture();
        await refreshCurrentUser();
        setAvatarUrl(undefined);
      } catch (err) {
        console.error("Failed removing profile image", err);
        throw err;
      } finally {
        setProfileLoading(false);
      }
    })();

    await toast.promise(removeTask, {
      loading: "Removing image...",
      success: "Profile image removed",
      error: (err) => ({
        message: "Failed removing profile picture",
        description: err?.message || "Please try again later.",
      }),
    });
  }

  async function handleBannerRemove() {
    const removeTask = (async () => {
      try {
        setBannerLoading(true);
        await deleteBannerImage();
        await refreshCurrentUser();
        setBannerUrl(null);
      } catch (err) {
        console.error("Failed removing banner image", err);
        throw err;
      } finally {
        setBannerLoading(false);
      }
    })();

    await toast.promise(removeTask, {
      loading: "Removing image...",
      success: "Banner image removed",
      error: (err) => ({
        message: "Failed removing banner image",
        description: err?.message || "Please try again later.",
      }),
    });
  }

  async function handleCroppedProfileUpload(croppedFile: File) {
    const uploadTask = (async () => {
      try {
        setProfileLoading(true);
        const res = await uploadProfilePicture(croppedFile);
        await refreshCurrentUser();
        setAvatarUrl(res.profile_picture_url);
        setCropOpen(false);
        setCropSrc(null);
      } catch (err) {
        console.error("Failed uploading profile image", err);
        throw err;
      } finally {
        setProfileLoading(false);
      }
    })();

    await toast.promise(uploadTask, {
      loading: "Uploading photo...",
      success: "Profile photo updated",
      error: (err) => ({
        message: "Upload failed",
        description:
          err?.message || "Please upload a smaller image or try again later.",
      }),
    });
  }

  async function handleCroppedBannerUpload(croppedFile: File) {
    const uploadTask = (async () => {
      try {
        setBannerLoading(true);
        const res = await uploadBannerImage(croppedFile);
        await refreshCurrentUser();
        setBannerUrl(res.banner_image_url);
        setBannerCropOpen(false);
        setBannerCropSrc(null);
      } catch (err) {
        console.error("Failed uploading banner image", err);
        throw err;
      } finally {
        setBannerLoading(false);
      }
    })();

    await toast.promise(uploadTask, {
      loading: "Uploading photo...",
      success: "Banner image updated",
      error: (err) => ({
        message: "Upload failed",
        description:
          err?.message || "Please upload a smaller image or try again later.",
      }),
    });
  }

  async function handleSaveProfile(values: UpdateUserProfilePayload) {
    try {
      console.log("Saving profile with values:", values);
      await updateProfile(values);
      await refreshUser();
      setEditProfileOpen(false);
      toast.success("Profile updated");
    } catch (err: any) {
      console.error("Failed refreshing user profile", err);
      toast.error("Failed updating profile", {
        description: err?.message || "Please try again later.",
      });
      throw err;
    }
  }

  function openPhotoDialog() {
    if (isOwner) setPhotoDialogOpen(true);
  }

  function openBannerDialog() {
    if (isOwner) setBannerDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBannerUpload}
      />

      <TraderProfileHeader
        profile={profile}
        avatarUrl={avatarUrl}
        bannerUrl={bannerUrl}
        isOwnProfile={isOwner}
        onEditProfile={() => setEditProfileOpen(true)}
        onOpenPhotoDialog={openPhotoDialog}
        onOpenBannerDialog={openBannerDialog}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <TraderProfileTabs isOwnProfile={isOwner} />

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <TraderProfileEmptyState
              title="Posts and activity coming soon"
              description={
                isOwner
                  ? "This is where your posts, analysis, comments, and activity feed will appear."
                  : `This is where ${profileData.display_name || profileData.username}'s posts, analysis, comments, and activity feed will appear.`
              }
            />
          </div>
        </section>

        <aside className="space-y-6">
          <TraderProfileStats profile={profile} />
          <TraderProfileBio profile={profileData} />
        </aside>
      </div>

      <EditProfileDialog
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* <ProfilePhotoDialog
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        avatarUrl={avatarUrl}
        onUploadClick={() => {
          setPhotoDialogOpen(false);
          profileInputRef.current?.click();
        }}
        onRemove={handleAvatarRemove}
        loading={profileLoading}
      /> */}

      {/* <ProfilePhotoDialog
        open={bannerDialogOpen}
        onClose={() => setBannerDialogOpen(false)}
        avatarUrl={bannerUrl}
        onUploadClick={() => {
          setBannerDialogOpen(false);
          bannerInputRef.current?.click();
        }}
        onRemove={handleBannerRemove}
        loading={bannerLoading}
      /> */}

      {cropSrc ? (
        <CropProfileImageComponent
          open={cropOpen}
          onClose={() => {
            setCropOpen(false);
            setCropSrc(null);
          }}
          src={cropSrc}
          onCropped={handleCroppedProfileUpload}
        />
      ) : null}

      {bannerCropSrc ? (
        <CropProfileImageComponent
          open={bannerCropOpen}
          onClose={() => {
            setBannerCropOpen(false);
            setBannerCropSrc(null);
          }}
          src={bannerCropSrc}
          onCropped={handleCroppedBannerUpload}
        />
      ) : null}
    </div>
  );
}
