import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "text", (col) =>
      col
        .primaryKey()
        .defaultTo(sql`nanoid()`)
        .notNull()
    )
    .addColumn("name", "text")
    .addColumn("email", "text", (col) => col.unique().notNull())
    .addColumn("email_verified", "timestamptz")
    .addColumn("image", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("identity_provider_account")
    .addColumn("id", "text", (col) =>
      col
        .primaryKey()
        .defaultTo(sql`nanoid()`)
        .notNull()
    )
    .addColumn("user_id", "text", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("provider_account_id", "text", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("expires_at", "bigint")
    .addColumn("token_type", "text")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("session_state", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("session")
    .addColumn("id", "text", (col) =>
      col
        .primaryKey()
        .defaultTo(sql`nanoid()`)
        .notNull()
    )
    .addColumn("user_id", "text", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("session_token", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("verification_token")
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createIndex("account_user_id_index")
    .on("identity_provider_account")
    .column("user_id")
    .execute();

  await db.schema
    .createIndex("session_user_id_index")
    .on("session")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("identity_provider_account").execute();
  await db.schema.dropTable("session").execute();
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("verification_token").execute();
}
