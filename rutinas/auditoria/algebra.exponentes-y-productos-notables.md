# Auditoría de contenido: «Exponentes y radicales» (algebra.exponentes-y-productos-notables)

18 nov 2026. Auditor externo (fase 7 del método, `docs/metodo/unidad/5-auditor.md`), sin editar la unidad. Contrato:
`docs/plan-calidad.md` §3 (13 puntos) y §5. Formato: `docs/teoria.md` 4e, 4f, 4h, 4i y §5. Vara: `docs/molde-unidad.md`
§10. Decisiones: `docs/etapa3/decisiones.md` (Álgebra, rondas 2 a 4), `docs/etapa3/propuesta-algebra-exponentes.md` y
`docs/etapa2/decisiones.md` («Cambios posteriores»).

No se reporta lo que otros agentes están cambiando en paralelo:
- «valor absoluto», que pasa a definirse en «Valor absoluto y radicales»;
- Ejemplos solo después de Predice (app, 4i);
- el dibujo propio de la Regla (app, 4i).

**Qué se revisó.**
- `contenido/teoria/algebra/exponentes-y-productos-notables.js` (v0.4.0, `calidad: 2`): las 3 ideas con sus 7
  momentos, los 45 ejemplos, «Ahora tú» y «Así se resuelve», el glosario (9 términos propios) y las 2 mesas.
- La pieza `alg-objeto`, en pantalla y en su código (hoja, huertos, caja).
- `nucleo/ecuacion.js` y `app/estilos.css`, en lo que dibuja raíces con índice.
- La práctica:
  - `plantillas/exponentes-radicales/` (21 tipos, 30 con sus subtipos, casos, test y `papel.json`);
  - de `plantillas/cuadrado-crece/`, solo lo de esta unidad: los experimentos «2 elevado a la (3 + 2)» y «√(x²) con x
    negativo», y los problemas p6 y p7 del papel, que `nucleo/repaso-tipos.js:114` asigna a la unidad.
- La app a 390 × 844 con `--entera`: los 21 momentos, los 45 ejemplos, el glosario y el laboratorio.
- Scripts y capturas en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/auditoria-exponentes/`:
  `scripts/volcar.js`, `scripts/rehacer.py`, `scripts/nivel3.py` y `cap/`.

**Cuentas.** Se rehicieron con scripts propios. `rehacer.py` y `nivel3.py` calculan con `fractions.Fraction`, raíces
enteras por búsqueda y el mayor cuadrado por fuerza bruta. No usan el código de la unidad ni el del generador. Del
generador solo toman `_datos` y el texto de las alternativas.
- **Generador: 93 problemas.** 3 semillas por cada tipo y subtipo, más repeticiones. La alternativa correcta cuadra en
  los 93, también en el texto (superíndices, «≈», unidades).
- **Ejemplos de nivel 3: los 15.** También la letra de la respuesta y los distractores que el resuelto explica (24
  explicaciones, todas dan el valor de su alternativa).
- **Teoría: 42 casos.** «Ahora tú», semillas 0–9 de las 3 ideas, y «Así se resuelve», semillas 0–3. Todos cuadran,
  también las comprobaciones de «¿Tiene sentido?» (x = 4096: 8 · 16 = 128; x = 64: 8 · 4 = 32).
- **Predicciones y misiones.** Las 3 predicciones y las 3 misiones.

En total, 150 respuestas rehechas y **ningún error de cuenta**. `node --test` de la unidad y del generador: 55 de 55 en
verde.

**Lo que dijo el lector en frío, verificado.**
- **Es real y entra en la tabla:**
  - la leyenda de cada Juega muestra los valores de la meta (M1);
  - el índice de la raíz sale del tamaño normal y sin su color (A1, M2);
  - la raíz anidada mal dibujada (A1);
  - «Datos» regala la clave en «El signo y la base» y en «Cuál es mayor» (M5);
  - el plano de Predice de la idea 2 no dice nada (M6);
  - el biohuerto diminuto (M7);
  - «4 capas» dibujadas como 2 tiras (M8);
  - la raíz cúbica que sale de golpe en la regla de la idea 2 (M9);
  - los distractores de nivel 3 sin explicación (B1);
  - la raíz cuadrada sin índice 2 ni x = x¹ en «Una raíz dentro de otra» (B6);
  - el paso 1 de «Mira» de la idea 3 escrito al revés (B9);
  - «¿y si n es impar?» (B10);
  - a y b sin color en los datos de radicales, y el 12 y el 3 que pierden el color (B11);
  - la alternativa 4 y su orden en «Cuál es mayor» (B12).
- **No es hallazgo:**
  - «un número entre sí mismo da 1» en «El exponente cero». Es una propiedad general, no el paso hecho.
  - «el 1 sin color» en «Ahora tú». La cabecera lo declara en tinta: es un tercer exponente.
  - «−2⁴ = −16 en una línea chica gris». Es el estilo de la condición en toda la app.
  - «a⁰ = 1 no se explica». «Mira» lo muestra en el paso 3.
  - La ley usada «al revés» en «Multiplicar dos raíces». Una igualdad se lee en los dos sentidos.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 5, 3 | `nucleo/ecuacion.js:82` (`<sup class="ec-ind">`), `app/estilos.css:842` (`.ec-ind{align-self:flex-start}`, sin tamaño). Se ve en la regla de la idea 3 (`:1200`–`:1201`), en `DF.def`/`DF.mn` (`:908`–`:909`), que son los datos de todo ejercicio de la idea 3, y en el ejemplo «Una raíz dentro de otra» (`:1044`). Capturas `cap/claro-cel-exponente-fraccionario-5-regla.png` y `cap/claro-cel-ej-exponente-fraccionario-08.png` | **La raíz con índice se dibuja mal, y la regla central de la idea queda escrita como otra cosa.**<br>• En la regla grande, «a¹ᐟⁿ = n√a» sale con la n casi del tamaño de la a, al lado del signo y no metida en su gancho. El radicando queda más abajo que la raya. Se lee «n por raíz de a» (lector en frío).<br>• En √(∛x) el √ de afuera no crece. Su raya tapa «3√x» y el 3 queda del tamaño normal debajo de ella: se lee «raíz de 3 por raíz de x».<br>Es la notación que la idea 3 enseña, y sale en sus datos, su regla y su nivel 3. | `.ec-ind{font-size:.6em;margin-right:-.45em;align-self:flex-start;position:relative;top:-.15em}`, y que `.ec-rad` se estire a la altura del radicando (SVG o `transform: scaleY` según la altura de `.ec-bajo`). Prueba con Playwright: ver «Reglas que faltan». |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 2, 3, 4f; regla 3 | Leyendas de Juega: idea 1 `:428`–`:430` («8 capas», «× 4», «32 capas»); idea 2 `:795`–`:799` («64 m²», «100 m²», «10 m: √100»); idea 3 `:1152`–`:1156` («1/3: el exponente», «4 dm: ∛64», «8 dm: √64»). Captura `cap/claro-cel-exponente-fraccionario-2-juega.png` | **Las tres leyendas son fijas y escriben el estado de la misión cumplida, no el que se ve.**<br>• **Idea 1:** «× 4» es n = 2, la respuesta.<br>• **Idea 2:** «64 m²» es el área que se busca (36 + 64 = 100), con el juego en 36 y 49.<br>• **Idea 3:** «1/3» y «4 dm: ∛64» son la respuesta con el juego en exponente 1.<br>El lector en frío lo vio en las tres: «¿es lo que tengo o la meta? Me la están diciendo antes de jugar». Además, la leyenda contradice la figura (dice 64 m² y se ve 49 m²). Es el mismo defecto que Numeración (M8). | Leyenda solo con símbolos y palabras, sin valores: «m: dobleces que la hoja ya tiene», «n: dobleces más», «capas: hojitas encimadas, vistas de canto», «paquete: las capas que dejan los m dobleces». En la idea 3: «exponente: arriba, a qué se eleva; ∛: raíz cúbica». Si hace falta un número, `leyenda: v => […]` con los valores actuales. Regla automática en «Reglas que faltan». |
| M2 | 5 (§5b), regla 4 del repo | `indice: 'n'` en texto plano (`:908`, `:909`, `:1137`, `:1200`, `:1201`) y `indice: String(n)` en `casoARaiz`, `casoValorFrac` y los ejemplos 2, 3, 4, 7 y 15 de la idea 3. `nucleo/ecuacion.js:82` hace `esc(p.indice)`: no admite una ficha de color | n es turquesa en el exponente (m/n) y negra como índice de la raíz, en la misma igualdad. Es justo lo que la idea enseña (que son el mismo número), y el color se pierde ahí. El lector en frío lo marcó tres veces («el 7 no está pintado de verde como la n»). El generador sí pinta el índice (`aRadical`: `N(sup(n))`). | Que `raiz.indice` acepte partes (`html(p.indice)`) y usar `nn` y `e2(n)` como índice. Que el test de colores de la unidad recorra también los índices. |
| M3 | Regla 3; 4e | Glosario «raíz cuadrada» (`:1346`), `def: 'El número no negativo que…'`; el término está subrayado en la tarjeta 1 de «Lee» de la idea 2 y sale en «Palabras de esta idea» del Resumen | La predicción de la idea 2 es si √((−5)²) vale 5, −5 o ±5. La definición que se abre antes de jugar dice «no negativo», que descarta −5 y ±5. Es el mismo caso que Numeración M1 (el glosario adelanta la predicción). | `def: 'El número que, multiplicado por sí mismo, da el número de adentro; es el lado de un cuadrado de esa área.'`. El «no negativo» va en la regla y en los datos de después (ya está en `DR.def`). |
| M4 | Regla 3 | Generador: `negativo` (`generador.js:246`, par [2, 3]), `raizCuadrado` (`:459`, k de 2 a 12) y `valor`/`sumaFracc` (`:738`, `:785`, [27, 2, 3]). `app/practica.js:138`/`:168` no depende de la predicción | La práctica de la unidad da resueltas las tres predicciones: 2⁻³ = 1/8 (semilla 120), √((−5)²) = 5 (semilla 64) y 27²ᐟ³ = 9 con el distractor ≈ 140,3 (semilla 74). La teoría las evitó a propósito en ejemplos y «Ahora tú» (`casoValorFrac` no trae [27, 2, 3]), pero la pantalla Ejercicios se abre sin pasar por Predice. | Sacar esos tres casos del generador (el par [2, 3] con exponente −3, k = 5 y [27, 2, 3]) y una prueba que lo compruebe en 400 semillas. |
| M5 | 13 (el paso hecho) | Ejemplos «El signo y la base» (`:372`) y «Cuál es mayor» de la idea 3 (`:1100`) | • «En (−2)⁴ la base es −2; en −2⁴ la base es 2 y el menos queda afuera» es la trampa del ejercicio resuelta con sus propios números.<br>• «a > b cuando a⁶ > b⁶»: el 6 (mcm de los índices) es la idea del problema.<br>El lector en frío: «te regalan la idea difícil»; «el 14 se siente como un 8». | Datos generales: «En −aⁿ el exponente toca solo a a; en (−a)ⁿ, a −a» y «Si a, b > 0 y k es un entero positivo, a > b cuando aᵏ > bᵏ». Así además se arregla la desigualdad partida en dos líneas. |
| M6 | 1, 3; molde §3 | Predice de la idea 2, `dibujo` (`:825`); captura `cap/claro-cel-radicales-3-predice.png` | El dibujo es un plano con y = x y un punto en (−5, 0) rotulado «x = −5». No tiene biohuerto ni lado ni raíz. Como y = x pasa por (−5, −5), la figura empuja hacia el distractor −5. Ni y = x ni el plano se presentaron antes en la idea. El lector en frío: «no entendí para qué está el gráfico». | Un cuadrado de 25 m² con su lado «? m» y, al lado, la recta numérica con −5 y 5 marcados. O nada (Predice sin figura). El plano queda para «Mira» y la regla, donde sí se explica. |
| M7 | 8 | `alg-objeto`, objeto `huertos` (`alg-objeto.js:247`, escala `HU.kMax`). Tarjeta 1 de «Lee» de la idea 2 (`:778`) y ejemplos 1 y 9 (`:647`, `:698`). Capturas `cap/claro-cel-radicales-1-lee.png` y `cap/claro-cel-ej-radicales-09.png` | Con un solo biohuerto, la pieza guarda el lugar de los tres. El cuadrado queda de unos 50 px en la esquina izquierda, con la mitad del lienzo vacía. Es la primera pantalla de la idea. | Con `b: 0` y `junto: false`, centrar el biohuerto y escalarlo al lienzo, o recortar el `viewBox` a lo dibujado. Prueba numérica: el objeto ocupa ≥ 50 % del ancho. |
| M8 | 1, 7 | `alg-objeto`, canto de la hoja (`alg-objeto.js:105`–`:110`, `paso ≤ 6`). Capturas `cap/claro-cel-leyes-exponentes-1-lee.png` y `-2-juega.png` | Las capas van a 6 px y, a 390 px, se ven de a pares como tiras: «4 capas» parecen 2 tiras y «8 capas», 4. El lector en frío contó la mitad dos veces. La idea es justo contar capas, y la cabecera de la pieza dice «una capa por línea». | Separar las líneas (paso ≥ 8 px con trazo fino) o dibujar cada capa como una tira propia. Que la prueba de la pieza mida la distancia entre líneas. |
| M9 | 9, 2 (molde: «Ahora tú» practica cada parte de la regla) | Condición de la regla de la idea 2 (`:852`), ejemplos «Una raíz cúbica» y «Con raíces cúbicas» (`:665`, `:734`), mesa `raiz-de-la-potencia` (idea 2, `:1253`, «Cambia el índice»). «Índice» y «raíz cúbica» se presentan en la tarjeta 2 de «Lee» de la idea 3 (`:1134`) | ∛ entra en la idea 2 por la condición de la regla, sin «Lee» ni «Mira». La mesa de la idea 2 habla de «índice», que es palabra de la idea 3. «Ahora tú» de la idea 2 no tiene ningún ∛, aunque la propuesta lo pedía («el índice impar va en la regla y en “Ahora tú”»). El generador sí lo trae (`raiz-cuadrado/cubo`). | Una línea en «Mira» de la idea 2 («∛(−8) = −2: con índice impar, el signo se queda»), un tipo `casoCubica` en «Ahora tú» y «índice» como término de la idea 2. O sacar ∛ de la idea 2 y llevarlo entero a la idea 3. |
| M10 | 13 | `casoResta` (`:606`–`:617`), `datos: [DR.abs, cuenta]` | El ejercicio usa √(x²) = \|x\|, pero los datos dan solo qué es \|x\| y «3 < π». Falta la fórmula que se aplica. El generador la trae (`D.raizAbs`, `generador.js:111`). | `datos: ['√(x²) = |x|', DR.abs, cuenta]`. |
| M11 | 13, 9; decisiones | `plantillas/cuadrado-crece/papel.json` p6 y p7, asignados a la unidad (`nucleo/repaso-tipos.js:114`) | p6 («Un terreno de 5 m por 12 m: ¿su diagonal?») pide Pitágoras, que la unidad no enseña ni da. p7 («Si 2ⁿ = 5…») está bien de tema. Ninguno trae datos. Es el mismo pendiente que Numeración M12. | Sacar p6 de la unidad (o darle «diagonal = √(largo² + ancho²)»), y a p7 «aᵐ · aⁿ = aᵐ⁺ⁿ». Mejor: que el repaso de la unidad use solo `exponentes-radicales`. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | Opciones (molde §2) | Los 15 ejemplos de nivel 3 | Cada uno explica 1 o 2 distractores. Quedan sin explicar, entre otros:<br>• 15 y 125 (L11);<br>• 0 y 8 (L14);<br>• −3 y 15 (R13);<br>• 10 y 8 (R14);<br>• 96 y 2 (F13).<br>El lector en frío lo marcó en dos. | Una línea por trampa, como ya hacen L14 y R14. |
| B2 | 2 | Juego de la idea 1, `n` con `max: 2` (`:436`); juego de la idea 3, 3 opciones (`:1159`) | La misión 1 se cumple llevando el control al tope. La 3 se cumple probando 3 botones. La propuesta pedía n de 0 a 3 y exponentes 1/3, 1/2, 1, 2 y 3. | Idea 1: que n llegue a 3 (la pieza aguanta hasta 5 dobleces) y que la misión arranque en m = 2 y pida 16 capas, así n = 2 no es el tope. Idea 3: las 5 opciones de la propuesta. |
| B3 | Regla 3 (Predice sin tensión) | Predice de la idea 1 (`:448`) y de la idea 3 (`:1172`) | • Idea 1: «2³ · 2⁻³ = 2⁰ = 1» deja la cuenta 8 · x = 1, y el «= 1» no se jugó. La propuesta decía solo «= 2⁰».<br>• Idea 3: al decir que 27²ᐟ³ «es el área de la tapa», se responde sin entender 2/3 (arista 3, tapa 9), y 18 y ≈ 140,3 no son áreas que nadie calcule.<br>Las dos son textos aprobados. | Idea 1: volver a «= 2⁰» y dejar «la hoja sin doblar es 1 capa» en datos. Idea 3: mostrar la tapa «?» en la figura y preguntar «¿Cuánto vale 27²ᐟ³?». Consultar a Gerson, porque cambia texto aprobado. |
| B4 | 9 | Términos marcados en la unidad y definidos en unidades posteriores (`app/datos/glosario/algebra.json`): «arista» y «volumen» (en `algebra.productos-notables`), «factor» (en `algebra.inecuaciones`) | «Arista» y «volumen» son vocabulario central de la idea 3 (actividad, misión, «Lee», leyenda), y «factor» va en el título de la idea 1. El alumno los toca y lee «se explica en…» un tema que pide este. | Que esta unidad estrene «arista» y «volumen» (idea 3) y «factor» (idea 1), y que Productos notables los herede. |
| B5 | Medición | `casoCuadrado` con x > 0 (`:569`, TAL-RAIZ-X marca −k, que no es ese error); `casoJuntar` (`:584`, `:586`, AL9 dos veces); `casoDato` impar (`:225`, `:227`, TAL-EXP-RESTA dos veces); `casoARaiz` (`:924`, TAL-FRAC-SUMA para «resta n») | Códigos repetidos o que no nombran el error. | Un código por distractor: TAL-RAIZ-LADOS (resta de lados), TAL-EXP-SOLO-EXP (como el generador) y TAL-FRAC-RESTA. |
| B6 | 13 | Ejemplo «Una raíz dentro de otra» (`:1045`) | Se usa que la raíz cuadrada tiene índice 2 y que x = x¹, y ninguno de los dos está en datos. | Agregar «√a = a¹ᐟ²: la raíz cuadrada tiene índice 2». |
| B7 | 13 (el paso hecho, leve) | `casoMismaBase` (`:242`), ejemplos L13 y L15 (`:362`, `:382`), generador `mismaBase` y `dosVariables` | «4 = 2² y 8 = 2³» cuenta qué base usar, que es lo que se practica (AL32). | Una tabla como herramienta: «Potencias de 2: 2, 4, 8, 16, 32; de 3: 3, 9, 27, 81», como `DR.cuadrados`. |
| B8 | 10, 7 | Ejemplo «El cerco del biohuerto» (`:701`) | «≈ 20 · 1,41 ≈ 28,3», pero 20 · 1,41 = 28,2. Con el dato √2 ≈ 1,41 el alumno saca 28,2 y la respuesta dice 28,3. | «≈ 20 · 1,414 ≈ 28,3» con «√2 ≈ 1,414», o «≈ 28,2». |
| B9 | 7 | «Mira» de la idea 3, paso 1 (`:1191`) | Dice que 64¹ᐟ³ «da la arista», pero la cuenta escribe (64¹ᐟ³)³ = 64 y nunca 64¹ᐟ³ = 4. | Agregar «64¹ᐟ³ = ∛64 = 4». |
| B10 | 3 | Condición de la regla de la idea 3 (`:1202`) | «a ≥ 0 si n es par» no dice qué pasa con n impar. | «Si n es par, a ≥ 0; si n es impar, a puede ser negativo: ∛(−8) = −2». |
| B11 | 5 (regla 4) | `DR.producto` (`:556`) y regla de la idea 2 (`:850`), con a y b en tinta; «Multiplicar dos raíces» (`:691`, `{ raiz: ['12 · 3'] }`) | En la idea 1, m y n de las leyes llevan su color. En la idea 2, a y b de √(a·b) van en tinta, pero el 4 y el 25 que entran en ellas van naranja y turquesa. Y el 12 y el 3 pierden el color dentro de √(12 · 3). | Pintar a y b en las leyes de radicales (`r1('a')`, `r2('b')`) y conservar las fichas dentro del radicando. |
| B12 | Alternativas | «Cuál es mayor», idea 3 (`:1099`) | Tiene 4 alternativas cuando las demás de nivel 3 tienen 5, y van al revés que la pregunta (A √2, B ∛3). | Dejarlo en 4, porque una quinta inventada no mide ningún error. Ordenar las alternativas como la pregunta (A ∛3, B √2) y cambiar la letra de la respuesta. |
| B13 | Títulos | «El dato escondido» (idea 1 `:340` e idea 2 `:744`); «Cuál es mayor» (idea 2 `:754` e idea 3 `:1097`) | Dos títulos se repiten en la pestaña Ejemplos. | Otro nombre en una de cada par. |
| B14 | Concordancia | Lectura del juego de la idea 1 (`:443`) | Con 0 dobleces dice «0 + 0 = 0 dobleces; 1 · 1 = 1 capas», y con 1 doblez, «1 dobleces». | `pl(k, 'doblez', 'dobleces')` y `pl(L, 'capa', 'capas')`, como el generador. |
| B15 | Notación | `casoAnidado` (`:969`, a = 1 o b = 1) y `casoARaiz` (`:916`, m = 1) | Escribe x¹ («√(x¹ · ∛(x¹))», «⁷√(x¹)»). | `m === 1 ? 'x' : pw('x', …)`, como `rz` de `resuelve`. |
| B16 | Laboratorio | Mesa `raiz-de-la-potencia`: rótulo `y = x` en [4.5, 3] (`:1245`) y `bien` «la distancia es 12» (`:1275`); captura `cap/claro-cel-laboratorio.png` | El rótulo «y = x» queda pisado por la gráfica violeta. «La distancia es 12» es la diferencia de alturas, no la distancia a la recta (≈ 8,5). | Rótulo en [4, 5.2], y «en x = −6 la raíz da 6 y la recta −6: 12 de diferencia». |
| B17 | Cabecera | `:43` | Dice «hoy en la idea 1», pero `IDEAS_REHECHAS` ya tiene las tres. | Actualizar. |
| B18 | 5 | `cuadrado-crece/index.html:1322` | El experimento de esta unidad escribe «2^(3 · 2)» con «^». | «(2³)² = 2⁶», con superíndice. |
| B19 | Molde §7 (pendiente conocido) | `app/practica.js:138`, `:168` | La app pasa `{ unidad }` y no `{ idea }`. El generador separa por idea, pero la práctica mezcla las tres. Es el pendiente de trigonometría y Numeración (M11). | El arreglo de la app que sigue pendiente. |

## Lo que está bien y hay que copiar al molde

- **Cuentas limpias.** 150 respuestas rehechas aparte y ningún error. Cada constante de ejemplos dice qué cuentas se
  revisaron, y los distractores explicados dan su valor.
- **Un color por magnitud con su prueba en las tres ideas** (`COLORES`, `ficha(mg)`, `IDEAS_REHECHAS`). El generador
  usa la misma paleta y pinta mejor que la teoría: el índice va turquesa (copiarlo en la teoría, M2).
- **La predicción cuidada en el juego y en los ejemplos.**
  - El juego 1 no tiene exponentes negativos, el 2 no tiene negativos al cuadrado y el 3 no tiene 2/3.
  - El título de la idea 2 se cambió porque decía la respuesta (`:541`).
  - Ningún ejemplo pide 2⁻³, √((−5)²) ni 27²ᐟ³, y queda escrito en un comentario. Falta llevarlo al generador (M4).
- **La figura no da la respuesta.** `canto: false` cuando se piden las capas, «? m» en el lado y «tapa: ?».
- **Tabla de letras aplicada.** Las medidas de la hoja y la caja van en dm para que la m no choque con el exponente, y la
  tarjeta 3 de «Lee» de la idea 3 avisa que n cambia de papel (molde §0.4).
- **Datos como herramienta.** Las leyes son fórmulas generales con color. Los cuadrados van como lista, no como el
  cuadrado que sirve, y `p/q + r/s = (ps + rq)/(qs)` va en «Así se resuelve».
- **«Así se resuelve» distinto de «Ahora tú»** en las tres ideas, con un comentario que dice qué pide cada uno. Su paso
  «¿Tiene sentido?» comprueba con un número (x = 4096) y no repite la cuenta.
- **Generador modelo.**
  - Tiene `TIPOS_POR_IDEA` y `NIVEL`, y el nivel 3 cita su pregunta de San Marcos (2025-II, Medicina 40).
  - Sus pruebas comprueban en 400 semillas que los datos no traen la respuesta. También que ninguna explicación nombra
    una letra, que se usan superíndices de verdad y que `sistemas-ecuaciones` salió de la unidad.
  - `casos.json` está verificado aparte.

## Reglas que faltan en el contrato o en el validador

| Regla | ¿Automática? |
|---|---|
| **La leyenda de Juega no muestra la respuesta de la misión** (M1; también Numeración M8). Se agrega en `revisarContrato` (`nucleo/teoria.js:212`), que ya tiene `inicio()`, `grilla()` y la búsqueda de casos que cumplen `logrado`:<br>1. **Números de la leyenda:** los de `Ecuacion.texto` de cada `s` y `t`, normalizados («× 4» → 4, «1/3», «≈ 9,2» → 9,2).<br>2. **Visibles al abrir:** los de la lectura y del texto del SVG de `dibujo` en `inicio(j)`, más los de la consigna, `mision.texto` y los valores iniciales de los controles.<br>3. **Visibles con la misión cumplida:** los mismos, en cada caso de la grilla que cumple `logrado` (o en el `testigo`).<br>4. **Falla** si un número está en (1) y en (3) y no en (2): «la leyenda muestra “× 4”, que solo aparece con la misión cumplida».<br>5. **Aviso**, más suave, si un número de (1) no está en (2): la leyenda no coincide con lo que se ve.<br>En esta unidad, (4) atrapa «× 4» (idea 1), «64» y «10» (idea 2) y «1/3», «4» y «8» (idea 3), y deja pasar «32» y «100», que dice la misión. Habría atrapado también a Numeración. La alternativa más simple (leyenda sin números, o `leyenda` como función de `v`) también sirve. | Sí |
| **El mismo cruce para «Lee», `voz` y el glosario de la idea**: ningún número de la misión cumplida ni la correcta de Predice en las tarjetas, la voz del juego o el `def`/`simple`/`ejemplos` de los términos que la idea estrena. Para frases («no negativo», M3), con una lista `predice.clave` que declara quien escribe. | Sí (números); semi (frases) |
| **La práctica no repite las predicciones**: la idea declara `predice.caso` (p. ej. `{ base: 2, exp: -3 }`, `{ x: -5 }`, `{ b: 27, m: 2, n: 3 }`) y el test del generador rechaza ese caso en 400 semillas (M4). | Semi (declarar el caso es a mano) |
| **Raíz con índice bien dibujada**: con Playwright, una ecuación de prueba `{ raiz, indice }` en la regla grande y en datos. El índice debe medir ≤ 0,7 del radicando y su base quedar sobre la mitad del signo √. En una raíz anidada, el √ de afuera debe ser más alto que el de adentro (A1). | Sí (Playwright) |
| **`raiz.indice` acepta partes con color**, y el test de colores de la unidad recorre también los índices (M2). | Sí |
| **Un término marcado se define en esta unidad o en una que ella pide** (cadena de `requiere`). Si no, falla, salvo excepción decidida y anotada, como «valor absoluto». Habría encontrado «arista», «volumen» y «factor» (B4). | Sí |
| **Lo que dice la regla tiene su «Ahora tú»**: cada línea de `regla.ecuacion` y cada símbolo nuevo de la condición (∛) aparece en algún tipo de «Ahora tú» de la idea (M9). | Semi (por símbolos) |
| **Datos sin los números del enunciado en la relación que se pide**: una línea de datos que repite una subexpresión literal del enunciado («(−2)⁴», «a⁶» con índices 2 y 3) se marca para revisión (M5). | Semi |
| **Concordancia en lecturas**: recorrer la grilla del juego y rechazar «1 capas», «1 dobleces» o «1 veces», como ya hace el test del generador (B14). | Sí |
| **Figura de un objeto que ocupa su lienzo**: el contenido dibujado cubre ≥ 50 % del ancho del `viewBox` (M7). | Sí |

## Correcciones (18 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`). Cada corrección tiene la prueba que la habría detectado, en
`contenido/teoria/algebra/exponentes-y-productos-notables.test.js` («Correcciones del 18 nov»), en
`nucleo/kit/piezas/alg-objeto.test.js` y en `plantillas/exponentes-radicales/generador.test.js`. Cuentas que
cambiaron, rehechas aparte: la semilla 7 de `casos.json` (4 elevado a 3/2 = (√4)³ = 8), los valores de los
distractores de nivel 3 que ahora se explican (8, 15, 125, 13; 4, 2, 8, 10; 6, 1,5, 2; 0 y 8; −3 y 15; 10 y 8; 13, 3 y
21; 96; 1/8 y ⁴√16 = 2; 3√5 ≈ 6,71, 2√11 ≈ 6,63 y 4√3 ≈ 6,93) y la raíz cúbica de «Ahora tú» (con `Math.cbrt`).

| # | Qué se hizo |
|---|---|
| A1 | Ya resuelto en la app (commit b7637324). |
| M1 | Las tres leyendas dicen cada símbolo con palabras o con letras: «paquete», «× veces», «capas»; a, b, √a, √b, √(a + b); «exponente», «arista», «lado», «∛ y √». La regla común `leyendaSinRespuesta` queda en verde para la unidad, y una prueba de la unidad lo repite. |
| M2 | El índice de toda raíz (regla, datos, «Lee», «Mira», ejemplos, «Ahora tú» y «Así se resuelve») es la ficha turquesa de n. Prueba: recorre los índices de las tres ideas en 60 semillas. |
| M3 | «raíz cuadrada»: «El número que, multiplicado por sí mismo, da lo de adentro: el lado de un cuadrado de esa área». Prueba: nada antes de Predice de la idea 2 dice «negativ», «±» ni «−5». |
| M4 | El generador ya no da 2⁻³, √((−5)²) ni 27²ᐟ³ (devuelve `null` y vuelve a sortear: solo cambió la semilla 7 de `casos.json`). Prueba en 400 semillas, sin idea y con cada idea. |
| M5 | «El signo y la base»: «En −aⁿ el exponente toca solo a a; en (−a)ⁿ toca a −a». «Cuál es mayor»: «Si a, b > 0 y k es un entero positivo, a > b cuando aᵏ > bᵏ». |
| M6 | Predice de la idea 2: un cuadrado de (−5)² = 25 m² con su lado «? m»; al revelar, «Su lado mide 5 m, no −5 m». El plano queda en «Mira». |
| M7 | `alg-objeto`, un biohuerto solo: al centro y de 160 px (la mitad del lienzo). Prueba numérica. |
| M8 | El canto de la hoja: las capas a 12 px cuando caben (≥ 8 px hasta 8 capas), con trazo de 1,2. Prueba numérica. |
| M9 | «Mira» de la idea 2 presenta la raíz cúbica y el índice (∛(−8) = −2), «índice» pasa a estrenarse en la idea 2 y «Ahora tú» tiene un sexto tipo, `casoCubica` (con negativos; errores TAL-RAIZ-CUBICA, TAL-RAIZ-NOEXISTE, TAL-RAIZ-INDICE y TAL-EXP-POR). |
| M10 | `casoResta` da «√(x²) = \|x\|» en datos. |
| M11 | p6 de `cuadrado-crece` sale de la unidad en `nucleo/repaso-tipos.js` (pide Pitágoras); p6 y p7 traen «Datos:» al final del enunciado. La práctica de la unidad ya es solo `exponentes-radicales`. |
| B1 | Los 15 ejemplos de nivel 3 explican todas sus alternativas incorrectas. Prueba: cada letra incorrecta aparece en el resuelto. |
| B2 | Idea 1: n llega a 3 (por la mitad caben 5 dobleces; con 3 + 3 la lectura y la figura lo dicen), así n = 2 ya no es el tope; la misión aprobada no cambia. Idea 3: los cinco exponentes de la propuesta (1/3, 1/2, 1, 2 y 3). |
| B3 | Sin cambio: es texto aprobado; queda para Gerson. |
| B4 | Sin cambio: «arista» y «volumen» se estrenan en la idea 3 de Productos notables (que con ellas cumple su mínimo de 2 palabras) y «factor» en Inecuaciones; moverlos es decisión de Gerson. |
| B5 | Un código por distractor: TAL-RAIZ-NEG (x positivo), TAL-RAIZ-LADOS, TAL-EXP-SOLO-EXP y TAL-FRAC-RESTA, en la cabecera de cada idea; el test del generador ya no los cuenta como nuevos. |
| B6 | «Una raíz dentro de otra» da «√a = a elevado a 1/2: la raíz cuadrada tiene índice 2». |
| B7 | Una tabla de potencias («Potencias de 2: 2, 4, 8, 16, 32, 64») en vez de «4 = 2² y 8 = 2³», en `casoMismaBase`, en los ejemplos L13 y L15 y en `mismaBase` y `dosVariables` del generador (papel regenerado). |
| B8 | «√2 ≈ 1,414» y «≈ 20 · 1,414 ≈ 28,3». |
| B9 | «Mira» de la idea 3, paso 1: «64 elevado a 1/3 = ∛64 = 4, porque (64¹ᐟ³)³ = 64». |
| B10 | «Si n es par, a ≥ 0; si n es impar, a puede ser negativo: ∛(−8) = −2». |
| B11 | a y b de las leyes de radicales en naranja y turquesa; √(12 · 3) conserva sus colores. |
| B12 | «Cuál es mayor»: A ∛3, B √2 (respuesta A), y explica las otras tres. |
| B13 | Idea 2: «Sin hallar x» y «El mayor de tres». Prueba: ningún título de ejemplo se repite. |
| B14 | La lectura de la idea 1 dice «1 doblez» y «1 capa». Prueba en toda la grilla. |
| B15 | x¹ no se escribe (`xe`). Prueba en 400 semillas. |
| B16 | Rótulo «y = x» en [4, 5,2] y «En x = −6 la raíz da 6 y la recta, −6: 12 de diferencia». |
| B17 | Cabecera al día (las tres ideas en el test de colores, el índice incluido). |
| B18 | `cuadrado-crece/index.html`: «(2³)² = 2⁶ = 64 es una potencia de potencia». |
| B19 | Pendiente: es de `app/practica.js` (pasar `{ idea }` al generador), fuera de alcance. |

Capturas `--entera`: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/correcciones-exponentes/`.
