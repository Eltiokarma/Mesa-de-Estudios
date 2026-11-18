# Auditoría de contenido: «MRUV y caída libre» (fisica.mruv-y-caida-libre)

18 nov 2026, noche. Auditor externo. No edité la unidad, solo este informe. El contrato es `docs/plan-calidad.md` §3 (13 puntos) y §5; el formato, `docs/teoria.md` 4e, 4f, 4h y §5; la vara, `docs/molde-unidad.md` (§10). Lo aprobado está en `docs/etapa4/decisiones.md` y en `docs/etapa4/propuesta-fisica.md`, parte B. Lo que ya encontró el lector en frío (`rutinas/frio/fisica.mruv-y-caida-libre.md`) no lo repito. Solo confirmo, al final, que sigue en el código: su «Se corrige» todavía no se aplicó.

**Qué revisé.**
- La teoría: `contenido/teoria/fisica/mruv-y-caida-libre.js` (6 ideas, 90 ejemplos, «Ahora tú» con las semillas 0–15 y 0–119, «Así se resuelve» con las semillas 0–7), su glosario y su laboratorio.
- Las piezas `nucleo/kit/piezas/fis-mruv.js` y `fis-combi.js`.
- La migración: `nucleo/avance.js`, partición `partidoMRU`, probada en la app.
- La práctica: el generador `plantillas/fis-mruv/` con su papel; los tipos `vt` y `ecuacion` de `plantillas/cinematica-medias/`; la escena `plantillas/mruv/` («Más mesas del tema»).
- El catálogo (`catalogo/cursos/fisica.json`).
- La app en mi propio servidor (puerto 4213, ya apagado): 134 capturas con `herramientas/capturas-teoria.js --entera`, en el scratchpad `aud-mruv/`, y una prueba con Playwright del avance migrado (`aud-mruv-cuentas/migra.js`).
- `node --test` de la unidad, las piezas, el generador y el avance: 101 de 101 en verde.

**Cuentas.** Las rehice con scripts propios que no usan el código de la unidad, ni el generador ni el motor (scratchpad `aud-mruv-cuentas/`):
- `ejemplos.py`: 52 ejemplos, entre ellos los 28 numéricos de nivel 3. Los 2 conceptuales de nivel 3 (4.14 y 6.13) los revisé a mano.
- `ahora.py`: 31 respuestas de «Ahora tú» y «Así se resuelve», calculadas desde el texto de la pregunta.
- `rehacer-gen.js`: 3 semillas por cada tipo y subtipo de `fis-mruv`. Son 62 combinaciones: 186 problemas numéricos, recalculados desde `_datos` y el enunciado y comparados en valor y en texto, y 9 de forma de la gráfica, revisados a mano.

**Todas cuadran: 278 de 278.** El único desajuste aparente, 0,625 → «0,63», sale del redondeo de la mitad hacia afuera, que es la convención del repo. Los problemas de la unidad no son de cálculo. Son de avance migrado, de lo que el glosario regala, de los datos, de los niveles, del color de la práctica compartida y de credibilidad.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | Regla 3; migración | `nucleo/avance.js:103-105` (`partidoMRU` sin `reiniciaPrediccion`); `app/teoria.js:563-585` | La idea `pendiente-aceleracion` conservó su id, pero la Predice cambió. La vieja era «¿Hacia dónde apunta su aceleración?», con las opciones `c`, `derecha`, `cero` y `sin-v0`. La nueva es la del mototaxi que retrocede, con `c`, `suma`, `ida` y `altura`. La predicción guardada viaja tal cual. Lo probé en la app con Playwright (`migra.js`): (a) con `derecha`, `cero` o `sin-v0` sale el `TypeError: Cannot read properties of undefined (reading 'correcta')`; la figura queda revelada con «+12 m» y «−6 m», no aparece la retroalimentación y el botón sigue diciendo «Paso 2 de 6»; (b) con `c`, la app dice «Coincide» a una pregunta que el alumno nunca vio y le abre los Ejemplos. `caida-libre` no tiene el problema: sus ids y su pregunta son los mismos. | Agregar a `partidoMRU` `reiniciaPrediccion: { 'pendiente-aceleracion': ['c', 'derecha', 'cero', 'sin-v0'] }`, con su prueba, y en `predice()` tratar como no predicha una opción guardada que ya no existe. |
| A2 | Regla 3; §2 (glosario) | Glosario, `:2492, 2500, 2504, 2532, 2543`; Predice de B1, `:331` | Los ejemplos del glosario dicen la respuesta de la predicción de su idea, y esas palabras se pueden tocar antes de predecir (Lee, el mapa y los Datos de la propia Predice). **frenar**: «de 20 m/s a 8 m/s hacia la derecha: a = −3 m/s²». Es la pregunta de B1 con su respuesta, y «frena» va subrayado en los Datos de esa misma Predice (captura `aceleracion-3-predice`). **aceleración**: «pierde 3 m/s cada segundo… a = −3 m/s²». **distancia de frenado**: «Al doble de rapidez… cuatro veces más metros» (B2). **gravedad**: «Una canica y una piedra, sin aire, caen con la misma g» (B5). **altura máxima**: «Arriba v = 0, pero a sigue siendo −10 m/s²» (B6); su «A 10 m/s, la pelota sube hasta 5 m» es además la respuesta de la misión de B6. | Cambiar esos ejemplos por casos que no sean la predicción ni la misión, por ejemplo: 15 → 5 m/s en 5 s; un mototaxi que frena; una moneda y una pluma en la Luna. |
| A3 | 13 | `DB6`, `:2138-2141`; ejemplo «El encuentro en el aire» `:2237-2248`; «Ahora tú» de B6, `:2447-2458`; generador `encuentro` y papel p8 | El resuelto escribe «piedra y = 40 − 5t²», pero en los Datos solo está y = v₀t − ½gt², «medida desde donde sale». No hay término y₀ ni la fórmula de soltar (h = ½gt², que es de B5). El alumno no tiene la herramienta para la piedra. | Agregar a DB6, en los tipos de encuentro, «Con el 0 en otro lugar: y = y₀ + v₀·t − ½·g·t²», o la línea de B5. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13 (consejo y herramienta que falta) | `:710, 1530, 1760, 2230, 2438` | Los Datos de la teoría traen «Una ecuación de segundo grado puede tener dos raíces; aquí t no es negativo.». Es un consejo, más el paso «descarta la negativa». Y falta la herramienta: el resuelto factoriza «(t − 6)(t + 10)» y no da la fórmula general. El generador sí la da (`D.cuadratica`). | Reemplazar la línea por la fórmula general del generador. Que el resuelto diga por qué se descarta la raíz negativa. |
| M2 | 10; figura que contradice el texto | «Así se resuelve» de B5, semillas impares, `:2017-2021` | `cm` sale de [5; 11,25; 20; 31,25; 45]. En las semillas 1, 3 y 7 el texto dice «Atrapas una regla… cuando ya cayó 31,25 cm», pero la regla del tema mide 30 cm y la figura la dibuja sin atrapar (`escapo: true`; el SVG no tiene la mano cerrada). Con 45 cm, lo mismo. | Dejar `cm` ≤ 30 (5; 11,25; 20) o decir «una regla de 50 cm» y dibujarla así. |
| M3 | Niveles (molde §3) | B2, `:727-767` contra `:672, 698, 690`; B6, `:2249` contra `:2173`; B5, `:1892-1919`; B1, `:248` contra `:217`; B3, `:1150` contra `:1108` | En B2, 4 de los 5 ejemplos de nivel 3 son cuentas del nivel 2 con alternativas: «Frenar a 72 km/h» es la de «Frenar en km/h»; «El quinto segundo» y «Desplazamiento entre instantes», la de «Entre dos instantes»; «La velocidad en la ecuación», la de «La ecuación horaria». En B6, «La moneda en la cima» (nivel 3) es la misma pregunta que «La aceleración en la cima» (nivel 1) y que la Predice. En B5, «A la mitad del tiempo» y «A media altura» son de un paso. «Frena yendo a la izquierda» repite «Más rápido hacia la izquierda» y «Frena y retrocede» repite «La recta cruza el eje». Lo que el lector en frío dijo de 03 y 18 vale para toda la unidad. | Nivel 3 con varios pasos de examen: frenado con tiempo de reacción, encuentro con dos MRUV, «último segundo» con v₀ ≠ 0, la ecuación horaria con cambio de sentido y distancia recorrida. Que «La moneda» pida además el tiempo o la altura. |
| M4 | 1 | Lee de B3 `:1183-1184` y de B4 `:1593-1594` | La primera pantalla de esas dos ideas es una gráfica sola, sin el atleta ni el mototaxi. El objeto llega recién en Juega. El molde §2 pide el objeto en la primera pantalla, y Vectores ya cayó en esto (A3). | Que la tarjeta 1 use la vista `pista` o `alcance` de `fis-mruv`, con la gráfica debajo. |
| M5 | §5b; regla 4 | `plantillas/cinematica-medias/generador.js:374` (`VAR_VT`), `:497` (`VAR_EC`), `:395, 432-477` | Son los tipos que esta unidad saca (`tiposPorUnidad`), pero siguen con la paleta vieja. En `vt`: distancia y área en naranja, aceleraciones en turquesa, el tiempo en carmín y lo que se pide en verde. En `ecuacion`: x₀ en naranja y v₀ en turquesa. En la teoría, v es naranja, t turquesa, x violeta y a carmín, y no hay verde. Un alumno ve la v naranja en la teoría y el tiempo carmín en la práctica. | Pasar `VAR_VT`, `VAR_EC` y los colores de las curvas y áreas a la tabla `COLORES` de la unidad, con una prueba que la compare. |
| M6 | 13 | `cinematica-medias`, tipo `vt`/`vmax`, `:378-411` | El enunciado («Un tren parte del reposo… ¿Cuál es su rapidez máxima?») no da ni la distancia ni el tiempo: solo están en los rótulos de la figura viva (el área «192 m», en naranja). Donde no se dibuja la figura (papel, repaso, lector de pantalla con `alt` corto), no se puede resolver. | Poner la distancia y el tiempo en el enunciado. La figura los repite. |
| M7 | §5b; regla 4 | `plantillas/mruv/index.html:16, 26` (en «Más mesas del tema», `"rehacer": true`) | La escena vieja está abierta desde el tema con x azul, v carmín, a verde y t naranja. Es justo el cruce de la unidad: el carmín de a pasa a ser v, y el naranja de v pasa a ser t. La propuesta (§6) dice que se corrige «cuando vuelva a usarse», y ya se usa. | Pasar sus `--c-*` a los de la unidad, o poner en la tarjeta un aviso: «colores de otra versión». |
| M8 | 9; §7 (práctica por idea) | `app/practica.js:138, 168`; `fis-mruv/generador.js:200-210` | El generador separa sus tipos por idea (`generar(s, { idea })`), pero la app solo le pasa `{ unidad }`. Quien está en la idea 1 practica también caída libre y gráficas a–t. | Que la práctica abierta desde una idea pase `idea` (y que el repaso mezcle solo las ideas terminadas). |
| M9 | Distractores (`siFuera`) | «Ahora tú» de B6, k = 1, `:2413` | El distractor `area` vale vi·tₛ/4, la mitad de la respuesta (con v₀ = 20 m/s: 10 m contra 20 m). Su `siFuera`, «el triángulo es base por altura entre 2», describe el error contrario, que daría 40 m (que ya es `sin-medio`). | Cambiar el valor por vi·tₛ (sin ÷ 2) o el texto por «dividiste dos veces entre 2». |
| M10 | 2 (glosario), coherencia | Glosario «parábola», `:2518` | La `def` dice «cada vez más empinada. La gráfica x–t del MRUV tiene esa forma». En «Ahora tú» de B4 (k = 1) y en el generador (`forma`), «Una curva que se empina cada vez más» es el distractor G-SENTIDO cuando la combi frena. | «Curva como la de x = t²: se empina cada vez más o se aplana; la x–t del MRUV es un trozo de ella». |
| M11 | 13, decisión del 18 nov | La regla de B5 `:1994-1996` y la de B6 `:2352-2354` | La decisión pide una línea en «La regla» que traduzca el eje al «±» de la academia. B1 y B2 la tienen (mal, ver más abajo). B5 y B6 no, y es donde la academia más usa «h = v₀t ± ½gt²» («+ si baja, − si sube»). | Agregar en B6: «La academia escribe h = v₀t ± ½gt², con g positiva: − si sube, + si baja. Aquí el eje pone ese signo». |
| M12 | 10 (coherencia de medidas) | Predice de B5 `:1971` y `PAB_B5` `:1790` (ventana del 2.º piso a 5 m, techo a 6 m); ejemplo 5.3 `:1813` (la misma ventana a 3,2 m); B6 `:2126, 2301` y ejemplo 5.2 `:1806` (techo del pabellón a 5 m) | Es el mismo pabellón y la misma «ventana del segundo piso», con dos alturas en el texto, no solo en el dibujo (el lector en frío vio el dibujo). En la consigna de B6 el techo está a 5 m, y en la Predice de B5 a 6 m. | Una tabla de medidas del pabellón en la cabecera (piso de unos 3 m, ventana del 2.º piso a unos 4 m, techo a 6 m), que lean el texto y la pieza. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 10 | `:682, 822, 850`; generador `kmh-frenado` | «Frente al colegio, una combi va a 20 m/s» (72 km/h), a 54 km/h, y en la Predice de B2, a 20 m/s junto al letrero «Colegio». | Frente al colegio, hasta 10–12 m/s; las altas, «en la carretera». |
| B2 | 10 | `:1372` («Ahora tú» de B3, ciclista); `:1344` (tren); `:2038, 2051` (puente y pelota desde 125 m); `:2376, 2396` (pelota pateada a 25–30 m/s, hasta 45 m) | Ciclista a 20 m/s que frena en 2 s (a = −10 m/s²); tren a 2 m/s²; puente de 125 m; una patada que sube 45 m. | Ciclista ≤ 12 m/s con a ≥ −4 m/s²; tren ≤ 1 m/s²; puentes ≤ 80 m; «se lanza» en vez de «pateas» por encima de 20 m/s. |
| B3 | Variedad; «Así se resuelve» ≠ «Ahora tú» | «Ahora tú»: B2 s8 = Predice de B2 (20 m/s, 2 m/s² → 100 m), B4 s34 = Predice de B4 y B5 s0 = ejemplo 5.1; «Así se resuelve»: B3 y B5, semillas 1 = 3 = 7 | El generador de la práctica ya evita las Predice; la teoría no. «Otro ejemplo» repite 3 de 4 veces. | Excluir esos casos y mezclar la semilla, como en `fis-mruv`. |
| B4 | §5b | `fis-mruv.js`, vista `pista` (fondo `--c-h` y rayitas `--c-o`); `fis-combi` (tramos naranjas, cabecera de la unidad `:40`) | La pista atlética tiene el tinte carmín de la aceleración, y las marcas de posición y los tramos llevan el naranja de la velocidad (posición = violeta o tinta). | Pista en tinta tenue; marcas en tinta o violeta. |
| B5 | Notación | `:1124` («vₘₐₓ»), `:1167` («tₐ»); `movimiento-parabolico-y-circular.js:182` (y_máx) | Subíndices en Unicode, en texto plano. La altura máxima es H aquí e y_máx en Parabólico, que usa el mismo término del glosario. | `{ sub }`; una sola letra para la altura máxima en las dos unidades. |
| B6 | 9 | Predice de B5, `siFuera` de C2, `:1974` | «también cuesta más moverla»: es inercia, de Dinámica, que viene después. | «Sin aire, la Tierra le da a todo la misma aceleración». |
| B7 | Formato | Ejemplo 1.15, `:272`; papel de `fis-mruv` (8 problemas para 6 ideas, datos dentro del enunciado); `retorno`, sub altura, código `C-TIEMPO` en un error de rapidez | El único ejemplo con 4 alternativas; un papel corto; un código de error mal puesto. | Quinta alternativa; papel de 2 por idea; código `C-V0`. Los datos aparte en el papel siguen pendientes (Vectores M21). |

**Confirmo que sigue en el código lo que vio el lector en frío** (su «Se corrige» no está aplicado):
- «v = v₀ ± a·t»: la frase del «±» de B1 y B2 (`:354, 839`) no dice que en la academia a va sin signo y que aquí lo trae.
- d como desplazamiento en la regla de B2 (`:839`) y como distancia en la de B3 (`:1248`).
- Leyendas con marcas que no se ven: el escalón carmín y las rayitas naranjas (`:1204-1205`). Las rayas sin nombre de B4 y los dos vehículos encimados en el juego de B4.
- h hacia abajo con el eje «altura (m)» hacia arriba (`:1996`; `fis-mruv.js:250`).
- «0,02 s → 0,17 cm»: la lectura redondea t pero calcula con el t sin redondear (`:1964`).
- Los ejemplos 1.8 (también el 1.2, el 1.9 y «Ahora tú», k = 2, usan v = v₀ + a·t con solo a = Δv/Δt en los Datos), 2.14 (riel con «+ hacia la derecha»), 4.3 (pide la a–t y dibuja la v–t), 4.14 (sin dibujo), 5.14 (5n² − 5(n − 1)²), 6.14 (H sin su fórmula en los Datos) y 5.3 (edificio).

## Lo que está bien y hay que copiar al molde

- **Cuentas limpias y fáciles de auditar**: 278 de 278. Cada `EJEMPLOS_*` dice en su comentario qué cuentas se revisaron, y `casos.json` de `fis-mruv` describe un segundo camino (integración numérica, grilla de 1 ms).
- **`fis-mruv` es el mejor generador de física hasta ahora**:
  - `TIPOS_POR_IDEA` + `NIVEL` (1, 2 y 3 en cada idea), y llega a examen con San Marcos citado por tipo.
  - Datos con la fórmula general y la de segundo grado, sin atajos. La cabecera prohíbe tₛ = v₀/g y H = v₀²/2g, y los datos cumplen.
  - `elegirErrores`: la correcta nunca queda en el centro ni en un extremo.
  - No repite ninguna Predice de la unidad.
  - Llama al motor de `mruv` en vez de copiarlo.
- **El mapa de colores declarado en código** (`COLORES`, cada ficha con su `m`, con una prueba), y la notación declarada con su motivo (`notacion: { vectores: false, motivo }`). Es la manera de hacer cumplir §5b y §5.
- **Predice con datos de equivalencias y valores, sin fórmula**, y distractores con su código. Todos los `siFuera` empiezan por lo que el alumno hizo bien.
- **Las figuras de los ejemplos marcan solo los datos**: un lugar «Para aquí» en la distancia dada, la flecha de la aceleración dada. El caso del grifo sin regla de metros (`:207`) está razonado en el comentario.
- **«Frena hasta parar, no retrocede»**: está en el motor, en la regla, en el juego y en las mesas.
- **La migración con prueba propia** (`avance.test.js`), con sus mesas y sus palabras. Le falta el caso de A1.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Una partición que conserva el id de una idea con otra Predice reinicia la predicción guardada.** Prueba: por cada partición, cada id de opción guardado posible (los de la versión anterior) existe en la Predice nueva, o está en `reiniciaPrediccion`. Y el lector no se cae ante una opción que no existe. | Sí, si la partición declara las opciones viejas; la guarda del lector, sí. |
| **El glosario no dice la respuesta de una Predice ni de una misión.** Comparar los números y las frases de la opción correcta, del `coincide` y del `bien` con los `ejemplos`, `simple` y `def` de los términos tocables antes de ese momento (Lee, Juega, Predice, mapa). | Sí (números y n-gramas; como el chequeo de la leyenda de 4f). |
| **Toda ecuación del resuelto sale de una línea de Datos.** En particular: si la solución usa una posición inicial (y = 40 − 5t²), alguna fórmula de los Datos tiene término y₀ o x₀. | Semi (heurística sobre la forma). |
| **Una línea de Datos es equivalencia, valor, constante, definición o fórmula.** Rechazar las líneas sin «=» ni «:», con verbos de consejo («puede tener», «aquí», «recuerda»). | Sí, con una heurística. |
| **El nivel 3 no repite la cuenta de un nivel 1 o 2 de la misma idea.** Firma del resuelto: qué fórmulas usa y cuántos pasos; dos firmas iguales en niveles distintos dan aviso. | Semi. |
| **«Ahora tú» y «Así se resuelve» no repiten una Predice ni un ejemplo de la unidad** (números normalizados del enunciado), en 120 semillas. | Sí. |
| **Los colores de un generador compartido coinciden, para los tipos de esa unidad, con su `COLORES`.** También las escenas de «Más mesas del tema», o llevan un aviso. | Sí para generadores; semi para escenas (variables CSS). |
| **Un problema se resuelve sin la figura**: los números que usa la solución están en el enunciado o en los Datos. | Sí (números de la solución contra el texto). |
| **El enunciado no contradice la figura ni las medidas de la unidad**: una tabla de objetos (regla de 30 cm, pabellón, ventana) en la cabecera, que leen el texto y la pieza. | Sí, con la tabla. |
| **El `siFuera` describe el error que da su valor.** | No (revisión humana; a lo más, recalcular el error nombrado). |
| **La práctica que se abre desde una idea pasa la idea al generador** que tiene `TIPOS_POR_IDEA`. | Sí (prueba de la app). |
| **La línea del «±» en toda regla con signo** (decisión del 18 nov): si la regla tiene una ecuación con − g o con a, lleva la traducción a la academia, y esa traducción dice que en la academia a o g van sin signo. | Semi. |

## Correcciones (18 nov)

Sesión de correcciones (`docs/metodo/unidad/6-correcciones.md`), con las notas de la sesión (a) a (i). Archivos tocados:
`contenido/teoria/fisica/mruv-y-caida-libre.js` y su `.test.js`, `nucleo/kit/piezas/fis-mruv.js` y su `.test.js`,
`plantillas/fis-mruv/generador.js`, su `.test.js` y `papel.json` (regenerado con `herramientas/papel-generador.js`), los
tipos `vt` y `ecuacion` de `plantillas/cinematica-medias/generador.js` y su `.test.js`, y `plantillas/mruv/index.html`.
No toqué `app/`, `nucleo/avance.js`, `fis-combi` ni nada de MRU. Las respuestas nuevas o cambiadas se recalcularon con un
script aparte que no usa el código de la unidad (scratchpad `cor/cuentas.py`: las cuadráticas con su fórmula, la
distancia del riel integrada paso a paso, la maceta buscada por tanteo); todas cuadran. Pruebas: `npm run catalogo` y las
de la teoría, las piezas, `fis-mruv`, `cinematica-medias`, `mruv`, el catálogo y el glosario, en verde (338 de 338).
Capturas: scratchpad `cor-mruv/` (las de antes están en `aud-mruv/`).

### Alta

- **A1 (predicciones viejas de `pendiente-aceleracion`).** Fuera de mi alcance (`nucleo/avance.js`). La app ya vuelve a
  preguntar si la opción guardada no existe (`derecha`, `cero`, `sin-v0`) o si la huella de la pregunta cambió. Queda un
  caso: la `c` guardada antes de la huella (sin `prediccionDe`) dice «Coincide» a una pregunta que el alumno no vio. Hace
  falta una marca de migración que borre las guardadas sin huella. Código exacto para la sesión, en `nucleo/avance.js`:

  ```js
  // en migrar(est), después de `for (const pt of PARTICIONES) if (partir(est, pt)) cambio = true;`
  // 18 nov (auditoría de MRUV, A1): `pendiente-aceleracion` conservó su id con otra Predice (antes «¿hacia dónde apunta su
  // aceleración?», ahora el mototaxi que retrocede). Una predicción guardada sin huella (prediccionDe) es de la pregunta
  // vieja, también la «c»: se borra y la idea vuelve a preguntar. Lo demás (hecha, momento, casos) se queda.
  if (!(est.reinicioVT >= 1)) {
    est.reinicioVT = 1;
    cambio = true;
    for (const u of ['fisica.mruv-y-caida-libre', 'fisica.movimiento-rectilineo']) {
      const si = est.teoria && est.teoria[u] && est.teoria[u].ideas && est.teoria[u].ideas['pendiente-aceleracion'];
      if (si && si.prediccion && !si.prediccionDe) delete si.prediccion;
    }
  }
  ```

  Y su prueba en `nucleo/avance.test.js`:

  ```js
  test('migrar: la predicción vieja de pendiente-aceleracion (sin huella) se borra una sola vez', () => {
    const U = 'fisica.mruv-y-caida-libre';
    const est = { avanceV: 1, partidoV: 1, partidoExp: 1, partidoMRU: 1, mudadoSum: 1,
      teoria: { [U]: { ideas: { 'pendiente-aceleracion': { prediccion: 'c', hecha: true }, 'caida-libre': { prediccion: 'c' } } } } };
    assert.equal(Avance.migrar(est), true);
    assert.equal(est.teoria[U].ideas['pendiente-aceleracion'].prediccion, undefined);
    assert.equal(est.teoria[U].ideas['pendiente-aceleracion'].hecha, true);
    assert.equal(est.teoria[U].ideas['caida-libre'].prediccion, 'c', 'caida-libre no cambió de pregunta');
    est.teoria[U].ideas['pendiente-aceleracion'] = { prediccion: 'c', prediccionDe: 'x1' };
    assert.equal(Avance.migrar(est), false);
    assert.equal(est.teoria[U].ideas['pendiente-aceleracion'].prediccion, 'c', 'la respuesta nueva, con huella, se queda');
  });
  ```

  Si la partición `partidoMRU` todavía no corrió para un alumno, corre antes (el `for` de `PARTICIONES` va primero) y la
  idea ya está en la unidad nueva cuando se revisa.
- **A2 (el glosario regalaba la Predice y la misión).** Hecho, con la nota (a). «frenar»: la definición ya no dice el
  signo de a («Bajar la rapidez poco a poco; mientras no se detiene, el móvil sigue yendo hacia el mismo lado») y sus
  ejemplos son el mototaxi de 15 a 5 m/s, la bicicleta y el «no retrocede»; así «frena», en la pregunta y los Datos de la
  Predice de B1, se puede subrayar sin resolverla. «aceleración»: la moto que gana 4 m/s cada segundo en lugar de la
  combi con −3 m/s². «distancia de frenado»: el ciclista a 6 m/s con 1 m/s² (18 m) en lugar de «al doble, cuatro veces».
  «gravedad»: la Luna (unos 1,6 m/s²) y «en Juliaca y en Lima casi lo mismo» en lugar de la canica y la piedra y del
  ½ · 10 · 2². «altura máxima»: la moneda a 3 m/s (unos 45 cm), «donde deja de subir» y «v = 0 un instante», sin la
  misión (10 m/s → 5 m) ni la aceleración en la cima. De paso, «área bajo la gráfica» ya no dice «bajo el eje cuenta
  negativa» (la respuesta de la Predice de B3) y «gráfica a–t» no usa los 2 m/s² del juego de B4. Prueba nueva: ningún
  término tocable antes de predecir (los de la idea y los que aparecen en Lee, el juego y la Predice) trae lo que se
  predice ni lo que pide la misión.
- **A3 (el encuentro sin y₀).** Hecho, con la nota (b): `DB6E` agrega «Si sale desde la altura y₀: y = y₀ + v₀ · t − ½ ·
  g · t²» al ejemplo «El encuentro en el aire» y al «Ahora tú» del encuentro; el resuelto dice «piedra, y₀ = 40 m y v₀ =
  0». En el generador, `D.ly0` en los dos subtipos de `encuentro` (y en el papel p8, regenerado), con su prueba.

### Media

- **M1 (el consejo de las dos raíces).** Hecho, nota (c). La línea «puede tener dos raíces; aquí t no es negativo» salió
  de los cinco lugares y entró la fórmula general, la misma del generador (`DA.cuadratica`: con p, q y r para no chocar
  con la a). Los tres ejemplos que factorizaban (el grifo, el alcance desde atrás, la azotea) resuelven con la fórmula y
  dicen por qué la raíz negativa no sirve (sería antes de pasar, de arrancar o de lanzar); los «Ahora tú» lo dicen en su
  solución. Prueba nueva: ningún dato con «puede tener / aquí t no es», y la fórmula está donde el resuelto la usa.
- **M2 (la regla que se atrapa después de 31,25 cm).** Hecho, nota (d): `cm` sale de 5; 11,25; 24,2 y 28,8 (0,1 a 0,24 s;
  los 20 cm de la misión quedan fuera) y la figura la dibuja siempre atrapada. Con prueba.
- **M3 (niveles que no suben).** Hecho, nota (f). B2: los cuatro de nivel 3 que repetían cuentas pasan a «Con tiempo de
  reacción» (72 km/h, 0,5 s, −5 m/s² → 50 m), «Vuelve a pasar» (x = 2 + 8t − 2t², a los 4 s con −8 m/s), «Distancia en el
  riel» (la del lector, 06: ahora pide la distancia recorrida, 5 m, y justifica la vuelta con v = 0 a los 3 s) y «El último
  segundo de frenado» (1,5 m en el último de 6 s → 18 m/s). B6: «La moneda en la cima» pide además el tiempo (4 m/s →
  0,4 s; a = −10 m/s²). B5: «A media altura» y «A la mitad del tiempo» pasan a «La maceta y el letrero» (0,2 s frente a
  1,8 m → 3,2 m, con la línea h = v₀t + ½gt² en sus datos) y «Dos piedras, una tras otra» (25 m). B1: «Frena yendo a la
  izquierda» pide también cuándo se detiene (8,33 s) y «La velocidad en una ecuación» (lector, 03) pasa a un carrito en
  un riel: ¿cuándo va a 6 m/s riel abajo? (8 s). B3: «Frena y retrocede» pide la velocidad media y la rapidez media
  (1 y 2,6 m/s) en vez de repetir «La recta cruza el eje». Las letras de examen siguen repartidas (cuatro o cinco por
  idea).
- **M4 (Lee de B3 y B4 con una gráfica sola).** Hecho, nota (g): la tarjeta 1 de B3 es el atleta en la pista con su v–t
  debajo (vista `pista`); la de B4, el mototaxi en la avenida con su x–t debajo (vista `alcance`). La tarjeta 2 de B3
  dibuja el escalón carmín que nombra («sube 3 m/s en 1 s»).
- **M5 (paleta vieja en `vt` y `ecuacion`).** Hecho: `VAR_VT` y `VAR_EC` con los colores de la unidad (rapidez naranja,
  tiempo turquesa, distancia y posición violeta, aceleración carmín; lo que se pide en el color de su magnitud), también
  las curvas, áreas, puntos y la regla de arrastre de la gráfica viva. Sin verde. Prueba nueva que compara con `colores`
  de la teoría en 600 semillas. Los tipos de MRU no se tocaron.
- **M6 (vmax sin datos en el enunciado).** Hecho: «… se detiene en la otra estación, a d m, t s después de partir». La
  gráfica los repite. Con prueba. El `_datos` no cambió, así que `casos.json` sigue igual.
- **M7 (la escena vieja con colores contrarios).** Hecho: `plantillas/mruv/index.html` pasa a la paleta de las dos
  unidades del movimiento rectilíneo (x violeta, v naranja, a carmín, t turquesa, en claro y oscuro), con los tres textos
  que nombraban colores («la flecha naranja… la carmín», «en violeta», «en naranja»). Como sirve a MRU y a MRUV con la
  misma tabla, no hizo falta filtrar su papel por unidad. `v2.html` no la abre nadie y quedó igual.
- **M8 (la práctica por idea).** Ya estaba resuelto en la app: `app/practica.js` pasa `{ unidad, idea }` cuando el
  catálogo trae las ideas del generador, y `npm run catalogo` las saca de `TIPOS_POR_IDEA`. No hice nada. Queda por
  decidir (app) si el repaso mezcla solo las ideas terminadas.
- **M9 (el `siFuera` del área).** Hecho: «Pero dividiste dos veces entre 2; el triángulo, una sola vez.»
- **M10 («parábola» contra G-SENTIDO).** Hecho: «Curva como la de x = t²: se empina o se aplana. La x–t del MRUV es parte
  de una.»
- **M11 (el «±» en B5 y B6).** Hecho, nota (h), y de paso B1 y B2 (lector): la línea dice ahora que en la academia a o g
  van sin signo. B1: «La academia escribe v = v₀ ± a·t, con a sin signo», y la condición «Aquí a trae su signo». B2:
  «Δx = v₀t ± ½at², con a sin signo» (ya no d). B5: «h = v₀t ± ½gt², con g sin signo: + si baja». B6: «h = v₀t ± ½gt²:
  − si sube, + si baja», con la condición «a = −g y el eje pone el signo» (lector: «a = −g» contra «+g con un menos»).
  Prueba nueva.
- **M12 (el pabellón con dos alturas).** Hecho, nota (e): un solo pabellón en toda la unidad (`PABELLON` y `VENTANA` en la
  cabecera de B5): dos pisos de 2,5 m, techo a 5 m (la misión de B6 y el ejemplo 5.2 no cambian) y la ventana del segundo
  piso a 3,2 m (el ejemplo 5.3 ya la tenía). La Predice de B5 suelta la canica y la piedra desde 3,2 m: el «Mira» va cada
  0,2 s, 0,2 + 0,6 + 1 + 1,4 = 3,2 m, y llegan a los 0,8 s. En la pieza, con `ventana`, el alféizar de las ventanas
  dibujadas queda en la rayita (lector: la rayita a 3,2 m y la ventana dibujada a unos 5 m). Con prueba.

### Baja

- **B1.** Hecho: frente al colegio, hasta 12 m/s. La Predice de B2 pasa a «En la carretera» y sin el letrero; «El freno
  que falta» va del grifo al peaje; los ejemplos de 15 y 20 m/s, en la avenida o la carretera; «Así se resuelve» y el
  «Ahora tú» de B2 ponen el colegio solo hasta 12 m/s. En el generador, `frenado` y `kmh-frenado` dicen «En la
  carretera, una combi» por encima de 12 m/s, sin cambiar el azar.
- **B2.** Hecho: la ciclista frena con |a| ≤ 4 m/s² («Así se resuelve» y «Ahora tú» de B3); el tren, hasta 1 m/s²;
  puentes hasta 80 m en la teoría y en el generador (más alto, el borde de un acantilado); por encima de 20 m/s la
  pelota «se lanza» (ejemplos 6.10 y 6.15 y «Así se resuelve» de B6).
- **B3.** Hecho en parte: «Ahora tú» ya no repite la Predice de B2 (20 m/s con 2 m/s²) ni la de B4 (10 m/s con 2 m/s²), ni
  el ejemplo 5.1 (3 s), ni el tren del ejemplo 3.11. «Así se resuelve» de B3 y B5 tiene ahora más casos, pero sigue con
  `azar(s + 900)`: sin la mezcla de semillas del generador.
- **B4.** Hecho en `fis-mruv`: la pista en tinta tenue y sus rayitas en tinta (la leyenda de B3 dice «rayitas en la
  pista»). Pendiente en `fis-combi` (los tramos naranjas): fuera de mi alcance.
- **B5.** Hecho: «vₘₐₓ» y «tₐ» con `{ sub }`. Pendiente: una sola letra para la altura máxima en Parabólico (y_máx), que
  es otra unidad. Aquí H queda declarada como «la y de la cima» en Lee y en los resueltos (lector, 18).
- **B6.** Hecho: «Bien: la Tierra jala más a la piedra. Pero sin aire, a todo le da la misma aceleración.»
- **B7.** Hecho: quinta alternativa del ejemplo 1.15 («25 km/h», los m/s leídos como km/h) y `retorno`/altura con
  `C-VELOCIDAD` (da la rapidez cuando piden la altura) en vez de `C-TIEMPO`. Pendiente: el papel de 2 por idea
  (`herramientas/papel-generador.js` arma 8) y los datos aparte en el papel (Vectores M21).

### Lector en frío (veredicto e informes)

- «v = v₀ ± a·t» y solo «+» en la fórmula: hecho (M11).
- La letra d: hecho, nota (i). d es solo la distancia recorrida en toda la unidad (la regla de B2 dice Δx), y se declara en
  los datos de B3, en su regla y en el ejemplo del riel. Prueba nueva: ninguna «d =» con v₀t o ½.
- Leyendas con marcas que no se ven: el escalón carmín ahora se ve en Lee de B3; las rayitas dejaron de ser naranjas; en
  la regla de B4 la tangente se llama «inclinación: v» y la línea en 0 de la a–t, «mototaxi». En el juego de B4 cada
  vehículo lleva su nombre en su carril (pieza `fis-mruv`, vista `alcance`, con prueba).
- El eje de altura sube y h se mide hacia abajo (B5): la condición de la regla lo dice («h es lo que cae, medido hacia
  abajo desde donde se suelta») y la regla de B5 tiene dibujo propio con la flecha violeta h que baja de la ventana al
  patio (la pieza acepta `cota.x` y `cota.flecha`).
- «0,02 s → 0,17 cm»: hecho; la lectura calcula con el tiempo redondeado que muestra.
- B6 «a = −g» contra «+g con un menos»: hecho (M11). El «Mira» de B6 avisa que pasa a la gráfica v–t.
- Ejemplos: 02 (1.8, y también 1.2, 1.9 y «Ahora tú» k = 2) con v = v₀ + a·t en los datos; 03 rehecho (M3); 06 rehecho
  (M3, con la vuelta a los 3 s justificada y la suma 4 + 1); 10 (4.3) con la a–t vacía y su «?» debajo de la v–t; 11
  (4.8) con el paso 48 = a · 16; 12 (4.14) con los tres ejes vacíos y su «?»; 13 (5.3) con el pabellón de la unidad; 15
  (5.14) sin la n: con t, el cuadrado desarrollado en su línea; 18 (6.14, y 6.2 y 6.10) con H como la y de la cima y la
  cuenta 0 = v₀² − 2gH entera.
- Pendiente (fuera de alcance o decisión de Gerson): las etiquetas «0 s» y «1 s» pegadas en Lee de B1 y el «3 s» que no se
  ve en Lee de B2 (`fis-combi`); «Velocidad: Normal» del control de animación (app); que la Predice dé como dato el
  resultado del juego en B2 y B4 (está así a propósito: la predicción parte del juego); la pelota de la Predice de B6, que
  todavía sube; en los ejemplos con alternativas, explicar todos los distractores (hoy dos o tres); el renglón que se
  corta en 3.15 (la app); la regla de metros que sobra en 1.3 y 1.8 y la marca de 15 m en 6.8.
