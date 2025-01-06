/** Represents the enum public.entity_tax_status */
export const EntityTaxStatus = [
  'none', 
  's-corp', 
  'non-profit',
] as const;

export type EntityTaxStatus = (typeof EntityTaxStatus)[number];