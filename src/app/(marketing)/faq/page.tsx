import { MarketingPageShell } from "@/components/layout/MarketingPageShell";

const faqs = [
  {
    q: "Can I send invoices without a paid plan?",
    a: "Yes. The Free plan includes core invoicing and client management with usage limits.",
  },
  {
    q: "Do clients need an account?",
    a: "No. Clients access invoices through a secure portal link you share.",
  },
  {
    q: "Which payment methods are supported?",
    a: "Stripe checkout, bank transfer, and manual payment recording.",
  },
];

export default function FaqPage() {
  return (
    <MarketingPageShell
      title="FAQ"
      description="Quick answers about plans, payments, and the client portal."
    >
      {faqs.map((item) => (
        <div key={item.q} className="rounded-xl border border-brand-secondary/40 p-4">
          <h2 className="font-medium text-foreground">{item.q}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
        </div>
      ))}
    </MarketingPageShell>
  );
}
