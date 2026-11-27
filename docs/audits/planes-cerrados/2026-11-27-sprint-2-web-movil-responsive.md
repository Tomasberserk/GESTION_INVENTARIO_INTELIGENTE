# Plan Cerrado — Sprint 2: Web móvil responsive (`360×800`)

- **Estado:** Cerrado y verificado en CI (`100%`, `S2-1`..`S2-4` completados).
- **Fecha de cierre:** `2026-11-27`
- **Commit de implementación y QA móvil en CI:** `2ee5ddc` (`2ee5ddc15ec4678281ea1cb960d4f7a327af25ac`) — `test(mobile): enforce 360px responsive QA in CI`
- **Corrida de GitHub Actions:** Run `#46019358053` — https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE/actions/runs/46019358053
  - `Frontend Voice FSM Tests & Production Build` (`job/140574655695`, `1m28s`): **`success`**
  - `Lint, Boundary Check & Backend Tests` (`job/140574656222`, `1m25s`): **`success`**
- **Evidencia verificable en CI:**
  - Voice FSM: `4/4 ✅ FSM del Modo Voz verificado` · build SPA: `✓ built in 3.86s`.
  - Playwright público (`MOBILE_PUBLIC_ONLY=1 npm run test:mobile`): **`3 passed / 1 skipped`** (`5.3s`) sobre `/`, `/login` y `/registro` a `360×800`.
  - Lighthouse móvil (`LIGHTHOUSE_REPORTS_DIR=.cache/lighthouse npm run test:lighthouse`, build aislado en `/tmp` sin tocar `frontend/dist`): accesibilidad **`95 / 90 / 90`** (`/` = `95`, `/login` = `90`, `/registro` = `90`, umbral `>= 90`).
  - Artefacto descargable: **`frontend-mobile-qa-evidence`** (`Artifact ID: 15206887974`, `7 files uploaded`, `355,028 bytes`, `expired: false`).
  - Artefacto backend: **`backend-coverage-xml`** (`Artifact ID: 15206822949`, `9,102 bytes`).

---

## Sección archivada de Sprint 2 (`PLAN_ACTIVO.md`)

### Sprint 2 — Web móvil responsive

- [x] **S2-1 — Corrección de objetivos táctiles `>=48 px` en vistas públicas:**
  - **Objetivo:** Subir enlace "Crear cuenta" (44 px) e inputs de login/registro (45–46 px) a altura mínima `48 px` sin scroll horizontal a 360 px.
  - **Archivo / área afectada:** `frontend/src/pages/LandingPage.jsx`, `frontend/src/pages/Login.jsx`, `frontend/src/pages/Registro.jsx`.
  - **Dependencia:** S0-5.
  - **Riesgo:** Bajo (desajuste menor de alineación en header móvil).
  - **Comando exacto de verificación:** `npm run test:voice` + `npm run build -- --outDir <TEMP>` + medición automatizada DOM Playwright/Chrome a `360x800`.
  - **Criterio de salida medible:** `scrollWidth <= 360` y todos los CTA/inputs públicos con altura `>= 48 px`.
  - **Evidencia verificada (2026-11-26 19:22, viewport `360×800` Chrome headless):**
    - **Overflow horizontal:** `scrollWidth == 360 <= 360` (`overflowX: false`) en `/`, `/login` y `/registro` (antes y después).
    - **Objetivos táctiles antes → después:** Header CTA `"Crear cuenta"` `137.02×44 px (right 362.38)` → **`137.02×48 px (right 344.0)`** (corrigiendo también el desborde derecho de `2.38 px` en header móvil mediante `inset-x-0` + `min-w-0` + `truncate`); inputs `/login` (`email`, `password`) `278×46 px` → **`278×48 px`**; submit `/login` **`278×48 px`** (`min-h-12`); inputs `/registro` (`nombre_comercial`, `nit_o_cedula`, `email`, `password`) `278×46 px` → **`278×48 px`**; submit `/registro` **`278×48 px`** (`min-h-12`); enlaces `"Volver a la página principal"` `168.97×16 px` → **`168.97×48 px`**.
    - **Build y pruebas frontend:** `npm run test:voice` → `4/4 ✅ FSM del Modo Voz verificado` (exit `0`); build aislado en `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-1-fd541163-14fd-4cab-b5eb-38a927212428` → `✓ built in 7.12s` (exit `0`, `frontend/dist` intacto); `git diff --check` exit `0`.

- [x] **S2-2 — Responsividad `360 px` en shell y flujo POS (`Layout`, `Header`, `Sidebar`, `CartSidebar`, `Ventas`):**
  - **Objetivo:** Garantizar 0 desbordamiento horizontal y controles táctiles `>= 48 × 48 px` en navegación, carrito y ventas.
  - **Archivo / área afectada:** `frontend/src/components/layout/Header.jsx`, `frontend/src/components/layout/Sidebar.jsx`, `frontend/src/components/CartSidebar.jsx`, `frontend/src/pages/Ventas.jsx`.
  - **Dependencia:** S2-1.
  - **Riesgo:** Medio (colisiones de z-index con `AgentWidget`/`MostradorMode`).
  - **Comando exacto de verificación:** `cd frontend && npm run test:voice && npm run build -- --outDir <TEMP>` + medición automatizada DOM Playwright/Chrome a `360×800`.
  - **Criterio de salida medible:** `scrollWidth <= 360`, botones táctiles `>= 48 px` y FSM voz 4/4 pasando.
  - **Evidencia verificada (2026-11-26 19:45, viewport `360×800` Chrome headless sobre backend/frontend locales con `gestion_neiva_test`):**
    - **Overflow horizontal:** `document.documentElement.scrollWidth == 360 <= 360` y `header.scrollWidth == 360` en las 4 rutas autenticadas (`/dashboard`, `/inventario`, `/ventas`, `/soporte`). `main.scrollWidth == 360` en `/dashboard`, `/inventario` y `/ventas` *(hallazgo transferido y resuelto en `S2-3`: `/soporte` presentaba `main.scrollWidth = 362`)*.
    - **Controles táctiles `>=48×48 px`:** Header (5 botones: `Abrir menú`, `Voz`, `Chat IA`, `Carrito`, `Salir`) todos **`48×48 px`**; Sidebar (`Cerrar menú` **`48×48 px`**, 7 `NavLink`s **`232×48 px`**); CartSidebar (`Cerrar`, `−`, `+`, `Eliminar` **`48×48 px`**, `Cobrar venta` y `Vaciar carrito` **`328×48 px`**, modal `Cancelar` y `Confirmar venta` **`142×48 px`**); Ventas (tabs `160×48` / `104×48`, fecha `48×48`, `select` `238×48`, refrescar `48×48`).
    - **Interacción y colisiones:** apertura/cierre de Sidebar (`x: 0 ↔ -256`) y Carrito (`x: 0 ↔ 360`), navegación entre las 4 rutas, hit-test `elementFromPoint` positivo en `Cobrar venta` y `Confirmar venta` (sin obstrucción de `AgentWidget`/`MostradorMode`; `AgentWidget` y `MostradorMode` no requirieron cambios).
    - **Pruebas y build:** `npm run test:voice` → `4/4 ✅ FSM del Modo Voz verificado`; build aislado en `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-2-b8e6e4c4-453e-4ac4-8118-8ab5100c3c87` → `✓ built in 7.17s` (`frontend/dist` intacto); `git diff --check` exit `0`.

- [x] **S2-3 — Responsividad `360 px` en catálogo, alertas y soporte (`Inventario`, `ModalProducto`, `Dashboard`, `Soporte`):**
  - **Objetivo:** Evitar overflow en tarjetas, modales y gráficas Recharts y asegurar controles `>= 48 px` incluyendo estados vacío/carga/error.
  - **Archivo / área afectada:** `frontend/src/pages/Inventario.jsx`, `Dashboard.jsx`, `Soporte.jsx`, `components/ProductoCard.jsx`, `ModalProducto.jsx`.
  - **Dependencia:** S2-1.
  - **Riesgo:** Medio (gráficas o tablas anchas en pantallas de 360 px).
  - **Comando exacto de verificación:** `cd frontend && npm run test:voice && npm run build -- --outDir <TEMP>` + verificación Playwright/Chrome a `360×800`.
  - **Criterio de salida medible:** `scrollWidth <= 360` (global e interno) en todas las pantallas autenticadas y controles `>= 48 px`.
  - **Evidencia verificada (2026-11-26 19:57, viewport `360×800` Chrome headless sobre backend/frontend locales con `gestion_neiva_test`):**
    - **Overflow horizontal global e interno:** `docScrollWidth == 360` y `mainScrollWidth == 360` (`overflowX: false`, `mainOverflowX: false`) en `/dashboard`, `/inventario` y `/soporte` a lo largo de estados **vacío**, **con datos** (Recharts `286×220`, alertas de vencimiento, stock bajo, ticket con detalle) y **error 500 simulado** vía `page.route`.
    - **Corrección de `/soporte` (`+2 px`):** el contenedor de dos paneles pasó de `flex` horizontal rígido (`mainScrollWidth: 362`, caja de respuesta desplazada a `x: 385..483 px`) a `flex-col md:flex-row` + `min-w-0` (`mainScrollWidth: 362 → 360`, caja de respuesta visible en `x: 33..271` y botón `Enviar` en `48×48`, `x: 279..327`).
    - **Controles `>=48×48 px` y modales:** `Inventario` (búsqueda `216.3×48`, `+ Producto` `103.7×48`), `ProductoCard` (`Agregar` `182×48`, `Editar` y `Eliminar` `48×48`), `ModalProducto` (`scrollWidth 328 == clientWidth 328`, `overflowY: auto`, `canScrollY: true`, foco verificado en `nombre`, cierre limpio, todos los controles `>=48 px`), `Soporte` y modal `Nuevo Ticket` (`328 == 328`, todos los controles `>=48×48 px`).
    - **Pruebas y build:** `npm run test:voice` → `4/4 ✅ FSM del Modo Voz verificado`; build aislado en `C:\Users\merid\AppData\Local\Temp\gestion-inventario-s2-3-0bbb8554-f21e-4b8c-98b6-6a4e00c08603` → `✓ built in 6.42s` (`frontend/dist` intacto); `git diff --check` exit `0`.

- [x] **S2-4 — Prueba automatizada de viewport `360 px` y auditoría Lighthouse:**
  - **Objetivo:** Crear spec automatizado de breakpoint `360 × 800` sobre el recorrido tendero y ejecutar Lighthouse móvil con evidencia descargable en CI.
  - **Archivo / área afectada:** `frontend/package.json`, `frontend/package-lock.json`, `frontend/tests/mobile/`, `.github/workflows/ci.yml`, `docs/IA_BITACORA.md`.
  - **Dependencia:** S1-2, S2-2, S2-3.
  - **Riesgo:** Medio (flakiness si el entorno local backend/frontend no arranca determinísticamente).
  - **Comando exacto de verificación:** `cd frontend && npm run test:mobile && npm run test:lighthouse && npm run test:voice` (en CI `frontend-verify`: `MOBILE_PUBLIC_ONLY=1 npm run test:mobile && LIGHTHOUSE_REPORTS_DIR=.cache/lighthouse npm run test:lighthouse`).
  - **Criterio de salida medible:** 0 px scroll horizontal, targets `>= 48 px`, accesibilidad Lighthouse `>= 90` y corrida verde en GitHub Actions con artefacto `frontend-mobile-qa-evidence`.
  - **Evidencia verificada (local 2026-11-27 + CI 2026-11-27):**
    - **Dependencias (`package.json` con `^`, versiones resueltas en `package-lock.json` y reproducibles mediante `npm ci`):** `@playwright/test` `1.65.1` (`^1.65.1`) + `lighthouse` `13.6.0` (`^13.6.0`) con Chromium empaquetado de Playwright (`159.0.8154.6`, sin dependencia de Chrome global).
    - **Local completo (`npm run test:mobile`):** **`4 passed (48.1s)`**, exit `0` — rutas públicas (`/`, `/login`, `/registro`) + recorrido autenticado completo sobre `gestion_neiva_test` local (`s2_4_<hex>@example.com`, sin `.env` ni producción): Registro local → Login UI → `/dashboard` → Sidebar drawer → `/inventario` + `ProductoCard` + `ModalProducto` → `CartSidebar` + cobro real (`Venta registrada`) → `/ventas` → `/soporte` → `Cerrar sesión` (`access_token === null`).
    - **GitHub Actions (commit `2ee5ddc`, Run `#46019358053`, https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE/actions/runs/46019358053):**
      - Estado global: **`completed / success`**; ambos jobs en verde (`Frontend Voice FSM Tests & Production Build` `job/140574655695` en `1m28s` y `Lint, Boundary Check & Backend Tests` `job/140574656222` en `1m25s`).
      - Playwright público (`MOBILE_PUBLIC_ONLY=1 npm run test:mobile`): **`3 passed / 1 skipped (5.3s)`**.
      - Lighthouse móvil (`LIGHTHOUSE_REPORTS_DIR=.cache/lighthouse npm run test:lighthouse`, build aislado en `/tmp/gestion-inventario-s2-4-7a2d44fc-e4f7-440f-b9e8-fbe35a7a7f43`): accesibilidad **`/` = `95`**, **`/login` = `90`**, **`/registro` = `90`** (todas `>= 90`).
      - Artefacto **`frontend-mobile-qa-evidence`**: **`Artifact ID 15206887974`** (`7 files uploaded`, `355,028 bytes`).

---

> **La IA asistió en la verificación y documentación del cierre de Sprint 2; la validación final corresponde al equipo humano.**
