import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

interface EventCardProps {
  event: Event;
  onViewDetails?: (event: Event) => void;
}

// Colors exactly from mockup HTML
const TYPE_CONFIG: Record<string, { bar: string; tagBg: string; tagText: string }> = {
  'Q&A':        { bar: '#0e1f6b', tagBg: '#e8ecf7', tagText: '#0e1f6b' },
  'Workshop':   { bar: '#00c4b4', tagBg: '#e0f8f6', tagText: '#00796b' },
  'Seminar':    { bar: '#5a7fd4', tagBg: '#eef1fb', tagText: '#3a56a0' },
  'Conference': { bar: '#0e1f6b', tagBg: '#e8ecf7', tagText: '#0e1f6b' },
  'Social':     { bar: '#00c4b4', tagBg: '#e0f8f6', tagText: '#00796b' },
  'Other':      { bar: '#aab4c8', tagBg: '#f0f2f8', tagText: '#6b7a99' },
};

const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  const eventDate = new Date(event.event_date);
  const cfg = TYPE_CONFIG[event.event_type] ?? TYPE_CONFIG['Other'];

  const timeStr = format(eventDate, 'h:mm a').replace(' ', ' ');
  const endStr = event.end_date
    ? '–' + format(new Date(event.end_date), 'h:mm a').replace(' ', ' ')
    : '';

  return (
    <div className="flex items-stretch border-b py-4 group" style={{ borderColor: '#e5e7eb' }}>
      {/* Date column */}
      <div className="flex-shrink-0 w-11 flex flex-col items-center justify-start pt-0.5 mr-4">
        <span className="leading-none" style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa' }}>
          {format(eventDate, 'MMM')}
        </span>
        <span className="font-bold leading-none mt-0.5" style={{ fontSize: '26px', color: '#0e1f6b' }}>
          {format(eventDate, 'd')}
        </span>
      </div>

      {/* Colored left bar */}
      <div className="w-0.5 flex-shrink-0 mr-4 self-stretch" style={{ backgroundColor: cfg.bar }} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-1">
          <span
            className="font-semibold"
            style={{ fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '3px', backgroundColor: cfg.tagBg, color: cfg.tagText }}
          >
            {event.event_type}
          </span>
          {event.organizer && (
            <span
              className="font-semibold"
              style={{ fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '3px', backgroundColor: '#e8ecf7', color: '#0e1f6b' }}
            >
              {event.organizer}
            </span>
          )}
        </div>

        {/* Title */}
        <div
          className="font-semibold leading-snug mb-1 cursor-pointer"
          style={{ fontSize: '14px', color: '#0e1f6b', lineHeight: '1.35' }}
          onClick={() => onViewDetails?.(event)}
        >
          {event.title}
        </div>

        {/* Meta */}
        <div className="mb-2" style={{ fontSize: '11px', color: '#888', lineHeight: '1.5' }}>
          {timeStr}{endStr}
          {event.location && <span> · {event.location}</span>}
          {event.speaker && <span> · {event.speaker}</span>}
        </div>

        {/* Buttons */}
        <div className="flex gap-1.5">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(event)}
              style={{ fontSize: '10px', padding: '4px 10px', border: '1px solid #ccc', borderRadius: '4px', background: 'transparent', color: '#888', cursor: 'pointer' }}
            >
              Details
            </button>
          )}
          {event.registration_url && (
            <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
              <button
                style={{ fontSize: '10px', padding: '4px 10px', border: '1px solid #0e1f6b', borderRadius: '4px', background: 'transparent', color: '#0e1f6b', fontWeight: 600, cursor: 'pointer' }}
              >
                Register
              </button>
            </a>
          )}
          {event.meeting_url && !event.registration_url && (
            <a href={event.meeting_url} target="_blank" rel="noopener noreferrer">
              <button
                style={{ fontSize: '10px', padding: '4px 10px', border: '1px solid #0e1f6b', borderRadius: '4px', background: 'transparent', color: '#0e1f6b', fontWeight: 600, cursor: 'pointer' }}
              >
                Join
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
