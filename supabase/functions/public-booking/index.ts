// Backs the public booking link every professional gets (see
// src/screens/AgendaOnline.tsx and src/pages/PublicBooking.tsx). Anonymous
// visitors never get a Supabase session, so this is the only place that
// resolves a public slug into a professional's account and lets someone
// book an appointment — using the service role, entirely server-side, so
// no table needs an RLS policy opened up to anonymous reads/writes.
//
// Two actions, both POST (kept off query strings so this can be called
// with supabase.functions.invoke the same way everywhere else in the app):
//   { action: 'get', slug }
//     -> public profile info + services + a minimal appointments list
//        (day/time/status only — never another client's name or phone)
//        so the booking page can compute open slots itself.
//   { action: 'book', slug, serviceId, day, time, clientName, clientPhone }
//     -> creates the appointment (and the CRM client record) exactly like
//        AgendaOnlineScreen.confirmBooking already does when the
//        professional is testing her own booking flow from inside the app.
//
// The slug is never stored — it's derived from profiles.public_name with
// the exact same normalization AgendaOnline.tsx uses to build the
// professional's shareable link, so there is nothing to keep in sync and
// no migration needed.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Same weekday indexing as src/theme.ts's WEEKDAY_LABELS / src/lib/helpers.ts's
// weekdayLabelForDate, reimplemented here since this Edge Function can't
// import frontend code — index 0 is Sunday, matching Date#getDay().
const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const MAX_TEXT_LEN = 200;

function weekdayLabelForDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return WEEKDAY_LABELS[new Date(y, m - 1, d).getDay()];
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

// Anonymous endpoint, no auth to key a limit by — keyed by IP instead.
// 'get' is read-only and called repeatedly as a visitor browses slots, so it
// gets a generous allowance; 'book' actually writes a row, so it's tight.
async function checkRateLimit(req: Request, action: 'get' | 'book') {
  const ip = getClientIp(req);
  const [maxCount, windowSeconds] = action === 'book' ? [5, 300] : [40, 60];
  const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
    p_key: `public-booking:${action}:${ip}`,
    p_max_count: maxCount,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error('check_rate_limit failed', error);
    return true; // fail open — a broken rate limiter must never take booking down.
  }
  return data as boolean;
}

function slugify(publicName: string | null | undefined) {
  return (publicName || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

async function findProfileBySlug(slug: string) {
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('id, public_name, profession, instagram, whatsapp, endereco, maps_link, contact_method, working_days, available_slots, currency, avatar_url');
  if (error) throw error;
  return (profiles ?? []).find((p) => slugify(p.public_name as string) === slug) ?? null;
}

async function handleGet(slug: string) {
  const profile = await findProfileBySlug(slug);
  if (!profile) return { status: 404 as const, body: { error: 'not_found' } };

  const { data: services, error: servicesError } = await supabaseAdmin
    .from('services')
    .select('id, name, price, duration')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: true });
  if (servicesError) throw servicesError;

  // Only enough to compute free/taken slots — never another client's name or phone.
  const { data: appointments, error: apptError } = await supabaseAdmin.from('appointments').select('day, time, status').eq('user_id', profile.id);
  if (apptError) throw apptError;

  return {
    status: 200 as const,
    body: {
      profile: {
        publicName: profile.public_name,
        profession: profile.profession,
        instagram: profile.instagram,
        whatsapp: profile.whatsapp,
        endereco: profile.endereco,
        mapsLink: profile.maps_link,
        contactMethod: profile.contact_method,
        workingDays: profile.working_days ?? [],
        availableSlots: profile.available_slots ?? [],
        currency: profile.currency,
        avatarUrl: profile.avatar_url ?? '',
      },
      services: services ?? [],
      appointments: appointments ?? [],
    },
  };
}

interface BookBody {
  slug: string;
  serviceId: string;
  day: string;
  time: string;
  clientName: string;
  clientPhone: string;
}

function isSlotConflictError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === '23505';
}

async function handleBook(body: BookBody) {
  const { slug, serviceId, day, time, clientName, clientPhone } = body;
  if (!slug || !serviceId || !day || !time || !clientName || !clientPhone) {
    return { status: 400 as const, body: { error: 'missing_fields' } };
  }
  if (!DAY_RE.test(day) || !TIME_RE.test(time)) {
    return { status: 400 as const, body: { error: 'invalid_datetime' } };
  }
  if (clientName.length > MAX_TEXT_LEN || clientPhone.length > MAX_TEXT_LEN) {
    return { status: 400 as const, body: { error: 'field_too_long' } };
  }

  const profile = await findProfileBySlug(slug);
  if (!profile) return { status: 404 as const, body: { error: 'not_found' } };

  // The booking widget only ever offers slots that are actually within the
  // professional's configured schedule — re-check that here too, since
  // nothing before this point stopped a direct API call from booking any
  // arbitrary day/time regardless of her working days or configured slots.
  const workingDays = (profile.working_days as string[] | null) ?? [];
  const availableSlots = (profile.available_slots as string[] | null) ?? [];
  if (!workingDays.includes(weekdayLabelForDate(day)) || !availableSlots.includes(time)) {
    return { status: 400 as const, body: { error: 'slot_not_offered' } };
  }

  const { data: service, error: serviceError } = await supabaseAdmin.from('services').select('name, price, duration').eq('id', serviceId).eq('user_id', profile.id).maybeSingle();
  if (serviceError) throw serviceError;
  if (!service) return { status: 400 as const, body: { error: 'invalid_service' } };

  const apptId = `a${Date.now()}`;
  const { error: apptError } = await supabaseAdmin.from('appointments').insert({
    id: apptId,
    user_id: profile.id,
    client_name: clientName,
    client_phone: clientPhone,
    service: service.name,
    price: service.price,
    duration: service.duration,
    time,
    day,
    status: 'Agendado',
    origin: 'online',
  });
  if (apptError) {
    if (isSlotConflictError(apptError)) return { status: 409 as const, body: { error: 'slot_taken' } };
    throw apptError;
  }

  // Mirrors AgendaOnlineScreen.confirmBooking: a returning client booking
  // again must never create a second CRM record for the same person.
  // Two separate .eq() lookups instead of one .or() built from a template
  // string — clientName/clientPhone are attacker-controlled (anonymous
  // endpoint), and supabase-js's .or() does not escape special characters
  // (',', '(', ')') in a string you build yourself, which would let a
  // crafted name/phone inject extra filter clauses into the query.
  const [{ data: byPhone, error: byPhoneError }, { data: byName, error: byNameError }] = await Promise.all([
    supabaseAdmin.from('clients').select('id, status').eq('user_id', profile.id).eq('phone', clientPhone).maybeSingle(),
    supabaseAdmin.from('clients').select('id, status').eq('user_id', profile.id).eq('name', clientName).maybeSingle(),
  ]);
  if (byPhoneError) console.error('client lookup by phone failed', byPhoneError);
  if (byNameError) console.error('client lookup by name failed', byNameError);
  const existingClient = byPhone ?? byName;

  if (existingClient) {
    if (existingClient.status !== 'Cliente') {
      const { error } = await supabaseAdmin.from('clients').update({ status: 'Agendado' }).eq('id', existingClient.id);
      if (error) console.error('client status update failed', error);
    }
  } else {
    const { error } = await supabaseAdmin
      .from('clients')
      .insert({ id: `c${Date.now()}`, user_id: profile.id, name: clientName, phone: clientPhone, service: service.name, origem: 'Agenda Online', status: 'Agendado', birthday: '' });
    if (error) console.error('client insert failed', error);
  }

  const { error: logError } = await supabaseAdmin
    .from('activity_log')
    .insert({ user_id: profile.id, action: 'public_booking_created', metadata: { appointmentId: apptId, serviceId, day, time } });
  if (logError) console.error('activity_log insert failed', logError);

  return { status: 200 as const, body: { ok: true } };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  let payload: { action?: string; slug?: string } & Partial<BookBody>;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    if (payload.action === 'get' && payload.slug) {
      if (!(await checkRateLimit(req, 'get'))) {
        return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const { status, body } = await handleGet(payload.slug);
      return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (payload.action === 'book') {
      if (!(await checkRateLimit(req, 'book'))) {
        return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const { status, body } = await handleBook(payload as BookBody);
      return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
