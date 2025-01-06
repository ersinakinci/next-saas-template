import type { UserId } from './User';
import type { EntityType } from './EntityType';
import type { EntityTaxStatus } from './EntityTaxStatus';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.entity */
export type EntityId = string & { __brand: 'EntityId' };

/** Represents the table public.entity */
export default interface EntityTable {
  id: ColumnType<EntityId, EntityId | undefined, EntityId>;

  userId: ColumnType<UserId, UserId, UserId>;

  type: ColumnType<EntityType, EntityType, EntityType>;

  taxStatus: ColumnType<EntityTaxStatus, EntityTaxStatus | undefined, EntityTaxStatus>;

  name: ColumnType<string, string, string>;

  isDefault: ColumnType<boolean, boolean | undefined, boolean>;

  settings: ColumnType<unknown, unknown | undefined, unknown>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Entity = Selectable<EntityTable>;

export type NewEntity = Insertable<EntityTable>;

export type EntityUpdate = Updateable<EntityTable>;