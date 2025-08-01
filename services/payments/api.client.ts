import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { clientEnv } from "@/services/env/api.client";
import { logger } from "@/services/logger/api";

const noop = new Promise(
  new Proxy(() => {}, {
    get: () => noop,
    apply: () => {
      logger.error(
        "Attempting to call payments client service. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env var."
      );
    },
  })
);

// Load Stripe
export const stripe = clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? await loadStripe(clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : (noop as unknown as Promise<Stripe | null>);
