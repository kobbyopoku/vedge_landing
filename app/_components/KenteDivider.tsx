type Props = {
  className?: string;
};

/**
 * Full-width geometric divider inspired by Adinkra/Kente weaving patterns.
 * Deliberately NOT a literal kente — an abstract rhythm built from simple
 * rectangles and triangles in our brand palette. Rendered as inline SVG so
 * it scales without network requests and respects the surrounding background.
 */
export function KenteDivider({ className = "" }: Props) {
  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="xMidYMid slice"
        className="h-10 w-full"
        role="presentation"
      >
        {/* base ink line */}
        <line x1="0" y1="24" x2="1200" y2="24" stroke="#0B0B09" strokeWidth="1" opacity="0.25" />

        {/* repeating motif — 12 blocks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x = i * 100;
          return (
            <g key={i} transform={`translate(${x} 0)`}>
              {/* forest square */}
              <rect x="10" y="12" width="24" height="24" fill="#1B3B2F" />
              {/* clay triangle */}
              <polygon points="44,36 60,12 60,36" fill="#C8553D" />
              {/* sun circle */}
              <circle cx="72" cy="24" r="5" fill="#E8B04A" />
              {/* ink dash */}
              <rect x="82" y="22" width="14" height="4" fill="#0B0B09" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
