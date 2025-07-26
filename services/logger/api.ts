import { Logger, ILogObj } from "tslog";
import { serverEnv } from "../env/api.server";

export const logger = new Logger<ILogObj>({
  minLevel: serverEnv.NODE_ENV === "development" ? 1 : 2,
});
