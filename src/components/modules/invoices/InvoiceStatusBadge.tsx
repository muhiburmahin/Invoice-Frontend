import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-status-paid",
  SENT: "bg-status-pending",
  PARTIALLY_PAID: "bg-status-pending",
  DRAFT: "bg-brand-secondary text-brand-secondary-foreground",
  OVERDUE: "bg-status-overdue",
  CANCELLED: "bg-muted text-muted-foreground",
  VOID: "bg-muted text-muted-foreground",
};

type InvoiceStatusBadgeProps = {
  status: string;
  className?: string;
};

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
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
