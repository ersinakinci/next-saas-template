import { SubscriptionInterval } from "@/services/db.server/schemas/public/SubscriptionInterval";

export const isSubscriptionInterval = (
  interval: string
): interval is SubscriptionInterval =>
  SubscriptionInterval.includes(interval as SubscriptionInterval);
