import { BusinessForm } from "@/components/modules/settings/BusinessForm";
import { SettingsNav } from "@/components/modules/settings/SettingsNav";

export const metadata = {
  title: "Business Settings",
  description: "Company profile, invoice defaults, and branding.",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Business settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Company profile, invoice defaults, and branding for your workspace.
        </p>
      </div>
      <SettingsNav />
      <BusinessForm />
    </div>
  );
}
