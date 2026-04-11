"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that watches every element carrying
 * the .reveal utility class and toggles .is-visible when they enter the
 * viewport. This avoids splattering individual client components across
 * the tree — we stay with Server Components everywhere else.
 *
 * The component renders nothing; it only exists for the effect.
 */
export function RevealMount() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    const nodes = document.querySelectorAll<HTMLElement>(".reveal");
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  return null;
}
