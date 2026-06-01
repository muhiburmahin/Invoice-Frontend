import { Skeleton } from "@/components/ui/skeleton";

type LoadingSkeletonProps = {
  rows?: number;
};

export function LoadingSkeleton({ rows = 4 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-2xl bg-brand-secondary/40" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl bg-brand-secondary/30" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl bg-brand-secondary/30" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={`r-${i}`} className="h-20 rounded-xl bg-brand-secondary/20" />
      ))}
    </div>
  );
}
