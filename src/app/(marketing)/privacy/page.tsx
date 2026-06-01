import { MarketingPageShell } from "@/components/layout/MarketingPageShell";

export default function PrivacyPage() {
  return (
    <MarketingPageShell
      title="Privacy policy"
      description="We respect your data. This page will be updated with full legal text before production launch."
    >
      <p className="text-sm text-muted-foreground">
        We collect only what is needed to run your account, process invoices, and improve the
        product. Contact us if you have questions about data handling.
      </p>
    </MarketingPageShell>
  );
}
