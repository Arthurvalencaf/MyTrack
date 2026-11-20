create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  weekdays smallint[] not null default '{0,1,2,3,4,5,6}',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table check_ins (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  checked_on date not null,
  created_at timestamptz not null default now(),
  unique (habit_id, checked_on)
);

create index on habits (user_id);
create index on check_ins (user_id, checked_on);

alter table habits enable row level security;
alter table check_ins enable row level security;