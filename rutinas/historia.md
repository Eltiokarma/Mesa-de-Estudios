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
