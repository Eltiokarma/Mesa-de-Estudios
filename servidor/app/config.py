"""Configuración desde variables de entorno (ver LEEME.md)."""
import os
import re
from dataclasses import dataclass, field

# Claves de desarrollo: solo sirven en local y en las pruebas. En producción se exigen las reales.
_DEV_JWT = "solo-para-desarrollo-no-usar-en-produccion-0123456789"
_DEV_FERNET = "ZGVzYXJyb2xsby1sb2NhbC1zb2xvLXBydWViYXMtMzI="  # 32 bytes en base64 urlsafe
_DEV_HMAC = "hmac-solo-para-desarrollo"


def _lista(v: str) -> list[str]:
    return [x.strip().rstrip("/") for x in v.split(",") if x.strip()]


def _url_db(v: str) -> str:
    # Railway entrega postgres:// o postgresql://; SQLAlchemy con psycopg 3 pide postgresql+psycopg://
    if v.startswith("postgres://"):
        v = "postgresql://" + v[len("postgres://"):]
    if v.startswith("postgresql://"):
        v = "postgresql+psycopg://" + v[len("postgresql://"):]
    return v


@dataclass
class Config:
    entorno: str = "local"
    database_url: str = "sqlite:///./local.db"
    jwt_secreto: str = _DEV_JWT
    dni_clave_fernet: str = _DEV_FERNET
    dni_hmac_clave: str = _DEV_HMAC
    cors_origenes: list[str] = field(default_factory=lambda: ["http://localhost:4173", "http://127.0.0.1:4173"])
    confiar_proxy: bool = False
    app_url: str = ""
    acceso_minutos: int = 15
    renovacion_dias: int = 30
    intentos_max: int = 5
    intentos_ip_max: int = 5
    db_pool: int = 5
    db_pool_extra: int = 10
    intentos_ventana_min: int = 10

    @property
    def produccion(self) -> bool:
        return self.entorno == "produccion"

    def validar(self) -> None:
        if not self.produccion:
            return
        faltan = []
        # Distingue «no llega al contenedor» de «llega pero es corta», para que el log diga qué arreglar.
        def secreta(nombre, valor, dev, minimo=32):
            if valor == dev:
                faltan.append(f"{nombre} (no llega al servidor: revisa el nombre exacto y que esté en las variables de este servicio)")
            elif len(valor) < minimo:
                faltan.append(f"{nombre} (llega con {len(valor)} caracteres; necesita {minimo} o más)")
        secreta("JWT_SECRETO", self.jwt_secreto, _DEV_JWT)
        secreta("DNI_CLAVE_FERNET", self.dni_clave_fernet, _DEV_FERNET, 1)
        secreta("DNI_HMAC_CLAVE", self.dni_hmac_clave, _DEV_HMAC)
        if self.dni_clave_fernet != _DEV_FERNET:
            try:
                from cryptography.fernet import Fernet
                Fernet(self.dni_clave_fernet.encode())
            except Exception:
                faltan.append("DNI_CLAVE_FERNET (llega, pero no es una clave Fernet: 44 caracteres en base64 que terminan en «=»)")
        if self.database_url.startswith("sqlite"):
            faltan.append("DATABASE_URL (PostgreSQL)")
        if not self.cors_origenes or "*" in self.cors_origenes:
            faltan.append("CORS_ORIGENES (orígenes exactos, sin *)")
        if faltan:
            # Solo los NOMBRES de variables parecidas que sí llegan (nunca los valores), para detectar errores de tipeo.
            parecidas = sorted(k for k in os.environ if re.search(r"JWT|DNI|FERNET|HMAC|SECRET|CLAVE", k, re.I))
            pista = f" Variables parecidas que sí llegan: {', '.join(parecidas)}." if parecidas else " No llega ninguna variable con JWT, DNI, CLAVE ni SECRET en el nombre."
            raise RuntimeError("Faltan variables de entorno para producción: " + "; ".join(faltan) + "." + pista)


def desde_entorno() -> Config:
    e = os.environ.get
    c = Config()
    c.entorno = e("ENTORNO", c.entorno)
    c.database_url = _url_db(e("DATABASE_URL", c.database_url))
    c.jwt_secreto = e("JWT_SECRETO", c.jwt_secreto)
    c.dni_clave_fernet = e("DNI_CLAVE_FERNET", c.dni_clave_fernet)
    c.dni_hmac_clave = e("DNI_HMAC_CLAVE", c.dni_hmac_clave)
    if e("CORS_ORIGENES") is not None:
        c.cors_origenes = _lista(e("CORS_ORIGENES", ""))
    c.confiar_proxy = e("CONFIAR_PROXY", "0") in ("1", "true", "si", "sí")
    c.app_url = e("APP_URL", c.app_url)
    c.intentos_ip_max = int(e("INTENTOS_IP_MAX", c.intentos_ip_max))
    c.db_pool = int(e("DB_POOL", c.db_pool))
    c.db_pool_extra = int(e("DB_POOL_EXTRA", c.db_pool_extra))
    return c
