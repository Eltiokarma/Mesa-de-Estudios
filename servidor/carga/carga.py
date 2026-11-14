"""Generador de carga para el servidor de cuentas (docs/carga.md). Solo contra un servidor LOCAL.

    python -m carga.carga --url http://127.0.0.1:8000 --alumnos 1000 --duracion 300 --rampa 120 --salida r.json

Cada alumno virtual imita a nucleo/sesion.js: login (con reintentos de persona: hasta 5, cada 10 s), GET /api/estado
y un turno de sincronización cada 30 s: POST /api/eventos en tandas de 500 (de 1 a 50 eventos nuevos por turno; el 10 %
vuelve de estar sin conexión con 500 a 1200 eventos guardados), PUT /api/estado si cambió (80 %) y GET /api/estado.
Un fallo de red se repite una vez al instante (solo eventos y estado); un turno fallido se reintenta con espera
creciente (2, 4, 8 s… hasta 300 s). Una vez por alumno, en un momento al azar, POST /api/renovar (lo que pasa a los
15 minutos). Un 401 renueva y repite una vez. Un profesor por aula lee el avance de su sección cada 60 s.

Las aulas empiezan repartidas al azar en los primeros `--rampa` segundos y los 40 alumnos de cada aula entran dentro
de un mismo minuto. Al terminar `--duracion`, cada alumno sigue intentando subir lo que le falte hasta `--vaciado` s.
"""
import argparse
import asyncio
import json
import random
import time
from collections import defaultdict
from pathlib import Path

import aiohttp

TANDA, CADA, ESPERA_MIN, ESPERA_MAX = 500, 30, 2, 300


class Medidas:
    def __init__(self):
        self.lat = defaultdict(list)       # ruta -> [segundos] de las respuestas 2xx
        self.res = defaultdict(lambda: defaultdict(int))  # ruta -> resultado -> n
        self.alumnos = {}                  # seudónimo -> {generados, confirmados, pendientes}
        self.login_fallido = 0
        self.login_seg = []                # desde que el alumno intenta entrar hasta que entra
        self.inflight = 0
        self.max_inflight = 0

    def anotar(self, ruta, resultado, seg):
        self.res[ruta][resultado] += 1
        if isinstance(resultado, int) and resultado < 400:
            self.lat[ruta].append(seg)


class ErrorRed(Exception):
    def __init__(self, tipo):
        self.tipo = tipo


class Cliente:
    def __init__(self, http, url, m: Medidas):
        self.http, self.url, self.m = http, url, m
        self.acceso = self.renovacion = None

    async def _red(self, metodo, ruta, cuerpo, etiqueta):
        h = {"Authorization": "Bearer " + self.acceso} if self.acceso else {}
        t0 = time.perf_counter()
        self.m.inflight += 1
        self.m.max_inflight = max(self.m.max_inflight, self.m.inflight)
        try:
            async with self.http.request(metodo, self.url + ruta, json=cuerpo, headers=h) as r:
                cuerpo_r = await r.read()
                self.m.anotar(etiqueta, r.status, time.perf_counter() - t0)
                try:
                    datos = json.loads(cuerpo_r) if cuerpo_r else None
                except ValueError:  # un 500 de Starlette viene en texto plano
                    datos = None
                return r.status, datos
        except asyncio.TimeoutError:
            self.m.anotar(etiqueta, "timeout", time.perf_counter() - t0)
            raise ErrorRed("timeout")
        except aiohttp.ClientConnectorError:
            self.m.anotar(etiqueta, "rechazada", time.perf_counter() - t0)
            raise ErrorRed("rechazada")
        except (aiohttp.ClientError, ConnectionError) as e:
            self.m.anotar(etiqueta, "cortada", time.perf_counter() - t0)
            raise ErrorRed(type(e).__name__)
        finally:
            self.m.inflight -= 1

    async def red(self, metodo, ruta, cuerpo=None, etiqueta=None, repetible=False):
        etiqueta = etiqueta or f"{metodo} {ruta}"
        try:
            return await self._red(metodo, ruta, cuerpo, etiqueta)
        except ErrorRed:
            if not repetible:
                raise
            return await self._red(metodo, ruta, cuerpo, etiqueta)

    async def login(self, usuario, clave):
        st, d = await self.red("POST", "/api/login", {"usuario": usuario, "contrasena": clave})
        if st == 200:
            self.acceso, self.renovacion = d["acceso"], d["renovacion"]
            return d
        return None

    async def renovar(self):
        st, d = await self.red("POST", "/api/renovar", {"renovacion": self.renovacion})
        if st != 200:
            raise ErrorRed(f"renovar-{st}")
        self.acceso, self.renovacion = d["acceso"], d["renovacion"]

    async def pedir(self, metodo, ruta, cuerpo=None, etiqueta=None):
        repetible = ruta in ("/api/eventos", "/api/estado") or metodo == "GET"
        st, d = await self.red(metodo, ruta, cuerpo, etiqueta, repetible)
        if st == 401:
            await self.renovar()
            st, d = await self.red(metodo, ruta, cuerpo, etiqueta, repetible)
        if st >= 400:
            raise ErrorRed(f"http-{st}")
        return d


def evento(seudo, n, rng):
    return {"t": str(10**12 + n), "alumno": seudo, "tipo": rng.choice(["prediccion", "paso", "prueba", "practica"]),
            "modulo": rng.choice(["mruv", "gases", "vectores", "fracciones"]), "paso": rng.randint(1, 20),
            "opcion": rng.choice("ABCDE"), "correcta": rng.random() < 0.5, "ms": rng.randint(500, 60000)}


async def alumno(cfg, http, m: Medidas, usuario, clave, inicio, fin, vaciado, rng):
    await asyncio.sleep(max(0, inicio - time.monotonic()))
    c = Cliente(http, cfg.url, m)
    t0 = time.monotonic()
    d = None
    for intento in range(5):
        try:
            d = await c.login(usuario, clave)
        except ErrorRed:
            d = None
        if d:
            break
        await asyncio.sleep(10)
    if not d:
        m.login_fallido += 1
        return
    m.login_seg.append(time.monotonic() - t0)
    seudo = d["usuario"]["alumno"]
    reg = m.alumnos[seudo] = {"generados": 0, "confirmados": 0, "pendientes": 0}
    est = None
    try:
        est = (await c.pedir("GET", "/api/estado"))["est"]
    except ErrorRed:
        pass
    cola, n = [], 0
    if rng.random() < 0.10:  # volvió la conexión con lo que guardó sin señal
        for _ in range(rng.randint(500, 1200)):
            cola.append(evento(seudo, n, rng)); n += 1
    renovar_en = time.monotonic() + rng.uniform(0.2, 0.9) * (fin - time.monotonic())
    renovado = False
    fallos = 0
    await asyncio.sleep(rng.uniform(0, CADA))
    while True:
        ahora = time.monotonic()
        if ahora < fin:
            for _ in range(rng.randint(1, 50)):
                cola.append(evento(seudo, n, rng)); n += 1
        elif not cola or ahora > fin + vaciado:
            break
        try:
            if not renovado and ahora >= renovar_en:
                await c.renovar()
                renovado = True
            while cola:
                tanda = cola[:TANDA]
                await c.pedir("POST", "/api/eventos", {"eventos": tanda})
                del cola[:len(tanda)]
                reg["confirmados"] += len(tanda)
            if ahora < fin:
                if rng.random() < 0.8 or est is None:
                    if est is None:
                        est = {"alumno": seudo}
                    est = dict(est)
                    est.setdefault("vistas", {})[f"carga.unidad-{rng.randint(0, 300)}"] = {"pasos": rng.randint(1, 9)}
                    est["salidaHabilitada"], est["solucionesHabilitadas"] = [], []
                    est = (await c.pedir("PUT", "/api/estado", {"est": est}))["est"]
                est = (await c.pedir("GET", "/api/estado"))["est"]
            fallos = 0
            espera = CADA
        except ErrorRed:
            fallos += 1
            espera = min(ESPERA_MAX, ESPERA_MIN * 2 ** max(0, fallos - 1))
        if time.monotonic() >= fin and not cola:
            break
        await asyncio.sleep(espera if time.monotonic() < fin else min(espera, 5))
    reg["generados"], reg["pendientes"] = n, len(cola)


async def profesor(cfg, http, m, usuario, clave, seccion, inicio, fin):
    await asyncio.sleep(max(0, inicio - time.monotonic()))
    c = Cliente(http, cfg.url, m)
    try:
        if not await c.login(usuario, clave):
            return
    except ErrorRed:
        return
    while time.monotonic() < fin:
        try:
            await c.pedir("GET", f"/api/secciones/{seccion}/avance", etiqueta="GET /api/secciones/{id}/avance")
        except ErrorRed:
            pass
        await asyncio.sleep(60)


def pct(xs, p):
    if not xs:
        return None
    xs = sorted(xs)
    return xs[min(len(xs) - 1, int(p / 100 * len(xs)))]


async def principal(cfg):
    cuentas = json.loads(Path(cfg.cuentas).read_text())
    rng = random.Random(cfg.semilla)
    necesarias = -(-cfg.alumnos // 40)
    aulas = cuentas["aulas"][cfg.desde_aula:cfg.desde_aula + necesarias]
    assert len(aulas) * 40 >= cfg.alumnos, "faltan cuentas sembradas"
    m = Medidas()
    con = aiohttp.TCPConnector(limit=0, force_close=False, keepalive_timeout=30)
    tiempo = aiohttp.ClientTimeout(total=cfg.timeout)
    t_ini = time.monotonic()
    fin = t_ini + cfg.rampa + 60 + cfg.duracion
    tareas, quedan = [], cfg.alumnos
    async with aiohttp.ClientSession(connector=con, timeout=tiempo) as http:
        for a in aulas:
            t_aula = t_ini + rng.uniform(0, cfg.rampa)
            for u in a["alumnos"][:min(40, quedan)]:
                tareas.append(alumno(cfg, http, m, u, cuentas["clave"], t_aula + rng.uniform(0, 60), fin, cfg.vaciado,
                                     random.Random(rng.random())))
            quedan -= min(40, quedan)
            if cfg.profesores:
                tareas.append(profesor(cfg, http, m, a["profesor"], cuentas["clave"], a["seccion"], t_aula + 90, fin))
        await asyncio.gather(*tareas)
    total = time.monotonic() - t_ini
    rutas = {}
    for ruta in sorted(set(m.res) | set(m.lat)):
        lat = m.lat[ruta]
        rutas[ruta] = {"n": sum(m.res[ruta].values()), "resultados": dict(m.res[ruta]),
                       "p50_ms": round(1000 * pct(lat, 50), 1) if lat else None,
                       "p95_ms": round(1000 * pct(lat, 95), 1) if lat else None,
                       "p99_ms": round(1000 * pct(lat, 99), 1) if lat else None,
                       "max_ms": round(1000 * max(lat), 1) if lat else None}
    out = {"alumnos": cfg.alumnos, "duracion_s": round(total), "rutas": rutas, "login_fallido": m.login_fallido,
           "login_espera_p50_s": round(pct(m.login_seg, 50), 2) if m.login_seg else None,
           "login_espera_p95_s": round(pct(m.login_seg, 95), 2) if m.login_seg else None,
           "login_espera_max_s": round(max(m.login_seg), 2) if m.login_seg else None,
           "max_en_vuelo": m.max_inflight,
           "eventos_generados": sum(a["generados"] for a in m.alumnos.values()),
           "eventos_confirmados": sum(a["confirmados"] for a in m.alumnos.values()),
           "eventos_pendientes": sum(a["pendientes"] for a in m.alumnos.values()),
           "por_alumno": m.alumnos}
    Path(cfg.salida).write_text(json.dumps(out, indent=1))
    resumen = {k: v for k, v in out.items() if k != "por_alumno"}
    print(json.dumps(resumen, indent=1))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://127.0.0.1:8000")
    ap.add_argument("--cuentas", default=str(Path(__file__).with_name("cuentas.json")))
    ap.add_argument("--alumnos", type=int, required=True)
    ap.add_argument("--desde-aula", type=int, default=0)
    ap.add_argument("--duracion", type=int, default=300, help="segundos de uso después de la rampa y el minuto de entrada")
    ap.add_argument("--rampa", type=int, default=120)
    ap.add_argument("--vaciado", type=int, default=180)
    ap.add_argument("--timeout", type=int, default=60)
    ap.add_argument("--profesores", type=int, default=1)
    ap.add_argument("--semilla", type=int, default=1)
    ap.add_argument("--salida", required=True)
    cfg = ap.parse_args()
    assert "127.0.0.1" in cfg.url or "localhost" in cfg.url, "solo contra un servidor local"
    asyncio.run(principal(cfg))


if __name__ == "__main__":
    main()
