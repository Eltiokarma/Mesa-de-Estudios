#!/usr/bin/env python3
"""Pasada de tono (13 nov 2026, pedido de Gerson): la retroalimentación de un error no reta al alumno.

Quita de las escenas (plantillas/*/index.html):
  - el arranque «Elegiste la X.» / «Elegiste la opción X.» (la opción elegida ya está marcada en pantalla);
  - el cierre «La correcta está marcada.» (también se ve: la correcta queda en verde);
  - las frases «Esta opción es una hipótesis nuestra…» / «Hipótesis nuestra: …» (eso va en docs/investigacion/);
  - el rojo del texto del error (.fb.mal / .msg.mal): el texto va en tinta; el borde de la opción sigue diciendo el estado.
Lo que queda es la explicación misma. Regla en docs/escena-viva.md (§3, regla 10).

Uso: python3 -I herramientas/pasada-tono.py [--revisar]   (--revisar solo cuenta, no escribe)
"""
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ARRANQUE = re.compile(r"Elegiste la (?:opción )?(?:[A-E]|[1-9]|\$\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})(?: \(\$\{[^{}]*\}\))?[.:][ \t]?")
CIERRE = re.compile(r"[ \t]?La correcta está marcada\.?")
# Metadatos de investigación dentro de lo que lee el alumno (regla 8 del contrato): van a docs/investigacion/.
INVESTIGACION = re.compile(r"[ \t]?(?:Esta opción es una hipótesis nuestra[^.'`]*\.|Hipótesis nuestra: [^.'`]*\."
                           r"|Según [A-ZÁÉÍÓÚÇ][^.'`<]{0,80}\([0-9]{4}\)[^.'`<]*\.|Es una idea documentada[^.'`<]*\."
                           r"|Son errores que suponemos[^.'`<]*\.|El objetivo más difícil del test[^.'`<]*\.)")
# Cualquier otra frase que cite un estudio «(Autor, año)» o diga «hipótesis nuestra», fuera de los párrafos .fuente
# (esos se conservan para el profesor y pegatina.css los oculta al alumno). La frase se quita entera.
FRASE_INVESTIGACION = re.compile(
    r"(?:(?<=[.!?] )|(?<=['`>]))[^.!?'`<>]*?(?:hipótesis nuestra|\([A-ZÁÉÍÓÚÇ][^()'`<>]{0,60},? (?:19|20)[0-9]{2}\))[^.!?'`<>]*[.!?]\)?[ \t]?")
ROJO = [(".fb.mal{color:var(--warn)}", ".fb.mal{color:inherit}"), (".msg.mal{color:var(--warn)}", ".msg.mal{color:inherit}")]


def pasar(texto):
    n = 0
    texto, k = ARRANQUE.subn("", texto); n += k
    texto, k = CIERRE.subn("", texto); n += k
    texto, k = INVESTIGACION.subn("", texto); n += k
    lineas = texto.split("\n")
    for i, l in enumerate(lineas):
        if "fuente" not in l:
            lineas[i], k = FRASE_INVESTIGACION.subn("", l); n += k
    texto = "\n".join(lineas)
    for a, b in ROJO:
        n += texto.count(a)
        texto = texto.replace(a, b)
    return texto, n


def main():
    revisar = "--revisar" in sys.argv
    total = archivos = 0
    for f in sorted(RAIZ.glob("plantillas/*/index.html")):
        viejo = f.read_text(encoding="utf-8")
        nuevo, n = pasar(viejo)
        if n:
            archivos += 1; total += n
            if not revisar:
                f.write_text(nuevo, encoding="utf-8")
    print(f"{'Por cambiar' if revisar else 'Cambiados'}: {total} tramos en {archivos} escenas")
    quedan = [str(f.relative_to(RAIZ)) for f in RAIZ.glob("plantillas/*/index.html") if "Elegiste" in f.read_text(encoding="utf-8")]
    if quedan:
        print("Quedan «Elegiste» para revisar a mano en:", ", ".join(sorted(quedan)))


if __name__ == "__main__":
    main()
