export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./services/monitoring/init.server");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./services/monitoring/init.edge");
  }
}
