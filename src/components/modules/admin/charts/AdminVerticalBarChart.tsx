"use client";

import { brandChartColors } from "@/config/brand";
import { cn } from "@/lib/utils";

type BarPoint = {
  label: string;
  value: number;
};

type AdminVerticalBarChartProps = {
  data: BarPoint[];
  formatValue?: (value: number) => string;
  colorIndex?: number;
  className?: string;
};

export function AdminVerticalBarChart({
  data,
  formatValue = (v) => String(v),
  colorIndex = 0,
  className,
}: AdminVerticalBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const color = brandChartColors[colorIndex % brandChartColors.length];

  if (data.every((d) => d.value === 0)) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>No data yet.</p>
    );
  }

  return (
    <div className={cn("flex h-48 items-end justify-between gap-2", className)}>
      {data.map((point) => {
        const height = Math.max((point.value / max) * 100, point.value > 0 ? 8 : 0);
        return (
          <div
            key={point.label}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <span className="text-[10px] font-medium text-muted-foreground">
              {formatValue(point.value)}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                  minHeight: point.value > 0 ? "0.5rem" : 0,
                }}
                title={`${point.label}: ${formatValue(point.value)}`}
              />
            </div>
            <span className="truncate text-xs text-muted-foreground">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}
