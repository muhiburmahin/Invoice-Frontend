"use client";

import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { SettingsNav } from "@/components/modules/settings/SettingsNav";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useDeleteNotification,
  useDeleteReadNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";
import { getApiErrorMessage } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";

type Filter = "all" | "unread" | "read";

export function NotificationsPanel() {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  const listParams = {
    page,
    limit: 20,
    isRead: filter === "all" ? undefined : filter === "read",
    sortBy: "createdAt" as const,
    sortOrder: "desc" as const,
  };

  const { data, isLoading, isError, refetch, isFetching } =
    useNotifications(listParams);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteOne = useDeleteNotification();
  const deleteRead = useDeleteReadNotifications();

  const notifications = data?.notifications ?? [];
  const meta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };

  const handleMarkRead = async (id: string) => {
    try {
      await markRead.mutateAsync(id);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const result = await markAllRead.mutateAsync();
      toast.success(result.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOne.mutateAsync(id);
      toast.success("Notification removed");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleClearRead = async () => {
    try {
      const result = await deleteRead.mutateAsync();
      toast.success(result.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <SettingsNav />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Alerts for invoices, payments, and subscription events.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleMarkAllRead()}
            disabled={markAllRead.isPending}
          >
            {markAllRead.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCheck className="size-4" />
            )}
            Mark all read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleClearRead()}
            disabled={deleteRead.isPending}
          >
            {deleteRead.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Clear read
          </Button>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg border bg-muted/30 p-1 w-fit">
        {(["all", "unread", "read"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setFilter(value);
              setPage(1);
            }}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {isLoading && !data ? (
        <LoadingSkeleton rows={5} />
      ) : isError ? (
        <Card className="border-destructive/50">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Could not load notifications.
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Bell className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {filter === "unread"
                ? "No unread notifications"
                : filter === "read"
                  ? "No read notifications"
                  : "You're all caught up"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                !notification.isRead && "border-brand/30 bg-brand-muted/10",
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base">{notification.title}</CardTitle>
                  <CardDescription>{notification.message}</CardDescription>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(notification.createdAt, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!notification.isRead ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleMarkRead(notification.id)}
                      disabled={markRead.isPending}
                    >
                      <CheckCheck className="size-4" />
                      Read
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleDelete(notification.id)}
                    disabled={deleteOne.isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {meta.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
