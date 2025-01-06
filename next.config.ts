import type { NextConfig } from "next";
import builderDevTools from "@builder.io/dev-tools/next";

// Import env here to validate during build.
import { serverEnv } from "./env/server";
import { clientEnv } from "./env/client";

// Assign env variables to _serverEnv and _clientEnv to validate during build.
// Without assignment, the imports will be stripped out by the build process if unused.
const _serverEnv = serverEnv;
const _clientEnv = clientEnv;

const withBuilderDevTools = builderDevTools({});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withBuilderDevTools(nextConfig);
