type DashboardSectionHeadingProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function DashboardSectionHeading({
  icon,
  title,
  description,
  action,
}: DashboardSectionHeadingProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl border bg-background p-2 text-muted-foreground">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      {action}
    </div>
  );
}
