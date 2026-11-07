# Rutina de matemática B (geometría, aritmética y razonamiento matemático): reporte

Sesión paralela a la conversación principal, en la rama `rutina/matematica-b`. Orden de la lista: sólidos, geometría analítica, interés, relojes y calendarios, congruencia. No toca polígonos, fracciones ni orden de información, porque esos los hace la conversación principal. Cada plantilla pasa por tres subagentes: constructor, verificador independiente de casos (sin leer el motor) y revisor de contenido.

## 6 nov 2026 · El sólido que se abre (`plantillas/solidos/`)

**Qué hice.**

- **`motor.js`** (UMD, sin DOM) tiene:
  - las funciones de cada sólido: `prisma`, `piramide` (con h o con ap), `cilindro`, `cono` (con h o con g), `conoDeSector`, `esfera` (con el cilindro circunscrito), `troncoCono` y `troncoPiramide`;
  - las de conteo: `bloque` (cubitos visibles, ocultos y caras pintadas), `cuboPintado`, `poliedro` (Euler), `aristasUnicas` y `hojaEnrollada`;
  - `desarrollo(tipo, d, f)`: abre el sólido en 3D con un árbol de bisagras rígidas, de f = 0 (cerrado) a f = 1 (plano);
  - `tresPiramides`: la caja partida en tres pirámides iguales (Cavalieri), con el vértice que se corre.

  Los valores son exactos: con círculos, sale el coeficiente de π. Cada resultado trae `errores` y `coinciden`.
- **`casos.json`:** 19 casos con sus «tambien», entre ellos los casos 8 y 9 del informe de geometría y el ejemplo de GE13.
- **`motor.test.js`:** 41 pruebas.
  - Del desarrollo: las bisagras no se despegan, las caras son rígidas, el área no cambia al abrir y f = 1 queda plano y sin caras encimadas.
  - Medidas: el rectángulo 2πr × h y el sector de 360°·r/g.
  - Volúmenes y conteos: las tres pirámides llenan la caja y lo visible más lo oculto da el total.
  - Ningún error coincide con la respuesta (300 parámetros al azar).
  - Bordes: cubo de 1 y 2, bloques con un lado 1, ap ≤ apotema de la base, g ≤ r, sector de 0° o 400°. Además se valida el papel.
- **`papel.json`:** 10 problemas propios: caja, pirámide, cono r 8 h 6, lata por el diámetro, sector de 240°, esfera inscrita, bloque 5 × 4 × 3 pintado, vaso troncocónico, Euler y cartulina enrollada.
- **`index.html`, paso a paso** (8 pasos, 6 predicciones que bloquean):
  1. la caja que se abre (exploración);
  2. los cubitos de la caja 3 × 2 × 4 (GE13 y GE14, ambos parcial);
  3. el área lateral de la pirámide de base 6 y h 4: 60, contra 48 de GE21;
  4. su volumen: 48, contra 144 de GE20, y la caja que se parte en tres;
  5. el largo de la etiqueta de la lata (GE19);
  6. el área lateral del cono r 3, h 4 (15π), que se abre en un sector de 216°;
  7. la esfera dentro del cilindro (2/3);
  8. el explorador.
- **`index.html`, «¿qué pasa si…?»** (5 experimentos):
  1. la misma hoja, dos cilindros (bajo y alto);
  2. el semicírculo que se hace cono;
  3. el cubo 6 × 6 × 6 pintado;
  4. el vaso (tronco de cono);
  5. las aristas del prisma hexagonal.

  Las pastillas y los puntos están bloqueados, con `disabled`, `aria-disabled` y «… bloqueado».

**Pruebas.** `npm test`: 1310 en total, 1308 pasan y fallan solo `app.test.js` y `catalogo.test.js`, que se esperaba porque la plantilla aún no está en el catálogo. Playwright recorrió los dos modos a 1366 × 768 y 390 × 844, en claro y en oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes, y el dibujo queda fijo arriba en el celular.

**Subagentes.**

- **Verificador independiente** (no leyó el motor). Recalculó los 19 casos originales y los 10 problemas de papel con fracciones y un segundo método en cada caso: conteo celda por celda, Herón, área por coordenadas y cono grande menos cono chico. Encontró **0 discrepancias**. También pidió:
  - evitar alternativas que coinciden entre sí: en la esfera de r = 3, el área y el volumen dan 36π; en el cono de p3, A_T = V;
  - casos de borde.

  Apliqué todo. Los casos nuevos (cubo de 6, bloques 5 × 4 × 3 y 1 × 3 × 4, p3 y p7) los volvió a verificar por conteo cubito por cubito: 0 discrepancias. Con la convención documentada también cuadran los vértices de `tresPiramides`.
- **Revisor de contenido.** Apliqué casi todo:
  - **Cubo pintado:** el 64 estaba mal etiquetado y el problema repetía el cubo de 5 de la ampliadora. Ahora es un cubo de 6 con distractores 125, 96 y 16, todos hipótesis.
  - **Vaso:** el comentario «no crece parejo» era falso. Además, el dibujo con la punta gris adelantaba el método: ahora antes de responder se ve solo el tronco.
  - **GE13** pasó de documentado a parcial (la cifra del informe es de éxito global, no de cada error) y usa el mismo id que la ampliadora, `GE13-cuenta-visibles`.
  - **«Guardan lo mismo»** ya no se marca como GE14, sino como hipótesis cercana a GE5.
  - **Letras:** los cilindros A y B pasaron a «bajo» y «alto». En Euler hay un aviso de que V y A no son volumen ni área.
  - **Colores:** 2πr y los cubitos sin pintura van en tinta; R del vaso tiene color propio.
  - **No apliqué:** el sólido en L para P1 y un problema de tronco de pirámide en papel (ya hay 10).

**Colores** (claro / oscuro):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| h | #c0364a | #f17384 |
| r | #0f766e | #5ed9c8 |
| ap | #17451e | #40bf59 |
| g | #5f6f00 | #c8dc3c |
| A_B | #a05200 | #f0a04a |
| A_L | #1f5fbf | #7cb0ff |
| V | #a10fbf | #cf6bfa |
| R (vaso) | #7d6a00 | #e3c84a |

- **ΔE00 entre los que salen juntos:** mínimo 25,9 en claro y 26,9 en oscuro. R queda a 11 de g, pero nunca salen juntos.
- **Contraste:** ≥ 5,0:1.
- **Rojo de avisos:** h queda a ΔE00 ≈ 5 del rojo, como en otras plantillas; el aviso siempre va con texto.

**Pendiente.**

- La escena de las tres pirámides separadas se ve cargada.
- El semicírculo se ve raro a mitad del enrollado.
- Lo que no cubre:
  - prisma oblicuo, tronco de prisma y tronco de cilindro;
  - tronco de pirámide en la escena (está en el motor);
  - casquete y zona esférica, y Pappus-Guldin;
  - secciones paralelas a la base y poliedros regulares (tetraedro, octaedro).
- Las cifras de GE13 están por leer en el original.

**Pedidos para la integración.**

1. En `catalogo/cursos/geometria.json`, agregar `"solidos"` a `plantillas` de `geometria.prisma-y-piramide`, `geometria.solidos-de-revolucion` y `geometria.poliedros`. Después, `npm run catalogo`.
2. En `docs/diseno.md`, la tabla de colores de arriba. Además: A_B se lee «base» y A_L «lateral»; 2πr y los cubitos sin pintura van en tinta.
3. En el informe de geometría, GE13 dice «Documentado», pero la cifra es de éxito global: conviene bajarlo a «Parcial», como ya lo usan la ampliadora y los sólidos. La opción de caras visibles usa `GE13-cuenta-caras-visibles`, otro subtipo que la ampliadora no tiene.
4. Para `docs/pendientes.md` y CLAUDE.md: «Sólidos (6 nov 2026): `plantillas/solidos/` (desarrollo plano animado de prisma, pirámide, cilindro y cono; apotema y generatriz contra la altura; tres pirámides llenan la caja; Arquímedes; cubitos ocultos, cubo pintado y Euler; 19 casos verificados aparte; 10 de papel)».
5. Banco de entrada y salida de geometría: sumar ítems de sólidos cuando entre al catálogo (la prueba avisa).

## 6 nov 2026 · El plano con imán (`plantillas/geometria-analitica/`)

**Qué hice.**

- **`motor.js`** (UMD, fracciones exactas, raíces simplificadas, puntos escritos (x; y)):
  - funciones de puntos y rectas: `distancia`, `puntoMedio`, `divide` (AP : PB = m : n), `pendiente`, `recta` en sus tres formas, `rectaGeneral` (enteros primos entre sí, A > 0), `posicion`, `perpendicular` y `paralela`;
  - distancias y áreas: `distanciaPuntoRecta` (con el pie), `distanciaParalelas`, `area` (zapatito) y `ordenCruzado` (los dos lazos);
  - además, `masEmpinada`, `baricentro`, `circunferencia` y `circunferenciaGeneral` (circunferencia, punto o vacía).

  Cada resultado trae `errores`, `coinciden` (errores que dan lo mismo que la respuesta), `repetidos` (dos errores iguales entre sí) y `noAplica`.
- **`casos.json`:** 20 casos con sus «tambien».
- **`motor.test.js`:** 43 pruebas. Hay propiedades con 400 puntos al azar: Pitágoras, AP/PB, m₁·m₂ = −1, el pie sobre la recta y el área como base × altura / 2. También se prueba que ningún error coincide con la respuesta ni con otro error, la validación de entrada y el papel.
- **`papel.json`:** 10 problemas propios: perímetro, extremo dado el punto medio, razón 2 : 3, pendiente y ángulo, ecuación general, perpendicular, el valor de k, punto a recta, área de un cuadrilátero y circunferencia de diámetro AB.
- **`index.html`, paso a paso** (9 pasos, 7 predicciones):
  1. distancia;
  2. exploración con puntos que se arrastran con imán;
  3. punto que divide 1 : 2;
  4. pendiente: el error y/x de un solo punto es G2, parcial (la cifra es de gráficas de movimiento);
  5. exploración de las tres formas, con P₁ y P₂;
  6. b de la recta;
  7. la pendiente perpendicular, con el triángulo que gira 90°;
  8. distancia de un punto a una recta;
  9. área por zapatito en sentido horario.

  En los pasos 1, 8 y 9, antes de responder la figura se dibuja «referencial», sin cuadrícula, para que no se pueda contar la respuesta.
- **`index.html`, «¿qué pasa si…?»** (6 experimentos): la recta vertical, el punto medio con negativos, la V de pendientes 2 y −2, la distancia entre paralelas que hay que igualar primero, el zapatito en orden cruzado y cuál recta está más inclinada.

**Pruebas.** `npm test`: 1433 en total, 1431 pasan y fallan solo las 2 del catálogo, que se esperaba. Playwright revisó cinco configuraciones (1366 y 390, claro y oscuro, con movimiento reducido): sin errores ni desbordes; las pastillas están bloqueadas y el dibujo queda fijo arriba en el celular.

**Subagentes.**

- **Verificador independiente** (no leyó el motor). Usó fracciones y un segundo método en cada caso: A + t(B − A), producto punto, arccos de las normales, Cramer y producto cruz.
  - Primera pasada: 20 de 20 casos y 10 de 10 de papel, sin ninguna discrepancia.
  - Pidió tres cosas, ya aplicadas:
    - el caso vertical, donde restar cuadrados da lo mismo que la respuesta, va en `coinciden`;
    - con m = ±1, dos errores salían iguales entre sí: ahora van en `repetidos`;
    - con Δy = 0, Δx/Δy no existe: ahora va en `noAplica`.
  - Segunda pasada, sobre los casos nuevos (rectas generales con A < 0, con C = 0 y horizontal; distancia 0; paralelas con factor negativo; colineales; baricentro; circunferencia general, punto y vacía): todo OK.
  - Solo se ajustó la perpendicular a una recta vertical: «igual», que da otra recta vertical, quedó como distractor.
- **Revisor de contenido.** Apliqué todo:
  - **Grave:** A y B eran a la vez los puntos y los coeficientes de Ax + By + C = 0, y además chocaban con b. Ahora los puntos son P₁ y P₂.
  - **Medio:**
    - La cuadrícula dejaba contar la respuesta en los pasos 1, 8 y 9: ahora la figura es referencial hasta responder.
    - La opción correcta caía siempre en la misma letra: ahora está repartida.
    - La cita de GE11 decía más de lo que trae el informe: ahora es hipótesis.
    - La frase de AL25 estaba mal armada.
    - m y b no tenían color dentro de las ecuaciones.
    - La escalera de m = −5 se dibujaba subiendo.
    - En el experimento 3, solo la correcta llevaba ángulo.
  - **Menor:** rótulos encimados, el punto móvil sin nombre (ahora U), ecuaciones cortadas en el celular y un guardián en «Siguiente».

**Colores** (claro / oscuro): Δx #a05200 / #f0a04a; Δy #466d14 / #a3d65e; d #a10fbf / #cf6bfa; P y M #0f766e / #5ed9c8; L₁ y m₁ #1f5fbf / #7cb0ff; L₂ y m₂ #c0364a / #f17384; b #77032c / #ffa8b8; área S #7d6a00 / #e3c84a.

- **ΔE00 entre los que salen juntos:** mínimo 22,6 en claro y 20,4 en oscuro.
- **Pares cercanos que nunca comparten dibujo:** S y Δy (17), L₂ y b (12,6 en oscuro).
- **Contraste:** AA en los dos modos.

**Pendiente.**

- Lo que no cubre, por orden de lo más preguntado:
  - circunferencia en la escena (solo está en el papel y en el motor), parábola y elipse;
  - mediatriz y forma simétrica x/a + y/b = 1;
  - tangente a una circunferencia;
  - simétrico de un punto respecto de una recta;
  - ángulo «de L₁ a L₂»;
  - división externa.
- Casi todos los distractores son hipótesis nuestras, porque no hay informe de ideas erróneas de analítica.
- En el paso 5, «b = 5» roza los números del eje cuando P₂ cae sobre él.

**Pedidos para la integración.**

1. En `catalogo/cursos/geometria.json`, unidad `geometria.geometria-analitica`: `"plantillas": ["geometria-analitica"]`. Hoy tiene `investigacion: null`. Después, `npm run catalogo`.
2. En el catálogo, agregar «Área por coordenadas» a los temas de esa unidad, o dejar anotado que la escena lo trae aunque el catálogo no lo liste.
3. `algebra.funciones` podría enlazarse también. No lo puse porque ya la cubre la gráfica con perillas.
4. En `docs/diseno.md`, un párrafo «Variables del plano con imán» con la tabla de colores de arriba.
5. Para `docs/pendientes.md` y CLAUDE.md: «Plano con imán (6 nov 2026): `plantillas/geometria-analitica/` (distancia, punto que divide, pendiente, las tres formas de la recta, paralelas y perpendiculares, punto a recta y zapatito; 20 casos verificados aparte; 10 de papel). Falta un informe de ideas erróneas de analítica y la escena de cónicas».
6. Banco de entrada y salida de geometría: sumar ítems cuando entre al catálogo.

## 7 nov 2026 · La alcancía que gana interés (`plantillas/interes/`)

El 6 nov se cortó el constructor por el límite de uso, a mitad del `index.html`. El 7 retomó desde donde quedó, y antes de seguir subí un respaldo.

**Qué hice.**

- **`motor.js`** (`MotorInteres`, UMD, año comercial de 360 días):
  - interés simple y compuesto, con la torre por periodo dividida en capital, interés del capital e interés sobre interés;
  - curvas M–t y el tiempo para duplicar;
  - tasa efectiva y tasa por periodo, con capitalización m veces o continua;
  - valor presente y tiempo, y `dosMontos`, que halla C y r a partir de dos montos;
  - descuento comercial y racional, Vn a partir de Dc y Dr, y vencimiento común.

  Cada resultado trae `errores` y `coinciden`.
- **`casos.json`:** 20 casos, incluido el del informe: S/ 1000 al 10 % en 3 años da 1300 (simple) o 1331 (compuesto).
- **`motor.test.js`:** 40 pruebas.
- **`papel.json`:** 10 problemas propios: meses, días, capital desde el monto, compuesto trimestral, efectiva bimestral, tasa equivalente semestral, continuo, Dc y Dr de una letra, Vn desde Dc y Dr, y vencimiento común.
- **`index.html`, paso a paso** (9 pasos, 5 predicciones):
  1. ocho meses en la alcancía;
  2. la recta del simple;
  3. tres años con compuesto: el 1300 es AR16, parcial;
  4. la capa de interés sobre interés;
  5. la tasa efectiva de 2 % mensual;
  6. cada cuánto se capitaliza;
  7. el capital desde el monto (AR3, parcial);
  8. el descuento racional de una letra;
  9. el explorador.
- **`index.html`, «¿qué pasa si…?»** (6 experimentos): el doble de tiempo, medio año (ahí gana el simple), cuándo se duplica, días y meses, los dos descuentos y «cada vez más seguido», que tiene tope en 1000·e.

**Pruebas.** `npm test`: 1513 en total, 1511 pasan y fallan solo las 2 del catálogo, como se esperaba. Playwright revisó los dos modos completos a 1366 × 768 y 390 × 844, en claro y en oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes, y antes de responder lo que se pregunta sale como «?».

**Subagentes.**

- **Verificador independiente** (no leyó el motor). Primera pasada: 19 casos y 10 de papel, con 100 de 100 valores OK. Usó fracciones y un segundo camino en cada caso: la torre año por año, el binomio, la serie de e, bisección y Vn = Dc·Dr/(Dc − Dr). Segunda pasada sobre lo que cambió (casos de dos montos, bordes t = 0 y r = 0, y errores nuevos): OK. También pidió:
  - declarar en `coinciden` los errores que en r = 0 dan 0;
  - agregar errores a `dosMontos`.

  Lo apliqué. Los últimos valores de `dosMontos` los recalculé yo aparte y cuadran: 7,69 %, 7,42 %, 2097,74, 968 y 12,5 %.
- **Revisor de contenido.** Apliqué casi todo:
  - **Grave:**
    - En «Los dos descuentos», el dibujo a escala y el recuadro «?» delataban el 3300. Ahora, antes de responder, son fichas de alto fijo.
    - En «¿Cuándo se duplica?», la correcta era la única opción con decimal. Ahora todas llevan uno.
  - **Medio:**
    - Tres errores de unidades llevaban el prefijo AR16 sin serlo. Ahora no tienen código AR y son hipótesis.
    - Los errores de base se reetiquetaron AR3 o AR4 (parcial) y AR5 (hipótesis), con el respaldo que trae el informe.
    - AR16 queda «con cifra en adultos (parcial)». Los ids ligados a AR16 se unificaron.
    - Cambié tres distractores poco creíbles: 2362,50, 2,00 % y «cuadruplica».
    - En el paso 7, la columna equivocada iba con los colores de C e I. Ahora va gris con trama.
    - Dc y Dr cambiaron de color (ver abajo).
  - **Menor:** los factores ya no van en el color de r; la leyenda «interés sobre interés» sale solo después de responder.
  - **No apliqué:** un paso de vencimiento común (está en p10).

**Colores** (claro / oscuro):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| C | #1f5fbf | #7cb0ff |
| I (interés del capital) | #a05200 | #f0a04a |
| interés sobre interés | #a10fbf | #cf6bfa |
| M | #466d14 | #a3d65e |
| r | #0f766e | #5ed9c8 |
| t | #c0364a | #f17384 |
| Vn | #7d6a00 | #e3c84a |
| Va | #3328c4 | #9f9bff |
| Dc | #5a0f0f | #ff692d |
| Dr | #2d2d0f | #a5a596 |

- **Dc y Dr:** con esta paleta, ningún color saturado quedaba a ΔE00 ≥ 20 de todos los demás. Por eso son casi oscuros en claro.
- **ΔE00 dentro de cada vista:** mínimo 23,6 en la alcancía; 22,6 (claro) y 21,2 (oscuro) en el descuento.
- **Pares cercanos que nunca salen juntos:** Dc de oscuro queda a 17,5 del naranja de I y a 17,4 del rojo de los avisos (que siempre van con texto).
- **Contraste:** AA, mínimo 4,79.

**Para Gerson.** Dc cambia de tono entre los modos: granate en claro y naranja rojizo en oscuro. La única forma de cumplir ΔE00 ≥ 20 contra todo sin eso era usar grises. ¿Lo aceptas o prefieres gris?

**Pendiente.**

- En la escena faltan el vencimiento común (está en p10) y la continua como paso propio (solo está el experimento 6).
- Faltan casos de: interés como fracción del monto, capital partido a dos tasas y vencimiento común con descuento racional.
- AR16 está medido solo en adultos: hay que medirlo en escolares en el colegio.

**Pedidos para la integración.**

1. En `catalogo/cursos/aritmetica.json`, unidad `aritmetica.interes-y-descuento`: `"plantillas": ["interes"]`. Después, `npm run catalogo`.
2. En `docs/diseno.md`, la tabla de colores de arriba.
3. En el informe de aritmética:
   - AR16 dice «Documentado (en adultos)», pero solo trae una cifra de resumen, de aciertos y no del error: conviene «Parcial (adultos)».
   - La fila 116 («tasa mensual y anual sin convertir» → AR16) no es AR16: mejor «sin dato» o ligarla a AR7.
4. Para `docs/pendientes.md` y CLAUDE.md: «Alcancía que gana interés (7 nov 2026): `plantillas/interes/` (torre de monedas con la capa de interés sobre interés, recta contra curva, tasa efectiva y capitalización, capital desde el monto, descuento comercial y racional; 20 casos verificados aparte; 10 de papel)».
5. Banco de entrada y salida de aritmética: sumar ítems de interés cuando entre al catálogo.

## 7 nov 2026 · Relojes y calendarios (`plantillas/relojes-calendarios/`)

Desde esta plantilla uso los encargos oficiales de `docs/metodo/`. El verificador recibe solo las entradas que arma `entradas.py` y la cabecera del motor, sin ver `casos.json`.

**Qué hice.**

- **`motor.js`** (`MotorRelojes`, UMD; la cabecera describe cada función y la convención de H = 12):
  - del reloj: `posiciones`, `angulo`, `horaConAngulo` (fracciones exactas, como 16 4/11 min) y `coincidencias`;
  - de adelantos y atrasos: `vuelveHoraCorrecta`, `horaMarcada`, `horaReal` y `dosRelojes`;
  - de campanadas: `campanadas` y `campanadasEn`;
  - de calendario: `esBisiesto`, `bisiestos`, `diaSemana`, `diasEntre`, `desdeFecha` y `mes`.

  Cada resultado trae `errores`, `coinciden` y `repetidos`.
- **`casos.json`:** 20 casos con sus «tambien», incluidos los bordes:
  - entre las 11 y las 12 no se superponen, y entre las 5 y las 6 no se oponen;
  - 12:20;
  - un 29 de febrero en el día de partida y el 1900, que no fue bisiesto;
  - el 28/7/1821, que fue sábado.
- **`motor.test.js`:** 40 pruebas. Propiedades que comprueba:
  - cada hora forma de verdad el ángulo pedido, y un barrido fino no encuentra otras;
  - hay 11 superposiciones cada 12 h;
  - el ciclo de 400 años tiene 97 bisiestos y 146 097 días;
  - el día de la semana coincide con el calendario real;
  - ningún error coincide con la respuesta.
- **`papel.json`:** 10 problemas propios.
- **`index.html`, paso a paso** (9 pasos, 6 predicciones):
  1. el ángulo a las 3:30;
  2. el minutero que se arrastra;
  3. cuándo se superponen entre las 3 y las 4;
  4. cuántas veces se juntan en 24 h;
  5. el reloj que se adelanta 5 min cada 4 h;
  6. las 12 campanadas;
  7. el calendario que suma días;
  8. de lunes 15/3/2027 a un año después;
  9. el reloj libre.
- **`index.html`, «¿qué pasa si…?»** (6 experimentos): ángulo recto entre las 2 y las 3, el reloj que se atrasa, dos relojes, campanadas en 24 s, bisiestos de 1901 a 2100 y el mes de 31 días que empieza en jueves.
- **Respaldo:** todo es hipótesis. Los códigos AR7 (linealidad: horario quieto, campanadas proporcionales) y RM4 (desfases) se usan como los define el informe de aritmética, sin cifra.

**Pruebas.** `npm test`: 1652 en total, 1650 pasan y fallan solo las 2 del catálogo, como se esperaba. Playwright revisó 1366 × 768 y 390 × 844, en claro y en oscuro, con y sin movimiento reducido:

- sin errores ni desbordes;
- el dedo desplaza la página lejos de la punta del minutero y arrastra el minutero sobre ella;
- en el celular, el dibujo queda fijo arriba.

**Subagentes.**

- **Verificador independiente.** No leyó el motor ni `casos.json`. Las horas las sacó con la congruencia 30H − 5,5M ≡ ±α (mod 360); las fechas, con Zeller y con el día juliano, comparados con datetime.
  - **Primera pasada:** 142 de 143 valores esperados y 25 de 25 de papel. La única diferencia era de convención (la fórmula a las 12:00). Ahora la convención va escrita en la cabecera: en la fórmula, H = 12 se usa tal cual.
  - **Segunda pasada** (con los bordes y errores nuevos): 171 de 172. La que faltaba era «signo cambiado» a las 3 con α = 0: el motor daba 540/11, que repetía otro distractor. Lo corregí: ahora da null y no se ofrece. Con eso cuadran los 172.
- **Revisor de contenido.** Apliqué todo:
  - el dibujo adelantaba la idea antes de responder: la meta «12 h = 720 min» en adelantos, y la regla de segundos con los tramos en campanadas;
  - en dos predicciones la correcta era la única en onceavos: el distractor de treceavos pasó a uno en onceavos;
  - las opciones del mes de 31 días no tenían la misma forma: ahora son cuatro listas de 3 días;
  - el reloj libre mostraba una cuenta falsa a las 12, y además resolvía el experimento 1 de la otra pestaña: ahora lo oculta hasta que se responde;
  - «reloj de agujas» en los enunciados, para que la opción de 24 h no sea defendible;
  - rótulos de 12 h y detalles de texto.

**Colores** (claro / oscuro): H y horario #1f5fbf / #7cb0ff; M y minutero #a05200 / #f0a04a; α #a10fbf / #cf6bfa; adelanto A #0f766e / #5ed9c8; tiempo t #466d14 / #a3d65e; campanadas n #3328c4 / #9f9bff; intervalos #c0364a / #f17384; días d #7d6a00 / #e3c84a; resto r #77032c / #fdb4ce.

- **ΔE00 mínimo dentro de cada vista:** 23,6 en claro.
- **Pares cercanos que nunca comparten vista:** M y d, H y n, α y n, intervalos y r, d y t.
- **Contraste:** AA, mínimo 4,54.

**Pendiente.**

- Temas de examen que faltan:
  - tiempo transcurrido contra lo que falta del día;
  - campanadas que dan la hora (78 en 12 h);
  - desde cuándo se atrasa un reloj;
  - «el ayer del pasado mañana»;
  - N días con N grande;
  - el ángulo con segundos.
- Algunas conversiones de horas a días se hacen en el HTML.
- Los errores de cronometría no tienen datos: hay que medirlos en el colegio.

**Pedidos para la integración.**

1. En `catalogo/cursos/razonamiento-matematico.json`, unidad `razonamiento-matematico.cronometria-y-calendarios`: `"plantillas": ["relojes-calendarios"]`. Después, `npm run catalogo`.
2. En `docs/diseno.md`, los colores de arriba.
3. En el informe de aritmética, agregar la fila «Campanadas tratadas como proporción | AR7» a la tabla de mapeo.
4. Para `docs/pendientes.md` y CLAUDE.md: «Relojes y calendarios (7 nov 2026): `plantillas/relojes-calendarios/` (ángulo entre las agujas con minutero arrastrable, superposiciones en un día, adelantos y atrasos, campanadas, bisiestos y día de la semana; 20 casos verificados aparte; 10 de papel)».
5. Banco de razonamiento matemático: sumar ítems cuando entre al catálogo.
6. En el motor de `interes/` hay un riesgo con la animación compartida (`tween`) cuando recibe un instante negativo. Aquí ya se arregló; en interés quedó arreglado en un commit aparte (7 nov 2026).

## 7 nov 2026 · El armador de triángulos (`plantillas/congruencia/`)

**Qué hice.**

- **`motor.js`** (`MotorCongruencia`, UMD; 37° y 53° de academia con seno y coseno exactos):
  - `construir` clasifica LLL, LAL, ALA, LAA, LLA y AAA, y dice cuántos triángulos salen: ninguno, uno, dos o infinitos;
  - `armador`, `mover` y `avanzar` manejan las piezas que se arrastran y el teclado;
  - para comparar triángulos: `correspondencia` (las 6 permutaciones), `superponer`, `congruentes` y `compararDatos`, que empareja cada lado con su ángulo opuesto;
  - de la unidad: `mediatriz`, `bisectriz`, `baseMedia`, `medianaHipotenusa` y `notable`.

  Cada resultado trae `errores`.
- **`casos.json`:** 20 casos con sus «tambien».
- **`motor.test.js`:** 45 pruebas, con propiedades al azar con semilla. LLA da 0, 1 o 2 según la altura; el ángulo frente al lado mayor determina; AAA nunca determina; el armador cierra solo donde lo dice `construir`; ningún error coincide con la respuesta.
- **`papel.json`:** 10 problemas propios.
- **`index.html`, paso a paso** (8 pasos, 6 predicciones):
  1. tres varillas (LLL);
  2. el armador con LLL, LAL y ALA;
  3. la trampa LLA con el compás;
  4. hipotenusa y cateto;
  5. AAA, que da semejantes;
  6. correspondencia de vértices: ΔABC ≅ ΔQRP con PQR dado vuelta;
  7. la mediana relativa a la hipotenusa en el 5-12-13;
  8. el armador con todas las piezas.
- **`index.html`, «¿qué pasa si…?»** (5 experimentos): mediatriz, bisectriz de 74°, base media, «dos ángulos y un lado» (LAA mal emparejado) y el notable de 30° y 60°.
- **Respaldo:** ninguna predicción va como documentada. GE8 y GE11 se usan con el sentido del informe (parcial). GE9 y GE22 se citan como «la misma idea», con respaldo hipótesis. Lo demás es hipótesis nuestra.

**Pruebas.** `npm test`: 1890 en total, 1888 pasan y fallan solo las 2 del catálogo, como se esperaba. Playwright revisó 1366 y 390, en claro y en oscuro, con y sin movimiento reducido: sin errores ni desbordes. El dedo desplaza la página lejos de la punta y arrastra cerca de ella.

**Subagentes.**

- **Verificador independiente** (no leyó el motor ni `casos.json`). Usó coordenadas: corte de circunferencias, la cuadrática del compás, corte de rayos, fuerza bruta de las correspondencias y Kabsch, con control por Herón y la ley de cosenos.
  - **Primera pasada:** 153 de 157 campos. Las 4 diferencias eran de formato. Además detectó que en el papel p1, con 70°, la segunda parte no daba ningún triángulo; ahora usa 37° y da dos.
  - **Segunda pasada:** 188 campos. La única diferencia era de definición: si el corte justo en A (cuando AC = BC) cuenta como «detrás». No cuenta. Lo dejé escrito en la cabecera y pegué su texto en `verificacion`.
- **Revisor de contenido.** Apliqué todo:
  - **Grave:** el paso 7 repetía el 6-8-10 de `triangulo-estira` con las mismas cuatro cifras. Ahora usa el 5-12-13.
  - **Medio:**
    - El experimento del ángulo obtuso y un distractor repetían `caso-ambiguo`. Lo reemplacé por «dos ángulos y un lado», que es LAA mal emparejado y el motor resuelve con `compararDatos`.
    - En el paso 4, una cruz caía sobre el reflejo, que sí es válido.
    - En la mediatriz, el dibujo dejaba medir PB antes de responder.
    - La prueba del paso 7 no se seguía: ahora va por las diagonales del rectángulo.
    - El teclado quedaba atrapado en un cierre por el imán.
    - Había rótulos encimados a 390 px.
    - La correcta del paso 1 adelantaba la refutación de otra opción.
  - **Bajo:** el papel p1, las opciones con la misma forma (todas exactas), «cuña» en vez de «bisagra» para un ángulo fijo, el lector de pantalla después de responder y las leyendas «PA = PB» y «PH = PK».

**Colores** (claro / oscuro), los mismos de `caso-ambiguo` para lados y ángulos:

| Variable | Claro | Oscuro |
| --- | --- | --- |
| a | #a05200 | #f0a04a |
| b | #1f5fbf | #7cb0ff |
| c | #0f766e | #5ed9c8 |
| ∠A | #a10fbf | #cf6bfa |
| ∠B | #466d14 | #a3d65e |
| ∠C | #77032c | #fdb4ce |
| mediana | #c0364a | #f17384 |
| d (la distancia que se iguala) | #7d6a00 | #e3c84a |
| base media | #3328c4 | #9f9bff |

- **ΔE00 entre los que salen juntos:** mínimo 23,6 en claro. En oscuro, ∠C queda a 18 del gris del compás.
- **Contraste:** AA, mínimo 4,54.
- **d:** la mediatriz y la bisectriz nunca comparten dibujo, así que d nombra en cada una «la distancia que se repite».

**Pendiente.**

- Temas de examen que faltan:
  - mediana del trapecio, y «hallar x» con puntos medios;
  - en el isósceles, la altura es también mediana y bisectriz;
  - bisectriz con una incógnita (PH = 2x − 3 = PK = x + 5);
  - notables de 15° y 75°, y de 37°/2 y 53°/2;
  - congruencia de rectángulos por cateto y ángulo agudo.

**Pedidos para la integración.**

1. En `catalogo/cursos/geometria.json`, unidad `geometria.congruencia`: `"plantillas": ["congruencia"]`. Después, `npm run catalogo`.
2. En `docs/diseno.md`, los colores de arriba.
3. Para `docs/pendientes.md` y CLAUDE.md: «El armador de triángulos (7 nov 2026): `plantillas/congruencia/` (criterios LLL, LAL, ALA y LAA con piezas que se arman, la trampa LLA con el compás, hipotenusa y cateto, AAA semejantes, correspondencia de vértices, mediatriz, bisectriz, base media, mediana a la hipotenusa y notables; 20 casos verificados aparte; 10 de papel)».
4. Banco de geometría: sumar ítems cuando entre al catálogo, y rebalancear porque geometría ya pasa de 4 plantillas.

## Cierre de la lista (7 nov 2026)

Las cinco plantillas pedidas están hechas, verificadas, revisadas y subidas: sólidos, geometría analítica, interés, relojes y calendarios, y congruencia. La conversación principal pidió seguir con simetría, geometría del espacio y razonamiento con figuras. Espero la confirmación de Gerson antes de empezarlas.
