# Rutina rm-procesos: pausa (8 nov 2026, límite de uso)

- **Terminado:** figura SVG opcional en el formato «predicciones» (commit propio). `rm-deduccion` verificado a ciegas (15/15), revisado y corregido; ya está en el catálogo, el CSV (3 filas en «si») y `docs/investigacion/codigos-rm-procesos.md`.
- **A medias (WIP, sin verificación final):** 14 generadores `rm-*`. Verificados a ciegas y por corregir: planteo y diofánticas. Corregidos, pero falta volver a verificar los casos que cambiaron: trasvases y movimientos. En revisión: flujo y ciclos. Sin verificar: certezas, cortes, balanzas, rumbos, lectura-palabras y relojes. Los de parentesco, arreglos y fichas no llegaron a crearse. Ninguno está en el catálogo ni en el CSV.
- **Paso en que iba:** mandar las correcciones a planteo y diofánticas (hallazgos en la conversación) y lanzar los verificadores ciegos de C y D. Scripts en el scratchpad: `entradas-gen.js`, `pw-gen.js`, `csv-cubrir.py` e `integrar.py`.
- **Ojo:** `npm test` falla mientras haya carpetas `rm-*` fuera del catálogo, y además `app/datos/catalogo.json` no se regenera (lo hace la integración).
