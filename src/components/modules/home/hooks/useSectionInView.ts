"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
};

export function useSectionInView({
  rootMargin = "-10% 0px -10% 0px",
  threshold = 0.15,
  triggerOnce = true,
}: Options = {}) {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node) return;
      if (triggerOnce && hasTriggeredRef.current) {
        setInView(true);
        return;
      }

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            hasTriggeredRef.current = true;
            if (triggerOnce) observerRef.current?.disconnect();
          } else if (!triggerOnce) {
            setInView(false);
          }
        },
        { rootMargin, threshold },
      );

      observerRef.current.observe(node);
    },
    [rootMargin, threshold, triggerOnce],
  );

  return { ref, inView };
}
