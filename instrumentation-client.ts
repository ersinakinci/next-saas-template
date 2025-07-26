import "./services/monitoring/init.client";

import { captureRouterTransitionStart } from "./services/monitoring/api.client";

// This export will instrument router navigations, and is only relevant if you enable tracing.
// `captureRouterTransitionStart` is available from SDK version 9.12.0 onwards
export const onRouterTransitionStart = captureRouterTransitionStart;
