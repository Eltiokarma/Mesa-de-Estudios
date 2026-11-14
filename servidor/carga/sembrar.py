"""Siembra datos inventados para la prueba de carga (docs/carga.md). Solo para una base local de pruebas.

    DATABASE_URL=postgresql://carga:carga@localhost/carga python -m carga.sembrar --colegios 10 --aulas 15 --alumnos 40

Borra todas las tablas y las vuelve a crear. Todos los usuarios tienen la clave `clave-carga` (un solo hash argon2,
calculado una vez) y `debe_cambiar` en falso. Escribe carga/cuentas.json con usuarios y secciones.
"""
import argparse
import json
import os
import random
import secrets
from pathlib import Path

from sqlalchemy import insert

from app.config import _url_db
from app.db import Base, crear_motor, crear_tablas
from app.modelos import Alumno, Colegio, EstadoAlumno, ProfesorSeccion, Seccion, Usuario
from app.seguridad import hash_contrasena

CLAVE = "clave-carga"


def est_inventado(seudo: str, rng: random.Random) -> dict:
    """Un est de unos 15 a 20 kB, parecido al de un alumno con algunas semanas de uso."""
    cursos = ["fisica", "quimica", "aritmetica", "algebra", "geometria", "trigonometria", "rm", "rv"]
    dias = sorted({f"2026-{rng.randint(9, 11):02d}-{rng.randint(1, 28):02d}" for _ in range(40)})
    return {
        "alumno": seudo,
        "dias": dias,
        "vistas": {f"{rng.choice(cursos)}.unidad-{i}": {"fecha": dias[-1], "pasos": rng.randint(1, 20)} for i in range(60)},
        "practica": {f"modulo-{i}": {"hechos": rng.randint(0, 30), "aciertos": rng.randint(0, 20),
                                     "entrada": {"aciertos": 3, "total": 5, "fecha": dias[0]}} for i in range(25)},
        "pruebas": {c: {"entrada": {"aciertos": rng.randint(0, 12), "total": 12, "fecha": dias[0]}} for c in cursos},
        "repaso": {f"u{i}": {"hechos": 3, "aciertos": 2, "ultimo": dias[-1], "proximo": dias[-1], "caja": 2} for i in range(40)},
        "enCurso": {"modulo": "modulo-3", "respuestas": list(range(30))},
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--colegios", type=int, default=10)
    ap.add_argument("--aulas", type=int, default=15, help="aulas (secciones) por colegio")
    ap.add_argument("--alumnos", type=int, default=40, help="alumnos por aula")
    a = ap.parse_args()
    url = os.environ["DATABASE_URL"]
    assert "localhost" in url or "127.0.0.1" in url, "solo contra una base local"
    motor = crear_motor(_url_db(url))
    Base.metadata.drop_all(motor)
    crear_tablas(motor, Base)
    h = hash_contrasena(CLAVE)
    rng = random.Random(7)
    salida = {"clave": CLAVE, "aulas": []}
    with motor.begin() as cx:
        for ci in range(a.colegios):
            cid = cx.execute(insert(Colegio).values(nombre=f"IE Carga {ci}").returning(Colegio.id)).scalar_one()
            for si in range(a.aulas):
                sid = cx.execute(insert(Seccion).values(colegio_id=cid, grado=str(3 + si % 3), letra=f"S{si}")
                                 .returning(Seccion.id)).scalar_one()
                prof = f"p{ci}x{si}"
                pid = cx.execute(insert(Usuario).values(usuario=prof, hash=h, rol="profesor", nombre="Profe Carga",
                                                        debe_cambiar=False, activo=True, colegio_id=cid)
                                 .returning(Usuario.id)).scalar_one()
                cx.execute(insert(ProfesorSeccion).values(usuario_id=pid, seccion_id=sid))
                usuarios = [dict(usuario=f"a{ci}x{si}x{n}", hash=h, rol="alumno", nombre="Alumno Carga",
                                 debe_cambiar=False, activo=True, colegio_id=cid) for n in range(a.alumnos)]
                ids = cx.execute(insert(Usuario).returning(Usuario.id, sort_by_parameter_order=True), usuarios).scalars().all()
                alumnos, seudos = [], []
                for uid in ids:
                    s = "a" + secrets.token_hex(5)
                    seudos.append(s)
                    alumnos.append(dict(seudonimo=s, usuario_id=uid, colegio_id=cid, seccion_id=sid, apellidos="Carga",
                                        nombres=f"N{uid}", dni_cifrado="x", dni_huella=secrets.token_hex(32)))
                aids = cx.execute(insert(Alumno).returning(Alumno.id, sort_by_parameter_order=True), alumnos).scalars().all()
                cx.execute(insert(EstadoAlumno), [dict(alumno_id=i, est=est_inventado(s, rng)) for i, s in zip(aids, seudos)])
                salida["aulas"].append({"seccion": sid, "colegio": cid, "profesor": prof,
                                        "alumnos": [u["usuario"] for u in usuarios]})
    Path(__file__).with_name("cuentas.json").write_text(json.dumps(salida))
    n = a.colegios * a.aulas * a.alumnos
    print(f"{a.colegios} colegios, {a.colegios * a.aulas} aulas, {n} alumnos")


if __name__ == "__main__":
    main()
