-- Split event_url into three separate URL fields
ALTER TABLE public.events RENAME COLUMN event_url TO event_external_url;
ALTER TABLE public.events ADD COLUMN meeting_url TEXT;
ALTER TABLE public.events ADD COLUMN registration_url TEXT;
