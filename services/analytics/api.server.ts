import "server-only";

import { PostHog } from "posthog-node";
import { serverEnv } from "@/services/env/api.server";
import { clientEnv } from "@/services/env/api.client";
import { logger } from "@/services/logger/api";

const noop = new Proxy(() => {}, {
  get: () => noop,
  apply: () => {
    logger.error(
      "Attempting to call analytics service. Set POSTHOG_API_KEY, NEXT_PUBLIC_POSTHOG_HOST, and NEXT_PUBLIC_POSTHOG_KEY env vars."
    );
  },
});

export const analytics =
  serverEnv.POSTHOG_API_KEY &&
  clientEnv.NEXT_PUBLIC_POSTHOG_HOST &&
  clientEnv.NEXT_PUBLIC_POSTHOG_KEY
    ? new PostHog(serverEnv.POSTHOG_API_KEY, {
        host: clientEnv.NEXT_PUBLIC_POSTHOG_HOST,
      })
    : // NOTE: We expect that not having env vars will throw in production;
      // we provide the noopObj as a convenience for development and test.
      (noop as unknown as PostHog);
