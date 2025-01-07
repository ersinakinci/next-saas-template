import { SubscriptionTier } from "@/services/db/schemas/public/SubscriptionTier";

export const isSubscriptionTier = (tier: string): tier is SubscriptionTier =>
  SubscriptionTier.includes(tier as SubscriptionTier);
