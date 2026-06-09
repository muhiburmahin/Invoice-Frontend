"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Loader2,
  LogOut,
  Monitor,
  RefreshCw,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { SettingsNav } from "@/components/modules/settings/SettingsNav";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { SimpleModal } from "@/components/shared/SimpleModal";
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
import { AUTH_ROUTES } from "@/config/public-routes";
import {
  useChangePassword,
  useDeleteAccount,
  useRevokeOtherSessions,
  useRevokeSession,
  useSessions,
  useUpdateProfile,
} from "@/hooks/useAccount";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import {
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
  type ChangePasswordFormInput,
  type DeleteAccountFormInput,
  type UpdateProfileFormInput,
} from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const fieldClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30";

function shortenUserAgent(ua: string | null): string {
  if (!ua) return "Unknown device";
  if (ua.length <= 72) return ua;
  return `${ua.slice(0, 69)}…`;
}

export function AccountSettings() {
  const router = useRouter();
  const { user } = useAuth();
  const reset = useAuthStore((s) => s.reset);

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const revokeSessionMutation = useRevokeSession();
  const revokeOthersMutation = useRevokeOtherSessions();
  const deleteAccountMutation = useDeleteAccount();

  const sessionsQuery = useSessions();
  const sessions = sessionsQuery.data?.sessions ?? [];

  const [deleteOpen, setDeleteOpen] = useState(false);

  const profileForm = useForm<UpdateProfileFormInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: "", avatar: "" },
  });

  const passwordForm = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: true,
    },
  });

  const deleteForm = useForm<DeleteAccountFormInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "", confirm: "" as "DELETE" },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        avatar: user.avatar ?? "",
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = profileForm.handleSubmit(async (values) => {
    if (!user) return;

    const payload: { name?: string; avatar?: string } = {};
    if (values.name.trim() !== user.name) payload.name = values.name.trim();
    const avatarValue = values.avatar.trim();
    const currentAvatar = user.avatar ?? "";
    if (avatarValue !== currentAvatar) payload.avatar = avatarValue;

    if (Object.keys(payload).length === 0) {
      toast.message("No changes to save");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync(payload);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
    try {
      await changePasswordMutation.mutateAsync(values);
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        revokeOtherSessions: true,
      });
      toast.success("Password changed");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  const onDeleteSubmit = deleteForm.handleSubmit(async (values) => {
    try {
      await deleteAccountMutation.mutateAsync({
        confirm: values.confirm,
        password: values.password?.trim() || undefined,
      });
      reset();
      toast.success("Account deleted");
      router.replace(AUTH_ROUTES.login);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  if (!user) {
    return (
      <div className="space-y-6">
        <SettingsNav />
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsNav />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Profile
          </CardTitle>
          <CardDescription>Update your display name and avatar URL.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onProfileSubmit} className="max-w-md space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                className={fieldClassName}
                {...profileForm.register("name")}
              />
              {profileForm.formState.errors.name ? (
                <p className="text-xs text-destructive">
                  {profileForm.formState.errors.name.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                className={fieldClassName}
                placeholder="https://…"
                {...profileForm.register("avatar")}
              />
              {profileForm.formState.errors.avatar ? (
                <p className="text-xs text-destructive">
                  {profileForm.formState.errors.avatar.message}
                </p>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">Email: {user.email}</p>
            <Button
              type="submit"
              className="bg-brand text-brand-foreground"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Change password
          </CardTitle>
          <CardDescription>
            Use a strong password. You can sign out other devices after changing it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onPasswordSubmit} className="max-w-md space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                className={fieldClassName}
                {...passwordForm.register("currentPassword")}
              />
              {passwordForm.formState.errors.currentPassword ? (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                className={fieldClassName}
                {...passwordForm.register("newPassword")}
              />
              {passwordForm.formState.errors.newPassword ? (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={fieldClassName}
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword ? (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              ) : null}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 rounded border-input"
                {...passwordForm.register("revokeOtherSessions")}
              />
              Sign out all other sessions
            </label>
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="size-5" />
              Active sessions
            </CardTitle>
            <CardDescription>
              Devices signed in to your account. Revoke any you do not recognize.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void sessionsQuery.refetch()}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessionsQuery.isLoading ? (
            <LoadingSkeleton rows={2} />
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active sessions.</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium">
                    {shortenUserAgent(session.userAgent)}
                    {session.isCurrent ? (
                      <span className="ml-2 rounded bg-brand-muted px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                        This device
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.ipAddress ?? "Unknown IP"} · Last active{" "}
                    {formatDate(session.updatedAt)}
                  </p>
                </div>
                {!session.isCurrent ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={revokeSessionMutation.isPending}
                    onClick={async () => {
                      try {
                        await revokeSessionMutation.mutateAsync(session.id);
                        toast.success("Session revoked");
                      } catch (error) {
                        toast.error(getApiErrorMessage(error));
                      }
                    }}
                  >
                    <LogOut className="size-4" />
                    Revoke
                  </Button>
                ) : null}
              </div>
            ))
          )}
          {sessions.some((s) => !s.isCurrent) ? (
            <Button
              variant="outline"
              disabled={revokeOthersMutation.isPending}
              onClick={async () => {
                try {
                  const result = await revokeOthersMutation.mutateAsync();
                  toast.success(result.message);
                } catch (error) {
                  toast.error(getApiErrorMessage(error));
                }
              }}
            >
              {revokeOthersMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              Sign out other devices
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            Delete account
          </CardTitle>
          <CardDescription>
            Permanently remove your account and workspace data. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="size-4" />
            Delete my account
          </Button>
        </CardContent>
      </Card>

      <SimpleModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          deleteForm.reset({ password: "", confirm: "" as "DELETE" });
        }}
        title="Delete account"
        description='Type DELETE to confirm. Password is required if you signed up with email.'
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteAccountMutation.isPending}
              onClick={() => void onDeleteSubmit()}
            >
              {deleteAccountMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Delete permanently
            </Button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={onDeleteSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="delete-confirm">Confirmation</Label>
            <Input
              id="delete-confirm"
              className={fieldClassName}
              placeholder="DELETE"
              {...deleteForm.register("confirm")}
            />
            {deleteForm.formState.errors.confirm ? (
              <p className="text-xs text-destructive">
                {deleteForm.formState.errors.confirm.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="delete-password">Password (if applicable)</Label>
            <Input
              id="delete-password"
              type="password"
              autoComplete="current-password"
              className={fieldClassName}
              {...deleteForm.register("password")}
            />
          </div>
        </form>
      </SimpleModal>
    </div>
  );
}
