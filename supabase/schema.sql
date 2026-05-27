-- ============================================================
-- MINAMIX WIKI — Schéma Supabase
-- À exécuter dans l'éditeur SQL de ton projet Supabase
-- ============================================================

-- Tables de contenu (slug = clé primaire, data = objet JSON complet)

create table if not exists public.pays (
  slug text primary key,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

create table if not exists public.races (
  slug text primary key,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

create table if not exists public.ryximus (
  slug text primary key,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Table magie : une seule ligne (id = 1)
create table if not exists public.magie (
  id integer primary key default 1,
  data jsonb not null default '{}',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

create table if not exists public.annexes (
  label text primary key,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────

alter table public.pays enable row level security;
alter table public.races enable row level security;
alter table public.ryximus enable row level security;
alter table public.magie enable row level security;
alter table public.annexes enable row level security;

-- Lecture publique (tout le monde peut voir le wiki)
create policy "Lecture publique pays"     on public.pays     for select using (true);
create policy "Lecture publique races"    on public.races    for select using (true);
create policy "Lecture publique ryximus"  on public.ryximus  for select using (true);
create policy "Lecture publique magie"    on public.magie    for select using (true);
create policy "Lecture publique annexes"  on public.annexes  for select using (true);

-- Écriture réservée aux utilisateurs connectés
create policy "Écriture auth pays"    on public.pays    for all using (auth.uid() is not null);
create policy "Écriture auth races"   on public.races   for all using (auth.uid() is not null);
create policy "Écriture auth ryximus" on public.ryximus for all using (auth.uid() is not null);
create policy "Écriture auth magie"   on public.magie   for all using (auth.uid() is not null);
create policy "Écriture auth annexes" on public.annexes for all using (auth.uid() is not null);
