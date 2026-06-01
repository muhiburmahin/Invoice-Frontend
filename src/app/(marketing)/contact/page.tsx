import Link from "next/link";

import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  return (
    <MarketingPageShell
      title="Contact"
      description="Questions about billing, onboarding, or enterprise? We're here to help."
    >
      <p className="text-sm text-muted-foreground">
        Email{" "}
        <a href="mailto:support@invoice.app" className="font-medium text-brand hover:underline">
          support@invoice.app
        </a>{" "}
        or start with a free account and explore the product.
      </p>
      <Link href="/auth/register" className={cn(buttonVariants({ variant: "outline" }))}>
        Create account
      </Link>
    </MarketingPageShell>
  );
}
