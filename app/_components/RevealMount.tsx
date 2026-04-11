"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Watches every `.reveal` element on the page and toggles `.is-visible`
 * when each enters the viewport.
 *
 * IMPORTANT: we re-run on every pathname change. Without that, client-side
 * navigations would mount new `.reveal` nodes that nothing is observing,
 * and sub-pages would appear permanently blank.
 *
 * Safety net: on the next animation frame, any element already inside the
 * initial viewport is marked visible immediately, so above-the-fold content
 * cannot stall if the observer callback is delayed by a few ticks.
 */
export function RevealMount() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nodes = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
    if (nodes.length === 0) return;

    // Respect reduced-motion — show everything, no animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    // Reveal anything already inside the initial viewport, on the next frame.
    const frame = requestAnimationFrame(() => {
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          node.classList.add("is-visible");
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    nodes.forEach((node) => {
      if (!node.classList.contains("is-visible")) observer.observe(node);
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
