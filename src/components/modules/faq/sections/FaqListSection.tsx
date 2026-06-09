"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { useFaqSection } from "@/components/modules/faq/hooks/useFaqSection";
import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionDataState } from "@/components/modules/home/shared/SectionDataState";
import { Input } from "@/components/ui/input";
import { FaqSkeleton } from "@/components/modules/features/shared/SectionSkeletons";
import { cn } from "@/lib/utils";

export function FaqListSection() {
  const { ref, faq, categories, isLoading, isError } = useFaqSection();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faq.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [faq, query, activeCategory]);

  return (
    <HomeSection>
      <div ref={ref} className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search questions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-brand-secondary/60 pl-10 focus-visible:ring-brand"
              aria-label="Search FAQ"
              disabled={isLoading || isError}
            />
          </div>
        </AnimatedReveal>

        <SectionDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && faq.length === 0}
          className="mt-8"
          loadingFallback={<FaqSkeleton count={6} />}
        >
          {!isLoading && !isError && categories.length > 0 ? (
            <AnimatedReveal delayMs={60} className="mt-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                    activeCategory === cat.id
                      ? "border-brand bg-brand text-brand-foreground shadow-sm"
                      : "border-brand-secondary/50 bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </AnimatedReveal>
          ) : null}

          <div className="mt-8 space-y-3">
            {filtered.length === 0 && !isLoading && !isError ? (
              <p className="py-8 text-center text-sm text-muted-foreground" role="status">
                {faq.length === 0
                  ? "Data not found"
                  : "No questions match your search. Try another keyword or category."}
              </p>
            ) : (
              filtered.map((item, index) => (
                <AnimatedReveal key={item.q} delayMs={Math.min(index * 40, 320)}>
                  <details
                    className="group rounded-xl border border-brand-secondary/50 bg-card px-5 py-4 shadow-sm transition-all open:border-brand/30 open:shadow-md hover:border-brand/20"
                  >
                    <summary className="cursor-pointer list-none pr-6 font-semibold text-foreground transition-colors group-open:text-brand marker:content-none [&::-webkit-details-marker]:hidden">
                      {item.q}
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                  </details>
                </AnimatedReveal>
              ))
            )}
          </div>

          <AnimatedReveal delayMs={100} className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/pricing" className="font-medium text-brand hover:underline">
              View pricing
            </Link>
            <Link href="/features" className="font-medium text-brand hover:underline">
              See features
            </Link>
            <Link href="/contact" className="font-medium text-brand hover:underline">
              Contact support
            </Link>
          </AnimatedReveal>
        </SectionDataState>
      </div>
    </HomeSection>
  );
}
