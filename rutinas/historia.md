# Rutina de historia: reporte

Rama `rutina/historia`, sacada de `claude/awesome-wozniak-5etl1n`. Encargo de Gerson del 8 nov 2026: catálogo de ganchos históricos, unidad por unidad, para los 8 cursos, con la forma de integrarlos (A planteamiento, B lectura de verbal, C «¿Sabías que…?»). No toqué escenas, motores ni contenido de alumnos, y no subí `VERSION`.

## 8 nov 2026 · Catálogo de ganchos

### Qué hice

- **`docs/investigacion/historia-ganchos.md`:** una sección por curso, una tabla por unidad (las 151 tienen al menos una fila), la lista de los 30 ★, una sección de mitos por curso y, al final, la revisión fila por fila.
- **Método:** ocho buscadores en paralelo, uno por curso, y dos revisores adversariales (física, química y verbal; los cinco de matemática). Los revisores contrastaron fechas, autores y cifras, buscaron mitos colados, comprobaron cada código de error contra `docs/investigacion/` y cada plantilla contra `plantillas/`, y dejaron un solo estado por fila. Hicieron unas 190 correcciones.
- **Cifras:** unos 410 ganchos y 15 remisiones (filas que solo dicen «ver …»), más unos 80 mitos aparte.

| Curso | `verificado (extracto)` | `por verificar` | `dudoso` | `mito` |
| --- | --- | --- | --- | --- |
| Física | 21 | 27 | 4 | 2 |
| Química | 23 | 33 | 1 | 0 |
| Aritmética | 29 | 18 | 2 | 0 |
| Álgebra | 34 | 16 | 0 | 0 |
| Geometría | 29 | 11 | 4 | 0 |
| Trigonometría | 10 | 36 | 4 | 2 |
| Razonamiento matemático | 25 | 15 | 2 | 0 |
| Razonamiento verbal | 15 | 51 | 0 | 0 |
| **Total** | **186** | **207** | **17** | **4** |

### Lo que no salió como se pidió (léelo antes de usar el catálogo)

- **Nadie leyó una fuente completa.** El proxy de la sesión rechazó (403) todos los sitios académicos: MacTutor, Stanford Encyclopedia, SciELO, JSTOR, arXiv, archive.org, Britannica, NASA NTRS y las revistas universitarias. Solo se vieron los extractos del buscador.
- **El cupo de búsquedas se acabó.** El cupo del turno (200) se comparte entre todos los agentes y alcanzó para entre 9 y 40 búsquedas por curso.
- **Consecuencia:** el estado «verificado» del encargo quedó como `verificado (extracto)`. Quiere decir que el buscador mostró la afirmación en una fuente seria y el revisor no le vio errores, pero falta la página. La mitad de las filas son `por verificar`: tienen fuente propuesta y no se publican así.
- **Lo más flojo:** verbal (51 por verificar) y trigonometría (36).
- **Unidades sin gancho que enganche:** el ángulo entre las agujas del reloj, las campanadas, el valor absoluto, los tipos de funciones y la estática con algo peruano. No forcé nada.
- **Para cerrar la verificación**, en otra sesión:
  - habilitar en la red `mathshistory.st-andrews.ac.uk`, `plato.stanford.edu`, `scielo.org.pe`, `arxiv.org`, `jstor.org`, `archive.org`, `ntrs.nasa.gov` y `revistas.unal.edu.co`;
  - correr un buscador por curso que solo verifique, empezando por los ★ y la reserva.

### Correcciones de peso que hizo la revisión

- **Antúnez de Mayolo «predijo el neutrón»:** es **mito**. Rutherford propuso una partícula neutra en 1920 y la hipótesis de Antúnez de Mayolo es de 1924. Su gancho firme es el Cañón del Pato.
- **Paulet y el motor de 1895:** es **dudoso**. Solo consta su carta de 1927 en *El Comercio* y la mención de von Braun. Se cuenta como «un pionero que no publicó a tiempo».
- **Villarreal:** halló su método hacia 1873 y lo presentó en 1879 como tesis en San Marcos. Lo de que «superó a Newton» no se sostiene.
- **Kepler no abandonó** el modelo de los cinco sólidos: lo reeditó en 1621.
- **Ørsted** no descubrió el efecto por accidente: la versión del accidente viene de Hansteen (1857).
- **Rømer:** los 22 minutos son para cruzar el diámetro de la órbita de la Tierra, no la órbita.
- **Mariano de Rivero:** la humboldtina es un mineral de Bohemia, no peruano. El gancho es el químico peruano que le puso nombre.
- **Guano:** no lo hundió Haber, sino el amoniaco industrial (Bosch, desde 1913), en los años 1920 y 1930. Además, t009 ya cuenta el guano y el salitre.
- **Intihuatana como reloj de sol:** es dudoso. Lo estudiado de verdad son las sucancas del Cusco (Bauer y Dearborn 1995).
- **Lo Shu:** las fechas antiguas salían de un derivado de Wikipedia. Pasaron a `por verificar`.
- **Códigos que no encajaban:** se quitaron OE2 (Rømer), M1 (Paulet), AR7 (SAT), GE9, CO34, TR20, EQ14 y RV2 (este en Moser y Fibonacci). Hay **tres códigos nuevos por proponer**:
  - «generalizar desde pocos casos» (las regiones del círculo de Moser), para el informe de razonamiento;
  - «comparar la rosa por el radio y no por el área», para el de verbal o el de estadística;
  - «raíces negativas como falsas» (Descartes), para el de álgebra.

### Para corregir en el repo (no lo toqué, decide la principal)

- `plantillas/solidos/index.html` afirma como hecho que Arquímedes pidió grabar la esfera y el cilindro en su tumba. Viene de Plutarco y de Cicerón, que dice haberla encontrado: debería decir «según Plutarco».

## Los 30 ★

La tabla completa, con unidad, plantilla, código y estado, está en `docs/investigacion/historia-ganchos.md` («Los 30 para empezar»), y cada fila elegida lleva ★ en su tabla. En corto:

1. Faraday y el tirón de 1831 (física, inducción, MG7).
2. El recipiente sellado de Lavoisier (química, materia y balance, MA4, ES13).
3. El quipucamayoc anota en base 10 (aritmética, numeración).
4. El empujón que se gasta: el ímpetu (física, dinámica, D2).
5. El Puy de Dôme, «¿y en el Misti?» (física, fluidos, F8).
6. Caldas y el agua que hierve en los Andes (física, calor, Q9).
7. El seno fue una longitud hasta Euler (trigonometría, TR7, TR8).
8. Dorar sin batería en Loma Negra (química, electroquímica, EC8).
9. La tumbaga y el dorado por depleción (química, recursos, QA11).
10. Eratóstenes y la sombra (trigonometría, cinta-radio, TR4).
11. La plomada en el Chimborazo (física, gravitación, G5).
12. Méré y las 24 tiradas (razonamiento matemático, AR7).
13. Galileo y los tres dados (aritmética, AR17, AR20).
14. Al-Juarismi completa el cuadrado (álgebra, AL8).
15. La bala que iba recta y caía (física, tiro, P5).
16. El calórico y el cañón de Rumford (física, calor, Q6, T13).
17. Los puentes de Königsberg (razonamiento matemático, AR18).
18. Bombelli y √−121 (álgebra, complejos, CX1, CX7).
19. Euler escribió √−2·√−3 = √6 (trigonometría, polares y complejos, CX28).
20. El préstamo mesopotámico al 20 % (aritmética, interés, AR16).
21. La moneda del SAT de 1982 (razonamiento matemático, giros).
22. La urea de Wöhler (química, funciones orgánicas, FO1).
23. La aguja de Ørsted (física, magnetismo, MG2).
24. La explosión de Le Chatelier (química, equilibrio, EQ8).
25. Para Euler, función era fórmula (álgebra, funciones, AL26).
26. Tales y la pirámide, «según cuentan» (geometría, semejanza, GE22).
27. Nazca: dibujar chico y trazar grande (geometría, semejanza, GE1; por verificar).
28. La rosa de Nightingale (verbal, textos discontinuos, B).
29. ¿Fueron escritura los quipus? (verbal, textos filosóficos y científicos, B).
30. Carrión contra Harvard (verbal, argumentativos, B; por verificar).

## Tres propuestas de lectura B (sin escribir todavía)

1. **La rosa de Nightingale (1858).**
   - Encaja en verbal: `razonamiento-verbal.textos-discontinuos`, como texto mixto con la figura. La rosa obliga a comparar áreas y no radios.
   - Conecta con `aritmetica.estadistica` (plantilla `fracciones`, gráficos) y con el área del sector en `geometria.longitud-y-areas-circulares`.
   - Lleva el mito de que «Nightingale inventó el gráfico de sectores» como pregunta: Playfair ya lo había publicado en 1801.
   - Fuente para verificar: Friendly (2008), arXiv 0906.3979, y las *Notes on Matters Affecting the Health…* (1858).
   - Errores que mide: RV47, y el código nuevo para «radio por área».
2. **Faraday and the moving magnet (1831), en inglés.**
   - Encaja en verbal: `razonamiento-verbal.lectura-en-ingles` (`"idioma": "en"`, preguntas en español), con el pasado simple bien marcado.
   - Conecta con `fisica.induccion-electromagnetica`: es la misma pregunta que la primera predicción de la escena `induccion` (el imán quieto no da corriente).
   - Fuente para verificar: el diario de Faraday (29 ago y 17 oct 1831) y Williams (1965). La parte de física (★ 1) está en `verificado (extracto)`; la fila de verbal está `por verificar`.
3. **¿Fueron escritura los quipus?**
   - Encaja en verbal: `razonamiento-verbal.textos-filosoficos-y-cientificos`. Es un texto científico con dos hipótesis declaradas, y la pregunta central es separar dato de hipótesis (RV52).
   - Conecta con `aritmetica.numeracion` (★ 3, la base 10 de Locke) y con `razonamiento-matematico.tablas-graficos-y-suficiencia` (las sumas por niveles de Puruchuco).
   - Fuentes: Locke (1923), Urton (2003), Urton y Brezine (2005), *Science* 309, y Medrano y Urton (2018), *Ethnohistory* 65(1).
   - No repite t004, que cuenta lo numérico: este texto trata el debate.

Muy cerca: Carrión contra la comisión de Harvard (argumentativos), Guaman Poma escribe al rey (texto y contexto) y Snow y la cervecería (inferencias).

## Ganchos repetidos: dónde dejar cada uno

| Gancho | Escena (A) | Las demás apariciones |
| --- | --- | --- |
| Eratóstenes | trigonometría, `cinta-radio` | geometría (`segmentos-angulos`): un paso corto con GE17; verbal: solo si no se arma la escena |
| Quipus | aritmética, `numeracion` (Locke) | razonamiento matemático (`tablas-graficos`, Puruchuco); verbal: el debate; quitar la fila de álgebra (forzada) |
| Lavoisier | química, `materia-energia` / `balance-reacciones` | verbal: compatibilidad; la guillotina y «la República no necesita sabios», en mitos |
| Caldas | física, `calorimetria` | química (`liquidos-y-solidos`): remisión |
| Faraday | física, `induccion` | verbal en inglés; química: ánodo y cátodo como C |
| Villarreal | álgebra, `binomio-newton` | aritmética: remisión |
| Rhind 24 | aritmética, `razonamiento-numerico` | razonamiento matemático: remisión |
| Galileo, Méré, Pascal y Fermat | Galileo en aritmética, Méré en razonamiento matemático (`probabilidad-dados`) | la correspondencia de 1654, como B |
| Gauss y 1 + … + 100 | mito, B en aritmética (`sucesiones`) | hay que resolver antes la fecha de la versión «1 a 100» (1938 o 1966) en Hayes (2006) |
| Diofanto | una vez, en `traductor-enunciados` | — |
| Nightingale | verbal (textos discontinuos) | razonamiento matemático (`tablas-graficos`): C |
| Tales y la pirámide | geometría, `ampliadora` | trigonometría: remisión |
| Antúnez de Mayolo | verbal (tema e idea principal: el Cañón del Pato con el mito del neutrón) | física: remisiones |
| Mendeléiev | química, eka-silicio | verbal: solo eliminación de oraciones |
| Fibonacci y los conejos | una vez, en `sucesiones` | álgebra: el origen indio, como C |
| Boole y Shannon | `logica`: Shannon como A, Boole como B | — |

## Libros

Los libros de historia de la ciencia que valdría conseguir están en `fuentes/por-conseguir.md`, sección 6.

## Pruebas

`npm test` en verde antes del push (solo cambian documentos).

## Verificación (8 nov 2026)

Rama `rutina/historia-verificacion`, sacada de `claude/awesome-wozniak-5etl1n`. Encargo: verificar contra la fuente completa los 30 ★ de `docs/investigacion/historia-ganchos.md`. Solo documentos: no toqué escenas ni contenido de alumnos, y no subí `VERSION`.

### Red

Gerson aprobó los seis hosts: mathshistory.st-andrews.ac.uk, plato.stanford.edu, scielo.org.pe, arxiv.org, www.jstor.org y archive.org. SciELO Perú se sirve desde `www.scielo.org.pe`, que seguía bloqueado, y lo agregué aparte. Lo que funcionó y lo que no:

- **archive.org:** la ruta `/download/` redirige a servidores de descarga (`ia600…`, `ia902804.us.archive.org`, `dn…archive.org`) que dan 403. La ruta `https://archive.org/stream/<id>/<id>_djvu.txt` sí devuelve el texto completo, así que **no hizo falta agregar más hosts**. Los libros que solo se prestan (Ascher 1981, Roller 1950, Biggs-Lloyd-Wilson 1976, Benson 1979) no muestran el texto.
- **JSTOR:** responde, pero solo con un desafío de JavaScript; no se pudo leer ni la ficha. Varios artículos de JSTOR (Locke 1912, por ejemplo) sí están completos en archive.org.
- **Siguen bloqueados**, y harían falta para lo pendiente: cambridge.org, doi.org, www.frontiersin.org, tandfonline.com, nature.com, edweek.org, scientificamerican.com, maa.org, muse.jhu.edu, utpress.utexas.edu, ajtmh.org, PubMed, encyclopedia.com, rigb.org, scielo.org.co y las revistas de la UNAL.

### Método

Cinco verificadores en paralelo, seis ★ cada uno. Cada uno leyó la fuente completa, buscó la afirmación en el texto y anotó autor, año, página o sección y una cita literal. Después, un revisor volvió a bajar las 52 fuentes por su cuenta y comprobó que cada cita existe (salvo errores del OCR, como la ſ leída como f) y que respalda lo que se afirma. No cambió ningún estado, pero encontró seis textos corregidos que decían más que la fuente, y se ajustaron (Königsberg, quipus, Hammurabi, Buridan, Regiomontano y Haber).

### Resultado

| | ★ |
| --- | --- |
| `verificado` | 20 |
| `verificado`, con una parte marcada aparte (dudosa, mito o por verificar) | 6 (★3, ★10, ★12, ★19, ★22, ★26) |
| Siguen en `verificado (extracto)`: no se pudo abrir la fuente | 4 (★8, ★9, ★21, ★29) |

Ningún ★ resultó un mito entero. Las citas y páginas están en la columna de fuentes de cada fila.

### Lo que cambió (correcciones de contenido)

- **★1 Faraday:** el 29 ago 1831 el indicador fue una **aguja magnética**, no un galvanómetro (Bence Jones 1870, II, p. 2). «A mere momentary push or pull» es del **24 de septiembre**, no del día del anillo.
- **★2 Lavoisier:** sin cambios. Lo de Boyle, que estaba por verificar, está en su propio texto (1673, Exper. V): rompió el sello y después pesó.
- **★3 Quipus:** el nudo en ocho para el 1 está en Locke **1927**, no en 1912, y Locke dice «generally». Que el tramo vacío sea cero no está en Locke: queda atribuido a los Ascher, sin leer.
- **★4 Dinámica:** las dos citas en inglés que traía la fila **no están en la SEP actual**; se cambiaron por citas literales. «Es casi la primera ley» se suavizó: la SEP advierte contra hacer de Buridan un precursor de Galileo.
- **★5 Puy de Dôme:** sin cambios. Ahora se cita a Pascal (ed. Brunschvicg y Boutroux, II, pp. 351-369), con el padre Chastin y la torre de Saint-Jacques.
- **★6 Caldas:** el termómetro se rompió **en Popayán**, no en un viaje por los Andes (carta a Mutis, 1802). Tampoco hay Puracé en su relato. «Hipsómetro» es el nombre moderno.
- **★7 Seno:** «1500 años» pasó a «más de mil años». Regiomontano usó también una tabla de 6 000 000.
- **★10 Eratóstenes:** sin cambios (Heath 1921, II, pp. 106-107). Se agregó que Teón y Estrabón dan 252 000.
- **★11 Bouguer:** fecha del Chimborazo, **diciembre de 1738** (Bouguer 1749, p. 390; MacTutor dice 1740). Midió 7½″. Se quitaron, hasta leerlos, la «redención» de Smallwood 2010, el paso a Nueva Granada en 1739 y el regreso en 1744.
- **★12 Méré:** la carta de Pascal (29 jul 1654) **no dice que Méré apostara y perdiera**. Dice que ya sabía que en 24 tiradas hay desventaja y que le escandalizaba que fallara la regla de proporción. El gancho se reescribió y la apuesta perdida pasó a la tabla de mitos.
- **★13 Galileo:** «1613-1623» y lo del Gran Duque son conjeturas de F. N. David (1962), y ahora se dicen como tales.
- **★15 Ímpetu:** el ímpetu que «se gasta» es el de **Filopón**; para Buridan duraría si nada lo estorbara. Los grabados de Tartaglia y Ryff no se verificaron y salieron del texto.
- **★16 Calórico:** salieron «sin peso» y «hasta Joule». La SEP da el abandono del calórico en la década de 1840, con la primera ley.
- **★17 Königsberg:** **una isla** (Kneiphof), no dos. Salieron, hasta verificarlos, el 26 ago 1735, la impresión en 1741 y «no dibuja ningún grafo».
- **★18 Bombelli:** murió probablemente en **1572** (ninguna fuente dice 1573). «No por x² + 1 = 0» se matizó: Cardano ya se topó con √(−15) en 1545.
- **★19 Euler y √−2·√−3:** salió la mención a Needham (no se leyó). Se agregó la edición rusa de 1768.
- **★20 Interés:** la tablilla es **AO 6770, n.º 2**, y la respuesta del escriba, 3;47,13,20 años (Muroi 2015, arXiv). Salió «12 siclos por mina en el Código». La tasa de la cebada en el Código está en un pasaje restaurado.
- **★22 Wöhler:** no «calentó» el cianato: juntó ácido ciánico y amoniaco. Berzelius acuñó «isomería» en 1830 sin usar la urea de ejemplo. El mito del vitalismo sigue por verificar (Ramberg y McKie, bloqueados).
- **★23 Ørsted:** «nadie esperaba» exageraba. Él mismo esperaba una acción «lateral» (Ørsted 1830, p. 357).
- **★24 Le Chatelier y Haber:** Haber trabajó a unos **600 °C**, no a 500-550 °C (Johnson 2022). Salieron «había aire en la mezcla», «abandonó por eso» y «admitió que se le escapó».
- **★25 Euler y la función:** sin cambios en el gancho (Cajori 1929, §643; MacTutor). Se agregó el matiz de que Euler amplió su definición en 1755. Lo de Dirichlet ya está confirmado.
- **★26 Tales:** se verifica que las fuentes antiguas lo cuentan (Heath 1921, I, pp. 129-130; Diógenes Laercio I.27). El hecho sigue siendo dudoso.
- **★27 Nazca:** pasó de «por verificar» a verificado, pero **Nickell descartó la cuadrícula**: usó una línea central con coordenadas, estacas y cordel, en agosto de 1982 (*Skeptical Inquirer* 7(3), 1983).
- **★28 Nightingale:** sin cambios (Friendly 2008, §2.5.1).
- **★30 Carrión:** pasó de «por verificar» a verificado con cuatro artículos de SciELO Perú. Matices: Strong **sí aceptó** a Bartonella para la fiebre de La Oroya, y Harvard reconoció la unidad recién en **1937**. Las fuentes cambiaron: el artículo de «Pachas» no apareció.

### Lo que no se pudo verificar, y por qué

- **★8 Dorado electroquímico de Loma Negra** y **★9 Dorado por depleción:** Lechtman y otros (1982, *American Antiquity*) están en Cambridge y JSTOR; Lechtman (1984) no está en abierto; el estudio de 2020 está en Frontiers (no resuelve) y doi.org está bloqueado.
- **★21 SAT de 1982:** Education Week, Scientific American, MathWorld, Wikipedia y web.archive.org están bloqueados. Los resúmenes del buscador coinciden con la fila, pero no cuentan.
- **★29 Quipus como escritura (Urton 2003):** el libro y sus reseñas están en UT Press, Project MUSE, Cambridge y JSTOR. Hay una copia en archive.org que parece subida sin permiso, y no la usé.
- **Detalles sueltos que siguen por verificar:** el cero de los quipus (Ascher 1981, solo préstamo), el mito del vitalismo (Ramberg 2000, McKie 1944), Smallwood 2010 sobre Bouguer, la fecha de 1735 y la impresión en 1741 de Euler sobre Königsberg, los grabados de Tartaglia y Ryff, la defensa de Needham, y si la regla de Méré venía de Cardano.
- **No llegué a las demás filas** en `verificado (extracto)` (unas 160): el turno se fue en los 30 ★ y la revisión. Para seguir, conviene el mismo método por lotes. Para los cuatro ★ pendientes, habría que habilitar www.cambridge.org, doi.org y www.frontiersin.org, o que Gerson consiga los PDF.
