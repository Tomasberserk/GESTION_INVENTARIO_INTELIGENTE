"""PostgreSQL integration tests for Migration 014 (ADR-006 / S3-2).

Verifies on a real PostgreSQL instance:
1. `alembic upgrade 014` removes all 4 cross-module tenancy FKs toward `empresas`
   (including unnamed constraints from migrations 006 and 010), preserves the exact
   3 intra-module FKs, and ensures the 4 tenancy indexes exist.
2. `alembic downgrade 013` fails safely if any orphan `empresa_id` exists.
3. `alembic downgrade 013` succeeds cleanly with zero orphans and restores the 4
   explicitly named FKs (ADR-006) with ON DELETE CASCADE.
4. `alembic upgrade head` returns cleanly to revision 014.
"""
import os
from pathlib import Path
import subprocess
import sys
import uuid

import pytest
from sqlalchemy import create_engine, text

REPO_ROOT = Path(__file__).resolve().parents[3]
POSTGRES_URL = (
    os.getenv("TEST_POSTGRES_URL")
    or os.getenv("POSTGRES_URL")
    or "postgresql://postgres:postgres@localhost:5432/gestion_neiva_test"
)


def _check_postgres_alive() -> bool:
    try:
        import psycopg2

        conn = psycopg2.connect(POSTGRES_URL, connect_timeout=3)
        conn.close()
        return True
    except Exception:
        return False


PG_ALIVE = _check_postgres_alive()

pytestmark = pytest.mark.skipif(
    not PG_ALIVE,
    reason=(
        f"PostgreSQL no está disponible en {POSTGRES_URL}. "
        "Configure TEST_POSTGRES_URL o inicie el servicio."
    ),
)


def _run_alembic(*args: str) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env["DATABASE_URL"] = POSTGRES_URL
    return subprocess.run(
        [sys.executable, "-m", "alembic", *args],
        cwd=str(REPO_ROOT),
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )


def _fetch_fks(conn) -> list[tuple[str, str, str, str, str]]:
    """Return (table_name, column_name, ref_table, constraint_name, confdeltype)."""
    rows = conn.execute(
        text(
            """
            SELECT
                c.conrelid::regclass::text AS table_name,
                a.attname AS column_name,
                c.confrelid::regclass::text AS ref_table,
                c.conname AS constraint_name,
                c.confdeltype::text AS confdeltype
            FROM pg_constraint c
            JOIN pg_attribute a
              ON a.attrelid = c.conrelid
             AND a.attnum = ANY(c.conkey)
            WHERE c.contype = 'f'
            ORDER BY table_name, column_name, constraint_name
            """
        )
    ).fetchall()
    return [(r[0], r[1], r[2], r[3], r[4]) for r in rows]


def _fetch_indexes(conn) -> set[str]:
    rows = conn.execute(
        text("SELECT indexname FROM pg_indexes WHERE schemaname = 'public'")
    ).fetchall()
    return {r[0] for r in rows}


def test_migration_014_upgrade_orphan_guard_downgrade_and_reupgrade():
    """Full PostgreSQL verification of migration 014 upgrade, orphan guard, and downgrade."""
    engine = create_engine(POSTGRES_URL)
    orphan_cmd_id = uuid.uuid4()
    orphan_empresa_id = uuid.uuid4()

    try:
        # 0. Force the predecessor revision so this test executes the current
        # migration source even when a previous local run already marked 014.
        baseline = _run_alembic("downgrade", "013")
        assert baseline.returncode == 0, (
            f"alembic downgrade 013 baseline failed:\n{baseline.stdout}\n{baseline.stderr}"
        )

        # 1. Upgrade to 014
        up = _run_alembic("upgrade", "014")
        assert up.returncode == 0, f"alembic upgrade 014 failed:\n{up.stdout}\n{up.stderr}"

        with engine.connect() as conn:
            fks_014 = _fetch_fks(conn)
            indexes_014 = _fetch_indexes(conn)

        fk_triples_014 = {(t, col, ref) for t, col, ref, _, _ in fks_014}
        expected_internal_fks = {
            ("usuarios", "empresa_id", "empresas"),
            ("detalles_venta", "venta_id", "ventas"),
            ("soporte_mensajes", "ticket_id", "soporte_tickets"),
        }
        cross_module_tenancy_fks = {
            (t, col, ref)
            for t, col, ref, _, _ in fks_014
            if t in {"productos", "ventas", "soporte_tickets", "agent_commands"}
            and ref == "empresas"
        }
        assert cross_module_tenancy_fks == set(), (
            f"Cross-module tenancy FKs still present at revision 014: {cross_module_tenancy_fks}"
        )
        assert fk_triples_014 == expected_internal_fks, (
            "Revision 014 must reconcile every legacy cross-module FK left by "
            f"pre-Alembic create_all() schemas. Expected only {expected_internal_fks}, "
            f"got {fks_014}"
        )

        for expected_idx in (
            "idx_productos_empresa",
            "idx_ventas_empresa_fecha",
            "idx_soporte_tickets_empresa",
            "idx_agent_commands_empresa",
        ):
            assert expected_idx in indexes_014, f"Missing tenancy index {expected_idx}"

        # 2. Insert temporary orphan empresa_id -> downgrade 013 MUST fail safely
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO agent_commands
                        (id, empresa_id, conversation_id, command_id, action, status, is_active)
                    VALUES
                        (:id, :empresa_id, 'conv-orphan-test', :cmd_key, 'TEST', 'PENDIENTE', true)
                    """
                ),
                {
                    "id": str(orphan_cmd_id),
                    "empresa_id": str(orphan_empresa_id),
                    "cmd_key": f"orphan-{orphan_cmd_id.hex}",
                },
            )

        down_blocked = _run_alembic("downgrade", "013")
        assert down_blocked.returncode != 0, (
            "downgrade 013 MUST fail safely when orphan empresa_id rows exist"
        )
        combined_err = f"{down_blocked.stdout}\n{down_blocked.stderr}".lower()
        assert "huérfan" in combined_err or "orphan" in combined_err, (
            f"Expected orphan safety error message, got:\n{combined_err}"
        )

        # Remove temporary orphan row before clean downgrade
        with engine.begin() as conn:
            conn.execute(
                text("DELETE FROM agent_commands WHERE id = :id"),
                {"id": str(orphan_cmd_id)},
            )

        # 3. Clean downgrade to 013 -> restores exact 4 named FKs with ON DELETE CASCADE
        down_ok = _run_alembic("downgrade", "013")
        assert down_ok.returncode == 0, (
            f"alembic downgrade 013 failed:\n{down_ok.stdout}\n{down_ok.stderr}"
        )

        with engine.connect() as conn:
            fks_013 = _fetch_fks(conn)

        restored_tenancy = {
            (t, col, ref, name, deltype)
            for t, col, ref, name, deltype in fks_013
            if t in {"productos", "ventas", "soporte_tickets", "agent_commands"}
            and col == "empresa_id"
        }
        assert restored_tenancy == {
            ("productos", "empresa_id", "empresas", "fk_productos_empresa_id", "c"),
            ("ventas", "empresa_id", "empresas", "fk_ventas_empresa_id", "c"),
            ("soporte_tickets", "empresa_id", "empresas", "fk_soporte_tickets_empresa_id", "c"),
            ("agent_commands", "empresa_id", "empresas", "fk_agent_commands_empresa_id", "c"),
        }, f"Unexpected restored tenancy FKs at 013: {restored_tenancy}"

        # 4. Re-upgrade to head (014) -> clean final state with 0 tenancy cross-module FKs
        reup = _run_alembic("upgrade", "head")
        assert reup.returncode == 0, f"alembic upgrade head failed:\n{reup.stdout}\n{reup.stderr}"

        with engine.connect() as conn:
            fks_final = _fetch_fks(conn)
        final_cross_tenancy = {
            (t, col, ref)
            for t, col, ref, _, _ in fks_final
            if t in {"productos", "ventas", "soporte_tickets", "agent_commands"}
            and ref == "empresas"
        }
        assert final_cross_tenancy == set(), (
            f"Cross-module tenancy FKs still present after re-upgrade: {final_cross_tenancy}"
        )
    finally:
        # Always clean up orphan test row and ensure DB returns to head
        with engine.begin() as conn:
            conn.execute(
                text("DELETE FROM agent_commands WHERE id = :id"),
                {"id": str(orphan_cmd_id)},
            )
        _run_alembic("upgrade", "head")
        engine.dispose()
