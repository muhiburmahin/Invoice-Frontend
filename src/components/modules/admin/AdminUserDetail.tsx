"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
  Shield,
  Trash2,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

import { SupportAccessBanner } from "@/components/modules/admin/SupportAccessBanner";
import { SimpleModal } from "@/components/shared/SimpleModal";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAdminUser,
  useDeleteAdminUser,
  useTriggerPasswordReset,
  useUpdateAdminUserPlan,
  useUpdateAdminUserRole,
  useUpdateAdminUserStatus,
} from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { isSuperAdmin } from "@/lib/roles";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SubscriptionPlan, UserRole } from "@/types";

type AdminUserDetailProps = {
  id: string;
};

export function AdminUserDetail({ id }: AdminUserDetailProps) {
  const { user: actor } = useAuth();
  const superAdmin = isSuperAdmin(actor?.role);
  const { data, isLoading, isError } = useAdminUser(id);

  const updateStatus = useUpdateAdminUserStatus();
  const updateRole = useUpdateAdminUserRole();
  const updatePlan = useUpdateAdminUserPlan();
  const deleteUser = useDeleteAdminUser();
  const resetPassword = useTriggerPasswordReset();

  const [planOpen, setPlanOpen] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan>("FREE");
  const [roleOpen, setRoleOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("USER");

  const user = data?.user;
  const stats = data?.stats;

  if (isLoading) return <LoadingSkeleton rows={6} />;

  if (isError || !user || !stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          User not found.
        </CardContent>
      </Card>
    );
  }

  async function handleToggleStatus() {
    try {
      const result = await updateStatus.mutateAsync({
        id: user!.id,
        body: { isActive: !user!.isActive },
      });
      toast.success(result.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleResetPassword() {
    try {
      const result = await resetPassword.mutateAsync(user!.id);
      toast.success(result.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete ${user!.email}? This soft-deletes the account.`)) return;
    try {
      const result = await deleteUser.mutateAsync(user!.id);
      toast.success(result.message);
      window.location.href = "/admin/users";
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleSavePlan() {
    try {
      const result = await updatePlan.mutateAsync({
        id: user!.id,
        body: { plan },
      });
      toast.success(result.message);
      setPlanOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleSaveRole() {
    try {
      const result = await updateRole.mutateAsync({
        id: user!.id,
        body: { role },
      });
      toast.success(result.message);
      setRoleOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/admin/users" />}>
        <ArrowLeft className="size-4" />
        All users
      </Button>

      <SupportAccessBanner context="user-detail" />

      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="secondary">{user.role}</Badge>
          <Badge>{user.subscription?.plan ?? "FREE"}</Badge>
          {user.deletedAt ? (
            <Badge variant="destructive">Deleted</Badge>
          ) : user.isActive ? (
            <Badge>Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
          {user.isVerified ? null : (
            <Badge variant="outline">Unverified</Badge>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.invoices}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Clients</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.clients}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Paid total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatCurrency(stats.paidTotal)}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <p>Joined: {formatDate(user.createdAt)}</p>
          <p>Last login: {user.lastLoginAt ? formatDate(user.lastLoginAt) : "—"}</p>
          <p>Login count: {user.loginCount}</p>
          {user.business ? (
            <p>Business: {(user.business as { name?: string }).name ?? "—"}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            {superAdmin
              ? "Full admin actions available."
              : "Support can send a password reset email only."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void handleResetPassword()}>
            <KeyRound className="size-4" />
            Send reset email
          </Button>
          {superAdmin ? (
            <>
              <Button variant="outline" onClick={() => void handleToggleStatus()}>
                <Shield className="size-4" />
                {user.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRole(user.role);
                  setRoleOpen(true);
                }}
              >
                <UserCog className="size-4" />
                Change role
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPlan(user.subscription?.plan ?? "FREE");
                  setPlanOpen(true);
                }}
              >
                Change plan
              </Button>
              <Button variant="destructive" onClick={() => void handleDelete()}>
                <Trash2 className="size-4" />
                Delete user
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>

      <SimpleModal
        open={planOpen}
        onClose={() => setPlanOpen(false)}
        title="Change plan"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPlanOpen(false)}>Cancel</Button>
            <Button
              className="bg-brand text-brand-foreground"
              disabled={updatePlan.isPending}
              onClick={() => void handleSavePlan()}
            >
              {updatePlan.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Save
            </Button>
          </div>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="admin-plan">Plan</Label>
          <select
            id="admin-plan"
            className="h-8 w-full rounded-lg border border-input px-2.5 text-sm"
            value={plan}
            onChange={(e) => setPlan(e.target.value as SubscriptionPlan)}
          >
            <option value="FREE">FREE</option>
            <option value="PRO">PRO</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
          </select>
        </div>
      </SimpleModal>

      <SimpleModal
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        title="Change role"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRoleOpen(false)}>Cancel</Button>
            <Button
              className="bg-brand text-brand-foreground"
              disabled={updateRole.isPending}
              onClick={() => void handleSaveRole()}
            >
              Save
            </Button>
          </div>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="admin-role">Role</Label>
          <select
            id="admin-role"
            className="h-8 w-full rounded-lg border border-input px-2.5 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="USER">USER</option>
            <option value="SUPPORT">SUPPORT</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
        </div>
      </SimpleModal>
    </div>
  );
}
