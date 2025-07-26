import { serverEnv } from "@/services/env/api.server";
import { LoopsClient } from "loops";
import { logger } from "@/services/logger/api";

const noop = new Proxy(() => {}, {
  get: () => noop,
  apply: () => {
    logger.error(
      "Attempting to call email marketing service. Set LOOPS_API_KEY env var."
    );
  },
});

export const emailMarketing = serverEnv.LOOPS_API_KEY
  ? new LoopsClient(serverEnv.LOOPS_API_KEY)
  : (noop as unknown as LoopsClient);
