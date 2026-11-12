"""Tablas. El DNI solo vive cifrado en `alumnos`; los eventos y el estado usan el id seudónimo."""
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base, ahora

ROLES = ("alumno", "profesor", "admin", "general")


class Colegio(Base):
    __tablename__ = "colegios"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(160), unique=True)
    creado: Mapped[datetime] = mapped_column(DateTime, default=ahora)


class Seccion(Base):
    __tablename__ = "secciones"
    __table_args__ = (UniqueConstraint("colegio_id", "grado", "letra"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    colegio_id: Mapped[int] = mapped_column(ForeignKey("colegios.id"), index=True)
    grado: Mapped[str] = mapped_column(String(4))
    letra: Mapped[str] = mapped_column(String(4))


class Usuario(Base):
    __tablename__ = "usuarios"
    id: Mapped[int] = mapped_column(primary_key=True)
    usuario: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    hash: Mapped[str] = mapped_column(String(200))
    rol: Mapped[str] = mapped_column(String(10))
    nombre: Mapped[str] = mapped_column(String(160))
    debe_cambiar: Mapped[bool] = mapped_column(Boolean, default=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    colegio_id: Mapped[int | None] = mapped_column(ForeignKey("colegios.id"), index=True, nullable=True)
    creado: Mapped[datetime] = mapped_column(DateTime, default=ahora)
    alumno: Mapped["Alumno | None"] = relationship(back_populates="cuenta", uselist=False)


class Alumno(Base):
    __tablename__ = "alumnos"
    __table_args__ = (UniqueConstraint("colegio_id", "dni_huella"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    seudonimo: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), unique=True)
    colegio_id: Mapped[int] = mapped_column(ForeignKey("colegios.id"), index=True)
    seccion_id: Mapped[int] = mapped_column(ForeignKey("secciones.id"), index=True)
    apellidos: Mapped[str] = mapped_column(String(80))
    nombres: Mapped[str] = mapped_column(String(80))
    dni_cifrado: Mapped[str] = mapped_column(Text)
    dni_huella: Mapped[str] = mapped_column(String(64))
    cuenta: Mapped[Usuario] = relationship(back_populates="alumno")
    seccion: Mapped[Seccion] = relationship()


class ProfesorSeccion(Base):
    __tablename__ = "profesor_seccion"
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), primary_key=True)
    seccion_id: Mapped[int] = mapped_column(ForeignKey("secciones.id"), primary_key=True)


class EstadoAlumno(Base):
    __tablename__ = "estado_alumno"
    alumno_id: Mapped[int] = mapped_column(ForeignKey("alumnos.id"), primary_key=True)
    est: Mapped[dict] = mapped_column(JSON, default=dict)
    actualizado: Mapped[datetime] = mapped_column(DateTime, default=ahora)


class Evento(Base):
    __tablename__ = "eventos"
    __table_args__ = (UniqueConstraint("alumno", "t"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    alumno: Mapped[str] = mapped_column(String(16), index=True)
    colegio_id: Mapped[int] = mapped_column(ForeignKey("colegios.id"), index=True)
    t: Mapped[str] = mapped_column(String(40))
    datos: Mapped[dict] = mapped_column(JSON)
    recibido: Mapped[datetime] = mapped_column(DateTime, default=ahora)


class Habilitacion(Base):
    __tablename__ = "habilitaciones"
    __table_args__ = (UniqueConstraint("seccion_id", "curso", "que"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    seccion_id: Mapped[int] = mapped_column(ForeignKey("secciones.id"), index=True)
    curso: Mapped[str] = mapped_column(String(60))
    que: Mapped[str] = mapped_column(String(12))
    abierto: Mapped[bool] = mapped_column(Boolean, default=True)
    por: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))
    cuando: Mapped[datetime] = mapped_column(DateTime, default=ahora)


class Renovacion(Base):
    __tablename__ = "renovaciones"
    id: Mapped[int] = mapped_column(primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), index=True)
    hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    expira: Mapped[datetime] = mapped_column(DateTime)
    revocada: Mapped[bool] = mapped_column(Boolean, default=False)
    creado: Mapped[datetime] = mapped_column(DateTime, default=ahora)


class IntentoFallido(Base):
    __tablename__ = "intentos_fallidos"
    id: Mapped[int] = mapped_column(primary_key=True)
    usuario: Mapped[str] = mapped_column(String(80), index=True)
    ip: Mapped[str] = mapped_column(String(64), index=True)
    cuando: Mapped[datetime] = mapped_column(DateTime, default=ahora, index=True)


class Auditoria(Base):
    __tablename__ = "auditoria"
    id: Mapped[int] = mapped_column(primary_key=True)
    usuario_id: Mapped[int | None] = mapped_column(ForeignKey("usuarios.id"), nullable=True)
    colegio_id: Mapped[int | None] = mapped_column(ForeignKey("colegios.id"), nullable=True)
    accion: Mapped[str] = mapped_column(String(40))
    detalle: Mapped[dict] = mapped_column(JSON, default=dict)
    ip: Mapped[str] = mapped_column(String(64), default="")
    cuando: Mapped[datetime] = mapped_column(DateTime, default=ahora, index=True)
