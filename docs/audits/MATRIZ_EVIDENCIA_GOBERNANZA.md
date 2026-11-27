# Matriz de Evidencia y Gobernanza — Estabilización MVP Gestión Neiva

- **Fecha de corte:** 2026-11-27
- **Responsable:** Santiago Javela Ospino (Documentación, trazabilidad y evidencia de evaluación)
- **Repositorio auditado:** `Tomasberserk/GESTION_INVENTARIO_INTELIGENTE` (rama `main`, base commit `1400acc`)
- **Marco de referencia:** *Monolith Governance Framework v2.1.0* y `docs/audits/INFORME_AUDITORIA_MVP_2026-11-21.html`
- **Restricción de alcance:** Auditoría y actualización exclusivamente documental; **0 modificaciones** en `app/`, `alembic/` ni `frontend/`.

> **Regla de veracidad:** Ninguna prueba, cobertura, migración o despliegue se declara como `PASS` sin referencia a un log, captura, artefacto de GitHub Actions o verificación directa en el repositorio. Cuando falta evidencia ejecutable en el entorno o en CI, el estado es obligatoriamente `PARTIAL`, `FAIL` o `NO VERIFICADO`.

---

## 1. Convención de Estados

| Estado | Criterio estricto de asignación |
| :--- | :--- |
| **`PASS`** | Artefacto presente, alineado con el código/contrato real y respaldado por evidencia ejecutable o inspección directa verificable (commit, Run CI, artefacto o lectura directa de archivo). |
| **`PARTIAL`** | Artefacto presente o control parcialmente implementado, pero con brechas abiertas, ejecución solo local sin CI, o dependencias pendientes en otro frente (backend/frontend/DevOps). |
| **`FAIL`** | Contradicción directa verificable entre la documentación/política declarada y el estado actual del código o del pipeline. |
| **`NO VERIFICADO`** | Control declarado o planeado sin log, captura, corrida CI ni artefacto reproducible que permita confirmar su resultado. |

---

## 2. Matriz de Evidencia por Sección y Documento Auditado

| Sección / Documento | Estado | Evidencia verificable | Brecha / Acción documental realizada o pendiente |
| :--- | :---: | :--- | :--- |
| `AGENTS.md` | **`PASS`** | Lectura directa (`163` líneas): protocolo de colaboración, ciclo de vida de `PLAN_ACTIVO.md`, regla de evidencia antes de completar y archivo en `docs/audits/planes-cerrados/`. | Sin deriva detectada. |
| `PLAN_ACTIVO.md` | **`PARTIAL`** | Lectura directa (`1,165` líneas): bloque de estabilización actualizado hasta `S3-1` (`1400acc`), Sprint 1 cerrado (`6b64f4b`), Sprint 2 archivado (`d52e913`). | Encabezado superior aún conserva estado histórico de Sprint 9/10 (`2026-11-10`). Se agrega bloque `[JAVELA PROPONE]` con dependencias y cierre documental sin marcar tareas sin evidencia. |
| `00-sdd-guide.md` | **`PASS`** *(corregido)* | Lectura directa (`83` líneas). Deriva previa (`DOC-12`): decía `ADRs 001 to 004`, `migrations 001-012`, `OpenAPI 3.0` y Gate 4 `READY 🚀`. | Corregido a `ADRs 001–004 y 006`, `migrations 001-013`, `OpenAPI 3.1.0` y Gate 4 en estabilización (`PARTIAL`). |
| `00-governance/` (`README.md`, `definition-of-done.md`, `definition-of-ready.md`, `documentation-rules.md`, `agile-conventions.md`, `git-conventions.md`, `security-policy.md`) | **`PARTIAL`** | 7/7 archivos presentes. `definition-of-done.md` exige `lint-imports`, cobertura `80%/90%` y migraciones bidireccionales (`upgrade`/`downgrade -1`). | `lint-imports` y cobertura `80%/90%` ya corren en CI (Run `#45914762624`), pero `downgrade -1` bidireccional aún no corre en `.github/workflows/ci.yml` (pendiente `S3-3`). |
| `04-requirements/` (`user-stories.md`, `non-functional.md`, `traceability-matrix.md`) | **`PARTIAL`** *(actualizado)* | Verificación directa: `12/12` `HU`, `10/10` `NFR`, `12/12` `TC` y `17/17` nodos `pytest` existen físicamente en `tests/`. | `traceability-matrix.md` actualizada para incluir mapa explícito de `BR-01..BR-12` y estados por ítem (`PASS`/`PARTIAL`/`NO VERIFICADO`). Pendiente evidencia ejecutable de `NFR-01` (Locust), `NFR-04` (uptime), `NFR-06` (latencia STT < 3 s) y `NFR-08` (onboarding < 1 h). |
| `05-architecture/` (`README.md`, `modular-monolith.md`, `module-structure.md`, `layered-architecture.md`, `boundary-enforcement.md`) | **`FAIL`** *(arquitectura aplicada)* / **`PASS`** *(diseño)* | Inspección directa en `app/routers/*.py`: 7 routers (`agente.py`, `auth.py`, `empresas.py`, `productos.py`, `reportes.py`, `usuarios.py`, `ventas.py`) aún importan `app.services.*` (`ARC-03`/`ARC-08`). `.importlinter` tiene 7/7 contratos `KEPT` (Run `#45914762624`), pero aún no bloquea `app.routers -> app.services`. | Corregido `05-architecture/README.md` para reflejar `ADR-006`. El cierre del hallazgo `ARC-03`/`ARC-08` depende de backend en Sprint 4 (`S4-1`..`S4-4`). |
| `05-architecture/decisions/` (`ADR-001`..`004`, `ADR-006`) | **`PASS`** *(decisión)* / **`NO VERIFICADO`** *(implementación `014`/`015`)* | Commit `1400acc` (`2026-11-27`): `ADR-006-aislamiento-tenancy-uuid-fachadas.md` ya existe e indexado en `decisions/README.md` con estado **`Accepted`** tras aprobación humana `S3-1B`. `0` cambios en `ADR-001`..`004`. | **Nota sobre entregable #5 (borrador ADR-006):** No se degradó ni sobrescribió `ADR-006` porque ya fue aprobado (`Accepted`) en `1400acc` y la regla de `decisions/README.md` prohíbe alterar silenciosamente ADRs aceptados. Su implementación (`S3-2`..`S3-5`, migraciones `014` y `015`) sigue pendiente en backend. |
| `06-data/` (`README.md`, `database-conventions.md`, `models.md`, `migrations.md`) | **`FAIL`** *(estado real `DAT-03`)* / **`PASS`** *(alineación documental)* | Inspección directa de `app/models.py` (líneas 169, 214, 281, 350): aún existen 4 `ForeignKey("empresas.id", ondelete="CASCADE")` cruzando límites de módulo (`productos`, `ventas`, `soporte_tickets`, `agent_commands`). Existen migraciones `001`–`013` en `alembic/versions/`. | Corregido `06-data/README.md` (de `001–012` a `001–013` y desmarcado el check de 0 FKs cruzadas hasta cerrar `DAT-03` con migración `014`). |
| `07-api/` (`README.md`, `rest-conventions.md`, `contracts/openapi/openapi-spec.yaml`) | **`PARTIAL`** *(corregido)* | `openapi-spec.yaml:1` declara `openapi: 3.1.0`. Antes `07-api/README.md` decía `OpenAPI 3.0`. | Corregido `07-api/README.md` a `OpenAPI 3.1.0`. Validación automática del esquema contra rutas vivas de FastAPI marcada como **`NO VERIFICADO`**. |
| `10-devops/` (`README.md`, `ci-cd.md`, `environments.md`, `local-setup.md`) | **`PARTIAL`** | `.github/workflows/ci.yml` ejecuta `ruff`, `compileall`, `lint-imports`, PostgreSQL `alembic upgrade head`, `pytest --cov>=80%` + `pos_ventas>=90%`, E2E SQLite, Voice FSM, `vite build`, Playwright móvil 360px y Lighthouse (Runs `#45914762624`, `#46019358053`). | Brecha `DEV-01`/`DEV-03` abierta: `ci-cd.md` declara stages `package` (`docker build`), `deploy` y triggers `v*.*.*` que no existen todavía en `.github/workflows/ci.yml`. |
| `11-quality/` (`README.md`, `testing-strategy.md`, `tdd-guide.md`, `cases/TC-001..TC-012.md`) | **`PASS`** *(pruebas unitarias/integración/E2E/cobertura)* / **`NO VERIFICADO`** *(Locust)* | Run `#45914762624` (`91cdf2b`): `98 passed, 0 failed, 0 skipped` en PostgreSQL 16, cobertura global `81.20%` (`>=80%`), `app/pos_ventas` `100%` (`>=90%`), artefacto `backend-coverage-xml` (`id: 15162095976`). | `tests/stress/locustfile.py` (`NFR-01`: p95 < 300 ms a 50 transacciones) sin ejecución ni log fechado (`NO VERIFICADO`). |
| `13-operations/` (`README.md`, `observability.md`, `runbook.md`) | **`FAIL`** *(métricas y Redis)* / **`PARTIAL`** *(logging y `/health`)* | Inspección directa de `app/main.py:140-154`: `/health` solo falla por Redis cuando `HEALTH_REQUIRE_REDIS=true` (por defecto `false`), contrario a `observability.md:27-34`. No hay instrumentación de `http_requests_total`, `http_request_duration_seconds` ni `sales_completed_total` en `app/` (`OBS-02`/`OBS-03`). | Dependencia directa de backend en `S4-5` para instrumentar métricas o ajustar contrato operativo y definir política Redis. |
| `docs/INFORME_EVALUACION_ESTRICTO_RUBRICA.html` *(histórico 2026-11-07)* | **`PARTIAL`** *(anotado como histórico)* | Afirmaba `APROBADO (96.5%)`, `Conformant (94.8%)` y `migración 013 sin FKs cruzadas`, contradicho por auditoría `2026-11-21` e inspección actual de `app/models.py`. | Agregado aviso visible de vigencia y re-auditoría sin eliminar el registro histórico. |
| `docs/INFORME_PRUEBAS_UNITARIAS_Y_E2E_APA.md` *(histórico 2026-11-07)* | **`PARTIAL`** *(anotado como histórico)* | Reportaba `103` casos (`91` aprobados, `12` omitidos) sin Run ID y marcaba `TC-005` como `APROBADO` pese a omitir pruebas de concurrencia PostgreSQL. | Agregada nota de vigencia remitiendo a la corrida reproducible de CI Run `#45914762624` (`98 passed, 0 skipped`). |
| `docs/IA_BITACORA.md` | **`PASS`** | Registro cronológico desde Sprint 0 hasta `S3-1B` y sesión actual (`2026-11-27`) con comandos, resultados, commits y declaraciones explícitas de uso de IA. | Actualizada sin sobrescribir historial previo. |
| `docs/audits/GUIA_DEMO_TENDERO_MVP.md` | **`PASS`** *(guía)* / **`NO VERIFICADO`** *(grabación/demo en vivo)* | Flujo completo trazado a `tests/end_to_end/test_store_journey_e2e.py` (verificado en Run `#45914762624`) y a vistas móviles verificadas en Sprint 2 (Run `#46019358053`). | Captura/video de demostración final en entorno limpio de sustentación pendiente de ejecución humana (`NO VERIFICADO`). |

---

## 3. Resumen de Evidencia Ejecutable Verificada en CI

| Control | Estado | Referencia verificable |
| :--- | :---: | :--- |
| Lint estático (`ruff check app`) y `compileall` | **`PASS`** | GitHub Actions Run `#45914762624` (commit `91cdf2b`) y Run `#46019358053` (commit `2ee5ddc`) |
| Fronteras modulares (`lint-imports` 7/7) | **`PASS`** *(actual)* / **`PARTIAL`** *(falta regla `app.routers`)* | Run `#45914762624`: `7 kept, 0 broken`. Falta contrato bloqueando `app.routers -> app.services` (`S4-4`). |
| Migraciones Alembic `001`–`013` en PostgreSQL 16 (`upgrade head`) | **`PASS`** | Run `#45914762624`, Stage 4 (`postgres:16-alpine`, `013 (head)`). |
| Rollback bidireccional (`downgrade -1 -> upgrade head`) | **`NO VERIFICADO`** | No ejecutado en CI todavía; planificado para `S3-3` (migración `014`). |
| Suite Pytest + concurrencia PostgreSQL + cobertura (`80%`/`90%`) | **`PASS`** | Run `#45914762624`: `98 passed, 0 failed, 0 skipped`, `81.20%` global, `100%` `app/pos_ventas/*`, artefacto `backend-coverage-xml` (`id: 15162095976`). |
| Simulación E2E SQLite (`run_e2e_simulation.py`) | **`PASS`** | Run `#45914762624` y Run `#46019358053`, Stage 6. |
| Frontend Voice FSM (`4/4`), `vite build`, Playwright 360px público y Lighthouse móvil (`95/90/90`) | **`PASS`** | Run `#46019358053` (commit `2ee5ddc`), artefacto `frontend-mobile-qa-evidence` (`id: 15206887974`). |
| Playwright móvil 360px autenticado | **`PARTIAL`** | Ejecutado localmente (`4 passed`, Sprint 2); omitido en CI (`MOBILE_PUBLIC_ONLY=1`). |
| Prueba de carga Locust (`NFR-01`, p95 < 300 ms a 50 tx) | **`NO VERIFICADO`** | Sin ejecución fechada ni artefacto en el repositorio. |
| Empaquetado Docker (`package`) y despliegue (`deploy`) en CI | **`NO VERIFICADO`** | No configurados en `.github/workflows/ci.yml` (`DEV-03`). |

---

## 4. Lista Clara de Dependencias para Backend y Frontend

### 4.1 Dependencias asignadas a Backend / DevOps (bloqueantes para cierre MVP)

1. **`DAT-03` — Desacople ORM y migración `014` (`S3-2` y `S3-3`):**
   - Retirar las 4 FKs cruzadas hacia `empresas.id` y las relaciones ORM cross-module en `app/models.py` según `ADR-006` (ya `Accepted`).
   - Implementar migración reversible `014_desacoplar_fks_tenancy_empresa_id.py` y ejecutar en PostgreSQL/CI `alembic upgrade head -> downgrade -1 -> upgrade head`.
2. **Snapshots históricos e identidad de producto — Migración `015` (`ADR-006`):**
   - Añadir `producto_nombre_snapshot`, `producto_codigo_snapshot` y `producto_unidad_snapshot` en `detalles_venta` con backfill y retirar `joinedload(DetalleVenta.producto)`.
   - Reemplazar `uq_producto_empresa_barras` por índice único parcial `WHERE is_active = true` y retirar reactivación implícita en `crear_producto()`.
3. **Validación de tenant vía fachada (`S3-4` y `S3-5`):**
   - Validar empresa activa mediante `AuthTenancyFacade.ensure_active_company()` con respuesta uniforme HTTP `404` y entregar `tests/module_integration/test_dat03_tenancy_isolation.py` + `test_migration_014_rollback.py`.
4. **`ARC-03` / `ARC-08` — Rutas por fachadas y blindaje `.importlinter` (`S4-1`..`S4-4`):**
   - Migrar los routers restantes (`auth`, `empresas`, `usuarios`, `productos`, `ventas`, `soporte`, `superadmin`, `agente`, `dashboard`, `reportes`) a las 6 fachadas públicas, eliminar imports directos a `app.services.*` y añadir regla en `.importlinter` con evidencia de fallo deliberado + recuperación.
5. **`OBS-02` / `OBS-03` y `DEV-01` / `DEV-03` (`S4-5`):**
   - Alinear `app/main.py` y `13-operations/observability.md` (métricas mínimas y política `HEALTH_REQUIRE_REDIS`).
   - Alinear `.github/workflows/ci.yml` y `10-devops/ci-cd.md` (stage `package` con `docker build` y flujo verificable de `deploy`).
6. **Evidencias pendientes de NFRs (`NFR-01`, `NFR-06`, contrato OpenAPI):**
   - Ejecutar corrida fechada de `tests/stress/locustfile.py` o acordar formalmente su alcance de sustentación.
   - Validar esquema `07-api/contracts/openapi/openapi-spec.yaml` contra `app.openapi()`.

### 4.2 Dependencias asignadas a Frontend / Diseño

1. **Coherencia con migración `015` (snapshots de ventas):**
   - Confirmar que la vista de historial (`Ventas.jsx`) renderice correctamente los campos de snapshot sin depender de un producto activo en catálogo cuando backend retire `joinedload(DetalleVenta.producto)`.
2. **Cobertura CI del recorrido móvil autenticado (`360 × 800`):**
   - Actualmente CI corre `MOBILE_PUBLIC_ONLY=1` (`3 passed, 1 skipped`); coordinar con backend si se habilita corrida autenticada en CI o se conserva captura fechada local para la sustentación.
3. **Evidencia visual de la Demo Tendero (`GUIA_DEMO_TENDERO_MVP.md`):**
   - Capturar evidencia visual (pantallazos o video corto con datos sintéticos no productivos) del recorrido completo en entorno limpio antes de la sustentación.
4. **Alcance congelado:**
   - Mantener congelado Flutter/offline-first (`ADR-005`) y no añadir nuevas funcionalidades fuera de estabilización MVP.

---

**Referencias cruzadas:** [`./INFORME_AUDITORIA_MVP_2026-11-21.html`](./INFORME_AUDITORIA_MVP_2026-11-21.html) · [`./GUIA_DEMO_TENDERO_MVP.md`](./GUIA_DEMO_TENDERO_MVP.md) · [`../IA_BITACORA.md`](../IA_BITACORA.md) · [`../../04-requirements/traceability-matrix.md`](../../04-requirements/traceability-matrix.md)
