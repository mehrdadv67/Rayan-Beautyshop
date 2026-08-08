-- Create profiles table for extended user data
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  first_name text,
  last_name text,
  phone_number text,
  address text,
  city text,
  zip_code text,
  gender text check (gender in ('male', 'female')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select using ( true );

create policy "Users can insert their own profile."
  on profiles for insert with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update using ( auth.uid() = id );
