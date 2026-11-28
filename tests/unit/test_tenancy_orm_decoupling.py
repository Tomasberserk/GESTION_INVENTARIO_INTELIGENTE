"""TDD tests for S3-2 vertical slice: tenancy FK and ORM decoupling (ADR-006).

Scope of S3-2 (partial milestone toward DAT-03 — NOT final DAT-03 closure):
- Remove the 4 cross-module physical ForeignKey("empresas.id") constraints from
  productos, ventas, soporte_tickets, and agent_commands.
- Remove the 8 cross-module tenancy ORM relationships and cascades toward Empresa.
- Conserve the 3 intra-module physical FKs and their ORM relationships unchanged.
- Non-tenancy cross-module ORM relationships (Usuario <-> Venta, Producto <-> DetalleVenta,
  SoporteTicket.usuario) remain temporarily until S3-3 (migration 015 snapshots + serializer
  refactor) and do NOT represent final closure of DAT-03.
"""
from sqlalchemy import inspect as sa_inspect

from app import models
from app.database import Base


def test_base_metadata_conserves_exact_three_internal_fks_and_zero_tenancy_cross_fks():
    """Base.metadata must keep only the 3 intra-module FKs and 0 cross-module tenancy FKs."""
    actual_fks: set[tuple[str, str, str]] = set()
    for table_name, table in Base.metadata.tables.items():
        for fk in table.foreign_keys:
            actual_fks.add((table_name, fk.parent.name, fk.target_fullname))

    expected_internal_fks = {
        ("usuarios", "empresa_id", "empresas.id"),
        ("detalles_venta", "venta_id", "ventas.id"),
        ("soporte_mensajes", "ticket_id", "soporte_tickets.id"),
    }
    forbidden_tenancy_fks = {
        ("productos", "empresa_id", "empresas.id"),
        ("ventas", "empresa_id", "empresas.id"),
        ("soporte_tickets", "empresa_id", "empresas.id"),
        ("agent_commands", "empresa_id", "empresas.id"),
    }

    assert actual_fks.isdisjoint(forbidden_tenancy_fks), (
        f"Cross-module tenancy FKs still present in Base.metadata: "
        f"{actual_fks & forbidden_tenancy_fks}"
    )
    assert actual_fks == expected_internal_fks, (
        f"Expected exact 3 internal FKs {expected_internal_fks}, got {actual_fks}"
    )


def test_tenancy_cross_module_orm_relationships_removed():
    """All 8 cross-module tenancy ORM relationships to/from Empresa must be removed."""
    empresa_rels = set(sa_inspect(models.Empresa).relationships.keys())
    producto_rels = set(sa_inspect(models.Producto).relationships.keys())
    venta_rels = set(sa_inspect(models.Venta).relationships.keys())
    ticket_rels = set(sa_inspect(models.SoporteTicket).relationships.keys())
    agent_rels = set(sa_inspect(models.AgentCommand).relationships.keys())

    # 8 removed cross-module tenancy relationships
    for rel_name in ("productos", "ventas", "soporte_tickets", "agent_commands"):
        assert rel_name not in empresa_rels, f"Empresa.{rel_name} must be removed in S3-2"
    assert "empresa" not in producto_rels, "Producto.empresa must be removed in S3-2"
    assert "empresa" not in venta_rels, "Venta.empresa must be removed in S3-2"
    assert "empresa" not in ticket_rels, "SoporteTicket.empresa must be removed in S3-2"
    assert "empresa" not in agent_rels, "AgentCommand.empresa must be removed in S3-2"

    # 3 intra-module ORM relationships conserved intact
    assert "usuarios" in empresa_rels
    assert "empresa" in set(sa_inspect(models.Usuario).relationships.keys())
    assert "detalles" in venta_rels
    assert "venta" in set(sa_inspect(models.DetalleVenta).relationships.keys())
    assert "mensajes" in ticket_rels
    assert "ticket" in set(sa_inspect(models.SoporteMensaje).relationships.keys())


def test_non_tenancy_cross_module_relationships_remain_temporarily_until_s3_3():
    """Temporary S3-2 bridge: non-tenancy relationships remain until S3-3 (migration 015).

    NOTE: This explicitly documents that S3-2 is a partial vertical slice and does NOT
    close DAT-03; Usuario <-> Venta, Producto <-> DetalleVenta, and SoporteTicket.usuario
    will be removed in S3-3 once DetalleVenta snapshots replace live Producto joinedload.
    """
    usuario_rels = set(sa_inspect(models.Usuario).relationships.keys())
    venta_rels = set(sa_inspect(models.Venta).relationships.keys())
    producto_rels = set(sa_inspect(models.Producto).relationships.keys())
    detalle_rels = set(sa_inspect(models.DetalleVenta).relationships.keys())
    ticket_rels = set(sa_inspect(models.SoporteTicket).relationships.keys())

    assert "ventas" in usuario_rels
    assert "usuario" in venta_rels
    assert "detalles_venta" in producto_rels
    assert "producto" in detalle_rels
    assert "usuario" in ticket_rels


def test_tenancy_empresa_id_columns_remain_indexed_non_null_uuids():
    """Decoupled empresa_id columns must stay non-null UUIDs covered by tenancy indexes."""
    expected_indexes = {
        "productos": "idx_productos_empresa",
        "ventas": "idx_ventas_empresa_fecha",
        "soporte_tickets": "idx_soporte_tickets_empresa",
        "agent_commands": "idx_agent_commands_empresa",
    }

    for table_name, index_name in expected_indexes.items():
        table = Base.metadata.tables[table_name]
        col = table.c.empresa_id
        assert col.nullable is False, f"{table_name}.empresa_id must remain NOT NULL"
        assert len(col.foreign_keys) == 0, f"{table_name}.empresa_id must have 0 FKs"
        index_names = {idx.name for idx in table.indexes}
        assert index_name in index_names, (
            f"Missing expected tenancy index {index_name} on {table_name}"
        )
