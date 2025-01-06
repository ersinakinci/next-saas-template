import "server-only";

import fetchRetry from "fetch-retry";
import { serverEnv } from "@/env/server";

const fetcher = fetchRetry(fetch);

type EmailOctopusValuesBase = string | string[] | undefined;
type EmailOctopusValues =
  | EmailOctopusValuesBase
  | Record<string, EmailOctopusValuesBase>;

export const emailOctopus = async (
  path: string,
  data?: Record<string, EmailOctopusValues>,
  method?: "POST" | "GET" | "DELETE"
): Promise<Record<string, EmailOctopusValues>> => {
  if (serverEnv.NODE_ENV === "test") {
    console.error(
      "WARNING: Attempting to call EmailOctopus in test environment"
    );
  }

  // console.log("path", path);
  // console.log("data", data);
  // console.log(
  //   "url",
  //   `https://emailoctopus.com/api/1.6/${path.replace(/^\/+/, "")}`
  // );

  const res = await fetcher(
    `https://emailoctopus.com/api/1.6/${path.replace(/^\/+/, "")}`,
    {
      // Exponential backoff retry
      retryDelay: function (attempt, error, response) {
        return Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
      },
      method: method ?? "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: serverEnv.EMAIL_OCTOPUS_API_KEY,
        ...data,
      }),
    }
  );

  // console.log("res", res);

  const resData = await res.json();

  // console.log("resData", resData);

  return resData;
};
