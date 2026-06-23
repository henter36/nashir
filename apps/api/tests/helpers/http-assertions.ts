import { expect } from "vitest";
import type { FastifyInstance } from "fastify";

type InjectResponse = Awaited<ReturnType<FastifyInstance["inject"]>>;

// Shared assertion for the common "status code + flat ErrorModel errorCode"
// shape used across local E2E auth tests (permission-denied,
// workspace-not-found, service-unavailable, etc). The expected status and
// code are always passed explicitly at the call site, so failures still
// name exactly which invariant did not hold.
export function expectErrorResponse(
  response: InjectResponse,
  statusCode: number,
  errorCode: string
): void {
  expect(response.statusCode).toBe(statusCode);
  expect(response.json().errorCode).toBe(errorCode);
}
