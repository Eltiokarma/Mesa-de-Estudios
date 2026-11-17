# Propuesta de ideas: «Razones trigonométricas de ángulos agudos»

`trigonometria.razones-trigonometricas-agudas` · Etapa 2 del plan de calidad · fase 1 (`docs/metodo/unidad/1-ideas.md` §A) · 17 nov 2026

Gerson: esto es solo la propuesta. No se escribe nada hasta que la apruebes o la corrijas. Las preguntas que solo tú
puedes contestar están al final (sección 9).

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3 y §7, `docs/molde-unidad.md`, `docs/metodo/unidad/1-ideas.md`, la
teoría actual (`contenido/teoria/trigonometria/razones-trigonometricas-agudas.js`), su ficha en
`catalogo/cursos/trigonometria.json`, `plantillas/circunferencia-trig/` (la única plantilla de la unidad), el informe
`docs/investigacion/trigonometria-ideas-erroneas.md`, la matriz `docs/teoria/matriz/trigonometria.json`, las preguntas
de San Marcos de `docs/datos/admision-unmsm.csv` y, como modelo, `contenido/teoria/fisica/vectores.js`.

**Ojo con los temarios:** `docs/taxonomia-uni-2026.md` y `docs/taxonomia-unmsm-2026.md` solo traen física y química; no
dicen nada de trigonometría. Lo que se pregunta lo saqué del catálogo (UNI semana 1; San Marcos temas 3 y 4) y de las
preguntas reales de San Marcos 2019-I a 2027-I que están en `docs/datos/admision-unmsm.csv`. De esta unidad hay seis:

| Periodo | Qué piden |
| --- | --- |
| 2019-II | La tangente de un ángulo dentro de una figura con un arco, usando Pitágoras |
| 2023-II | Una expresión con ángulos notables y co-razones |
| 2024-I | Perímetros de dos triángulos que salen de cortar una cartulina, con 37° y 53° |
| 2024-II | Cuánto cuesta cercar un trapecio con 16°, 74°, 37° y 53° |
| 2024-II | Una hipotenusa, usando que el seno de un ángulo y la secante de su complemento son recíprocos |
| 2025-II | Una expresión con cosenos de ángulos complementarios a partir de una condición con senos |

En el banco Cuzcano hay unas 92 fichas de la unidad: razones en figuras geométricas (45), definición (19), notables y
aproximados (16), recíprocas y complementarias (12) (`docs/temario-completo.md`). Lo que más sale es el triángulo
escondido en una figura y el «dada una razón, halla otra» planteando con k.

---

## 0. Diagnóstico de la teoría actual

1. **Tiene cuatro ideas** (`razon-cociente`, `notables`, `aproximados`, `complementarias`) y un laboratorio de tres mesas
   con retos que el motor sí comprueba. La base está bien: la razón no cambia con el tamaño (triángulos semejantes, uno
   dentro de otro), los notables salen del cuadrado y del equilátero cortados, se dice con honestidad que 37° es un
   redondeo de 36,87° y la cofunción se explica con el mismo cateto visto desde los dos ángulos.
2. **No hay objeto real en ninguna primera pantalla:** las cuatro ideas abren con un triángulo pelado. El albañil de
   Juliaca solo aparece escrito en una tarjeta (punto 1).
3. **No hay misión:** las consignas describen los controles («Elige el cateto opuesto a θ y el adyacente…»). La de 37°
   («busca el ángulo que da un opuesto de 3») parece una meta, pero el motor no la comprueba. Tampoco hay `leyenda`,
   `aprendizaje` ni `actividad` (puntos 2, 3 y 12).
4. **No hay `datos` en ningún ejercicio** («Así se resuelve», «Ahora tú», predicciones). Pitágoras y la racionalización
   se usan sin darse; «si queda raíz abajo, se racionaliza» aparece en la cuenta sin haberse enseñado (punto 13). No hay
   ejemplos resueltos (cero de 60) y el glosario trae un ejemplo por término, sin `simple`. No declara `calidad: 2`.
5. **El orden falla (punto 9):** la idea 2 pide cot, sec y csc de los notables, con el distractor de la recíproca, pero
   las recíprocas recién se presentan en el «Lee» de la idea 4; la regla de la idea 1 ya las nombra. Y la unidad usa
   Pitágoras y semejanza, que no están en su `requiere` (`geometria.triangulos` no los trae: Pitágoras está en
   `geometria.relaciones-metricas`, de 4.º).
6. **Los colores contradicen §5b:** θ va en naranja, el cateto opuesto en carmín (el color de los ángulos) y la
   hipotenusa en verde, pegada al naranja y al carmín (el par que no se distingue con protanopía y deuteranopía).
   `triangulos-rectangulos.js` copia esa paleta y la escena `circunferencia-trig` tiene otra (θ violeta, sen carmín,
   cos azul, tan verde).
7. **Las lecturas en vivo encadenan igualdades con «·»** («H = 5 · sen θ = 3/5 = 0,6»; «θ = 30° · otro = 60° · CO =
   0,5»), justo lo que el molde prohíbe (punto 7).
8. **«Así se resuelve» es el mismo generador que «Ahora tú»** con otra semilla. Además, «Ahora tú» no llega a nivel de
   examen en las ideas 1 y 2: falta «dada una razón, halla otra» y el triángulo escondido en una figura.
9. Detalles: la cabecera dice «3.º de secundaria», la ficha del catálogo dice `grado: 3` y la prueba de entrada y
   salida de trigonometría no tiene ningún ítem de esta unidad ni de la siguiente.

---

## 1. Las ideas, en orden

Propongo **cinco**. La primera es nueva; las otras cuatro conservan su `id` (el avance de los alumnos se guarda con
ellos). Las mesas del laboratorio y sus controles (`co`, `ca`, `g`, `k`) tampoco cambian de `id`.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `lados-desde-angulo` (nuevo) | Los lados se nombran desde θ | La hipotenusa es el lado frente al ángulo recto; de los catetos, el opuesto queda frente al ángulo que miras y el adyacente lo toca, así que si miras desde el otro agudo se intercambian. |
| 2 | `razon-cociente` | Una razón es un cociente | sen θ = CO/H, cos θ = CA/H y tan θ = CO/CA son cocientes sin unidades: si el triángulo crece y θ no cambia, ellos tampoco cambian. |
| 3 | `notables` | Medio cuadrado, medio equilátero | Un cuadrado cortado por la diagonal da lados 1, 1 y √2 (45°); un equilátero cortado por su altura da 1, √3 y 2 (30° y 60°): de ahí salen sus razones exactas. |
| 4 | `aproximados` | 37° y 53°: el 3-4-5 | En el triángulo 3-4-5 los lados van como 3k, 4k y 5k; el examen llama 37° y 53° a sus ángulos, que miden 36,87° y 53,13°; con 7-24-25 pasa lo mismo con 16° y 74°. |
| 5 | `complementarias` | Complementarias y recíprocas | Los dos agudos suman 90° y el opuesto de uno es el adyacente del otro, así que sen θ = cos(90° − θ); cot, sec y csc dan vuelta a tan, cos y sen, y cada par multiplicado da 1. |

**Por qué va cada una en su lugar y qué da por sabido**

1. **Los lados se nombran desde θ.** Va primero porque todas las demás nombran lados desde un ángulo, y el error que
   más pesa en el aula es elegir mal la razón por confundir opuesto con adyacente (TR9, Kendal y Stacey; parcial) o
   creer que el opuesto es «el lado vertical» (TR7 tal como lo describen De Kee y otros). La idea 5 se apoya en ella
   (el mismo cateto cambia de nombre). Da por sabido: qué es un triángulo, un ángulo recto y un ángulo agudo
   (`geometria.triangulos`, `geometria.segmentos-y-angulos`). Las palabras cateto e hipotenusa se presentan aquí.
2. **Una razón es un cociente.** Necesita los nombres de la idea 1. Define sen, cos y tan (solo las tres) y muestra que
   no dependen del tamaño (TR7 y TR8). Su «Ahora tú» de nivel examen trae «tan θ = 8/15: halla sen θ + cos θ» (lados 8k
   y 15k, Pitágoras) y el triángulo escondido en un cuadrado o rectángulo. Da por sabido: fracciones y simplificar.
   Pitágoras y «misma forma, lados proporcionales» van en `datos` y en el «Lee», porque no están en el `requiere`
   (pregunta 6).
3. **Medio cuadrado, medio equilátero.** Necesita la razón (idea 2). Usa solo sen, cos y tan. Da por sabido: la raíz
   cuadrada; la racionalización va como dato (1/√2 = √2/2), no como paso que se adivina.
4. **37° y 53°: el 3-4-5.** Después de los exactos, para contrastar exacto con redondeado. Introduce k («cuánto vale
   cada parte»), que después usan Vectores, la idea 5 y la unidad siguiente. Su «Ahora tú» de nivel examen trae figuras
   compuestas, como el trapecio con 16°, 74°, 37° y 53° de San Marcos 2024-II. Da por sabido: la idea 2 y Pitágoras
   (dato).
5. **Complementarias y recíprocas.** Al final, porque junta todo: los nombres (idea 1), las tres razones (idea 2) y los
   notables (ideas 3 y 4). Aquí entran cot, sec y csc. Su «Ahora tú» mezcla notables con recíprocas («sen 30° + tan 45°
   + cos 60° · sec 60°») y llega a las ecuaciones de examen: sen(2x + 10°) = cos(x + 20°) y tan(3x) · cot(x + 40°) = 1.

Qué **no** entra (para no pisar a la unidad siguiente, `triangulos-rectangulos`): resolver un triángulo con un lado y un
ángulo (CA = H · cos θ), elevación y depresión. Ver la pregunta 5, porque Vectores lo necesita.

---

## 2. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada lado |
| --- | --- | --- |
| 1 | **Una escalera de 5 m apoyada en la pared de una casa de adobe.** θ, el ángulo con el piso; α, el ángulo con la pared | escalera = hipotenusa; pared = cateto opuesto a θ; piso entre el pie y la pared = cateto adyacente a θ |
| 2 | **Un poste de la plaza y tu primo, con sus sombras a la misma hora de la tarde.** El rayo de sol va de la punta del poste a la punta de su sombra | altura = CO; sombra = CA; rayo = H; θ = qué tan alto está el sol |
| 3 | **Las dos escuadras del colegio** (la de 45° y la de 30° y 60°), al lado de **una loseta cuadrada cortada por la diagonal** y **una señal de tránsito triangular cortada por su altura** | la loseta da la escuadra de 45°; la señal (equilátero), la de 30° y 60° |
| 4 | **El albañil que marca la esquina recta de una casa con estacas y cuerda: 3 m, 4 m y 5 m** | base 4 m = CA; estaca a 3 m = CO; cuerda diagonal 5 m = H |
| 5 | **Un techo de calamina a dos aguas, partido por el poste del centro** | viga del alero al poste = CA de θ; poste = CO de θ; calamina = H; θ en el alero, α arriba, entre la calamina y el poste |

No hay ninguna pieza del kit que dibuje estos objetos (`fis-fuerzas` y `fis-objeto` son de física). Hace falta una pieza
nueva, por ejemplo `trig-objeto`, dibujada por la sesión como prueba (`data-prueba`), con su prueba numérica de encuadre
y rótulos (molde §6). Encima del objeto va el triángulo de la pieza `triangulo`, que ya existe.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «La escalera mide 5 m y su pie se puede correr.» **Deja la escalera de modo que el cateto adyacente a θ mida 3 m.** | `pie` de 1 a 4,5 m, de 0,5 en 0,5 (la pared sale de Pitágoras) | `val.pie === 3` | «La escalera, 5 m, es más larga que la pared, 4 m, y que el piso, 3 m: la hipotenusa es el lado mayor.» | «El adyacente toca a θ y no es la escalera: la escalera es la hipotenusa.» |
| 2 | «Poste de 6 m, tu primo de 1,5 m; la sombra del primo se ve con «?».» **Haz que la sombra de tu primo mida 2 m.** | `sombra` del poste de 4 a 12 m, de 1 en 1 (el sol se arrastra) | `val.sombra === 8` | «6 m ÷ 8 m = 0,75: la altura del poste es 0,75 veces su sombra.» | «6 ÷ 8 = 1,5 ÷ 2 = 0,75: a la misma hora, altura ÷ sombra es igual para los dos.» |
| 3 | «Corta la señal triangular para armar la escuadra de 30° y 60°.» **Haz que el cateto frente a 30° mida 3.** | `fig` (loseta o señal) y `L`, de 2 a 8, de 2 en 2 | `val.fig === 'eq' && val.L === 6` | «Frente a 30°: 3, la mitad de la hipotenusa, 6. Frente a 60°: 3√3 ≈ 5,2.» | «En la escuadra de 30° y 60°, el cateto frente a 30° siempre es media hipotenusa.» |
| 4 | «La base ya mide 4 m.» **Mueve la estaca hasta que la cuerda diagonal mida justo 5 m.** | `co`, la estaca, de 1 a 6 m, de 0,5 en 0,5; el transportador marca grados enteros | `val.co === 3` | «3² + 4² = 9 + 16 = 25 = 5²: la esquina queda recta; el transportador marca 37°.» Con otro valor: «3,5² + 4² = 28,25: la cuerda mide 5,32 m.» | «Lados enteros 3, 4 y 5: con esa cuerda los albañiles marcan los 90°.» |
| 5 | «La inclinación θ del techo se cambia arrastrando la calamina.» **Haz que el ángulo de arriba, entre la calamina y el poste, mida 70°.** | `g` (θ) de 10° a 60°, de 5° en 5° | `val.g === 20` | «θ + α = 20° + 70° = 90°: los dos agudos se reparten el ángulo recto.» | «Para que arriba haya 70°, el alero tiene 20°: lo que le falta a 90°.» |

---

## 4. La predicción de cada idea

La app baraja las opciones. Los `datos` solo traen valores, nunca la fórmula. «Parcial» y «documentado» son el respaldo
del informe de trigonometría; lo demás son hipótesis de aula, sin dato, que se confirman con la medición.

**Idea 1.** «Ahora miras desde el ángulo de arriba, α, el que forma la escalera con la pared. ¿Cuál es el cateto opuesto
a α?» Datos: escalera, 5 m; pared hasta el apoyo, 4 m; piso entre el pie y la pared, 3 m.

| Opción | Qué mide |
| --- | --- |
| El piso, 3 m | Correcta |
| La pared, 4 m | El opuesto es «el lado vertical» (TR7 en la forma que describen De Kee y otros; parcial) |
| La escalera, 5 m | Confunde el opuesto con la hipotenusa (LAD-HIPOTENUSA, hipótesis nueva) |
| Ninguno: α no está en el piso | Cree que solo se mide desde el piso (LAD-SOLO-PISO, hipótesis nueva) |

**Idea 2.** «En ese mismo momento divide la altura entre el rayo de sol (de la punta del poste a la punta de la sombra).
Haz lo mismo con tu primo. ¿Cuál cociente es mayor?» Datos: poste, 6 m, y su sombra, 8 m; primo, 1,5 m, y su sombra,
2 m. Sin el largo de los rayos (los dos dan 0,6).

| Opción | Qué mide |
| --- | --- |
| Son iguales | Correcta |
| El del poste: todo es más grande | La razón depende del tamaño (TR8, parcial) |
| El de tu primo: su rayo es más corto | TR8 al revés (hipótesis) |
| Los dos valen 0,75, como altura ÷ sombra | Confunde el seno con la tangente (TR9, parcial) |

**Idea 3.** «Sabemos que sen 30° = 1/2. ¿Cuánto vale sen 60°?» Datos: sen 30° = 1/2; √3 ≈ 1,73.

| Opción | Qué mide |
| --- | --- |
| √3/2 ≈ 0,87 | Correcta |
| 1 | El seno es proporcional al ángulo (TR10, parcial) |
| √3 | Da el largo del lado y no el cociente (TR7, documentado con reserva: 56,10 %) |
| 1/2 | Mismo triángulo, mismo seno (NOT-MISMO, hipótesis) |

**Idea 4.** «El transportador marca 37°. ¿El ángulo mide exactamente 37°?» Datos: el transportador marca de 1° en 1°.

| Opción | Qué mide |
| --- | --- |
| No: mide unos 36,87° | Correcta (arctan 0,75 = 36,8699°) |
| Sí, exactamente 37° | Toma la convención por un valor exacto (APROX-EXACTO, hipótesis; es el «error objetivo» de la matriz) |
| No: exactamente 36° | Cree que el ángulo es entero (APROX-ENTERO, hipótesis) |
| Depende de la cuerda: con 6, 8 y 10 m sí es 37° | El ángulo cambia con el tamaño (TR8, parcial). Reemplaza a «no se sabe sin transportador», que el juego ya respondió |

**Idea 5.** «La calamina forma 25° con la viga. ¿Cuánto vale el coseno del ángulo de arriba?» Datos: sen 25° ≈ 0,42 y
cos 25° ≈ 0,91 (los dos, para que el alumno elija: criterio, no memoria).

| Opción | Qué mide |
| --- | --- |
| 0,42 | Correcta: cos 65° = sen 25° |
| 0,91 | Usa el mismo ángulo, cos 25° (COMP-MISMO-ANG, hipótesis) |
| 0,58 = 1 − 0,42 | Cree que sen + cos = 1, mezclado con sen² + cos² = 1 (COMP-RESTA, hipótesis nueva) |
| 2,37 | Da la recíproca, csc 25° (NOT-RECIPROCA, hipótesis). Cuidado: 1 ÷ 0,42 da 2,38; hay que calcularlo con el seno sin redondear |

---

## 5. Tabla de letras

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| θ | El ángulo agudo desde el que se nombran los lados | En Vectores θ es el ángulo entre A⃗ y B⃗ cola con cola: otra unidad, otro significado. Dentro de esta no choca |
| α | El otro ángulo agudo del mismo triángulo (α = 90° − θ), en las ideas 1 y 5 | **Choca entre unidades:** en Vectores α es «el ángulo agudo con el eje x». Se puede dejar (es la letra de los libros) o usar β aquí |
| CO | Cateto opuesto a θ | Siempre «desde θ». Si se mira desde α, se escribe «opuesto a α» con todas sus letras |
| CA | Cateto adyacente a θ | **Choca dentro de la figura:** si los vértices se llaman A, B y C, «CA» se lee como el segmento de C a A (en la figura actual es justo el adyacente: coincidencia peligrosa). Propuesta: en esta unidad los vértices no se rotulan, o se rotulan P, Q y R |
| H | Hipotenusa | La unidad siguiente y física usan h para una altura. Aquí no se usa h: la altura del poste es «CO» o «la altura» |
| sen, cos, tan | Las tres razones (idea 2) | Libros de academia y la escena `circunferencia-trig` escriben sen, cos y tan. Algunos libros escriben tg y la calculadora dice «sin». Se avisa una vez en el «Lee» |
| cot, sec, csc | Las recíprocas (idea 5) | Variantes de libro: ctg y cosec. Se usan las de la app |
| k | Cuánto vale cada parte (3k, 4k, 5k); también el factor de escala entre triángulos semejantes (mesa «semejantes») | Es el mismo significado en los dos usos. En física, k es la constante del resorte: otra unidad |
| x | La incógnita, en grados, de las ecuaciones de cofunción (idea 5) | Va con «°» en la respuesta (x = 16°) |
| 30°, 45°, 60°, 37°, 53°, 16°, 74° | Ángulos con nombre | **Choque de notación con Vectores:** Vectores escribe en sus datos «cos 37° = 4/5» con «=» (y el molde §4 pone ese ejemplo); esta unidad escribe «sen 37° ≈ 3/5». Hay que elegir una sola forma (pregunta 2) |
| √2, √3, ≈ | Raíces exactas; ≈ para todo valor redondeado | «=» solo para lo exacto; un decimal de calculadora siempre con «≈» |

---

## 6. Mapa de colores por papel (§5b)

`docs/molde-unidad.md` §11 ya lo dice para trigonometría: «los ángulos en carmín; los lados por papel (dato, dato, lo
que se pide)». Propongo eso, con una regla más: **el lado que la razón no usa va en tinta** (sin color, con su rótulo).
Hay un motivo de enseñanza: si el opuesto tuviera siempre el mismo color, el color nombraría el lado por el alumno, y lo
que esta unidad enseña es nombrarlo desde θ.

| Token | Papel | En esta unidad |
| --- | --- | --- |
| `h` carmín | ángulos | θ, α, 30°, 37°…, siempre con su arco y su letra. θ y α comparten carmín en las ideas 1 y 5; §5b ya pone «θ, α» juntos en ese color. Se distinguen por letra y arco |
| `o` naranja | primer dato | el primer lado que se conoce; en una razón, el numerador; la razón que te dan («tan θ = 8/15») |
| `i` turquesa | segundo dato o factor | el segundo lado que se conoce; en una razón, el denominador; k |
| `f` violeta | lo que se pide | la razón o el lado pedido; x |
| `d` verde | tercer dato | **no se usa en triángulos:** los lados se tocan y el verde junto al naranja o al carmín no se distingue (§5b). Queda para una figura compuesta con un tercer dato aparte |
| tinta | lado que no se usa | con rótulo y sin color |

Cómo queda en el juego, la predicción y «Mira» de cada idea (fijo dentro de cada idea):

| Idea | Naranja | Turquesa | Violeta | Tinta | Carmín |
| --- | --- | --- | --- | --- | --- |
| 1 | escalera (H), 5 m | pared | piso, lo que pide la misión (y el opuesto a α de la predicción) | — | θ, α |
| 2 | altura (CO) | sombra (CA) en el juego; rayo (H) en la predicción | el cociente | rayo en el juego; sombra en la predicción | θ |
| 3 | cateto frente al ángulo que se mira | hipotenusa | la razón | el otro cateto | 30°, 45°, 60° |
| 4 | base, 4 m | estaca (CO) | la cuerda, 5 m (lo que pide la misión) | — | θ (37°) |
| 5 | poste (CO de θ, CA de α) | calamina (H) | cos α (lo que se pide) | viga | θ, α |

**Aviso:** en la idea 2 el rayo y la sombra cambian de papel entre el juego y la predicción, porque es otra pregunta.
No rompe «dos variables de un mismo problema nunca comparten color», pero conviene que lo mire el lector en frío. Al
cambiar la paleta, `triangulos-rectangulos.js` (θ naranja, H verde) y la escena `circunferencia-trig` (paleta propia)
quedan distintas hasta que se rehagan.

---

## 7. Práctica: qué hay y qué falta por idea

Lo que existe hoy para la unidad:
- **La escena `circunferencia-trig`** (borrador, siete unidades): sus casos 1 a 5 son de esta unidad (semejanza 3-4-5 y
  6-8-10, seis razones con 5-12-13, notables de 30°, 45° y 60°, aproximados 37° y 16°); el 6 (elevación de 53°) ya es
  de la unidad siguiente. Tiene paleta propia y no está ordenada por idea.
- **Su papel:** de sus 10 problemas, el 1, el 2 y el 4 son de esta unidad (el 4 usa sec 60°, que es de la idea 5); el
  3, el del edificio con 37°, es de la unidad siguiente.
- **Tres mesas de laboratorio** en la teoría: `tres-razones` y `semejantes` (idea 2) y `complemento-libre` (idea 5).
- **Generador: ninguno** (el temario dice «Prácticas que ya existen: ninguna»). Hay parecidos en otros cursos:
  `geo-areas-triangulares` tiene un tipo `notables` (37° y 53° en un cuadrado), pero es de geometría; `trig-angulos-verticales`
  es de la unidad siguiente.

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Lados | nada | tipo «nombrar»: triángulo girado, θ en distintos vértices («¿cuál es el opuesto a θ?»); papel; una mesa |
| 2 Cociente | mesas `tres-razones` y `semejantes`; casos 1 y 2 de la escena; papel 1 y 2 | tipos «razón desde los lados», «dada una razón, halla otra» (k + Pitágoras), «razones en una figura» (cuadrado con punto medio, rectángulo, semicircunferencia: es lo que más sale en el banco y en San Marcos 2019-II) |
| 3 Notables | casos 3 y 4 de la escena | tipo «valor de una expresión con 30°, 45° y 60°» (solo sen, cos y tan); papel; una mesa |
| 4 3-4-5 | caso 5 de la escena | tipos «un lado con k» y «figura compuesta» (cartulina de San Marcos 2024-I, trapecio de 2024-II); papel; una mesa |
| 5 Complementarias | mesa `complemento-libre`; el generador de ecuaciones que hoy vive dentro de la teoría (`casoComp`) | sacarlo a la plantilla; tipos «expresión con recíprocas y notables» y «condición con co-razones» (San Marcos 2023-II, 2024-II, 2025-II); papel |

Propuesta: una plantilla nueva de formato `predicciones`, por ejemplo `plantillas/trig-razones-agudas/` (generador,
prueba, `casos.json` verificado aparte y `papel.json` de 5 a 10 por idea, con sus datos al final), con los tipos
separados por idea. `circunferencia-trig` queda como escena de «Más mesas del tema». También faltan ítems de esta unidad
en `catalogo/pruebas/trigonometria.json` (la prueba de entrada y salida no tiene ninguno).

---

## 8. Datos del mundo

La unidad casi no necesita datos del mundo: los objetos son de todos los días y sus medidas son de problema, pero tienen
que ser creíbles (punto 10).

| Dato | ¿Fuente? |
| --- | --- |
| Escalera de 5 m, poste de 6 m, primo de 1,5 m, techo de 20° a 25°, cuerda 3-4-5 | Son valores de problema, no datos del mundo: sin fuente. Hay que cuidar que sean posibles |
| La regla 3-4-5 de los albañiles para la esquina recta | Es un método conocido, no una cifra: sin fuente |
| «El sol a tal hora en Juliaca está a 37°» | **No usar.** Depende del día y de la hora; si alguna vez se quiere, necesita fuente (una calculadora solar oficial) y fecha |
| Pendiente máxima de una rampa (si se usa una rampa como ejemplo de tan θ) | Necesita fuente: la norma A.120 del Reglamento Nacional de Edificaciones. Hay que leer su valor exacto antes de usarlo; no lo afirmo de memoria |
| Inclinación mínima de un techo de calamina | Si se afirma como recomendación, necesita la ficha del fabricante. Si no, va como valor de problema («un techo de 20°») |
| La altura de un cerro con nombre (Huaynaroque) o de un edificio real | Necesita fuente (IGN o municipalidad). Si no, va un cerro sin nombre |
| Historia: Aryabhata y la semicuerda (año 499) | Ya trae fuente (MacTutor, Universidad de St Andrews) |
| 36,87°, 53,13°, 16,26°, 73,74° | Son cálculos (arctan 3/4 y arctan 7/24), no datos: se comprueban con un script aparte |

---

## 9. Preguntas para Gerson

1. **¿Van 37°/53° y 16°/74° en esta unidad?** Recomiendo que sí: el catálogo los pone como tema, San Marcos los
   preguntó en 2024-I y 2024-II, Vectores ya usa cos 37° = 4/5 y la unidad siguiente también. ¿Y 8°/82°, 37°/2 y 53°/2
   (tan 8° = 1/7, tan 37°/2 = 1/3), que usa el generador de ángulos verticales? Recomiendo dejarlos para la unidad
   siguiente o darlos como dato allí.
2. **¿Cómo se escribe la convención: «sen 37° = 3/5» o «sen 37° ≈ 3/5»?** Vectores y el molde escriben «=»; esta unidad
   escribe «≈» (que es lo honesto). Propongo «≈» en la teoría y en los datos «sen 37° = 3/5 (convención del examen)»,
   la misma forma en toda la app.
3. **¿Las seis razones o solo tres?** Recomiendo sen, cos y tan en la idea 2 y cot, sec y csc en la idea 5, porque el
   tema del catálogo es «Razones recíprocas y complementarias» y San Marcos pregunta seno con secante del complemento.
   Hoy el glosario dice que cot, sec y csc se definen en «Ángulos en posición normal»: hay que corregir uno de los dos.
   La otra opción es presentar las seis de golpe en la idea 2, pero es mucho para una sola idea.
4. **¿Cinco ideas o cuatro?** La idea 1 (nombrar lados) es nueva. Si prefieres cuatro, va dentro del «Lee» y el juego
   de la idea 2, pero se pierde su predicción, que mide el error más común. ¿Y quieres una sexta, «El triángulo
   escondido en la figura» (lo que más sale en el banco)? Mi propuesta es que vaya como nivel examen de «Ahora tú» en
   las ideas 2 y 4.
5. **¿Despejar un lado (CA = H · cos θ) va aquí o en «Resolución de triángulos rectángulos»?** Vectores pide solo esta
   unidad y usa A_x = A cos θ (lo da como dato). Si va en la siguiente, propongo que Vectores aconseje también
   `triangulos-rectangulos` (un requisito de otro curso solo aconseja, no cierra).
6. **`requiere`:** hoy pide `trigonometria.angulo-trigonometrico`, que es del mismo curso y por eso cierra la unidad,
   aunque aquí no se usan radianes. ¿La dejamos abierta desde el inicio (sería una raíz de trigonometría)? Y Pitágoras y
   semejanza no están en el `requiere` (Pitágoras está en `geometria.relaciones-metricas`, de 4.º): propongo darlos
   siempre como dato y recordarlos en el «Lee», sin agregar el requisito.
7. **Colores:** ¿apruebas «por papel» con el lado que no se usa en tinta (sección 6), o prefieres un color fijo para
   cada lado? El color fijo no entra bien en cinco colores sin poner el verde junto al naranja o al carmín, y además
   haría que el color nombre el lado por el alumno.
8. **Objetos:** ¿te sirven la escalera, el poste con su sombra, las escuadras con la loseta y la señal, la cuerda del
   albañil y el techo de calamina? Los dibuja la sesión como prueba y tú decides cuáles reemplazas.
9. **Notación local:** ¿las academias de Juliaca escriben tan o tg, csc o cosec, CO/CA/H o a, b, c? Uso las de la app
   salvo que digas otra cosa.
10. **Racionalizar:** ¿se acepta 1/√2 como respuesta o siempre √2/2? En los exámenes sale racionalizado. Propongo dar
    «1/√2 = √2/2» como dato y pedir la forma racionalizada en las opciones.
11. **Ficha del catálogo:** ¿cambio `grado: 3` por el público actual (5.º y preuniversitario), o eso se deja para
    después?
