"""End-to-end HTTP journey tests across /api/v1 endpoints (TC-001..TC-012)."""
import pytest


@pytest.mark.end_to_end
def test_complete_store_e2e_journey_v1(client):
    """Execute complete store journey over /api/v1: register, login, me, catalog, POS sale, stock check, dashboard, and stateless logout (401)."""
    email = "e2e_huila@tienda.com"
    password = "Password123!"

    # a. Registro completo
    reg = client.post(
        "/api/v1/auth/registro-completo",
        json={
            "nombre_comercial": "Minimercado El Huila E2E",
            "nit_o_cedula": "900777888-9",
            "email": email,
            "password": password,
            "rol": "admin",
        },
    )
    assert reg.status_code == 201
    reg_payload = reg.json()
    empresa_id = reg_payload["usuario"]["empresa_id"]
    usuario_id = reg_payload["usuario"]["id"]

    # b. Login real mediante POST /api/v1/token usando email y contraseña
    login = client.post(
        "/api/v1/token",
        json={"email": email, "password": password},
    )
    assert login.status_code == 200
    login_payload = login.json()

    # c. Usar el token recibido en login, no el token de registro
    login_token = login_payload["access_token"]
    assert login_token
    assert login_payload["token_type"].lower() == "bearer"
    headers = {"Authorization": f"Bearer {login_token}"}

    # d. GET /api/v1/me con el token de login y verificar usuario
    me = client.get("/api/v1/me", headers=headers)
    assert me.status_code == 200
    me_payload = me.json()
    assert me_payload["id"] == usuario_id
    assert me_payload["email"] == email
    assert me_payload["empresa_id"] == empresa_id
    assert me_payload["rol"] == "admin"

    # e. Crear producto
    prod = client.post(
        "/api/v1/productos",
        json={
            "nombre": "Panela Huilense 1kg",
            "codigo_barras": "7704445556667",
            "precio_costo": 3000.0,
            "precio_venta": 4500.0,
            "cantidad_actual": 25.0,
            "unidad_medida": "unidad",
        },
        headers=headers,
    )
    assert prod.status_code == 201
    prod_id = prod.json()["id"]

    # f. Crear venta
    sale = client.post(
        f"/api/v1/ventas/{empresa_id}",
        json={"detalles": [{"producto_id": prod_id, "cantidad": 4.0}]},
        headers=headers,
    )
    assert sale.status_code == 201
    assert sale.json()["total"] == 18000.0

    # g. Verificar reducción de stock en GET /api/v1/productos/{producto_id}: 25 - 4 = 21
    prod_after = client.get(f"/api/v1/productos/{prod_id}", headers=headers)
    assert prod_after.status_code == 200
    assert float(prod_after.json()["cantidad_actual"]) == 21.0

    # h. Consultar dashboard y verificar una venta e ingresos de 18.000
    dash = client.get(f"/api/v1/dashboard/{empresa_id}", headers=headers)
    assert dash.status_code == 200
    assert dash.json()["ventas_hoy"] == 1
    assert dash.json()["ingresos_hoy"] == 18000.0

    # i. Simular logout stateless cliente eliminando headers de autorización
    headers = {}

    # j. GET /api/v1/me sin Authorization debe responder 401
    me_after_logout = client.get("/api/v1/me", headers=headers)
    assert me_after_logout.status_code == 401
