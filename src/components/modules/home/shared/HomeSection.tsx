import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HomeSectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  innerClassName?: string;
};

export function HomeSection({ id, className, innerClassName, children }: HomeSectionProps) {
  return (
    <section id={id} className={cn("px-4 py-16 md:px-8 md:py-24", className)}>
      <div className={cn("mx-auto max-w-6xl", innerClassName)}>{children}</div>
    </section>
  );
}
