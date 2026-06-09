import { FaqPage } from "@/components/modules/faq/FaqPage";

export const metadata = {
  title: "FAQ | Invoice SaaS",
  description:
    "Answers about plans, billing, Stripe, the client portal, and your account — searchable FAQ.",
};

export default function Page() {
  return <FaqPage />;
}
