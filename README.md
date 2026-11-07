# CSS Events: Computational Social Science Events

> ## ⏸️ Status: PAUSED (November 2026)
> The live site **events.iscss.org is paused** (Vercel project paused at the lab's request). The project is on hold and may be picked up later. Nothing was deleted: all code is on GitHub and the database is untouched.
> **To resume:** see [docs/BRANCHES-AND-STATUS.md](docs/BRANCHES-AND-STATUS.md).

**Sister site:** [CSS Jobs](https://jobs.iscss.org) · https://github.com/iscss/css-jobs
**Accounts:** Vercel and Supabase are under `admin@iscss.org`
**Supabase project:** `ukkqeczgommifgecyrez`, **shared with the CSS Jobs board**

An events listing site for the Computational Social Science community. Visitors browse upcoming and past events and filter them. There is no approval workflow.

---

## Documentation: start here

| Read this | For |
|---|---|
| [docs/BRANCHES-AND-STATUS.md](docs/BRANCHES-AND-STATUS.md) | The two branches (`main` vs `redesign-events-pages`), what's different, **how to un-pause the site**, how to go live with the redesign |
| [docs/ADDING-EVENTS.md](docs/ADDING-EVENTS.md) | **How to add, edit, hide, and delete events**; Online / In-Person / Hybrid rules |
| [docs/DESIGN-GUIDE.md](docs/DESIGN-GUIDE.md) | Fonts, colors, text sizes, layout, components, hard-coded content |
| [docs/LOCAL-DEMO.md](docs/LOCAL-DEMO.md) | Running locally; a local test database with sample events (never test on the live database) |
| [docs/FUTURE-IDEAS.md](docs/FUTURE-IDEAS.md) | Event automation plan, jobs board redesign mockups, known gaps |

---

## Branches at a glance

- **`main`**: the version that was live. Has a Home page, an Events page, and an `/admin` page with sign-in for adding events.
- **`redesign-events-pages`**: the redesign, **never deployed**. Opens directly on the Events page, a ≡ menu with Upcoming / Past Events, Event format filter, URL-based filters, larger text. No admin or sign-in pages: events are added in the Supabase dashboard.

Vercel deploys from `main`, so nothing in `redesign-events-pages` is public until it is merged.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # add the Supabase URL and anon key
npm run dev                  # http://localhost:8081
npm run build                # production build
```

Environment variables (`.env.local`, and the Vercel dashboard for deployment):

```env
VITE_SUPABASE_URL=https://ukkqeczgommifgecyrez.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key from Supabase dashboard → Settings → API>
```

These are public, read-only keys. Vite bakes `VITE_*` variables into the build, so **redeploy after changing them in Vercel**. For demos with sample events use a local database: see [docs/LOCAL-DEMO.md](docs/LOCAL-DEMO.md).

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui + Radix UI |
| Data | Supabase (PostgreSQL) |
| State | React Query (`@tanstack/react-query`) |
| Routing | React Router v6 |
| Security | DOMPurify + Row-Level Security |
| Hosting | Vercel (frontend) + Supabase Cloud (database) |

---

## Project structure (`redesign-events-pages`)

```
css-events/
├── docs/                    # Handover documentation (see above)
├── src/
│   ├── pages/               # Events (home), PastEvents, About, Contact, NotFound
│   ├── components/
│   │   ├── events/          # EventCard, EventDetailsModal, EventFilters, MiniCalendar
│   │   ├── layout/          # Header (ISCSS Events + ≡ menu), Footer
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/useEvents.ts   # Reads published events (read-only, cached 5 min)
│   ├── lib/                 # eventFormat (Online/In-Person/Hybrid), sanitize, utils
│   ├── data/                # IC²S² conference history
│   └── integrations/        # Supabase client + generated types
├── supabase/migrations/     # SQL for the events table
├── public/                  # favicon, team photos
└── vercel.json              # Deployment config + security headers
```

### Routes

| Route | Page |
|---|---|
| `/` | Events page (home). Filters live in the URL: `?tab=upcoming\|past`, `?date=YYYY-MM-DD`, `?type=`, `?format=` |
| `/events` | Redirects to `/` |
| `/past-events`, `/about`, `/contact` | Exist, but not linked from the menu |

---

## Database

Table `events`: `id`, `title`, `description`, `event_date`, `end_date`, `event_type` (Q&A / Workshop / Seminar / Conference / Social / Other), `location`, `is_online`, `event_external_url`, `meeting_url`, `registration_url`, `speaker`, `organizer`, `is_published`, `posted_by`, `created_at`, `updated_at`. Full details and how to add events: [docs/ADDING-EVENTS.md](docs/ADDING-EVENTS.md).

**Row-Level Security:** the public can read **published** events only. Writes are limited to admins; the Supabase dashboard bypasses RLS.

Migrations are in `supabase/migrations/`:

```bash
npx supabase link --project-ref ukkqeczgommifgecyrez   # one-time
npx supabase migration new description_here            # create
npx supabase db push                                   # apply to the live database
npx supabase gen types typescript --project-id ukkqeczgommifgecyrez > src/integrations/supabase/types.ts
```

The Supabase project is shared with css-jobs, so its migration history contains both projects' migrations. **Check both sites before changing shared tables.**

---

## Deployment

- **Frontend:** Vercel, auto-deploys from `main` on `iscss/css-events`. Account `admin@iscss.org`. Environment variables are set in the Vercel dashboard.
- **Currently paused.** Resume in Vercel → project → **Resume**; see [docs/BRANCHES-AND-STATUS.md](docs/BRANCHES-AND-STATUS.md).

---

## Security

- Input sanitization via DOMPurify (`src/lib/sanitize.ts`)
- Row-Level Security on `events` (public reads published rows only)
- Content Security Policy: `vercel.json` (production) and `vite.config.ts` (development only)
- The site contains no secrets: only the public anon key. Keep any future API keys (e.g. for event automation) in Supabase secrets, never in website code.
