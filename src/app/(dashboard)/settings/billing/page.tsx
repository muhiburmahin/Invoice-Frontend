import { Suspense } from "react";

import { BillingPanel } from "@/components/modules/settings/BillingPanel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export const metadata = {
  title: "Billing",
  description: "Subscription plan, usage, and Stripe billing portal.",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your plan, usage limits, and payment management.
        </p>
      </div>
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <BillingPanel />
      </Suspense>
    </div>
  );
}
