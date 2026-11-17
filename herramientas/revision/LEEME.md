# Mesa de revisión (Gerson, 17 nov 2026)

Página aparte donde Gerson revisa cada cambio con su captura y responde **Va / No va / comentario** (y elige una
opción si la tarjeta trae pregunta). Existe porque el feedback se perdía entre miles de párrafos del chat. Toda sesión
que haga un cambio que Gerson tenga que ver lo sube aquí, no solo al chat.

- Artifact: **Mesa de revisión**, slug `e313c4e5-af5f-4290-980f-352c560c45ec`,
  https://claude.ai/artifact/V3M7w9d15gL5oxA2LCQkzF (privado de Gerson).
- Código: `herramientas/revision/index.html`. Imágenes: `herramientas/revision/img/` (no se versiona; viven en el
  artifact).

## Datos (capacidad `db` del artifact)

| Colección | Quién escribe | Campos |
| --- | --- | --- |
| `items/<id>` | Claude (regla: `write: admin`) | `orden`, `ronda`, `grupo` (curso o unidad), `sub` (idea), `tipo` (decisión, revisar, pregunta, corrección hecha), `titulo`, `que`, `porque`, `pregunta?`, `opciones?`, `recomendada?` (índice), `imgs: [{ src: 'img/x.webp', pie }]`, `atendido?` |
| `respuestas/<id del item>` | Gerson | `estado` ('ok', 'no' o null), `opcion` (índice), `comentario`, `en` (ISO) |
| `notas/<auto>` | Gerson | `texto`, `en`; Claude agrega `leida: true` al atenderla |

La página agrupa por `grupo` y `sub` y ordena por `orden`. Pestañas: Pendientes (sin respuesta), Respondidas (con
respuesta, sin `atendido`), Cerradas (con `atendido`).

## Cómo se usa desde una sesión

1. **Capturas**: `python3 herramientas/revision/imagen.py <captura.png> <nombre> …` deja `img/<nombre>.webp`.
2. **Publicar las imágenes**: `list_files` del artifact y después `publish_files` en modo patch con `index.html` (si
   cambió) y las imágenes nuevas como `img/<nombre>.webp`. Las que ya estaban se quedan.
3. **Tarjetas**: `db_write` con `set` en `items/<id>`; ids cortos con prefijo de unidad (`t-`, `q-`, `v-`, `f-`, `g-`
   general). Una tarjeta por decisión o por cosa que mirar, con lo que cambió, por qué y la captura. Si hay opciones,
   la primera suele ser la recomendada y se marca con `recomendada`.
4. **Leer lo que respondió**: `db_list` de `respuestas` y de `notas` (al empezar cada sesión y cuando Gerson diga que
   revisó). Su respuesta manda sobre lo que se decidió solo.
5. **Cerrar**: al aplicar una respuesta, `update` del item con `atendido: '<qué se hizo, en una línea>'` (necesita
   `ifVersion` de la última lectura). A una nota atendida, `leida: true`.

Un comentario que Gerson mande a Claude desde el artifact despierta la sesión que lo publicó; las respuestas en la base
de datos no despiertan a nadie: se leen.
