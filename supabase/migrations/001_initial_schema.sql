create extension if not exists "pgcrypto";

create type public.access_status as enum ('pending', 'active', 'blocked');
create type public.user_role as enum ('user', 'admin');
create type public.content_status as enum ('nao_iniciado', 'vou_usar', 'ja_usei');
create type public.checklist_status as enum ('nao_iniciado', 'em_andamento', 'concluido');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.user_role not null default 'user',
  access_status public.access_status not null default 'pending',
  purchase_origin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.user_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  status public.access_status not null default 'active',
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text
);

create table public.formats (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table public.objectives (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text
);

create table public.content_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  objective_id uuid references public.objectives(id),
  format_id uuid references public.formats(id),
  category_id uuid references public.categories(id),
  niche text,
  difficulty_level text,
  content_intention text,
  execution_tip text,
  niche_examples jsonb not null default '[]'::jsonb,
  observations text,
  recommended_actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bonuses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  content text not null,
  usage_instructions text,
  created_at timestamptz not null default now()
);

create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  prompt_text text not null,
  usage_instructions text,
  created_at timestamptz not null default now()
);

create table public.story_scripts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  objective text,
  script_content text not null,
  observations text,
  created_at timestamptz not null default now()
);

create table public.checklists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  goal text not null,
  objective text not null,
  action text not null,
  suggested_frequency text,
  created_at timestamptz not null default now()
);

create table public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_idea_id uuid not null references public.content_ideas(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, content_idea_id)
);

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_idea_id uuid not null references public.content_ideas(id) on delete cascade,
  status public.content_status not null default 'nao_iniciado',
  updated_at timestamptz not null default now(),
  unique (user_id, content_idea_id)
);

create table public.user_checklist_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checklist_id uuid not null references public.checklists(id) on delete cascade,
  status public.checklist_status not null default 'nao_iniciado',
  updated_at timestamptz not null default now(),
  unique (user_id, checklist_id)
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.user_access enable row level security;
alter table public.categories enable row level security;
alter table public.formats enable row level security;
alter table public.objectives enable row level security;
alter table public.content_ideas enable row level security;
alter table public.bonuses enable row level security;
alter table public.prompts enable row level security;
alter table public.story_scripts enable row level security;
alter table public.checklists enable row level security;
alter table public.user_favorites enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_checklist_progress enable row level security;

-- Politicas iniciais: leitura liberada apenas para usuarios autenticados.
create policy "Usuarios autenticados leem produtos" on public.products for select to authenticated using (true);
create policy "Usuarios autenticados leem categorias" on public.categories for select to authenticated using (true);
create policy "Usuarios autenticados leem formatos" on public.formats for select to authenticated using (true);
create policy "Usuarios autenticados leem objetivos" on public.objectives for select to authenticated using (true);
create policy "Usuarios autenticados leem ideias" on public.content_ideas for select to authenticated using (true);
create policy "Usuarios autenticados leem bonus" on public.bonuses for select to authenticated using (true);
create policy "Usuarios autenticados leem prompts" on public.prompts for select to authenticated using (true);
create policy "Usuarios autenticados leem roteiros" on public.story_scripts for select to authenticated using (true);
create policy "Usuarios autenticados leem checklists" on public.checklists for select to authenticated using (true);

create policy "Usuario le o proprio perfil" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Usuario gerencia favoritos proprios" on public.user_favorites for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Usuario gerencia progresso proprio" on public.user_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Usuario gerencia checklist proprio" on public.user_checklist_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
