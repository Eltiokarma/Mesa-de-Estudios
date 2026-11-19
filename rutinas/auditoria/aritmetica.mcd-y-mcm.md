# Auditoría de contenido: «MCD y MCM» (aritmetica.mcd-y-mcm)

19 nov 2026. Auditor externo del cierre delegado (`docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md`. Vara: `docs/molde-unidad.md` §10. Reglas
automáticas: `docs/metodo/unidad/reglas-validador.md`. Guion: `docs/etapa7/propuesta-aritmetica.md` (decisiones §11).
Lo que vieron los dos lectores en frío está en `rutinas/frio/aritmetica.mcd-y-mcm.md`; aquí se cita solo cuando el
código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/aritmetica/mcd-y-mcm.js` (v0.3.0, sin `calidad: 2`; pasa a v0.3.1 con las correcciones):
  - las 6 ideas con sus 7 momentos;
  - los 90 ejemplos;
  - «Ahora tú» y «Así se resuelve» (400 semillas de cada uno por idea);
  - el glosario (13 términos), las 5 mesas y la historia.
- Las piezas nuevas `arit-cintas` y `arit-reparto`, y el bloque `premios` de `arit-boletos` (compartida con
  Divisibilidad y Números primos), con sus pruebas.
- La práctica `plantillas/mcd-mcm/`: 25 tipos en las 6 ideas, `casos.json` (25) y `papel.json` (8).
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos. Servidor propio en el puerto 4433.
- El cambio de colores de la rama: aquí el turquesa es el MCD y los divisores comunes, el violeta el MCM y los múltiplos
  comunes, y la cantidad que se busca va en tinta (en Divisibilidad y Números primos, el violeta era «lo que se busca»).

**Cuentas.** Se rehicieron con dos scripts propios
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-mm/cuentas.js` y `cuentas2.js`).
De la unidad y del generador solo leen el texto (pregunta, Datos, opciones, `siFuera`, solución, pasos). Cada respuesta
y cada valor de distractor salen del enunciado por fuerza bruta, sin las fórmulas de la unidad:
- cada MCD probando divisores de mayor a menor, y cada MCM probando múltiplos uno por uno;
- cada «mismo resto» buscando el número en su rango (el menor desde la cota, el mayor desde 999 hacia abajo);
- cada conteo de inclusión y exclusión contando boleto por boleto (tachados en un conjunto, «exactamente uno», «ninguno»,
  tramos que no empiezan en 1);
- Euclides con restas repetidas, la fracción continua con racionales BigInt, y la reconstrucción buscando todos los
  pares con esos cocientes y ese MCD;
- las tomas de medicinas, las alarmas y los camiones, simulando hora por hora o día por día.

**Resultado: 52 943 comprobaciones; además, 28 544 igualdades y desigualdades evaluadas con racionales exactos.**
- «Ahora tú»: 2 400 casos (400 por idea, los 31 tipos), con la correcta, una sola correcta, cuatro opciones distintas y
  el valor de cada distractor rehecho con su error.
- «Así se resuelve»: 2 400 casos, con la respuesta y todas las cuentas de los pasos.
- La práctica: 2 400 problemas (400 por idea, los 25 tipos), con la respuesta y el valor de cada error por su código;
  los 25 de `casos.json` y los 8 del papel.
- Los 90 ejemplos: los 30 de nivel 3 con la respuesta y las cuatro trampas rehechas por fuerza bruta (la letra
  correcta queda 6 veces en cada una de A a E), y los 60 de nivel 1 y 2 con su respuesta.
- Las 6 predicciones con cada distractor rehecho (72, 6 y 24 m; 6, 216 y 30; 240, 480 y 24; 241, 13 y 60; 50, 30 y 10;
  y en Euclides, MCD(91, 35) = MCD(35, 21) = 7).
- Las 6 misiones en toda su grilla (36, 16, 12, 51, 9 y 16 casos): cada una se cumple con un solo caso, que coincide con
  la meta por fuerza bruta, y no al abrir. Las lecturas de los seis juegos, en toda su grilla.
- Frases que afirman un hecho: «N deja r con a», «X y Y son PESI», «comparten el p», «no es múltiplo de», «sobran X m»,
  «no entra exacto en los dos», «no tiene tres cifras», «llegar a tres cifras con un múltiplo».
- **Lo que la respuesta no ve, y sí vio el script:**
  - un `siFuera` falso en 73 de 80 casos de su tipo en la teoría y en 95 de 105 en la práctica (A1);
  - una explicación falsa en 1 de 96 problemas de su tipo en la práctica (M6);
  - casos de «Ahora tú» y de «Así se resuelve» iguales a un ejemplo o a la misión en 22 de 4 800 (M2).
- Las respuestas, las igualdades y los demás valores de distractor cuadran todos.

Validador con `calidad: 2` simulada (`Teoria.problemas` con 200 semillas): **0 problemas, 0 pendientes** antes y después
de las correcciones. Ninguna de las faltas de abajo la ve una regla de hoy. `herramientas/ecuaciones-ancho.js`: «todo
cabe», aunque el lector B vio partida la fórmula de inclusión y exclusión (M7): la herramienta mide desbordes y cortes
dentro de un paréntesis, no entre «de» y su letra. Pruebas propias antes de corregir: unidad 15 de 15, generador 37 de
37, piezas en verde.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, 13 | Idea 6, «Ahora tú» tipo 0 (`casoMcdE`, opción `cociente`) y práctica `mcd` (AT-EUC-COCIENTE) | El `siFuera` dice «el cociente q cuenta veces: no entra exacto en los dos». El primer cociente suele ser 1 o 2, que sí dividen a los dos números (MCD de 33 y 24: el cociente 1 divide a 33 y a 24). Falso en 73 de 80 casos en la teoría y en 95 de 105 en la práctica. | «Pero el cociente, q, dice cuántas veces entra B en A; el MCD es el último divisor.» |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 3, 12; letras | Idea 3: La regla, la cinta del MCM, Lee 3, «Ahora tú» tipos 0 y 1 y práctica `otro` y `producto` | La regla dice «A = MCD × p y B = MCD × q, con p y q PESI» sin decir que son los cocientes, y en Números primos p y q eran dos primos. Las notas «2 rollos A (q)» y «3 rollos B (p)» cruzan las letras (lector A: «tuve que hacer la cuenta para creerlo»). Los `siFuera` de los tipos 0 y 1 dicen «es p × q» y sus Datos solo traen MCD × MCM = A × B. | Regla: «p y q son los cocientes»; condición: «p y q no tienen que ser primos: solo PESI»; notas «2 rollos A: tantos como trozos tiene B, q»; la línea de p y q en los Datos de los dos tipos. |
| M2 | Regla 8, lección 15 | «Ahora tú» de las ideas 1, 3, 4, 5 y 6; «Así se resuelve» de la idea 3 | 1,5 m y 2,25 m (el ejemplo «Metros con decimales», 3 de 400); 864 y 6 («El producto y el MCD», 2); MCD 4 y MCM 48 (la misión, 3); 4 con 3 y 6 con 5 («Falta lo mismo en las dos», 2); 2, 3 y 5 hasta 60 («Tachar uno tras otro», 4); [2; 1, 3] y [1; 2, 2] (dos ejemplos, 4). «Así se resuelve» de la idea 3 con MCD 4 y MCM 144, cuyos pares da el ejemplo (4 de 400). | Excluir esos casos con las listas de usados de cada idea. |
| M3 | molde §3 («Así se resuelve no es la misma pregunta que Ahora tú») | «Así se resuelve» de las ideas 1, 4 y 5 | Idea 1: «¿cuántas bolsitas arma en total?» es el tipo 1 de «Ahora tú» («¿cuántos trozos salen en total?») con otro objeto. Idea 5: «¿cuántos no son múltiplos de a ni de b?» es el tipo 2 («¿cuántos boletos no ganan ningún premio?»). Idea 4: el mayor de dos cifras es el tipo 3 con otra cota. | Idea 1: la mayor cantidad de bolsas iguales y qué lleva cada una; idea 4: cuántos de dos cifras dejan el mismo resto; idea 5: múltiplos de a pero no de b. |
| M4 | 5b | Leyendas de los juegos 1 y 5; Lee de la idea 2 | El violeta cambia de papel en la rama, y en la unidad nada lo dice: la leyenda del juego 5 llama al borde violeta «los dos premios: está en las dos cuentas», cuando lo que se busca son los que ganan algo (en Números primos, el violeta marcaba «lo que se cuenta»). La del juego 1 no dice que el trozo turquesa es un divisor común. | Lee 3 de la idea 2: «En esta unidad, el violeta marca los múltiplos comunes y el turquesa, los divisores comunes»; leyenda 5: «un múltiplo del MCM»; leyenda 1: «si entra en los dos: divisor común». |
| M5 | 3, 9 | Idea 6: La regla y las tarjetas 17 y 18 | La regla nombra «[2; 1, 1, 2], fracción continua de 91/35» sin la escalera, y los resueltos dicen «empiezo por abajo» y «sin escalera» (lector B). La escalera solo se ve en el paso 5 de Mira. | La escalera de 91/35 en la ecuación de la regla, y [1; 2, 2] y [2; 1, 3] en escalera en el primer paso de cada tarjeta. |
| M6 | 10, 13 | Idea 4, «Ahora tú» tipo 2 (`casoTresCifras`, opción `olvida`) y práctica `tres-cifras` | «Bien llegar a tres cifras con un múltiplo de 48»: el múltiplo es 96, de dos cifras (resto 5: 101). En la práctica, 1 de 96 (semilla 331); en la teoría puede pasar con los mismos números. | «Bien usar un múltiplo de M. Pero así no sobra nada.» |
| M7 | 8; lectores | Reglas de las ideas 4 y 5; tarjetas 07, 09, 16 y 15 | La regla 4 dibuja 61 con bolsitas de 4, 6 y 10 y el recuadro es de 4 y 6, y rₑ no tiene ejemplo; la fórmula de la regla 5 se parte entre «de» y «B»; la L de su condición no se dice; la tarjeta 16 («¿qué par tiene el mismo MCD que 64 y 24?») tiene muchas respuestas; «MCD(A, / B)» se parte en los Datos (lector B). | Dibujo de 25 con 4 y 6; condición con «con 4 sobran 3 y con 6 sobran 5, falta rₑ = 1»; espacios que no se parten; «se cuenta del 1 al L»; tarjeta 16: «¿qué par se divide después?». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 13 | Idea 1, «Ahora tú» tipo 3, opción `todos` (AT-MCD-TODOS) | Con A = 2⁴ × 3 × 7², el distractor pone el 7 con exponente 1, como no aparece en A (33 de 67 casos del tipo). | El primo no común con su exponente. |
| B2 | 10 | Idea 5, «Ahora tú» tipo 4 | «faltan quitar los 13 de antes del 50». | «falta quitar». |
| B3 | 10 | Idea 2, «Ahora tú» tipo 2 | «a las 48 h coinciden las tres» se lee como una hora del reloj; la pregunta es «dentro de cuántas horas». | «a las 48 h de empezar». |
| B4 | 3 | Idea 3, «Ahora tú» tipo 3 (San Marcos 2019-II) | La solución empieza «Con MCD = 12» sin decir de dónde sale. | «Solo con MCD = 12, un divisor de 12, salen cocientes PESI». |
| B5 | 13 | Práctica `tres` (AT-NOMAX) | El divisor común «que no es el mayor» es siempre 1; en 34 de 76 casos hay uno mayor (2 o 3), como en la teoría. | El mayor divisor común después del MCD. |
| B6 | Letras | Mesa «Tres combis» | Consigna «cada a, b y c minutos» y controles «a», «b», «c»: en la rama son cifras, y la tabla de letras dice que no se usan. | «Combi 1, 2 y 3», sin letras (ids de siempre, por la colección). |
| B7 | Lectores | Reglas 1 y 2, Datos y Luma | «Vale si enteros positivos» y «Vale si sin contar el 0» no son frases; «si coinciden al empezar» no se entiende; PESI sin sus letras; Luma «¿Se junta o se corta?» en una rifa y «se restan una vez» en una pregunta de «a la vez»; el punto y el cuadrito sin leyenda en Lee; A y B sin decir en «Así se resuelve»; «sobran 1» en el paquete cerrado; tarjetas 01, 08, 09 y 15 (lectores A y B). | Ver `rutinas/frio/aritmetica.mcd-y-mcm.md`. |
| B8 | Dibujos | Tarjetas 05 y 06 | Las losetas y el cubo de ladrillos piden un dibujo (lector B); no hay pieza para ellos en los ejemplos. | Para Gerson. |

**El cambio de colores (pedido de la sesión).** Está bien pensado y se cumple: el test de la unidad comprueba que cada
ficha de color dice su magnitud y lleva su color en las seis ideas, y el script no encontró un MCD en violeta ni un MCM
en turquesa. Las cantidades que se buscan (cuántos trozos, boletos, N) van en tinta, y la leyenda de la idea 4 dice qué es
N sin color. Lo que faltaba era decirlo (M4): ahora Lee 3 de la idea 2 lo dice en una frase, y las leyendas de los juegos
1, 2, 3 y 5 nombran el divisor común, el múltiplo común y el MCM. **p y q** (M1): ahora la regla dice que son los
cocientes, la condición que no tienen que ser primos (en Números primos lo eran), la leyenda del juego y la cinta del MCM
los dicen en palabras, y los Datos de todo ejercicio que los nombra los traen.

## Lo que está bien y hay que copiar al molde

- **Misiones con una sola respuesta en toda su grilla, y una prueba que la recorre.**
- **Las trampas de nivel 3 rehechas en la prueba de la unidad**, cada una por su error, y la letra repartida (6 por letra).
- **Unicidad por fuerza bruta dentro del generador**: «la diferencia y el MCM» solo sale si hay un único par, y lo mismo
  la reconstrucción de Euclides (el script lo confirmó en todas las semillas).
- **Un color por magnitud con prueba** (`def.colores` y la ficha que dice su magnitud): el cambio respecto de la rama no
  rompió nada.
- **El circulito glosado por construcción** (`conMu`), heredado de Números primos.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Una frase de un `siFuera` que afirma algo del distractor es cierta en todas las semillas**: «no entra exacto en los dos», «llegar a tres cifras» (A1, M6). Ya propuesta en Números primos; aquí volvió en otra forma. | Parcial: el comprobador de frases de `cuentas.js` lee estos patrones en 400 semillas. |
| **«Así se resuelve» no es la misma pregunta que un tipo de «Ahora tú»**, aunque cambie el objeto (M3). La regla `resuelve-repite` compara enunciados enteros y no lo ve. | Parcial: comparar la última oración con los números borrados ve el caso de la idea 5, no el de la idea 1 («bolsitas» contra «trozos»). |
| **«Ahora tú» no repite los números de un ejemplo ni de la misión** en ninguna semilla (M2). | Sí: los números del enunciado en orden, contra los de los ejemplos y la misión (prueba nueva de la unidad). |
| **Una letra que cambia de sentido respecto de la unidad anterior de la rama se dice en la regla** (p y q: primos en Números primos, cocientes aquí) (M1). | Parcial: la tabla de letras de las dos unidades se puede comparar; el aviso en la regla es lectura. |
| **Un color que cambia de papel en la rama se dice al alumno** (M4). | No: es lectura, aunque `def.colores` de dos unidades vecinas se puede comparar. |
| **El dibujo de La regla es el caso del recuadro** (M7, regla 4). | Parcial: comparar los números de `regla.dibujo.datos` con los de `regla.ecuacion`. |
| **`ecuaciones-ancho.js` mide también los cortes entre una palabra corta y su letra** («de / B», «MCD(A, / B)»). | Sí: una lista de pares que no se separan, como hoy los paréntesis. |

## Correcciones (19 nov)

Paso 3 del cierre (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (ver
`rutinas/frio/aritmetica.mcd-y-mcm.md`, «Correcciones de la ronda 1»). Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-mm/antes/`.

Las pruebas nuevas van al final de `mcd-y-mcm.test.js` (8 y el test de «Así se resuelve» al día), de
`generador.test.js` (4) y de `arit-reparto.test.js` (1). Con los archivos de antes fallan todas (comprobado en una copia
con la versión de antes: las 8 de la unidad, las 4 del generador y la de la pieza). Después: unidad 23 de 23, generador
41 de 41, piezas en verde; validador con `calidad: 2` simulada sin problemas; `cuentas.js` sin fallas, sin afirmaciones
falsas y sin igualdades falsas en 400 semillas por idea (52 582 comprobaciones y 29 344 igualdades); `cuentas2.js` sin fallas (solo quedan coincidencias de números
en otro orden, que no son el mismo caso). `contenido/teoria/teoria.test.js`: 164 de 164 (en una corrida intermedia falló
Triángulos rectángulos, que edita otra sesión). No se corrió `npm test` completo. Se corrió `npm run
catalogo` y `herramientas/papel-generador.js mcd-mcm` (cambia p3: la línea de p y q en los Datos).

| # | Qué se hizo |
|---|---|
| A1 | `siFuera` y explicación nuevas, ciertas siempre. Prueba en la unidad y en el generador (400 semillas). |
| M1 | Regla, condición, Lee 3, notas de la cinta del MCM, glosario («p = A ÷ MCD y q = B ÷ MCD, que siempre son PESI») y la línea de p y q en los Datos de `casoOtro`, `casoProd`, `otro` y `producto`. Prueba. |
| M2 | Listas de usados: `USADOS1` en `casoUnidades`; `USADOS3P` (864 y 6; MCD 4 con MCM 24, 48 y 144) en `casoProd` y `casoPares`; 16 y 36 en `USADOS3`; 4 y 6 con falta 1, y 4, 5 y 6, en `USADOS4`; 2, 3 y 5 hasta 60 y 100 en `USADOS5`; [2; 1, 3], [1; 2, 2] y la reconstrucción 3, 2, 4 con MCD 6, fuera. Prueba: los números de «Ahora tú» y de «Así se resuelve», en orden, no son los de ningún ejemplo ni de la misión en 400 semillas. |
| M3 | «Así se resuelve» nuevo en las ideas 1 (bolsas iguales: cuántas y qué lleva cada una), 4 (cuántos de dos cifras dejan el mismo resto) y 5 (múltiplos de a pero no de b), rehechos por fuerza bruta en `cuentas.js` y en la prueba de la unidad. Prueba. |
| M4 | Lee 3 de la idea 2 y las leyendas 1 y 5. Prueba. |
| M5 | Escalera en la regla y en las tarjetas 17 y 18; paso 5 de Mira «fracción continua de 91/35, en escalera». Prueba. |
| M6 | Texto nuevo en la teoría y en la práctica. Prueba en las dos. |
| M7 | Regla 4 con el dibujo de 25 en bolsitas de 4 y de 6 y la condición con su ejemplo; regla 5 con espacios que no se parten y «se cuenta del 1 al L»; tarjeta 16 nueva; MCD(A, B) y MCM(A, B) sin partir en los Datos; la regla 6 dice «A y B tienen el mismo MCD que B y r» (MCD, término del glosario, se partía antes de su paréntesis). Prueba. Capturas después de corregir: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-mm/despues/` (132, ninguna repetida); `ecuaciones-ancho.js`: todo cabe. |
| B1 | El primo no común va con su exponente. Prueba. |
| B2, B3, B4, B6 | Como dice la tabla. |
| B5 | `tres` de la práctica usa el mayor divisor común después del MCD. Prueba en el generador. |
| B7 | Ver el archivo del lector en frío. «sobra 1» en `arit-reparto`, con su prueba. |
| B8 | No se tocó (dibujos para Gerson). |

### Pendiente

- **Para Gerson (dibujos de prueba):** los rollos, la plancha con dos premios y el paquete siguen siendo de prueba
  (`data-prueba`); las tarjetas 05 y 06 piden un dibujo de losetas y de cubo que hoy no existe.
- **Decidido por la sesión, Gerson revisa después:**
  - el «Así se resuelve» de las ideas 1, 4 y 5 cambió de pregunta (M3), porque era la misma de un tipo de «Ahora tú»;
    se eligieron preguntas de examen que «Ahora tú» no tiene. Descartado: quitar el tipo de «Ahora tú», que perdía un
    tipo de examen.
  - la fracción continua se queda en la idea 6 (el lector B pidió enseñarla o sacarla): se enseña con su escalera en la
    regla y en los ejemplos. Descartado: sacar los ejercicios de valor, que son del temario del catálogo.
- **De `herramientas/ecuaciones-ancho.js` (fuera del alcance):** la regla nueva de la tabla de arriba.
