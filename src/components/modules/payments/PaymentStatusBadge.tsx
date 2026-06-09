import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-status-paid",
  PENDING: "bg-status-pending",
  FAILED: "bg-status-overdue",
  REFUNDED: "bg-muted text-muted-foreground",
  DISPUTED: "bg-warning/20 text-warning",
};

type PaymentStatusBadgeProps = {
  status: string;
  className?: string;
};

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        style,
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
