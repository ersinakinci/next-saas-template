// Adapted from https://github.com/nextauthjs/next-auth/blob/0d73205a96f300fe611e32412425ba62fa09da82/packages/adapter-kysely/src/index.ts

/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://kysely.dev/">Kysely</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://kysely.dev/">
 *   <img style={{display: "block"}} src="/img/adapters/kysely.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install kysely @auth/kysely-adapter
 * ```
 *
 * @module @auth/kysely-adapter
 */

import { Kysely, sql, SqliteAdapter } from "kysely";

import {
  type Adapter,
  type AdapterUser,
  type AdapterAccount,
  type AdapterSession,
  type VerificationToken,
  isDate,
} from "@auth/core/adapters";
import { User, UserId } from "@/services/db.server/schemas/public/User";
import { DBClient, transact } from "@/services/db.server";
import { NewEntity } from "@/services/db.server/schemas/public/Entity";
import { Entity } from "@/services/db.server/schemas/public/Entity";
import invariant from "tiny-invariant";

export interface Database {
  User: User;
  Account: AdapterAccount;
  Session: AdapterSession;
  VerificationToken: VerificationToken;
}

const upsertEntity = async ({
  db,
  ...data
}: {
  db: DBClient;
} & (NewEntity | Entity)) => {
  let entity: Entity;

  if (data.id) {
    entity = await db
      .updateTable("entity")
      .set({ ...data, updatedAt: sql`current_timestamp` })
      .where("id", "=", data.id)
      .returningAll()
      .executeTakeFirstOrThrow();
  } else {
    entity = await db
      .insertInto("entity")
      .values({ ...data })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  invariant(entity, "Entity must exist");

  return entity;
};

export const format = {
  from<T>(object?: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    for (const key in object) {
      const value = object[key];
      if (isDate(value)) newObject[key] = new Date(value);
      else newObject[key] = value;
    }
    return newObject as T;
  },
  to<T>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(object))
      newObject[key] = value instanceof Date ? value.toISOString() : value;
    return newObject as T;
  },
};

export function KyselyAdapter(db: DBClient): Adapter {
  const { adapter } = db.getExecutor();
  const { supportsReturning } = adapter;
  const isSqlite = adapter instanceof SqliteAdapter;
  /** If the database is SQLite, turn dates into an ISO string  */
  const to = isSqlite ? format.to : <T>(x: T) => x as T;
  /** If the database is SQLite, turn ISO strings into dates */
  const from = isSqlite ? format.from : <T>(x: T) => x as T;

  return {
    async createUser(data: { id?: UserId } & AdapterUser) {
      return await transact(db, async (db) => {
        let userRecord = await db
          .insertInto("user")
          .values(to(data))
          .returningAll()
          .executeTakeFirstOrThrow();

        // Create the user's default personal entity, accounts, etc.
        const entity = await upsertEntity({
          db,
          userId: userRecord.id,
        });

        // Update the lastEntity field on the user.
        userRecord = await db
          .updateTable("user")
          .set({ lastEntityId: entity.id, updatedAt: sql`current_timestamp` })
          .where("id", "=", userRecord.id)
          .returningAll()
          .executeTakeFirstOrThrow();

        return {
          id: userRecord.id,
          email: userRecord.email,
          emailVerified: userRecord.emailVerified,
          image: userRecord.image,
        };
      });
    },

    async getUser(id: UserId) {
      const result = await db
        .selectFrom("user")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },

    async getUserByEmail(email) {
      const result = await db
        .selectFrom("user")
        .selectAll()
        .where("email", "=", email)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const result = await db
        .selectFrom("user")
        .innerJoin(
          "identityProviderAccount",
          "user.id",
          "identityProviderAccount.userId"
        )
        .selectAll("user")
        .where(
          "identityProviderAccount.providerAccountId",
          "=",
          providerAccountId
        )
        .where("identityProviderAccount.provider", "=", provider)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },

    async updateUser({ id, ...user }: { id: UserId } & AdapterUser) {
      const userData = to(user);
      const query = db.updateTable("user").set(userData).where("id", "=", id);
      const result = supportsReturning
        ? query.returningAll().executeTakeFirstOrThrow()
        : query
            .executeTakeFirstOrThrow()
            .then(() =>
              db
                .selectFrom("user")
                .selectAll()
                .where("id", "=", id)
                .executeTakeFirstOrThrow()
            );
      return from(await result);
    },

    async deleteUser(userId: UserId) {
      await db
        .deleteFrom("user")
        .where("user.id", "=", userId)
        .executeTakeFirst();
    },

    async linkAccount(account: { userId: UserId } & AdapterAccount) {
      return await transact(db, async (db) => {
        if (account.provider === "google" && account.access_token) {
          // Fetch the user's profile photo. Don't just rely on the one in the profile
          // because it's often a default image provided by Google. In that case, we
          // want the photo to be null so that we can fall back to using Boring Avatars
          // later.
          const res = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            {
              headers: { Authorization: `Bearer ${account.access_token}` },
            }
          );
          const data = await res.json();

          // Get the primary photo if it isn't Google's default photo
          const image = data.photos.find(
            (p: any) => p.metadata.primary === true && !p.default
          )?.url;

          if (image) {
            await db
              .updateTable("user")
              .set({ image })
              .where("id", "=", account.userId)
              .execute();
          }
        }

        await db
          .insertInto("identityProviderAccount")
          .values(to(account))
          .executeTakeFirstOrThrow();

        return account;
      });
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .deleteFrom("identityProviderAccount")
        .where(
          "identityProviderAccount.providerAccountId",
          "=",
          providerAccountId
        )
        .where("identityProviderAccount.provider", "=", provider)
        .executeTakeFirstOrThrow();
    },

    async createSession(session: { userId: UserId } & AdapterSession) {
      await db.insertInto("session").values(to(session)).execute();
      return session;
    },

    async getSessionAndUser(sessionToken) {
      const result = await db
        .selectFrom("session")
        .innerJoin("user", "user.id", "session.userId")
        .selectAll("user")
        .select(["session.expires", "session.userId"])
        .where("session.sessionToken", "=", sessionToken)
        .executeTakeFirst();
      if (!result) return null;

      const { userId, expires, ...user } = result;
      const session = { sessionToken, userId, expires };
      return { user: from(user), session: from(session) };
    },

    async updateSession(session: { userId: UserId } & AdapterSession) {
      const sessionData = to(session);
      const query = db
        .updateTable("session")
        .set(sessionData)
        .where("session.sessionToken", "=", session.sessionToken);
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await query.executeTakeFirstOrThrow().then(async () => {
            return await db
              .selectFrom("session")
              .selectAll()
              .where("session.sessionToken", "=", sessionData.sessionToken)
              .executeTakeFirstOrThrow();
          });
      return from(result);
    },

    async deleteSession(sessionToken) {
      await db
        .deleteFrom("session")
        .where("session.sessionToken", "=", sessionToken)
        .executeTakeFirstOrThrow();
    },

    async createVerificationToken(data) {
      await db.insertInto("verificationToken").values(to(data)).execute();
      return data;
    },

    async useVerificationToken({ identifier, token }) {
      const query = db
        .deleteFrom("verificationToken")
        .where("verificationToken.token", "=", token)
        .where("verificationToken.identifier", "=", identifier);

      const result = supportsReturning
        ? await query.returningAll().executeTakeFirst()
        : await db
            .selectFrom("verificationToken")
            .selectAll()
            .where("token", "=", token)
            .executeTakeFirst()
            .then(async (res) => {
              await query.executeTakeFirst();
              return res;
            });
      if (!result) return null;
      return from(result);
    },
  };
}

/**
 * Wrapper over the original `Kysely` class in order to validate the passed in
 * database interface. A regular Kysely instance may also be used, but wrapping
 * it ensures the database interface implements the fields that Auth.js
 * requires. When used with `kysely-codegen`, the `Codegen` type can be passed as
 * the second generic argument. The generated types will be used, and
 * `KyselyAuth` will only verify that the correct fields exist.
 */
export class KyselyAuth<DB extends T, T = Database> extends Kysely<DB> {}

export type Codegen = {
  [K in keyof Database]: { [J in keyof Database[K]]: unknown };
};
