-- ═══════════════════════════════════════════════════════════════════
--  Portfólio Reflexivo de Estágio — estrutura do banco
--  Rode este arquivo inteiro no SQL Editor do Supabase, uma única vez.
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. Quem pode editar ────────────────────────────────────────────
-- Só os e-mails desta tabela conseguem gravar qualquer coisa.
create table if not exists public.administradores (
  email text primary key,
  nome  text,
  criado_em timestamptz default now()
);

-- Função auxiliar: o usuário autenticado é administrador?
create or replace function public.eh_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.administradores
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ── 2. Conteúdo das seções ─────────────────────────────────────────
-- Cada seção do portfólio é uma linha. O conteúdo fica em JSON, o que
-- permite acrescentar campos novos depois sem mexer no banco.
create table if not exists public.secoes (
  id            text primary key,          -- ex.: 'inicio', 'plano-3'
  rascunho      jsonb not null default '{}'::jsonb,
  publicado     jsonb,                     -- null = nunca publicado
  publicado_em  timestamptz,
  atualizado_em timestamptz default now()
);

alter table public.secoes enable row level security;
alter table public.administradores enable row level security;

-- Ninguém anônimo lê a tabela base (ela contém os rascunhos).
drop policy if exists secoes_admin_tudo on public.secoes;
create policy secoes_admin_tudo on public.secoes
  for all to authenticated
  using (public.eh_admin()) with check (public.eh_admin());

drop policy if exists admins_leitura on public.administradores;
create policy admins_leitura on public.administradores
  for select to authenticated using (public.eh_admin());

-- ── 3. O que o público enxerga ─────────────────────────────────────
-- Uma view que expõe SOMENTE a coluna publicado. O rascunho nunca sai
-- do banco para um visitante, nem por engano.
create or replace view public.secoes_publicas
with (security_invoker = off) as
  select id, publicado as conteudo, publicado_em
  from public.secoes
  where publicado is not null;

grant select on public.secoes_publicas to anon, authenticated;

-- ── 4. Arquivos (imagens, vídeos, documentos) ──────────────────────
insert into storage.buckets (id, name, public, file_size_limit)
values ('midia', 'midia', true, 52428800)   -- 50 MB por arquivo
on conflict (id) do update set file_size_limit = 52428800, public = true;

drop policy if exists midia_leitura on storage.objects;
create policy midia_leitura on storage.objects
  for select to anon, authenticated using (bucket_id = 'midia');

drop policy if exists midia_escrita on storage.objects;
create policy midia_escrita on storage.objects
  for insert to authenticated with check (bucket_id = 'midia' and public.eh_admin());

drop policy if exists midia_remocao on storage.objects;
create policy midia_remocao on storage.objects
  for delete to authenticated using (bucket_id = 'midia' and public.eh_admin());

-- ═══════════════════════════════════════════════════════════════════
--  DEPOIS de rodar isto, cadastre os administradores:
--
--  insert into public.administradores (email, nome) values
--    ('email-da-estudante@exemplo.com', 'Nome da estudante'),
--    ('email-do-paulo@exemplo.com',     'Paulo Henrique');
--
--  E crie as contas em Authentication › Users › Add user,
--  com os MESMOS e-mails e uma senha para cada uma.
-- ═══════════════════════════════════════════════════════════════════
