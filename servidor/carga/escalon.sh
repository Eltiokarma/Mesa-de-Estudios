#!/usr/bin/env bash
# Corre un escalón: base limpia de eventos, servidor nuevo, generador, monitor y verificación.
#   bash carga/escalon.sh <alumnos> <carpeta> [args extra del generador]
# Variables: WORKERS (1), CPUS_SRV (0-2), CPUS_GEN (3), UVICORN_EXTRA.
set -euo pipefail
cd "$(dirname "$0")/.."
N=$1; OUT=$2; shift 2
mkdir -p "$OUT"
DB=postgresql://carga:carga@localhost/carga
psql "$DB" -qc "truncate eventos, renovaciones, intentos_fallidos restart identity" -c "vacuum analyze" >/dev/null
PGPID=$(head -1 /var/run/postgresql/16-main.pid)
taskset -a -cp "${CPUS_SRV:-0-2}" "$PGPID" >/dev/null
DATABASE_URL=$DB taskset -c "${CPUS_SRV:-0-2}" .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 \
  --workers "${WORKERS:-1}" --log-level warning ${UVICORN_EXTRA:-} > "$OUT/servidor-$N.log" 2>&1 &
SRV=$!
for i in $(seq 60); do curl -sf http://127.0.0.1:8000/api/salud >/dev/null && break; sleep 0.5; done
taskset -c "${CPUS_GEN:-3}" .venv/bin/python -m carga.carga --alumnos "$N" --salida "$OUT/r-$N.json" "$@" > "$OUT/gen-$N.txt" 2>&1 &
GEN=$!
.venv/bin/python -m carga.monitor --servidor $SRV --generador $GEN --salida "$OUT/m-$N.json" &
MON=$!
wait $GEN || true
kill $MON; wait $MON || true
.venv/bin/python -m carga.verificar "$OUT/r-$N.json" "$DB" > "$OUT/v-$N.json"
# Un servidor trabado no termina con SIGTERM (espera las peticiones colgadas): a los 15 s, SIGKILL.
kill $SRV; for i in $(seq 30); do kill -0 $SRV 2>/dev/null || break; sleep 0.5; done
kill -9 $SRV 2>/dev/null || true; pkill -9 -f "uvicorn app.main:app --host 127.0.0.1 --port 8000" 2>/dev/null || true
.venv/bin/python -m carga.resumir "$OUT" "$N"
