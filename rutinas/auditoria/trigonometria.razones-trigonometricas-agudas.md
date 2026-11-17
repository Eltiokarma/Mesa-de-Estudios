# Auditoría de contenido: «Razones trigonométricas de ángulos agudos» (trigonometria.razones-trigonometricas-agudas)

17 nov 2026. Auditor externo, sin editar la unidad. Contrato: `docs/plan-calidad.md` §3 (13 puntos) y §5. Formato:
`docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10. Decisiones: `docs/etapa2/decisiones.md`. Lo que ya
corrigió el lector en frío (`rutinas/frio/trigonometria.razones-trigonometricas-agudas.md`) no se repite.

**Qué se revisó.**
- `contenido/teoria/trigonometria/razones-trigonometricas-agudas.js`: las 5 ideas, los 75 ejemplos, «Ahora tú» con las
  semillas 0–399 y «Así se resuelve» con las semillas 0–11, el glosario y el laboratorio.
- La pieza `nucleo/kit/piezas/trig-objeto.js`.
- La práctica: `plantillas/razones-trig-agudas/` (generador, 17 tipos con 3 semillas cada uno, y `papel.json`) y lo que
  `plantillas/circunferencia-trig/` muestra en esta unidad (la escena y su papel).
- La app a 390 × 844: los 35 momentos, los 75 ejemplos, el glosario y el laboratorio.
- Capturas y scripts en el scratchpad de la sesión (`aud-trig/`): `cuentas.js`, `cuenta-ops.js`, `dump.js` y `gen-dump.js`.

**Cuentas.** Se rehicieron con un script propio que no usa el código de la unidad (`aud-trig/cuentas.js`): 100 de 100
cuadran.
- **Los 25 ejemplos de nivel 3.** Hechos con razones de verdad (`Math.sin`) o con la convención 3-4-5 y 7-24-25, según
  el caso. Las ecuaciones de cofunción y de recíprocas se resolvieron barriendo x, no despejando.
- **24 cuentas más de la teoría.** Ejemplos de nivel 1 y 2, los valores de las predicciones (0,42; 2,37; 36,87°;
  16,26°) y un reto del laboratorio.
- **51 problemas del generador**, 3 semillas por cada uno de los 17 tipos. Se recalcularon desde el enunciado o desde
  las entradas de `_datos`, nunca desde sus cuentas.

`node --test` del generador y de la pieza da verde. El validador de la teoría pasa para esta unidad: los 2 fallos de
`teoria.test.js` son de química, de otra sesión.

**Regla de colores.** La pide la consulta: el lado lleva el color de su nombre (CO naranja, CA turquesa, H en tinta).
Ya está escrita en el molde §5b, reescrito el 17 nov: «un color fijo por magnitud en cada unidad… en el juego, el eje,
la figura, la fórmula, los ejemplos **y la práctica**», con «una prueba que lo compruebe». La regla no se discute aquí.
Abajo va solo dónde la unidad no la cumple.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 4, 5 (regla 4; molde §5b) | `plantillas/razones-trig-agudas/generador.js:31` (comentario «Colores por papel»), `:235`, `:308`, `:444`, `:531`, `:640`, `:688`, `:710` | La práctica pinta por orden de dato, con la regla vieja. **lado-objeto y suma-nombres** (idea 1): la hipotenusa va en naranja, el color de CO en toda la teoría, y el cateto en turquesa. Es justo la idea donde la teoría deja las figuras en tinta para que el color no nombre el lado. **razon-lados**: el primer dato va en naranja y el segundo en turquesa, y la hipotenusa puede salir turquesa (`razon-lados#0`: tirante en turquesa, pared en naranja). **reconoce-angulo**: H en naranja. **lado-k y razon-figura**: el dato va siempre en naranja, aunque sea el adyacente («La sombra mide 12 m», adyacente a 37°, en naranja). Quien aprendió en la teoría «naranja = opuesto» lee mal el triángulo y cae justo en el distractor TR9, ANG-OTRO o NOT-CAMBIA. | Pintar como la teoría: el color sale del nombre del lado desde el ángulo de la figura (`desde(en)`), H sin color y lo que se pide con «?». En los tipos de la idea 1, todo en tinta. Borrar el comentario de la línea 31. |
| A2 | 4, 5 | `razones-trigonometricas-agudas.js:1243` (`casoReconoce`, «Ahora tú» tipo 1 de la idea 3) | La teoría también rompe su regla: `h: { color: 'i' }` deja la hipotenusa en turquesa, y el cateto dado va siempre en naranja. Con 60° y el dato en `ra` (el adyacente), la figura pinta el adyacente de naranja («opuesto») y la hipotenusa de turquesa («adyacente»). Si el alumno lee por color, sale 30°, la opción NOT-CAMBIA. | `lad.h` sin color; `[dado]` con `desde('a')` (ra turquesa, rb naranja). |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 4 (regla 4) | Ejemplos de la idea 3: «La tangente de 60°» (`:1100`) y «La escuadra de 20 cm» (`:1119`); captura `ej-notables-a.png` | La misma señal y la misma escuadra cambian de color de una tarjeta a otra. En el juego, «Lee», «Mira» y los ejemplos 1 y 8, la media base o el cateto corto van en naranja y la altura o el cateto largo en turquesa, desde 30°. En los ejemplos 3 y 5 van al revés, desde 60°, con los dos ángulos rotulados en la figura. Es el defecto Alta 1 del lector en frío (el mismo dibujo con los colores al revés), que volvió en otra idea. | Cuando la figura rotula los dos agudos, pintar siempre desde el de abajo (30°) y dejar que el texto nombre desde 60°. O rotular solo 60° en esas dos figuras. |
| M2 | 13 | `:1632-1645` (`casoRazonConv`, «Ahora tú» tipo 1 de la idea 4) | Pide sen 37°, cos 37°, sen 16° o cos 16°, y el recuadro Datos trae «sen 37° = 3/5 y cos 37° = 4/5…»: la respuesta está escrita en los datos. Pasa en 32 de los 133 casos de este tipo (semillas 0–399). El generador ya lo evita (`razonConvencion` solo pide 53°, 74°, tan 37° y tan 16°). | Copiar la lista del generador: `[[53,'sen'],[53,'cos'],[53,'tan'],[74,…],[37,'tan'],[16,'tan']]`. |
| M3 | 13 | Ejemplos de la idea 4: «¿Cuánto mide de verdad?» (`:1493`) y «¿Cuánto vale k?» (`:1501`) | En el primero, el dato «Con calculadora: el ángulo de tangente 0,2917 mide 16,26°» trae la respuesta (16,26°). En el segundo, el dato «La hipotenusa es el lado mayor: 5k» es el paso hecho: el único paso del problema es ver que la hipotenusa es 5k. | Primero: dar una tabla corta (tan 16° ≈ 0,2867; tan 16,26° ≈ 0,2917; tan 16,5° ≈ 0,2962) o pedir otra cosa. Segundo: dato «Hipotenusa: el lado frente al ángulo recto, el más largo», sin «5k». |
| M4 | Regla 3; 4e | Idea 2, `mision.bien` (`:875`); idea 5, `juega.leyenda` (`:2121`) | El juego dice lo que mide la predicción, antes de que el alumno la conteste. En la idea 2, el mensaje de logro dice «Mismo θ, mismo cociente», que es la respuesta de la predicción («¿cuál cociente es mayor?»). En la idea 5, la leyenda dice «poste: opuesto a θ, adyacente a α», que es el paso clave de cos α = sen θ, y la última tarjeta de «Lee» pregunta eso mismo. | Idea 2: «Listo: 6 ÷ 8 = 1,5 ÷ 2 = 0,75». Idea 5: «naranja: el poste, opuesto a θ», y que «Mira» diga lo de α. |
| M5 | 9, 3 | `:2267`, `:2278` (`ver: ['co-razón']`); regla y datos de la idea 5 («cofunciones») | La palabra central de la idea 5 no es un término de esta unidad. «cofunción» y «cofunciones» abren la entrada `co-razón` de `reduccion-al-primer-cuadrante`, una unidad posterior: «Pareja de una razón… Aparece al reducir con 90° o 270°». No tiene `simple` ni 3 ejemplos, y habla de 270° en una unidad de ángulos agudos. | Término local «cofunción» en esta unidad, con `simple` («la razón del otro ángulo agudo: el seno de uno es el coseno del otro») y 3 ejemplos. Que la idea 5 lo estrene. |
| M6 | 9; molde §7 | `app/practica.js:165` (`gen.generar(…, { unidad })`) frente a `generador.js:948` (`opciones.idea`) | La práctica no va por idea. El generador sabe separar por idea (`IDEAS`, `{ idea }`), pero la app no le pasa la idea y sortea una de las cinco. Quien acaba de terminar la idea 1 recibe cot, sec, csc (idea 5) y 37° o 16° (idea 4) con probabilidad 2/5. | Pasar `{ idea }` según el avance (la última idea terminada o «hasta la idea k»). Mientras tanto, abrir la práctica solo con las cinco ideas terminadas. |
| M7 | 9; molde §7 | `catalogo/cursos/trigonometria.json:59` (`plantillas: ["razones-trig-agudas", "circunferencia-trig"]`) | La pantalla Ejercicios de la unidad trae la escena `circunferencia-trig` completa y su papel de 10 problemas, sin filtro por unidad. Los problemas 3 y 5 a 10 son de unidades posteriores: elevación, reducción, ángulos negativos, gráficas, ecuaciones y radianes («x en [0, 2π⟩»). Su indicación trae otra convención («Convención de academia: sen 37° = 3/5 y sen 53° = 4/5») y la escena tiene paleta propia (θ en violeta). La propuesta aprobada la mandaba a «Más mesas del tema». | Sacar `circunferencia-trig` de `plantillas` de esta unidad, o filtrar su papel por unidad (los problemas 1, 2 y 4) y abrir la escena en la pestaña de razones. |
| M8 | 10 | `:1237` (`HIP_REC.rampa` con 30°, 45° y 60°); `generador.js:516` (igual); ejemplo «La rampa del colegio» (`:1186`, 30°) | Salen rampas imposibles: «La rampa mide 4 m y la base, 2 m» da una rampa de 60° (`reconoce-angulo#0`), y «La rampa del colegio» sube a 30°. Una rampa de colegio tiene pocos grados, y una de 45° o 60° es una pared. | Sacar la rampa de `HIP_REC` (dejar escalera y poste). En el ejemplo, usar una escalera o un tobogán de 30°. |
| M9 | Niveles (molde §3) | Idea 3: «Con 2θ y 3θ» (`:1169`) y «Una fracción de notables» (`:1178`). Idea 2: «Dado el seno» (`:704`) y «Un seno con decimales» (`:732`). Papel: `papel.json` p7 | **Idea 3:** dos de los cinco ejemplos de nivel 3 son reemplazar y sumar (1/2 + 1; √3/2 + √3/2), más fáciles que «Un seno al cuadrado» de nivel 2. **Idea 2:** tres de los cinco ejemplos de nivel 3 son «dada una razón, halla otra», y dos de ellos son la misma cuenta (sen → CA por Pitágoras → tan). **Papel:** p7 «avanzado» es 2 cos 30° + sen 60°. | **Idea 3:** cambiar los dos por un notable escondido en una figura (la altura de la señal en un problema de alturas) o por una expresión con un dato que hay que despejar. **Idea 2:** cambiar «Un seno con decimales» por un triángulo escondido en una semicircunferencia, el caso de San Marcos 2019-II. **Papel:** cambiar p7 por un `expresion-notable` con θ. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 5 (regla 4) | `:505` («Mira» de la idea 1, paso 2) | `ecuacion: ['H = ', dO('5 m')]`: la hipotenusa, en naranja. La figura la tiene en tinta. | `'H = 5 m'` sin color. |
| B2 | 5 (regla 4) | `:1131` («Una suma de notables»); `:1367` («Mira» de la idea 3, paso 4) | «cos 60° = 1/2» con el 1 en naranja. Desde 60° ese cateto es el adyacente, y la regla de la unidad dice «cos = CA/H» en turquesa. | `ad('1')` en los dos lugares. |
| B3 | 5 | `:1562`, `:1571`; `generador.js:688` | En el trapecio, DA va en naranja y CD en turquesa. La propia unidad dice que «los lados de otras figuras de examen que no son del triángulo van en tinta», y el CO de verdad es CH, punteado en tinta. | DA y CD en tinta; CH en naranja. |
| B4 | 5 (molde §5b nuevo) | Toda la unidad (`dF`/`res`); sin prueba de colores | El molde reescrito dice «la respuesta lleva el color de su magnitud» y pide «una prueba que lo compruebe». Aquí toda respuesta va en violeta, también los lados («La escalera llega a 3 m», que es CO), y ninguna prueba compara los colores de la figura con el nombre de cada lado. | Que Gerson diga si la respuesta-lado va en el color de su nombre o en violeta. Agregar la prueba de colores (ver «Reglas»). |
| B5 | Opciones (molde §2) | Teoría, «Ahora tú»: idea 5 tipo 3 (`casoComplemento`), idea 5 tipos 1 y 2, idea 2 tipo 2 (`:829-839`), idea 3 tan 45° y tan 30° | Hay casos con menos de 4 opciones. `casoComplemento` sale siempre con 3: `noinv` repite a `mismo` o al dato. `casoCofEcu` y `casoRecEcu` salen con 3 en 56 de cada 100 casos y con **2** en 4 de 400 («Si sen(3x) = cos(2x)…»). El cuadrado con M sale siempre con 3, porque su distractor ANG-OTRO repite la correcta (A) o a MEDIO-ENTERO (M). El generador ya exige 4 distintas. | Agregar distractores como los del generador (PIT-LINEAL, COMP-SIN-FIJOS) y que el validador exija 4 opciones en 400 semillas. |
| B6 | 13 | `generador.js:858` (`complemento`) | Con «tan θ = a/b» y pregunta cot(90° − θ), la respuesta es el dato. COMP-DATO se descarta y queda copiar el dato (1 de cada 12 problemas de este tipo). | Excluir el par (tan, cot). |
| B7 | Notación (decisiones) | Teoría `DA.c37` (`:1441`): «…, por convención del examen». Generador `D.c37`: «(convención del examen)». Papel de `circunferencia-trig`: «Convención de academia». Ejemplo «La tangente de 37°» (`:1468-1470`) | Hay tres formas de escribir la convención. Las decisiones piden una sola en toda la app. Además, el ejemplo 1 de la idea 4 escribe «tan 37° = 0,75» y «= 3/4», sin «por convención», en la misma idea que enseña que 37° no es exacto. | Una constante común (`nucleo/convencion.js`) con la forma decidida. En el ejemplo, «tan 37° = 3/4, por convención». |
| B8 | 13 | Ejemplos de la idea 4 «El terreno en trapecio» y «Cercar el trapecio» (`:1564`, `:1573`); idea 5 «Una condición de examen» (`:1974`) | El resuelto usa «AH mide lo mismo que DC», que no está en los datos (el generador sí lo trae en `D.trap`). En la idea 5, tan 45° sale de `DN.t45` sin la definición de la tangente (`DR.razones`). | Usar `D.trap` del generador; agregar `DR.razones`. |
| B9 | 9, 3 | Laboratorio: «tres-razones» (`:2335`, `:2348`, `:2352`), «semejantes» (`:2380`), «complemento-libre» (`:2398`) | La consigna dice «Arrastra el vértice B», pero `tri()` no rotula vértices (`nombres` falso). Las mesas de la idea 2 usan 45° («θ = 45°»), «Con 30°… media hipotenusa» y «lados enteros, distinto del 3-4-5», que llegan en las ideas 3 y 4. | «Arrastra la punta del triángulo». Pasar esos retos a una mesa de la idea 3 o 4, o decirlos sin el notable. |
| B10 | 13 (pendiente de Vectores, M21) | `papel.json` (p1–p8) | «Datos:» y «Alternativas:» siguen dentro del párrafo del enunciado. El arreglo está fuera de la unidad (`herramientas/papel-generador.js`). | El que propuso la auditoría de Vectores. |

## Lo que está bien y hay que copiar al molde

- **Cuentas exactas y sin errores.** 100 de 100 rehechas aparte. La aritmética de raíces (`Ex`: a + b√2 + c√3 + d√6,
  racionalizada) da las respuestas y los distractores sin decimales ni redondeos que se cuelen. Cada constante de
  ejemplos dice qué cuentas se revisaron.
- **Distractores que salen de un cálculo.** `NOT_MAL` y `MAL` (cambia, largo, inversa, noInvierte, pareja/cruza) aplican
  un error real a toda la expresión. Así cada opción incorrecta es exactamente el valor que da ese error, no un número
  inventado.
- **Elegir entre fórmulas.**
  - `reciproca-x` y `casoRecEcu` traen las cofunciones y las recíprocas juntas; el distractor REC-COMPLEMENTO mide si el
    alumno eligió bien.
  - «Ahora tú» de la idea 5 de la teoría trae las dos tablas.
- **El generador cuida los datos mejor que la teoría.**
  - `razonConvencion` nunca pide lo que trae el dato (ver M2).
  - `D.trap` dice el rectángulo AHCD entero.
  - `D.k` es una herramienta, no el paso.
- **La idea 1 en tinta.** En los ejercicios donde se practica nombrar, la figura no se pinta: el color no hace el
  trabajo del alumno. Es la excepción correcta a la regla de colores y conviene escribirla en el molde.
- **Un lado con dos nombres.** `ESC345` con `texto2` y `color2` muestra en el mismo dibujo «CO de θ = 4 m» y «CA de α»:
  el lado no cambia de color, cambia de nombre. Es el dibujo de la idea 1 y de la cofunción.
- **Honestidad con 37°.** «≈» en la teoría, el transportador que redondea, 36,87° revelado al comprobar y la condición
  de la regla que explica por qué los ejercicios escriben «=».
- **Lo que se pide no se pinta.** «?» en tinta en las figuras de Predice y de los ejemplos (altura de la señal, sombra
  del primo, rayo): ninguna figura delata la respuesta.
- **El juego del primo con su sombra.** Dos triángulos semejantes de verdad, en el mismo dibujo, a la misma hora: es el
  objeto reconocible y la comparación lado a lado del punto 4.

## Reglas que faltan en el contrato o en el validador

| Regla | ¿Automática? |
|---|---|
| **Prueba del mapa de colores** (el molde §5b la pide y nadie la tiene). La unidad declara su mapa (`colores: { co: 'o', ca: 'i', h: null }`). Para cada figura de `trig-objeto` en la teoría, los ejemplos y el generador (400 semillas), la prueba calcula desde el ángulo rotulado cuál lado es CO, CA y H y compara su color. Habría encontrado A1, A2, B1 y B3. | Sí |
| **La misma figura no cambia de colores**: si una figura rotula los dos agudos, declara desde cuál se pinta (`colorDesde`), y un mismo objeto (señal, escuadra) usa el mismo en toda la unidad (M1). | Sí |
| **La respuesta no está en los datos**: el texto de la opción correcta (o su número) no aparece en una línea de `datos` con el mismo argumento («cos 37° = 4/5» y la respuesta 4/5 a «cos 37°»). En 400 semillas y en los 75 ejemplos. Habría encontrado M2 y M3 (16,26°). | Sí (heurística por texto y número) |
| **Cuatro opciones distintas** en todo «Ahora tú» de `calidad: 2`, en 400 semillas (B5). | Sí |
| **Un término del glosario que la idea usa en su regla pertenece a esta unidad o a su `requiere`** (M5: «cofunción» de reducción al primer cuadrante). | Sí, con el glosario global y `requiere` |
| **Práctica por idea**: si el generador exporta `IDEAS`, la app pasa `{ idea }` (M6); y una plantilla que sirve a varias unidades declara `tiposPorUnidad` o no va en `plantillas` de una unidad `calidad: 2` (M7). | Sí |
| **Rangos creíbles por objeto**: una tabla (rampa ≤ 15°, escalera de 60° a 80°, poste ≤ 15 m…) contra la que se prueban las figuras de la teoría y del generador (M8). | Sí |
| **Una sola forma de la convención** en toda la app: una constante en `nucleo/convencion.js` y una prueba que rechace «convención de academia» o «, por convención» (B7). | Sí |
| **El juego no anticipa la predicción**: ni `mision.bien` ni la `leyenda` enuncian la relación que la predicción mide (M4). | No (lector en frío o auditor) |
| **Los niveles suben**: los ejemplos de nivel 3 tienen más pasos que los de nivel 2 (contar pasos de `solucion` y tipos de operación) (M9). | Semi (contar pasos avisa; que sea de examen, no) |

## Correcciones (17 nov)

Alcance: la teoría (`contenido/teoria/trigonometria/razones-trigonometricas-agudas.js`, con su glosario y su
laboratorio), la pieza `nucleo/kit/piezas/trig-objeto.js` y su prueba, `plantillas/razones-trig-agudas/` y la ficha de
`circunferencia-trig` en esta unidad. No se tocó `app/` ni `nucleo/teoria.js`. Lo que corrigió el lector en frío se
conserva. Pruebas: el validador de la teoría pasa para la unidad; `razones-trigonometricas-agudas.test.js` (nueva, 7
pruebas), `trig-objeto.test.js` (8) y `generador.test.js` (33) en verde; `npm run catalogo` y `npm test` (9302 pruebas:
una sola falla, `quimica/materia-y-energia.js`, de otra sesión que trabaja en paralelo). Recálculo aparte, sin el código
de la unidad (scratchpad `corr2/verif.py`, python3 -I con math): 897 casos de «Ahora tú» cuadran (las dos formas nuevas
de la idea 1 con la geometría del dibujo, las ecuaciones barriendo x, las expresiones con los ángulos de verdad, el
complemento y la convención) y los ejemplos nuevos (12/5; 40√3 ≈ 69,28 y 1600√3 ≈ 2771; 4√3/3 ≈ 2,309; 30° y 6√3 ≈ 10,39;
2 sen² 45° + tan 60° · cos 30° = 5/2; la tabla de tangentes de 16°), el caso 6 de `casos.json` (asin(4√2/8) = 45°) y el
papel p7 y p8 (3/2 y 5/4). Capturas a 390 px: scratchpad `cap/` (momentos, ejemplos y laboratorio) y `cap/practica-*.png`
(tres problemas de práctica: el cable con 45°, cos θ de una escalera y el trapecio con 53°).

**Prueba de colores (la regla que faltaba).** La pieza sabe qué es cada lado desde el ángulo de la figura
(`trig-objeto.papeles`: desde θ si está; si marca un solo agudo, desde ese; si marca los dos, desde el de abajo, y en la
señal desde la punta de 30°) y qué colores toma cada lado (`coloresDe`). La prueba de la unidad recorre las 2000 y tantas
figuras (Lee, el juego en toda su grilla, Predice, Mira, ejemplos, «Así se resuelve» y «Ahora tú» en 400 semillas) y la
del generador 400 semillas y 40 por tipo: fallan si un lado lleva otro color que el de su nombre (CO naranja, CA
turquesa, H y lados fuera del triángulo en tinta, nunca violeta), si un ejercicio de la idea 1 lleva color, si un dato en
color del texto no es el lado de ese color en la figura o si una razón dada va en color. Se comprobó que fallan con el
error de A2 y con el de la cartulina de A1 puestos de vuelta.

| # | Qué se hizo |
|---|---|
| A1 | El generador pinta por el nombre del lado: variables `co` (naranja) y `ca` (turquesa) en el texto y el mismo color en la figura; la hipotenusa, los lados fuera del triángulo (AD y CD del trapecio, AB del cuadrado) y las razones dadas (otra-razon, complemento) en tinta; la idea 1 (vertices, lado-objeto, suma-nombres) entera en tinta. Comentario de cabecera reescrito. |
| A2 | `casoReconoce`: hipotenusa en tinta y el cateto dado con el color de su nombre desde θ. |
| M1 | La señal y la escuadra se pintan siempre desde 30° (media naranja, altura turquesa; corto naranja, largo turquesa): «La tangente de 60°» y «La escuadra de 20 cm» cambiaron de colores, y su resuelto dice el nombre desde 60° («la altura, turquesa, queda enfrente: es el opuesto»). Prueba propia. |
| M2 | `casoRazonConv` usa la lista del generador (53°, 74°, tan 37°, tan 16°). Prueba en 400 semillas: los datos nunca traen «razón = respuesta» de lo que se pide. |
| M3 | «¿Cuánto mide de verdad?»: los datos son una tabla de calculadora (tan 16°, 16,26° y 16,5°) y el alumno elige. «¿Cuánto vale k?»: el dato es la definición de hipotenusa, sin «5k». La misma prueba revisa los 75 ejemplos («mide …», lados en partes). |
| M4 | Idea 2: el logro dice «Listo: 6 ÷ 8 = 1,5 ÷ 2 = 0,75.», sin «mismo θ, mismo cociente». Idea 5: la leyenda dice «naranja: el cateto opuesto a θ»; lo de α queda en «Mira». |
| M5 | «cofunción», término propio de la unidad (`local`, con `simple` y 3 ejemplos), estrenado en la idea 5; `glosarioSin: ['co-razón']` y los «ver» apuntan a «cofunción». Para no pasar de cuatro palabras en el Resumen, «ángulos complementarios» quedó sin `simple` (viene de geometría y «Lee» lo presenta). |
| M6 | Pendiente (fuera de alcance): ver abajo. |
| M7 | `circunferencia-trig` sale de esta unidad: del catálogo y de su `plantilla.json`. Sus otras seis unidades siguen igual. `nucleo/repaso-tipos.js`: sus problemas de papel p1, p2, p4 y p10, que apuntaban a esta unidad, quedan fuera del repaso (una línea; sin eso la prueba del repaso fallaba). |
| M8 | Sin rampas imposibles: la rampa sale de `HIP_REC` en la teoría y la práctica, y la escalera solo va con 45° o 60°. «La rampa del colegio» (30°) pasó a «El cable del poste de luz» (cable de 12 m y poste de 6 m: 30° y la estaca a unos 10,4 m). |
| M9 | Idea 3: «Con 2θ y 3θ» y «Una fracción de notables» pasaron a «La lámina de la señal» (altura y área de una señal de 80 cm, con la media señal ×40) y «Halla x con notables» (x · cos 30° = tan 60° · sen 60° + sen 30°, x = 4√3/3). Idea 2: «Un seno con decimales» pasó a «El triángulo en la semicircunferencia» (diámetro 13, AC = 5, tan θ = 12/5), con la forma nueva `semicirculo` en la pieza. Papel: p7 es ahora una expresión con múltiplos de θ (si θ = 30°, cos 2θ + tan 2θ · tan θ). |
| B1 | «H = 5 m» en tinta. |
| B2 | No se cambió: con M1, el 1 de la media señal es naranja en la figura (su línea), y la regla de la unidad dice que un número lleva el color de su línea; pintarlo turquesa al leerlo desde 60° haría que el mismo lado cambie de color. Lo decide Gerson (ver abajo). |
| B3 | Trapecio (teoría y práctica): AD y CD en tinta, CH en naranja sin rótulo. |
| B4 | La prueba de colores está hecha (arriba). La respuesta sigue en violeta: lo decide Gerson. |
| B5 | Cuatro opciones siempre, con prueba en 400 semillas: la idea 1 pide el par (opuesto y adyacente) en objetos y en triángulos de examen; las ecuaciones de la idea 5 exigen tres errores enteros y distintos (COMP-SIN-FIJOS, REC-SIN-FIJOS); `casoComplemento` toma los errores de la práctica; tan 30°, 45° y 60° suman NOT-CAMBIA, TAN-H y el coseno; el cuadrado con M suma TAN-H y TR7; se cambió una expresión simétrica; y un envoltorio rehace el caso si dos errores coinciden por los números. |
| B6 | El generador ya no pide cot(90° − θ) con tan θ dada (pide sec). |
| B7 | Una sola forma en la unidad y su práctica: «sen 37° = 3/5 y cos 37° = 4/5 (convención del examen)», la de las decisiones, con el paréntesis sin partirse. «La tangente de 37°» dice que usa la convención. |
| B8 | Los dos trapecios llevan «AHCD es un rectángulo: CH mide igual que AD, y AH igual que DC.»; «Una condición de examen» lleva las razones. |
| B9 | Las consignas del laboratorio nombran lo que se ve («la punta de arriba del triángulo»; en «complemento-libre», B rotulado) y los retos de la idea 2 ya no usan 45°, 30° ni el 3-4-5. |
| B10 | Pendiente (fuera de alcance): `herramientas/papel-generador.js`. |

**Pendiente, y por qué.**
- **M6, práctica por idea** (`app/`): `app/practica.js` debe pasar `{ idea }` al generador (que ya lo acepta) según el
  avance de la teoría, por ejemplo la última idea terminada o un sorteo entre las ideas terminadas. Mientras tanto, la
  práctica sortea entre las cinco ideas.
- **Para Gerson:** (1) B2 y M1: con la señal y la escuadra pintadas siempre desde 30°, en los ejemplos que preguntan desde
  60° el cociente queda «turquesa sobre naranja» (tan 60° = 30√3/30), al revés que «CO/CA» en los datos; el texto lo
  dice con palabras. La otra opción (pintar desde 60° en esos ejemplos) hace que la misma señal cambie de colores.
  (2) B4: si la respuesta que es un lado va en el color de su nombre o en violeta. (3) El molde, §11, fila de
  trigonometría, todavía dice «los lados por papel (dato, dato, lo que se pide)»: conviene escribir ahí la regla de la
  unidad (el lado lleva el color de su nombre; la idea donde se practica nombrar, en tinta).
- **La convención en el resto de la app** (otros generadores y escenas dicen «convención de academia»): fuera de esta
  unidad; la constante común en `nucleo/convencion.js` queda propuesta.
- **Rampas de la teoría y la práctica** con 16° a 28° (ternas 1,2-0,5-1,3 y 1,5-0,8-1,7): no son imposibles, pero son
  empinadas para una rampa de vereda; no se cambiaron.
- **B10**: el arreglo de `herramientas/papel-generador.js` es el de la auditoría de Vectores.
