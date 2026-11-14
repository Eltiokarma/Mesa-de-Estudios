# Pendientes y traspaso

Actualizado el 14 de noviembre de 2026. La siguiente sesión empieza aquí: léelo después de `CLAUDE.md`, empezando por «Estado al 13 nov, tarde». Justo antes van lo recién hecho: la prueba de estrés de Rive (versión 0, a la espera de la cifra del celular de Gerson) y la cola de repaso.

## Cómo arrancar una sesión nueva

```bash
npm test
```

Deben pasar 8178 pruebas. El servidor tiene las suyas: `cd servidor && pip install -r requirements.txt -r requirements-dev.txt && python -m pytest -q` (83).

```bash
npm run dev
```

Abre la app en <http://localhost:4173/app/> y el Gantt editable en <http://localhost:4173/gestion/>.

```bash
bash fuentes/descargar.sh
```

Baja los PDF de Google Drive (simulacros y temarios de San Marcos), que no se versionan. Solo hace falta para clasificar preguntas.

Si hay que hacer OCR, instala tesseract en español: `apt-get install -y tesseract-ocr tesseract-ocr-spa poppler-utils`. Luego usa `herramientas/ocr_pdf.sh`.

- **Si el servidor local muere:** se reinicia con `node herramientas/servidor.js`. También hay que reiniciarlo después de cambiar `herramientas/construir-catalogo.js`, porque guarda el módulo en memoria.
- **Para verificar a mano:** Playwright y Chromium ya vienen instalados en el entorno en la nube (`require('playwright')`). Las capturas *fullPage* pierden la emulación táctil, así que lo que depende de `hover` se revisa con capturas normales.

## Prueba de estrés de Rive (versión 0), 14 nov, en `main`

**Qué hay.** Nada de la app cambió: es una página de prueba aparte.
- `app/mascotas/estres.html` y `estres.js`, junto a `probar.html`. Se abre en <https://mesa-de-estudios.vercel.app/app/mascotas/estres.html>; en local, `npm run dev` y <http://localhost:4173/app/mascotas/estres.html>. Todo se sirve desde el repo: no pide nada a la nube ni a rive.app.
- Nueve escenarios: sin Rive (línea base), 1 chica, 1 grande, 1 grande que sigue el dedo, grande + chica (el tope de la sección 6.3), dedo + chica, 2 grandes, grande + dedo + chica y 3 grandes. La chica mide 72 px, como la mascota; la grande, el ancho de la figura (hasta 320 px). Cada escenario calienta 1,5 s y mide dos ventanas de 5 s. La prueba completa dura unos dos minutos.
- **Qué mide**, por ventana: los cuadros por segundo (la media y el percentil 5), los cuadros perdidos, la peor pausa y las tareas largas. También la memoria de JavaScript, si el navegador la da (`performance.memory`). `measureUserAgentSpecificMemory` solo funciona con la página aislada (COOP/COEP), y Vercel no la sirve así.
  - Ojo con la memoria: Chrome redondea esa cifra y la actualiza poco, y no cuenta el wasm de Rive. Sirve para notar un salto grande, no para fijar el presupuesto.
- En la prueba completa, la página mueve la pelota del dedo sola, siguiendo una curva fija, para que la cifra no dependa de cómo se mueva la mano. «Probar a mano» deja arrastrarla de verdad y «Medir 5 s» agrega una fila.
- El resultado se copia o se descarga en JSON. Trae el celular que escribió Gerson, los datos del navegador (núcleos, `deviceMemory`, pantalla, `devicePixelRatio`) y los Hz de la pantalla.
- **Los `.riv` de prueba son propios.** Están en `app/mascotas/estres/`: `chica.riv` (un gatito de 10 formas, 1,6 KB), `grande.riv` (128 estrellas animadas, 98 KB, al borde del tope de 100 KB) y `dedo.riv` (una pelota con las entradas numéricas `x` e `y`, 17 KB).
  - Salen de `herramientas/estres-rive/generar.js`, que usa un escritor mínimo del formato hecho aquí (`riv.js`, con las claves públicas de rive-runtime). No hay licencia de terceros de por medio. `riv.test.js` comprueba que los archivos subidos sean los que da el generador.
  - Todos animan en bucle sin descanso: es el peor caso. En la app, Rive se pausa cuando nada se mueve.
- Para comparar runtimes, `?runtime=2.43.1` carga `app/vendor/rive-2.43.1/` (MIT, solo para esta prueba; la app sigue con la 2.50.0). Si no hay diferencia en el celular, esa carpeta se borra.

**Primera cifra, emulada (no vale como presupuesto).** Playwright con Chromium sin pantalla, como Pixel 5 (`devicePixelRatio` 2,75) y la CPU frenada por CDP. Media de cuadros por segundo; entre paréntesis, el percentil 5.

| Escenario | 2.50.0, CPU ×4 | 2.50.0, CPU ×6 | 2.43.1, CPU ×4 | 2.43.1, CPU ×6 |
| --- | --- | --- | --- | --- |
| Sin Rive | 59,8 (59,9) | 59,8 (59,5) | 59,8 (59,9) | 59,9 (59,9) |
| 1 chica | 59,8 (59,5) | 59,8 (59,8) | 59,8 (59,5) | 59,8 (59,9) |
| 1 grande | 14,2 (12) | 9 (7,7) | 13,7 (12) | 8,7 (6,1) |
| 1 dedo | 57,7 (59,5) | 31,5 (20) | 54,4 (29,9) | 31,8 (20) |
| Grande + chica | 13,2 (12) | 8,8 (6,8) | 13,2 (10) | 8,4 (7,5) |
| Dedo + chica | 48 (29,9) | 30,8 (20) | 46,3 (29,9) | 29,3 (20) |
| 2 grandes | 6,7 (6) | 4,3 (3,7) | 6,6 (5,3) | 4,2 (3,4) |
| Grande + dedo + chica | 10,3 (7,5) | 6,8 (5,5) | 10,1 (8,6) | 6,3 (5,5) |
| 3 grandes | 5,9 (4,8) | 3,9 (3,3) | 5,7 (4,7) | 3,5 (2,7) |

Lo que sugiere, como hipótesis:
- La mascota sola no cuesta nada.
- Un lienzo de unas 40 formas (el dedo) aguanta con la CPU ×4.
- Uno de 128 formas animadas a la vez se cae a 14 cuadros/s.
- 2.43.1 y 2.50.0 dan lo mismo aquí.

Por qué no vale como presupuesto: el Chromium sin pantalla dibuja el canvas por software, y frenar la CPU no imita la GPU ni la memoria de un celular. **La cifra que vale es la del celular de Gerson.** Si la grande también se cae allá, la regla 6.3 se escribe en formas animadas a la vez, no en número de lienzos.

**Qué tiene que hacer Gerson** (en su celular de 4 GB, con Chrome):
1. Abrir <https://mesa-de-estudios.vercel.app/app/mascotas/estres.html>. Cerrar las otras apps; batería por encima del 30 % y sin ahorro de energía.
2. Escribir en «Celular»: marca y modelo, memoria, versión de Chrome y batería. Si está enchufado, también anotarlo.
3. Tocar «Correr la prueba completa» y no tocar nada durante unos dos minutos. Descargar el JSON.
4. Repetir con <https://mesa-de-estudios.vercel.app/app/mascotas/estres.html?runtime=2.43.1> y descargar el segundo JSON.
5. En «Probar a mano», poner «2: dedo + chica», arrastrar la pelota y tocar «Medir 5 s» mientras arrastra. Anotar en una línea si se sintió pegada al dedo o con retraso.
6. Mandar los dos JSON y esa línea. Con eso se fija el presupuesto de la sección 6.3: cuántos lienzos, de qué tamaño, cuántas formas animadas y el umbral para pasar al respaldo SVG.

## Tabla viva (versión T), 14 nov, en `main`: para jugar (decisión 20)

**Qué es.** La tabla periódica como lugar para jugar con la información: es el juego libre que pide la regla 3 nueva («Jugar, después predecir, después ver»). La pieza no trae preguntas ni bloqueos; las predicciones de una lección (por ejemplo, el solitario de Mendeléyev) van después del juego, en la lección. Es la pieza mayor del kit de `docs/pogil-v2-rive.md` §7.3. Todavía no está enlazada desde la app ni desde ninguna escena. Se prueba en `nucleo/kit/tabla/probar.html` (`?vista=mesa`, `?lente=ei`, `?tema=oscuro`, `?semilla=7`). El diseño está en `docs/diseno.md`, «Tabla viva».

**Historia.** La primera versión de hoy era 0 % interactiva: tenía tres botones que ordenaban las cartas por el alumno. Gerson la rechazó con la decisión 20 (en esta conversación se entendió primero como «sin predicción nunca»; se corrigió al integrar con la versión de `main`, que deja la predicción después del juego).

**Qué puede hacer el alumno.**
- **Tabla:** la de la IUPAC. En el celular va plegada (grupos 1, 2 y 13 a 18), con la franja «3–12» que abre los demás. Con el celular echado entra entera.
- **Mesa:** las cartas sueltas y mezcladas, en tandas de 20, de 36 o las 118, con un botón «Mezclar».
  - Se arrastran a cualquier celda (con el dedo hay que mantenerlas 220 ms; antes, el dedo desplaza la página).
  - Soltar una carta sobre otra la mete en ese lugar y corre las demás hasta el primer hueco. Así el alumno arma filas y columnas, y también la fila por masa, a mano.
  - Sin arrastrar: tocar la carta, «Mover» y tocar el lugar. Con teclado: Enter sobre la carta de destino.
- **Lentes** (en la tabla y en la mesa): nada, masa, ionización, electronegatividad, radio, clase y estado.
  - Las cuatro numéricas llenan la carta como una barra desde cero, con un color de variable por lente.
  - Si el valor no es medido (calculado o extrapolado), la barra va rayada. Si no hay valor, la carta dice «—» y lleva el borde punteado.
  - La clase y el estado pintan la carta por familia, y el texto de la carta dice la clase exacta.
- **Comparar:** tocar una carta muestra su valor; tocar otra muestra las dos y la diferencia («Mg tiene 242 kJ/mol más que Na»). «Ver todo» abre la carta completa.

**Archivos** (en `nucleo/kit/tabla/`).
- `datos.js`: generado por `herramientas/tabla-datos.js` a partir de cinco archivos bajados (sus direcciones están en la cabecera; no se versionan).
- `arreglos.js`: la tabla plegada y la abierta. `filaZ`, `filaMasa` e `inversiones` quedan para el solitario de Mendeléyev; hoy no las usa el componente.
- `mesa.js`: la mesa, lógica pura.
- `lentes.js`: qué muestra cada carta, lógica pura.
- `tabla.js` y `tabla.css`: el componente.
- Pruebas: `datos.test.js`, `arreglos.test.js`, `mesa.test.js` y `tabla.test.js`, 35 en total.
- Medición: `herramientas/medir-tabla.js`, con `npm run dev` corriendo.

**Datos (decisión 9)** y lo que falta verificar.

| Propiedad | Fuente | Alcance | Notas |
| --- | --- | --- | --- |
| Peso atómico estándar | CIAAW 2024 | 84 elementos | Los otros 34 llevan el número másico entre corchetes (NUBASE2020) y en la lente de masa van sin barra |
| Energía de ionización | NIST ASD | Z = 1 a 108 | 98 valores medidos. El H, el Rf y el Db son calculados; Pr, Pa, Fm, Md, Sg, Bh y Hs, extrapolados. Del 109 al 118, «sin dato» |
| Electronegatividad (Pauling) | PubChem | 83 elementos | Compilación sin fuente por valor: **por verificar con Allred (1961)**. Se quitaron las estimadas: el Am al Lr (todos 1,3), y el Fr, el Po y el At, por juicio de un modelo. El Kr sale con 3,0 (en `atomo-y-tabla` no tenía valor) |
| Radio | PubChem | 99 elementos | **Es el de van der Waals, no el covalente de Cordero (2008)**, que es el que conviene para las tendencias de academia. Por verificar |
| Clase | PubChem | Z = 1 a 103 | Los semimetales no tienen una lista oficial de la IUPAC; PubChem cuenta al Po y no al At |
| Estado a 25 °C | PubChem | Z = 1 a 103 | Del 104 al 118 son predicciones, así que van con «sin dato» |
| Nombres en español | Transcritos por un modelo | 118 | Por verificar con la RSEQ |

La energía de ionización y la electronegatividad coinciden con las de `atomo-y-tabla` en Z = 1 a 36, salvo la electronegatividad del Kr. Para bajar los datos se abrieron en el entorno Default los hosts `ciaaw.org`, `www.ciaaw.org`, `iupac.org`, `physics.nist.gov` y `pubchem.ncbi.nlm.nih.gov`.

**Lo que se midió** (Playwright con Chromium sin GPU, 360 × 740, CPU frenada ×4).
- **Lectura:**
  - Casilla de 37 px en la tabla y de 41 px en la mesa.
  - Símbolo de 18 px en 700. Contraste sobre la carta: 14,2:1 en claro y 13,1:1 en oscuro.
- **Movimiento:** mediana de 60 cuadros por segundo y ningún cuadro de más de 33 ms. Se midieron 22 corridas: de la tabla a la mesa de 118, mezclar, de la mesa a la tabla, cambiar de lente, abrir y plegar, y un arrastre con el dedo.
- **Arranque (no cumple): el primer cuadro tras el toque tarda entre 33 y 250 ms (mediana de 117).** El JavaScript cuesta de 6 a 15 ms; el resto es el navegador repintando 118 cartas por software.
  - Se probó sin sombra, sin recorte, sin capas y sin los puntos de la mesa, y ninguna de esas cosas lo explica sola.
  - **Hay que medirlo en el celular**, que pinta con GPU. Si allá también pasa de 100 ms, la salida es repartir las barras en dos cuadros o dibujarlas en un solo lienzo.
- **Arrastre** (dedo simulado por CDP):
  - La carta queda en la celda soltada.
  - Un desplazamiento rápido sobre una carta no la agarra.
  - Con «Mover» y un toque, la carta llega a la celda tocada.
- **Otros:** saltos de 0 px en los controles; 0 cartas fuera de su sitio si se interrumpe; con movimiento reducido, el sodio solo pasa por su posición de partida y la de llegada.

**Lo que no cumple o no se probó.**
- **La zona táctil mide 37 px en la tabla y 41 px en la mesa, no 44.** Es una excepción declarada.
- **En tema oscuro, el borde de la carta se separa del fondo con 1,1:1.** Es el sistema de pegatinas de toda la app.
- **El arrastre no deja ver dónde se van a correr las cartas** antes de soltar: solo marca la celda de destino.
- **Con teclado no se puede llevar una carta a una celda vacía**, solo meterla delante de otra.
- **Nada se probó en un celular físico ni con un lector de pantalla real.** Lo más dudoso, por orden:
  1. si mantener 220 ms el dedo se descubre solo;
  2. el arranque;
  3. si se lee el valor de 12 px dentro de la carta.

**Lo que sigue.**
1. **Gerson la prueba en su celular:**
   - ¿se descubre cómo arrastrar?;
   - ¿se lee el valor en la carta?;
   - ¿el arranque se siente lento?;
   - ¿a qué juega el alumno sin que nadie le diga nada?
2. Verificar con su fuente la electronegatividad (Allred 1961) y el radio. Para el radio, decidir si se cambia al covalente de Cordero (2008), que pide abrir `pubs.rsc.org` o conseguir el artículo. Verificar también los nombres con la RSEQ.
3. Rehacer el solitario de Mendeléyev de §7.3 con la regla 3 nueva: primero el juego libre en la mesa y después la predicción, sobre algo que el juego todavía no mostró.

## Cola de repaso (versión R), 13 y 14 nov, en `main` (sw v175)

**Qué hay.**
- `nucleo/repaso.js` es la lógica pura, con pruebas en `nucleo/repaso.test.js`. Guarda en `est.repaso[unidad] = { desde, paso, toca, hechos, aciertos, ultimo }` y el tope del día en `est.repasoDia`.
- `app/repaso.js` es la pantalla `#/repaso`. Hay una tarjeta «Repaso de hoy» en el inicio (solo si hay algo pendiente; si no, «Tu próximo repaso: …») y una línea en Progreso.

**Reglas, decididas por Gerson el 13 nov. Las marcadas como hipótesis se ajustan con el piloto.**
- **Cuándo entra una unidad.** Cuando el alumno **termina un ejercicio** de esa unidad: una predicción de escena o de práctica, o una pregunta del simulacro. Abrirla o marcarla no cuenta. Su *día 0* es el día de ese ejercicio.
- **Intervalos (hipótesis).** 2, 7, 21 y 45 días. Un fallo o un «No sé» la devuelve a 2 días.
- **Tope (hipótesis).** 4 preguntas por día.
- **Mezcla.** Una pregunta por unidad, alternando cursos.
- **Formato.** Sin escena y sin animación. La explicación y el enlace a la unidad solo aparecen si falla.
- **De dónde salen las preguntas.** De los generadores, con semilla nueva (`repaso-<alumno>-<unidad>-<hechos>-<k>`). Nunca del banco Cuzcano ni de `catalogo/pruebas/` (regla 5).
- **«¿Qué tipo de problema es?»** Va antes de resolver, con 3 unidades del mismo curso.

**Cada pregunta es de la unidad que se repasa (decisión mía; actualizado el mismo 13 nov). Gerson tiene que confirmarla.**
- **El problema.** 38 de los 90 generadores cubren varias unidades y no cambian según la unidad. Si no se hace nada, «Conjuntos» se repasaría con un problema de porcentajes, y «Sistemas de ecuaciones» con una traza de matrices.
- **Lo que se hizo.** Se agregó `nucleo/repaso-tipos.js`, una tabla que asigna cada variante de esos generadores (`_datos.tipo`; en `quimica-conceptos`, `tema` o `conjunto`) a una unidad del catálogo.
  - El repaso prueba semillas hasta que la variante es de la unidad: hasta 400 por generador, más un segundo intento con semillas del día.
  - Así, la pregunta «¿Qué tipo de problema es?» sale siempre y nunca da por buena una etiqueta falsa.
  - Un generador también puede devolver `p.unidadCatalogo`, y ese dato manda sobre la tabla.
- **Ojo: la tabla la clasificó un modelo** leyendo un enunciado de muestra por variante. Nadie la revisó.
  - Asigné 315 variantes (en `quimica-conceptos` cuentan sus temas y conjuntos). Las dudosas quedaron fuera; por ejemplo, los trasvases no son ni juegos recreativos ni traslados.
  - `nucleo/repaso-tipos.test.js` comprueba que cada variante exista, que cada unidad sea de su generador y que cada unidad cubierta consiga un problema suyo.
- **Resultado.** 104 unidades tienen repaso. Quedan fuera las 18 de razonamiento verbal y otras 30: las que no tienen generador o cuyas variantes quedaron sin asignar.
- **Por revisar.** Una persona del proyecto debería recorrer la tabla, sobre todo `quimica-conceptos`, `rm-planteo`, `rm-ciclos` y `rm-fichas`, donde dejé más variantes fuera.

**Medición.**
- **Un evento `repaso-item` por pregunta,** con:
  - `paso`, `dias`, `atraso` y `desde`;
  - `tipoOpcion` y `tipoBien`, si hubo pregunta del tipo.
- **Un evento `repaso` por tanda.**
- **`Medicion.resumirRepaso`.** Compara el acierto del día 0 con el del repaso, por tramos de días (1–3, 4–10, 11–30, 31+), solo con pares alumno-unidad. Su informe está en `herramientas/analizar-medicion.js`.
- **Ojo:** el acierto del día 0 junta escenas y prácticas, mientras que el repaso es siempre de generador. El día 0 se cuenta en hora del Perú.

**Con cuenta.** `est.repaso` se une por unidad: gana la ficha con más `hechos`; si empatan, la del `ultimo` más reciente, y `desde` se queda con la fecha más antigua. Esa regla está en `nucleo/sesion.js` y en `servidor/app/union.py`, con prueba en pytest, y el contrato está en `docs/cuentas.md`.

**Lo que se verificó.**
- Playwright a 360 px, con el reloj del navegador fijado en hora de Lima:
  - entra a la cola con ejercicios del 10 nov y aparece el 13;
  - la unidad sin generador propio no entra;
  - la tanda corre completa: tipo, alternativa, «No sé», retroalimentación y cierre;
  - se guardan los eventos y la ficha;
  - el mismo día el inicio dice «Tu próximo repaso: domingo, 15 de noviembre», y con el reloj en el 15 vuelve la tarjeta;
  - no hay desborde horizontal ni errores de consola.
- Las pruebas de Node y de pytest pasan.

**Lo que no se verificó.**
- El paso real de los días en un celular, que solo se simuló con el reloj.
- La sincronización contra el servidor real de Railway: solo se probó la unión en pytest.
- El modo sin conexión con el service worker activo. La prueba se hizo con el SW bloqueado; los generadores ya estaban en la caché de antes.
- Un acierto dentro del navegador, que alarga el intervalo. Eso solo está cubierto por las pruebas de `nucleo/repaso.test.js`.
- Nada se probó con alumnos.

**Las 152 unidades, 14 nov (orden de Gerson).** La restricción «solo generadores» venía del encargo, no de una regla. Cada unidad saca su pregunta de una fuente que ya existe. `nucleo/repaso-tipos.test.js` exige que las 152 tengan alguna.

| Fuente | Unidades | Qué ve el alumno | Cómo se mide |
| --- | --- | --- | --- |
| Generador | 104 | Un problema con números nuevos y alternativas | Acierto medido (`correcta`) |
| Lápiz y papel de la escena (`papel.json`) | 30 | Lo resuelve en el cuaderno, ve la respuesta y los pasos, y marca «Me salió», «No me salió» o «No sé». Cada visita trae un problema distinto | **Autoevaluación** (`autoevaluacion`, sin `correcta`), aparte del acierto: `Medicion.resumirRepaso().autoevaluacion` |
| Ejercicio suelto de verbal (`contenido/razonamiento-verbal/ejercicios/`) | 6 | Uno de los 21, con alternativas, sin el paso previo. Distinto en cada visita | Acierto medido |
| Texto de lectura | 12 | El texto más corto que no leyó (ni en la práctica ni en el repaso), con una sola pregunta de la unidad. Cuenta como un ítem del día | Acierto medido |

- **Cada evento dice de dónde salió la pregunta:** `fuente` ('generador', 'papel', 'ejercicio' o 'lectura'). Los textos usados en el repaso quedan en `est.repaso[u].leidos`, que se junta al unir el estado entre equipos.
- **La pregunta del tipo** sale siempre, porque la unidad de cada pregunta es segura. Esa seguridad depende de dos tablas que **clasificó un modelo y nadie revisó todavía**, las dos en `nucleo/repaso-tipos.js`:
  - la de variantes de los generadores mixtos;
  - `PAPEL`, que asigna los problemas de las 16 escenas con varias unidades. Algunos problemas sirven a dos unidades; por ejemplo, conjuntos sirve a aritmética y a álgebra.
- **El dibujo del texto** sale de `app/lectura.js` (`LecturaVista.pintor`), sin copiarlo.

**Pendientes del repaso.**
- **Paso 4: alternativas para los problemas de papel (hecho el 14 nov: 326 preguntas en 31 escenas; gases 15, tanda A 92, tanda B 121 y tanda C 98; lo que quedó fuera, en la línea de cada tanda).** Gerson decidió una pregunta por magnitud. El formato está en `docs/papel-opciones.md`, `nucleo/papel-opciones.js` y la prueba `herramientas/papel-opciones.test.js`, que recalcula cada valor con el motor. El molde es gases (15 preguntas). Las otras 30 escenas las trabajaron tres sesiones en paralelo, con un verificador a ciegas por escena. Cada una dejó aquí su línea:
  - tanda A (física, química y álgebra): termodinamica, ondas-electromagneticas, mol-composicion, cinetica, polinomios, numeros-complejos, sucesiones, binomio-newton, conjuntos y logica;
  - tanda B (aritmética y geometría): regla-de-tres, interes, cuatro-operaciones, razonamiento-numerico, segmentos-angulos, congruencia, simetria, geometria-espacio, solidos y razonamiento-figuras;
  - tanda C (trigonometría y razonamiento matemático): cinta-radio, circunferencia-trig, geometria-analitica, transformaciones-trig, conicas, trazos-rutas, cuadricula-piezas, rutas-espacio, papel-doblado y orden-informacion.
  - **Tanda B hecha (14 nov):** 121 preguntas en sus 10 escenas, cada escena revisada a ciegas antes de su commit. Por escena: regla-de-tres 15, interes 15, cuatro-operaciones 9, razonamiento-numerico 10, segmentos-angulos 12, congruencia 10, simetria 11, geometria-espacio 8, solidos 20 y razonamiento-figuras 11. Ocho motores recibieron funciones o campos de error chicos, con su caso verificado aparte en Python. Quedaron fuera, porque el motor no calcula dos errores honestos:
    - interes p10 (vencimiento común);
    - cuatro-operaciones p9 (X + Y + Z);
    - razonamiento-numerico p9 (suma de esquinas);
    - congruencia p3 (escalera) y p4 (correspondencia, sin coordenadas en el enunciado);
    - simetria p8 (dos reflexiones), la distancia de p4 y «qué polígono tiene centro» de p7;
    - geometria-espacio p9 (el triedro, que es un sí o un no), el ángulo de p1 y la diagonal de p3;
    - solidos p9 (Euler), además de algunas magnitudes de p5, p6, p7 y p10;
    - regla-de-tres p2b y el sentido de giro de p10.

    Congruencia p7 y p10 preguntan solo una parte del problema: la base media de 9 en lugar del perímetro, y el caso b. Los respaldos casi todos son hipótesis. Los códigos de geometría-espacio y razonamiento-numérico no tienen número en sus informes.
  - **Tanda A hecha (14 nov):** 92 preguntas en sus 10 escenas, cada escena revisada a ciegas antes de su commit. Por escena: termodinamica 14, ondas-electromagneticas 5, mol-composicion 7, cinetica 13, polinomios 14, numeros-complejos 11, sucesiones 8, binomio-newton 8, conjuntos 7 y logica 5. Dos motores recibieron campos chicos, con su caso recalculado a mano por un subagente que no leyó el motor: mol-composicion (`masaInvertida`, `unAtomo` y `ponderado`) y cinetica (`regla10` con el tiempo de partida). Quedaron fuera:
    - las magnitudes que valen 0 (W isocórico, Q adiabático, ΔU isotérmico), porque no tienen escala;
    - las que no se leen sin notación científica: frecuencias, campos y energías en J de ondas-electromagneticas, y átomos y moléculas de mol-composicion;
    - las que no tienen dos errores del motor dentro de 1/20 a 20 veces la correcta, como C(8, 5), la suma de coeficientes de (3x − 2)⁵ y el COP de Carnot.

    Ojo: un valor de texto no pasa por la regla de escala. En binomio-newton, las respuestas que son números van por `num`, para que sí pasen.
  - **Tanda C hecha (14 nov):** 98 preguntas en sus 10 escenas, cada escena revisada a ciegas antes de su commit (o justo después, con los arreglos subidos en seguida). Por escena: cinta-radio 10, circunferencia-trig 9, geometria-analitica 8, transformaciones-trig 9, conicas 19, trazos-rutas 10, cuadricula-piezas 8, rutas-espacio 9, papel-doblado 9 y orden-informacion 7. Casi todos los errores salen de los campos `errores` que ya traían los motores; el único cambio de motor es `exTexto` de transformaciones-trig, que ahora escribe −(1 + √3) con paréntesis (caso nuevo en `casos.json`). Respaldos casi todos hipótesis; los TR, GE, G2 y AR18 que se parecen a uno documentado van como parcial. Quedaron fuera:
    - cinta-radio p2, p4, p5 y los radianes de p1: «grados como radianes» da unas 57 veces la correcta, fuera de escala, y no queda un segundo error honesto;
    - circunferencia-trig p4, p6 (sumas de razones sin una sola llamada), p8 (lista de ángulos), p10 y cos 135° de p5 (sus errores se escriben igual);
    - geometria-analitica p2 y p7 (el motor no saca B ni k), el radio de p10 y las ecuaciones de p5 y p6;
    - transformaciones-trig p6 (`simplificar` no trae errores); p3 y p7 preguntan una parte (2 sen 105° cos 15° y el k);
    - conicas: directriz, vértices de p8, tipo de p10 y la excentricidad de p6;
    - trazos-rutas p1 (respuesta de sí o no); cuadricula-piezas p2 (los errores los calcula el index.html), p5 (12 + 10π) y los trozos de p3;
    - rutas-espacio p8; papel-doblado p3 (una forma), p6, p7 y p9; orden-informacion p2, p3, p6 y p8.

    Ojo: en rutas-espacio p10 las coordenadas de los nodos dan una arista lateral de √24 y no de 5 (el cálculo usa los pesos, así que la respuesta no cambia); si algún dibujo sale de esas coordenadas, no cuadra con el enunciado. conicas y geometria-analitica tienen las respuestas en texto («(±5; 0)», «√5»), así que no pasan por la regla de escala.
- **Revisar las dos tablas de `nucleo/repaso-tipos.js`**, que las clasificó un modelo.
- **La pregunta de seguridad (versión S).** Va después de la versión A de MRU y necesita diseño aprobado. No se empezó.
- **Una unidad entra a la cola por los eventos que registran las escenas.** Si una escena de varias unidades anota siempre su unidad principal, las demás unidades no entran por esa escena.
- ~~Que el profesor vea el repaso de su sección en su panel.~~ **Hecho:** `GET /api/secciones/{id}/avance` trae `repaso { unidades, hechos, aciertos, ultimo }` y el panel tiene la columna «Repaso».
  - Se probó con la API simulada en Playwright, no contra Railway.
  - En el celular, la tabla se desplaza de costado: la columna queda a la derecha.

**Lo que no se verificó del repaso.**
- El paso real de los días en un celular: se simuló con el reloj del navegador.
- La sincronización contra Railway: solo se probaron la unión en pytest y la API simulada.
- El modo sin conexión con el service worker activo, para el papel, los textos y los generadores.
- Un acierto en el navegador que alargue el intervalo. Eso lo cubren las pruebas de `nucleo/repaso.test.js`.
- Nada se probó con alumnos.

## Estado al 13 nov, tarde: auditoría POGIL v2 y decisiones (léelo primero)

Sesión de **planificación**: no se construyó nada de la app. Lo que sigue se construye en conversaciones nuevas.

**Qué hay.**
- **`docs/pogil-v2-rive.md`:** auditoría de las 99 escenas en pantalla de celular y dirección. **Para arrancar basta leer la sección 0 (estrategia final) y la 7.5 (MRU y MRUV, la primera unidad).** El resto es el detalle y el porqué.
- **`docs/temario-completo.md`:** las 152 unidades con los temas del catálogo, ruta, gesto, tramo y campos abiertos (otras formas de explicarla, desempeño final, prerrequisitos). Es la copia de trabajo de Gerson para investigar y ampliar.
- **`docs/formato-lectura.md`:** regla corregida de «lo dice» contra «se deduce». Las sondas ya publicadas se revisaron con ella el 14 nov (`docs/investigacion/revision-sondas-clasificar.md`).

**Lo que se midió.**
- En 72 de las 99 escenas el alumno no toca la figura: pulsa «Siguiente» o jala un deslizador.
- La figura y el botón «Siguiente» caben juntos en el celular en 1 de 63 escenas.
- En física y química, solo 5 de 40 unidades tienen algo que se arrastra.

**Decisiones de Gerson (13 nov).**
1. Rive no se usa por unidad: un catálogo cerrado de unos 15 archivos (mascota, 8 objetos de utilería, 3 personajes y 3 piezas de interfaz). Lo que se mide lo dibuja el motor.
2. No todo se enseña con POGIL: cinco rutas (descubrir, seguir un ejemplo, comparar, recordar y argumentar), una principal y una de apoyo por unidad.
3. Materia, tabla periódica y enlace quedan rediseñadas (secciones 7.2 a 7.4 de la auditoría). La tabla periódica es una pieza mayor del kit, no un archivo de Rive.
4. Razonamiento matemático: más de una forma de explicar cada unidad (sección 5.6).
5. La regla de lectura cambia: la frontera no es la paráfrasis. **Hecho** en el documento.
6. Se agrega la pregunta «¿Qué tan seguro estás?» y una regla para ajustar la ayuda (sección 5.8). **Planeado.**
7. Se empieza a construir, en otras conversaciones.
8. La pregunta de seguridad va en la **prueba de entrada y en los ejercicios**; en la prueba de salida, no.
9. La tabla periódica llega hasta el último elemento con información completa en la IUPAC o en fuentes científicas verificables. Donde una propiedad no tiene valor medido, la casilla dice «sin dato»; no se estima.
10. Al piloto entran 3.º, 4.º y 5.º de secundaria. Por grado, todo el catálogo queda dentro: 73 unidades de 3.º, 40 de 4.º y 39 de 5.º.
11. **La primera unidad con el formato nuevo es MRU y MRUV** (sección 7.5 de la auditoría). Ácidos y bases, que es de 5.º, queda para después.
12. **Todas las unidades entran al piloto con el formato nuevo.** Los tres niveles de la auditoría (formato, gesto y utilería; sección 9) son el orden de trabajo, no un recorte.
13. **Los archivos de Rive se hacen con un MCP y con IA generativa.** Igual pasan por el contrato, el peso, la prueba de fidelidad y el respaldo SVG.
14. Gerson revisa la columna «Ruta» del temario. Se probará en celular real. Lo demás queda por verse.
15. **Presupuesto:** tres planes de IA de 200 USD al mes durante tres meses, hasta el despliegue. El costo no es motivo para recortar (ver «Presupuesto y mentalidad» más abajo).
16. **Dos avisos que el agente le hace a Gerson** (sección 0 de la auditoría): cuando una unidad necesita un objeto dibujado, pide la lista de vectores con su encargo y Gerson los hace; cuando hace falta Rive de pago, pide la suscripción. No improvisa ninguna de las dos cosas.
17. **Van a entrar más de 10 000 ejercicios, no 7000.** La filosofía es la de la regla 5: los de academia inspiran y se replican con generadores propios; los de examen oficial se usan tal cual y se citan.
18. **El banco Cuzcano ya está contado, unificado y asignado** (`docs/clasificacion/banco-cuzcano.md`): 12 361 fichas en la rama `banco/cuzcano`, todas de academia (sus enunciados no van al producto). Las 3 357 etiquetas de subtema y las 1 642 fichas sin etiqueta quedaron en 1 004 subtemas, cada uno con su unidad del catálogo (`subtemas.json`, `temas.json` y `herramientas/unificar-subtemas.js` en esa rama; la importación lo aplica sola). Mirando por subtema, el banco cubre 128 de las 152 unidades. **Sin fichas quedan 24:** las 18 de razonamiento verbal, «Materia y energía», «Las cuatro operaciones», «Lógica, conjuntos y juegos lógicos» de álgebra (la cubren las fichas de aritmética), «Reducción al primer cuadrante», «Trazos de figuras y perímetros» y «Movimiento y comparación de figuras»; otras 12 tienen menos de 10 fichas. La clasificación la hizo un modelo sobre etiquetas y títulos y nadie la revisó. Respuestas de Gerson (13 nov): **(a)** no se toca el validador a ciegas: antes, un subagente valida esas fichas, empezando por las 894 que hoy quedan sin `unidad` porque su subtema es de otro curso (que la unidad propuesta sea la correcta, leyendo el enunciado); **(b)** edades y móviles (100 fichas de razonamiento matemático, hoy en planteo de ecuaciones) se anotan como de los dos cursos, razonamiento matemático y aritmética; **(c)** el reparto de recta y cónicas entre geometría analítica y las dos unidades de trigonometría queda como está. **Hecho (a) y (b) el 14 nov** en la rama: el validador acepta una unidad de otro curso (decisión de Gerson), las 894 fichas tienen unidad revisada por modelo (815 correctas, 32 cambiadas y 47 dudosas `por-revisar`), y edades y móviles van también a aritmética · razonamiento numérico (`unidades_tambien`). Detalle en `docs/clasificacion/banco-cuzcano.md`. **Ojo al integrar la rama:** su `CLAUDE.md` trae una regla 5 vieja («Todo lo ajeno va citado», que deja mostrar fichas de academia); manda la de `main`. **Hecho el 13 nov, tarde, en la rama:** el vocabulario de las 23 unidades de física y química que usan deslizador (sin MRU y MRUV, que va aparte). Un modelo revisó 3024 fichas: 27 cambian de unidad, 22 dudosas toman la alternativa, 36 rotas quedan marcadas, 155 cambian de subtema y hay 4 subtemas nuevos. Todo por modelo y por revisar por una persona. Detalle en `docs/clasificacion/banco-cuzcano.md`. Falta decidir de dónde salen los ejercicios de las unidades vacías y revisar el vocabulario de las demás unidades a medida que se construyan.
19. **Regla para todos los cursos (Gerson, 14 nov): la confianza de dominar cada magnitud importa.** Un problema con varias magnitudes (W y ΔU, P y n, x y v) se pregunta magnitud por magnitud, una pregunta por cada una, aunque la práctica o el repaso se alarguen: así el alumno sabe qué domina y qué no. Además, el alumno puede pedir más preguntas de la misma magnitud si quiere afianzarla (opcional, nunca obligatorio). Vale para el repaso (paso 4: alternativas del papel), la práctica, los generadores y las lecciones nuevas. La medición registra el acierto por magnitud, no solo por problema.
20. **Regla obligatoria (Gerson, 14 nov): el alumno juega con la simulación antes de cualquier pregunta, aunque sea una predicción.** Cambia la regla 3 de `CLAUDE.md` (ya actualizada) y el molde de la sección 7.5: cada parte empieza con un juego libre sin preguntas (botón «Ya jugué: seguir») y la predicción va después, sobre algo que el juego todavía no mostró (por ejemplo, en el juego libre de la pelota no se ve la flecha de g; se ve después de predecir C1). Aplicada en la versión A de MRU el 14 nov. Toda escena nueva o migrada la cumple; las 99 de hoy no, y entran en la capa «formato» de la sección 9 de la auditoría.
    - **Física, hecho el 14 nov** (21 escenas, todas menos mruv; un commit por escena, verificado por un modelo con Playwright a 360 × 720 y movimiento reducido): cada modo abre en un juego libre sin lo que se pregunta (cuerda, rampa, cañón, disco, satélite, sensor, imán, carga de prueba, vela, objeto…) y JugarPrimero vela la guía hasta «Ya jugué: seguir». En choques, energía, dinámica y estática basta jugar en un modo; en termodinámica, fluidos y calorimetría cada experimento de «¿Qué pasa si…?» trae su propio juego; en las demás, uno por modo. **Flojos (piden utilería dibujada, no se improvisó):** magnetismo (solo ubicar v y B en 3D), calorimetría («Toco el metal», «Juliaca», paso 1 de Transferencia). Andamiaje que deja ver un caso cercano: vasos comunicantes con ramas iguales (fluidos), el émbolo libre que sube (termodinámica), el caso del resorte que se puede armar en choques. No probado: arrastre real con el dedo en celular físico, lector de pantalla, tema oscuro en todas.
    - **Aritmética y razonamiento matemático (14 nov, sesión jugar-primero):** las 28 escenas encargadas ya montan `JugarPrimero` en los dos modos y salieron de `herramientas/jugar-primero-pendientes.json`: conjuntos, cuatro-operaciones, divisores, fracciones, interes, logica, mezclas, numeracion, potenciacion, probabilidad-dados, razonamiento-numerico, regla-de-tres, arreglos-giros, cortes-pesadas, cuadricula-piezas, cubitos-pintados, dados-domino, maximos-minimos, orden-informacion, papel-doblado, relojes-calendarios, rodamientos, rutas-espacio, sucesiones, tablas-graficos, traslados-sucesos, trazos-rutas y vistas-cubitos. Patrón: zona de juego = `.bench`, velada = `.guide` entera (un toque sobre algo `inert` cae al ancestro), barra arriba en pantalla grande (`.mode > .jugar-barra{order:-1}`); si el paso 1 ya era «Explora» se juega con él, si no, juego libre con un caso que no se pregunta y `go(S.step)`/`ir(S.k)` al seguir. Verificado por un modelo con Playwright a 360 × 720 y movimiento reducido (al cargar, ninguna opción ni «Siguiente» se toca ni se enfoca; después, cada modo se recorre entero sin errores). Sin verificar: pantalla grande y tema oscuro. Pendiente de decidir: en relojes el juego deja ver que el horario avanza; en interes el juego del modo 1 muestra S/ 1300 (lo mismo que ya muestra el paso 2); en traslados-sucesos el juego son las monedas, no las pastillas del paso 1 (hacer jugable la línea de tiempo queda para el rediseño).
    - **Álgebra, trigonometría y geometría, hecho el 14 nov** (29 escenas, un commit por escena o por dos parecidas; verificado por un modelo con Playwright a 360 × 720 y movimiento reducido: al cargar no se toca ni se enfoca nada de la guía, tampoco abriendo por `#que-pasa-si`; después cada modo se recorre entero sin errores de consola). Molde: `triangulo-estira` (arrastrar A; en el modo 2, triángulo libre solo con el área). Si el paso 1 ya se jugaba se usa ese (cuadrado-crece, exponenciales, grafica-perillas, matrices, traductor, caso-ambiguo, cinta-radio, conicas, identidades, transformaciones, ampliadora, angulo-inscrito, geometria-espacio, poligonos, solidos); si el paso 1 ya preguntaba, juego libre y `go(0)` al seguir (binomio: un camino en el tablero sin números; complejos: la flecha de z; reales: dos puntos en la recta; polinomios: la curva y P(a); programación lineal: un plan (x; y) que se arrastra, control nuevo; circunferencia-trig: P solo en el primer cuadrante; polares: un barco en el radar; inversas: la recta y = k sin marcar cortes; congruencia: armador de dos ángulos y el lado; analítica: un punto P con sus coordenadas; segmentos-angulos, simetria sin la letra F, razonamiento-figuras con las piezas de «Arma tú»). En el modo 2, el juego libre reemplaza al dibujo del experimento hasta «Ya jugué» y luego `ir(S.k)`; solidos también vela su modo 3 (vaso que se llena). **No hecho:** nada; no se pidieron vectores. Durante la tanda, `nucleo/sesion.test.js` («tandas de 500», 0 !== 500) falló una vez con unas seis suites a la vez; sola pasa y la sesión padre no lo reprodujo con carga: sin causa confirmada. No probado: celular físico, pantalla grande, tema oscuro y lector de pantalla.
    - **Química, hecho el 14 nov** (las 20 escenas, un commit por escena; verificado por un modelo con Playwright a 360 × 720, con y sin movimiento reducido: al cargar no se toca ni se enfoca nada de la guía, después cada modo se recorre entero sin errores de consola). Molde: `gases` (arrastrar el émbolo y la válvula a temperatura fija). Cada modo abre en un juego libre en el `.bench` con alternativa por botones de 44 px y flechas, y `JugarPrimero` vela los hijos de `.guide` (la barra queda dentro de la guía y no rompe la grilla de pantalla grande). Juegos: ácidos y bases (echar HCl o sal, sin escala de pH), soluciones (echar sal a volumen fijo), equilibrio y cinética (poner A y B en una caja quieta; cinética también en «Mecanismos»), celda galvánica (cambiar láminas con el alambre abierto), átomo y tabla (tocar casillas y ver el átomo neutro; sin iones ni el mapa; la tabla viva de `nucleo/kit/tabla/` no se enlazó), enlace (girar el PCl₅), molécula grande (tocar átomos de la capsaicina, sin lupas; también en «Explorar»), hidrocarburos (alargar la cadena recta), funciones orgánicas (cambiar el grupo de punta), balance (poner moléculas del metano sin decir si balancea), limitante (poner CO y O₂ en una caja que no reacciona), mol (pesar cobre en la balanza con la lupa tapada), rendimiento (echar zinc impuro, sin reacción), nomenclatura (poner Ca²⁺ y Cl⁻ sin sumar cargas), biomoléculas (piezas que no se unen), líquidos y sólidos (tapar y destapar el frasco a 25 °C), materia y energía (echar agua en la balanza), química ambiental (meter CH₄ y O₂ sin encender). **Flojos, para el rediseño:** equilibrio y cinética (una caja quieta: cualquier caja que reaccione ya respondería la predicción del equilibrio dinámico). **No hecho:** nada; no se pidieron vectores. **Ya estaba mal, sin tocar:** en limitante, «¿Qué pasa si…?», la respuesta equivocada muestra «; mira la escena para ver por qué.» sin explicación (gases tiene la misma plantilla de texto); en nomenclatura, el párrafo `#libre` del modo 2 repite una oración. No probado: celular físico, lector de pantalla, tema oscuro en todas; en átomo y tabla y molécula grande los toques sobre el lienzo son menores de 44 px (la alternativa son los botones).

**Lo que sigue, en orden** (detalle en la sección 9 de la auditoría).
1. **Estrés de Rive:** una página de prueba en el celular de 4 GB para fijar el presupuesto real.
2. **Versión A:** MRU y MRUV con los cinco tiempos y el gesto de soltar, sin Rive (sección 7.5). Es el molde para las demás. **Construida el 14 nov, en `main`, sin probar con alumnos ni en un celular físico:** `plantillas/mruv/v2.html` (aparte de la escena publicada; `?sesion=2` y `?sesion=3` abren las otras sesiones), la lógica en `plantillas/mruv/leccion.js` y dos piezas nuevas del kit, `pista` y `torre`, con prueba de fidelidad (1 px). La pieza `ejes` suma la opción `compacto`.
   - Sesión 1: empujar (gesto de soltar, rapidez ajustada a 2, 4 o 6 m/s, con botones), dos carritos (alcance, cruce y nunca, con bandera y K1) y pisar (acelerador y freno mantenidos, K3).
   - Sesión 2: pintar con el dedo el área bajo v-t de la corrida propia (guardada en el celular al cerrar la sesión 1; si no está, una de ejemplo).
   - Sesión 3: la torre (lanzar, C1; dos masas, C2), un problema resuelto en la línea de tiempo con un paso por elegir y uno solo con alternativas del motor (G4, sin-mitad, solo-constante). Los tres problemas son propios.
   - Falta: el carrito de Gerson (encargo, sección 9), la prueba con cinco alumnos y el guion de la sección 9, medir en el celular de 4 GB, el umbral del empujón (hipótesis), enlazarla desde la app y, con su visto bueno, reemplazar la escena de hoy. Del banco: la trampa K1 directa casi no aparece (2 de 241 fichas); la escena la trabaja igual. En pantallas de 640 px de alto el aviso queda bajo la barra y hay que desplazarse.
3. **Versión B:** la misma unidad con utilería de Rive, para comparar.
4. **En paralelo, sin depender de lo anterior:**
   - ~~la cola de repaso~~ (hecha el 13 nov: ver «Cola de repaso (versión R)» arriba);
   - ~~la tabla plegada en el celular (primer paso de la tabla viva)~~ (hecha el 14 nov y rehecha para jugar con la regla 20: ver «Tabla viva (versión T)» arriba);
   - ~~revisar las sondas de `clasificar` con la regla nueva~~ (hecho el 14 nov: eran 54 textos y 56 sondas, no 24. Tres subagentes las clasificaron a ciegas y ninguna cambia de clase. Se reescribieron 29 explicaciones de 18 textos que justificaban por las palabras («no lo dice con esas palabras») o por juntar oraciones, y otro subagente las revisó a ciegas. Todo es por modelo y queda por revisar por una persona. Detalle en `docs/investigacion/revision-sondas-clasificar.md`. Queda por mirar t057/p5, que el revisor leyó como «lo dice» por la oración 10, en figurado);
   - validar con un subagente las fichas del banco Cuzcano (decisión 18): ~~las 894 sin `unidad`, el validador y edades y móviles~~ (hecho el 14 nov); ~~el vocabulario de las 23 unidades de física y química con deslizador~~ (hecho el 13 nov, tarde); MRU y MRUV va en otra conversación.
5. **Después:** la pregunta de seguridad, el avance en cuatro niveles y los ocho puentes (una unidad por curso con su ficha completa).

**Preguntas abiertas para Gerson.**
- **La asignación de rutas.** La columna «Ruta» de `docs/temario-completo.md` es una propuesta hecha con el nombre y los temas de cada unidad. Le falta: que Gerson la revise, contrastarla con el informe de ideas erróneas de cada tema (solo se hizo en materia, tabla periódica y enlace) y probarla con alumnos. No hace falta cerrar las 152: basta decidir la ruta de las unidades que se van a construir. Las más dudosas: estructura atómica, hidrocarburos, recursos y ambiente (química); ondas electromagnéticas (física); combinatoria (aritmética); productos notables (álgebra); identidades y arcos compuestos (trigonometría); y todo razonamiento verbal, que no tiene escenas.
- **En qué orden se convierten las unidades** después de MRU y MRUV. Propuesta: primero las 24 de física y química que hoy usan deslizador, que es donde más se nota.
- **La investigación externa ya llegó** (13 nov) y está resumida en `docs/investigacion/verificacion-pogil-v2.md`. Sus correcciones ya están aplicadas en la auditoría y en `docs/formato-lectura.md`. Falta:
  - que alguien del proyecto abra las fuentes antes de pasar cifras al fundacional;
  - revisar cómo citan a Sinha y Kapur `docs/investigacion/brilliant.md` y la visión (el g = 0,36 es de todo el metaanálisis, no solo de secundaria);
  - revisar en el fundacional la frase sobre simulaciones: los efectos 0,62 y 0,60 de D'Angelo no se suman;
  - renombrar la «confianza calibrada» a «acierto sobre lo intentado» en `nucleo/medicion.js` y en el reporte.
- **El plan de Rive:** el gratis sí exporta, con la pantalla de inicio de Rive; Cadet (108 USD al año por asiento) la quita. Decidir si se paga.

**Ramas que no están en `main`.**
- `banco/cuzcano`: las 12 361 fichas con los subtemas unificados (`contenido/ejercicios/cuzcano/`, `herramientas/unificar-subtemas.js` y sus pruebas). No se publica mientras la app no lo lea.
- `prototipo/cual-pesa-mas`: un calentamiento estilo Peak en `juegos/cual-pesa-mas/` (motor con pruebas, animación sin librerías). Sirve de base para la ruta «recordar». No está enlazado desde la app.

**Lo que no se verificó.**
- Nada se probó con alumnos ni en un celular físico.
- Las fuentes de las dos opiniones externas (ChatGPT) no se pudieron abrir: quedan por verificar antes de pasar al fundacional.
- Las relaciones de la columna «lo que descubre» no se contrastaron con los informes de ideas erróneas, salvo en materia, tabla periódica y enlace.
- Desde el entorno en la nube están bloqueados `rive.app` y `releases.rive.app`: para probar la línea de comandos de Rive hay que permitirlos en la red del entorno.

## Estado al 13 nov: rediseño «escena viva»

Rama `claude/hopeful-planck-h4701c` (no está en `main` todavía; sw v160). Se hizo con tres rutinas en paralelo (el máximo) y la integración del coordinador. `npm test` en verde.

**Qué hay.**
- **Contrato:** `docs/escena-viva.md`. Incluye el diagnóstico medido, las reglas del ejercicio vivo, los topes de texto (enunciado 40, paso 14 y error 20 palabras), el formato `escena`/`pasos`/`fantasmas`/`respuesta`, el kit y la mascota. Manda sobre todo lo nuevo.
- **Kit:** `nucleo/kit/` (trazo, línea de tiempo y la pieza `barra-porcentaje`). La receta para agregar una pieza está en el reporte del kit, resumida en `docs/escena-viva.md` §5.
- **Prototipo:** `porcentajes-sucesivos` 0.2.0. Se responde arrastrando una marca, el error se dibuja como fantasma y la solución se recorre con un cursor de pasos. Los otros 89 generadores siguen con el formato de siempre hasta migrarlos.
- **Mascota:**
  - `nucleo/mascota.js` y `app/mascotas/` (registro por curso, el gato como respaldo con 8 poses);
  - runtime de Rive en `app/vendor/rive/` (MIT, 2.50.0), que solo se baja si hay un `.riv`;
  - página de prueba en `app/mascotas/probar.html`;
  - encargo de vectores en `docs/encargo-vectores.md`.
- **Tanda de 7000:**
  - plan en `docs/ejercicios-7000.md`;
  - esquema y ejemplos en `contenido/ejercicios/`;
  - validador `herramientas/validar-ejercicios.js` (`--validar`, `--contar` y `--auditar`).
  
  La auditoría dio que 0 de 90 generadores cumplen los topes de texto. Lo que más falla son los pasos y las explicaciones de error.

**Lo que sigue, en orden.**
1. Gerson prueba la práctica de porcentajes en un celular real y decide si el patrón sirve antes de escalarlo.
2. Gerson pasa el vector y el `.riv` de la mascota (contrato: máquina `Mesa`, entradas `pose` 0–7 y `reducido`) y lo prueba en `probar.html`. Falta ver un `.riv` real cambiando de pose.
3. Gerson contesta las 3 preguntas de `docs/ejercicios-7000.md` antes de mandar la tanda: formato y origen, tope de gasto y qué entra al piloto.
4. Piezas siguientes, por cobertura: `recta`, `balanza`, `flechas`, `triangulo` y `ejes`. El orden de migración de generadores está en `docs/ejercicios-7000.md`, con `quimica-conceptos` y `rm-certezas` primero.
5. Las escenas grandes (MRUV y las demás) también pasan a la línea de tiempo. En MRUV hay que sacar el dato de Beichner que ve el alumno y poner la explicación junto a la gráfica.

**Avance del 13 nov, segunda vuelta (en `main`, sw v164).**
- **Piezas del kit:** `recta`, `ejes`, `balanza`, `flechas` y `triangulo`, más `barra-porcentaje`. La API de cada una está en el comentario de cabecera de su archivo, y `nucleo/kit/piezas/probar-viva.js` revisa los generadores migrados.
- **Generadores migrados:**
  - completos y dentro del presupuesto: `porcentajes-sucesivos`, `rm-balanzas`, `vectores-ley-cosenos`, `vectores-poligono`, `vectores-componentes`, `inecuaciones-planteo`, `fracciones-problemas` y `velocidad-relativa`;
  - a medias: `trig-angulos-verticales`, `porcentajes-planteo` y `sistemas-ecuaciones`;
  - por hacer: `ejes`, que no usa ningún generador todavía (`cinematica-medias`, `impulso-grafica`, `funciones-dominio-rango`), y `geo-triangulos-notables`, `vectores-unitario` y `rm-planteo`.
- **Tono (pedido de Gerson):** `herramientas/pasada-tono.py` limpió 98 escenas, sin «Elegiste», sin «La correcta está marcada» y sin el texto del error en rojo, y `herramientas/tono.test.js` lo vigila. Los párrafos `.fuente` quedan ocultos al alumno. La escena de vectores lleva î, ĵ y un título neutro.
- **Tanda de 7000:** el cortador `herramientas/cortar-ejercicios.js` lee PDF (también a dos columnas), HTML y texto. Las decisiones de Gerson están en `docs/ejercicios-7000.md`.

**Página del curso (13 nov, en `main`).**
- La página del curso y la de la unidad están rediseñadas (`docs/diseno.md`, «Página del curso y de la unidad»).
- Las 152 unidades de los 8 cursos tienen su dibujo (`app/dibujos/`; la prueba de `app/app.test.js` exige uno por unidad).
- **Dibujos que quedaron flojos**, para revisar con alumnos:
  - en geometría, seis unidades son triángulos que se distinguen por un detalle, que a 64 px pierde fuerza;
  - en razonamiento matemático, trazos, tablas y gráficos, y recreativos;
  - en química, la tabla periódica y electroquímica a 64 px;
  - en álgebra se parecen cuadráticas, polinomiales y polinomios, y también exponentes y factorización.
  - **Nadie de afuera los miró todavía:** probar con alumnos «¿de qué trata esta unidad?».
- **Pendiente para el servidor:** una ruta para que el profesor lea las preguntas de su sección (por ejemplo `GET /api/secciones/<id>/preguntas`, filtrando `tipo == 'pregunta'`) y su vista en el panel. Hoy solo salen en la descarga de eventos.
- **Exámenes:** las unidades sin generador muestran un estado vacío. Son las 18 de verbal y 21 de los demás cursos.

**Pendientes de la segunda vuelta.**
- ~~Quedan unas 60 frases de investigación a la vista del alumno.~~ Hecho el 13 nov (rutina tono-escenas): 95 frases quitadas y 12 reescritas en 16 escenas. `herramientas/tono.test.js` vigila también las citas escritas a mano. En 5 escenas (átomo, biomoléculas, enlace, química ambiental, líquidos) el recorrido no llegó a todas las predicciones; ahí la garantía es la prueba.
- `inecuaciones-planteo` (subtipo de los ciclistas) quedó telegráfico al recortarlo: rehacerlo con la regla nueva («el presupuesto no se cumple a costa de entender»).
- Ids de error repetidos dentro de un problema impiden dibujar su fantasma (`redondeo-de-la-cota`, trabajo/propia): separarlos cambia la medición, así que lo decide Gerson.
- Primitivas que tres rutinas duplicaron y conviene subir a `nucleo/kit/trazo.js`: arco de ángulo con cuadradito, rótulo junto a un segmento, cota oblicua, regla con paso «bonito», flecha discontinua, extremo lleno o hueco y fila de fichas.
- `--c-f` no existe en la cáscara de la app: la práctica solo tiene 4 colores de variable.
- Con la marca al tope, el fantasma de `barra-porcentaje` se sale por la derecha (`porcentajes-planteo` a 390 px).
- `article.card.practica` puede correrse 40 px tras usar el teclado: probar `overflow: clip` en `app/estilos.css`. Va después de la rutina de la página del curso, que tiene ese archivo.

**Pendientes chicos.**
- La línea de la marca cruza el rótulo de un pedazo cuando caen en la misma columna.
- `app/lectura.js` todavía tiene `PREMIOS` con emoji y el gato en la retroalimentación: pasarlo a la mascota.
- La figura se redibuja entera en cada cuadro del arrastre: medirlo en gama baja.
- El kit todavía no está en `MODULOS` de `app/app.js` (se carga solo cuando un problema trae `escena`); sí está en la caché del service worker.
- El evento `prediccion` no lleva el subtipo del problema; la rutina de los 7000 lo pide para medir por tipo.

## Estado al 12 nov y lo que sigue

**Dónde está todo.**
- **Publicado:** la app en https://mesa-de-estudios.vercel.app (Vercel) y el servidor de cuentas en https://mesa-de-estudios-production.up.railway.app (Railway), los dos desde `main`.
- **Ramas:** la de trabajo es `claude/awesome-wozniak-5etl1n`. Todo lo integrado se sube también a `main` con `git push origin HEAD:main`, sin forzar; antes se fusiona `origin/main` si avanzó.
- **Al integrar:** `npm run catalogo` y subir `VERSION` en `app/sw.js` (hoy v158).
- **Cobertura:** 2550 de 2550 preguntas de la admisión real de San Marcos 2019–2027 (`docs/clasificacion-unmsm-admision.md`; las tablas se rehacen con `python3 -I herramientas/agregar_admision.py docs/datos/admision-unmsm.csv docs/datos/admision-unmsm.csv docs/datos/admision-unmsm-tablas.md`).

**Lecciones de costo (8 al 12 nov).** La tanda para llegar al 100 % costó cerca de 1000 USD, frente a unos 300 estimados. Las causas fueron siete rutinas en paralelo sin tope, verificación a ciegas en todo y la pausa por el límite semanal. Desde ahí:
- cada rutina lleva un tope en dólares y cierra con lo que tenga;
- máximo 3 rutinas en paralelo;
- verificación a ciegas completa solo en escenas y fórmulas nuevas;
- se programa una revisión del gasto con `send_later`.

Con esas reglas, las últimas cinco rutinas costaron entre 4 y 28 USD cada una.

**Presupuesto y mentalidad (Gerson, 13 nov).** Lo de esa tanda se pagó con un plan de 200 USD al mes, no con 1000 USD de bolsillo. Hoy se trabaja con dos planes y se puede sumar un tercero: hay capital para sostener tres planes de IA de 200 USD al mes durante tres meses, hasta el despliegue. **El dinero no es lo que limita el alcance, y no se recorta un plan por costo.** Lo que sí limita es el calendario, los límites semanales de cada plan y la calidad: pruebas en verde y verificación de escenas y fórmulas nuevas. Los topes por rutina siguen sirviendo, pero como freno para que una sola rutina no se coma el límite semanal.

### A. Antes del piloto (diciembre)

1. **Consentimiento (Ley 29733)** para cargar nombres y DNI de menores. Lo resuelve Gerson con el colegio o con un abogado. Bloquea cargar datos reales; mientras tanto, todo con datos inventados.
2. **Prueba de punta a punta en producción, con datos inventados:**
   - `python -m app.crear_admin --colegio "IE Prueba" …` en la consola de Railway;
   - CSV de 3 alumnos y tarjetas en PDF;
   - ingreso en un celular, práctica sin conexión y sincronización;
   - panel del profesor: abrir la salida y reiniciar una contraseña.
3. **Respaldos de PostgreSQL** activados en Railway. `DNI_CLAVE_FERNET` y `DNI_HMAC_CLAVE` guardadas en el gestor de Gerson: si se pierde la primera, los DNI no se leen; si cambia la segunda, la carga del CSV duplica alumnos.
4. **Probar en los celulares y las PC reales del colegio.** Ver `rm-balanzas` (hasta 0,8 s por problema) y `rm-deduccion` en gama baja.
5. **Decidir el alcance del piloto:** con el diseño actual o con el rediseño (B). El rediseño completo no entra en diciembre; un módulo prototipo, sí.

### B. Diseño, animación y teoría (conversación del 12 nov, sin empezar)

**Diagnóstico (Gerson: «el diseño está súper feo, los ejercicios parecen de libro, no hay teoría»).**
- Las ~90 prácticas de generador son enunciado, alternativas y solución en texto.
- Las ~100 escenas las hicieron rutinas distintas, sin una dirección de arte ni un sistema de animación comunes.
- `docs/diseno.md` define colores y tarjetas, pero no un mundo visual.
- No hay teoría: la app aplica «primero el problema» y nunca explica después.

**Plan acordado: tres capas, y Gerson quiere las tres.**

| Capa | Para qué | Herramienta | Quién |
| --- | --- | --- | --- |
| Alma | Mascota que reacciona según el código de error, retroalimentación, celebraciones, transiciones, onboarding | **Rive** (archivos `.riv` hechos en su editor; Gerson diseñará con el MCP de Vectorcraft e Ideogram para conceptualizar) | Gerson o un diseñador; Claude conecta los estados de la máquina de estados con la app (acierto, código de error, «No sé») |
| Movimiento | Pasos de la solución que se arman, datos de color que viajan del enunciado a la ecuación, entradas y salidas suaves | **GSAP** (verificar su licencia antes de usarla; se cree gratis desde 2025) o Motion | Claude |
| Escenas | Kit común de dibujo (trazos, flechas, ejes, sombras y tipografía iguales en todas), sobre Canvas/SVG, o PixiJS si hace falta | Kit propio en `nucleo/` | Claude |

La regla 1 sigue: lo que sale del cálculo (rayos, trayectorias, circuitos) lo dibuja el motor, no Rive.

**Para que las prácticas no parezcan de libro:**
- solución animada paso a paso;
- un dibujo mínimo por familia (plano inclinado, triángulo, balanza, recta);
- respuestas que se manipulan cuando el tipo lo permite (arrastrar un valor, mover un punto);
- retroalimentación con la mascota según el código de error.

**Teoría: micro-lecciones de 1 a 3 minutos.**
- Cada una trae una idea clave, una animación, un ejemplo resuelto y un «ahora tú».
- Aparecen después de intentar, o al fallar dos veces («Explícame esto»), y hay además un índice para repasar.
- Se diseñan con los ~4000 ejercicios que mandará Gerson, clasificados por tipo, con un «cómo se piensa» por tipo.
- Cuidado con Mayer: la animación que distrae empeora el aprendizaje (detalles seductores).

**Orden propuesto:**
1. **Dirección de arte.** Gerson elige 3 palabras de cómo debe sentirse la app y 3 a 5 referencias que le gusten y 2 que no. Con eso Claude escribe `docs/direccion-de-arte.md`: estilo, mascota, colores, tipografía y movimiento.
2. **Un módulo prototipo completo con el look nuevo,** por ejemplo MRUV: escena, práctica, solución animada, micro-lección y mascota. Se prueba con alumnos.
3. Recién después se escala con rutinas, con tope de gasto.

**Lecturas recomendadas a Gerson.** Cuando las consiga, van a `fuentes/por-conseguir.md`.
- *Refactoring UI* (Wathan y Schoger): la primera.
- *Multimedia Learning* (Mayer): cuándo la animación ayuda o estorba.
- *The Illusion of Life* (Thomas y Johnston): los 12 principios de la animación.
- *Designing Interface Animation* (Val Head).
- *The Design of Everyday Things* (Norman).
- Para gráficos: *The Visual Display of Quantitative Information* (Tufte).

**Preguntas abiertas para Gerson:**
- las referencias visuales;
- si hay un ilustrador o presupuesto para uno;
- si la mascota tiene identidad andina o puneña;
- el alcance del piloto.

### C. Lo que espera material de Gerson

- **~4000 ejercicios** para alimentar los generadores y diseñar la teoría. Deben traer conversiones de unidades en geometría, aritmética y RM, que hoy no tienen dónde poner la trampa de unidades.
- **El siguiente compendio Cuzcano: cantidad de movimiento.** Se sigue el método de `docs/clasificacion/LEEME.md`.
- **Temarios de la UNA Puno, la UNSA y la UNSAAC,** para la taxonomía.

### D. Decisiones pendientes de Gerson

- Si se muestra al alumno la cita «UNMSM <periodo>» en las preguntas oficiales reproducidas. Recomendado: sí. Hoy va en `datos` en RM y solo en el código en química.
- Si la lupa de metilos de `molecula-grande` aparece en la escena (pide el color `--c-met`).
- `rm-fichas` quedó sin problema de papel de la malla.
- Las decisiones viejas que siguen en la sección «Para Gerson» de abajo: cuadriláteros cóncavos, pares de reserva, GE13 y papel de lectura.

### E. Cuentas: lo que falta (`docs/cuentas.md`, `servidor/LEEME.md`)

- **C4:** resultados en el servidor (`/api/resultados`) y panel del administrador más completo.
- Migraciones con Alembic: hoy las tablas se crean al arrancar.
- Paginar `GET /api/colegio/eventos` y poder desactivar cuentas.
- El límite de intentos vive en memoria: un solo proceso (`--workers 1`). Antes de escalar, pasarlo a la base de datos.
- Tras un reinicio de contraseña, si el acceso de 15 minutos sigue vigente, el alumno ve «cambia tu contraseña» en vez del ingreso. Funciona igual, porque necesita la clave temporal.
- `CORS_ORIGENES` y `APP_URL` en Railway apuntan a `https://mesa-de-estudios.vercel.app`. Si cambia el dominio, se cambian ahí.

## Qué hay hecho

| Bloque | Estado |
| --- | --- |
| Documentos | Fundacional, arquitectura, diseño, temarios de la UNI y de San Marcos, clasificación de San Marcos, 12 informes de ideas erróneas, visión a futuro y hoja de ruta (Gantt) |
| Catálogo | 8 cursos y 151 unidades, con su universidad (UNI, San Marcos) y su grado (3.º, 4.º o 5.º, estimado) |
| App (PWA) | Bienvenida, inicio, cursos, práctica, lápiz y papel, progreso y perfil. Funciona sin conexión y en celular y computadora (menú lateral desde 900 px, atajos de teclado). Diseño acogedor con ilustraciones SVG propias |
| Medición | Pruebas de entrada y salida y registro anónimo de cada predicción, también desde las escenas. Se exporta a CSV o JSON desde Perfil; `herramientas/analizar-medicion.js` junta los archivos |
| Plantillas de escena | Banco Óptico (lentes), espejos esféricos, circuitos de corriente continua, calorimetría con cambios de fase, trabajo y energía (rampa con resorte), MRUV con gráficas, reactivo limitante con partículas, gases a nivel de partículas, soluciones con cuadros y puntos, ácidos, bases y pH, y la celda galvánica. Cada una con motor, casos verificados con fracciones, paso a paso con predicción, "¿qué pasa si…?" y 9 problemas de papel |
| Plantillas de predicciones | Reactivo limitante (química) y aumentos y descuentos sucesivos (aritmética), con generador por semilla |

## Pendientes, en orden de prioridad

### Publicación (12 nov 2026)

La app está en **https://mesa-de-estudios.vercel.app**, publicada en Vercel desde `main` con el preset Other en la raíz. El servidor de cuentas está en **https://mesa-de-estudios-production.up.railway.app**, en Railway desde `main` con la carpeta `servidor`. Cada push a `main` publica los dos.

Antes del piloto queda:
- **Consentimiento (Ley 29733)**, antes de cargar nombres y DNI reales.
- **Prueba de punta a punta con datos inventados:** colegio de prueba, CSV, tarjetas, ingreso del alumno en un celular, práctica sin conexión, sincronización y panel del profesor.
- **Probar en los celulares y en las PC reales del colegio.**
- **Respaldos de PostgreSQL** en Railway.
- **Los pendientes de la auditoría** que siguen abajo.

### Auditoría (12 nov 2026)

Revisado: `npm test` (7889 en verde); los 90 generadores con 606 semillas como las de la app; las 99 escenas a 390 y 1366 px y en oscuro; las 307 pantallas de la app; los datos del catálogo, el papel y la caja sin conexión; y una revisión de la lógica de medición. Arreglado: la molécula grande sin conexión, papel para 22 generadores, el doble toque que contestaba la pregunta siguiente, «Borrar mi avance» que dejaba la práctica en NaN, la salida el mismo día de la entrada (fuera de Hake), preguntas repetidas al recargar, la descarga en CSV que se marcaba como descargada, la entrada de verbal que se podía saltar y la frase larga que se salía de la tarjeta.

Queda:
- **Decisión de Gerson: el alumno del laboratorio que vuelve otro día.** Cada «Otro alumno» crea un código nuevo, así que en una PC compartida no hay forma de juntar su entrada con su salida. Propuesta: mostrar el código al alumno para que lo anote y un botón «Ya tengo código» que lo recupere.
- El perfil muestra el puntaje de la entrada antes de la salida, y en una PC compartida junta a todos los alumnos (baja).
- `rm-balanzas` tarda hasta 0,8 s por problema y `rm-deduccion` 0,2 s: mirarlos en un celular de gama baja.
- Analizador: `unir` no usa el campo `que` al quitar repetidos (solo afecta a la auditoría de habilitaciones); la tabla por módulo cuenta los reintentos de lectura y `resumirLectura` no (no coinciden).
- El service worker puede mezclar archivos viejos y nuevos en la sesión en que se actualiza; no se encontró una rotura concreta.

**Pausa por límite de uso (8 nov 2026).** Cinco rutinas de huecos quedaron detenidas con su trabajo a medias subido a su rama (commit «WIP: pausa por límite de uso», nota en `rutinas/<rama>.md`): `rutina/rm-espacial`, `rutina/rm-procesos`, `rutina/geometria-trig`, `rutina/fisica-admision` y `rutina/quimica-admision`. Al retomar: reanudar cada sesión desde su nota y, al integrar, mezclar el CSV por curso con `herramientas/mezclar-csv-admision.py` y rehacer las tablas con `herramientas/agregar_admision.py docs/datos/admision-unmsm.csv …`. Ya integradas: verbal A/B, «No sé» y aritmética-álgebra (cobertura 74 %).

### 0. Huecos que mide la admisión real de San Marcos (8 nov 2026)

Fuente: `docs/clasificacion-unmsm-admision.md` (2550 preguntas de 50 exámenes, 14 periodos de 2019-I a 2027-I). La cobertura de la app es 57 % «sí», 42 % «a medias» y 1 % «no». En orden:
1. **Textos A/B** (dos autores en debate): 240 preguntas, salen en los 14 periodos y la app no tiene ni un par. Hace falta un código RV para «atribuir a un autor la postura del otro».
2. **RM visual y espacial**: cubos y vistas, dados, rutas en 3D, rumbos, trasvases, rodamientos, certezas y diagramas de flujo (estos últimos sin unidad en el catálogo).
3. **Geometría y trigonometría**: relaciones métricas, sólidos de revolución y troncos, áreas circulares, ángulos verticales con dos observaciones y ecuaciones en un intervalo.
4. **Química**: biomoléculas en moléculas grandes (contar sp2, enlaces pi y grupos).
5. **Física**: tipos que faltan en escenas que ya existen (Bernoulli y caudal, Snell y ángulo límite, condensadores en asociación, Kirchhoff con dos fuentes, Joule, P = Fv, ecuación horaria del MAS).
6. **Lectura en inglés**: más allá de la idea principal.
7. **Trampas de cálculo sin código**: unidades sin convertir, proporcionalidad sin el cuadrado o la raíz, diámetro por radio.

Ojo: en verbal, analogías, conectores, eliminación y plan de redacción no salen en ningún examen de San Marcos; se mantienen por la UNI. Las trampas son inferidas de las alternativas, así que son hipótesis.

### 1. Contenido para el lanzamiento (lo más importante)

Cada módulo nuevo sigue el molde de `plantillas/circuitos-cc/`:
- `motor.js`, `casos.json` verificados con fracciones por otro método, `motor.test.js` y `papel.json`;
- `index.html` con "Paso a paso" y "¿Qué pasa si…?" y la cáscara crema;
- `registrarPrediccion` con ids de error del informe.

Después se agrega a la unidad en `catalogo/cursos/*.json` y se corre `npm run catalogo`.

| Id | Módulo | Informe de ideas erróneas | Nota |
| --- | --- | --- | --- |
| ma2 | Geometría | Hechas: `ampliadora`, `triangulo-estira`, `angulo-inscrito`, `poligonos`, `solidos`, `geometria-analitica` y `segmentos-angulos` | Hechas también `congruencia` y `simetria` (7 nov; el espejo en la cuadrícula: simetría axial con espejo arrastrable, P′ = 2H − P, central, ejes de figuras y letras, dos reflexiones como traslación o giro, planos del cubo y prismas y el simétrico en el espacio; 22 casos verificados aparte). Hecha `geometria-espacio` (7 nov; el cubo que gira: varilla perpendicular, proyección, recta-plano, tres perpendiculares, diedro, cruzadas y triedro; 20 casos verificados aparte). Hecha `razonamiento-figuras` (7 nov; el reflector de figuras: conteo por fuerza bruta, abanicos, cuadrículas, pilas de cubos y «Arma tú»; 20 casos verificados aparte). Geometría completa. Para Gerson: los cuadriláteros cóncavos no se cuentan (cambio de una línea en el motor si se quieren contar) |
| ma1 | Trigonometría | Hechas: `cinta-radio`, `circunferencia-trig`, `caso-ambiguo` e `identidades-trig` | Hecha también `funciones-trig-inversas` (7 nov). `geometria-analitica` cubre también la recta en el plano (sin baricentro con coordenadas). Hecha también `transformaciones-trig` (7 nov; dos flechas en la circunferencia: la suma es un rombo que apunta en la semisuma y mide 2 cos de la semidiferencia; suma a producto, producto a suma, cocientes y pulsaciones; 22 casos verificados aparte). Hecha `conicas` (7 nov; la cuerda del jardinero: elipse con estacas, parábola PF = PD, hipérbola, ecuación general y degenerados; 23 casos verificados aparte; cubre también geometría analítica). Hecha `coordenadas-polares` (7 nov; el radar: r negativo, cuadrante de arctan, rectas, circunferencias por el polo, rosas y forma polar; 20 casos verificados aparte). Trigonometría completa |
| ma3 | Álgebra | Hechas: `grafica-perillas`, `traductor-enunciados`, `cuadrado-crece` (productos notables y factorización), `sucesiones`, `exponenciales-logaritmos` y `polinomios` (Ruffini, resto, raíces racionales) | Lógica y conjuntos con `conjuntos` y `logica` (7 nov). Hechas `programacion-lineal`, `numeros-reales` y `numeros-complejos` (7 nov; la flecha en el plano: multiplicar por i gira 90°, módulo con cuadritos, conjugado como reflejo, producto que gira y estira, De Moivre; 19 casos verificados aparte; falta forma exponencial, raíces n-ésimas y regiones). Hecha `matrices` (7 nov; el plano que se deforma: det como área con signo, AB contra BA, inversa, Sarrus y Cramer; 22 casos verificados aparte; cubre también sistemas de ecuaciones). Hecha `binomio-newton` (7 nov; el tablero de los caminos: Pascal con fichas, término general, central e independiente, Galton; 20 casos verificados aparte). Álgebra completa |
| ma1 a ma3 | Trigonometría, geometría, funciones | Informes del 6 nov: `trigonometria-`, `geometria-` y `algebra-funciones-ideas-erroneas.md` | Cifras de resúmenes, por verificar con los PDF (`fuentes/por-conseguir.md`); cada informe trae 3 escenas y casos |
| ma4 | Aritmética | Hechas: `porcentajes-sucesivos` (predicciones), `regla-de-tres`, `probabilidad-dados`, `sucesiones` y `fracciones` (fracciones, decimales, MCD y MCM, promedios) | Hechas también `interes` y `divisores` (7 nov). Hechas también `numeracion`, `cuatro-operaciones` y `potenciacion`. Hechas también `mezclas`, `conjuntos`, `logica` y `razonamiento-numerico` (7 nov). Banco: 14 pares en reserva |
| ra1 | Razonamiento matemático | Hechas: `maximos-minimos`, `tablas-graficos`, `cortes-pesadas`, `trazos-rutas`, `arreglos-giros` y `traslados-sucesos` (7 nov; traslados-sucesos: pastillas con el +1, sucesos que coinciden por MCM contando la primera, turnos con ciclo, el triángulo de monedas invertido y caminatas con brújula, 22 casos verificados aparte; falta traslado de números; arreglos-giros: arreglos-giros: cuadrado mágico, números en polígonos, giro contra reflejo, ruedas que ruedan y vuelcos con el recorrido de un punto, 22 casos verificados aparte; falta en transformaciones: áreas sombreadas y región barrida al girar, y la semejanza la cubre `ampliadora`; trazos-rutas: un solo trazo con Euler, cartero, perímetros escalonados con entrante, caminos en cuadrícula con obras y en el espacio, y la hormiga en la caja; 21 casos verificados aparte), `relojes-calendarios`, `probabilidad-dados`, `regla-de-tres` (engranajes), `traductor-enunciados` (planteo), `sucesiones` (patrones con palitos, Gauss, series) y `orden-informacion` (orden, verdades y mentiras, certezas) | Faltan sucesiones, planteo de ecuaciones, edades y móviles, orden de información y verdades y mentiras |
| ra2 y pl4 | Razonamiento verbal y formato lectura | `razonamiento-verbal-ideas-erroneas.md` (RV1 a RV34, ninguno documentado; hecho por la rutina) | Formato lectura hecho en la app (pl4, 6 nov); la rutina sigue con los 30 textos, los de entrada y salida, los ejercicios sueltos y la guía docente |

### 2. Detalles de las plantillas ya hechas

- **Mol y composición** (`plantillas/mol-composicion/`, rutina de química, 6 nov 2026): balanza, lupa y cuenta a la vez; mol contra masa, átomos en u, fórmula empírica y molecular; 16 casos verificados aparte; 10 de papel. Los colores pendientes (C–Ca y m–O) quedaron resueltos con la paleta común de elementos (7 nov 2026).

- **Tiro parabólico y circular** (`plantillas/tiro-parabolico/`, rutina de física, 6 nov 2026): dos movimientos con sombras sobre los ejes y estroboscopio, MCU, MCUV y transmisión; 17 casos verificados aparte; 10 de papel; 3 predicciones y 6 «¿qué pasa si…?» (Prescott y Mitchelmore 2005, Thornton y Sokoloff 1998). Hecho (7 nov, 0.2.0): pestaña «Ruedas» (rotonda, honda, cadena, rueda de atrás, frenado MCUV y pista con encuentros), «La pared» y «El golpe» en «¿qué pasa si…?», f en vueltas/s y ω en rad/s; cinco respaldos bajaron a parcial.
- **Formato lectura y banco de razonamiento verbal** (rutina verbal, 6 nov 2026; pl4 implementada el mismo día): diseño en `docs/formato-lectura.md` y los primeros 6 textos en `contenido/razonamiento-verbal/`. Ya está en la app: `nucleo/lectura.js` (con pruebas sobre los textos reales), `app/lectura.js` (los seis tipos de paso previo, que bloquean las alternativas; hoja que sube en el celular y dos columnas en la PC; texto pintado con evidencia, distractor e idea), la ficha `plantillas/lectura-verbal/` en las 8 unidades que tocan los textos, `codigos.json` generado del informe, y la medición (`previo`, `lectura`, posición en el banco, resumen por código RV en `analizar-medicion.js`). Detalle en `docs/arquitectura.md` (sección «Formato lectura»). Falta:
  - Hecho (7 nov 2026): 30 textos de práctica (t001 a t030) más la pareja de entrada y salida, y 15 ejercicios sueltos revisados a ciegas (analogías, término excluido, conectores, plan de redacción y eliminación); las unidades de analogías, definiciones, plan de redacción y eliminación ya tienen módulo. Códigos RV37 a RV40 (hipótesis).
  - Ejercicios sueltos (analogías, plan de redacción, eliminación, término excluido, oraciones incompletas): la app y el núcleo ya los muestran y califican (probados con ejercicios de muestra); falta escribirlos y las unidades de término excluido y oraciones incompletas en el catálogo. Al agregar un texto o ejercicio con una unidad nueva, sumarla a `plantillas/lectura-verbal/plantilla.json` y nombrar el módulo en la unidad (la prueba avisa); luego `npm run catalogo`.
  - Lápiz y papel (regla 6): falta `herramientas/papel-lectura.js` y que `vPapel` acepte enunciados de varios párrafos (sección 7.6 del diseño). Por eso la ficha sigue en `borrador` con `papel: null`.
  - Revisión independiente del 6 nov aplicada en el código: pruebas de entrada y salida con orden A→B o B→A y eventos `item` (Hake y errores RV antes y después), corrección neutra del paso previo cuando la frase del código no aplica (con aviso en las pruebas), oración mixta evidencia y distractor con contorno, opción `"explicar": "al-final"`, `intento` y retomar un texto a medias, hoja con lo demás `inert`, selección en color de marca, tarjetas que piden mover algo antes de confirmar. Lo de contenido (sondas, distractores, explicaciones de los previos, orden de preguntas, textos t000a y t000b) quedó para la rutina verbal; hoy 59 respuestas incorrectas de pasos previos no tienen explicación propia (14 caen en la frase neutra; ver el diagnóstico de `nucleo/lectura.test.js`).
  - **Decidido (Gerson, 6 nov 2026):** en el celular la barra de abajo no desaparece en la lectura. Los colores evidencia, distractor e idea reusan `--c-i`, `--c-o` y `--c-d`; la revisión midió contraste AA y ΔE00 ≥ 25 entre las tintas, pero naranja y verde se acercan con protanopía o deuteranopía (ΔE00 3,6 a 9,5): por eso cada color va siempre con su marquita y una frase.

- **El grupo que se cambia** (`plantillas/funciones-organicas/`, rutina de química B, 7 nov 2026): el mismo esqueleto con el grupo que se mueve o se cambia (familia, nombre IUPAC y común, fórmula, ebullición y puentes de hidrógeno), isomería de función, posición y cadena, clases de alcohol y amina, el éster con sus dos partes y la esterificación; caja de grupos libre; 24 casos verificados aparte; 10 de papel; 7 predicciones y 5 «¿qué pasa si…?»; documentado solo FO2 (Schmidt 1996). Falta: amidas en el conteo de isómeros y compuestos con varios grupos. Sin ítems en el banco de química.
- **Cinética** (`plantillas/cinetica/`, rutina de química, 6 nov 2026): caja de discos con teoría de colisiones (energía y orientación), temperatura, catalizador y perfil de energía. Informe `docs/investigacion/cinetica-ideas-erroneas.md` (CI1 a CI13) con cifras sin verificar por el bloqueo de red: la escena no muestra porcentajes de cinética. La fracción contada queda unos pocos por ciento bajo la teoría. Hecho (7 nov, 0.2.0): orden ≠ coeficiente con una tabla de velocidades y vida media de primer orden contra segundo (experimentos 6 y 7; casos 13 a 16 verificados aparte).

- **Cortes y pesadas** (`plantillas/cortes-pesadas/`, rutina de razonamiento matemático, 7 nov 2026): la sierra y la balanza (cortes en varilla y aro, estacas en línea y contorno, soga doblada, apilar para cortar, balanza de dos platillos con pesas 1, 3, 9 y 27, mínimo de pesadas por árbol de decisión); 21 casos verificados aparte (189 campos); 10 de papel. Errores sin dato, anotados en el informe de aritmética. Sin ítems en el banco.
- **Tablas y gráficos** (`plantillas/tablas-graficos/`, rutina de razonamiento matemático, 7 nov 2026): la bodega en gráficos (eje que no empieza en 0, crecimiento absoluto contra porcentual, sectores, tabla de campeonato deducida por el motor y suficiencia de datos por enumeración); 21 casos verificados aparte (167 campos); 10 de papel. Falta el promedio ponderado (AR15). Sin ítems en el banco.
- **Máximos y mínimos** (`plantillas/maximos-minimos/`, rutina de razonamiento matemático, 7 nov 2026): el cordel que encierra (perímetro fijo y suma fija, corral contra la pared, recorrido mínimo con reflejo en el río, precio que maximiza el ingreso y menor número de colores de un mapa); 22 casos verificados aparte; 10 de papel. Falta la predicción de «cantidad mínima de personas» (se eligió el mapa). Sin ítems en el banco (RM tiene 10 pares).
- **Inducción** (`plantillas/induccion/`, rutina de física B, 7 nov 2026): el imán, la espira y el foquito (corriente solo mientras el flujo cambia, Lenz con el sentido de la corriente, barra que se desliza, generador y transformador); 22 casos verificados aparte; 10 de papel; 8 predicciones y 5 «¿qué pasa si…?»; revisión con 2 graves corregidos (las correctas casi siempre en la A, y alejar el imán adelantaba el paso 5). Documentados MG7 y MG8. Sin ítems en el banco de física.
- **Magnetismo** (`plantillas/magnetismo/`, rutina de física B, 7 nov 2026): imanes, cables y cargas (imán y carga quieta, carga paralela al campo, mano derecha frente a una vista 3D que se gira, ángulo entre v y B, electrón, hilo con 1/r, punto medio entre corrientes opuestas, fuerzas iguales entre cables, radio y periodo, conductor girado, solenoide y Oersted); 21 casos verificados aparte; 10 de papel; 8 predicciones y 5 «¿qué pasa si…?». Documentados: MG1 y MG5; parciales: MG2 a MG4, MG6 y EL9. Falta en la escena la espira (está en el motor y el papel). Sin ítems en el banco de física.
- **Electrostática** (`plantillas/electrostatica/`, rutina de física B, 7 nov 2026): cargas que se empujan (las dos fuerzas siempre iguales, esferas colgadas con q y 2q, 1/r², superposición, campo visible sin carga de prueba, carga de prueba que cambia de signo, punto medio con E y V separados, trabajo que no depende del camino, condensadores en serie, placas, Q = 0 con C ≠ 0 y contacto); 22 casos verificados aparte; 10 de papel; 8 predicciones y 5 «¿qué pasa si…?». Documentados: EL1 a EL4; parciales: EL5, EL7 y EL8. 0.2.0 (7 nov 2026): dieléctricos como experimento 6 (desconectado: V baja κ veces; con un botón, conectado; EL6 parcial) y el contacto de esferas en nC. Falta: EL9 (mejor en magnetismo). Las esferas del paso 2 ya son realistas (0,2 g y 100 nC). Sin ítems en el banco de física. Al integrar se cambió el subtítulo, que regalaba la primera predicción.
- **Potenciación** (`plantillas/potenciacion/`, rutina de aritmética, 7 nov 2026): el cuadrado de fichas (raíz entera por defecto y por exceso con su residuo, la esquina del cuadrado que se arrastra, la L de 2k + 1, criterios de exclusión, menor multiplicador o divisor para cuadrado o cubo, cuadrados entre a y b); 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; revisión con 2 graves corregidos. Sin ítems en el banco.
- **La recta en trozos** (`plantillas/numeros-reales/`, rutina de química B, 7 nov 2026): intervalos como trozos con extremos que entran o no, operaciones con conjuntos con extremos arrastrables, valor absoluto como distancia, imagen de un intervalo por funciones afines, x² y 1/x, densidad con lupa y 0,999… = 1, supremo contra máximo, y operaciones binarias por tabla; 22 casos verificados aparte; 10 de papel; 8 predicciones y 5 «¿qué pasa si…?»; AL22 parcial, lo demás hipótesis. Falta: los axiomas de cuerpo y de orden en escena. Sin ítems en el banco de álgebra.
- **La región que se arma** (`plantillas/programacion-lineal/`, rutina de química B, 7 nov 2026): semiplanos con prueba del origen, región factible que se arma condición por condición, vértices, recta de nivel que se arrastra hasta salir por un vértice, método de los vértices, óptimos múltiples, región no acotada, vacía y restricción redundante; 20 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todo hipótesis salvo PL12 y PL14 (parciales por AL19 y AL1). Sin ítems en el banco de álgebra.
- **Razonamiento numérico** (`plantillas/razonamiento-numerico/`, rutina de aritmética, 7 nov 2026): las fichas que se cambian (falsa suposición con el corral que cambia animales uno a uno, examen con descuento, método regresivo con la tira que se recorre hacia atrás, «la mitad y S/ 5 más», triángulos y cuadrado mágico con fichas que se arrastran y soluciones contadas por fuerza bruta con sus simetrías); 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todo hipótesis. Banco de aritmética: 14 pares en `reserva` (ari-15 a ari-28, dos por cada plantilla de la rutina), para armar la forma con el temario del piloto.
- **Conjuntos** (`plantillas/conjuntos/`, rutina de aritmética, 7 nov 2026): las fichas en los aros (fichas que se arrastran a aros de 2 y 3 conjuntos y a Carroll, al menos uno contra solo, complemento, tres aros, conjunto potencia con el árbol, producto cartesiano, B ⊂ A, disjuntos, diferencia y pertenencia contra inclusión); 20 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todo hipótesis. Sin ítems en el banco. Cubre también `algebra.logica-y-conjuntos`.
- **Lógica** (`plantillas/logica/`, rutina de aritmética, 7 nov 2026): los interruptores de la lógica (cada proposición es un interruptor; ∧ en serie, ∨ en paralelo, ~ invertido; el condicional como promesa que solo se rompe con V → F; tablas que se llenan solas, tautología, De Morgan, contrarrecíproca, Δ contra ∨ y negar «todos»; lector de pantalla con frases); 20 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todo hipótesis. Sin ítems en el banco. Cubre también `algebra.logica-y-conjuntos`.
- **Mezclas** (`plantillas/mezclas/`, rutina de aritmética, 7 nov 2026): la balanza de las mezclas (el precio medio es el punto de equilibrio y el apoyo se arrastra; regla del aspa como momentos, grados de alcohol con el alcohol puro aparte, agua que baja el grado, ley y quilates con la barra de 24 partes, oro que se agrega, rango imposible, sacar y reponer); 19 casos verificados aparte; 10 de papel; 6 predicciones y 4 «¿qué pasa si…?»; AR15 parcial, lo demás hipótesis. Sin ítems en el banco de aritmética.
- **Cuatro operaciones** (`plantillas/cuatro-operaciones/`, rutina de aritmética, 7 nov 2026): el tablero de las llevadas (columnas con la llevada como paquete que sube y el préstamo como paquete que se abre, también en base b; complemento aritmético, resta con ceros, cifras que faltan, sumatorias, división por defecto y por exceso, criptoaritmética, número menos su reverso y cifras de un producto); 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todo hipótesis. Hecho después (7 nov): arrastre de piezas en el explorador de numeración y cuatro operaciones, rₑ en vez de r′ y tope de 340 px en el celular. Sin ítems en el banco.
- **Numeración** (`plantillas/numeracion/`, rutina de aritmética, 7 nov 2026): las fichas que se agrupan (cambio de base con divisiones sucesivas como rondas de agrupar, descomposición polinómica como abrir piezas, cifras válidas, comparar bases, base desconocida, capicúas, conteo de cifras de páginas, la llevada en cadena y bases potencia); 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todos los errores son hipótesis. Notación 213₍₅₎. Sin ítems en el banco de aritmética.
- **Gravitación** (`plantillas/gravitacion/`, rutina de física, 7 nov 2026): la Tierra, el satélite y la órbita (la gravedad lejos del suelo, por qué flota la astronauta, órbitas circulares con v y T, Kepler y el área barrida, el ascensor); 193 campos verificados aparte; 44 pruebas. Sin ítems en el banco de física.
- **Termodinámica** (`plantillas/termodinamica/`, rutina de física, 7 nov 2026): primera ley y diagrama P-V (cilindro con émbolo que se mueve junto con su punto en el diagrama, Q, W y ΔU con signo como barras, trabajo como área, procesos isobárico, isócoro, isotérmico y adiabático); 45 pruebas; verificada y revisada. Sin ítems en el banco de física.
- **Ondas** (`plantillas/ondas/`, rutina de física, 7 nov 2026): ondas en una cuerda y sonido (la rapidez la decide la cuerda y no la mano, λ y f, la cinta amarrada contra las gráficas, ondas estacionarias, sonido e intensidad en decibelios); 31 casos verificados aparte (127 campos); 4 predicciones y 5 «¿qué pasa si…?». Sin ítems en el banco de física.
- **MAS** (`plantillas/mas/`, rutina de física, 7 nov 2026): el resorte, el péndulo y la sombra que gira (período que no depende de la amplitud, √m en el resorte, rapidez y aceleración máximas en el centro y en los extremos, energía a media amplitud, círculo de referencia, péndulo con g efectiva, resortes en serie y paralelo); 23 casos verificados aparte; 4 predicciones y 5 «¿qué pasa si…?». Sin ítems en el banco de física.
- **Fluidos** (`plantillas/fluidos/`, rutina de física, 7 nov 2026): presión, Pascal y Arquímedes (tres recipientes con la misma altura, h vertical, tubo en U, prensa, empuje que no depende de la masa ni de la profundidad); 18 casos verificados aparte (131 campos); 6 predicciones y 5 «¿qué pasa si…?». Falta en la escena continuidad, Bernoulli y el barómetro (están en motor y papel); tensión superficial no. Colores con cercanías entre escenas (ver diseno.md). En el informe se corrigió la opción «el de 1 kg recibe más empuje» (era hipótesis, no 15–25 %) y se separó F12b. Al integrar se neutralizó el subtítulo, que adelantaba las predicciones. Sin ítems en el banco de física.
- **Choques** (`plantillas/choques/`, rutina de física, 7 nov 2026): choques en un riel (cantidad de movimiento como flecha que se conserva en el sistema, energía cinética como barra que se puede perder, impulso como área F–t, coeficiente de restitución); 21 casos verificados aparte; 4 predicciones y 5 «¿qué pasa si…?». Falta en la escena el choque en dos dimensiones (está en motor y papel p10). Sin ítems en el banco de física.
- **Congruencia** (`plantillas/congruencia/`, sesión de matemática B, 7 nov 2026): el armador de triángulos (LLL, LAL, ALA y LAA con piezas que se arman, la trampa LLA con el compás, hipotenusa y cateto, AAA semejantes, correspondencia de vértices, mediatriz, bisectriz, base media, mediana a la hipotenusa y notables); 20 casos verificados aparte en dos pasadas (188 campos); 10 de papel. Falta: mediana del trapecio, el isósceles con altura, mediana y bisectriz, bisectriz con incógnita, notables de 15° y 75° y de 37°/2 y 53°/2. Sin ítems en el banco de geometría (10 pares).
- **Segmentos y ángulos** (`plantillas/segmentos-angulos/`, 7 nov 2026, subagentes de la conversación principal): la escuadra y las paralelas (segmentos que se pisan y puntos medios, complemento y suplemento que completan la escuadra y la recta, bisectrices, los ocho ángulos con la secante que gira, «¿son paralelas?» con el corte a escala, quiebre y serrucho con su condición); 21 casos verificados aparte; 10 de papel; 5 predicciones y 5 «¿qué pasa si…?»; todo hipótesis salvo GE17 (sin dato). Sin ítems en el banco de geometría.
- **Química ambiental** (`plantillas/quimica-ambiente/`, rutina de química, 7 nov 2026): del pozo al cielo (la masa al quemar en frasco sellado y abierto, combustión incompleta, ozono arriba y CO₂ en el medio, lluvia ácida, el clavo que se oxida, la torre de destilación del petróleo, la laguna y el smog); unidades recursos naturales y ambiente y química aplicada; verificada y revisada (un grave, lluvia ácida y CO₂, corregido). Informe nuevo `docs/investigacion/quimica-ambiente-ideas-erroneas.md` (QA1 a QA17, cifras por verificar). Los tres errores de la torre se verificaron aparte después (32 campos). Sin ítems en el banco de química.
- **Rendimiento y pureza** (`plantillas/rendimiento-pureza/`, rutina de química, 7 nov 2026): el montón y la caja punteada (pureza como montón que se separa, rendimiento real contra el teórico de la caja punteada, volumen en condiciones normales y equivalentes); 142 de 145 campos verificados aparte (las 3 diferencias eran de interpretación de la cabecera, ya aclarada); revisión sin graves. Todos los distractores son hipótesis. Con esto quedan cerradas las escenas de estequiometría que faltaban (composición en mol y composición; rendimiento y pureza aquí).
- **Biomoléculas** (`plantillas/biomoleculas/`, rutina de química, 7 nov 2026): el taller de las piezas (azúcares, proteínas y grasas armados con piezas que sueltan agua en cada unión, masa de la molécula, hidrólisis, desnaturalización al cocinar un huevo, almidón y grasas); 30 casos verificados aparte. Informe nuevo `docs/investigacion/biomoleculas-ideas-erroneas.md` (BM1 a BM10 y BMH1 a BMH14; cifras de resúmenes, por verificar: la red bloqueó los PDF). Los experimentos 1 y 2 de «¿qué pasa si…?» se abren al responder los pasos 2 y 4, porque regalaban esas respuestas. Sin ítems en el banco de química.
- **Hidrocarburos** (`plantillas/hidrocarburos/`, rutina de química B, 7 nov 2026): bolitas y palitos (la molécula como grafo: girar un enlace simple no cambia la sustancia, el doble no gira; cadena principal y numeración IUPAC con la regla escolar de alquenos, que avisa cuando la de 2013 difiere; isómeros contados hasta C10, cis-trans, hibridación y ángulos, ebullición y ramificación; armado libre); 23 casos verificados aparte; 10 de papel; 7 predicciones y 5 «¿qué pasa si…?»; documentado solo HC2 (Schmidt 1996). Falta: Z/E y confirmar el arrastre en un celular real. Sin ítems en el banco de química.
- **Nomenclatura inorgánica** (`plantillas/nomenclatura-inorganica/`, rutina de química B, 7 nov 2026): el árbol de las funciones (estados de oxidación, también fraccionarios; funciones inorgánicas como árbol que se destapa; mesa de fichas con cruce y simplificación, el peróxido no se parte; nombres en sistemática, stock y tradicional; sales ácidas e hidratadas); 25 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todo hipótesis o parcial (NO1, NO2). Decidido el 7 nov: número romano sin espacio, como pide la IUPAC («hierro(III)»); se mantiene «tetraoxosulfato (VI) de hidrógeno», que es como lo preguntan las academias; la tabla de estados incluye S +2, N +1 y P +1, como las tablas de academia (hiposulfuroso, hiponitroso, hipofosforoso). Pendiente: en el celular, al cambiar los selectores libres el dibujo queda fuera de la vista. Sin ítems en el banco de química.
- **Líquidos y sólidos** (`plantillas/liquidos-y-solidos/`, rutina de química, 7 nov 2026): el frasco cerrado (presión de vapor que no depende del volumen, ebullición cuando Pv iguala a Pext y el agua que hierve antes en Puno, fuerzas intermoleculares y puente de hidrógeno, diagrama de fases, gas recogido sobre agua); 52 casos verificados aparte; 10 de papel. GQ16 y GQ18 bajaron a parcial. Falta la humedad relativa en escena (está en motor y papel) y cotejar las constantes de Antoine con la tabla del colegio. Sin ítems en el banco de química.
- **La lupa y la balanza** (`plantillas/materia-energia/`, rutina de química B, 7 nov 2026): elemento, compuesto y mezcla por sus partículas, fases y componentes, cambio físico, químico y nuclear con la balanza en frasco cerrado y abierto, separación de mezclas y E = mc² con defecto de masa; 24 casos verificados aparte; 10 de papel; 7 predicciones y 5 «¿qué pasa si…?». Documentados MA11, MA6 y MA7; lo demás parcial o hipótesis (informe nuevo `docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md`, con cifras de resúmenes marcadas). Falta: aire con N₂ en la lana (N–Fe cercanos en la paleta) y calor sensible y latente (está en calorimetría). Al integrar se quitó del paso 1 «si el frasco está cerrado, la masa no cambia nunca», que regalaba la predicción del paso 5. Sin ítems en el banco de química.
- **Enlace** (`plantillas/enlace/`, rutina de química, 7 nov 2026): la molécula en 3D (electrones de valencia, Lewis con pares enlazantes y libres, forma por repulsión de pares, dipolos que se suman al girar la molécula, enlace iónico con Na⁺ y Cl⁻); 58 casos verificados aparte (322 campos); revisión con 2 graves y 11 medios corregidos. La polaridad usa ΔEN sin el dipolo de los pares libres: en pantalla dice solo «polar» o «apolar», con un aviso para NH₃ contra NF₃. Sin ítems en el banco de química.
- **Funciones trigonométricas inversas** (`plantillas/funciones-trig-inversas/`, sesión de matemática A, 7 nov 2026): la ventana principal (la recta y = k corta la onda muchas veces y solo un corte cae en la ventana; reflejo en y = x, arcsen y arccos en la circunferencia, compuestas con el triángulo, dominio y suma de arcotangentes); 19 casos verificados aparte; IN1 a IN29 son hipótesis. Con 2 pares en el banco de trigonometría desde el 7 nov (arcsen(sen θ) fuera de rango y sen(arctan k)).
- **Balance de reacciones** (`plantillas/balance-reacciones/`, 7 nov 2026, subagentes de la conversación principal): balancear es contar átomos (tablero de moléculas con la cuenta por elemento, subíndice contra coeficiente, el frasco que no es la ecuación, tanteo animado, conservación de la masa en frasco abierto y cerrado, clasificación, números de oxidación, agentes y formas oxidada y reducida, ion-electrón en medio ácido y básico con fichas de electrones); 20 casos verificados aparte; 10 de papel; 5 predicciones y 5 «¿qué pasa si…?». Documentados: ES9, ES11 (H₁₀O₄), ES12, ES13 y EC9; cambiar subíndices es parcial; redox ion-electrón, hipótesis. Sin ítems en el banco de química.
- **Divisores** (`plantillas/divisores/`, 7 nov 2026, subagentes de la conversación principal): el rectángulo de fichas (divisores como rectángulos, criba, árbol y tabla de exponentes con CD, SD y PD, divisores múltiplos de k, criterios con fichas sobrantes, restos con el patio partido, PESI, φ y el reloj de restos potenciales con el gaussiano); 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todos los distractores son hipótesis. Unidades: divisibilidad y números primos y divisores. Falta en la escena: diofánticas, Wilson y Fermat (están en motor y papel). Sin ítems en el banco de aritmética (está en 10).
- **Relojes y calendarios** (`plantillas/relojes-calendarios/`, sesión de matemática B, 7 nov 2026): ángulo entre las agujas con minutero arrastrable, superposiciones en un día, adelantos y atrasos, campanadas, bisiestos y día de la semana; 20 casos verificados aparte; 10 de papel. Errores sin datos (hipótesis). Falta: lo transcurrido contra lo que falta del día, campanadas que dan la hora, desde cuándo se atrasa, «el ayer del pasado mañana», N días con N grande y el ángulo con segundos; algunas conversiones de horas a días están en el HTML. Con 2 pares en el banco de razonamiento matemático desde el 7 nov (ángulo entre agujas y el reloj que vuelve a la hora).
- **Vectores** (`plantillas/vectores/`, 7 nov 2026, subagentes de la conversación principal): flechas que se arrastran, polígono y paralelogramo, fórmula del paralelogramo y ley de cosenos, rango de R, componentes con el notable 3-4-5 (dicho como aproximación de academia), unitario, hexágono y la balanza de dimensiones con homogeneidad y exponentes; 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?». «Sumar módulos» es parcial (E8 de estática y M2 de choques); lo demás, hipótesis. Exponentes con α, β, γ en vez de x, y, z porque x e y son los ejes (decidido el 7 nov 2026: se queda así, en serif matemática). Falta en escena el producto escalar y vectorial (están en motor y papel). Sin ítems en el banco de física.
- **Interés** (`plantillas/interes/`, sesión de matemática B, 7 nov 2026): la alcancía que gana interés (torre de monedas con la capa de interés sobre interés, recta contra curva, tasa efectiva y capitalización, capital desde el monto, descuento comercial y racional); 20 casos verificados aparte; 10 de papel; 5 predicciones y 6 «¿qué pasa si…?». AR16 pasó a «parcial (adultos)» en el informe. Falta en la escena: vencimiento común (está en p10) y la continua como paso propio; casos de capital a dos tasas. Sin ítems en el banco de aritmética (ya está en 10). Decidido (7 nov 2026): Dc cambia de tono entre claro y oscuro (granate y naranja rojizo), y se queda así.
- **Polinomios** (`plantillas/polinomios/`, sesión de matemática A, 7 nov 2026): la máquina de Ruffini (fichas con el 0 que falta, el resto es la altura P(a) en la curva, divisor ax + b con el cociente falso, grados, resto por sustitución y raíces racionales); 22 casos verificados aparte; 10 de papel; 7 predicciones y 5 «¿qué pasa si…?»; PO1 a PO34 son hipótesis. Unidades: polinomios, división de polinomios y ecuaciones polinomiales. Falta: Horner animado y la sustitución dibujada paso a paso (experimento 4); en PC, el lienzo del paso 1 queda bajo hasta tocar «Ordenar». Sin ítems en el banco de álgebra (ya está en 10, con 2 por plantilla).
- **Átomo y tabla** (`plantillas/atomo-y-tabla/`, rutina de química, 7 nov 2026): partículas de átomos e iones, configuración con cajas (Hund y Pauli, excepciones Cr y Cu), números cuánticos, ubicación en la tabla, energía de ionización, radio y electronegatividad para Z = 1 a 36, series isoelectrónicas; tabla tocable como mapa; 29 casos verificados aparte; 10 de papel; 5 predicciones y 5 «¿qué pasa si…?». **Datos de tabla contrastados en parte (7 nov 2026)** con fuentes secundarias de la web (la red de la sesión no dejó abrir NIST ni Wikipedia): las 36 primeras energías de ionización, las sucesivas de Na, Mg y Al, el radio calculado de Z = 1 a 29, Pauling y los radios iónicos de Li⁺, Na⁺, K⁺, Mg²⁺, Ca²⁺, F⁻ y O²⁻ coinciden; ninguna diferencia cambia lo que enseña la escena. Falta confirmar en la fuente primaria el radio calculado de Zn a Kr, Br⁻ (196), S²⁻ (184) y Cl⁻ (181 en el motor; una tabla secundaria da 184, que empataría con S²⁻). Comparación en el scratchpad de la sesión (tabla-datos.md); para cerrarlo, permitir physics.nist.gov y en.wikipedia.org o revisarlo a mano con el libro del colegio. La escala de radios es la teórica de Clementi y la escena avisa que el libro usa radios medidos. Falta lo de enlace (va en su plantilla).
- **Estática** (`plantillas/estatica/`, rutina de física, 7 nov 2026): barra con peso propio, momentos respecto a cualquier punto, bate cortado, nudo, polea y roce estático; 21 casos verificados aparte; 10 de papel; 5 predicciones y 5 «¿qué pasa si…?» (Ortiz y otros 2005, Fischer y otros 2014, Flores-García y otros 2009). Falta en la escena alargar una sola cuerda del nudo sin cambiar su ángulo (E7); sin ítems en el banco de física todavía. Las opciones del momento inclinado, la reacción y la caja son hipótesis.
- **Ondas electromagnéticas** (`plantillas/ondas-electromagneticas/`, rutina de física B, 7 nov 2026): la antena y el arcoíris (todas a c en el vacío, campo eléctrico y B en fase y perpendiculares, espectro en una sola regla con λ, f y energía del fotón, FM de 100 MHz, qué atraviesa qué, luz que entra al agua, leer E₀ sen(kx − ωt) e intensidad); 23 casos verificados aparte en dos vueltas; 10 de papel; 7 predicciones y 4 «¿qué pasa si…?». Informe nuevo `docs/investigacion/ondas-electromagneticas-ideas-erroneas.md` (OE1 a OE20, desde resúmenes, por verificar). Nada documentado. Sin ítems en el banco de física.
- **Física moderna** (`plantillas/fisica-moderna/`, rutina de física B, 7 nov 2026): la lámpara y la placa (fotoeléctrico con deslizadores de λ, intensidad y voltaje; intensidad que no arranca electrones, la pila que no los saca, Kmax y potencial de frenado, corriente de saturación, gráfica Kmax–f, fotones por segundo, Bohr con Balmer y rayos X); 21 casos verificados aparte; 10 de papel; 8 predicciones y 5 «¿qué pasa si…?». Documentados: FM1 y FM2; parciales: FM3 y FM4. Falta en la escena: cuerpo negro, láser, incertidumbre y relatividad (Wien e incertidumbre están en el motor y el papel). Sin ítems en el banco de física.
- **Dinámica** (`plantillas/dinamica/`, rutina de física, 6 nov 2026): plano inclinado con roce estático que se ajusta, poleas, ascensor, tercera ley y empujón; 21 casos verificados aparte; 10 de papel; 3 predicciones y 6 «¿qué pasa si…?» (Halloun y Hestenes 1985, Bao y otros 2002, Castillo y otros 2013). Hecho (7 nov, 0.2.0): pestaña «Varios cuerpos» (Atwood, dos cajas, tren, bloque sobre otro y polea móvil), el columpio y la loma en «¿qué pasa si…?», cada pestaña bloquea sus experimentos en orden; 33 casos. Falta: péndulo en un vagón y fuerza horizontal sobre el plano.
- **Equilibrio químico** (`plantillas/equilibrio-quimico/`, rutina de química, 6 nov 2026): A ⇌ B y 2 X ⇌ Y con partículas, Q contra K en vez de la regla de Le Chatelier (Quílez 2017); 18 casos verificados aparte; 9 de papel. Hecho (7 nov, 0.2.0): gas inerte en caja rígida y con émbolo libre, y Kp con Δn (experimentos 6 a 8; casos 18 a 23 verificados aparte). Por revisar: los experimentos antiguos marcan EQ14 y Tagle Barrios como «documentado». ΔH y Ea de la escena elegidos para números redondos.

- **Banco Óptico:**
  - Hecho (7 nov, 0.3.0): pinch-zoom y nucleo/celular.js, chips al 8 %, A y los rayos con color propio (paleta de espejos), pasos bloqueados anunciados, retroalimentación por opción, opciones emparejadas, decimales con coma, sin desbordes a 390 px, casos en fn/args/espera (9 casos) y p8 con datos propios.
  - Por confirmar en el PDF de John, Molepo y Chirwa (2017): qué mitad de la lente se tapó. Si fue la de abajo, el «46 de 70 dijeron mitad de arriba» no corresponde al error E1 de la escena.
- **Espejos:**
  - Hecho (7 nov, 0.2.0): el doblez (paso 7 y experimento 5), casos en fn/args/espera, retroalimentación por opción, pinch-zoom y siete respaldos a parcial.
  - El 30 % de S1 no se cita al alumno hasta confirmarlo en el artículo original.
- **Circuitos:**
  - Hecho (7 nov, 0.2.0): pestaña «Medir» con amperímetro y voltímetro, ideales y reales, que se arrastran con imán al puesto más cercano (también con teclado) y 5 predicciones; el amperímetro en paralelo siempre da corto; 19 casos nuevos verificados aparte.
  - El `casos.json` de circuitos tiene un formato que `docs/metodo/entradas.py` no lee; la próxima verificación hay que armarla a mano o migrar los casos a fn/args/espera.
  - Algunos rótulos quedan apretados en el celular (junto a B1 y en McDermott).
  - Si el alumno quita B3 en el paso 8, la quitada pasa al explorador.
- **Calorimetría** (`plantillas/calorimetria/`, hecha el 5 nov 2026):
  - Hecho (7 nov, 0.2.0, «Temperatura y calor»): pestañas «Dilatación» y «Transferencia» (Stefan marcado «Para la UNI»), experimento «Dos tazas» (parcial), la noche en Puno que amanece más fría; Q2 documentado (Jara Guerrero, 48 %); se quitó la «temperatura de contacto» del hielo.
  - El punto de ebullición según la altitud y lo que "siente" la mano son modelos aproximados (atmósfera estándar con Antoine; efusividades de tabla). Sirven para comparar, no para medir.
  - El vapor de la olla destapada se va: en "Sigo calentando" la animación termina a los 300 s, mientras todavía hierve.
- **Energía** (`plantillas/energia/`, hecha el 6 nov 2026):
  - Hecho (7 nov, 0.2.0): modo «Fuerza variable», gráfica F–x de 5 puntos que se arrastra con el área con signo y «W hasta detenerse = −Ec0»; W9 bajó a parcial.
  - Hecho (7 nov): roce y P cambiaron de color; ningún par que sale junto queda bajo ΔE00 20.
  - Las opciones incorrectas de "Cambio la rampa" y de la grúa son hipótesis; las demás salen del test EMCS.
  - La pregunta del paso 6 (doble altura, √2) tiene respaldo solo parcial (Brundage y otros, 2023).
- **MRUV** (`plantillas/mruv/`, hecha el 6 nov 2026):
  - Falta que el alumno dibuje la gráfica con el dedo antes de verla (lo que recomiendan Beichner y Thornton y Sokoloff); hoy elige entre dibujos.
  - Tiro parabólico (P1 a P5 del informe) queda para su propia plantilla, en la unidad de movimiento parabólico.
  - Las opciones del frenado y del quinto segundo son hipótesis.
- **Reactivo limitante con partículas** (`plantillas/limitante-particulas/`, hecha el 6 nov 2026):
  - Faltan las otras dos escenas que propone el informe de estequiometría: composición y fórmula empírica (ES16), y rendimiento y pureza (solo hipótesis).
  - En el modo "¿qué pasa si…?", cada partícula dibujada vale un tercio de mol en el ejemplo del aluminio; se avisa en la caja.
- **Gases** (`plantillas/gases/`, hecha el 6 nov 2026):
  - El contador de choques es el promedio exacto que calcula el motor (las partículas no chocan entre sí); la presión depende además de la fuerza de cada choque, como dicen los textos.
  - Falta del informe: la mezcla con botón "solo O₂" en el explorador, el globo dentro del cilindro (GQ14) y la estequiometría con gases en la escena (sí está en papel).
- **Soluciones** (`plantillas/soluciones/`, hecha el 6 nov 2026 por un subagente):
  - Hecho (7 nov, 0.2.0): curva de solubilidad con saturada, insaturada y sobresaturada (SO13) y Henry con las dos gaseosas (SO6), experimentos 6 y 7. No cubre volúmenes que no se suman (SO5) ni coloides.
  - El modelo supone que agregar soluto no cambia el volumen; la escena lo dice. En el explorador, sacar una parte a veces no da puntos enteros: el dibujo redondea y lo avisa.
- **pH** (`plantillas/acidos-bases/`, hecha el 6 nov 2026 por un subagente): el H₂SO₄ se toma como diprótico fuerte (convención de academia; su segunda ionización real es parcial). No cubre pares conjugados, Lewis, indicadores ni curvas de titulación dibujadas (hay tabla).
- **Celda galvánica** (`plantillas/celda-galvanica/`, hecha el 6 nov 2026 por un subagente): puente de KNO₃ con nitratos en los vasos (con Ag⁺, el KCl precipitaría AgCl). Hecho (7 nov, 0.2.0): electrólisis del agua con Na₂SO₄ (H₂ y O₂ en razón 2 : 1) y NaCl en agua contra fundido (casos 21 a 26 verificados aparte). No cubre Nernst; el explorador dibuja Zn, Fe, Cu y Ag (el motor tiene más metales).
- **Todas:** el estado es `borrador`. Pasan a `probada` con los datos del colegio.

### Rutinas y sesiones paralelas (6 nov 2026)

Cinco conversaciones aparte trabajan solas, cada una en su rama y sin tocar catálogo, app, nucleo ni estos documentos. Cada una deja su reporte en `rutinas/<nombre>.md` con los pedidos de integración:

| Sesión | Rama | Qué hace |
| --- | --- | --- |
| Rutina de física | `rutina/fisica` | Estática (hecha); choques, fluidos, MAS, ondas mecánicas, termodinámica, gravitación |
| Rutina de química | `rutina/quimica` | Átomo y tabla (hecha); enlace, líquidos y sólidos |
| Rutina de razonamiento verbal (diaria, 4:41 p. m.) | `rutina/verbal` | Correcciones de los textos, textos de entrada y salida (t000a, t000b), más textos hasta 30, guía para profesores |
| Paralelo: álgebra y trigonometría | `rutina/matematica-a` | Exponenciales y logaritmos, identidades y polinomios (hechas); funciones trigonométricas inversas, transformaciones, complejos, matrices, binomio, reales, programación lineal y cónicas (todas hechas; lista cerrada) |
| Paralelo: geometría | `rutina/matematica-b` | Sólidos, geometría analítica, interés, relojes y calendarios (hechas); congruencia, simetría, geometría del espacio y razonamiento con figuras (todas hechas; lista cerrada) |
| Paralelo: razonamiento verbal B (7 nov) | `rutina/verbal-b` | Hechas las 6 (t031–t054; lista cerrada): tipología textual, resumen y síntesis, textos discontinuos, texto y contexto, textos filosóficos y científicos, lectura en inglés |
| Paralelo: historia (8 nov) | `rutina/historia` | Hecho: `docs/investigacion/historia-ganchos.md` (unos 410 ganchos en las 151 unidades, 30 ★, unos 80 mitos con su versión corregida). Ninguna fila está verificada contra la fuente completa: 186 «verificado (extracto)», 207 por verificar, 17 dudosas y 4 mito. Antes de usar cualquiera, falta una pasada con los sitios académicos permitidos en la red |
| Paralelo: matemática C (7 nov) | `rutina/matematica-c` | Pares de reserva del banco (16 + cp-01/02) y coordenadas polares (todo hecho; lista cerrada) |
| Rutina de razonamiento matemático (7 nov) | `rutina/razonamiento-matematico` | Máximos y mínimos, tablas y suficiencia, cortes y pesadas, trazos y rutas, arreglos y transformaciones, traslados y frecuencia |
| Rutina de aritmética (7 nov) | `rutina/aritmetica` | Numeración, cuatro operaciones, mezclas, conjuntos y lógica, razonamiento numérico |
| Rutina de química B (7 nov) | `rutina/quimica-b` | Informe de materia, nomenclatura y orgánica; materia y energía, nomenclatura inorgánica, hidrocarburos, funciones orgánicas |
| Rutina de física B (7 nov) | `rutina/fisica-b` | Electrostática, magnetismo, inducción, física moderna, ondas electromagnéticas |

Desde el 7 nov 2026 (plan más amplio de Gerson) son nueve sesiones paralelas, cada una con hasta 3 subagentes. La física A deja la electricidad a física B; matemática A sigue con transformaciones, complejos, matrices, binomio, reales, programación lineal y cónicas; química A con enlace y líquidos y sólidos. La conversación principal hace plataforma, plantillas sueltas (segmentos y ángulos) y la paleta común de elementos de química (`nucleo/elementos.js`, hecha el 7 nov: limitante, mol, balance, celda y enlace la usan).

**Cómo integrar:** `git fetch origin rutina/<nombre>`, leer su reporte, ver qué plantillas están terminadas y revisadas, hacer merge a esta rama (si una plantilla está a medias, merge del commit anterior), agregar al catálogo, `npm run catalogo`, subir `VERSION`, colores en `docs/diseno.md`, rebalancear el banco si el curso llega a 4 plantillas, documentar y `npm test` en verde. El método completo está en `docs/metodo/LEEME.md`.

- **Auditoría de cabeceras (7 nov 2026):** se revisaron las 52 escenas. En 20 el título, el subtítulo o el paso 1 regalaban una respuesta o descartaban de antemano el error documentado de una predicción (celda, choques, ángulo inscrito, identidades, circunferencia, calorimetría, relojes, gases, caso ambiguo, mol, energía, estática, balance, dinámica, enlace, pH, electrostática, fluidos, entre otras); quedaron neutras. En 7, los botones de pasos anunciaban al lector de pantalla los títulos de los pasos bloqueados; ahora dicen «Paso N, bloqueado». «El ángulo que no cambia» pasó a «¿Cambia el ángulo?» y «Alturas que no se suman» a «¿Se suman las alturas?». Dudoso, sin cambiar: el h1 «Una sola respuesta» de funciones inversas empuja hacia el error TR22 del paso 1.

### 3. Plataforma

- **pl6, pulido visual (65 %):**
  - Animaciones suaves al acertar y al subir la racha.
  - Una tipografía redondeada común entre la app y las escenas.
  - Revisar el modo oscuro de las ilustraciones.
  - **Hecho (7 nov 2026):** `nucleo/celular.js` (con pruebas) junta el arreglo común del celular: `compactar`, `alto` con tope, `alResponder` y `arrastre`. Lo usan MRUV (tope 340) y las diez escenas antiguas: energía y circuitos (240), espejos (260), Banco Óptico (240/260/240 por modo), gases, calorimetría, soluciones y pH (340), limitante y celda (420); las nuevas lo usan desde el brief. Las demás lo tienen copiado a mano y pueden migrar cuando se toquen. Detalles vistos de paso: en energía, experimento 2, el rótulo «roce = 20 N» tapa el «5 kg»; en celda, una vez salió «el paso de tiempo no puede ser negativo» con movimiento reducido (no se repitió).
  - Antes: llevar a `nucleo/` lo que cada escena repite (la cinta y la gráfica ya dejan el dibujo fijo arriba mientras se elige: `.bench` sticky y lienzo de ~240 px) y las revisiones vuelven a encontrar: en el celular, subir el lienzo al responder (scrollIntoView y animar después) y dejar que el dedo desplace la página sobre el dibujo salvo cerca de lo que se arrastra (touch-action: pan-y). Salió en la celda, la ampliadora y el triángulo.
- **la1, pruebas de entrada y salida por curso (hecha el 6 nov 2026; revisada y ampliada el mismo día):** banco en `catalogo/pruebas/` (formato en `docs/arquitectura.md`), dos formas paralelas A y B por curso en orden contrabalanceado, 66 ítems por forma en siete cursos (física 10, química 10, geometría 10, trigonometría 8, álgebra 10, aritmética 10, razonamiento matemático 8; desde el 7 nov, 2 por plantilla en los cursos de matemática), cada respuesta y cada distractor verificados con el motor de su plantilla. Aritmética y razonamiento matemático llevan 2 pares por cada uno de sus 4 módulos; trigonometría suma la circunferencia y el caso ambiguo; álgebra, el traductor de enunciados (y 2 de `cuadrado-crece` en reserva). Ningún ítem repite una predicción de escena ni un problema de generador (prueba automática), la respuesta nunca está escrita en el enunciado, los atajos caen igual en A y B y las opciones tienen la misma forma. La salida y las soluciones las abre el profesor (`?salida=`, `?soluciones=`) y hay «Otro alumno en esta PC». Falta:
  - Al agregar una plantilla a un curso, sumar sus ítems (la prueba avisa).
  - Álgebra tiene 2 pares de `cuadrado-crece` en `reserva`: cuando esa plantilla entre al catálogo, pasarlos a `pares` (la prueba avisa) y bajar dos de la gráfica con perillas para no pasar de 10.
  - Vectores, del compendio (8 nov 2026, `rutina/vectores`): tres generadores nuevos en fisica.magnitudes-y-vectores (`vectores-ley-cosenos`, `vectores-componentes` y `vectores-productos`), con solución paso a paso, 600 semillas recalculadas aparte y 29 casos verificados a ciegas. El núcleo acepta ahora `negativos` y `texto` en `armar`, y trae `P.radical()`. Vectores 0.2.0 hecho (pestañas «Figuras» y «Componentes», 15 casos nuevos verificados a ciegas). `armarTexto` en el núcleo (alternativas de texto con clave canónica: (2a + b)/3, (3/5; −4/5)) y cuatro generadores más: `vectores-unitario`, `vectores-combinacion`, `vectores-division` y `vectores-poligono`, con 39 casos verificados a ciegas.
  - Movimiento circular, del compendio (8 nov 2026, `rutina/movimiento-circular`): cuatro generadores en fisica.movimiento-parabolico-y-circular (`circular-transmision`, `circular-mcuv`, `circular-enesimo-segundo` y `circular-encuentros`), con 63 pruebas y 600 semillas recalculadas por otro camino, y 46 casos verificados a ciegas. Los códigos CI del n-ésimo segundo llevan sufijos para que la medición distinga cada error. Escena `movimiento-circular` («El disco y sus flechas», 0.1.0) hecha: 23 pasos, 45 casos verificados a ciegas. 0.2.0 con la bobina y la escalera que resbala (centro instantáneo fuera de la barra), y enlace desde «Ruedas» de tiro-parabolico. Generadores G1, G5, G6, G7 y G9 hechos (`circular-mcu`, `circular-aceleracion-total`, `circular-horaria`, `circular-grafica` y `circular-giro-combinado`, con 55 casos verificados a ciegas). Lista cerrada. Pendientes menores en `rutinas/movimiento-circular.md`.
  - Compendios como mapa (8 nov 2026, decisión de Gerson): Gerson pasará los compendios tipo UNI (la serie Cuzcano primero) para los alumnos de 5.º. Solo se usan como mapa, nunca se copian. El flujo es mapa, comparación con la escena, errores y propuesta (versión nueva de la escena y generador propio); está en `docs/clasificacion/LEEME.md`. Los PDF van a `fuentes/libros/`, que no se versiona. Primero: análisis vectorial.
  - Investigación de matemática avanzada (7 nov 2026, `rutina/investigacion-mat`): informe `docs/investigacion/matematica-avanzada-ideas-erroneas.md` (cónicas, polares, matrices, binomio, complejos, espacio y conteo de figuras). Siete opciones pasan a parcial, con su fuente en la escena: CP3, MT4, BN12, BN21, CX17, CX18 y ESP-caras-perpendiculares (AFH). Ninguna documentada (solo se leyeron resúmenes); cónicas sigue toda como hipótesis; ningún dato peruano. Para Gerson: GE13 bajaría a parcial con la regla estricta, y los PDF de prioridad A de `fuentes/por-conseguir.md` subirían más respaldos.
  - Rutina verbal (8 nov 2026): e016 a e018 (oraciones incompletas, sentido contextual) en el índice; e019 a e021 (analogías de causa, e021 con base DESCUIDO : ACCIDENTE) también en el índice tras revisarlos de nuevo. Al integrarlos, «produce» pasó a leerse «De {a} se obtiene {b}» (producto material), para que ya no compita con «causa» («el virus da fiebre»).
  - Verbal B y C, dudas para Gerson (7 nov 2026; detalle en `rutinas/verbal-b.md` y `rutinas/verbal-c.md`): RV41 a RV58 sin dato; hechos por confirmar en t035, t037, t041 y t053; el papel de lectura cuenta cada texto como un problema (4 o 5 por módulo, con 13 a 20 preguntas): ¿cumple la regla de 5 a 10 problemas? Resuelto por verbal C: RV58 en 10 textos (antes RV6, RV5 o null), papel para los 7 módulos de lectura (`herramientas/papel-lectura.js`, corre con `npm run catalogo`) y textos de dificultad 3 en tipología (t055), resumen (t056) y contexto (t057).
  - Reserva de matemática C (7 nov 2026, `rutina/matematica-c`): 16 pares nuevos verificados con los motores, para elegir con el temario del piloto. Álgebra: cx-01/02 (complejos), re-01/02 (reales), po-01/02 (polinomios) y pl-01/02 (programación lineal). Geometría: cg-01/02 (congruencia), sa-01/02 (segmentos y ángulos) y si-01/02 (simetría). Trigonometría: tt-01/02 (transformaciones). GE11 queda como parcial en el banco, igual que en la escena y el informe.
  - Sin ítems todavía (la prueba avisa): sucesiones en álgebra, tiro parabólico y estática en física, mol y composición en química; razonamiento verbal no tiene banco (formato lectura).
  - La equivalencia de A y B es por diseño (ítems isomorfos); hay que confirmarla con los datos del colegio (columna «Forma A / B»).
  - Los enunciados no usan los colores de variables (una prueba es neutra) ni tienen figuras: todo va en texto.
  - La respuesta en `app/datos/pruebas.json` va mezclada, no cifrada: no es seguridad real.
  - **Decidido (Gerson, 6 nov 2026):** la entrada no es obligatoria mientras estemos en modo prueba (se puede decir «Ahora no» y se registra cuántas unidades del curso ya había abierto); quizá lo sea más adelante. **Para Gerson:** ¿revisar la redacción de los 130 ítems con un profesor del colegio? La guía para profesores (la4) debe explicar los enlaces `?salida=` y `?soluciones=` y el botón «Otro alumno en esta PC».
- **Inicio (7 nov 2026):** «Lo que sigue» recomienda solo unidades con módulo, una por curso primero, y abre el módulo directo.
- **Planificador por semana del CEPRE y modo examen con tiempo:** estaban en la referencia de interfaz y todavía no existen.
- **Medición:** por decisión de Gerson (5 nov 2026), solo se exportan archivos. Un servidor (Railway está disponible) queda para después.

### 4. Lanzamiento en el colegio (diciembre de 2026)

- **Por confirmar con Gerson:**
  - La fecha exacta; el plan asume la semana del 14.
  - El permiso del colegio para los datos anónimos.
  - La programación anual de física, química y matemática del colegio, para corregir el campo `grado` de cada unidad (`catalogo/LEEME.md`, sección "Grados").
- **la2:** probar en celulares de gama baja y en las computadoras del colegio (navegador, resolución, velocidad). **Medido en emulación el 7 nov 2026** (`docs/medicion/la2-gama-baja-2026-11-07.md`): con el service worker, las escenas cargan en 0,5 s (máximo 1,3 s) y el toque responde en 100 ms en un celular con CPU ×6; /app/ por 3G lenta tarda 9 s la primera vez (espera catalogo.json y pruebas.json) y 0,4 s después; la precarga son 8,2 MB sin comprimir. Peores: cinética (19 a 30 FPS), líquidos y sólidos (32), pH y dados (43), gases (49). Causa común: ninguna escena limita devicePixelRatio. Arreglado ya: /nucleo/elementos.js en la caché y el Banco Óptico sin Google Fonts. Hecho después: /app/ pinta sin esperar pruebas.json (interactivo por 3G a los 2,5 s, antes 9,1 s) y al subir VERSION solo se baja lo nuevo (26 KB en vez de 8 MB), y se arregló que una escena cambiada sin subir VERSION no llegaba nunca (ver `docs/arquitectura.md`, «Carga, caché y despliegue»). Hecho también: `Celular.dpr()` (máximo 1,5 en el celular) en las 69 escenas, `Celular.bucle()` que se duerme cuando nada se mueve o el lienzo no se ve (circuitos, equilibrio, cinética, pH, soluciones, gases, celda, líquidos), `Celular.variable()` que guarda los colores, cinética con grilla de choques (mismos resultados al bit) y cuentas de fondo en tiempo libre, y dados con las tablitas dibujadas una vez. Celular CPU ×6: cinética 18 → 30 FPS, líquidos 31 → 49, ninguna escena bajo 30; toque mediano 104 → 90 ms. Pendiente: el bucle perpetuo de ondas; pH, líquidos, dados y orden de información siguen apenas bajo 50 FPS. Decidido: en cinética cada cuadro avanza como máximo 1/60 s de película (en un celular lento la película va más despacio en vez de amontonar pasos). Para la3 (hosting): gzip o brotli y ETag. Falta la prueba en aparatos reales del colegio.
  - Rendimiento de ácidos y bases y de líquidos y sólidos (7 nov 2026, rutina de química B): fondo fuera de pantalla en ácidos y hoja de moléculas en líquidos; peor ventana animada de 50,6 a 58,4 FPS (ácidos) y paso a paso de 53,4 a 58,9 (líquidos), sin cambio visible (capturas comparadas). Queda el costo del reacomodo de la página al responder (`compactar`), común a todas las escenas. Datos y scripts en `rutinas/quimica-b-medicion/`.
- **la3:** publicar con dominio y HTTPS. Una PWA necesita HTTPS para instalarse y funcionar sin conexión. **Listo para publicar (7 nov 2026):** `vercel.json` y `.vercelignore` (solo se publican app/, nucleo/, plantillas/ y contenido/), con los pasos en `docs/publicar.md`. Falta que Gerson importe el repo en Vercel con su cuenta y elija la rama. Probado antes: recorrido completo de la copia publicable sin errores ni 404, y todo el catálogo sin conexión. Arreglado de paso (sw v125): una escena que nunca se abrió con conexión no abría sin conexión.
- **la4:** hecha (7 nov 2026, rutina verbal): `docs/guia-profesores.md`, contrastada con el código por un revisor (código de colegio, pruebas de entrada y salida con sus enlaces, «Otro alumno en esta PC», clase de 45 minutos, descarga y análisis de datos). Arreglado al integrarla: «Borrar mi avance» ya no borra las pruebas de razonamiento verbal. Quedan: verbal no tiene «Ahora no» en la entrada (decidir si debe), `?soluciones=razonamiento-verbal` no muestra la revisión pregunta por pregunta, y completar el punto 2.1 de la guía cuando la app tenga dirección pública (la3).

### 5. Después del lanzamiento

- Analizar los datos y confirmar o descartar las hipótesis de error (la6).
- Destilar el método de construcción de plantillas en un skill (f2a). Ya hay 3 escenas y 2 módulos de predicciones como base.
- Material de la UNA Puno cuando llegue (f2c). UNSA y UNSAAC también.
- Las ideas de `docs/vision-futura.md`, que no se desarrollan todavía.
- Idea, sin hacer: una pregunta de **transferencia lejana** por curso en las pruebas de entrada y salida. Sería una tarea inversa o en otro punto (por ejemplo, dar las cintas y pedir cuántos niños hay), aparte de los pares de transferencia cercana. El criterio está en `docs/arquitectura.md`. Hay propuestas concretas para fis-08, fis-10, geo-05, geo-10, fr-02, tri-10, rm-08 y qui-01 en la revisión del 7 nov 2026 (`rutinas/quimica.md`).

## Para Gerson

- El documento fundacional vivo en claude.ai no se actualizó con los cambios de alcance: los cursos de matemática y razonamiento, el lanzamiento en el colegio y la dirección acogedora. Conviene copiarlos desde `docs/fundacional.md` y `docs/diseno.md`.
- `fuentes/por-conseguir.md` tiene la lista de libros y artículos que faltan.
