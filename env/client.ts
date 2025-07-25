import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const devOptional = <T extends z.ZodTypeAny>(schema: T) =>
  process.env.NODE_ENV === "development" ? schema.optional() : schema;

// Add your public env variables here
export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_POSTHOG_KEY: devOptional(z.string().min(1)),
    NEXT_PUBLIC_POSTHOG_HOST: devOptional(z.string().min(1)),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: devOptional(z.string().min(1)),
  },
  runtimeEnv: {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
});
