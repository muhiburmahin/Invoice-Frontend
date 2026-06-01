import { MarketingPageShell } from "@/components/layout/MarketingPageShell";

export default function TermsPage() {
  return (
    <MarketingPageShell
      title="Terms of service"
      description="Usage terms for Invoice SaaS. Full legal copy will be published before production launch."
    >
      <p className="text-sm text-muted-foreground">
        By using Invoice you agree to acceptable use of the platform, billing terms for paid plans,
        and responsibility for content you send to your clients.
      </p>
    </MarketingPageShell>
  );
}
