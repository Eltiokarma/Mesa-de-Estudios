# Propuesta de ideas: «Lógica y conjuntos» (`algebra.logica-y-conjuntos`)

Etapa 3 del plan de calidad · fase 1 (`docs/metodo/unidad/1-ideas.md` §A) · 17 nov 2026

Gerson: esto es solo la propuesta. No se escribe nada hasta que la apruebes o la corrijas. Las preguntas que solo tú
puedes contestar están al final (sección 9), cada una con mi recomendación. Las tres que más pesan son la 1, la 2 y la 3.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` (§3 y §7), `docs/molde-unidad.md` entero (con §5b del 17 nov),
`docs/etapa2/decisiones.md` con sus «Cambios posteriores», las tres propuestas de la Etapa 2 como modelo, la teoría
actual (`contenido/teoria/algebra/logica-y-conjuntos.js`), su ficha en `catalogo/cursos/algebra.json`, las dos
plantillas que la cubren (`plantillas/logica/` y `plantillas/conjuntos/`: ficha, motor, casos y papel), la matriz
`docs/teoria/matriz/algebra.json`, `docs/temario-completo.md`, las preguntas de San Marcos de
`docs/datos/admision-unmsm.csv`, `docs/clasificacion-unmsm-admision.md`, `rutinas/teoria-algebra.md` (de ahí salen los
códigos TAL-) y, para comparar, las unidades gemelas de aritmética (`aritmetica.logica-proposicional` y
`aritmetica.conjuntos`) y de razonamiento matemático (`ordenamiento-de-informacion`). El nivel lo tomé de `vectores.js`,
`razones-trigonometricas-agudas.js`, `materia-y-energia.js` y `tema-e-idea-principal.js`.

**No hay informe de errores de lógica ni de conjuntos.** `docs/investigacion/algebra-funciones-ideas-erroneas.md` no
trata estos temas, y ningún otro informe tampoco (solo RMP71, hipótesis, en `codigos-rm-procesos.md`). Los TAL- de esta
unidad y los AT- de aritmética son hipótesis de diseño. Por eso **todos los distractores de abajo son hipótesis**
(pregunta 7).

---

## Qué se pregunta en los exámenes

**San Marcos no pregunta esta unidad: pregunta la de aritmética.** De 50 exámenes (2019-I a 2027-I), ninguna pregunta se
clasificó en `algebra.logica-y-conjuntos` (`docs/clasificacion-unmsm-admision.md` la pone en «lo que no hace falta
construir para San Marcos»). Las mismas preguntas están en `aritmetica.logica-proposicional` (5) y `aritmetica.conjuntos`
(8). Son exactamente los temas de esta unidad, así que las cito:

| Periodo | Unidad del CSV | Qué piden | Trampa anotada |
| --- | --- | --- | --- |
| 2019-I | conjuntos | Venn de tres actividades: cuántos hacen una sola | Restar una vez a los de las tres y no corregir las dobles |
| 2020-I | lógica | Simbolizar un argumento verbal que se sabe falso y deducir cada valor | Creer que de un antecedente falso sale la negación del consecuente |
| 2021 | lógica | Una proposición verbal se sabe verdadera: deducir los valores de otras | — |
| 2021 | conjuntos | Conjuntos encajados con datos por sexo: plantear regiones | — |
| 2021 | conjuntos | Simplificar una expresión de conjuntos con inclusión y disjunción | — |
| 2021 | conjuntos | Carroll con porcentajes periódicos (sexo y síntoma) | — |
| 2023-I | lógica | Condicional verbal con disyunción exclusiva, que se sabe falso | — |
| 2023-I | conjuntos | Venn de tres conductas: cuántos no tienen ninguna | — |
| 2023-I | conjuntos | Carroll: profesiones excluyentes y una característica: cuántos sin ninguna | — |
| 2025-I | conjuntos | Carroll: residentes por sexo, estudio y trabajo | — |
| 2026-I | lógica | Simbolizar con condicional y disyunción y simplificar con leyes lógicas | Leer «ya que» al revés |
| 2026-I | lógica | Clasificar tres enunciados en tautología, contradicción o contingencia | Leer «ya que» o «puesto que» en el orden escrito |
| 2027-I | conjuntos | Carroll: alumnos por sexo y aprobación de dos cursos | — |

En corto: **contar por regiones (Venn de tres y Carroll) es lo que más sale** (8 de 13), después los valores de verdad
deducidos de una proposición que se sabe falsa o verdadera, y las leyes lógicas. Los juegos lógicos (orden, parentesco,
certezas) San Marcos los pone en razonamiento matemático: deductivo 32, certezas 30, ordenamiento 21.

**UNI:** el catálogo pone la unidad en las semanas 1, 2 y 18 del CEPRE-UNI, pero `docs/taxonomia-uni-2026.md` solo trae
física y química; no tengo el sílabo de matemática y no afirmo qué pide cada semana. **Banco Cuzcano:** 0 fichas de esta
unidad; las gemelas de aritmética tienen unas 103 (lógica: valores de verdad 29, leyes 19, inferencia 13) y 105
(conjuntos: Venn de tres 34, Venn de dos 11, leyes 10, Carroll 10). Esas sirven para saber qué se practica.

---

## 0. Diagnóstico de la teoría actual contra el contrato

`logica-y-conjuntos.js` (v0.2.0, sin `calidad: 2`) tiene 6 ideas (`condicional`, `equivalencias`, `operaciones`,
`potencia`, `cuantificadores`, `certezas`) y 3 mesas de laboratorio con retos.

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Cuatro abren con una tabla de verdad (`alg-tabla`), una con un
   Venn de los números 1 a 9 y otra con una recta numérica. Juliaca, la feria de Puno y el aula solo aparecen escritos en
   las tarjetas de «Lee».
2. **Puntos 2, 3 y 12:** no hay `mision`, `leyenda`, `aprendizaje` ni `actividad`. Las consignas describen controles
   («Elige el valor de p y de q, y un conector», «Elige una propiedad y un dominio»).
3. **Punto 7:** varias lecturas separan dos cosas con «·» («A ∪ B = {…} · el 4 entra», «V en 4 de 4 filas ·
   tautología»), y un paso de «Mira» encadena «F → V = V · F → F = V»: el molde lo prohíbe.
4. **Punto 9:**
   - La idea 1 estrena en una sola tarjeta de «Lee» la proposición y los cuatro conectores, y su juego ya usa ∨ y ↔ sin
     haberlos visto. El signo ~ aparece recién en la tercera tarjeta de la idea 2.
   - `potencia` pide en «Ahora tú» contar una unión, n(A ∪ B), que es de `operaciones`; su regla mezcla las dos cosas.
   - `cuantificadores` escribe P(x) para la propiedad, y P(A) es el conjunto potencia de la idea anterior.
5. **Punto 13:** ningún ejercicio trae `datos`. «Así se resuelve» es el mismo generador que «Ahora tú» con la semilla
   + 900 (el molde pide que no se repita).
6. **«Ahora tú» no llega a examen:** todo es con dos letras y dos conjuntos. Falta lo que San Marcos pregunta: tres
   letras, la proposición que se sabe falsa, simbolizar frases («ya que»), simplificar con leyes, clasificar en
   tautología, contradicción o contingencia (la palabra «contingencia» no está en la unidad), Venn de tres y Carroll.
7. **Colores (§5b):** V va en verde y F en carmín, uno al lado del otro en todas las tablas: rojo–verde da 0,038 en
   deuteranopía. El carmín es de los ángulos, el resultado no va en violeta y «cumple» también es verde. Las dos
   escenas tienen paletas propias (la de conjuntos usa fucsia para la intersección).
8. **Repite otras unidades.** `aritmetica.logica-proposicional` tiene una idea `condicional` con **el mismo título**
   («El condicional solo falla una vez»), y `aritmetica.conjuntos` repite operaciones, conteo y potencia. La idea
   `certezas` (fila de cuatro amigos y parentescos) es lo que enseñan `razonamiento-matematico.ordenamiento-de-informacion`
   (`orden-lineal`) y `razonamiento-deductivo` (parentesco). Ver preguntas 1 y 2.
9. Detalles: el glosario tiene 23 términos, ninguno con `simple` y casi todos con 0 o 1 ejemplo (el contrato pide 3); la
   cabecera dice «3.º de secundaria» y la ficha, `grado: 3`; la prueba de entrada y salida de álgebra no tiene ningún
   ítem de esta unidad.

Lo que sirve y se conserva: el cálculo de las tablas (`FORMULAS`, `columna`), el generador de condiciones con
múltiplos (`parCondiciones` y su contraejemplo por búsqueda), las regiones del Venn (`conjunto`, `regiones`), el
dominio de los cuantificadores (`PRED`, `DOMS`) y las tres mesas. Los motores de las dos escenas
(`logica/motor.js`: analizar, tabla de verdad, clasificar, equivalentes, negar; `conjuntos/motor.js`: regiones) alcanzan
para todas las misiones de abajo.

---

## 1. Las ideas, en orden

Propongo **seis**, el tope del validador. Una es nueva (`conectores`, al inicio) y cinco conservan su `id`. `certezas`
sale a razonamiento matemático (pregunta 2). Las tres mesas del laboratorio (`dos-formulas`, `tres-conjuntos`,
`contraejemplo`) conservan su `id`; también los controles `p` y `q` de la idea `condicional` y `op` de `operaciones`.

| # | `id` | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) |
| --- | --- | --- | --- |
| 1 | `conectores` (nueva) | «Y», «o» y «no» | «p y q» es verdadera solo si las dos lo son; «p o q», si al menos una lo es, también las dos; «no p» invierte. |
| 2 | `condicional` | El condicional solo falla una vez | «Si p, entonces q» solo falla si p se cumple y q no: p es suficiente, q es necesaria, y q sola no asegura p. |
| 3 | `equivalencias` | Frases distintas, mismo valor | Dos frases son equivalentes si valen igual en cada caso: «si p, q» equivale a «si no q, no p», no a «si q, p». |
| 4 | `operaciones` | Cada operación junta regiones | Cada operación es un grupo de regiones del diagrama; para contar se suma región por región, y así lo común se cuenta una sola vez. |
| 5 | `potencia` | Con o sin cada elemento | Cada elemento distinto entra o no en un subconjunto: con n(A) elementos hay 2^n(A) subconjuntos, contando el vacío y el mismo A. |
| 6 | `cuantificadores` | Un contraejemplo basta | Un contraejemplo hace falsa una frase con «todos»; un testigo hace verdadera una con «alguno»; la negación de «todos» es «alguno no». |

**Por qué va cada una ahí y qué da por sabido**

1. **«Y», «o» y «no».** Todas las demás combinan frases; hoy los conectores se meten en una tarjeta. Aquí se presentan
   proposición, V y F, ∧, ∨ y ~, y en la regla la «o» exclusiva (Δ), porque San Marcos 2023-I la usa. Da por sabido leer
   una frase y decir si es cierta. Nada de la unidad.
2. **El condicional.** Necesita ∧ y ~ (idea 1). Estrena →, ↔, suficiente, necesaria y las formas de decirlo («q, ya que
   p», «p solo si q»: la trampa de San Marcos 2026-I). Su «Ahora tú» de examen: la proposición de tres letras que se
   sabe falsa (2020-I, 2023-I) y la condición con múltiplos de hoy. Da por sabido «múltiplo de» (dato: n ÷ 4 exacta).
3. **Equivalencias.** Necesita → (idea 2) y ~ (idea 1). Estrena ≡, contrarrecíproca, tautología, contradicción y
   contingencia, y las leyes (De Morgan, ~(p → q) ≡ p ∧ ~q). Las leyes van siempre en `datos`: se elige cuál usar, no se
   memorizan. Su «Ahora tú» de examen: clasificar y simplificar (2026-I).
4. **Operaciones.** Los conjuntos van después de la lógica porque ∩, ∪ y ′ son el «y», el «o» y el «no» de los
   conjuntos (se dice en «Lee»). Estrena conjunto, elemento (∈), universo, las operaciones, el cardinal n(A) y el conteo
   por regiones. Por extensión y por comprensión entran en «Lee». Su «Ahora tú» de examen: Venn de tres y Carroll, lo que
   más sale (pregunta 3).
5. **Potencia.** Necesita conjunto, ∈ y n(A) (idea 4). Estrena subconjunto (⊂), vacío, propio y P(A); la diferencia
   entre 2 ∈ A y {2} ⊂ A va en la regla y en «Ahora tú» (papel 10 de conjuntos). Ya no cuenta uniones.
6. **Cuantificadores.** Va al final porque el dominio es un conjunto (idea 4) y negar usa ~ (idea 1). Estrena ∀, ∃,
   dominio, contraejemplo y la propiedad p(x). Da por sabido ℕ y ℤ, que van como dato.

Qué **no** entra: producto cartesiano (está en aritmética y en `numeros-reales` no hace falta), intervalos (es la
unidad siguiente), y ordenamientos, parentescos y certezas (pregunta 2).

---

## 2. El objeto de la primera pantalla

El kit no tiene objetos de álgebra. Hace falta una pieza nueva, por ejemplo `alg-objeto`, dibujada por la sesión como
prueba (`data-prueba`), con su prueba numérica de encuadre y rótulos (molde §6). La tabla, el Venn o la recta van al
lado, nunca solos. El plan permite `sinObjeto` en lógica, pero propongo no usarlo: todas tienen un objeto posible.

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **La puerta del local del simulacro con su cartel «Entra quien traiga DNI y carné de postulante»**, un postulante y sus dos tarjetas | p: trae su DNI; q: trae su carné; la puerta abierta o cerrada es el valor de p ∧ q |
| 2 | **Un puesto del mercado de Juliaca con el cartel de la casera: «Si compras 3 kg de papa, te regalo una cebolla»** y la balanza | p: compró 3 kg; q: recibió la cebolla; la promesa cumplida o rota es p → q |
| 3 | **La puerta de la biblioteca municipal con dos carteles: «Si entras, tienes carné de lector» y «Si tienes carné, entras»**, y cuatro visitantes | p: entró; q: tiene carné; cada visitante es una fila |
| 4 | **Dos aros de educación física en el patio del colegio**, que se cruzan, y diez alumnos parados donde les toca | aro A: juegan fútbol; aro B: juegan vóley; el cruce, los dos; afuera, en el patio (U), ninguno |
| 5 | **Un puesto de la feria con papa, chuño y queso, y bolsitas** que se arman y se ponen en un estante | A = {papa, chuño, queso}; cada bolsa es un subconjunto; la bolsa vacía también cuenta |
| 6 | **La pizarra del aula con las notas de un simulacro de seis alumnos** (0 a 20; se aprueba con 11, regla del simulacro) | el dominio es el aula; x, un alumno; p(x): «x aprobó» |

No uso un examen real en la idea 1 («la UNA Puno pide DNI y carné») porque no tengo el reglamento para citarlo; como
simulacro de academia no necesita fuente (punto 10). Evito marcas (una app de pagos) en los carteles.

---

## 3. La misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión (≤ 25) | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «La puerta solo se abre con DNI y carné.» **Encuentra los tres casos en que el postulante se queda afuera.** | DNI y carné (lo trae / no), tocando cada tarjeta; «Guardar caso» | los guardados incluyen (V, F), (F, V) y (F, F) | «DNI sí, carné no: falta uno, así que “DNI y carné” es F.» | «Con “y” basta que falte uno para quedarse afuera.» |
| 2 | «La casera cumple sus promesas… casi siempre.» **Encuentra un caso en que rompe su promesa. ¿Hay otro?** | `p` compró 3 kg, `q` recibió cebolla (sí / no) | `val.p === 'V' && val.q === 'F'` | «No compró y recibió cebolla: la promesa no se puso a prueba; sigue cumplida.» | «Solo la rompe si compraste los 3 kg y no te dio la cebolla.» |
| 3 | «Los dos carteles parecen decir lo mismo.» **Encuentra un visitante que cumple un cartel y rompe el otro.** | visitante (Rosa, Luis, Ana, Hugo), tocando a cada uno | (p, q) es (V, F) o (F, V) | «Luis entró sin carné: rompe el primero y cumple el segundo; no dicen lo mismo.» | «Basta un caso distinto para que dos frases no sean equivalentes.» |
| 4 | «Diez alumnos en los aros del patio.» **Mueve alumnos hasta que n(A) + n(B) sea 10 y n(A ∪ B), solo 7.** | arrastrar a cada alumno a una región; `op` sombrea la región que pide | `nA + nB === 10 && nUnion === 7` | «n(A) + n(B) = 6 + 4 = 10, pero n(A ∪ B) = 7: los 3 del cruce se contaron dos veces.» | «Al sumar los dos aros, el cruce se cuenta dos veces: se resta una.» |
| 5 | «Con papa, chuño y queso se arman bolsas.» **Arma y guarda todas las bolsas distintas que se pueden armar.** | tocar cada producto (entra / sale); «Guardar bolsa» | los guardados tienen 8 bolsas distintas (el motor las enumera) | «Llevas 7 bolsas distintas y ninguna se repite.» | «Son 8 con la vacía: cada producto entra o no entra.» |
| 6 | «El tutor dice: “Todos aprobaron” y “Alguien sacó 20”.» **Cambia notas hasta que la primera sea falsa y la segunda verdadera.** | nota de Rosa y nota de Luis, de 0 a 20 (las otras cuatro, fijas: 11, 12, 14 y 15) | `min(notas) < 11 && max(notas) === 20` | «Rosa con 08 basta para que “todos aprobaron” sea falsa.» | «Un contraejemplo tumba el “todos”; un testigo prueba el “alguien”.» |

Notas: en la 1 y la 5 la misión pide casos guardados, así que no hay «Muéstrame» (`docs/teoria.md`, retos). Ninguna
está cumplida al abrir: la 1 empieza sin casos, la 2 en (V, V), la 3 en Rosa (V, V), la 4 con 2 en el cruce, la 5 sin
bolsas y la 6 con Rosa 13 y Luis 18.

---

## 4. La predicción de cada idea

Ninguna pregunta por lo que el juego ya mostró. `datos` lleva solo valores, nunca la regla. La app baraja las opciones.
**Todos los códigos son hipótesis** (no hay informe); los TAL- que ya existen vienen de `rutinas/teoria-algebra.md`.

**Idea 1.** El juego solo tiene la puerta («y»). «En la oficina de informes el cartel dice: “Te atendemos si muestras tu
DNI o tu carné”. Llegas con los dos. ¿Te atienden?» Datos: p: muestras tu DNI; q: muestras tu carné; p = V y q = V.

| Opción | Qué mide |
| --- | --- |
| Sí: con «o» basta uno, y con los dos también | Correcta |
| No: «o» es uno o el otro, no los dos | Lee la «o» como exclusiva (TAL-O-EXCLUSIVA, nueva; espejo de AT-O-EXCLUSIVA de aritmética) |
| No se sabe: el cartel no dice qué pasa con los dos | Cree que la «o» no decide ese caso (TAL-O-SIN-CASO, nueva) |
| Sí, y también te atenderían sin ninguno | Cree que la «o» es siempre verdadera (TAL-O-SIEMPRE, nueva) |

**Idea 2.** «Ves a una señora salir del puesto con su cebolla de regalo. ¿Compró 3 kg de papa?» Datos: la casera siempre
cumple: p → q es V; la señora recibió la cebolla: q = V.

| Opción | Qué mide |
| --- | --- |
| Puede que sí o que no: no se puede asegurar | Correcta |
| Sí: si le regalaron, es que compró | Afirma el consecuente: usa la recíproca (TAL-RECIPROCA). Es el error clásico del condicional; hay pistas en la literatura (tarea de Wason, 1968; Hoyles y Küchemann, 2002), **por confirmar y sin cifra** |
| No: si hubiera comprado, no sería un regalo | Cree que q verdadera obliga a p falsa (TAL-INVERSA) |

Son tres opciones, como hoy: no encontré una cuarta que no repita un código.

**Idea 3.** «El guardián cuelga un tercer cartel: “Si no tienes carné, no entras”. ¿Con cuál de los dos vale lo mismo en
los cuatro visitantes?» Datos: p: entra; q: tiene carné; ~q: no tiene carné.

| Opción | Qué mide |
| --- | --- |
| Con «Si entras, tienes carné» | Correcta: es la contrarrecíproca |
| Con «Si tienes carné, entras» | Confunde «si no q, no p» con la recíproca (TAL-INVERSA) |
| Con ninguno: dice otra cosa | No reconoce frases equivalentes con otras palabras (TAL-NUEVA, nueva) |
| Con los dos: los tres hablan de entrar y de carné | Las mismas palabras, la misma frase (TAL-MISMAS-PALABRAS, nueva) |

Hoy esta predicción es «¿qué fórmula tiene la misma columna que p → q?», con p ∧ q de cuarta opción (TAL-CONJ). Esa
pasa a «Ahora tú».

**Idea 4.** El juego cuenta sumando aros; no usó a los de afuera. «En otra aula de 30, 18 juegan fútbol, 15 vóley y 6
ninguno. ¿Cuántos juegan los dos?» Datos: n(U) = 30, n(A) = 18, n(B) = 15; ninguno: 6.

| Opción | Qué mide |
| --- | --- |
| 9 | Correcta: 30 − 6 = 24 en los aros; 18 + 15 − 24 = 9 |
| 3 | Olvida a los de afuera: 18 + 15 − 30 (TAL-SIN-AFUERA, nueva; la escena `conjuntos` ya lo trae como error) |
| 24 | Responde otra cantidad: los que juegan al menos uno (TAL-OTRA-REGION, nueva) |
| 6 | Confunde «ninguno» con «los dos» (TAL-NINGUNO-AMBOS, nueva) |

Hoy la predicción es De Morgan de conjuntos ((A ∩ B)′ = A′ ∪ B′); pasa a «Mira» como espejo de la idea 3.

**Idea 5.** «La casera agrega maca. ¿Cuántas bolsas distintas se pueden armar con los cuatro productos?» Datos: con 3
productos hay 8 bolsas, contando la vacía.

| Opción | Qué mide |
| --- | --- |
| 16 | Correcta: cada bolsa anterior, con maca o sin maca |
| 12 | Crece de 4 en 4: suma en vez de duplicar (TAL-SUMA-N, nueva; es el error de las filas en la escena `logica`) |
| 9 | Solo agrega la bolsa de maca sola (TAL-UNO-MAS, nueva) |
| 15 | Deja fuera la bolsa vacía (TAL-SIN-VACIO) |

El de hoy, A = {2, 3, 3, 5} con el 3 repetido (TAL-REPETIDO), pasa a «Ahora tú».

**Idea 6.** «Sabes que “Todos aprobaron” es falsa. ¿Cuál frase es seguro verdadera?» Datos: el aula tiene seis alumnos;
se aprueba con 11.

| Opción | Qué mide |
| --- | --- |
| Alguno no aprobó | Correcta |
| Ninguno aprobó | Niega pidiendo que fallen todos (TAL-NEG-TODO) |
| Alguno aprobó | Niega solo la palabra «todos» (TAL-NEG-EXISTE) |
| La mayoría no aprobó | Cree que «falso» quiere decir «casi todos fallaron» (TAL-NEG-MAYORIA, nueva) |

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| p, q, r | Proposiciones (r, la tercera, solo en «Ahora tú» y ejemplos) | En la idea 6, p(x) es una función proposicional: la misma letra, porque es una proposición que depende de x (notación de academia) |
| s | Cuarta proposición, solo para contar filas (papel 1 de `logica`) | — |
| V, F | Verdadero, falso | F no es una variable; nunca se usa como letra de otra cosa |
| ~ | Negación («no») | Algunos libros escriben ¬. Se usa ~, el de las academias y de las dos escenas |
| ∧, ∨ | «y», «o» (incluyente) | — |
| Δ | «o… o…» (excluyente) en lógica; diferencia simétrica en conjuntos | **Mismo signo, dos usos**, y no es casualidad: A Δ B es el «o excluyente» de los conjuntos. Se avisa en la idea 4. En física, Δ es «variación»: otra unidad |
| →, ↔ | Condicional, bicondicional | No se usa ⇒ |
| ≡ | Equivalencia entre fórmulas | No es «=» |
| A, B, C | Conjuntos | — |
| U | Universo | — |
| ∈, ∉ | Pertenece, no pertenece (un elemento) | — |
| ⊂, ⊄ | Está incluido (un conjunto) | Algunos libros escriben ⊆. Se usa ⊂, como el glosario actual |
| ∅ | Conjunto vacío | {∅} no es ∅: va en «Ahora tú» de la idea 5 |
| A′ | Complemento | Otros escriben Aᶜ o ∁A; se usa A′. No es «A prima» de geometría |
| A − B | Diferencia | Otros escriben A \ B. No es una resta de números |
| n(A) | Cardinal: cuántos elementos distintos | **No se usa n sola**: la fórmula va 2^n(A), no 2ⁿ, para no tener dos n (hoy la regla dice «n(P(A)) = 2ⁿ») |
| P(A) | Conjunto potencia | **Choca hoy** con P(x) de los cuantificadores: por eso la propiedad pasa a p(x) |
| x | Un elemento del dominio (el alumno de la pizarra, el testigo de la recta) | — |
| ∀, ∃ | «Para todo», «existe al menos uno» | ∃! no entra |
| ℕ, ℤ | Naturales, enteros (en la idea 6, como dato) | ¿ℕ empieza en 0 o en 1? Se dice en cada dato (pregunta 6) |

---

## 6. Mapa de colores (un color fijo por magnitud, §5b)

| Token | Magnitud fija en la unidad | Dónde |
| --- | --- | --- |
| `o` naranja | p; el conjunto A; x, el testigo | ideas 1–3; 4–5; 6 |
| `i` turquesa | q; el conjunto B | ideas 1–3; 4–5 |
| `h` carmín | r; el conjunto C | solo en «Ahora tú» y ejemplos de tres letras o tres aros |
| `f` violeta | el resultado: el valor de la fórmula, la región pedida, el cardinal pedido, el número de subconjuntos, el valor de ∀ o ∃ | todas |
| `d` verde | no se usa | — |
| tinta | V y F, U, los elementos, el dominio, s | todas |

Por qué así:
- **V y F en tinta**, distinguidos por la letra (y F en negrita). Hoy van en verde y carmín, juntos en cada tabla:
  rojo–verde da 0,038 en deuteranopía, y el color no debe ser lo único que separa (WCAG 1.4.1).
- **La tercera letra en carmín y no en verde**, porque aquí no hay ángulos: el verde junto al naranja (p → r, o los aros
  A y C que se cruzan) da 0,010 en protanopía. Carmín–naranja da 0,062, bajo pero con letra y rótulo; carmín–turquesa,
  0,077. Lo compruebo con `herramientas/auditar-colores.py` antes de escribir (pregunta 5).
- **p y A comparten naranja** (y q y B, turquesa): son magnitudes de ideas distintas que nunca están en el mismo
  ejercicio. La única pantalla con los dos es el «Mira» de la idea 4 (∩ como el «y» de los conjuntos): ahí p y q van en
  tinta.
- Lo que se pide va con «?» en tinta hasta comprobar, nunca en violeta antes (decisión del 17 nov). El subrayado del
  glosario es gris.
- Las escenas `logica` y `conjuntos` (fucsia en la intersección, turquesa afuera) quedan distintas hasta que les toque.

---

## 7. Práctica: qué existe y qué falta por idea

Lo que existe hoy:
- **Dos escenas en borrador, compartidas con aritmética:** `logica` (los interruptores; 20 casos, 10 de papel) y
  `conjuntos` (las fichas en los aros; 20 casos, 10 de papel). **Ningún generador** («Prácticas que ya existen:
  ninguna»). La cola de repaso usa los 10 papeles de cada una para esta unidad (`nucleo/repaso-tipos.js`).
- **Tres mesas:** `dos-formulas` (idea 3), `tres-conjuntos` (idea 4) y `contraejemplo` (idea 6).
- **Los generadores que viven dentro de la teoría** («Ahora tú» y «Así se resuelve» de las seis ideas).

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 «Y», «o», «no» | papel 2 de `logica` (evaluar con valores dados) | todo: tipo «valor de una compuesta con ∧, ∨, ~, Δ», tipo «traducir una frase a símbolos»; una mesa |
| 2 Condicional | generador de condiciones (en la teoría); papel 3 y 9 de `logica` | tipos «se sabe falsa: halla los valores» (tres letras; San Marcos 2020-I, 2023-I), «simbolizar con “ya que”, “solo si”» (2026-I) |
| 3 Equivalencias | mesa `dos-formulas`; generador de tautologías (en la teoría); papel 4–8 de `logica` | tipos «clasificar» con contingencia y tres letras (2026-I), «simplificar con las leyes en `datos`» (2026-I), «negar en palabras» |
| 4 Operaciones | mesa `tres-conjuntos`; operaciones (en la teoría); papel 1–5, 8 y 9 de `conjuntos` | tipos «Venn de tres por regiones» (2019-I, 2023-I) y «Carroll» (2021, 2023-I, 2025-I, 2027-I) |
| 5 Potencia | subconjuntos con repetido (en la teoría); papel 6, 7 y 10 de `conjuntos` | tipos «propios e inverso» (63 propios → 6 elementos), «∈ o ⊂» con {2} y ∅ |
| 6 Cuantificadores | mesa `contraejemplo`; V o F en un dominio (en la teoría); papel 10 de `logica` | tipo «negar una frase con todos o alguno», dominios ℕ y ℤ |

Propuesta: **una plantilla nueva de formato `predicciones`**, por ejemplo `plantillas/logica-y-conjuntos/` (generador,
prueba en 400 semillas, `casos.json` verificado aparte y `papel.json` de 5 a 10 por idea con sus datos al final), con
los tipos separados por idea y por unidad (molde §7). Que use los motores de las dos escenas, no una copia, para que
aritmética la reuse cuando le toque. Además, ítems de esta unidad en `catalogo/pruebas/algebra.json`.

---

## 8. Datos del mundo

La unidad casi no necesita datos del mundo: son situaciones de todos los días con reglas del problema.

| Dato | ¿Fuente? |
| --- | --- |
| «Entra quien traiga DNI y carné», «si compras 3 kg te regalo una cebolla», los carteles de la biblioteca | Reglas del problema, sin fuente. Si se quiere decir que la UNA Puno o San Marcos piden DNI y carné, hace falta el reglamento del examen |
| Notas de 0 a 20, se aprueba con 11 | Se da como «regla del simulacro» en `datos`, no como norma; así no necesita fuente |
| Diez alumnos en los aros, 30 en el aula | Valores de problema; tienen que ser posibles (punto 10) |
| Encuestas «reales» (quién juega qué en Puno, porcentajes) | **No usar** sin fuente; los números de los conteos son inventados y se ven así |
| Historia: Boole, *Las leyes del pensamiento* (1854) | Ya trae fuente (MacTutor, St Andrews) |
| Venn (1880, *Philosophical Magazine*, vol. 10) y De Morgan con Ockham (siglo XIV) | Están en `docs/investigacion/historia-ganchos.md`, con la corrección del volumen; sirven para «Lee» si hace falta |

---

## 9. Preguntas para Gerson

1. **¿Qué hace esta unidad, si aritmética tiene las mismas dos?** `aritmetica.logica-proposicional` y
   `aritmetica.conjuntos` enseñan lo mismo, con una idea de título idéntico, y San Marcos clasifica ahí sus 13
   preguntas (aquí, 0). La UNI la pone en álgebra. Además, el plan (§7) nombra como rama de entrada de álgebra
   «Expresiones algebraicas», no «Lógica y números reales». **Recomiendo** hacerla ahora completa y que se sostenga sola
   (es raíz de álgebra y un requisito de otro curso no cierra), con piezas, objetos, códigos y generador pensados para
   que aritmética los reuse cuando le toque, y decidir entonces si sus dos unidades se acortan. Si prefieres seguir el
   plan al pie de la letra, esta espera y empiezo por `exponentes-y-productos-notables`.
2. **¿`certezas` sale a razonamiento matemático?** Fila de amigos y parentescos es lo que enseñan
   `ordenamiento-de-informacion` (`orden-lineal`) y `razonamiento-deductivo` (parentesco), y San Marcos lo pregunta en
   RM. Sacarla deja lugar a `conectores` sin pasar el tope de 6. **Recomiendo** que sí, con `Avance.migrar` para llevar
   el avance de `certezas` a `orden-lineal` (como en Vectores). Si quieres conservarla, `conectores` vuelve a ser una
   tarjeta de «Lee» de `condicional`, y se pierde su predicción (la «o» exclusiva).
3. **Contar por regiones (Venn de tres y Carroll), lo que más sale, ¿dentro de `operaciones` o como idea propia?**
   **Recomiendo** dentro de `operaciones`: la misión y la predicción ya son de conteo, y el Venn de tres y el Carroll
   son su «Ahora tú» de examen. Una idea propia pediría sacar otra (seis es el tope).
4. **`requiere`.** Hoy es `[]` y la unidad es raíz. **Recomiendo** dejarla así, sin poner las de aritmética como
   consejo: sería mandar al alumno a lo mismo. «Múltiplo de», ℕ y ℤ van como dato.
5. **Colores:** ¿apruebas V y F en tinta (F en negrita), la tercera letra y el tercer aro en carmín (no hay ángulos
   aquí) y el verde sin usar? **Recomiendo** que sí, con la comprobación del script antes de escribir.
6. **Notación local:** ¿las academias de Puno escriben Δ o ⊻ para la «o» excluyente, ⊂ o ⊆, A′ o Aᶜ, y ℕ con el 0 o
   sin él? **Recomiendo** Δ, ⊂ y A′, que usan las dos escenas, y decir en cada dato si ℕ empieza en 0.
7. **Errores:** todo es hipótesis. Esta unidad sirve también a dos de aritmética y a RM. **Recomiendo** un informe corto
   de ideas erróneas de lógica y conjuntos en paralelo, de una sesión (pistas por confirmar: Wason 1968, Hoyles y
   Küchemann 2002 para el condicional; Zazkis y Gunn 1997 y Linchevski y Vinner 1988 para conjuntos y vacío), y unificar
   TAL- y AT- en un solo juego de códigos para lo que es el mismo error.
8. **Objetos:** ¿te sirven la puerta del simulacro con DNI y carné, la casera del mercado de Juliaca, los carteles de la
   biblioteca, los aros del patio, las bolsas de la feria y la pizarra de notas? Los dibuja la sesión como prueba.
9. **Ficha:** ¿paso `grado: 3` a `grado: 5` (solo informativo, como trigonometría) y el nombre a «Lógica y conjuntos»,
   sin «juegos lógicos» si se aprueba la pregunta 2? **Recomiendo** las dos cosas; el `id` no cambia.
