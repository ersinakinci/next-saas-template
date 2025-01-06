import { defineConfig } from "kysely-ctl";
import { PostgresDialect } from "kysely";
import pg from "pg";
import { serverEnv } from "./env/server";

const { Pool } = pg;

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: serverEnv.DATABASE_URL,
    }),
  }),
  migrations: {
    migrationFolder: "./services/db/migrations",
  },
});
