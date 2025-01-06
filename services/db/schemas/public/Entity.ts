import type { UserId } from './User';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.entity */
export type EntityId = string & { __brand: 'EntityId' };

/** Represents the table public.entity */
export default interface EntityTable {
  id: ColumnType<EntityId, EntityId | undefined, EntityId>;

  userId: ColumnType<UserId, UserId, UserId>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Entity = Selectable<EntityTable>;

export type NewEntity = Insertable<EntityTable>;

export type EntityUpdate = Updateable<EntityTable>;