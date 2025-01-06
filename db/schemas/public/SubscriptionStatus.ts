/** Represents the enum public.subscription_status */
export const SubscriptionStatus = [
  'active', 
  'canceled', 
  'incomplete', 
  'incomplete_expired', 
  'past_due', 
  'paused', 
  'trialing', 
  'unpaid',
] as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[number];