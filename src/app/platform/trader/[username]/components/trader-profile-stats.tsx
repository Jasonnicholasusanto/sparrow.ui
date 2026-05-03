import { UserPublicResponse } from "@/schemas/publicUser";
import { BarChart3, Bookmark, FileText, Users } from "lucide-react";

interface TraderProfileStatsProps {
  profile: UserPublicResponse;
}

export function TraderProfileStats({ profile }: TraderProfileStatsProps) {
  const items = [
    {
      label: "Watchlists",
      value: profile.watchlists.total,

      icon: Bookmark,
    },
    {
      label: "Followers",
      value: profile.followersCount,
      icon: Users,
    },
    {
      label: "Following",
      value: profile.followingCount,
      icon: BarChart3,
    },
  ];

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold">Profile stats</h2>
        <p className="text-xs text-muted-foreground">
          A quick overview of this trader profile.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border bg-background/60 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-semibold">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
