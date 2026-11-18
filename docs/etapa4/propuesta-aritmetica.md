# Propuesta de ideas: «Las cuatro operaciones» (`aritmetica.cuatro-operaciones`)

Etapa 4 del plan de calidad, rama «Números y operaciones» (la de entrada de Aritmética), la unidad que sigue a
«Numeración» · fase 1 (`docs/metodo/unidad/1-ideas.md` §A) · 18 nov 2026

Gerson: esto es solo la propuesta. No se escribe nada hasta que la apruebes o la corrijas. Las preguntas que solo tú
puedes contestar están al final (sección 11), cada una con mi recomendación.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3 y §7, `docs/molde-unidad.md`, `docs/metodo/unidad/LEEME.md` y
`1-ideas.md`, `docs/etapa2/decisiones.md` («Cambios posteriores»), `docs/etapa3/decisiones.md` (las cinco rondas), la
propuesta de Numeración como modelo, la teoría actual (`contenido/teoria/aritmetica/cuatro-operaciones.js`, v0.2.0), su
ficha en `catalogo/cursos/aritmetica.json`, su única plantilla (`plantillas/cuatro-operaciones/`: motor, 20 casos, papel
y escena), el informe `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`, las trampas de
`docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md`, la matriz `docs/teoria/matriz/aritmetica.json`
(unidad 12), `docs/temario-completo.md` §12, `docs/clasificacion/banco-cuzcano.md`, `docs/investigacion/historia-ganchos.md`,
la prueba `catalogo/pruebas/aritmetica.json`, `docs/datos/admision-unmsm.csv` y, como nivel, `numeracion.js` (con sus piezas
`arit-puesto` y `arit-talonario`), su lector en frío y su auditoría (`rutinas/frio/` y `rutinas/auditoria/`). También
revisé las unidades vecinas que tocan lo mismo: `sucesiones-y-series.js` y `razonamiento-numerico.js`.

## Qué se pregunta en los exámenes

`docs/taxonomia-*.md` no traen aritmética. El catálogo pone la unidad en las semanas 12 a 14 de la UNI y en los temas 4 y 5
de San Marcos; el contenido de la UNI no lo pude comprobar. El banco Cuzcano **no tiene ninguna ficha** de esta unidad
(`banco-cuzcano.md`, fila 12): el nivel examen sale de San Marcos y de problemas propios. En `docs/datos/admision-unmsm.csv`
hay **6 preguntas de San Marcos** clasificadas en esta unidad y 7 vecinas que la usan. Las describo con el resumen del CSV:
los solucionarios no están descargados en esta sesión.

| Periodo (pregunta) | Qué piden | Idea |
| --- | --- | --- |
| 2019-II (32) | Un número de tres cifras y su reverso difieren en una cantidad dada; el mayor número posible | 4 (a̅b̅c̅ − c̅b̅a̅ = 99 × (a − c)) |
| 2022 (32) | Una resta con cifras desconocidas que se reconstruye; la suma de esas cifras da una hora | 4 (con el préstamo de la 2) |
| 2023-II (31) | Reparto con sobrante en dos escenarios; igualar el dividendo para hallar el divisor | 6 |
| 2024-I (32) | Resta de numerales con cifras ocultas, columna por columna. Trampa: olvidar el préstamo | 4 (y 2) |
| 2024-II (33) | Reparto con sobrante y, al dar uno más a cada uno, con faltante; relación entre los restos | 6 |
| 2026-I (32) | Un numeral es el complemento aritmético de otro con cifras ocultas. Trampa: restar de 9 también la última cifra no nula | 3 (y 4) |
| *Vecinas* | | |
| 2021 (30), en razonamiento numérico | Suma de precios escrita con letras (criptoaritmética) | usa 1 y 4; se queda en `razonamiento-numerico` |
| 2019-II (36), 2024-II (32), 2026-I (32), en sucesiones | Sumas de progresiones y sumatorias notables | ninguna: es el motivo para que las sumatorias salgan (pregunta 2) |
| 2023-I (31) y 2023-II (33), en divisibilidad | «Le faltan dos», «le faltaba uno»: el resto por exceso leído como por defecto (trampa 18) | requieren la 6 |
| 2027-I (33), en MCD y MCM | Euclides con una división por exceso | requiere la 6 |

**Lo que más pesa es reconstruir cifras ocultas con llevadas y préstamos** (4 de 6: dos restas, el reverso y el
complemento con cifras ocultas). La otra mitad es la división por exceso, que además usan tres unidades de más abajo. Las
sumatorias, la multiplicación y la cantidad de cifras de un producto no salieron ninguna vez entre 2019-I y 2027-I.

---

## 0. Diagnóstico de la teoría actual contra el contrato

`cuatro-operaciones.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene 6 ideas: `sumatorias`, `complemento`,
`defecto-exceso`, `otras-bases`, `multiplicar-partes` y `cifras-producto`, y tres mesas (`escaleras-a-z`, `restos-grandes`,
`dos-productos`) con retos que se comprueban. Lo que sirve: la recta de múltiplos con los dos restos, la escalera y su
copia, la tabla de llevadas por columna y las dos tiras a la misma escala.

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Fichas, recta, tabla y tiras. Las latas de la feria, el vuelto,
   los maples de huevos, la papa y los sacos de chuño solo están escritos en «Lee».
2. **Puntos 2, 3 y 12: no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`.** Las consignas describen
   botones («Elige el dividendo a y el divisor d»).
3. **Punto 13: no hay `datos` en ningún ejercicio** ni en el papel. No hay ejemplos resueltos (0 de 90). El glosario trae 13
   términos sin `simple` y con un solo ejemplo.
4. **Punto 9: el orden falla.**
   - La idea 1 (`sumatorias`) es la misma idea, con la misma escalera, que `sucesiones-y-series.suma-rectangulo` («La suma
     es medio rectángulo»). Y San Marcos clasifica sus sumatorias en sucesiones.
   - El comentario del glosario dice que «cociente», «factor», «producto» y «múltiplo» se estrenan antes en el curso. Ya no
     es cierto: con el árbol, Razones (donde están factor, producto y cociente) llega mucho después, y Conjuntos (múltiplo) es
     otra rama, sin `requiere` de por medio.
   - «Llevada» y «reverso» se estrenan en `razonamiento-numerico`, que viene después y pide esta unidad.
   - «Acotar» está definido aquí y en Numeración.
   - La idea 4 vuelve a explicar cómo se escribe un numeral en otra base, que ya dio Numeración, y con otra notación.
5. **Regla 3: dos predicciones ya se vieron.**
   - Idea 3: la lectura del juego escribe «47 = 6·7 + 5 = 6·8 − 1» y la recta rotula rₑ. Además, el juego llega a 47 y a 6,
     y la predicción pide el resto por exceso de 47 entre 6.
   - Idea 6: la lectura del juego dice «A·B tiene m + n − 1 o m + n cifras», que es la regla, y la predicción la pide.
6. **Códigos repetidos.** La predicción de la idea 3 tiene tres incorrectas con AT-EXCESO; la de la idea 6, tres con AT-COTA;
   la de la 4, dos con AT-LLEVA, y la de la 5, dos con AT-SUMA.
7. **Punto 7 y el «·».** Mira de la idea 2 escribe «9 − 3 = 6 · 10 − 4 = 6 · 00»: se lee como una igualdad falsa. Las
   reglas y lecturas separan relaciones con «·» y también multiplican con «·».
8. **§5b: colores por papel viejo.** Resto y llevada en carmín (el color de los ángulos), el resultado en verde (junto al
   naranja se pierde en protanopía) y un solo color para cosas distintas (n, N y a, todas naranja). La escena tiene su propia
   paleta (un color por orden).
9. **«Así se resuelve» es el generador de «Ahora tú» con la semilla + 900**, y «Ahora tú» no llega a examen: no hay cifras
   ocultas, ni complemento con cifras ocultas, ni reverso, ni reparto en dos escenarios.
10. **Letras.** b es la base (Numeración decidió n), n es a la vez el largo de la escalera y las cifras de B, a es dividendo
    y factor (en Numeración, a es una cifra), y k es lo que crece un factor y también el exponente de 10ᵏ.
11. **Práctica:** ningún generador (el temario lo dice: «Prácticas que ya existen: ninguna»). La escena es un borrador 0.1.0
    con papel sin datos. En la prueba del curso, los dos ítems de la unidad (ari-17 y ari-18) están solo en la reserva.
12. Detalles: la cabecera dice «postulante de 3.º» y la notación es (34)₅, cuando Numeración fijó 34₍₅₎.

---

## 1. Las ideas, en orden

Propongo **siete** (pregunta 3). Cinco conservan su `id`. `otras-bases` pasa a ser la idea de la suma: hoy ya trata de
llevar, y así no se pierde el avance de nadie. `prestamo` y `cifras-ocultas` son nuevas. `sumatorias` sale de la unidad
(pregunta 2). Los `id` de los controles que se quedan no cambian (`N`, `a`, `d`, `b`, `m`, `n`, `k`); los rótulos sí.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `otras-bases` | La llevada llena una bolsita | Al sumar en columnas, cada 10 de un orden (cada n en base n) forman 1 del orden siguiente: eso es llevar, y en la columna se escribe lo que sobra. |
| 2 | `prestamo` (nueva) | Abrir una bolsita para restar | Si una cifra de arriba no alcanza, se abre 1 del orden de la izquierda en 10 (en n, en base n); ese orden queda con uno menos, y un 0 que presta queda en 9. |
| 3 | `complemento` | Lo que falta para llenar | El complemento aritmético de un número es lo que le falta para llegar a 10, 100, 1 000…: un 1 con tantos ceros como cifras tiene el número. |
| 4 | `cifras-ocultas` (nueva) | Cifras que faltan, columna por columna | Una cuenta con cifras ocultas se reconstruye desde las unidades: en cada columna, la llevada o el préstamo de la anterior decide qué cifra cabe. |
| 5 | `multiplicar-partes` | Multiplicar es juntar bolsas iguales | Un producto junta bolsas iguales: si cada bolsa recibe unos caramelos más, el producto sube esos caramelos por la cantidad de bolsas, no solo esos caramelos. |
| 6 | `defecto-exceso` | Sobran o faltan para otra bolsita | Al empacar en bolsitas iguales, por defecto sobran unos sueltos; por exceso se cuenta una bolsita más y faltan otros; los dos restos suman lo que lleva una bolsita. |
| 7 | `cifras-producto` | ¿Cabe el producto en la pantalla? | Sin hacer la cuenta, las cifras de un producto se acotan con el menor y el mayor caso: son las cifras de los dos factores sumadas, o una menos. |

`pregunta` (Resumen): 1 «¿Por qué se lleva 1 cuando una columna pasa de 9?» · 2 «¿Por qué al restar a veces se abre una
bolsita?» · 3 «¿Qué es el complemento aritmético de un número?» · 4 «¿Cómo se descubre una cifra manchada?» · 5 «¿Cuánto sube
un producto si un factor crece?» · 6 «¿Qué es el resto por exceso?» · 7 «¿Cuántas cifras puede tener un producto?».

`actividad`: 1 «Juntar dos pedidos y empacar de 10 en 10 hasta dejar la etiqueta lista.» · 2 «Despachar un pedido abriendo
bolsitas y cajas solo cuando hace falta.» · 3 «Agregar caramelos hasta llenar justo el cajón.» · 4 «Probar cifras bajo las
manchas hasta que la cuenta del cuaderno cuadre.» · 5 «Agregar caramelos a cada bolsa y ver cuánto sube el pedido.» ·
6 «Cambiar el tamaño de la bolsita y ver cuánto sobra y cuánto falta.» · 7 «Elegir cuántas cifras tienen dos números y ver
si su producto cabe en la pantalla.»

**Por qué va cada una ahí y qué da por sabido**

1. **La llevada.** Es la raíz de las otras seis: la llevada es el «juntar» de Numeración, pero entre dos pedidos y columna
   por columna. Da por sabido la base, la cifra, el numeral y la escritura 34₍₅₎ (Numeración, ideas 1 y 2). Las otras bases
   entran por la predicción: el juego es en base 10 y se pregunta qué pasa con bolsitas de 5 (pregunta 4). Estrena:
   sumandos, llevada.
2. **El préstamo.** Es la llevada al revés: abrir en vez de juntar. Necesita la 1 porque compara las dos. Lo más preguntado
   de la unidad (las restas de 2022 y 2024-I) depende de esta idea. Estrena: minuendo, sustraendo, diferencia, préstamo.
3. **El complemento.** Es una resta especial: la meta es 10ᵏ, con k las cifras del número (Numeración, idea 5). La
   predicción es una resta con un cero en medio, así que necesita la 2. El atajo («de 9 todas, de 10 la última que no es
   0») sale en «Mira» como consecuencia de esa resta; en los `datos` va la definición, no el atajo (punto 13). Estrena:
   complemento aritmético, última cifra significativa.
4. **Cifras ocultas (nueva).** Junta la 1, la 2 y la 3 con la descomposición de Numeración (a̅b̅c̅ = 100 × a + 10 × b + c, que
   da a̅b̅c̅ − c̅b̅a̅ = 99 × (a − c)). Es el centro del examen (4 de 6 preguntas) y hoy no está en la teoría, solo en la escena
   (paso 4). Estrena: reverso, consecutivo (lo usan Potenciación y Sucesiones: pregunta 8).
5. **Multiplicar.** Usa la 1: multiplicar por una cifra en columnas es llevar, y la llevada puede ser 2 o más (también en
   base n: 34₍₅₎ × 3). Su predicción es la del examen de academia: «si un factor sube 4 y el producto sube 52, ¿cuál es el
   otro factor?». Estrena: factor, producto, propiedad distributiva.
6. **Defecto y exceso.** Numeración ya dio la división con resto (idea 3: D = q × n + r, entre la base). Aquí se divide entre
   cualquier tamaño de bolsita y se estrena el exceso: D = d × (q + 1) − rₑ y r + rₑ = d. Va después de la 5 porque usa
   d × q. Estrena: dividendo, divisor, múltiplo, resto por exceso.
7. **Cifras de un producto.** Usa la 5, la 6 (el cociente entero) y la idea 5 de Numeración (un número de k cifras va de
   10ᵏ⁻¹ a 10ᵏ − 1). Va al final porque no la necesita nadie más. Estrena: cota, estimar.

**Qué no entra:** las sumatorias (pasan a Sucesiones y series, pregunta 2); la criptoaritmética de palabras con letras
distintas y a̅b̅ + b̅a̅ = 11 × (a + b), que se quedan en Razonamiento numérico (pregunta 5); y la división en otras bases.

---

## 2. Objeto de la primera pantalla

Se sigue el hilo de Numeración: **el puesto de doña Juana en el mercado de Juliaca** (pregunta 1). En este tema empaca de 10
en 10: 10 sueltos llenan una bolsita, 10 bolsitas una caja y 10 cajas un cajón. Es la misma regla de juego que ya conoce el
alumno, ahora en base 10. Llevar es **juntar** 10 sueltos en una bolsita que sube a la columna de al lado. Prestar es
**abrir** una bolsita en 10 sueltos. El motor de la escena ya cuenta con esas piezas (`aMano`, `juntarMano`, `abrirMano`),
así que la misión se comprueba con él (regla 1). Para las ideas 4 y 7 entran dos objetos nuevos del mismo puesto: el
cuaderno de cuentas y la calculadora.

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | El mostrador con dos pedidos que se juntan (el de la mañana y el de la tarde), y al lado la cuenta en columnas del cuaderno | sueltos, bolsitas y cajas = columnas; la bolsita que se llena y sube = la llevada |
| 2 | Doña Juana despacha un pedido: para entregar 8 sueltos tiene que abrir una bolsita | la bolsita abierta = el préstamo; lo que queda en el mostrador = la diferencia |
| 3 | «Lee»: el vuelto (algo de S/ 37 pagado con un billete de S/ 100). Juego: el cajón de 1 000 a medio llenar | lo que falta para llenar el envase = el complemento |
| 4 | El cuaderno de cuentas de doña Juana con tres cifras manchadas de chicha morada | mancha = cifra oculta; la cuenta tiene que cuadrar |
| 5 | Un pedido escolar: 7 bolsas de sorpresa con 24 caramelos cada una, sobre el mostrador | bolsas = un factor; caramelos por bolsa = el otro; el pedido = el producto |
| 6 | Bolsitas de d caramelos: las llenas, los sueltos que sobran y una bolsita a medio llenar con sus huecos punteados | sueltos = r; huecos que faltan = rₑ |
| 7 | La calculadora de doña Juana, con una pantalla de 8 casillas | cada casilla = una cifra; ¿cabe el producto? |

Piezas: `arit-puesto` ya existe. Hay que comprobar que con n = 10 y dos pedidos a la vez todo cabe en el lienzo de 320 (hoy
se usa de 5 a 9). Nuevas, dibujadas como prueba (`data-prueba`, con su prueba numérica de encuadre y rótulos; molde §6):
**`arit-cuaderno`** (la cuenta escrita en columnas, con la llevada arriba, el préstamo tachado y las manchas), para las
ideas 1, 2, 4 y 5, y **`arit-calculadora`** (la pantalla con sus casillas), para la idea 7. `recta`, `arit-tiras` y
`arit-tabla` quedan para «Mira» y los ejemplos, al lado del objeto.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «Le llegaron dos pedidos y los junta en el mostrador.» **Junta el pedido de 47 y el de 38 y empaca hasta que la etiqueta quede lista.** | primer y segundo pedido, 11–89; tocar una columna junta 10 en 1 del orden siguiente (zona `data-toque`). Solo base 10: `b` pasa al laboratorio | pedidos 47 y 38, y `estadoMano` sin ningún orden con 10 o más | «7 + 8 = 15 sueltos = 1 bolsita de 10 + 5 sueltos: la bolsita sube con las otras 7» | «15 sueltos llenaron una bolsita que subió: 4 + 3 + 1 = 8 bolsitas y 5 sueltos.» |
| 2 | «Tiene 4 cajas, 3 bolsitas y 2 sueltos: 432 caramelos.» **Despacha 178 caramelos abriendo solo lo que haga falta.** | minuendo sin ningún 0 (cada cifra de 1 a 9) y el despacho, 100–399; tocar una bolsita o caja la abre (`abrirMano`) | resultado 254 con 2 aperturas | «Para quitar 8 sueltos abrió 1 bolsita: 2 + 10 = 12 sueltos, y le quedan 2 bolsitas» | «Abrió una bolsita y una caja: le quedan 254, y cada orden que prestó quedó con uno menos.» |
| 3 | «Tiene 740 caramelos y el cajón lleno lleva 1 000.» **Agrega los que faltan para llenar justo el cajón.** | `N`, 20–980; los que agrega, 0–980 | `N === 740` y agrega 260 | «740 + 260 = 1 000: le faltaban 260 para el cajón» | «Con 260 más, las bolsitas llenaron una caja y las cajas, el cajón.» |
| 4 | «Se le mancharon tres cifras del cuaderno: ?85 + 6?? = 1 282.» **Encuentra las cifras para que la cuenta cuadre.** | una cifra por mancha, 0–9 | 585 + 697 (solución única: `cifrasFaltantes` del motor) | por columna: «unidades: 5 + 7 = 12 → escribe 2 y lleva 1» | «La llevada de cada columna decidió la cifra de la siguiente: 585 + 697 = 1 282.» |
| 5 | «Arma 7 bolsas de 24 caramelos para la promoción.» **Agrega a cada bolsa lo justo para que el pedido suba 21 caramelos.** | `a` caramelos por bolsa, 11–39; `b` bolsas, 3–9; se arrastra el borde de una bolsa | `b === 7 && a === 27` | «27 × 7 = 24 × 7 + 3 × 7: subió 21, 3 por cada una de las 7 bolsas» | «3 más en cada bolsa, por 7 bolsas: el pedido subió 21.» |
| 6 | «Tiene 47 caramelos y bolsitas de varios tamaños.» **Elige la bolsita con la que le faltan justo 3 para llenar una más.** | `a`, 20–60; `d`, 3–9 | `a === 47 && d === 5` (es la única de 3 a 9) | «47 = 9 bolsitas de 5 + 2 sueltos; para otra bolsita faltan 3» | «Con bolsitas de 5 llena 9, le sobran 2 y la décima espera 3 más.» |
| 7 | «La calculadora muestra hasta 8 cifras.» **A tiene 5 cifras: ¿cuántas puede tener B, como máximo, para que A × B quepa siempre?** | `m` cifras de A, 1–5; `n` cifras de B, 1–4 (rótulos «cifras de A», «cifras de B»: ninguna letra en pantalla) | `m === 5 && n === 3` | «el menor: 10 000 × 100 = 1 000 000 (7 casillas); el mayor: 99 999 × 999 = 99 899 001 (8)» | «Con B de 3 cifras, hasta el mayor producto llena justo las 8 casillas.» |

Ningún `bien` dice la respuesta de su predicción. El juego no llega a la predicción: en la 1 no sale de base 10; en la 2 el
minuendo no tiene ceros; en la 3 la meta llega a 1 000 y nunca a 10 000; en la 7 solo se multiplica, y la predicción es del
cociente.

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores y equivalencias, nunca la fórmula. **No hay estudios con cifras
sobre errores de las cuatro operaciones**: lo dice el informe de aritmética (línea 129). Todo código AT es una hipótesis.
Algunos los respaldan las trampas deducidas de San Marcos: la 29 («préstamo olvidado en la resta y complemento aplicado
también a la última cifra», 2 preguntas) y la 18 («residuo por defecto contra por exceso», 3). Ninguna predicción repite un
código. Las cuentas de las ideas 1, 2 y 3 son casos verificados de la escena (`casos.json`); las de las demás las rehice
aparte.

**Idea 1.** «En otro puesto, doña Juana usa bolsitas de 5. Junta un pedido de 34₍₅₎ y otro de 23₍₅₎. ¿Cómo queda la
etiqueta?» Datos: 1 bolsita = 5 caramelos; 1 caja = 5 bolsitas.

| Opción | Qué mide |
| --- | --- |
| 112₍₅₎ | Correcta: 4 + 3 = 7 = 1 bolsita + 2; 3 + 2 + 1 = 6 = 1 caja + 1 bolsita |
| 57₍₅₎ | Lleva al llegar a 10, como en base 10 (AT-DECIMAL) |
| 102₍₅₎ | No suma la llevada en la columna de las bolsitas (AT-LLEVA-OLVIDA) |
| 12₍₅₎ | No escribe la última llevada (AT-LLEVA-FINAL) |

**Idea 2.** «Tiene 5 003 caramelos y le piden 1 478. ¿Cuántos le quedan?» Datos: 1 bolsita = 10; 1 caja = 10 bolsitas;
1 cajón = 10 cajas. El juego nunca tuvo un 0 que prestar.

| Opción | Qué mide |
| --- | --- |
| 3 525 | Correcta: el préstamo abre un cajón, una caja y una bolsita en cadena |
| 4 475 | Resta el menor del mayor en cada columna (AT-MENOR-MAYOR) |
| 4 635 | Presta sin descontar (AT-SIN-DESCONTAR; trampa 29, San Marcos 2024-I) |
| 3 635 | Los ceros que prestan quedan en 10, no en 9 (AT-CERO-DIEZ) |

**Idea 3.** «¿Cuál es el complemento aritmético de 4 073?» Datos: 4 073 tiene 4 cifras; 10⁴ = 10 000. «Lee» ya dio la
definición con el vuelto, y el juego nunca pasó de 1 000.

| Opción | Qué mide |
| --- | --- |
| 5 927 | Correcta: 10 000 − 4 073 |
| 5 926 | Resta de 9 todas las cifras, también la última (AT-CA9; trampa 29, San Marcos 2026-I) |
| 5 027 | Deja el 0 del medio como 0 (AT-CERO-QUEDA) |
| 95 927 | Usa una potencia de más: 100 000 (AT-CA-K) |

**Idea 4.** «En el cuaderno hay una resta manchada: 8☐2 − ☐57 = 375. ¿Qué cifra está bajo la mancha del 57?» Datos: la
resta está bien hecha; cada mancha es una cifra. El juego fue una suma y esta es una resta (2024-I).

| Opción | Qué mide |
| --- | --- |
| 4 | Correcta: las decenas piden prestado a las centenas, que quedan en 7; 7 − 4 = 3 (832 − 457 = 375, única) |
| 5 | Olvida que las centenas prestaron: 8 − 5 = 3 (AT-SIN-DESCONTAR; trampa 29) |
| 3 | Descuenta dos préstamos en las centenas: 6 − 3 = 3 (AT-DOBLE-DESCUENTO) |
| No se puede saber | Cree que con dos manchas faltan datos (AT-SUFICIENCIA; el código ya existe en razonamiento numérico) |

**Idea 5.** «Doña Juana agrega 4 caramelos a cada bolsa de un pedido, y el pedido sube 52 caramelos. ¿Cuántas bolsas
hay?» Datos: a cada bolsa se le agregan 4 caramelos; el pedido sube 52. El juego fue al revés: del aumento al total.

| Opción | Qué mide |
| --- | --- |
| 13 | Correcta: 52 = 4 × 13 |
| 48 | Resta el aumento: 52 − 4 (AT-RESTA-AUMENTO) |
| 56 | Suma el aumento: 52 + 4 (AT-SUMA-AUMENTO) |
| 208 | Multiplica: 52 × 4 (AT-MULTIPLICA) |

**Idea 6.** «Doña Juana reparte caramelos entre sus 7 sobrinos: les da 5 a cada uno y le sobran 4. ¿Cuántos le faltarían
para darles 6 a cada uno?» Datos: 7 sobrinos; 5 caramelos a cada uno; sobran 4. Aquí el 7 no es el tamaño de una bolsita
sino cuántos reciben: se mide si la relación pasa del empaque al reparto (es el caso de 2024-II).

| Opción | Qué mide |
| --- | --- |
| 3 | Correcta: dar uno más a cada uno pide 7; tiene 4 sueltos; faltan 7 − 4 |
| 4 | El resto por exceso es el mismo que por defecto (AT-EXCESO-IGUAL; trampa 18) |
| 7 | Responde el divisor (AT-EXCESO-DIVISOR) |
| 11 | Suma el resto y el divisor (AT-EXCESO-SUMA; es el «error objetivo» de la matriz) |

**Idea 7.** «A tiene 7 cifras y B tiene 3. ¿Cuántas cifras puede tener el cociente entero de A entre B?» Datos: A va de
1 000 000 a 9 999 999; B va de 100 a 999. El juego solo multiplicó.

| Opción | Qué mide |
| --- | --- |
| 4 o 5 | Correcta: de 1 000 000 ÷ 999 (1 001) a 9 999 999 ÷ 100 (99 999) |
| siempre 4 | Resta las cifras: 7 − 3 (AT-COTA-RESTA) |
| siempre 5 | Mira solo el caso mayor (AT-COTA-MAX) |
| 9 o 10 | Usa la regla del producto (AT-COTA-PRODUCTO) |

Los códigos nuevos van al informe de aritmética como hipótesis, en una tabla AT que hoy falta (la auditoría de Numeración,
B14, pidió lo mismo). Ningún ejemplo del glosario ni de «Lee» usa los números de estas predicciones (auditoría de
Numeración, M1).

---

## 5. Lo que tiene que decir cada regla y adónde llega «Ahora tú»

| Idea | La regla dice | «Así se resuelve» (distinto de «Ahora tú») | «Ahora tú», hasta nivel examen |
| --- | --- | --- | --- |
| 1 | Se suma columna por columna desde las unidades; cada 10 (cada n) se lleva 1, y con varios sumandos la llevada puede ser 2 o más | sumar dos pedidos en base n con la tabla de columnas | varios sumandos con llevada de 2; suma en base n; «¿cuánto se llevó a las centenas?» |
| 2 | Se abre 1 del orden de la izquierda en 10 (en n); ese orden queda con uno menos; un 0 que presta queda en 9 (en n − 1) | resta en base n que cruza un 0: 302₍₅₎ − 143₍₅₎ = 104₍₅₎ (caso de la escena) | restas con varios ceros; resta en base n; cuántos préstamos hubo |
| 3 | CA(N) = 10ᵏ − N, con k las cifras de N; en base n, la meta es nᵏ. Consecuencia, vista en «Mira»: de 9 todas y de 10 la última que no es 0; los ceros finales se quedan | CA de un número con ceros al final (3 740 → 6 260) | CA en base n; N + CA; **CA con cifras ocultas (2026-I)** |
| 4 | Se empieza por las unidades; la llevada o el préstamo de cada columna pasa a la siguiente; si una cifra aparece en varios lugares, vale lo mismo; a̅b̅c̅ − c̅b̅a̅ = 99 × (a − c) | una suma con dos manchas | restas con manchas (2022, 2024-I); el mayor a̅b̅c̅ con a̅b̅c̅ − c̅b̅a̅ dado (2019-II) |
| 5 | Si un factor sube, el producto sube eso por el otro factor; en columnas, cada cifra por el factor y se lleva de 10 en 10 (de n en n), aunque sea más de 1 | multiplicar por una cifra en base n: 34₍₅₎ × 3 = 212₍₅₎ (caso de la escena) | los dos factores cambian; el factor que falta (como la predicción, con otros números); cifras ocultas en un producto por una cifra |
| 6 | D = d × q + r (sobran r) y D = d × (q + 1) − rₑ (faltan rₑ), con 0 < r < d; r + rₑ = d; el mayor resto es d − 1; si no sobra nada, hay una sola división | hallar D desde q y rₑ: 23 × 15 + 14 = 359 (caso de la escena) | r = rₑ solo si d es par; **dos repartos del mismo dividendo (2023-II)**; **uno más a cada uno (2024-II)** |
| 7 | El producto tiene las cifras de los dos factores sumadas, o una menos; el cociente entero, la resta de las cifras, o una más; se decide mirando los casos extremos | cifras de un producto con la tabla de extremos | cifras de un cociente; cifras de A² × B³ |

---

## 6. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| n | la base, como en Numeración; sin base escrita, es 10 | Hoy es b, el largo de la escalera y las cifras de B. El control `b` conserva su id |
| 34₍₅₎, a̅b̅c̅ | numeral en base 5; numeral de cifras a, b, c (con raya) | La notación de Numeración (`num`, `{ raya }`). Se reemplaza el (34)₅ de hoy |
| a, b, c | cifras ocultas que aparecen en varios lugares (a̅b̅c̅ − c̅b̅a̅) | Nunca un factor ni el dividendo (hoy a es las dos cosas) |
| ☐ | una mancha: la cifra que se busca | En las figuras va en tinta, como lo pedido |
| × | multiplicar, como en Numeración | El «·» no se usa: ni para multiplicar ni para separar dos relaciones |
| N | el número del que se saca el complemento | Solo en la idea 3. En base n se escribe el numeral (CA(213₍₅₎)), para que N no quede al lado de n |
| k | cuántas cifras tiene un número (10ᵏ, la meta del CA) | Hoy k es también lo que crece un factor: eso va en palabras («4 más en cada bolsa») |
| CA(N) | complemento aritmético de N | Se presenta con el vuelto en «Lee» de la idea 3 |
| D, d | dividendo y divisor | D y d conviven, como N y n en Numeración: cada uno con su color y su leyenda. D ya es el dividendo en Numeración |
| q, q + 1 | cociente por defecto y cociente por exceso | No se crea «qₑ». q va en palabras en la leyenda y en la regla (auditoría de Numeración, M4) |
| r, rₑ | resto por defecto (lo que sobra) y resto por exceso (lo que falta) | rₑ con subíndice de verdad |
| A, B | dos números en la idea 7 | Las cantidades de cifras van en palabras («cifras de A»): m y n chocarían con la base |
| sumatoria, la escalera, «a hasta z» | **salen** con las sumatorias | Quitan el choque de n y a |

---

## 7. Mapa de colores por magnitud (§5b)

Un color fijo por magnitud en toda la unidad. El criterio es lo que cada cosa es en el puesto, como en Numeración: **el
envase** (de cuánto se agrupa), **lo que se muda** (lo que sube, se abre o queda suelto) y **lo que se busca**. Los números
que entran a la cuenta van en tinta: la cuenta escrita es el dibujo, y la fila dice cuál es cuál.

| Token | Magnitud | Dónde se ve |
| --- | --- | --- |
| `i` turquesa | el envase: la base (10, o n), el tamaño de la bolsita y el divisor d; las metas 10, 100, 1 000 (10ᵏ) del complemento y de las cotas | el contorno de la bolsita, la caja y el cajón; el subíndice ₍ₙ₎; «10 sueltos = 1 bolsita»; los puntos de la recta de múltiplos |
| `o` naranja | lo que se muda o queda suelto: la llevada (la bolsita que sube), el préstamo (la que se abre) y el resto por defecto r (los sueltos que sobran) | el 1 chico sobre la columna, la cifra tachada que prestó, los sueltos de la idea 6 |
| `f` violeta | lo que se busca casi siempre: el resultado de la cuenta (suma, diferencia, producto, cuánto sube), el complemento, el resto por exceso rₑ y la cantidad de cifras | la fila del resultado, la cota del complemento, los huecos punteados de la bolsita incompleta |
| tinta | los números que entran a la cuenta (sumandos, minuendo, sustraendo, factores, N, D), el cociente q, las bolsas del pedido de la idea 5, los caramelos dibujados, «?» y las manchas | — |
| verde, carmín | **no se usan** | el carmín es de ángulos y el verde se pierde junto al naranja (0,010 en protanopía) |

Pares que van juntos (medidos en §5b): naranja–turquesa 0,114, naranja–violeta 0,189 y turquesa–violeta 0,101, todos
≥ 0,08. El par que más importa, r y rₑ en la misma recta, es naranja–violeta.

Avisos:
- **La respuesta lleva el color de su magnitud.** Violeta casi siempre. Si se pide el divisor (2023-II), turquesa. Si se pide
  el dividendo, tinta con su recuadro de respuesta. Lo pedido va con «?» en tinta hasta comprobar.
- **El resultado es violeta también cuando se da** (la fila 1 282 de la idea 4), como la cantidad de Numeración. La cifra
  manchada que se halla toma el color de su fila: violeta si está en el resultado, tinta si está en un sumando. Así ninguna
  figura de Predice delata la respuesta por su color: en la predicción 4 la mancha está en el sustraendo.
- **Cambia respecto de Numeración:** allá la cantidad de caramelos era violeta y las cifras de la etiqueta, naranja. Aquí
  los números que se operan van en tinta y el violeta queda para el resultado. La razón es que en una cuenta hay dos o tres
  números del mismo tipo, y el naranja se necesita para la llevada, que va pegada a ellos. La prueba de colores de la unidad
  lo comprueba en las siete ideas (pregunta 6).
- La escena (un color por orden) queda distinta hasta que se rehaga. Las mesas `restos-grandes` y `dos-productos` son de esta
  teoría: se corrigen aquí. Hoy el `k` de la segunda va en carmín.

---

## 8. Práctica: qué existe y qué falta por idea

**Lo que existe hoy:**
- **Escena `cuatro-operaciones`** («El tablero de las llevadas», borrador 0.1.0): 8 pasos, 20 casos verificados aparte y
  10 problemas de papel sin `datos`, dos de ellos sumatorias. Su motor es lo más valioso: `sumaColumnas`, `restaColumnas`,
  `multiplicaPorCifra`, `complemento`, `cifrasFaltantes`, `cripto`, `diferenciaInvertida`, `division`,
  `dividendoPorExceso`, `cifrasProducto` y la cuenta a mano. Sirve para comprobar las siete misiones.
- **Ningún generador** de práctica.
- Tres mesas de laboratorio y 2 ítems en la reserva de la prueba del curso: ari-17 (resta con ceros) y ari-18 (resto por
  exceso).

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Llevada | pasos 1 y 8 de la escena; casos de 478 + 356 y 342₍₅₎ + 213₍₅₎ | una mesa «cualquier cuenta, cualquier base» (el explorador a mano, con `b`); tipos «suma con varios sumandos», «suma en base n», «¿cuánto se llevó?» |
| 2 Préstamo | paso 3; casos de 5 003 − 1 478, 302₍₅₎ − 143₍₅₎ y 503 − 178; ítem ari-17 | tipos «resta con ceros», «resta en base n», «cuántos préstamos» |
| 3 Complemento | paso 2; casos de 4 073, 3 740 y 5 800 | tipos «CA de N», «CA en base n», «CA con cifras ocultas» (2026-I) |
| 4 Cifras ocultas | pasos 4 y 7; casos de ?85 + 6??, a̅b̅c̅ − c̅b̅a̅ y XY + YX | tipos «suma manchada», «resta manchada» (2022, 2024-I), «el mayor a̅b̅c̅ con su reverso» (2019-II); una mesa |
| 5 Multiplicar | mesa `dos-productos`; caso de 34₍₅₎ × 3 | tipos «por una cifra en base 10 y en base n», «cuánto sube», «el factor que falta», «los dos cambian» |
| 6 Defecto y exceso | mesa `restos-grandes`; paso 6; casos de 47 ÷ 9 y 359; ítem ari-18 | tipos «rₑ desde r», «D desde q y rₑ», «resto máximo», «dos repartos» (2023-II), «uno más a cada uno» (2024-II) |
| 7 Cifras | casos de 4 y 3 cifras | tipos «cifras de A × B», «de A ÷ B», «de A² × B³» |

Propuesta (pregunta 9): una plantilla nueva de formato `predicciones`, `plantillas/operaciones-cifras/`, con generador por
idea (`TIPOS_POR_IDEA`), prueba en 400 semillas, `casos.json` verificado aparte (no con el motor de la escena) y papel de 5
a 10 por idea con sus datos al final. Los tipos usan los mismos colores, letras y códigos que la teoría. La escena va a «Más
mesas del tema» y sale de `plantillas` de la unidad hasta rehacerla, porque su papel no trae datos (auditoría de Numeración,
M12). Faltan también ítems de las ideas 3 y 4 en la prueba del curso.

---

## 9. Datos del mundo

La unidad casi no los necesita: el puesto, el cuaderno y la calculadora son situaciones de problema.

| Dato | ¿Fuente? |
| --- | --- |
| Caramelos, bolsitas de 10, pedidos de hasta 4 cajas, sobrinos | Valores de problema, sin fuente. Que sean posibles: pedidos de 10 a 999 en el juego y de hasta 5 cifras en los ejercicios |
| Billete de S/ 100 y vuelto de una compra de S/ 37 | Denominaciones vigentes del BCRP (S/ 10, 20, 50, 100 y 200): es de todos los días, sin fuente. No se usa un billete de S/ 1 000, que no existe |
| Calculadora con pantalla de 8 cifras | Es la de bolsillo común; sin fuente |
| Historia: la multiplicación egipcia por duplicaciones | Ya trae fuente (MacTutor, *Egyptian Papyri*); se queda |
| La yupana de Guaman Poma | **No entra**: `historia-ganchos.md` la marca «dudoso» y dice «no usar como hecho en la escena» |

---

## 10. Riesgos de orden con otras unidades (`requiere`)

- **`requiere: ['aritmetica.numeracion']` es correcto y basta.** De Numeración se usan la base n y su escritura, a̅b̅c̅ con
  raya, la descomposición (para el reverso), la división con resto (idea 3) y «un número de k cifras va de 10ᵏ⁻¹ a 10ᵏ − 1»
  (idea 5). Las potencias de 10 van como dato.
- **Unidades que piden esta y necesitan algo de aquí:**
  - Divisibilidad: el resto por exceso de «le faltaba uno» (trampa 18);
  - MCD y MCM: Euclides con una división por exceso (2027-I);
  - Potenciación: la raíz por exceso usa «resto por exceso»;
  - Álgebra, la unidad con `polinomios`: la identidad D = d × q + r;
  - Razonamiento numérico: la criptoaritmética usa la llevada.
  Las cinco quedan bien con la idea 6 y la idea 1.
- **Sumatorias:** si salen, `sucesiones-y-series` ya tiene la misma idea. Hay que pasarle «sumatoria» y «sumandos» del
  glosario, la mesa `escaleras-a-z` y, con `Avance.migrar`, lo que el alumno hizo en la idea `sumatorias`, como se hizo con
  Vectores.
- **Glosario fuera de orden** (pregunta 8):
  - «factor», «producto» y «cociente» se estrenan en Razones, que llega después de esta unidad;
  - «múltiplo» se estrena en Conjuntos, que es otra rama;
  - «llevada» y «reverso» se estrenan en Razonamiento numérico, que pide esta unidad;
  - «consecutivo» lo usan Potenciación y Sucesiones; si se fuera con las sumatorias, Potenciación lo usaría sin tenerlo de
    requisito;
  - «acotar», «cociente», «resto», «potencia» y «cifra oculta» ya están en Numeración: aquí no se redefinen.
- **La escena vieja** cubre sumatorias y criptoaritmética. Mientras esté en «Más mesas», su paso 5 enseña algo que la
  unidad ya no tiene.
- **Piezas:** `arit-puesto` con n = 10 puede no caber con dos pedidos y cajas a la vez. Si no cabe, el juego se queda en
  pedidos de dos cifras (idea 1) y de tres cifras sin cajones (idea 2).

---

## 11. Preguntas para Gerson

1. **¿Seguimos con el puesto de doña Juana o cambiamos de objeto?** Recomiendo **seguir**. La llevada es el mismo «juntar»
   de Numeración y el préstamo es «abrir», así que el alumno pasa de un tema al otro sin aprender un dibujo nuevo. El
   puesto funciona en cualquier base, y las bolsitas son también la división (idea 6). El motor de la escena ya trae ese
   modelo. La otra opción, el dinero (monedas de S/ 1, billetes de S/ 10 y S/ 100), sirve solo en base 10 y se acaba en S/ 100.
   Por eso el dinero entra solo como tarjeta de «Lee» (el vuelto de la idea 3). Para las ideas 4 y 7 propongo dos objetos
   del mismo puesto: el cuaderno manchado y la calculadora.
2. **¿Las sumatorias salen a Sucesiones y series?** Recomiendo que **sí**. Allá está la misma idea con la misma escalera, y
   San Marcos clasifica ahí sus sumatorias (3 preguntas). Además se quita el choque de letras (n como largo de la escalera).
   El avance de la idea `sumatorias` y la mesa `escaleras-a-z` pasan a Sucesiones con `Avance.migrar`. En el catálogo, el
   tema «Adición y sumatorias» pasa a «Adición con llevadas».
3. **¿Siete ideas, con `prestamo` y `cifras-ocultas` nuevas?** Recomiendo que **sí**: la resta y las cifras ocultas son 4 de
   las 6 preguntas de San Marcos y hoy no están en la teoría. Si hay que recortar, lo primero que juntaría es la 7 dentro de
   la 5, como su nivel examen: no salió en San Marcos. Pero perdería su juego y su predicción, y la UNI la pone en su temario.
4. **Operaciones en otras bases** (Numeración las mandó aquí): recomiendo que **no tengan idea propia**. Entran en la 1 por su
   predicción (34₍₅₎ + 23₍₅₎) y en la regla y «Ahora tú» de las ideas 1, 2, 3 y 5. El juego queda en base 10 y la mesa del
   laboratorio deja cambiar la base. La división en otras bases no entra.
5. **¿Dónde termina esta unidad y empieza la criptoaritmética de Razonamiento numérico?** Recomiendo que aquí vayan las cifras
   ocultas en cuentas con números (manchas) y el reverso en la resta (a̅b̅c̅ − c̅b̅a̅). Allá se quedan las palabras con letras
   distintas y a̅b̅ + b̅a̅. «Llevada» y «reverso» se estrenan aquí y allá solo se usan.
6. **Colores:** ¿apruebas el envase en turquesa (base, bolsita, divisor, metas 10ᵏ), lo que se muda en naranja (llevada,
   préstamo y resto por defecto), lo que se busca en violeta (resultado, complemento, resto por exceso, cantidad de cifras),
   los números que se operan en tinta y nada de verde ni carmín? Recomiendo que **sí**. Cambia respecto de Numeración (allá
   las cifras de la etiqueta eran naranja), pero en una cuenta el naranja hace falta para la llevada, que va pegada a las
   cifras.
7. **Notación:** recomiendo
   - × para multiplicar y nunca «·»;
   - 34₍₅₎ y a̅b̅c̅ con raya, como en Numeración;
   - n para la base;
   - D, d, q, r y rₑ en la división, con «q + 1» como cociente por exceso;
   - las cantidades de cifras de la idea 7 y el aumento de la idea 5 en palabras, sin m, n ni k.
8. **Glosario:** recomiendo
   - mudar a esta unidad el estreno de «factor» y «producto» (idea 5), «múltiplo» (idea 6), «llevada» (idea 1) y «reverso»
     (idea 4);
   - que Razones, Conjuntos y Razonamiento numérico los marquen «se explica en Las cuatro operaciones»;
   - que «consecutivo» se quede aquí (idea 4: cifras consecutivas);
   - no volver a definir «acotar», «cociente» ni «resto», que ya son de Numeración.
   En Conjuntos, «múltiplo» quedaría como «se explica en…» de otra rama: si prefieres que Conjuntos lo siga definiendo,
   aquí lo marco yo.
9. **Práctica:** ¿hago la plantilla nueva `operaciones-cifras`, con generador por idea, casos verificados y papel con datos?
   Recomiendo que **sí**. También que la escena vaya a «Más mesas del tema» y salga de `plantillas` hasta rehacerla. Y que
   ari-17 y ari-18 pasen de la reserva a la prueba, con un ítem nuevo de complemento y otro de cifras ocultas. La prueba es
   común al curso: los rebalanceo sin tocar los pares de otras unidades.
10. **Objetos nuevos:** ¿te sirven `arit-cuaderno` (la cuenta en columnas con la llevada, el préstamo tachado y las manchas
    de chicha morada) y `arit-calculadora` (pantalla de 8 casillas), dibujados como prueba? Recomiendo que **sí**. Si
    prefieres otra cosa que manche (agua, grasa), cambia el dibujo y no la idea.
11. **Ficha del catálogo:** recomiendo
    - temas: «Adición con llevadas», «Sustracción y préstamos», «Complemento aritmético», «Cifras ocultas en las
      operaciones», «Multiplicación», «Operaciones en otras bases», «División entera por defecto y por exceso» y «Cantidad
      de cifras de un producto o cociente»;
    - `requiere` igual (`aritmetica.numeracion`);
    - `investigacion` apuntando al informe de aritmética, con la tabla de códigos AT;
    - `grado: 3` sin tocar, porque es solo informativo.
