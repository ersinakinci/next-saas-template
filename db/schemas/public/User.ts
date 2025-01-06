import type { EntityId } from './Entity';
import type { SubscriptionId } from './Subscription';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.user */
export type UserId = string & { __brand: 'UserId' };

/** Represents the table public.user */
export default interface UserTable {
  id: ColumnType<UserId, UserId | undefined, UserId>;

  name: ColumnType<string | null, string | null, string | null>;

  email: ColumnType<string, string, string>;

  emailVerified: ColumnType<Date | null, Date | string | null, Date | string | null>;

  image: ColumnType<string | null, string | null, string | null>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;

  lastEntityId: ColumnType<EntityId | null, EntityId | null, EntityId | null>;

  subscriptionId: ColumnType<SubscriptionId | null, SubscriptionId | null, SubscriptionId | null>;
}

export type User = Selectable<UserTable>;

export type NewUser = Insertable<UserTable>;

export type UserUpdate = Updateable<UserTable>;