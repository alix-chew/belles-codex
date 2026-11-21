# Supabase Login Setup

This site is wired to the Supabase project from the dashboard link:

```text
https://zfchieymyntbmpiyixjo.supabase.co
```

## 1. Add the public key

In Supabase, open the project dashboard, then open the **Connect** dialog or **Project Settings > API**.

Copy the **publishable key**. In older projects, this may be labelled as the **anon public key**.

Create a local `.env.local` file:

```env
VITE_SUPABASE_URL=https://zfchieymyntbmpiyixjo.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key-here
```

Restart the Vite dev server after adding the key.

The app also accepts this older variable name if your dashboard shows an anon key:

```env
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

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

## 3. Add customer, staff, manager, and owner profiles

Run this in the Supabase SQL editor:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'staff', 'manager', 'owner')),
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
    coalesce(new.raw_user_meta_data ->> 'role', 'customer')
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();
```

## 4. Add login-gated purchase records

Run this after the profiles table:

```sql
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  item_name text not null,
  quantity integer not null check (quantity > 0 and quantity <= 12),
  total_sgd numeric(10, 2) not null check (total_sgd >= 0),
  status text not null default 'pending' check (status in ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Customers can create their own orders"
on public.orders
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Customers can read their own orders"
on public.orders
for select
to authenticated
using (auth.uid() = user_id);

create policy "Staff managers and owner can read all orders"
on public.orders
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('staff', 'manager', 'owner')
  )
);

create policy "Managers and owner can update order status"
on public.orders
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('manager', 'owner')
  )
);
```

## 5. Role safety note

The public sign-up form creates `customer` accounts only. Staff, manager, and owner access should be assigned by the owner in Supabase by changing `public.profiles.role`.
