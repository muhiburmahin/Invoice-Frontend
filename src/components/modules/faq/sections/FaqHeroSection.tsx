"use client";

import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";

import { useFaqSection } from "@/components/modules/faq/hooks/useFaqSection";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { StatDisplay } from "@/components/modules/home/shared/SectionDataState";
import { buttonVariants } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/config/public-routes";
import { cn } from "@/lib/utils";

export function FaqHeroSection() {
  const { faq, isLoading, isError } = useFaqSection({ immediate: true });

  return (
    <section className="relative overflow-hidden border-b border-brand-secondary/30 bg-gradient-to-b from-brand-muted/40 to-background px-4 py-16 md:px-8 md:py-20">
      <div
        className="home-float-orb pointer-events-none absolute -right-24 top-8 size-72 rounded-full bg-brand/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <AnimatedReveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-secondary/60 bg-card px-3 py-1 text-sm font-medium text-brand shadow-sm">
            <HelpCircle className="size-4" aria-hidden />
            FAQ
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
            Questions?{" "}
            <span className="bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">
              We&apos;ve got answers.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Search or browse by category — all content is loaded from our help API.
          </p>
        </AnimatedReveal>

        <AnimatedReveal delayMs={120} className="mt-8">
          <StatDisplay
            isLoading={isLoading}
            isError={isError}
            value={String(faq.length)}
            className="!text-4xl"
          />
          <p className="mt-1 text-sm text-muted-foreground">articles in this FAQ</p>
        </AnimatedReveal>

        <AnimatedReveal delayMs={180} className="mt-8">
          <Link
            href={AUTH_ROUTES.register}
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-brand px-8 font-bold text-brand-foreground shadow-lg shadow-brand/25",
            )}
          >
            Get started free
            <ArrowRight className="size-4" />
          </Link>
        </AnimatedReveal>
      </div>
    </section>
  );
}
