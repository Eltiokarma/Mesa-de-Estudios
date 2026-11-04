#!/bin/bash
# Vuelve a bajar a fuentes/ los PDF listados en fuentes/drive.tsv (ID de Google Drive o dirección web directa).
# Los PDF no se suben a GitHub (.gitignore), así que en una sesión nueva hay que
# correr esto: bash fuentes/descargar.sh
# Verifica el tamaño de cada archivo y reintenta hasta 4 veces.
cd "$(dirname "$0")" || exit 1
ok=0; mal=0
while IFS=$'\t' read -r dir id tam nom; do
  case "$dir" in \#*|"") continue;; esac
  mkdir -p "$dir"; f="$dir/$nom"
  for t in 1 2 3 4; do
    [ -f "$f" ] && [ "$(stat -c %s "$f")" = "$tam" ] && break
    case "$id" in
      http*) url="$id" ;;  # dirección directa
      *) url="https://drive.usercontent.google.com/download?id=$id&export=download&confirm=t" ;;  # ID de Google Drive
    esac
    curl -sSL -A "Mozilla/5.0" --max-time 600 -o "$f" "$url" || sleep $((2**t))
  done
  if [ "$(stat -c %s "$f" 2>/dev/null)" = "$tam" ]; then ok=$((ok+1)); else mal=$((mal+1)); echo "FALLA: $f"; fi
done < drive.tsv
echo "Descargados y verificados: $ok. Fallas: $mal."
