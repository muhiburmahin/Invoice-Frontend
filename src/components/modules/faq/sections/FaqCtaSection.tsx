"use client";

import Link from "next/link";

import { useFaqSection } from "@/components/modules/faq/hooks/useFaqSection";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { buttonVariants } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/config/public-routes";
import { cn } from "@/lib/utils";

export function FaqCtaSection() {
  const { ref } = useFaqSection();

  return (
    <HomeSection className="pb-20 md:pb-28">
      <div ref={ref}>
        <AnimatedReveal>
          <div className="relative overflow-hidden rounded-3xl border border-brand-secondary/40 bg-gradient-to-br from-card via-brand-muted/30 to-card px-6 py-12 text-center shadow-lg md:px-12">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Still need help?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Start free and explore the product, or reach out for billing and enterprise
              questions.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={AUTH_ROUTES.register}
                className={cn(
                  buttonVariants(),
                  "bg-brand text-brand-foreground hover:bg-brand/90 hover:text-brand-foreground",
                )}
              >
                Create account
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "hover:bg-brand-secondary/40 hover:text-brand",
                )}
              >
                Contact us
              </Link>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </HomeSection>
  );
}
