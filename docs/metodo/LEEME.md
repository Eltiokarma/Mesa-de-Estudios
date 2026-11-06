# Método para construir plantillas con subagentes

Así se construyeron las plantillas del 6 de noviembre de 2026. Cada plantilla pasa por cuatro manos:

1. **Constructor** (subagente): recibe `brief-plantilla.md` más el encargo concreto (id de la carpeta, informe de `docs/investigacion/`, contenido mínimo, unidades del catálogo). No toca `catalogo/`, `app/` ni `docs/`, y no hace commit.
2. **Verificador independiente** (subagente): `brief-verificador.md` con PLANTILLA y CABECERA (la última línea del comentario de cabecera de `motor.js`). Antes, la conversación principal arma las entradas sin respuestas: `python3 docs/metodo/entradas.py <plantilla> <carpeta temporal>/<plantilla>-entradas.json`. Recalcula sin leer el motor ni `casos.json` y propone el texto de `"verificacion"`, que pega la conversación principal.
3. **Revisor de contenido** (subagente): `brief-revisor.md` con PLANTILLA e INFORME, más lo que convenga mirar con cuidado en esa escena. Entrega hallazgos por gravedad.
4. **Correcciones**: se le mandan al mismo constructor (SendMessage), con decisiones tomadas donde el revisor ofrece opciones.

Después, la conversación principal integra: agrega la plantilla a las unidades de `catalogo/cursos/*.json`, corre `npm run catalogo`, sube `VERSION` en `app/sw.js`, agrega los colores a `docs/diseno.md`, actualiza `docs/pendientes.md`, la hoja de ruta y `CLAUDE.md`, corre `npm test` y hace un commit por plantilla.

Si al entrar una plantilla un curso llega a 4 plantillas o más, la prueba del banco exige máximo 2 ítems de entrada y salida por plantilla: hay que rebalancear `catalogo/pruebas/<curso>.json`.

`paleta.py` tiene las funciones para medir colores (CIEDE2000 y contraste).
