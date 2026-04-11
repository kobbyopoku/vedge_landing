type Props = {
  value: string;
  label: string;
  note?: string;
  align?: "left" | "right";
};

/**
 * Editorial big-number stat. The value uses the display serif with tabular
 * figures so lockups stay aligned. Label below is monospaced uppercase.
 */
export function StatBlock({ value, label, note, align = "left" }: Props) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <div className="stat-number text-ink">{value}</div>
      <div className="mt-3 h-px w-10 bg-ink/40" />
      <div className="mt-3 font-mono text-[11px] uppercase tracking-kicker text-ink/70">
        {label}
      </div>
      {note && <p className="mt-2 max-w-xs text-sm text-ink/60">{note}</p>}
    </div>
  );
}
