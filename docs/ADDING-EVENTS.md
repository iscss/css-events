# Adding and Managing Events

On the `redesign-events-pages` branch there are **no admin pages and no sign-in**. Events are added directly to the database through the Supabase dashboard. (On `main`, the old `/admin` page does this instead. See `BRANCHES-AND-STATUS.md`.)

## Add an event

1. Sign in to the [Supabase dashboard](https://supabase.com/dashboard/project/ukkqeczgommifgecyrez) with the `admin@iscss.org` account.
2. Open **Table Editor → events**.
3. Click **Insert → Insert row**, fill in the fields below, and save.
4. The event shows on the site within about **5 minutes** (the site caches the list).

| Column | Required? | Notes |
|---|---|---|
| `title` | Yes | Shown as the event title |
| `event_date` | Yes | Start date and time, **in UTC**. e.g. `2026-11-05 15:00:00+00` is 10:00 AM US Eastern in winter (11:00 AM in summer) |
| `event_type` | Yes | Exactly one of: `Q&A`, `Workshop`, `Seminar`, `Conference`, `Social`, `Other` |
| `is_published` | Yes | **Must be `true` for the event to appear.** The default is `false` (a hidden draft) |
| `end_date` | No | End time. Without it, the event counts as "past" after its start time |
| `description` | No | Shown in the Details popup |
| `speaker`, `organizer` | No | `organizer` shows as a tag on the card |
| `location` | No | Place, or "Online (Zoom)" |
| `is_online` | No | `true` for virtual or hybrid events |
| `event_external_url` | No | Page about the event ("Details") |
| `meeting_url` | No | Zoom / Teams link (shows a **Join** button) |
| `registration_url` | No | Sign-up page (shows a **Register** button) |

Leave `id`, `created_at`, `updated_at`, and `posted_by` blank.

## Online / In-Person / Hybrid

There is no "format" column. The site works it out from two fields (`src/lib/eventFormat.ts`):

| `is_online` | `location` | Shown as |
|---|---|---|
| false | anything | **In-Person** |
| true | empty, or starts with "Online", "Virtual", "Zoom", "Remote", "Webinar", "Teams", "Google Meet" | **Online** |
| true | a real place (e.g. "Room 301, Penn") | **Hybrid** |

So for a hybrid event, tick `is_online` **and** put the physical place in `location`.

## Edit, hide, delete

- **Edit:** click a cell in the Table Editor and change it. (Allow up to 5 minutes to show on the site.)
- **Hide without deleting:** set `is_published` to `false`.
- **Delete:** delete the row.

## Upcoming vs Past

Nothing to do by hand. An event moves to the **Past** view automatically when its `end_date` (or its `event_date` when there's no end date) has passed. Do not delete old events if you want a past-events archive.

## Adding by SQL (many events at once)

In Supabase → **SQL Editor**:

```sql
INSERT INTO public.events
  (title, description, event_date, end_date, event_type, location, is_online,
   speaker, organizer, event_external_url, registration_url, meeting_url, is_published)
VALUES
  ('Workshop: Example', 'Short description.',
   '2027-02-10 15:00:00+00', '2027-02-10 17:00:00+00', 'Workshop',
   'Room 301, University of Pennsylvania', false,
   'Dr. Jane Doe', 'ISCSS', 'https://iscss.org', NULL, NULL, true);
```

**Warning:** this is the **live** database, and any published row is public immediately on the live site (once it's running). Never add test or sample rows here. Use the local test database instead (see `LOCAL-DEMO.md`).

## Who can change events

Row-Level Security (RLS) on the `events` table lets the public read **published** events only. Writes are limited to admin users (`user_profiles.is_admin = true`). The Supabase dashboard connects with elevated rights and isn't limited by RLS, so dashboard edits always work.

The Supabase project is **shared with the CSS Jobs board**. Don't change shared tables (`user_profiles`, etc.) without checking the jobs board.

## Database columns (reference)

`events`: `id` (UUID), `title`, `description`, `event_date`, `end_date`, `event_type` (enum), `location`, `is_online`, `event_external_url`, `meeting_url`, `registration_url`, `speaker`, `organizer`, `is_published`, `posted_by`, `created_at`, `updated_at`. The setup files are in `supabase/migrations/`.
