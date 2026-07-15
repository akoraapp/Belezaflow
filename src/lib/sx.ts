import type { CSSProperties } from 'react';

const cache = new Map<string, CSSProperties>();

function toCamel(prop: string): string {
  if (prop.startsWith('--')) return prop;
  return prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

/**
 * Parses a CSS declaration string (e.g. "font-size:14px; color:#000;")
 * into a React style object. Lets us carry over inline style strings
 * from the source design verbatim instead of hand-transcribing each
 * one into an object literal.
 */
export function sx(css: string | undefined | false | null): CSSProperties {
  if (!css) return {};
  const cached = cache.get(css);
  if (cached) return cached;

  const style: Record<string, string> = {};
  for (const decl of css.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim();
    const value = decl.slice(idx + 1).trim();
    if (!prop || !value) continue;
    style[toCamel(prop)] = value;
  }

  const result = style as CSSProperties;
  cache.set(css, result);
  return result;
}
