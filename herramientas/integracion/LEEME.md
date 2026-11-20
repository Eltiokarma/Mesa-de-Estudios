# Integrar una unidad cuando los agentes comparten archivos

Varios agentes escriben a la vez y dejan sus bloques en los mismos archivos compartidos. Para hacer un commit por
unidad, la sesión arma un worktree desde HEAD, copia los archivos propios de la unidad y, de los compartidos, solo el
bloque de esa unidad. Estas ayudas hacen esa copia (MAIN es el árbol principal y WT el worktree):

- `verblk.py MAIN WT clave1,clave2`: copia los verificadores de esas claves (y su comentario) de
  `catalogo/pruebas/verificar.js`; los pone después de la entrada anterior, como en MAIN.
- `avblk.py MAIN WT unidad "marca de la prueba"`: copia la entrada de la unidad en `REHECHAS_E6`
  (`nucleo/avance.js`) y su prueba de `nucleo/avance.test.js` (desde el comentario que contiene la marca hasta `});`).
- `bloque.py MAIN WT INICIO [FIN|TEST]`: copia un bloque genérico, delimitado por una línea de inicio.

Después de cada copia, comprobar que el archivo carga: `node -e "require('./catalogo/pruebas/verificar.js')"`, y
mirar `git diff --stat`. Si una ayuda falla por un ancla repetida, copiar el bloque a mano. El resto del método está en
`docs/pendientes.md` («Integración»).
