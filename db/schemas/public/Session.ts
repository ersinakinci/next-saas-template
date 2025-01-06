import type { UserId } from './User';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.session */
export type SessionId = string & { __brand: 'SessionId' };

/** Represents the table public.session */
export default interface SessionTable {
  id: ColumnType<SessionId, SessionId | undefined, SessionId>;

  userId: ColumnType<UserId, UserId, UserId>;

  sessionToken: ColumnType<string, string, string>;

  expires: ColumnType<Date, Date | string, Date | string>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Session = Selectable<SessionTable>;

export type NewSession = Insertable<SessionTable>;

export type SessionUpdate = Updateable<SessionTable>;