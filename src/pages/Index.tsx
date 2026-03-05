import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import EventDetailsModal from '@/components/events/EventDetailsModal';
import { useUpcomingEvents } from '@/hooks/useEvents';
import { Calendar, ArrowRight, Sparkles, Users, Globe } from 'lucide-react';
import { useState } from 'react';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

const Index = () => {
  const { data: events, isLoading } = useUpcomingEvents(6);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-medium mb-8 border border-indigo-200 shadow-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Events for the CSS Community
              </div>

              <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                Discover
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CSS Events
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Q&As, workshops, seminars, and more from the <span className="font-semibold text-slate-700">computational social science</span> community.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/events">
                  <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg px-8">
                    Browse Events
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
              {[
                { icon: <Sparkles className="w-6 h-6" />, title: 'Q&As & Talks', desc: 'Interactive sessions with leading researchers' },
                { icon: <Users className="w-6 h-6" />, title: 'Workshops', desc: 'Hands-on learning in computational methods' },
                { icon: <Globe className="w-6 h-6" />, title: 'Online & In-Person', desc: 'Events accessible from anywhere in the world' },
              ].map((feature, i) => (
                <div key={i} className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100 shadow-sm">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Upcoming <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Events</span>
                </h2>
                <p className="text-slate-500 mt-2">Don't miss these upcoming opportunities</p>
              </div>
              <Link to="/events">
                <Button variant="outline" className="hidden sm:flex">
                  View All Events
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
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
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No upcoming events</h3>
                <p className="text-slate-500">Check back soon for new events from the CSS community.</p>
              </div>
            )}

            <div className="sm:hidden mt-6 text-center">
              <Link to="/events">
                <Button variant="outline">
                  View All Events
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
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
