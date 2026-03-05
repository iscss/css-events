-- Create event_type enum
CREATE TYPE public.event_type AS ENUM (
  'Q&A',
  'Workshop',
  'Seminar',
  'Conference',
  'Social',
  'Other'
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  event_type public.event_type NOT NULL DEFAULT 'Other',
  location TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  event_url TEXT,
  speaker TEXT,
  organizer TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  posted_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for common queries
CREATE INDEX idx_events_event_date ON public.events(event_date);
CREATE INDEX idx_events_is_published ON public.events(is_published);
CREATE INDEX idx_events_event_type ON public.events(event_type);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public can read published events
CREATE POLICY "Anyone can view published events"
  ON public.events
  FOR SELECT
  USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can insert events"
  ON public.events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update events"
  ON public.events
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete events"
  ON public.events
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can also read unpublished events
CREATE POLICY "Admins can view all events"
  ON public.events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_events_updated_at();
