import invariant from "tiny-invariant";
import { getInterval, stripe } from "@/services/stripe/stripe.server";
import { DBClient, db } from "@/services/db";
import { sql } from "kysely";
import { isSubscriptionTier } from "@/services/db/helpers/is-subscription-tier";
import Stripe from "stripe";
import { cache } from "@/services/cache";
import { posthog } from "@/services/posthog";
import { serverEnv } from "@/env/server";
import { NextRequest } from "next/server";
import { Subscription } from "@/services/db/schemas/public/Subscription";
import { logger } from "@/services/logger";

const isStripeSubscription = (
  object: string | Stripe.Subscription | null
): object is Stripe.Subscription => {
  return object !== null && typeof object !== "string";
};

const isStripeCustomer = (
  object: string | Stripe.Customer | Stripe.DeletedCustomer | null
): object is Stripe.Customer => {
  return object !== null && typeof object !== "string" && !object.deleted;
};

const isStripeDeletedCustomer = (
  object: string | Stripe.Customer | Stripe.DeletedCustomer | null
): object is Stripe.DeletedCustomer => {
  return !!(object !== null && typeof object !== "string" && object.deleted);
};

const deleteSubscription = async (db: DBClient, subscription: Subscription) => {
  // Delete the stripe info record and remove the reference from the user
  await db
    .updateTable("user")
    .set({ subscriptionId: null })
    .where("subscriptionId", "=", subscription.id)
    .execute();

  await db
    .deleteFrom("subscription")
    .where("id", "=", subscription.id)
    .execute();
};

export async function POST(request: NextRequest) {
  logger.debug(`Received Stripe webhook event`);

  invariant(serverEnv.STRIPE_ENDPOINT_SECRET);

  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  const rawEvent = await request.text();

  // Check the event signature.
  try {
    event = stripe.webhooks.constructEvent(
      rawEvent,
      sig,
      serverEnv.STRIPE_ENDPOINT_SECRET
    );
  } catch (err: any) {
    return Response.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  invariant(event, "Couldn't construct event");

  // Check IP addresses.
  let ipAddresses = cache.get<string[]>("stripe:webhookIpAddresses");

  if (!ipAddresses) {
    // Get the list of valid Stripe webhook IP addresses.
    const res = await fetch("https://stripe.com/files/ips/ips_webhooks.json");

    ipAddresses = (await res.json()).WEBHOOKS as string[];

    cache.set("stripe:webhookIpAddresses", ipAddresses);
  }

  const eventIpAddress = request.headers.get("CF-Connecting-IP");

  if (eventIpAddress && !ipAddresses.includes(eventIpAddress)) {
    return Response.json({ error: "Invalid IP address" }, { status: 400 });
  }

  if (serverEnv.NODE_ENV !== "production")
    logger.debug(`Processing Stripe ${event.type} event`);

  // Begin processing the event.
  await db.transaction().execute(async (trx) => {
    try {
      switch (event.type) {
        case "customer.created": {
          const stripeCustomer = event.data.object;
          const user = await trx
            .selectFrom("user")
            .select(["user.id", "user.email", "user.subscriptionId"])
            .where("email", "=", stripeCustomer.email)
            .executeTakeFirstOrThrow();

          if (user.subscriptionId) {
            await trx
              .updateTable("subscription")
              .set({
                stripeCustomerId: stripeCustomer.id,
                updatedAt: sql`current_timestamp`,
              })
              .where("id", "=", user.subscriptionId)
              .execute();
          } else {
            const subscription = await trx
              .insertInto("subscription")
              .values({
                stripeCustomerId: stripeCustomer.id,
              })
              .returning("id")
              .executeTakeFirstOrThrow();

            logger.debug(
              "customer.created newly created subscription",
              subscription
            );

            await trx
              .updateTable("user")
              .set({
                subscriptionId: subscription.id,
                updatedAt: sql`current_timestamp`,
              })
              .where("id", "=", user.id)
              .execute();
          }

          posthog.capture({
            distinctId: user.email,
            event: "Stripe Customer Created",
            properties: {
              customerId: stripeCustomer.id,
            },
          });

          break;
        }
        case "customer.deleted": {
          const stripeCustomer = event.data.object;
          const subscription = await trx
            .selectFrom("subscription")
            .selectAll()
            .where("stripeCustomerId", "=", stripeCustomer.id)
            // NOTE: We assume that a Stripe customer always has at most one subscription. If this assumption
            // ever changes, then we'll need to update this query. (We'll need to delete all of the Stripe
            // customer's subscriptions when the Stripe customer is deleted.)
            .executeTakeFirst();

          if (subscription) await deleteSubscription(db, subscription);

          if (stripeCustomer.email)
            posthog.capture({
              distinctId: stripeCustomer.email,
              event: "Stripe Customer Deleted",
              properties: {
                customerId: stripeCustomer.id,
              },
            });

          break;
        }

        case "customer.subscription.updated":
        case "customer.subscription.created": {
          // const stripeSubscription = event.data.object;
          // Always fetch subscription from Stripe to ensure we have the latest data.
          // It's inefficient, but it's the only way to ensure we have the latest data
          // since Stripe events can come out of order.
          const stripeSubscription = await stripe.subscriptions.retrieve(
            event.data.object.id
          );
          const stripeCustomer = await stripe.customers.retrieve(
            stripeSubscription.customer.toString()
          );

          if (!stripeCustomer.deleted) {
            const user = await trx
              .selectFrom("user")
              .select(["user.id", "user.email", "user.subscriptionId"])
              .where("email", "=", stripeCustomer.email)
              .executeTakeFirstOrThrow();

            // Get data for the stripe info record
            const tier = stripeSubscription.items.data[0]?.price.metadata.tier;

            invariant(
              tier && isSubscriptionTier(tier),
              `Couldn't get tier (value: ${tier}) or it isn't a valid SubscriptionTier; is it defined in the Stripe price's metadata? (Price id ${stripeSubscription.items.data[0]?.price.id})`
            );

            const stripeInterval =
              stripeSubscription.items.data[0]?.price.recurring?.interval;

            invariant(stripeInterval, "Couldn't get interval from Stripe");

            const status = stripeSubscription.status;
            const interval = getInterval(stripeInterval);

            invariant(tier, "Couldn't get tier");

            const stripeInfoValues = {
              stripeSubscriptionId: stripeSubscription.id,
              tier,
              status,
              interval,
              currentPeriodEndsAt: new Date(
                // Effectively assume that we only have one subscription item per subscription.
                // The overall current period ends at the earliest current period end timestamp
                // for all of the subscription items.
                stripeSubscription.items.data.sort(
                  (a, b) => a.current_period_end - b.current_period_end
                )[0]?.current_period_end ?? 0 * 1000
              ),
              cancelAt: stripeSubscription.cancel_at
                ? new Date(stripeSubscription.cancel_at * 1000)
                : undefined,
              canceledAt: stripeSubscription.canceled_at
                ? new Date(stripeSubscription.canceled_at * 1000)
                : undefined,
              endedAt: stripeSubscription.ended_at
                ? new Date(stripeSubscription.ended_at * 1000)
                : undefined,
            };

            // Update/create the stripe info record
            if (user.subscriptionId) {
              await trx
                .updateTable("subscription")
                .set({
                  ...stripeInfoValues,
                  stripeCustomerId: stripeCustomer.id,
                  updatedAt: sql`current_timestamp`,
                })
                .where("id", "=", user.subscriptionId)
                .execute();
            } else {
              const subscription = await trx
                .insertInto("subscription")
                .values({
                  ...stripeInfoValues,
                  stripeCustomerId: stripeCustomer.id,
                })
                .returning("id")
                .executeTakeFirstOrThrow();

              logger.debug(
                "customer.subscription.created/customer.subscription.updated newly created subscription",
                subscription
              );

              await trx
                .updateTable("user")
                .set({
                  subscriptionId: subscription.id,
                  updatedAt: sql`current_timestamp`,
                })
                .where("id", "=", user.id)
                .execute();
            }

            posthog.capture({
              distinctId: user.email,
              event:
                event.type === "customer.subscription.created"
                  ? "Stripe Subscription Created"
                  : "Stripe Subscription Updated",
              properties: stripeInfoValues,
            });
          }

          break;
        }

        case "customer.subscription.deleted": {
          const stripeSubscription = event.data.object;
          const subscription = await trx
            .selectFrom("subscription")
            .selectAll()
            .where("stripeSubscriptionId", "=", stripeSubscription.id)
            .executeTakeFirst();

          if (subscription) await deleteSubscription(db, subscription);

          const stripeCustomer =
            typeof stripeSubscription.customer === "string"
              ? await stripe.customers.retrieve(stripeSubscription.customer)
              : stripeSubscription.customer;

          if (!isStripeDeletedCustomer(stripeCustomer) && stripeCustomer.email)
            posthog.capture({
              distinctId: stripeCustomer.email,
              event: "Stripe Subscription Deleted",
              properties: {
                subscriptionId: stripeSubscription.id,
              },
            });

          break;
        }

        case "invoice.paid": {
          const stripeInvoice = event.data.object;
          const stripeSubscription =
            stripeInvoice.parent?.subscription_details?.subscription ?? null;
          const stripeSubscriptionId = isStripeSubscription(stripeSubscription)
            ? stripeSubscription.id
            : stripeSubscription;
          const stripeCustomerId =
            isStripeCustomer(stripeInvoice.customer) ||
            isStripeDeletedCustomer(stripeInvoice.customer)
              ? stripeInvoice.customer.id
              : stripeInvoice.customer;

          invariant(stripeCustomerId, "Couldn't get customer id from Stripe");

          let stripeCustomerEmail = stripeInvoice.customer_email;

          if (!stripeCustomerEmail) {
            const customer = await stripe.customers.retrieve(stripeCustomerId);

            if (isStripeCustomer(customer)) {
              stripeCustomerEmail = customer.email;
            }
          }

          invariant(
            stripeCustomerEmail,
            "Couldn't get customer email from Stripe"
          );

          invariant(
            stripeSubscriptionId,
            "Couldn't get subscription id from Stripe"
          );
          invariant(
            typeof stripeSubscriptionId === "string",
            "Subscription id is not a string"
          );

          const line = stripeInvoice.lines.data.find(
            (line) => line.subscription === stripeSubscriptionId
          );

          invariant(
            line,
            `Couldn't find invoice line for Stripe subscription ${stripeSubscriptionId} and Stripe invoice ${stripeInvoice.id}`
          );

          // NOTE: We use || here because the subscription may have been created before the customer,
          // or vice versa. But by using the two values interchangeably, we assume that the customer
          // always has exactly one subscription. We're basically using either as a unique identifier
          // for the subscription, which greatly simplifies the logic here.
          const subscription =
            stripeSubscriptionId || stripeCustomerId
              ? await trx
                  .selectFrom("subscription")
                  .select("id")
                  .where(({ or, eb }) =>
                    or([
                      eb("stripeSubscriptionId", "=", stripeSubscriptionId),
                      eb("stripeCustomerId", "=", stripeCustomerId),
                    ])
                  )
                  .executeTakeFirst()
              : undefined;

          logger.debug(
            "invoice.paid stripeSubscriptionId",
            stripeSubscriptionId
          );
          logger.debug("invoice.paid stripeCustomerId", stripeCustomerId);
          logger.debug("invoice.paid pre-existing subscription", subscription);

          if (subscription) {
            await trx
              .updateTable("subscription")
              .set({
                lastPaidPeriodEndsAt: new Date(line.period.end * 1000),
              })
              .where("id", "=", subscription.id)
              .execute();
          } else {
            const subscription = await trx
              .insertInto("subscription")
              .values({
                stripeSubscriptionId,
                lastPaidPeriodEndsAt: new Date(line.period.end * 1000),
              })
              .returning("id")
              .executeTakeFirstOrThrow();

            logger.debug(
              "invoice.paid newly created subscription",
              subscription
            );

            await trx
              .updateTable("user")
              .set({
                subscriptionId: subscription.id,
              })
              .where("email", "=", stripeCustomerEmail)
              .execute();
          }

          const priceId = line.pricing?.price_details?.price;

          invariant(
            priceId,
            `Couldn't find price ID for invoice line item ${line.id} on invoice ${stripeInvoice.id}`
          );

          const price = await stripe.prices.retrieve(priceId);

          posthog.capture({
            distinctId: stripeCustomerEmail,
            event: "Stripe Invoice Paid",
            properties: {
              invoiceId: stripeInvoice.id,
              subscriptionId: stripeSubscriptionId,
              tier: price.metadata.tier,
              interval: price.recurring?.interval,
              amount: line.amount,
              amountExcludingTax:
                line.amount -
                (line.taxes?.reduce((sum, tax) => sum + tax.amount, 0) ?? 0),
              currency: line.currency,
              priceId: price.id,
            },
          });

          break;
        }

        default:
          if (serverEnv.NODE_ENV !== "production")
            logger.error(`Unhandled event type: ${event.type}`);
          break;
      }
    } catch (e) {
      logger.fatal(e);
      throw e;
    }
  });

  return new Response(null, { status: 200 });
}
