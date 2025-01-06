import { createEnv } from "@t3-oss/env-nextjs";
// import { z } from "zod";

// Add your public env variables here
export const clientEnv = createEnv({
  client: {
    // NEXT_PUBLIC_MY_PUBLIC_ENV_VAR: z.string().min(1),
  },
  runtimeEnv: {
    // NEXT_PUBLIC_MY_PUBLIC_ENV_VAR: process.env.NEXT_PUBLIC_MY_PUBLIC_ENV_VAR,
  },
});
