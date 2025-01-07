// Some modules used in our auth config aren't edge runtime compatible,
// and thus can't be used in Next.js' middleware.
//
// We extract the edge-compatible parts of our auth config here to use
// in the middleware, and we use the full auth config in @/services/auth/index.ts.
//
// See https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility

import { UserOnboardingSchema } from "@/schemas/schema.user-onboarding";
import { DefaultSession, NextAuthConfig } from "next-auth";
import { EntityId } from "../db/schemas/public/Entity";
import { UserId } from "../db/schemas/public/User";
import Google from "next-auth/providers/google";
import { Provider } from "@auth/core/providers";

declare module "@auth/core" {
  interface User {
    id: UserId;
    email: string;
    image: string;
    onboarding: unknown;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: UserId;
      entities: { id: EntityId; name: string }[];
      currentEntityId: EntityId;
      onboarding: UserOnboardingSchema;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    entities: { id: EntityId }[];
    currentEntityId: EntityId;
    onboarding: UserOnboardingSchema;
  }
}

const providers: Provider[] = [
  Google({
    allowDangerousEmailAccountLinking: true,
  }),
];

export const edgeConfig = {
  providers,
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/sign-in",
    verifyRequest: "/sign-in/verify",
  },
} satisfies NextAuthConfig;
