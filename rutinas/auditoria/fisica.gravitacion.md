# Auditoría de contenido: «Gravitación universal» (fisica.gravitacion)

26 nov 2026. Auditor externo con criterio delegado (`docs/metodo/unidad/cierre-delegado.md`; fases 7 y 8), que no
escribió la unidad (la escribió Codex en `codex/etapa10-fisica-gravitacion`; integrada en el worktree `e9-fisica`, rama
`integra-fisica`). Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10 y las lecciones 1–19 de
`docs/metodo/unidad/etapa-delegada.md`. Decisiones del autor: `docs/etapa10/propuesta-fisica.md` §9 e
`informe-fisica.md`. La investigación larga de etapa 10 de esta unidad no existe todavía
(`docs/investigacion/etapa10/estado.md`: «PENDIENTE»); solo hay la breve. Lo que vieron los dos lectores en frío está en
`rutinas/frio/fisica.gravitacion.md`; aquí se cita cuando el código lo confirma.

Codex no hizo capturas ni inspección visual y su suite general no cerró: todo se tomó como no verificado y se miró con
capturas (servidor propio en el puerto 4222): los 42 momentos y las 90 tarjetas a 390 px antes
(`scratchpad/cierre-grav/lector/`) y después (`…/despues/`), el glosario, el laboratorio y la mesa 3D `orbita-plano-3d`
abierta, con controles al máximo y girada, a 390 y 1280 px (`…/lab3d/`, `…/lab3d-despues/`).

**Qué se revisó.**
- La teoría `contenido/teoria/fisica/gravitacion.js` (6 ideas, 7 momentos cada una, 90 ejemplos, 20 términos de
  glosario, una mesa 3D, tabla de letras) y sus nueve pruebas `gravitacion*.test.js`.
- La pieza nueva `nucleo/kit/piezas/fis-gravitacion.js` y su prueba. La pieza compartida `fis-espacio-3d` no se tocó.
- La práctica `plantillas/fis-gravitacion/` (18 tipos, `TIPOS_POR_IDEA`, 20 casos, 8 de papel) y las escenas viejas
  `gravitacion` y `dinamica-fuerzas` (con `rehacer`).
- Los pares de reserva de la prueba del curso (`catalogo/pruebas/fisica.json`) y la migración `GV` de `nucleo/avance.js`:
  sus pruebas en verde; no se cambiaron.

**Cuentas** (scripts propios en `scratchpad/cierre-grav/cuentas/`; leen las entradas de cada caso y lo que ve el alumno,
y calculan con física propia, sin el código de la unidad):
- `recalcular.js`: **4 800 casos** (400 semillas × 6 ideas × «Así se resuelve» y «Ahora tú»), cada respuesta desde sus
  entradas con su fórmula newtoniana (superposición con signos por posición, punto nulo por la raíz de la razón de masas,
  energías con −GMm/r, órbitas con v = √(GM/r) y T = 2πr/v, Kepler con T² ∝ a³ y r·v constante en los extremos, escape
  y retorno por conservación). Antes y después de corregir: **0 no cuadran**.
- `opciones.js`: las 2 400 de «Ahora tú»: la opción correcta es el valor recalculado a la cifra mostrada, ninguna opción
  se repite y cada «Así sale X» dice el texto de su opción.
- `ejemplos.js` + `recalcular-ej.js`: **los 90 ejemplos** cuadran (los seis con otros nombres de entrada, a mano: 185,28 N;
  133,4 N; 0 N; 8,694 N/kg; 45 N; 14 000 km).
- Las 6 predicciones con sus 18 distractores (240/480/960/40 N; 2/4,5/6/18 N/kg; +6/−6/−18/+12 GJ; 4 km/s; 24/12/6/48
  años; 5/10/2,5/20 km/s) y las 6 misiones (k = 2; 40 kg; 16 000 km; 5 km/s; 4 h de 20 h; 10 km/s): una sola respuesta
  cada una.
- Práctica: 3 semillas por cada uno de los 18 tipos (54 problemas) a mano: todos cuadran. El oráculo de Codex
  (`oraculo.test.js`, 7 200 casos) sigue en verde.
- `creible.js`: densidad mínima de cada fuente para que el punto estudiado quede fuera de ella (o la densidad con R
  dado). **No** recalculé aparte los 6 900 distractores de «Ahora tú» uno por uno contra su código de error: lo hacen
  las pruebas de Codex, que no importan el calculador del contenido; yo comprobé su formato y que no repitan la correcta.
- Validador con `calidad: 2` simulada (`gravitacion.test.js`, 400 semillas): 0 problemas, antes y después. Reglas del
  papel con la marca simulada (comando de la Etapa 7): limpias. `ecuaciones-ancho.js`: 21 renglones mal partidos antes, 18
  después (ver M12).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 5, 7 | Todas las figuras de la unidad (pieza `fis-gravitacion`, `textoSVG`) | Cada letra iba en un `<tspan>` con su x estimado: «Ref er encia», «Ct r o planet a» (por «Otra»), «GM» leído «CM», «10² ⁴», «F_ref  = 160». Los dos lectores lo señalaron en todas las pantallas; «CM» contradice el «GM» de Datos. La prueba de la pieza no lo veía (mide cajas, no letras). | El texto corre seguido en un solo tspan; los subíndices bajan y suben con `dy`; solo la letra con flecha conserva su x. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Lección 8; molde §2 | «Así se resuelve» y «Ahora tú» de las 6 ideas | Los dos generadores eligen el tipo con `s % n` y la app los arranca a los dos en la semilla 0: en 400 de 400 semillas «Ahora tú» repite el tipo del resuelto con otros números (captura: 820 N y 320 N con los mismos factores 2; 1,5; 2). El modelo (`trabajo-y-energia`) da tipos distintos. | «Ahora tú» empieza en otro tipo (desfase de 4, 4, 7, 7, 7 y 6). |
| M2 | 10 | 15 tipos de los generadores | Fuentes imposibles: R = 2000 km con GM hasta 2,7 × 10¹⁵ m³/s² (10⁶ kg/m³; g₀ = 182 N/kg), campos superficiales de 369 N/kg, sondas a 1300–3000 km del centro de planetas de 10²⁴–10²⁵ kg (hasta 6 × 10⁵ kg/m³). La Tierra tiene 5500 kg/m³. | Radios, campos y distancias con densidad ≤ 15 000 kg/m³ en todos los casos generados (prueba nueva). |
| M3 | 7; lección 7 de E8 (M8) | Juegos 1 y 2 | Con el avance automático, el control decía «1,1 veces» y el dibujo 13 599,24 km; «23 kg» y el dibujo «m ≈ 23,5 kg», «F ≈ 146,872 N», que no cuadra con ninguna (lector A). | Dibujo y lectura con el valor que muestra el control; la lectura del juego 2 enuncia «Peso: 40 kg · 6,25 N/kg = 250 N». |
| M4 | 13 (atajo); lección 7 | Datos de los tipos de razón de la idea 1 | Datos daba el atajo de cocientes F_nueva/F_ref = … · (r_ref/r_nuevo)², y a 390 px «)²» quedaba solo en otro renglón (lector A, dos pantallas). | La ley general F = G·M·m/r² y «G es la misma en los dos ensayos»; el atajo se deriva en Mira y en el resuelto. |
| M5 | 4; figuras | Idea 3: Predice, Regla, ejemplos 7 y 14, generadores | r₁ = 10 000 km y r₂ = 20 000 km se dibujaban a la misma distancia (lector A: «lo que cambia es justo la distancia»). | La posición más lejana se dibuja más lejos (proporción entre las dos; con solo energías, r ∝ 1/|E|). |
| M6 | 3, 9, 13; lección 6 | Idea 5 | (a) «a» era el semieje y el subíndice del extremo lejano (r_a, v_a). (b) «Así se resuelve» y «Ahora tú» piden r = a(1 ± e) y la regla no lo decía. (c) Ejemplo 3: «separaciones extremas al centro» (al centro de la elipse sería otra cosa). (d) Ejemplos 14 y 15: A y B son cuerpos y también letras de alternativa («A: supone…»). (e) Ejemplo 8 (nivel 2, 36 h · 15 %) más fácil que el 3 (nivel 1). | (a) Subíndices «cerca» y «lejos»; (b) la regla trae r_cerca = a·(1 − e) y r_lejos = a·(1 + e); (c) «entre la sonda y el centro del planeta»; (d) alternativas explicadas por su valor, en negrita; (e) el período va en días y se pide en horas. |
| M7 | 5; lección 14 | Varias ideas | Texto crudo que la teoría no convierte: «GM_A», «g_x» (enunciados de campo), «F_A = G·M_A·m/r_A^2» (Datos, 1.14), «g_superficie», «r_2 = R + h_2», «h_max = r_max − R», «−F_A + F_B»; subíndices anidados «v_escnueva», «E_PG_1» (lectores A y B). | Nodos de notación; subíndices con coma (v_esc,ref; E_PG,1). Prueba nueva que recorre Datos, enunciados y pasos. |
| M8 | 6, 12 | Reglas y Datos | Jerga: «distribución radial» (4 sitios), «una balanza mide apoyo», «la gravedad realiza el trabajo opuesto», «la energía mecánica fija si la sonda retorna», «Parte del intervalo (0 inicio, 1 final)», «1 veces el campo local», «depende del cuadrado de su separación» (no dice que la disminuye). | Cada frase reescrita en palabras del alumno. |
| M9 | Molde §3 (pasos) | 1.14, 2.8, 2.14, 3.8, 3.14 | El resuelto saltaba el paso difícil: r_A = D/(1 + √…) sin r_A + 0,75 r_A = D; r = R·√(g₀/g) sin decir que se despeja; r = 16 000 km sin reemplazo ni GJ → J; E_PG,1 y E_PG,3 sin cuenta; dos distractores con la misma explicación; «omite sumar separaciones» no decía qué hizo. | Pasos añadidos con su cuenta; cada distractor con su operación. |
| M10 | 2, 12; molde §2 (la regla dice todo) | Idea 4 | La regla no traía la energía de la órbita que piden «Así se resuelve» y «Ahora tú»; Tilo hablaba de «la mitad de la potencial» sin fórmula; el reloj del juego no se movía y la lectura decía «vemos solo el lanzamiento» (lector B). | E_M = −G·M·m/(2r) en la regla; lectura «g mayor que v²/r: no sigue este círculo; el reloj espera». |
| M11 | Figuras; 3 | Idea 6 | «r₀ = ?» en Predice y en 6.3 cuando el dato está en Datos; la salida desde la superficie (6.14) dibujada lejos del planeta; «M nueva: 1 veces». | «r₀ = 4 R» o «r₀» sin «?»; la sonda en la superficie; un factor 1 no se escribe. |
| M12 | Lección 19 | Ejemplos 4.5, 4.14, 2.13 | Tres igualdades partidas dentro de un paréntesis a 390 px. | Fracciones en vez de cadenas de «÷»; en 2.13 el apoyo usa el campo ya calculado. Quedan 16 resultados cortos tras «=» (los arregla la app) y 2 tras «·» (B9). |
| M13 | 8; rótulos | Mesa 3D `orbita-plano-3d` | La escena ocupaba un tercio del cuadro; el rótulo r tapaba la flecha de g⃗, que no se veía (captura girada y con controles al máximo). | Escala 0,95; sin rótulo r (el radio es el trazo turquesa que nombra el control); flecha de g⃗ con escala 0,06, sin entrar al planeta. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 13 | Datos de órbitas y energía; Predice 5 | «1 min; 1 h; 1 MJ» y «1 km/s» en todos los casos; «1 UA = 149 597 870 700 m» en Predice (lectores A y B). | Solo las equivalencias que el caso usa; «1 UA ≈ 150 millones de km». |
| B2 | 5b | GM y g en tinta | Decisión 4 de Codex (campo y energías en tinta). El lector B no reconoce GM cuando M era violeta. | Queda: Gerson decide. |
| B3 | 10 | 10 ejemplos (1.15, 2.6, 2.8, 2.9, 2.13, 3.6, 6.6, 6.12, 6.13, 6.15) | Densidades de 16 000 a 60 000 kg/m³ (6.6: g₀ = 50 N/kg). Menos extremo que M2. | Queda (rehacer el ejemplo con sus cinco alternativas); anotado. |
| B4 | 5 | Práctica `fis-gravitacion` | «E_PG», «r_A», «S_barrida» en texto plano: la app (`conSub` de `app/practica.js`) solo convierte subíndices de 1–3 minúsculas. Igual en `fis-energia`. | Queda: es de la app (fuera de alcance). |
| B5 | 6 | Datos de la práctica | «Fuente esférica fija dominante; salida radial exterior hacia afuera…»; distractores de rapidez o altura negativas; campo-nulo y superposición con densidades de 18 000–19 000. | Queda. |
| B6 | 10 | Respuestas | Tres decimales con G aproximada («≈ 5 252,625 N»). | Queda (es el formato de la unidad). |
| B7 | Figuras | Mira 5 paso 1 (dos círculos donde a = r), centro de la elipse sin marcar, figura de la regla 1 con números que nadie usa, regla 2 sin R ni h, juego 6 con referencia = elegido al abrir. | Queda. |
| B8 | Ecuaciones | 2.9, 2.11 | «g_x = −1 · … + 1 · …» se parte tras «·»; el factor ±1 escrito sobra. | Queda (su prueba cuenta esas cifras). |

**Lo que el lector en frío vio y el código confirma**: A1, M3–M11, B1, B2, B7.

## Lo que está bien y hay que copiar al molde

- **Las cuentas**: 4 800 casos, 90 ejemplos, 6 predicciones y 6 misiones cuadran por otro camino; las pruebas de Codex
  usan fracciones, bisección, integración de la fuerza y RK4 para Kepler, sin importar el calculador.
- **La física de los límites**: la órbita circular solo se anima con la rapidez correcta; Kepler avanza con la ecuación de
  Kepler, no con ángulos iguales; escape radial con «sin aire ni empuje».
- **El glosario local** que separa la energía potencial general del m·g·h de Trabajo y energía sin cambiar la otra unidad.
- **Cada siFuera empieza por lo rescatable y da su valor** («Bien … Así sale X»), comprobado en 400 semillas.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **El texto de una pieza corre seguido**: un `<text>` no lleva un tspan con x propio por letra. | Sí (en la prueba de cada pieza; ya en `fis-gravitacion.test.js`). |
| **«Ahora tú» y «Así se resuelve» no son del mismo tipo con la misma semilla** (la app arranca las dos en 0). | Sí (en `Teoria.problemas`: comparar `verificacion.tipo` en 60 semillas cuando ambos la traen). |
| **Texto crudo en la teoría**: ningún «X_y», «^» ni subíndice anidado en Datos, enunciados o pasos (la teoría no convierte «_»). | Sí (en `Teoria.problemas`, sobre las cadenas de esos campos). |
| **Planetas posibles**: densidad ≤ 15 000 kg/m³ entre la masa de la fuente y el punto estudiado. | Semi (en la prueba de cada unidad de gravitación; los campos varían). |
| **Equivalencias que se usan**: una línea «1 X = …» solo si X aparece en el caso. | Semi (unidad por unidad). |
| **Control y dibujo con el mismo valor** (ya propuesto en Trabajo y energía, se repitió). | Sí (evaluar dibujo y lectura en valores intermedios del control). |

## Correcciones (26 nov)

Todo lo Alta y Media corregido, cada cosa con su prueba (falla con la versión anterior). Archivos: la teoría, sus pruebas
y la pieza con su prueba. No se tocaron `app/`, `nucleo/teoria.js`, `fis-espacio-3d`, la práctica ni la prueba del curso.

| # | Qué se hizo | Prueba |
|---|---|---|
| A1 | `textoSVG` agrupa el texto en un tspan; subíndices con `dy`. Capturas después: «Referencia», «GM = 4 × 10¹⁴ m³/s²», «F_ref» con subíndice. | `fis-gravitacion.test.js`: «el texto corre seguido…». |
| M1 | Desfase del tipo en los seis `entrada` (bancos separados como antes: ninguna firma de «Así se resuelve» aparece en «Ahora tú»). | `gravitacion.test.js`: «Ahora tú no repite el tipo…» (60 semillas × 6). |
| M2 | Ley: superposición a 6000–8000 km, punto de equilibrio con razones 1,5–4 y D de 20–27 Mm. Campo: g₀ de 6–16 N/kg, R de 5–8 Mm, superposición a 6–8 Mm, punto nulo con razones 1,5–3. Energía: R de 6 y 7 Mm. Órbitas: R de 5,1/7,2 y 5,2/7 Mm. Escape: R de 6 Mm («Ahora tú») y 10 Mm («Así se resuelve»). Recalculado: 4 800 casos cuadran, 0 con ρ > 15 000. | `gravitacion.test.js`: «densidades posibles» (4 800 casos). |
| M3 | `Math.round` a la cifra del control en dibujo y lectura de los juegos 1 y 2; lectura nueva del juego 2. | `gravitacion-ley.test.js` y `-campo.test.js` (estados animados con el valor mostrado). |
| M4 | Datos de razón: ley general + «G es la misma en los dos ensayos». | `ecuaciones-ancho`: ya no aparece. |
| M5 | Figura de dos posiciones ordenada por distancia. | `gravitacion-energia.test.js`: «la más lejana se dibuja más lejos». |
| M6 | (a)–(e) como arriba; Datos de UA simplificado. | `gravitacion-kepler.test.js` (regla con 1 ± e; alternativas por valor, sin «A:»; día → hora en la duración). |
| M7 | Nodos de notación en 10 sitios; 24 subíndices anidados aplanados con coma. | `gravitacion.test.js`: «Datos y pasos sin subíndices anidados, sin texto crudo…». |
| M8 | Frases reescritas (regla 1, condición 1, regla 2, regla 3, regla 6, control de Kepler, balanza, Datos del modelo). | Topes de palabras del validador en verde. |
| M9 | 1.14: r_A + 0,75 · r_A = 10 000 km y luego r_A = 10 000/1,75; 2.8/2.14: «Despejamos r: r = R · √(g₀/g)»; 3.8: reemplazo en joules; 3.14 y tramos: E_PG,1 y E_PG,3 con su cuenta; explicaciones distintas. | `gravitacion-ley.test.js` (filas del equilibrio), `-energia.test.js` (igualdades). |
| M10 | Regla 4 con E_M; voz nueva; lectura del reloj. | `gravitacion-orbitas.test.js`. |
| M11 | Figura de escape: sonda en la superficie en «dos planetas», «r₀ = 4 R» en Predice, sin «?» donde hay dato, sin factores 1. | `gravitacion-escape.test.js` (igualdades y figuras). |
| M12 | Fracciones en 4.3, 4.5, 4.9, 4.14; apoyo con el campo calculado. | `ecuaciones-ancho`: 0 dentro de paréntesis. |
| M13 | Mesa 3D: escala 0,95, sin rótulo r, g⃗ a 0,06. Captura girada y al máximo: v⃗ y g⃗ se ven sin pisarse. | `gravitacion-laboratorio.test.js` (escala de g y punta fuera del planeta). |
| B1 | Equivalencias según el caso en órbitas y energía; UA. | `gravitacion.test.js` (1 MJ, 1 min, 1 km/s sin usar). |

Ajustes a las pruebas de Codex, solo donde la corrección cambió lo que comprueban (y sin aflojarlas): el lector de
ecuaciones de energía y escape acepta subíndices con coma; el juego 1 y 2 se comprueban con el valor mostrado; Kepler
pide la alternativa por su valor y la regla con sus extremos; el equilibrio tiene tres filas; la balanza usa el campo
calculado; los textos nuevos de las lecturas.

Pruebas al cerrar: `npm run -s test:corto` sobre `contenido/teoria/teoria.test.js`, las diez pruebas de gravitación, la
pieza, la práctica, `catalogo/catalogo.test.js`, `catalogo/pruebas/pruebas.test.js`, `herramientas/papel-reglas.test.js`,
`nucleo/avance.test.js` y `nucleo/teoria-reglas.test.js`: **388 en verde**. `npm run catalogo` en verde. No corrí la
suite completa (convivencia): la corre la sesión al integrar.

### Decidido por la sesión, Gerson revisa después

1. Subíndices de los extremos de la elipse en palabras («cerca», «lejos») en vez de p y a, porque «a» es el semieje.
2. La mesa 3D sin rótulo «r»: el radio es el trazo turquesa y el control se llama «Radio orbital r».
3. GM y el campo siguen en tinta (decisión de Codex); el lector pidió color.
4. Los 10 ejemplos con densidades de 16 000 a 60 000 kg/m³ quedan; se rehacen si Gerson quiere planetas «de verdad» en
   todos los ejemplos.
