# Reporte: teoría de física (14 nov 2026)

Rama `teoria/fisica`, que sale de `claude/awesome-einstein-ch5g9a` (encargo: `rutinas/encargos/teoria-fisica.md`). Las 21 unidades de `catalogo/cursos/fisica.json` tienen su teoría en `contenido/teoria/fisica/<unidad>.js`, todas en estado `completa`: cubren todos los temas del catálogo, tienen de 4 a 6 ideas y cada idea recorre sus cinco momentos. `npm test`: 8256 de 8256 en verde (antes había 4764 en el resumen de `CLAUDE.md`; la cifra creció con otras ramas).

Las dos primeras unidades (MRU, MRUV y caída libre; magnitudes y vectores) las escribió la sesión principal. Las otras 19 se escribieron en paralelo, en cuatro tandas, con el mismo molde y las mismas reglas; la sesión principal las revisó en capturas e hizo un commit por unidad.

## Unidades

| Unidad | Grado | Ideas | Piezas | Estado |
| --- | --- | --- | --- | --- |
| magnitudes-y-vectores | 3.º | 5: otra unidad, otro número · dimensiones que cuadran · la resultante depende del ángulo · componentes y unitario · producto escalar y vectorial | recta, fis-dimensiones, flechas | completa |
| movimiento-rectilineo | 3.º | 5: MRU · desplazamiento no es distancia · la pendiente es la aceleración · en la cima, g sigue · encontrarse es estar juntos | pista, ejes, torre | completa (0.2.0; antes borrador) |
| movimiento-parabolico-y-circular | 4.º | 4 | ejes, fis-lienzo | completa |
| estatica | 4.º | 6 | fis-lienzo, ejes | completa |
| dinamica | 4.º | 6 | fis-lienzo, ejes | completa |
| gravitacion | 4.º | 4 | fis-lienzo | completa |
| trabajo-y-energia | 4.º | 5 | fis-lienzo, ejes | completa |
| impulso-y-choques | 4.º | 5 | ejes, fis-riel, torre, recta | completa |
| fluidos | 4.º | 6 | fis-vasos, ejes | completa |
| temperatura-y-calor | 4.º | 6 | ejes | completa |
| oscilaciones | 5.º | 5 | fis-resorte, ejes | completa |
| ondas-mecanicas | 5.º | 5 | ejes | completa |
| termodinamica | 5.º | 6 | ejes, fis-cuentas | completa |
| electrostatica | 5.º | 6 | fis-lienzo, fis-circuito, fis-cuentas | completa |
| corriente-y-circuitos | 5.º | 6 | fis-circuito, ejes | completa |
| magnetismo | 5.º | 5 | fis-lienzo | completa |
| induccion-electromagnetica | 5.º | 6 | flechas, ejes, fis-espira | completa |
| ondas-electromagneticas | 5.º | 4 | fis-onda-em, ejes, recta | completa |
| optica-geometrica | 5.º | 6 | fis-interfaz, fis-banco-optico | completa |
| fisica-moderna | 5.º | 6 (7 temas: rayos X y láser comparten «un fotón por cada salto») | fis-fotones, ejes, recta | completa |

Cada archivo trae arriba la ficha de tarea de seis líneas y los colores de la unidad. Sobre cada idea están sus cinco decisiones, y en el encabezado, sus códigos nuevos. La historia de cada unidad es propia, de 70 palabras o menos, y lleva su fuente de la matriz. Todo número lo calcula el archivo; «Ahora tú» se genera con semilla y el validador lo prueba con 60 semillas. g = 10 m/s² va declarado en la condición de la regla cuando se usa.

## Piezas del kit

Nuevas (prefijo `fis-`, cada una con su `.test.js` y su afirmación en el encabezado):

| Pieza | Afirmación |
| --- | --- |
| fis-dimensiones | Una ecuación es homogénea cuando todos sus términos tienen la misma fila de fichas de M, L y T. |
| fis-lienzo | Cada flecha mide lo que vale y sale del cuerpo sobre el que actúa; lo que no cambia entre estados no se mueve. |
| fis-cuentas | Cada término es una barra con signo sobre el mismo cero; el resultado se lee comparando largos. |
| fis-circuito | Lo que mide cada aparato está pegado a él; la corriente que entra a un nudo es la que sale. |
| fis-riel | Las flechas de velocidad están a escala; la fila de antes y la de después muestran qué se conservó. |
| fis-vasos | La presión en un punto la decide la altura de líquido encima, no la forma del recipiente. |
| fis-resorte | La aceleración siempre apunta al equilibrio y crece con la distancia. |
| fis-espira | La corriente inducida aparece solo mientras el flujo cambia, y se opone a ese cambio. |
| fis-onda-em | E y B son perpendiculares entre sí y al avance, con las crestas en el mismo lugar. |
| fis-interfaz | Los ángulos se miden desde la normal; el reflejado copia al incidente. |
| fis-banco-optico | La imagen está donde se cruzan los rayos que salen de la punta del objeto, o sus prolongaciones. |
| fis-fotones | El color decide la energía de cada paquete; el brillo, cuántos llegan. |

Cambiada: `torre` acepta `datos.colores` (opcional, compatible). Así la caída libre usa v en naranja, como el resto de MRU y MRUV (regla 4); sin ese dato la torre dibuja como antes.

## Pedidos al molde

1. **Bug de rutas en `app/teoria.js` (las cinco sesiones lo encontraron por separado).** `vista()` lee la idea con `location.hash.split('/')[3]`, que siempre es «teoria»; debería ser el índice 4. Por eso `#/unidad/<id>/teoria/<idea>` y los chips de la fila de ideas abren siempre la primera idea pendiente, no la pedida. No se tocó porque el encargo prohíbe editar `app/`.
2. **Faltan colores.** `c-f` está en `Ecuacion.COLORES`, pero no tiene CSS (`--c-f` no existe en `app/estilos.css`), así que hay 4 colores de variable. Termodinámica (P, V, T, U, Q, W), óptica y física moderna tienen más variables que colores. Se repitieron colores entre ideas, nunca dentro de una idea, y quedó declarado en cada encabezado.
3. **Colores de fuerzas entre unidades.** En mecánica el peso va en verde y la fuerza aplicada en naranja. En fluidos, E y W comparten el rojo de «fuerza». Dentro de cada unidad es consistente; entre unidades, no. Conviene fijarlo en `docs/diseno.md`.
4. **Raíz de una fracción** (`{ raiz: [{ frac }] }` en `nucleo/ecuacion.js`): la fracción se sale del signo («√ T/μ»).
5. **Lectura en vivo de más de unos 38 caracteres:** en 360 px queda cortada por la figura fija. Se acortaron todas; quizá convenga permitir dos líneas.
6. **Más de 6 ideas:** física moderna tiene 7 temas; dos se juntaron en una idea. Partir unidades en lecciones sigue pendiente.
7. **Respuesta manipulable y gesto propio:** la palanca (mover la masa hasta equilibrar), el resorte y las barras de energía lo pedirían; hoy se resuelve con opciones y con − y +.
8. **Choque de códigos:** G1–G3 de gravitación (informe de momento-gravitación-ondas) y G1–G4 de gráficas (cinemática) tienen el mismo nombre. Hay que renombrar uno de los dos juegos.

## Códigos de error nuevos (hipótesis)

Ninguno tiene dato empírico propio. Cada archivo los lista en su encabezado, con lo que cree el alumno. Por unidad:
- **Magnitudes y vectores:** V-SUMA, V-RESTA, V-PITAGORAS, V-COS, V-RAIZ, U-SUMA, U-CAMBIO, U-UNOS, U-SIGNO, PE-MODULOS, PE-VECTOR, PE-ORDEN, PE-SIGNO, DIM-UNIDAD, DIM-INVERSA, DIM-TERMINO, DIM-EXPONENTE, CONV-UNO, CONV-INVERSO, CONV-CUADRADO.
- **MRU, MRUV y caída libre:** MRU-X0, MRU-SUMA, MRU-CONTEO, MRU-SIGNO, DX-*, K-*, C-VUELTA, C-ALTURA, C-MEDIO, C-AREA, C-TIEMPO, VR-RESTA, VR-SUMA, VR-UNO, VR-POSICION.
- **Impulso y choques:** IMP-*, P-PESADO, P-INVERSA, CH-*, CM-*.
- **Fluidos:** FL-*, PA-*, AR-*, TS-*, BE-*.
- **Temperatura y calor:** ES-*, CAL-*, CE-*, FA-SUBE, DI-*, TR-*.
- **Oscilaciones:** OS-*.
- **Ondas mecánicas:** OND-*, SO-*.
- **Resto de unidades:** sus prefijos están en las secciones de abajo.

Reusados de `docs/investigacion/`: K1, K3, K4, C1, C2, P1, P2, D1, D3, D5, D7, D9, D11, E1, E4, E8, E10, W1, W5, W7, W14, W15, G1–G3, M1, M7, M8, F2, F4, F7, F10, F12, F13, F15, Q7, Q9, Q11, O1–O4, ON1, ON4–ON6, ON8, T3–T15, EL1, EL2, EL8, C1, C2, C4, C5, C7, C8, C11, C12, C14, MG1–MG4, MG6, U1.

Ojo: C1 y C2 existen en cinemática (caída) y en electricidad (circuitos), y cada unidad usa el suyo; el informe de origen se ve en el encabezado.

## Cómo se revisó

- Cada unidad pasa `Teoria.problemas` (`contenido/teoria/teoria.test.js`) y cada pieza nueva, su prueba de fidelidad.
- Recorrido en Playwright a 360 × 780 de todas las ideas, los cinco momentos (juega, predice y revelar, mira al final, regla, ahora tú y la solución con «No sé»), en tema claro, sin errores de consola. En oscuro, una o dos ideas por tanda.
- Las hojas de capturas se miraron. El script de recorrido vive en el scratchpad de la sesión, no en el repo. Para saltar el bug de rutas abre un contexto nuevo por idea con las ideas anteriores marcadas como hechas; además, la app guarda su estado al recargar y pisa lo que se escribe en localStorage desde afuera.

**Corregido en la sesión principal tras mirar las capturas:**
- La incógnita de dimensiones se llamaba A, naranja en el texto y roja en la figura (choque con la regla 4): pasó a k.
- Las fichas de dimensión eran muy chicas a 360 px: pasaron de 10 a 14 px.
- La figura de la resultante cambiaba de escala al jugar: ahora tiene una media vuelta fija donde puede caer la punta de B.
- Componentes: las etiquetas a escala no coincidían con los números del enunciado; se quitaron y quedan solo en «Mira».
- La sombra del producto escalar tapaba el rótulo de A.
- La resultante se veía antes de responder en «Ahora tú».
- La torre de caída libre se apretaba arriba: ahora mide 25 m.

**Visto y no corregido (menor):**
- En «En paralelo, toda la pila» (circuitos), «12 V» roza el «4 Ω» del primer foco.
- En la palanca de estática («Mira»), los rótulos 1 m y R = 50 N quedan apretados.
- En componentes, la etiqueta û toca a Aₓ en «Mira».

## No verificado

- Celular real (el de Gerson), lector de pantalla, otros navegadores y alumnos.
- Contraste medido en tema oscuro de los rótulos de color dentro de los SVG nuevos: se revisó a ojo en capturas.
- Valores de tabla de uso escolar, tomados sin fuente primaria:
  - funciones trabajo, índices de refracción, ángulo crítico del agua 48,8°;
  - n del cobre, 8,5 × 10²⁸ m⁻³;
  - campo terrestre horizontal en Perú, 25 μT;
  - g de Marte 3,7 y de la Luna 1,6;
  - γ del agua jabonosa;
  - datos de Juliaca (agua que hierve a unos 87 °C, unos 64 kPa).
- Curvas cualitativas: el espectro de rayos X y las de Planck, cada curva normalizada a su pico (declarado en la consigna).
- Fechas de la historia: salen de la matriz; no se reabrieron sus fuentes.

## Reporte de diseño

```
Ficha de tarea: una por unidad, al inicio de cada archivo (promesa, persona y condiciones, resultado observable,
  orden de atención, estados, duda que resuelve). Cinco decisiones (cambia, permanece, progresa, se reserva,
  debe verse) sobre cada idea.
Sistema: existente (tokens c-o, c-i, c-h, c-d; trazo y escala de tiempo del kit). Decisiones nuevas: doce piezas
  fis-*, cada una con su afirmación; colores por unidad declarados en cada encabezado. No se escribió nada en
  docs/diseno.md: queda pedido fijar los colores de fuerzas (pedido 3).
Carácter: acogedora, viva y precisa · firma: el hilo de color (cada variable con su color en el control, la figura,
  el texto y la ecuación).
Movimientos: ninguno propio; las piezas son estados fijos que recorre la línea de tiempo del kit, con rastro
  por corte o paso. Sin movimiento reducido especial: no hay traslados propios.
Verificación: topes de texto, pureza de piezas y 60 semillas por idea (validador); fidelidad de cada pieza nueva
  (pruebas: escalas, ángulos, cruces de rayos, fichas por exponente); recorrido en Playwright a 360 px de todas las
  ideas; capturas revisadas; npm test 8256 de 8256.
No verificado: lo de la sección anterior.
Hipótesis: jugar con la variable antes de predecir debería bajar la elección del distractor (V-SUMA, C1, K1, FM2,
  MG10, SN-SUPERFICIE, CH-REPOSO, M1). Se comprueba con los eventos `teoria` (momento «prediccion») del piloto.
Conflictos: cuatro colores frente a seis o más variables por unidad; tope de 6 ideas frente a 7 temas en física
  moderna; colores de fuerzas distintos entre unidades.
```

## Detalle por tandas
### Mecánica A: parabólico y circular, estática, dinámica, gravitación, trabajo y energía

| Unidad | Ideas | Estado |
| --- | --- | --- |
| movimiento-parabolico-y-circular | un reloj y dos ejes, arco y radián, rapidez constante que acelera, dos aceleraciones (6 de 6 temas) | completa |
| estatica | diagrama y parejas, nudo en equilibrio, el rozamiento se ajusta, resorte proporcional, torque y brazo, polea móvil (8 de 8) | completa |
| dinamica | la fuerza neta acelera, masa y peso, rozamiento en movimiento, plano y polea, la centrípeta es una resultante, ascensor y marcos (6 de 6) | completa |
| gravitacion | cuadrado inverso, campo gravitatorio, órbita circular, leyes de Kepler (4 de 4) | completa |
| trabajo-y-energia | trabajo y ángulo, trabajo y energía cinética, energía potencial, conservación, potencia y eficiencia (5 de 5) | completa |

Colores: fuerza aplicada naranja; peso y g verde; N, T y longitudes turquesa (nunca juntas en una idea); en dinámica, la aceleración en rojo.

Pieza nueva `fis-lienzo`: plano de física a una sola escala en metros, ventana fija; cuerpos, rampas, suelo, discos, arcos, cotas, flechas con escala fija, puntos y textos, con pasos. Afirmación: «cada flecha mide lo que vale y sale del cuerpo sobre el que actúa; lo que no cambia entre estados no se mueve». La usan también electrostática y magnetismo.

Códigos nuevos (hipótesis), en el encabezado de cada archivo: TP-, AN-, MC- (parabólico y circular); ES-, N-, ST-, RZ-, RS-, TQ-, MS- (estática); DN-, MP-, RM-, PL-, DC-, AS- (dinámica); GR-, OR-, KP- (gravitación); TR-, TE-, EP-, CE-, PO- (energía). Reusados: K3, C1, C2, P1, P2, D1, D3, D5, D9, D11, E1, E4, E8, E10, W1, W5, W7, W14, W15, G1, G2, G3.
Choque de nombres: G1–G3 de gravitación (informe de momento-gravitación-ondas) y G1–G4 de gráficas (cinemática). Conviene renombrar uno de los dos juegos.

Corregido tras las capturas: escalas de flechas fijadas por el mayor valor del juego; rótulos al costado del cuerpo; la solución del tiro ya no cambia la figura de la pregunta; el brazo pedido sale como «d = ?»; parábola con escala casi igual en los dos ejes; rueda con rótulo igual al radio del enunciado; resorte de 20 cm a 400 px/m; campo gravitatorio con anillos a 2R y 3R.

No verificado: tema oscuro fuera del nudo (estática) y el plano con polea (dinámica); contraste medido de textos de color en oscuro; valores redondeados declarados (g de Marte 3,7, de la Luna 1,6, 8 km/s rasante, R ≈ 6400 km); el período de la lectura de la órbita es aproximado.

### Mecánica B y calor: impulso y choques, fluidos, temperatura y calor, oscilaciones, ondas mecánicas

| Unidad | Ideas | Estado |
| --- | --- | --- |
| impulso-y-choques | impulso, conservación, elástico e inelástico, restitución, centro de masa | completa |
| fluidos | presión y profundidad (con densidad), vasos comunicantes con manómetro y barómetro, prensa de Pascal, empuje, tensión superficial, Bernoulli | completa |
| temperatura-y-calor | escalas, mezcla con ley cero y calorimetría, calor específico, cambio de fase, dilatación, transferencia de calor | completa |
| oscilaciones | aceleración al centro, gráficas del MAS, período del resorte (horizontal y vertical), péndulo, energía | completa |
| ondas-mecanicas | transversal y longitudinal, función de onda, rapidez en la cuerda, estacionarias, intensidad y decibeles (con la energía que lleva la onda) | completa |

Convenciones declaradas: g = 10 m/s², calorías de academia, barómetro con 76 cm de mercurio y 101 kPa. En fluidos, E y W comparten el rojo de «fuerza» (ver pedido 3).

Corregido tras las capturas:
- fis-riel: las notas se encimaban; los carritos pegados comparten una flecha.
- Predicciones que delataban la respuesta: las curvas de la mezcla llegaban ya a 35 °C, el cruce K = U del MAS ya se veía y el eje Q de la meseta daba el total. Ahora muestran solo el punto de partida.
- fis-vasos: las cotas se salían del borde.
- Bernoulli: el desnivel casi no se veía (ahora con escala de 0,6 m).
- Rótulos encimados en péndulo, resorte, conducción, decibeles y tensión superficial.
- Nodos en el color de λ (pasaron a tinta).
- Lecturas largas, acortadas.
### Calor y electricidad: termodinámica, electrostática, corriente y circuitos, magnetismo

| Unidad | Estado | Ideas | Temas |
| --- | --- | --- | --- |
| termodinamica | completa | 6 (gas ideal, primera ley, trabajo como área, cuatro procesos, cp y cv, máquina térmica) | 7 de 7 |
| electrostatica | completa | 6 (electrización, Coulomb, campo y potencial, campo uniforme, serie y paralelo, energía del condensador) | 8 de 8 |
| corriente-y-circuitos | completa | 6 (no se gasta, Ohm y resistividad, fem y medidores, serie y paralelo, Kirchhoff, potencia y Joule) | 8 de 8 |
| magnetismo | completa | 5 (Oersted, espira y solenoide, fuerza sobre una carga, fuerza sobre un cable, cables paralelos) | 5 de 5 |

Colores: termodinámica P naranja, V turquesa, T rojo, U verde (Q y W en tinta); electrostática q naranja, r y d turquesa, F rojo, E verde; circuitos V y ε naranja, R turquesa, I rojo, P verde; magnetismo v naranja, B turquesa, I rojo, F verde.

Piezas nuevas:
- `fis-cuentas`: barras con signo sobre un cero común y una misma escala. Afirmación: «cada término es una barra con signo sobre el mismo cero; lo que entra sube, lo que sale baja, y el resultado se lee comparando largos».
- `fis-circuito`: esquema de una malla con serie arriba y hasta 3 ramas en paralelo; resistencia, foco con halo por potencia, condensador, amperímetro, voltímetro, pila real, interruptor. Afirmación: «lo que mide cada aparato está pegado a él; la corriente que entra a un nudo es la que sale».

Códigos nuevos (hipótesis): T-CELSIUS, T-INVERSA, T-SIGNO, T-AREA, T-CVCP, T-SUPERA, T-RESTA, T-MOLES, T-CV; EL-E0V, EL-VSIGNO, EL-DIST, EL-CV, EL-REPARTO, EL-CON, EL-R2, EL-UNID, EL-TERCIO; CI-LUZ, CI-RAPIDO, CI-RHO, CI-REQ, CI-INV, CI-UNID; MG-RADIAL, MG-TIERRA, MG-R2, MG-RADIO, MG-ENERGIA, MG-UNID. Existentes usados: T3–T15, EL1, EL2, EL8, C1, C2, C4, C5, C7, C8, C11, C12, C14, MG1–MG4, MG6.

Hallazgos de diseño corregidos: predicciones que mostraban la barra del resultado antes de responder (ocultas hasta revelar); cp y cv rompía la regla 3 (el juego dejaba elegir lo que luego se preguntaba: quedó solo a volumen fijo); barra recortada en el isotérmico (nRT = 577 J); T fría en turquesa (color de V) pasó a rojo; flechas de 2 px en Coulomb y campo (escala nueva, ≥ 10 px); rótulos encimados en esferas, placas, ramas del circuito, Oersted, solenoide y cables paralelos; radio de 1 cm del protón ilegible (rangos de hasta 8 cm de diámetro).

Pendiente visto en la revisión: en «En paralelo, toda la pila» el rótulo «12 V» de la pila roza el «4 Ω» del primer foco.

No verificado: contraste de rótulos de color sobre el halo del foco en tema oscuro; fechas de la historia (de la matriz); n del cobre 8,5 × 10²⁸ m⁻³; componente horizontal del campo terrestre en Perú tomada como 25 μT (declarada como aproximación).
### Inducción, ondas electromagnéticas, óptica geométrica y física moderna

| Unidad | Ideas | Estado |
| --- | --- | --- |
| induccion-electromagnetica | flujo, Faraday, Lenz, barra móvil, generador y valor eficaz, transformador (6 de 6 temas) | completa |
| ondas-electromagneticas | E y B cruzados, todas a c, espectro, cambio de medio (4 de 4) | completa |
| optica-geometrica | Snell, reflexión total, espejo plano, espejo cóncavo, lente delgada, fabricante y potencia (6 de 6) | completa |
| fisica-moderna | fotoeléctrico, fotones, cuerpo negro, un fotón por salto (rayos X y láser), relatividad, incertidumbre (7 de 7 temas en 6 ideas) | completa |

Piezas nuevas:
- `fis-espira`: «la corriente inducida aparece solo mientras el flujo cambia, y circula para oponerse a ese cambio» (imán y espira, barra en rieles, transformador).
- `fis-onda-em`: «E y B son perpendiculares entre sí y al avance, y tienen sus crestas en el mismo lugar».
- `fis-interfaz`: «los ángulos se miden desde la normal; el reflejado copia al incidente y el refractado se acerca a la normal en el medio de mayor índice».
- `fis-banco-optico`: «la imagen está donde se cruzan los rayos que salen de la punta del objeto, o sus prolongaciones si divergen»; su prueba comprueba el cruce contra 1/f = 1/dₒ + 1/dᵢ en lentes y espejos, reales y virtuales.
- `fis-fotones`: «el color decide la energía de cada paquete; el brillo, cuántos llegan».

Códigos nuevos (hipótesis), en el encabezado de cada archivo: FL-, FA-, LZ-, BA-, AC-, TR- (inducción); OE-LENTO, OE-FREC, OE-POR-C, OE-C2, ES-, ME- (ondas EM); SN-, RT-, EP-, OP-, FAB-, P- (óptica); FE-, FT-, CN-, RX-, LS-, RE-, IN- (física moderna).

Corregido tras las capturas: la onda EM con la pieza flechas salía como serrucho (pieza nueva); el espejo cóncavo se dibujaba convexo; la fem de Faraday iba en el color de Φ; el eje caía sobre la frontera en el cambio de medio; rótulos de ángulo cruzaban el rayo; γ con fracción anidada se rompía (quedó en línea); unidades cortadas en controles; la consigna decía «línea negra» y en oscuro es blanca; rótulos del espectro encimados (4 filas).

No verificado: valores de tabla de uso escolar (funciones trabajo, índices, ángulo crítico del agua 48,8°) sin fuente primaria; el espectro de rayos X (forma de Kramers) y las curvas de Planck son cualitativos, cada curva normalizada a su pico, declarado en la consigna y el eje.
