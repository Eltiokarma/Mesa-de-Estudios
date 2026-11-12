# Rutina verbal-mas: reporte

12 de noviembre de 2026 · Rama `rutina/verbal-mas`, creada desde `claude/awesome-wozniak-5etl1n`. No abrí PR, no subí `VERSION` de `app/sw.js` y no hice commit de `app/datos/`.

**Encargo:** más práctica de lectura (un tercio del examen de San Marcos): unos 30 pares A/B y unos 15 textos en inglés con preguntas en inglés.

**Resultado:** **30 pares A/B nuevos** (t134 a t163, 150 preguntas) y **10 textos en inglés** (t164 a t173, 50 preguntas). Todos están revisados a ciegas y entraron a su índice. `textos-dialecticos` pasa de 21 a 51 pares y `lectura-ingles` de 14 a 24 textos.

**Lo que no hice:** 5 de los 15 textos en inglés. Me detuve en 10 para no pasarme del tope de 40 dólares: cada tanda (constructor más revisor) cuesta varios dólares, y preferí no arriesgar la última.

## Qué hay

### Pares A/B (`textos-dialecticos`)

| Tanda | Ids | Temas | A ciegas |
| --- | --- | --- | --- |
| 1 | t134–t138 | repartidores de aplicativos, friaje y escuela, antibióticos sin receta, puerto de Chancay, ciclovías | 39/39 |
| 2 | t139–t143 | agua de Lima (desalinizar o reducir pérdidas), inglés desde inicial, kioscos escolares, comercio ambulatorio, electricidad rural | 36/36 |
| 3 | t144–t148 | uniforme escolar, reconocimiento facial, cine y streaming, paiche en las cochas, horas de educación física | 38/38 |
| 4 | t149–t153 | videojuegos, cobro por bolsas, vacuna contra el VPH, bonos de carbono, examen de admisión en quechua o aimara | 34/34 |
| 5 | t154–t158 | semana de cuatro días, IA en radiografías, mercado y supermercado, gratuidad o becas, datos abiertos | 40/40 |
| 6 | t159–t163 | redes sociales para menores, desconexión digital, drones y saber campesino, mujeres en ciencia, turismo en Cusco | 40/40 |

- **Dificultad:** 7 pares de nivel 1, 12 de nivel 2 y 11 de nivel 3.
- **Postura de los autores:** unos debaten de frente y en otros el B concede algo al A o lo complementa, por ejemplo en Chancay, el paiche, el mercado y los drones.
- **Tipos de pregunta (150):**

  | Tipo | Preguntas |
  | --- | --- |
  | Sentido contextual | 30 |
  | Controversia | 20 |
  | Extrapolación | 19 |
  | Síntesis | 15 |
  | Incompatibilidad | 14 |
  | Compatibilidad | 12 |
  | Diálogo | 11 |
  | Coincidencia | 11 |
  | Postura | 10 |
  | Discrepancia | 7 |
  | Inferencia | 1 |

  Esto cierra el hueco del reporte de verbal A/B. Antes había pocas preguntas de extrapolación (3), síntesis (2), incompatibilidad (2) y compatibilidad (1).
- **Previos `atribuir` (77):** 18 con la clave A, 20 con B, 24 con ambos y 15 con ninguno.

### Inglés (`lectura-ingles`)

| Tanda | Ids | Textos | A ciegas |
| --- | --- | --- | --- |
| 7 | t164–t168 | aviso de simulacro de sismo (Arequipa), atrapanieblas en Lima, carta de una estudiante de intercambio en Juliaca, blog sobre nadar con delfines rosados, artículo de enciclopedia sobre el Qhapaq Ñan | 30/30 |
| 8 | t169–t173 | aviso de clases de inglés en Puno, noticia de cacao y chocolate, reseña de una app de buses (inventada), la rana del Titicaca, columna sobre las tareas de fin de semana | 31/31 |

Los géneros son variados, como en el examen: aviso, divulgación, carta, blog, enciclopedia, noticia, reseña y columna. Las 50 preguntas van en inglés:

| Tipo | Preguntas |
| --- | --- |
| Extrapolación | 8 |
| Incompatibilidad | 8 |
| Contexto (dónde se publicaría, a quién va) | 6 |
| Dato | 6 |
| Sentido contextual | 6 |
| Propósito | 5 |
| Antónimo | 5 |
| Título | 4 |
| Inferencia | 2 |

## Cómo se hizo

- **Tandas de 5:** un constructor y un revisor, los dos subagentes, por tanda. Las tandas 1 a 3 las escribió un modelo más caro y de la 4 en adelante uno más económico, para cuidar el tope.
- **Brief común:** el de los constructores está en `rutinas/verbal-mas/brief-constructor.md` y el de los revisores en `brief-revisor.md`.
- **Revisión a ciegas:**
  - `rutinas/verbal-mas/ciego.js` quita las claves y baraja las alternativas, y `comparar.js` compara las respuestas del revisor con la clave. Están en la rama las versiones a ciegas, las claves y las respuestas de cada tanda.
  - **El revisor coincidió en el 100 %**: 288 de 288 respuestas entre preguntas y previos.
  - Cada duda fuerte se trató como fallo y el ítem se reescribió en la fase 2, con el mismo revisor y las claves a la vista. Así se corrigieron, entre otros:
    - el eje de t137 y de t145;
    - las sondas de varios previos, para que la idea quede explícita en quien la sostiene y, si es «ambos», en los dos textos;
    - las palabras de sentido contextual de t136 (REGALAR pasó a DISPENSAR) y t147;
    - los distractores de «no se sabe» en las incompatibilidades en inglés, que ahora son afirmaciones compatibles con el texto.
- **Hechos:** se verificaron en la web los que se pudo, y cada `revision.notas` dice qué se confirmó con fuente y qué quedó de memoria. Correcciones:
  - **t140:** la política de inglés es el D. S. 012-2015-MINEDU, no el 007.
  - **t143:** se ablandó la vida útil de las baterías, porque no se halló en IRENA 2017.
  - **t147:** se quitó que las poblaciones de paiche se hayan recuperado.
  - **t150:** se ablandó cómo se cobra hoy por las bolsas.
  - **t158:** SEACE y OSCE, que hoy es OECE con la Ley 32069.
  - **t168:** «más de 30 000 km» pasó a «miles de kilómetros».

## Pruebas

- **`npm test`:** 7730 en verde y **1 en rojo esperado**, «app/datos/catalogo.json está al día». Pasa en cuanto la integración corra `npm run catalogo`: lo comprobé armándolo en local y devolviendo `app/datos/` a como estaba. Cada commit de tanda se probó en un worktree limpio, sin los borradores de las tandas que seguían en curso.
- **`herramientas/alternativas.test.js`:** en verde. En todo el banco de lectura, la correcta es la más larga, sola, en el 14 % de las preguntas. En las 200 nuevas, en 25 (12,5 %).
- **Papel:** regenerado con `node herramientas/papel-lectura.js`.
- **Núcleo:** no cambié nada de `nucleo/` ni de `app/`. Los textos usan el formato de la sección 5.8 tal cual.

## Para la integración

1. `npm run catalogo`. No hace falta subir `VERSION` por la cáscara, porque no cambió, pero el catálogo y los bancos sí cambiaron, así que conviene subirla para que el `sw.js` sirva los textos nuevos.
2. En `CLAUDE.md` y `docs/pendientes.md`: textos dialécticos con 51 pares y lectura en inglés con 24 textos.

## Lo que queda

- **5 textos en inglés** para llegar a los 15 pedidos.
- **Códigos en las incompatibilidades:** ahí los distractores compatibles con el texto llevan RV8, RV10 o RV34, porque no hay un código propio para «es compatible, no incompatible». Si se quiere medir ese error aparte, haría falta un código nuevo en el informe.
- **Hechos de memoria** (anotados en cada `revision.notas`): conviene una pasada con las fuentes abiertas antes del piloto. Algunos hosts (elperuano.pe, whc.unesco.org, es.wikipedia.org) no están permitidos en la red de la sesión.
- **Dificultad real:** que el revisor acierte todo dice que la clave es única, no que los ítems sean difíciles. Hay que mirar los datos del piloto.
- **Formato de los JSON:** algunos revisores guardaron los JSON con sangría completa en lugar del estilo compacto. El contenido está bien; solo cambia cómo se ve el diff.
