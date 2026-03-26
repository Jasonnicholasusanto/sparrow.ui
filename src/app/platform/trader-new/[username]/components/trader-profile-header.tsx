"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Pencil, CalendarDays } from "lucide-react";
import { UserPublicResponse } from "@/schemas/publicUser";

interface TraderProfileHeaderProps {
  profile: UserPublicResponse;
  avatarUrl?: string | undefined;
  bannerUrl?: string | null;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onOpenPhotoDialog?: () => void;
  onOpenBannerDialog?: () => void;
}

function formatJoinDate(dateString?: string | null) {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-AU", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function TraderProfileHeader({
  profile,
  avatarUrl,
  bannerUrl,
  isOwnProfile = false,
  onEditProfile,
  onOpenPhotoDialog,
  onOpenBannerDialog,
}: TraderProfileHeaderProps) {
  const userProfile = profile.profile;
  const joinedLabel = formatJoinDate(userProfile?.created_at);

  return (
    <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div className="relative h-48 w-full md:h-56 lg:h-64">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={`${userProfile?.username} banner`}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-primary/15 via-secondary/10 to-transparent" />

        {isOwnProfile ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="absolute right-4 top-4 rounded-full"
            onClick={onOpenBannerDialog}
          >
            <Camera className="mr-2 h-4 w-4" />
            Edit cover
          </Button>
        ) : null}
      </div>

      <div className="relative px-5 pb-6 pt-0 md:px-6">
        <div className="-mt-16 flex flex-col gap-4 md:-mt-20 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="relative h-28 w-28 rounded-full border-4 border-background bg-background shadow-md md:h-36 md:w-36">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`${userProfile?.username} profile photo`}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-3xl font-semibold text-muted-foreground">
                  {userProfile?.username.charAt(0).toUpperCase()}
                </div>
              )}

              {isOwnProfile ? (
                <Button
                  type="button"
                  size="icon-lg"
                  variant="outline"
                  onClick={onOpenPhotoDialog}
                  className="absolute bottom-1 right-1 rounded-full shadow bg-background!"
                  aria-label="Edit profile photo"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              ) : null}
            </div>

            <div className="min-w-0 pb-1 mt-5">
              <h1 className="truncate text-2xl font-bold tracking-tight md:text-3xl mt-20">
                @{userProfile.username}
              </h1>

              {userProfile.display_name ? (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="text-sm text-muted-foreground">
                    {userProfile.display_name}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isOwnProfile ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={onEditProfile}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                >
                  Follow
                </Button>
                <Button type="button" className="rounded-full">
                  Message
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-6 pt-2 md:px-6">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="inline-flex items-center gap-1.5">
            <span className="font-semibold text-foreground">
              {profile.following_count ?? 0}
            </span>
            Following
          </div>

          <div className="inline-flex items-center gap-1.5">
            <span className="font-semibold text-foreground">
              {profile.followers_count ?? 0}
            </span>
            Followers
          </div>

          {userProfile?.location ? (
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {userProfile.location}
            </div>
          ) : null}

          {joinedLabel ? (
            <div className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              Joined {joinedLabel}
            </div>
          ) : null}
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
          {userProfile?.bio ??
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        </p>
      </div>
    </section>
  );
}
