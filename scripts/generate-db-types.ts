import { processDatabase, type Config } from "kanel";
import config from "../.kanelrc";

async function run() {
  await processDatabase({
    ...config,
    enumStyle: "type",
  } as unknown as Config);
}

run();
