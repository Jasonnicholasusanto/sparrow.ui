import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type ChangePillProps = {
  value: number;
  size?: "sm" | "md";
};

export function ChangePill({ value, size = "md" }: ChangePillProps) {
  const positive = value >= 0;

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      } ${
        positive
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-rose-500/10 text-rose-600"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </div>
  );
}
