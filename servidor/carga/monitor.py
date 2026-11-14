"""Muestrea cada 2 s CPU y memoria del servidor, de PostgreSQL y del generador, y las conexiones a PostgreSQL.

    python -m carga.monitor --servidor <pid> --generador <pid> --salida m.json   (se corta con SIGTERM)
"""
import argparse
import json
import signal
import time

import psutil
import psycopg


def arbol(pid):
    try:
        p = psutil.Process(pid)
        return [p] + p.children(recursive=True)
    except psutil.NoSuchProcess:
        return []


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--servidor", type=int, required=True)
    ap.add_argument("--generador", type=int, default=0)
    ap.add_argument("--db", default="postgresql://carga:carga@localhost/carga")
    ap.add_argument("--salida", required=True)
    a = ap.parse_args()
    corriendo = [True]
    signal.signal(signal.SIGTERM, lambda *_: corriendo.__setitem__(0, False))
    cx = psycopg.connect(a.db, autocommit=True)
    vistos = {}

    def cpu(procs):
        tot = 0.0
        for p in procs:
            try:
                if p.pid not in vistos:
                    vistos[p.pid] = p
                    p.cpu_percent(None)
                tot += vistos[p.pid].cpu_percent(None)
            except psutil.NoSuchProcess:
                pass
        return tot

    def rss(procs):
        tot = 0
        for p in procs:
            try:
                tot += p.memory_info().rss
            except psutil.NoSuchProcess:
                pass
        return tot / 2**20

    muestras = []
    while corriendo[0]:
        srv = arbol(a.servidor)
        pg = [p for p in psutil.process_iter(["name"]) if p.info["name"] and p.info["name"].startswith("postgres")]
        gen = arbol(a.generador) if a.generador else []
        filas = cx.execute("select coalesce(state,'?'), count(*) from pg_stat_activity where datname='carga' "
                           "and pid <> pg_backend_pid() group by 1").fetchall()
        muestras.append({"t": time.time(), "cpu_servidor": cpu(srv), "rss_servidor_mb": rss(srv),
                         "cpu_postgres": cpu(pg), "cpu_generador": cpu(gen), "cpu_total": psutil.cpu_percent(None),
                         "pg": dict(filas)})
        time.sleep(2)
    def resumen(k):
        xs = [x[k] for x in muestras[1:]] or [0]
        return {"media": round(sum(xs) / len(xs), 1), "max": round(max(xs), 1)}
    conex = [sum(x["pg"].values()) for x in muestras] or [0]
    activas = [x["pg"].get("active", 0) for x in muestras] or [0]
    out = {k: resumen(k) for k in ("cpu_servidor", "rss_servidor_mb", "cpu_postgres", "cpu_generador", "cpu_total")}
    out["pg_conexiones_max"], out["pg_activas_max"] = max(conex), max(activas)
    out["muestras"] = muestras
    json.dump(out, open(a.salida, "w"))


if __name__ == "__main__":
    main()
