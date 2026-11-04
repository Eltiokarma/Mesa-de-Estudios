#!/bin/bash
# OCR de un PDF escaneado: una imagen por página, tesseract en español.
# Uso: herramientas/ocr_pdf.sh <archivo.pdf> <carpeta_salida>
# Deja <salida>/<periodo>/<nombre>/p-NN.txt y completo.txt. Necesita poppler-utils
# y tesseract-ocr con el paquete de español (apt-get install tesseract-ocr tesseract-ocr-spa).
# Para muchos PDF en paralelo: ls *.pdf | tr '\n' '\0' | xargs -0 -P4 -I{} herramientas/ocr_pdf.sh {} salida
f="$1"; out="$2"
base=$(basename "$f" .pdf); per=$(basename "$(dirname "$f")")
d="$out/$per/$base"; mkdir -p "$d"
[ -f "$d/completo.txt" ] && exit 0
pdftoppm -r 200 -gray -png "$f" "$d/p"
for img in "$d"/p-*.png; do
  OMP_THREAD_LIMIT=1 tesseract "$img" "${img%.png}" -l spa >/dev/null 2>&1
  rm -f "$img"
done
while IFS= read -r t; do echo "=== $(basename "$t" .txt) ==="; cat "$t"; done < <(ls "$d"/p-*.txt | sort -V) > "$d/completo.txt"
echo "listo: $per/$base"
