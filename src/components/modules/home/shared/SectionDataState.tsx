import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SectionDataStateProps = {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  loadingFallback?: ReactNode;
  errorMessage?: string;
  emptyMessage?: string;
  children: ReactNode;
  className?: string;
};

export function SectionDataState({
  isLoading,
  isError,
  isEmpty = false,
  loadingFallback,
  errorMessage = "Data not found",
  emptyMessage = "Data not found",
  children,
  className,
}: SectionDataStateProps) {
  if (isLoading) {
    return (
      <div className={className}>
        {loadingFallback ?? <Skeleton className="h-10 w-full max-w-xs mx-auto rounded-lg" />}
      </div>
    );
  }

  if (isError) {
    return (
      <p
        className={cn(
          "text-center text-sm font-medium text-muted-foreground",
          className,
        )}
        role="status"
      >
        {errorMessage}
      </p>
    );
  }

  if (isEmpty) {
    return (
      <p
        className={cn(
          "text-center text-sm font-medium text-muted-foreground",
          className,
        )}
        role="status"
      >
        {emptyMessage}
      </p>
    );
  }

  return <>{children}</>;
}

type StatDisplayProps = {
  isLoading: boolean;
  isError: boolean;
  value: string;
  className?: string;
};

export function StatDisplay({ isLoading, isError, value, className }: StatDisplayProps) {
  if (isLoading) {
    return <Skeleton className={cn("mx-auto h-10 w-24 rounded-lg", className)} />;
  }
  if (isError) {
    return (
      <p className={cn("text-sm font-medium text-muted-foreground", className)}>Data not found</p>
    );
  }
  return (
    <p className={cn("text-3xl font-black tabular-nums text-brand md:text-4xl", className)}>
      {value}
    </p>
  );
}
