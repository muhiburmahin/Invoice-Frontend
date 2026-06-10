"use client";

import { Check, X } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import {
  getPasswordRequirements,
  passwordStrengthLabel,
  passwordStrengthPercent,
} from "@/lib/password";
import { cn } from "@/lib/utils";

type PasswordStrengthIndicatorProps = {
  password: string;
  hints?: { id: string; label: string }[];
};

export function PasswordStrengthIndicator({
  password,
  hints,
}: PasswordStrengthIndicatorProps) {
  const requirements = getPasswordRequirements(password);
  const percent = passwordStrengthPercent(requirements);
  const label = passwordStrengthLabel(percent);

  const items =
    hints?.map((hint) => {
      const match = requirements.find((r) => r.id === hint.id);
      return match ?? { ...hint, met: false };
    }) ?? requirements;

  if (!password) {
    return (
      <ul className="space-y-1 text-xs text-muted-foreground">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <span className="size-3.5 shrink-0 rounded-full border border-muted-foreground/40" />
            {item.label}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">Password strength</span>
        <span
          className={cn(
            "font-medium",
            percent === 100 && "text-success",
            percent >= 50 && percent < 100 && "text-warning",
            percent < 50 && "text-destructive",
          )}
        >
          {label}
        </span>
      </div>
      <Progress value={percent} className="h-1.5" />
      <ul className="space-y-1 text-xs">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex items-center gap-2",
              item.met ? "text-success" : "text-muted-foreground",
            )}
          >
            {item.met ? (
              <Check className="size-3.5 shrink-0" aria-hidden />
            ) : (
              <X className="size-3.5 shrink-0 opacity-50" aria-hidden />
            )}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
