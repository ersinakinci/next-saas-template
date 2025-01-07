import Stripe from "stripe";
import { SubscriptionInterval } from "@/services/db/schemas/public/SubscriptionInterval";
import { serverEnv } from "@/env/server";

// Needed by Bun, default Node http client doesn't work with Stripe
const httpClient = Stripe.createFetchHttpClient();

export const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
  httpClient,
});

export const getInterval = (
  interval: Stripe.Plan.Interval
): SubscriptionInterval => {
  return interval;
};
