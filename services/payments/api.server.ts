import Stripe from "stripe";
import { SubscriptionInterval } from "@/services/db/schemas/public/SubscriptionInterval";
import { serverEnv } from "@/services/env/api.server";
import { logger } from "@/services/logger/api";

const noop = new Proxy(() => {}, {
  get: () => noop,
  apply: () => {
    logger.error(
      "Attempting to call payments server service. Set STRIPE_ENDPOINT_SECRET and STRIPE_SECRET_KEY env vars."
    );
  },
});

// Needed by Bun, default Node http client doesn't work with Stripe
const httpClient = Stripe.createFetchHttpClient();

export const payments =
  serverEnv.STRIPE_ENDPOINT_SECRET && serverEnv.STRIPE_SECRET_KEY
    ? new Stripe(serverEnv.STRIPE_SECRET_KEY, {
        apiVersion: "2025-06-30.basil",
        typescript: true,
        httpClient,
      })
    : (noop as unknown as Stripe);

export const getInterval = (
  interval: Stripe.Plan.Interval
): SubscriptionInterval => {
  return interval;
};
