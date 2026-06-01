import { MarketingPageShell } from "@/components/layout/MarketingPageShell";

export default function FeaturesPage() {
  return (
    <MarketingPageShell
      title="Features"
      description="Everything you need to run invoicing for your business or freelance practice."
    >
      <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
        <li>Professional invoices with PDF export</li>
        <li>Client management & client portal</li>
        <li>Payment tracking & Stripe checkout</li>
        <li>Recurring invoices & reminders</li>
        <li>Business branding & multi-currency</li>
      </ul>
    </MarketingPageShell>
  );
}
