from app.schemas.empresa import EmpresaCrear, EmpresaRespuesta
from app.schemas.producto import (
    InventarioRespuesta,
    ProductoActualizar,
    ProductoCrear,
    ProductoRespuesta,
)
from app.schemas.usuario import (
    LoginForm,
    TokenRespuesta,
    UsuarioCrear,
    UsuarioRespuesta,
)
from app.schemas.venta import (
    DetalleVentaCrear,
    DetalleVentaRespuesta,
    VentaCrear,
    VentaRespuesta,
    VentaResumen,
)

__all__ = [
    # Empresa
    "EmpresaCrear",
    "EmpresaRespuesta",
    # Usuario / Auth
    "UsuarioCrear",
    "UsuarioRespuesta",
    "LoginForm",
    "TokenRespuesta",
    # Producto
    "ProductoCrear",
    "ProductoActualizar",
    "ProductoRespuesta",
    "InventarioRespuesta",
    # Venta
    "DetalleVentaCrear",
    "VentaCrear",
    "DetalleVentaRespuesta",
    "VentaRespuesta",
    "VentaResumen",
]
