/** Represents the enum public.subscription_tier */
export const SubscriptionTier = [
  'free', 
  'pro',
] as const;

export type SubscriptionTier = (typeof SubscriptionTier)[number];