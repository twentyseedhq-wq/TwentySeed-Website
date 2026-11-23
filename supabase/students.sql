-- TwentySeed Learning: parent-owned student records (migration draft)
-- Run manually in the Supabase SQL Editor after review. No data is migrated automatically.
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  grade text not null default '' check (char_length(grade) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists students_parent_id_idx on public.students(parent_id);
alter table public.students enable row level security;
alter table public.students force row level security;
revoke all on public.students from anon;
grant select, insert, update, delete on public.students to authenticated;
drop policy if exists students_select_own on public.students;
drop policy if exists students_insert_own on public.students;
drop policy if exists students_update_own on public.students;
drop policy if exists students_delete_own on public.students;
create policy students_select_own on public.students for select to authenticated using ((select auth.uid()) = parent_id);
create policy students_insert_own on public.students for insert to authenticated with check ((select auth.uid()) = parent_id);
create policy students_update_own on public.students for update to authenticated using ((select auth.uid()) = parent_id) with check ((select auth.uid()) = parent_id);
create policy students_delete_own on public.students for delete to authenticated using ((select auth.uid()) = parent_id);
-- Verification (run while signed in as two different test parents):
-- A inserts a student; B must not select/update/delete it.
-- B must not insert with A's parent_id.
-- An unauthenticated request must not access the table.
