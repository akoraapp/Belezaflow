// Public, unauthenticated endpoint the frontend calls (pre-login, on the
// landing/pricing pages) to know which currency to *display*. Geolocates the
// caller's IP the same way create-subscription does, so the price shown here
// matches what checkout will actually charge. This is cosmetic only — the
// real, trusted decision happens again server-side inside create-subscription
// when the user actually checks out, so nothing here needs to be trusted by
// the client for billing purposes.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

async function detectCountryCode(req: Request): Promise<string | null> {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '';
  if (!ip) return null;
  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return typeof data.country_code === 'string' ? data.country_code.toUpperCase() : null;
  } catch (err) {
    console.error('Country geolocation failed', err);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const countryCode = await detectCountryCode(req);
  const isBrazil = countryCode === 'BR';

  return new Response(JSON.stringify({ country: countryCode, isBrazil, currency: isBrazil ? 'BRL' : 'USD' }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
