import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import type { EventFilters as EventFiltersType } from '@/hooks/useEvents';

interface EventFiltersProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
}

const EVENT_TYPES = ['Q&A', 'Workshop', 'Seminar', 'Conference', 'Social', 'Other'];

const EventFilters = ({ filters, onFiltersChange }: EventFiltersProps) => {
  const hasActiveFilters = filters.eventType || filters.isOnline !== undefined || filters.search;

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search events..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
          className="pl-10"
        />
      </div>

      {/* Event type */}
      <Select
        value={filters.eventType || 'all'}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, eventType: value === 'all' ? undefined : value })
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {EVENT_TYPES.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Online filter */}
      <Select
        value={filters.isOnline === undefined ? 'all' : filters.isOnline ? 'online' : 'in-person'}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            isOnline: value === 'all' ? undefined : value === 'online',
          })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Formats</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="in-person">In-Person</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500">
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default EventFilters;
