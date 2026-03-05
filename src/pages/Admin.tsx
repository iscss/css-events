import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventForm from '@/components/admin/EventForm';
import EventManagementTable from '@/components/admin/EventManagementTable';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useAllEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useEvents';
import { toast } from 'sonner';
import { Plus, ShieldAlert } from 'lucide-react';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

const Admin = () => {
  const { user } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useAdminCheck();
  const { data: events = [], isLoading: eventsLoading } = useAllEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  if (!user) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="main-content flex items-center justify-center">
          <div className="text-center">
            <ShieldAlert className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Sign in required</h2>
            <p className="text-slate-500 mb-4">Please sign in to access the admin panel.</p>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="main-content flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="main-content flex items-center justify-center">
          <div className="text-center">
            <ShieldAlert className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Access Denied</h2>
            <p className="text-slate-500">You don't have admin permissions.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (data: TablesInsert<'events'> | (TablesUpdate<'events'> & { id: string })) => {
    try {
      if ('id' in data && data.id) {
        await updateEvent.mutateAsync(data as TablesUpdate<'events'> & { id: string });
        toast.success('Event updated successfully');
      } else {
        await createEvent.mutateAsync(data as TablesInsert<'events'>);
        toast.success('Event created successfully');
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      toast.error('Failed to save event');
      console.error(error);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent.mutateAsync(id);
      toast.success('Event deleted');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleTogglePublish = async (event: Event) => {
    try {
      await updateEvent.mutateAsync({ id: event.id, is_published: !event.is_published });
      toast.success(event.is_published ? 'Event unpublished' : 'Event published');
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Event Management</h1>
              <p className="text-slate-500 mt-1">Create, edit, and manage events</p>
            </div>
            {!showForm && (
              <Button
                onClick={() => { setEditingEvent(null); setShowForm(true); }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            )}
          </div>

          {showForm && (
            <div className="mb-8">
              <EventForm
                event={editingEvent}
                onSubmit={handleSubmit}
                onCancel={() => { setShowForm(false); setEditingEvent(null); }}
                loading={createEvent.isPending || updateEvent.isPending}
              />
            </div>
          )}

          {eventsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <EventManagementTable
              events={events}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
