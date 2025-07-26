import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("entity")
    .addColumn("id", "text", (col) =>
      col
        .primaryKey()
        .defaultTo(sql`nanoid()`)
        .notNull()
    )
    .addColumn("user_id", "text", (col) => col.references("user.id").notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createIndex("entity_user_id_index")
    .on("entity")
    .column("user_id")
    .execute();

  await db.schema
    .alterTable("user")
    .addColumn("last_entity_id", "text", (col) => col.references("entity.id"))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("user").dropColumn("last_entity_id").execute();

  await db.schema.dropTable("entity").execute();
}
