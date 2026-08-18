"use client";

import { useMemo, useState } from "react";
import type { FacilityService } from "../../_data/facilities";

/**
 * Below this many services, a filter box narrows nothing a visitor
 * couldn't already scan by eye faster — so it stays hidden rather than
 * cluttering a short list with a control that has no work to do. Roughly
 * where {@link MAX_HEIGHT_CLASS} below starts to actually clip the list,
 * so the two thresholds agree about what "long" means here.
 */
const SHOW_FILTER_ABOVE = 6;

/** Caps the list at about seven rows before it scrolls. Kept as one named
 *  constant so the value only has to make sense in one place. */
const MAX_HEIGHT_CLASS = "max-h-[30rem]";

/**
 * The published-services list on a facility's page: a scroll-capped list
 * with a client-side filter over it.
 *
 * **No extra request, ever.** The full list already arrived with the
 * server-rendered page — this component only narrows what is already
 * sitting in the DOM. A facility with fifty published services should
 * never cost a visitor on a poor connection a second round trip just to
 * find "MRI" in a list they already have. Deduplication is already done
 * server-side (`PublicFacilityDirectoryService#dedupeForDisplay`); this
 * component filters an already-deduplicated list, it does not re-dedupe
 * it.
 *
 * The only client-side JS this route carries — everything else on
 * `/facilities/[slug]` is a plain server component, and this file is
 * deliberately small: `useState` + `useMemo` + a `.filter()`, no search
 * or list-virtualisation library for a page this size.
 */
export function ServicesList({ services }: { services: FacilityService[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return services;
    return services.filter((service) =>
      [service.description, service.code, service.modality, service.bodyPart]
        .filter((part): part is string => Boolean(part))
        .some((part) => part.toLowerCase().includes(needle)),
    );
  }, [services, query]);

  return (
    <div>
      {services.length > SHOW_FILTER_ABOVE && (
        <div className="mb-6">
          <label
            htmlFor="service-filter"
            className="block font-mono text-[10px] uppercase tracking-kicker text-ink/50"
          >
            Filter this list
          </label>
          <input
            id="service-filter"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="MRI, dialysis, ultrasound…"
            className="mt-2 w-full border-b border-ink/25 bg-transparent pb-2 font-display text-lg text-ink outline-none placeholder:text-ink/35 focus:border-ink"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="border-t border-ink/20 py-8 text-sm text-ink/60">
          No services match “{query}”.
        </p>
      ) : (
        <ul className={`${MAX_HEIGHT_CLASS} overflow-y-auto border-t border-ink/20`}>
          {filtered.map((service) => (
            <li
              key={service.id}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink/15 py-5"
            >
              <span className="font-display text-xl text-ink">
                {service.description ?? service.code}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-kicker text-ink/50">
                {[service.modality, service.bodyPart, service.code].filter(Boolean).join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
