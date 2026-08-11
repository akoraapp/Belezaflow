// Runs on a schedule (every 15 minutes via pg_cron, see
// supabase/migrations/0005_pg_cron_reminders.sql) and sends a push notification
// for every appointment that starts within the next 30 minutes and hasn't had
// its reminder sent yet, then stamps reminder_sent_at so it never fires twice.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Computes the UTC instant for a "day" (YYYY-MM-DD) + "time" (HH:MM) pair as
// understood in a given IANA timezone, handling DST correctly.
function zonedDateTimeToUtc(day: string, time: string, timeZone: string): Date {
  const [year, month, date] = day.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const naiveUtc = Date.UTC(year, month - 1, date, hour, minute, 0);

  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = dtf.formatToParts(new Date(naiveUtc)).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    parts.hour === '24' ? 0 : Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  const offsetMs = asIfUtc - naiveUtc;
  return new Date(naiveUtc - offsetMs);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const now = new Date();
  const windowEnd = new Date(now.getTime() + 30 * 60 * 1000);
  // A "day" is whatever calendar date the professional's local timezone says it is,
  // which near UTC midnight can be one day behind or ahead of UTC's own date — so the
  // cheap pre-filter spans yesterday/today/tomorrow (UTC) to be safe for any real
  // timezone offset (-12 to +14), and the precise per-row instant check happens below.
  const dayStr = (offsetDays: number) => new Date(now.getTime() + offsetDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const { data: appts, error } = await supabaseAdmin
    .from('appointments')
    .select('id, user_id, client_name, service, day, time, status')
    .in('day', [dayStr(-1), dayStr(0), dayStr(1)])
    .in('status', ['Agendado', 'Confirmado'])
    .is('reminder_sent_at', null);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  if (!appts || appts.length === 0) {
    return new Response(JSON.stringify({ reminded: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const userIds = Array.from(new Set(appts.map((a) => a.user_id as string)));
  const { data: profiles, error: profilesError } = await supabaseAdmin.from('profiles').select('id, timezone').in('id', userIds);
  if (profilesError) {
    console.error(profilesError);
    return new Response(JSON.stringify({ error: profilesError.message }), { status: 500 });
  }
  const timezoneByUserId = new Map((profiles ?? []).map((p) => [p.id as string, ((p.timezone as string) || 'America/Sao_Paulo')]));

  const due = appts.filter((a) => {
    const timeZone = timezoneByUserId.get(a.user_id as string) ?? 'America/Sao_Paulo';
    const startsAt = zonedDateTimeToUtc(a.day as string, a.time as string, timeZone);
    return startsAt >= now && startsAt <= windowEnd;
  });

  let reminded = 0;
  for (const appt of due) {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
        body: JSON.stringify({
          user_id: appt.user_id,
          title: 'Agendamento em breve',
          body: `${appt.client_name} · ${appt.service} às ${appt.time}`,
        }),
      });
      if (!res.ok) {
        console.error('send-push failed', appt.id, await res.text());
        continue;
      }
      await supabaseAdmin.from('appointments').update({ reminder_sent_at: new Date().toISOString() }).eq('id', appt.id);
      reminded += 1;
    } catch (err) {
      console.error('reminder failed for appointment', appt.id, err);
    }
  }

  return new Response(JSON.stringify({ reminded, checked: appts.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
