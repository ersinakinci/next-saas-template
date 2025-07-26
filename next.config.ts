import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Import env here to validate during build.
import { serverEnv } from "./services/env/api.server";
import { clientEnv } from "./services/env/api.client";

// Assign env variables to _serverEnv and _clientEnv to validate during build.
// Without assignment, the imports will be stripped out by the build process if unused.
const _serverEnv = serverEnv;
const _clientEnv = clientEnv;

const nextConfig: NextConfig = {
  /* config options here */
};

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(nextConfig, {
  org: serverEnv.SENTRY_ORG,
  project: serverEnv.SENTRY_PROJECT,
  authToken: serverEnv.SENTRY_AUTH_TOKEN,
  // Only print logs for uploading source maps in CI
  // Set to `true` to suppress logs
  silent: !serverEnv.CI,
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-side errors will fail.
  tunnelRoute: true, // Generates a random route for each build (recommended)
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
});
