# Bitácora de Asistencia IA — Gestión Neiva

> Registro auditable de sesiones asistidas por IA para análisis, arquitectura, QA y documentación.
> Principio de veracidad: nunca se registran pruebas ejecutadas, resultados ni autoría humana sin evidencia directa verificable.

---

## Sesión 2026-11-21 — Auditoría QA y Plan de Estabilización MVP por Capas

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-21 14:23 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity Neon / Gemini (versión exacta del modelo no verificada; rol co-arquitecto y auditor QA) |
| **Repositorio analizado** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` *(nota: el workspace abierto al iniciar la sesión fue `c:\Users\merid\Documents\GESTION_NEIVA_CLAUDE`, que solo contenía `auditoria_calidad_mvp.html`)* |
| **Modo de operación** | Solo análisis, QA y planeación. Cero ediciones a código de producción, cero lectura de `.env`, cero contacto con producción y cero creación de cuentas reales. |

### 1. Propósito

Analizar integralmente el estado arquitectónico, de datos, de calidad y de operaciones del MVP de Gestión Neiva frente al informe `docs/audits/INFORME_AUDITORIA_MVP_2026-11-21.html` y la rúbrica *Monolith Governance Framework v2.1.0*, para producir un plan de recuperación ejecutable en cinco sprints (Sprint 0 a Sprint 4) bajo la estrategia aprobada:

> **evidencia reproducible → web móvil → DAT-03 → rutas por fachadas → sustentación**

### 2. Documentos y código revisados

- **Gobernanza y planeación:** `AGENTS.md`, `GEMINI.md`, `PLAN_ACTIVO.md`, `00-sdd-guide.md`, `04-requirements/non-functional.md`, `docs/audits/INFORME_AUDITORIA_MVP_2026-11-21.html`.
- **Dominio y arquitectura:** `02-domain/module-boundaries.md`, `05-architecture/README.md`, `05-architecture/modular-monolith.md`, `05-architecture/layered-architecture.md`, `05-architecture/module-structure.md`, `05-architecture/boundary-enforcement.md`, `05-architecture/decisions/README.md`, `ADR-001` a `ADR-005`.
- **Datos y migraciones:** `06-data/README.md`, `06-data/database-conventions.md`, `06-data/models.md`, `06-data/migrations.md`, `alembic/versions/001_initial_schema.py`, `002_barcode_unique_por_empresa.py`, `006_crear_tablas_soporte.py`, `010_crear_tabla_agent_commands.py`, `012_rbac_nombre_usuario_y_trazabilidad_ventas.py`, `013_desacoplar_fks_entre_modulos.py`.
- **DevOps, calidad, UX y operaciones:** `10-devops/*`, `11-quality/README.md`, `11-quality/testing-strategy.md`, `11-quality/tdd-guide.md`, listado de `11-quality/cases/TC-001..TC-012`, `12-ux-ui/README.md`, `07-api/README.md`, `13-operations/*`, `.github/workflows/ci.yml`, `.importlinter`, `requirements.txt`, `pytest.ini`, `frontend/package.json`.
- **Código backend y pruebas (solo lectura):** `app/main.py`, `app/models.py`, `app/database.py`, `app/dependencies.py`, `app/core/logging.py`, `app/core/security_middleware.py`, todos los archivos de `app/routers/` (10), `app/services/` (6 servicios raíz + 7 módulos en `app/services/agente/`), `app/*/api/` (6 módulos) y `app/*/internal/service.py` (6 módulos), `tests/conftest.py`, `tests/end_to_end/test_store_journey_e2e.py`, `tests/module_integration/test_facades_integration.py`, `run_e2e_simulation.py`.
- **Inspección de entorno (solo lectura):** `.venv/pyvenv.cfg`, versiones de `python` y `node`, `git status --short`, `git log -5 --oneline`, listado de `frontend/src/`.

### 3. Recomendaciones producidas

1. **Plan de recuperación en 5 sprints** documentado en `docs/audits/PLAN_RECUPERACION_MVP_GEMINI.md`:
   - **Sprint 0:** Reconstruir `.venv` en Python 3.12 desde este checkout, agregar `pytest-cov`, completar `.importlinter` con `reportes_analytics`, y alinear `ci.yml` con compuertas bloqueantes reales.
   - **Sprint 1:** Desbloquear ejecución integral de `pytest`, ampliar E2E de flujo tendero completo (incluyendo login, descuento de stock, dashboard y logout) sobre PostgreSQL de prueba y medir cobertura real (>=80% global, >=90% en `pos_ventas`).
   - **Sprint 2:** Corregir objetivos táctiles (<48 px en vistas públicas y auditoría completa en vistas autenticadas) a 360 px sin scroll horizontal y añadir prueba automatizada de viewport móvil.
   - **Sprint 3 (DAT-03):** Emitir **ADR-006** (sin modificar ADRs aceptados 001–004), eliminar las 4 FKs cruzadas de `empresa_id` mediante migración reversible `014`, retirar cascades ORM cruzados en `Empresa`, y validar tenant activo vía `AuthTenancyFacade.ensure_active_company()` en todos los puntos de escritura.
   - **Sprint 4:** Migrar los 10 routers de `app/routers/` a fachadas públicas por módulo, blindar `.importlinter` contra acceso directo a `app/services`, resolver brechas `OBS-02`/`OBS-03`/`DEV-01`/`DEV-03`/`DOC-12` y reunir el paquete de evidencia de sustentación.
2. **Propuesta de microtareas verificables** añadida al final de `PLAN_ACTIVO.md` bajo el bloque `> [GEMINI PROPONE] Plan de estabilización MVP y gobernanza modular` (sin marcar ninguna tarea como completada).

### 4. Decisiones humanas aprobadas y pendientes

- **Aprobadas previamente (contexto de sesión):**
  - Estabilización por capas: evidencia reproducible → web móvil → DAT-03 → rutas por fachadas → sustentación.
  - Dirección DAT-03: conservar FKs internas del módulo; eliminar FKs cruzadas entre módulos mediante migración reversible, dejando UUID indexados y validación por fachadas públicas.
  - Exclusión explícita de Flutter/offline-first (`ADR-005`) y nuevas funcionalidades durante la estabilización MVP.
- **Pendientes de decisión humana:**
  1. Aprobar la creación de **ADR-006** (dejando intactos ADR-001..004 aceptados y preservando el identificador `ADR-005` para la propuesta Flutter congelada).
  2. Definir versión objetivo de Python en local/CI (`3.12.x` recomendada, alineada con `ci.yml` y `10-devops/local-setup.md`) y política sobre los archivos sin confirmar actuales en `git status` (`frontend/dist/index.html`, `PLAN_ACTIVO.md`, `factory/`, `ADR-005`).
  3. Confirmar política de `OBS-02`/`OBS-03`: si se instrumentan las 3 métricas HTTP/negocio en `app/` o se acota `13-operations/observability.md`, y si Redis es dependencia obligatoria (`HEALTH_REQUIRE_REDIS=true`) en `/health`.
  4. Confirmar comportamiento esperado de stock insuficiente (`400` actual en `app/inventario/internal/service.py` vs `422` documentado en `ADR-003` y `11-quality/testing-strategy.md`) y del flujo de `logout` (solo limpieza de token client-side vs endpoint explícito `/api/v1/auth/logout`).
  5. Confirmar cómo se cubrirán las evidencias `NFR-01` (Locust en Postgres/Redis de prueba) y `NFR-10` (Lighthouse >= 90) antes de la sustentación.

### 5. Evidencia obtenida (verificada directamente por inspección)

- **Entorno local corrupto/desalineado:** `.venv/pyvenv.cfg` apunta a `C:\Users\merid\Documents\GESTION_NEIVA_CLAUDE\.venv` con `Python 3.13.2`; Node local es `v26.13.1` (CI declara Python 3.12 y Node 22).
- **Faltantes de dependencias y linting:** `requirements.txt` no incluye `pytest-cov` ni `coverage`; `.importlinter` carece de contrato para `app.reportes_analytics.internal` y no bloquea `app.routers -> app.services`.
- **Pipeline real vs documentado:** `.github/workflows/ci.yml` no ejecuta `ruff`, no mide cobertura (`--cov`), no ejecuta `alembic upgrade/downgrade`, ni incluye las etapas `package` (`docker build`) y `deploy` documentadas en `10-devops/ci-cd.md`.
- **Inventario DAT-03 confirmado en `app/models.py` y migraciones 001/006/010/012/013:** 7 FKs físicas activas (3 internas: `usuarios.empresa_id`, `detalles_venta.venta_id`, `soporte_mensajes.ticket_id`; 4 cruzadas hacia `auth_tenancy.empresas`: `productos.empresa_id`, `ventas.empresa_id`, `soporte_tickets.empresa_id`, `agent_commands.empresa_id`). Se confirmó que `Empresa` define 4 `relationship(..., cascade="all, delete-orphan")` cruzados sin uso en `app/` ni `tests/`, y que `tests/test_fase1_rbac_modelos.py:22-23` y `venta_service.py:119,159` dependen de relaciones ORM de lectura (`Usuario.ventas`, `Venta.usuario`, `DetalleVenta.producto`).
- **Camino operativo heredado confirmado:** `app/main.py` monta 10 routers de `app/routers/`; ninguno invoca fachadas públicas directamente, `app/pos_ventas/internal/service.py` y `app/agente_ia/internal/service.py` delegan a `app/services/`, y `app/reportes_analytics/internal/service.py` contiene solo un stub (`_ = VentasFacade`).
- **Hallazgos adicionales detectados en lectura de código:**
  - `app/services/venta_service.py:55` no ordena `data.detalles` por `producto_id` antes de adquirir bloqueos `SELECT ... FOR UPDATE` (desalineación con `ADR-003`).
  - `app/inventario/internal/service.py:39` devuelve HTTP `400` en stock insuficiente frente a HTTP `422` exigido en `ADR-003` y `11-quality/testing-strategy.md`.
  - `app/services/venta_service.py:22-50` no invoca `AuthTenancyFacade.ensure_active_company()` antes de crear `models.Venta` (crítico al retirar la FK `ventas.empresa_id`).
  - `app/routers/auth.py` no declara endpoint de `logout`.
  - `00-sdd-guide.md:61-62` y `07-api/README.md:14,25` mantienen referencias desactualizadas (`001-012`, `OpenAPI 3.0`).

### 6. Limitaciones y estado NO VERIFICADO

- **Ejecución de pruebas en esta sesión:** **NO VERIFICADO** (sesión estrictamente de lectura, análisis y planeación; no se ejecutó `pytest`, `lint-imports`, `ruff`, `alembic`, `npm run build`, Playwright, Lighthouse ni Locust).
- **Cobertura actual global y en `pos_ventas`:** **NO VERIFICADO** (`pytest-cov` ausente en `requirements.txt` y entorno `.venv` no reproducible).
- **Ejecución E2E contra PostgreSQL real y rollback de migraciones:** **NO VERIFICADO**.
- **UX móvil en pantallas autenticadas (360 px) y puntaje Lighthouse >= 90:** **NO VERIFICADO**.
- **Rendimiento p95 < 300 ms a 50 transacciones concurrentes (Locust):** **NO VERIFICADO**.
- **Variables y secretos de `.env` y despliegues en Render/Vercel/Supabase:** **NO VERIFICADO** por restricción explícita de seguridad.

### 7. Declaración de autoría y responsabilidad

> **La IA asistió en análisis y documentación; las decisiones y validación final corresponden al equipo humano.**

---

## Sesión 2026-11-21 — Auditoría Codex, ejecución parcial y verificación móvil pública

| Campo | Detalle |
|---|---|
| **Fecha local** | 2026-11-21 (`America/Bogota`; hora exacta no registrada) |
| **Herramienta / Modelo** | Codex desktop (modelo exacto no expuesto en el repositorio) |
| **Modo de operación** | Auditoría de código, documentación y pipeline; pruebas locales controladas; navegación pública de solo lectura. No se leyó `.env`, no se modificó producción ni se crearon cuentas. |

### Propósito y resultados comprobados

- Se creó y validó sintácticamente `docs/audits/INFORME_AUDITORIA_MVP_2026-11-21.html`.
- `pytest tests --collect-only -q`: 94 pruebas recolectadas.
- `pytest tests/unit -q`: 4 pruebas pasaron.
- `npm run test:voice`: 4 pruebas del FSM de voz pasaron.
- El intento de cobertura falló porque el entorno no tenía `pytest-cov` ni `coverage`.
- La E2E quedó bloqueada al inicializar `TestClient(app)`; el diagnóstico mostró un entorno `.venv` creado originalmente para otro checkout.
- Se inspeccionó públicamente la web desplegada a `360 × 800`: inicio, registro y login no tuvieron scroll horizontal. Se registraron objetivos táctiles de 44–45 px que no cumplen de forma estricta el mínimo documentado de 48 px.

### Limitaciones

- No se certificaron cobertura, `lint-imports`, migraciones PostgreSQL, Lighthouse, Locust ni flujos autenticados reales.
- Los resultados anteriores corresponden únicamente a los comandos y pantallas indicados; no representan una certificación completa del MVP.

> **La IA asistió en análisis, pruebas y documentación; las decisiones y validación final corresponden al equipo humano.**

---

## Decisión de gobernanza 2026-11-21 — Ejecutor y archivo de planes

- El equipo adopta **Antigravity** como ejecutor de las tareas de implementación; Gemini conserva el rol de análisis y QA.
- Los planes cerrados no se eliminan: se archivan con fecha en `docs/audits/planes-cerrados/` y su ejecución queda trazada en esta bitácora.
- `PLAN_ACTIVO.md` se mantiene como tablero de trabajo vigente y, al cerrar cada sprint, conserva únicamente un enlace al plan archivado y a su evidencia verificable.


---

## Sesión 2026-11-21 17:35 — Ejecución S0-1 (Diagnóstico de Git, `.gitignore` y viabilidad segura de S0-2)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-21 17:35 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon (análisis/QA) |
| **Repositorio analizado** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Tarea ejecutada** | `S0-1` (solo verificación y diagnóstico de solo lectura; **no marcada como completada**) |
| **Modo de operación** | Solo lectura sobre Git, `.gitignore`, `.venv` e intérpretes Python locales. Cero código modificado, cero archivos eliminados/movidos/restaurados, `.venv` y `frontend/dist/index.html` intactos, `.env` no leído, sin commit ni push. |

### 1. Comandos de diagnóstico ejecutados y resultados verificados

- `git status --short` y `git status --short -uall`:
  - `M AGENTS.md` (49 líneas cambiadas: roles Antigravity+Gemini y ciclo de vida de `PLAN_ACTIVO.md` y evidencia IA).
  - `M PLAN_ACTIVO.md` (+209 líneas: bloque `[GEMINI PROPONE] Plan de estabilización MVP y gobernanza modular`).
  - `M frontend/dist/index.html` (4 líneas: hashes de assets compilados Vite `index-BrWgqtY2.js` → `index-zSd0iy3A.js` y `index-74FBmOvI.css` → `index-fqs3w9sM.css`).
  - `?? 05-architecture/decisions/records/ADR-005-flutter-offline-first-mobile.md`
  - `?? docs/IA_BITACORA.md`
  - `?? docs/audits/INFORME_AUDITORIA_MVP_2026-11-21.html`
  - `?? docs/audits/PLAN_RECUPERACION_MVP_GEMINI.md`
  - `?? docs/spec/PROPUESTA_ARQUITECTURA_FLUTTER_OFFLINE_FIRST.md`
  - `?? factory/jobs/pos-papeleria/frontend/package-lock.json` (`git ls-files factory/` = 0 archivos rastreados).
- Revisión de `.gitignore` (sin modificar):
  - Cubre `.env`, `.venv/`, `.venvpython/`, `dist/`, `frontend/dist/`, `.pytest_cache/`, `htmlcov/`, `.coverage`, `*.log`, `*.db`, `*.exe`, `*.zip`, `graphify-out/`, `scratch/`.
  - `frontend/dist/index.html` coincide con `.gitignore:46` (`frontend/dist/`), pero sigue reportado como `M` porque permanece rastreado en el índice Git (`git ls-files frontend/dist`).
  - `coverage.xml` y `factory/` no están en `.gitignore`.
- Revisión de intérpretes Python y entornos virtuales locales (sin modificar):
  - `py -0p`: Python `3.13` (`C:\Python313\python.exe`) y `Astral/CPython 3.11.15`.
  - `uv 0.11.19` disponible (`C:\Users\merid\AppData\Local\hermes\bin\uv.exe`) con **`cpython-3.12.13-windows-x86_64-none` ya instalado** en `C:\Users\merid\AppData\Roaming\uv\python\cpython-3.12-windows-x86_64-none\python.exe`.
  - `.venv/pyvenv.cfg` apunta a `C:\Users\merid\Documents\GESTION_NEIVA_CLAUDE\.venv` (Python `3.13.2`), con paquetes extra fuera de `requirements.txt` (`bandit`, `pip_audit`, `faster-whisper`, `onnxruntime`, `Flask`, `PyYAML`, `requests`, `python-jose`, `pytest==9.0.3`, `fastapi==0.136.1`) y sin `import-linter`, `ruff` ni `pytest-cov`.
  - `.venvpython/pyvenv.cfg` existe (ignorado por `.gitignore:3`) apuntando a `c:\Users\merid\Downloads\GESTION_NEIVA_CLAUDE\.venvpython` (Python `3.13.2`).

### 2. Recomendación producida para S0-2

- Reconstruir `.venv` en S0-2 de forma reversible moviendo el `.venv` actual fuera del repositorio (`..\GESTION_INVENTARIO_INTELIGENTE_venv_bak_20261121`) y creando el nuevo `.venv` con `cpython-3.12.13` existente, previa autorización humana.

### 3. Limitaciones y estado

- No se ejecutó S0-2 ni ninguna acción destructiva o de saneamiento sobre el árbol Git.
- `S0-1` permanece abierta (`[ ]`) hasta decisión humana sobre `frontend/dist/index.html`, archivos Flutter/factory y autorización de S0-2.

> **La IA asistió en análisis y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-21 17:43 — Ejecución S0-2 (Respaldo de `.venv` y recreación con Python 3.12.13)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-21 17:43–17:48 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Tarea ejecutada** | `S0-2` — marcada como `[x]` en `PLAN_ACTIVO.md` tras cumplir los 4 criterios de verificación |
| **Restricciones respetadas** | `.venvpython/` intacto, `frontend/dist/index.html` intacto, ADR-005 y propuesta Flutter intactos fuera de MVP, cero código de producción/frontend/migraciones modificado, sin `git checkout`, sin rollback, sin commit/push, `.env` no leído. |

### 1. Comandos ejecutados

```powershell
Set-Location "C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE"
Move-Item -Path ".venv" -Destination "..\GESTION_INVENTARIO_INTELIGENTE_venv_bak_20261121"
& "$env:APPDATA\uv\python\cpython-3.12-windows-x86_64-none\python.exe" -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe --version
.\.venv\Scripts\python.exe -c "import sys; print(sys.prefix)"
.\.venv\Scripts\pytest.exe --version
.\.venv\Scripts\pytest.exe tests --collect-only -q
```

### 2. Evidencia verificada

- **Python activo en `.venv`:** `Python 3.12.13`.
- **`sys.prefix`:** `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE\.venv`.
- **`pyvenv.cfg`:** `command = C:\Users\merid\AppData\Roaming\uv\python\cpython-3.12.13-windows-x86_64-none\python.exe -m venv C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE\.venv`.
- **Instalación de dependencias:** `pip 26.3`, `pip install -r requirements.txt` exit code `0`, `pip check` → `No broken requirements found.`.
- **Versiones clave instaladas desde `requirements.txt`:** `fastapi==0.165.0`, `starlette==1.10.0`, `uvicorn==0.24.0`, `gunicorn==27.0.1`, `sqlalchemy==2.0.58`, `psycopg2-binary==2.9.10`, `alembic==1.13.1`, `redis==8.1.0`, `pydantic==2.10.6`, `pydantic-settings==2.7.0`, `bcrypt==5.0.0`, `passlib==1.7.4`, `PyJWT==2.15.1`, `openpyxl==3.1.2`, `pytest==7.4.3`, `pytest-asyncio==0.21.1`, `httpx==0.25.2`, `locust==2.24.1`, `import-linter==2.17`, `ruff==0.17.6`, `groq==1.7.0`, `google-generativeai==0.8.6`.
- **Recolección de pruebas:** `pytest tests --collect-only -q` → **`94 tests collected in 2.47s`** (exit code `0`).
- **Respaldos y preservación:** `..\GESTION_INVENTARIO_INTELIGENTE_venv_bak_20261121` = `True`; `.venvpython` = `True`.

### 3. Advertencias / notas para S0-3 y S1-1

- Al recolectar con `pytest 7.4.3`, `fastapi==0.165.0` / `starlette==1.10.0` emitió:
  `StarletteDeprecationWarning: Using httpx with starlette.testclient is deprecated; install httpx2 instead.`
  Se deja documentado como señal preventiva para evaluar compatibilidad de `TestClient` en S0-3 y S1-1.
- No se ejecutaron pruebas (`pytest tests/`), `ruff`, `lint-imports` ni cobertura en esta sesión (**NO VERIFICADO** hasta S0-3 / S0-4 / S1-1).

> **La IA asistió en ejecución controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-21 18:07 — Ejecución S0-3 (Dependencias de cobertura y compatibilidad QA)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-21 18:07–18:09 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Tarea ejecutada** | `S0-3` — marcada como `[x]` en `PLAN_ACTIVO.md` tras pasar todas las verificaciones |
| **Restricciones respetadas** | Sin cambios a código de producción, routers, modelos, migraciones ni frontend; `.venvpython/`, respaldo `..\GESTION_INVENTARIO_INTELIGENTE_venv_bak_20261121`, `frontend/dist/index.html`, ADR-005 y propuesta Flutter intactos; sin modificar versiones de FastAPI/Starlette/httpx/pytest; sin commit ni push; `.env` no leído. |

### 1. Prueba inicial de ausencia de cobertura (RED)

- Comando: `.\.venv\Scripts\pytest.exe tests --cov=app --collect-only -q`
- Resultado: **EXIT_CODE = 4** — `pytest: error: unrecognized arguments: --cov=app`.

### 2. Cambio realizado en `requirements.txt` y justificación de versión

- Confirmado previamente que `import-linter>=2.0` y `ruff>=0.4.0` ya estaban declarados en `requirements.txt`.
- Se añadió únicamente `pytest-cov==6.3.0` (debajo de `pytest-asyncio==0.21.1`).
- **Motivo de elección:** versión fijada explícitamente (`==`, coherente con `pytest==7.4.3`, `pytest-asyncio==0.21.1`, `httpx==0.25.2`), explícitamente compatible con `pytest==7.4.3` y Python `3.12.13` (resuelve `coverage==7.17.4` sin exigir `pytest>=8` ni alterar otras dependencias).

### 3. Verificaciones ejecutadas (GREEN)

- `.\.venv\Scripts\python.exe -m pip install -r requirements.txt`: `Successfully installed coverage-7.17.4 pytest-cov-6.3.0` (exit `0`).
- `.\.venv\Scripts\python.exe -m pip check`: `No broken requirements found.` (exit `0`).
- `.\.venv\Scripts\pytest.exe --help`: opciones `--cov=[SOURCE]`, `--cov-report=TYPE` y `--cov-fail-under=MIN` presentes (exit `0`).
- `.\.venv\Scripts\pytest.exe tests --cov=app --collect-only -q`: **`94 tests collected in 1.65s`** (exit `0`). *(Nota de veracidad: el 36% impreso por coverage durante `--collect-only` refleja solo código ejecutado al importar módulos en colección; la cobertura real de pruebas sigue **NO VERIFICADO** hasta S1-1/S1-5).*
- `.\.venv\Scripts\ruff.exe --version`: `ruff 0.17.6` (exit `0`).
- `.\.venv\Scripts\lint-imports.exe --version`: `import-linter 2.17` (exit `0`).

### 4. Riesgo observado — Advertencia Starlette/httpx

- Se mantiene registrada la advertencia `StarletteDeprecationWarning: Using httpx with starlette.testclient is deprecated; install httpx2 instead.` (`fastapi==0.165.0` / `starlette==1.10.0` con `httpx==0.25.2`).
- **Decisión explícita:** no modificar versiones de FastAPI, Starlette, httpx ni pytest en S0-3; su impacto real se evaluará únicamente si se reproduce un fallo al ejecutar la suite completa en **S1-1**.

> **La IA asistió en ejecución controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-21 18:19 — Ejecución S0-4 (Contrato `reportes-analytics-internals-are-private` en `.importlinter`)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-21 18:19–18:20 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Tarea ejecutada** | `S0-4` — marcada como `[x]` en `PLAN_ACTIVO.md` tras confirmar 7/7 contratos `KEPT` |
| **Alcance editado** | Únicamente `.importlinter`, `PLAN_ACTIVO.md` y `docs/IA_BITACORA.md`. Cero cambios a `app/`, pruebas, modelos, routers, migraciones, frontend, CI o dependencias; sin commit ni push. |

### 1. Evidencia previa (antes del cambio)

- `.\.venv\Scripts\lint-imports.exe`: `Analyzed 84 files, 143 dependencies.` → **`Contracts: 6 kept, 0 broken.`** (exit `0`).
- `rg -n "app\.reportes_analytics\.internal" app tests`: únicamente `app\reportes_analytics\api\facade.py:5:from app.reportes_analytics.internal import service as _internal_service` (import interno legítimo de su propia fachada).

### 2. Cambio realizado y decisión de alcance

- Se añadió en `.importlinter` el **Contrato 7** (`[importlinter:contract:reportes-analytics-internals-are-private]`, `type = forbidden`, `allow_indirect_imports = True`) prohibiendo a `app.auth_tenancy`, `app.inventario`, `app.pos_ventas`, `app.soporte_crm` y `app.agente_ia` importar `app.reportes_analytics.internal`.
- **Decisión de alcance:** NO se agregaron aún reglas contra `app.routers -> app.services` ni `app.routers -> *.internal` (reservadas para **S4-4**, tras migrar los routers a fachadas en S4-1..S4-3).

### 3. Verificación posterior

- `.\.venv\Scripts\lint-imports.exe`: `Analyzed 84 files, 143 dependencies.` → **`Contracts: 7 kept, 0 broken.`** (exit `0`).
- `git diff --check`: exit `0` sin errores de formato/espacios (solo aviso informativo de CRLF en `frontend/dist/index.html`, no tocado).

> **La IA asistió en ejecución controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-21 18:23 — Ejecución S0-5 (Línea base real de lint, compilación y build frontend)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-21 18:23–18:25 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Tarea ejecutada** | `S0-5` — **BLOQUEADA** (no marcada como completada en `PLAN_ACTIVO.md`) |
| **Versiones verificadas** | `ruff 0.17.6`, `Python 3.12.13`, `Node v26.13.1`, `npm 11.20.0`, `Vite v6.4.2` |
| **Restricciones respetadas** | Cero ediciones a código, dependencias, CI, frontend, migraciones, `.gitignore` ni `frontend/dist/index.html`; build aislado en `%TEMP%` (no borrado); `PLAN_ACTIVO.md` sin cambios; sin commit ni push. |

### 1. Resultados de los 4 comandos de línea base

| # | Comando | Exit code | Resultado |
|---|---|---|---|
| 1 | `.\.venv\Scripts\ruff.exe check app` | **`1` (FALLA)** | **228 errores** (`130` fixable con `--fix`, `9` unsafe fixes). Top reglas (`ruff check app --statistics`): `69 B008` (`Depends/Query/Header/File` en firma FastAPI), `39 UP045`, `32 I001`, `25 UP017`, `12 F401`, `11 BLE001`, `11 UP006`, `5 UP035`, `4 F841`, `3 RUF022`, más `17` de `SIM`/`PIE`/`TRY`/`ASYNC230`/`F541`/`G201`/`PYI041`/`FURB188`/`FLY002`. |
| 2 | `.\.venv\Scripts\python.exe -m compileall -q app tests` | **`0` (PASA)** | Compilación sintáctica limpia de `app` y `tests`. |
| 3 | `cd frontend && npm run test:voice` | **`0` (PASA)** | `4/4 ✅ FSM del Modo Voz verificado`. |
| 4 | `cd frontend && npm run build -- --outDir $qaOutput` | **`0` (PASA)** | `vite v6.4.2`: `2392 modules transformed`, `built in 21.65s`. |

### 2. Artefacto temporal preservado

- Ruta: `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s0-5-1549f21f-d576-42c2-895c-58c19bef17b3`
- Contenido raíz verificado: `assets`, `media`, `index.html`, `test-voice.html`.

### 3. Comparación `git status --short` antes / después

- Idéntico antes y después (ningún archivo rastreado alterado por esta ejecución; `frontend/dist/index.html` permanece intacto).

### 4. Causa probable del bloqueo en `ruff`

1. El repositorio **no tiene** `pyproject.toml`, `ruff.toml` ni `.ruff.toml` (`False/False/False`), y `ruff` no se ejecutaba en `.github/workflows/ci.yml`, por lo que `ruff 0.17.6` aplicó un conjunto amplio de reglas sin configuración explícita del proyecto (marcando `69` usos estándar de FastAPI `Depends()/Query()/Header()/File()` como `B008`, además de reglas de estilo `UP*`, `I001` y deuda real como `12 F401`, `4 F841`, `11 BLE001`, `1 ASYNC230`).
2. **Acción requerida (decisión humana antes de re-ejecutar S0-5):** definir si se crea una configuración explícita de `ruff` (ej. `pyproject.toml` o `ruff.toml` con `target-version = "py312"` y política sobre `B008` en FastAPI + limpieza de `F401`/`F841`/`I001`/`UP*`) o si se corrigen los 228 hallazgos directamente en `app/`.

> **La IA asistió en ejecución controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-21 18:30 — Desbloqueo y Cierre S0-5 (`ruff.toml` reproducible y línea base de lint en `app/`)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-21 18:30–18:32 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Tarea ejecutada** | Microtarea de desbloqueo `S0-5` — marcada como `[x]` en `PLAN_ACTIVO.md` |
| **Alcance editado** | `ruff.toml` (nuevo), 38 archivos de `app/` (orden de imports, imports/variables sin uso, `B904`, `E741`, `F541`), `PLAN_ACTIVO.md` y `docs/IA_BITACORA.md`. Cero cambios a frontend, migraciones, dependencias, CI, `.importlinter`, `.gitignore`, ADRs ni `frontend/dist/index.html`; sin `--unsafe-fixes`; sin commit ni push. |

### 1. Configuración creada (`ruff.toml`) y política de reglas

- `target-version = "py312"`, `select = ["E4", "E7", "E9", "F", "I", "B"]`.
- `per-file-ignores`: `B008` ignorado únicamente en `app/routers/*.py`, `app/dependencies.py` y `app/main.py` por los defaults declarativos legítimos de FastAPI (`Depends`, `Query`, `Header`, `File`), sin ignorar `B008` globalmente.
- **Decisión documentada:** Las familias `UP`, `BLE`, `SIM`, `TRY`, `ASYNC` (y similares como `RUF`, `PIE`, `G`, `PYI`, `FURB`, `FLY`) quedan **deliberadamente fuera** de esta línea base inicial y se evaluarán en una iteración posterior.

### 2. Línea base con `ruff.toml` y correcciones aplicadas

- **Línea base (`ruff check app --statistics`):** **53 errores** (`32 I001`, `12 F401`, `4 F841`, `3 B904`, `1 E741`, `1 F541`).
- **Correcciones automáticas seguras (`ruff check app --fix`, sin `--unsafe-fixes`):** 46 hallazgos resueltos (`I001`, `F401`, `2 F841` de `except Exception as json_err`, `1 F541`).
  - Se revisó el diff completo y se verificó con `rg` que ninguno de los `F401` eliminados era exportación implícita usada por `tests/` ni import con efecto secundario; se verificó `sqlalchemy.orm.configure_mappers()` → `MAPPERS_OK` tras retirar `foreign` sin uso en `app/models.py`.
- **Correcciones manuales preservando comportamiento (6 restantes):**
  - `app/dependencies.py:33-36`: `raise _no_autenticado from exc` (`2 × B904`).
  - `app/routers/superadmin.py:120-124`: `raise HTTPException(...) from exc` (`1 × B904`).
  - `app/services/agente/agent_orchestrator.py:805,1081`: eliminadas asignaciones locales sin uso `query` y `preview` (`2 × F841`).
  - `app/services/agente/intent_provider.py:1087`: renombrada variable ambigua `l` → `line` (`1 × E741`).

### 3. Verificaciones finales (todas en exit code `0`)

- `.\.venv\Scripts\ruff.exe check app` → **`All checks passed!`** (exit `0`).
- `.\.venv\Scripts\python.exe -m compileall -q app tests` → exit `0`.
- `.\.venv\Scripts\pytest.exe tests --collect-only -q` → **`94 tests collected in 0.30s`** (exit `0`).
- `.\.venv\Scripts\lint-imports.exe` → **`Analyzed 84 files, 143 dependencies. Contracts: 7 kept, 0 broken.`** (exit `0`).
- `git diff --check` → exit `0`.
- **Evidencia frontend preservada de S0-5 (sin cambios posteriores en `frontend/`):** `npm run test:voice` `4/4` (exit `0`) y `npm run build -- --outDir C:\Users\merid\AppData\Local\Temp\gestion-inventario-s0-5-1549f21f-d576-42c2-895c-58c19bef17b3` (`vite v6.4.2`, `built in 21.65s`, exit `0`).

> **La IA asistió en ejecución controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-22 10:47 — Ejecución S0-6A (Alineación CI de calidad y artefactos de cobertura)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-22 10:47–10:50 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Tarea ejecutada** | `S0-6A` — **EN PROGRESO / NO MARCADA COMPLETADA** (pendiente corrida verde real en GitHub Actions tras commit autorizado) |
| **Alcance editado** | Únicamente `.github/workflows/ci.yml`, `PLAN_ACTIVO.md` y `docs/IA_BITACORA.md`. Cero cambios en `app/`, `frontend/`, dependencias, migraciones ni `.gitignore`; sin herramientas externas instaladas; sin commit ni push. |

### 1. Cambios aplicados en `.github/workflows/ci.yml`

- **Backend (`backend-and-governance`, Python `3.12`, `pip install -r requirements.txt`):**
  1. **Stage 1 — Static Lint (ruff):** `ruff check app` (usa `ruff.toml`).
  2. **Stage 2 — Syntax & Compile Check:** `python -m compileall -q app tests` (conservado).
  3. **Stage 3 — Module Boundary Enforcement (import-linter):** `lint-imports` (conservado; valida los 7 contratos de `.importlinter`).
  4. **Stage 4 — Backend Test Suite & Coverage Report:** `pytest tests/ -q --cov=app --cov-report=xml --cov-report=term-missing` (**sin** `--cov-fail-under`; los umbrales 80%/90% se activan solo tras `S1-5`).
  5. **Upload Backend Coverage Artifact (`coverage.xml`):** `actions/upload-artifact@v4` con `if: always()` e `if-no-files-found: ignore` para conservar `coverage.xml` incluso si las pruebas fallan.
  6. **Stage 5 — End-to-End Business Journey Simulation (SQLite):** `python run_e2e_simulation.py` mantenido como etapa separada sobre SQLite, sin afirmar PostgreSQL ni concurrencia real.
- **Frontend (`frontend-verify`, Node `22`):**
  - Reemplazado `npm install` por `npm ci` (reproducible contra `frontend/package-lock.json`).
  - Conservados `npm run test:voice` y `npm run build`.
- **Infraestructura NO añadida en S0-6A (diferida explícitamente):** sin Docker build, sin servicios PostgreSQL, sin migraciones Alembic, sin deploy ni triggers de release. *(Nota factual de inspección: `Dockerfile` y `docker-compose.yml` sí existen en la raíz del repo, pero su integración en CI queda deliberadamente diferida a `S1-3/S3-3` y `DEV-03` según el alcance aprobado de S0-6A).*

### 2. Propuesta registrada en `PLAN_ACTIVO.md`

- Añadido bloque `> [ANTIGRAVITY PROPONE]` dividiendo `S0-6` en:
  - `S0-6A` — CI de calidad y artefactos de cobertura.
  - `S1-3 / S3-3` — PostgreSQL, migraciones y rollback en CI.
  - `DEV-03` — Docker, release y despliegue documentado.
- Ni `S0-6` ni `S0-6A` fueron marcados como `[x]`.

### 3. Verificaciones locales ejecutadas

- Validación YAML usando `PyYAML 6.0.4` ya presente en `.venv` (cero instalaciones nuevas): `YAML_VALID=True`, `YAML_CHECK_EXIT=0`, 2 jobs (`backend-and-governance` 9 pasos, `frontend-verify` 5 pasos), triggers `['push', 'pull_request']`.
- Rutas y scripts referenciados verificados en disco: `requirements.txt`, `ruff.toml`, `.importlinter`, `run_e2e_simulation.py`, `frontend/package-lock.json`, scripts `test:voice` y `build` en `frontend/package.json` → `PATHS_AND_SCRIPTS_OK=True`.
- `coverage.xml` en local: `LOCAL_COVERAGE_XML_EXISTS=False` (se genera únicamente como artefacto en CI; no exige tocar `.gitignore` en esta microtarea).
- `git diff --check`: exit `0`.

### 4. Condición pendiente para cerrar S0-6A

- Ejecución verde real del workflow `.github/workflows/ci.yml` en GitHub Actions después de un commit y push autorizados por el equipo humano (**NO VERIFICADO** hasta dicha corrida).

> **La IA asistió en ejecución controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-23 19:37 — Commit selectivo y push Sprint 0 para ejecución en GitHub Actions

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-23 19:37 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Rama / Remoto** | `main` → `origin` (`https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE.git`) |
| **Commit autorizado** | `chore(quality): establish sprint 0 quality gates` (registro previo al commit; SHA y estado de corrida de GitHub Actions reportados tras `git push origin main`) |
| **Estado S0-6A** | **Permanece `[ ]`** hasta confirmar ejecución verde real en GitHub Actions con artefacto `backend-coverage-xml`. |

### 1. Verificaciones locales previas al commit (todas en exit `0`)

- `.\.venv\Scripts\ruff.exe check app` → `All checks passed!` (exit `0`).
- `.\.venv\Scripts\python.exe -m compileall -q app tests` → exit `0`.
- `.\.venv\Scripts\lint-imports.exe` → `Analyzed 84 files, 143 dependencies. Contracts: 7 kept, 0 broken.` (exit `0`).
- `.\.venv\Scripts\pytest.exe tests --collect-only -q` → `94 tests collected in 0.85s` (exit `0`).
- `cd frontend && npm run test:voice` → `4/4 ✅ FSM del Modo Voz verificado` (exit `0`).

### 2. Alcance selectivo incluido en el commit

- Configuración y compuertas Sprint 0: `.github/workflows/ci.yml`, `.importlinter`, `ruff.toml`, `requirements.txt`.
- Correcciones de lint verificadas en `app/` (38 archivos modificados).
- Documentación y gobernanza: `AGENTS.md`, `PLAN_ACTIVO.md`, `docs/IA_BITACORA.md`, `docs/audits/INFORME_AUDITORIA_MVP_2026-11-21.html`, `docs/audits/PLAN_RECUPERACION_MVP_GEMINI.md`.

### 3. Archivos explícitamente excluidos del commit

- `frontend/dist/index.html`
- `factory/`
- `05-architecture/decisions/records/ADR-005-flutter-offline-first-mobile.md`
- `docs/spec/PROPUESTA_ARQUITECTURA_FLUTTER_OFFLINE_FIRST.md`
- `.venv/`, `.venvpython/`, respaldos locales y `.env` (no leído).

> **La IA asistió en ejecución controlada y documentación; las decisiones y validación final corresponden al equipo humano.**
