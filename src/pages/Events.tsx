import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import EventDetailsModal from '@/components/events/EventDetailsModal';
import EventFilters from '@/components/events/EventFilters';
import { useEvents, type EventFilters as EventFiltersType } from '@/hooks/useEvents';
import { Calendar } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

const Events = () => {
  const [filters, setFilters] = useState<EventFiltersType>({});
  const { data: events, isLoading } = useEvents(filters);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <section className="bg-gradient-to-br from-slate-50 to-indigo-50 pt-12 pb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
              All <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="text-slate-500 mb-8">Browse upcoming events in computational social science</p>
            <EventFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid gap-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No events found</h3>
                <p className="text-slate-500">
                  {Object.keys(filters).length > 0
                    ? 'Try adjusting your filters to see more events.'
                    : 'Check back soon for upcoming events.'}
                </p>
              </div>
            )}
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

export default Events;
