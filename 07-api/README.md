# 07 — API

## Purpose

This section specifies the single public HTTP API exposed by Gestión Neiva to its
clients (React SPA frontend and authorized API consumers). It establishes URL routing,
error payload structures, authentication tokens, and the formal OpenAPI specification.

## Documents

| Document | Answers | Priority |
|---|---|---|
| [rest-conventions.md](./rest-conventions.md) | What conventions govern URL paths, error shapes, and status codes? | ⭐ |
| [contracts/openapi/openapi-spec.yaml](./contracts/openapi/openapi-spec.yaml) | Consolidated OpenAPI 3.1.0 specification for all 6 modules | ⭐ |

## Out of scope

Per-module HTTP APIs, API gateways, and external service proxies. All endpoints are
served by the single FastAPI application under the unified `/api/v1` prefix.

## Ready when

- [x] Base path `/api/v1` is adopted across all routes
- [x] Standard error format with `error`, `message`, and `details` is defined
- [ ] OpenAPI 3.1.0 specification is documented and validated against live FastAPI routes (`PARTIAL` — `openapi: 3.1.0` declared; automated diff against `app.openapi()`: `NO VERIFICADO`)

---

**Related:** [`../05-architecture/modular-monolith.md`](../05-architecture/modular-monolith.md) · [`../06-data/models.md`](../06-data/models.md)
