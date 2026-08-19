# Hammer Head Towing — Integration Setup Guide

Everything you need to go from fresh deploy to production.

---

## 1. Supabase

### Create project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `hammer-head-towing` (or whatever you like)
3. Set a strong database password and save it
4. Choose a region close to Long Island (US East)

### Run the schema
1. In your Supabase dashboard → SQL Editor
2. Open `supabase/migrations/001_initial_schema.sql` from this repo
3. Paste and run it — this creates the `service_requests` and `request_events` tables with all columns, indexes, RLS policies, and triggers

### Create the photo storage bucket
1. Dashboard → Storage → New bucket
2. Name: `service-request-photos`
3. Public: **Yes** (so admin can view photo URLs)
4. File size limit: 10 MB
5. Allowed MIME types: `image/jpeg, image/png, image/webp, image/heic`

### Configure authentication
1. Dashboard → Authentication → Settings
2. Under "Email Auth" — make sure it's enabled
3. You do **not** need to enable social providers

### Create the first admin user
1. Dashboard → Authentication → Users → Invite user
2. Enter the admin email (e.g. `admin@hammerheadtowing.com`)
3. They'll receive a confirmation email
4. Or: use the SQL editor to insert directly via `auth.users`

### Get your keys
1. Dashboard → Settings → API
2. Copy **Project URL** → this is `VITE_SUPABASE_URL` and `SUPABASE_URL`
3. Copy **anon public key** → this is `VITE_SUPABASE_ANON_KEY`
4. Copy **service_role secret key** → this is `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ The service role key is **never** exposed to the browser. It goes in Netlify env vars only.

---

## 2. Attio CRM

### Create API key
1. Go to [app.attio.com](https://app.attio.com)
2. Settings → Developers → API keys → Create
3. Permissions needed: **Read/Write** on People
4. Copy the key → this is `ATTIO_API_KEY`

### How it works
- When a towing request comes in, the system upserts a Person in Attio using the customer's email
- If the person already exists (matched by email), their info is updated
- The Supabase request ID is stored as the `attio_record_id`
- If it fails, admin can retry from the request detail panel

---

## 3. Towbook

### Public form endpoint
The Towbook integration submits to the public request form at:
```
https://public.towbook.com/KrKN
```

This is your Hammer Head Towing public Towbook form. The system POSTs form data to it with these fields:

| Our field | Towbook field |
|-----------|---------------|
| pickup_address | VehicleLocation |
| destination_address | Destination |
| situation | Reason |
| license_plate | LicensePlate |
| license_plate_state | LicensePlateState |
| vin | VIN |
| vehicle_year | Year |
| vehicle_make | Make |
| vehicle_model | Model |
| vehicle_color | Color |
| po_number | PONumber |
| notes | Notes |
| name | FirstLastName |
| phone | PhoneNumber |
| email | Email |

### Environment variables
- `TOWBOOK_ENDPOINT` — defaults to `https://public.towbook.com/KrKN`
- `TOWBOOK_ENABLED` — set to `true` to activate submissions. Leave `false` during testing.

### Important: duplicate protection
If a request already has `towbook_status = success` and a `towbook_reference`, the retry function will **refuse** to submit again. This prevents duplicate dispatch orders.

### If the public form doesn't accept POST
The Towbook public form may require JavaScript rendering (it may be a JS app that validates client-side). If direct POST doesn't work:

**Option A: Headless browser bot** — Use a service like Browserless, Puppeteer Cloud, or a dedicated VM to automate the form fill. The adapter in `netlify/functions/retry-towbook.js` has the field mapping ready.

**Option B: Towbook API** — If Towbook provides an official API or webhook endpoint, update the `TOWBOOK_ENDPOINT` and adjust the payload format in `buildTowbookPayload()`.

---

## 4. Netlify

### Environment variables
Go to your Netlify site → Site settings → Environment variables and add:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_URL` | Same as VITE_SUPABASE_URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `ATTIO_API_KEY` | Your Attio API key |
| `TOWBOOK_ENDPOINT` | `https://public.towbook.com/KrKN` |
| `TOWBOOK_ENABLED` | `true` when ready |

### Deploy
1. Push to your connected Git repository
2. Netlify auto-builds with `npm run build`
3. Output goes to `dist/`
4. Functions deploy from `netlify/functions/`

### Functions
The following Netlify Functions are created:

| Function | Path | Purpose |
|----------|------|---------|
| `create-service-request` | `/.netlify/functions/create-service-request` | Public — accepts form submissions |
| `retry-towbook` | `/.netlify/functions/retry-towbook` | Admin — retries failed Towbook |
| `retry-attio` | `/.netlify/functions/retry-attio` | Admin — retries failed Attio |
| `update-request` | `/.netlify/functions/update-request` | Admin — updates status/job value |
| `upload-photo` | `/.netlify/functions/upload-photo` | Public — uploads photos to Supabase Storage |

---

## 5. Testing Checklist

- [ ] Submit a test request via `/request-recovery`
- [ ] Verify it appears in Supabase `service_requests` table
- [ ] Log into `/admin/login` with your admin credentials
- [ ] Verify the request appears in the dashboard
- [ ] Test Retry Towbook button
- [ ] Test status changes (Set status dropdown)
- [ ] Test job value entry
- [ ] Verify marketing attribution captures UTM params
- [ ] Test with `?utm_source=google&utm_campaign=test` in the URL

---

## Architecture Diagram

```
Customer → Landing Page → Request Form
                              ↓
                    Netlify Function (create-service-request)
                              ↓
                    ┌── SAVE TO SUPABASE (first!) ──┐
                    ↓                                ↓
                  Attio                           Towbook
                  (CRM sync)                      (form POST)
                    ↓                                ↓
                    └──── Status updates ────────────┘
                              ↓
                      Admin Dashboard
                    (real-time Supabase queries)
```

The golden rule: **Supabase gets the request before anything else.** If Towbook or Attio fail, the lead is safe in Supabase and the admin sees it immediately in the Attention queue.
