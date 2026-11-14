"""Motor de base de datos y sesión por petición."""
from datetime import datetime, timezone

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import StaticPool


class Base(DeclarativeBase):
    pass


def ahora() -> datetime:
    """UTC sin zona: SQLite no guarda la zona y así se compara igual en las dos bases."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def crear_motor(url: str, pool: int = 5, extra: int = 10):
    if url.startswith("sqlite"):
        kw = {"connect_args": {"check_same_thread": False}}
        if url in ("sqlite://", "sqlite:///:memory:"):
            kw["poolclass"] = StaticPool
        return create_engine(url, **kw)
    return create_engine(url, pool_pre_ping=True, pool_size=pool, max_overflow=extra)


def crear_sesiones(motor):
    return sessionmaker(bind=motor, autoflush=False, expire_on_commit=False)


def crear_tablas(motor, base) -> None:
    """Crea las tablas que falten. En PostgreSQL toma un candado para que dos procesos no las creen a la vez."""
    with motor.begin() as cx:
        if motor.dialect.name == "postgresql":
            cx.execute(text("SELECT pg_advisory_xact_lock(417301)"))
        base.metadata.create_all(cx)
