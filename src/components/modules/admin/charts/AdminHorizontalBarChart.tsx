"use client";

import { brandChartColors } from "@/config/brand";
import { cn } from "@/lib/utils";

type BarEntry = {
  label: string;
  value: number;
};

type AdminHorizontalBarChartProps = {
  data: BarEntry[];
  className?: string;
};

export function AdminHorizontalBarChart({ data, className }: AdminHorizontalBarChartProps) {
  const entries = data.filter((d) => d.value > 0);
  const max = Math.max(...entries.map((d) => d.value), 1);
  const total = entries.reduce((sum, d) => sum + d.value, 0);

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-xs text-muted-foreground">{total} total</p>
      {entries.map((entry, i) => (
        <div key={entry.label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{entry.label}</span>
            <span className="font-medium text-muted-foreground">{entry.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-brand-secondary/60">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(entry.value / max) * 100}%`,
                backgroundColor: brandChartColors[i % brandChartColors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
