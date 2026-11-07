# Future Ideas, Open Decisions, and Loose Ends

## 1. Automating event collection (not built)

Idea: automatically find computational-social-science events and add them to the site, the same way the CSS Jobs board has an automated job importer. **Nothing is built yet.** The design:

1. **Source list (maintained by a person).** A small `event_sources` table: name, url, kind (`ical` / `rss` / `webpage`), enabled, last_checked, last_status. Start with 3–5 reliable sources, such as conference sites, university center calendars and calendar feeds.
2. **Daily scheduled job** (a Supabase scheduled function; the jobs importer is the template). For each enabled source: fetch it. Calendar and RSS feeds have clean fields. Plain web pages go to an AI step that extracts title, date and time, time zone, location, format, type and link. The AI must leave a field blank when unsure rather than guess a date.
3. **Filter.** Drop events that already ended, and score relevance to computational social science; discard low scores.
4. **Dedupe.** Skip anything already in `events` (same link, or same title and date).
5. **Insert as unpublished** (`is_published = false`), tagged as auto-imported with the source. A database rule can enforce this so a bug can never publish an event.
6. **Human review.** Someone reviews the pending rows in the Supabase table editor, fixes mistakes, and sets `is_published = true`.
7. **Run log.** Record counts per source, since 0 events from a source usually means its page layout changed.

Needs: a few extra columns on `events` (`source`, `is_auto_imported`, relevance score), the AI API key (store it in Supabase secrets, never in website code; its status is being checked with Alex), and a decision on who reviews events and how often.

**Past events.** Imported events become "past" automatically on their date and stay in the database (don't delete old rows). History from before the importer started needs a separate one-time backfill (run once with past events allowed, reviewed in batches). That only works for sources that keep archives.

**Source discovery (later, optional).** A weekly job could suggest new sources (links from known sites, search queries, aggregator sites) into the sources table with a `candidate` status for a person to approve. A tool can suggest sources but a person must approve them: scraping permission, reliability and scope are human judgments. Build the importer with a hand-picked list first.

## 2. Jobs board redesign (separate repo: `iscss/css-jobs`)

The jobs board has a navy header like the events site. Three lighter, white-header mockups were made, taking cues from iscss.org:

- **A, iscss.org classic:** white header, big bold ISCSS wordmark, teal frame around the page title (like the About page), blue active link.
- **B, light + events tie-in:** white header with a gold stripe and navy wordmark, search banner, filter pills, cards with a colored left edge by job type (matches the events site).
- **C, split view:** job list on the left, full details of the selected job on the right, faint network graphic in the title area.

The mockup images (PNG) and HTML source are on Ritika's computer at `~/Documents/css-jobs/mockups/` (not in git). Alex was asked which one he prefers. Mockup colors were estimated by eye from an iscss.org screenshot (teal about `#3d7b8a`, link blue about `#4a9fe0`).

## 3. Known gaps and loose ends on `redesign-events-pages`

- **IC²S² 2026 is hard-coded** in `src/pages/Events.tsx` and will always show as a (now past) conference there. Add it to the database as a `Conference` and delete the `UPCOMING_IC2S2` block.
- **About, Contact, and Past Events pages are not linked** from the menu (they still work at `/about`, `/contact`, `/past-events`). The Past Events page lists only conferences (database `Conference` events that have passed, plus a built-in IC²S² 2020–2025 list). Decide whether to link them, merge them into the Past view, or delete them.
- **No search box.** The old site had one; the redesign dropped it. Worth adding back once there are many events.
- **No explicit "hybrid" field.** Hybrid is inferred from `is_online` + `location` (see `ADDING-EVENTS.md`). A real `format` column would be cleaner but needs a database change on the shared project.
- **Admin and sign-in removed.** Events can only be added through the Supabase dashboard, which needs `admin@iscss.org` access. If you want non-technical editors, consider restoring the admin page from `main` or building a simple form.
- **Tests are a placeholder** (`src/test/App.test.tsx`). Nothing real is tested yet.
- **Time zones:** event times display in the visitor's time zone, and `event_date` must be entered in UTC. Easy to get wrong when adding events.
- **Cache:** new events can take up to 5 minutes to show.
- **Leftover files:** `src/components/ui/` likely has shadcn components that are unused (left over from the original scaffold).
- **Shared database:** the Supabase project is shared with the jobs board. Schema changes must be checked against both sites.
