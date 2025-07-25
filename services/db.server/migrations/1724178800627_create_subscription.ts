import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("subscription_tier")
    .asEnum(["free", "pro"])
    .execute();

  await db.schema
    .createType("subscription_interval")
    .asEnum(["day", "week", "month", "year"])
    .execute();

  await db.schema
    .createType("subscription_status")
    .asEnum([
      "active",
      "canceled",
      "incomplete",
      "incomplete_expired",
      "past_due",
      "paused",
      "trialing",
      "unpaid",
    ])
    .execute();

  await db.schema
    .createTable("subscription")
    .addColumn("id", "text", (col) =>
      col
        .primaryKey()
        .defaultTo(sql`nanoid()`)
        .notNull()
    )
    .addColumn("stripe_customer_id", "text")
    .addColumn("stripe_subscription_id", "text")
    .addColumn("tier", sql`subscription_tier`)
    .addColumn("interval", sql`subscription_interval`)
    .addColumn("status", sql`subscription_status`)
    .addColumn("current_period_ends_at", "timestamptz")
    .addColumn("last_paid_period_ends_at", "timestamptz")
    .addColumn("cancel_at", "timestamptz")
    .addColumn("canceled_at", "timestamptz")
    .addColumn("ended_at", "timestamptz")
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // Add subscription_id column to user table
  await db.schema
    .alterTable("user")
    .addColumn("subscription_id", "text", (col) =>
      col.references("subscription.id")
    )
    .execute();

  await db.schema
    .createIndex("user_subscription_id_index")
    .on("user")
    .column("subscription_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("user").dropColumn("subscription_id").execute();
  await db.schema.dropTable("subscription").execute();
  await db.schema.dropType("subscription_status").execute();
  await db.schema.dropType("subscription_interval").execute();
  await db.schema.dropType("subscription_tier").execute();
}
