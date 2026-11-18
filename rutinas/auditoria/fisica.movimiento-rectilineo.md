# Auditoría de contenido: «Movimiento rectilíneo uniforme» (fisica.movimiento-rectilineo)

18 nov 2026. Auditor externo, sin editar la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md`
4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` (§3 a §10). Decisiones: `docs/etapa4/decisiones.md` y
`docs/etapa4/propuesta-fisica.md`, parte A. Lo que ya encontró `rutinas/frio/fisica.movimiento-rectilineo.md` no se
repite: solo se confirma abajo, en «Lo que dijo el lector en frío».

**Qué se revisó**
- La unidad: `contenido/teoria/fisica/movimiento-rectilineo.js` (v0.4.0, `calidad: 2`), con sus 5 ideas, los 7 momentos
  de cada una, los 75 ejemplos, «Así se resuelve» (semillas 0–11), «Ahora tú» (semillas 0–39), el glosario (13 términos)
  y el laboratorio (1 mesa).
- Las piezas `fis-combi`, `fis-xt`, `fis-pista`, `fis-rio`, `fis-ventana` y `fis-sonido`.
- La partición `partidoMRU` (`nucleo/avance.js:103`), comparada con la versión anterior de la unidad: commit `2abecff`
  de GitHub, la última antes de partirla.
- La práctica: `plantillas/fis-mru/` (36 tipos, test, casos y papel), los tipos de MRU de `cinematica-medias` y de
  `velocidad-relativa` (con `{ unidad }`, sus `papel.json`) y la escena `mruv`, que sigue listada en la unidad.
- La app, en un servidor propio (puerto 4212, ya apagado): los momentos, los 75 ejemplos, el glosario y el laboratorio,
  a 390 px, con `--entera`.

Scripts y capturas en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/aud-mru/`:
`verificar.js`, las capturas en `cap/` y la versión vieja en `viejo/viejo.js`.

**Cuentas.** `verificar.js` no usa ninguna cuenta de la unidad ni de los generadores. Lee solo los textos y los `_datos`,
y recalcula con fórmulas propias.
- **55 ejemplos**, con los 25 de nivel 3: la respuesta, y en los de nivel 3 también la letra y el texto de la alternativa.
- **fis-mru: 108 problemas**, 3 semillas por cada uno de los 36 tipos. Para cada uno: la correcta, que ninguna
  incorrecta valga lo mismo y que haya datos.
- **42 problemas de MRU** de `cinematica-medias` (media en sus 4 subtipos, idavuelta) y de `velocidad-relativa` (marco,
  idavuelta, cruce, con sus subtipos), con `{ unidad: MRU }`. Los tres de `media/mixta` se rehicieron a mano.
- **«Ahora tú»: 145.** Son 45 de las semillas 0–11 de las ideas 1, 3, 4 y 5 (la correcta, rehecha desde los números del
  enunciado) y 100 del tipo de examen de la idea 3.
- «Así se resuelve» (semillas 0–11) comparado con «Ahora tú» (0–39) por los números del enunciado: **ninguno se repite**.

**996 comprobaciones, 0 errores de cuenta.** `node --test` de la unidad, de fis-mru, de las 6 piezas y de avance: 101 de
101. `contenido/teoria/teoria.test.js`: en verde.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 3 (regla), medición | `nucleo/avance.js:103` (`partidoMRU`, sin `reiniciaPrediccion`); `app/teoria.js:572-577` | Las ideas `mru`, `desplazamiento-distancia` y `encuentro` conservan su id pero tienen otra predicción. La partición no borra la que el alumno ya había guardado. Ids que desaparecen: `suma` (mru); `rapidez`, `tramo` e `ida` (desplazamiento-distancia); `resta`, `solo-a` y `velocidad` (encuentro). Para quien eligió una de ellas, `resolver()` hace `o.correcta` con `o` indefinido y el Predice se cae (TypeError). Quien había elegido `c`, `sin-x0` o `seis` ve contestada una pregunta que nunca leyó. Con eso, la idea le abre los ejemplos (`ejemplosAbiertos`) y la medición cuenta un acierto que no hizo. La unidad ya está publicada (v0.4.0 en Vercel), y `partidoMRU` ya corrió para quien entró. | Agregar una marca nueva, que no sea `partidoMRU`, que borre `prediccion` de esas tres ideas (también `c`, porque la pregunta cambió), como `reiniciaPrediccion` en `mudadoSum`; y que `resolver` no se caiga si el id no existe. |
| A2 | 5, 13 (signos) | Regla de A4, `:1449`; regla de A5, `:1781` (y su dibujo, `:1783`) | La unidad dice que v es la velocidad con signo y que «rapidez» es v sin signo. Pero la regla de A4 escribe tₑ = D/(v_A + v_B) con las letras de la velocidad con signo. Si el alumno usa v_B = −6, como enseña «Lee» («el que va hacia el lado − lleva su velocidad negativa»), le sale D/0. En A5, «río arriba: v = u − c» da +2,5. El ejemplo «Río arriba» (`:1604`), con el dato «río abajo es +», da −2,5. Las dos reglas son el «±» de la academia, sin la línea que lo traduce. Esa línea es la decisión de Gerson y A1 sí la tiene. | Escribir esas fórmulas con rapideces en palabras o con barras (tₑ = D/(\|v_A\| + \|v_B\|)), o con signo (v_A − v_B), y agregar la línea «En la academia lo verás como…». |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 10 | «Ahora tú» A3, tipo examen, `:1179`; ejemplo «Mitad y mitad», `:980`; fis-mru `mitades`, `generador.js:854` | Un «ciclista» que va a 28 m/s (100 km/h): [8, 20, 28] sale en 1 de cada 8 semillas del tipo. Otros salen a 18 m/s (65 km/h) y 16 m/s. El ejemplo va a 14 m/s (50 km/h) y fis-mru llega a 16 m/s. En 100 semillas del tipo, la mitad pasa de 12 m/s. | Dejar al ciclista en 12 m/s o menos, o cambiarlo por «una combi», y probarlo en 400 semillas, como hace fis-mru con sus vehículos. |
| M2 | 10, 13 | `velocidad-relativa/generador.js:192` (marco con combis); `:249-252` (columna); `cinematica-medias/generador.js:155` (VIAJES) | En la práctica de MRU sale «la combi A va a 108 km/h» (`vA = 9·(3…12)`). Sale también «una columna desfila a 11 m/s» con un ciclista a 12 m/s: un desfile va a menos de 2 m/s. cinematica-medias usa tramos reales con distancias que cambian según la semilla: Cusco–Sicuani a 120 km, Lima–Huacho a 144 km, Juliaca–Puno. No traen fuente. La propuesta §8 dice que la distancia Juliaca–Puno no se usa sin fuente. | Combis hasta 90 km/h y columna hasta 2 m/s cuando la unidad es MRU. Lugares sin nombre («de una ciudad a otra») o con una distancia fija y su fuente (MTC). |
| M3 | 9, 13 | `plantillas/velocidad-relativa/papel.json`, `cinematica-medias/papel.json` y `mruv/papel.json`: ningún problema trae `unidades` (`app/app.js:1309` filtra por ese campo) | El papel no se filtra por unidad. Desde MRU, el de velocidad-relativa muestra el bote con ángulo (p5, p6, de Vectores) y la caja lanzada (p7, de choques). El de cinematica-medias muestra el MRUV, el tiro parabólico y la latitud (p4–p8). El de la escena mruv muestra 8 problemas de MRUV de 10. Además, el papel de velocidad-relativa escribe «v⃗_AB = v⃗_A − v⃗_B», con flecha y con el orden de letras al revés de v_B/A = v_B − v_A, que es como lo escribe la unidad. Casi ningún problema trae datos. | `unidades` por problema en esos tres papeles, y en MRU la notación de la unidad. Es el mismo pendiente que la M21 de Vectores. |
| M4 | 5, §5 (letras) | Ejemplos «Dos rectas con signo» (`:528`, `:611`), «Las placas que se acercan» (`:1668`) y «De frente en km/h» de A5; «Ahora tú» A2 k=3 (`:835`); `velocidad-relativa` marco/combis en MRU | Los móviles se llaman A y B, y las alternativas también van de la A a la E. En las placas, «La **A** resta las rapideces» se lee como «la placa A». La opción «A: 8 m/s; B: −6 m/s» va en la letra B. fis-mru evita justo esto («nunca con A y B, que son las letras de las alternativas»), pero la teoría no. | En los ejercicios con alternativas, nombrar los móviles con palabras (la combi, el mototaxi, la placa del este) y dejar A y B solo para v_B/A en «La regla». |
| M5 | 13 (paso hecho) | Datos del Predice de A1, `:337`; del Predice de A5, `:1757` | En A1, «Hacia el paradero es el sentido negativo» es el paso que mide el distractor MRU-SIGNO (140 m). El lector lo dijo: «me lo dijeron recién en los Datos». Pasa lo mismo en A5: «río abajo: el bote y la corriente van hacia el mismo lado» deja sin efecto REL-SENTIDO. | Dar la herramienta, no el paso: «El paradero está en x = 0; + hacia la derecha» en A1, y nada más que lo que dice la pregunta en A5. |
| M6 | Figura del ejemplo (molde §3) | Ejemplo «El que salió antes», `:1304`; captura `ej-encuentro-11` | La figura pone la combi y el mototaxi en x = 0 a la vez, uno encima del otro. Ese instante no existe en el problema: el mototaxi salió 10 s antes. No se ve cuál vehículo es cuál. «Ahora tú» k=2 dibuja lo contrario, el mototaxi ya en D = v·Δt, que es el primer paso del resuelto. | En el ejemplo, solo el mototaxi en el paradero con su flecha y un rótulo «la combi sale 10 s después», sin la combi. En «Ahora tú», lo mismo. |
| M7 | Pieza (molde §6: las flechas comparten escala) | `nucleo/kit/piezas/fis-rio.js:50-51` | La flecha del bote mide siempre 44 px y la de «desde la orilla», 60 px, sea cual sea el valor. Río arriba, la flecha de u − c sale más larga que la de u: eso es lo que vio el lector en la regla de A5, y en cualquier figura río arriba con `total` pasa igual. | Largo proporcional al valor numérico, con la misma escala para u, c y el total; o, sin números, total = u ± c con los largos de u y c. |
| M8 | Niveles (molde §3) | A3: «Subir y bajar el cerro», nivel 3 (`:970`); «Dos tramos hacia adelante», nivel 2 (`:925`); el Predice (`:1075`) | El ejemplo de nivel 3 es el Predice con las mismas rapideces (2 y 6, sale 3) pasado a km/h. La cuenta es la del nivel 2 (dos distancias iguales). fis-mru `cerro` excluye esos números («el ejemplo (y los números de la predicción)»), y eso confirma que se repite. | Cambiarlo por uno de examen que falte: «la mitad del camino… y la mitad del tiempo» ya está; sirve el de tres tramos con una parada. |
| M9 | 13 (lo que usa el resuelto) | 9 de los 15 ejemplos de A4 (`:1229-1358`) | El lector lo marcó en el 11 y el 12. Pasa en 9 de 15: Datos trae «misma posición, mismo instante» y x = x₀ + v·t, y el resuelto usa la rapidez de acercamiento (D/(v_A ± v_B)), que no está en Datos. «Así se resuelve» sí iguala posiciones. | O el resuelto iguala posiciones, como «Así se resuelve», o Datos trae la regla de la separación («de frente, la separación baja la suma de lo que avanza cada uno»). |
| M10 | Ejemplos (diseño) | Los 25 de nivel 3 | La correcta es la **B** en 15 de 25, la C en 7 y la A en 3. Nunca es la D ni la E. Un alumno aprende a mirar la B. | Repartir la letra correcta entre las cinco, o barajar con semilla como Predice, y probarlo con el validador. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 10 | «Caminar sobre el bote», `:1678`; «El pastor y las llamas», `:1688`; fis-mru `ida-vuelta-rio`, columna | El niño «camina» a 3 m/s (11 km/h) sobre un bote de 30 m. El pastor va a 3 m/s, y hasta a 4 m/s en fis-mru: corriendo, en el altiplano. | 1,5 m/s caminando, o decir «corre». |
| B2 | 13 | «Los 100 m planos», `:900` | La respuesta trae «unos 37,6 km/h», pero Datos no tiene 1 km = 1000 m ni 1 h = 3600 s. | Agregar `DM.kmh` o quitar los km/h. |
| B3 | 13 (definición que es consejo) | `DM.eco`, `:124`; «Sin vuelta…», `:625`; fis-mru `D.eco` y `D.sinVuelta` | «El sonido rebota y vuelve hasta quien grita» y «Sin vuelta, la distancia recorrida es lo que avanzó» dicen el paso que miden los distractores (1020 m, XT-POSICION). | Dejar la definición neutra: «Eco: el sonido que se oye después de rebotar en el cerro». La otra línea se quita: la definición de d ya está. |
| B4 | 3, 9 | Ejemplos de nivel 3 de A1: eco y trueno (`:214-235`) | Usan «D = …» sin definirla. D se presenta recién en el «Lee» de A4. | Una línea de datos («D: la distancia hasta el cerro») o escribir la distancia en palabras. |
| B5 | 5 (subíndices) | Glosario, `:1941` (`app/teoria.js:312` y `:729` hacen `esc(e.def)`, sin `conSub`) | La hoja del glosario muestra «v_m = Δx/Δt» con el guion bajo tal cual. | «vₘ», como en el generador, o pasar `def` por `conSub`. |
| B6 | 13 (atajo) | `cinematica-medias/generador.js:190` (solución en MRU) | La solución enseña «Atajo para mitades de recorrido: 2·v₁·v₂/(v₁ + v₂)», y el distractor MED-armonica lo cita. La unidad pide criterio, no fórmulas memorizadas. | Quitar la línea del atajo o dejarla como comprobación, sin el nombre «atajo». |
| B7 | 4e | «Así se resuelve» de las cinco ideas | Ningún «Así se resuelve» repite números de «Ahora tú» (bien). Pero cada uno resuelve otra pregunta: en A1, el tiempo y la velocidad, mientras «Ahora tú» pide la posición; en A3, la tabla, mientras «Ahora tú» pide la valla, los tramos y las mitades. `docs/teoria.md` 4e pide «del mismo tipo». | Que al menos una de las dos ramas de cada «Así se resuelve» sea del tipo k=0 de su «Ahora tú». |
| B8 | 1 (ejercicio de G1) | «Elegir la gráfica», `:632` | Pide elegir la gráfica x–t, pero las alternativas son frases («Sube, queda horizontal…»). La figura es la combi en la avenida. | Alternativas con cinco gráficas chicas de `fis-xt`, como en el examen. |
| B9 | Papel | `plantillas/fis-mru/papel.json` | Los datos van dentro del enunciado («Datos: …») y las alternativas a la vista. Es el pendiente M21 de Vectores (fuera de la unidad: `herramientas/papel-generador.js` y `app/app.js`). | El de Vectores. |

### Lo que dijo el lector en frío, verificado en el código

Sigue igual, sin corregir:
- La lectura del Juega de A1 da la posición a los 5 s con cualquier valor del reloj (`:322`).
- «x₀ ± v·t» en el texto de la regla y «+» en la ecuación (`:360`). La línea de la academia es la decisión de Gerson; el
  texto tiene que decir que v ya lleva el signo.
- La llave de «v · t» va de 80 a 20 sin sentido (`:364`).
- La llave «la pendiente» en A2 (`:745`).
- «Con su signo» en «Ahora tú» A2 k=0, donde todas las opciones son positivas.
- El control `r` sin color ni leyenda (`:1060`), y 7,1 contra 7,2 m: el reloj se redondea aparte de la distancia (`:1064`).
- tₑ y t_alc sin decir en palabras.
- u y c, que aparecen de golpe en el ejemplo 14 de la lista del lector («La corriente desde dos viajes»).
- A5 sin dibujo en «Así se resuelve» (semillas pares) ni en «Ahora tú» (k = 0 y 1).
- El ejemplo 09 de la lista del lector («Dos tramos de tiempo», `:1001`): regla de 0 a 100 m para 21 km, con un paradero
  que el enunciado no nombra.
- El 15 del lector («El pastor y las llamas») sigue sin figura.

Lo que el lector no podía ver: la flecha del río no tiene escala en ninguna figura (M7), y lo de los ejemplos 11 y 12 se
repite en 9 de los 15 de A4 (M9).

## Lo que está bien y hay que copiar al molde

- **Cero errores en 996 comprobaciones.** Cada constante de ejemplos dice qué cuentas se rehicieron, y se puede auditar.
- **fis-mru es el mejor generador de física hasta hoy:**
  - `TIPOS_POR_IDEA` y `NIVEL` por tipo, con niveles 1, 2 y 3 en cada idea;
  - excluye con una línea cada caso de Predice y de los ejemplos («la combi de la predicción de la idea 1»);
  - `datosLimpios` rechaza los datos que traen la respuesta;
  - `elegirErrores` impide que la correcta quede en el centro o en un extremo;
  - nombra los móviles con palabras para no chocar con las letras;
  - prueba en 400 semillas que las medidas son posibles.
- **Datos con la fórmula general y la definición, sin el atajo:** en los generadores, «misma posición en el mismo
  instante» y x = x₀ + v·t, no «de frente se suman». En la práctica de A3, `valla` da las dos medias juntas (criterio
  para elegir).
- **Un color por magnitud, comprobado:** cada ficha lleva `m: 'velocidad'…` y el test la compara con `COLORES`.
  `velocidad-relativa` pasa sus problemas a la paleta y la notación de MRU con `aMRU`, sin cambiar los números.
- **«Sin magnitudes vectoriales» declarado** (`notacion: { vectores: false, motivo }`), con prueba.
- **La predicción queda fuera de lo jugado** (comentario «Se reserva» en cada idea) y las opciones van con su `siFuera`,
  que empieza por lo que el alumno hizo bien.
- **El dato del mundo con su fuente** (Bolt, World Athletics) y los valores de libro con «unos» (sonido).

## Reglas que faltan en el contrato o en el validador

| Regla | ¿Automática? |
|---|---|
| **Una idea que conserva su id y cambia su Predice borra la predicción guardada** (marca nueva de migración). El lector tolera un id de opción que ya no existe. | Sí: comparar los ids de `predice.opciones` con la versión publicada (`git show`), y una prueba de `app/teoria.js` con un id desconocido. |
| **Una fórmula con letras de velocidad con signo no puede ser la forma «±» de academia.** Si la unidad declara v con signo, una regla con v_A + v_B para «de frente» lleva la línea de traducción o usa rapideces. | Semi: aviso si una regla tiene «v_A + v_B» o «u − c» y el texto dice «rapideces». |
| **La letra correcta de los ejemplos de nivel 3 se reparte** (ninguna pasa del 40 %). | Sí. |
| **Los móviles no se llaman A–E en un ejercicio con alternativas.** | Sí: el mismo control que fis-mru, en la teoría y en los generadores. |
| **Papel con `unidades` por problema** en toda plantilla que sirve a varias unidades. | Sí: falla si `unidades.length > 1` y algún problema no lo trae. |
| **Medidas posibles por sujeto** («ciclista», «combi», «columna», «niño»): una tabla de topes por sujeto que lean la teoría y los generadores. Hoy solo fis-mru lo prueba. | Sí: regex del sujeto y del número en m/s o km/h. |
| **Lugares reales con distancia solo con `fuente`** (la regla de §8 de la propuesta, para los generadores). | Sí: lista de topónimos. |
| **Las flechas de una pieza tienen el largo de su valor** cuando el valor es un número. | Sí, en la prueba de la pieza: el largo es proporcional al valor rotulado. |
| **Predice: una línea de datos no dice el signo o el sentido que mide un distractor de su error de signo** (MRU-SIGNO, REL-SENTIDO). | Semi: aviso si datos tiene «es el sentido negativo» o «van hacia el mismo lado». |
| **«Así se resuelve» del mismo tipo que «Ahora tú»** (4e): cada rama debe tener su par en un `k` de «Ahora tú». | Semi: con un `tipo` declarado en las dos. |
| **El dato que usa el resuelto está en Datos:** la rapidez de acercamiento, el ÷ 3,6. | No, a ojo (el auditor o el lector de ejemplos). |
