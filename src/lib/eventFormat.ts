export type EventFormat = 'Online' | 'In-Person' | 'Hybrid';

export const EVENT_FORMATS: EventFormat[] = ['Online', 'In-Person', 'Hybrid'];

// The events table only has an is_online flag, so Hybrid is inferred:
// online + a physical location (anything that isn't just "Online (Zoom)" etc.).
const VIRTUAL_LOCATION = /^\s*(online|virtual|zoom|remote|webinar|teams|google meet)/i;

export const getEventFormat = (event: { is_online: boolean; location: string | null }): EventFormat => {
  if (!event.is_online) return 'In-Person';
  const location = event.location?.trim();
  return location && !VIRTUAL_LOCATION.test(location) ? 'Hybrid' : 'Online';
};
