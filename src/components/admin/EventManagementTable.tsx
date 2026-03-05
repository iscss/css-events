import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

interface EventManagementTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (event: Event) => void;
}

const EventManagementTable = ({ events, onEdit, onDelete, onTogglePublish }: EventManagementTableProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No events yet. Create your first event above.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium max-w-xs truncate">{event.title}</TableCell>
              <TableCell className="text-sm text-slate-500">
                {format(new Date(event.event_date), 'MMM d, yyyy h:mm a')}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{event.event_type}</Badge>
              </TableCell>
              <TableCell>
                {event.is_published ? (
                  <Badge className="bg-green-100 text-green-700">Published</Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-500">Draft</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTogglePublish(event)}
                    title={event.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {event.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(event)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(event.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventManagementTable;
