import { RecurringPage } from "@/components/modules/recurring/RecurringPage";

export const metadata = {
  title: "Recurring Invoices",
  description: "Automated invoice schedules for retainers and subscriptions.",
};

export default function Page() {
  return <RecurringPage />;
}
