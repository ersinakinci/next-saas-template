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

const devOptional = <T extends z.ZodTypeAny>(schema: T) =>
  process.env.NODE_ENV === "development" ? schema.optional() : schema;

// Add your server env variables here
export const serverEnv = createEnv({
  server: {
    AUTH_FROM_EMAIL: z.email(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
    AUTH_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    LOOPS_API_KEY: devOptional(z.string()),
    LOOPS_USERS_LIST_ID: devOptional(z.string()),
    NODE_ENV: z.enum(["development", "test", "production"]),
    RESEND_API_KEY: devOptional(z.string()),
    POSTHOG_API_KEY: devOptional(z.string()),
    STRIPE_SECRET_KEY: devOptional(z.string().min(1)),
    STRIPE_ENDPOINT_SECRET: devOptional(z.string().min(1)),
  },
  experimental__runtimeEnv: process.env,
});
