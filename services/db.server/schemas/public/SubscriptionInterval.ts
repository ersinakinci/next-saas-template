/** Represents the enum public.subscription_interval */
export const SubscriptionInterval = [
  'day', 
  'week', 
  'month', 
  'year',
] as const;

export type SubscriptionInterval = (typeof SubscriptionInterval)[number];