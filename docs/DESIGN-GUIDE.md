# Design Guide (branding, fonts, colors, layout)

This describes the design on the `redesign-events-pages` branch. Most styling is written inline (`style={{…}}`) in the components, with a few Tailwind classes. Colors are hard-coded hex values, not theme variables, so use this list when changing anything.

## Fonts

- **Inter** (weights 300–700) is the main font. It is loaded in `src/index.css` from Google Fonts and set as the sans-serif font in `tailwind.config.ts`.
- **Crimson Text** is also loaded and set as the serif font in `tailwind.config.ts`, but the events pages don't use it.
- The wordmark "ISCSS" is bold with wide letter spacing (`tracking-widest`).

### Text sizes (after the "larger text" update)

| Element | Size |
|---|---|
| Page headline ("Talks, Workshops & Seminars") | 48px (`text-5xl`), bold |
| Small caps labels ("LAB EVENTS", month headers, filter headings) | 12–13px, uppercase, letter-spaced |
| Event title in a card | 18px, navy |
| Time/location line | 14px, grey `#888` |
| Event-type tags | 12px, uppercase |
| Buttons on cards (Details / Register / Join) | 13px |
| Date number on the left of a card | 34px bold |
| Filter labels | 14px |
| Pills (All / Upcoming / Past) | 14px (`text-sm`) |
| Mini calendar days | 14px; month title 16px |
| Header "ISCSS" | 22px; "Events" label 16px |
| Menu items | 16px |

Sizes were raised by about 3px from the first version. To scale text again, search for `fontSize:` in `src/pages/Events.tsx` and `src/components/`.

## Colors

### Core brand palette

| Role | Hex | Used for |
|---|---|---|
| **Navy** | `#0e1f6b` | Header background, headline, titles, active pill, buttons (the most-used color) |
| **Gold** | `#f5d547` | 3px stripe above the header, 3px line above the footer |
| **Teal** | `#00c4b4` | Accent word in the headline ("& Seminars"), today's date in the calendar, Workshop color |
| Dark teal | `#00796b` | Text on teal tags, Online dot |
| Border grey | `#e5e7eb` | Dividers and borders |
| Light blue-grey | `#f4f6fb` | Filtered bar background |
| Soft border | `#d9deea` | Filtered bar border |
| Body grey | `#555` / `#666` / `#888` / `#aaa` | Body text, secondary text, labels |

### Event type colors (sidebar dot, card left bar, tag)

| Type | Bar / dot | Tag background | Tag text |
|---|---|---|---|
| Q&A | `#0e1f6b` | `#e8ecf7` | `#0e1f6b` |
| Workshop | `#00c4b4` | `#e0f8f6` | `#00796b` |
| Seminar | `#5a7fd4` | `#eef1fb` | `#3a56a0` |
| Conference | `#0e1f6b` (card) / `#f5d547` (filter dot) | `#e8ecf7` | `#0e1f6b` |
| Social | `#00c4b4` (card) / `#f97316` (filter dot) | `#e0f8f6` | `#00796b` |
| Other | `#aab4c8` | `#f0f2f8` | `#6b7a99` |

Card colors are in `TYPE_CONFIG` in `src/components/events/EventCard.tsx`; sidebar dots are in `EVENT_TYPES` in `src/components/events/EventFilters.tsx`. They differ slightly for Conference and Social (card vs filter dot).

### Event format colors (sidebar dots only)

| Format | Hex |
|---|---|
| Online | `#00796b` |
| In-Person | `#8b5cf6` (purple) |
| Hybrid | `#ec4899` (pink) |

## Layout

- **Page padding:** 32px (`px-8`) on both sides. The header logo, page text, event list, and footer all share this left edge, and the ≡ icon, event list, and footer share the right edge.
- **Header:** navy, 64px tall, with a 3px gold stripe on top. Left: "ISCSS" (bold, wide-spaced) with a smaller "Events" label. Right: a ≡ button that opens a white dropdown with **Upcoming Events** and **Past Events**.
- **Page header area:** small label "LAB EVENTS", headline, one-line description, then the pills **All / Upcoming / Past**.
- **Body:** a 256px left sidebar (mini calendar, Event type, Event format) and the event list on the right. The event list is grouped by month with small uppercase month headings.
- **Phones:** the sidebar stacks above the list.
- **Event card:** large date on the left, a colored vertical bar, type tag and organizer tag, title, time · location · speaker, then **Details** (and **Register** / **Join** when links exist).
- **Footer:** white, 3px gold line on top, "ISCSS | International Society for Computational Social Science", links (Events, CSS Jobs, iscss.org), copyright.

## Formats and conventions

- **Dates:** shown in the visitor's local time zone (e.g. `1:00 PM–2:00 PM`). Stored in UTC.
- **Month headings:** `MARCH 2026` style, uppercase.
- **Format filter:** inferred from `is_online` and `location`, see `ADDING-EVENTS.md` and `src/lib/eventFormat.ts`.
- **Past vs upcoming:** an event is "past" once its `end_date` (or `event_date` if there's no end date) has passed. This is computed automatically on every page load.

## Components worth knowing

| File | Purpose |
|---|---|
| `src/pages/Events.tsx` | The whole home/events page: tabs, filters, URL state, list |
| `src/components/layout/Header.tsx` | Header and ≡ menu |
| `src/components/events/EventCard.tsx` | One event in the list |
| `src/components/events/EventDetailsModal.tsx` | The Details popup |
| `src/components/events/EventFilters.tsx` | Event type + Event format checkboxes |
| `src/components/events/MiniCalendar.tsx` | The calendar (click a date to filter; click again to clear) |
| `src/hooks/useEvents.ts` | Fetches published events (cached 5 minutes) |
| `src/lib/eventFormat.ts` | Online / In-Person / Hybrid logic |
| `src/data/ic2s2-conferences.ts` | IC²S² conference history |

## Hard-coded content to review

- **IC²S² 2026** is written directly into `src/pages/Events.tsx` (`UPCOMING_IC2S2`). It is hidden automatically if the same conference (same link) is added to the database. Remove it once added.
- **Past IC²S² conferences (2020–2025)** are listed in `src/pages/PastEvents.tsx` (`HISTORICAL`).
- **Team photos** are in `public/team/`; **About** and **Contact** pages have their text written in the page files.

## Matching the iscss.org look (reference)

The main iscss.org site uses a white header, a bold black "ISCSS" wordmark, gray nav links with a blue active state (about `#4a9fe0`), a teal frame (about `#3d7b8a`) around page titles, and a faint network graphic. The events site uses a navy and gold header instead.
