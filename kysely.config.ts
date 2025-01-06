import { loadEnvConfig } from "@next/env";
import { defineConfig } from "kysely-ctl";
import { PostgresDialect } from "kysely";
import pg from "pg";

const projectDir = process.cwd();

loadEnvConfig(projectDir, true);

const { Pool } = pg;

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});
