# Auditoría de contenido: «Vectores» (fisica.vectores)

17 nov 2026. Auditor externo, sin editar la unidad. Contrato: `docs/plan-calidad.md` §3 (13 puntos) y §5; formato: `docs/teoria.md` 4e, 4f, 4h y §5. Lo ya corregido en `rutinas/frio/fisica.vectores.md` no se repite.

**Qué se revisó.** `contenido/teoria/fisica/vectores.js` (4 ideas, 60 ejemplos, «Ahora tú» con las semillas 0–11 y 500–505, «Así se resuelve» con las semillas 0–7 y 500–503, glosario, laboratorio), las piezas `flechas`, `fis-fuerzas` y `fis-dron`, la escena `plantillas/vectores/` con su papel y los 8 generadores con 3 semillas por tipo (en `velocidad-relativa`, los 19 subtipos) y sus `papel.json`. También se miró la app a 390 × 844 (mapa, Lee y Juega de las 4 ideas, los 60 ejemplos tarjeta por tarjeta, glosario, laboratorio y la escena). Las capturas y los scripts quedaron en el scratchpad de la sesión (`audit-vec/`).

**Cuentas.** Se rehicieron con un script propio que no usa el código de la unidad:
- 30 ejemplos: los 20 de nivel 3 y 10 de los niveles 1 y 2;
- las 54 respuestas de «Ahora tú» de las ideas 2, 3 y 4 (18 semillas por idea);
- 24 problemas de generador: `vectores-ley-cosenos`, 5 tipos × 3, y `vectores-componentes`, 3 tipos × 3.

**Todas cuadran: 108 de 108.** No hay ningún error de cálculo. Los problemas son de notación, de orden, de lo que se regala o se omite y de credibilidad.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 9 | `plantillas/velocidad-relativa/plantilla.json` (unidades: vectores, MRU, choques); `generador.js:528-640` | El generador no filtra por unidad. En 1000 semillas, 268 (27 %) son de la familia «botes», que exige conservar la cantidad de movimiento («Cantidad de movimiento: p = m·v… se conserva»). Ese tema llega dos unidades después (impulso y choques). En Vectores el alumno no tiene con qué resolverlos. | Que cada generador declare los tipos que sirve a cada unidad (`tiposPorUnidad`) y que la práctica de Vectores solo saque bote/marco/cruce/idavuelta. |
| A2 | 10, 13 | `velocidad-relativa/generador.js:350, 359, 398, 450, 458` | Usa ríos reales con medidas imposibles: el «Ucayali» sale de 24 m de ancho con 3,5 m/s, o de 48 m con 12 m/s; el «Rímac», de 36 m con 9 m/s (y por el Rímac no cruzan botes); el «Madre de Dios», de 48 m con 9 m/s. Un alumno de Pucallpa o de Puerto Maldonado aprende que su río es un arroyo torrentoso. El punto 13 pide que un dato del mundo real sea real y traiga su fuente. | Quitar los nombres reales («un río», «un canal de riego») o acotar ancho y corriente por río, con su fuente. Corriente ≤ 3 m/s. |
| A3 | 1 | `vectores.js:633-664` (resultante), `961-993` (componentes), `1312-1336` (productos) | Las ideas 2, 3 y 4 no tienen ningún objeto reconocible ni en Lee (sin dibujo), ni en Juega, ni en Predice, ni en Mira: solo flechas sobre fondo blanco. El plan (§7, etapa 1.3) pedía expresamente «la resultante, con dos personas jalando una caja». Los objetos (`fis-fuerzas`) existen, pero solo en la pestaña Ejemplos. | Usar `fis-fuerzas` en el Juega o en Lee: la caja con dos sogas para la resultante, la carretilla para las componentes, la llave o el costal para los productos. O declarar `sinObjeto` con su motivo (hoy el validador no lo exige). |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13 | `vectores.js:377` y `412` | El primer «Así se resuelve» de la idea 1 (semilla 0: «Una piedra cae con 9,8 m/s²…») es la misma pregunta que el primer «Ahora tú» (semillas 0 y 4). Se regala la respuesta. | Excluir de «Así se resuelve» semilla 0 el `DATOS_EV` que sale en «Ahora tú» semillas 0 a 5, o fijar otro índice. |
| M2 | 13 | `vectores.js:697` y `750` | El primer «Así se resuelve» de la idea 3 (5 N y 3 N a 120°, R = 4,36) tiene los mismos números que «Ahora tú» en las semillas 5, 8 y 11 (5 u y 3 u a 120°). | Sacar [5, 3, 120] de una de las dos listas. |
| M3 | 13 | `vectores.js:893` y `895` («Tres cuerdas en un nudo») | El recuadro Datos da «cos 143° = −4/5», el valor con signo. Justo el signo es lo que se mide, y la solución no usa ese dato: hace −10·cos 37°. | Dar «sen 37° y cos 37°», la regla de signos (`DT.signos`) y «θ medido desde un eje», como en «En el segundo cuadrante». |
| M4 | 13 | `vectores.js:935` («Una caja en la rampa») | El dato «En una rampa de 37°, el peso forma 37° con el eje y» es el paso hecho: el problema consiste en ver ese ángulo. | Dar «ángulos de lados perpendiculares son iguales» o nada; la solución lo explica. |
| M5 | 13 | `vectores.js:905-910` («Hacia dónde apunta la suma») | Pide el ángulo con +x (127°), pero los Datos solo traen el ángulo con «el eje x más cercano». Falta la herramienta para pasar de 53° a 127°. | Agregar la línea del generador `vectores-componentes`: «Con α el ángulo agudo con el eje x: I, α; II, 180° − α; III, 180° + α; IV, 360° − α». |
| M6 | 13 | Figuras de 23 de los 60 ejemplos (lista abajo) | El dibujo, que va entre los Datos y «Resuelto», ya escribe la respuesta. Los peores: «Máxima, mínima y a 90°» (`:595`) dibuja A = 12, B = 5 y R = 13, que son las dos incógnitas y la respuesta; «En el tercer cuadrante» (`:861`) rotula Aₓ = −15 y Aᵧ = −20, con el signo que se pide; «La componente que falta» (`:913`) dibuja b hacia abajo; «La fuerza que equilibra» (`:922`) rotula C = 40 N. | Que la figura del ejemplo muestre solo los datos del enunciado y que el estado resuelto vaya en un `figuraSolucion` dentro de «Resuelto». |
| M7 | 9 | `vectores.js:869-940` (ideas en el orden de `:1664`) | «Componentes» (idea 2) ya suma vectores, con R⃗ = A⃗ + B⃗, «fuerza total», «Hacia dónde apunta la suma» y «La fuerza que equilibra». Eso usa la resultante y el equilibrio antes de «Suma de vectores» (idea 3). | Mover esos 4 ejemplos a la idea 3, como «sumar por componentes», o presentar la suma por componentes en el Lee de la idea 2. |
| M8 | 9 | `vectores.js:199, 247-262` | La idea 1 ya rotula R y usa Pitágoras y la suma por ejes («Cuatro tramos por cuadras»), antes de las ideas 2 y 3. | Llamarlo «desplazamiento» en la idea 1 y dejar R para la idea 3. Pasar «Cuatro tramos» a la idea 2. |
| M9 | 9 | `vectores.js:215-222, 263-270` (rapidez y velocidad media); `1245-1272` (trabajo W en J, torque τ); glosario `:1558` | Conceptos de unidades posteriores (movimiento rectilíneo, trabajo y energía, estática) entran en nivel 2 y 3 con la fórmula en Datos, pero sin el concepto. El alumno multiplica sin saber qué calcula. | Reemplazarlos por contextos de vectores: componentes de una fuerza o área de una chacra. O mover estos ejemplos a sus unidades. |
| M10 | 9 | `catalogo/cursos/fisica.json:41`; `vectores.js:88-89` y `:892`, `:909` | `requiere` solo trae las razones de ángulos agudos, pero la unidad usa cos 120°, cos 143°, sen 120°, ángulos de 127°, 143° y 270° «desde +x», y la reducción al primer cuadrante. Esto está en `angulos-en-posicion-normal` y `reduccion-al-primer-cuadrante`, que no figuran en el `requiere`. | Agregar «cos(180° − α) = −cos α» al Lee de «Suma de vectores» (la sombra que cae detrás ya lo motiva) o al `requiere`, como consejo. |
| M11 | 7 | `vectores.js:653` (Juega de la resultante) | La lectura dice «θ = 98° → R = 6,73 (A + B = 10)». Es literalmente el caso que Gerson señaló en el plan (§1: «no trae unidades ni explica el paréntesis»), y sigue igual. | Poner «R = 6,73 u; puede ir de 2 u (A − B) a 10 u (A + B)», o el rastro de A − B y A + B en la figura. |
| M12 | 7, 5 | `:1328` (productos), `:984` (componentes), `:1574` y `:1627` (mesas) | El separador «·» se lee como multiplicación en la unidad que enseña el producto. Por ejemplo, «A⃗·B⃗ = −1,67 · \|A⃗×B⃗\| = 11,88» o «\|A\| = 4,47 · û = 0,89î + 0,45ĵ» se leen como igualdades falsas. | Separar con un salto de línea o «   \|   », nunca con «·». |
| M13 | 5 | `vectores.js:953, 1303-1305, 1364, 1483, 1496, 1541-1561`; rótulos de `flechas` | En el texto plano los vectores van sin flecha: «A = 3î + 2ĵ quiere decir…» (Lee), «el producto escalar, A · B», «B × A mide lo mismo», la lectura de la mesa 3D `[A, ' · ', B]` y el glosario «A = 6î + 8ĵ: û = …». En las figuras, la flecha se rotula «A» o «A × B» sin flecha. | Escribir «A⃗» (U+20D7, como hacen los generadores con `P.vec`) en el texto plano y en los rótulos sin valor; con valor, «A = 6» queda bien. |
| M14 | 5 | `vectores.js:94, 109, 973, 1018, 1051` y generadores (`productos`, `unitario`, `componentes`) | El módulo se escribe de tres maneras: A, \|A\| (barras sin flecha) y \|A⃗\|. Las tres aparecen en el mismo ejercicio: en «Así se resuelve» de componentes, Datos dice «Aₓ = A cos θ» y la regla «Aₓ = \|A\| cos θ». | Elegir una convención (A, o \|A⃗\| para las expresiones) y prohibir \|A\| en el validador. |
| M15 | 5 | Teoría: «Aᵧ» (22 veces, `:787, 953, 1019, …`); generadores: «A_y», «B_y», «v⃗_AB» (datos y `papel.json`) | La y del subíndice es una gamma griega (U+1D67) y se ve «Aγ». En práctica y papel sale un guion bajo literal: «AₓBₓ + A_yB_y», «v⃗_AB = v⃗_A − v⃗_B». | Usar `{ sub }` en las ecuaciones. En el texto plano, escribir «componente y de A» o un subíndice real en HTML. Que el validador rechace U+1D67 y «_[a-z]» en texto visible. |
| M16 | 5 (regla 4) | Escena `plantillas/vectores/index.html` (a⃗ azul, b⃗ marrón, θ verde); `vectores-componentes` (C rojo, D verde igual que R) | Un mismo símbolo cambia de color entre momentos. En la teoría A es naranja, B turquesa, θ rojo, R verde y C violeta. En la escena θ es verde, el color de R en la teoría. En el generador, D y R comparten el verde dentro del mismo problema. | Un mapa de colores por unidad que lean la teoría, la escena y los generadores, y una prueba que lo compare. |
| M17 | 3, coherencia | `vectores.js:178, 363, 1538`; escena (paso 1); `vectores-unitario` («sentido contrario») | La escena define «dirección = la recta; sentido = hacia dónde apunta». La teoría dice «dirección (hacia dónde apunta)» y el glosario «tamaño, dirección y sentido», sin definir ninguna de las dos. En admisión se pregunta por esa diferencia (antiparalelos). | Término «dirección y sentido» en el glosario con `simple` y 3 ejemplos, y una tarjeta en el Lee de la idea 1. |
| M18 | Coherencia, §3 final | «Ahora tú» de las 4 ideas (`:408, 1073, 746, 1432`) | Todos los «Ahora tú» son de un paso, de nivel 1: ley de cosenos con A, B y θ dados, módulo o componente x en el primer cuadrante, producto con componentes. El contrato dice que «Así se resuelve» y «Ahora tú» terminan en nivel de examen. Componentes nunca pide signos por cuadrante ni el ángulo desde las componentes, que es lo típico del examen y lo que enseñan los ejemplos de nivel 2 y 3. | Agregar tipos de nivel 2 y 3 (cuadrante con signos, máx/mín → R, ángulo desde el escalar) y alternarlos por semilla. |
| M19 | Niveles | Ejemplos de la resultante, nivel 2 (`:518-564`); productos, nivel 3 (`:1245-1272`) | En la resultante, 4 de los 5 ejemplos de nivel 2 son la misma cuenta que el último de nivel 1 (ley de cosenos con un notable). En productos, «El trabajo de jalar un costal» y «La llave y la tuerca» (nivel 3) son la multiplicación de nivel 1 con otro nombre. | Nivel 2: dos pasos de verdad (diferencia de vectores, R dado → ángulo). Nivel 3: problemas de examen (A⃗ ⊥ (A⃗ − B⃗), área desde \|A⃗\|, \|B⃗\| y A⃗·B⃗). |
| M20 | 13 | `vectores-poligono`, tipo «desde-vertice» | Los Datos (ángulo central, radio = L/√3 y «cola con punta») no alcanzan para el camino de la solución (AX⃗ = OX⃗ − OA⃗ y que la suma de los radios es 0⃗) ni para el camino natural (AB⃗ + AC⃗ a 60° con la ley de cosenos y cos 60°). | Agregar «vector entre dos puntos: final menos inicio» y «los vectores del centro a los vértices suman 0⃗», o la ley de cosenos con cos 60°. |
| M21 | 13, 9 | `herramientas/papel-generador.js:32-35`; los 8 `papel.json`; `plantillas/vectores/papel.json` | En el papel, «Datos: …» y «Alternativas: A) … E) …» van dentro del mismo párrafo del enunciado. Eso choca con el recuadro aparte del punto 13 y con la indicación «resuélvelos antes de mirar las alternativas». El papel de la escena trae además dos problemas de análisis dimensional (9 y 10), que ahora son de «Magnitudes y unidades». | Campo `datos` aparte (`app.js:1302` lo pinta como recuadro) y alternativas dentro de `<details>`. Mover los problemas 9 y 10 al papel de Magnitudes. |
| M22 | 10 | `velocidad-relativa/generador.js:533-640` | «Un bote lanza un saco de 12 kg a 12 m/s» (43 km/h), o sacos de 30 kg a 12 m/s: nadie lanza así. | u ≤ 4 m/s para sacos de 10 kg o más. |
| M23 | 5 | Lab 3D (`nucleo/fisica3d.js`, lectura «A = (2, 1, 1)»); generadores «(x; y)»; teoría «aî + bĵ» | Hay tres notaciones de vector, y una usa la coma en un país de coma decimal («(2, 1, 1)» junto a «2,45»). La mesa 3D va primera en las ideas 2 y 4, y la teoría nunca enseña componentes en 3D. Los generadores `productos` y `unitario` también usan k̂ en 3D. | Unificar en «(x; y; z)» o en «aî + bĵ + ck̂». Agregar una tarjeta 3D en el Lee de Componentes o sacar la mesa 3D de la idea 2. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 5 | `:708, 765, 1395, 1410` | El reemplazo pierde la función: «2 · 5 · 3 · (−0,5)», «· −0,5» sin paréntesis, «8 · 5 · 0,8». Además, Datos dice −1/2 o 4/5 y la cuenta usa decimales. | Escribir «2 · 5 · 3 · cos 120° = 2 · 5 · 3 · (−1/2)». |
| B2 | 5 | `:256`; `:717`, `:722`; `:1051` | Faltan colores: «2 al sur» sin color, el enunciado del rango sin A y B coloreados, la regla «A − B ≤ R ≤ A + B» con A y B planas, la θ de la regla de componentes sin color. | Usar `dA`, `dB` y `th`. |
| B3 | 3 | Juega de la resultante y de productos; «Ahora tú» de la resultante | «A = 6», «miden 4 y 3», «5 u»: la «u» no se dice en ningún lugar de la unidad. | Una línea de leyenda: «u: unidades de largo, cualquiera». |
| B4 | Fidelidad | `:1002-1003` (Predice de componentes) | A = 6î + 8ĵ se dibuja en (3; 4) y û con largo 1: se ve como 1/5 de A, cuando es 1/10. | Dibujar A y û a escala, o no dibujar û en la revelación. |
| B5 | 5 | `:1411` | «Apunta fuera del plano, según k̂» con solo el ángulo: el sentido (±k̂) no se puede saber. | Decir «perpendicular al plano; el sentido lo da la mano derecha». |
| B6 | 5 | «Ahora tú» de productos | «1 k̂», «5î − 1ĵ», «−3î + 0ĵ». | Formatear 1 → «k̂», «−ĵ», y omitir el término 0. |
| B7 | 7 | `:710, 739` | «√49 ≈ 7 N» (es exacto); la respuesta dice «R = 4,36 N» cuando la cuenta dio ≈. | «= 7 N»; «R ≈ 4,36 N». |
| B8 | 10 | `:489, 566` | Dos «equipos» de soga con 600 N y 450 N (dos personas); la corriente del Coata a 3 m/s (un río de altiplano, lento). | 1500 N y 1200 N; corriente de 1 m/s. |
| B9 | Variedad | «Así se resuelve» de productos, tipos 0 y 1 | Solo 4 casos por tipo, y las semillas 0, 4 y 500 dan el mismo. «Otro ejemplo» se repite. | Agregar casos o mezclar la semilla. |
| B10 | 3 | `:212, 225`; `:1266` | Δx y τ se usan antes de decirlos en palabras. | Nombrarlos en Datos («Δx: el desplazamiento en la recta»). |
| B11 | 5 | Escena `vectores` vs teoría | La escena usa a⃗, b⃗ y â; la teoría, A⃗, B⃗ y û. En la escena, «\|a\| 4,12» contradice su propio texto («la letra sola es el módulo»), y el rótulo «θ = 57,5°» se tapa con «\|a⃗\| = 4,12». | Mismas letras y una sola convención de módulo; correr el rótulo de θ. |

**Ejemplos cuya figura escribe la respuesta (M6), 23 de 60.**
- Escalar: carretilla, kilómetros, 3 y 4 cuadras, cuatro tramos, media vuelta.
- Componentes: cuerda a 37°, vector a 53°, largo desde componentes, segundo y tercer cuadrante, sumar por componentes, de componentes al ángulo, hacia dónde apunta, fuerza que equilibra, rampa.
- Suma: perpendiculares, ley de cosenos con 60°, dos cuerdas a 120°, dos lanchas, río Coata, avioneta, máxima y mínima a 90°.
- Productos: chacra en paralelogramo.

## Lo que está bien y hay que copiar al molde

- **Cuentas sin errores:** 108 de 108 rehechas aparte. Los comentarios de las constantes `EJEMPLOS_*` dicen qué se revisó: se puede auditar.
- **Datos que dan herramientas.** Un `DT` compartido arma los Datos de toda la unidad desde una sola fuente, y `COS`/`SEN` dan solo los valores que el ejercicio usa. El mejor molde del punto 13 está en dos generadores:
  - `vectores-componentes`: ángulo de referencia, regla del cuadrante (I α, II 180° − α…) y signos (+;+)/(−;+), nunca el valor con signo;
  - `vectores-ley-cosenos` (`lineasDatos`): si se pide el ángulo, va la tabla de academia y «cos(180° − α) = −cos α», nunca el cos θ que sale.
- **Criterio, no memoria.** «Ahora tú» de productos da las dos fórmulas (escalar y vectorial) y el distractor «cruz» mide si el alumno eligió bien. Los generadores de la ley de cosenos dan la fórmula de la suma y la de la diferencia.
- **Distractores con error nombrado** y `siFuera` que empieza por lo que el alumno pensó bien («Sería cierto si apuntaran al mismo lado»). Las escalares de la idea 1 traen su trampa propia (−8 °C, «cae», «el tiempo avanza»), y las preguntas no dicen «hacia dónde».
- **«Así se resuelve» con «¿Tiene sentido?» que comprueba de verdad:** R entre \|A − B\| y A + B; û² = 1; la diagonal es más corta que el camino. Empieza por el caso difícil (120°, el término resta).
- **Figuras desde los datos:** `colaPunta`, `prod` y `compA` se reusan en Juega, Mira y Ejemplos, así que el ángulo y el largo dibujados son los del problema. `fis-fuerzas` dibuja objetos reales con una sola escala y la marca `data-prueba`.
- **Misión, leyenda, actividad, palabras con `simple` y laboratorio agrupado por idea:** todo presente. El glosario trae 3 ejemplos o más por término.
- **El `escenaViva` de `vectores-ley-cosenos`** no dibuja figura en los tipos que piden el ángulo («mostraría la respuesta»). Es el criterio que falta en los ejemplos de la teoría (M6).

## Reglas que faltan en el contrato o en el validador

| Regla | ¿Automática? |
|---|---|
| **Vector con flecha en todo texto visible**, no solo en ecuaciones: la unidad declara `vectores: ['A','B','R','C','F','d','r']` y se rechaza «A = …î», «A · B» o «A × B» sin U+20D7 o `{vec}`, en texto plano, rótulos de pieza y lecturas. Es la regla de `{ vec }` del filtro 1 del plan, que hoy no está en `nucleo/teoria.js`. | Sí (regex sobre `Ecuacion.texto` de todos los campos y rótulos de `datos` de pieza). |
| **Una sola notación de módulo**: prohibir «\|A\|» (barras sin flecha), o al revés, según lo que decida Gerson. | Sí. |
| **Subíndices reales**: rechazar U+1D67 (ᵧ) y «_x», «_y», «_AB» en texto visible, también en generadores y papel. | Sí. |
| **Separador de la lectura**: prohibir «·» entre dos relaciones (dos «=») en lecturas y leyendas. | Sí. |
| **`datos` obligatorio con `calidad: 2`** en ejemplos, «Ahora tú» y «Así se resuelve». Hoy `datos()` sale si `ds === undefined`. | Sí. |
| **Sin el valor con signo cuando el signo se mide**: si la pregunta pide componentes o un ángulo, los Datos no traen cos o sen de un ángulo mayor de 90°; traen el de referencia y la regla de signos. | Semi (heurística: ángulo > 90° en Datos + respuesta con signo → aviso). |
| **La figura no escribe la respuesta**: comparar los números de `respuesta` con los rótulos y valores de la figura del enunciado; separar `figura` de `figuraSolucion`. | Sí (como el script de esta auditoría: 23 casos). |
| **«Así se resuelve» no repite «Ahora tú»**: enunciado normalizado (mismos números) de resuelve en las semillas 0–3 distinto del de «Ahora tú» en las semillas 0–11. | Sí. |
| **«Ahora tú» llega a nivel de examen**: cada tipo declara `nivel` y al menos uno es 3 (contrato §3, último párrafo). | Sí (que exista); que sea de examen, no. |
| **Orden dentro de la unidad**: los términos del glosario usados en ejemplos, «Ahora tú» y Datos de la idea k deben estrenarse en una idea ≤ k (extender `Glosario.porIdea` a esos textos). | Sí. |
| **Orden entre unidades**: un término del glosario global que pertenece a una unidad fuera de la cadena `requiere` (cantidad de movimiento, trabajo, torque, rapidez media) dispara un aviso. | Sí, con el glosario global. |
| **Generador compartido entre unidades**: `tiposPorUnidad`, y la práctica de cada unidad solo saca sus tipos. | Sí. |
| **Lugares reales con rangos reales**: una tabla `nucleo/lugares.json` (ancho y corriente de cada río, alturas) con su fuente; el generador valida sus números contra ella. | Sí. |
| **Un mapa de colores por unidad** que lean la teoría, la escena y los generadores; dos variables del mismo problema nunca comparten color. | Sí. |
| **Objeto en la primera pantalla o `sinObjeto`** (filtro 1 del plan): tampoco está implementado. | Sí (buscar `data-objeto` en el SVG de Lee o Juega). |
| **Papel con `datos` aparte y alternativas plegadas**, para que no se lean antes de resolver. | Sí, en `papel-generador.js`. |
| **Dirección y sentido** se definen una vez en la primera unidad de vectores (contenido, no validador). | No. |
