"use client";

import { brandChartColors } from "@/config/brand";
import { cn } from "@/lib/utils";

type DonutSegment = {
  label: string;
  value: number;
};

type AdminDonutChartProps = {
  data: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
  className?: string;
};

export function AdminDonutChart({
  data,
  centerLabel,
  centerValue,
  className,
}: AdminDonutChartProps) {
  const entries = data.filter((d) => d.value > 0);
  const total = entries.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }

  let cumulative = 0;
  const gradientStops = entries
    .map((segment, i) => {
      const pct = (segment.value / total) * 100;
      const start = cumulative;
      cumulative += pct;
      const color = brandChartColors[i % brandChartColors.length];
      return `${color} ${start}% ${cumulative}%`;
    })
    .join(", ");

  return (
    <div className={cn("flex flex-col items-center gap-4 sm:flex-row sm:items-center", className)}>
      <div className="relative size-36 shrink-0">
        <div
          className="size-full rounded-full"
          style={{ background: `conic-gradient(${gradientStops})` }}
        />
        <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-card text-center">
          {centerValue ? (
            <span className="text-xl font-bold">{centerValue}</span>
          ) : null}
          {centerLabel ? (
            <span className="text-[10px] text-muted-foreground">{centerLabel}</span>
          ) : null}
        </div>
      </div>
      <ul className="flex-1 space-y-2">
        {entries.map((segment, i) => (
          <li key={segment.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: brandChartColors[i % brandChartColors.length],
                }}
              />
              {segment.label}
            </span>
            <span className="font-medium text-muted-foreground">
              {segment.value} ({Math.round((segment.value / total) * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
