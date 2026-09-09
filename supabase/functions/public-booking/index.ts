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

  const profile = await findProfileBySlug(slug);
  if (!profile) return { status: 404 as const, body: { error: 'not_found' } };

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
  const { data: existingClient, error: findClientError } = await supabaseAdmin
    .from('clients')
    .select('id, status')
    .eq('user_id', profile.id)
    .or(`phone.eq.${clientPhone},name.eq.${clientName}`)
    .maybeSingle();
  if (findClientError) console.error('client lookup failed', findClientError);

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
      const { status, body } = await handleGet(payload.slug);
      return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (payload.action === 'book') {
      const { status, body } = await handleBook(payload as BookBody);
      return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
