// Serves the XML sitemap for https://belezaflow.app/sitemap.xml — see
// vercel.json, which rewrites that path here (the app itself is a static
// SPA with no server, so a URL that has to be computed from live data needs
// a backend somewhere, and every other public-facing lookup in this app
// already lives in a Supabase Edge Function).
//
// Publicly indexable URLs only:
//   - the marketing homepage and the privacy policy (static)
//   - every professional's public booking page, derived from profiles —
//     same slugify() as supabase/functions/public-booking/index.ts, so a
//     new Agenda Online page is picked up automatically the moment she sets
//     her public name, with nothing to edit here.
//   - Bio Beauty's public pages (belezaflow.app/bio/<slug>, proxied by
//     vercel.json to a separate Vercel project this app doesn't own) are
//     merged in by fetching that project's own sitemap.xml through the same
//     /bio/ proxy path and re-pointing its URLs at belezaflow.app. If that
//     project hasn't published a sitemap yet, this merge silently finds
//     nothing and the rest of the sitemap is served normally — nothing here
//     needs to change once it does.
//
// Never included: /app (the authenticated dashboard), /quiz (redirects to
// the homepage), login, or any other non-public screen — none of them are
// listed below, so none of them can end up in the sitemap.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const SITE_URL = 'https://belezaflow.app';
const BIO_BEAUTY_SITEMAP_URL = 'https://bio-beauty.vercel.app/bio/sitemap.xml';

// Routes the real router (src/main.tsx) already owns as static paths —
// react-router always matches these before the dynamic /:slug catch-all, so
// a professional whose public name happens to slugify to one of these is an
// existing, separate edge case; the sitemap just must not list a slug that
// could never actually resolve to her booking page.
const RESERVED_SLUGS = new Set(['app', 'quiz', 'privacidade']);

// Exact copy of supabase/functions/public-booking/index.ts's slugify() —
// the slug is never stored, only ever derived from public_name, so both
// functions must compute it identically or a page listed here could 404.
function slugify(publicName: string | null | undefined) {
  return (publicName || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

async function fetchAgendaOnlineSlugs(): Promise<string[]> {
  const { data: profiles, error } = await supabaseAdmin.from('profiles').select('public_name').order('created_at', { ascending: true });
  if (error) throw error;

  const slugs: string[] = [];
  const seen = new Set<string>();
  for (const row of profiles ?? []) {
    const slug = slugify(row.public_name as string);
    // Same professional could in principle collide with another's slug (two
    // identical public names) or with a reserved route — either way only the
    // first one is actually reachable at that URL, same as findProfileBySlug
    // in public-booking picks the first match.
    if (!slug || RESERVED_SLUGS.has(slug) || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
  }
  return slugs;
}

// Best-effort: pull <loc> entries out of Bio Beauty's own sitemap (plain
// regex, not a full XML parser — this only ever reads a sitemap, a format
// with no nested/ambiguous <loc> tags, and avoids pulling in an XML/DOM
// dependency for one field). Any failure (not deployed yet, times out,
// doesn't look like XML) just means zero Bio Beauty URLs this run.
async function fetchBioBeautyUrls(): Promise<string[]> {
  try {
    const res = await fetch(BIO_BEAUTY_SITEMAP_URL, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return [];
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]);
    return locs
      .filter((loc) => /^https?:\/\/[^/]*\/bio\//.test(loc))
      .map((loc) => loc.replace(/^https?:\/\/[^/]+\/bio\//, `${SITE_URL}/bio/`));
  } catch (err) {
    console.error('fetchBioBeautyUrls failed (non-fatal)', err);
    return [];
  }
}

function escapeXml(url: string) {
  return url.replace(/&/g, '&amp;');
}

function buildSitemapXml(urls: string[]) {
  const entries = urls.map((u) => `  <url><loc>${escapeXml(u)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

Deno.serve(async (req) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const [agendaSlugs, bioUrls] = await Promise.all([fetchAgendaOnlineSlugs(), fetchBioBeautyUrls()]);

    const urls = [
      `${SITE_URL}/`,
      `${SITE_URL}/privacidade`,
      ...agendaSlugs.map((slug) => `${SITE_URL}/${slug}`),
      ...bioUrls,
    ];

    return new Response(buildSitemapXml(urls), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // Crawlers hit this rarely; an hour of caching keeps a new
        // professional's page from waiting on every single request to
        // re-query profiles, while still picking her up the same day.
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('sitemap generation failed', err);
    // A broken sitemap must never look like a healthy empty one to a
    // crawler — fail loudly instead of returning a 200 with no URLs.
    return new Response('Internal error', { status: 500 });
  }
});
