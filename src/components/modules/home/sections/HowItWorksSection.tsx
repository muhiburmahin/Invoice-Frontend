"use client";

import { AnimatedReveal } from "@/components/modules/home/shared/AnimatedReveal";
import { HomeSection } from "@/components/modules/home/shared/HomeSection";
import { SectionTitle } from "@/components/modules/home/shared/SectionTitle";
import { HOME_STEPS } from "@/config/home-content";

export function HowItWorksSection() {
  return (
    <HomeSection>
      <AnimatedReveal>
        <SectionTitle
          eyebrow="How it works"
          title="Get paid in three steps"
          description="No steep learning curve. Set up once, invoice on repeat."
        />
      </AnimatedReveal>
      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {HOME_STEPS.map((item, index) => (
          <li key={item.step}>
            <AnimatedReveal delayMs={index * 100}>
              <div className="relative text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand text-lg font-bold text-brand-foreground shadow-md shadow-brand/20 transition-transform duration-300 hover:scale-110">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </AnimatedReveal>
          </li>
        ))}
      </ol>
    </HomeSection>
  );
}
