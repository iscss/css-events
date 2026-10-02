import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, User, Users, Globe, ExternalLink } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

interface EventDetailsModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  'Q&A':        { bg: '#e8ecf7', color: '#0e1f6b' },
  'Workshop':   { bg: '#e0f8f6', color: '#00796b' },
  'Seminar':    { bg: '#eef1fb', color: '#3a56a0' },
  'Conference': { bg: '#e8ecf7', color: '#0e1f6b' },
  'Social':     { bg: '#fffbe6', color: '#a07d00' },
  'Other':      { bg: '#f0f2f8', color: '#6b7a99' },
};

const EventDetailsModal = ({ event, open, onOpenChange }: EventDetailsModalProps) => {
  if (!event) return null;
  const eventDate = new Date(event.event_date);
  const tag = TYPE_STYLE[event.event_type] ?? TYPE_STYLE['Other'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="font-semibold"
              style={{ fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '3px', backgroundColor: tag.bg, color: tag.color }}
            >
              {event.event_type}
            </span>
            {event.is_online && (
              <span
                className="font-semibold flex items-center gap-1"
                style={{ fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '3px', backgroundColor: '#e0f8f6', color: '#00796b' }}
              >
                <Globe className="w-2.5 h-2.5" /> Online
              </span>
            )}
          </div>
          <DialogTitle style={{ fontSize: '16px', fontWeight: 700, color: '#0e1f6b', lineHeight: '1.35' }}>
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-1" style={{ fontSize: '12px', color: '#555' }}>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#0e1f6b' }} />
            <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#0e1f6b' }} />
            <span>
              {format(eventDate, 'h:mm a')}
              {event.end_date && ` – ${format(new Date(event.end_date), 'h:mm a')}`}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#0e1f6b' }} />
              <span>{event.location}</span>
            </div>
          )}
          {event.speaker && (
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#0e1f6b' }} />
              <span><strong>Speaker:</strong> {event.speaker}</span>
            </div>
          )}
          {event.organizer && (
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#0e1f6b' }} />
              <span><strong>Organizer:</strong> {event.organizer}</span>
            </div>
          )}
        </div>

        {event.description && (
          <div className="pt-3 mt-1" style={{ borderTop: '0.5px solid #e5e7eb' }}>
            <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {event.description}
            </p>
          </div>
        )}

        {(event.registration_url || event.meeting_url || event.event_external_url) && (
          <div className="flex flex-col gap-2 pt-3 mt-1" style={{ borderTop: '0.5px solid #e5e7eb' }}>
            {event.registration_url && (
              <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="w-full">
                <button className="w-full flex items-center justify-center gap-2"
                  style={{ fontSize: '11px', fontWeight: 600, padding: '8px', border: '1px solid #0e1f6b', borderRadius: '4px', background: 'transparent', color: '#0e1f6b', cursor: 'pointer' }}>
                  <ExternalLink className="w-3 h-3" /> Register
                </button>
              </a>
            )}
            {event.meeting_url && (
              <a href={event.meeting_url} target="_blank" rel="noopener noreferrer" className="w-full">
                <button className="w-full flex items-center justify-center gap-2"
                  style={{ fontSize: '11px', fontWeight: 600, padding: '8px', border: '1px solid #00c4b4', borderRadius: '4px', background: 'transparent', color: '#00796b', cursor: 'pointer' }}>
                  <Globe className="w-3 h-3" /> Join Meeting
                </button>
              </a>
            )}
            {event.event_external_url && (
              <a href={event.event_external_url} target="_blank" rel="noopener noreferrer" className="w-full">
                <button className="w-full flex items-center justify-center gap-2"
                  style={{ fontSize: '11px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', background: 'transparent', color: '#888', cursor: 'pointer' }}>
                  <ExternalLink className="w-3 h-3" /> Event Page
                </button>
              </a>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
