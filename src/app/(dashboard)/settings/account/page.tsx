import { AccountSettings } from "@/components/modules/settings/AccountSettings";

export const metadata = {
  title: "Account",
  description: "Profile, password, sessions, and account deletion.",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Profile, security, and active sessions.
        </p>
      </div>
      <AccountSettings />
    </div>
  );
}
