
-- Profiles for candidates
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  district text,
  bio text,
  skills text[] default '{}',
  experience_years int default 0,
  voice_resume_url text,
  generated_resume jsonb,
  trust_score int default 0,
  certificates text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Vacancies
create table public.vacancies (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references auth.users(id) on delete set null,
  title text not null,
  company text not null,
  district text not null,
  salary_min int,
  salary_max int,
  currency text default 'KZT',
  description text,
  requirements text[] default '{}',
  skills text[] default '{}',
  employment_type text default 'full_time',
  is_urgent boolean default false,
  raw_text text,
  status text default 'active',
  views int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vacancies enable row level security;

create policy "Active vacancies viewable by everyone"
  on public.vacancies for select using (status = 'active' or auth.uid() = employer_id);

create policy "Authenticated users can create vacancies"
  on public.vacancies for insert with check (auth.uid() is not null);

create policy "Owners update their vacancies"
  on public.vacancies for update using (auth.uid() = employer_id);

create policy "Owners delete their vacancies"
  on public.vacancies for delete using (auth.uid() = employer_id);

create index idx_vacancies_district on public.vacancies(district);
create index idx_vacancies_status on public.vacancies(status);

-- Applications
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  vacancy_id uuid not null references public.vacancies(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  match_score int default 0,
  status text default 'pending',
  cover_message text,
  created_at timestamptz not null default now(),
  unique (vacancy_id, candidate_id)
);

alter table public.applications enable row level security;

create policy "Candidates see their own applications"
  on public.applications for select
  using (auth.uid() = candidate_id or auth.uid() in (
    select employer_id from public.vacancies where id = vacancy_id
  ));

create policy "Candidates create applications"
  on public.applications for insert with check (auth.uid() = candidate_id);

create policy "Candidates update own applications"
  on public.applications for update using (auth.uid() = candidate_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Seed vacancies for demo
insert into public.vacancies (title, company, district, salary_min, salary_max, description, requirements, skills, employment_type, is_urgent) values
('Официант', 'Caspian Lounge', '14 мкр', 180000, 250000, 'Жаңа ашылған кафеге официант керек. Тәжірибе міндетті емес, үйретеміз.', array['Жауапкершілік', 'Қазақ/Орыс тілі'], array['Сервис', 'Командалық жұмыс'], 'full_time', true),
('Бариста', 'Aktau Coffee Co', '15 мкр', 200000, 280000, 'Тәжірибелі бариста іздейміз. Latte art білу — плюс.', array['1+ жыл тәжірибе'], array['Бариста', 'Latte art'], 'full_time', false),
('Сатушы-консультант', 'Mangystau Mall', '11 мкр', 170000, 230000, 'Киім дүкеніне сатушы керек. Ауысыммен жұмыс.', array['Коммуникабельділік'], array['Сату', 'Кеңес беру'], 'part_time', false),
('Курьер', 'AktauExpress', '12 мкр', 220000, 350000, 'Жеке көлігі бар курьер. Бензин компенсацияланады.', array['Жеке көлік', 'Жүргізуші куәлігі'], array['Жүргізу', 'Навигация'], 'full_time', true),
('SMM маман', 'Caspian Digital', '7 мкр', 250000, 400000, 'Кіші бизнес үшін Instagram жүргізу.', array['Reels түсіре алу', 'Дизайн негіздері'], array['SMM', 'Canva', 'Reels'], 'remote', false),
('Әкімші', 'Wellness Spa Aktau', '4 мкр', 200000, 280000, 'Спа-салонға әкімші. Жұмыс ауысыммен.', array['Қазақ/Орыс тілі', 'Microsoft Office'], array['Әкімшілік', 'Клиентпен жұмыс'], 'full_time', false),
('Аспаз көмекшісі', 'Plov Kitchen', '8 мкр', 180000, 240000, 'Аспаз көмекшісі. Үйретеміз.', array['Денсаулық кітапшасы'], array['Ас үй', 'Тазалық'], 'full_time', true),
('Балаларға ағылшын тілі мұғалімі', 'Smart Kids Center', '13 мкр', 220000, 350000, 'Бастауыш сынып балалары үшін.', array['Intermediate+ ағылшын тілі'], array['Ағылшын', 'Педагогика'], 'part_time', false);
