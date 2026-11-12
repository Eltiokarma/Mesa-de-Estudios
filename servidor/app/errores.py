"""Errores con el formato del contrato: { "error": "<código>", "mensaje": "<texto>" }."""
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class ErrorApi(Exception):
    def __init__(self, estado: int, codigo: str, mensaje: str):
        self.estado, self.codigo, self.mensaje = estado, codigo, mensaje


def _resp(estado, codigo, mensaje):
    return JSONResponse(status_code=estado, content={"error": codigo, "mensaje": mensaje})


_GENERICOS = {
    400: ("peticion-invalida", "La petición no es válida."),
    401: ("no-autorizado", "Tienes que ingresar de nuevo."),
    403: ("prohibido", "No tienes permiso para esto."),
    404: ("no-existe", "No encontramos lo que buscas."),
    405: ("metodo", "Esa operación no existe."),
    413: ("muy-grande", "El archivo o los datos son demasiado grandes."),
}


def instalar(app: FastAPI) -> None:
    @app.exception_handler(ErrorApi)
    async def _e(_: Request, e: ErrorApi):
        return _resp(e.estado, e.codigo, e.mensaje)

    @app.exception_handler(StarletteHTTPException)
    async def _h(_: Request, e: StarletteHTTPException):
        codigo, mensaje = _GENERICOS.get(e.status_code, ("error", "Algo salió mal."))
        return _resp(e.status_code, codigo, mensaje)

    @app.exception_handler(RequestValidationError)
    async def _v(_: Request, e: RequestValidationError):
        return _resp(422, "datos-invalidos", "Faltan datos o tienen un formato que no esperábamos.")
