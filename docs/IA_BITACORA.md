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


---

## Sesión 2026-11-25 17:24 — Cierre verificado de S0-6A (Evidencia GitHub Actions Run #45298915524)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-25 17:24 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Tarea cerrada** | `S0-6A` — marcada como `[x]` en `PLAN_ACTIVO.md` (cero cambios de código; `S0-6` general, `S1-3/S3-3` y `DEV-03` permanecen `[ ]`) |

### Evidencia verificada de GitHub Actions

- **Commit:** `8f200c1` (`8f200c14868e730c8150323c2e0e9ca4cab6ac21`, `chore(quality): establish sprint 0 quality gates`)
- **Workflow / Run:** `CI Pipeline — Monolith Governance & QA` · Run `#45298915524` (`https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE/actions/runs/45298915524`)
- **Estado final:** **`completed / success`** (`2026-11-24T00:39:20Z` → `00:40:47Z`)
- **Jobs:**
  - `Lint, Boundary Check & Backend Tests` (`job/138126211730`): **`success`** (`ruff check app` → `All checks passed!`, `compileall` ✅, `lint-imports` → `Contracts: 7 kept, 0 broken.`).
  - `Frontend Voice FSM Tests & Production Build` (`job/138126211469`): **`success`** (`npm ci` ✅, `npm run test:voice` ✅, `npm run build` ✅).
- **Artefacto:** `backend-coverage-xml` (`id: 14877682399`, `9,176 bytes`, `expired: false`, generado `2026-11-24T00:40:40Z`).
- **Resultados Pytest + Cobertura en CI:** `82 passed, 12 skipped, 7 warnings in 40.63s`; cobertura global `app/` = **`79%`** (`3,297` statements, `681` missed); `app/pos_ventas/` = **`100%`** (`30/30` statements).
- **E2E SQLite (`run_e2e_simulation.py`):** `ALL END-TO-END (E2E) TESTS PASSED SUCCESSFULLY! (100% OK)`.

> **La IA asistió en verificación controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-25 17:24 — Ejecución S1-1 (Diagnóstico local de suite completa, skips de CI y brechas de cobertura)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-25 17:24–17:27 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Entorno verificado** | `.venv` `Python 3.12.13` · `pytest 7.4.3` · PostgreSQL local activo (`localhost:5432/gestion_neiva_test`) |
| **Tarea ejecutada** | `S1-1` — marcada como `[x]` en `PLAN_ACTIVO.md` (suite completa sin hang/crash y 12 skips auditados) |
| **Restricciones respetadas** | Cero cambios a código, tests, dependencias, CI, migraciones ni frontend; sin commit ni push; `.env` no leído. |

### 1. Comandos ejecutados y resultados locales vs CI

| Comando | Entorno | Passed | Failed | Skipped | Warnings | Tiempo | Cobertura `app/` | Exit |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| `.\.venv\Scripts\pytest.exe tests -q -rs --maxfail=1` | Local `.venv` (Py 3.12.13 + PG local) | **94** | 0 | **0** | 7 | `56.84s` | n/a | `0` |
| `.\.venv\Scripts\pytest.exe tests --cov=app --cov-report=term-missing -q -rs --maxfail=1` | Local `.venv` (Py 3.12.13 + PG local) | **94** | 0 | **0** | 7 | `65.05s` | **`80%`** *(exacto `79.74%`, `668/3297` miss)* | `0` |
| `pytest tests/ -q --cov=app ...` (Run `#45298915524`) | CI GitHub Actions (Py 3.12 + SQLite) | **82** | 0 | **12** | 7 | `40.63s` | **`79%`** *(exacto `79.34%`, `681/3297` miss)* | `0` |

- **Hang de `TestClient` / `AnyIO`:** **NO reapareció.** Resuelto al reemplazar el `.venv` corrupto de Python `3.13.2` por `.venv` limpio Python `3.12.13`.
- **Warnings (7 en local y CI):** 1× `StarletteDeprecationWarning` (`httpx` vs `httpx2` en `TestClient`, sin fallo) y 6× `StarletteDeprecationWarning` (`HTTP_422_UNPROCESSABLE_ENTITY` deprecado en favor de `HTTP_422_UNPROCESSABLE_CONTENT`).
- **Alerta QA sobre `--cov-fail-under=80`:** Aunque la tabla redondea `79.74%` a `80%` en local, `pytest-cov` compara el valor exacto (`79.74% < 80.0%` en local y `79.34% < 80.0%` en CI); faltan al menos `9` statements en local (`22` en CI) para superar `80.00%` real (se cerrará en `S1-5`).

### 2. Auditoría y clasificación de los 12 `skipped` de CI

Todos los **12** tests saltados en CI pasaron (`12/12`) en local con PostgreSQL vivo y se clasifican uniformemente como **esperado por SQLite / ausencia de servicio PostgreSQL en CI** (pendiente `S1-3 / S3-3`):

1. `tests/integration/postgres/test_concurrencia_postgres.py` (**5 tests**, `pytestmark = skipif(not PG_ALIVE)`): `test_postgres_concurrencia_dos_confirmaciones_mismo_command_id`, `test_postgres_concurrencia_dos_ventas_compitiendo_stock_uno`, `test_postgres_kernel_row_lock_select_for_update_demostracion`, `test_postgres_concurrencia_reabastecimiento_sin_lost_update`, `test_postgres_directa_integrity_violation_command_id`.
2. `tests/test_adversarial_break_system.py` (**3 tests**, `@pytest.mark.skipif(not PG_ALIVE)`): `test_ataque_concurrente_hilos_ultimo_cupo_cajero`, `test_ataque_concurrente_hilos_sobreventa_stock_uno`, `test_ataque_carrera_creacion_vs_reactivacion_postgres`.
3. `tests/test_concurrencia_real.py` (**3 tests**, `if not PG_AVAILABLE: pytest.skip(...)`): `test_concurrencia_dos_confirmaciones_mismo_command_id`, `test_concurrencia_dos_ventas_compitiendo_stock_uno`, `test_concurrencia_reabastecimiento_lost_update`.
4. `tests/test_fase2_backend_rbac.py` (**1 test**, `pytest.skip(...)` al fallar conexión PG): `test_concurrencia_creacion_cajeros_limite_tres_con_barrier`.

### 3. Módulos con mayor brecha de cobertura (base local `3,297` stmts / `668` miss)

- **Mayor impacto absoluto en statements sin cubrir:** `app/services/agente/intent_provider.py` (`120` miss, `73%`), `app/services/agente/agent_orchestrator.py` (`85` miss, `83%`), `app/services/agente/session_store.py` (`49` miss, `47%`), `app/services/agente/response_formatter.py` (`40` miss, `85%`), `app/services/producto_service.py` (`36` miss, `67%`), `app/routers/agente.py` (`35` miss, `55%`), `app/routers/reportes.py` (`32` miss, `36%`), `app/routers/superadmin.py` (`29` miss, `57%`), `app/services/auth_service.py` (`25` miss, `68%`).
- **Módulos en `0%`:** `app/agente_ia/*` (`24` miss), `app/reportes_analytics/*` (`23` miss), `app/core/config.py` (`11` miss), `app/platform/{config,database,middleware}` (`7` miss).
- **Otros bajo `80%`:** `app/schemas/empresa.py` (`19` miss, `57%`), `app/services/empresa_service.py` (`13` miss, `35%`), `app/routers/soporte.py` (`11` miss, `79%`), `app/routers/empresas.py` (`9` miss, `67%`), `app/database.py` (`8` miss, `69%`), `app/platform/security/__init__.py` (`5` miss, `69%`).
- **`pos_ventas`:** `app/pos_ventas/` = `100%` (`30/30`); `app/services/venta_service.py` = `83%` local (`10` miss) / `80%` CI (`12` miss).

> **La IA asistió en ejecución controlada, análisis y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-25 17:38 — Ejecución S1-2 (Ampliación del recorrido E2E del tendero y verificación de logout stateless)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-25 17:35–17:38 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Entorno verificado** | `.venv` `Python 3.12.13` · `pytest 7.4.3` · `pytest-cov 6.3.0` · PostgreSQL local activo |
| **Tarea ejecutada** | `S1-2` — marcada como `[x]` en `PLAN_ACTIVO.md` |
| **Archivos modificados** | Únicamente `tests/end_to_end/test_store_journey_e2e.py`, `PLAN_ACTIVO.md` y `docs/IA_BITACORA.md` |
| **Restricciones respetadas** | Sin cambios en código de producción (`app/`), frontend, dependencias, CI, migraciones, modelos ni fachadas; sin `POST /logout`; sin commit ni push; `.env` no leído. |

### 1. Decisión de arquitectura aplicada (Logout JWT stateless)

- **No se creó ni se modificó ningún endpoint `POST /logout`.**
- El esquema JWT del sistema es **stateless**: en el frontend (`frontend/src/services/authService.js`, líneas 81–83), `logout()` ejecuta `this.clearToken()` (`localStorage.removeItem('access_token')`).
- La evidencia backend de sesión cerrada es que una ruta protegida (`GET /api/v1/me`) responde **`401 Unauthorized`** cuando se invoca sin encabezado `Authorization`.

### 2. Recorrido E2E exigido en `tests/end_to_end/test_store_journey_e2e.py`

Se amplió `test_complete_store_e2e_journey_v1(client)` con TDD pragmático para validar de punta a punta los 10 pasos exactos:
- `a.` `POST /api/v1/auth/registro-completo` → `201` (captura `empresa_id` y `usuario_id`, sin reutilizar el token de registro).
- `b.` `POST /api/v1/token` con `email` y `password` → `200`.
- `c.` Uso exclusivo del `access_token` devuelto por login (`token_type == "bearer"`).
- `d.` `GET /api/v1/me` con ese token → `200` y verificación de `id`, `email`, `empresa_id` y `rol`.
- `e.` `POST /api/v1/productos` (`Panela Huilense 1kg`, `cantidad_actual: 25.0`, `precio_venta: 4500.0`) → `201`.
- `f.` `POST /api/v1/ventas/{empresa_id}` (`cantidad: 4.0`) → `201` y `total == 18000.0`.
- `g.` `GET /api/v1/productos/{producto_id}` → `200` y stock reducido verificado: `25.0 - 4.0 = 21.0`.
- `h.` `GET /api/v1/dashboard/{empresa_id}` → `200`, `ventas_hoy == 1`, `ingresos_hoy == 18000.0`.
- `i.` Simulación de logout stateless eliminando headers (`headers = {}`).
- `j.` `GET /api/v1/me` sin `Authorization` → `401`.

### 3. Comandos ejecutados y resultados

| Comando | Resultado | Tiempo | Exit |
|---|---|---:|---:|
| `.\.venv\Scripts\pytest.exe tests/end_to_end/test_store_journey_e2e.py -v` | **`1 passed, 1 warning`** | `1.00s` | `0` |
| `.\.venv\Scripts\pytest.exe tests -q -rs --maxfail=1` | **`94 passed, 0 failed, 0 skipped, 7 warnings`** | `60.69s` | `0` |
| `.\.venv\Scripts\pytest.exe tests --cov=app --cov-report=term-missing -q -rs --maxfail=1` | **`94 passed, 0 failed, 0 skipped, 7 warnings`** | `65.78s` | `0` |
| `git diff --check` | Limpio (solo avisos LF/CRLF de Git) | n/a | `0` |

### 4. Cobertura observada (antes vs después de S1-2)

- **Antes (S1-1, local `.venv` Py 3.12.13):** `3,297` statements, `668` miss → **`80%`** redondeado (**`79.74%`** exacto).
- **Después (S1-2, local `.venv` Py 3.12.13):** `3,297` statements, `668` miss → **`80%`** redondeado (**`79.74%`** exacto).
- **Delta:** `0` statements (esperado: los endpoints `/token`, `/me` y `/productos/{id}` ya eran ejercitados por tests unitarios/integración; S1-2 cierra la garantía contractual del recorrido completo en una sola sesión E2E). `app/pos_ventas/` se mantiene en `100%` (`30/30`).

> **La IA asistió en ejecución controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-25 17:45 — Ejecución S1-3A (Preparación y verificación PostgreSQL real local + CI)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-25 17:42–17:45 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Entorno local verificado** | `.venv` `Python 3.12.13` · `PostgreSQL 18.3` en `localhost:5432` · base confirmada `gestion_neiva_test` (usuario `postgres`) |
| **Tarea ejecutada** | `S1-3A` — **S1-3 permanece `[ ]`** en `PLAN_ACTIVO.md` hasta confirmar corrida verde en GitHub Actions |
| **Archivos modificados** | Únicamente `.github/workflows/ci.yml`, `PLAN_ACTIVO.md` y `docs/IA_BITACORA.md` |
| **Restricciones respetadas** | Sin cambios en producción, modelos, fachadas, migraciones existentes, frontend, dependencias, `Dockerfile`, `docker-compose.yml` ni `.gitignore`; sin downgrade/re-upgrade (reservado a `S3-3`); `.env` no leído; sin commit ni push. |

### 1. Verificación local de base de pruebas y migraciones Alembic

- **Conexión verificada sin leer `.env`:** `postgresql://postgres:postgres@localhost:5432/gestion_neiva_test` → `current_database() = 'gestion_neiva_test'`, `current_user = 'postgres'`.
- **`alembic current` (antes):** `012` (exit `0`).
- **`alembic upgrade head`:** `Running upgrade 012 -> 013, desacoplar_fks_entre_modulos` (exit `0`).
- **`alembic current` (después):** **`013 (head)`** (exit `0`).

### 2. Pruebas locales con PostgreSQL real (`TEST_POSTGRES_URL`)

| Comando | Ejecutadas | Passed | Failed | Skipped | Warnings | Tiempo | Exit |
|---|---:|---:|---:|---:|---:|---:|---:|
| `.\.venv\Scripts\pytest.exe tests/integration/postgres/ -v` | **5** | **5** | 0 | **0** | 1 | `2.32s` | `0` |
| `.\.venv\Scripts\pytest.exe tests -q -rs --maxfail=1` | **94** | **94** | 0 | **0** | 7 | `57.13s` | `0` |

### 3. Cambios aplicados en `.github/workflows/ci.yml`

- Servicio `postgres` añadido al job `backend-and-governance`: `postgres:16-alpine`, `POSTGRES_USER: postgres`, `POSTGRES_PASSWORD: postgres`, `POSTGRES_DB: gestion_neiva_test`, puerto `5432:5432` y healthcheck `pg_isready -U postgres -d gestion_neiva_test`.
- Nueva etapa `Stage 4 — PostgreSQL Migrations (Alembic 001..013)` previa a `pytest`: ejecuta `alembic upgrade head` y `alembic current` con `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gestion_neiva_test"` (sin downgrade todavía).
- Etapa `Stage 5 — Backend Test Suite & Coverage Report`: conserva `DATABASE_URL="sqlite:///:memory:"`, agrega `TEST_POSTGRES_URL="postgresql://postgres:postgres@localhost:5432/gestion_neiva_test"` para habilitar las 12 pruebas PostgreSQL y conserva cobertura sin umbral (`--cov-fail-under` diferido a `S1-5`).
- Validación YAML vía `yaml.safe_load` en `.venv`: **`YAML_VALID=True`**.

### 4. Condición pendiente para cerrar `S1-3`

- Ejecutar commit selectivo + push (cuando sea autorizado) y verificar una corrida verde real en GitHub Actions donde:
  1. `alembic upgrade head` aplique limpiamente `001`→`013` sobre `postgres:16-alpine` vacío y `alembic current` confirme `013 (head)`.
  2. La suite de backend ejecute **94 pruebas passed** con **0 skipped por PostgreSQL**.

> **La IA asistió en ejecución controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-25 18:40 — Cierre verificado de S1-3 (Evidencia GitHub Actions Run #45722182377)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-25 18:39–18:40 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Commit verificado** | `34e4b66` (`34e4b66532e7bbe1d9870222c5d1cb894eb68296`, `test(ci): run PostgreSQL migrations and E2E journey`) en `origin/main` |
| **Tarea cerrada** | `S1-3` — marcada como `[x]` en `PLAN_ACTIVO.md` (sin cambios de código; sin nuevo commit ni push) |

### Evidencia verificada de GitHub Actions

- **Workflow / Run:** `CI Pipeline — Monolith Governance & QA` · Run `#45722182377` (`https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE/actions/runs/45722182377`)
- **Estado final del workflow:** **`completed / success`** (`2026-11-25T23:32:43Z` → `23:34:12Z`)
- **Jobs:**
  - `Lint, Boundary Check & Backend Tests` (`job/139582963076`): **`completed / success`** (`23:32:45Z` → `23:34:11Z`, 16/16 pasos en verde).
  - `Frontend Voice FSM Tests & Production Build` (`job/139582963525`): **`completed / success`** (`23:32:45Z` → `23:32:58Z`).
- **Stage 4 — PostgreSQL Migrations (Alembic 001..013):**
  - Contenedor `postgres:16-alpine` (`PostgreSQL 16.16 on x86_64-pc-linux-musl`) iniciado y validado con `pg_isready` (`Initialize containers: completed / success`).
  - `alembic upgrade head` aplicó limpiamente las 13 migraciones desde base vacía (`-> 001 -> 002 -> ... -> 012 -> 013, desacoplar_fks_entre_modulos`).
  - `alembic current` reportó **`013 (head)`**.
- **Stage 5 — Backend Test Suite & Coverage Report:**
  - Resultado exacto: **`94 passed, 0 failed, 0 skipped, 7 warnings in 40.86s`** (confirmados los 12 casos PostgreSQL ejecutados sin omitir; en Run `#45298915524` anterior eran `82 passed, 12 skipped`).
  - Cobertura global `app/`: **`80%`** redondeado (**`79.77%`** exacto: `3,297` statements, `667` miss; sube desde `79.34%` / `681` miss en Run `#45298915524`). *(Nota QA para `S1-5`: faltan al menos `8` statements para superar `80.00%` exacto antes de activar `--cov-fail-under=80`.)*
  - Cobertura `app/pos_ventas/`: **`100%`** (`30/30` statements); `app/services/venta_service.py`: `80%` (`60` stmts, `12` miss).
  - Artefacto **`backend-coverage-xml`**: generado y subido (`id: 15072148106`, `9,155 bytes`, `expired: false`, `2026-11-25T23:34:08Z`).
- **Stage 6 — End-to-End Business Journey Simulation (SQLite):**
  - `ALL END-TO-END (E2E) TESTS PASSED SUCCESSFULLY! (100% OK)` (`completed / success`).

> **La IA asistió en verificación controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-25 19:39 — Ejecución S1-4 (Orden determinista de locks ADR-003 y contrato HTTP 422 para stock insuficiente)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-25 19:31–19:39 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Entorno verificado** | `.venv` `Python 3.12.13` · `pytest 7.4.3` · PostgreSQL local `gestion_neiva_test` (rev `013`) |
| **Tarea ejecutada** | `S1-4` — marcada como `[x]` en `PLAN_ACTIVO.md` |
| **Decisión humana aplicada** | Stock insuficiente responde **HTTP 422** (`status.HTTP_422_UNPROCESSABLE_ENTITY`); contrato de "producto inexistente / no pertenece a empresa" permanece en **HTTP 400**; sin `POST /logout`; sin adelantar DAT-03 ni cambios de tenancy. |
| **Archivos modificados** | `app/services/venta_service.py`, `app/inventario/internal/service.py`, `tests/unit/test_domain_unit.py`, `tests/module_integration/test_facades_integration.py`, `tests/test_adversarial_break_system.py`, `PLAN_ACTIVO.md`, `docs/IA_BITACORA.md` (sin commit ni push). |

### 1. Fase TDD RED (pruebas creadas antes de tocar producción)

Comando: `.\.venv\Scripts\pytest.exe tests/unit/test_domain_unit.py::test_registrar_venta_orders_detalles_by_producto_id_deterministically_unit tests/module_integration/test_facades_integration.py::test_checkout_when_stock_insufficient_returns_422_and_preserves_stock -v --tb=short`
- **Resultado RED:** **`2 failed, 1 warning in 0.80s`** (exit `1`):
  1. `test_registrar_venta_orders_detalles_by_producto_id_deterministically_unit`: `AssertionError` — invocó `[UUID('ffffffff-...'), UUID('00000000-...')]` en lugar de `[UUID('00000000-...'), UUID('ffffffff-...')]`.
  2. `test_checkout_when_stock_insufficient_returns_422_and_preserves_stock`: `AssertionError` — `assert 400 == 422`.

### 2. Cambio mínimo de contrato (`400 → 422` y orden determinista)

- `app/services/venta_service.py` (`registrar_venta`): ordena `data.detalles` mediante `sorted(data.detalles, key=lambda item: str(item.producto_id))` antes de invocar `InventarioFacade.validar_y_descontar_stock_atomic`, evitando deadlocks multi-ítem en `SELECT ... FOR UPDATE` (ADR-003).
- `app/inventario/internal/service.py` (`lock_and_deduct_stock`): cambia únicamente la excepción de stock insuficiente (`producto.cantidad_actual < cantidad`) de `HTTP_400_BAD_REQUEST` a `status.HTTP_422_UNPROCESSABLE_ENTITY`; se conserva intacto el `400` para producto inexistente/cross-tenant y el rollback transaccional en `venta_service`.
- `tests/test_adversarial_break_system.py` (`test_ataque_concurrente_hilos_sobreventa_stock_uno`): alineada la expectativa de rechazo por stock insuficiente de `400` a `422` (se mantuvieron en `400` las pruebas de producto cross-tenant y soft-deleted).

### 3. Verificación final (GREEN, PostgreSQL, lint y cobertura)

| Verificación | Comando | Resultado | Tiempo | Exit |
|---|---|---|---:|---:|
| **Pruebas nuevas/modificadas** | `pytest tests/unit/test_domain_unit.py tests/module_integration/test_facades_integration.py tests/test_adversarial_break_system.py::test_ataque_concurrente_hilos_sobreventa_stock_uno -v` | **`8 passed, 3 warnings`** | `3.40s` | `0` |
| **Concurrencia PostgreSQL** | `pytest tests/integration/postgres/ -v` | **`5 passed, 1 warning`** | `1.81s` | `0` |
| **Suite completa** | `pytest tests -q -rs --maxfail=1` | **`96 passed, 0 failed, 0 skipped, 9 warnings`** | `44.72s` | `0` |
| **Suite + cobertura** | `pytest tests --cov=app --cov-report=term-missing -q -rs --maxfail=1` | **`96 passed, 0 failed, 0 skipped, 9 warnings`** | `50.40s` | `0` |
| **Ruff / Import-Linter / Diff** | `ruff check app` + `lint-imports` + `git diff --check` | `All checks passed!` · `7 kept, 0 broken` · limpio | n/a | `0` |

### 4. Cobertura observada (antes vs después de S1-4)

- **Antes (local S1-2/S1-3):** `3,297` stmts, `668` miss → `80%` redondeado (**`79.74%`** exacto); `app/pos_ventas/` = `100%` (`30/30`); `app/services/venta_service.py` = `83%` (`60` stmts, `10` miss).
- **Después (local S1-4):** `3,298` stmts, `668` miss → `80%` redondeado (**`79.75%`** exacto); `app/pos_ventas/` = **`100%`** (`30/30`); `app/services/venta_service.py` = **`84%`** (`61` stmts, `10` miss).

> **La IA asistió en ejecución controlada, pruebas TDD y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-26 18:39 — Ejecución S1-5A (Cobertura de fachadas `>=81%` local y compuertas CI `80%`/`90%`)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-26 18:35–18:40 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Entorno verificado** | `.venv` `Python 3.12.13` · `pytest 7.4.3` · `pytest-cov 6.3.0` · `coverage 7.17.4` · PostgreSQL local `gestion_neiva_test` |
| **Tarea ejecutada** | `S1-5A` — **`S1-5` permanece `[ ]`** en `PLAN_ACTIVO.md` hasta confirmar corrida verde real en GitHub Actions |
| **Archivos modificados** | Únicamente `tests/module_integration/test_facades_integration.py`, `.github/workflows/ci.yml`, `PLAN_ACTIVO.md` y `docs/IA_BITACORA.md` (sin commit ni push). |
| **Restricciones respetadas** | Cero cambios a código de producción (`app/`), frontend, migraciones, dependencias, `.importlinter`, Docker ni contratos API; cero llamadas a LLM, Redis o servicios externos. |

### 1. Pruebas de integración de fachadas añadidas (`tests/module_integration/test_facades_integration.py`)

1. `test_reportes_facade_construir_resumen_diario_returns_immutable_dto`: verifica que `ReportesFacade.construir_resumen_diario(...)` delega al servicio interno sin acceso ORM directo, devuelve `DailyMetricsDTO` con `empresa_id`, `ventas_hoy` e `ingresos_hoy` exactos y rechaza mutación (`FrozenInstanceError`).
2. `test_agente_ia_facade_procesar_turno_delegates_without_external_calls`: parchea `AgentOrchestrator.procesar_mensaje` con `AsyncMock`, valida que `AgenteIaFacade.procesar_turno(...)` delega exactamente `mensaje`, `current_user`, `db` y `conversation_id`, y comprueba la inmutabilidad del contrato `AgentTurnResponseDTO`. Evidencia de cero llamadas externas: `AgentOrchestrator.__init__` inicializa `_session_store=None` e `_intent_provider=None` de forma perezosa y `procesar_mensaje` es interceptado por `AsyncMock`, sin instanciar LLM, Redis ni BD.

### 2. Cobertura exacta local (antes vs después) y compuertas verificadas

| Métrica | Antes (`S1-4`) | Después (`S1-5A`) | Delta |
|---|---:|---:|---:|
| **Statements totales `app/`** | `3,298` | `3,298` | `0` |
| **Statements sin cubrir (`Miss`)** | `668` | **`621`** | **`-47`** |
| **Cobertura global exacta (`--precision=2`)** | `79.75%` | **`81.17%`** | **`+1.42%`** |
| **`app/reportes_analytics/*`** | `0.00%` (`23` miss) | **`100.00%`** (`0` miss) | `+100.00%` |
| **`app/agente_ia/*`** | `0.00%` (`24` miss) | **`100.00%`** (`0` miss) | `+100.00%` |
| **`app/pos_ventas/*` (`--fail-under=90`)** | `100.00%` (`30/30`) | **`100.00%`** (`30/30`) | `0.00%` |

- `coverage report --precision=2 --fail-under=81`: **`81.17%`** (exit `0`).
- `coverage report --include="app/pos_ventas/*" --fail-under=90`: **`100%`** (`30/30`, exit `0`).

### 3. Compuertas configuradas en `.github/workflows/ci.yml` (`Stage 5`)

- `pytest tests/ -q --cov=app --cov-report=xml --cov-report=term-missing --cov-fail-under=80`
- `coverage report --include="app/pos_ventas/*" --fail-under=90` (sin re-ejecutar `pytest`, leyendo el archivo `.coverage` recién generado)
- Conservado el artefacto `backend-coverage-xml` (`coverage.xml`, `if: always()`).

### 4. Condición pendiente para cerrar `S1-5`

- Commit selectivo + push autorizado (incluyendo `S1-4` + `S1-5A`) y verificación de una corrida verde real en GitHub Actions donde pasen ambas compuertas (`--cov-fail-under=80` global y `--fail-under=90` en `app/pos_ventas/*`) con `98 passed / 0 skipped` y artefacto `backend-coverage-xml`.

> **La IA asistió en ejecución controlada, pruebas de integración y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-26 19:11 — Cierre verificado de S1-5 y Sprint 1 (Evidencia GitHub Actions Run #45914762624)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-26 19:10–19:11 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Commit verificado** | `91cdf2b` (`91cdf2b9daa9c300f21609ed288f5e155907ecdb`, `test(quality): enforce coverage gates and checkout contracts`) en `origin/main` |
| **Tarea cerrada** | `S1-5` — marcada como `[x]` en `PLAN_ACTIVO.md` (**Sprint 1 completo `S1-1`..`S1-5`**; sin cambios de código ni nuevo commit/push) |

### Evidencia verificada de GitHub Actions

- **Workflow / Run:** `CI Pipeline — Monolith Governance & QA` · Run `#45914762624` (`https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE/actions/runs/45914762624`)
- **Estado final del workflow:** **`completed / success`** (`2026-11-27T00:06:16Z` → `00:07:44Z`)
- **Job `Lint, Boundary Check & Backend Tests`** (`job/140231210895`): **`completed / success`** (`00:06:18Z` → `00:07:43Z`, 16/16 pasos en verde):
  - `Stage 1..3`: `ruff`, `compileall`, `lint-imports` (`7 kept, 0 broken`) en verde.
  - `Stage 4 — PostgreSQL Migrations (Alembic 001..013)`: `postgres:16-alpine` saludable; `alembic upgrade head` aplicó `001`→`013` desde base vacía; `alembic current` confirmó **`013 (head)`**.
  - `Stage 5 — Backend Test Suite & Coverage Report`:
    - Pytest: **`98 passed, 0 failed, 0 skipped, 9 warnings in 43.01s`**.
    - Compuerta global `--cov-fail-under=80`: **`Required test coverage of 80% reached. Total coverage: 81.20%`** (`3,298` statements, `620` miss).
    - Compuerta `app/pos_ventas/*` (`--fail-under=90`): **`TOTAL 30 0 100%`** (`coverage report --include="app/pos_ventas/*" --fail-under=90`, exit `0`).
    - Artefacto **`backend-coverage-xml`**: generado y subido (`id: 15162095976`, `9,103 bytes`, `expired: false`, `2026-11-27T00:07:40Z`).
  - `Stage 6 — End-to-End Business Journey Simulation (SQLite)`: **`completed / success`**.
- **Job `Frontend Voice FSM Tests & Production Build`** (`job/140231210740`): **`completed / success`** (`00:06:19Z` → `00:06:47Z`):
  - `npm ci`: `completed / success`.
  - `npm run test:voice`: **`4/4 ✅ FSM del Modo Voz verificado`** (`T1`–`T4`).
  - `npm run build`: **`✓ built in 3.69s`**.
- **Warnings observados (no bloqueantes, 0 fallos):** 9× `StarletteDeprecationWarning` conocidos en pytest (`1× httpx/httpx2`, `8× HTTP_422_UNPROCESSABLE_ENTITY → HTTP_422_UNPROCESSABLE_CONTENT`) y aviso informativo de GitHub Actions sobre Node.js 20 en actions v4/v5.

> **La IA asistió en verificación controlada y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-26 19:22 — Ejecución S2-1 (Objetivos táctiles públicos `>=48 px` a `360×800`)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-26 19:18–19:23 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Viewport y motor de medición** | `360×800` px · Playwright + Chrome headless sobre Vite dev server local (`http://127.0.0.1:5175`) |
| **Tarea ejecutada** | `S2-1` — marcada como `[x]` en `PLAN_ACTIVO.md` |
| **Archivos modificados** | Únicamente `frontend/src/pages/LandingPage.jsx`, `frontend/src/pages/Login.jsx`, `frontend/src/pages/Registro.jsx`, `PLAN_ACTIVO.md` y `docs/IA_BITACORA.md` (sin commit ni push). |
| **Artefacto temporal de build** | `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-1-fd541163-14fd-4cab-b5eb-38a927212428` (`frontend/dist` intacto) |

### 1. Medidas DOM reales a `360×800` (antes vs después)

| Ruta | Elemento | Antes (`W × H px`) | Después (`W × H px`) | Estado NFR-10 (`>=48 px`) |
|---|---|---:|---:|---|
| `/` | `scrollWidth / innerWidth` | `360 / 360` (`overflowX: false`) | `360 / 360` (`overflowX: false`) | Sin scroll horizontal ✅ |
| `/` | Header CTA `"Crear cuenta"` | `137.02 × 44` *(right: `362.38`)* | **`137.02 × 48`** *(right: `344.0`)* | Cumple `>=48 px` y sin recorte ✅ |
| `/` | Hero CTA principal | `328 × 76` | `328 × 76` | Cumple `>=48 px` ✅ |
| `/` | Hero CTA `"Ver cómo funciona"` | `328 × 54` | `328 × 54` | Cumple `>=48 px` ✅ |
| `/login` | `scrollWidth / innerWidth` | `360 / 360` (`overflowX: false`) | `360 / 360` (`overflowX: false`) | Sin scroll horizontal ✅ |
| `/login` | Input `email` | `278 × 46` | **`278 × 48`** | Cumple `>=48 px` ✅ |
| `/login` | Input `password` | `278 × 46` | **`278 × 48`** | Cumple `>=48 px` ✅ |
| `/login` | Botón submit `"Entrar a mi Tienda"` | `278 × 48` | **`278 × 48`** (`min-h-12`) | Cumple `>=48 px` ✅ |
| `/login` | Enlace `"Volver a la página principal"` | `168.97 × 16` | **`168.97 × 48`** | Cumple `>=48 px` ✅ |
| `/registro` | `scrollWidth / innerWidth` | `360 / 360` (`overflowX: false`) | `360 / 360` (`overflowX: false`) | Sin scroll horizontal ✅ |
| `/registro` | Input `nombre_comercial` | `278 × 46` | **`278 × 48`** | Cumple `>=48 px` ✅ |
| `/registro` | Input `nit_o_cedula` | `278 × 46` | **`278 × 48`** | Cumple `>=48 px` ✅ |
| `/registro` | Input `email` | `278 × 46` | **`278 × 48`** | Cumple `>=48 px` ✅ |
| `/registro` | Input `password` | `278 × 46` | **`278 × 48`** | Cumple `>=48 px` ✅ |
| `/registro` | Botón submit `"Crear mi Tienda"` | `278 × 48` | **`278 × 48`** (`min-h-12`) | Cumple `>=48 px` ✅ |
| `/registro` | Enlace `"Volver a la página principal"` | `168.97 × 16` | **`168.97 × 48`** | Cumple `>=48 px` ✅ |

### 2. Verificaciones de pruebas, build aislado e higiene

- `npm run test:voice`: **`4/4 ✅ FSM del Modo Voz verificado`** (exit `0`).
- `npm run build -- --outDir C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-1-fd541163-14fd-4cab-b5eb-38a927212428`: **`✓ built in 7.12s`** (exit `0`; `frontend/dist` no fue modificado).
- `git diff --check`: exit `0`.

> **La IA asistió en medición DOM, ajustes mínimos de UI y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-26 19:45 — Ejecución S2-2 (Shell autenticado, carrito y ventas a `360×800`)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-26 19:37–19:46 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Entorno de prueba** | Exclusivamente local: uvicorn `127.0.0.1:8000` sobre `postgresql://postgres:postgres@localhost:5432/gestion_neiva_test` (`.env` no leído) + Vite dev `127.0.0.1:5175` + Playwright/Chrome headless (`360×800`). Cero datos en producción/Vercel. |
| **Datos de prueba locales** | Cuentas efímeras de prueba en `gestion_neiva_test`: `s2_2_a3386f58@example.com` (antes) y `s2_2_a574c38f@example.com` (después) + producto `Panela Prueba Local 1kg`. *(Nota: `@test.invalid` fue rechazado con HTTP `422` por Pydantic `EmailStr` / `email-validator` por TLD reservado de uso especial; se usó dominio RFC 2606 `@example.com`, exclusivamente en la BD local de pruebas.)* |
| **Tarea ejecutada** | `S2-2` — marcada como `[x]` en `PLAN_ACTIVO.md` |
| **Archivos modificados** | `frontend/src/components/layout/Header.jsx`, `frontend/src/components/layout/Sidebar.jsx`, `frontend/src/components/CartSidebar.jsx`, `frontend/src/pages/Ventas.jsx`, `PLAN_ACTIVO.md`, `docs/IA_BITACORA.md` (`AgentWidget.jsx`, `MostradorMode.jsx` y `Layout.jsx` sin cambios; sin commit ni push). |
| **Artefacto temporal de build** | `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-2-b8e6e4c4-453e-4ac4-8118-8ab5100c3c87` (`frontend/dist` intacto) |

### 1. Overflow horizontal por ruta autenticada (`360×800`)

| Ruta | `docScrollWidth` (antes → después) | `headerScrollWidth` (antes → después) | `mainScrollWidth` (antes → después) | Estado |
|---|---:|---:|---:|---|
| `/dashboard` | `360 → 360` | `360 → 360` | `360 → 360` | Sin overflow ✅ |
| `/inventario` | `360 → 360` | `360 → 360` | `360 → 360` | Sin overflow ✅ |
| `/ventas` (y `Histórico`) | `360 → 360` | `360 → 360` | `360 → 360` | Sin overflow ✅ |
| `/soporte` | `360 → 360` | `360 → 360` | `362 → 362` *(+2 px en `Soporte.jsx`)* | `docScrollWidth` OK; `+2 px` interno en `Soporte.jsx` registrado para `S2-3` |

### 2. Controles táctiles medidos a `360×800` (antes vs después)

| Área / Control | Antes (`W × H px`) | Después (`W × H px`) | Estado (`>=48×48 px`) |
|---|---:|---:|---|
| `Header`: `Abrir menú` | `22 × 22` | **`48 × 48`** | ✅ |
| `Header`: `Modo Voz` | `34 × 26` | **`48 × 48`** | ✅ |
| `Header`: `Chat IA` | `36 × 28` | **`48 × 48`** | ✅ |
| `Header`: `Carrito` | `40 × 28` | **`48 × 48`** | ✅ |
| `Header`: `Cerrar sesión` | `36 × 28` | **`48 × 48`** | ✅ |
| `Sidebar`: `Cerrar menú` | `18 × 18` | **`48 × 48`** | ✅ |
| `Sidebar`: 7 enlaces `NavLink` | `232 × 44` | **`232 × 48`** | ✅ |
| `CartSidebar`: `Cerrar drawer` | `16.34 × 20` | **`48 × 48`** | ✅ |
| `CartSidebar`: `Botón restar (−)` | `28 × 28` | **`48 × 48`** | ✅ |
| `CartSidebar`: `Botón sumar (+)` | `28 × 28` | **`48 × 48`** | ✅ |
| `CartSidebar`: `Eliminar ítem` | `11.44 × 20` | **`48 × 48`** | ✅ |
| `CartSidebar`: `Cobrar venta` | `328 × 48` | **`328 × 48`** | ✅ |
| `CartSidebar`: `Vaciar carrito` | `328 × 20` | **`328 × 48`** | ✅ |
| `Cart Modal`: `Cancelar` / `Confirmar venta` | `142 × 42` | **`142 × 48`** | ✅ |
| `Ventas`: Tabs `Actividad del Día` / `Histórico` | `144.47 × 32` / `100.95 × 32` | **`160 × 48`** / **`160 × 48`** | ✅ |
| `Ventas`: `Día anterior` / `Día siguiente` | `36 × 36` | **`48 × 48`** | ✅ |
| `Ventas`: `Select cajero` / `Refrescar` | `252 × 36` / `34 × 34` | **`238 × 48`** / **`48 × 48`** | ✅ |
| `Ventas Histórico`: Tabs `Hoy` / `Semana` / `Histórico` | `104 × 36` | **`104 × 48`** | ✅ |

### 3. Verificación interactiva, colisiones, pruebas y build

- **Sidebar:** abre (`x: 0`) y cierra (`x: -256`); navegación verificada hacia `/ventas`, `/inventario`, `/soporte` y `/dashboard`.
- **Carrito & Checkout:** abre (`x: 0`) y cierra (`x: 360`); hit-test `elementFromPoint` positivo en `Cobrar venta` (`clickable: true`) y `Confirmar venta` (`clickable: true`).
- **`AgentWidget` / `MostradorMode`:** cerrado usa `pointer-events-none` (sin bloquear controles); abierto ocupa `331.19 × 540 px` (`x: 8.81..340.0`, `docScrollWidth: 360`, `overflowX: false`). No requirió modificaciones.
- **`npm run test:voice`:** `4/4 ✅ FSM del Modo Voz verificado` (exit `0`).
- **Build Vite aislado en `%TEMP%`:** `✓ built in 7.17s` en `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-2-b8e6e4c4-453e-4ac4-8118-8ab5100c3c87` (exit `0`, `frontend/dist` intacto).
- **`git diff --check`:** exit `0`.

> **La IA asistió en medición DOM, ajustes mínimos de UI y documentación; las decisiones y validación final corresponden al equipo humano.**


---

## Sesión 2026-11-26 19:57 — Ejecución S2-3 (Catálogo, Dashboard, ModalProducto y Soporte a `360×800`)

| Campo | Detalle |
|---|---|
| **Fecha y hora local** | 2026-11-26 19:52–19:58 (`-05:00`, America/Bogota) |
| **Herramienta / Modelo** | Antigravity (rol ejecutor técnico) · Gemini 4 Neon |
| **Repositorio** | `C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE` |
| **Entorno de prueba** | Exclusivamente local: uvicorn `127.0.0.1:8000` sobre `postgresql://postgres:postgres@localhost:5432/gestion_neiva_test` (`.env` no leído) + Vite dev `127.0.0.1:5175` + Playwright/Chrome headless (`360×800`). |
| **Datos de prueba locales** | Cuentas efímeras en `gestion_neiva_test`: `s2_3_93b25c3f@example.com` (antes) y `s2_3_6c41141e@example.com` (después), cada una con producto `Yogurt Griego Prueba S2-3` (stock `4`, vencimiento `+5d`), `1` venta y `1` ticket de soporte (`Prueba responsividad soporte S2-3`). Exclusivamente BD local de pruebas. |
| **Tarea ejecutada** | `S2-3` — marcada como `[x]` en `PLAN_ACTIVO.md` |
| **Archivos modificados** | `frontend/src/pages/Dashboard.jsx`, `frontend/src/pages/Inventario.jsx`, `frontend/src/pages/Soporte.jsx`, `frontend/src/components/ProductoCard.jsx`, `frontend/src/components/ModalProducto.jsx`, `PLAN_ACTIVO.md`, `docs/IA_BITACORA.md` (sin commit ni push). |
| **Artefacto temporal de build** | `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-3-0bbb8554-f21e-4b8c-98b6-6a4e00c08603` (`frontend/dist` intacto) |

### 1. Overflow horizontal por ruta y estado (`360×800`)

| Ruta / Estado | `docScrollWidth` (antes → después) | `mainScrollWidth` (antes → después) | Estado |
|---|---:|---:|---|
| `/dashboard` (vacío y con datos/Recharts/alertas) | `360 → 360` | `360 → 360` | Sin overflow ✅ |
| `/inventario` (vacío, con datos y error 500 simulado) | `360 → 360` | `360 → 360` | Sin overflow ✅ |
| `/soporte` (vacío) | `360 → 360` | **`362 → 360`** | Corregido (`-2 px`) ✅ |
| `/soporte` (lista y detalle de ticket) | `360 → 360` | **`362 → 360`** | Corregido (`-2 px`) ✅ |
| `/soporte` (error 500 simulado) | `360 → 360` | **`362 → 360`** | Corregido (`-2 px`) ✅ |

### 2. Controles y modales medidos a `360×800` (antes vs después)

| Componente / Control | Antes (`W × H px`) | Después (`W × H px`) | Estado (`>=48 px`) |
|---|---:|---:|---|
| `Dashboard`: Recharts `BarChart` SVG | `286 × 220` (`x: 37..323`) | `286 × 220` (`x: 37..323`) | Sin overflow ✅ |
| `Inventario`: Input búsqueda / `+ Producto` | `212.3 × 38` / `103.7 × 38` | **`216.3 × 48`** / **`103.7 × 48`** | ✅ |
| `ProductoCard`: `Agregar` / `Editar` / `Eliminar` | `191.53 × 44` / `43.23 × 44` / `43.23 × 44` | **`182 × 48`** / **`48 × 48`** / **`48 × 48`** | ✅ |
| `ModalProducto`: Contenedor (`W`, scroll Y) | `328 == 328`, `overflowY: auto` | `328 == 328`, `overflowY: auto` (`720/977`) | Sin overflow X ✅ |
| `ModalProducto`: `Cerrar (X)` / `Cámara` | `16.34 × 20` / `50.72 × 38` | **`48 × 48`** / **`48 × 48`** | ✅ |
| `ModalProducto`: Inputs / Selects | `280 × 38..39` | **`280 × 48`** (`codigo_barras: 224 × 48`) | ✅ |
| `ModalProducto`: `Cancelar` / `Guardar` | `135 × 42` / `133 × 42` | **`135 × 48`** / **`133 × 48`** | ✅ |
| `Soporte`: `Actualizar` / `Nuevo Ticket` | `50 × 38` / `302 × 44` | **`48 × 48`** / **`302 × 48`** | ✅ |
| `Soporte`: `Ver video` / `Reactivar guía` | `139.66 × 48` / `146.34 × 50` | **`294 × 48`** / **`294 × 48`** | ✅ |
| `Soporte`: `Textarea respuesta` / `Enviar` | `34 × 86 (x:385)` / `56 × 40 (x:427)` | **`238 × 86 (x:33..271)`** / **`48 × 48 (x:279..327)`** | Visible y `>=48 px` ✅ |
| `Soporte Modal`: `Cerrar (X)` / `Asunto` / `Cancelar` / `Enviar` | `20×20` / `280×42` / `135×46` / `133×46` | **`48×48`** / **`280×48`** / **`135×48`** / **`133×48`** | ✅ |

### 3. Pruebas, build aislado e higiene

- `npm run test:voice`: **`4/4 ✅ FSM del Modo Voz verificado`** (exit `0`).
- Build Vite aislado: **`✓ built in 6.42s`** en `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-3-0bbb8554-f21e-4b8c-98b6-6a4e00c08603` (exit `0`, `frontend/dist` intacto).
- `git diff --check`: exit `0`.

> **La IA asistió en medición DOM, correcciones responsive y documentación; las decisiones y validación final corresponden al equipo humano.**

---

## Sesión 2026-11-27 — S2-4A: Automatización móvil `360×800`, auditoría Lighthouse y preparación CI

### Contexto y alcance

- **Microtarea:** `S2-4A` (único bloque ejecutado; `S2-4` permanece **`[ ]`** en `PLAN_ACTIVO.md` hasta confirmar corrida verde en GitHub Actions de los nuevos pasos móviles en `frontend-verify`).
- **Archivos añadidos / modificados en alcance:**
  - `frontend/package.json` y `frontend/package-lock.json` (scripts `test:mobile`, `test:lighthouse` y `devDependencies` declaradas con `^` en `package.json`, con versiones resueltas en `package-lock.json` y reproducibles mediante `npm ci`: `@playwright/test@1.65.1`, `lighthouse@13.6.0`).
  - `frontend/tests/mobile/playwright.config.mjs` (viewport `360×800`, `outputDir: './.cache/test-results'` ignorado por git).
  - `frontend/tests/mobile/mobile-360.spec.mjs` (3 specs públicas + 1 spec E2E autenticado local completo).
  - `frontend/tests/mobile/run-mobile-e2e.mjs` (runner Node ESM multiplataforma: levanta uvicorn contra `gestion_neiva_test` local cuando `MOBILE_PUBLIC_ONLY !== '1'` y Vite dev en `127.0.0.1:5175`, ejecuta Playwright local y cierra procesos hijos en `finally`).
  - `frontend/tests/mobile/run-lighthouse-mobile.mjs` (runner Node ESM multiplataforma: compila SPA en `%TEMP%/gestion-inventario-s2-4-<uuid>`, sirve `vite preview` en `127.0.0.1:4176`, ejecuta Lighthouse móvil `360×800` usando Chromium empaquetado de Playwright `159.0.8154.6` y exige accesibilidad `>= 90`).
  - `.github/workflows/ci.yml` (pasos añadidos en `frontend-verify`: instalación de Chromium de Playwright, `MOBILE_PUBLIC_ONLY=1 npm run test:mobile` y `npm run test:lighthouse`; sin secretos, sin producción y sin tocar `frontend/dist`).
  - `PLAN_ACTIVO.md` y `docs/IA_BITACORA.md`.
- **Intactos:** componentes de producto (`0` defectos nuevos descubiertos), backend de producción, migraciones, `frontend/dist`, `factory/`, ADRs y `.env`.

### 1. Resultado de suite Playwright móvil `360×800`

| Comando / Modo | Resultado | Detalle por ruta / flujo |
|---|---|---|
| `npm run test:mobile` (completo local) | **`4 passed (48.1s)`**, exit `0` | 1) `/` landing (`0 px` overflow, CTAs `>=48 px`, `right <= 360`); 2) `/login` (`0 px` overflow, inputs/submit/volver `>=48 px`); 3) `/registro` (`0 px` overflow, 4 inputs/submit/volver `>=48 px`); 4) Recorrido autenticado local (`10.8s`). |
| Recorrido autenticado local (`s2_4_<hex>@example.com`, BD local `gestion_neiva_test`) | **Pasó ✅** | Registro API local + semilla de producto y ticket → Login UI en `/login` → `/dashboard` (`doc/header/main == 360`, 5 botones header `>=48×48`) → Sidebar drawer → `/inventario` + `ProductoCard` + `ModalProducto` (`scrollWidth <= clientWidth`, `overflowY: auto`, cierre limpio) → `CartSidebar` + cobro real (`Venta registrada`) → `/ventas` (tabs `Actividad del Día` / `Histórico`) → `/soporte` (detalle + textarea/botón `Enviar` `48×48` dentro de `360 px`) → `Cerrar sesión` (`access_token === null` + `/login`). |

> **Nota sobre datos de prueba:** Todas las entidades creadas en el recorrido autenticado residen exclusivamente en la base local `gestion_neiva_test` con correo reservado `@example.com` (RFC 2606) y clave de prueba local, sin leer `.env` ni tocar servicios externos o Vercel.

### 2. Resultado de auditoría Lighthouse móvil (`360×800`, `formFactor: 'mobile'`)

- **Build aislado (sin tocar `frontend/dist`):** `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-4-078d18f3-c6c0-4a0a-b527-6467d13680f0`
- **Resumen JSON:** `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-4-078d18f3-c6c0-4a0a-b527-6467d13680f0\lighthouse-reports\summary.json`

| Ruta | Accesibilidad móvil | Umbral (`>=90`) | Hallazgos no bloqueantes observados | Reportes generados |
|---|---:|---|---|---|
| `/` | **`95 / 100`** | ✅ | `color-contrast` | `lighthouse-landing.json` / `lighthouse-landing.html` |
| `/login` | **`90 / 100`** | ✅ | `color-contrast`, `landmark-one-main` | `lighthouse-login.json` / `lighthouse-login.html` |
| `/registro` | **`90 / 100`** | ✅ | `color-contrast`, `landmark-one-main` | `lighthouse-registro.json` / `lighthouse-registro.html` |

### 3. Regresión, preparación CI y condición de cierre de `S2-4`

- `npm run test:voice`: **`4/4 ✅ FSM del Modo Voz verificado`** (exit `0`).
- `.github/workflows/ci.yml` (`frontend-verify`): se configuró ejecución pública determinista en CI (`MOBILE_PUBLIC_ONLY=1 npm run test:mobile` + `npm run test:lighthouse`), mientras el recorrido autenticado con PostgreSQL local queda ejecutable vía `npm run test:mobile`.
- **Condición exacta para cerrar `S2-4` (`[x]`):** realizar commit/push autorizado y verificar una corrida verde en GitHub Actions donde el job `frontend-verify` pase `Install Playwright Chromium for Mobile QA`, `Run Mobile 360x800 Public Viewport Tests` (`3 passed, 1 skipped`) y `Run Mobile Lighthouse Accessibility Audit (>=90)`.

> **La IA asistió en automatización de pruebas, auditoría Lighthouse, configuración de CI y documentación; las decisiones y validación final corresponden al equipo humano.**

---

## Sesión 2026-11-27 — S2-4B: Evidencia descargable de QA móvil en GitHub Actions (`frontend-mobile-qa-evidence`)

### Cambios realizados (sin modificar componentes de producción)

1. `frontend/tests/mobile/run-lighthouse-mobile.mjs`: soporte opcional de `LIGHTHOUSE_REPORTS_DIR`. Si se define, guarda allí `lighthouse-*.json`, `lighthouse-*.html` y `summary.json` (resuelto respecto a `frontend/`); si no se define, conserva la salida dentro del directorio temporal. El build de Vite permanece aislado en `%TEMP%/gestion-inventario-s2-4-<uuid>` sin tocar `frontend/dist`.
2. `.github/workflows/ci.yml` (`frontend-verify`):
   - Ejecución de Lighthouse con `LIGHTHOUSE_REPORTS_DIR: ".cache/lighthouse"`.
   - Nuevo paso `Upload Mobile QA & Lighthouse Evidence` (`actions/upload-artifact@v4`, `if: always()`, `if-no-files-found: ignore`) con nombre `frontend-mobile-qa-evidence` para subir `frontend/tests/mobile/.cache/test-results` y `frontend/.cache/lighthouse`.
3. `PLAN_ACTIVO.md` y `docs/IA_BITACORA.md`: corrección de redacción sobre dependencias (`package.json` con `^`, versiones resueltas en `package-lock.json` y reproducibles mediante `npm ci`) y registro de evidencia `S2-4B`. `S2-4` permanece **`[ ]`** hasta la corrida verde en GitHub Actions.

### Verificación local ejecutada

- Validación YAML `.github/workflows/ci.yml`: OK (`frontend-verify` con `9` pasos; paso final `Upload Mobile QA & Lighthouse Evidence`).
- `npm run test:voice`: **`4/4 ✅ FSM del Modo Voz verificado`** (exit `0`).
- `MOBILE_PUBLIC_ONLY=1 npm run test:mobile`: **`3 passed, 1 skipped (10.2s)`** (exit `0`).
- `LIGHTHOUSE_REPORTS_DIR=.cache/lighthouse npm run test:lighthouse`: exit `0`, build aislado en `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-4-44462b56-3d56-4ed2-95c1-84fe1c357050` (`✓ built in 9.80s`, `frontend/dist` intacto), accesibilidad **`/` = `95`**, **`/login` = `90`**, **`/registro` = `90`**.
- Evidencia generada en `frontend/.cache/lighthouse/` (ignorado por `.gitignore` mediante `.cache/`):
  - `lighthouse-landing.html` (`325,270 B`), `lighthouse-landing.json` (`168,454 B`)
  - `lighthouse-login.html` (`274,725 B`), `lighthouse-login.json` (`110,788 B`)
  - `lighthouse-registro.html` (`287,970 B`), `lighthouse-registro.json` (`127,482 B`)
  - `summary.json` (`2,540 B`)
- `git diff --check`: exit `0`.

> **La IA asistió en la parametrización de reportes Lighthouse, configuración de artefactos CI y actualización documental; las decisiones y validación final corresponden al equipo humano.**

---

## Sesión 2026-11-27 — Cierre documental de Sprint 2 (Web móvil responsive `S2-1`..`S2-4`)

### Evidencia verificada de cierre

- **Commit de implementación:** `2ee5ddc` (`2ee5ddc15ec4678281ea1cb960d4f7a327af25ac`) — `test(mobile): enforce 360px responsive QA in CI`.
- **GitHub Actions Run `#46019358053`:** https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE/actions/runs/46019358053 (`completed / success`).
  - `Frontend Voice FSM Tests & Production Build` (`job/140574655695`, `1m28s`): **`success`** (`4/4` Voice FSM, SPA build `3.86s`, Playwright público **`3 passed / 1 skipped`** en `5.3s`, Lighthouse móvil accesibilidad **`95 / 90 / 90`** en `/`, `/login` y `/registro` con build aislado en `/tmp`).
  - `Lint, Boundary Check & Backend Tests` (`job/140574656222`, `1m25s`): **`success`** (Stages 1..6 + `backend-coverage-xml` ID `15206822949`).
- **Artefacto móvil descargable:** **`frontend-mobile-qa-evidence`** (`Artifact ID: 15206887974`, `7 files uploaded`, `355,028 bytes`, `expired: false`).
- **Archivo histórico creado:** `docs/audits/planes-cerrados/2026-11-27-sprint-2-web-movil-responsive.md` (con `S2-4` marcado como `[x]` y detalle íntegro de `S2-1`..`S2-4`).
- **`PLAN_ACTIVO.md`:** sección detallada de Sprint 2 reemplazada por referencia breve al archivo cerrado en `docs/audits/planes-cerrados/`.

> **La IA asistió en la verificación y documentación del cierre de Sprint 2; la validación final corresponde al equipo humano.**

---

## Sesión 2026-11-27 — S3-1: Redacción de `ADR-006` (DAT-03: aislamiento de tenancy, snapshots históricos y no borrado físico)

### Alcance y verificación documental

- **Microtarea:** `S3-1` exclusivamente (sin cambios en `app/`, migraciones `alembic/`, fachadas, routers ni `ADR-001`–`ADR-005`).
- **Archivos creados / actualizados:**
  - `05-architecture/decisions/records/ADR-006-aislamiento-tenancy-uuid-fachadas.md`: documenta el desacople de las 4 FKs cruzadas `empresa_id -> empresas.id` (`productos`, `ventas`, `soporte_tickets`, `agent_commands`) mediante UUID indexado + `AuthTenancyFacade`, la conservación de las 3 FKs intra-módulo (`usuarios.empresa_id`, `detalles_venta.venta_id`, `soporte_mensajes.ticket_id`), la auditoría de campos históricos en `detalles_venta` (`precio_unitario`, `cantidad` y `subtotal` ya existentes; `producto_nombre_snapshot` faltante; `codigo_barras`/`unidad_medida` evaluados como opcionales), la política de soft-delete/cierre/archivo y no borrado físico, alternativa descartada de FKs cruzadas, estrategia de reversión de migración `014` y criterios de prueba para `S3-2`–`S3-5`.
  - `05-architecture/decisions/README.md`: `ADR-006` indexado en la tabla de registros sin alterar `ADR-001`–`ADR-004` ni tocar `ADR-005`.
  - `PLAN_ACTIVO.md`: `S3-1` marcado como `[x]` con evidencia y comando de validación documental.
- **Comando de validación documental:** `git diff 05-architecture/decisions/records/ADR-001* 05-architecture/decisions/records/ADR-002* 05-architecture/decisions/records/ADR-003* 05-architecture/decisions/records/ADR-004* 05-architecture/decisions/records/ADR-005* && git diff --check` (0 cambios en `ADR-001`..`ADR-005`, `git diff --check` exit `0`).

> **La IA asistió en la inspección del esquema y redacción de `ADR-006` y documentación asociada; las decisiones arquitectónicas y validación final corresponden al equipo humano.**

---

## Sesión 2026-11-27 — S3-1B: Enmienda aprobada a `ADR-006` (decisiones técnicas previas a `S3-2`)

### Decisiones técnicas con aprobación humana incorporadas (solo documentación)

1. **Retiro total de relaciones ORM cross-module (sin `viewonly=True`):** se elimina la propuesta de mantener relaciones ORM cruzadas con `viewonly=True`; el historial de ventas usará exclusivamente snapshots de `detalles_venta`, sin `joinedload` ni lectura viva de `Producto`.
2. **Separación explícita de migraciones:**
   - `014`: retiro reversible de las 4 FKs cruzadas de `empresa_id` e índices de tenancy.
   - `015`: snapshots históricos, backfill, respuesta de ventas sin `joinedload` e índice único parcial de código de barras en `productos`.
3. **Snapshots fijos en `detalles_venta`:** `producto_nombre_snapshot`, `producto_codigo_snapshot` y `producto_unidad_snapshot` (sin duplicar `precio_unitario`, `cantidad` ni `subtotal`), distinguiendo compatibilidad `nullable` durante backfill para filas antiguas frente a obligación estricta en ventas nuevas.
4. **Política de identidad de producto:** un producto inactivo con movimientos históricos no se reactiva ni sobrescribe automáticamente en `crear_producto()`; `015` reemplaza `uq_producto_empresa_barras` por índice único parcial `WHERE is_active = true`; cada creación genera UUID nuevo (cualquier recuperación futura requerirá operación explícita de reactivación).
5. **Contrato de tenancy anti-enumeración:** `AuthTenancyFacade.ensure_active_company()` conserva **HTTP `404` uniforme** para empresa inexistente o inactiva.
6. **Validación documental:** `0` modificaciones en `ADR-001`–`ADR-005`, `0` cambios en código/migraciones/pruebas, `git diff --check` exit `0`.

> **La IA asistió en la redacción de la enmienda `S3-1B` y sincronización documental; las decisiones técnicas fueron aprobadas y son validadas por el equipo humano.**
