# Auditoría de contenido: «Geometría molecular y fuerzas intermoleculares» (quimica.geometria-molecular)

19 nov 2026. Auditor externo (cierre delegado, `docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10.
Reglas automáticas: `docs/metodo/unidad/reglas-validador.md` y la lista de la Etapa 5 en `etapa-delegada.md`.
Decisiones: `docs/etapa6/propuesta-quimica.md` (§3 B, §5 a §8 y §12). Unidad nueva, nacida al partir «Enlace químico»;
la otra mitad la audita otra sesión. Lo que vieron los dos lectores en frío está en `rutinas/frio/quimica.geometria-molecular.md`;
aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/quimica/geometria-molecular.js` (v0.1.0, sin `calidad: 2`): las 4 ideas con sus 7
  momentos, los 60 ejemplos, «Ahora tú» y «Así se resuelve» en 400 semillas de cada uno por idea, el glosario
  (13 términos), las 2 mesas con sus 7 invitaciones y la historia.
- Las piezas `quim-molecula` (lo que cambió: el color de los pares), `quim-molecula-3d` (la proyección y la flecha
  total) y `quim-enlace` (los cuatro objetos de la primera pantalla). Las posiciones 3D salen del motor
  `plantillas/enlace/motor.js`.
- La práctica `plantillas/geometria-fuerzas/`: 13 tipos en las 4 ideas, `casos.json` con 29 casos y `papel.json` con 8.
- La migración del avance (`partidoEN` y `prediccionEN2` en `nucleo/avance.js`).
- La app a 390 px con `--entera`: los 28 momentos y los 60 ejemplos (servidor propio, puerto 4416).

**Cuentas.** Rehechas con
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-geo-mol/cuentas.js`. De la unidad y
del generador solo lee el texto. Cada respuesta sale de tablas propias:
- **Lewis.** Pares libres del central = (electrones de valencia − 2 por enlace − 6 por cada átomo de alrededor que no es H) ÷ 2.
  Es un camino distinto del motor, que arma la estructura y presta pares. Cuadran las 27 moléculas: enlaces y pares que
  dice cada enunciado, y las valencias de los Datos.
- **Formas y ángulos (VSEPR).** Tabla propia de AXₙEₘ. Las direcciones son propias: tetraedro, bipirámide con los pares
  en el ecuador, octaedro con los pares opuestos. El ángulo menor se mide en ellas.
- **Polaridad.** Suma vectorial de (EN del ligando − EN del central) por la dirección. Las EN son de Pauling y Allred.
  Se prueban todas las maneras de poner los ligandos en los lugares y vale la de menor módulo. No se usa la regla de
  la simetría.
- **Hibridación** por regiones.
- **σ y π.** Se cuentan los átomos de la fórmula: σ = átomos − 1, sin anillos. π = un «=» vale 1 y un «≡» vale 2.
- **Ebullición.** CRC a 1 atm, con la fuerza dominante por regla propia: H unido a N, O o F da puente; si no, una
  molécula polar da dipolo-dipolo; si no, London. Con las masas molares se revisa cada «es más pesado».
- **V/F.** Cada afirmación con su verdad, juzgada a mano o calculada con las tablas.

Resultado:
- «Ahora tú»: 1600 preguntas, «Así se resuelve»: 1600, práctica: 1600 (400 por idea), los 29 casos y los 8 problemas
  de papel. Las respuestas correctas cuadran todas, y en ninguna hay otra opción también correcta.
- Toda igualdad escrita cuadra: «100 − (−60) = 160», «−33 − (−88) = 55», «20 − (−85) = 105», «360° ÷ 3 = 120°»,
  «6 + 3 = 9 σ», «2 · 2 = 4 e⁻ π».
- Los 60 ejemplos rehechos a mano, con las 20 letras de nivel 3. La letra se reparte 4 veces A, B, C, D y E.
- Las 4 predicciones: NH₃ piramidal; acetileno sp con 3 σ y 2 π; CH₂Cl₂ polar, con módulo 0,73 en las direcciones
  propias; H₂O 100 °C contra H₂S −60 °C.
- Las 4 misiones en su grilla. Ninguna está cumplida al abrir y cada una la cumple solo lo que dice: n = 3; CO₂ con 2 π;
  CO₂, BF₃ o CCl₄; metanol a 65 °C o más. Las lecturas de los cuatro juegos cuadran en toda su grilla.
- La mesa de los dos dipolos: el ángulo dibujado es θ y la lectura es la suma vectorial, en 15 combinaciones.

**Ángulos medidos en las coordenadas.**
- 3D, las 19 moléculas que se dibujan con el motor: los ángulos medidos coinciden con la tabla propia (109,5°, 90° y
  120°, 180°…). La forma y la polaridad del motor coinciden con las propias. Ningún par libre queda a menos de 90° de un
  enlace.
- 2D: el agua de «Mira» de la idea 3 dice 104,5° y está dibujada a 95,7° (M8). El eteno de «Mira» de la idea 2 dice
  «a 120°» y está dibujado con H–C–H a 97° y H–C=C a 131° (M8).

**Validador** con `calidad: 2` simulada (200 semillas): 0 problemas antes y después. Pruebas propias antes de corregir:
unidad 7 de 7, generador 7 de 7, `quim-enlace` en verde. `ecuaciones-ancho.js`: «todo cabe» (40 pantallas).

**La migración del avance** (`partidoEN`, `prediccionEN2`) está bien y no se tocó.
- Las 8 palabras que se mudan son justo las 8 de la unidad vieja que ahora define esta unidad.
- `forma-polaridad` cambió de pregunta (del CO₂ al CH₂Cl₂) y sus ids son otros: borrar su predicción sin huella es lo
  correcto.
- `fuerzas-intermoleculares` conserva su pregunta y sus ids (c, masa, igual, enlace): se queda.
- El orden también está bien: la partición corre antes que `prediccionEN2`.
- Las 18 pruebas de `avance.test.js` pasan.
- Solo una cosa menor: la marca de glosario de «hibridación» que alguien tuviera en Hidrocarburos no se muda (B6).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13 (datos), 6 | Idea 1, «Ahora tú» `casoForma` y «Así se resuelve» | Piden la forma del SF₄, ClF₃, XeF₂ o BrF₅ (31 de 100 preguntas de forma) con Datos que solo llegan a 4 regiones. «Pirámide cuadrada» (BrF₅) no se enseña en ningún lugar: la condición de la regla nombra «bipirámide, balancín, T, octaedro o cuadrada plana». En el H₂O, el PCl₃ o el NF₃, los Datos tampoco traen «angular» ni «piramidal» (lector A, «Así se resuelve»). Y la regla dice «con pares libres: angular o piramidal» sin decir cuándo es cada una. | Datos según el caso: con pares, cuándo es piramidal y cuándo angular; con 5 o 6 regiones, sus formas con 1, 2 o 3 pares. La regla las nombra todas. |
| A2 | 4 (lo previo delata) | Idea 3, «Ahora tú» `casoCualPolar` (133 de 400), y la práctica `cual-polar` (todas) | En la teoría, los Datos traen las formas de una lista fija y aparte una línea solo para la respuesta («H₂O: forma angular»). En la práctica, la primera forma de los Datos es siempre la respuesta: 199 de 199. Se acierta sin pensar. | Una sola línea de formas, en el orden de la pregunta, que ya está barajado. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Etapa 5, regla 2 (el distractor da su valor de verdad) | Idea 4, «Ahora tú» `casoEb` (65 de 400), práctica `cual-hierve` (80 de 400) y papel p1 | «El Cl₂: es más pesado» (71 contra 160 g/mol), «El CH₄: es más pesado» (16 contra 32), «El neopentano: es más pesado» y «El CH₃OCH₃: es más pesado» (misma masa). El `siFuera` responde «Más masa suele dar más London, cierto». | EN16 solo cuando el otro sí pesa más. Con la misma masa: «Los dos igual: tienen la misma masa». Si no: el orden invertido (teoría) o «sus enlaces internos son más fuertes» (práctica). |
| M2 | 10, regla 2 | Idea 4, «Ahora tú» `casoPuente` (46 de 400) | La opción CH₄ explica «Es polar, cierto. Pero su H no está unido a N, O ni F». La unidad enseña que el CH₄ es apolar. | «Es apolar y sus H están unidos a C: solo tiene London.» |
| M3 | 13, 12 | Idea 1, `casoRegiones`, Lee 2 | Para contar los pares libres hay que armar la estructura de Lewis de Enlace químico, y la unidad no lo dice: los Datos solo dan las valencias. La app no tiene un «Lo que necesitas»: lo previo va en palabras o en el glosario del curso («par libre» y «estructura de Lewis» se tocan desde Enlace químico). | Lee 2: «Un par libre son dos electrones sin enlace, de la estructura de Lewis (Enlace químico)». Datos: cómo se cuentan los pares libres del central. |
| M4 | 13, 3 | Idea 2: Datos de `casoSigmaPi`, «Así se resuelve», dos ejemplos y práctica `sigma-pi` | «Cada raya de la fórmula es un enlace», con H₂C=CH–CH=CH₂: si se cuentan rayas salen 3 σ, y son 9 (lector A). | «Cada raya es un enlace; cada H escrito junto a un C (CH₃, H₂C) es un enlace C–H más.» |
| M5 | 4, 5 (figura contra texto) | Predice de la idea 3 | La figura (la proyección 3D) pone los dos Cl juntos abajo, y la opción EN10 dice «en el dibujo los Cl quedan opuestos» (lector B). La figura, además, ya deja ver lo que se pregunta. | El dibujo del papel, en cruz y con los Cl opuestos. La molécula en 3D, con sus flechas, al revelar. |
| M6 | 4, 5 | Predice de la idea 1 | La figura era solo la «N» (el átomo central sin nada). El lector la creyó rota, y los Datos hablaban de «los tres H alrededor del N» del papel. | El NH₃ del papel (tres H y el par). La pirámide en perspectiva, al revelar. |
| M7 | 4 | Historia (se abre en la idea 1) y «Así se resuelve» de la idea 4 | La pregunta de la historia, «¿Por qué el agua hierve a 100 °C y el H₂S, a −60 °C?», da la respuesta de Predice 4 antes de tiempo. Los Datos del resuelto de ebullición traen las dos temperaturas, y el ejemplo «Dos líquidos de la misma fórmula» también, con una resta (102 °C) que no sirve (lector B). | Otra pregunta en la historia. Temperaturas solo al final, como comprobación. |
| M8 | 5 (la figura mide lo que dice) | Mira de las ideas 3 y 2 | Agua dibujada a 95,7° con el rótulo «104,5°». Eteno a 97° y 131°, y el texto dice «a 120°». | Coordenadas con los ángulos del texto. |
| M9 | 5, 7 | Predice, Mira y La regla de la idea 4 | El eje «Tₑ» en carmín, junto a «H₂Te» en carmín, se leía como telurio. El punto del H₂Se no tenía nombre y el rótulo «H₂S» quedaba junto a él: parecía que el H₂S estaba en el periodo 4. Y «el H₂S está debajo del oxígeno» es falso: el que está debajo es el azufre (lector B). | Eje «ebullición (°C)»; los cuatro puntos con nombre; «su azufre está debajo del oxígeno». |
| M10 | Etapa 5, regla 2 | Práctica `regiones` | Con el CCl₄, el SF₆, el PCl₅, el CHCl₃ y el CH₄, que no tienen pares libres, la explicación dice «Un par libre es una región, no dos» (36 de 400). QM-REGION-DOBLE pone n + m + 1, y contar cada par compartido da 5 en el SO₂, 6 en el SO₃ y 4 en el CO₂. | Sin pares: «el central no es una región». El doble, con su valor de verdad. |
| M11 | 3, 13 | Ejemplos «Tres carbonos seguidos», «Dos pares en forma de T» y «Tres moléculas, tres formas» | La explicación no da la alternativa (lector B). «Contar los pares compartidos» da sp³ en los tres carbonos, no la B ni la E. En el ClF₃, «olvidar los pares» no da «angular» y «dos arriba y abajo» se lee como dos y dos. En el otro, «le da al BF₃ un par» daría piramidal, no tetraédrica. | La B pasa a sp³, sp³ y sp³. Cada explicación con su valor: «uno arriba, uno abajo y uno al costado». |
| M12 | 3, 12 | Juego de la idea 1 y opción de `casoPolar` | La leyenda dice «región: un enlace del átomo central», contra la regla (lector A). «Apolar: sus átomos están en orden» no se entiende (lector B). | «región: un enlace; un par libre también lo es». La opción: «sus átomos de alrededor son iguales» o «su forma es simétrica», según la molécula. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 10 | `casoPolar` y práctica `polar` con el H₂S; ejemplo «Dos moléculas de tres átomos» | Dice «enlaces polares» con ΔEN 0,38. La unidad llama al C–H (0,35) «casi no polar», y el motor no le dibuja flecha al S–H. | «enlaces algo polares» y «(los S–H, apenas)». |
| B2 | 9 | Ahora tú de la idea 2 | «ningún pares libres» (lector A). | «ningún par libre». |
| B3 | 6, 12 | Idea 2: Lee, leyenda, consigna, voz y La regla | El gas del soplete sin nombre. El nombre sp³ sin decir qué cuenta. La leyenda de π sin el triple. «el carbono apunta» en un dibujo plano. La voz habla de sigma y pi en preguntas que no los piden. La «π» de La regla queda sola en otro renglón. | Acetileno. Cuántos orbitales dice el nombre. Leyenda y consigna rehechas. Espacios que no se cortan. |
| B4 | 6, 12 | Idea 3: Lee 2 y «Vale si» | La cruz de la cola del dipolo y la letra μ no se explican. «suelen» no es una condición (lector B). | Lee 2 las dice; la condición nombra la excepción (pares opuestos: XeF₂, XeF₄). |
| B5 | 10 | Juego de la idea 4 | «temperatura del líquido» a −120 °C, donde el HCl, el metanol y el agua son sólidos. | «temperatura de la sustancia». |
| B6 | Avance | `partidoEN` | La marca de glosario de «hibridación» que se tenía en Hidrocarburos no se muda (la palabra ahora es de esta unidad). Es una marca «la sé»; no se pierde avance de ideas. | Queda: el bloque es de quien integró la partición; se anota. |
| B7 | 8 | Ejemplos de la idea 4 | «Cuánto más hierve el agua» (nivel 1) y «El agua y su vecino» (nivel 3) usan el mismo par que Predice 4. La regla 8 es para «Ahora tú», que no lo repite; los ejemplos se pueden abrir antes. | Queda (decidido por la sesión, Gerson revisa después): es la pregunta clásica del examen y su nivel 3. |
| B8 | 5 | Revelar de Predice 3, La regla de la idea 3 | La proyección del CH₂Cl₂ con flechas y la del agua de La regla quedan apretadas: flechas cortas junto a los enlaces (lector B). Lo hace la pieza `quim-molecula-3d` en su respaldo plano. | Queda: es de la pieza compartida. |

## Lo que está bien y hay que copiar al molde

- **Todo el 3D sale de un motor con casos** (`plantillas/enlace/motor.js`). Las 19 moléculas que se dibujan tienen los
  ángulos de la tabla, medidos en sus coordenadas, y la polaridad de la suma vectorial. Las predicciones del juego
  están reservadas a propósito: sin pares libres en el juego 1, sin triple en el 2, sin CH₂Cl₂ en el 3, sin H₂S en el 4.
- **La prueba de la unidad trae su oráculo**: tablas aparte para cada tipo de «Ahora tú» y una prueba de que no hay
  dos correctas. Encontró todo lo numérico. Lo que no ve es lo que dicen las explicaciones y los Datos, que es donde
  estaban las fallas.
- **La migración `partidoEN`** separa con cuidado la predicción que cambió (`forma-polaridad`) de la que no
  (`fuerzas-intermoleculares`).
- **Los colores por papel**: dipolo naranja, ángulo turquesa, pares violeta, carga y temperatura carmín, nunca juntos.
  La prueba lo comprueba.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Una pregunta de «¿Cuál…?» no nombra a la respuesta sola en los Datos ni la pone siempre en el mismo lugar** (A2). | Sí: en 400 semillas, que ninguna línea de Datos empiece por la respuesta y que la posición de la respuesta en una lista de Datos varíe. |
| **Si se pide un nombre de una lista cerrada (forma, hibridación), ese nombre está en Datos, en La regla o en el glosario** (A1). | Parcial: si la correcta no aparece en los Datos ni en la regla de su idea, avisar. |
| **Una explicación que afirma un hecho del caso («es más pesado», «es polar, cierto») se comprueba contra la tabla** (M1, M2). | Parcial, como B1 de Propiedades periódicas: con una tabla de masas y polaridades declarada por la unidad. |
| **Una explicación general («un par libre es una región, no dos») no sale cuando el caso no tiene eso de que habla** (M10). | Parcial: la unidad declara la condición de cada explicación. |
| **Un ángulo rotulado o afirmado en un dibujo 2D se mide en sus coordenadas** (M8). | Sí: `angulos` de `quim-molecula` contra su `texto`; para un texto de paso, la prueba de la unidad. |
| **El validador dibuja cada figura con su propia pieza** (`dib.pieza`), como la app. Hoy `nucleo/teoria.js` usa `p.pieza` para dibujo y revelar, y una Predice no puede mezclar el papel con el 3D. | Sí, una línea en `nucleo/teoria.js` (compartido: queda para quien integra; aquí se resolvió con la proyección en la misma pieza). |

## Correcciones (19 nov)

Hecho junto con las notas de los dos lectores en frío (`rutinas/frio/quimica.geometria-molecular.md`, «Correcciones de
la ronda 1»). La teoría pasa a v0.1.1 y el generador a 0.1.1. Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-geo-mol/antes/`. Capturas de
después en `.../e6-cierre-geo-mol/despues/`.

Pruebas nuevas: 8 al final de `geometria-molecular.test.js` y 1 en `generador.test.js`. Las 9 fallan con los archivos de
antes (comprobado en `.../e6-cierre-geo-mol/viejo/`, con enlaces al repo). Después:
- unidad 15 de 15 y generador 8 de 8;
- `quim-enlace`, en verde, y `avance.test.js` 18 de 18;
- validador con `calidad: 2` simulada (200 semillas): 0 problemas;
- `cuentas.js`: 0 fallas;
- `ecuaciones-ancho.js`: «todo cabe»;
- `teoria.test.js`: esta unidad en verde. Fallan `enlace-quimico.js` y `analogias.js`, de otras sesiones.

`casos.json` no cambió (sus 29 casos dan lo mismo). `papel.json` se regeneró con `herramientas/papel-generador.js`.
No se tocó ninguna pieza: `quim-molecula-3d` se usa con su `plano()`, que ya exporta.

| # | Qué se hizo |
|---|---|
| A1 | Las líneas de `D1` son `nombres` (piramidal y angular), `reg56`, `exp5` y `exp6` (las formas con 1, 2 o 3 pares) y `lewis`. `datosForma(n, m)` arma los Datos de `casoForma` y de «Así se resuelve». La regla: «4 con 1 par: piramidal · 4 con 2 pares, o 3 con 1: angular». La condición nombra bipirámide, balancín, forma de T, lineal, octaédrica, pirámide cuadrada y cuadrada plana. Los ejemplos con pares libres llevan `D1.nombres`. |
| A2 | `casoCualPolar`: una línea «Formas: …» en el orden barajado de la pregunta. El generador usa el mismo orden en el enunciado y en los Datos, sin otra tirada del azar: los casos no cambian. |
| M1 | La teoría lleva masas en `EB_A`, el generador `MASA`. EN16 sale solo si el otro pesa más; con la misma masa sale «Los dos igual: tienen la misma masa»; si no, el orden invertido o QM-ENLACE-INTERNO. |
| M2 | El CH₄ de `casoPuente`: «Es apolar y sus H están unidos a C: solo tiene London.» |
| M3 | Lee 2 de la idea 1 dice qué es un par libre y de dónde sale. `casoRegiones` trae la línea `D1.lewis`. |
| M4 | La línea `rayas` en la teoría (`D2.rayas`, en 6 lugares) y en el generador. |
| M5 | Predice 3 con el CH₂Cl₂ del papel, en cruz. Al revelar, la proyección de `quim-molecula-3d` con las flechas. `predice.pieza` pasa a `quim-molecula`, con `revelar` diferido, porque el validador dibuja todo con esa pieza. |
| M6 | Predice 1 con el NH₃ del papel. Al revelar, la pirámide en perspectiva. |
| M7 | La historia pregunta «¿Cómo se sabe la forma de una molécula que nadie puede ver?». En el resuelto de ebullición, las temperaturas salen de los Datos y van al paso «sentido» como comprobación; la respuesta es la sustancia. El ejemplo del etanol, sin temperaturas en Datos ni la resta. |
| M8 | El agua de Mira 3 queda a 104,5° (H en ±1,107 desde el O) y el eteno a 120°. Prueba con el ángulo medido. |
| M9 | Eje «ebullición (°C)», hasta el periodo 6, para que los rótulos no choquen. Los cuatro hidruros con nombre en Mira. Al revelar, solo el agua lleva su temperatura. «su azufre está debajo del oxígeno». |
| M10 | Práctica `regiones`: sin pares libres, QM-REGION-CENTRAL (n + 1, «el átomo central no es una región»). QM-REGION-DOBLE da los pares compartidos (`EXTRA`). |
| M11 | «Tres carbonos seguidos»: la B es «sp³, sp³ y sp³». ClF₃: «uno arriba, uno abajo y uno al costado», y la E es «la forma de una molécula de tres átomos». BF₃: «cuatro regiones, como si tuviera un par libre». SF₆: la A y la D, cada una con su error. |
| M12 | Leyenda: «región: un enlace; un par libre también lo es», con «109,5°» en turquesa como símbolo. `casoPolar` y el generador: «sus átomos de alrededor son iguales» (con pares libres) o «su forma es simétrica» (con átomos distintos). |
| B1–B5 | B1: «enlaces algo polares» para el H₂S, y en el ejemplo «(los S–H, apenas)». B2: «ningún par libre». B3: acetileno; «sp³ junta un s y tres p (cuatro); sp², un s y dos p (tres)»; la consigna cuenta las regiones; leyenda «enlace pi: extra del doble y del triple»; nueva voz; espacios que no se cortan en La regla. B4: la cruz marca el lado algo positivo, «El dipolo se escribe μ», y la condición nombra la excepción. B5: «temperatura de la sustancia». |
| B6–B8 | No se tocaron (ver la tabla). |

### Pendiente

- **Compartido:** `nucleo/teoria.js` debería dibujar cada figura de Predice con su `dib.pieza`, como la app. Lo que se
  ganaría es poder mezclar el papel con el 3D sin pasar a la proyección. Lo segundo es el respaldo plano de
  `quim-molecula-3d`, apretado con las flechas (B8).
- **Para Gerson** (decidido por la sesión, Gerson revisa después):
  - el par H₂O–H₂S sigue en dos ejemplos de la idea 4 (B7);
  - el SO₂ y el SO₃ con dobles enlaces en el S (octeto expandido, como en el motor y en Enlace químico).
