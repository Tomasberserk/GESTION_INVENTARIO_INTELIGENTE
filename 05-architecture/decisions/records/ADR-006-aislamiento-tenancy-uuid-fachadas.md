# ADR-006 — Aislamiento de Tenancy entre Módulos mediante UUID Indexado, Fachadas y Evidencia Histórica Inmutable (DAT-03)

## Identification

| Field | Value |
|---|---|
| Id | ADR-006 |
| Date | 2026-11-27 (Amended 2026-11-27 — S3-1B human approval) |
| Status | Accepted |
| Authors | Architecture Auditor and Engineering Team |
| Supersedes | none (extends ADR-002 and ADR-004) |

## Context

`ADR-002` estableció el aislamiento multi-tenant por fila mediante `empresa_id`, y `ADR-004` (ejecutado en la migración `013`) eliminó las claves foráneas físicas entre módulos para `ventas.usuario_id`, `detalles_venta.producto_id` y `soporte_tickets.usuario_id`.

Una inspección del esquema actual (`app/models.py` y migraciones `001`–`013`) confirma que **aún permanecen cuatro claves foráneas físicas cruzando límites de módulo hacia `empresas.id`** (`auth_tenancy`), junto con relaciones ORM cross-module (cuatro `cascade="all, delete-orphan"` en `Empresa` y relaciones heredadas de `ADR-004` como `DetalleVenta.producto`, `Venta.usuario` y `SoporteTicket.usuario`):

1. `productos.empresa_id -> empresas.id` (`fk_productos_empresa_id`, `ON DELETE CASCADE`, migración `001`) — cruza `inventario -> auth_tenancy`.
2. `ventas.empresa_id -> empresas.id` (`fk_ventas_empresa_id`, `ON DELETE CASCADE`, migración `001`) — cruza `pos_ventas -> auth_tenancy`.
3. `soporte_tickets.empresa_id -> empresas.id` (FK sin nombre explícito en migración `006`, `ON DELETE CASCADE`) — cruza `soporte_crm -> auth_tenancy`.
4. `agent_commands.empresa_id -> empresas.id` (FK sin nombre explícito en migración `010`, `ON DELETE CASCADE`) — cruza `agente_ia -> auth_tenancy`.

Adicionalmente, el historial de ventas (`DetalleVentaRespuesta`) aún realiza `joinedload(DetalleVenta.producto)` para leer `producto.nombre` en vivo, y `producto_service.crear_producto()` reactiva y sobrescribe productos inactivos que comparten `codigo_barras` debido a la restricción única no parcial `uq_producto_empresa_barras`. Ambas prácticas acoplan módulos y comprometen la inmutabilidad histórica.

| Constraint | Source |
|---|---|
| Table Ownership: ninguna clave foránea SQL ni relación ORM cruza límites de módulo (`DAT-03`) | `ADR-004`, `06-data/database-conventions.md` |
| Aislamiento multi-tenant estricto por `empresa_id` sin enumeración de tenants | `ADR-002`, `Constitution Article I`, `NFR-02` |
| Trazabilidad e inmutabilidad de ventas, identidad de producto y soporte | `BR-05`, `06-data/database-conventions.md` |
| Cero modificaciones a ADR ya aceptados (`ADR-001`–`ADR-004`) ni a `ADR-005` | `05-architecture/decisions/README.md` |

## Decision

**We decided (con aprobación humana explícita en enmienda S3-1B):** completar el cumplimiento de **DAT-03** cerrando el desacople de tenancy, retirando por completo las relaciones ORM cross-module y separando limpiamente las migraciones `014` y `015` bajo cinco decisiones vinculantes:

### 1. Tenancy cross-module mediante UUID indexado, retiro total de relaciones ORM cruzadas y contrato HTTP `404`

- Las columnas `empresa_id` en `productos`, `ventas`, `soporte_tickets` y `agent_commands` dejan de tener restricción física `FOREIGN KEY REFERENCES empresas(id)` en PostgreSQL y pasan a ser columnas **`UUID NOT NULL` indexadas** (`idx_productos_empresa`, `idx_ventas_empresa_fecha`, `idx_soporte_tickets_empresa`, `idx_agent_commands_empresa`).
- **Retiro completo de relaciones ORM cross-module (sin `viewonly=True`):** en `app/models.py` se retirarán por completo **todas** las relaciones ORM que cruzan módulos:
  - `Empresa.productos` ↔ `Producto.empresa`
  - `Empresa.ventas` ↔ `Venta.empresa`
  - `Empresa.soporte_tickets` ↔ `SoporteTicket.empresa`
  - `Empresa.agent_commands` ↔ `AgentCommand.empresa`
  - `Usuario.ventas` ↔ `Venta.usuario`
  - `Producto.detalles_venta` ↔ `DetalleVenta.producto`
  - `SoporteTicket.usuario`
- La respuesta del historial de ventas (`obtener_ventas_empresa`, `obtener_actividad_ventas`, `DetalleVentaRespuesta`) deberá consumir exclusivamente los campos snapshot de `detalles_venta`, **sin `joinedload(DetalleVenta.producto)` ni lectura viva de `Producto`**.
- Toda operación de escritura cross-module en `inventario`, `pos_ventas`, `soporte_crm`, `agente_ia` y dependencias JWT validará la empresa activa a través de **`AuthTenancyFacade.ensure_active_company()`**, reemplazando consultas directas a `models.Empresa`.
- **Contrato de error anti-enumeración:** `AuthTenancyFacade.ensure_active_company()` mantiene **HTTP `404` uniforme** tanto para `empresa_id` inexistente como para empresa inactiva (`is_active = False`), evitando revelar la existencia de tenants inactivos.

### 2. Conservación estricta de las tres claves foráneas intra-módulo

Se conservan intactas en PostgreSQL y en el ORM únicamente las **tres claves foráneas internas** (y sus tres pares de relaciones ORM intra-módulo):

| Tabla hija | Columna FK | Tabla padre | Módulo propietario | Regla |
|---|---|---|---|---|
| `usuarios` | `empresa_id` | `empresas.id` | `auth_tenancy` | Conservar (`fk_usuarios_empresa_id`) |
| `detalles_venta` | `venta_id` | `ventas.id` | `pos_ventas` | Conservar (`fk_detalles_venta_id`) |
| `soporte_mensajes` | `ticket_id` | `soporte_tickets.id` | `soporte_crm` | Conservar (`soporte_mensajes_ticket_id_fkey`) |

### 3. Snapshots históricos fijos en `detalles_venta` (sin duplicar columnas existentes)

Inspección realizada sobre `app/models.py`, `alembic/versions/001..013`, `app/schemas/venta.py` y `app/inventario/api/contracts.py`:

| Dato histórico del ítem vendido | Estado actual en `detalles_venta` | Decisión aprobada |
|---|---|---|
| Precio unitario realmente aplicado | **Ya preservado** en `precio_unitario` (`Numeric(10, 2)`, `NOT NULL`) | **No duplicar**; ya es histórico. |
| Cantidad y subtotal realmente aplicados | **Ya preservados** en `cantidad` (`Numeric(10, 3)`) y `subtotal` (`Numeric(10, 2)`) | **No duplicar**; ya son históricos. |
| Referencia lógica al producto | **Ya preservada** en `producto_id` (`UUID`, `NOT NULL`, indexado) | **No duplicar**; conservar como UUID de referencia. |
| Nombre del producto vendido | **Ausente** | **Agregar `producto_nombre_snapshot`** (`String(150)`). |
| Código de barras del producto vendido | **Ausente** | **Agregar `producto_codigo_snapshot`** (`String(100)`). |
| Unidad de medida del producto vendido | **Ausente** | **Agregar `producto_unidad_snapshot`** (`String(30)`). |

- **Compatibilidad de filas antiguas vs obligación en ventas nuevas:**
  - **Filas históricas existentes (backfill en migración `015`):** las tres columnas se añaden inicialmente como `nullable=True` para permitir compatibilidad sin bloqueo durante la migración, se ejecuta backfill leyendo `productos` por `producto_id` (`nombre`, `codigo_barras`, `unidad_medida`), y para cualquier fila heredada sin correspondencia se conserva compatibilidad segura (valor de respaldo explícito o lectura tolerante en serialización).
  - **Ventas nuevas (obligatorio desde la implementación de `015`):** toda nueva fila de `DetalleVenta` creada por `pos_ventas` **debe poblar obligatoriamente** `producto_nombre_snapshot`, `producto_codigo_snapshot` y `producto_unidad_snapshot` a partir del DTO devuelto por `InventarioFacade` (`StockDeductionResultDTO` extendido con código y unidad), sin admitir valores nulos ni vacíos en ventas nuevas.

*(Nota de verificación: en otras tablas históricas ya existen snapshots equivalentes y no deben duplicarse: `ventas.vendedor_nombre_snapshot` creado en migración `012` y `soporte_mensajes.remitente_email` / `remitente_rol` creados en migración `006`.)*

### 4. Política de identidad del producto, código de barras y no borrado físico en el MVP

- **Identidad inmutable del producto y código de barras:**
  - Un producto inactivo (`is_active = False`) con movimientos históricos **no se reactiva ni se sobrescribe automáticamente** cuando se crea un nuevo producto con el mismo `codigo_barras`.
  - La migración `015` reemplazará la restricción única actual `uq_producto_empresa_barras (empresa_id, codigo_barras)` por un **índice único parcial para productos activos por empresa**: `CREATE UNIQUE INDEX uq_producto_empresa_barras_activo ON productos (empresa_id, codigo_barras) WHERE is_active = true`.
  - Toda creación mediante `crear_producto()` asigna siempre un **UUID nuevo** (`producto.id`). Si en el futuro el negocio requiere recuperar exactamente el mismo producto desactivado, se implementará una operación explícita de reactivación separada, nunca dentro de `crear_producto()`.
- **Prohibición de borrado físico en el MVP:**
  - **Productos referenciados (`productos`):** no se eliminan físicamente; se desactivan (`is_active = False`) y dejan de estar disponibles para nuevas ventas.
  - **Empresas (`empresas`), usuarios (`usuarios`) y tickets (`soporte_tickets`) con trazabilidad:** no se eliminan físicamente en el MVP; se desactivan (`is_active = False`), cierran (`estado = 'cerrado'`) o archivan según corresponda.
  - **Ventas (`ventas`), detalles (`detalles_venta`) y mensajes de soporte (`soporte_mensajes`):** constituyen evidencia histórica y contable y no se borran en operaciones normales.

### 5. Separación explícita de migraciones futuras (`014` vs `015`)

| Migración | Alcance exclusivo | Propósito de la separación |
|---|---|---|
| **`014` (`014_desacoplar_fks_tenancy_empresa_id.py`)** | Retiro reversible de las 4 FKs cruzadas de `empresa_id -> empresas.id` (`productos`, `ventas`, `soporte_tickets`, `agent_commands`) y garantía de los 4 índices de tenancy (`CREATE INDEX IF NOT EXISTS`). | Aísla el cambio estructural de tenancy (`DAT-03`) con rollback limpio y riesgo acotado. |
| **`015` (`015_snapshots_detalles_venta_y_unicidad_activa_productos.py`)** | Adición de `producto_nombre_snapshot`, `producto_codigo_snapshot` y `producto_unidad_snapshot` en `detalles_venta`, backfill histórico desde `productos`, migración de la respuesta de ventas a snapshots sin `joinedload`, y reemplazo de `uq_producto_empresa_barras` por índice único parcial `WHERE is_active = true`. | Evita mezclar backfill de datos e índices únicos parciales con el desacople de FKs de tenancy, permitiendo probar y revertir cada paso de forma independiente. |

## Alternatives evaluated

| Alternative | Pros | Cons | Verdict |
|---|---|---|---|
| **UUID indexado + `AuthTenancyFacade` (`404` uniforme) + retiro total de relaciones ORM cruzadas + migraciones separadas `014`/`015` + snapshots e índice único parcial** | Cumple `DAT-03` y Table Ownership al 100%; elimina cascades y `joinedload` cross-module; protege la identidad histórica de productos y ventas; acota el riesgo de cada migración; evita enumeración de tenants. | Requiere dos migraciones coordinadas (`014` y `015`), extender `StockDeductionResultDTO` y actualizar consultas/serializadores de ventas que dependían de `DetalleVenta.producto`. | **Chosen** |
| **Mantener relaciones ORM cruzadas con `viewonly=True`** | Permite seguir usando `joinedload(DetalleVenta.producto)` sin refactorizar de inmediato la lectura de ventas. | Conserva acoplamiento ORM entre módulos, expone el historial de ventas a mutaciones del catálogo y retrasa el cumplimiento real de Table Ownership. | **Rejected** |
| **Mantener claves foráneas físicas `empresa_id -> empresas.id` cruzando módulos** | El motor PostgreSQL valida automáticamente la existencia de `empresas.id`. | Viola Table Ownership (`ADR-004`/`DAT-03`); mantiene `ON DELETE CASCADE` capaz de destruir historial de ventas, inventario y tickets; acopla bloqueos DDL entre los 5 módulos. | **Rejected** |
| **Reactivar filas inactivas por `codigo_barras` dentro de `crear_producto()`** | Evita crear índice único parcial en PostgreSQL. | Sobrescribe identidad y atributos de un producto ya vendido bajo el mismo `producto_id`, contaminando trazabilidad y analítica histórica. | **Rejected** |
| **Distinguir `403` (empresa inactiva) vs `404` (empresa inexistente)** | Ofrece diagnóstico más específico en respuesta HTTP. | Permite enumerar qué `empresa_id` existen en el sistema aunque estén desactivados. | **Rejected** |

## Consequences

| Kind | Consequence |
|---|---|
| Positive | El esquema y el ORM cumplen estrictamente `DAT-03`: exactamente 3 FKs intra-módulo, 0 FKs cruzadas y 0 relaciones ORM cross-module. |
| Positive | Desaparece el riesgo de destrucción accidental en cascada (`ON DELETE CASCADE`) de `productos`, `ventas`, `soporte_tickets` o `agent_commands` desde `auth_tenancy`. |
| Positive | El historial de ventas es completamente autónomo respecto a `productos` (sin `joinedload` ni lectura viva) y la identidad UUID de cada producto histórico queda protegida. |
| Positive | La respuesta `404` uniforme en `AuthTenancyFacade.ensure_active_company()` previene enumeración de tenants. |
| Cost | Requiere ejecutar el despliegue en dos migraciones ordenadas (`014` y `015`), extender `StockDeductionResultDTO` con código y unidad, y eliminar la lógica de reactivación implícita en `producto_service.crear_producto()`. |
| Risk | Scripts SQL manuales que omitan la aplicación podrían insertar `empresa_id` huérfanos; mitigado mediante pruebas automatizadas de fachada y verificación previa a cualquier `downgrade`. |
| Risk | El orden entre retirar `DetalleVenta.producto` en `app/models.py` y migrar `DetalleVentaRespuesta` a snapshots debe respetarse para no romper la lectura de ventas en `S3-2`/transición hacia `015`. |

## Reversal Strategy for Future Migrations 014 and 015

### Reversión de Migración `014` (desacople de FKs de tenancy)

1. **`upgrade()` defensivo (constraints con y sin nombre explícito):**
   - Debido a que las migraciones `006` (`soporte_tickets`) y `010` (`agent_commands`) crearon `FOREIGN KEY (empresa_id) REFERENCES empresas(id)` sin nombre explícito, `upgrade()` inspeccionará `pg_constraint` (por tabla origen, columna `empresa_id` y tabla referenciada `empresas`) y ejecutará `ALTER TABLE <tabla> DROP CONSTRAINT <nombre_real>` para `productos`, `ventas`, `soporte_tickets` y `agent_commands`.
   - Verificará la presencia de los índices de `empresa_id` mediante `CREATE INDEX IF NOT EXISTS` (`idx_productos_empresa`, `idx_ventas_empresa_fecha`, `idx_soporte_tickets_empresa`, `idx_agent_commands_empresa`).
   - No tocará ninguna de las 3 FKs intra-módulo (`usuarios`, `detalles_venta`, `soporte_mensajes`).
2. **Precondición y `downgrade()` explícito:**
   - Antes de restaurar las FKs, `downgrade()` (o el runbook previo) confirmará ausencia de `empresa_id` huérfanos en las 4 tablas respecto a `empresas.id`; si existieran huérfanos, la reversión fallará de forma segura sin corromper datos.
   - `downgrade()` restaurará las 4 claves foráneas hacia `empresas.id` con `ondelete="CASCADE"` y nombres explícitos (`fk_productos_empresa_id`, `fk_ventas_empresa_id`, `fk_soporte_tickets_empresa_id`, `fk_agent_commands_empresa_id`), volviendo al estado compatible con revisión `013`.

### Reversión de Migración `015` (snapshots de `detalles_venta` e índice único parcial en `productos`)

1. **`upgrade()`:**
   - Añade `producto_nombre_snapshot`, `producto_codigo_snapshot` y `producto_unidad_snapshot` (`nullable=True` inicialmente) en `detalles_venta` y ejecuta backfill desde `productos` por `producto_id`.
   - Elimina `uq_producto_empresa_barras` y crea el índice único parcial `uq_producto_empresa_barras_activo` sobre `(empresa_id, codigo_barras) WHERE is_active = true`.
2. **`downgrade()`:**
   - Elimina `uq_producto_empresa_barras_activo` y restaura `uq_producto_empresa_barras` (con verificación previa de que no existan duplicados activos+inactivos del mismo `(empresa_id, codigo_barras)`).
   - Elimina únicamente las tres columnas snapshot nuevas (`producto_nombre_snapshot`, `producto_codigo_snapshot`, `producto_unidad_snapshot`), preservando intactas `precio_unitario`, `cantidad` y `subtotal`.

## Verification and Test Criteria (for S3-2 to S3-5 and Migration 015)

1. **Inspección de metadatos ORM:** `Base.metadata` carga sin `NoForeignKeysError`, declara exactamente **3 FKs intra-módulo** (`usuarios.empresa_id`, `detalles_venta.venta_id`, `soporte_mensajes.ticket_id`), **0 FKs cruzadas** y **0 relaciones ORM cross-module** (sin `viewonly=True`).
2. **Ciclo completo de migración `014` en PostgreSQL 16:** `alembic upgrade 014 -> alembic downgrade 013 -> alembic upgrade 014` finaliza con código `0`, y `pg_constraint` confirma 3 FKs internas y 0 FKs hacia `empresas` desde módulos externos.
3. **Aislamiento por fachada con `404` uniforme:** pruebas de integración demuestran que crear productos, registrar ventas, abrir tickets o registrar comandos de agente con `empresa_id` inexistente o inactivo (`is_active = False`) responde uniformemente **HTTP `404`** vía `AuthTenancyFacade.ensure_active_company()`.
4. **Ciclo de migración `015`, snapshots e identidad de producto:**
   - `alembic upgrade head -> alembic downgrade -1 -> alembic upgrade head` sobre `015` sale con código `0`.
   - Ventas nuevas persisten obligatoriamente `producto_nombre_snapshot`, `producto_codigo_snapshot` y `producto_unidad_snapshot` sin duplicar `precio_unitario`, `cantidad` ni `subtotal`; filas legadas reciben backfill compatible.
   - El historial de ventas serializa exclusivamente desde snapshots (sin `joinedload` ni lectura de `Producto`) y permanece inmutable tras renombrar o desactivar el producto.
   - Desactivar un producto con historial y crear otro con el mismo `codigo_barras` genera un **UUID nuevo** sin sobrescribir la fila inactiva; intentar crear dos productos **activos** con el mismo `(empresa_id, codigo_barras)` sigue rechazándose con `409 Conflict`.
5. **Política de no borrado y fronteras:** `lint-imports` mantiene `7 kept, 0 broken`, y no existen operaciones de `DELETE` físico sobre `productos`, `usuarios`, `empresas`, `soporte_tickets`, `ventas`, `detalles_venta` ni `soporte_mensajes`.

## Revisit condition

Revisit this decision if el producto evoluciona a microservicios con bases de datos físicas independientes por módulo (requiriendo replicación asíncrona de estado de tenancy por eventos), si se incorpora una operación explícita de reactivación de productos inactivos con reglas de auditoría propias, o si un requerimiento legal de borrado definitivo (p. ej., derecho al olvido/anonimización PII) exige un proceso formal de anonimización controlada.

---

**Related:** [`./ADR-002-aislamiento-multitenant.md`](./ADR-002-aislamiento-multitenant.md) · [`./ADR-004-desacople-llaves-foraneas-uuid.md`](./ADR-004-desacople-llaves-foraneas-uuid.md) · [`../../../02-domain/module-boundaries.md`](../../../02-domain/module-boundaries.md) · [`../../../06-data/database-conventions.md`](../../../06-data/database-conventions.md) · [`../../../06-data/models.md`](../../../06-data/models.md)
