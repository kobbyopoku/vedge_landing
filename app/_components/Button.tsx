import Link from "next/link";
import { ComponentProps } from "react";

type BaseProps = {
  variant?: "ink" | "ghost";
  children: React.ReactNode;
  className?: string;
};

type LinkButtonProps = BaseProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

/**
 * All CTAs on the site are links (this is a marketing site).
 * Two variants: filled ink (primary) and bordered ghost (secondary).
 * The arrow glyph is purely decorative and hidden from screen readers.
 */
export function Button({ variant = "ink", href, children, className = "", ...rest }: LinkButtonProps) {
  const base = variant === "ink" ? "btn-ink" : "btn-ghost";
  return (
    <Link href={href} className={`${base} ${className}`} {...rest}>
      {children}
      <span aria-hidden="true" className="inline-block translate-y-[-1px]">→</span>
    </Link>
  );
}
