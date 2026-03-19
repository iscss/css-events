-- Remove test event and duplicate events from before URL split
DELETE FROM public.events WHERE id IN (
  '75cd24d7-5039-4177-a94b-ffd5eda1ef83',
  '5ec5f94c-6aa6-427a-88c2-4d7d5e5af384',
  '0248ce05-6989-42c1-97e9-24f010ff3789',
  'e55723ef-5720-4695-99a8-253136df70d6'
);
