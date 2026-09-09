-- Profile photo/logo, uploaded to the 'avatars' storage bucket already
-- created in 0001_init.sql (public read, write scoped to the owner's own
-- folder). Shown on the Agenda Online preview and the public booking page
-- instead of the plain letter avatar once set.
alter table public.profiles add column if not exists avatar_url text not null default '';
