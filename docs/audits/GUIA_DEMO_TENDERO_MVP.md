# Guía de Demostración — Recorrido Tendero MVP (Gestión Neiva)

- **Fecha:** 2026-11-27
- **Responsable:** Santiago Javela Ospino (Documentación, trazabilidad y evidencia de evaluación)
- **Alcance:** Flujo operativo mínimo demostrable del tendero en entorno local/de pruebas (sin cuentas reales ni datos de producción).
- **Estado general del flujo:**
  - **Evidencia automatizada Backend E2E (API `/api/v1`):** **`PASS`** (verificada en GitHub Actions Run `#45914762624`, commit `91cdf2b`, `tests/end_to_end/test_store_journey_e2e.py`).
  - **Evidencia UI móvil pública (`360 × 800`) y Lighthouse (`95/90/90`):** **`PASS`** (GitHub Actions Run `#46019358053`, commit `2ee5ddc`, artefacto `frontend-mobile-qa-evidence`).
  - **Evidencia UI móvil autenticada (`360 × 800`):** **`PARTIAL`** (ejecutada localmente `4 passed` en Sprint 2; omitida en CI por `MOBILE_PUBLIC_ONLY=1`).
  - **Grabación / capturas finales de sustentación en vivo:** **`NO VERIFICADO`** (pendiente ejecutar y adjuntar antes de la sustentación).

---

## 1. Precondiciones y Reglas de Seguridad para la Demo

1. **Entorno aislado:** Usar únicamente una base de datos de prueba local (PostgreSQL 16 vía `docker compose up -d` o SQLite de pruebas) y `.env` local no versionado. **Nunca** ejecutar la demo con credenciales reales ni contra producción.
2. **Migraciones aplicadas:** Confirmar `alembic current` en `013 (head)` (o `014`/`015` cuando backend cierre Sprint 3).
3. **Servicios activos:**
   - Backend FastAPI en `http://localhost:8000` (`GET /health` debe responder `200 OK` con `"db": "connected"`).
   - Frontend React SPA en `http://localhost:5173`.
4. **Datos sintéticos recomendados:**
   - Tienda: `Minimercado El Huila Demo` · NIT: `900777888-9`
   - Usuario admin: `demo_tendero@tienda.local` · Contraseña: `Password123!`
   - Producto: `Panela Huilense 1kg` · Código de barras: `7704445556667` · Costo: `3000` · Venta: `4500` · Stock inicial: `25` (`unidad`)

---

## 2. Guion Paso a Paso del Recorrido Tendero

Flujo obligatorio: **Registro → Login → Crear producto → Venta → Descuento de stock → Dashboard → Logout**.

### Paso 1 — Registro de tienda y usuario administrador
- **UI (`/registro`):** Completar nombre comercial, NIT/cédula, correo y contraseña; pulsar **Crear cuenta**.
- **Contrato API real:** `POST /api/v1/auth/registro-completo`
  ```json
  {
    "nombre_comercial": "Minimercado El Huila Demo",
    "nit_o_cedula": "900777888-9",
    "email": "demo_tendero@tienda.local",
    "password": "Password123!",
    "rol": "admin"
  }
  ```
- **Resultado esperado:** HTTP `201 Created`; se crea la empresa con trial de 15 días, el usuario administrador y `empresa_id` propio.
- **Trazabilidad:** `HU-01` · `BR-03` · `TC-001` · Estado automatizado: **`PASS`** (Run `#45914762624`).

### Paso 2 — Login explícito y validación de sesión (`/api/v1/token` y `/api/v1/me`)
- **UI (`/login`):** Cerrar sesión inicial si redirigió automáticamente e ingresar con `demo_tendero@tienda.local` y `Password123!`.
- **Contrato API real:**
  1. `POST /api/v1/token` con `{"email": "demo_tendero@tienda.local", "password": "Password123!"}` → HTTP `200 OK` con `access_token` (`token_type: "bearer"`).
  2. `GET /api/v1/me` con header `Authorization: Bearer <access_token>` → HTTP `200 OK` devolviendo `id`, `email`, `empresa_id` y `rol: "admin"`.
- **Trazabilidad:** `HU-01` · `NFR-05` · `TC-001` · Estado automatizado: **`PASS`** (Run `#45914762624`).

### Paso 3 — Crear producto en el catálogo
- **UI (`/inventario` → botón "Nuevo producto"):** Diligenciar nombre, código de barras, precio costo, precio venta, stock inicial (`25`) y unidad (`unidad`); guardar.
- **Contrato API real:** `POST /api/v1/productos` (con `Authorization: Bearer <access_token>`)
  ```json
  {
    "nombre": "Panela Huilense 1kg",
    "codigo_barras": "7704445556667",
    "precio_costo": 3000.0,
    "precio_venta": 4500.0,
    "cantidad_actual": 25.0,
    "unidad_medida": "unidad"
  }
  ```
- **Resultado esperado:** HTTP `201 Created`, devolviendo `id` del producto y apareciendo en la grilla de inventario con stock `25`.
- **Trazabilidad:** `HU-02` · `BR-10` · `TC-002` · Estado automatizado: **`PASS`** (Run `#45914762624`).

### Paso 4 — Registrar venta en POS
- **UI (`/inventario` o `/ventas` → `CartSidebar`):** Agregar `4` unidades de `Panela Huilense 1kg` al carrito y confirmar cobro.
- **Contrato API real:** `POST /api/v1/ventas/{empresa_id}`
  ```json
  {
    "detalles": [
      { "producto_id": "<prod_id>", "cantidad": 4.0 }
    ]
  }
  ```
- **Resultado esperado:** HTTP `201 Created`, `total == 18000.0` (`4 × 4500`), transacción ACID con bloqueo pesimista `SELECT ... FOR UPDATE`.
- **Nota negativa opcional (si se demuestra `BR-01`):** Intentar vender más unidades que el stock disponible debe devolver HTTP `422 Unprocessable Entity` sin alterar el inventario.
- **Trazabilidad:** `HU-04`, `HU-05`, `HU-06` · `BR-01`, `BR-04`, `BR-06` · `TC-005`, `TC-006` · Estado automatizado: **`PASS`** (Run `#45914762624`).

### Paso 5 — Verificación de descuento exacto de stock
- **UI (`/inventario`):** Refrescar o revisar la tarjeta del producto `Panela Huilense 1kg` y confirmar que el stock bajó de `25` a `21`.
- **Contrato API real:** `GET /api/v1/productos/{prod_id}` → HTTP `200 OK` con `cantidad_actual == 21.0`.
- **Trazabilidad:** `HU-05` · `BR-01`, `BR-04` · `NFR-03` · Estado automatizado: **`PASS`** (Run `#45914762624`).

### Paso 6 — Consulta del Dashboard financiero
- **UI (`/dashboard`):** Abrir el panel principal y verificar que refleja `1` venta del día e ingresos de `$18.000` (en zona horaria `America/Bogota`, UTC-5).
- **Contrato API real:** `GET /api/v1/dashboard/{empresa_id}` → HTTP `200 OK` con `ventas_hoy == 1` e `ingresos_hoy == 18000.0`.
- **Trazabilidad:** `HU-11` · `TC-011` · Estado automatizado: **`PASS`** (Run `#45914762624`).

### Paso 7 — Logout y verificación de rechazo `401`
- **UI (`Header` / `Sidebar`):** Pulsar **Cerrar sesión**; confirmar limpieza del token JWT en el cliente y redirección a `/login`.
- **Verificación de seguridad (stateless JWT):** Al invocar `GET /api/v1/me` sin header `Authorization` (o tras limpiar el token del cliente), el backend responde **HTTP `401 Unauthorized`**.
- **Nota de arquitectura:** El MVP utiliza JWT *stateless* (no existe endpoint `POST /api/v1/logout`; el cierre de sesión elimina el token en el cliente).
- **Trazabilidad:** `HU-01` · `NFR-05` · `TC-001` · Estado automatizado: **`PASS`** (Run `#45914762624`).

---

## 3. Comandos Reproducibles de Verificación

| Verificación | Comando exacto | Última evidencia verificable | Estado |
| :--- | :--- | :--- | :---: |
| Recorrido tendero E2E completo (API `/api/v1`) | `pytest tests/end_to_end/test_store_journey_e2e.py -v` | Run `#45914762624` (incluido en `98 passed, 0 skipped`) | **`PASS`** |
| Simulación E2E de negocio (SQLite) | `python run_e2e_simulation.py` | Run `#45914762624` y Run `#46019358053` (Stage 6) | **`PASS`** |
| Regresión móvil pública `360 × 800` | `cd frontend && MOBILE_PUBLIC_ONLY=1 npm run test:mobile` | Run `#46019358053` (`3 passed, 1 skipped`) | **`PASS`** |
| Regresión móvil autenticada `360 × 800` | `cd frontend && npm run test:mobile` | Local Sprint 2 (`4 passed`, archivado en `docs/audits/planes-cerrados/2026-11-27-sprint-2-web-movil-responsive.md`); no ejecutada en CI | **`PARTIAL`** |
| Grabación / capturas finales de la demo en vivo | Ejecución guiada por el equipo humano en entorno limpio | Pendiente de captura previa a sustentación | **`NO VERIFICADO`** |

---

## 4. Dependencias Abiertas Antes de la Sustentación Final

- **Backend:** Mantener compatibilidad de contratos `/api/v1/*` durante Sprint 3 (`DAT-03`, migraciones `014` y `015`) y Sprint 4 (migración de routers a fachadas `S4-1`..`S4-4`).
- **Frontend:** Verificar que el historial de ventas y el dashboard sigan renderizando sin cambios visuales disruptivos tras migración `015` (snapshots de producto en `detalles_venta`) y adjuntar capturas/video del recorrido autenticado en móvil y escritorio.

---

**Referencias cruzadas:** [`./MATRIZ_EVIDENCIA_GOBERNANZA.md`](./MATRIZ_EVIDENCIA_GOBERNANZA.md) · [`../../tests/end_to_end/test_store_journey_e2e.py`](../../tests/end_to_end/test_store_journey_e2e.py) · [`../../04-requirements/traceability-matrix.md`](../../04-requirements/traceability-matrix.md)
