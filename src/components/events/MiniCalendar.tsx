import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';

interface MiniCalendarProps {
  selectedDate?: Date | null;
  highlightedDates?: Date[];
  onSelectDate?: (date: Date | null) => void;
}

const MiniCalendar = ({ selectedDate, highlightedDates = [], onSelectDate }: MiniCalendarProps) => {
  const [viewMonth, setViewMonth] = useState(selectedDate ?? new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart); // 0 = Sun

  const isHighlighted = (d: Date) =>
    highlightedDates.some((h) => isSameDay(h, d));

  const handleDayClick = (d: Date) => {
    if (selectedDate && isSameDay(selectedDate, d)) {
      onSelectDate?.(null);
    } else {
      onSelectDate?.(d);
    }
  };

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold" style={{ color: '#0e1f6b' }}>
          {format(viewMonth, 'MMMM yyyy')}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMonth(subMonths(viewMonth, 1))}
            className="p-0.5 rounded hover:bg-slate-100 text-slate-500"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            className="p-0.5 rounded hover:bg-slate-100 text-slate-500"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-slate-400 py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {/* Leading empty cells */}
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((day) => {
          const highlighted = isHighlighted(day);
          const selected = selectedDate ? isSameDay(selectedDate, day) : false;
          const today = isToday(day);
          const inMonth = isSameMonth(day, viewMonth);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className="relative text-center text-xs rounded-full mx-auto w-5 h-5 flex items-center justify-center leading-none transition-colors"
              style={{
                backgroundColor: selected ? '#0e1f6b' : today && !selected ? '#00c4b4' : 'transparent',
                color: selected || (today && !selected) ? '#fff' : !inMonth ? '#ccc' : highlighted ? '#0e1f6b' : '#aaa',
                fontWeight: highlighted || selected || today ? 600 : 400,
              }}
            >
              {format(day, 'd')}
              {highlighted && !selected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
