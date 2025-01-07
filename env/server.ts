import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { loadEnvConfig } from "@next/env";

// Load env variables
//
// NOTE: This isn't needed for the Next.js server, but it's needed for various
// external scripts that need to access the env variables.
//
// I'm not sure if it might lead to some subtle bugs in the Next.js app itself...
// in theory, there shouldn't be any issues loading the env variables a second
// time here, but it's not clear.
loadEnvConfig(process.cwd());

// Add your server env variables here
export const serverEnv = createEnv({
  server: {
    AUTH_FROM_EMAIL: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    AUTH_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    EMAIL_OCTOPUS_API_KEY: z.string(),
    EMAIL_OCTOPUS_USERS_LIST_ID: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    RESEND_API_KEY: z.string(),
    POSTHOG_API_KEY: z.string(),
  },
  experimental__runtimeEnv: process.env,
});
