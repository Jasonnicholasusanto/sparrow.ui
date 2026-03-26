"use client";

import Image from "next/image";
import { useAppContext } from "@/contexts/app-context-provider";
import { User } from "@/models/user";
import { UserPublicResponse } from "@/models/publicUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { LuPencil } from "react-icons/lu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileModal from "./updateProfileModal";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  deleteBannerImage,
  deleteProfilePicture,
  getUserProfile,
  uploadBannerImage,
  uploadProfilePicture,
} from "@/services/api/modules/me";
import { Loader2 } from "lucide-react";
import CropProfileImageComponent from "./cropProfileImageComponent";
import ProfilePhotoDialog from "./profilePhotoDialog";
import { toast } from "sonner";
import BannerCropperComponent from "./cropBannerImageComponent";
import BannerPhotoDialog from "./bannerPhotoDialog";

export default function TraderComponent({
  profile,
  username,
}: {
  profile: UserPublicResponse;
  username: string;
}) {
  const { user, setUser } = useAppContext();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const parsedUser = user ? User.fromJSON(user) : null;
  const [profileLoading, setProfileLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    parsedUser?.profile?.profile_picture || undefined
  );
  const [bannerUrl, setBannerUrl] = useState(
    parsedUser?.profile?.background_picture ||
      "/images/default-user-cover-image.jpg"
  );
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [bannerCropSrc, setBannerCropSrc] = useState<string | null>(null);
  const [bannerCropOpen, setBannerCropOpen] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const isOwner =
    parsedUser?.profile?.username?.toLowerCase() === username?.toLowerCase();

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
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
  }

  async function handleAvatarRemove() {
    const removeTask = (async () => {
      try {
        setProfileLoading(true);
        await deleteProfilePicture();
        const freshUser = await getUserProfile();
        setUser(freshUser);
        setAvatarUrl(undefined);
      } catch (err) {
        console.error("Failed removing banner image", err);
        throw err;
      } finally {
        setProfileLoading(false);
      }
    })();

    try {
      await toast.promise(removeTask, {
        loading: "Removing image...",
        success: "Profile image removed",
        error: (err) => ({
          message: "Failed removing profile picture",
          description: err?.message || "Please try again later.",
        }),
      });
    } catch (err) {
      // Error is already handled in the uploadTask
    }
  }

  async function handleBannerRemove() {
    const removeTask = (async () => {
      try {
        setBannerLoading(true);
        await deleteBannerImage();
        const freshUser = await getUserProfile();
        setUser(freshUser);
        setBannerUrl("/images/default-user-cover-image.jpg");
      } catch (err) {
        console.error("Failed removing banner image", err);
        throw err;
      } finally {
        setBannerLoading(false);
      }
    })();

    try {
      await toast.promise(removeTask, {
        loading: "Removing image...",
        success: "Banner image removed",
        error: (err) => ({
          message: "Failed removing banner image",
          description: err?.message || "Please try again later.",
        }),
      });
    } catch (err) {
      // Error is already handled in the uploadTask
    }
  }

  async function handleCroppedProfileUpload(croppedFile: File) {
    const uploadTask = (async () => {
      try {
        setProfileLoading(true);
        const res = await uploadProfilePicture(croppedFile);
        const freshUser = await getUserProfile();
        setUser(freshUser);
        setAvatarUrl(res.profile_picture_url);
      } catch (err) {
        console.error("Failed uploading profile image", err);
        throw err;
      } finally {
        setProfileLoading(false);
      }
    })();

    try {
      await toast.promise(uploadTask, {
        loading: "Uploading photo...",
        success: "Profile photo updated",
        error: (err) => ({
          message: "Upload failed",
          description:
            err?.message || "Please upload a smaller image or try again later.",
        }),
      });
    } catch (err) {
      // Error is already handled in the uploadTask
    }
  }

  async function handleCroppedBannerUpload(croppedFile: File) {
    const uploadTask = (async () => {
      try {
        setBannerLoading(true);
        const res = await uploadBannerImage(croppedFile);
        const freshUser = await getUserProfile();
        setUser(freshUser);
        setBannerUrl(res.banner_image_url);
      } catch (err) {
        console.error("Failed uploading banner image", err);
        throw err;
      } finally {
        setBannerLoading(false);
      }
    })();

    try {
      await toast.promise(uploadTask, {
        loading: "Uploading photo...",
        success: "Banner image updated",
        error: (err) => ({
          message: "Upload failed",
          description:
            err?.message || "Please upload a smaller image or try again later.",
        }),
      });
    } catch (err) {
      // Error is already handled in the uploadTask
    }
  }

  function openPhotoDialog() {
    if (isOwner) setPhotoDialogOpen(true);
  }

  function openBannerDialog() {
    if (isOwner) setBannerDialogOpen(true);
  }

  return (
    <Card className="w-full bg-card p-0 pb-12 rounded-xl">
      <div className="mb-13 relative">
        <div className="relative h-50 w-full rounded-t-xl overflow-hidden">
          <Image
            src={bannerUrl}
            alt="Trader cover image"
            fill
            className="object-cover"
          />
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 bg-black/30 hover:bg-black/40 text-white"
              onClick={() => {
                if (!bannerLoading) openBannerDialog();
              }}
            >
              {!bannerLoading ? (
                <LuPencil />
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </Button>
          )}
        </div>

        <div className="absolute left-12 top-26">
          <div
            className={`relative w-36 h-36 ${
              isOwner ? "cursor-pointer group" : ""
            }`}
            onClick={() => {
              if (!profileLoading) openPhotoDialog();
            }}
          >
            <Avatar className="w-full h-full border-4 border-background rounded-full overflow-hidden">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="flex items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-300">
                <FaUserCircle className="size-34" />
              </AvatarFallback>
            </Avatar>

            {isOwner && (
              <div className="absolute rounded-full inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
                <LuPencil size={28} />
              </div>
            )}

            {profileLoading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                <Loader2 size={28} className="animate-spin text-white" />
              </div>
            )}
          </div>
        </div>
        {/* Profile Photo Dialog */}
        <ProfilePhotoDialog
          open={photoDialogOpen}
          onClose={() => setPhotoDialogOpen(false)}
          avatarUrl={avatarUrl}
          onUploadClick={() => {
            setPhotoDialogOpen(false);
            profileInputRef.current?.click();
          }}
          onRemove={() => {
            handleAvatarRemove();
            setPhotoDialogOpen(false);
          }}
        />

        <BannerPhotoDialog
          open={bannerDialogOpen}
          onClose={() => setBannerDialogOpen(false)}
          bannerUrl={bannerUrl}
          onUploadClick={() => {
            setBannerDialogOpen(false);
            bannerInputRef.current?.click();
          }}
          onRemove={() => {
            handleBannerRemove();
            setBannerDialogOpen(false);
          }}
        />

        {/* Hidden file input */}
        {isOwner && (
          <input
            ref={profileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        )}

        {isOwner && (
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerUpload}
          />
        )}

        <CropProfileImageComponent
          open={cropOpen}
          onClose={() => setCropOpen(false)}
          src={cropSrc || ""}
          onCropped={handleCroppedProfileUpload}
        />

        <BannerCropperComponent
          open={bannerCropOpen}
          onClose={() => setBannerCropOpen(false)}
          src={bannerCropSrc || ""}
          onCropped={handleCroppedBannerUpload}
        />
      </div>
      <div className="px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div className="mt-2 flex flex-col gap-2">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {isOwner
                  ? `Trader @ ${user?.profile.username}`
                  : `Trader @ ${profile.profile.username}`}
              </p>
              <p className="text-neutral-400">
                {user?.profile.display_name || user?.profile.full_name}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">
                  {isOwner
                    ? `${user?.followers_count ?? 0}`
                    : `${profile.followers_count ?? 0}`}
                </span>
                <span className="text-neutral-400 text-sm">Followers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">
                  {isOwner
                    ? `${user?.following_count ?? 0}`
                    : `${profile.following_count ?? 0}`}
                </span>
                <span className="text-neutral-400 text-sm">Following</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">
                  {isOwner
                    ? `${user?.activity.total_points ?? 0}`
                    : `${profile?.activityPointsBreakdown?.total_points ?? 0}`}
                </span>
                <span className="text-neutral-400 text-sm">Total points</span>
              </div>
            </div>
            {user?.profile.bio && (
              <p className="mt-2">
                {isOwner ? `${user.profile.bio}` : `${profile.profile.bio}`}
              </p>
            )}
          </div>
          {isOwner && <EditProfileModal />}
        </div>
      </div>
      <div className="px-8 mt-6">
        <Tabs defaultValue="watchlists" variant="outline" className="w-full">
          <TabsList variant="outline">
            <TabsTrigger variant="outline" value="watchlists">
              Watchlists
            </TabsTrigger>
            <TabsTrigger variant="outline" value="topics">
              Topics
            </TabsTrigger>
            <TabsTrigger variant="outline" value="entries">
              Entries
            </TabsTrigger>
          </TabsList>
          <TabsContent value="watchlists">
            Your public watchlists will be shown here.
          </TabsContent>
          <TabsContent value="topics">Your topics.</TabsContent>
          <TabsContent value="entries">Your entries.</TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
