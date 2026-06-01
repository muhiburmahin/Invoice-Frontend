/** Static marketing copy — dynamic stats/plans/FAQ come from the API. */

export const HOME_BENEFITS = [
  {
    title: "Fast invoicing & PDF",
    description: "Professional templates, line items, tax, discounts, and one-click PDF export.",
  },
  {
    title: "Client portal & online pay",
    description: "Share a secure link so clients view, download, and pay without email chains.",
  },
  {
    title: "Payment tracking & Stripe",
    description: "Record partial payments, sync Stripe checkout, and see balance due in real time.",
  },
  {
    title: "Recurring invoices",
    description: "Automate weekly, monthly, or quarterly billing for retainers and subscriptions.",
  },
  {
    title: "Reminders & overdue",
    description: "Know what's late, send reminders, and keep cash flow predictable.",
  },
  {
    title: "Branding & multi-currency",
    description: "Your logo, colors, and currency — built for local and international clients.",
  },
] as const;

export const HOME_STEPS = [
  {
    step: "1",
    title: "Create your account",
    description: "Add your business profile in under two minutes.",
  },
  {
    step: "2",
    title: "Send an invoice",
    description: "Add clients, line items, and email or share the portal link.",
  },
  {
    step: "3",
    title: "Get paid",
    description: "Accept Stripe payments or mark bank transfers — we track the rest.",
  },
] as const;
