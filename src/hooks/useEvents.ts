import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Event = Tables<'events'>;
type EventInsert = TablesInsert<'events'>;
type EventUpdate = TablesUpdate<'events'>;

export interface EventFilters {
  eventType?: string;
  eventTypes?: string[];
  affiliatedSchools?: string[];
  isOnline?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Fetches all published events once and caches for 5 minutes.
// All filtering is done client-side in useFilteredEvents to avoid
// a round-trip to Supabase on every filter change.
export const useEvents = (_filters?: EventFilters) => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    staleTime: 5 * 60 * 1000,   // treat data as fresh for 5 min — no refetch on remount
    gcTime: 10 * 60 * 1000,     // keep in cache for 10 min after last use
  });
};

export const useUpcomingEvents = (limit: number = 6) => {
  // Reuses the same ['events'] cache — no extra network request
  const { data, ...rest } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return { data: data?.slice(0, limit), ...rest };
};

export const usePastConferences = () => {
  const now = new Date().toISOString();
  const { data, ...rest } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const past = data
    ?.filter((e) => e.event_type === 'Conference' && e.event_date < now)
    .sort((a, b) => b.event_date.localeCompare(a.event_date));

  return { data: past, ...rest };
};

export const useAllEvents = () => {
  return useQuery({
    queryKey: ['all-events-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      return data as Event[];
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: EventInsert) => {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
      queryClient.invalidateQueries({ queryKey: ['all-events-admin'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: EventUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
      queryClient.invalidateQueries({ queryKey: ['all-events-admin'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
      queryClient.invalidateQueries({ queryKey: ['all-events-admin'] });
    },
  });
};
