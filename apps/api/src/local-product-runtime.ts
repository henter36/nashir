import pg from "pg";

import { AuditRepository } from "./audit/audit-repository.js";
import type { BuildAppOptions } from "./app.js";
import { IdempotencyRepository } from "./idempotency/idempotency-repository.js";
import { ProductRepository } from "./products/product-repository.js";
import type { WorkspaceMembershipResolver } from "./workspace-context-guard.js";

const { Pool } = pg;

export const LOCAL_PRODUCT_RUNTIME_REQUEST_ENV =
  "NASHIR_ENABLE_LOCAL_PRODUCT_RUNTIME";

type LocalProductRuntimeEnv = Record<string, string | undefined>;

type LocalProductRuntimeBuildAppOptions = Required<
  Pick<
    BuildAppOptions,
    | "productRepository"
    | "idempotencyRepository"
    | "auditRepository"
    | "workspaceMembershipResolver"
  >
>;

export interface LocalProductRuntimeDependencies {
  buildAppOptions: LocalProductRuntimeBuildAppOptions;
  close: () => Promise<void>;
}

interface CreateLocalProductRuntimeDependenciesOptions {
  env?: LocalProductRuntimeEnv;
}

function isLocalProductRuntimeRequested(env: LocalProductRuntimeEnv): boolean {
  const rawValue = env[LOCAL_PRODUCT_RUNTIME_REQUEST_ENV]?.trim().toLowerCase();

  return rawValue === "1" || rawValue === "true";
}

// Local/dev-only membership shim for Product API validation. This is not a
// production authorization model and must only be wired by the local bootstrap.
export const localDevOnlyWorkspaceMembershipResolver: WorkspaceMembershipResolver =
  () => ({ outcome: "member" });

export function createLocalProductRuntimeDependencies(
  options: CreateLocalProductRuntimeDependenciesOptions = {}
): LocalProductRuntimeDependencies | undefined {
  const env = options.env ?? process.env;
  const nodeEnv = env.NODE_ENV?.trim().toLowerCase();
  const databaseUrl = env.DATABASE_URL?.trim();
  const requested = isLocalProductRuntimeRequested(env);

  if (nodeEnv === "production") {
    if (requested) {
      throw new Error(
        `${LOCAL_PRODUCT_RUNTIME_REQUEST_ENV} cannot be enabled when NODE_ENV=production.`
      );
    }

    return undefined;
  }

  if (!databaseUrl) {
    if (requested) {
      throw new Error(
        `DATABASE_URL is required when ${LOCAL_PRODUCT_RUNTIME_REQUEST_ENV} is enabled.`
      );
    }

    return undefined;
  }

  const pool = new Pool({ connectionString: databaseUrl });

  return {
    buildAppOptions: {
      productRepository: new ProductRepository(pool),
      idempotencyRepository: new IdempotencyRepository(pool),
      auditRepository: new AuditRepository(pool),
      workspaceMembershipResolver: localDevOnlyWorkspaceMembershipResolver
    },
    close: () => pool.end()
  };
}
