# Supabase Login Setup

This site is wired to the Supabase project from the dashboard link:

```text
https://zfchieymyntbmpiyixjo.supabase.co
```

## 1. Add the public key

In Supabase, open **Project Settings > API** and copy the **publishable key** or **anon public key**.

Create a local `.env.local` file:

```env
VITE_SUPABASE_URL=https://zfchieymyntbmpiyixjo.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key-here
```

Restart the Vite dev server after adding the key.

## 2. Turn on email verification

In Supabase, open **Authentication > Sign In / Providers > Email**.

Use these settings:

- Enable **Email provider**.
- Enable **Confirm email** so users must verify before signing in.
- Add the local and deployed site URLs under **Authentication > URL Configuration**.

Suggested redirect URLs:

```text
http://localhost:5173/**
https://your-vercel-domain.vercel.app/**
```

## 3. Add member and staff profiles

Run this in the Supabase SQL editor:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'member' check (role in ('member', 'staff')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update their own profile name"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'member')
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();
```

## 4. Staff safety note

The sign-up form lets a user request a `staff` role for the assignment demo. For a real cafe, staff access should be approved by the owner in Supabase by changing `public.profiles.role` from `member` to `staff`.
