"""Motor de base de datos y sesión por petición."""
from datetime import datetime, timezone

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import StaticPool


class Base(DeclarativeBase):
    pass


def ahora() -> datetime:
    """UTC sin zona: SQLite no guarda la zona y así se compara igual en las dos bases."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def crear_motor(url: str):
    if url.startswith("sqlite"):
        kw = {"connect_args": {"check_same_thread": False}}
        if url in ("sqlite://", "sqlite:///:memory:"):
            kw["poolclass"] = StaticPool
        return create_engine(url, **kw)
    return create_engine(url, pool_pre_ping=True)


def crear_sesiones(motor):
    return sessionmaker(bind=motor, autoflush=False, expire_on_commit=False)
