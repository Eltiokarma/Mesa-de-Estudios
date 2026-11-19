# Auditoría de contenido: «Triángulos y líneas notables» (geometria.triangulos)

18 nov 2026. Auditor externo (fase 7, `docs/metodo/unidad/5-auditor.md`). No se editó la unidad.
- Contrato: `docs/plan-calidad.md` §3 (13 puntos) y §5.
- Formato: `docs/teoria.md` 4e, 4f, 4h, 4i y §5.
- Vara: `docs/molde-unidad.md`, entero, con las reglas del 18 nov de §3.
- Lo aprobado: `docs/etapa4/decisiones.md` («Triángulos» y «Segunda ronda») y `docs/etapa4/propuesta-geometria.md`.
- Lo que ya encontró el lector en frío (`rutinas/frio/geometria.triangulos.md`) no se repite. Al final hay una lista
  de cuáles de sus quejas siguen en el código y cuáles no se sostienen.

**Qué se revisó.**
- `contenido/teoria/geometria/triangulos.js` (v0.4.0, `calidad: 2`): las 6 ideas con sus 7 momentos, los 90 ejemplos,
  «Así se resuelve» y «Ahora tú» (los 30 tipos), el glosario (24 términos) y las 3 mesas.
- Las piezas `nucleo/kit/piezas/geo-objeto.js` y `geo-figura.js`, en lo que usa la unidad (el color por defecto de un
  arco, `arcoRecto` y el cuadradito).
- La práctica:
  - `plantillas/geo-triangulos/`: 32 tipos, papel y ficha.
  - `plantillas/geo-triangulos-notables/`: los tipos que sirve a esta unidad y su papel.
  - `triangulo-estira`, en «Más mesas del tema».
  - El catálogo armado (`app/datos/catalogo.json`, en HEAD y en el árbol de trabajo).
- Los pares geo-12 a geo-14 de `catalogo/pruebas/geometria.json`.
- La app en un servidor propio (puerto 4215, apagado al final). Se sacaron 134 capturas a 390 px, página entera: los 42
  momentos, los 90 ejemplos, el glosario y el laboratorio (`scratchpad/aud-geo/`).

**Cuentas.** Se rehicieron con scripts propios que no usan el código de la unidad: geometría por coordenadas, con
cortes de rectas y ángulos medidos (`scratchpad/aud-geo-cuentas/geo.js`). **Cuadran 141 de 141.**
- `nivel3.js` resuelve desde el enunciado los **30 ejemplos de nivel 3**. Las bisectrices se cortan de verdad (I, E y
  Q), los pies H, F y M se ubican sobre BC, la cadena AB = BD = DC se construye punto por punto y la «x» se busca
  numéricamente. Esto comprueba también las reglas 90° + A/2, A/2 y 90° − A/2, el exterior igual a la suma de los dos
  lejanos, la punta de flecha (a + p + q), la altura que cae fuera y ∠HAF = (B − C)/2.
- `generador.js` resuelve **96 problemas de geo-triangulos** (3 semillas por cada uno de los 32 tipos). Lee solo el
  texto; en «reconocer» clasifica la línea midiendo la figura (perpendicular, punto medio o ángulos iguales).
- A mano, los **6 ítems de geo-12 a geo-14**, con el valor de cada distractor, y **9 tipos de geo-triangulos-notables**
  que salen en esta unidad (punto interior, punto con dos distancias, diagonal no convexa, contar, ángulo doble, isósceles
  con ceviana, máximo, mínimo y cuántos).
- Las cotas del punto interior se razonaron: el ínfimo p + q + |p − q| se acerca pero no se alcanza, así que el entero
  que se pide es 2·máx + 1.

**Geometría: está bien.** Ningún enunciado, regla ni solución afirma algo falso sobre la geometría.
- Exterior = suma de los dos interiores lejanos (regla, línea 995).
- Lado mayor frente al ángulo mayor, con la prueba de Elementos I.18 (Mira de la idea 3). Se comprobó que ∠ADB es
  exterior de DBC y que D cae dentro de AC.
- Desigualdad estricta en la regla, en la predicción y en «los brazos nunca quedan en línea» (geo-14).
- BIC, BEC y BQC, comprobados con los cortes reales.
- La altura cae fuera solo con B o C obtuso: `casoDonde` deja A obtuso con el pie adentro, y eso está bien.
- La lectura «F queda entre los dos» (idea 5) es cierta.

La única afirmación engañosa es la de la mesa de bisectrices (M3).

`node --test` de la unidad y de los dos generadores da 87 de 87 en verde.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 9, 13 | `triangulos.js:1977` (ejemplo 15 de la idea 5, «El orden de los tres pies») | El lector ya vio que en Datos falta lo que se usa. Falta además que la segunda línea («el pie de la bisectriz no llega al medio de BC: F antes que M») solo se justifica con el teorema de la bisectriz (BF/FC = AB/AC). La propuesta aprobada lo deja fuera de esta unidad: §1 «Qué no entra» y §8, «sin la posición de F en la lectura ni en ejercicios». Ninguna regla de la unidad permite deducir que F está antes que M. La figura sin H, F y M sí cumple la regla del 18 nov: la pregunta es justo dónde van. | Cambiar el ejemplo por «¿H queda antes o después de F, desde B?», que sale con 90° − B y A/2, o por el ángulo HAF. La comparación de F con M, a Proporcionalidad. |
| A2 | 13, 11 | `plantillas/geo-triangulos-notables/generador.js:180` (`datos: ''`) y su `papel.json`. Esta plantilla sigue en «Ejercicios» de Triángulos (`unidades` y catálogo de HEAD). | Ningún problema que esa plantilla da a esta unidad trae datos. Pasa en los 9 subtipos de desigualdad. Dos de ellos no se resuelven sin una herramienta que nadie da:<br>- `doble-angulo`: «el ángulo A mide el doble que el C, AB = 12 cm, ¿mayor BC?» (23 cm).<br>- `isosceles-ceviana`: DB = DC, y después la desigualdad en ABD.<br>Su papel (p3, p5, p7, p8) pide obtusángulo con x², ortocentro, tan 53°/2 y la circunferencia: son de Relaciones métricas, Puntos notables y Circunferencia (punto 9). Además, `TIPOS_POR_UNIDAD` filtra la práctica pero no el papel. | Quitar `geometria.triangulos` de `unidades` de geo-triangulos-notables, porque la práctica propia ya la cubre con `calc`. Si se queda, `datos` por línea y un papel por unidad. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13 (atajo) | `triangulos.js:1968-1971` (ejemplo 13 de la idea 5, «Altura, bisectriz y x») | Los datos traen el atajo de academia: «Ángulo entre la altura y la bisectriz desde A: (m∠B − m∠C) ÷ 2, con B el mayor». El resuelto se limita a usarlo («Uso la relación de la altura y la bisectriz»). La regla de la idea no lo enseña. En cambio, `casoHAF` de «Ahora tú» (`:2077`) y el tipo `altura-bisectriz` del generador sí van con la herramienta general (suma, altura y bisectriz). | Mismos datos que `casoHAF`. El resuelto en tres líneas: ∠BAH = 90° − B, ∠BAF = A/2 y la resta. En la figura, el rótulo «3x + 5°» también en B. |
| M2 | 13 (elegir), molde §3 (niveles) | Idea 6: ejemplos 1, 2, 3, 7, 8 y 10 (`:2270-2340`), `casoInverso` (`:2458`) y «Así se resuelve», rama impar (`:2576`) | El lector ya marcó que «Datos regala la fórmula». Falta la causa: la idea enseña a **elegir** entre tres reglas («revisa qué bisectrices se cruzan»), y estos ejercicios traen una sola, la que resuelve. El generador sí da las tres juntas (`D.BIC, D.BEC, D.BQC`, `generador.js:1131-1167`). Por eso los niveles no suben: los tres de nivel 1 son reemplazar y el nivel 3 «El cruce y la clase» (`:2372`) es el inverso del nivel 2 más clasificar. | Las tres reglas en todo ejercicio de la idea 6. Dos de nivel 3 sin las reglas, solo con `D_BIS2`, `D_SUMA` y `D_EXT`, para deducirlas, por ejemplo un BIC con x encadenado a un exterior. Pasar «El cruce y la clase» al nivel 2. |
| M3 | 10, 9 | `triangulos.js:2608` (reto «Haz que B y C sean iguales y mira dónde queda I» de la mesa de bisectrices) | `bien`: «Con B = C, I cae en la bisectriz de A, que también es altura». I **siempre** está en la bisectriz de A, sean como sean B y C. La frase enseña que solo pasa con B = C. Además, que las tres bisectrices pasan por I es el incentro, que la unidad deja para después. | «Con B = C, el parque es simétrico: I queda en la línea que baja de A al punto medio de BC.» |
| M4 | 3 | Regla de la idea 6 (`:2539`, sin `regla.dibujo`, usa la figura de Mira) y «Así se resuelve», rama par (`:2553`, con `I: false`) | Confirmado en la captura `angulo-de-bisectrices-5-regla`: la ecuación dice m∠BQC, y Q no aparece en ninguna figura de la idea antes de los ejemplos. «Así se resuelve» pide ∠BIC y dibuja E sin I. Lo nuevo: la figura de la regla tampoco muestra cuánto mide A, aunque marca 120° en I. | Agregar `regla.dibujo` con I, E y Q (la pieza ya hace Q en `exteriores2`) y m∠A = 60°. En «Así se resuelve», `I: 0`. |
| M5 | molde §3 (la figura no delata) | Predice de la idea 3 (`:1386`, `figTecho`), `casoOrden` de «Ahora tú» (`:1305`), ejemplos 5 y 10 de la idea 3 (`:1143`, `:1184`) | Confirmado en la captura `isosceles-3-predice`. El techo está dibujado a escala (36° contra 26°) y se ve a ojo que el lado de 3 m sube más empinado: la predicción se responde mirando. En «¿Cuál es su lado mayor?» el triángulo también va a escala (`dosDe(35, 95)` da casos como 35°, 50° y 95°). El generador hace este tipo **sin figura**, a propósito (`orden (2): … sin figura`). | Predice con el techo dibujado simétrico y la nota «dibujo sin escala», o sin figura. `casoOrden` y los ejemplos 5 y 10 sin figura, como el generador. |
| M6 | 5b, molde §3 (18 nov) | `geo-objeto`: un ángulo de una escena de ejercicio sin `color` sale en carmín | El lector anotó cinco tarjetas sueltas. La causa es una sola: la pieza pinta carmín por defecto, así que todo ángulo que no se da ni se pide queda como dato. Pasa en:<br>- el ejemplo 3 de la idea 3 (B y C del equilátero, desconocidos; captura `ej-isosceles-03`);<br>- el ejemplo 8 de la idea 2 (A desconocido, `A: {}`);<br>- el ejemplo 3 de la idea 4 (el codo de la lámpara, que no se usa; captura `ej-desigualdad-03`);<br>- «Ahora tú» `casoBase`, `casoPunta` y `casoReciproco` (`C: { marcas: 2 }`, que es el ángulo igual al pedido);<br>- `casoX` y `casoRazon`, donde se puede argumentar que son datos con expresión.<br>Va contra «todo ángulo dado en carmín, lo pedido con «?» en tinta». | En las escenas `examen` y en los ejemplos, el arco sin `texto` va en tinta por defecto; carmín solo si es dato. Una prueba en las 400 semillas: todo arco carmín lleva rótulo o su valor está en el enunciado. |
| M7 | 4, 5b | `triangulos.js:2619-2690` (mesa `triangulo-libre`, que el laboratorio pone en las ideas 1 y 5) y `:2695` (`bisagra-libre`) | En el triángulo libre los colores contradicen la idea 5, que es justo la que practica. La altura va en carmín y la bisectriz en naranja: al revés que en la idea (altura naranja, bisectriz carmín). La mediatriz va en verde y C también en verde (`cC = c-d`, `:69`). El pie de la bisectriz se llama D, cuando la idea lo llama F. La decisión era sacar el verde de estas mesas.<br>En la bisagra:<br>- el lado x va en carmín, que es el color de los ángulos;<br>- el control del ángulo en B va en naranja, igual que el lado AB;<br>- los lados no tienen unidad;<br>- el comentario dice «La idea 4 fija 5 y 8» (`:2694`), pero ahora son 40 y 25 cm.<br>Las lecturas separan con «·». | Usar los tokens de la idea 5 (altura `o`, mediana `i`, bisectriz `h`, mediatriz en tinta discontinua) y F como pie. En la bisagra: x en tinta, el ángulo en carmín, los lados en cm y los brazos de la lámpara. |
| M8 | 11, molde §7 (práctica por idea) | `plantillas/geo-triangulos/generador.js:1232` y `:1277`; `herramientas/construir-catalogo.js:127` | El generador exporta `IDEAS`, y el catálogo solo reconoce `TIPOS_POR_IDEA`. Por eso `app/datos/catalogo.json` (HEAD) no le pone `ideas` a geo-triangulos, y «Ejercicios» no muestra los enlaces «Por idea». La práctica por idea que anuncia el commit 6df112b5 no se puede abrir. | Exportar `TIPOS_POR_IDEA: IDEAS` y volver a armar el catálogo. Una prueba: toda plantilla con `generar(s, { idea })` tiene `ideas` en el catálogo. |
| M9 | 3, 9 | Tarjeta 3 de Lee de la idea 6 (`:2485`, «se explican en Puntos notables»), comentario `:2765` y el glosario | El glosario del curso define «incentro» en `proporcionalidad-y-semejanza.js:957`, así que al tocarlo dice «Se explica en Proporcionalidad y semejanza», y la tarjeta dice otra cosa. La decisión aprobada era «Puntos notables». | Definir «incentro» en Puntos notables, o que la tarjeta diga la unidad real. |
| M10 | molde §3 (niveles) | Ejemplo 14 de la idea 1 (`:312`, «La mariposa: el ángulo en O») | El lector notó que la x sobra. Lo que pesa para el molde: con m∠C = 50° y m∠D = 65°, ∠COD = 65° sale en un paso y ∠AOB es su opuesto. Este nivel 3 es más fácil que el nivel 2 «Dos sumas de a dos». | Dar A = 3x y B = 2x + 15° y C = x + 25°, y pedir ∠AOB. Así la x hace falta. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 5 (x sin «°») | `:1992` («m∠B = 3 · 45°»), `:2360` («4 · 10°»), `:2581` y `:413` («4 · 20°» con k) | Si x = 45 es un número, al reemplazar va «3 · 45»; en otras partes sí se escribe «3 · 30 − 20°» (`:258`) y «4 · 25 + 10°». La unidad mezcla las dos formas. | Una sola forma: «m∠B = 3 · 45 = 135°». |
| B2 | molde §2 | Mira de la idea 6, paso 5 (`:2536`: «m∠BIC = 120° · m∠BEC = 30°», con el «·» dentro de `junto`, que lo vuelve un punto literal), los pasos `cuentas` con `SEP` de los seis «Así se resuelve» y los ejemplos con `SEP` (idea 2, `:740`; idea 3, `:1164`, `:1184`; idea 4, «Diagonal» y «Tres lados con x») | `ecuacion.js:89` solo parte en renglones el `SEP` de la regla grande. En los demás lugares se ve «·» entre dos igualdades, que el molde prohíbe. | Separar con « y » o en dos líneas. El validador puede rechazar un `SEP` entre dos «=» fuera de la regla. |
| B3 | 3 | Regla de la idea 3 (`:1415`, «⟺»), regla de la idea 2 (m∠BAC, m∠ABC), Mira de la idea 3 («ACD es isósceles» en el ejemplo 13, `:1217`, donde ACD nombra un ángulo y un triángulo en la misma línea) | El lector vio ⟺ y las tres letras sin presentar. Lo que se agrega es el doble uso de «ACD» sin △. | Una línea en la regla: «⟺: vale en los dos sentidos». «△ACD» cuando es triángulo. Presentar m∠BAC en la tarjeta 2 de Lee de la idea 2. |
| B4 | 1, molde §3 | Ejemplo 4 de la idea 6 (`:2288`, «Las dos bisectrices de C») | Se dibujan la bisectriz de B y el punto E, que el enunciado no nombra y el resuelto no usa (captura `ej-angulo-de-bisectrices-04`). | `PQ` con `I: false, E: false` y solo las dos bisectrices de C. |
| B5 | 13 | `generador.js:130` (`D.dentro`: «Con P dentro del triángulo ABC: AB + AC > PB + PC»), tipo `punto` y papel p8 | Es un teorema que ninguna regla ni Mira de la idea 4 presenta. Como dato se puede usar, pero el alumno no sabe de dónde sale. | Una línea en Mira o en la regla de la idea 4 (prolongar BP hasta AC), o el resuelto en dos desigualdades. |
| B6 | 8 | Ejemplo 3 de la idea 4 (`:1543`) | La lámpara deja una franja vacía grande arriba de la figura (captura `ej-desigualdad-03`). | Ajustar la vista de `lampara` a sus puntos, como `vistaPs`. |
| B7 | «Así se resuelve» distinto de «Ahora tú» | Idea 4, rama impar (`:1426`: mayor perímetro) contra `casoMax` (mayor x); idea 6, rama par contra `casoInverso` | En los dos casos es el mismo problema con un paso más. | Idea 4: el isósceles de lados 4 y 9 o el punto interior. Idea 6: el BIC con x de la rama impar, con la exterior. |
| B8 | 3 (glosario) | `:2793` («equilátero»: «Cada uno de sus tres ángulos mide 60°») y «pie» («llega al lado de enfrente o a su prolongación») | El Resumen deja abrir los dos términos antes de jugar. Uno da la respuesta de la misión de la idea 3 (60°); el otro anticipa la de la predicción de la idea 5 (la altura cae en la prolongación). `leyendaSinRespuesta` no mira el glosario. | Quitar el 60° del ejemplo («sus tres ángulos miden igual») y dejar «pie» con «llega a la recta del lado de enfrente». |
| B9 | 4 (proceso) | `app/datos/catalogo.json`, sin commit (`git status`: M) | En el árbol de trabajo, otra sesión volvió a armar el catálogo a las 14:54 y **borró** geo-triangulos, y también `relaciones-metricas` de geo-triangulos-notables (el diff tiene −26 líneas). Si se sube así, la unidad se queda sin su práctica. No es un defecto de la unidad. | Antes de subir, `npm run catalogo` sobre el árbol completo y revisar el diff de `catalogo.json`. |

**Quejas del lector en frío.**

Siguen en el código (confirmadas, no se repiten arriba):
- los rótulos 15 cm y 65 cm de la regla de la idea 4 (`:1776`), que se leen como largos;
- el cuadradito del codo a 90° en Lee, Mira y la regla de la idea 4;
- la mediatriz punteada sin nombre y el triángulo que no es isósceles en la regla de la idea 5;
- «90° + 35°» en la lectura del juego de la idea 6 (`:2509`) antes de la regla;
- el 27° que falta en la figura del ejemplo 8 de la idea 6 (`:2322`, `BEC: { color: 'h' }`, un arco carmín sin número);
- las seis rayitas amontonadas del exterior en C;
- la frase «B son dos partes de A» (`:265`);
- la línea comprimida de «Cinco palitos» (`:1632`), donde la ecuación «3 + 4 = 7» se lee como palitos de 3 cm y 4 cm;
- los colores de los palitos sin sentido.

No se sostienen:
- «Dice mueve A y los controles son de B y C»: las seis misiones nombran algo que existe. La punta A, la esquina A, el
  codo, el compás y el caserío se arrastran (`arrastres`), y el juego dice «Arrastra los círculos de la figura, o usa −
  y +» (captura `suma-de-angulos-2-juega`).
- «El ejemplo 15 de la idea 5 no dibuja H, F ni M»: es lo que manda la regla del 18 nov, porque la pregunta es dónde
  van.
- «El cuadradito en el ejemplo 18»: no hay cuadradito. `arcoRecto` dibuja el recto pedido con arco, y la pieza hace lo
  mismo con todo recto con «?» o con una expresión (`geo-objeto.js:1460-1468`). Ningún recto pedido de la unidad lleva
  cuadradito; el ejemplo 13 de la idea 3, que pide ∠BAD = 90°, también va con arco. Lo que queda es que la figura del
  ejemplo 18 va a escala con A = 90°, y por eso entra en M5.

## Lo que está bien y hay que copiar al molde

- **El recto pedido nunca lleva cuadradito**, y no depende de que cada autor se acuerde: `geo-objeto` decide por el
  rótulo. Lleva cuadradito el recto que se da («90°» o sin rótulo); va con arco el que se pide («?»), una expresión
  («3x») y el recto entre dos bisectrices.
- **Datos que dan herramientas, iguales en la teoría, el generador y el papel.** La unidad y el generador usan el mismo
  juego de líneas: suma, exterior, adyacentes, isósceles en los dos sentidos, desigualdad, definiciones de altura,
  mediana, bisectriz y mediatriz, y el significado de las marcas. En el generador, la idea 6 da las tres reglas para
  que el alumno elija. Los únicos atajos son M1 y M2.
- **Los tipos que se responden con el dibujo van sin figura.** La clase por los ángulos en la teoría, y «orden» e
  «iso-dt» en el generador, con el motivo escrito.
- **Los rótulos en cuñas angostas van en el enunciado y se dice por qué** (cabecera `:17-19`): en la punta de flecha,
  en la mariposa y en B y C junto a sus bisectrices. Evita que un rótulo lejos de su vértice se lea como de otro.
- **Las pruebas de la teoría miden lo que se dibuja.** Cada ángulo declara `mide` y la prueba lo compara con la
  figura. `rotulosPropios`/`propios` exige que el rótulo esté claramente más cerca de su vértice que de otro. Si no
  cabe, se arma otro caso.
- **Cada predicción va contra un error y Mira la desarma con una prueba.** Elementos I.18 con el isósceles dentro del
  techo, la paralela por A, los tres llanos menos 180° y los extremos de la lámpara. Los códigos GE7 y GE-BIS5 se
  partieron para que dos opciones no compartan código.
- **geo-12 a geo-14.** Cada distractor sale de su error y su valor está bien calculado (GE-EXT8, GE-TRI15, GE-TRI13,
  GE-ISO4, GE-ISO5, GE-ISO6, GE-DT2, GE-DT3, GE-DT4 y GE-DT14), y geo-14 dice explícito que el caso es estricto.

## Reglas que faltan en el contrato o en el validador

1. **Un arco sin rótulo no es carmín.** En una figura de ejercicio, todo arco carmín tiene rótulo o su valor en el
   enunciado; los demás van en tinta (M6). *Automático*: en geo-objeto, con un color por defecto en tinta para
   `examen` y una prueba en 400 semillas.
2. **Una idea que enseña a elegir da en sus datos todas las reglas entre las que se elige.** Cada idea declara
   `reglasParaElegir` (por ejemplo `[D_BIC, D_BEC, D_BQC]`) y ningún ejercicio suyo trae solo una (M2). *Automático*.
3. **Los datos no traen una fórmula que la regla de la idea no enseña** (M1, B5). *Semiautomático*: cada línea de
   `datos` con «=», «>» o «÷» tiene que estar en una lista de herramientas de la unidad (reglas, definiciones y las
   reglas de unidades anteriores). Si una línea nueva no está, se avisa.
4. **Lo que se compara a ojo no se dibuja a escala.** Si la pregunta es «¿cuál es mayor?» o «¿qué lado…?», la figura
   va sin escala, con su nota, o no va (M5). *Semiautomático*: una marca `compara: true` en el ejercicio, y la prueba
   exige `sinEscala` o que no haya figura.
5. **El laboratorio usa los colores de la idea que practica.** Los tokens de cada mesa salen del mapa de colores de la
   unidad y se comparan con los de la idea que dice `laboratorioIdeas` (M7). *Automático* si la cabecera del mapa se
   vuelve una constante exportada.
6. **Un generador por idea se ve en el catálogo.** Si `generar(s, { idea })` filtra por idea, el catálogo tiene que
   tener `ideas` (M8). *Automático* en `construir-catalogo.js`: aceptar `IDEAS` o fallar si no hay ninguno de los dos.
7. **Una plantilla compartida no trae a una unidad tipos ni papel de otra.** El papel también se separa por unidad, y
   una unidad con `calidad: 2` no muestra un generador con `datos: ''` (A2). *Automático*.
8. **Un ejemplo de nivel 3 no se resuelve en un paso.** *Semiautomático*: avisar si su `solucion` tiene una sola
   línea con ecuación, o si su resultado sale de los datos con una sola resta de 180° (M10).
9. **«Se explica en…» apunta a la unidad que se nombra.** Si un texto dice «se explica en X» y el término está en el
   glosario del curso, el término tiene que vivir en X (M9). *Automático*.
10. **Un `bien` o una lectura de mesa no afirma una condición que no hace falta.** Esto se revisa a mano, con
    cuidado, en los `bien` que dicen «con B = C, …» (M3). *Manual.*

## Correcciones (18 nov)

Fase 8 (`docs/metodo/unidad/6-correcciones.md`). Archivos: `contenido/teoria/geometria/triangulos.js` (y su prueba),
`nucleo/kit/piezas/geo-objeto.js`, `plantillas/geo-triangulos/` (generador, prueba y papel regenerado),
`plantillas/geo-triangulos-notables/` (ficha, `TIPOS_POR_UNIDAD` y prueba), `catalogo/cursos/geometria.json`,
`catalogo/pruebas/geometria.json` y `verificar.js` (solo geo-13 y geo-14). Cuentas nuevas rehechas por coordenadas, sin
el código de la unidad: `scratchpad/cor-geo-cuentas/cuentas.js` (13 de 13, y 200 + 200 semillas de los dos «Así se
resuelve» nuevos). Capturas después: `scratchpad/cor-geo/` (antes: `scratchpad/aud-geo/`). Pruebas: teoría, geometría,
piezas geo-*, las dos plantillas, catálogo, pruebas y papel: 407 de 408 (la que falla, abajo en «Pendiente»).

**Alta**
- A1. El ejemplo 15 de la idea 5 es ahora «La mediana que mide la mitad» (nivel 3): AM mediana con AM = BM y m∠B = 35°;
  dos isósceles y la suma dan m∠BAC = 90°. Usa solo mediana, isósceles y suma (están en Datos). Va sin figura: a escala, A
  se vería recto.
- A2. `geometria.triangulos` salió de las `unidades` de geo-triangulos-notables y de su `TIPOS_POR_UNIDAD`; la unidad ya no
  la lista en `catalogo/cursos/geometria.json` (la desigualdad la cubre geo-triangulos, idea 4). geo-14 pasa a
  geo-triangulos, con su verificador sobre `calc` de geo-triangulos (que ahora lo exporta). Como la prueba admite dos ítems
  por plantilla, **geo-13 (isósceles del tijeral) pasó a la reserva**: decisión revisable por Gerson (podría ser geo-12).

**Media**
- M1. Ejemplo 13 de la idea 5 sin el atajo: Datos = suma, altura y bisectriz; el resuelto saca ∠BAH = 85° − 3x,
  ∠BAF = 85° − 2x y resta (x = 25, m∠BAC = 70°). B lleva su arco carmín (el rótulo «3x + 5°» no cabía junto a H).
- M2. Toda pregunta de la idea 6 que usa una regla trae las tres (`R3`), también `casoBIC`, `casoBEC`, `casoBQC`,
  `casoInverso`, los dos «Así se resuelve» y el tipo `inverso` del generador. Niveles: «El cruce y la clase» bajó al 2; en
  el 3 entran «Dos exteriores, sin la regla» (B = 70°, C = 50°: mitades de los exteriores, BQC = 60°) y «El cruce, con
  exterior y x» (exterior 4x − 10° = A + B, x = 30, BIC = 115° con las mitades), los dos sin reglas en Datos. Salieron «De I
  a E» y «Dos exteriores con x».
- M3. El reto de la mesa: «Con B = C, I cae en la línea de A al punto medio de BC.» (cierto solo con B = C).
- M4. La regla de la idea 6 tiene dibujo propio con I, E y Q (geo-objeto `parque` aprendió `Q` y `BQC`), m∠A = 60° como
  rótulo suelto, 120° en I y 60° en Q. «Así se resuelve» rama par ya no pide BIC (ver B7).
- M5. Predice de la idea 3: techo simétrico y «El dibujo no está a escala» en la pregunta; al revelar, el techo real.
  Sin figura: `casoOrden`, ejemplos 5, 10 y 15 de la idea 3 y «El cruce y la clase».
- M6. geo-objeto: `ejercicio: true` (opcional; Segmentos no la usa y sus pruebas pasan) pinta en tinta el arco sin texto ni
  color en cartulina, plaza, compás, lámpara, caserío y parque. La unidad la pone en todo ejemplo, «Así se resuelve» y
  «Ahora tú»; los datos sin rótulo piden `color: 'h'` (recto de B, m∠B de la pileta isósceles, B en `casoHAF`, etc.).
  Prueba nueva en 400 semillas: carmín sin rótulo solo si su valor está en el enunciado, y ningún dato numérico en tinta.
- M7. Triángulo libre con los colores de la idea 5 (altura naranja, mediana turquesa, bisectriz carmín con pie F,
  mediatriz en tinta discontinua), ángulos en carmín con 1, 2 y 3 arcos, sin verde; lectura «m∠A = …, m∠B = … y m∠C = …:
  clase». La bisagra es «Lámpara con brazos libres»: BC naranja, AB turquesa, codo en carmín, x en tinta, todo en cm
  (controles de 10 a 60 y de 10 a 80 cm; mismos id), lectura «3 cm < x ≈ … cm < 13 cm» sin «·»; comentario corregido.
- M8. geo-triangulos exporta `TIPOS_POR_IDEA` (= `IDEAS`); el catálogo ya trae sus seis `ideas`.
- M9. La tarjeta 3 de Lee dice dónde se explica cada uno: incentro en Proporcionalidad y semejanza (donde lo define el
  glosario), excentro en Puntos notables.
- M10. La mariposa del nivel 3: m∠C = x + 25° y m∠D = 70°; la x hace falta (x = 20, ∠AOB = 65°, comprobado en COD).

**Baja**: B1 (`3 · 45 = 135°`, `4 · 20 = 80°`, `${p} · ${k}`, sin «°» en el número), B2 (`Y`/`COMA` en vez de `SEP` fuera de
la regla; Mira 6 paso 5), B3 (⟺ en la regla; △ en ACD, BDC, ABD; tarjeta nueva «Nombres de tres letras» en la idea 2),
B4 (dibujo solo con las dos bisectrices de C), B5 (la solución del tipo `punto` dice de dónde sale AB + AC > PB + PC),
B6 (vista de la lámpara del ejemplo 3, sin el arco del codo), B7 (idea 4 impar: el punto interior; idea 6 par: ∠BEC con x),
B8 (glosario: «sus tres ángulos miden lo mismo»; «pie»: la recta del lado de enfrente), B9 (`npm run catalogo` no borra
geo-triangulos; diff revisado).

**Lector en frío** (lo que el auditor confirmó): «15 cm / 65 cm» → «AC = 15 cm / AC = 65 cm»; el codo fuera del juego a
105° (sin cuadradito; el juego empieza en 105°); la regla de la idea 5 con dibujo propio: el isósceles donde las tres
coinciden (H = M = F, AB = AC con dos rayitas), sin la mediatriz; la lectura del juego 6 es «m∠BIC = 180° − B/2 − C/2 =
…; m∠A = …» (la regla llega en Mira); rayitas del exterior en C a radio 30; «A es una parte y B, dos»; «Cinco palitos» en
tres líneas con ✓ y ✗; palitos en tinta; opciones «7 valores»; «El cruce y la clase» con el paso m∠A ÷ 2 = 45°;
paréntesis en 90° ± (m∠A ÷ 2) (teoría y generador); sin la D del ejemplo 4 de la idea 2.

**Pendiente**
- `nucleo/repaso-tipos.test.js` falla: la fila de geo-triangulos-notables en `nucleo/repaso-tipos.js` todavía manda
  `desigualdad` a `geometria.triangulos`. Arreglo de una línea, fuera de mi alcance (nucleo/): quitar
  `desigualdad: G + 'triangulos', ` de esa fila. El tipo desigualdad sigue en el sorteo sin unidad de notables (su papel
  p1, p4 y p6 y casos.json): decidir si se saca.
- El 27° del ejemplo 8 de la idea 6 y «x + 25°» en B (isósceles con x afuera) siguen solo en el enunciado: sus rótulos
  quedan más cerca de otro vértice (prueba de la unidad). Igual «3x + 5°» en B del ejemplo 13 de la idea 5.
- Sin tocar: «60° y 70° pegados» en el centro (ideas 1 y 2), los 35° del tijeral junto a la punta, la regla de la idea 3
  con dibujo isósceles (AC > AB no se ve), el incentro definido en Puntos notables (decisión de Gerson; es otra unidad).

## Cabos de la Etapa 4 (19 nov)

- **Rótulos que solo iban en el enunciado.** Con una línea guía (`conGuia`, en la unidad: una línea fina del color del
  rótulo, que nace 3 px más allá del arco y no cruza ningún trazo) van ahora en la figura: «x + 25°» en D de «La
  mariposa» (y «2x» junto a su arco, que sí cabe), el 35° de BAD en «Dos triángulos encadenados», «x + 25°» en B de
  «Isósceles con x afuera» y el 27° de E en «De E al ángulo A». La prueba mide cada guía (nace en su arco, no cruza ni
  toca otro trazo, su rótulo cabe y es un dato del enunciado). v0.4.1.
- **Se quedan en el enunciado, y por qué:** «La mariposa: el ángulo en O» (dos expresiones largas en un triángulo de
  100 px: se enciman con el «?» de O); la punta de flecha (la cuña de C la corta la prolongación DP y el rótulo cae
  sobre la letra D; rotular solo B sería peor); «3x + 5°» en B de «Altura, bisectriz y x» (la altura cae a 20 px de B: la
  cuña queda encerrada entre AB, AH y BC, y una guía tendría que cruzar uno); ∠HAF y los ángulos B y C enteros junto a
  sus bisectrices (el hueco libre es una de sus mitades); y las figuras de «Así se resuelve» y «Ahora tú», que cambian
  con la semilla y no se pueden mirar una por una.
- **El dibujo de la unidad en el mapa** (`app/dibujos/geometria.js`) ya muestra los tres ángulos juntos en un ángulo
  llano (la suma de 180°), sin el exterior.
