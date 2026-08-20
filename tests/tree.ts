/**
 * Walking a React element tree without a renderer.
 *
 * These pages are async server components. Rendering them properly
 * would need a React server runtime; awaiting one yields an element
 * tree, and walking that tells us which branch it took and what words
 * are in it — which is everything these tests assert, and needs no
 * jsdom, no Testing Library and no renderer.
 */
/**
 * Collect every component name and every rendered string in a tree,
 * expanding function components as it goes.
 *
 * A branch of a page is an unexpanded `<EmptyState />` element — its
 * words live inside the function, not in the tree — so a copy assertion
 * has to invoke it.
 *
 * Expansion is wrapped in try/catch rather than restricted to an
 * allowlist of our own components: anything that does not like being
 * called as a plain function (`next/link` and friends) is simply left
 * unexpanded and still contributes its name and its props. That keeps
 * the helper honest about what it could not open instead of silently
 * skipping it, and needs no jsdom, no renderer and no Testing Library.
 */
export function walk(node: unknown, names: string[] = [], text: string[] = []): [string[], string[]] {
  if (node === null || node === undefined || typeof node === "boolean") return [names, text];
  if (typeof node === "string" || typeof node === "number") {
    text.push(String(node));
    return [names, text];
  }
  if (Array.isArray(node)) {
    for (const child of node) walk(child, names, text);
    return [names, text];
  }

  const element = node as { type?: unknown; props?: Record<string, unknown> };
  const type = element.type;

  if (typeof type === "function") {
    names.push((type as { name?: string }).name ?? "anonymous");
    // A client component (`ServicesList` uses `useState`) throws
    // "Invalid hook call" here — and logs it before throwing. That is
    // the expected outcome for such a component, not a fault, so the
    // log is muted rather than left to make a green run look broken.
    const error = console.error;
    console.error = () => {};
    try {
      walk((type as (p: unknown) => unknown)(element.props ?? {}), names, text);
      return [names, text];
    } catch {
      // Not callable as a plain function — fall through to its children.
    } finally {
      console.error = error;
    }
  } else if (typeof type === "string") {
    names.push(type);
  }

  if (element.props && "children" in element.props) walk(element.props.children, names, text);
  return [names, text];
}

/** Every `href` in the tree, components expanded. */
export function hrefsIn(node: unknown, found: string[] = []): string[] {
  if (!node || typeof node !== "object") return found;
  if (Array.isArray(node)) {
    node.forEach((child) => hrefsIn(child, found));
    return found;
  }
  const element = node as { type?: unknown; props?: Record<string, unknown> };
  if (element.props?.href) found.push(String(element.props.href));

  if (typeof element.type === "function") {
    try {
      hrefsIn((element.type as (p: unknown) => unknown)(element.props ?? {}), found);
      return found;
    } catch {
      /* fall through */
    }
  }
  if (element.props && "children" in element.props) hrefsIn(element.props.children, found);
  return found;
}


/**
 * The tree's visible text, as one string.
 *
 * Sibling text nodes are joined with a space, because JSX splits a
 * sentence across children and running them together would invent words
 * ("At a glanceDiagnostic centre"). The space is then removed again
 * before punctuation, because JSX equally splits `{expr}.` into two
 * children and a naive join reads "Accra, Ghana ." — a space no reader
 * ever sees. What comes out is what the page says, not how React
 * happened to chunk it.
 */
export function renderedText(node: unknown): string {
  const [, text] = walk(node);
  return text
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}
