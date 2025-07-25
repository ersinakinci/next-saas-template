import type { SubscriptionTier } from './SubscriptionTier';
import type { SubscriptionInterval } from './SubscriptionInterval';
import type { SubscriptionStatus } from './SubscriptionStatus';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.subscription */
export type SubscriptionId = string & { __brand: 'SubscriptionId' };

/** Represents the table public.subscription */
export default interface SubscriptionTable {
  id: ColumnType<SubscriptionId, SubscriptionId | undefined, SubscriptionId>;

  stripeCustomerId: ColumnType<string | null, string | null, string | null>;

  stripeSubscriptionId: ColumnType<string | null, string | null, string | null>;

  tier: ColumnType<SubscriptionTier | null, SubscriptionTier | null, SubscriptionTier | null>;

  interval: ColumnType<SubscriptionInterval | null, SubscriptionInterval | null, SubscriptionInterval | null>;

  status: ColumnType<SubscriptionStatus | null, SubscriptionStatus | null, SubscriptionStatus | null>;

  currentPeriodEndsAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

  lastPaidPeriodEndsAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

  cancelAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

  canceledAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

  endedAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Subscription = Selectable<SubscriptionTable>;

export type NewSubscription = Insertable<SubscriptionTable>;

export type SubscriptionUpdate = Updateable<SubscriptionTable>;