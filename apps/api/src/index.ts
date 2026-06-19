import { loadAuthConfig } from "./auth-config.js";
import { buildApp } from "./app.js";
import { createLocalProductRuntimeDependencies } from "./local-product-runtime.js";

let authConfig: ReturnType<typeof loadAuthConfig>;
try {
  authConfig = loadAuthConfig();
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

let localProductRuntimeDependencies: ReturnType<
  typeof createLocalProductRuntimeDependencies
>;
try {
  localProductRuntimeDependencies = createLocalProductRuntimeDependencies();
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

const app = buildApp({
  authConfig,
  ...localProductRuntimeDependencies?.buildAppOptions
});

if (localProductRuntimeDependencies) {
  app.addHook("onClose", async () => {
    await localProductRuntimeDependencies.close();
  });
}
const host = process.env.HOST ?? "127.0.0.1";
const rawPort = process.env.PORT ?? "3000";
const port = Number.parseInt(rawPort, 10);

if (Number.isNaN(port) || port <= 0 || port > 65535) {
  app.log.error(`Invalid PORT environment variable: "${rawPort}"`);
  process.exit(1);
}

try {
  await app.listen({ host, port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
