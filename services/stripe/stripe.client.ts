import { loadStripe } from "@stripe/stripe-js";
import { clientEnv } from "@/env/client";

// Load Stripe
export const stripe = loadStripe(clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
