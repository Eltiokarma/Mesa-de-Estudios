# CLAUDE.md — Laboratorio de Admisión

Lee esto antes de trabajar en el repo. Responde y escribe en español peruano informal con Gerson; el contenido para alumnos va en español claro y neutro.

## Qué es

App de bajo costo para postulantes a universidades peruanas (UNI, San Marcos, UNA Puno, UNSA, UNSAAC). Cursos: física, química, aritmética, álgebra, geometría, trigonometría, razonamiento matemático y razonamiento verbal (decisión de Gerson, 4 nov 2026); el catálogo crece sin tocar código. Cada problema de examen se convierte en una escena visual donde cada variable de la ecuación está amarrada, por color, a un objeto que se ve. El documento que manda es `docs/fundacional.md`: principios, taxonomía, especificación de plantilla, arquitectura, fuentes y hoja de ruta.

## Reglas que no se rompen

1. **La física vive en el motor, nunca en el LLM.** Un modelo de lenguaje puede leer un enunciado y traducirlo a parámetros; el cálculo y el dibujo los hace código determinístico.
2. **Toda plantilla trae casos de prueba** (`casos.json`) verificados con cálculo independiente. No se publica nada que no los pase.
3. **Predecir antes de ver.** Cada escena pide al menos una predicción y bloquea el avance hasta que el alumno responda. Las opciones incorrectas salen de errores reales de postulantes.
4. **Un color por variable**, el mismo en enunciado, dibujo y ecuación.
5. **Contenido propio.** Los PDFs de `fuentes/` (manuales de academia, libros, exámenes) sirven para saber qué y cómo se pregunta. Nunca se copian sus problemas, textos ni figuras al producto.
6. **Lápiz y papel.** Cada plantilla trae de 5 a 10 problemas para resolver sin la escena.

## Estructura

```
docs/fundacional.md            documento base (copia del doc vivo en claude.ai)
docs/arquitectura.md           capas (catálogo, módulos, núcleo, app, datos), formatos de módulo y cómo agregar cursos o unidades
docs/metodo/                   cómo se construye una plantilla con subagentes (briefs del constructor, verificador y revisor)
docs/pendientes.md             traspaso: qué hay hecho, cómo arrancar y pendientes en orden (léelo al empezar)
docs/diseno.md                 sistema de diseño: colores de marca y de variables, componentes, celular y pantalla grande
catalogo/                      qué se enseña: cursos, unidades, en qué universidad entra cada una (JSON; ver catalogo/LEEME.md)
plantillas/<tema>/plantilla.json  ficha del módulo: unidades que cubre, estado, versión, archivos
docs/hoja-de-ruta.md + .json   hoja de ruta; el JSON es la fuente, se edita en http://localhost:4173/gestion/ (npm run dev)
app/                           la PWA: lee app/datos/catalogo.json (npm run catalogo lo arma desde catalogo/); sw.js la deja sin conexión
gestion/                       página del Gantt navegable y editable
nucleo/                        piezas compartidas: azar con semilla, armado de alternativas, medición (navegador y Node)
plantillas/<id>/generador.js   módulos de formato "predicciones": generan problemas con errores típicos (ver nucleo/predicciones.js)
herramientas/analizar-medicion.js  junta los datos que exportan los alumnos y resume entrada, salida y errores por módulo
herramientas/servidor.js       servidor local sin dependencias: npm run dev → http://localhost:4173
docs/vision-futura.md          ideas de Gerson para después (todos los grados, seguimiento, curar contenido externo, historia); no se desarrollan aún
docs/taxonomia-uni-2026.md     temario de física y química de la UNI (sílabo CEPRE-UNI 2026-2)
docs/taxonomia-unmsm-2026.md   temario de San Marcos (CEPRE-UNMSM 2026-I) comparado con la UNI
docs/investigacion/            informes de investigación por tema (ideas erróneas, fuentes)
plantillas/<tema>/index.html   la escena (HTML; carga motor.js de la misma carpeta)
plantillas/<tema>/motor.js     la física, sin DOM; sirve en el navegador y en Node
plantillas/<tema>/casos.json   casos de prueba del motor
plantillas/<tema>/motor.test.js  corre casos.json contra el motor (npm test o node --test)
fuentes/por-conseguir.md       lista de libros, tesis y artículos que faltan, con prioridad
herramientas/                  OCR de PDF escaneados, esquema y script de clasificación de preguntas
docs/clasificacion-unmsm.md    qué pregunta San Marcos en física y química (datos en docs/datos/)
fuentes/drive.tsv + descargar.sh  PDF de Google Drive (simulacros y temarios de San Marcos); en una sesión nueva: bash fuentes/descargar.sh
fuentes/prospectos/            prospectos y temarios oficiales (no se versionan si son pesados o con derechos; ver .gitignore)
fuentes/examenes/              exámenes pasados
fuentes/libros/                libros y manuales de consulta
```

## Estado (5 nov 2026)

**Sesión nueva: lee `docs/pendientes.md`.** Ahí está qué hay hecho, cómo arrancar y los pendientes en orden de prioridad.

- Plantillas: Banco Óptico, espejos esféricos, circuitos, calorimetría, energía, MRUV, reactivo limitante con partículas, gases, soluciones, pH, celda galvánica, la ampliadora, el triángulo que se estira, el ángulo inscrito, la cinta del radio, la gráfica con perillas, dinámica, equilibrio químico, cinética, la regla de tres, la circunferencia trigonométrica, los dos dados, tiro parabólico, mol y composición, el caso ambiguo, el traductor de enunciados, la torre de fichas, el cuadrado que crece, la barra que se parte, el polígono que se abre, el tablero de las pistas, exponenciales y logaritmos, identidades trigonométricas, el sólido que se abre, el plano con imán, estática, átomo y tabla y la máquina de Ruffini la alcancía que gana interés las flechas que se suman el reloj y el calendario el rectángulo de fichas balancear es contar átomos una sola respuesta la molécula en 3D la escuadra y las paralelas choques en un riel las fichas que se agrupan las cargas que se empujan el cordel que encierra presión, Pascal y Arquímedes el armador de triángulos la lupa y la balanza el frasco cerrado imanes, cables y cargas el resorte, el péndulo y la sombra que gira la bodega en gráficos el tablero de las llevadas ondas en una cuerda y sonido y el árbol de las funciones (escenas); reactivo limitante y porcentajes sucesivos (predicciones). `npm test`: 2777 pruebas en verde.
- App PWA con medición anónima, lápiz y papel, celular y laboratorio de cómputo, y diseño acogedor (`docs/diseno.md`).
- Lanzamiento: un colegio, 3.º a 5.º de secundaria, diciembre de 2026 (fecha por confirmar).

### Historia

- Fase 0 en curso. Hecho: documento fundacional, Banco Óptico (lente sola + sistemas de 2 o 3 lentes) en `plantillas/optica-lente-delgada/`.
- Investigación de ideas erróneas en óptica (lentes): `docs/investigacion/optica-ideas-erroneas.md`. Conclusión clave: los errores conceptuales están documentados; los de cálculo (signos, sistemas, aumento total) no, y se tratan como hipótesis. Espejos esféricos: `docs/investigacion/optica-espejos-esfericos.md`, con predicciones y casos de prueba propuestos para la plantilla. Cinemática (MRUV, caída libre, tiro parabólico): `docs/investigacion/cinematica-ideas-erroneas.md`; aquí sí hay datos fuertes (Beichner 1994, Thornton y Sokoloff 1998, Prescott y Mitchelmore 2005). Dinámica: `docs/investigacion/dinamica-ideas-erroneas.md`, con el único dato peruano encontrado (FCI en 4535 alumnos de la PUCP, Castillo y otros 2013). Además: estática y energía, choques/gravitación/ondas, fluidos/calor/termodinámica, y electricidad/magnetismo/refracción/física moderna, cada uno en su informe de `docs/investigacion/`. Química: estequiometría, gases y soluciones, equilibrio/ácidos/electroquímica, y átomo/tabla periódica/enlace.  Matemática (6 nov 2026): trigonometría, geometría, álgebra y funciones, y aritmética con razonamiento matemático; sus cifras salen de resúmenes y están por verificar con los PDF. Libros y artículos pendientes de conseguir: `fuentes/por-conseguir.md`.
- Nomenclatura inorgánica (7 nov 2026, rutina de química B): `plantillas/nomenclatura-inorganica/` (el árbol de las funciones: estados de oxidación, árbol de óxidos, hidróxidos, ácidos y sales, mesa de fichas que cruza cargas y los tres nombres a la vez; 25 casos verificados aparte).
- Ondas (7 nov 2026, rutina de física): `plantillas/ondas/` (ondas en una cuerda y sonido: rapidez que decide la cuerda, λ y f, estacionarias, intensidad; 31 casos verificados aparte).
- Cuatro operaciones (7 nov 2026, rutina de aritmética): `plantillas/cuatro-operaciones/` (el tablero de las llevadas: complemento aritmético, préstamos, cifras que faltan, sumatorias, división por defecto y por exceso y criptoaritmética; 19 casos verificados aparte).
- Tablas y gráficos (7 nov 2026, rutina de razonamiento matemático): `plantillas/tablas-graficos/` (la bodega en gráficos: eje que no empieza en 0, absoluto contra porcentual, sectores, campeonato y suficiencia de datos; 21 casos verificados aparte).
- MAS (7 nov 2026, rutina de física): `plantillas/mas/` (el resorte, el péndulo y la sombra que gira: período, energía, círculo de referencia y péndulo con g efectiva; 23 casos verificados aparte).
- Magnetismo (7 nov 2026, rutina de física B): `plantillas/magnetismo/` (imanes, cables y cargas: la carga quieta no siente fuerza, la mano derecha en 3D, campo del hilo, fuerzas entre cables y solenoide; 21 casos verificados aparte).
- Líquidos y sólidos (7 nov 2026, rutina de química): `plantillas/liquidos-y-solidos/` (el frasco cerrado: presión de vapor, ebullición y altitud, fuerzas intermoleculares, diagrama de fases y gas sobre agua; 52 casos verificados aparte).
- Materia y energía (7 nov 2026, rutina de química B): `plantillas/materia-energia/` (la lupa y la balanza: elemento, compuesto y mezcla, fases y componentes, físico contra químico con la balanza, separación y E = mc²; 24 casos verificados aparte). Informe nuevo: `docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md`.
- Congruencia (7 nov 2026, sesión de matemática B): `plantillas/congruencia/` (el armador de triángulos: criterios con piezas que se arman, la trampa LLA con el compás, mediatriz, bisectriz, base media y mediana a la hipotenusa; 20 casos verificados aparte).
- Fluidos (7 nov 2026, rutina de física): `plantillas/fluidos/` (presión, Pascal y Arquímedes: recipientes de formas distintas, tubo en U, prensa y empuje; 18 casos verificados aparte, con los datos de Loverude 1999).
- Máximos y mínimos (7 nov 2026, rutina de razonamiento matemático): `plantillas/maximos-minimos/` (el cordel que encierra: perímetro fijo y suma fija, corral contra la pared, recorrido mínimo con reflejo, precio que maximiza el ingreso y menor número de colores de un mapa; 22 casos verificados aparte).
- Electrostática (7 nov 2026, rutina de física B): `plantillas/electrostatica/` (cargas que se empujan: Coulomb con las dos flechas iguales, esferas colgadas, superposición, campo y potencial por separado, trabajo, condensadores y contacto; 22 casos verificados aparte).
- Numeración (7 nov 2026, rutina de aritmética): `plantillas/numeracion/` (las fichas que se agrupan: cambio de base, descomposición polinómica, cifras válidas, base desconocida, capicúas y cifras de páginas; 19 casos verificados aparte).
- Choques (7 nov 2026, rutina de física): `plantillas/choques/` (choques en un riel: cantidad de movimiento que se conserva, energía cinética que se pierde, impulso y restitución; 21 casos verificados aparte).
- Segmentos y ángulos (7 nov 2026, con subagentes): `plantillas/segmentos-angulos/` (la escuadra y las paralelas: segmentos, complemento y suplemento, los ocho ángulos, ¿son paralelas?, quiebre y serrucho; 21 casos verificados aparte). Paleta común de elementos de química en `nucleo/elementos.js`.
- Enlace (7 nov 2026, rutina de química): `plantillas/enlace/` (la molécula en 3D: Lewis, pares libres, forma por repulsión, dipolos que se suman al girar y enlace iónico; 58 casos verificados aparte).
- Funciones trigonométricas inversas (7 nov 2026, sesión de matemática A): `plantillas/funciones-trig-inversas/` (la ventana principal: un solo corte de y = k cae en la ventana, reflejo en y = x, compuestas con el triángulo y suma de arcotangentes; 19 casos verificados aparte).
- Balance de reacciones (7 nov 2026, con subagentes): `plantillas/balance-reacciones/` (balancear es contar átomos: subíndice contra coeficiente, el frasco que no es la ecuación, tanteo, conservación de la masa, números de oxidación e ion-electrón; 20 casos verificados aparte).
- Divisores (7 nov 2026, con subagentes): `plantillas/divisores/` (el rectángulo de fichas: divisores, criba, tabla de exponentes, criterios, restos y restos potenciales; 19 casos verificados aparte).
- Relojes y calendarios (7 nov 2026, sesión de matemática B): `plantillas/relojes-calendarios/` (ángulo entre las agujas con minutero arrastrable, superposiciones, adelantos y atrasos, campanadas, bisiestos y día de la semana; 20 casos verificados aparte).
- Vectores (7 nov 2026, con subagentes): `plantillas/vectores/` (flechas que se suman: polígono, paralelogramo, rango de R, componentes, unitario, hexágono y la balanza de dimensiones; 19 casos verificados aparte).
- Interés (7 nov 2026, sesión de matemática B): `plantillas/interes/` (la alcancía que gana interés: torre con la capa de interés sobre interés, recta contra curva, tasa efectiva, capitalización y descuentos; 20 casos verificados aparte).
- Polinomios (7 nov 2026, sesión de matemática A): `plantillas/polinomios/` (la máquina de Ruffini: fichas con el 0 que falta, el resto es la altura P(a) en la curva, divisor ax + b con el cociente falso, grados, resto por sustitución y raíces racionales; 22 casos verificados aparte).
- Razonamiento verbal, tercera tanda (7 nov 2026): t013 a t018 en `contenido/razonamiento-verbal/` (Caral, la quena, el celular en el aula, vacunas, Chan Chan y los ríos que vuelan), revisados a ciegas; 18 textos de práctica.
- Átomo y tabla (7 nov 2026, rutina de química): `plantillas/atomo-y-tabla/` (partículas, configuración con cajas, números cuánticos y la tabla de Z = 1 a 36 como mapa de energía de ionización, radio y electronegatividad; 29 casos verificados aparte; datos de tabla contrastados en parte con fuentes secundarias).
- Estática (7 nov 2026, rutina de física): `plantillas/estatica/` (barra con peso propio, momentos respecto a cualquier punto, bate cortado, nudo, polea y roce estático; 21 casos verificados aparte). Además, `nucleo/celular.js` (pl6) con el arreglo común del celular, y «Lo que sigue» del inicio solo con unidades con módulo.
- Tercera integración de las sesiones paralelas (7 nov 2026): de `rutina/matematica-a`, `plantillas/exponenciales-logaritmos/` (la escalera de la base) e `plantillas/identidades-trig/` (alturas que no se suman); de `rutina/matematica-b`, `plantillas/solidos/` (desarrollo plano, áreas y volumen) y `plantillas/geometria-analitica/` (el plano con imán); de `rutina/verbal`, 12 textos de práctica y la pareja de entrada y salida (t000a y t000b), con la entrada al entrar al curso y la salida abierta por el profesor. Bancos de entrada y salida rebalanceados: 132 ítems.
- Tablero de las pistas (6 nov 2026): `plantillas/orden-informacion/`, razonamiento matemático (fila de cine, mesa redonda, cuadro de doble entrada, verdades y mentiras y certezas, todo resuelto por fuerza bruta y con una sola respuesta comprobada; 18 casos verificados aparte).
- Polígono que se abre (6 nov 2026): `plantillas/poligonos/`, cuarta de geometría (suma de ángulos por triangulación, diagonales, regulares con apotema, cuadriláteros que cambian de nombre al arrastrar los vértices y mediana del trapecio; 20 casos verificados aparte).
- Barra que se parte (6 nov 2026): `plantillas/fracciones/`, aritmética (fracciones con el cuchillo que parte las barras, decimales con lupa y periódicos con arco, MCD con cintas y MCM con buses, promedio de velocidades y ponderado; 19 casos verificados aparte).
- Cuadrado que crece (6 nov 2026): `plantillas/cuadrado-crece/`, tercera de álgebra (productos notables con piezas que se separan y se cuentan, diferencia de cuadrados que se reacomoda, cubo, raíz de una suma y AL12; 20 casos verificados aparte). Bancos de entrada y salida rebalanceados: 126 ítems en siete cursos, con banco nuevo de razonamiento matemático.
- Torre de fichas (6 nov 2026): `plantillas/sucesiones/`, segunda de razonamiento matemático (sucesiones con figuras de palitos contadas por geometría, Gauss, geométricas y series, regiones del círculo; 18 casos verificados aparte).
- Matemática, cuarta tanda (6 nov 2026): `plantillas/caso-ambiguo/` (tercera de trigonometría: el compás que corta la base y la ley de cosenos como áreas; 19 casos verificados aparte) y `plantillas/traductor-enunciados/` (segunda de álgebra y planteo de ecuaciones: el aula S = 6P, la balanza que pierde la raíz, edades y móviles; 20 casos verificados aparte).
- Mol y composición (6 nov 2026, rutina de química): `plantillas/mol-composicion/` (balanza, lupa y cuenta a la vez; fórmula empírica y molecular; 16 casos verificados aparte).
- Formato lectura (pl4, 6 nov 2026): `nucleo/lectura.js` y `app/lectura.js` muestran los textos de `contenido/razonamiento-verbal/` con el paso previo de seis tipos que bloquea las alternativas; ficha `plantillas/lectura-verbal/` (formato `lectura`); eventos `lectura` y `previo` en la medición y resumen por código RV. Con esto los ocho cursos tienen módulo.
- Segunda integración de las rutinas (6 nov 2026): `plantillas/tiro-parabolico/` (rutina de física: sombras sobre los ejes, estroboscopio y MCU; 17 casos verificados aparte) y, de la rutina verbal, el diseño del formato lectura (`docs/formato-lectura.md`) y los primeros 6 textos propios (`contenido/razonamiento-verbal/`).
- Matemática, tercera tanda (6 nov 2026): `plantillas/circunferencia-trig/` (segunda de trigonometría: razones, C.T., reducción con R.T. y co-razón, gráficas y ecuaciones; 21 casos verificados aparte) y `plantillas/probabilidad-dados/` (la primera de razonamiento matemático: espacio muestral, conteo y probabilidad; 135 campos verificados aparte). Con esto los siete cursos de ciencias y matemática tienen al menos una escena; falta razonamiento verbal. Pruebas de entrada y salida corregidas tras su revisión: la salida y las soluciones las abre el profesor (`?salida=` y `?soluciones=`), botón «Otro alumno en esta PC» y pruebas automáticas contra ítems parecidos a las escenas.
- Regla de tres (6 nov 2026): `plantillas/regla-de-tres/`, la primera escena de aritmética (el taller de área fija para la inversa, la tira del Sr. Bajo y el Sr. Alto, compuesta con el método de signos, reparto y engranajes; 19 casos verificados aparte).
- Pruebas de entrada y salida por curso (la1, 6 nov 2026): `catalogo/pruebas/<curso>.json` con formas paralelas A y B (100 ítems en seis cursos, respuestas recalculadas con los motores), orden A→B o B→A por alumno anónimo, entrada sin retroalimentación y salida habilitada por el alumno o el profesor (`?salida=<curso>`); el análisis da la ganancia de Hake y cada error antes y después. Cinética (`plantillas/cinetica/`, rutina de química) integrada.
- Primera integración de las rutinas (6 nov 2026): `plantillas/dinamica/` (rutina de física: plano inclinado, poleas, ascensor y tercera ley; 21 casos verificados aparte), `plantillas/equilibrio-quimico/` (rutina de química: Q contra K con partículas; 18 casos verificados aparte) y el informe `docs/investigacion/razonamiento-verbal-ideas-erroneas.md` (rutina verbal: RV1 a RV32, ninguno documentado). Cada rutina deja su reporte en `rutinas/`.
- Matemática, segunda tanda (6 nov 2026): `plantillas/angulo-inscrito/` (ángulos en la circunferencia; 20 casos verificados aparte), `plantillas/cinta-radio/` (la primera de trigonometría: sistemas de medida, arco, sector y ruedas; 18 casos) y `plantillas/grafica-perillas/` (la primera de álgebra: transformaciones, inversa contra 1/f, inecuaciones y valor absoluto; 20 casos). Rutinas automáticas diarias de física, química y razonamiento verbal en sus ramas (`docs/pendientes.md`).
- Geometría (6 nov 2026), las primeras de matemática: `plantillas/ampliadora/` (semejanza: área con k², volumen con k³, baldosas y cubitos contados, maqueta, tres conos llenan el cilindro y "¿y si fuera lineal?"; 20 casos verificados aparte) y `plantillas/triangulo-estira/` (se arrastra A: la altura sale en el obtusángulo, el área no cambia entre paralelas, las tres líneas coinciden solo en el isósceles; 17 casos verificados aparte). Cada una con papel y 5 "¿qué pasa si…?". Informes de matemática: trigonometría, geometría, álgebra y funciones, aritmética y razonamiento.
- Redox y celda galvánica (6 nov 2026): `plantillas/celda-galvanica/` (pila con electrones por el alambre e iones por el puente, electrólisis, Faraday y una animación que conserva la carga; 21 casos verificados aparte; papel; 5 "¿qué pasa si…?" con el dato de la UNAM, Tagle Barrios 2024).
- Ácidos, bases y pH (6 nov 2026): `plantillas/acidos-bases/` (pH con balance de cargas completo, débiles con aproximación y cuadrática, dilución y titulación, lupa de partículas; 23 casos verificados aparte; papel; 5 "¿qué pasa si…?" con los datos de Furió y otros 2000 y Çetingül y Geban 2011).
- Soluciones (6 nov 2026): `plantillas/soluciones/` (concentración, dilución y mezcla con el modelo de cuadros y puntos y una lupa de "volumen muy pequeño"; 23 casos verificados aparte; papel; dilución guiada y 5 "¿qué pasa si…?" con los datos de Raviolo y Farré y Karaer 2019).
- Gases (6 nov 2026): `plantillas/gases/` (ecuación de estado, presión absoluta y manométrica, Dalton, Graham y una caja de partículas que siempre se mueven, con choques y efusión calculados en el motor; 14 casos verificados aparte; papel; tanque que se enfría y se calienta y 5 "¿qué pasa si…?" con los datos de Köksal 2018).
- Reactivo limitante con partículas (6 nov 2026): `plantillas/limitante-particulas/` (la primera escena de química: motor de reacciones con balance y masas de academia; 13 casos verificados aparte; papel; caja de partículas con la receta y la balanza; 4 predicciones y 5 "¿qué pasa si…?" con los datos de Raviolo y Lerzo 2016, Dahsah y otros 2006 y Casado y Raviolo 2005).
- MRUV y gráficas (6 nov 2026): `plantillas/mruv/` (motor por tramos, cruces exactos, frenado sin retroceso y lanzamiento vertical; 18 casos verificados aparte; papel; pista con las tres gráficas amarradas por color; 6 "¿qué pasa si…?" con los datos de Beichner 1994 y Thornton y Sokoloff 1998).
- Trabajo, energía y potencia (6 nov 2026): `plantillas/energia/` (motor con rampas de tres formas, resorte, trabajo por fuerza, potencia y lanzamientos; 17 casos verificados por un cálculo independiente; papel; paso a paso de la rampa con resorte y barras de energía; 5 "¿qué pasa si…?" con los distractores del test EMCS).
- Calorimetría y cambios de fase (5 nov 2026): `plantillas/calorimetria/` (motor por energía con mesetas a 0 °C y 100 °C, 15 casos, papel, paso a paso con las dos curvas que se cruzan y 5 "¿qué pasa si…?", entre ellos el agua que hierve a 87 °C en Juliaca).
- Circuitos de corriente continua (5 nov 2026): `plantillas/circuitos-cc/` (motor nodal, 9 casos, papel, paso a paso con "se quita B3", "¿qué pasa si…?" y modo altura).
- Espejos esféricos (5 nov 2026): `plantillas/optica-espejo-esferico/` (motor, 7 casos, papel, paso a paso y "¿qué pasa si…?"). Banco Óptico 0.2.0 con "¿qué pasa si…?" y papel.
- El motor del Banco Óptico está en `plantillas/optica-lente-delgada/motor.js`; los dos modos del HTML lo usan. `npm test` corre los 7 casos de `casos.json` y comprueba que los rayos trazados se cruzan donde la ecuación pone la imagen (14 pruebas en verde).

- **Decisión de Gerson (5 nov 2026):** no hay prueba previa con alumnos. El prototipo se lanza en un colegio, donde se evalúa casi todo; se va con un prototipo mucho más avanzado que un producto mínimo. La app debe medir por sí misma (predicciones y pruebas de antes y después, anónimas), porque es la única fuente de datos.

## Próximas tareas, en orden

La lista vigente y detallada está en `docs/pendientes.md` y en la hoja de ruta (`docs/hoja-de-ruta.json`). Esta es la lista original de la fase 0:

1. ~~Extraer el motor de la lente a un módulo JS puro y correr `casos.json` con `node --test`.~~ Hecho. Es el patrón para las plantillas que siguen: `motor.js` + `casos.json` + `motor.test.js`.
2. Leer los prospectos/temarios que Gerson suba a `fuentes/prospectos/` y fijar la taxonomía de `docs/fundacional.md` (la UNI como techo de dificultad). UNI hecha con el sílabo del CEPRE-UNI 2026-2: `docs/taxonomia-uni-2026.md`. San Marcos hecha con el temario del CEPRE-UNMSM 2026-I: `docs/taxonomia-unmsm-2026.md`. Faltan UNA Puno, UNSA y UNSAAC.
3. Clasificar problemas reales por plantilla y medir cobertura. San Marcos hecho: `docs/clasificacion-unmsm.md` (120 preguntas distintas de 7 periodos oficiales; la fase 1 cubre solo el 5 % de su física; calorimetría, energía y circuitos cubren el 28 %). Herramientas para repetirlo en `herramientas/`. **Decisión de Gerson (4 nov 2026):** por ahora las prioridades se fijan con la UNI y San Marcos, que son los temarios más completos; cuando Gerson suba material de la UNA Puno, se reajusta.
4. Investigar, tema por tema, las ideas erróneas típicas para las opciones de predicción. Física y química completas según el temario UNI (ver la columna "Investigación" de `docs/taxonomia-uni-2026.md`); fuera quedan nomenclatura, orgánica y ecología. Las hipótesis se confirman con los datos del lanzamiento en el colegio. En el Banco Óptico, agregar al explorador las predicciones "¿qué pasa si…?" propuestas en el informe (requiere trazar un abanico de rayos).
5. Construir a mano: espejos esféricos, MRUV, tiro parabólico. Interacción principal: arrastrar en pantalla táctil (celular primero) y que funcione sin conexión.
6. Recién después de 4 plantillas probadas: destilar un skill de "cómo se construye una plantilla".
7. Más adelante (no ahora): las ideas de `docs/vision-futura.md`.

## Cómo se trabaja

- Antes de subir un cambio en una plantilla: `npm test` en verde.
- Si cambia `catalogo/` o una `plantilla.json`: `npm run catalogo`. Si cambia la cáscara de la app: subir `VERSION` en `app/sw.js`.

- Cambios chicos y revisables; un commit por plantilla o por cambio de documento.
- Antes de afirmar algo sobre evidencia pedagógica, cita la fuente en `docs/fundacional.md`.
- Si algo del documento fundacional cambia, actualiza también el doc vivo o avisa a Gerson para que lo haga.
