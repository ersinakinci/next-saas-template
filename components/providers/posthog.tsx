"use client";

import { clientEnv } from "@/env/client";
import posthog from "posthog-js";
import { PostHogProvider as RawPostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined" && clientEnv.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(clientEnv.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: clientEnv.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // Don't track non-prod traffic
  if (
    typeof window === "undefined" ||
    window.location.host.startsWith("localhost") ||
    window.location.host.startsWith("127.0.0.1")
  )
    return <>{children}</>;

  return <RawPostHogProvider client={posthog}>{children}</RawPostHogProvider>;
}
