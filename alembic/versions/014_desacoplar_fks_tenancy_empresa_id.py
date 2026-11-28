"""desacoplar_fks_tenancy_empresa_id

Revision ID: 014
Revises: 013
Create Date: 2026-11-27

Drops the 4 physical cross-module tenancy foreign keys pointing to empresas.id
per ADR-006 (S3-2 vertical slice):
- productos.empresa_id -> empresas.id (inventario -> auth_tenancy)
- ventas.empresa_id -> empresas.id (pos_ventas -> auth_tenancy)
- soporte_tickets.empresa_id -> empresas.id (soporte_crm -> auth_tenancy)
- agent_commands.empresa_id -> empresas.id (agente_ia -> auth_tenancy)

Uses defensive pg_constraint lookup in upgrade() so unnamed FKs created in
migrations 006 and 010 are removed safely regardless of auto-generated names.
It also reconciles legacy cross-module FKs that revision 013 already removed
conceptually but that can remain in databases initialized with create_all().
Ensures all 4 tenancy indexes exist with IF NOT EXISTS and preserves the 3
intra-module FKs untouched (usuarios.empresa_id, detalles_venta.venta_id,
soporte_mensajes.ticket_id).

In downgrade(), validates that zero orphan empresa_id values exist across all
4 tables before restoring the 4 explicitly named ADR-006 FKs with ON DELETE CASCADE.
"""
import sqlalchemy as sa

from alembic import op

revision = "014"
down_revision = "013"
branch_labels = None
depends_on = None

_TENANCY_FKS_TO_RESTORE_ON_DOWNGRADE: tuple[tuple[str, str], ...] = (
    ("productos", "fk_productos_empresa_id"),
    ("ventas", "fk_ventas_empresa_id"),
    ("soporte_tickets", "fk_soporte_tickets_empresa_id"),
    ("agent_commands", "fk_agent_commands_empresa_id"),
)

_CROSS_MODULE_FKS_TO_DROP: tuple[tuple[str, str, str], ...] = (
    *((table_name, "empresa_id", "empresas") for table_name, _ in _TENANCY_FKS_TO_RESTORE_ON_DOWNGRADE),
    # Reconcile databases where pre-Alembic create_all() left constraints that
    # canonical revision 013 was meant to remove under ADR-004.
    ("ventas", "usuario_id", "usuarios"),
    ("detalles_venta", "producto_id", "productos"),
    ("soporte_tickets", "usuario_id", "usuarios"),
)


def _quote_ident(ident: str) -> str:
    return '"' + ident.replace('"', '""') + '"'


def upgrade() -> None:
    """Drop tenancy FKs plus legacy ADR-004 leftovers and ensure tenancy indexes."""
    bind = op.get_bind()

    for table_name, column_name, referenced_table in _CROSS_MODULE_FKS_TO_DROP:
        rows = bind.execute(
            sa.text(
                """
                SELECT c.conname
                FROM pg_constraint c
                JOIN pg_attribute a
                  ON a.attrelid = c.conrelid
                 AND a.attnum = ANY(c.conkey)
                WHERE c.contype = 'f'
                  AND c.conrelid = CAST(:table_name AS regclass)
                  AND c.confrelid = CAST(:referenced_table AS regclass)
                  AND a.attname = :column_name
                """
            ),
            {
                "table_name": table_name,
                "column_name": column_name,
                "referenced_table": referenced_table,
            },
        ).fetchall()

        for (constraint_name,) in rows:
            op.execute(
                f"ALTER TABLE {_quote_ident(table_name)} "
                f"DROP CONSTRAINT IF EXISTS {_quote_ident(constraint_name)}"
            )

    op.execute(
        "CREATE INDEX IF NOT EXISTS idx_productos_empresa ON productos (empresa_id)"
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS idx_ventas_empresa_fecha ON ventas (empresa_id, fecha_venta)"
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS idx_soporte_tickets_empresa ON soporte_tickets (empresa_id)"
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS idx_agent_commands_empresa ON agent_commands (empresa_id)"
    )


def downgrade() -> None:
    """Verify zero orphan empresa_id rows, then restore the 4 ADR-006 FKs with CASCADE."""
    bind = op.get_bind()
    orphan_summary: list[str] = []

    for table_name, _ in _TENANCY_FKS_TO_RESTORE_ON_DOWNGRADE:
        orphan_count = bind.execute(
            sa.text(
                f"""
                SELECT COUNT(*)
                FROM {_quote_ident(table_name)} t
                LEFT JOIN empresas e ON t.empresa_id = e.id
                WHERE e.id IS NULL
                """
            )
        ).scalar_one()
        if orphan_count > 0:
            orphan_summary.append(f"{table_name}={orphan_count}")

    if orphan_summary:
        detail = ", ".join(orphan_summary)
        raise RuntimeError(
            "No se puede revertir migración 014: existen empresa_id huérfanos sin "
            f"registro en empresas ({detail}). Limpia o reconcilia los huérfanos antes "
            "de restaurar las claves foráneas."
        )

    for table_name, fk_name in _TENANCY_FKS_TO_RESTORE_ON_DOWNGRADE:
        op.create_foreign_key(
            fk_name,
            table_name,
            "empresas",
            ["empresa_id"],
            ["id"],
            ondelete="CASCADE",
        )
