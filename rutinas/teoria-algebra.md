# Teoría de Álgebra: reporte de la sesión (14 nov 2026)

Encargo: `rutinas/encargos/teoria-algebra.md`. Rama `teoria/algebra`, salida de `claude/awesome-einstein-ch5g9a`. No se integró a main.

## Resultado

Las 19 unidades de `catalogo/cursos/algebra.json` tienen su teoría en `contenido/teoria/algebra/<unidad>.js`. Las 19 están en estado `completa`: cada tema del catálogo está en una idea que lo enseña. Suman 96 ideas, cada una con sus cinco momentos.

| Grado | Unidad | Estado | Ideas | Ids | Piezas | Códigos TAL nuevos |
| --- | --- | --- | --- | --- | --- | --- |
| 3.º | logica-y-conjuntos | completa | 6 | condicional, equivalencias, operaciones, potencia, cuantificadores, certezas | alg-tabla, alg-venn, recta | 28 |
| 3.º | numeros-reales | completa | 4 | orden, intervalos, acotados, tabla-operacion | recta, alg-tabla | 16 |
| 3.º | exponentes-y-productos-notables | completa | 5 | leyes-exponentes, radicales, cuadrado-suma, radicales-dobles, racionalizar | alg-tabla, alg-baldosas, ejes | 21 |
| 3.º | ecuaciones-lineales-y-cuadraticas | completa | 5 | balanza, dividir-entre-x, discriminante, suma-producto, planteo | balanza, recta, ejes, alg-tabla | 17 |
| 3.º | polinomios | completa | 5 | grados, valor-numerico, completo-ordenado, igualdad, operaciones | alg-tabla, ejes | 13 |
| 3.º | division-de-polinomios | completa | 5 | algoritmo, ruffini, divisor-k, teorema-resto, cocientes-notables | alg-tabla, ejes | 14 |
| 3.º | factorizacion | completa | 5 | factor-comun, aspa-simple, aspa-doble, teorema-factor, mcd-mcm | alg-tabla, alg-baldosas, ejes | 18 |
| 4.º | inecuaciones | completa | 4 | lineales, cuadraticas, puntos-criticos, fraccionarias | recta, ejes | 9 |
| 4.º | valor-absoluto-y-radicales | completa | 4 | distancia, casos-absoluto, radical-ecuacion, radical-inecuacion | recta, ejes | 9 |
| 4.º | ecuaciones-polinomiales | completa | 6 | grado-raices, viete, raices-racionales, conjugadas, cambio-de-variable, binomica | ejes, alg-tabla, recta, flechas | 18 |
| 4.º | funciones | completa | 6 | dominio-rango, cuadratica, especiales, composicion, traslaciones, polinomial | ejes, recta, alg-tabla | 36 |
| 4.º | sistemas-de-ecuaciones | completa | 5 | dos-rectas, gauss, cramer, rouche, no-lineal | ejes, alg-tabla | 10 |
| 5.º | tipos-de-funciones-e-inversa | completa | 5 | paridad, monotona, inyectiva, inversa, modelacion | ejes | 18 |
| 5.º | exponenciales-y-logaritmos | completa | 6 | exponencial, logaritmo, numero-e, logaritmica, ecuaciones, inecuaciones | ejes, alg-tabla | 16 |
| 5.º | numeros-complejos | completa | 6 | por-i-gira, forma-binomica, conjugado-modulo, polar, raices, regiones | flechas, ejes | 18 |
| 5.º | matrices-y-determinantes | completa | 5 | fila-por-columna, tipos-traza-transpuesta, determinante-area, inversa-adjunta, rango | alg-tabla, ejes | 17 |
| 5.º | programacion-lineal | completa | 4 | semiplano, region-factible, recta-de-nivel, casos-especiales | ejes | 5 |
| 5.º | sucesiones-y-series | completa | 6 | progresiones, limite, recurrencia, gauss, telescopica, serie-geometrica | ejes, alg-tabla | 25 |
| 5.º | binomio-de-newton | completa | 4 | pascal-elecciones, termino-general, exponente-no-natural, potencia-trinomio | alg-tabla, ejes | 14 |

Puntos del expediente que se respetaron:
- El microguion «dividir por x exige revisar x = 0» es una idea entera de ecuaciones (`dividir-entre-x`):
  - x² = 3x con la rama x ≠ 0;
  - el juego x² = kx con k ∈ {−2, 0, 4};
  - la transferencia x(x − m) = nx;
  - el contraste con x²/x = k.
- Las precisiones de Aritmética y Álgebra están en las reglas y condiciones:
  - factorizar es reescribir como producto;
  - la suma de las raíces es −b/a y el producto, c/a, normalizando;
  - el óptimo de programación lineal puede ser todo un lado, no existir o tener una región vacía;
  - la inversa como reflejo vale solo si la función es biyectiva;
  - el logaritmo admite valores no enteros, con base positiva distinta de 1;
  - una lista finita admite muchas reglas.
- La figura del cuadrado de una suma vale para lados positivos. El caso negativo se resuelve con álgebra.

## Cómo se hizo

- La unidad de lógica y las tres piezas nuevas las escribí yo. Esa unidad quedó como molde de Álgebra.
- Las otras 18 las escribieron seis subagentes en paralelo, tres unidades cada uno, con el mismo contrato y las mismas herramientas de revisión.
- Cada unidad:
  - se validó con `Teoria.problemas`;
  - se leyeron en texto plano de 5 a 8 casos de «Ahora tú» por idea;
  - se recorrió en Playwright a 360 × 780, mirando hojas de contacto de juega, revela, mira, regla, ahora tú y solución;
  - tuvo al menos una idea revisada en tema oscuro.
- Se hizo un commit por unidad. El `catalogo.json` de cada commit lleva solo las unidades ya confirmadas, así que cada commit pasa su propia prueba de catálogo.

## Piezas nuevas del kit (`nucleo/kit/piezas/`, pruebas en `alg-piezas.test.js`)

| Pieza | Afirmación | Sirve para |
| --- | --- | --- |
| `alg-tabla` | Cada casilla sale de otras que ya se ven; nada aparece sin su origen | Tablas de verdad, sustitución, Ruffini y Horner (separador y flechas «multiplica y suma»), aspas, matrices con corchetes, Pascal triangular, tablas de signos y de operación, con pie y fantasma por casilla |
| `alg-baldosas` | El área del todo es la suma de las piezas; cada pieza es su ancho por su alto | Productos notables, multiplicación de polinomios, factor común, aspa y completar cuadrados. Una sola escala; `separar` aparta las piezas sin cambiar su tamaño |
| `alg-venn` | Cada elemento vive en una sola región, y cada operación es un conjunto de regiones | Operaciones con conjuntos, De Morgan, cardinal de la unión y cuantificadores. Sombreado con puntitos (se lee en grises), sin ids ni clipPath |

- Las tres se revisaron renderizadas a 360 px, en tema claro, oscuro y en grises.
- Correcciones después de mirarlas:
  - los rótulos de las baldosas pasaron a tinta (en color se perdían sobre su propio relleno);
  - la tabla ganó `pie` (antes, una fila de «y N más» ensanchaba la primera columna);
  - las flechas de la tabla nacen en el borde de la caja del texto (en Ruffini tapaban el producto).

## Pedidos al molde

1. **Error en el lector (`app/teoria.js`, no lo toqué):**
   - `const [, , , sub] = location.hash.split('/')` toma el índice 3 del hash, que siempre es «teoria»; la idea está en el índice 4.
   - Por eso `#/unidad/<id>/teoria/<idea>`, `#/…/teoria/ficha` y los chips de ideas abren siempre la primera idea sin terminar.
   - Arreglo propuesto: `const sub = location.hash.split('/')[4]`.
   - Para recorrer las unidades en Playwright marqué como hechas las ideas previas.
2. **El botón fijo tapa la condición:** en la pantalla de la regla, el botón fijo de abajo tapa en parte la condición a 360 × 780 (visto en programación lineal). Pide un margen inferior en `.te-zona`.
3. **Notación de intervalos (decisión de Gerson):**
   - Números reales, inecuaciones y valor absoluto escriben (a; b).
   - Funciones, tipos de funciones y logaritmos escriben ⟨a; b⟩, como la plantilla `numeros-reales` y los exámenes peruanos.
   - Hay que elegir una. En las capturas, ⟩ se parece a «)».
4. **Balanza:** a 360 px la balanza del kit queda chica para ecuaciones (las cajas x son pequeñas y rozan el platillo). Lo vio la sesión de ecuaciones; la pieza no es de Álgebra y no se tocó.
5. **Respuesta manipulable:** se resolvió todo con opciones. Varias ideas pedirían arrastrar una marca, como un extremo de intervalo, una raíz o un vértice.

## Códigos de error

- **De la investigación y de las plantillas:**
  - AL1–AL3, AL8–AL10, AL14–AL23, AL28, AL29, AL31–AL33 de `docs/investigacion/algebra-funciones-ideas-erroneas.md`;
  - NR, PO, BN, EL, CX, MT y PL de las plantillas de cada tema.
- **Nuevos, todos hipótesis de diseño (prefijo `TAL-`):**
  - Son unos 320 entre las 19 unidades; la tabla de arriba da cuántos tiene cada una.
  - Cada uno vive en su archivo, junto a la opción que lo usa, con su `siFuera`.
  - **Cuidado al analizar:** el mismo nombre corto aparece en unidades distintas con sentidos distintos (TAL-DELTA es la diferencia simétrica en lógica y el discriminante en ecuaciones; TAL-SIGNO, TAL-SUMA y TAL-RESTA se repiten). El evento de medición lleva `unidad` e `idea`, así que el análisis tiene que agrupar por (unidad, idea, error), nunca por el código solo.
  - Ninguno tiene dato de prevalencia en alumnos peruanos.

## No verificado

- Celular real (el de Gerson), lector de pantalla y otros navegadores. Todo se miró en Chromium de Playwright.
- Prueba con alumnos: ninguna idea se probó con personas.
- Algunos textos de pasos de «Mira» traen números escritos a mano, como la unidad de referencia. Las cuentas de predicciones, revelados, opciones y soluciones salen del código.
- Detalles visuales menores que quedan:
  - en el último paso del determinante, «col 1» y «col 2» se enciman;
  - en complejos, cuando las flechas son cortas, los rótulos cerca del origen tocan a î y ĵ;
  - en la circunferencia de sistemas no lineales, (3; 4) y (4; 3) quedan juntos;
  - en la telescópica, las casillas que se cancelan se marcan solo con borde punteado.
- Algunas semillas de «Ahora tú» quedan con 3 opciones, porque un distractor coincide con la respuesta y se descarta. El validador lo admite.

## Reporte de diseño

- **Ficha de tarea:** una de 6 líneas al inicio de cada archivo. Las ideas llevan encima sus cinco decisiones (cambia, permanece, progresa, se reserva, debe verse).
- **Sistema:** el existente (`docs/diseno.md`, tokens c-o, c-i, c-h y c-d, trazos 3/2/1 del kit, texto de 16 en un lienzo de 320). Decisiones nuevas:
  - el sombreado por puntos de Venn;
  - la convención de color de cada unidad, escrita en la cabecera de su archivo (p y A naranja, q y B turquesa, verdadero o «cumple» verde, falso o contraejemplo rojo).
- **Carácter:** acogedora, viva y precisa, como en el proyecto. La firma es el hilo de color: la variable conserva su color en el control, la figura, la pregunta y la ecuación.
- **Movimientos:** no se agregó ninguno. Los pasos de «Mira» usan la línea de tiempo del kit (`paso` 900 ms, lo hecho se queda), y las piezas solo marcan `kit-nuevo`, `kit-aparece` y `kit-crece`. Con movimiento reducido rige el CSS del kit.
- **Verificación:**
  - recorrido en Playwright de las 96 ideas a 360 × 780, sin errores de consola de las unidades (las advertencias de preload del catálogo son de la app);
  - pruebas de pureza, alto fijo, texto ≥ 14 y colores solo de variable en las piezas nuevas;
  - topes de texto vigilados por `teoria.test.js`.
- **Hipótesis:** jugar con la tabla o el diagrama antes de predecir debería bajar los errores de recíproca (TAL-RECIPROCA) y de división entre x (AL15). Se comprobaría comparando la tasa de esos errores en la predicción con la de «Ahora tú» en la medición del piloto.
- **Conflictos:** ninguno con el skill. El del repo es el error del lector (pedido 1), que impide abrir una idea por su ruta.

## Polinomios, Etapa 5 (19 nov 2026): códigos TAL- de la unidad rehecha

La unidad `algebra.polinomios` se rehízo en la Etapa 5 (`docs/etapa5/propuesta-algebra.md`; auditoría en
`rutinas/auditoria/algebra.polinomios.md`). Reemplaza los 13 códigos de la tabla de arriba. Todos son hipótesis de
diseño, sin dato de prevalencia en alumnos peruanos. Cada uno vive junto a la opción que lo usa, con su `siFuera`, en
`contenido/teoria/algebra/polinomios.js` (T) o en la práctica `plantillas/polinomios-practica/generador.js` (P). El
análisis agrupa por (unidad, idea, error): TAL-SIGNO, TAL-PIDE y TAL-RESTA tienen otro sentido en otras unidades.
Los PO (de `plantillas/polinomios/`), AL7, AL16 y las trampas 44 y 45 de San Marcos siguen con su nombre.

| Código | Qué hace el alumno | Ideas | Dónde |
| --- | --- | --- | --- |
| TAL-NO-SEMEJ | Junta términos que no son semejantes (3x + 2x² = 5x³) | 1 | T, P |
| TAL-SUMA-POT | Al sumar semejantes, también suma los exponentes (x² + x² = x⁴) | 1 | T, P |
| TAL-SUMA-MULT | Multiplica los coeficientes en vez de sumarlos (2xy + 3xy = 6xy) | 1 | T |
| TAL-ORDEN | Cree que xy y yx son partes literales distintas | 1 | T, P |
| TAL-EXP-CRUZ | Junta x²y con xy² | 1 | T, P |
| TAL-SIGNO | Pierde o cambia un signo | 1, 5, 6 | T, P |
| TAL-RESTA-PRIMERO | Al restar un polinomio, cambia solo el signo del primer término | 1 | T, P |
| TAL-RESTA-ORDEN | Resta al revés (Q − P por P − Q) | 1 | T, P |
| TAL-EXP-DIRECTO | Toma el exponente del otro término sin despejar | 1, 4 | T, P |
| TAL-COEF-SEMEJ | Cree que semejantes pide coeficientes iguales | 1 | T, P |
| TAL-UN-GRUPO | Junta un solo grupo de semejantes y deja el otro | 1 | P |
| TAL-PERIM-MITAD | Para el perímetro suma un largo y un ancho | 1 | P |
| TAL-DOBLE-UNO | Duplica las x del perímetro pero no los números | 1 | P |
| TAL-AREA | Da el área (largo por ancho) cuando piden el perímetro | 1 | P |
| TAL-INDEP-FUERA | Deja fuera el término independiente al evaluar en 1 | 2 | T, P |
| TAL-IMPAR-POS | Toma una potencia impar de un negativo como positiva | 2 | T |
| TAL-SIGNO-X | Evalúa en el opuesto del valor dado | 2 | T, P |
| TAL-SOLO-UNO | De dos valores pedidos, da solo uno | 2 | T, P |
| TAL-SOLO-OTRO | Da solo el otro de los dos valores | 2 | P |
| TAL-FACTOR-SIGNO | En la forma factorizada, cambia el signo de cada factor | 2 | T, P |
| TAL-DATO-REPITE | Responde el valor dado en el enunciado | 2 | T, P |
| TAL-SIN-K | Evalúa sin el término del coeficiente por hallar | 2 | P |
| TAL-SIN-CUADRADO | No eleva el lado al cuadrado (la loseta cubre k, no k²) | 2 | P |
| TAL-CAMBIA-TODO | Multiplica también el término sin x por el lado | 2 | P |
| TAL-PRINCIPAL | Evalúa solo el primer término | 2 | P |
| TAL-COEF-VISTOS | Usa los coeficientes de P(x + h) como si fueran los de P | 2 | P |
| TAL-DESPLAZA | Con P(x + h) dado, evalúa como si fuera P(x) | 2 | T, P |
| TAL-DESPLAZA-SIGNO | Despeja x al revés en x + h = k | 2 | T, P |
| TAL-GA-GR | Da el grado absoluto por el relativo, o al revés | 3 | T, P |
| TAL-LETRA | Mira la otra letra en un grado relativo | 3 | T, P |
| TAL-SUMA-EXP | Suma los exponentes de una letra en vez de tomar el mayor | 3 | T, P |
| TAL-COEF-GRADO | Cuenta el exponente del coeficiente en el grado | 3 | T (comentario; el «Así se resuelve» lo explica) |
| TAL-GRADO-OTRO | Iguala el dato al grado de un término que no es el mayor | 3 | T, P |
| TAL-EXTREMO | Deja fuera un extremo al contar los valores de n | 3 | T, P |
| TAL-EXTREMOS | Deja fuera los dos extremos | 3 | T, P |
| TAL-RESTA | Cuenta q − p valores entre p y q, sin el + 1 | 3 | P |
| TAL-EXP-NEG | Acepta un exponente negativo en un polinomio | 3 | T (comentario) |
| TAL-PIDE-PROD | Da m · n cuando piden otra cosa | 3 | P |
| TAL-COMPLETO | Cree que completar es agregar un solo término | 4 | T, P |
| TAL-FALTAN | Da los términos que faltan cuando piden el total | 4 | T, P |
| TAL-X0 | Olvida la casilla de x⁰ al contar los que faltan | 4 | T, P |
| TAL-X0-DOBLE | Cuenta dos veces la casilla de x⁰ | 4 | P |
| TAL-HOMOG | Da el grado común cuando piden el exponente | 4 | T, P |
| TAL-HOMOG-EXP | Iguala exponentes en vez de grados | 4 | T, P |
| TAL-HOMOG-SIGNO | Suma el exponente de y en vez de restarlo | 4 | T, P |
| TAL-HOMOG-OTRO | Copia el exponente de x de otro término | 4 | P |
| TAL-ORDEN-INVERSO | Ordena al revés (creciente por decreciente) | 4 | T, P |
| TAL-UNVALOR | Cree que un valor común basta para ser idénticos | 5 | T |
| TAL-COEF | No ve que los coeficientes ya deciden la igualdad | 5 | T |
| TAL-CUENTA-PIEZAS | Compara cuántas piezas hay y no cuáles | 5 | T |
| TAL-COEF-Q | Da los coeficientes del otro lado sin despejar | 5 | T, P |
| TAL-DESPEJA-UNO | Despeja una sola de las letras | 5 | T, P |
| TAL-DESPEJA-OTRO | Despeja la otra letra y deja la primera sin despejar | 5 | P |
| TAL-SIGNO-B | Toma un coeficiente sin su signo | 5 | P |
| TAL-NULO | Pone 0 a las letras y no a los coeficientes | 5 | T, P |
| TAL-SISTEMA-SIGNO | Arma el sistema con un signo cambiado | 5 | T, P |
| TAL-GRADO-RESTA | Resta los grados, como al dividir | 6 | T |
| TAL-UNA-CASILLA | Toma una sola de las casillas que dan esa potencia | 6 | T, P |
| TAL-OTRA-CASILLA | Toma la otra casilla | 6 | T, P |
| TAL-COEF-MULT | Multiplica dos coeficientes que no dan esa potencia | 6 | T, P |
| TAL-POT-GRADO | Olvida la potencia al sumar los grados | 6 | T, P |
| TAL-POT-MULT | Multiplica por el exponente en vez de elevar | 6 | T, P |
| TAL-SUMA-VISTOS | Suma los coeficientes que se ven en los factores | 6 | T, P |
| TAL-SUMA-NO-MULT | Suma los valores de los factores en vez de multiplicarlos | 6 | T, P |
| TAL-INDEP-SUMA | Suma los términos independientes de los factores | 6 | T, P |
| TAL-OLVIDA-FACTOR | Deja fuera un factor | 6 | T, P |
| TAL-COEF-PRINCIPAL | Da el coeficiente principal cuando piden el término independiente | 6 | P |
| TAL-PIDE | Responde otra cosa que la pedida (un dato, un valor intermedio, la suma por el producto) | 1 a 6 | T, P |

Son 68 códigos; la lista se comparó con los dos archivos el 19 nov. TAL-COEF-GRADO y TAL-EXP-NEG están en el comentario de la idea 3, sin opción propia.

## Factorización, Etapa 7 (19 nov 2026): códigos TAL- de la unidad rehecha

La unidad `algebra.factorizacion` se rehízo en la Etapa 7 (`docs/etapa7/propuesta-algebra.md`; auditoría en
`rutinas/auditoria/algebra.factorizacion.md`). Todos son hipótesis de diseño, sin dato de prevalencia en alumnos
peruanos; AL8 y AL11 (de `docs/investigacion/algebra-funciones-ideas-erroneas.md`, parcial) siguen con su nombre. Cada
código vive junto a la opción que lo usa, con su `siFuera` o su explicación, en `contenido/teoria/algebra/factorizacion.js`
(T; la lista de cada idea está en su comentario) o en la práctica `plantillas/factorizacion-practica/generador.js` (P). El
análisis agrupa por (unidad, idea, error): TAL-SIGNO, TAL-PIDE, TAL-INCOMPLETA, TAL-FACTOR-SIGNO y TAL-ASPA-SIGNO tienen
otro sentido en otras unidades (TAL-FACTOR-SIGNO, por ejemplo, en Polinomios y aquí en las ideas 5 y 6). Ideas: 1 factor
común, 2 identidades, 3 aspa simple, 4 aspa doble, 5 teorema del factor, 6 MCD y MCM.

| Código | Qué hace el alumno | Ideas | Dónde |
| --- | --- | --- | --- |
| TAL-UNO-CERO | Borra el 1 que deja el término que sale entero (3x²(2x) por 3x²(2x + 1)) | 1 | T, P |
| TAL-UNO-SIGNO | Deja el 1 con el signo cambiado | 1 | P |
| TAL-UNO-COEF | No saca el número común y además pierde el 1 | 1 | P |
| TAL-COMUN-MENOR | No saca la menor potencia de x (queda una x común dentro) | 1 | T, P |
| TAL-COMUN-COEF | No saca el número común | 1 | T, P |
| TAL-COMUN-MAYOR | Toma la mayor potencia de cada letra | 1 | T, P |
| TAL-COMUN-UNA | Saca una sola de las letras comunes | 1 | T, P |
| TAL-COMUN-SUMA | Toma como número común la suma de los coeficientes | 1 | P |
| TAL-SIGNO-BIN | No cambia el signo al voltear el binomio (b − a = −(a − b)) | 1 | T, P |
| TAL-SIGNO-DENTRO | Cambia el signo dentro del binomio común | 1 | T, P |
| TAL-AGRUPA-SIGNO | Saca el factor del segundo par sin su signo | 1 | T, P |
| TAL-AGRUPA-CRUZ | Cambia el signo del binomio común | 1 | T, P |
| TAL-AGRUPA-PROD | Multiplica los números de los dos factores en vez de sumarlos | 1 | P |
| TAL-INCOMPLETA | Se para antes de que cada factor sea primo | 2, 3, 4, 5 | T, P |
| TAL-SIN-RAIZ | No pasa de los cuadrados a lo que va al cuadrado (16x + 25 por 4x + 5) | 2 | T, P |
| TAL-RAIZ-UNA | Pasa uno solo de los dos términos a lo que va al cuadrado | 2 | T, P |
| TAL-IDENTIDAD | Cambia una identidad por otra (la suma por la diferencia en un cuadrado perfecto, o al revés) | 2 | T, P |
| TAL-SIGNO | Cambia el signo del binomio al cuadrado | 2 | T, P |
| TAL-2AB | Toma el término del medio sin dividirlo entre 2 | 2 | T, P |
| TAL-CUBO-SIGNO | Deja el término del medio del trinomio con el signo del binomio | 2 | T, P |
| TAL-CUBO-DOBLE | Pone el doble producto en el trinomio de los cubos | 2 | T, P |
| TAL-CUBO-MEDIO | Olvida el término del medio del trinomio | 2 | T, P |
| TAL-CUBO-CUAD | Pone b en vez de b² al final del trinomio | 2 | P |
| TAL-PRIMO-CONST | Cuenta la constante como factor primo | 2 | T, P |
| TAL-PRIMO-X | Olvida el factor x | 2 | T, P |
| TAL-PRIMO-REPITE | Cuenta un factor repetido tantas veces como su exponente | 2 | T, P |
| TAL-ASPA-CRUCE | Pone los números en la fila equivocada | 3 | T, P |
| TAL-ASPA-PRINC | Olvida el coeficiente de x² | 3 | T, P |
| TAL-ASPA-EXTREMO | Parte mal el primer término | 3 | T, P |
| TAL-ASPA-SIGNO | Cambia los signos de los números | 3, 4 | T, P |
| TAL-ASPA-SIGNO2 | Toma el otro número con el signo cambiado | 3 | P |
| TAL-ASPA-MEDIO | Toma una partición del último término cuyo cruce no da el del medio | 3 | T, P |
| TAL-ASPA-UNO | Da uno solo de los dos binomios cuando piden la suma | 3 | P |
| TAL-ASPA-NUM | Pone otro número en el trinomio primo | 3 | P |
| TAL-PRIMO-SUMA | Abre un factor que con enteros no se abre (x² + 9) | 3 | T, P |
| TAL-DE-TODO | Pone el término en x² entero en la columna del medio | 4 | T, P |
| TAL-DE-SUMA | Suma el cruce de los extremos en vez de restarlo | 4 | T, P |
| TAL-DE-CRUCE | Pone lo que ya dieron los extremos | 4 | T, P |
| TAL-DE-RESTA | Resta al revés (el cruce menos el término) | 4 | P |
| TAL-DOBLE-NUM | Cambia los números de fila | 4 | T, P |
| TAL-DOBLE-SIGNO | Cambia el signo de los términos en y o de los números | 4 | T, P |
| TAL-DOBLE-SIGNO2 | Cambia el signo del otro grupo (números o términos en y) | 4 | P |
| TAL-DOBLE-PRINC | Parte mal el primer término (lleva el número a la otra fila) | 4 | T, P |
| TAL-FACTOR-SIGNO | Copia el signo del número en el binomio (x − 3 por P(−3) = 0) | 5, 6 | T, P |
| TAL-FACTOR-INDEP | Toma el término independiente como el número que anula | 5 | T, P |
| TAL-FACTOR-COEF | Toma el coeficiente de x² como el número que anula | 5 | P |
| TAL-FACTOR-X | Cree que x siempre es un factor | 5 | T, P |
| TAL-FACTOR-CAND | Cree que todo divisor del independiente anula a P | 5 | T, P |
| TAL-FACTOR-PROD | Multiplica los números que anulan en vez de sumarlos | 5 | P |
| TAL-OLVIDA-PRINC | Prueba solo los divisores del independiente, sin dividir entre el principal | 5 | T, P |
| TAL-FRAC-AL-REVES | Invierte la fracción (divisor del principal arriba) | 5 | T, P |
| TAL-MCD-MAX | Toma el mayor exponente en el MCD | 6 | T, P |
| TAL-MCD-SINFACTOR | Mete en el MCD un factor que no es común | 6 | T, P |
| TAL-MCD-MCM | Confunde el MCD con el MCM | 6 | T, P |
| TAL-MCD-PRIMOS | No factoriza y cree que no hay nada común (MCD 1) | 6 | T, P |
| TAL-MCM-MIN | Toma el menor exponente en el MCM | 6 | T, P |
| TAL-MCM-SUMA | Suma exponentes o grados: da P · Q y cuenta dos veces lo común | 6 | T, P |
| TAL-PIDE | Responde otra cosa que la pedida (un factor por la suma, el producto por la suma, P(0) por Q(0)) | 1, 3, 4, 5, 6 | T, P |

Son 58 códigos TAL- y los dos AL; la lista se comparó con los dos archivos el 19 nov, después de las correcciones del
cierre (salió TAL-MCM-PROD, un 8 que no producía ningún error).
