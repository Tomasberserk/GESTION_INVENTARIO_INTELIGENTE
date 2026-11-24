# Plan de Recuperación y Estabilización MVP — Gestión Neiva (Auditoría Gemini QA)

- **Fecha:** 2026-11-21
- **Autor de análisis y propuesta:** Gemini / Antigravity Neon (Co-arquitecto y Auditor QA)
- **Ejecutor vigente (decisión del equipo, 2026-11-21):** Antigravity. Toda asignación previa de `Claude implementación` o `Claude (ejecución)` en las tablas de este plan se entiende sustituida por `Antigravity`, sin alterar el alcance, las dependencias ni las verificaciones.
- **Base documental:** `docs/audits/INFORME_AUDITORIA_MVP_2026-11-21.html`, `AGENTS.md`, `GEMINI.md`, `PLAN_ACTIVO.md`, `02-domain/module-boundaries.md`, `05-architecture/*`, `06-data/*`, `10-devops/*`, `11-quality/*`, `13-operations/*`, `.github/workflows/ci.yml`, `.importlinter`, `requirements.txt` y código en `app/`.
- **Orden estratégico aprobado:** `Evidencia reproducible → Web móvil → DAT-03 → Rutas por fachadas → Sustentación`.
- **Exclusiones estrictas de alcance (CONGELADO):** NO iniciar desarrollo Flutter ni arquitectura offline-first (`ADR-005`), NO añadir funcionalidades nuevas de negocio, NO exponer `.env`, NO tocar producción ni crear cuentas reales.

> **Nota metodológica de veracidad:** En esta sesión no se editó código de producción ni se ejecutaron suites de pruebas ni despliegues. Todo control cuya ejecución no se verificó directamente en un entorno limpio se marca explícitamente como **NO VERIFICADO**.

---

## 1. Métricas de Salida Obligatorias (Criterios de Aprobación del MVP)

| # | Dimensión | Métrica de salida obligatoria | Estado actual (2026-11-21) | Sprint que la cierra |
|---|---|---|---|---|
| M1 | Suite crítica `pytest` | 100% de pruebas críticas pasan en entorno limpio reproducible | **NO VERIFICADO** (bloqueo local `TestClient`/Python 3.13.2 reportado en auditoría) | Sprint 0 → Sprint 1 |
| M2 | Cobertura de código (`NFR-07`) | `>= 80%` global en `app/` y `>= 90%` en `app/pos_ventas` con artefacto XML/HTML | **NO VERIFICADO** (`pytest-cov` ausente en `requirements.txt` y CI) | Sprint 0 → Sprint 1 (revalidado en Sprint 4) |
| M3 | Fronteras modulares (`ARC-05`/`ARC-06`) | `lint-imports` con **0 violaciones** cubriendo los 6 módulos + `platform` + routers | **NO VERIFICADO** (falta contrato `reportes_analytics` y paquete no instalado en `.venv` corrupto) | Sprint 0 → Sprint 4 |
| M4 | Aislamiento de datos (`DAT-03`) | **0 FKs físicas entre módulos**; las **3 FKs internas** conservadas; validación de tenancy por fachadas | **NO CONFORME** (4 FKs cruzadas activas hacia `empresas.id`) | Sprint 3 |
| M5 | Migraciones reversibles | `alembic upgrade head` → `alembic downgrade -1` → `alembic upgrade head` verificados en PostgreSQL de prueba | **NO VERIFICADO** | Sprint 0 (base) → Sprint 3 (migración 014) |
| M6 | Web móvil responsive (`NFR-10`) | **0 px de scroll horizontal** a `360 px` y controles táctiles interactivos `>= 48 × 48 px` en flujos públicos y autenticados | **PARCIAL / NO VERIFICADO** (44–45 px en vistas públicas; vistas autenticadas **NO VERIFICADO**) | Sprint 2 |
| M7 | Recorrido tendero E2E | Registro → Login → Producto → Venta → Descuento de stock → Dashboard → Logout pasando en entorno reproducible | **PARCIAL / NO VERIFICADO** (test E2E actual omite login independiente, verificación de stock y logout) | Sprint 1 (revalidado en Sprint 4) |
| M8 | Pipeline CI (`DEV-01`/`DEV-03`) | `lint` → `boundary-check` → `test` con cobertura → `package` → `deploy` documentado y alineado | **NO CONFORME** (`ci.yml` omite `ruff`, cobertura, migraciones, `package` y `deploy`) | Sprint 0 → Sprint 4 |
| M9 | Hallazgos críticos de auditoría | **0 hallazgos críticos abiertos** (`DAT-03`, `ARC-03`/`ARC-08`) y evidencia fechada archivada antes de sustentar | **2 CRÍTICOS ABIERTOS** | Sprint 4 |

---

## 2. Roadmap Detallado de Cinco Sprints

### Sprint 0 — Entorno reproducible y compuertas de calidad

**Objetivo:** Eliminar la no-reproducibilidad del entorno local (`.venv` copiado desde `GESTION_NEIVA_CLAUDE` bajo Python 3.13.2) y convertir las compuertas declaradas en `10-devops/ci-cd.md` y `.importlinter` en controles ejecutables reales.

- **Alcance:**
  - Recreación limpia del entorno virtual en Python 3.12 (alineado con `.github/workflows/ci.yml` y `10-devops/local-setup.md`) dentro del checkout real `GESTION_INVENTARIO_INTELIGENTE`.
  - Congelamiento de dependencias de QA faltantes (`pytest-cov`, compatibilidad `httpx`/`fastapi`/`pytest` en Python 3.12).
  - Cierre de brecha en `.importlinter` añadiendo el contrato `reportes-analytics-internals-are-private`.
  - Actualización de `.github/workflows/ci.yml` para ejecutar `ruff check app`, `python -m compileall -q app tests`, `lint-imports`, `pytest --cov` (artefactos XML/HTML) y etapa `package` (`docker build`).
  - Saneamiento del árbol Git (decidir resguardo/limpieza de `frontend/dist/index.html` y cambios no confirmados previos).
- **No alcance:**
  - No refactorizar routers ni fachadas todavía.
  - No modificar `app/models.py` ni crear migraciones de negocio (DAT-03 corresponde a Sprint 3).
  - No tocar UI móvil ni iniciar Flutter.

#### Tareas atómicas — Sprint 0

| ID | Tarea atómica | Archivo / Área | Responsable sugerido | Dependencia | Riesgo | Comando exacto de verificación | Criterio de salida medible |
|---|---|---|---|---|---|---|---|
| S0-1 | Verificar y sanear estado de Git (resguardar `frontend/dist/index.html` y confirmar si `dist/` debe quedar fuera de tracking) | `.gitignore`, `frontend/dist/index.html` | Antigravity implementación | Ninguna | Bajo — pérdida de cambios locales si no se respalda antes | `git status --short` | Árbol limpio o solo cambios intencionales aprobados del Sprint 0 |
| S0-2 | Recrear `.venv` desde cero con Python 3.12 en el directorio actual e instalar `requirements.txt` | `.venv/`, `requirements.txt` | Claude implementación | S0-1 | Medio — incompatibilidad de wheels en Windows si no existe Python 3.12 instalado | `.\.venv\Scripts\python.exe --version && .\.venv\Scripts\python.exe -c "import sys; print(sys.prefix)"` | Salida muestra `Python 3.12.x` y `sys.prefix` apunta a `...\GESTION_INVENTARIO_INTELIGENTE\.venv` |
| S0-3 | Agregar `pytest-cov` (y fijar compatibilidad `httpx`/`pytest` si se reproduce bloqueo `TestClient`) en `requirements.txt` y validar instalación limpia | `requirements.txt` | Trabajador de boilerplate | S0-2 | Medio — regresión en `tests/conftest.py` si cambia API de `httpx` | `.\.venv\Scripts\pytest.exe --version && .\.venv\Scripts\pytest.exe --help \| Select-String "cov-fail-under"` | `pytest` reconoce `--cov` y `--cov-fail-under` sin error de argumento |
| S0-4 | Agregar contrato faltante `reportes-analytics-internals-are-private` en `.importlinter` y ejecutar verificación | `.importlinter` | Trabajador de boilerplate | S0-2 | Bajo — posible violación latente si algún archivo ya importa `reportes_analytics.internal` | `.\.venv\Scripts\lint-imports.exe` | Exit code `0`; 7 contratos reportados como `KEPT` |
| S0-5 | Ejecutar línea base real de `ruff`, `compileall`, `pytest tests/unit`, `npm run test:voice` y `npm run build` | `app/`, `tests/`, `frontend/` | Gemini QA (verificación) / Claude (ejecución) | S0-3, S0-4 | Medio — hallazgos de lint existentes en `app/` que requieran limpieza mínima | `.\.venv\Scripts\ruff.exe check app && .\.venv\Scripts\python.exe -m compileall -q app tests && cd frontend && npm run test:voice && npm run build` | Exit code `0` en todos los comandos y artefacto de log fechado guardado |
| S0-6 | Actualizar `.github/workflows/ci.yml` con stages `lint` (`ruff` + `compileall`), `boundary-check` (`lint-imports`), `test` (con `--cov=app --cov-report=xml --cov-report=term-missing` y servicio PostgreSQL para migraciones), `package` (`docker build`) y trigger de release tag | `.github/workflows/ci.yml` | Claude implementación | S0-3, S0-4 | Medio — el job `test` fallará si la cobertura actual es `<80%` (ver nota de compuerta gradual hasta Sprint 1) | `python -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"` + corrida en GitHub Actions | YAML válido y workflow verde en PR con artefacto `coverage.xml` subido |

- **Paralelismo vs secuencia:**
  - *Secuenciales estrictas:* `S0-1 → S0-2 → S0-3 → S0-5`.
  - *Paralizables:* `S0-4` (`.importlinter`) puede redactarse en paralelo con `S0-3` (`requirements.txt`), y la validación de frontend (`npm run test:voice` / `npm run build`) puede correr en paralelo a `S0-4`.
- **Riesgo de conflicto entre archivos:** Bajo. Archivos disjuntos (`requirements.txt`, `.importlinter`, `.github/workflows/ci.yml`).
- **Evidencia mínima para aprobar Sprint 0:**
  1. Salida fechada de `python --version` (`3.12.x`) y `.venv/pyvenv.cfg` apuntando al checkout actual.
  2. Salida de `lint-imports` con 7/7 contratos `KEPT`.
  3. Reporte inicial real de `pytest --cov=app` (línea base medible, sin maquillar cifras).
  4. Corrida exitosa en CI o validación sintáctica + build Docker local de `Dockerfile`.

---

### Sprint 1 — Recorrido tendero y cobertura

**Objetivo:** Desbloquear la suite completa de backend (94+ pruebas), garantizar el recorrido completo del tendero (registro → login → producto → venta → descuento de stock → dashboard → logout) contra base de datos real (PostgreSQL de prueba y suite estándar) y alcanzar `>= 80%` de cobertura global y `>= 90%` en `pos_ventas`.

- **Alcance:**
  - Diagnóstico y resolución del bloqueo de `TestClient(app)` en entorno Windows/CI.
  - Ampliación de `tests/end_to_end/test_store_journey_e2e.py` para cubrir el flujo tendero completo exigido: registro de tienda, login explícito (`POST /api/v1/token`), creación de producto, registro de venta, verificación de descuento exacto de stock en `GET /api/v1/productos`, lectura de métricas en `GET /api/v1/dashboard/{empresa_id}`, creación/consulta de ticket de soporte y cierre de sesión / rechazo de acceso posterior sin token válido.
  - Análisis y cierre de brechas de cobertura en `app/` hasta superar `>= 80%` global y `>= 90%` en `app/pos_ventas` (y `app/services/venta_service.py` mientras siga activo antes de Sprint 4).
  - Corrección de desalineaciones de comportamiento detectadas en auditoría de ventas: ordenamiento determinista de `producto_id` antes de `SELECT ... FOR UPDATE` (según `ADR-003`) y alineación del código HTTP de stock insuficiente (`400` vs `422`, previa decisión humana).
  - Activación de compuertas estrictas `--cov-fail-under=80` global y `>= 90%` en `pos_ventas` en `.github/workflows/ci.yml`.
- **No alcance:**
  - No cambiar FKs de base de datos (Sprint 3).
  - No migrar los 10 routers a fachadas aún (Sprint 4).
  - No agregar nuevas funcionalidades de negocio ni pasarelas de pago.

#### Tareas atómicas — Sprint 1

| ID | Tarea atómica | Archivo / Área | Responsable sugerido | Dependencia | Riesgo | Comando exacto de verificación | Criterio de salida medible |
|---|---|---|---|---|---|---|---|
| S1-1 | Ejecutar la suite completa actual en el `.venv` Python 3.12 y diagnosticar cualquier hang/fallo de `TestClient` o `conftest.py` | `tests/conftest.py`, `tests/` | Claude implementación | S0-2, S0-3 | Alto — `TestClient` colgado en Windows bloquea toda evidencia E2E | `.\.venv\Scripts\pytest.exe tests/ -q --timeout=30` (o timeout por test) | 100% de pruebas críticas recolectadas terminan sin hang ni crash |
| S1-2 | Extender `tests/end_to_end/test_store_journey_e2e.py` para cubrir el recorrido tendero completo: registro → login → crear producto → vender → verificar descuento de stock → verificar dashboard → logout / 401 sin token | `tests/end_to_end/test_store_journey_e2e.py` | Claude implementación | S1-1 | Bajo — dependencia de decisión sobre endpoint `/logout` vs limpieza cliente | `.\.venv\Scripts\pytest.exe tests/end_to_end/test_store_journey_e2e.py -v` | 100% de aserciones del recorrido tendero en verde |
| S1-3 | Ejecutar prueba de integración y concurrencia real en PostgreSQL de prueba (`docker compose` Postgres) + `alembic upgrade head` | `tests/integration/postgres/`, `docker-compose.yml` | Claude implementación | S1-1 | Medio — requiere instancia PostgreSQL de prueba local o contenedor CI | `.\.venv\Scripts\pytest.exe tests/integration/postgres/ -v` | 100% de pruebas de concurrencia PostgreSQL pasando sin `db_lock` artificial |
| S1-4 | Alinear orden determinista por `producto_id` antes de `SELECT ... FOR UPDATE` en `venta_service.registrar_venta` (ADR-003) y confirmar/alinear HTTP status de stock insuficiente con decisión humana | `app/services/venta_service.py`, `app/inventario/internal/service.py`, `tests/` | Claude implementación | S1-1 + Decisión humana #4 | Medio — puede requerir ajustar tests que esperen `400` si se adopta `422` | `.\.venv\Scripts\pytest.exe tests/test_concurrencia_real.py tests/module_integration/ -v` | Pruebas de concurrencia y fachadas 100% verdes y alineadas con ADR-003 |
| S1-5 | Identificar módulos bajo umbral de cobertura y redactar pruebas unitarias/integración faltantes para alcanzar `>= 80%` global y `>= 90%` en `pos_ventas` | `tests/unit/`, `tests/module_integration/` | Trabajador de boilerplate + Claude implementación | S1-1 | Medio — código muerto o ramas no alcanzables en `app/services/agente/` pueden bajar cobertura global | `.\.venv\Scripts\pytest.exe tests/ --cov=app --cov-report=term-missing --cov-fail-under=80 && .\.venv\Scripts\pytest.exe tests/ --cov=app/pos_ventas --cov-fail-under=90` | Cobertura global `>= 80%` y `app/pos_ventas >= 90%` verificadas con exit code `0` |
| S1-6 | Activar los dos umbrales bloqueantes de cobertura (`80%` global y `90%` `pos_ventas`) y publicación de reportes XML/HTML en `.github/workflows/ci.yml` | `.github/workflows/ci.yml` | Claude implementación | S1-5 | Bajo | Validación en corrida real de GitHub Actions | Job CI falla si cobertura baja de 80%/90% y adjunta artefactos XML/HTML |
| S1-7 | Auditoría QA de resultados de Sprint 1 (verificar que ninguna prueba crítica fue saltada con `skip`/`xfail` injustificado) | `tests/`, reporte cobertura | Gemini QA | S1-2..S1-6 | Bajo | Revisión de `pytest -rs` y `coverage.xml` | 0 skips injustificados; evidencia archivada en `docs/IA_BITACORA.md` |

- **Paralelismo vs secuencia:**
  - *Secuenciales estrictas:* `S1-1 → S1-2 / S1-3 / S1-4 → S1-5 → S1-6 → S1-7`.
  - *Paralizables:* Una vez completado `S1-1`, `S1-2` (E2E) y `S1-3` (Postgres concurrencia) pueden avanzar en paralelo.
- **Riesgo de conflicto entre archivos:** Medio en `tests/` y `app/services/venta_service.py` si `S1-4` y `S1-5` se editan simultáneamente — ejecutar `S1-4` antes de `S1-5`.
- **Evidencia mínima para aprobar Sprint 1:**
  1. Log de `pytest tests/ -q` con 100% de pruebas críticas pasando.
  2. Artefactos `coverage.xml` y reporte por paquete demostrando `>= 80%` en `app/` y `>= 90%` en `app/pos_ventas`.
  3. Log de `test_store_journey_e2e.py` y `run_e2e_simulation.py` pasando en verde.
  4. Log de `tests/integration/postgres/` pasando contra PostgreSQL real.

---

### Sprint 2 — Web móvil responsive

**Objetivo:** Garantizar cumplimiento estricto de `NFR-10` y `UX-02` en la aplicación web React actual: cero scroll horizontal a `360 px` de ancho y controles táctiles interactivos `>= 48 × 48 px` tanto en páginas públicas como en todo el recorrido autenticado del tendero, con prueba automatizada reproducible.

- **Alcance:**
  - Corrección de altura mínima `>= 48 px` (`min-h-[48px]` / `h-12`) en CTA superior "Crear cuenta", enlaces de navegación móvil, botones y campos `<input>`/`<select>` en `LandingPage.jsx`, `Login.jsx` y `Registro.jsx`.
  - Auditoría y corrección responsive a `360 × 800` de todas las vistas autenticadas del flujo tendero: `Layout.jsx`, `Header.jsx`, `Sidebar.jsx`, `Dashboard.jsx`, `Inventario.jsx`, `ProductoCard.jsx`, `ModalProducto.jsx`, `CartSidebar.jsx`, `Ventas.jsx`, `Soporte.jsx`.
  - Verificación de estados vacío, carga y error en móvil a `360 px`.
  - Adición de prueba automatizada Playwright/Chromium al breakpoint `360 × 800` verificando `document.documentElement.scrollWidth <= 360` y `boundingBox.height >= 48` en controles interactivos clave.
  - Verificación de `npm run build` limpio y auditoría Lighthouse accesibilidad `>= 90`.
- **No alcance:**
  - **NO iniciar Flutter ni offline-first (`ADR-005`).**
  - No migrar frontend a TypeScript (regla activa del repo: JSX puro).
  - No rediseñar identidad visual ni cambiar copy aprobado en Sprint 10.

#### Tareas atómicas — Sprint 2

| ID | Tarea atómica | Archivo / Área | Responsable sugerido | Dependencia | Riesgo | Comando exacto de verificación | Criterio de salida medible |
|---|---|---|---|---|---|---|---|
| S2-1 | Corregir tamaño táctil `>= 48 px` en vistas públicas (`LandingPage.jsx` CTA "Crear cuenta" 44px → >=48px; inputs y botones en `Login.jsx` y `Registro.jsx` 45px → >=48px) | `frontend/src/pages/LandingPage.jsx`, `Login.jsx`, `Registro.jsx`, `frontend/src/styles/landing.css` | Claude implementación | S0-5 | Bajo — revisar alineación vertical del header sticky | `cd frontend && npm run build` + script de medición DOM a 360×800 | Todos los CTA, links primarios e inputs en `/`, `/login`, `/registro` miden `>= 48 px` de alto y `scrollWidth <= 360` |
| S2-2 | Auditar y corregir responsive `360 px` y targets `>= 48 px` en shell de app (`Layout.jsx`, `Header.jsx`, `Sidebar.jsx`) y POS/Carrito (`CartSidebar.jsx`, `Ventas.jsx`) | `frontend/src/components/layout/*`, `CartSidebar.jsx`, `pages/Ventas.jsx` | Claude implementación | S2-1 | Medio — posible solape con `AgentWidget`/`MostradorMode` (verificar z-index) | `cd frontend && npm run test:voice && npm run build` | 0 overflow horizontal a 360 px; botones de carrito/cobro/navegación `>= 48 × 48 px`; FSM voz 4/4 intacto |
| S2-3 | Auditar y corregir responsive `360 px` y targets `>= 48 px` en inventario y analítica (`Inventario.jsx`, `ProductoCard.jsx`, `ModalProducto.jsx`, `Dashboard.jsx`, `Soporte.jsx`) | `frontend/src/pages/Inventario.jsx`, `Dashboard.jsx`, `Soporte.jsx`, `components/ProductoCard.jsx`, `ModalProducto.jsx` | Claude implementación | S2-2 | Medio — tablas/gráficas Recharts pueden desbordar a 360 px si falta `min-w-0` / `overflow-x-auto` en contenedor interno | `cd frontend && npm run build` | 0 overflow horizontal global (`scrollWidth <= 360`) en Dashboard, Inventario, ModalProducto y Soporte; controles `>= 48 px` |
| S2-4 | Crear prueba automatizada de regresión móvil (`360 × 800`) cubriendo rutas públicas y recorrido tendero autenticado (registro/login/producto/venta/dashboard/logout en entorno de prueba local) | `frontend/tests/mobile/viewport_360.spec.*` (o script Playwright en `tests/`) | Trabajador de boilerplate + Claude implementación | S1-2, S2-3 | Medio — requiere levantar backend + frontend locales de prueba | Comando de script Playwright/Chromium a `360x800` (definido al crear el spec) | 100% de pantallas verificadas con `scrollWidth <= 360` y controles interactivos `>= 48 px`; capturas archivadas |
| S2-5 | Ejecutar auditoría Lighthouse (móvil) y revisión QA visual de estados vacío/carga/error en `360 × 800` | `frontend/`, artefactos QA | Gemini QA | S2-4 | Bajo | Corrida Lighthouse CLI / Chrome DevTools en build preview (`vite preview`) | Accesibilidad Lighthouse `>= 90`; 0 defectos críticos UX-02/NFR-10 abiertos |

- **Paralelismo vs secuencia:**
  - *Secuenciales estrictas:* `S2-1 → S2-4 → S2-5`.
  - *Paralizables:* `S2-2` (shell + POS) y `S2-3` (Inventario + Dashboard + Soporte) editan archivos distintos y pueden implementarse en paralelo tras `S2-1`.
- **Riesgo de conflicto entre archivos:** Bajo entre `S2-2` y `S2-3` si no comparten cambios en `index.css`; coordinar cualquier clase utilitaria global en `frontend/src/index.css` primero.
- **Evidencia mínima para aprobar Sprint 2:**
  1. Salida verde del test automatizado a `360 × 800` reportando `scrollWidth <= 360` y alturas `>= 48 px`.
  2. Capturas fechadas en `360 × 800` (públicas + autenticadas con datos de prueba no productivos).
  3. Reporte Lighthouse de accesibilidad `>= 90` y `npm run build` + `npm run test:voice` en verde.

---

### Sprint 3 — DAT-03: aislamiento de tenancy mediante UUID + fachadas

**Objetivo:** Cerrar definitivamente el hallazgo crítico **DAT-03**, garantizando **cero FKs físicas entre módulos** en PostgreSQL y `app/models.py`, conservando las **3 FKs internas**, respaldando la decisión en un nuevo **ADR-006** (sin tocar ADRs aceptados), una migración Alembic `014` reversible y pruebas exhaustivas de aislamiento y rollback. *(Ver análisis completo en Sección 3).*

- **Alcance:**
  - Redacción de **ADR-006** (`05-architecture/decisions/records/ADR-006-aislamiento-tenancy-uuid-fachadas.md`) e indexación en `05-architecture/decisions/README.md` (sin editar ADR-001..004).
  - Refactor de `app/models.py`: eliminar `ForeignKey("empresas.id")` en `Producto`, `Venta`, `SoporteTicket` y `AgentCommand`; retirar las 4 relaciones `cascade="all, delete-orphan"` cruzadas en `Empresa` y sus contrapartes `.empresa`; endurecer relaciones cruzadas heredadas con `viewonly=True`.
  - Migración reversible `alembic/versions/014_desacoplar_fks_tenancy_empresa_id.py` (`upgrade` + `downgrade`) verificada en PostgreSQL de prueba.
  - Garantizar validación explícita de tenant activo mediante `AuthTenancyFacade.ensure_active_company()` en todos los puntos de escritura cross-module (`inventario`, `pos_ventas`, `soporte_crm`, `agente_ia`).
  - Pruebas automatizadas de aislamiento multi-tenant, rechazo de `empresa_id` inexistente/inactivo, preservación de FKs internas y verificación de rollback de migración `014`.
  - Actualización sincronizada de `02-domain/module-boundaries.md`, `06-data/models.md`, `06-data/database-conventions.md` y `06-data/migrations.md`.
- **No alcance:**
  - No eliminar FKs internas (`usuarios.empresa_id`, `detalles_venta.venta_id`, `soporte_mensajes.ticket_id`).
  - No editar ADR-001, ADR-002, ADR-003 ni ADR-004 ya aceptados.
  - No migrar todavía todos los endpoints de `app/routers/` (eso corresponde a Sprint 4, aunque los puntos de escritura de Sprint 3 sí invocarán `AuthTenancyFacade`).

#### Tareas atómicas — Sprint 3

| ID | Tarea atómica | Archivo / Área | Responsable sugerido | Dependencia | Riesgo | Comando exacto de verificación | Criterio de salida medible |
|---|---|---|---|---|---|---|---|
| S3-1 | Crear `ADR-006-aislamiento-tenancy-uuid-fachadas.md` (estado `Proposed` → `Accepted` tras aprobación humana) e indexarlo en `05-architecture/decisions/README.md` sin editar ADR-001..004 | `05-architecture/decisions/records/ADR-006-...md`, `05-architecture/decisions/README.md` | Claude implementación (con revisión Gemini QA) | Decisión humana #1 | Bajo | `git diff 05-architecture/decisions/records/ADR-001* ADR-002* ADR-003* ADR-004*` | 0 líneas modificadas en ADR-001..004; ADR-006 creado con formato canónico |
| S3-2 | Actualizar `app/models.py`: quitar `ForeignKey("empresas.id")` en `Producto`, `Venta`, `SoporteTicket`, `AgentCommand`; retirar relaciones/cascades cruzados de `Empresa`; agregar `viewonly=True` en relaciones cruzadas heredadas (`Usuario.ventas`, `Venta.usuario`, `Producto.detalles_venta`, `DetalleVenta.producto`) | `app/models.py` | Claude implementación | S3-1, S1-1 | Alto — riesgo de `NoForeignKeysError` o rotura de `joinedload`/tests de modelos | `.\.venv\Scripts\pytest.exe tests/test_fase1_rbac_modelos.py tests/unit/ -v` + script introspector de `Base.metadata` | `Base.metadata` reporta exactamente 3 FKs (todas internas) y 0 FKs cruzadas; mappers inicializan sin error |
| S3-3 | Crear migración reversible `alembic/versions/014_desacoplar_fks_tenancy_empresa_id.py` (drop defensivo de las 4 FKs cruzadas, aseguramiento de índices `empresa_id` y `downgrade()` completo) | `alembic/versions/014_desacoplar_fks_tenancy_empresa_id.py` | Claude implementación | S3-2 | Alto — en migraciones 006 y 010 las FKs no tuvieron nombre explícito; requiere drop defensivo en PostgreSQL | `alembic upgrade head && alembic downgrade -1 && alembic upgrade head` (sobre PostgreSQL de prueba) | Upgrade, downgrade y re-upgrade concluyen con exit code `0` y consulta `pg_constraint` muestra 0 FKs cruzadas tras `upgrade` |
| S3-4 | Enforzar validación de `empresa_id` vía `AuthTenancyFacade.ensure_active_company()` en puntos de escritura cross-module (`producto_service`, `venta_service`, `soporte`, `agent_orchestrator`, `dependencies.py`) | `app/services/producto_service.py`, `venta_service.py`, `app/routers/soporte.py`, `app/services/agente/agent_orchestrator.py`, `app/dependencies.py` | Claude implementación | S3-2 | Alto — regresiones en flujos de escritura si la sesión o excepciones HTTP cambian | `.\.venv\Scripts\pytest.exe tests/ -q` | 100% de pruebas existentes pasan y toda escritura con `empresa_id` inexistente/inactiva rechaza con 404/403 |
| S3-5 | Crear suite de pruebas DAT-03: introspección de esquema (0 FKs cruzadas, 3 FKs internas presentes), rechazo de `empresa_id` inexistente/inactivo en los 4 módulos consumidores, no-cascada destructiva desde `Empresa`, y test de rollback de migración 014 en Postgres | `tests/module_integration/test_dat03_tenancy_isolation.py`, `tests/integration/postgres/test_migration_014_rollback.py` | Trabajador de boilerplate + Claude implementación | S3-3, S3-4 | Medio — el test de migración requiere BD PostgreSQL de prueba dedicada | `.\.venv\Scripts\pytest.exe tests/module_integration/test_dat03_tenancy_isolation.py tests/integration/postgres/test_migration_014_rollback.py -v` | 100% de pruebas de aislamiento y rollback pasan |
| S3-6 | Sincronizar documentación de datos (`02-domain/module-boundaries.md`, `06-data/models.md`, `06-data/database-conventions.md`, `06-data/migrations.md`) con ADR-006 y migración 014 | `02-domain/`, `06-data/` | Gemini QA / Trabajador de boilerplate | S3-3, S3-5 | Bajo | Revisión cruzada `app/models.py` vs `06-data/models.md` | Cero contradicciones entre modelo físico, migraciones 001–014 y docs |

- **Paralelismo vs secuencia:**
  - *Secuenciales estrictas:* `S3-1 → S3-2 → S3-3 → S3-5` y `S3-2 → S3-4 → S3-5 → S3-6`.
  - *Paralizables:* `S3-3` (migración 014) y `S3-4` (validación por fachadas en escritura) pueden ejecutarse en paralelo una vez estabilizado `S3-2` (`app/models.py`).
- **Riesgo de conflicto entre archivos:** Alto en `app/models.py` (centralizar en `S3-2` antes de abrir `S3-3`/`S3-4`). Bajo entre `S3-3` (`alembic/versions/`) y `S3-4` (`app/services/`).
- **Evidencia mínima para aprobar Sprint 3:**
  1. `ADR-006` publicado sin cambios en `ADR-001..004`.
  2. Salida SQL de `pg_constraint` en PostgreSQL de prueba listando exactamente 3 FKs (internas) y 0 FKs cruzadas.
  3. Log de `alembic upgrade head` → `alembic downgrade -1` → `alembic upgrade head` en verde.
  4. Suite `test_dat03_tenancy_isolation.py` + `pytest tests/` + `lint-imports` en verde.

---

### Sprint 4 — Rutas por fachadas y cierre de sustentación

**Objetivo:** Cerrar el segundo hallazgo crítico (**ARC-03 / ARC-08**) haciendo que las fachadas modulares sean el único borde operativo real para los 10 routers, blindar `.importlinter` contra regresión a `app/services/`, cerrar las brechas mayores de observabilidad y CI (`OBS-02`/`OBS-03`, `DEV-01`/`DEV-03`, `DOC-12`), y producir el paquete auditable de sustentación.

- **Alcance:**
  - Migración incremental por módulo de los 10 routers de `app/routers/` hacia las 6 fachadas públicas (`AuthTenancyFacade`, `InventarioFacade`, `VentasFacade`, `SoporteCrmFacade`, `AgenteIaFacade`, `ReportesFacade`), moviendo lógica interna desde `app/services/` hacia `app/<modulo>/internal/` (o dejando shims deprecados temporalmente solo si algún test legado importa el símbolo, sin bypass desde routers).
  - Eliminación del stub `_ = VentasFacade` en `app/reportes_analytics/internal/service.py` y migración de `dashboard.py` y `reportes.py` a `ReportesFacade`.
  - Incorporación en `.importlinter` de contrato que prohíba a `app.routers` importar `app.*.internal` y `app.services`.
  - Cierre de `OBS-02`/`OBS-03` (instrumentación ligera de métricas `http_requests_total`, `http_request_duration_seconds`, `sales_completed_total` o ajuste explícito en `13-operations/observability.md`, más política consistente de Redis en `/health`).
  - Cierre de `DEV-01`/`DEV-03` (alineación final entre `.github/workflows/ci.yml` y `10-devops/ci-cd.md`: `lint → boundary-check → test con cobertura → package → deploy documentado`).
  - Cierre de `DOC-12` (`00-sdd-guide.md`, `07-api/README.md`, cifras de tests solo con evidencia recién ejecutada).
  - Paquete de sustentación: demo deliberada de fallo/recuperación de `import-linter`, evidencia Locust (`NFR-01`) si aplica, cobertura final `>=80%`/`>=90%` y recorrido tendero grabado/documentado.
- **No alcance:**
  - No iniciar Flutter/offline-first ni pasarela de pagos Wompi/billing (Sprint 9/11 posterior).
  - No cambiar contratos HTTP `/api/v1/*` hacia el frontend (preservar compatibilidad 100%).

#### Tareas atómicas — Sprint 4

| ID | Tarea atómica | Archivo / Área | Responsable sugerido | Dependencia | Riesgo | Comando exacto de verificación | Criterio de salida medible |
|---|---|---|---|---|---|---|---|
| S4-1 | Ampliar `AuthTenancyFacade` y migrar routers `auth.py`, `empresas.py`, `usuarios.py` (y parte empresas de `superadmin.py`) a la fachada, moviendo lógica interna a `app/auth_tenancy/internal/` | `app/auth_tenancy/*`, `app/routers/auth.py`, `empresas.py`, `usuarios.py` | Claude implementación | S3-5 | Medio — afecta autenticación JWT, entitlements y RBAC | `.\.venv\Scripts\pytest.exe tests/test_auth.py tests/test_entitlements_trial.py tests/test_fase2_backend_rbac.py tests/test_owasp_security.py -v` | 100% verde; 0 imports de `app.services` en `auth.py`, `empresas.py`, `usuarios.py` |
| S4-2 | Ampliar `InventarioFacade` y `VentasFacade` y migrar `productos.py` y `ventas.py`, retirando la delegación inversa `pos_ventas.internal -> app.services.venta_service` | `app/inventario/*`, `app/pos_ventas/*`, `app/routers/productos.py`, `ventas.py` | Claude implementación | S4-1 | Alto — núcleo transaccional `SELECT FOR UPDATE` y cobertura `>=90%` en `pos_ventas` | `.\.venv\Scripts\pytest.exe tests/ --cov=app/pos_ventas --cov-fail-under=90` | 100% verde; `pos_ventas >= 90%` cobertura; 0 imports de `app.services` en `productos.py` y `ventas.py` |
| S4-3 | Ampliar `SoporteCrmFacade`, `AgenteIaFacade` y `ReportesFacade` y migrar `soporte.py`, `superadmin.py`, `agente.py`, `dashboard.py`, `reportes.py` | `app/soporte_crm/*`, `app/agente_ia/*`, `app/reportes_analytics/*`, `app/routers/soporte.py`, `superadmin.py`, `agente.py`, `dashboard.py`, `reportes.py` | Claude implementación | S4-2 | Alto — `agente_ia` tiene 280 casos de benchmark y 13+ pruebas adversariales | `.\.venv\Scripts\pytest.exe tests/test_soporte_crm.py tests/test_agente_produccion.py tests/test_agente_rbac_reabastecer.py tests/test_business_understanding_benchmark.py -v` | 100% verde; `ReportesFacade` real (sin stub); 0 queries SQLAlchemy directas en `app/routers/` |
| S4-4 | Endurecer `.importlinter` prohibiendo `app.routers -> app.*.internal` y `app.routers -> app.services`; ejecutar demo deliberada de violación (fallo -> revert -> verde) | `.importlinter`, evidencia en `docs/IA_BITACORA.md` | Gemini QA + Claude implementación | S4-3 | Bajo — revela cualquier importación fugada al instante | `.\.venv\Scripts\lint-imports.exe` | 0 violaciones en estado final; log guardado de violación deliberada bloqueada |
| S4-5 | Cerrar `OBS-02`/`OBS-03` (métricas mínimas y política `HEALTH_REQUIRE_REDIS`) y `DEV-01`/`DEV-03` (alineación final `ci.yml` ↔ `10-devops/ci-cd.md`) | `app/main.py`, `app/core/`, `13-operations/observability.md`, `.github/workflows/ci.yml`, `10-devops/ci-cd.md` | Claude implementación | S4-3 + Decisión humana #3 | Bajo | `.\.venv\Scripts\pytest.exe tests/ -k "health or logging"` + revisión CI | Cero contradicciones entre código y `observability.md` / `ci-cd.md` |
| S4-6 | Cerrar `DOC-12` (`00-sdd-guide.md`, `07-api/README.md`, `06-data/README.md`, `PLAN_ACTIVO.md`) y verificar con corrida integral final (pytest + cobertura 80/90 + lint-imports + migraciones + móvil 360 + Locust si aplica) | `00-sdd-guide.md`, `07-api/README.md`, `docs/IA_BITACORA.md`, `docs/audits/` | Gemini QA | S4-4, S4-5 | Bajo | Corrida completa del pipeline local y CI | 0 hallazgos críticos abiertos; todos los artefactos fechados y trazables a HU/NFR/TC |

- **Paralelismo vs secuencia:**
  - *Secuenciales estrictas:* `S4-1 → S4-2 → S4-3 → S4-4 → S4-6`.
  - *Paralizables:* Dentro de `S4-3`, `soporte_crm` (`soporte.py`/`superadmin.py`) y `reportes_analytics` (`dashboard.py`/`reportes.py`) pueden trabajarse en paralelo a `agente_ia` (`agente.py`). `S4-5` (observabilidad y CI docs) puede correr en paralelo con la recta final de `S4-3`.
- **Riesgo de conflicto entre archivos:** Medio en `app/routers/superadmin.py` (toca `auth_tenancy` y `soporte_crm`) y `app/main.py` (tocado por `S4-5`). Asignar `superadmin.py` a una sola tarea (`S4-3`) para evitar colisiones.
- **Evidencia mínima para aprobar Sprint 4 (Cierre de Sustentación):**
  1. Pipeline CI completo en verde (`lint → boundary-check → test con cobertura >=80%/90% → package → deploy documentado`).
  2. Log fechado de demo deliberada de `import-linter` (fallo con import ilegal a `internal/` + verde tras revert).
  3. 0 queries ORM directas ni imports de `app.services` en `app/routers/`.
  4. 0 hallazgos críticos abiertos y bitácora `docs/IA_BITACORA.md` actualizada con artefactos reproducibles.

---

## 3. Análisis Técnico Específico de DAT-03

### 3.1 Inventario Completo de Foreign Keys en `app/models.py`

Inspección exhaustiva de las 8 tablas activas definidas en `app/models.py` (líneas 98–367) contrastadas con `02-domain/module-boundaries.md` y migraciones `001`–`013`:

| # | Tabla.Columna | Módulo propietario | Tabla destino (módulo dueño) | Definición ORM (`app/models.py`) | Migración origen y constraint PG | Clasificación DAT-03 | Acción aprobada |
|---|---|---|---|---|---|---|---|
| 1 | `usuarios.empresa_id` | `auth_tenancy` | `empresas.id` (`auth_tenancy`) | Línea 133 (`ondelete="CASCADE"`) | `001` · `fk_usuarios_empresa_id` | **Interna del módulo** | **CONSERVAR** |
| 2 | `detalles_venta.venta_id` | `pos_ventas` | `ventas.id` (`pos_ventas`) | Línea 246 (`ondelete="CASCADE"`) | `001` · `fk_detalles_venta_id` | **Interna del módulo** | **CONSERVAR** |
| 3 | `soporte_mensajes.ticket_id` | `soporte_crm` | `soporte_tickets.id` (`soporte_crm`) | Línea 321 (`ondelete="CASCADE"`) | `006` · `soporte_mensajes_ticket_id_fkey` *(implícito)* | **Interna del módulo** | **CONSERVAR** |
| 4 | `productos.empresa_id` | `inventario` | `empresas.id` (`auth_tenancy`) | Línea 167 (`ondelete="CASCADE"`) | `001` · `fk_productos_empresa_id` | **Cruzada** (`inventario` → `auth_tenancy`) | **ELIMINAR FK** (UUID indexado + `AuthTenancyFacade`) |
| 5 | `ventas.empresa_id` | `pos_ventas` | `empresas.id` (`auth_tenancy`) | Línea 212 (`ondelete="CASCADE"`) | `001` · `fk_ventas_empresa_id` | **Cruzada** (`pos_ventas` → `auth_tenancy`) | **ELIMINAR FK** (UUID indexado + `AuthTenancyFacade`) |
| 6 | `soporte_tickets.empresa_id` | `soporte_crm` | `empresas.id` (`auth_tenancy`) | Línea 279 (`ondelete="CASCADE"`) | `006` · `soporte_tickets_empresa_id_fkey` *(implícito)* | **Cruzada** (`soporte_crm` → `auth_tenancy`) | **ELIMINAR FK** (UUID indexado + `AuthTenancyFacade`) |
| 7 | `agent_commands.empresa_id` | `agente_ia` | `empresas.id` (`auth_tenancy`) | Línea 348 (`ondelete="CASCADE"`) | `010` · `agent_commands_empresa_id_fkey` *(implícito)* | **Cruzada** (`agente_ia` → `auth_tenancy`) | **ELIMINAR FK** (UUID indexado + `AuthTenancyFacade`) |

**Excepciones propuestas:** **0** (ninguna FK cruzada se mantiene como excepción; se aplica uniformemente el patrón de UUID indexado + validación vía `AuthTenancyFacade.ensure_active_company()`).

**Referencias cruzadas ya desacopladas en migración `013` (verificadas como UUID plano + índice):**
- `ventas.usuario_id` (`pos_ventas` → `auth_tenancy`, `idx_ventas_usuario_id`)
- `detalles_venta.producto_id` (`pos_ventas` → `inventario`, `idx_detalles_venta_producto_id`)
- `soporte_tickets.usuario_id` (`soporte_crm` → `auth_tenancy`, `idx_soporte_tickets_usuario`)

### 3.2 Propuesta de Nuevo ADR (Sin Editar ADRs Aceptados)

- **Regla respetada:** `05-architecture/decisions/README.md` prohíbe modificar silenciosamente ADRs en estado `Accepted` (`ADR-001` a `ADR-004`). Además, `ADR-005` ya está asignado en el árbol local a `ADR-005-flutter-offline-first-mobile.md` (estado `Propuesto`).
- **Archivo que debe crear Claude:** `05-architecture/decisions/records/ADR-006-aislamiento-tenancy-uuid-fachadas.md`
- **Metadatos propuestos:**
  - **Id:** `ADR-006`
  - **Title:** Aislamiento de Tenancy (`empresa_id`) mediante UUID Indexados y Validación por Fachadas
  - **Status:** `Proposed` (pasa a `Accepted` tras validación humana y pruebas de Sprint 3)
  - **Relación:** Complementa y cierra el alcance de `ADR-004` y `ADR-002` sin alterarlos (`Supersedes: none; Amends/Extends: ADR-004`).
- **Contenido clave del ADR-006:**
  1. **Contexto:** La auditoría `DAT-03` evidenció que la migración `013` eliminó 3 FKs cruzadas pero dejó 4 FKs físicas de `empresa_id -> empresas.id` cruzando desde `inventario`, `pos_ventas`, `soporte_crm` y `agente_ia` hacia `auth_tenancy`.
  2. **Decisión:** Convertir `empresa_id` en columna `UUID` plana indexada (`NOT NULL`) en las 4 tablas fuera de `auth_tenancy`; conservar las 3 FKs intra-módulo; exigir validación de existencia y estado activo del tenant vía `AuthTenancyFacade.ensure_active_company(empresa_id, db)` en todo flujo de escritura y en el borde de autenticación (`get_current_user`); prohibir `ON DELETE CASCADE` y `cascade="all, delete-orphan"` cruzados (coherente con `BR-05` soft delete).
  3. **Alternativas evaluadas:** (a) Mantener excepción documentada para `empresa_id` *(descartada por decisión aprobada)*; (b) UUID indexado + fachada *(elegida)*; (c) esquemas/BDs por tenant *(descartada por ADR-002)*.
  4. **Consecuencias y mitigación:** Integridad de tenancy movida de DDL a fachada + JWT + pruebas automatizadas; mitigación contra escrituras SQL manuales mediante runbooks (`13-operations/runbook.md`) y test de auditoría de esquema en CI.

### 3.3 Diseño de Migración Reversible (`014`)

- **Archivo objetivo:** `alembic/versions/014_desacoplar_fks_tenancy_empresa_id.py` (`revision = "014"`, `down_revision = "013"`).
- **Riesgo detectado en nombres de constraints:**
  - En migración `001` los nombres fueron explícitos (`fk_productos_empresa_id`, `fk_ventas_empresa_id`).
  - En migración `006` (`soporte_tickets`) y migración `010` (`agent_commands`) las FKs se crearon **sin nombre explícito** (PostgreSQL suele asignar `soporte_tickets_empresa_id_fkey` y `agent_commands_empresa_id_fkey`, pero conviene un drop defensivo que además consulte `pg_constraint` para eliminar cualquier `FOREIGN KEY` sobre `empresa_id` hacia `empresas` en esas 4 tablas).
- **Operaciones en `upgrade()`:**
  1. Eliminar FKs físicas en `productos`, `ventas`, `soporte_tickets` y `agent_commands` hacia `empresas.id` (usando `DROP CONSTRAINT IF EXISTS` + bloque DO plpgsql defensivo por `pg_constraint` para cubrir cualquier nombre autogenerado).
  2. Verificar/garantizar índices sobre `empresa_id` con `CREATE INDEX IF NOT EXISTS`:
     - `idx_productos_empresa` on `productos (empresa_id)` *(ya creado en 002, verificado idempotentemente)*
     - `idx_ventas_empresa_id` on `ventas (empresa_id)` *(nuevo índice dedicado; `001` solo tiene el compuesto `idx_ventas_empresa_fecha`)*
     - `idx_soporte_tickets_empresa` on `soporte_tickets (empresa_id)` *(ya creado en 006)*
     - `idx_agent_commands_empresa` on `agent_commands (empresa_id)` *(ya creado en 010)*
  3. **NO tocar** las 3 FKs internas (`fk_usuarios_empresa_id`, `fk_detalles_venta_id`, `soporte_mensajes_ticket_id_fkey`).
- **Operaciones en `downgrade()`:**
  1. Eliminar únicamente el índice nuevo creado por `014` (`DROP INDEX IF EXISTS idx_ventas_empresa_id`), preservando los índices de migraciones `001`/`002`/`006`/`010`.
  2. Restaurar las 4 FKs hacia `empresas(id)` con `ondelete="CASCADE"`:
     - `fk_productos_empresa_id` (`productos.empresa_id -> empresas.id`)
     - `fk_ventas_empresa_id` (`ventas.empresa_id -> empresas.id`)
     - `soporte_tickets_empresa_id_fkey` (`soporte_tickets.empresa_id -> empresas.id`)
     - `agent_commands_empresa_id_fkey` (`agent_commands.empresa_id -> empresas.id`)
  3. *Nota operativa de rollback:* En bases con datos, el `downgrade()` fallará si existen registros huérfanos con `empresa_id` no presente en `empresas` — el runbook y las pruebas deben validar consistencia previa al rollback.

### 3.4 Revisión de Relaciones ORM y `cascade` en `app/models.py`

Hallazgo crítico de inspección: **eliminar las FKs sin actualizar las relaciones ORM causará `sqlalchemy.exc.NoForeignKeysError` al cargar los modelos**. Además, los `cascade="all, delete-orphan"` en `Empresa` violan tanto **Table Ownership** como la política de soft delete (`BR-05`).

| Relación ORM (`app/models.py`) | Líneas | Uso real detectado en `app/` y `tests/` | Acción requerida en Sprint 3 |
|---|---|---|---|
| `Empresa.productos` (`cascade="all, delete-orphan"`) ↔ `Producto.empresa` | 114, 187 | **Ningún uso** en `app/` ni `tests/` | **ELIMINAR** ambas relaciones (rompen sin FK y violan Table Ownership + BR-05) |
| `Empresa.ventas` (`cascade="all, delete-orphan"`) ↔ `Venta.empresa` | 115, 221 | **Ningún uso** en `app/` ni `tests/` | **ELIMINAR** ambas relaciones |
| `Empresa.soporte_tickets` (`cascade="all, delete-orphan"`) ↔ `SoporteTicket.empresa` | 116, 291 | **Ningún uso** en `app/` ni `tests/` | **ELIMINAR** ambas relaciones |
| `Empresa.agent_commands` (`cascade="all, delete-orphan"`) ↔ `AgentCommand.empresa` | 117, 357 | **Ningún uso** en `app/` ni `tests/` | **ELIMINAR** ambas relaciones |
| `Usuario.ventas` ↔ `Venta.usuario` (`primaryjoin` con `foreign()`) | 145–149, 222–226 | `tests/test_fase1_rbac_modelos.py:22-23` verifica `hasattr` | **ENDURECER:** añadir `viewonly=True` en ambos lados (cero writes/cascades cruzados) |
| `Producto.detalles_venta` (`passive_deletes=True`) ↔ `DetalleVenta.producto` | 188–193, 256–260 | `venta_service.py:119,159` (`joinedload`), `schemas/venta.py:58`, `routers/reportes.py:57` | **ENDURECER:** añadir `viewonly=True` en ambos lados en Sprint 3 (en Sprint 4 evaluar hidratación por `InventarioFacade`) |
| `SoporteTicket.usuario` (`viewonly=True`) | 292–296 | Lectura opcional | Ya cuenta con `viewonly=True` (conservar sin cascade) |
| `Empresa.usuarios` ↔ `Usuario.empresa` | 113, 144 | Interna (`auth_tenancy`) | **CONSERVAR** |
| `Venta.detalles` ↔ `DetalleVenta.venta` | 227, 255 | Interna (`pos_ventas`) | **CONSERVAR** |
| `SoporteTicket.mensajes` ↔ `SoporteMensaje.ticket` | 297–302, 332 | Interna (`soporte_crm`) | **CONSERVAR** |

### 3.5 Pruebas de Aislamiento y de Rollback Requeridas (DAT-03)

1. **Test de introspección de esquema ORM (`Base.metadata`) y PostgreSQL (`pg_constraint`):**
   - Afirmar que existen exactamente 3 FKs físicas y que ninguna cruza el mapa de propiedad de `02-domain/module-boundaries.md`.
   - Afirmar que existen los índices de `empresa_id` en `productos`, `ventas`, `soporte_tickets` y `agent_commands`.
2. **Tests de validación por fachada en los 4 módulos consumidores:**
   - Intentar crear producto (`inventario`), registrar venta (`pos_ventas`), abrir ticket (`soporte_crm`) y ejecutar comando (`agente_ia`) con un `empresa_id` UUID inexistente → rechazo determinista (`404`/`403`), **0 filas insertadas**.
   - Repetir con una `Empresa` existente pero desactivada (`is_active=False`) → rechazo determinista (`404`/`403`), **0 filas insertadas**.
3. **Tests de aislamiento cruzado multi-tenant (anti-IDOR):**
   - Tienda A no puede leer, modificar ni vender productos/ventas/tickets/comandos de Tienda B incluso tras retirar las FKs físicas.
4. **Tests de preservación de FKs internas:**
   - Intentar insertar `Usuario` con `empresa_id` inexistente, `DetalleVenta` con `venta_id` inexistente o `SoporteMensaje` con `ticket_id` inexistente en PostgreSQL → debe fallar con `IntegrityError` nativo.
5. **Test de no-cascada cruzada:**
   - Desactivar (`is_active=False`) una empresa no borra físicamente sus `ventas`, `productos`, `soporte_tickets` ni `agent_commands` (cumplimiento `BR-05`).
6. **Test de migración reversible en PostgreSQL de prueba:**
   - Base limpia → `alembic upgrade head` (001..014) → verificar 0 FKs cruzadas y 3 FKs internas → `alembic downgrade 013` → verificar 4 FKs restauradas → `alembic upgrade head` → verificar esquema idéntico y CRUD operativo.

---

## 4. Hallazgos Reportados Sin Corregir Código y Estado NO VERIFICADO

### 4.1 Hallazgos adicionales detectados en lectura de código (no corregidos en esta sesión)

1. **Desalineación de orden de locks (`ADR-003`):** `app/services/venta_service.py:55` recorre `data.detalles` en el orden recibido del cliente sin ordenar por `producto_id` antes de adquirir `with_for_update()`. Dos ventas concurrentes con `[A, B]` y `[B, A]` pueden provocar deadlock en PostgreSQL.
2. **Desalineación de código HTTP en stock insuficiente:** `app/inventario/internal/service.py:39-46` lanza HTTP `400 Bad Request`, mientras `ADR-003` y `11-quality/testing-strategy.md` declaran HTTP `422 Unprocessable Entity`.
3. **Ausencia de validación de empresa activa en `venta_service.registrar_venta`:** `app/services/venta_service.py:22-50` valida `current_user.empresa_id != empresa_id`, pero no invoca `AuthTenancyFacade.ensure_active_company()` antes de insertar `Venta` (riesgo al retirar la FK `ventas.empresa_id` si se llama vía fachada).
4. **Ausencia de endpoint `/logout` en backend:** `app/routers/auth.py` solo expone `/registro`, `/auth/registro-completo`, `/token` y `/me`; el cierre de sesión actual es puramente client-side (JWT stateless).
5. **Stub no operativo en `ReportesFacade`:** `app/reportes_analytics/internal/service.py:11` contiene `_ = VentasFacade` y no consulta base de datos; toda la lógica real vive en `app/routers/dashboard.py` y `app/routers/reportes.py`.
6. **Deriva documental (`DOC-12`):** `00-sdd-guide.md:61-62` y `07-api/README.md:14,25` citan migraciones `001-012` y `OpenAPI 3.0`, mientras existen migración `013` y especificación `OpenAPI 3.1.0`.
7. **Desalineación de workspace local:** La carpeta abierta `GESTION_NEIVA_CLAUDE` solo contiene `auditoria_calidad_mvp.html`; el repositorio real está en `GESTION_INVENTARIO_INTELIGENTE` con `.venv/pyvenv.cfg` apuntando al otro directorio.

### 4.2 Registro explícito de controles NO VERIFICADOS en esta sesión

- Ejecución integral de `pytest tests/` (94 pruebas): **NO VERIFICADO**.
- Porcentaje real de cobertura global y en `app/pos_ventas`: **NO VERIFICADO**.
- Ejecución local de `lint-imports` y `ruff check app`: **NO VERIFICADO**.
- Ejecución bidireccional de migraciones Alembic (`001`..`013`) sobre PostgreSQL real: **NO VERIFICADO**.
- Pantallas autenticadas a `360 × 800` y auditoría Lighthouse `>= 90`: **NO VERIFICADO**.
- Rendimiento p95 `< 300 ms` a 50 transacciones concurrentes (Locust `NFR-01`): **NO VERIFICADO**.
- Configuración real de secretos `.env` y estado de despliegues en Render/Vercel/Supabase: **NO VERIFICADO** (fuera de alcance por política de seguridad).

---

> **Declaración:** La IA asistió en análisis y documentación; las decisiones y validación final corresponden al equipo humano.
