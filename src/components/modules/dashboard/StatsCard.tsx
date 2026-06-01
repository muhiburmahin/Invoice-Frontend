import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = "neutral",
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "border-brand-secondary/50 transition-shadow hover:shadow-md hover:shadow-brand/5",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-brand-secondary text-brand">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        {subtitle ? (
          <p
            className={cn(
              "mt-1 text-xs",
              trend === "up" && "text-brand-success",
              trend === "down" && "text-brand-danger",
              trend === "neutral" && "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
