import "server-only";

import { PostHog } from "posthog-node";
import { serverEnv } from "@/env/server";
import { clientEnv } from "@/env/client";

export const posthog = new PostHog(serverEnv.POSTHOG_API_KEY, {
  host: clientEnv.NEXT_PUBLIC_POSTHOG_HOST,
});
