import type { UserId } from './User';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.identity_provider_account */
export type IdentityProviderAccountId = string & { __brand: 'IdentityProviderAccountId' };

/** Represents the table public.identity_provider_account */
export default interface IdentityProviderAccountTable {
  id: ColumnType<IdentityProviderAccountId, IdentityProviderAccountId | undefined, IdentityProviderAccountId>;

  userId: ColumnType<UserId, UserId, UserId>;

  type: ColumnType<string, string, string>;

  provider: ColumnType<string, string, string>;

  providerAccountId: ColumnType<string, string, string>;

  refreshToken: ColumnType<string | null, string | null, string | null>;

  accessToken: ColumnType<string | null, string | null, string | null>;

  expiresAt: ColumnType<string | null, string | null, string | null>;

  tokenType: ColumnType<string | null, string | null, string | null>;

  scope: ColumnType<string | null, string | null, string | null>;

  idToken: ColumnType<string | null, string | null, string | null>;

  sessionState: ColumnType<string | null, string | null, string | null>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type IdentityProviderAccount = Selectable<IdentityProviderAccountTable>;

export type NewIdentityProviderAccount = Insertable<IdentityProviderAccountTable>;

export type IdentityProviderAccountUpdate = Updateable<IdentityProviderAccountTable>;