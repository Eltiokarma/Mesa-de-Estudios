from .modelos import Auditoria


def anotar(s, accion: str, usuario=None, colegio_id=None, ip: str = "", **detalle) -> None:
    s.add(Auditoria(accion=accion, usuario_id=usuario.id if usuario else None,
                    colegio_id=colegio_id if colegio_id is not None else (usuario.colegio_id if usuario else None),
                    ip=ip, detalle=detalle))
