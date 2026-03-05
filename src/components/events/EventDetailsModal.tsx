import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Globe, User, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

interface EventDetailsModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const eventTypeColors: Record<string, string> = {
  'Q&A': 'bg-blue-100 text-blue-700',
  'Workshop': 'bg-green-100 text-green-700',
  'Seminar': 'bg-purple-100 text-purple-700',
  'Conference': 'bg-orange-100 text-orange-700',
  'Social': 'bg-pink-100 text-pink-700',
  'Other': 'bg-slate-100 text-slate-700',
};

const EventDetailsModal = ({ event, open, onOpenChange }: EventDetailsModalProps) => {
  if (!event) return null;

  const eventDate = new Date(event.event_date);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
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
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>
                {format(eventDate, 'h:mm a')}
                {event.end_date && ` - ${format(new Date(event.end_date), 'h:mm a')}`}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>{event.location}</span>
              </div>
            )}
            {event.speaker && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                <span><strong>Speaker:</strong> {event.speaker}</span>
              </div>
            )}
            {event.organizer && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <span><strong>Organizer:</strong> {event.organizer}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="pt-2 border-t">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {event.event_url && (
            <div className="pt-2">
              <a href={event.event_url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Register / Join Event
                </Button>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
