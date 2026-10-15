# CSS Events - Computational Social Science Events

**Production URL:** https://events.iscss.org
**Sister site:** [CSS Jobs](https://jobs.iscss.org) (https://github.com/iscss/css-jobs)
**Accounts:** Vercel and Supabase are under `admin@iscss.org`

> This app was scaffolded from CSS Jobs and shares the same Supabase backend. The CSS Jobs repo contains a detailed `HANDOVER.md` written in December 2025 that covers the shared infrastructure (Supabase auth, user profiles, admin system, RLS policies, deployment patterns) in depth. Everything described there about the shared pieces (auth, user_profiles, admin checks) applies here as well. The key difference is that CSS Events has no approval workflow — admins post events directly — and the `events` table is specific to this app.

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Supabase credentials to .env

# Start development server
npm run dev
# Opens at http://localhost:8081

# Build for production
npm run build
```

---

## What This Application Does

An events listing site for the **Computational Social Science** community. Sister site to [CSS Jobs](https://jobs.iscss.org) — same Supabase project, same auth, same admin users.

- **Public visitors:** Browse upcoming events, filter by type/format, view event details
- **Admins:** Add, edit, publish/unpublish, and delete events directly in the Supabase dashboard (no admin pages on the site, no approval workflow)

### Event Types

Q&A, Workshop, Seminar, Conference, Social, Other

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **UI** | Tailwind CSS + shadcn/ui + Radix UI |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **State** | React Query (@tanstack/react-query) |
| **Routing** | React Router v6 |
| **Security** | DOMPurify + Row-Level Security (RLS) |
| **Hosting** | Vercel (frontend) + Supabase Cloud (backend) |

---

## Project Structure

```
css-events/
├── src/
│   ├── pages/              # Route pages (Index, Events, PastEvents, About, Contact, NotFound)
│   ├── components/
│   │   ├── events/         # EventCard, EventDetailsModal, EventFilters
│   │   ├── layout/         # Header, Footer
│   │   └── ui/             # shadcn/ui components (shared with css-jobs)
│   ├── hooks/              # useEvents (read-only)
│   ├── integrations/       # Supabase client + types
│   └── lib/                # Utilities (sanitize, utils)
├── supabase/
│   └── migrations/         # SQL migrations for events table
├── public/                 # Static assets (team photos, favicon)
└── vercel.json             # Deployment config with security headers
```

---

## Relationship to CSS Jobs

CSS Events shares the **same Supabase project** as CSS Jobs (`ukkqeczgommifgecyrez`). This means:

- **Same project:** This site has no sign-in of its own; the shared auth tables are used by CSS Jobs
- **Same `user_profiles` table:** Still used by the database's admin-only permissions on `events`
- **Separate `events` table:** Events data is independent from jobs data
- **Separate codebase:** UI components were copied (not shared) so the two apps can diverge independently

---

## Environment Variables

Required in `.env` (and in Vercel dashboard):

```env
VITE_SUPABASE_URL=https://ukkqeczgommifgecyrez.supabase.co
VITE_SUPABASE_ANON_KEY=<your_anon_key>
```

These are public/client-safe keys. Get them from: [Supabase Dashboard](https://supabase.com/dashboard/project/ukkqeczgommifgecyrez) > Settings > API

**Important:** Vite bakes `VITE_*` variables into the bundle at build time. If you add or change them in Vercel, you must redeploy for changes to take effect.

---

## Database

### Events Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated |
| `title` | text | Event title |
| `description` | text | Longer details |
| `event_date` | timestamptz | Start date/time |
| `end_date` | timestamptz | Optional end time |
| `event_type` | enum | Q&A, Workshop, Seminar, Conference, Social, Other |
| `location` | text | Physical location or "Online" |
| `is_online` | boolean | Whether the event is virtual |
| `event_external_url` | text | External page describing the event |
| `meeting_url` | text | Zoom/Teams link |
| `registration_url` | text | Registration page |
| `speaker` | text | Speaker name(s) |
| `organizer` | text | Organizing group or person |
| `is_published` | boolean | Visible to public when true |
| `posted_by` | UUID (FK) | References `user_profiles.id` |
| `created_at` | timestamptz | Auto-set |
| `updated_at` | timestamptz | Auto-updated via trigger |

### Row-Level Security (RLS)

- **Public:** Can read published events
- **Admins:** Manage events in the Supabase dashboard (which bypasses RLS)

### Migrations

Migrations live in `supabase/migrations/`. To apply:

```bash
# Link to the Supabase project (one-time)
npx supabase link --project-ref ukkqeczgommifgecyrez

# Push migrations
npx supabase db push
```

**Note:** This project shares a Supabase instance with css-jobs. Both projects have their own local migration files. The remote migration history tracks all migrations from both projects.

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero section + next 6 upcoming events |
| `/events` | Events | Full listing with search, type, and online/in-person filters |

---

## Adding and Editing Events

The site has no admin pages or sign-in. Events are managed directly in the Supabase dashboard (account: `admin@iscss.org`).

1. Open the Supabase dashboard and go to **Table Editor → events**
2. Click **Insert → Insert row** (or click a cell to edit an existing row)
3. Fill in the fields below and save
4. The event appears on the site within ~5 minutes (the site caches the event list)

| Column | Notes |
|--------|-------|
| `title` | Required |
| `event_date` | Required. Start date/time. Enter in UTC (e.g. `2026-11-05 15:00:00+00`) |
| `event_type` | Required. One of: `Q&A`, `Workshop`, `Seminar`, `Conference`, `Social`, `Other` |
| `description`, `speaker`, `organizer`, `location` | Optional text |
| `end_date` | Optional |
| `is_online` | `true` for virtual events |
| `event_external_url`, `meeting_url`, `registration_url` | Optional links (event page, Zoom/meeting link, sign-up) |
| `is_published` | **Must be `true` for the event to show.** Default is `false` (draft) |

Leave `id`, `created_at`, `updated_at`, and `posted_by` blank. To hide or remove an event, set `is_published` to `false` or delete the row.

Row-Level Security on the `events` table means the public site can only read published events. Dashboard edits are not affected by it.

---

## Deployment

### Frontend (Vercel)

- Auto-deploys from `main` branch on GitHub (`iscss/css-events`)
- Environment variables must be set in Vercel dashboard
- Account: `admin@iscss.org`

### Database (Supabase)

```bash
# Create a new migration
npx supabase migration new description_here

# Edit the generated SQL file in supabase/migrations/

# Apply to production
npx supabase db push

# Regenerate TypeScript types (if schema changed)
npx supabase gen types typescript --project-id ukkqeczgommifgecyrez > src/integrations/supabase/types.ts
```

### Development

```bash
npm run dev      # Start dev server (port 8081)
npm run build    # Production build
npx tsc --noEmit # Type check
npx vitest run   # Run tests
```

---

## Security

- **Input sanitization** via DOMPurify (`src/lib/sanitize.ts`) — all user inputs sanitized before storage, URLs auto-prefixed with `https://` if no protocol provided
- **Row-Level Security** on the `events` table — public reads published only, admin CRUD
- **Content Security Policy** headers in both `vercel.json` (production) and `vite.config.ts` (development)
- **CORS:** Supabase client connects only to the project's own endpoint
