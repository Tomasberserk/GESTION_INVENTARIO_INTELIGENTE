"""Unit tests for Migration 014 legacy cross-module FK reconciliation."""
import importlib.util

from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
MIGRATION_PATH = REPO_ROOT / "alembic" / "versions" / "014_desacoplar_fks_tenancy_empresa_id.py"


class _Result:
    def __init__(self, rows):
        self._rows = rows

    def fetchall(self):
        return self._rows


class _FakeBind:
    def execute(self, _statement, params=None):
        table_name = params["table_name"]
        column_name = params.get("column_name")
        referenced_table = params.get("referenced_table")

        names = {
            ("productos", "empresa_id", "empresas"): "fk_productos_empresa_id",
            ("ventas", "empresa_id", "empresas"): "fk_ventas_empresa_id",
            ("soporte_tickets", "empresa_id", "empresas"): "fk_soporte_tickets_empresa_id",
            ("agent_commands", "empresa_id", "empresas"): "fk_agent_commands_empresa_id",
            ("ventas", "usuario_id", "usuarios"): "fk_ventas_usuario_id_legacy",
            ("detalles_venta", "producto_id", "productos"): "fk_detalles_venta_producto_id_legacy",
            ("soporte_tickets", "usuario_id", "usuarios"): "fk_soporte_tickets_usuario_id_legacy",
        }
        name = names.get((table_name, column_name, referenced_table))
        return _Result([(name,)] if name else [])


def _load_migration_module():
    spec = importlib.util.spec_from_file_location("migration_014", MIGRATION_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


def test_upgrade_reconciles_legacy_cross_module_constraints(monkeypatch):
    """Upgrade must remove tenancy FKs and legacy FKs that canonical revision 013 removed."""
    migration = _load_migration_module()
    executed_sql = []

    monkeypatch.setattr(migration.op, "get_bind", lambda: _FakeBind())
    monkeypatch.setattr(migration.op, "execute", executed_sql.append)

    migration.upgrade()

    rendered = "\n".join(str(statement) for statement in executed_sql)
    for constraint_name in (
        "fk_productos_empresa_id",
        "fk_ventas_empresa_id",
        "fk_soporte_tickets_empresa_id",
        "fk_agent_commands_empresa_id",
        "fk_ventas_usuario_id_legacy",
        "fk_detalles_venta_producto_id_legacy",
        "fk_soporte_tickets_usuario_id_legacy",
    ):
        assert constraint_name in rendered
