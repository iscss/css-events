import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import EventDetailsModal from '@/components/events/EventDetailsModal';
import { useUpcomingEvents } from '@/hooks/useEvents';
import { useState, useMemo } from 'react';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

// Remove entry once added to DB via /admin
const UPCOMING_IC2S2: Event[] = [
  {
    id: 'ic2s2-2026',
    title: '12th IC²S² — International Conference on Computational Social Science',
    description: 'The 12th International Conference on Computational Social Science will be hosted in Burlington, Vermont, USA.',
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

const Index = () => {
  const { data: dbEvents, isLoading } = useUpcomingEvents(6);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const events = useMemo(() => {
    const dbUrls = new Set((dbEvents ?? []).map((e) => e.event_external_url).filter(Boolean));
    const synthetic = UPCOMING_IC2S2.filter((e) => !dbUrls.has(e.event_external_url));
    return [...(dbEvents ?? []), ...synthetic]
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      .slice(0, 6);
  }, [dbEvents]);

  return (
    <div className="page-wrapper bg-white">
      <Header />
      <main className="main-content">

        {/* Hero */}
        <section style={{ backgroundColor: '#0e1f6b', padding: '48px 0 40px' }}>
          <div className="mx-auto px-8" style={{ maxWidth: '1400px' }}>
            <p className="font-semibold mb-3" style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              International Society for Computational Social Science
            </p>
            <h1 className="font-bold leading-tight mb-4" style={{ fontSize: '32px', color: '#fff', maxWidth: '560px' }}>
              Events, Talks{' '}
              <span style={{ color: '#00c4b4' }}>&amp;</span>{' '}
              <span style={{ color: '#00c4b4' }}>Workshops</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', maxWidth: '520px', lineHeight: '1.7' }}>
              Advancing data-driven research in the social sciences. Connecting researchers across institutions through talks, workshops, seminars, and reading groups.
            </p>
            <div className="flex gap-3 mt-6">
              <Link to="/events">
                <button
                  style={{ fontSize: '11px', fontWeight: 600, padding: '8px 20px', backgroundColor: '#00c4b4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.04em' }}
                >
                  Browse Events
                </button>
              </Link>
              <a href="https://iscss.org" target="_blank" rel="noopener noreferrer">
                <button
                  style={{ fontSize: '11px', fontWeight: 600, padding: '8px 20px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.04em' }}
                >
                  About ISCSS
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Yellow accent bar */}
        <div style={{ height: '4px', backgroundColor: '#f5d547' }} />

        {/* Feature strip */}
        <section style={{ borderBottom: '0.5px solid #e5e7eb', padding: '28px 0' }}>
          <div className="mx-auto px-8 grid grid-cols-2 gap-8" style={{ maxWidth: '1400px' }}>
            {[
              { label: 'Q&As & Talks', desc: 'Interactive sessions with researchers worldwide', dot: '#0e1f6b' },
              { label: 'Workshops & Seminars', desc: 'Hands-on learning in computational methods', dot: '#00c4b4' },
            ].map(({ label, desc, dot }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
                <div>
                  <p className="font-semibold" style={{ fontSize: '12px', color: '#0e1f6b' }}>{label}</p>
                  <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming events */}
        <section style={{ padding: '32px 0 48px' }}>
          <div className="mx-auto px-8" style={{ maxWidth: '1400px' }}>
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <p className="font-semibold mb-1" style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa' }}>
                  Upcoming
                </p>
                <h2 className="font-bold" style={{ fontSize: '22px', color: '#0e1f6b' }}>
                  Recent Events
                </h2>
              </div>
              <Link to="/events" style={{ fontSize: '11px', color: '#0e1f6b', fontWeight: 600, textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            <div style={{ borderTop: '0.5px solid #e5e7eb' }}>
              {isLoading ? (
                <div className="space-y-4 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse rounded" style={{ height: '80px', backgroundColor: '#f4f6fb' }} />
                  ))}
                </div>
              ) : events && events.length > 0 ? (
                events.map((event) => (
                  <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />
                ))
              ) : (
                <div className="text-center" style={{ padding: '60px 0' }}>
                  <p style={{ fontSize: '13px', color: '#aaa' }}>No upcoming events. Check back soon.</p>
                </div>
              )}
            </div>
          </div>
        </section>

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

export default Index;
