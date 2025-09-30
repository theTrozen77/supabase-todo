-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tasks table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

-- Create policies for profiles table
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on profiles for insert 
  with check (auth.uid() = id);

-- Create policies for tasks table
create policy "Users can view own tasks" 
  on tasks for select 
  using (auth.uid() = user_id);

create policy "Users can create own tasks" 
  on tasks for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own tasks" 
  on tasks for update 
  using (auth.uid() = user_id);

create policy "Users can delete own tasks" 
  on tasks for delete 
  using (auth.uid() = user_id);

-- Create function to handle updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_tasks
  before update on public.tasks
  for each row execute procedure public.handle_updated_at();

-- Create function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
