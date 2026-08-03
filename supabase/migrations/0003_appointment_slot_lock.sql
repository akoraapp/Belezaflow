-- Prevents two active appointments from ever occupying the same (professional, day, time)
-- slot — this is the actual guarantee against double-booking, since client-side "is this
-- slot free" checks alone cannot protect against two people booking at the same instant.
-- Cancelled appointments are excluded so a freed-up slot can be rebooked.
create unique index if not exists appointments_unique_active_slot
  on public.appointments (user_id, day, time)
  where status <> 'Cancelado';
