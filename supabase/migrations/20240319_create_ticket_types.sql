create table ticket_types (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade,
  name text not null,
  description text,
  price decimal(10,2) not null,
  quantity integer,
  start_sale_date timestamp with time zone,
  end_sale_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table ticket_types enable row level security;

-- Create policies
create policy "Ticket types are viewable by everyone"
  on ticket_types for select
  using ( true );

create policy "Users can insert ticket types for their events"
  on ticket_types for insert
  with check (
    exists (
      select 1 from events
      where id = event_id
      and created_by = auth.uid()
    )
  );

create policy "Users can update ticket types for their events"
  on ticket_types for update
  using (
    exists (
      select 1 from events
      where id = event_id
      and created_by = auth.uid()
    )
  );

create policy "Users can delete ticket types for their events"
  on ticket_types for delete
  using (
    exists (
      select 1 from events
      where id = event_id
      and created_by = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to update updated_at
create trigger update_ticket_types_updated_at
  before update on ticket_types
  for each row
  execute function update_updated_at_column(); 