# PLAN ACTIVO — Gestión Neiva + Fábrica de Agentes IA

**Fecha:** 2026-11-10
**Sprint activo:** Sprint 9 — Despliegue y Activación en Producción
**🟢 ESTADO DEL PLAN: PAUSA LEVANTADA** — Sprint 10 completado con éxito tras auditoría conjunta:
se descartó la dependencia bloqueante de video en el Hero y se implementó el showcase táctil
en vivo `LiveDemoPos.jsx` con tres ganchos conductuales (fuga invisible, sorteo en tickets y programa Comercio Hermano).
El frontend compila limpio y sin errores (`vite build` exitoso).

> Este documento es **mutable por Antigravity y Gemini**. Ver `AGENTS.md` para el protocolo de cambios.
> Usa `> [GEMINI PROPONE]` o `> [ANTIGRAVITY PROPONE]` para proponer cambios sin implementarlos aún.

---

## Estado general

```
[✅] Sprint 2 — Auth funcional, layout conectado, bugs críticos resueltos
[✅] Sprint 3 — MVP cerrado (flujo end-to-end en producción verificado)
[✅] Sprint 3.5 — Features gancho: vencimiento, granel, categorías, escáner
[✅] Sprint 3.6 — Historial de ventas con tabs y filtro por fecha
[✅] Sprint 3.8 — Cierre brechas SRS: categorías, escáner, responsividad
[✅] Sprint 4 — Fundamentos de la fábrica (docs + templates + workflows)
[✅] Sprint 5 — Pipeline funcional tier basic (COMPLETO)
[✅] Sprint 6 — Template medium (COMPLETO)
[✅] Sprint 7 — Template professional (Diseño & Especificaciones en factory/templates/professional/ COMPLETO)
[✅] Sprint 7.8 — Fusión e Integración del ERP Distribuidora en el POS (COMPLETO)
[✅] Sprint 7.9 — Agente IA In-App Orientado a Tareas para Tier Pro (COMPLETO)
[✅] Sprint 8.1 — RBAC (Dueño vs. Cajero), Actividad del Día y Límite de Cajeros por Plan (COMPLETO)
[✅] Sprint 8.2 — Transformación Web Informativa + Onboarding Educativo No Bloqueante (COMPLETO)
[✅] Sprint 8.3 — Gobernanza RBAC en Asistente IA, Reabastecimiento con Costo y Latencia Cero (COMPLETO)
[✅] Sprint 8.4 — Entitlements (Trial 15 Días), Normalización Errores 422, UI Pro en Header (COMPLETO)
[✅] Sprint 10 — Landing Premium Dark-First: Live Ledger POS + 3 Ganchos Conductuales (COMPLETO)
[ ] Sprint 9 — Despliegue y Activación en Producción (SIGUIENTE)
[ ] Sprint 10.5 — Redefinición de Alcance: SaaS vertical microempresarial + Modo Lite "Solo Stock" (DECISIÓN DEL DUEÑO — detalla tras el landing)
[ ] Sprint 11 — Módulo Móvil Flutter: Escaneo Enriquecido Anti-Fricción y POS Offline-First (PROPUESTA GEMINI)
```

> [GEMINI PROPONE] Sprint 11 — Módulo Móvil Flutter: Escaneo Enriquecido Anti-Fricción y POS Offline-First
> **Motivo:** El frontend web móvil actual presenta alta fricción en onboarding (4-5 horas para digitar 300 productos manualmente) y vulnerabilidad operativa ante caídas de red o cortes de luz en tiendas de barrio.
> **Propuesta:** Desarrollar app móvil nativa en Flutter (APK liviano) con base local SQLite (`drift`), escaneo ML Kit on-device, catálogo maestro Top 10k Colombia offline y motor Outbox de sincronización con idempotencia en FastAPI. Ver especificación detallada en `docs/spec/PROPUESTA_ARQUITECTURA_FLUTTER_OFFLINE_FIRST.md` y `05-architecture/decisions/records/ADR-005-flutter-offline-first-mobile.md`.
> **Impacto:** Reduce el tiempo de registro por producto de 45s a 3s (onboarding de 200 productos en 12 minutos), permite ventas ininterrumpidas sin internet y mantiene costo cero en APIs externas.

---

## Sprint 5 — Pipeline funcional tier basic

**Objetivo:** ejecutar el pipeline `build-basic.md` de punta a punta con un sistema demo real, medir costos reales y tener algo que mostrar a un primer cliente.

**La meta concreta:** construir **"POS Papelería"** — un segundo sistema básico usando la fábrica, que sirva como demo y validación del pipeline.

| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 1 | Definir requirements de POS Papelería (texto libre) | `factory/jobs/pos-papeleria/requirements.txt` | ✅ |
| 2 | [Gemini] Analizar requirements → JSON estructurado | `factory/jobs/pos-papeleria/requirements.json` | ✅ |
| 3 | [Architect] Schema DB + contratos API adaptados | `factory/jobs/pos-papeleria/schema.md` + `api-contracts.md` | ✅ |
| 4 | [Haiku] Backend: models + schemas + migration | `factory/jobs/pos-papeleria/` | ✅ |
| 5 | [Haiku] Backend: routers + services | `factory/jobs/pos-papeleria/` | ✅ |
| 6 | [Sonnet] Frontend adaptado | `factory/jobs/pos-papeleria/` | ✅ |
| 7 | [Gemini] QA review completo | `factory/jobs/pos-papeleria/qa-report.md` | ✅ |
| 8 | [Haiku] DevOps: docker-compose + README deploy | `factory/jobs/pos-papeleria/` | ✅ |
| 9 | Medir costo real en tokens y tiempo | `factory/jobs/pos-papeleria/METRICAS.md` | ✅ |
| 10 | Landing page simple para mostrar el portafolio | `docs/landing/` | ✅ Hecho |

### Criterios de éxito Sprint 5

1. POS Papelería corre en local: `login → inventario → venta → reporte`
2. Costo real de tokens documentado en `METRICAS.md`
3. Tiempo real de construcción documentado (debe ser < 4 horas)
4. QA report sin issues críticos
5. Hay algo que mostrarle a un potencial cliente (demo o landing)

### Resultado Sprint 5

✅ **34/34 tests passing** — 0 issues críticos en QA  
✅ `qa-report.md`, `docker-compose.yml`, `README.md`, `METRICAS.md` entregados  
✅ Landing Page ultra-premium interactiva con configurador completada en `docs/landing/`  
✅ Costo real: ~$0.22 USD | Tiempo: ~4.5 horas  

### Próximo paso (Sprint 6)

> Definir template medium: módulos de proveedores, compras, cuentas por pagar.


---

## Sprint 3 — Cierre MVP Gestión Neiva

**Objetivo:** ciclo completo `login → inventario → venta → reporte` funciona sin errores.

| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 1 | CartSidebar en el layout | `Layout.jsx` | ✅ Hecho |
| 2 | Fix unique barcode global → por empresa | `models.py` + migration 002 | ✅ Hecho |
| 3 | Dashboard con métricas reales | `Dashboard.jsx` + `routers/dashboard.py` | ✅ Hecho |
| 4 | Correr migration 002 en BD | `alembic upgrade head` | ✅ Hecho |
| 5 | Probar flujo end-to-end | Manual: login → producto → venta | ✅ Hecho |
| 6 | Tests auth básicos | `tests/test_auth.py` | ✅ Hecho |
| 7 | Script arranque entorno | `dev.ps1` (Menú Interactivo Windows) | ✅ Hecho |

### Criterios de éxito Sprint 3

1. Login en `localhost:5173` funciona sin errores
2. Crear producto → aparece en la grilla
3. Click "Agregar" → CartSidebar aparece con el item
4. Finalizar venta → stock descontado, aparece en historial
5. Exportar Excel desde Reportes → descarga archivo válido
6. Dashboard muestra números reales (no "—")
7. Otro usuario en otra empresa puede registrarse y operar su propia tienda

---

---

## Sprint 3.5 — Features "Gancho" para MVP (Alta Prioridad)

**Objetivo:** Implementar analítica, fechas de vencimiento y soporte para productos a granel para aumentar el valor percibido del MVP Básico.

| # | Tarea | Responsable | Estado |
|---|-------|-------------|--------|
| 1 | Migración DB: `cantidad` a `Numeric`, añadir `fecha_vencimiento` y `unidad_medida` (Enum: unidad, gramo, libra, kilo) | Claude | ✅ Hecho |
| 2 | Endpoints Dashboard (Top productos, Alertas vencimiento a 15 días fijos) | Claude | ✅ Hecho |
| 3 | Actualizar ModalProducto (nuevos campos, input fecha y selector de medida) | Claude | ✅ Hecho |
| 4 | Modificar CartSidebar para permitir fracciones en granel según medida | Claude | ✅ Hecho |
| 5 | Gráficas en Dashboard (Recharts) y panel rojo de vencimientos | Claude | ✅ Hecho |

### Criterios de éxito Sprint 3.5
1. Dashboard muestra gráfica de los 5 productos más vendidos.
2. Dashboard muestra alerta roja para productos que vencen en 15 días o menos.
3. Se puede crear un producto seleccionando unidad de medida (ej. Libra) y fecha de vencimiento opcional.
4. En el POS (CartSidebar), si un producto es por peso, se puede ingresar "1.5" y calcula el subtotal.

---

## Sprint 4 — Fundamentos de la fábrica

**Objetivo:** infraestructura de documentación y agentes para que la fábrica pueda operar.

| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 1 | CLAUDE.md completo | `CLAUDE.md` | ✅ Hecho |
| 2 | GEMINI.md (contexto para Antigravity) | `GEMINI.md` | ✅ Hecho |
| 3 | AGENTS.md (protocolo colaboración) | `AGENTS.md` | ✅ Hecho |
| 4 | PLAN_ACTIVO.md (este archivo) | `PLAN_ACTIVO.md` | ✅ Hecho |
| 5 | `.claude/settings.json` MCP servers | `.claude/settings.json` | ✅ Hecho |
| 6 | Agente haiku-worker | `.claude/agents/haiku-worker.md` | ✅ Hecho |
| 7 | Agente architect | `.claude/agents/architect.md` | ✅ Hecho |
| 8 | factory/README.md | `factory/README.md` | ✅ Hecho |
| 9 | Template basic (4 docs) | `factory/templates/basic/` | ✅ Hecho |
| 10 | Pipeline build-basic | `factory/workflows/build-basic.md` | ✅ Hecho |
| 11 | Portafolio de precios | `factory/pricing/PORTFOLIO.md` | ✅ Hecho |
| 12 | Actualizar VISION_Y_ROADMAP.md | `docs/VISION_Y_ROADMAP.md` | ✅ Hecho |

### Criterios de éxito Sprint 4

1. Nueva sesión Claude Code carga contexto completo sin handoff manual
2. Gemini puede leer GEMINI.md y PLAN_ACTIVO.md y contribuir al plan
3. `factory/templates/basic/` tiene los 4 documentos de referencia
4. El pipeline `build-basic.md` es ejecutable paso a paso

---

## Sprint 3.6 — Mini-refactor Historial de Ventas (UX cuadre de caja)

**Objetivo:** Vista de Ventas con 3 tabs (Hoy / Semana / Histórico) y filtro por fecha en el backend.

| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 1 | Endpoint ventas con `fecha_inicio` / `fecha_fin` query params | `routers/ventas.py`, `services/venta_service.py` | ✅ Hecho |
| 2 | UI tabs + TotalBanner + ExcelExport (tab Histórico) | `pages/Ventas.jsx` | ✅ Hecho |

---

## Sprint 3.8 — Cierre de Brechas SRS

**Objetivo:** Cubrir los requisitos funcionales RF-02 y RF-03 del SRS antes del despliegue.

| # | Paso | Descripción | Estado |
|---|------|-------------|--------|
| 1 | RF-02 | Categorías de productos — enum + migration 005 + selector en modal | ✅ Hecho |
| 2 | RF-03 | Escáner de código de barras via cámara (`@zxing/browser`) | ✅ Hecho |
| 3 | RF-04 | Responsividad móvil — layout y componentes adaptados a pantalla pequeña | ✅ Hecho |

### Criterios de éxito Sprint 3.8
1. Se puede asignar categoría al crear/editar un producto.
2. Al pulsar 📷 en el modal, la cámara detecta un código EAN/UPC y lo auto-rellena.
3. El POS es usable en móvil (mínimo 375 px de ancho).

---

## Sprint 5 — Pipeline funcional tier basic (próximo)

- `factory/workflows/build-basic.md` como workflow ejecutable real
- Generar un segundo sistema básico usando el pipeline (demo para clientes)
- Medir costo real en tokens por sistema construido
- Primer cliente Gestión Neiva pagando → **desbloquea Hermes-3**

---

## Sprint 6 — Template medium (ERP Ligero)

**Objetivo:** Definir el estándar para sistemas comerciales del Tier Medium y validar el pipeline construyendo un sistema demo completo llamado **"ERP Distribuidora"** (sistema mayorista de abasto con proveedores y deudas).

| # | Tarea | Recurso / Archivo | Estado |
|---|-------|-------------------|--------|
| 1 | **[Gemini]** Crear carpeta y plantillas del Tier Medium | `factory/templates/medium/` | ✅ Completado |
| 2 | **[Gemini]** Diseñar esquema de base de datos relacional del ERP | `factory/templates/medium/schema.md` | ✅ Completado |
| 3 | **[Gemini]** Diseñar contratos de API REST (Compras, Proveedores, CxP) | `factory/templates/medium/api-contracts.md` | ✅ Completado |
| 4 | **[Gemini]** Listar componentes React 19 y checklist de customización | `.../components-list.md` + `.../customization-checklist.md` | ✅ Completado |
| 5 | **[Gemini]** Analizar requisitos de "erp-distribuidora" → JSON | `factory/jobs/erp-distribuidora/requirements.json` | ✅ Completado |
| 6 | **[Architect/Claude]** Schema DB + Contratos adaptados a Distribuidora | `factory/jobs/erp-distribuidora/schema.md` + `api-contracts.md` | ✅ Completado |

| 7 | **[Haiku]** Backend Boilerplate (Modelos, schemas, migraciones Alembic) | `factory/jobs/erp-distribuidora/` | ✅ Completado |
| 8 | **[Haiku]** Routers FastAPI + Lógica de negocio (Servicios transaccionales) | `factory/jobs/erp-distribuidora/` | ✅ Completado |
| 9 | **[Sonnet]** Frontend React JSX (Compras, Proveedores, Cuentas por Pagar) | `factory/jobs/erp-distribuidora/` | ✅ Completado |
| 10 | **[Haiku]** Pruebas de integración del flujo de compras y abonos | `factory/jobs/erp-distribuidora/tests/` | ✅ Completado |
| 11 | **[Gemini]** QA completo y reporte final de bugs y correcciones | `factory/jobs/erp-distribuidora/qa-report.md` | ✅ Completado |
| 12 | **[Haiku]** DevOps: docker-compose + README deploy del ERP | `factory/jobs/erp-distribuidora/` | ✅ Completado |
| 13 | Medir costo real de tokens y tiempo en ERP | `factory/jobs/erp-distribuidora/METRICAS.md` | ✅ Completado |

### Criterios de éxito Sprint 6
1. La plantilla del Tier Medium está completa, estructurada y documentada.
2. El sistema de validación "ERP Distribuidora" funciona en local: registro de proveedor → compra a crédito (actualiza stock e incrementa deuda) → abono a cuenta por pagar (amortiza deuda hasta saldar e inactivar).
3. Todas las pruebas de integración backend de compras y abonos pasan satisfactoriamente.
4. Reporte de métricas reales del Tier Medium completado (costo en USD y tiempo).


---

## Sprint 7 — Template professional (COMPLETO)

- Template professional: multi-tenant real, pagos, SSO, API pública (Diseño & Especificaciones) ✅
- **factory/templates/professional/ creado:** `schema.md`, `api-contracts.md`, `components-list.md` y `customization-checklist.md` ✅

---

## Sprint 7.5 — Panel Super Admin + Sistema de Soporte CRM (COMPLETO)

**Objetivo:** Añadir una capa de operaciones internas a Gestión Neiva: panel de control para el superadmin y bandeja de soporte bidireccional entre tiendas y el equipo de soporte.

| # | Tarea | Archivo | Estado |
|---|-------|---------|--------|
| 1 | Modelos `SoporteTicket` + `SoporteMensaje` en `app/models.py` | `app/models.py` | ✅ Completado |
| 2 | Migración Alembic `006_crear_tablas_soporte` | `alembic/versions/006_crear_tablas_soporte.py` | ✅ Completado |
| 3 | Schemas Pydantic: `TicketOut`, `EmpresaAdminOut`, etc. | `app/schemas/soporte.py` | ✅ Completado |
| 4 | Router superadmin (empresas, trial, status, tickets) | `app/routers/superadmin.py` | ✅ Completado |
| 5 | Router soporte (crear, listar, detalle, responder) | `app/routers/soporte.py` | ✅ Completado |
| 6 | Registrar routers en `app/main.py` | `app/main.py` | ✅ Completado |
| 7 | Sidebar + rutas frontend (`/soporte`, `/superadmin`) | `Sidebar.jsx` + `App.jsx` | ✅ Completado |
| 8 | Página Soporte.jsx (bandeja Gmail-style) | `frontend/src/pages/Soporte.jsx` | ✅ Completado |
| 9 | Página SuperAdmin.jsx (login por clave + 2 tabs) | `frontend/src/pages/SuperAdmin.jsx` | ✅ Completado |
| 10 | Tests de integración (7/7 passing, 16/16 total) | `tests/test_soporte_crm.py` | ✅ Completado |

### Criterios de éxito Sprint 7.5
1. ✅ Usuario puede crear ticket, ver hilo y responder desde `/soporte`
2. ✅ Superadmin autentica con `x-superadmin-key`, ve todas las empresas y tickets
3. ✅ Superadmin puede responder tickets (estado → `respondido`)
4. ✅ Flujo end-to-end: Crear ticket → Responder como admin → Ver actualización en hilo del cliente
5. ✅ 16/16 tests passing (auth + OWASP + soporte CRM), build frontend sin errores

---

## Sprint 7.8 — Fusión e Integración del ERP Distribuidora en el POS (COMPLETO)

**Objetivo:** Integrar completamente los módulos de la fábrica (ERP Distribuidora: compras, proveedores y cuentas por pagar) en la misma aplicación monolítica multi-tenant de Gestión Neiva, habilitándose dinámicamente según el plan de la empresa.

| # | Tarea | Recurso / Archivo | Estado |
|---|-------|-------------------|--------|
| 1 | **[Architect/Claude]** Fusionar modelos Proveedor, Compra, CxP en models | `app/models.py` | ✅ Completado |
| 2 | **[Architect/Claude]** Crear y aplicar migración Alembic de nuevas tablas | `alembic/versions/` | ✅ Completado |
| 3 | **[Haiku]** Copiar y adaptar esquemas Pydantic del ERP | `app/schemas/` | ✅ Completado |
| 4 | **[Haiku]** Copiar y registrar servicios de compra y deudas | `app/services/` | ✅ Completado |
| 5 | **[Haiku]** Registrar nuevos routers del ERP y deshabilitar router SSO | `app/main.py` + `app/routers/` | ✅ Completado |
| 6 | **[Haiku]** Adaptar y fusionar pruebas de integración del ERP al core | `tests/test_erp_flows.py` | ✅ Completado |
| 7 | **[Sonnet]** Frontend: Copiar componentes, páginas y hooks del ERP | `frontend/src/` | ✅ Completado |
| 8 | **[Sonnet]** Frontend: Registrar rutas en App.jsx con protección de plan | `App.jsx` | ✅ Completado |
| 9 | **[Sonnet]** Frontend: Sidebar condicional y dinámico según `empresa.plan` | `Sidebar.jsx` | ✅ Completado |
| 10| **[Sonnet]** Frontend: Cambiar control de URL por selector de Plan en admin | `pages/SuperAdmin.jsx` | ✅ Completado |

### Criterios de éxito Sprint 7.8
1. Las 5 tablas del ERP están integradas en la base de datos de Gestión Neiva mediante Alembic.
2. Los endpoints del ERP responden de forma multi-tenant (`empresa_id` aislado).
3. Si el plan de una empresa es `basic`, los menús del ERP no se muestran.
4. Si el plan de una empresa cambia a `medium` desde el Superadmin, se muestran instantáneamente *Compras, Proveedores y Cuentas por Pagar*.
5. Todo el flujo (proveedor -> compra crédito -> abono CxP) se ejecuta en la misma pantalla.
6. 100% de los tests pasan sin errores (`pytest tests/`).

---

## Sprint 7.9 — Agente IA In-App Orientado a Tareas para Tier Pro (🟢 CERTIFICADO 9.5/10 — GO PRODUCCIÓN COMERCIAL)

**Objetivo:** Implementar la arquitectura definitiva del Agente de Inteligencia Artificial para el MVP Tier Pro ($89.000 – $99.000 COP/mes). El agente interpreta intenciones en lenguaje natural y delega la ejecución en los servicios existentes de negocio, con PostgreSQL como autoridad final y confirmación obligatoria previa a toda mutación.

> **Dictamen Oficial de Auditoría Externa:** 🟢 **GO PARA PRODUCCIÓN COMERCIAL (9.5/10 — CERTIFICADO)**
> - P0 restantes: **0**
> - P1 bloqueadores: **0**
> - Concurrencia artificial: **0** (concurrencia PostgreSQL pura mediante `SELECT FOR UPDATE` y `uq_empresa_command_id`, CERO cerrojos Python)
> - Autoridad transaccional: **100% servicios de negocio y PostgreSQL** (el LLM es solo intérprete probabilístico)
> - 53/53 tests pasando al 100% en todo el repositorio.

| # | Tarea | Recurso / Archivo | Estado |
|---|-------|-------------------|--------|
| 1 | **[Architect/DB]** Tabla de auditoría e idempotencia persistente `AgentCommand` + migración Alembic 010 | `app/models.py`, `alembic/versions/010_crear_tabla_agent_commands.py` | ✅ Completado |
| 2 | **[Architect/Backend]** Soporte transaccional externo (`commit=False`) en `venta_service` y `producto_service` | `app/services/venta_service.py`, `app/services/producto_service.py` | ✅ Completado |
| 3 | **[Core/Agente]** Almacenamiento de sesiones desacoplado (`SessionStore`: InMemory para test/dev + Redis con TTL 5m para prod) | `app/services/agente/session_store.py` | ✅ Completado |
| 4 | **[Core/Agente]** Matcher de catálogo fuzzy de 3 zonas con discriminación de ambigüedades | `app/services/agente/catalog_matcher.py` | ✅ Completado |
| 5 | **[Core/Agente]** Formateador determinístico de lenguaje natural (cero costo en tokens de salida) | `app/services/agente/response_formatter.py` | ✅ Completado |
| 6 | **[Core/Agente]** Consultas financieras y de inventario determinísticas con validaciones de fechas UTC | `app/services/agente/consultas_service.py` | ✅ Completado |
| 7 | **[Core/Agente]** FSM formal con matriz de transiciones estrictas (`AgentState`) | `app/services/agente/fsm.py` | ✅ Completado |
| 8 | **[Core/Agente]** Proveedor agnóstico de intenciones (Regex <1ms + adaptadores Groq/Gemini) | `app/services/agente/intent_provider.py` | ✅ Completado |
| 9 | **[Orchestrator]** Orquestador central de intenciones, slot-filling, verificación de tenant en JWT y fallback idempotente | `app/services/agente/agent_orchestrator.py` | ✅ Completado |
| 10 | **[Router]** Endpoint HTTP delgado `POST /api/agente/mensaje` con schema de entrada/salida tipado | `app/routers/agente.py`, `app/main.py` | ✅ Completado |
| 11 | **[QA/Tests]** Suite de 13 pruebas adversariales de producción (T-01 a T-13) con 100% de aprobación | `tests/test_agente_produccion.py` | ✅ Completado |
| 12 | **[Frontend]** Widget interactivo in-app (`AgentWidget.jsx` con Web Speech API `es-CO`, chips, preview cards y acción confirm/cancel) | `frontend/src/components/AgentWidget.jsx`, `Layout.jsx` | ✅ Completado |
| 13 | **[Auditoría Senior]** Correcciones P0 y P1 del auditor (P0.1, P0.3, P1.1-P1.5): confirmación sin LLM, timezone Neiva, modismos colombianos, aislamiento por usuario | Repositorio completo | ✅ Completado |
| 14 | **[Certificación Final 9.1/10]** Resolución de los 4 bloqueadores para Producción Comercial: confirmación inequívoca, Redis fail-closed, validación Pydantic + límites de cantidades, suite de concurrencia e integración Postgres | `agent_orchestrator.py`, `session_store.py`, `intent_provider.py`, `tests/test_concurrencia_real.py`, `tests/integration/postgres/` | ✅ Completado |
| 15 | **[PostgreSQL Concurrencia Pura - CERO db_lock]** Eliminación total de serialización artificial (`threading.Lock()`); pruebas empíricas contra motor PostgreSQL vivo con connection pool (`tests/integration/postgres/test_concurrencia_postgres.py` y `tests/test_concurrencia_real.py`) con medición de bloqueo de kernel `SELECT FOR UPDATE` (>0.25s), violación nativa de `uq_empresa_command_id` y cero lost updates | `tests/integration/postgres/test_concurrencia_postgres.py`, `tests/test_concurrencia_real.py` | ✅ Completado |

### Criterios de éxito y verificación Sprint 7.9
1. ✅ **El LLM nunca es autoridad:** Toda consulta financiera (ventas hoy, recaudo, stock) es calculada determinísticamente por PostgreSQL / SQLAlchemy; no hay alucinaciones de cifras ni falsas métricas de ROI.
2. ✅ **Cero duplicación de lógica:** Las ventas descuentan stock mediante `venta_service.registrar_venta` con `SELECT FOR UPDATE`.
3. ✅ **Aislamiento multi-tenant y multi-usuario estricto:** `empresa_id` y `usuario_id` se extraen únicamente del JWT verificado; sesiones cruzadas entre tiendas o entre cajeros de la misma tienda son aisladas.
4. ✅ **Confirmación obligatoria e idempotencia persistente:** Ninguna venta ni reabastecimiento muta la base de datos sin confirmación del tendero. Las confirmaciones repetidas o reintentadas responden con `idempotente=True` desde la tabla `agent_commands`.
5. ✅ **Confirmación inequívoca blindada:** Evaluación previa de negaciones y exigencia de expresiones completas cerradas; frases como *"sí, pero cambiar cantidad"* o *"espera"* no ejecutan.
6. ✅ **Redis fail-closed en producción:** En `ENVIRONMENT=production`, la caída o ausencia de Redis no degrada a memoria volátil, retornando HTTP 503 sin pérdida de contexto.
7. ✅ **Validación Pydantic estricta del LLM:** Salida del parser/LLM validada con `AgentLLMOutput` y `AgentSlotsSchema`, rechazando `NaN`, `Infinity`, ceros o valores fuera de rango $(0.001, 10000.0]$.
8. ✅ **Concurrencia Real en PostgreSQL Demostrada (CERO db_lock):** Eliminación total de serializaciones artificiales de Python (`db_lock = threading.Lock()`). Pruebas concurrentes multi-hilo sincronizadas con `threading.Barrier(2)` ejecutadas contra PostgreSQL real demostrando:
   - Bloqueo físico en kernel con `SELECT ... FOR UPDATE` (tiempo de suspensión medido $\ge 0.25$ segundos mientras la otra transacción finaliza).
   - Stock final estrictamente $0.0$, jamás negativo.
   - Deduplicación idempotente ante carreras por el mismo `command_id` arbitrada por `UniqueConstraint('empresa_id', 'command_id')` con `IntegrityError` nativo en PostgreSQL.
   - Reabastecimiento atómico sin lost updates ($10 + 5 + 5 = 20.0$).
9. ✅ **53/53 pruebas pasando al 100% en todo el repositorio:**
   - 5/5 pruebas de concurrencia e integración PostgreSQL pura (`tests/integration/postgres/test_concurrencia_postgres.py`)
   - 6/6 pruebas de concurrencia real y blindajes de producción (`tests/test_concurrencia_real.py`)
   - 13/13 pruebas adversariales de producción (`tests/test_agente_produccion.py`)
   - 29/29 pruebas de módulos core (Auth, ERP Compras/CxP, OWASP Security, CRM Soporte, Webhooks WhatsApp)
10. ✅ **Frontend Production Ready:** `npm run build` compila con 0 errores y el drawer se encuentra activo en el layout general.

---

## Sprint 7.9.5 — Hardening del Ciclo de Voz y Resiliencia Móvil Android-First (COMPLETO)

**Objetivo:** Blindar el ciclo de voz continuo (`VoiceTurnManager`, `voiceCapabilities`, `BackendSTTProvider`, `WebSpeechProvider`) para operar sin condiciones de carrera (`InvalidStateError`), sin callbacks huérfanos y con resiliencia total en dispositivos Android y Desktop.

| # | Tarea | Recurso / Archivo | Estado |
|---|-------|-------------------|--------|
| 1 | **[Detect]** Detección robusta de capacidades y política Android-First (`isAndroid`, `isMobile`, `maxTouchPoints`) | `frontend/src/services/voice/voiceCapabilities.js` | ✅ Completado |
| 2 | **[TurnManager]** Control de generaciones de proveedor (`providerGeneration`) y sesión (`sessionGeneration`) para descartar callbacks obsoletos | `frontend/src/services/voice/VoiceTurnManager.js` | ✅ Completado |
| 3 | **[Lifecycle & Watchdog]** Cierre asíncrono de WebSpeech (`onend` único), `abortAndWait` / `stopAndWait`, recuperación controlada de `InvalidStateError` y watchdog 9s limitador de captura sin abortar transcripciones BackendSTT en vuelo | `WebSpeechProvider.js`, `BackendSTTProvider.js`, `VoiceTurnManager.js` | ✅ Completado |
| 4 | **[Decouple]** Desacoplamiento de `BackendSTTProvider` de la orquestación de turnos, tracking de `turnId` y `isPendingTranscription` + logs estructurados | `frontend/src/services/voice/stt/BackendSTTProvider.js` | ✅ Completado |
| 5 | **[Vite/Ngrok]** Soporte de túnel seguro HTTPS con `host: true` y `allowedHosts: true` para pruebas móviles reales | `frontend/vite.config.js` | ✅ Completado |
| 6 | **[QA/Tests]** Suite de 40 pruebas unitarias formales para ciclo de voz (A, B, C, D, E, F, H, I, J, K, L, M, N) al 100% pasando | `frontend/test_voice_turn_manager.js` | ✅ Completado |
| 7 | **[DB/Local]** Sincronización de migraciones Alembic 001-010 en PostgreSQL local nativo + credenciales demo | `alembic/versions/`, `.env` | ✅ Completado |

---

## Sprint 8 — Despliegue en Producción y Piloto Comercial (SIGUIENTE)

**Objetivo:** Congelar la arquitectura del agente y poner el sistema en manos de 5 a 10 tiendas piloto reales en Neiva para validar producto y economía unitaria.

| # | Tarea | Detalle | Estado |
|---|-------|---------|--------|
| 1 | **[DevOps]** Preparación de entorno productivo con Docker Compose / VPS | PostgreSQL 16/18 + Redis 7 + FastAPI + Nginx + Frontend Vite | ⏳ Por iniciar |
| 2 | **[Telemetría]** Instrumentación de métricas clave del tendero | Logging/Métricas de `time_to_sale`, `confirmation_rate`, `clarification_rate`, `LLM_fallback_rate` | ⏳ Por iniciar |
| 3 | **[Piloto Neiva]** Onboarding controlado de 5 a 10 tiendas de barrio | Medición de adopción de voz vs texto y ahorro de tiempo por venta | ⏳ Por iniciar |
| 4 | **[Monetización]** Activación de Hermes-3 vía Together AI | Se activa con el cobro de la primera mensualidad real ($89.000 - $99.000 COP) | 🔒 Bloqueado hasta 1er pago |

---

## Sprint 9 — Brechas pendientes para Producción Comercial (PLAN — 2026-10-18)

**Estado verificado 2026-10-18:** 86/86 tests backend ✅ · build frontend ✅ (15.4s) · sincronizado con origin/main (1 commit local sin push).

### Brechas conocidas (funciones NO al 100%)

| # | Brecha | Impacto | Severidad |
|---|--------|---------|-----------|
| B1 | **Cobro/billing no automatizado:** "Activar Pro" solo genera ticket de soporte (`/api/soporte/solicitar-upgrade`); la activación es manual y no hay pasarela de pago (Wompi/PayU/MercadoPago) ni registro `empresa.plan` automático ni renovación/vencimiento de suscripción pagada | No se puede facturar sin intervención humana → bloquea el ingreso que desbloquea Hermes-3 | 🔴 Barrera comercial |
| B2 | **Ciclo de vida de suscripción pagada:** `entitlement_service` cubre trial de 15 días, pero falta estado `activa`/`suspendida`, cobro recurrente, y qué pasa exactamente al vencer el trial/Pro (Regla SUB-09 cubre POS básico, falta flujo de re-activación) | Churn silencioso y facturación incobrable | 🔴 Alta |
| B3 | **Despliegue productivo no ejecutado:** `docker-compose.yml` básico, `render.yaml` y `Dockerfile` existen pero falta un compose de producción completo (Redis incluido, HTTPS/Nginx, migraciones alembic en arranque, backups) y subir a VPS | El sistema corre solo en dev | 🔴 Alta |
| B4 | **Telemetría del agente ausente:** no se miden `time_to_sale`, `confirmation_rate`, `clarification_rate`, `LLM_fallback_rate` | Sin datos no se valida el piloto | 🟡 Media |
| B5 | **Landing con placeholders:** `[HISTORIA REAL PENDIENTE]` (×2) y enlaces de redes vacíos | Portafolio público incompleto | 🟡 Media |
| B6 | **Frontend sin code-splitting:** bundle único >500 kB (warning Vite); cargar `LandingPage`, `SuperAdmin`, `AgentWidget` con `lazy()` + `manualChunks` | Lento en 4G de móviles de barrio (usuario target) | 🟡 Media |
| B7 | **Handoff desactualizado:** `docs/traspaso/HANDOFF.md` todavía lista el POS como "en diseño Sprint 4" | Confunde a nuevos agentes/desarrolladores | 🟢 Baja |

### Plan de desarrollo propuesto (orden de ejecución)

1. **Push del commit local** `5c876d0` a origin (1 commit pendiente) y commit de docs no trackeados (`docs/spec`, `docs/checklists`, `docs/traspaso`).
2. **B7 → B5 (higiene documental, ~1 sesión):** reescribir `HANDOFF.md` al estado real; decidir historias reales o retirar la sección de la landing.
3. **B6 (UX móvil, medio día):** code-splitting de rutas pesadas en `App.jsx` (`React.lazy`), `manualChunks` para recharts/@zxing; verificar build < 500 kB principal.
4. **B1 + B2 (monetización, 1–2 sprints):** integrar pasarela colombiana (Wompi es candidata natural: bajo umbral, Neiva-friendly) para cobro mensual Pro; endpoint webhook de confirmación de pago idempotente; servicio `suscripcion_service` que activa `empresa.plan='pro'` y gestiona renovación/suspensión (fail-open en POS básico según SUB-09); tests de ciclo completo trial→pago→pro→vencimiento.
5. **B3 (DevOps, en paralelo a 4):** compose de producción (Postgres 16 + Redis 7 + backend + frontend estático servido por Nginx + cloudflared/ngrok solo para piloto), `alembic upgrade head` en arranque, healthchecks y job de backup diario.
6. **B4 (telemetría, al desplegar):** hooks de logging estructurado en `agent_orchestrator.py` y routers de voz; tabla `metricas_diarias` o entrada de log parseable para el piloto.
7. **Sprint 8 piloto:** onboarding de 5–10 tiendas, medir adopción voz vs texto → **primer cobro real desbloquea Hermes-3 (i2)**.

### Criterios de éxito Sprint 9
1. Un comercio nuevo se registra, paga Pro por pasarela y queda activo **sin intervención humana** (trial→pago→pro E2E en producción).
2. Stack productivo arriba en VPS con HTTPS, Redis y migrations en arranque; backup diario verificado.
3. Bundle principal frontend < 500 kB y landing sin placeholders.
4. Métricas del agente visibles por tienda para la reunión semanal del piloto.

---

## Restricciones activas

- **Hermes-3 / Together AI:** BLOQUEADO hasta primer ingreso de Gestión Neiva
- **Ollama local:** descartado permanentemente (degrada rendimiento del equipo)
- **Stack de fábrica:** solo Claude + Gemini (free) hasta que el sistema facture
- **Sin TypeScript:** frontend en JSX puro mientras sea MVP

---

## Propuestas pendientes de evaluación

> [GEMINI PROPONE → ✅ GEMINI IMPLEMENTA] Sprint 8.1 — RBAC (Dueño vs. Cajero), Actividad del Día y Límite de Cajeros por Plan (Auditado)
> **Dictamen de Auditoría:** Aprobado 9.7/10 — Fase 1 (DB/Modelos) y Fase 2 (Backend/RBAC/Concurrencia) **COMPLETADAS**.
>
> **Estado de Implementación:**
> - [x] **Fase 1 (DB & Schemas):** Migración Alembic 012 aplicada y reversible, `Usuario.nombre`, `Venta.usuario_id`, `Venta.vendedor_nombre_snapshot` inmutable, schemas `ProductoAdminOut` vs `ProductoCajeroOut`. (6/6 tests passing)
> - [x] **Fase 2 (Backend, RBAC & Concurrencia):**
>   - Inactivación inmediata de JWT en `get_current_user` (`is_active is False` ➡️ HTTP 403) y bloqueo de login.
>   - Aislamiento multi-tenant estricto anti-IDOR en gestión de empleados y actividad de ventas.
>   - Servicio transaccional `usuario_service.py` con `SELECT ... FOR UPDATE` en PostgreSQL: control atómico de $\le 3$ cajeros activos en Plan Básico tanto en creación como en reactivación.
>   - Trazabilidad automática de ventas con inyección de `usuario_id` y snapshot del vendedor desde el JWT.
>   - Blindaje de endpoints administrativos (`/reportes/*`, `/dashboard/*`, `/usuarios/*`, mutaciones de productos) con `get_current_user_admin`.
>   - Catálogo ciego en `/api/productos`: cajero jamás recibe `precio_costo` a nivel de red ni serialización.
>   - Endpoint de Actividad del Día (`/api/ventas/actividad` y `/api/ventas/actividad-hoy`) con timezone `America/Bogota`, intervalo semiabierto `[inicio, fin)` y orden determinista.
>   - **Verificación:** 8/8 tests de Fase 2 passing (`tests/test_fase2_backend_rbac.py`) + 5/5 integración PostgreSQL + 57/57 tests globales passing al 100%.
> - [x] **Fase 3 (Frontend & UX):** Menú condicional en `Sidebar.jsx`, redirección a POS en `App.jsx`, pestaña "Equipo de Trabajo" en `Configuracion.jsx` con modal de upselling y vista "Actividad del Día" en `Ventas.jsx`. (COMPLETO)
>   - Helpers puros de permisos en `frontend/src/utils/permissions.js` (`isAdmin`, `isTendero`, `canViewAdminModules`, `canEditProducts`).
>   - Servicio `usuarioService.js` para consumir `/api/usuarios/empleados` capturando semánticamente `LIMIT_CAJEROS_REACHED`.
>   - Protección de rutas en cliente en `ProtectedRoute.jsx` con flag `adminOnly` e intercepción inmediata previa al montaje.
>   - Redirección raíz `/` y post-login inteligente según rol (`/dashboard` para admin, `/ventas` para cajero/tendero).
>   - Manejo seguro de sesión expirada 401 en `authService.js` con bandera contra tormentas de redirecciones y persistencia del carrito del mostrador en `CartContext.jsx` (`localStorage`).
>   - Reetiquetado amigable de baja fricción: *"Productos"* (ex Inventario) y *"Ayuda"* (ex Soporte Técnico) en `Sidebar.jsx`.
>   - Identidad humana en `Header.jsx` sin nombres hardcodeados y con pastilla sutil de rol.
>   - Pantalla `Configuracion.jsx` con control de cupos accesibles $X/3$, switch con modal de confirmación anti-toques accidentales y modal festivo de Upselling al Plan Pro.
>   - Vista "Actividad del Día" en `Ventas.jsx`: timeline compacto en zona horaria `America/Bogota`, acordeón colapsable para tickets de venta, selector mobile de fechas y filtro server-side por cajero.
> - [x] **Fase 3.5 (Business Conversational Agent Mostrador):** Evolución del agente conversacional a asistente de negocio con comprensión semántica, memoria multi-turno contextual y soporte nativo de modismos colombianos. (COMPLETO)
>   - **Suite de Benchmark (280 casos reales):** Evaluación en 9 dimensiones críticas de negocio (Ventas, Productos, Inventario/Stock, Reportes, Comparaciones, Contexto Multi-Turno, Ambigüedad, Out-of-Domain y Lenguaje Real de Mostrador).
>   - **Métrica Cuantitativa:** Precisión global saltó de **25.71% (72/280)** en la línea base inicial a **100.0% (280/280)**.
>   - **Business Router & Memoria de Sesión:** `agent_orchestrator.py` almacena `business_context` (`last_domain`, `last_period`, `last_product`, `last_seller`) con TTL de 1800s permitiendo resolver elipsis y anáforas continuas ("¿Y ayer?", "¿Y de aceite?", "¿Y cuánto queda?").
>   - **Diccionario de Mostrador & Modismos:** Normalización fonética y semántica de expresiones coloquiales ("pola", "birra", "librita", "coronó", "seco en bodega", "la gallada", etc.).
>   - **Determinismo & Seguridad Intacta:** Cumplimiento 100% de las 5 Leyes del Agente. Las respuestas numéricas son calculadas por PostgreSQL/SQLAlchemy, FSM para mutaciones (`READY_TO_CONFIRM` -> `EXECUTED`) y estricto aislamiento multi-tenant por `empresa_id` del JWT.
>   - **Verificación:** 280/280 (100%) en suite de benchmark + 68/68 (100%) en suite completa de regresión global.
> - [x] **Hotfix Crítico (LLM Provider Desacoplado, gemini-3.6-flash & Fix Error 503 en Modo Voz):** (COMPLETO)
>   - **Desacoplamiento estricto Groq vs Gemini:** Clases autónomas `GroqIntentProvider` y `GeminiIntentProvider`. Sanitización de modelos para evitar que nombres de Groq (`openai/gpt-oss-120b`, `llama`, etc.) sean inyectados a Google API generando 400 Bad Request/503.
>   - **Fijación de modelo oficial Gemini (`gemini-3.6-flash`):** Google deprecó `gemini-2.5-flash` y limitó `gemini-flash-latest` (preview 3.8) a 20 req/día. Se fijó `gemini-3.6-flash` en backend (`intent_provider.py`, `gemini_voice.py`, `agente.py`) y `render.yaml`.
>   - **Resolución de Error HTTP 503 en Modo Voz:** Corregido el fallback y la transcripción STT en `app/routers/agente.py` y `gemini_voice.py` para usar `gemini-3.6-flash`.
>   - **Fijación de dependencias:** `groq==1.7.0` fijado en `requirements.txt`.
>   - **Semántica de errores HTTP:** Errores de proveedor/red devuelven HTTP 503 con código `LLM_PROVIDER_UNAVAILABLE`; preguntas operativas no reconocidas devuelven HTTP 200 con clarificación guiada.
>   - **Health Check CLI:** `scripts/check_llm_health.py` con exit codes 0 a 4 (0=HEALTHY, 1=CONFIG_ERROR, 2=PROVIDER_UNAVAILABLE, 3=MODEL_UNAVAILABLE, 4=STRUCTURED_OUTPUT_FAILURE).
>   - **Smoke & Regression Suite:** 4/4 smoke tests passing, 280/280 benchmark passing, 73/73 tests globales verdes (100% pasando). Commit y push en `main`.

> [GEMINI PROPONE → ✅ GEMINI IMPLEMENTA] Sprint 8.2 — Transformación Web Informativa + Onboarding Educativo No Bloqueante
> **Objetivo:** Separación conceptual y de UX entre WEB ("Conoce, Comprende y Confía") y APP ("Gestiona tu Negocio"), con registro autónomo de comercios y onboarding guiado sin bloqueo operativo.
>
> **Estado de Implementación:**
> - [x] **Web Informativa (`frontend/src/pages/LandingPage.jsx`):**
>   - Estructura editorial de 13 secciones: Hero, Narrativa del Dolor, Propuesta de Valor, Audiencia Objetivo, Historias Documentales (`[HISTORIA REAL PENDIENTE]`), Alfabetización Digital, Economía Popular, 4 Pasos Reales, Modal Diferido de Video Tutorial (sin autoplay ni iframe bloqueante), Placeholders de Redes (`[URL INSTAGRAM]`, etc.), FAQ Humana sin absolutos, CTA y Footer institucional.
>   - Cero lenguaje absoluto ("100% seguro", "gratis para siempre", "100% responsivo") ni jerga técnica ("multi-tenant").
>   - Congelamiento comercial de IA: sin mención engañosa de funciones Pro en la landing hasta clarificación de límites de suscripción.
> - [x] **Registro Autónomo de Comercios (`frontend/src/pages/Registro.jsx`):**
>   - Integración directa con `POST /api/auth/registro-completo` respetando el schema Pydantic `UsuarioCrearConEmpresa` (`nombre_comercial`, `nit_o_cedula`, `email`, `password`, `rol: 'admin'`).
>   - Comunicación neutral sin promesas no verificadas (*"Crea tu cuenta y comienza a configurar tu negocio"*).
>   - Login actualizado con enlaces directos a `/registro` y retorno a la Web Informativa `/`.
> - [x] **Onboarding Educativo No Bloqueante en APP:**
>   - `OnboardingModal.jsx`: Modal de bienvenida que saluda por nombre al comerciante y ofrece opciones claras (`[Ver cómo funciona]`, `[Comenzar]`, `[Omitir]`), persistido en `localStorage` por usuario.
>   - `GuiaPrimerosPasos.jsx`: Checklist de activación colapsable/descartable en `Dashboard.jsx` con 4 pasos reales (1. Agrega tu primer producto -> 2. Conoce el mostrador -> 3. Registra tu primera venta real -> 4. Consulta tu información). Sin ventas ficticias en BD de producción.
>   - `Soporte.jsx`: Tarjeta permanente *"Aprender a usar Gestión Neiva"* para reactivar la guía o volver a ver el video tutorial en cualquier momento.
>   - `Header.jsx`: Acceso directo y universal al mostrador/caja con badge de carrito para agilizar el flujo de venta desde cualquier módulo.
>   - `Reportes.jsx`: Desmitificación de acrónimos técnicos (COGS, ROI) reemplazados por explicaciones cotidianas de finanzas de mostrador.
> - [x] **Verificación:**
>   - `npm run build`: compilación limpia y exitosa de Vite en 23.21s.
>   - `pytest tests/test_auth.py tests/test_fase2_backend_rbac.py`: 14/14 tests passing sin regresiones.
>
> ---
>
> > [GEMINI PROPONE → ✅ GEMINI IMPLEMENTA] Sprint 8.3 — Gobernanza RBAC en Asistente IA, Reabastecimiento con Costo y Latencia Cero
> > **Objetivo:** Blindaje de gobernanza y roles en el Asistente IA (Dueño vs Tendero), soporte completo de reabastecimiento con nuevo costo y alerta de margen, y optimización de latencia determinista (< 50ms) en comandos de entrada y vencimientos.
> >
> > **Estado de Implementación:**
> > - [x] **Gobernanza RBAC del Asistente:**
> >   - Saludo y desglose de capacidades (`formatear_menu_capacidades`) adaptado al rol: menú de control total para Administrador y menú de mostrador rápido para Tendero.
> >   - Bloqueo pedagógico para el Tendero ante intentos de reabastecimiento o creación de productos (`formatear_bloqueo_rbac`).
> >   - Bloqueo pedagógico para el Tendero ante métricas financieras globales de la tienda o comparativas.
> >   - Consulta permitida de sus propias ventas para el Tendero del turno activo (`vendedor_query="yo"`).
> >   - Bloqueo para el Tendero ante consultas de ventas de otros cajeros.
> > - [x] **Reabastecimiento con Actualización de Costo y Venta:**
> >   - Servicio `producto_service.reabastecer_producto` extendido con soporte atómico para `nuevo_precio_costo` y `nuevo_precio_venta` dentro del lock pesimista `SELECT ... FOR UPDATE`.
> >   - Preview conversacional (`READY_TO_CONFIRM`) enriquecido: cálculo de stock proyectado, comparativa de costo anterior vs nuevo y alerta si el margen de ganancia baja del 15%.
> >   - Ejecución transaccional e idempotente confirmada persistida en PostgreSQL (`agent_commands`).
> > - [x] **Optimización de Latencia Determinista (< 50ms):**
> >   - Parser rápido determinista en `intent_provider.py` ampliado para capturar frases compuestas de reabastecimiento (`"hoy me reabasteci de X [producto], pero el precio costo incremento y ahora vale Y"`) y triggers de ayuda/opciones.
> >   - Detección inmediata de consultas de vencimiento (`"q esta proximo a vencer"`, `"que se vence pronto"`).
> >   - Función determinística `consultas_service.consultar_productos_proximos_vencer` y formateador `formatear_productos_proximos_vencer`.
> > - [x] **Verificación Automatizada:**
> >   - `tests/test_agente_rbac_reabastecer.py`: 7/7 tests passing (menú RBAC, bloqueos pedagógicos, ventas propias, reabastecimiento con costo en BD y consulta de vencimientos).
> >   - Suite de regresión global: 24/24 tests passing en `tests/test_agente_produccion.py` y `tests/test_fase2_backend_rbac.py`.
> >   - Total de pruebas verificadas: 31/31 passing al 100%.

---

> [GEMINI PROPONE → ✅ GEMINI IMPLEMENTA] Sprint 8.4 — Entitlements (Trial 15 Días), Normalización Errores 422, UI Pro en Header
> **Objetivo:** Resolver exposición de errores JSON en modal de cajero, corregir advertencias de consola y extensiones (`autoComplete`), centralizar el modelo de suscripción y prueba Pro de 15 días en backend con principio Fail-Closed, retirar botones flotantes que tapaban modales e integrar accesos contextuales en el Header con modal de conversión comercial.
>
> **Estado de Implementación:**
> - [x] **Normalización de Errores y Calidad de Formularios:**
>   - `frontend/src/utils/apiError.js`: Parseador centralizado para respuestas 422 de Pydantic v2. Mapea violaciones de contraseña a mensajes claros y pedagógicos en lenguaje humano sin exponer `value_error`, `loc` ni JSON crudo.
>   - `usuarioService.js` y `Configuracion.jsx`: Integración de mensajes amigables y atributos estándar `autoComplete="name"`, `autoComplete="email"`, `autoComplete="new-password"`.
> - [x] **Servicio Centralizado de Entitlements (Backend):**
>   - `app/services/entitlement_service.py`: Fuente de verdad única para el trial de 15 días exactos en UTC (`math.ceil`) y validación de planes Pro.
>   - `app/dependencies.py`: Desacoplado el bloqueo de login para que el POS básico (ventas, caja, inventario) continúe operando al 100% incluso si el trial vence (Regla SUB-09). Dependencia `require_pro_entitlement` creada para proteger funciones avanzadas.
>   - `app/routers/agente.py`: Endpoints `/mensaje` y `/transcribir-audio` protegidos con `require_pro_entitlement` (HTTP 403 con código `PRO_REQUIRED`).
>   - `auth_service.py` y `empresa_service.py`: Delegación de la inicialización del trial a `entitlement_service.inicializar_trial`.
> - [x] **Arquitectura Frontend Desacoplada y UI en Header:**
>   - `AgentContext.jsx`: Proveedor global que administra el estado del Asistente y sincroniza los entitlements de la empresa.
>   - `Header.jsx`: Controles integrados de Modo Voz, Chat IA y píldora dinámica de suscripción (`✨ Prueba Pro (Xd)` o `Activar Pro`).
>   - `AgentWidget.jsx`: Eliminados definitivamente los botones flotantes inferiores (`fixed bottom-5 right-5 z-50`) que se montaban encima de los modales. Ajustado z-index a `z-30` y soporte para cierre con tecla `Escape`.
>   - `ModalUpsellPro.jsx`: Modal de conversión y enganche respetuoso, destacando beneficios probados y enlace directo a `/planes` o soporte.
> - [x] **Verificación:**
>   - `npm run build`: Compilación de producción limpia sin errores en 9.14s.
>   - `pytest tests/test_entitlements_trial.py`: 6/6 tests passing.
>   - Suite completa de backend: **86/86 tests passing, 0 fallos**.

---

## QA Modo Voz — Verificación del 2026-10-18 (Flujo completo real)

**Entorno:** Postgres nativo + uvicorn (8000) + Vite (5173) + Chromium automatizado. Login con usuario demo.

| Prueba | Resultado |
|---|---|
| Suite unitaria ciclo de voz `test_voice_turn_manager.js` | ✅ 43/43 (100%) |
| Abrir modal "Modo Mostrador • Manos Libres" | ✅ Abre, orbe Hablando→Escuchando, sin crash |
| Micrófono denegado (navegador automatizado sin permiso) | ✅ Mensaje único "Permiso de micrófono denegado" — **NO hay tormenta de errores** (8 entradas en consola en total, sin loop de reintentos) |
| End-to-end texto: "vendí 2 arroz" | ✅ `READY_TO_CONFIRM` con fuzzy match → Arroz Diana 500g ($5.600) |
| "confirmar" | ✅ `EXECUTED`, venta $5.600 registrada, stock 50→48 |
| Confirmación repetida (mismo command_id) | ✅ `idempotente=True`, sin doble venta |
| `POST /api/agente/transcribir-audio` (multipart `audio=@...wav`) | ✅ Endpoint vivo pero **ver hallazgo STT-01** |

**Hallazgo STT-01 (🟡 Media — corregir en Sprint 9):** El fallback STT (Groq Whisper → Gemini) **alucina texto en audio sin voz**: un WAV de 1s con tono 440 Hz y cero voz produjo una frase completa en español elocuente. Riesgo: en móvil con ruido de calle, el pipeline BackendSTT puede generar comandos "fantasma" que llegan al parser. Mitigación propuesta (B-del-Sprint-9): filtro de energía RMS mínimo y duración mínima de voz real en `BackendSTTProvider` antes del upload (el VAD 950ms ya khanea el fin de habla; falta el umbral de "esto ES habla") + descartar transcificaciones < 50% de confianza. Riesgo de mutación: bajo (cualquier venta requiere confirmación explícita).

### Hotfix 22-10-2026 — Congelamiento del Modo Voz (UI trabada en SPEAKING)

**Reporte del usuario:** al abrir el Modo Manos Libres la UI queda congelada; todos los botones muertos excepto "Salir".

**Causa raíz:** el saludo de bienvenida usa TTS → `SPEAKING`. Si Chrome no dispara `utterance.onend` (bug conocido con voces sin cargar o síntesis pausada), la FSM queda atrapada en `SPEAKING` para siempre: `handleOrbClick` no tenía branch para ese estado y el footer solo mostraba un texto informativo (no botón). Única salida: "Salir".

**Correcciones:**
- `VoiceTurnManager.js`: watchdog de TTS (15s) que fuerza la salida de `SPEAKING` hacia `SETTLING→READY` si `onend` nunca llega (limpiado en `_limpiarTimers` y `_iniciarVentanaSettling`).
- `VoiceTurnManager.omitirRespuesta()`: skip manual de la respuesta TTS con retorno inmediato a escucha.
- `useVoiceAgent.js`: expone `omitirRespuesta`.
- `MostradorMode.jsx`: `handleOrbClick` maneja `SPEAKING/SETTLING` (omitir) y `ERROR` (reintentar); footer con botón **"Hablando... toca para omitir"** durante SPEAKING y **"Reintentar Escucha"** durante ERROR.

**Verificación E2E en Chromium:** ciclo `READY → SPEAKING (botón omitir visible) → LISTENING → ERROR (mic denegado en entorno automatizado, con botón Reintentar) → reactivar → SPEAKING...` sin storm (6 errores de consola en total, 1 por denegación). Suite de voz 43/43 ✅ y `npm run build` limpio.

### Fix 30-10-2026 — Orden LIFO en Actividad del Día + un solo botón de cierre (petición del dueño)

Tras la primera prueba E2E real del dueño con ventas por voz (flujo LISTENING→PROCESSING→venta exitosa ✅):

- **Ventas más recientes primero:** `venta_service.obtener_actividad_ventas` cambió `fecha_venta ASC → DESC` (y `id ASC → id DESC` como desempate). El dueño reportó ver las ventas "de forma ascendente a la hora" — ahora la más reciente encabeza la Actividad del Día. Verificación: 3 ventas demo (09:30/10:30/11:30) → endpoint lista 11:30, 10:30, 09:30. 86/86 tests backend.
- **Un solo botón de cierre:** se eliminó el botón "Salir" de la barra superior del modo voz; el cierre nativo (DOM puro, id `voice-emergency-exit`) quedó como ÚNICO control de cierre, rediseñado para pertenecer a la barra: posición arriba-derecha (donde estaba Salir), estilo slate coherente con Reiniciar (`bg-slate-800/85`, borde `#334155`, hover `#334155`/blanco vía micro-stylesheet `#voice-exit-style`), texto "✕ Cerrar" con la ✕ en rojo como affordance, espacio reservado en la barra (`w-[120px]`) para que no se pisen. Conserva sus tres listeners nativos (click/mousedown/touchend) y el plan nuclear de los 300 ms.
- Dato del owner's video (28-10): en su móvil (`isMobile:true`) el agente detectó `BackendSTTProvider` como primario — caminos móviles ya activos en prod.

---

### Fix 02-11-2026 (II) — Modo Voz en Móvil: Garbage Collection de TTS, watchdog dinámico anti-congelamiento, reanudación fluida y visor de logs táctil

**Síntoma reportado por el dueño (móvil):**
- El primer registro vocal funciona (escucha, procesa y confirma la venta).
- Tras la operación, el orbe se queda congelado en "Hablando..." sin salir del estado.
- Cuando finalmente sale del estado hablando (a los 15s de watchdog), el orbe queda en "Listo" (apagado en gris) y el tap no reactiva la escucha fluidamente. Al estar en celular, no había visibilidad de consola.

**Causas de raíz resueltas:**
1. **Chromium Bug #679437 en Android Chrome (GC de TTS):** La `SpeechSynthesisUtterance` era una variable local en `SpeechSynthesisProvider.speak()`. En Android Chrome, el Garbage Collector de V8 la recolectaba durante la reproducción, cancelando la emisión de `onend` y `onerror`. Fix: referencia fuerte anclada en `this._activeUtterance` y en `window.__activeVoiceUtterance` con liberación explícita en `onend`, `onerror` y `cancel()`.
2. **Watchdog TTS estático de 15 segundos (`VoiceTurnManager.js`):** Al fallar `onend`, el orbe se quedaba 15 segundos enteros congelado en `SPEAKING`. Fix: watchdog TTS adaptativo proporcional al texto (`Math.max(3000, Math.min(9000, Math.round((cleanLen / 11) * 1000) + 1800))`). Frases cortas de venta se recuperan solas en ~3.5s si el sintetizador no reporta el fin.
3. **Desbloqueo de escucha en estados desfasados (`iniciarEscucha`):** Si `this.currentSTT?.isActive()` quedó con flags pendientes mientras el manager está en `READY` o `IDLE`, se fuerza un `currentSTT.cancel()` limpio para no bloquear la reanudación de la escucha.
4. **Tap fluido en el Orbe (`handleOrbClick` en `MostradorMode.jsx`):**
   - En `READY` o `IDLE`: tap en el orbe llama de inmediato a `iniciarEscucha()` (no destruye ni recrea la sesión).
   - En `SPEAKING` o `SETTLING`: tap en el orbe omite el audio y pasa de inmediato a escuchar.
   - Auto-activación al abrir el modal si el servicio está en `IDLE`.
5. **Visor de Telemetría y Logs en Vivo para Móvil (`📜 Logs`):** Botón en la barra superior de `MostradorMode` con panel flotante colapsable que muestra en tiempo real los últimos 25 eventos `[VOICE-TURN]`, `[VOICE-STT]`, `[VOICE-TTS]` con hora exacta para diagnóstico remoto sin DevTools.

**Verificación:**
- `npm run test:voice` (Harness FSM 4/4 pasando en 17ms).
- `npm run build` en `frontend/` limpio en 8.06s.

---

### Fix 02-11-2026 — "Acá no me vuelve nada": entrega tardía, anti-sueño y medición de latencia

**Evidencia (video real del dueño, 02-11, 130s, 1480×766):** se extrajeron 65 frames + audio transcrito (faster-whisper). En la consola visible del video aparece la secuencia mortal del turno:

```
[VOICE-TURN] SEND_MESSAGE turnId=2 → POST /agente/mensaje (Render)
⏳ >15s
[VOICE-TURN] Watchdog PROCESSING expiró (15s). Reseteando a READY
[agentService] HTTP 200 ← el backend SÍ respondió
[VOICE-LIFECYCLE] IGNORED_STALE_CALLBACK event=onSendMessage_resolved_after_invalidation
                  callbackTurn=2 activeTurn=2 state=READY
```

**Diagnóstico:** no era que el backend no respondiera — el propio frontend **descartaba la respuesta por llegada tardía** (guard post-asíncrono `state !== PROCESSING` + `turnFinalized=true` del watchdog). El dueño oía silencio y concluía "no me vuelve nada".

**Correcciones:**
- **P1 — Ventana de entrega tardía** (`VoiceTurnManager.js`): al expirar el watchdog PROCESSING ya NO se invalida el turno; se guarda `pendingLateResponse {turnId, sessionGen}` y el orbe pasa a READY. Cuando la respuesta resuelve, si el turno sigue siendo el activo y ningún turno nuevo arrancó (`_enVentanaTardia`), **se entrega y se habla igual** (`LATE_RESPONSE` en consola). Si el dueño inició otro turno (`iniciarEscucha`/`_invalidateCurrentTurn`), la ventana se cierra y la respuesta vieja se descarta como antes. Nuevo `sendSeq` desambigua dobles envíos del mismo `turnId` (p. ej. confirmación manual durante la ventana tardía). `enviarMensajeManual` libera `turnFinalized` para permitir el envío manual durante la ventana.
- **P2 — Anti-sueño Render** (`useVoiceAgent.js`): heartbeat `GET /health` cada 4 min mientras el modo voz está montado + latido inmediato al entrar (precalienta cold start). Render free duerme el servicio tras ~15 min sin tráfico → cold start de decenas de segundos, sospechoso #1 de latencias >10s. Funciona también en dev (proxy `/api` reescribe a `/health`).
- **P3 — Medición por fase** (`app/routers/agente.py`): la respuesta de `/agente/mensaje` ahora incluye `tiempos: {total_ms, fuente}` medido en el router; el frontend lo loguea como `[VOICE-TURN] TIEMPOS_BACKEND backend_total_ms=… frontend_roundtrip_ms=…`. Test nuevo en `test_agente_produccion.py` T-01 valida presencia/tipo.

**Verificación:**
- Harness Node del FSM (`tmp_vtm_test.mjs`, bundle esbuild de `VoiceTurnManager.js`): **4/4 ✅** — T1 respuesta tardía se entrega y habla; T2 turno nuevo descarta tardía vieja; T3 flujo normal intacto; T4 envío manual en ventana tardía desambiguado por `sendSeq`.
- Backend: **86/86 pytest** (86 originales + assertion `tiempos` en T-01 → 16/16 en `test_agente_produccion.py`).
- E2E local `POST /api/agente/mensaje` (:8002): `tiempos: {'total_ms': 0, 'fuente': 'backend'}` en respuesta IDLE (plan PRO temporal revertido a BASIC tras la prueba).
- `npm run build` limpio (15.29s).

**Pendiente (P4, opcional):** streaming LLM→TTS para que el habla empiece con la primera frase en vez de esperar el texto completo.

---

### Fix definitivo 26-10-2026 (III) — Hallazgos de auditoría externa: portal + condición + pointer-events (commits post-48b9c0c)

Auditoría (Gemini, formato de prompt en `docs/traspaso/PROMPT_AUDITORIA_MODO_VOZ.md`) refutó la tesis de la extensión y encontró **dos defectos deterministas** del propio código, ambos introducidos/compuestos en `48b9c0c`:

- **H2 (aceptado):** el `if (!isOpen) return null` de `MostradorMode` se PERDIÓ en la reestructuración de hooks → el overlay se pintaba SIEMPRE → explicaba "me logueo y de una me manda para la orbe" (era determinista, no click accidental). Fix F1: condición restituida *después* de todos los hooks (legal por Rules of Hooks).
- **H1 (aceptado):** el `<aside>` de `AgentWidget.jsx:189` es `pointer-events-none` cuando el chat está cerrado, y `abrirModoVoz` cierra el chat → **los clicks atravesaban el overlay** y golpeaban el Header/Dashboard de abajo. El "Salir que deslogueaba" nunca fue el handler propio: era el botón de logout del Header debajo. Fix F2: **portal a `document.body`** + `pointer-events-auto` en el overlay (resuelve también H4: el z-[70] no funcionaba atrapado en el contexto de apilamiento z-30 del aside).
- **H5 (aceptado):** el cable de emergencia quitaba nodos de React a mano (`remove` → riesgo de `NotFoundError: removeChild` en el siguiente unmount). Fix F4: plan nuclear solo como recarga — si React no desmontó el overlay en 300 ms, `location.replace('/dashboard')`.
- **F3 (diagnóstico):** logger `[VOICE-UI] click "..." EN overlay | FUERA (atravesó)` — ahora distingue dónde cayó realmente el click.

**Verificación E2E con hit-testing real (browser.click por coordenadas/refs, no click JS sintético):** login → SIN overlay fantasma; abrir modo voz → `elementFromPoint` cae EN overlay; click real en Salir del overlay → `/dashboard` logueado; reabrir → click en "Toca para Iniciar Escucha" → `🟢 Servicio: Hablando`. 43/43 tests de voz. La tesis de la extensión queda REFUTADA (los `200.js`/`M_ID`/`css:2:1` son ruido de extensión, sin relación causal).

---

### Hotfix 26-10-2026 (II) — CAUSA RAÍZ del modo voz muerto: Rules of Hooks + "Salir" deslogueaba (commit post-hotfix)

Con los logs en vivo del usuario sobre el deploy (bundle `index-DzkVst9a.js`) se confirmó: clicks llegan al documento pero el ciclo era **abrir → cerrar → árbol React muerto → deslogueo**. Tres causas encadenadas, todas reales:

1. **Rules of Hooks (causa raíz del zombi):** `MostradorMode` tenía `if (!isOpen) return null` ANTES de sus `useEffect` (526cb9a introdujo hooks en un componente con early-return). Al cerrar el modal, React cuenta menos hooks → crash del árbol → pestaña zombi donde el orbe no enciende nunca más. Fix: todos los hooks y la destructuración de `voiceAgent || {}` movidos antes del retorno condicional.
2. **"Salir" sacaba de la sesión:** el botón `Salir` del modal navegaba y el estado resultante terminaba en `/login` con token borrado (confluencia del crash + los interceptores 401). Fix: handler dedicado `salirAlDashboard()` (`desactivarModoVoz` + `onClose` + `navigate('/dashboard', {replace:true})`); Escape usa el mismo camino. Petición explícita del usuario: "que me vuelva a redirigir al dashboard".
3. **Conflicto de z-index:** el Sidebar es `fixed z-50` y el overlay del modo voz también `z-50` — riesgo de solape de capas (el Header además tiene su propio botón "Salir" de logout). Fix: overlay del modo voz subido a `z-[70]`.
4. **Pill en ERROR mostraba "🟢 Activo":** prioridad de la pill reordenada — `isError → 🔴 Servicio: Error` tiene precedencia sobre estados activos.

**Verificación E2E (26-10, ciclo que antes mataba la app):** abrir modo voz → click en "Salir" del overlay → aterriza en `/dashboard`, token intacto, sin crash → reabrir modo voz → click en el orbe → sesión activa (`READY → LISTENING → ERROR` por mic denegado en sandbox: esperado), pill refleja estados, "Reintentar" disponible.

**Pendiente usuario:** mantener `deploy auto` en Vercel con este commit; probar en el dominio HTTPS (sin emulación de dispositivo ni Save-Data); los `200.js M_ID ×8` siguen siendo extensión de Chrome, no del proyecto.

---

### Hotfix 26-10-2026 — Indicador de servicio, Reiniciar y diagnóstico zombi (commit 526cb9a + fix import)

Continuación del blindaje del Modo Voz tras el reporte del usuario (orbe siempre "Listo", clicks muertos):

- `MostradorMode.jsx`:
  - **Pill visible de servicio**: `🟢 Servicio: Activo / Escuchando / Hablando` vs `⚪ Servicio: Apagado` vs `🔴 Servicio: Error` — respuesta directa a la petición de "entender que el servicio se prendió o apagó".
  - Botón **Reiniciar** siempre en la barra superior (`desactivar + activar` completo).
  - **Activación por teclado**: Enter/Espacio ejecuta la acción principal del estado actual; Escape sale (con guard para no robar el focus de botones/inputs).
  - **Diagnóstico en fase de captura**: listener document-level loguea `[VOICE-UI] click capturado` con el `voiceState` vigente — si el usuario hace click y NO aparece la línea, el DOM está muerto (pestaña zombi de BFCCache/extensiones), cerrando el debate causal en una sola prueba.
- `useVoiceAgent.js`: guard de ownership en el cleanup (`managerRef.current === manager`) contra remontajes de StrictMode/HMR que dejaban managers huérfanos; nueva acción `reiniciarSesion` expuesta.
- **Fix crítico post-commit:** `import React, { useEffect }` en `MostradorMode.jsx` — el `useEffect` nuevo se usó sin importarse y derribaba el árbol React completo (`ReferenceError: useEffect is not defined` → pantalla en blanco al abrir el modo voz). Detectado en la verificación en vivo el 26-10 (502 → navegador: colapso del árbol; dashboard y login 86/86 tests ok).

**Verificación E2E (26-10):** pill `⚪ Apagado → 🟢 Hablando → 🟢 Activo` ciclando correctamente, `[VOICE-UI] click capturado` logueando cada tap con su estado (IDLE, ERROR), Reintentar re-activa el ciclo de saludo, 43/43 tests de voz, 86/86 backend, build Vite limpio.

**Falsos positivos del reporte (22-10):** los `TypeError: reading 'M_ID'` provienen de `200.js` que NO es un archivo del proyecto (vite solo sirve módulos hasheados; `index.html` no carga script externos) → extensión de Chrome del usuario. Los `POST /api/token 401` en loop son consistentes con reintentos de login automático con contraseña vieja (autofill de Chrome / credencial desactualizada tras el reset de la demo). Recomendación al usuario: hard reload (Ctrl+Shift+R), probar en ventana de incógnito para descartar extensión, y limpiar autofill del formulario de login.

**Falsos positivos descartados:** El polling cada ~20s de `GET /health` y los `GET /v1/models` (404) provienen de `opencode-cli.exe` (harness de agente, PID 2620), NO de la app. Los 3× `POST /token 401` fueron artefactos de submits inyectados durante la automatización con state de React no asentado — no reproducible por un usuario real.

---

## Historial de propuestas implementadas

> [GEMINI PROPONE → ✅ CLAUDE IMPLEMENTA] Validar límite de stock en CartContext.agregar()
> **Solución:** `CartContext.jsx` — en `agregar()`, si `existe.cantidad >= producto.cantidad_actual` retorna `prev` sin modificar. El botón "+" queda silenciosamente deshabilitado al llegar al stock disponible.

> [GEMINI PROPONE → ✅ CLAUDE IMPLEMENTA] Refrescar listado de productos post-checkout
> **Solución:** Evento `window` desacoplado — `CartSidebar.jsx` dispara `new Event('venta-completada')` post-checkout. `Inventario.jsx` escucha el evento con `useEffect` y llama `cargar()`. Evita acoplar contextos y no requiere ProductosContext global.

---

## Sprint 10 — Landing Premium Dark-First (PROPUESTA — 2026-10-18)

> [CLAUDE PROPONE] Sprint 10 — Reingeniería visual del landing público con dirección dark-first
> **Motivo:** El landing actual (`frontend/src/pages/LandingPage.jsx`, 989 líneas) tiene copy excelente
> pero lectura visual "AI-slop": paleta default de Tailwind (`emerald-600/slate-800/#fafaf9`),
> monotonía de grids de cards idénticas, cero fotografía, cero movimiento y contenido placeholder
> visible ("PENDIENTE", "Cuenta local y Twilio"). Análisis forense de la página ganadora del hackathon
> (ORIVIA) + playbook replicable en `docs/PLAYBOOK_FRONTEND_PREMIUM.md`. Resuelve brecha B5 del Sprint 9.
> **Decisión de dirección aprobada por el dueño:** paleta **dark-first elegante**
> (bosque oscuro + crema + acento ámbar, elevada desde la sección "Economía Popular" actual).
> **Autorización pendiente:** Gemini QA + dueño.
> **Instrumento agregado 2026-10-18:** review/QA con el framework **AGENTERS** del dueño
> (`Desktop/AGENTERS`, swarm A00–A13 con Gemini): el router TCS despertaría solo A03
> (Design Tokens + WCAG 2.1 AA) y A09 (QA Lead), sin gastar cuota en agentes innecesarios.
> **⚠️ EN PAUSA (decisión del dueño 2026-10-22):** no se despachan agentes AGENTERS
> hasta actualizarlos por completo — QA1 lo hace GLM mientras tanto.

### Tokens de marca dark-first (F0)

``css
@theme {                        /* frontend/src/index.css (Tailwind v4) */
  --color-noche:       #101613; /* fondo base (verde-negro Huila)         */
  --color-bosque:      #16281f; /* superficie de secciones                */
  --color-card:        #1b2a22; /* cards sobre oscuro                     */
  --color-crema:       #f5efe6; /* tinta principal sobre oscuro + acentos */
  --color-tinta-suave: #a7b1aa; /* texto secundario                       */
  --color-ambar:       #d89a3d; /* acento CTA                             */
  --color-tierra:      #6b3f2a; /* acento secundario (café)               */
  --color-cereza:      #a3262a; /* estados de alerta                      */
  --color-linea:       rgba(245,239,230,.09);
}
/* Tipografía: Montserrat 300–700. El copy NO se toca: es el activo fuerte. */
``

### Micro-tareas (atómicas, con comando de verificación — regla §7 de AGENTS.md)

**ORDEN CONFIRMADO POR EL DUEÑO (2026-10-19): copy primero (H0→H2), luego visual (F0→F3).**
Racional: iterar copy cuesta ~10 min, iterar layouts animados cuesta horas. El diseño se
construye sobre el mensaje final del ICP, no sobre el copy viejo (ver Redefinición de Alcance).

| # | Tarea | Asignado | Archivo | Verificación |
|---|-------|----------|---------|--------------|
| H0 | Copy al nuevo ICP ANTES de todo diseño: titular hero + promesa del Modo Lite + redefinir narrativa de Hero, Propuesta de Valor, Pasos Reales y FAQ según Redefinición de Alcance 2026-10-19. Borrador en `docs/landing_copy.md` para review del dueño | GLM (dueño aprueba) | `docs/landing_copy.md` | REVIEW DEL DUEÑO — sin F0 hasta su visto bueno |
| H1 | Retirar jerga interna del header ("Cuenta local y Twilio" → tagline humana "La cuenta de tu negocio, al día") | GLM | `LandingPage.jsx` | `grep -c "Twilio" frontend/src/pages/LandingPage.jsx` → 0 |
| H2 | Resolver placeholders: ocultar sección Historias y redes vacías con flag `CONTENIDO_PENDIENTE=false` hasta tener casos reales | GLM | `LandingPage.jsx` | `grep -cE "PENDIENTE" LandingPage.jsx` → 0 (co-beneficio B5) |
| F0.1 | Instalar Montserrat + tokens `@theme` en `index.css`; mapear clases existentes emerald/slate → tokens | GLM | `frontend/src/index.css`, `LandingPage.jsx` | `cd frontend && npm run build` limpio |
| F1.1 | `npm i motion` y componente `Reveal.jsx` (whileInView + `useReducedMotion`) wrappeando secciones | GLM | `frontend/src/components/landing/Reveal.jsx` | build + scroll manual en dev server |
| F1.2 | Parallax simétrico ±40px en wrappers de sección (`useScroll`+`useTransform`) | GLM | `frontend/src/hooks/useParallax.js` | build + scroll manual |
| F1.3 | Capa ambiental `AmbientLayer.jsx` (motas deterministas + niebla 38s + gradient mesh) sobre fondo dark | GLM | `frontend/src/components/landing/AmbientLayer.jsx` | build + FPS ≥ 55 en devtools móvil |
| F1.4 | Header sticky que se solidifica pasadas 1.35vh con transición 500ms | GLM | `LandingPage.jsx` | scroll manual |
| F2.1 | Clip Veo (gemini/flow): "un día en la tienda: abrir persiano, primer cliente, registro de venta" → ffmpeg a 90–151 frames webp 1600px | Dueño (GLM genera el prompt) | `frontend/public/media/viaje/v%03d.webp` | total de frames < 6 MB |
| F2.2 | Componente `FrameSequence.jsx` (scrub canvas 2D + spring + fallback poster), en la sección "¿Cómo funciona?" (h-[480–620svh] sticky, mapeo de los 4 pasos reales a rangos de progreso) | GLM | `frontend/src/components/landing/FrameSequence.jsx` | build + scroll con devtools throttling 3G |
| F3.1 | Cirugía de layouts: romper patrón "eyebrow+h2+grid de cards" — Economía Popular full-bleed statement, Propuesta en bento asimétrico, Pasos dentro del scroll-telling, Historias fuera (H2) | GLM | `LandingPage.jsx` | checklist visual §2 del playbook |
| F3.2 | Secciones claras alternadas (papel `#f5efe6`) para ritmo dark-first + hero con ken-burns sobre la primera foto real | GLM | `LandingPage.jsx` | contraste AA: ámbar sobre bosque ≥ 4.5:1 |
| QA1 | Auditoría de Design Tokens + WCAG 2.1 AA sobre la paleta dark-first + QA Lead del landing rehecho | GLM | QA report en repos | reporte sin issues rojas |

**Nota de asignación (regla temporal, decidida por el dueño — 2026-10-22):**
todas las tareas del plan las desarrolla **GLM (OpenCode)** hasta que AGENTERS esté
**actualizado por completo**. Los agentes A00–A13 no se despachan todavía; cuando lo estén,
la tabla migrará a sus IDs según `docs/04_PROTOCOLO_UNIVERSAL_MODELO_AGNOSTICO.md` del repo AGENTERS.

### Presupuesto y restricciones

- Sin TypeScript (regla activa). Assets de frames bajo `frontend/public/media/viaje/`.
- **H0 → H2 (copy al ICP) va primero y no depende de nada externo: ejecutable hoy.** F0 y F1
  dependen del visto bueno de H0 (copy define contenedores). F2.1 depende de Veo (dueño).
- Presupuesto de bundle: JS bajo control (`motion` ≈ +18 kB gzip en el chunk del landing); lo pesado son assets de frames.
- Fallback sin-JS: todo contenido servido visible por CSS (lección forense de ORIVIA).

### Criterios de éxito Sprint 10

1. `grep` sin "PENDIENTE" ni "Twilio" en `LandingPage.jsx` y `npm run build` limpio.
2. Landing con ≥ 1 imagen real animada (ken-burns) y ≥ 1 sección scroll-telling funcional.
3. Checklist anti-AI-slop §2 del playbook: tokens nombrados, ≥ 3 layouts distintos entre secciones, textura ambiental activa.
4. Gemini QA sin issues de severidad roja.

---

## Redefinición de Alcance — 2026-10-19 (decisión del dueño)

> [DUEÑO APRUEBA] Debate resuelto: "el SaaS dedicado a ahorrar horas contando unidades,
> llevando registro y ver cómo va el negocio desde cualquier parte".

### Qué se decidió

1. **Fábrica = motor interno, nunca producto público.** La fábrica sigue siendo nuestro martillo para
   generar y evolucionar clientes/software, pero NO se ofrece al exterior. El producto visible y en
   venta es **UNA SaaS vertical multi-tenant: Gestión Neiva**. Los sistemas de demo de la fábrica
   (`pos-papeleria`, `erp-distribuidora`) pasan a ser artefactos internos de QA/regresión del motor,
   no portafolio de oferta.
2. **ICP (cliente ideal) redefinido — microempresarial ampliado, no solo tendero:** cualquier persona
   con un emprendimiento cuyo negocio todavía no es lo suficientemente grande ni formal para
   llamarse microempresa completa, o una microempresa real (papelería, ferretería, talleres, comida,
   almacenes). Su rasgo común: **hoy lleva el stock y las cuentas en cuaderno, Excel o memoria;
   no quiere ni necesita página web; quiere anotar, contar unidades, guardar el registro y ver
   su negocio desde cualquier parte (celular), sin exponer datos al público.**
3. **Posicionamiento / one-liner de producto:**
   *"El registro de tu negocio en el bolsillo: anota tu stock y tus cuentas desde el celular,
   y mira cómo va tu negocio desde cualquier parte, sin exponer nada al público."*
   Beneficio central (las palabras del dueño): **ahorrar horas de trabajo contando unidades.**
4. **Modo Lite "Solo Stock" = puerta de entrada al ICP** (producto existente + nuevo modo):
   - Onboarding mínimo: nombre del negocio → primer producto. Sin registros de cajeros ni complejidad POS.
   - Agregar/editar/ajustar stock, entradas y salidas rápidas, resumen simple (cuánto hay, qué se movió).
   - móvil primero, consultable desde cualquier parte; sin exposición pública de datos.
   - Upsell natural a POS completo (ventas, caja, cajeros, reportes) cuando el negocio crece — el trial
     y entitlements existentes (Sprint 8.4) son el puente comercial ya construido.
   - Especificación técnica detallada: SPRINT PENDIENTE (sprint 10.5 o 11) — se propone sobre el
     pipeline existente (entitlements + configuración por empresa), NO un producto aparte.

### Impacto inmediato en el Sprint 10 (landing)

- El copy del landing se reordena: **H0 (NUEVO)** redactar los mensajes al nuevo ICP (titular hero,
  promesa del Modo Lite, redefinir Hero / Propuesta de Valor / Pasos Reales / FAQ) ANTES de los
  tokens visuales (F0). Racional: el copy define contenedores y altura de las secciones; iterar
  copy cuesta 10 min, iterar layouts animados cuesta horas. Si se rediseña primero, el nuevo copy
  obliga a re-iterar el diseño (pago doble).
- H1/H2 (jerga/placeholders) se ejecutan en la misma pasada que H0.
- La dirección dark-first (bosque/crema/ámbar) se mantiene; se rellena con la narrativa ICP.

### Qué NO cambia

- Stack, arquitectura, tests, deploy en curso (Sprint 9), entitlements, RBAC, modo voz.
- La fábrica sigue operando con su protocolo actual para construir el resto del producto.

### Decisión post-MVP — retiro definitivo de la fábrica

> [DUEÑO APRUEBA — ejecutar solo después del cierre verificable del MVP] La fábrica de generación de negocios queda descartada definitivamente. No forma parte del producto ni de la sustentación del MVP.
>
> Al cerrar los Sprints 2–4 y reunir la evidencia final, crear una decisión formal de alcance, archivar o retirar el contenido residual de `factory/` y eliminar sus referencias de `AGENTS.md`, `PLAN_ACTIVO.md` y `VISION_Y_ROADMAP.md`. No eliminar archivos ni modificar esas referencias durante la estabilización actual.

---

## Bitácora Sprint 9 — Despliegue

### 2026-10-26 — Fix frontend.prod: MIME "text/html" en chunks JS al entrar como cajero

- **Síntoma:** al acceder como cajero, consola con `Failed to load module script: MIME type "text/html"`
  para `usuarioService-*.js`, `Ventas-*.js`, etc. Página en blanco.
- **Diagnóstico (verificado contra producción):** pedidos a `https://gestion-neiva-claude.vercel.app
  /assets/UsuarioService...` devolvían **HTML del index**, no JS. El `index.html` servido referencia
  `/assets/index-8yrwzbVS.js` (deploy nuevo, con `Ventas-BVkBLE4v.js`), pero el navegador pedía
  chunks con hashes viejos (`index-BRtgzhqd.js`, `Ventas-Bu47AtJ6.js`) → caché de navegador de un
  `index.html` de un deploy anterior. Los chunks antiguos ya no existen; el `rewrite /(.*) →
  /index.html` de Vercel devolvía HTML ⇒ error MIME estricto de módulos.
- **El deploy NO estaba roto:** `assets/index-8yrwzbVS.js` responde JS válido con todo el map de
  chunks nuevos. Era un problema client-side de caché antigua.
- **Hardening en `frontend/vercel.json`:** headers explícitos — `/assets/(.*)` → `immutable, 1 año`;
  `/(.*)` → `max-age=0, must-revalidate` (el `index.html` nunca queda pegado tras un deploy).
- **Acción usuario inmediata:** recarga forzada (Ctrl+Shift+R) o limpiar caché del dominio.
- **Propuesta pendiente (no implementada):** fallback de recuperación en runtime ante chunks
  faltantes por deploy en caliente (retry de `import()` con reload una vez) — útil para clientes ya
  con la pestaña abierta durante un deploy.
- **Pendiente:** redeploy (o push) para que los headers del `vercel.json` queden activos en Vercel.

### 2026-10-23bis — HERO CINEMÁTICO AUTOPLAY (corrección de concepto, commit f5e06a5)

**Feedback del dueño:** el spot NO debe ser scroll-scrub; debe **presentarse solo** en el
primer apartado, y en la prueba real no se veía (el servidor Vite estaba caído y la sección
estaba a ~6000px de scroll).

**Cambio:**
- `hero.mp4` (2.95MB, crf26, faststart, fade in/out para loop) + `hero-poster.jpg` (97KB)
  generados desde `master_viaje.mp4`; el hero es ahora `<video autoplay muted loop playsInline>`
  a pantalla completa con el copy H1/CTA encima (scrim) y cinta "Una tienda real en Neiva".
- Se eliminó la sección scroll-scrub (`FrameSequence`); los 6 pasos quedan como tarjetas
  estáticas con fotogramas del spot (v010/036/054/076/098/114).
- Fixes de paso: header flotante con texto claro sobre video (`lnd-hd-login`), whitespace-nowrap
  en botones, ribbon sin overflow en móvil, `min-h-[100svh]` calibrado (hero = viewport exacto).
- Verificación (Edge headless + CDP): video `paused=false`, loop 48.7s, 6 tarjetas, 6 imágenes
  960×540 HTTP 200, `npm run build` limpio (LandingPage 45.92kB). El servidor Vite se relanzó
  (`npm run dev`, :5173).

**Lección de operación:** Vite muere por los restarts de OpenCode → si "no se ve el cambio",
primero comprobar `http://localhost:5173/` (Invoke-WebRequest) antes de asumir nada del código.

**Pendiente del dueño:** feedback visual del hero (¿el loop de 48s es demasiado largo? ¿quiere
un corte corto de ~20s para el hero?). Test de foco con teclado.

### 2026-10-23 — Spot scroll-telling del landing COMPLETO (F2.1 + guion, commit 38bf80d)

**Qué se hizo:**
- **F2.1 resuelto SIN Veo/créditos pagos:** pivot definitivo a capturas CDP deterministas
  (`browser.screenshot` por estado de la app real) + b-roll free de Pexels. La ventana de
  OpenCode solo necesita estar visible; produce stills 1209×789 nítidos de:
  Dashboard (ventas hoy 6 · $106.751 · 15 productos), Productos (Tienda Don Carlos),
  Carrito $11.065 → "Venta registrada", Timeline $61.474, Reportes ($6.081.742/$1.062.497)
  y el ciclo REAL del Asistente POS: "Vendi 2 arroz" → CONFIRMACIÓN REQUERIDA ($17.106)
  → "confirmar" → "Venta registrada exitosamente". Cero simulación: es la app corriendo.
- **Lecciones de interacción:** solo `browser.fill` + `browser.click` (trusted) disparan el
  envío del widget; clicks sintéticos de `evaluate` no enviaron el mensaje y a veces cerraron
  el widget. Ventas demo de hoy creadas VÍA el propio agente (no existe POST público de /ventas).
- **Pipeline ffmpeg documentado en noticias:** (1) zoompan de video continuo exige `fps=24`
  primero y `zoompan d=1` con expresiones en `in` (un solo `d=180` multiplica frames 180×;
  un zoompan default encadenado cae en `s=hd720`); (2) `settb=1/24576` en cada rama +
  offsets xfade = duración acumulada del previo − 0.5 (mal offset → master truncado a 24s);
  (3) chat: crop del widget `crop=610:700:608:85` sobre imagen 1209×789, panel vertical
  sobre fondo `0x0a0a12` → legible en 960×540.
- **Master:** `master_viaje.mp4` 48.67s (a1a frutería→a1b calle→a2 góndolas→c1 datáfono→
  product_block 24.29s→tail dark), todo 960×540@24 con xfades 0.35/0.5.
- **Frames:** 120 webp q62 @ fps=2.465753 (exacto 120/48.67) en `frontend/public/media/viaje/`
  → **3.15MB total** (~26KB/frame; antes 4.67MB). Hoja de contacto 8×15 verificada:
  narrativa completa y legible; único débil: frames ~93–100 (toast de cobro, mayormente
  blanco pero breve).
- **Guion:** `pasosScrollTelling` en `LandingPage.jsx` reemplazado de 4 steps onboarding a
  6 pasos narrativos (mostrador → stock → cobro → día en tu teléfono → números → asistente
  «Vendí 2 arroz») alineados a bins de 20 frames (20/40/60/80/100 — el chat abre por el
  frame ~113 = bin 6 ✓). `FrameSequence.jsx` sin cambios (pattern/frames ya correctos).
- **Demo:** backend :8000 vivo con trial Pro hasta ~2026-11-01; login `admin@admin.com` /
  `admin123` (bcrypt re-reseteado); password demo se re-rota misteriosamente → resetear
  bcrypt cuando haga falta.

**Comando de verificación ejecutado:** `count: 120 · total MB: 3.15` sobre
`frontend/public/media/viaje/` + hoja de contacto `viaje-contact.jpg` revisada visually.

**Siguiente (necesita al dueño):** probar el scroll-telling en :5173 (test de foco con
teclado + LCP), YA que el guion usa las tomas reales. Luego QA1 (Gemini) del landing.

### 2026-10-22 — ⛔ PAUSA GENERAL del plan (decisión del dueño)

> **⚠️ ACTUALIZACIÓN 2026-10-24:** la pausa se **levanta ÚNICAMENTE para el Sprint 10** (el landing
> es justamente lo que desbloquea todo, y el dueño ya corrigió el plan — ver entrada de abajo).

- **Estado:** todo el plan queda detenido **hasta tener un landing atractivo que capte más
  clientes potenciales**. El rebuild del landing es la única tarea en progreso (Sprint 10).
- **En cola tras esa barrera (NO proceder antes):** graphify update, especificación del
  Modo Lite "Solo Stock" (Sprint 10.5), resto del deploy/activación.
- **Dónde quedó el Sprint 10:** H0 copy en borrador (`docs/landing_copy.md`, verificación =
  review del dueño), asignaciones → GLM (AGENTERS en pausa hasta actualización completa).
- **Racional del dueño:** sin landing que convierta, nada de lo demás genera clientes.

### 2026-10-24 — ✅ H0 APROBADO + REBRAND GIN + video con 6 imágenes Gemini

**Cierre de sesión (aplicación de copys en código, commit `5047cd6`):**
- `LandingPage.jsx` con TODOS los copys aprobados + rebrand GIN: badge hero («Para comercios
  pequeños, emprendimientos y negocios familiares»), 3 checks nuevos (sin Neiva), CTA hero
  «Empieza a anotar tu negocio hoy», cinta inferior universal, propuesta (colaboradores →
  «Anota entre varios», sin «cajero»), §quienes → statement universal + 7 chips de ejemplo,
  FAQ reescrita (9 preguntas: q1 GIN, q2 universal, +3 nuevas del dueño), video poster
  «Aprende a usar GIN», CTA final reescrito, footer GIN sin ciudad, modal video GIN.
- Typos corregidos en `pasosScrollTelling`: «Sabras»→«Sabrás», «reinversion»→«reinversión».
- **Verificación:** `grep Neiva|Huila|tendero|Sabras|reinversion|cajero|Entrar a mi Tienda`
  sobre LandingPage.jsx → **0 matches**; `cd frontend && npm run build` → ✅ built in 52.7s.

**2026-10-27 — PIVOT del video: fotos → CLIPS Veo (decisión del dueño):**
- Las 6 imágenes del V1 quedan **descartadas**: al dueño no le gustó el look (tiendas sucias,
  de barrio maluco). También: clips de Gemini limitan a ~10 s c/u, así que se pasó de
  generar fotos a generar **clips de video de 10 s** (los que pida el storyboard).
- Reglas nuevas del dueño: tiendas **normales, bonitas y limpias**; varios dueños/negocios
  distintos para mostrar universalidad; los **4 personajes de la apertura cierran el video**
  (consistencia cronológica).
- Nuevo doc fuente: `docs/media/video_gin/STORYBOARD_VIDEO.md` — casting fijo de 4
  protagonistas (MARÍA tienda, DON CARLOS ferretería, ANA cafetería, JUAN papelería) +
  6 clips de 10 s (V1–V6) con prompts Veo en EN, VO por clip y plan de montaje (~45–55 s).
- El guion de voz dictado por el dueño queda intacto (marcado con ⭐ en el doc); líneas puente
  nuevas quedan pendientes de su OK.
- **Pendiente:** V1 (6 imágenes del video vía puente Antigravity/Gemini — requiere IDE abierta;
  `antigravity_status()` falló con "Antigravity no está abierto"). V2 montaje tras V1.
- **H0 verificado:** Hero **Opción A**; badge/checks/propuesta/FAQ/CTA aprobados; "¿a quiénes
  ayudamos?" pasa a **versión universal** (negocios de cualquier área, SIN listado por áreas);
  scroll-telling **condicional** (si la demo no convence, se retira y los pasos van estáticos).
- **REBRAND (decisión mayor):** el producto pasa a ser **GIN — Gestión de Inventario Inteligente**,
  cobertura **global**; se elimina toda referencia a Neiva del landing. Rebrand app-completo queda
  como task separada (RB-APP), no bloquea el rebuild. Detalle completo en `docs/landing_copy.md` §0.
- **Video (nuevo flujo):** el dueño dictó la voz del video y el flujo — **hasta 6 imágenes
  individuales generadas con Gemini** → montaje narrado que "habla" al viewer. Guion + prompts
  en `docs/media/video_gin/STORYBOARD.md`. Las imágenes sustituyen el clip Veo (F2.1).
- **Nuevas tareas activas:** R1 (rebrand Neiva→GIN en landing), V1 (generar 6 imágenes via
  Antigravity/Gemini), V2 (montaje video narrado + posterики en landing). Exec: GLM.
- **Próximo paso inmediato:** H0.5/H1/H2 aplicar el copy aprobado + rebrand en `LandingPage.jsx`,
  en paralelo con V1 (generación de imágenes).

### 2026-10-18 — Fix deploy Render: SQLAlchemy 2.1 cambió el driver default de PostgreSQL
- **Síntoma:** `ModuleNotFoundError: No module named 'psycopg'` en `alembic upgrade head` y uvicorn. El servicio nunca abrió puerto ("No open ports detected").
- **Causa:** `requirements.txt` declaraba `sqlalchemy>=2.0.30` sin tope → Render resolvió a SQLAlchemy 2.1 (salida 2026-09-24), que usa **psycopg3** por defecto para URLs `postgresql://`. Nuestro driver instalado es `psycopg2-binary`.
- **Solución:** acotar `sqlalchemy>=2.0.30,<2.1` en `requirements.txt` (psycopg2 sigue siendo el default en 2.0.x).
- **Verificación:** venv local con SQLAlchemy 2.0.52 queda incluido en el rango (sin reinstalación local); Dockerfile instala del mismo requirements; alembic y FastAPI comparten el mismo engine en `app/database.py`.
- **Pendiente:** migración futura a SQLAlchemy 2.1 requeriría agregar `psycopg[binary]` y URL `postgresql+psycopg://`.

### 2026-11-10 — ✅ CIERRE SPRINT 10: Live Ledger POS + 3 Ganchos Conductuales (Pausa Levantada)
- **Eliminación del cuello de botella:** Descartada definitivamente la dependencia de video de stock en el Hero (eliminado `<video src="/media/viaje/hero.mp4">` y capas de bloqueo).
- **Showcase Táctil POS (`frontend/src/components/landing/LiveDemoPos.jsx`):**
  - Implementado componente interactivo con `useReducer` determinista.
  - Aritmética financiera en vivo: Arroz Diana (\$5.200), Leche Alquería (\$4.500), Café Sello Rojo (\$17.600).
  - Cálculo de Margen Bruto Estimado (`(Venta - Costo) / Venta`), stock inmutable y protección contra doble clic en cobro.
  - Leyenda clara: "SIMULACIÓN · DATOS ILUSTRATIVOS".
- **Integración de los 3 Ganchos Conductuales en `LandingPage.jsx`:**
  - **Gancho 1 (Hero):** Fuga invisible de capital por productos vencidos y cuentas al ojo.
  - **Gancho 2 (Fidelización):** Sección dedicada al ticket con código de sorteo semanal para que el cliente final exija su comprobante.
  - **Gancho 3 (Comercio Hermano):** Sección de referidos con recompensa de 2 meses gratis de GIN Pro por cada nuevo comercio colega que active plan de pago.
- **Verificación Técnica:** `npm run build` ejecutado en `frontend/` completado con éxito en 38.92 segundos, 0 errores, chunks optimizados (LandingPage bundle en 63.48 kB).
- **Siguiente paso:** Sprint 9 (Despliegue y Activación en Producción).

---

> [GEMINI PROPONE] Plan de estabilización MVP y gobernanza modular
> **Fecha de propuesta:** 2026-11-21 · **Referencia completa:** `docs/audits/PLAN_RECUPERACION_MVP_GEMINI.md` · **Bitácora:** `docs/IA_BITACORA.md`
> **Motivo:** La auditoría técnica del 2026-11-21 (`docs/audits/INFORME_AUDITORIA_MVP_2026-11-21.html`) emitió dictamen *No conforme para defender como monolito modular verificado* debido a 2 hallazgos críticos (`DAT-03`: 4 FKs cruzadas hacia `empresas.id`; `ARC-03`/`ARC-08`: tráfico HTTP sigue entrando por `app/routers` y `app/services` heredados) y 5 hallazgos mayores (`.venv` copiado con Python 3.13.2, cobertura 80%/90% ausente en `requirements.txt` y CI, contrato faltante en `.importlinter`, pipeline CI incompleto, observabilidad/móvil 48px sin certificar).
> **Decisión estratégica aplicada:** Estabilización por capas (`evidencia reproducible → web móvil → DAT-03 → rutas por fachadas → sustentación`). **Fuera de alcance:** Flutter/offline-first (`ADR-005`) y nuevas funcionalidades. Ninguna tarea está marcada como completada hasta ejecutar y verificar su comando de salida en entorno limpio.
>
> ### Sprint 0 — Entorno reproducible y compuertas de calidad
> - [ ] **S0-1 — Saneamiento de árbol Git:**
>   - **Objetivo:** Resguardar `frontend/dist/index.html` y definir política limpia de archivos sin confirmar antes de estabilizar.
>   - **Archivo / área afectada:** `.gitignore`, `frontend/dist/index.html`.
>   - **Dependencia:** Ninguna.
>   - **Riesgo:** Bajo (pérdida de cambios locales no respaldados si se descartan sin revisar).
>   - **Comando exacto de verificación:** `git status --short`
>   - **Criterio de salida medible:** Árbol Git sin artefactos de build sucios ni cambios accidentales.
> - [x] **S0-2 — Recreación de `.venv` reproducible en Python 3.12:**
>   - **Objetivo:** Eliminar `.venv` heredado de `GESTION_NEIVA_CLAUDE` (Python 3.13.2) y recrearlo desde `GESTION_INVENTARIO_INTELIGENTE` con Python 3.12.
>   - **Archivo / área afectada:** `.venv/`, `requirements.txt`.
>   - **Dependencia:** S0-1.
>   - **Riesgo:** Medio (requiere intérprete Python 3.12 disponible en la máquina).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\python.exe --version && .\.venv\Scripts\python.exe -c "import sys; print(sys.prefix)"`
>   - **Criterio de salida medible:** `Python 3.12.x` y `sys.prefix` apuntando a `...\GESTION_INVENTARIO_INTELIGENTE\.venv`.
>   - **Evidencia verificada (2026-11-21 17:48):** `.venv` respaldado en `..\GESTION_INVENTARIO_INTELIGENTE_venv_bak_20261121`; nuevo `.venv` creado con `Python 3.12.13`; `sys.prefix = C:\Users\merid\Documents\GESTION_INVENTARIO_INTELIGENTE\.venv`; `pip install -r requirements.txt` y `pip check` exit `0`; `pytest 7.4.3` recolectó `94 tests collected in 2.47s`.
> - [x] **S0-3 — Dependencias de cobertura y compatibilidad QA:**
>   - **Objetivo:** Declarar `pytest-cov` en `requirements.txt` y verificar compatibilidad de `httpx`/`pytest`/`import-linter`/`ruff`.
>   - **Archivo / área afectada:** `requirements.txt`.
>   - **Dependencia:** S0-2.
>   - **Riesgo:** Medio (cambio de versión de `httpx` puede impactar fixtures de `TestClient`).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe --help | Select-String "cov-fail-under"`
>   - **Criterio de salida medible:** `--cov` y `--cov-fail-under` reconocidos por `pytest` con exit code `0`.
>   - **Evidencia verificada (2026-11-21 18:09):** RED previo confirmado (`pytest tests --cov=app --collect-only -q` → exit `4`, `unrecognized arguments: --cov=app`); añadido únicamente `pytest-cov==6.3.0` (`coverage==7.17.4`) a `requirements.txt` (compatible con `pytest==7.4.3`); `pip install -r requirements.txt` y `pip check` exit `0` (`No broken requirements found.`); `pytest --help` reconoce `--cov`, `--cov-report` y `--cov-fail-under`; `pytest tests --cov=app --collect-only -q` recolectó `94 tests collected in 1.65s` (exit `0`); `ruff 0.17.6` e `import-linter 2.17` operativos. Advertencia `StarletteDeprecationWarning` (`httpx` vs `httpx2`) registrada sin cambiar versiones hasta confirmar comportamiento real en S1-1.
> - [x] **S0-4 — Contrato faltante de `reportes_analytics` en `.importlinter`:**
>   - **Objetivo:** Agregar contrato `reportes-analytics-internals-are-private` y ejecutar `lint-imports` localmente.
>   - **Archivo / área afectada:** `.importlinter`.
>   - **Dependencia:** S0-2.
>   - **Riesgo:** Bajo (puede revelar importaciones internas existentes que deban limpiarse).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\lint-imports.exe`
>   - **Criterio de salida medible:** Exit code `0` con 7/7 contratos `KEPT`.
>   - **Evidencia verificada (2026-11-21 18:20):** Línea base previa `6 kept, 0 broken`; `rg -n "app\.reportes_analytics\.internal" app tests` devolvió únicamente `app\reportes_analytics\api\facade.py:5`; añadido contrato `reportes-analytics-internals-are-private` en `.importlinter`; `.\.venv\Scripts\lint-imports.exe` → `Analyzed 84 files, 143 dependencies. Contracts: 7 kept, 0 broken.` (exit `0`); `git diff --check` exit `0`. Reglas `app.routers -> app.services/*.internal` diferidas a S4-4.
> - [x] **S0-5 — Línea base real de lint y build frontend:**
>   - **Objetivo:** Ejecutar `ruff`, `compileall`, pruebas de voz FSM y `vite build` en árbol limpio y archivar evidencia.
>   - **Archivo / área afectada:** `ruff.toml`, `app/`, `tests/`, `frontend/`.
>   - **Dependencia:** S0-3, S0-4.
>   - **Riesgo:** Medio (errores preexistentes de `ruff` en `app/`).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\ruff.exe check app && .\.venv\Scripts\python.exe -m compileall -q app tests && cd frontend && npm run test:voice && npm run build -- --outDir <TEMP_GUID>`
>   - **Criterio de salida medible:** Exit code `0` en todos los comandos y log fechado en bitácora.
>   - **Evidencia verificada (2026-11-21 18:25–18:32):** Creado `ruff.toml` (`target-version = "py312"`, `select = ["E4", "E7", "E9", "F", "I", "B"]`, `B008` ignorado únicamente en `app/routers/*.py`, `app/dependencies.py` y `app/main.py`). Línea base previa: `53` errores (`32 I001`, `12 F401`, `4 F841`, `3 B904`, `1 E741`, `1 F541`); `46` corregidos con `--fix` seguro (sin `--unsafe-fixes`, revisado diff y validado `configure_mappers()`), `6` corregidos manualmente (`3 B904`, `2 F841`, `1 E741`). Verificaciones finales: `ruff check app` → `All checks passed!` (exit `0`), `compileall -q app tests` (exit `0`), `pytest tests --collect-only -q` → `94 tests collected in 0.30s` (exit `0`), `lint-imports` → `7 kept, 0 broken` (exit `0`), `git diff --check` (exit `0`). Frontend ya verificado sin tocar `frontend/dist/index.html`: `npm run test:voice` `4/4` (exit `0`), `vite build` (exit `0`, `21.65s`) en `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s0-5-1549f21f-d576-42c2-895c-58c19bef17b3`. Familias `UP`, `BLE`, `SIM`, `TRY`, `ASYNC` y similares quedan deliberadamente fuera de la base inicial para evaluación posterior.
> - [ ] **S0-6 — Alineación inicial del workflow CI (división propuesta abajo; no marcado completado):**
>   - **Objetivo:** Incorporar `ruff check app`, artefactos de cobertura XML/HTML, servicio PostgreSQL para migraciones y stage `package` (`docker build`) en `.github/workflows/ci.yml`.
>   - **Archivo / área afectada:** `.github/workflows/ci.yml`.
>   - **Dependencia:** S0-3, S0-4.
>   - **Riesgo:** Medio (bloqueo temporal si se activa umbral 80%/90% antes de Sprint 1).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\python.exe -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"` + corrida en GitHub Actions.
>   - **Criterio de salida medible:** YAML válido y workflow CI verde generando `coverage.xml` e imagen Docker.
>
> > [ANTIGRAVITY PROPONE] Dividir S0-6 en etapas verificables sin inventar infraestructura prematura
> > **Motivo:** Alinear primero el CI de calidad y artefactos de cobertura sobre la infraestructura real existente, separando PostgreSQL/migraciones y empaquetado/despliegue en sus hitos respectivos.
> > - [x] **S0-6A — CI de calidad y artefactos de cobertura:** `.github/workflows/ci.yml` actualizado con `ruff check app`, `python -m compileall -q app tests`, `lint-imports`, `pytest tests/ -q --cov=app --cov-report=xml --cov-report=term-missing` (sin `--cov-fail-under` hasta S1-5), subida de `coverage.xml` con `if: always()`, `python run_e2e_simulation.py` separado (SQLite, sin afirmar PostgreSQL ni concurrencia real) y `npm ci` en frontend. **Evidencia verificada (2026-11-24 / 2026-11-25):** commit `8f200c1`, GitHub Actions Run `#45298915524` (`success`), jobs backend (`138126211730`) y frontend (`138126211469`) verdes, artefacto `backend-coverage-xml` (`id: 14877682399`, `9,176 bytes`), `82 passed, 12 skipped, 7 warnings`, cobertura global `79%`, `pos_ventas` `100%`, E2E SQLite (`run_e2e_simulation.py`) en verde.
> > - [ ] **S1-3 / S3-3 — PostgreSQL, migraciones y rollback en CI:** Servicio PostgreSQL de prueba, ejecución `alembic upgrade head → downgrade -1 → upgrade head` y pruebas de concurrencia/aislamiento reales.
> > - [ ] **DEV-03 — Docker, release y despliegue documentado:** Etapa `package` (`docker build`), triggers de release y alineación verificable con `10-devops/ci-cd.md`.
>
> ### Sprint 1 — Recorrido tendero y cobertura
> - [x] **S1-1 — Desbloqueo integral de la suite `pytest`:**
>   - **Objetivo:** Ejecutar las 94+ pruebas recolectadas en `.venv` Python 3.12 y corregir el hang de `TestClient`/`anyio` en Windows si persiste.
>   - **Archivo / área afectada:** `tests/conftest.py`, `tests/`.
>   - **Dependencia:** S0-2, S0-3.
>   - **Riesgo:** Alto (bloquea toda certificación automatizada backend).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/ -q`
>   - **Criterio de salida medible:** 100% de pruebas críticas pasan sin bloqueos ni timeouts.
>   - **Evidencia verificada (2026-11-25 17:27):** En `.venv` Python `3.12.13` (`pytest 7.4.3`), el hang de `TestClient`/`AnyIO` **no reapareció**. `pytest tests -q -rs --maxfail=1` → **`94 passed, 0 failed, 0 skipped, 7 warnings in 56.84s`** (exit `0`); `pytest tests --cov=app --cov-report=term-missing -q -rs --maxfail=1` → **`94 passed, 7 warnings in 65.05s`** (exit `0`), cobertura local `app/` = `80%` redondeado (`79.74%` exacto, `3,297` stmts, `668` miss; `app/pos_ventas/` = `100%`, `app/services/venta_service.py` = `83%`). Los 12 `skipped` de CI (Run `#45298915524`: `82 passed, 12 skipped`, `79%`) fueron auditados y corresponden 100% a pruebas de concurrencia/locking con guard `PostgreSQL` (5 en `test_concurrencia_postgres.py`, 3 en `test_adversarial_break_system.py`, 3 en `test_concurrencia_real.py`, 1 en `test_fase2_backend_rbac.py`), clasificados como **esperado por SQLite en CI** hasta `S1-3/S3-3`. Cero cambios de código requeridos.
> - [x] **S1-2 — Recorrido tendero E2E completo:**
>   - **Objetivo:** Ampliar `test_store_journey_e2e.py` para cubrir registro → login (`/api/v1/token`) → `/api/v1/me` → crear producto → venta → descuento de stock verificado (`25 - 4 = 21`) → dashboard (`1` venta, `18.000`) → logout stateless (limpieza de headers cliente) → rechazo `401` sin `Authorization`.
>   - **Archivo / área afectada:** `tests/end_to_end/test_store_journey_e2e.py`.
>   - **Dependencia:** S1-1.
>   - **Riesgo:** Bajo (decisión de arquitectura vigente: no crear `POST /logout`; JWT stateless; logout = eliminar token cliente).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/end_to_end/test_store_journey_e2e.py -v` + `.\.venv\Scripts\pytest.exe tests -q -rs --maxfail=1`
>   - **Criterio de salida medible:** 100% de pasos del recorrido tendero verificados con exit code `0`.
>   - **Evidencia verificada (2026-11-25 17:38):** `test_complete_store_e2e_journey_v1` ampliado con los pasos `a`–`j` (usando el `access_token` del login real `POST /api/v1/token`, no el de registro; `GET /api/v1/me` validado; stock `25.0 - 4.0 = 21.0` verificado vía `GET /api/v1/productos/{id}`; logout stateless eliminando headers y `GET /api/v1/me` → `401`). Sin endpoint `POST /logout` ni cambios en código de producción. E2E aislado: **`1 passed, 1 warning in 1.00s`** (exit `0`). Suite completa: **`94 passed, 0 failed, 0 skipped, 7 warnings in 60.69s`** (exit `0`); con cobertura: **`94 passed, 7 warnings in 65.78s`**, cobertura local `app/` = `80%` redondeado (`79.74%` exacto, `3,297` stmts, `668` miss — sin cambio vs S1-1). `git diff --check` exit `0`. *(Nota: `run_e2e_simulation.py` no fue re-ejecutado en esta microtarea; su última corrida verde verificada fue en CI Run `#45298915524`.)*
> - [x] **S1-3 — Concurrencia e integración en PostgreSQL real:**
>   - **Objetivo:** Verificar migraciones `001`..`013` y suite de concurrencia `SELECT ... FOR UPDATE` contra PostgreSQL de prueba.
>   - **Archivo / área afectada:** `tests/integration/postgres/test_concurrencia_postgres.py`, `.github/workflows/ci.yml`.
>   - **Dependencia:** S1-1.
>   - **Riesgo:** Medio (requiere contenedor PostgreSQL de prueba activo).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\alembic.exe upgrade head && .\.venv\Scripts\pytest.exe tests/integration/postgres/ -v`
>   - **Criterio de salida medible:** 100% de pruebas de concurrencia PostgreSQL en verde con stock final `>= 0`.
>   - **Evidencia verificada (local 2026-11-25 17:44 + CI 2026-11-25 18:34):**
>     - **Local (`gestion_neiva_test`, PostgreSQL 18.3):** `alembic current` antes `012` → `alembic upgrade head` (`012 -> 013`) → `alembic current` = `013 (head)`; `pytest tests/integration/postgres/ -v` → `5 passed, 1 warning in 2.32s`; `pytest tests -q -rs --maxfail=1` → `94 passed, 0 failed, 0 skipped, 7 warnings in 57.13s`.
>     - **GitHub Actions (commit `34e4b66`, Run `#45722182377`):** estado **`completed / success`**, ambos jobs verdes (`Lint, Boundary Check & Backend Tests` `job/139582963076` y `Frontend Voice FSM Tests & Production Build` `job/139582963525`). En `Stage 4`: `postgres:16-alpine` (`PostgreSQL 16.16`) saludable, `alembic upgrade head` aplicó limpiamente `001`→`013` desde base vacía y `alembic current` confirmó **`013 (head)`**. En `Stage 5`: **`94 passed, 0 failed, 0 skipped, 7 warnings in 40.86s`** (los 12 tests PostgreSQL ejecutados sin omitir), cobertura global `app/` = **`80%`** redondeado (**`79.77%`** exacto, `3,297` stmts, `667` miss), `app/pos_ventas/` = **`100%`** (`30/30`), artefacto `backend-coverage-xml` (`id: 15072148106`, `9,155 bytes`). En `Stage 6`: E2E SQLite `ALL END-TO-END (E2E) TESTS PASSED SUCCESSFULLY! (100% OK)`. *(Downgrade/re-upgrade y migración `014` quedan para `S3-3`.)*
> - [x] **S1-4 — Alineación ADR-003 en checkout (`venta_service` / `inventario`):**
>   - **Objetivo:** Ordenar `data.detalles` determinísticamente por `producto_id` antes de `with_for_update()` y alinear HTTP status de stock insuficiente (`400` → `422`) según decisión humana aprobada.
>   - **Archivo / área afectada:** `app/services/venta_service.py`, `app/inventario/internal/service.py`, `tests/unit/test_domain_unit.py`, `tests/module_integration/test_facades_integration.py`, `tests/test_adversarial_break_system.py`.
>   - **Dependencia:** S1-1 y decisión humana aprobada sobre código HTTP `422`.
>   - **Riesgo:** Medio (ajuste de aserción HTTP `400 → 422` en `test_ataque_concurrente_hilos_sobreventa_stock_uno`, preservando `400` para producto inexistente).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/unit/test_domain_unit.py tests/module_integration/test_facades_integration.py tests/integration/postgres/ -v` + `.\.venv\Scripts\pytest.exe tests -q -rs --maxfail=1`
>   - **Criterio de salida medible:** 0 deadlocks en pruebas concurrentes y contrato HTTP consistente con ADR-003.
>   - **Evidencia verificada (2026-11-25 19:38):**
>     - **TDD RED:** `test_registrar_venta_orders_detalles_by_producto_id_deterministically_unit` falló (`[high_id, low_id] != [low_id, high_id]`) y `test_checkout_when_stock_insufficient_returns_422_and_preserves_stock` falló (`assert 400 == 422`), `2 failed in 0.80s`.
>     - **Implementación mínima:** `registrar_venta` ordena `data.detalles` por `str(item.producto_id)` antes de llamar a `InventarioFacade.validar_y_descontar_stock_atomic`; `lock_and_deduct_stock` cambia solo stock insuficiente a `status.HTTP_422_UNPROCESSABLE_ENTITY` (producto inexistente permanece en `400`, rollback intacto).
>     - **TDD GREEN & Regresión:** pruebas nuevas/modificadas `8 passed in 3.40s`; `tests/integration/postgres/` `5 passed in 1.81s`; suite completa **`96 passed, 0 failed, 0 skipped, 9 warnings in 44.72s`**; con cobertura **`96 passed in 50.40s`**, `app/` = `80%` redondeado (`79.75%` exacto, `3,298` stmts, `668` miss), `app/pos_ventas/` = `100%` (`30/30`), `venta_service.py` = `84%`; `ruff check app` = `All checks passed!`; `lint-imports` = `7 kept, 0 broken`; `git diff --check` exit `0`.
> - [x] **S1-5 — Cierre de brechas de cobertura `>=80%` global y `>=90%` en `pos_ventas`:**
>   - **Objetivo:** Añadir tests unitarios e integración faltantes y activar las dos compuertas bloqueantes en CI.
>   - **Archivo / área afectada:** `tests/unit/`, `tests/module_integration/`, `.github/workflows/ci.yml`.
>   - **Dependencia:** S1-2, S1-4.
>   - **Riesgo:** Medio (archivos grandes en `app/services/agente/` pueden requerir cobertura adicional).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/ --cov=app --cov-report=xml --cov-report=term-missing --cov-fail-under=80 && .\.venv\Scripts\coverage.exe report --include="app/pos_ventas/*" --fail-under=90`
>   - **Criterio de salida medible:** Cobertura global `>= 80%`, `app/pos_ventas >= 90%`, artefacto `coverage.xml` generado.
>   - **Evidencia verificada (local 2026-11-26 18:39 + CI 2026-11-26 19:07):**
>     - **Local (`.venv` Python `3.12.13`):** tests de integración de `ReportesFacade` y `AgenteIaFacade` añadidos (`0` llamadas externas); cobertura global = **`81.17%`** exacto (`3,298` stmts, `621` miss), `app/pos_ventas/*` = **`100.00%`** (`30/30`), `98 passed, 0 skipped`.
>     - **GitHub Actions (commit `91cdf2b`, Run `#45914762624`):** estado **`completed / success`**, ambos jobs verdes (`Lint, Boundary Check & Backend Tests` `job/140231210895` y `Frontend Voice FSM Tests & Production Build` `job/140231210740`). `Stage 4`: migraciones `001`→`013` aplicadas limpiamente en `postgres:16-alpine` → **`013 (head)`**. `Stage 5`: **`98 passed, 0 failed, 0 skipped, 9 warnings in 43.01s`**, **`Required test coverage of 80% reached. Total coverage: 81.20%`** (`3,298` stmts, `620` miss), **`coverage report --include="app/pos_ventas/*" --fail-under=90` → `100%` (`30/30`)**, artefacto **`backend-coverage-xml`** (`id: 15162095976`, `9,103 bytes`). `Stage 6` E2E SQLite verde; frontend `npm ci` + `4/4 ✅ FSM del Modo Voz verificado` + `✓ built in 3.69s`. **Sprint 1 (`S1-1`..`S1-5`) 100% cerrado.**
>
> ### Sprint 2 — Web móvil responsive (Cerrado ✅ — archivado)
> - **Estado:** **Cerrado (`100%`, `S2-1`..`S2-4` `[x]`)** el `2026-11-27` y archivado en [`docs/audits/planes-cerrados/2026-11-27-sprint-2-web-movil-responsive.md`](docs/audits/planes-cerrados/2026-11-27-sprint-2-web-movil-responsive.md).
> - **Evidencia de cierre verificada:** commit `2ee5ddc` (`test(mobile): enforce 360px responsive QA in CI`), [GitHub Actions Run `#46019358053`](https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE/actions/runs/46019358053) (`completed / success`, ambos jobs en verde), Playwright público `3 passed / 1 skipped` (más recorrido autenticado local `4 passed`), Lighthouse móvil accesibilidad `95/90/90` (`>= 90`) y artefacto descargable `frontend-mobile-qa-evidence` (ID `15206887974`, `355,028 bytes`).
>
> ### Sprint 3 — DAT-03: aislamiento de tenancy mediante UUID + fachadas
> - [x] **S3-1 — Redacción de `ADR-006` sin editar ADRs aceptados (`001`–`004`):**
>   - **Objetivo:** Documentar formalmente el desacople de las 4 FKs cruzadas de `empresa_id` mediante UUID indexados y validación vía `AuthTenancyFacade`, la conservación de las 3 FKs intra-módulo, los snapshots históricos de `detalles_venta` y la política de no borrado físico.
>   - **Archivo / área afectada:** `05-architecture/decisions/records/ADR-006-aislamiento-tenancy-uuid-fachadas.md`, `05-architecture/decisions/README.md`.
>   - **Dependencia:** Aprobación humana de numeración ADR-006.
>   - **Riesgo:** Bajo.
>   - **Comando exacto de verificación:** `git diff 05-architecture/decisions/records/ADR-001* 05-architecture/decisions/records/ADR-002* 05-architecture/decisions/records/ADR-003* 05-architecture/decisions/records/ADR-004* 05-architecture/decisions/records/ADR-005* && git diff --check`
>   - **Criterio de salida medible:** 0 cambios en ADR-001..005 y `ADR-006` indexado en `05-architecture/decisions/README.md`.
>   - **Evidencia verificada (`S3-1` + enmienda `S3-1B` con aprobación humana, 2026-11-27 — solo documentación):** `ADR-006` creado y enmendado con las 5 decisiones técnicas aprobadas: (1) retiro completo de relaciones ORM cross-module sin `viewonly=True` y lectura del historial de ventas desde snapshots sin `joinedload` a `Producto`; (2) separación explícita de migración `014` (4 FKs cruzadas de `empresa_id` e índices de tenancy) vs migración `015` (snapshots, backfill, respuesta de ventas e índice único parcial de `productos`); (3) snapshots fijos `producto_nombre_snapshot`, `producto_codigo_snapshot` y `producto_unidad_snapshot` en `detalles_venta` sin duplicar `precio_unitario`, `cantidad` ni `subtotal`, distinguiendo compatibilidad de backfill legada vs obligación en ventas nuevas; (4) identidad de producto sin reactivación automática en `crear_producto()`, UUID nuevo y unicidad parcial `WHERE is_active = true`; (5) contrato uniforme `404` en `AuthTenancyFacade.ensure_active_company()` para empresa inexistente o inactiva (anti-enumeración). Indexado en `05-architecture/decisions/README.md`; `0` cambios en `ADR-001`..`ADR-005`; `git diff --check` exit `0`.
> - [ ] **S3-2 — Desacople ORM y retiro total de relaciones/cascades cross-module en `app/models.py`:**
>   - **Objetivo:** Quitar `ForeignKey("empresas.id")` en `Producto`, `Venta`, `SoporteTicket`, `AgentCommand`; retirar completamente todas las relaciones ORM cross-module (las 4 `cascade="all, delete-orphan"` en `Empresa` y sus `.empresa`, más las heredadas de `013`, sin `viewonly=True`) y conservar intactas las 3 FKs y relaciones internas.
>   - **Archivo / área afectada:** `app/models.py` (coordinado con la transición de snapshots `015` para lectura de ventas sin `joinedload`).
>   - **Dependencia:** S3-1, S1-1.
>   - **Riesgo:** Alto (`NoForeignKeysError` en SQLAlchemy o impacto en `joinedload`/tests de modelos).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/test_fase1_rbac_modelos.py tests/unit/ -v`
>   - **Criterio de salida medible:** Mappers ORM cargan sin error; `Base.metadata` contiene exactamente 3 FKs internas, 0 FKs cruzadas y 0 relaciones ORM cross-module.
> - [ ] **S3-3 — Migración reversible `014_desacoplar_fks_tenancy_empresa_id.py` (y `015` para snapshots/unicidad activa):**
>   - **Objetivo:** En `014`, eliminar en PostgreSQL las 4 FKs cruzadas hacia `empresas.id` con drop defensivo, garantizar índices sobre `empresa_id` y restaurar todo en `downgrade()`; separar en `015` los snapshots de `detalles_venta`, backfill, respuesta de ventas sin `joinedload` e índice único parcial `WHERE is_active = true` en `productos`.
>   - **Archivo / área afectada:** `alembic/versions/014_desacoplar_fks_tenancy_empresa_id.py` (y futura `alembic/versions/015_*`).
>   - **Dependencia:** S3-2.
>   - **Riesgo:** Alto (constraints sin nombre explícito en migraciones 006 y 010).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\alembic.exe upgrade head && .\.venv\Scripts\alembic.exe downgrade -1 && .\.venv\Scripts\alembic.exe upgrade head`
>   - **Criterio de salida medible:** `upgrade → downgrade → upgrade` salen con código `0` y `pg_constraint` reporta 0 FKs cruzadas y 3 internas.
> - [ ] **S3-4 — Validación de tenant activo por `AuthTenancyFacade` en escrituras cross-module:**
>   - **Objetivo:** Reemplazar queries directas a `models.Empresa` y blindar escrituras en `inventario`, `pos_ventas`, `soporte_crm`, `agente_ia` y `dependencies.py` invocando `AuthTenancyFacade.ensure_active_company()` con contrato `404` uniforme.
>   - **Archivo / área afectada:** `app/services/producto_service.py`, `venta_service.py`, `app/routers/soporte.py`, `app/services/agente/agent_orchestrator.py`, `app/dependencies.py`.
>   - **Dependencia:** S3-2.
>   - **Riesgo:** Alto (afecta todas las escrituras de negocio y dependencias JWT).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/ -q`
>   - **Criterio de salida medible:** 100% de suite pasa y toda escritura con `empresa_id` inexistente o inactiva responde `404` uniforme (sin enumeración de tenants).
> - [ ] **S3-5 — Suite de pruebas de aislamiento DAT-03, rollback y sincronización documental:**
>   - **Objetivo:** Crear tests de esquema, aislamiento por fachada, FKs internas intactas y rollback de migración 014; actualizar `02-domain/module-boundaries.md` y `06-data/*`.
>   - **Archivo / área afectada:** `tests/module_integration/test_dat03_tenancy_isolation.py`, `tests/integration/postgres/test_migration_014_rollback.py`, `02-domain/module-boundaries.md`, `06-data/*`.
>   - **Dependencia:** S3-3, S3-4.
>   - **Riesgo:** Medio (requiere PostgreSQL de prueba).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/module_integration/test_dat03_tenancy_isolation.py tests/integration/postgres/test_migration_014_rollback.py -v`
>   - **Criterio de salida medible:** 100% de pruebas DAT-03 y rollback en verde; docs `06-data/` sincronizadas a migración 014.
>
> ### Sprint 4 — Rutas por fachadas y cierre de sustentación
> - [ ] **S4-1 — Migración de routers `auth`, `empresas` y `usuarios` a `AuthTenancyFacade`:**
>   - **Objetivo:** Enrutar los endpoints de identidad/tenancy/RBAC exclusivamente por `AuthTenancyFacade` moviendo lógica interna a `app/auth_tenancy/internal/`.
>   - **Archivo / área afectada:** `app/auth_tenancy/*`, `app/routers/auth.py`, `empresas.py`, `usuarios.py`.
>   - **Dependencia:** S3-5.
>   - **Riesgo:** Medio (regresión en registro, login, trial o límite de cajeros).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/test_auth.py tests/test_entitlements_trial.py tests/test_fase2_backend_rbac.py tests/test_owasp_security.py -v`
>   - **Criterio de salida medible:** 100% de tests pasan y 0 imports de `app.services` en los 3 routers.
> - [ ] **S4-2 — Migración de routers `productos` y `ventas` a `InventarioFacade` y `VentasFacade`:**
>   - **Objetivo:** Eliminar bypass hacia `app/services/producto_service.py` y `venta_service.py` y quitar la delegación inversa desde `app/pos_ventas/internal/service.py`.
>   - **Archivo / área afectada:** `app/inventario/*`, `app/pos_ventas/*`, `app/routers/productos.py`, `ventas.py`.
>   - **Dependencia:** S4-1.
>   - **Riesgo:** Alto (núcleo transaccional POS y umbral de cobertura `>=90%`).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/ --cov=app/pos_ventas --cov-fail-under=90`
>   - **Criterio de salida medible:** 100% de tests pasan, `app/pos_ventas >= 90%` y 0 imports de `app.services` en `productos.py` y `ventas.py`.
> - [ ] **S4-3 — Migración de routers `soporte`, `superadmin`, `agente`, `dashboard` y `reportes` a sus fachadas:**
>   - **Objetivo:** Implementar `ReportesFacade` real (reemplazando stub `_ = VentasFacade`) y enrutar los 5 routers restantes por `SoporteCrmFacade`, `AuthTenancyFacade`, `AgenteIaFacade` y `ReportesFacade`.
>   - **Archivo / área afectada:** `app/soporte_crm/*`, `app/agente_ia/*`, `app/reportes_analytics/*`, `app/routers/soporte.py`, `superadmin.py`, `agente.py`, `dashboard.py`, `reportes.py`.
>   - **Dependencia:** S4-2.
>   - **Riesgo:** Alto (`agente_ia` tiene 280 casos de benchmark y 13+ pruebas adversariales).
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/test_soporte_crm.py tests/test_agente_produccion.py tests/test_agente_rbac_reabastecer.py tests/test_business_understanding_benchmark.py -v`
>   - **Criterio de salida medible:** 100% verde; 0 queries SQLAlchemy directas ni imports de `app.services` en `app/routers/`.
> - [ ] **S4-4 — Blindaje de `.importlinter` y demo deliberada de violación:**
>   - **Objetivo:** Prohibir en `.importlinter` que `app.routers` importe `app.*.internal` o `app.services`; probar fallo deliberado, revertir y archivar evidencia.
>   - **Archivo / área afectada:** `.importlinter`, `docs/IA_BITACORA.md`.
>   - **Dependencia:** S4-3.
>   - **Riesgo:** Bajo.
>   - **Comando exacto de verificación:** `.\.venv\Scripts\lint-imports.exe`
>   - **Criterio de salida medible:** 0 violaciones en estado final y log guardado de la infracción deliberada bloqueada.
> - [ ] **S4-5 — Cierre de `OBS-02`/`OBS-03` y `DEV-01`/`DEV-03`:**
>   - **Objetivo:** Alinear métricas mínimas y política `HEALTH_REQUIRE_REDIS` entre `app/main.py` y `13-operations/observability.md`, y alinear `.github/workflows/ci.yml` con `10-devops/ci-cd.md`.
>   - **Archivo / área afectada:** `app/main.py`, `13-operations/observability.md`, `.github/workflows/ci.yml`, `10-devops/ci-cd.md`.
>   - **Dependencia:** S4-3 y decisión humana sobre observabilidad/Redis.
>   - **Riesgo:** Bajo.
>   - **Comando exacto de verificación:** `.\.venv\Scripts\pytest.exe tests/ -q --cov=app --cov-fail-under=80` + revisión de corrida CI completa.
>   - **Criterio de salida medible:** Pipeline `lint → boundary-check → test (80%/90%) → package → deploy documentado` en verde y 0 discrepancias en `/health`/observabilidad.
> - [ ] **S4-6 — Cierre documental (`DOC-12`) y paquete final de sustentación:**
>   - **Objetivo:** Actualizar `00-sdd-guide.md`, `07-api/README.md` (migraciones `001-014`, OpenAPI `3.1.0`, ADRs `001-006`) y consolidar evidencia reproducible (cobertura XML/HTML, logs CI, migraciones, captura móvil 360 px y Locust si aplica).
>   - **Archivo / área afectada:** `00-sdd-guide.md`, `07-api/README.md`, `docs/IA_BITACORA.md`.
>   - **Dependencia:** S4-4, S4-5.
>   - **Riesgo:** Bajo.
>   - **Comando exacto de verificación:** `.\.venv\Scripts\ruff.exe check app && .\.venv\Scripts\lint-imports.exe && .\.venv\Scripts\pytest.exe tests/ --cov=app --cov-fail-under=80 && .\.venv\Scripts\pytest.exe tests/ --cov=app/pos_ventas --cov-fail-under=90`
>   - **Criterio de salida medible:** 0 hallazgos críticos abiertos y 100% de las 9 métricas de salida verificadas con artefacto fechado.
