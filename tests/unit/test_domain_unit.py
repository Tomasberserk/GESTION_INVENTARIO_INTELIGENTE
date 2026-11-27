"""Pure domain unit tests for schemas, intent parser, and platform contracts (TC-001..TC-012)."""
from decimal import Decimal
from types import SimpleNamespace
import uuid
import pytest

from app.inventario.api.contracts import StockDeductionResultDTO
from app.inventario.api.facade import InventarioFacade
from app.platform.errors import ErrorDetail, StandardErrorPayload
from app.platform.security import hash_password, verify_password
from app.schemas.producto import ProductoAdminOut, ProductoCajeroOut
from app.schemas.venta import DetalleVentaCrear, VentaCrear
from app.services import venta_service
from app.services.agente.intent_provider import quick_parse_intent


@pytest.mark.unit
def test_password_hashing_and_verification_unit():
    """Verify bcrypt password hashing and verification in isolation."""
    hashed = hash_password("SecurePass2026!")
    assert verify_password("SecurePass2026!", hashed) is True
    assert verify_password("WrongPass!", hashed) is False


@pytest.mark.unit
def test_cashier_schema_hides_cost_price_unit():
    """Verify ProductoCajeroOut strips precio_costo while ProductoAdminOut retains it."""
    raw = {
        "id": uuid.uuid4(),
        "empresa_id": uuid.uuid4(),
        "nombre": "Arroz Diana 500g",
        "codigo_barras": "7701234567890",
        "precio_costo": 2100.0,
        "precio_venta": 2800.0,
        "cantidad_actual": 30.0,
        "unidad_medida": "unidad",
        "fecha_vencimiento": None,
        "categoria": "Snacks",
        "foto_url": None,
        "created_at": "2026-11-06T12:00:00Z",
        "is_active": True,
    }
    cashier_dump = ProductoCajeroOut.model_validate(raw).model_dump()
    admin_dump = ProductoAdminOut.model_validate(raw).model_dump()
    assert "precio_costo" not in cashier_dump
    assert admin_dump["precio_costo"] == 2100.0


@pytest.mark.unit
def test_deterministic_restock_intent_parser_unit():
    """Verify zero-latency deterministic parser extracts restock intent and cost."""
    parsed = quick_parse_intent(
        "hoy me reabasteci de 5 bolsas de leche, pero el precio costo incremento y ahora vale 3500"
    )
    assert parsed is not None
    assert parsed.intent == "reabastecer"
    assert parsed.slots.get("quantity") == 5.0
    assert parsed.slots.get("precio_costo") == 3500.0


@pytest.mark.unit
def test_standard_error_payload_immutable_contract_unit():
    """Verify StandardErrorPayload immutable dataclass contract."""
    detail = ErrorDetail(field="cantidad", message="Insufficient stock")
    payload = StandardErrorPayload(
        error="INSUFFICIENT_STOCK",
        message="Stock below requested quantity",
        details=[{"field": detail.field, "message": detail.message}],
        correlation_id="cid-unit-001",
    )
    assert payload.error == "INSUFFICIENT_STOCK"
    assert payload.correlation_id == "cid-unit-001"


@pytest.mark.unit
def test_registrar_venta_orders_detalles_by_producto_id_deterministically_unit(monkeypatch):
    """Verify registrar_venta invokes InventarioFacade in deterministic ascending str(producto_id) order (ADR-003)."""
    empresa_id = uuid.uuid4()
    high_id = uuid.UUID("ffffffff-ffff-4fff-8fff-ffffffffffff")
    low_id = uuid.UUID("00000000-0000-4000-8000-000000000001")
    called_order: list[uuid.UUID] = []

    class FakeDB:
        def __init__(self):
            self.added = []
            self.committed = False
            self.rolled_back = False

        def add(self, obj):
            if getattr(obj, "id", None) is None and hasattr(obj, "total"):
                obj.id = uuid.uuid4()
            self.added.append(obj)

        def flush(self):
            pass

        def commit(self):
            self.committed = True

        def rollback(self):
            self.rolled_back = True

    def fake_validar_y_descontar(empresa_id, producto_id, cantidad, db):
        called_order.append(producto_id)
        return StockDeductionResultDTO(
            producto_id=producto_id,
            nombre=f"Prod-{producto_id}",
            precio_unitario=Decimal("1000.00"),
            cantidad_descontada=cantidad,
            subtotal=Decimal("1000.00") * cantidad,
            stock_restante=Decimal("5.00"),
        )

    monkeypatch.setattr(
        InventarioFacade,
        "validar_y_descontar_stock_atomic",
        staticmethod(fake_validar_y_descontar),
    )

    fake_user = SimpleNamespace(
        id=uuid.uuid4(),
        empresa_id=empresa_id,
        nombre="Tendero Unit",
        email="tendero@unit.test",
    )
    fake_db = FakeDB()
    venta_data = VentaCrear(
        detalles=[
            DetalleVentaCrear(producto_id=high_id, cantidad=Decimal("1.0")),
            DetalleVentaCrear(producto_id=low_id, cantidad=Decimal("2.0")),
        ]
    )

    res = venta_service.registrar_venta(
        empresa_id=empresa_id,
        data=venta_data,
        current_user=fake_user,
        db=fake_db,
    )

    assert called_order == [low_id, high_id]
    assert res.total == 3000.0
    assert fake_db.committed is True
    assert fake_db.rolled_back is False
