import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "article" | "main";
};

/**
 * Editorial container. Generous horizontal gutter on desktop, tight on mobile.
 * Max width 88rem keeps line length readable without feeling cramped.
 */
export function Container({ children, className = "", as: Tag = "div" }: Props) {
  return (
    <Tag className={`mx-auto w-full max-w-shell px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </Tag>
  );
}
