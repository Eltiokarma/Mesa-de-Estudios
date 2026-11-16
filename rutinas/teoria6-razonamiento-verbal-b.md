# Ronda 6 · razonamiento verbal B: «Lee» y «Así se resuelve» (16 nov 2026)

Encargo: `rutinas/encargos/teoria6-razonamiento-verbal-b.md`. Rama `teoria6/razonamiento-verbal-b`, un commit por unidad. No se integró a main.

Las 9 unidades de la lista traen los dos momentos en **todas** sus ideas: 25 ideas, con 75 tarjetas de «Lee» y 25 ejercicios resueltos.

## Cómo quedó armado (igual en las 9 unidades)

- **«Lee»:** 3 tarjetas por idea.
  - Las dos primeras dan contexto cercano (Juliaca, Puno, la combi, la feria, la asamblea) y el vocabulario de la idea.
  - La última dice qué mirar en el juego.
  - Cada tarjeta se revisó contra la pregunta y las opciones de «Predice».
  - Dos tarjetas adelantaban la respuesta y se corrigieron al integrar (ver «Lo corregido en la revisión»).
- **«Así se resuelve»:** cada idea tiene un banco propio `RES_*`, con 3 o 4 ítems y la misma forma que el banco de «Ahora tú» (texto, correcta, distractores con su código y su porqué).
  - El ítem se elige con `azar(semilla + 900)`; el `azar` es el mismo de `razones-y-proporciones.js`.
  - El banco es aparte para no regalar los casos de «Ahora tú», que no se tocó.
  - En **textos discontinuos** no hay banco: el mismo generador y las mismas cuentas de «Ahora tú» (`pct`, `mejor`, `masAprob`, `seVe`), con otras semillas. Solo cambia el contexto del enunciado (`CTX_*`).
- **Pasos:** siempre pide · datos · regla · aplica · sentido.
  - `regla` dice la regla con palabras del alumno.
  - `aplica` («Lo aplico») trae un `dibujo` que marca en la figura la evidencia y el sello.
  - `sentido` descarta la opción más tentadora y dice por qué no sirve.
- **Texto de lectura:** va en el `dibujo` (pieza `rv-texto`, la misma que usa «Ahora tú»). Así no cuenta para los topes, como dice `docs/teoria.md` §5.
- **Recorrido de Playwright:** `rutinas/teoria6-razonamiento-verbal-b/pw.js` (`node rutinas/teoria6-razonamiento-verbal-b/pw.js 4173 <salida> <unidad> [idea]`).

## Por unidad

### resumen-y-sintesis
| Idea | «Lee» cuenta | «Así se resuelve» |
|---|---|---|
| alcance | contarle la reunión a la prima en corto; resumen literal o interpretativo; arrastrar el círculo por el original | qué resumen conserva el alcance («muchos», «algunos», «menos»): lago, comedor popular, simulacros, crías de alpaca |
| parafrasis | explicarle a la abuela con otras palabras; por qué lo pide el examen; fijarse en quién, qué y por qué | qué versión es paráfrasis fiel: tren Juliaca–Cusco, asamblea, puente y combis, biblioteca |
| sintesis | juntar lo que dijeron cinco vecinos; qué es una fuente; rastrear cada frase de A y B | qué síntesis de A y B es fiel: celular en clase, carretera, clases virtuales, Candelaria |

### textos-discontinuos
| Idea | «Lee» cuenta | «Así se resuelve» |
|---|---|---|
| tabla | tablas de todos los días (combis, mercado, libreta); fila, columna y total; alternar cantidad y proporción | qué fila tiene la mayor proporción, que no es la de más cantidad (barrios, talleres, secciones, comités) |
| escala | gráficos en noticieros y afiches; eje y escala; mirar el largo de las barras | cuánto % más vale B que A con el eje cortado; en «aplica» el eje pasa a cero |
| texto-y-grafico | el afiche de la posta como texto mixto; qué es una infografía; qué se marca con cada afirmación | cuántas toneladas creció una ciudad (Ayaviri–Lampa, Yunguyo–Pomata, Ilave–Acora, Putina–Moho) |

### inferencias
| Idea | «Lee» cuenta | «Así se resuelve» |
|---|---|---|
| necesaria-probable | los paraguas mojados en la combi («afuera llueve»); premisas y conclusión; el círculo turquesa | qué tan respaldada está una conclusión: librería del jirón Lima (necesaria), río Coata (probable), Marta y la cooperativa, Jorge y la selección (sin respaldo) |
| implicito | explícito e implícito; lo implícito va en palabras chiquitas; probar el banco «Prueba con» | qué da por supuesto una oración con «sigue», «otra vez», «ya» o «tampoco» |
| intencion-global | para qué se escribe (afiche de la Candelaria, receta, noticia); sentido global (nuevo en el glosario); qué mirar en el aviso | qué busca un texto leído completo: vacunas, vóley, botellas, helada |

### compatibilidad
| Idea | «Lee» cuenta | «Así se resuelve» |
|---|---|---|
| cuatro-casillas | compatibles e incompatibles con la vida diaria; las casillas; mirar los años en el texto de Ccota | compatible, incompatible o no se puede saber: combi de la línea 12, concurso de danzas, zampoña, carrera de las 8 |
| idea-principal | qué es la idea principal; cómo viene la pregunta en el examen; contar los choques en el texto de la bicicleta | cuál de tres afirmaciones choca con la idea principal (caminar, totora, ahorro); el orden cambia con la semilla |

### extrapolacion
| Idea | «Lee» cuenta | «Así se resuelve» |
|---|---|---|
| caso-nuevo | la tía que se pregunta si lo de Arequipa pasará en Juliaca; caso nuevo y condiciones; turquesa o rojo en la totora | llevar el texto a un caso nuevo: chalona en un cuarto húmedo, queso un martes de fiesta, quinua de Cabana, ropa con lluvia |
| condicional | reglas con «si» de la casa; el subjuntivo; cuándo el sello dice «Seguro» | regla con «si» más un dato, en los cuatro casos (afirmar o negar la condición, afirmar o negar el resultado) |
| mundos-posibles | imaginar Puno sin el lago; revisar oración por oración; los colores del subrayado | cómo queda la oración n en un mundo posible: Moho, impresora, biblioteca, Rosa y el api |

### textos-argumentativos-y-dialecticos
| Idea | «Lee» cuenta | «Así se resuelve» |
|---|---|---|
| tesis-razones | la asamblea del colegio (tesis y argumentos); la objeción; el sello del papel de cada oración | cuál es la tesis, con trampas de «algunos dicen», «pero» y «sin embargo»: bicicleta, desayuno escolar, lengua materna, lectura |
| cuestion-y-posturas | dos invitados en la radio; punto común y cuestión disputada; los sellos de A y B | debate A/B: la cuestión, el punto común, la postura de A, la de B |
| tesis-antitesis-sintesis | la junta vecinal y la calle de la feria; síntesis y texto dialéctico; probar los cierres A, B y C | qué propuesta es la síntesis: hora de salida, perros de la calle, pesca, exámenes |

### texto-y-contexto
| Idea | «Lee» cuenta | «Así se resuelve» |
|---|---|---|
| deicticos | el mismo «aquí» desde Juliaca y desde Lima; qué es un deíctico; probar «sin datos» | qué día es el «mañana» de un mensaje leído otro día (dos casos caen en fin de mes); las fechas las calcula `siguiente()` |
| emisor-destinatario | emisor y destinatario; usted o tú (registro); qué cambia en el mensaje de Lucía | a quién va dirigido un mensaje; se descarta a la persona que solo se menciona (RV50) |
| misma-frase | hablar también es hacer (actos de habla); mirar la situación; el sello verde | qué hace una frase en su situación; se descarta la lectura literal (RV49) |

### textos-filosoficos-y-cientificos
| Idea | «Lee» cuenta | «Así se resuelve» |
|---|---|---|
| texto-cientifico | el informe de profesores de Puno; dato, método, hipótesis y límite; adivinar la pieza antes del sello | qué conclusión respalda un informe: celular y sueño, quinua y granizo, truchas, desayuno |
| texto-filosofico | preguntas que no se miden en laboratorio; tesis y objeción; con qué palabras empieza cada oración | qué entiende el autor por «X»: respeto, trabajo, sabio, generoso; se descarta la idea común (RV53) |

### lectura-en-ingles
El texto de lectura, el enunciado y la respuesta van en inglés, como en «Ahora tú». En la idea 1 la respuesta va en español, también como en «Ahora tú». Las tarjetas y los pasos van en español.

| Idea | «Lee» cuenta | «Así se resuelve» |
|---|---|---|
| palabras-que-enganan | cognados de los letreros de Puno para turistas; falso amigo («carpet» = alfombra) | la versión en español que dice lo mismo: embarrassed, exit, will travel, a few; la regla cambia según la clase de palabra |
| main-idea | las preguntas también vienen en inglés (main idea, summary); no hace falta entender cada palabra | la main idea: alpacas, huerto escolar de Juliaca, papel o pantalla, uros |
| stated-or-not | qué es un statement y sus tres casillas; el testigo que señala la prueba | true, false o not stated: Carmen, el bus a Puno, Miguel, el museo |

## Semillas revisadas a mano
Las respuestas son correctas y los pasos se sostienen en todas estas semillas:

- Resumen y discontinuos: 0, 1 y 2 de las 6 ideas.
  - Cuentas comprobadas, por ejemplo 34/40 = 85 % frente a 38/100, 4/70 ≈ 6 % con 1,8 veces aparentes, y 66 − 58 = 8 t.
  - Las 12 semillas, con script: la ganadora de la tabla tiene de verdad la mayor proporción y no la mayor cantidad, y la resta cuadra.
- Inferencias: 0, 1, 2 y 9 de las 3 ideas.
- Compatibilidad: 0, 1, 2, 3, 5, 8 y 11 de las 2 ideas. En la idea 2 la correcta cambia de posición entre semillas.
- Extrapolación: 0, 1, 2, 3, 6 y 10 de las 3 ideas.
- Argumentativos: idea 1, 0, 1, 2 y 10; idea 2, 3, 5 y 10; idea 3, 1, 3, 5 y 10.
- Texto y contexto: 0, 2, 3, 4, 5 y 7 de las 3 ideas, más las 12 de deícticos (fechas de fin de mes).
- Filosóficos y científicos: 0, 2, 3, 4, 5 y 7 de las 2 ideas.
- Lectura en inglés: 0, 1 y 2 de las 3 ideas.
- En la integración leí además la semilla 0 de las 25 ideas, junto con su «Lee».

## Lo corregido en la revisión
- **Argumentativos, tesis-antitesis-sintesis, «Lee»:** la tarjeta decía «un texto dialéctico, sea cual sea su cierre». Eso deja deducir la respuesta de «Predice» («¿tiene que terminar en una síntesis?» → no). Quité el inciso.
- **Discontinuos, escala, «Lee»:** la tarjeta decía «el eje no siempre empieza en cero: a veces arranca en 60 o en 80». Eso entrega la trampa de la predicción. Ahora dice «cada marca del eje lleva su número escrito».
- **Inferencias y compatibilidad:** las citas del enunciado salían con punto antes de cerrar las comillas («… cooperativa.»?). Ahora salen sin el punto.

## Objetos que la figura no dibuja
En verbal, lo que se arrastra es la manija común de la app: un **círculo de color** (anillo con halo, `te-manija`). Varios textos lo llamaban «marcador» y en la figura no hay marcador. Los textos ahora dicen lo que se ve:

- **resumen-y-sintesis:**
  - Mesa «Arma tu resumen»: «pasa el marcador por el original» → «arrastra el círculo por el original».
  - Reto de esa mesa: «pon el marcador sobre ella» → «pon el círculo sobre ella».
  - Reto de la mesa «Paráfrasis o inferencia»: «Pon el marcador en la parte…» → «Pon el círculo en la parte…».
- **inferencias**, mesa «Tapa una premisa»:
  - Consigna: «arrastra la cinta para tapar una frase» → «arrastra el círculo rojo a una frase del texto: una banda gris la tapa».
  - Rótulo: «Cinta: sin usar» → «Tapar: nada».
  - Etiqueta de la manija: «cinta…» → «círculo que tapa una frase».
- **compatibilidad**, mesa «Todas, alguna, ninguna»: «Arrastra el marcador…» → «Arrastra el círculo turquesa…».
- **extrapolacion:**
  - Ideas 1, 2 y 3, y la mesa «varios-cambios»: «el marcador» → «el círculo turquesa».
  - Reto «deja el marcador en la condición» → «deja el círculo…».
  - Etiquetas de arrastre: «marcador de…» → «círculo de…».
- **textos-argumentativos-y-dialecticos:**
  - Ideas 1 y 2, y la mesa «debate-armado»: «el marcador» → «el círculo naranja».
  - Tres retos: «lleva / pon / deja el marcador» → «… el círculo».
  - Etiquetas de arrastre: lo mismo.
- **texto-y-contexto:**
  - Mesa «calendario»: «arrastra el marcador a una palabra de tiempo» → «arrastra el círculo naranja…».
  - Idea 1: «Cambia la tarjeta de contexto» → «Cambia el contexto de abajo», porque se dibuja como lista, no como tarjeta.
- **textos-filosoficos-y-cientificos:** ideas 1 y 2, «Arrastra el marcador por…» → «Arrastra el círculo naranja por…».
- **lectura-en-ingles:** ideas 1, 2 y 3, y la mesa «cuantificadores»: «el marcador» → «el círculo naranja».
- **Sin cambiar (no se ven en pantalla):** las etiquetas accesibles «marcador de la oración / palabra» de inferencias, filosóficos y lectura en inglés.
- **textos-discontinuos:** sin casos.
- **Credibilidad:** no encontré ningún texto increíble en las 9 unidades.

### Pedidos de vectores para Gerson
- **Ninguno obligatorio:** con los cambios de arriba, todos los textos dicen lo que se ve.
- **Opcional:** si Gerson prefiere que verbal diga «marcador» (es más natural para «marcar la evidencia»), haría falta un vector de **resaltador o marcador** como manija de la pieza `rv-texto`. Serviría para todas las ideas de verbal que se arrastran (las 9 unidades y sus mesas). Con ese vector, las consignas podrían volver a decir «arrastra el marcador».

## Lo que no se pudo
- No agregué «cuantificador» al glosario de lectura en inglés: ya lo define `compatibilidad` y el test no deja repetir términos dentro del curso. El lector lo marca igual.
- **Fuera de mi alcance, anotado:** en el «Ahora tú» de la idea `tabla` (textos discontinuos), la pregunta y las opciones dicen «Grupo A», pero las filas de la tabla dicen «Colegio A». No lo corregí porque el encargo no deja tocar «Ahora tú». Conviene que la sesión principal lo decida.

## Pruebas
- **Después de cada unidad:**
  - `npm run catalogo`;
  - `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'`, en verde (764 de 764);
  - recorrido de Playwright a 360 × 780 de una idea, con un alumno `{ uni: 'unmsm', grado: '5' }`.
- **Qué comprueba el recorrido:**
  - la idea abre en «Lee» y el botón pasa de tarjeta en tarjeta;
  - en la última, el botón dice «Siguiente: Juega», e «Ir directo a jugar» salta al juego;
  - con `momento: 'resuelve'`, el botón revela los pasos uno por uno y sale la respuesta;
  - «Otro ejemplo» cambia el enunciado;
  - no hay errores de consola.
- **Ideas recorridas:** la primera idea de cada unidad. En lectura en inglés, además, stated-or-not.
- `npm test` completo antes del último push: 8788 de 8788 en verde.

## Lo no verificado
- **En el navegador, solo una idea por unidad:** las otras 15 ideas pasan el validador (12 semillas, topes y tipos), pero no las recorrí en Playwright.
- **Capturas:** las miré en la primera idea de algunas unidades, no en todas. Quedan sin mirar el largo de sellos como «mañana = 1 de setiembre» (texto y contexto) y el sello de la sección «Para» en emisor-destinatario.
- **Celular real y modo oscuro:** no se probaron.
- **Lectores reales:** ningún profesor ni alumno leyó todavía los textos de los bancos `RES_*`. Los escribimos y revisamos nosotros, no hubo revisión a ciegas.
