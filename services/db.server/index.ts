import {
  Kysely,
  PostgresDialect,
  CamelCasePlugin,
  Transaction,
  type MigrationProvider,
  type Migration,
} from "kysely";
import type Database from "./schemas/Database";
import PG from "pg";
import { BigNumber } from "bignumber.js";
import { format } from "sql-formatter";
import { Migrator } from "kysely";
import fs from "fs";
import path from "path";
import { serverEnv } from "../../env/server";
import { logger } from "../logger";

export type DB = Kysely<Database>;
export type DBClient = Kysely<Database> | Transaction<Database>;

const { Pool } = PG;

// Undocumented feature of node-postgres to parse dates as UTC
// https://github.com/brianc/node-postgres/issues/2141
// @ts-ignore
PG.defaults.parseInputDatesAsUTC = true;

// Map numeric to number via BigNumber.
PG.types.setTypeParser(1700, "text", (value) =>
  value === null ? null : BigNumber(value).toNumber()
);

// Map bigint/int8 to BigNumber.
PG.types.setTypeParser(20, "text", (value) =>
  value === null ? null : BigNumber(value).toNumber()
);

// Map date to string.
// NOTE: We still need to set parseInputDatesAsUTC as above to get dates to parse correctly.
// This only prevents the date string from being converted to a Date object in node-postgres.
PG.types.setTypeParser(1082, "text", (value) => {
  return value;
});

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: serverEnv.DATABASE_URL,
    }),
  }),
  plugins: [
    new CamelCasePlugin({
      // Should be OK to disable for kysely >= 0.27.4
      // https://github.com/kysely-org/kysely/issues/1036
      // maintainNestedObjectKeys: true,
    }),
  ],
  log(event) {
    if (serverEnv.NODE_ENV === "development") {
      if (event.level === "error") {
        logger.error("KYSELY ERROR", event.error);
        logger.error("Duration (ms):", event.queryDurationMillis);
        logger.error("Params:", event.query.parameters);
        logger.error(
          "SQL:\n  ",
          // event.query.sql
          format(event.query.sql, { language: "postgresql" })
        );
      }
      if (event.level === "query") {
        logger.debug("KYSELY QUERY");
        logger.debug("Duration (ms):", event.queryDurationMillis);
        logger.debug("Params:", event.query.parameters);
        logger.debug(
          "SQL:\n  ",
          format(event.query.sql, { language: "postgresql" })
        );
      }
    }
  },
});

export const transact = async <T>(
  db: DBClient,
  callback: (trx: Transaction<Database>) => Promise<T>
) => {
  if (db instanceof Transaction) {
    return await callback(db);
  } else {
    return await db.transaction().execute(callback);
  }
};

// Adapted from https://github.com/kysely-org/kysely/issues/277#issuecomment-1385995789
class ESMFileMigrationProvider implements MigrationProvider {
  constructor(private relativePath: string) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};
    const resolvedPath = path.resolve(__dirname, this.relativePath);
    const files = await fs.readdirSync(resolvedPath);

    for (const fileName of files) {
      if (!fileName.endsWith(".ts")) {
        continue;
      }

      const importPath = path
        .join(this.relativePath, fileName)
        .replaceAll("\\", "/");

      const migration = await import(`./${importPath}`);
      const migrationKey = fileName.substring(0, fileName.lastIndexOf("."));

      migrations[migrationKey] = migration;
    }

    return migrations;
  }
}

const migrator = new Migrator({
  db,
  provider: new ESMFileMigrationProvider("./migrations"),
});

export const resetDb = async () => {
  await db.schema.dropSchema("public").cascade().execute();
  await db.schema.createSchema("public").execute();
  const { error, results } = await migrator.migrateToLatest();

  // Uncomment to see the results of each migration
  //
  // results?.forEach((it) => {
  //   if (it.status === "Success") {
  //     logger.info(`migration "${it.migrationName}" was executed successfully`);
  //   } else if (it.status === "Error") {
  //     logger.error(`failed to execute migration "${it.migrationName}"`);
  //   }
  // });

  if (error) {
    logger.fatal("failed to run `migrateToLatest`");
    throw error;
  }
};
