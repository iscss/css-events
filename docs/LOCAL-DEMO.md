# Running the Site Locally (and Demoing with Sample Events)

## Why a local database

The site reads events from Supabase. Git branches only separate **code**, not **data**, so a sample event added to the live database is instantly public. This already happened once during development (sample events were added to the live database and had to be deleted). **Never add test or sample events to the live project.** Use a local test database instead.

## 1. Run the site against the live data (read-only)

```bash
npm install
cp .env.example .env.local      # then fill in the two values below
npm run dev                     # http://localhost:8081
```

`.env.local`:
```env
VITE_SUPABASE_URL=https://ukkqeczgommifgecyrez.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key from Supabase dashboard → Settings → API>
```

The anon key is public and read-only. `.env.local` is gitignored. Vite reads it when the dev server **starts**, so restart after changing it.

## 2. Run the site against a local test database (for demos with sample events)

This needs **Docker Desktop** running. The local database comes from the CSS Jobs repo's Supabase setup (`iscss/css-jobs`), which already has the `user_profiles` table the events table depends on.

```bash
# a) Start the local database (in the css-jobs folder)
cd ../css-jobs/css-jobs
npx supabase start

# b) Create the events table (back in this repo). Use ONLY these two files, not the seed/cleanup ones.
DB="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
cd ../../css-events
psql "$DB" -f supabase/migrations/20260305000000_create_events.sql \
           -f supabase/migrations/20260305000001_split_event_urls.sql

# c) Let the public API read it
psql "$DB" -c "GRANT SELECT ON public.events TO anon, authenticated;" \
           -c "NOTIFY pgrst, 'reload schema';"
```

Add sample events (dates are relative to today, so upcoming events stay upcoming):

```sql
INSERT INTO public.events
 (title, description, event_date, end_date, event_type, location, is_online,
  speaker, organizer, event_external_url, registration_url, meeting_url, is_published)
VALUES
('Q&A: Using LLMs for Survey Coding','Open Q&A on LLMs for coding survey responses.',
  now()+interval '9 days', now()+interval '9 days 1 hour','Q&A','Online (Zoom)',true,
  'Dr. Jane Doe','ISCSS','https://iscss.org',NULL,'https://zoom.us',true),
('Workshop: Network Analysis with Python','Hands-on introduction to social network analysis.',
  now()+interval '23 days', now()+interval '23 days 2 hours','Workshop','Room 301, University of Pennsylvania',false,
  'Dr. John Smith','ISCSS','https://iscss.org','https://iscss.org',NULL,true),
('Seminar: Measuring Misinformation at Scale','In-person and remote attendance.',
  now()+interval '38 days', now()+interval '38 days 1 hour','Seminar','Annenberg School, Philadelphia',true,
  'Prof. Alex Rivera','ISCSS','https://iscss.org','https://iscss.org','https://zoom.us',true),
('Winter Social','Informal evening for members.',
  now()+interval '55 days', NULL,'Social','Philadelphia, PA',false,
  NULL,'ISCSS',NULL,NULL,NULL,true),
('Text-as-Data Summit','Two-day conference on text analysis.',
  now()+interval '98 days', now()+interval '99 days','Conference','Boston, MA',true,
  NULL,'ISCSS','https://iscss.org','https://iscss.org','https://zoom.us',true);
```

Point the site at it. In `.env.local`:
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<local anon key: run `npx supabase status` in the css-jobs folder, or copy VITE_SUPABASE_ANON_KEY from css-jobs/.env>
```
Then restart `npm run dev` and open **http://localhost:8081** (not the "Network" address, which other devices can't use to reach the local database). Use a hard refresh (Cmd+Shift+R).

**Switch back to live data:** put the live URL and key back into `.env.local` and restart. Keep a copy of your live settings somewhere safe (not in git).

### Why the CSP change in `vite.config.ts`

In development mode, `vite.config.ts` sends a security policy that only allows connections to `*.supabase.co`. The branch adds `http://127.0.0.1:54321` to it so the browser lets the site talk to the local database. It applies to **development only**, not to the deployed site (the production policy is in `vercel.json`).

### Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Only the hard-coded IC²S² event shows | Browser is blocking the local database (CSP), or `.env.local` wasn't reloaded. Restart `npm run dev`, hard refresh |
| API says "permission denied for table events" | Run the `GRANT SELECT` command in step c |
| API says table not found | Run `NOTIFY pgrst, 'reload schema'` |
| No events at all | Docker Desktop isn't running, or the local database wasn't started |
| Upcoming tab is empty | Sample dates are relative to when you inserted them. Re-run the inserts |
| Page looks "stuck" on one event | A filter is on. Check the "Filtered" bar and click **Clear all** (a selected calendar date filters to that day) |

## Useful commands

```bash
npm run dev        # dev server on http://localhost:8081
npm run build      # production build (also a quick check that everything compiles)
npx tsc --noEmit -p tsconfig.app.json   # type check
```
