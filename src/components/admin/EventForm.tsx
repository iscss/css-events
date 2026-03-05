import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sanitizeInput, sanitizeUrl } from '@/lib/sanitize';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import type { Database } from '@/integrations/supabase/types';

type Event = Tables<'events'>;
type EventType = Database['public']['Enums']['event_type'];

const EVENT_TYPES: EventType[] = ['Q&A', 'Workshop', 'Seminar', 'Conference', 'Social', 'Other'];

interface EventFormProps {
  event?: Event | null;
  onSubmit: (data: TablesInsert<'events'> | (TablesUpdate<'events'> & { id: string })) => void;
  onCancel: () => void;
  loading?: boolean;
}

const EventForm = ({ event, onSubmit, onCancel, loading }: EventFormProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eventType, setEventType] = useState<EventType>('Q&A');
  const [location, setLocation] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [eventUrl, setEventUrl] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setEventDate(event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '');
      setEndDate(event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '');
      setEventType(event.event_type);
      setLocation(event.location || '');
      setIsOnline(event.is_online);
      setEventUrl(event.event_url || '');
      setSpeaker(event.speaker || '');
      setOrganizer(event.organizer || '');
      setIsPublished(event.is_published);
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedData = {
      title: sanitizeInput(title, 500),
      description: description ? sanitizeInput(description, 5000) : null,
      event_date: new Date(eventDate).toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      event_type: eventType,
      location: location ? sanitizeInput(location, 500) : null,
      is_online: isOnline,
      event_url: eventUrl ? sanitizeUrl(eventUrl) : null,
      speaker: speaker ? sanitizeInput(speaker, 500) : null,
      organizer: organizer ? sanitizeInput(organizer, 500) : null,
      is_published: isPublished,
    };

    if (event) {
      onSubmit({ id: event.id, ...sanitizedData });
    } else {
      onSubmit({ ...sanitizedData, posted_by: user?.id || null });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event ? 'Edit Event' : 'Create Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q&A: Computational Methods in Political Science"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event details..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Start Date & Time *</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date & Time</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type *</Label>
              <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Room 204, MIT or Online"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="isOnline" checked={isOnline} onCheckedChange={setIsOnline} />
            <Label htmlFor="isOnline">This is an online event</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventUrl">Event URL (Zoom link, registration page, etc.)</Label>
            <Input
              id="eventUrl"
              type="url"
              value={eventUrl}
              onChange={(e) => setEventUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="speaker">Speaker</Label>
              <Input
                id="speaker"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Speaker name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input
                id="organizer"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Organizing group or person"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="isPublished" checked={isPublished} onCheckedChange={setIsPublished} />
            <Label htmlFor="isPublished">Published (visible to public)</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-indigo-500 to-purple-600">
              {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
