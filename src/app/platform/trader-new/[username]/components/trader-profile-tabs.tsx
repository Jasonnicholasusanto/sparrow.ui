import { cn } from "@/lib/utils";

type TraderProfileTabsProps = {
  isOwnProfile: boolean;
};

export function TraderProfileTabs({ isOwnProfile }: TraderProfileTabsProps) {
  const tabs = [
    { label: "Overview", active: true },
    { label: "Posts", active: false },
    { label: "Watchlists", active: false },
    { label: "Activity", active: false },
  ];

  return (
    <section className="rounded-2xl border bg-card p-2 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            disabled
            className={cn(
              "rounded-xl px-4 py-2 text-sm transition-colors",
              tab.active
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="px-2 pt-3 text-xs text-muted-foreground">
        {isOwnProfile
          ? "You can later use these sections for your posts, public watchlists, and profile activity."
          : "You can later use these sections for this trader’s posts, public watchlists, and profile activity."}
      </p>
    </section>
  );
}
