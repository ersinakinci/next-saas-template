import type { default as SubscriptionTable } from './Subscription';
import type { default as UserTable } from './User';
import type { default as KyselyMigrationLockTable } from './KyselyMigrationLock';
import type { default as SessionTable } from './Session';
import type { default as IdentityProviderAccountTable } from './IdentityProviderAccount';
import type { default as KyselyMigrationTable } from './KyselyMigration';
import type { default as VerificationTokenTable } from './VerificationToken';
import type { default as EntityTable } from './Entity';

export default interface PublicSchema {
  subscription: SubscriptionTable;

  user: UserTable;

  kyselyMigrationLock: KyselyMigrationLockTable;

  session: SessionTable;

  identityProviderAccount: IdentityProviderAccountTable;

  kyselyMigration: KyselyMigrationTable;

  verificationToken: VerificationTokenTable;

  entity: EntityTable;
}