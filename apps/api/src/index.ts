import { loadAuthConfig, type AuthConfig } from "./auth-config.js";
import { buildApp } from "./app.js";
import {
  assertLocalE2eAuthProductionSafe,
  createLocalE2eAuthGuardHook,
  createLocalE2eWorkspaceMembershipResolver,
  isLocalE2eAuthRequested,
  LOCAL_E2E_AUTH_REQUEST_ENV,
  type LocalE2eAuthGuardHook
} from "./local-e2e-auth.js";
import {
  createLocalProductRuntimeDependencies,
  isLocalProductRuntimeRequested,
  LOCAL_PRODUCT_RUNTIME_REQUEST_ENV
} from "./local-product-runtime.js";

// Fail-closed independent of every other condition below: if this flag is
// ever enabled under NODE_ENV=production, startup must refuse immediately.
try {
  assertLocalE2eAuthProductionSafe(process.env);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

const localE2eAuthRequested = isLocalE2eAuthRequested(process.env);

let authConfig: AuthConfig | undefined;
let localE2eAuthGuardHook: LocalE2eAuthGuardHook | null = null;
let localE2eMembershipResolver:
  | ReturnType<typeof createLocalE2eWorkspaceMembershipResolver>
  | undefined;

if (localE2eAuthRequested) {
  const nodeEnv = (process.env.NODE_ENV ?? "").trim().toLowerCase();
  if (nodeEnv !== "development" && nodeEnv !== "test") {
    console.error(
      `${LOCAL_E2E_AUTH_REQUEST_ENV} requires NODE_ENV=development or NODE_ENV=test (got "${process.env.NODE_ENV ?? ""}").`
    );
    process.exit(1);
  }

  if (!isLocalProductRuntimeRequested(process.env)) {
    console.error(
      `${LOCAL_E2E_AUTH_REQUEST_ENV} requires ${LOCAL_PRODUCT_RUNTIME_REQUEST_ENV} to also be enabled.`
    );
    process.exit(1);
  }

  // Local E2E mode fully replaces Auth0/JWKS for this process: no real
  // tenant configuration is required or consulted, and no fallback from a
  // failed Auth0 verification into this mode is possible because the real
  // guard is never constructed in this branch.
  localE2eAuthGuardHook = createLocalE2eAuthGuardHook();
  localE2eMembershipResolver = createLocalE2eWorkspaceMembershipResolver();
} else {
  try {
    authConfig = loadAuthConfig();
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

let localProductRuntimeDependencies: ReturnType<
  typeof createLocalProductRuntimeDependencies
>;
try {
  localProductRuntimeDependencies = createLocalProductRuntimeDependencies({
    workspaceMembershipResolver: localE2eMembershipResolver
  });
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

const app = buildApp({
  authConfig,
  localE2eAuthGuardHook,
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
