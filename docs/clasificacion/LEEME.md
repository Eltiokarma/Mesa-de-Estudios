# Compendios como mapa (decisión de Gerson, 8 nov 2026)

Gerson va a pasar, uno por uno, los compendios de academia con problemas tipo UNI (empezando por la serie Cuzcano). Son para los alumnos de 5.º de secundaria que postulan. Sirven para **aprender, reenfocar y proponer**: nunca se copia nada de ellos (regla 5 de `CLAUDE.md`).

## Qué se permite y qué no

- **Se permite:**
  - contar qué tipos de problema salen y cuánto;
  - ver cómo los ordena el libro por dificultad;
  - entender el método que enseña;
  - deducir las trampas a partir de sus alternativas y resoluciones;
  - registrar qué convenciones usa (por ejemplo, los triángulos de 37°/53°).

  Todo eso se escribe en abstracto, con palabras nuestras.
- **No se permite:** copiar enunciados, números, figuras, resoluciones ni textos a la app, a los generadores, al papel, al banco de pruebas ni a los documentos.
- **Los PDF** se guardan en `fuentes/libros/`, que no se versiona (`.gitignore`: `fuentes/**/*.pdf`). No se suben al repo ni a la app.

## El flujo, libro por libro

1. **Mapa.** Se escribe `docs/clasificacion/compendio-<tema>.md` con los tipos de problema, su frecuencia, el origen (CEPRE-UNI, examen), el método, las trampas y las convenciones.
2. **Comparación.** Se revisa contra la escena que ya existe en `plantillas/<id>/`: qué cubre, qué cubre a medias y qué falta, ordenado por frecuencia.
3. **Errores.** Las trampas se contrastan con los códigos de `docs/investigacion/`. Las que coinciden suman respaldo; las nuevas entran como hipótesis.
4. **Propuesta.**
   - La escena sube de versión con pasos o pestañas nuevas para los tipos frecuentes que faltan. Cada paso nuevo trae su predicción y sus distractores.
   - Los tipos paramétricos se vuelven un **generador** propio (`nucleo/predicciones.js`). La respuesta la calcula el motor y los distractores salen de errores típicos. Así se llega a miles de ejercicios propios y verificados.
5. Cada cambio de escena o generador sigue el método de siempre: casos verificados aparte, revisión, `npm test` en verde y Playwright.

## Compendios recibidos

| Libro | Tema | Mapa | Estado |
| --- | --- | --- | --- |
| Tarazona, *Análisis vectorial* (Cuzcano, 2005), dos PDF que cubren las 128 páginas | Vectores | `compendio-vectores.md` | Mapa hecho; vectores 0.2.0 y generadores en `rutina/vectores` |
