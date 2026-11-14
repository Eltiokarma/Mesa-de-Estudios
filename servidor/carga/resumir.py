"""Imprime una fila de resumen de un escalón (generador + monitor + verificación)."""
import json
import sys

d, n = sys.argv[1], sys.argv[2]
r = json.load(open(f"{d}/r-{n}.json"))
m = json.load(open(f"{d}/m-{n}.json"))
v = json.load(open(f"{d}/v-{n}.json"))
log = open(f"{d}/servidor-{n}.log").read()
print(f"== {n} alumnos ({r['duracion_s']} s) ==")
for ruta, x in r["rutas"].items():
    malos = {k: c for k, c in x["resultados"].items() if not (k.isdigit() and int(k) < 400)}
    print(f"{ruta:38s} n={x['n']:6d} p50={x['p50_ms']} p95={x['p95_ms']} p99={x['p99_ms']} max={x['max_ms']} | estable p50={x.get('estable_p50_ms')} p95={x.get('estable_p95_ms')} p99={x.get('estable_p99_ms')} | errores={malos}")
print("login: fallidos", r["login_fallido"], "espera p50/p95/max s", r["login_espera_p50_s"], r["login_espera_p95_s"], r["login_espera_max_s"])
print("verificación:", v)
print("monitor:", {k: m[k] for k in m if k != "muestras"})
print("en el log: QueuePool", log.count("QueuePool limit"), "| Traceback", log.count("Traceback"),
      "| too many clients", log.count("too many clients"))
