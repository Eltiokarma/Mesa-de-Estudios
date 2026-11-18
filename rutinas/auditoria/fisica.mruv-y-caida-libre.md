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
