/** Represents the enum public.entity_type */
export const EntityType = [
  'person', 
  'sole-proprietorship', 
  'gp', 
  'lp', 
  'corporation', 
  'llc', 
  'llp', 
  'cooperative', 
  'other',
] as const;

export type EntityType = (typeof EntityType)[number];