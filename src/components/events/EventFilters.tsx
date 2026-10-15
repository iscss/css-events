import type { EventFilters as EventFiltersType } from '@/hooks/useEvents';
import { EVENT_FORMATS } from '@/lib/eventFormat';

interface EventFiltersProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
}

const EVENT_TYPES = [
  { label: 'Q&A',        color: '#0e1f6b' },
  { label: 'Workshop',   color: '#00c4b4' },
  { label: 'Seminar',    color: '#5a7fd4' },
  { label: 'Conference', color: '#f5d547' },
  { label: 'Social',     color: '#f97316' },
  { label: 'Other',      color: '#aab4c8' },
];

const EventFilters = ({ filters, onFiltersChange }: EventFiltersProps) => {
  const toggleEventType = (type: string) => {
    const current = filters.eventTypes ?? [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFiltersChange({ ...filters, eventTypes: next.length ? next : undefined });
  };

  const toggleFormat = (format: string) => {
    const current = filters.formats ?? [];
    const next = current.includes(format)
      ? current.filter((f) => f !== format)
      : [...current, format];
    onFiltersChange({ ...filters, formats: next.length ? next : undefined });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold mb-2" style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa' }}>
          Event type
        </p>
        <div className="space-y-2">
          {EVENT_TYPES.map(({ label, color }) => {
            const checked = (filters.eventTypes ?? []).includes(label);
            return (
              <label key={label} className="flex items-center gap-2 cursor-pointer">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="flex-1" style={{ fontSize: '11px', color: '#555' }}>{label}</span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleEventType(label)}
                  className="w-3.5 h-3.5 accent-slate-700"
                />
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-semibold mb-2" style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa' }}>
          Format
        </p>
        <div className="space-y-2">
          {EVENT_FORMATS.map((format) => (
            <label key={format} className="flex items-center gap-2 cursor-pointer">
              <span className="flex-1" style={{ fontSize: '11px', color: '#555' }}>{format}</span>
              <input
                type="checkbox"
                checked={(filters.formats ?? []).includes(format)}
                onChange={() => toggleFormat(format)}
                className="w-3.5 h-3.5 accent-slate-700"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
