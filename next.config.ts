import type { NextConfig } from "next";

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

export default nextConfig;
