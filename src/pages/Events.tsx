import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import EventDetailsModal from '@/components/events/EventDetailsModal';
import EventFilters from '@/components/events/EventFilters';
import MiniCalendar from '@/components/events/MiniCalendar';
import { useEvents, type EventFilters as EventFiltersType } from '@/hooks/useEvents';
import { Calendar } from 'lucide-react';
import { getEventFormat } from '@/lib/eventFormat';
import { format, isSameDay, isValid, parse } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

// Upcoming IC²S² conferences not yet in the DB — remove an entry once added to the events table in Supabase
const UPCOMING_IC2S2: Event[] = [
  {
    id: 'ic2s2-2026',
    title: '12th IC²S² — International Conference on Computational Social Science',
    description: 'The 12th International Conference on Computational Social Science will be hosted in Burlington, Vermont, USA. IC²S² is the flagship annual conference of ISCSS, bringing together researchers from sociology, economics, political science, computer science, and beyond.',
    event_date: '2026-07-28T09:00:00Z',
    end_date: '2026-07-31T18:00:00Z',
    event_type: 'Conference' as const,
    location: 'Burlington, Vermont, USA',
    is_online: false,
    registration_url: 'https://2026.ic2s2.net',
    event_external_url: 'https://2026.ic2s2.net',
    meeting_url: null,
    speaker: null,
    organizer: 'ISCSS / Vermont Complex Systems Institute',
    is_published: true,
    posted_by: null,
    created_at: '',
    updated_at: '',
  },
];

const TOP_TABS = ['All', 'Upcoming', 'Past'];

const Events = () => {
  // Every filter lives in the URL (?tab=, ?date=, ?type=, ?format=) so a filtered view
  // can be bookmarked, shared, and undone with the browser's back button.
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const updateParams = (change: (params: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    change(next);
    setSearchParams(next);
  };

  const tabParam = searchParams.get('tab');
  const activeTab = tabParam === 'upcoming' ? 'Upcoming' : tabParam === 'past' ? 'Past' : 'All';
  const setActiveTab = (tab: string) =>
    updateParams((p) => (tab === 'All' ? p.delete('tab') : p.set('tab', tab.toLowerCase())));

  const dateParam = searchParams.get('date');
  const selectedDate = useMemo(() => {
    if (!dateParam) return null;
    const parsed = parse(dateParam, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? parsed : null;
  }, [dateParam]);
  const setSelectedDate = (date: Date | null) =>
    updateParams((p) => (date ? p.set('date', format(date, 'yyyy-MM-dd')) : p.delete('date')));

  const typeParams = searchParams.getAll('type');
  const formatParams = searchParams.getAll('format');
  const filters: EventFiltersType = useMemo(
    () => ({
      eventTypes: typeParams.length ? typeParams : undefined,
      formats: formatParams.length ? formatParams : undefined,
    }),
    [typeParams.join('|'), formatParams.join('|')]
  );
  const setFilters = (next: EventFiltersType) =>
    updateParams((p) => {
      p.delete('type');
      p.delete('format');
      next.eventTypes?.forEach((t) => p.append('type', t));
      next.formats?.forEach((f) => p.append('format', f));
    });

  const appliedFilters = [
    ...(activeTab !== 'All' ? [activeTab] : []),
    ...(selectedDate ? [format(selectedDate, 'MMM d, yyyy')] : []),
    ...typeParams,
    ...formatParams,
  ];

  const { data: events, isLoading } = useEvents(filters);

  const filtered = useMemo(() => {
    const dbUrls = new Set((events ?? []).map((e) => e.event_external_url).filter(Boolean));
    const synthetic = UPCOMING_IC2S2.filter((e) => !dbUrls.has(e.event_external_url));
    let result: Event[] = [...(events ?? []), ...synthetic].sort(
      (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );

    // Tab filter: an event counts as past once its end (or start, if no end) has passed
    if (activeTab !== 'All') {
      const now = Date.now();
      const hasEnded = (e: Event) => new Date(e.end_date ?? e.event_date).getTime() < now;
      result = result.filter((e) => (activeTab === 'Past' ? hasEnded(e) : !hasEnded(e)));
    }

    // Sidebar event type checkboxes
    if (filters.eventTypes && filters.eventTypes.length > 0) {
      result = result.filter((e) => filters.eventTypes!.includes(e.event_type));
    }

    // Sidebar format checkboxes (Online / In-Person / Hybrid)
    if (filters.formats && filters.formats.length > 0) {
      result = result.filter((e) => filters.formats!.includes(getEventFormat(e)));
    }

    // Calendar date filter
    if (selectedDate) {
      result = result.filter((e) => isSameDay(new Date(e.event_date), selectedDate));
    }

    return result;
  }, [events, activeTab, filters, selectedDate]);

  const eventDates = useMemo(() => {
    const dbUrls = new Set((events ?? []).map((e) => e.event_external_url).filter(Boolean));
    const synthetic = UPCOMING_IC2S2.filter((e) => !dbUrls.has(e.event_external_url));
    return [...(events ?? []), ...synthetic].map((e) => new Date(e.event_date));
  }, [events]);

  // Group by month
  const groupedByMonth = useMemo(() => {
    const groups: { label: string; events: Event[] }[] = [];
    for (const event of filtered) {
      const label = format(new Date(event.event_date), 'MMMM yyyy').toUpperCase();
      const last = groups[groups.length - 1];
      if (last && last.label === label) {
        last.events.push(event);
      } else {
        groups.push({ label, events: [event] });
      }
    }
    return groups;
  }, [filtered]);

  return (
    <div className="page-wrapper bg-white">
      <Header />

      <main className="main-content">
        {/* Page header */}
        <div className="border-b border-slate-100 px-8 pt-8 pb-6">
          <p className="font-semibold mb-2" style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>
            Lab Events
          </p>
          <h1 className="text-5xl font-bold mb-2" style={{ color: '#0e1f6b' }}>
            Talks, Workshops{' '}
            <span style={{ color: '#00c4b4' }}>&amp;</span>{' '}
            <span style={{ color: '#00c4b4' }}>Seminars</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Advancing data-driven research in the social sciences — talks, workshops, and reading groups from ISCSS members worldwide.
          </p>

          {/* Top tab pills */}
          <div className="mt-5">
            <div className="flex items-center gap-2 flex-wrap">
              {TOP_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-5 py-1.5 rounded-full text-sm font-medium border transition-colors"
                  style={activeTab === tab
                    ? { backgroundColor: '#0e1f6b', color: '#fff', borderColor: '#0e1f6b' }
                    : { backgroundColor: 'transparent', color: '#0e1f6b', borderColor: '#0e1f6b' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Body: sidebar + event list */}
        <div className="flex flex-col md:flex-row">
          {/* Left sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-100 px-4 py-6 space-y-6">
            {/* Mini calendar */}
            <MiniCalendar
              selectedDate={selectedDate}
              highlightedDates={eventDates}
              onSelectDate={setSelectedDate}
            />

            {/* Filters */}
            <EventFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Event list */}
          <div className="flex-1 min-w-0 px-8 py-4">
            {appliedFilters.length > 0 && (
              <div
                className="flex items-center justify-between gap-3 rounded px-3 py-2 mb-2"
                style={{ backgroundColor: '#f4f6fb', border: '0.5px solid #d9deea', fontSize: '14px', color: '#0e1f6b' }}
              >
                <span>
                  <strong>Filtered:</strong> {appliedFilters.join(' · ')}
                  <span style={{ color: '#666' }}> — {filtered.length} {filtered.length === 1 ? 'event' : 'events'}</span>
                </span>
                <button
                  onClick={() => setSearchParams({})}
                  className="font-semibold underline underline-offset-2 hover:no-underline"
                >
                  Clear all
                </button>
              </div>
            )}
            {isLoading ? (
              <div className="space-y-4 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 rounded bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              groupedByMonth.map(({ label, events: monthEvents }) => (
                <div key={label}>
                  <p className="font-semibold pt-3 pb-2 mb-2" style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', borderBottom: '0.5px solid #e5e7eb' }}>
                    {label}
                  </p>
                  {monthEvents.map((event) => (
                    <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-24">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-slate-700 mb-1">No events found</h3>
                <p className="text-base text-slate-500">
                  {appliedFilters.length > 0
                    ? 'Try adjusting your filters.'
                    : 'Check back soon for upcoming events.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <EventDetailsModal
        event={selectedEvent}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />
    </div>
  );
};

export default Events;
