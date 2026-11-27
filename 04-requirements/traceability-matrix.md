# 04 — Traceability Matrix

- **Last audit:** 2026-11-27 (Documentation & Governance Stabilization — Javela)
- **Evidence policy:** Status values follow `PASS`, `PARTIAL`, `FAIL`, or `NO VERIFICADO`. No item is marked `PASS` without an executable CI run, artifact, or direct repository verification.

## User stories (`HU-01` .. `HU-12`)

**Tabla 1**
*Matriz de trazabilidad bidireccional entre Historias de Usuario (`HU-NN`), Reglas de Negocio (`BR-NN`), Módulos, Diseño, Casos de Prueba (`TC-NNN`) y Nodos Automatizados de Pytest*

| HU-NN | Linked BR | Module | Design document | Formal Test Case | Automated Pytest Node | Status | Evidence |
|---|---|---|---|---|---|---|---|
| HU-01 | `BR-03`, `BR-08` | `auth_tenancy` | [`models.md`](../06-data/models.md) | [`TC-001`](../11-quality/cases/TC-001.md) | `tests/test_auth.py::test_login_exitoso` | `PASS` | Run `#45914762624` (`98 passed, 0 skipped`) + `test_store_journey_e2e.py` |
| HU-02 | `BR-05`, `BR-10` | `inventario` | [`models.md`](../06-data/models.md) | [`TC-002`](../11-quality/cases/TC-002.md) | `tests/test_owasp_security.py::test_aislamiento_multitenant_codigo_barras_y_soft_delete` | `PASS` | Run `#45914762624` (note: partial unique index `WHERE is_active = true` planned in `015` per `ADR-006`) |
| HU-03 | `BR-11` | `inventario` | [`entities-and-rules.md`](../02-domain/entities-and-rules.md) | [`TC-003`](../11-quality/cases/TC-003.md) | `tests/test_agente_rbac_reabastecer.py::test_consulta_vencimientos_rapida` | `PASS` | Run `#45914762624` |
| HU-04 | `BR-06` | `pos_ventas` | [`module-boundaries.md`](../02-domain/module-boundaries.md) | [`TC-004`](../11-quality/cases/TC-004.md) | `tests/test_fase2_backend_rbac.py::test_catalogo_ciego_cajero_no_recibe_precios_de_costo` + `tests/end_to_end/test_store_journey_e2e.py::test_complete_store_e2e_journey_v1` | `PASS` | Run `#45914762624` (blind catalog + subtotal calculation verified in E2E) |
| HU-05 | `BR-01`, `BR-04` | `pos_ventas` | [`ADR-003`](../05-architecture/decisions/records/ADR-003-concurrencia-inventario-pos.md) | [`TC-005`](../11-quality/cases/TC-005.md) | `tests/test_concurrencia_real.py::test_concurrencia_dos_ventas_compitiendo_stock_uno` + `tests/integration/postgres/test_concurrencia_postgres.py` | `PASS` | Run `#45914762624` (PostgreSQL 16 live concurrency + HTTP `422` contract) |
| HU-06 | `BR-02` | `pos_ventas` | [`entities-and-rules.md`](../02-domain/entities-and-rules.md) · [`ADR-006`](../05-architecture/decisions/records/ADR-006-aislamiento-tenancy-uuid-fachadas.md) | [`TC-006`](../11-quality/cases/TC-006.md) | `tests/test_fase1_rbac_modelos.py::test_trazabilidad_historica_snapshot_permanente` | `PARTIAL` | `precio_unitario` y `vendedor_nombre_snapshot` verificados (`PASS`); `producto_nombre_snapshot` pendiente de migración `015` (`ADR-006`) |
| HU-07 | `BR-03` | `soporte_crm` | [`module-boundaries.md`](../02-domain/module-boundaries.md) | [`TC-007`](../11-quality/cases/TC-007.md) | `tests/test_soporte_crm.py::test_usuario_puede_crear_ticket` | `PASS` | Run `#45914762624` |
| HU-08 | `BR-08` | `soporte_crm` | [`rest-conventions.md`](../07-api/rest-conventions.md) | [`TC-008`](../11-quality/cases/TC-008.md) | `tests/test_soporte_crm.py::test_flujo_completo_ticket_respuesta` | `PASS` | Run `#45914762624` |
| HU-09 | `BR-09`, `BR-12` | `agente_ia` | [`module-boundaries.md`](../02-domain/module-boundaries.md) | [`TC-009`](../11-quality/cases/TC-009.md) | `tests/test_agente_rbac_reabastecer.py::test_admin_reabastece_con_nuevo_costo_y_alerta_margen` | `PASS` | Run `#45914762624` (live Whisper STT roundtrip not executed in CI) |
| HU-10 | `BR-09`, `BR-12` | `agente_ia` | [`overview.md`](../01-context/overview.md) | [`TC-010`](../11-quality/cases/TC-010.md) | `tests/test_agente_produccion.py::test_t05_doble_confirmacion_idempotente` | `PASS` | Run `#45914762624` |
| HU-11 | `BR-03`, `BR-06` | `reportes_analytics` | [`overview.md`](../01-context/overview.md) | [`TC-011`](../11-quality/cases/TC-011.md) | `tests/test_fase2_backend_rbac.py::test_actividad_del_dia_timezone_colombia` | `PASS` | Run `#45914762624` |
| HU-12 | `BR-03` | `reportes_analytics` | [`scope.md`](../01-context/scope.md) | [`TC-012`](../11-quality/cases/TC-012.md) | `tests/test_fase2_backend_rbac.py::test_blindaje_rbac_cajero_bloqueado_de_admin_endpoints` | `PARTIAL` | RBAC blocking verified (`PASS`); automated assertion of Excel `.xlsx` binary payload generation in `pytest`: `NO VERIFICADO` |

*Nota.* Los 12 nodos de `pytest` existen en el repositorio y fueron ejecutados en PostgreSQL 16 en GitHub Actions Run `#45914762624` (commit `91cdf2b`). Fuente: Elaboración propia (2026).

## Business rules (`BR-01` .. `BR-12`)

**Tabla 2**
*Trazabilidad explícita de Reglas de Negocio (`BR-01`..`BR-12`) hacia Módulo Propietario, Diseño, Caso de Prueba y Estado de Verificación*

| BR-NN | Rule Summary | Owning Module | Design Document | Linked HU / TC | Automated Verification | Status |
|---|---|---|---|---|---|---|
| BR-01 | Rechazar venta si `cantidad_actual < cantidad_solicitada` (HTTP `422`) | `pos_ventas` / `inventario` | [`entities-and-rules.md`](../02-domain/entities-and-rules.md) | `HU-05` / `TC-005` | `tests/module_integration/test_facades_integration.py::test_checkout_when_stock_insufficient_returns_422_and_preserves_stock` | `PASS` |
| BR-02 | Congelar `precio_unitario` y nombre de producto en `DetalleVenta` | `pos_ventas` | [`entities-and-rules.md`](../02-domain/entities-and-rules.md) · [`ADR-006`](../05-architecture/decisions/records/ADR-006-aislamiento-tenancy-uuid-fachadas.md) | `HU-06` / `TC-006` | `tests/test_fase1_rbac_modelos.py::test_trazabilidad_historica_snapshot_permanente` | `PARTIAL` *(falta `producto_nombre_snapshot` en migración `015`)* |
| BR-03 | Aislamiento estricto por `empresa_id` (Zero Leakage) | `auth_tenancy` (cross-cutting) | [`ADR-002`](../05-architecture/decisions/records/ADR-002-aislamiento-multitenant.md) · [`ADR-006`](../05-architecture/decisions/records/ADR-006-aislamiento-tenancy-uuid-fachadas.md) | `HU-01`, `HU-07`, `HU-11` | `tests/test_fase2_backend_rbac.py::test_aislamiento_multi_tenant_anti_idor` | `PARTIAL` *(API `PASS`; 4 FKs cruzadas `DAT-03` pendientes de `S3-2`/`S3-3`)* |
| BR-04 | Checkout ACID con `SELECT ... FOR UPDATE` ordenado | `pos_ventas` | [`ADR-003`](../05-architecture/decisions/records/ADR-003-concurrencia-inventario-pos.md) | `HU-05` / `TC-005` | `tests/integration/postgres/test_concurrencia_postgres.py` + `tests/unit/test_domain_unit.py` | `PASS` |
| BR-05 | Soft delete (`is_active = False`), sin borrado físico | `inventario`, `auth_tenancy` | [`database-conventions.md`](../06-data/database-conventions.md) · [`ADR-006`](../05-architecture/decisions/records/ADR-006-aislamiento-tenancy-uuid-fachadas.md) | `HU-02` / `TC-002` | `tests/test_owasp_security.py::test_aislamiento_multitenant_codigo_barras_y_soft_delete` | `PARTIAL` *(cascades `ON DELETE CASCADE` en `Empresa` pendientes de retiro en `S3-2`)* |
| BR-06 | Total de venta derivado de la suma de subtotales | `pos_ventas` | [`entities-and-rules.md`](../02-domain/entities-and-rules.md) | `HU-04`, `HU-11` | `tests/end_to_end/test_store_journey_e2e.py::test_complete_store_e2e_journey_v1` | `PASS` |
| BR-07 | Plan Basic máximo 3 cajeros activos (`MAX_CAJEROS_BASIC = 3`) | `auth_tenancy` | [`entities-and-rules.md`](../02-domain/entities-and-rules.md) | `HU-01` | `tests/test_fase2_backend_rbac.py` | `PASS` |
| BR-08 | Trial expirado sin plan pago bloquea escrituras (`403`) | `auth_tenancy` | [`entities-and-rules.md`](../02-domain/entities-and-rules.md) | `HU-01`, `HU-08` | `tests/test_entitlements_trial.py` | `PASS` |
| BR-09 | Endpoints `/agente/*` restringidos a planes Pro/Premium | `agente_ia` | [`entities-and-rules.md`](../02-domain/entities-and-rules.md) | `HU-09`, `HU-10` | `tests/test_entitlements_trial.py` | `PASS` |
| BR-10 | `codigo_barras` único por empresa (`uq_producto_empresa_barras`) | `inventario` | [`models.md`](../06-data/models.md) · [`ADR-006`](../05-architecture/decisions/records/ADR-006-aislamiento-tenancy-uuid-fachadas.md) | `HU-02` / `TC-002` | `tests/test_owasp_security.py::test_aislamiento_multitenant_codigo_barras_y_soft_delete` | `PASS` *(evolución a índice único parcial `WHERE is_active = true` en `015`)* |
| BR-11 | Alerta de vencimiento `<= 15 días` | `inventario` | [`entities-and-rules.md`](../02-domain/entities-and-rules.md) | `HU-03` / `TC-003` | `tests/test_agente_rbac_reabastecer.py::test_consulta_vencimientos_rapida` | `PASS` |
| BR-12 | Idempotencia de comandos IA mediante `command_id` | `agente_ia` | [`entities-and-rules.md`](../02-domain/entities-and-rules.md) | `HU-09`, `HU-10` / `TC-010` | `tests/test_agente_produccion.py::test_t05_doble_confirmacion_idempotente` | `PASS` |

## Non-functional requirements (`NFR-01` .. `NFR-10`)

**Tabla 3**
*Trazabilidad de Requerimientos No Funcionales y Compuertas de Verificación*

| NFR-NN | Module | Design document | Verification gate | Status | Evidence / Gap |
|---|---|---|---|---|---|
| NFR-01 | `pos_ventas` | [`ADR-003`](../05-architecture/decisions/records/ADR-003-concurrencia-inventario-pos.md) | `tests/stress/locustfile.py` load run (`p95 < 300 ms` @ 50 tx) | `NO VERIFICADO` | Script existe, pero no hay corrida fechada ni percentiles registrados. |
| NFR-02 | `auth_tenancy` | [`ADR-002`](../05-architecture/decisions/records/ADR-002-aislamiento-multitenant.md) | `tests/test_fase2_backend_rbac.py::test_aislamiento_multi_tenant_anti_idor` | `PARTIAL` | Pruebas API anti-IDOR `PASS` (Run `#45914762624`); `DAT-03` (4 FKs cruzadas) pendiente de `S3-2`/`S3-3`. |
| NFR-03 | `pos_ventas` | [`ADR-003`](../05-architecture/decisions/records/ADR-003-concurrencia-inventario-pos.md) | `tests/test_concurrencia_real.py::test_concurrencia_dos_ventas_compitiendo_stock_uno` + `tests/integration/postgres/` | `PASS` | Verificado contra PostgreSQL 16 en Run `#45914762624`. |
| NFR-04 | whole artifact | [`rest-conventions.md`](../07-api/rest-conventions.md) · [`observability.md`](../13-operations/observability.md) | `tests/test_owasp_security.py::test_deep_health_check_and_correlation_id` + monitor 99.5% uptime | `PARTIAL` | Endpoint `/health` verificado en tests (`PASS`); monitor de uptime 99.5% en producción `NO VERIFICADO` y política Redis desalineada (`OBS-03`). |
| NFR-05 | `auth_tenancy` | [`rest-conventions.md`](../07-api/rest-conventions.md) | `tests/test_auth.py::test_me_sin_token` + `test_store_journey_e2e.py` | `PASS` | Run `#45914762624`. |
| NFR-06 | `agente_ia` | [`overview.md`](../01-context/overview.md) | `tests/test_llm_provider_smoke.py::test_telemetry_exact_semantics` | `PARTIAL` | Semántica de telemetría probada (`PASS`); benchmark real de roundtrip STT Whisper + FSM `< 3.0 s` en red viva `NO VERIFICADO`. |
| NFR-07 | whole artifact | [`modular-monolith.md`](../05-architecture/modular-monolith.md) | `.github/workflows/ci.yml` (`--cov-fail-under=80` y `pos_ventas >= 90%`) | `PASS` | Run `#45914762624`: `81.20%` global, `100%` `pos_ventas`, artefacto `backend-coverage-xml` (`id: 15162095976`). |
| NFR-08 | whole artifact | [`local-setup.md`](../10-devops/local-setup.md) | Timed onboarding `< 1 h` usando `make dev` o `dev.ps1` | `NO VERIFICADO` | Guía presente, pero sin registro cronometrado de instalación desde cero por un tercero. |
| NFR-09 | whole artifact | [`observability.md`](../13-operations/observability.md) | `tests/test_owasp_security.py::test_auditoria_de_seguridad_logging` | `PASS` | Logging JSON con `correlationId` verificado en Run `#45914762624` (métricas `OBS-02` siguen pendientes). |
| NFR-10 | whole artifact | [`scope.md`](../01-context/scope.md) | `frontend/tests/voice/lateResponse.test.mjs`, Playwright `360×800` y Lighthouse `>= 90` | `PASS` *(público CI)* / `PARTIAL` *(autenticado local)* | Run `#46019358053`: Voice `4/4`, Playwright público `3 passed / 1 skipped`, Lighthouse `95/90/90`, artefacto `frontend-mobile-qa-evidence` (`id: 15206887974`); autenticado `4 passed` local. |

*Nota.* Fuente: Elaboración propia con base en evidencia CI verificable (2026-11-27).

## Gaps

- **GAP-01 (Closed — Structural Mapping):** `HU-01..HU-12`, `BR-01..BR-12` y `NFR-01..NFR-10` están mapeados en esta matriz sin requisitos huérfanos.
- **GAP-02 (Closed in CI — Run `#45914762624`):** `tests/integration/postgres/test_concurrencia_postgres.py` ya se ejecuta contra `postgres:16-alpine` en `.github/workflows/ci.yml` (`0 skipped`).
- **GAP-03 (Open — Backend Sprint 3):** `BR-02`, `BR-03` y `BR-05` permanecen en `PARTIAL` hasta implementar `ADR-006` (`S3-2`..`S3-5`, migraciones `014` y `015`: retiro de 4 FKs cruzadas, retiro de cascades ORM y snapshots de producto en `detalles_venta`).
- **GAP-04 (Open — Verification Evidence):** `NFR-01` (Locust), `NFR-04` (uptime en vivo), `NFR-06` (latencia real STT), `NFR-08` (onboarding `< 1 h`) y la verificación automatizada de payload Excel en `HU-12` permanecen `NO VERIFICADO` / `PARTIAL`.

---

**Related:** [`./user-stories.md`](./user-stories.md) · [`./non-functional.md`](./non-functional.md) · [`../docs/audits/MATRIZ_EVIDENCIA_GOBERNANZA.md`](../docs/audits/MATRIZ_EVIDENCIA_GOBERNANZA.md)
