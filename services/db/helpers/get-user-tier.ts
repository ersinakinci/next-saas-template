import "server-only";

import { isPast } from "date-fns";
import { DBClient } from "@/services/db/api.server";
import { SubscriptionTier } from "@/services/db/schemas/public/SubscriptionTier";
import { UserId } from "@/services/db/schemas/public/User";

export const getUserTier = async (
  db: DBClient,
  userId: UserId
): Promise<SubscriptionTier> => {
  const user = await db
    .selectFrom("user")
    .selectAll("user")
    .leftJoin("subscription", "user.subscriptionId", "subscription.id")
    .select([
      "subscription.tier",
      "subscription.status",
      "subscription.lastPaidPeriodEndsAt",
    ])
    .where("user.id", "=", userId)
    .executeTakeFirstOrThrow();

  // If we don't have a subscription yet, the user is on the free tier.
  if (!user.tier) {
    return "free";
  }

  // If the user's subscription is anything other than active, they are on the free tier.
  if (user.status !== "active") {
    return "free";
  }

  // If the user is on a paid tier and their last paid period has ended, or if they
  // never paid, they are on the free tier.
  if (
    user.tier !== "free" &&
    (!user.lastPaidPeriodEndsAt || isPast(new Date(user.lastPaidPeriodEndsAt)))
  ) {
    return "free";
  }

  return user.tier;
};
