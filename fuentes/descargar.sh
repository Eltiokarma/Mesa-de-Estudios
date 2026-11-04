#!/bin/bash
# Vuelve a bajar a fuentes/ los PDF de Google Drive listados en fuentes/drive.tsv.
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
    curl -sSL --max-time 600 -o "$f" "https://drive.usercontent.google.com/download?id=$id&export=download&confirm=t" || sleep $((2**t))
  done
  if [ "$(stat -c %s "$f" 2>/dev/null)" = "$tam" ]; then ok=$((ok+1)); else mal=$((mal+1)); echo "FALLA: $f"; fi
done < drive.tsv
echo "Descargados y verificados: $ok. Fallas: $mal."
