import NextAuth, { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { KyselyAdapter } from "@/services/auth/kysely-adapter";
import { db } from "@/services/db";
import { posthog } from "@/services/posthog";
import invariant from "tiny-invariant";
import { UTCDateMini } from "@date-fns/utc";
import { getUserTier } from "@/services/db/helpers/get-user-tier";
import { serverEnv } from "@/env/server";
import { emailOctopus } from "@/services/email-octopus";
import { getLastEntity } from "@/services/db/helpers/get-last-entity";
import { UserId } from "@/services/db/schemas/public/User";
import { Provider } from "@auth/core/providers";
import { userOnboardingSchema } from "@/schemas/schema.user-onboarding";
import { edgeConfig } from "./edge-config";

const adapter = KyselyAdapter(db);

const providers: Provider[] = [
  ...edgeConfig.providers,
  Resend({
    from: serverEnv.AUTH_FROM_EMAIL,
    apiKey: serverEnv.RESEND_API_KEY,
  }),
];

// Use credentials provider in development to make it easier to test
if (serverEnv.NODE_ENV === "development") {
  const credentialsProvider = Credentials({
    credentials: {
      email: { label: "Email" },
    },
    async authorize(credentials, request) {
      invariant(credentials.email, "Email not provided");

      // Automatically log user in for any email address
      let user = await adapter.getUserByEmail!(credentials.email as string);

      if (!user) {
        // @ts-ignore
        user = await adapter.createUser!({
          email: credentials.email as string,
        });
      }

      return {
        email: credentials.email as string,
        id: user.id,
        image: user.image,
        name: user.name,
      };
    },
  });

  providers.push(credentialsProvider);
}

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const authConfig = {
  ...edgeConfig,
  adapter,
  session: { strategy: "jwt" },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        if (session.user.onboarding) {
          token.onboarding = userOnboardingSchema.parse(
            session.user.onboarding
          );
        }
      }

      if (user) {
        const userRecord = await db
          .selectFrom("user")
          .selectAll()
          .where("id", "=", user.id as UserId)
          .executeTakeFirstOrThrow();

        const entities = await db
          .selectFrom("entity")
          .select(["id"])
          .where("userId", "=", user.id as UserId)
          .execute();
        const currentEntity = await getLastEntity({
          db,
          userId: user.id as UserId,
        });

        token.entities = entities;
        token.currentEntityId = currentEntity.id;
        token.onboarding = userOnboardingSchema.parse(userRecord.onboarding);
      }

      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          entities: token.entities,
          currentEntityId: token.currentEntityId,
          onboarding: token.onboarding,
        },
      };
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      invariant(user.email, "User email is required");
      invariant(user.id, "User id is required");

      const tier = await getUserTier(db, user.id as UserId);

      if (serverEnv.NODE_ENV === "production" && isNewUser) {
        // Subscribe to the email list via EmailOctopus
        await emailOctopus(
          `/lists/${serverEnv.EMAIL_OCTOPUS_USERS_LIST_ID}/contacts`,
          {
            email_address: user.email,
            fields: {
              Name: user.name ?? undefined,
              Tier: tier,
            },
            status: "SUBSCRIBED",
          }
        );
      }

      posthog.capture({
        distinctId: user.email,
        event: "$set",
        properties: {
          $set: {
            name: user.name,
            email: user.email,
            id: user.id,
            tier,
          },
          $setOnce: {
            createdAt: new UTCDateMini().toISOString(),
          },
        },
      });

      posthog.capture({
        distinctId: user.email,
        event: isNewUser ? "User Created" : "User Signed In",
      });
    },
  },
  providers,
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth, unstable_update } =
  NextAuth(authConfig);
