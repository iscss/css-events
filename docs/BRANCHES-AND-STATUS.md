# Branches, Status, and Pausing/Resuming

_Last updated: November 2026_

## Current status

**The live site (events.iscss.org) is paused.** The Vercel project was paused in November 2026 at the lab's request: the project is on hold and should not be publicly reachable. Visitors see a Vercel "DEPLOYMENT_PAUSED" (503) page. Nothing was deleted: all code is on GitHub, and the database is untouched.

## The two branches

| | `main` | `redesign-events-pages` |
|---|---|---|
| What it is | The version that was live on events.iscss.org | The redesigned version, **never deployed** |
| Home page | Hero section + next 6 events (`/`), separate Events page (`/events`) | None. `/` **is** the Events page |
| Header | ISCSS, Home, Events, Admin (admins only), Sign In/Out | `ISCSS Events` on the left, a ≡ menu on the right with **Upcoming Events** and **Past Events** |
| Adding events | Admin page at `/admin` (sign-in required) | **Supabase dashboard only** (see `ADDING-EVENTS.md`). No admin or sign-in pages |
| Filters | **Search box**, Event type dropdown, online filter | Tabs (All / Upcoming / Past), mini calendar, Event type checkboxes, **Event format** (Online / In-Person / Hybrid). **No search box** (it was dropped in the redesign) |
| Filter state | Not in the URL | In the URL (`?tab=`, `?date=`, `?type=`, `?format=`), with a "Filtered · Clear all" bar |
| Text size | Small | About 3px larger throughout |
| Extra pages | Auth, Admin | Past Events highlights (IC²S² history), About, Contact (these three exist but are **not linked** from the menu) |
| Local-demo support | No | Yes (`vite.config.ts` allows the local Supabase in dev mode) |

Both branches use the same Supabase project and the same `events` table.

### What changed on `redesign-events-pages` (commit by commit, oldest first)

1. Redesign events pages; add Past Events, About, Contact
2. Simplify nav; remove admin pages, sign-in, and auth code; events managed in Supabase
3. Remove the List/Calendar toggle
4. Filter tabs become All / Upcoming / Past
5. Home page shows the next 4 upcoming events (later removed with the home page)
6. Add the **Event format** filter, then restyle it to match Event type
7. Open directly on the Events page; replace nav with the ≡ menu; remove the old home page
8. Keep all filters in the URL; add the Filtered / Clear all bar
9. Larger text; "ISCSS Events" header aligned to page edges
10. Allow local Supabase in the dev-mode CSP (for local demos)

Run `git log origin/main..origin/redesign-events-pages --oneline` to see the full list.

## Resuming: un-pausing the live site

The project is on Vercel under the `admin@iscss.org` account.

1. Sign in to Vercel as `admin@iscss.org`, open the **css-events** project.
2. The project shows as paused. Press **Resume** (in **Settings**, or the banner at the top).
3. Check https://events.iscss.org loads. This brings back whatever was last deployed, which is the **old `main` version** (with Home, Admin, sign-in).

If the domain stopped working, check **Settings → Domains** that `events.iscss.org` is attached.

## Going live with the new design

Vercel auto-deploys from `main`. To publish the redesign:

1. Review it locally first (see `LOCAL-DEMO.md`).
2. Open a pull request from `redesign-events-pages` into `main` and merge it. Vercel then deploys it.
3. **Understand what changes for admins:** the Admin and sign-in pages disappear. From then on, events are added in the Supabase dashboard (see `ADDING-EVENTS.md`). Make sure whoever runs the site has Supabase access first.
4. Check the live site, including the ≡ menu, the Upcoming / Past views, and a filtered link.

To go back, revert the merge commit on `main`, or redeploy the previous deployment from Vercel's **Deployments** list (use the three dots → **Promote to Production**, or **Instant Rollback**).

## Keeping the site off the internet completely

Pausing the Vercel project takes the **website** down, but the **data** is still readable through the Supabase API using the site's public key. To hide the event data as well, set `is_published = false` on all rows in the `events` table (Supabase dashboard → Table Editor → events). The site only ever shows published events.

Also remove or hide links to the events site from other pages (the CSS Jobs footer links to it).

## Accounts

- **Vercel** and **Supabase**: both under `admin@iscss.org`.
- **GitHub:** `iscss/css-events` (this repo). The sister repo is `iscss/css-jobs`.
- The Supabase project (`ukkqeczgommifgecyrez`) is **shared with the CSS Jobs board**. Be careful with changes: they can affect both sites.
