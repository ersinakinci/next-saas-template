import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.kysely_migration */
export type KyselyMigrationName = string & { __brand: 'KyselyMigrationName' };

/** Represents the table public.kysely_migration */
export default interface KyselyMigrationTable {
  name: ColumnType<KyselyMigrationName, KyselyMigrationName, KyselyMigrationName>;

  timestamp: ColumnType<string, string, string>;
}

export type KyselyMigration = Selectable<KyselyMigrationTable>;

export type NewKyselyMigration = Insertable<KyselyMigrationTable>;

export type KyselyMigrationUpdate = Updateable<KyselyMigrationTable>;