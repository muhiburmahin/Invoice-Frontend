"use client";

import type { ReactNode } from "react";

import { useSectionInView } from "@/components/modules/home/hooks/useSectionInView";
import { cn } from "@/lib/utils";

type AnimatedRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export function AnimatedReveal({ children, className, delayMs = 0 }: AnimatedRevealProps) {
  const { ref, inView } = useSectionInView({ threshold: 0.12 });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
