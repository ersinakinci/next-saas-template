import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Represents the table public.verification_token */
export default interface VerificationTokenTable {
  identifier: ColumnType<string, string, string>;

  token: ColumnType<string, string, string>;

  expires: ColumnType<Date, Date | string, Date | string>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type VerificationToken = Selectable<VerificationTokenTable>;

export type NewVerificationToken = Insertable<VerificationTokenTable>;

export type VerificationTokenUpdate = Updateable<VerificationTokenTable>;