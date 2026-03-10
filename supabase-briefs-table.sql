-- Ejecutar en Supabase → SQL Editor → New query → Pegar y Run
create table if not exists public.briefs (
  user_id text primary key,
  state jsonb not null default '{}',
  report text,
  saved_at bigint not null default (extract(epoch from now()) * 1000)::bigint,
  submitted_at text,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists briefs_updated_at on public.briefs;
create trigger briefs_updated_at
  before update on public.briefs
  for each row execute function public.set_updated_at();
