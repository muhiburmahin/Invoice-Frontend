"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Link2,
  Pencil,
  RefreshCw,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ClientForm } from "@/components/modules/clients/ClientForm";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/config/env";
import {
  useClient,
  useDeleteClient,
  useRegeneratePortalToken,
  useRestoreClient,
  useUpdateClientStatus,
} from "@/hooks/useClients";
import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

type ClientDetailProps = {
  clientId: string;
};

export function ClientDetail({ clientId }: ClientDetailProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useClient(clientId);
  const updateStatus = useUpdateClientStatus();
  const deleteClient = useDeleteClient();
  const restoreClient = useRestoreClient();
  const regeneratePortal = useRegeneratePortalToken();
  const [isEditing, setIsEditing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  if (isLoading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">
            Could not load client. It may have been deleted.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" render={<Link href="/clients" />}>
              <ArrowLeft className="size-4" />
              Back to clients
            </Button>
            <Button
              onClick={() => void refetch()}
              className="bg-brand text-brand-foreground"
            >
              <RefreshCw className="size-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { client, stats } = data;
  const isDeleted = Boolean(client.deletedAt);
  const currency = client.currency ?? "USD";

  async function handleToggleStatus() {
    setIsBusy(true);
    try {
      const result = await updateStatus.mutateAsync({
        id: client.id,
        isActive: !client.isActive,
      });
      toast.success(result.message ?? "Status updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${client.name}? This can be restored later.`)) return;
    setIsBusy(true);
    try {
      await deleteClient.mutateAsync(client.id);
      toast.success("Client deleted");
      router.push("/clients");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRestore() {
    setIsBusy(true);
    try {
      const result = await restoreClient.mutateAsync(client.id);
      toast.success(result.message ?? "Client restored");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  }

  async function handlePortalLink() {
    setIsBusy(true);
    try {
      const result = await regeneratePortal.mutateAsync(client.id);
      const url = `${env.appUrl}/portal/${result.portalToken}`;
      await navigator.clipboard.writeText(url);
      toast.success("Portal link copied to clipboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="-ml-2 w-fit" render={<Link href="/clients" />}>
            <ArrowLeft className="size-4" />
            Back to clients
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
            <Badge variant={isDeleted ? "destructive" : client.isActive ? "secondary" : "outline"}>
              {isDeleted ? "Deleted" : client.isActive ? "Active" : "Inactive"}
            </Badge>
            {client.portalEnabled ? <Badge variant="outline">Portal enabled</Badge> : null}
          </div>
          <p className="text-sm text-muted-foreground">{client.email}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isDeleted ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing((value) => !value)}
              >
                <Pencil className="size-4" />
                {isEditing ? "Cancel edit" : "Edit"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isBusy}
                onClick={() => void handleToggleStatus()}
              >
                {client.isActive ? (
                  <UserX className="size-4" />
                ) : (
                  <UserCheck className="size-4" />
                )}
                {client.isActive ? "Deactivate" : "Activate"}
              </Button>
              {client.portalEnabled ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => void handlePortalLink()}
                >
                  <Link2 className="size-4" />
                  Copy portal link
                </Button>
              ) : null}
              <Button
                variant="destructive"
                size="sm"
                disabled={isBusy}
                onClick={() => void handleDelete()}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              disabled={isBusy}
              className="bg-brand text-brand-foreground"
              onClick={() => void handleRestore()}
            >
              <RefreshCw className="size-4" />
              Restore client
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <Card className="border-brand-secondary/50">
          <CardHeader>
            <CardTitle>Edit client</CardTitle>
            <CardDescription>Update contact details and portal access.</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientForm
              mode="edit"
              client={client}
              onSuccess={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Invoices</CardDescription>
            <CardTitle className="text-2xl">{stats.invoices}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total invoiced</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(stats.totalInvoiced, currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outstanding</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(stats.outstandingBalance, currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Recurring schedules</CardDescription>
            <CardTitle className="text-2xl">{stats.activeRecurringSchedules}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-brand-secondary/50">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Company" value={client.company} />
            <InfoRow label="Phone" value={client.phone} />
            <InfoRow label="Address" value={client.address} />
            <InfoRow
              label="Location"
              value={[client.city, client.state, client.country, client.zipCode]
                .filter(Boolean)
                .join(", ")}
            />
            <InfoRow label="Tax number" value={client.taxNumber} />
            <InfoRow label="Currency" value={client.currency} />
          </CardContent>
        </Card>

        <Card className="border-brand-secondary/50">
          <CardHeader>
            <CardTitle>Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Created" value={formatDate(client.createdAt)} />
            <InfoRow label="Updated" value={formatDate(client.updatedAt)} />
            {client.tags.length > 0 ? (
              <div>
                <p className="text-muted-foreground">Tags</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {client.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
            {client.notes ? (
              <div>
                <p className="text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-wrap">{client.notes}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="border-brand-secondary/50">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" render={<Link href="/invoices/new" />}>
            Create invoice
          </Button>
          {client.email ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(client.email);
                toast.success("Email copied");
              }}
            >
              <Copy className="size-4" />
              Copy email
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
