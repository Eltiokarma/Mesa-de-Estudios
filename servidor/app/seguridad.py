"""Contraseñas (argon2), tokens (JWT de acceso y renovación opaca), DNI cifrado y nombres de usuario."""
import hashlib
import hmac
import re
import secrets
import unicodedata
from datetime import timedelta

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from cryptography.fernet import Fernet

from .db import ahora

_ph = PasswordHasher()
# Un hash fijo para gastar el mismo tiempo cuando el usuario no existe (no revela qué usuarios hay).
_HASH_FALSO = _ph.hash("contrasena-que-nadie-tiene")

# Sin 0, O, 1, l ni I; tampoco i ni o, para que se dicten sin dudas. Solo minúsculas.
ALFABETO = "abcdefghjkmnpqrstuvwxyz23456789"


def hash_contrasena(c: str) -> str:
    return _ph.hash(c)


def verificar_contrasena(h: str | None, c: str) -> bool:
    try:
        return _ph.verify(h or _HASH_FALSO, c) and h is not None
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def contrasena_inicial(n: int = 6) -> str:
    return "".join(secrets.choice(ALFABETO) for _ in range(n))


def seudonimo() -> str:
    """Igual que idNuevo() de app/app.js: 'a' y 10 cifras hexadecimales."""
    return "a" + secrets.token_hex(5)


# ---------- Tokens ----------

def token_acceso(cfg, usuario) -> str:
    t = ahora()
    datos = {"sub": str(usuario.id), "rol": usuario.rol, "col": usuario.colegio_id, "typ": "acceso",
             "iat": t, "exp": t + timedelta(minutes=cfg.acceso_minutos)}
    return jwt.encode(datos, cfg.jwt_secreto, algorithm="HS256")


def leer_acceso(cfg, token: str) -> dict | None:
    try:
        d = jwt.decode(token, cfg.jwt_secreto, algorithms=["HS256"], options={"require": ["exp", "sub"]})
    except jwt.PyJWTError:
        return None
    return d if d.get("typ") == "acceso" else None


def token_renovacion() -> str:
    return secrets.token_urlsafe(32)


def hash_token(t: str) -> str:
    return hashlib.sha256(t.encode()).hexdigest()


# ---------- DNI ----------

class Cofre:
    def __init__(self, clave_fernet: str, clave_hmac: str):
        self._f = Fernet(clave_fernet.encode())
        self._h = clave_hmac.encode()

    def cifrar(self, dni: str) -> str:
        return self._f.encrypt(dni.encode()).decode()

    def descifrar(self, c: str) -> str:
        return self._f.decrypt(c.encode()).decode()

    def huella(self, dni: str) -> str:
        return hmac.new(self._h, dni.encode(), hashlib.sha256).hexdigest()


# ---------- Nombres de usuario ----------

_PARTICULAS = {"de", "del", "la", "las", "los", "da", "di", "san", "santa", "y", "van", "von", "mc"}


def sin_tildes(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    return "".join(c for c in s if not unicodedata.combining(c)).lower()


def _palabras(s: str) -> list[str]:
    return [p for p in re.split(r"[\s\-]+", sin_tildes(s)) if re.sub(r"[^a-z]", "", p)]


def primer_apellido(apellidos: str) -> str:
    """'De la Cruz Quispe' → 'delacruz'; 'Román Mamani' → 'roman'."""
    out = []
    for p in _palabras(apellidos):
        out.append(re.sub(r"[^a-z]", "", p))
        if p not in _PARTICULAS:
            break
    return "".join(out)


def base_usuario(nombres: str, apellidos: str, anio: int) -> str:
    ps = _palabras(nombres)
    ini = re.sub(r"[^a-z]", "", ps[0])[:1] if ps else ""
    ape = primer_apellido(apellidos)[:20]
    base = (ini + ape) or "alumno"
    return f"{base}{anio % 100:02d}"


def usuario_libre(base: str, existe) -> str:
    """Si `base` choca, le agrega 2, 3, ...: qroman26, qroman262, qroman263."""
    if not existe(base):
        return base
    n = 2
    while existe(f"{base}{n}"):
        n += 1
    return f"{base}{n}"
