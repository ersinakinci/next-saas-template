import { auth } from "@/services/auth";
import invariant from "tiny-invariant";

export const getCurrentEntity = async () => {
  const session = await auth();

  invariant(session?.user, "Session user not found; is the user logged in?");

  const currentEntity = session.user.entities.find(
    (entity) => entity.id === session.user.currentEntityId
  );

  invariant(currentEntity, "Current entity not found");

  return currentEntity;
};

export const getCurrentEntityUnauthenticated = async () => {
  const session = await auth();

  const currentEntity = session?.user?.entities.find(
    (entity) => entity.id === session.user.currentEntityId
  );

  return currentEntity;
};
