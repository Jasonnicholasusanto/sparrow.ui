type TraderProfileEmptyStateProps = {
  title: string;
  description: string;
};

export function TraderProfileEmptyState({
  title,
  description,
}: TraderProfileEmptyStateProps) {
  return (
    <div className="flex min-h-65 flex-col items-center justify-center rounded-2xl border border-dashed bg-background/40 px-6 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
