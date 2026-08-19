-- Hammer Head Towing — Supabase Schema
create extension if not exists "uuid-ossp";

create table if not exists service_requests (
  id                       uuid primary key default uuid_generate_v4(),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  status                   text not null default 'new',
  name                     text,
  phone                    text,
  email                    text,
  situation                text,
  service_type             text,
  urgency                  text,
  pickup_address           text,
  pickup_latitude          double precision,
  pickup_longitude         double precision,
  destination_address      text,
  destination_latitude     double precision,
  destination_longitude    double precision,
  vehicle_year             text,
  vehicle_make             text,
  vehicle_model            text,
  vehicle_color            text,
  vehicle_condition        text,
  vin                      text,
  license_plate            text,
  license_plate_state      text,
  keys_available           text,
  po_number                text,
  notes                    text,
  photo_urls               jsonb default '[]'::jsonb,
  source                   text,
  medium                   text,
  campaign                 text,
  content                  text,
  term                     text,
  gclid                    text,
  fbclid                   text,
  referrer                 text,
  landing_page             text,
  user_agent               text,
  attio_status             text default 'pending',
  attio_record_id          text,
  attio_last_attempt_at    timestamptz,
  attio_error              text,
  towbook_status           text default 'pending',
  towbook_reference        text,
  towbook_attempt_count    integer not null default 0,
  towbook_last_attempt_at  timestamptz,
  towbook_submitted_at     timestamptz,
  towbook_error            text,
  completed_at             timestamptz,
  job_value                numeric(10,2)
);

create index idx_sr_status on service_requests (status);
create index idx_sr_towbook_status on service_requests (towbook_status);
create index idx_sr_created on service_requests (created_at desc);
create index idx_sr_source on service_requests (source);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_sr_updated
  before update on service_requests
  for each row execute function update_updated_at();

create table if not exists request_events (
  id          uuid primary key default uuid_generate_v4(),
  request_id  uuid not null references service_requests(id) on delete cascade,
  event_type  text not null,
  message     text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index idx_re_request on request_events (request_id, created_at desc);

alter table service_requests enable row level security;
alter table request_events   enable row level security;

create policy admin_all_sr on service_requests for all to authenticated using (true) with check (true);
create policy admin_all_re on request_events for all to authenticated using (true) with check (true);
create policy anon_insert_sr on service_requests for insert to anon with check (true);

-- STORAGE: Create bucket "service-request-photos" (public, 10MB limit, image/* types)
-- via Supabase Dashboard → Storage → Create bucket.
