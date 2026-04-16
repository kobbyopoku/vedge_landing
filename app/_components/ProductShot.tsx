import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { Kicker } from "./Kicker";

/**
 * Full-bleed editorial screenshot section used on Solutions pages.
 *
 * Takes a single wide screenshot, wraps it in a soft frame with the same
 * shadow treatment as the dropdown panel and mobile hero, and pairs it with
 * a left-rail kicker + caption. Sits between the capability grid and the
 * workflow section on each Solutions page.
 *
 * {@link title} accepts a ReactNode so callers can mix in the italic-display
 * emphasis used elsewhere on the page — e.g.
 * {@code <>One chart. <span className="italic-display">Every ward.</span></>}
 */
export type ProductShotProps = {
  kicker: string;
  title: ReactNode;
  body: string;
  src: string;
  alt: string;
  /** 4/3 default aspect; override for mobile-portrait shots. */
  aspect?: "landscape" | "portrait";
  /** Optional darker chrome — matches Hero pages where the section sits on bone-deep. */
  variant?: "bone" | "bone-deep";
};

export function ProductShot({
  kicker,
  title,
  body,
  src,
  alt,
  aspect = "landscape",
  variant = "bone",
}: ProductShotProps) {
  const bg = variant === "bone-deep" ? "bg-bone-deep" : "bg-bone";
  return (
    <section className={`${bg} py-24 md:py-32`}>
      <Container>
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-4">
            <Kicker>{kicker}</Kicker>
            <h2 className="reveal mt-6 font-display text-display">{title}</h2>
            <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">{body}</p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <figure className="reveal reveal-delay-1">
              <div className="relative overflow-hidden border border-ink/15 bg-bone shadow-[8px_8px_0_0_rgba(11,11,9,0.9)]">
                <Image
                  src={src}
                  alt={alt}
                  width={aspect === "landscape" ? 1680 : 1080}
                  height={aspect === "landscape" ? 1050 : 2400}
                  className="h-auto w-full"
                />
              </div>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
