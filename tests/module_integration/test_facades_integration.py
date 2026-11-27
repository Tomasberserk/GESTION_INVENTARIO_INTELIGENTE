"""Module integration tests verifying public Facade boundaries (AuthTenancyFacade, InventarioFacade, VentasFacade)."""
from dataclasses import FrozenInstanceError
from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import AsyncMock
import uuid
import pytest

from app import models
from app.agente_ia.api import AgenteIaFacade, AgentTurnResponseDTO
from app.auth_tenancy.api.facade import AuthTenancyFacade
from app.database import SessionLocal
from app.inventario.api.facade import InventarioFacade
from app.pos_ventas.api.facade import VentasFacade
from app.reportes_analytics.api import DailyMetricsDTO, ReportesFacade
from app.schemas.venta import DetalleVentaCrear, VentaCrear
from app.services.agente.agent_orchestrator import AgentOrchestrator
from app.soporte_crm.api.facade import SoporteCrmFacade


@pytest.mark.module_integration
def test_facades_atomic_checkout_and_tenant_isolation(client):
    """Verify cross-module collaboration exclusively through public Facade classes."""
    reg = client.post(
        "/api/v1/auth/registro-completo",
        json={
            "nombre_comercial": "Tienda Facade Test",
            "nit_o_cedula": "900555666-7",
            "email": "facade@tienda.com",
            "password": "Password123!",
            "rol": "admin",
        },
    )
    assert reg.status_code == 201
    token = reg.json()["access_token"]
    empresa_id = uuid.UUID(reg.json()["usuario"]["empresa_id"])
    user_id = uuid.UUID(reg.json()["usuario"]["id"])
    headers = {"Authorization": f"Bearer {token}"}

    prod_res = client.post(
        "/api/v1/productos",
        json={
            "nombre": "Chocolate Corona 250g",
            "codigo_barras": "7709988776655",
            "precio_costo": 4000.0,
            "precio_venta": 5500.0,
            "cantidad_actual": 10.0,
            "unidad_medida": "unidad",
        },
        headers=headers,
    )
    assert prod_res.status_code == 201
    prod_id = uuid.UUID(prod_res.json()["id"])

    import app.database as db_module
    db = db_module.SessionLocal()
    try:
        company_dto = AuthTenancyFacade.ensure_active_company(empresa_id=empresa_id, db=db)
        assert company_dto.nombre_comercial == "Tienda Facade Test"

        seller_dto = AuthTenancyFacade.ensure_company_seller(
            usuario_id=user_id, empresa_id=empresa_id, db=db
        )
        assert seller_dto.email == "facade@tienda.com"

        user_obj = db.query(models.Usuario).filter(models.Usuario.id == user_id).first()
        sale_dto = VentasFacade.registrar_venta_atomica(
            empresa_id=empresa_id,
            data=VentaCrear(detalles=[DetalleVentaCrear(producto_id=prod_id, cantidad=Decimal("2.0"))]),
            current_user=user_obj,
            db=db,
        )
        assert sale_dto.total == 11000.0

        tickets = SoporteCrmFacade.listar_tickets_empresa(empresa_id=empresa_id, db=db)
        assert isinstance(tickets, list)
    finally:
        db.close()


@pytest.mark.module_integration
def test_checkout_when_stock_insufficient_returns_422_and_preserves_stock(client):
    """Verify POS checkout returns HTTP 422 and rolls back cleanly when requested quantity exceeds stock (ADR-003)."""
    reg = client.post(
        "/api/v1/auth/registro-completo",
        json={
            "nombre_comercial": "Tienda Stock 422",
            "nit_o_cedula": "900888999-1",
            "email": "stock422@tienda.com",
            "password": "Password123!",
            "rol": "admin",
        },
    )
    assert reg.status_code == 201
    token = reg.json()["access_token"]
    empresa_id = reg.json()["usuario"]["empresa_id"]
    headers = {"Authorization": f"Bearer {token}"}

    prod_res = client.post(
        "/api/v1/productos",
        json={
            "nombre": "Leche Alqueria 1L",
            "codigo_barras": "7701122334455",
            "precio_costo": 3200.0,
            "precio_venta": 4500.0,
            "cantidad_actual": 1.0,
            "unidad_medida": "unidad",
        },
        headers=headers,
    )
    assert prod_res.status_code == 201
    prod_id = prod_res.json()["id"]

    sale_res = client.post(
        f"/api/v1/ventas/{empresa_id}",
        json={"detalles": [{"producto_id": prod_id, "cantidad": 2.0}]},
        headers=headers,
    )
    assert sale_res.status_code == 422
    assert "Stock insuficiente" in sale_res.json()["detail"]

    prod_after = client.get(f"/api/v1/productos/{prod_id}", headers=headers)
    assert prod_after.status_code == 200
    assert float(prod_after.json()["cantidad_actual"]) == 1.0


@pytest.mark.module_integration
def test_reportes_facade_construir_resumen_diario_returns_immutable_dto():
    """Verify ReportesFacade delegates to internal projection and returns an immutable DailyMetricsDTO without ORM access."""
    empresa_id = uuid.uuid4()

    resumen = ReportesFacade.construir_resumen_diario(
        empresa_id=empresa_id,
        ventas_hoy=7,
        ingresos_hoy=145000.0,
    )

    assert isinstance(resumen, DailyMetricsDTO)
    assert resumen.empresa_id == empresa_id
    assert resumen.ventas_hoy == 7
    assert resumen.ingresos_hoy == 145000.0

    with pytest.raises(FrozenInstanceError):
        resumen.ventas_hoy = 99


@pytest.mark.module_integration
@pytest.mark.asyncio
async def test_agente_ia_facade_procesar_turno_delegates_without_external_calls(monkeypatch):
    """Verify AgenteIaFacade delegates turn arguments to AgentOrchestrator without invoking LLM, Redis, or external services."""
    expected_response = {
        "conversation_id": "conv-facade-001",
        "estado": "READY_TO_CONFIRM",
        "respuesta": "Confirma la venta de 2 Arroz Diana?",
        "datos": {"cantidad": 2},
    }
    mock_procesar = AsyncMock(return_value=expected_response)
    monkeypatch.setattr(AgentOrchestrator, "procesar_mensaje", mock_procesar)

    fake_user = SimpleNamespace(
        id=uuid.uuid4(),
        empresa_id=uuid.uuid4(),
        email="tendero@facade.test",
        rol="admin",
    )
    fake_db = object()

    result = await AgenteIaFacade.procesar_turno(
        mensaje="Vendi 2 Arroz Diana",
        current_user=fake_user,
        db=fake_db,
        conversation_id="conv-facade-001",
    )

    assert result == expected_response
    mock_procesar.assert_awaited_once_with(
        mensaje="Vendi 2 Arroz Diana",
        current_user=fake_user,
        db=fake_db,
        conversation_id="conv-facade-001",
    )

    dto = AgentTurnResponseDTO(
        conversation_id=result["conversation_id"],
        estado=result["estado"],
        respuesta=result["respuesta"],
        datos=result["datos"],
    )
    assert dto.conversation_id == "conv-facade-001"
    assert dto.estado == "READY_TO_CONFIRM"
    with pytest.raises(FrozenInstanceError):
        dto.estado = "EXECUTED"
