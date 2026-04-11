type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Magazine-style section label. Rendered as monospace small caps with
 * a short rule to the left. Used above every major section heading.
 */
export function Kicker({ children, className = "" }: Props) {
  return <p className={`kicker ${className}`}>{children}</p>;
}
