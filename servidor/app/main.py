"""Servidor de Mesa de Estudios (fase C1 de docs/cuentas.md). Arranque: uvicorn app.main:app"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import errores
from .config import Config, desde_entorno
from .db import Base, crear_motor, crear_sesiones
from .rutas import alumno, colegio, general, profesor, sesion
from .seguridad import Cofre


def crear_app(cfg: Config | None = None) -> FastAPI:
    cfg = cfg or desde_entorno()
    cfg.validar()
    app = FastAPI(title="Mesa de Estudios", docs_url=None if cfg.produccion else "/docs",
                  redoc_url=None, openapi_url=None if cfg.produccion else "/openapi.json")
    motor = crear_motor(cfg.database_url)
    Base.metadata.create_all(motor)
    app.state.cfg, app.state.motor, app.state.sesiones = cfg, motor, crear_sesiones(motor)
    app.state.cofre = Cofre(cfg.dni_clave_fernet, cfg.dni_hmac_clave)
    app.add_middleware(CORSMiddleware, allow_origins=cfg.cors_origenes, allow_credentials=False,
                       allow_methods=["GET", "POST", "PUT"], allow_headers=["Authorization", "Content-Type"],
                       max_age=600)

    @app.middleware("http")
    async def cabeceras(request, llamar):
        resp = await llamar(request)
        resp.headers.setdefault("Cache-Control", "no-store")
        resp.headers["X-Content-Type-Options"] = "nosniff"
        resp.headers["Referrer-Policy"] = "no-referrer"
        if cfg.produccion:
            resp.headers["Strict-Transport-Security"] = "max-age=31536000"
        return resp

    errores.instalar(app)
    for m in (sesion, alumno, profesor, colegio, general):
        app.include_router(m.r)

    @app.get("/api/salud")
    def salud():
        return {"ok": True}

    return app


def __getattr__(nombre):
    # `app.main:app` se crea al pedirlo, para que importar el módulo en las pruebas no abra la base local.
    if nombre == "app":
        globals()["app"] = crear_app()
        return globals()["app"]
    raise AttributeError(nombre)
