import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Globe, User, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

interface EventCardProps {
  event: Event;
  onViewDetails?: (event: Event) => void;
}

const eventTypeColors: Record<string, string> = {
  'Q&A': 'bg-blue-100 text-blue-700',
  'Workshop': 'bg-green-100 text-green-700',
  'Seminar': 'bg-purple-100 text-purple-700',
  'Conference': 'bg-orange-100 text-orange-700',
  'Social': 'bg-pink-100 text-pink-700',
  'Other': 'bg-slate-100 text-slate-700',
};

const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  const eventDate = new Date(event.event_date);

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 group">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Date block */}
          <div className="sm:w-28 sm:min-w-28 bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0">
            <span className="text-sm font-medium uppercase">{format(eventDate, 'MMM')}</span>
            <span className="text-3xl font-bold leading-none">{format(eventDate, 'd')}</span>
            <span className="text-sm opacity-80">{format(eventDate, 'EEE')}</span>
          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className={eventTypeColors[event.event_type] || eventTypeColors['Other']}>
                {event.event_type}
              </Badge>
              {event.is_online && (
                <Badge variant="outline" className="border-blue-200 text-blue-600">
                  <Globe className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {event.title}
            </h3>

            <div className="space-y-1.5 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {format(eventDate, 'h:mm a')}
                  {event.end_date && ` - ${format(new Date(event.end_date), 'h:mm a')}`}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              )}

              {event.speaker && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{event.speaker}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4">
              {onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(event)}
                >
                  View Details
                </Button>
              )}
              {event.event_url && (
                <a href={event.event_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Register
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
