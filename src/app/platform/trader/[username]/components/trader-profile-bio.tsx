import { CalendarDays, MapPin } from "lucide-react";
import { UserProfile } from "@/schemas/publicUser";

interface TraderProfileBioProps {
  profile: UserProfile;
}

export function TraderProfileBio({ profile }: TraderProfileBioProps) {
  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold">About</h2>
        <p className="text-xs text-muted-foreground">
          Public profile information.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm leading-6 text-foreground/90">
          {profile.bio || "No bio added yet."}
        </p>

        <div className="space-y-3 text-sm text-muted-foreground">
          {profile.location ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Joined {joinedDate}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
