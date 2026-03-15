import { ArrowUpRight, BarChart3, DollarSign, Users } from "lucide-react";

const stats = [
  {
    title: "Portfolio Value",
    value: "$124,320",
    change: "+4.2%",
    icon: DollarSign,
  },
  {
    title: "Active Watchlists",
    value: "12",
    change: "+2 this week",
    icon: BarChart3,
  },
  {
    title: "Tracked Assets",
    value: "84",
    change: "+11 added",
    icon: ArrowUpRight,
  },
  {
    title: "Connected Users",
    value: "1,284",
    change: "+8.1%",
    icon: Users,
  },
];

export default function PlatformPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Welcome to Sparrow</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Your investing platform, simplified
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Track your portfolio, review analytics, monitor watchlists, and
            build a cleaner investing workflow from one place.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, change, icon: Icon }) => (
          <div
            key={title}
            className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{title}</p>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
              <p className="text-xs text-emerald-600">{change}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Market Snapshot</h3>
            <p className="text-sm text-muted-foreground">
              A simple placeholder section for charts, watchlist data, or market
              summaries.
            </p>
          </div>

          <div className="flex h-80 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            Chart / analytics widget goes here
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">
              A placeholder for user actions, alerts, or news updates.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border p-4">
              <p className="text-sm font-medium">AAPL added to watchlist</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm font-medium">
                Portfolio performance updated
              </p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm font-medium">New market alert triggered</p>
              <p className="text-xs text-muted-foreground">Yesterday</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
