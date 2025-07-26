import { DBClient } from "@/services/db/api.server";
import { UserId } from "@/services/db/schemas/public/User";

export const getLastEntity = async ({
  db,
  userId,
}: {
  db: DBClient;
  userId: UserId;
}) => {
  const entity = await db
    .selectFrom("entity")
    .innerJoin("user", "entity.id", "user.lastEntityId")
    .selectAll("entity")
    .where("user.id", "=", userId)
    .executeTakeFirstOrThrow();

  return entity;
};
