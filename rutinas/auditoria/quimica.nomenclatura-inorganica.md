# Auditoría de contenido: «Nomenclatura inorgánica» (quimica.nomenclatura-inorganica)

19 nov 2026. Auditor externo (cierre delegado, `docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md` y las lecciones de las Etapas 5 y 6 (`docs/metodo/unidad/etapa-delegada.md`).
Decisiones: `docs/etapa7/propuesta-quimica.md` (§8, §12 y «Decisiones tomadas al ejecutar»). Lo que vieron los dos
lectores en frío está en `rutinas/frio/quimica.nomenclatura-inorganica.md`; aquí se cita solo cuando el código lo
confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/quimica/nomenclatura-inorganica.js` (v0.2.0, sin `calidad: 2`): las 6 ideas con sus 7
  momentos, los 90 ejemplos, «Ahora tú» y «Así se resuelve» en 400 semillas por idea, el glosario (19 términos), las 2
  mesas del laboratorio en su grilla, el juego de cada idea en toda su grilla.
- Las piezas `quim-nomenclatura` (nueva) y `quim-fichas` (compartida: opciones `serif` y `oculta`, aditivas), y lo que la
  unidad dibuja con `quim-cadena`.
- La tarjeta `nomenclatura-examen` de `nucleo/convencion.js`, contra el texto de la IUPAC de 2005.
- La práctica `plantillas/nomenclatura-practica/`: 18 tipos en las 6 ideas, 400 semillas por idea, `casos.json` (18) y
  `papel.json` (8). La escena vieja (`nomenclatura-inorganica`, `"rehacer": true`) solo como motor de la teoría.
- La app a 390 px con `--entera --lector` (servidor propio, puerto 4432): 42 momentos y 90 ejemplos; md5sum sin
  capturas repetidas (las 18 de `lector/` son copias a propósito).

**Las tablas, propias** (`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-ni/quim.js`),
escritas sin abrir el motor, la teoría ni el generador:
- lector de fórmulas (paréntesis, hidratos, cargas, «(ac)»);
- EO de cada átomo por la suma: F −1; grupo 1, Ag +1; grupo 2, Zn +2; Al +3; H +1 (−1 si solo hay metales); O −2 salvo
  que los fijos obliguen a −1 (peróxido); un no metal con un metal o con H, su carga negativa; si quedan dos
  desconocidos, se separa un anión conocido (NO₃⁻, SO₄²⁻, HCO₃⁻…);
- EO de los metales de academia (Fe, Cu, Pb, Sn, Au, Co, Ni, Hg, Cr, Mn con dos) y de los no metales en sus oxácidos
  (Cl, Br, I: +1, +3, +5, +7; N, P: +3, +5; S, Se: +4, +6; C, Si: +4; B: +3);
- prefijos (mono a deca, con monóxido, pentóxido, heptóxido), romanos, raíces -oso/-ico de los metales, raíces de los no
  metales (adjetivo, anión, -uro, -hídrico), afijos por número de EO (hipo-…-oso, -oso, -ico, per-…-ico; con dos, -oso
  e -ico; con uno, -ico) y su anión (-ito, -ato, -uro), hidrogeno/dihidrogeno/bi-, hidratos con prefijo;
- oxácido = óxido + agua (tres aguas el P y el B), simplificado; sal = catión y anión en la proporción más chica.
- **Fórmula desde el nombre** (el otro camino que pedía el encargo: el autor usó OPSIN 2.8.0 para 340 nombres y una
  cuenta propia para 65): cada nombre que la unidad da como correcto se lee con estas tablas y se compara su composición
  con la de la fórmula; cada alternativa incorrecta se lee también, para ver que no sea otra correcta del sistema pedido.

**Cuentas.** Scripts `cuentas.js` (teoría), `pares.js` (texto fijo) y `cuentas-gen.js` (práctica), en la misma carpeta.
- «Ahora tú» y «Así se resuelve», 400 semillas por idea (4800 casos): **1180 EO** rehechos (la correcta y la suma que
  dice cada `siFuera`: «la suma daría −2», «juntos aportan +6»; el código de error contra su valor: TOTAL = n·EO,
  SUBINDICE = n, SIGNO = −EO, CARGA = la suma 0), **693 fórmulas** (la carga que dice cada explicación de un distractor:
  «la carga queda en +5», «dejan carga −1») y **6668 nombres comparados** (104 pares fórmula–nombre distintos dados como
  correctos, más todas sus alternativas). Los «cuál tiene EO +4» y «cuál es un peróxido», con una sola que cumple.
- Los 90 ejemplos, Lee, Mira, la regla, Predice, el glosario, las lecturas del juego en toda su grilla y las mesas: 108
  pares fórmula–nombre en el texto, todos cuadran (los que no, son las alternativas incorrectas a propósito). Los EO, las
  sumas de dos EO, los conteos de átomos (Al₂(SO₄)₃ 17, CuSO₄·5H₂O 9 O, Na₂CO₃·10H₂O 36) y cada explicación de las
  alternativas de nivel 3, a mano y con el script.
- **Las trampas producen el valor que dice su explicación**: EO con el signo cambiado (−3 en el Fe₂O₃: «los O ya son
  negativos»), subíndice tomado por EO (+2 en el Fe₂O₃ y en el N₂H₄), el total de dos átomos (+6, −4), -ito/-ato cruzados
  (nitrato por nitrito, hidrogenosulfato por hidrogenosulfito: cada uno es el anión del otro ácido), -oso/-ico al revés
  (la otra fórmula del mismo metal), hipo- por per- («hipoclórico» no existe, y así lo dice), peróxido contra dióxido
  (BaO₂ contra PbO₂; Na₂O₂ contra SO₂, SnO₂, CO₂, MnO₂). Solo fallaban los de A1 y M2.
- **Dos nombres correctos sin decir la convención**: ninguna pregunta pide un nombre sin decir el sistema cuando hay dos
  que valen («¿Cómo se llama el HBrO₂?» solo admite la tradicional, que es la única que la unidad enseña para los
  oxácidos; la pregunta de los tres nombres pide los tres). Dos casos de borde, bien resueltos por los Datos: el Ba(OH)₂
  («hidróxido de bario(II)» se descarta con la línea «sin romano si el elemento tiene un solo EO») y el hidruro escrito al
  revés (M5).
- La práctica: 2400 problemas (400 por idea), 139 nombres distintos, los 18 de `casos.json` y los 8 del papel. Todas las
  respuestas y todas las cargas o sumas de las explicaciones cuadran.

**La tarjeta «Convención del examen»** (`nomenclatura-examen`). Bajé el texto de las Recomendaciones de 2005 (IUPAC, Red
Book, PDF de iupac.org) y lo busqué:
- «ya no recomiendan -oso e -ico para los metales»: **comprobado**, y es más fuerte: el glosario del Red Book dice de
  «-ous» como terminación de un metal (ferrous chloride, cuprous oxide) «Such names are no longer acceptable». El texto
  puede quedar así.
- «ni el nombre “anhídrido”»: **sin fuente comprobada** como recomendación: la palabra «anhydride» no aparece en el texto
  (ni para recomendarla ni para rechazarla). Lo comprobable es «no lo usan».
- «usan la sistemática y la Stock»: comprobado (nombres de composición con prefijos, «diiron trioxide», y números de
  oxidación, IR-5.4.2.2).
- «Conservan los nombres de los oxoácidos y sus aniones (ácido sulfúrico, sulfato)»: comprobado (IR-1.4 e IR-8: «so
  commonly used (sulfuric acid, perchloric acid, etc.) that it would be unrealistic to suggest replacing them»).
- «llaman hidrogenocarbonato al bicarbonato»: comprobado (IR-8.5, «hydrogencarbonate»; el uso de «bicarbonate» se
  desaconseja desde 1940).
- La cabecera de la unidad y la propuesta dicen que la IUPAC de 2005 «no se pudo abrir»: ahora sí está comprobado lo
  de arriba; queda «sin fuente comprobada» solo lo del anhídrido.

**«Cl» contra «CI».** Van en la letra con serifa: las fichas (`quim-fichas` con `serif`), la fórmula de la tarjeta de
nombres (`quim-nomenclatura`) y la lectura del juego. Van sin serifa y se leen «CI»:
- los botones de alternativas y de controles («HCl», «Cl⁻»), los Datos, la leyenda («un no metal: N, C, O, S, Cl») y los
  enunciados: es la letra de la app (`--font`), no de la unidad;
- **el árbol de la idea 4 (`quim-cadena`)**: «HClO₃: ácido clórico», «Cl₂O₇», «HClO₄» en Juega no, pero sí en Predice,
  Mira y la regla. Es una pieza compartida que no trae opción de letra; no se tocó (ver «Pendiente»).

Validador con `calidad: 2` simulada (`Teoria.problemas` con 400 semillas y los temas del catálogo): **0 problemas** antes;
después de corregir, también 0 (tras ajustar a los topes de palabras los textos nuevos). Pruebas propias antes de corregir:
unidad 5 de 5, piezas y convención en verde, generador 5 de 5. `herramientas/ecuaciones-ancho.js`: «todo cabe» (53
pantallas) antes.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13, regla 3 de la Etapa 5 (una sola respuesta) | Idea 3, «Ahora tú» `casoCualPerox` («¿Cuál de estos compuestos es un peróxido?») | Cuando sale el MnO₂ (45 de 400 semillas), los Datos dicen «EO del Mn: +2 y +3» (la tabla de metales del motor). Con esos datos el Mn no puede tener +4: cada O del MnO₂ tendría −1 y el MnO₂ también sería un peróxido. Dos correctas con los datos que se dan. | Sacar el MnO₂ de la lista de dióxidos (o dar sus EO de óxido). Prueba: cada dióxido puede tener, por los Datos, el EO que pide. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13, regla 2 de la Etapa 5 | Idea 2, «Ahora tú» `casoStock` con I₂O₅ y Br₂O₃ | La explicación de «óxido de yodo» dice «El yodo tiene dos» con Datos que dan cuatro EO. 18 de 400. | Contar los EO de la lista: «tiene cuatro». |
| M2 | 5, 3 | Idea 2, Datos de `estadosTxt` | «EO del yodo: +1 y +3 y +5 y +7», «EO del nitrógeno: +1 y +3 y +5». 36 de 400. | Comas y una sola «y». |
| M3 | 13, punto 9 | Idea 6, «Así se resuelve» | Pide el nombre del Ba(OH)Cl («hidroxicloruro de bario») cuando Lee 3 dice que las sales con OH⁻ «aquí solo se reconocen» y ningún Dato dice cómo se nombran; el CoCl₂·6H₂O pide «cloruro de cobalto(II) hexahidratado» sin los EO del Co ni «hexa 6»; el KHSO₃ sin de qué ácido sale el HSO₃⁻ (lector B). 200 de 400. | Sales ácidas con «El HSO₃⁻ sale del ácido sulfuroso, H₂SO₃» y la regla de terminaciones; un hidrato de un metal de un solo EO con «hepta 7»; sin la sal básica, y sin repetir las sales de «Ahora tú». |
| M4 | 7, regla `igualdad-falsa` (química) | Idea 4: lectura del juego, árbol y Mira | «Na₂O + H₂O da NaOH», «Fe₂O₃ + H₂O → Fe(OH)₃»: contando átomos no cuadran (lector B). El balance es de Reacciones y balance. | Para los metales, «con agua da» y la relación («un OH⁻ por el +1»); la suma «+ H₂O» solo en los oxácidos, donde sí cuadra. |
| M5 | 13, regla 3 | Idea 3, «Ahora tú» `casoHidruro` | La alternativa «H₃Al» (o «HK», «HLi», «H₂Ba») tiene los mismos átomos que la correcta; la explicación dice que «con un metal, el metal va primero», pero ningún Dato lo dice. 80 de 400. | Dato «En la fórmula va primero el elemento con EO positivo». |
| M6 | 4, 1 | Idea 5, La regla | El dibujo (el de Mira) es Fe³⁺ con SO₄²⁻ y la ecuación termina en Al₂(SO₄)₃ (lector B). | La regla con Fe₂(SO₄)₃. |
| M7 | Regla 10 y 16 de las Etapas 5 y 6 | Idea 6, Predice del yeso | La correcta era la más larga y la única con razón («…enteras, sin carga, dentro del cristal»); el dato «OH⁻: carga −1» despistaba (lector B). | Opciones parejas, mismos `id`; sin ese dato. |
| M8 | 13 | Ejemplos (lector B): «El ácido de la gaseosa», «Verdadero o falso» de las ideas 4 y 5, «Un polvo blanco», «El gas y el ácido», «Dos nombres de un óxido ácido», «Otro bicarbonato» | Pedían el nombre «carbónico» sin raíz ni EO; el +3 del N del HNO₂ sin los EO del H y del O; «nitrato» sin «HNO₃: ácido nítrico»; «metal» del Mg; la raíz «clor-»; los EO del Cl para poner el romano. «Otro bicarbonato» traía la respuesta en Datos. | Datos agregados; el del bicarbonato da el ácido de origen, no el nombre. |
| M9 | 1, 13 | Idea 3: La regla, Lee 2, «Así se resuelve» (lector A) | «un metal con H, que tiene −1» no dice de quién es el −1; «no se simplifica» sin decir qué; el hidrácido del H₂S sin nombre; «la costumbre» sin decir cuál; las fichas pasan de EO («Na +1») a cargas de ion («Li⁺», «O₂²⁻»). | Regla reescrita; «los valores de siempre»; fichas con EO como en Mira. |
| M10 | 2, 3 | Ideas 1 y 2, Juega (lector A) | La misión pide el NH₄⁺ y el juego abre en H₂SO₄ sin decir que hay que cambiar; la misión de la idea 2 pide «-oso» antes de que nada lo explique; el borde punteado sin nombre. | Misión «Elige el ion amonio…»; leyenda «-oso: el menor de dos EO (-ico, el mayor)»; «punteado: sin pareja». |
| M11 | 7 de la Etapa 5 (renglones) | Toda la unidad y los Datos del generador | El guion de «-ico», «-oso», «-uro», «-hídrico» queda al final de una línea y la terminación en la siguiente (los dos lectores, 9 pantallas). `ecuaciones-ancho.js` no lo ve: es texto, no ecuación. | Unión sin corte (U+2060) tras el guion. |
| M12 | Molde §7 | Papel de `nomenclatura-practica` | 4 de los 8 problemas eran de sales y ninguno de las ideas 1 y 3; los rótulos «básico/intermedio/avanzado» no seguían el nivel del tipo. | «papel-1» a «papel-8» con un tipo fijo: las seis ideas, niveles 1-1-1-2-2-2-3-3 (como `analogias` y `areas-volumenes`). |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 5 | Idea 2, `casoFormula2` | «Un Hg con 1 oxígenos deja carga −1». | «con un oxígeno». |
| B2 | Código de error | Idea 3, `casoEOH`, y generador `eo-raro` | El −2 del H de un hidruro llevaba QM-OX-SIGNO; el signo cambiado de −1 es +1 (y ese ya es QM-OX-H). | QM-OX-SUMA. |
| B3 | 9 (orden) | Idea 4, `casoFormulaAcido` del P (+3) | La alternativa «H₃PO₂, ácido hipofosforoso» usa el P con +1, que la unidad no enseña (propuesta §12, 5). | Sin esa alternativa. |
| B4 | 6, 12 | «Un elemento solo tiene EO 0», «de el átomo», «sal común», «Vale si» con frases sueltas, nota de prefijos confusa, «Viene del», «Sal neutra: solo un catión» con Na₂SO₄ (lectores A y B) | Se lee mal. | Ver «Correcciones». |
| B5 | 3 | Glosario, «nomenclatura sistemática» | Sin `simple`. | Se queda así: con `simple` la idea 2 estrenaría 5 términos y el tope es 4 (el validador lo marca). |
| B6 | Pieza | Juega de sales | Con una ficha, la manija tapaba el único cuadrito: la leyenda «lleno/hueco» no se veía (lector B). | La manija va en el lugar siguiente. |
| B7 | 3 | Ejemplo «El combustible de los cohetes» | El resuelto no escribe «EO = −2» y la E se explica con el NH₃ (lector B). | Paso «Cada N, la mitad de −4: EO = −2»; la E, «sería un N con tres H, como en el amoníaco». |
| B8 | 5 | Lectura de la idea 3 | «amoniaco» (motor) y «amoníaco» (Lee, glosario): las dos valen; una sola en la unidad. | «amoníaco». |

## Lo que está bien y hay que copiar al molde

- **Las predicciones salen de la trampa del examen** y el juego no las adelanta, con prueba: el Fe₂O₃ fuera del juego de
  EO, el plomo fuera del de óxidos, los peróxidos fuera del de hidrógeno, el cloro fuera del árbol, los -oso fuera del de
  sales y los hidratos fuera del de la idea 6.
- **Cada `siFuera` de la idea 1 da la suma que produce su valor**, calculada en el código (`opcionesEO`), no escrita a
  mano: en 400 semillas no hubo una mal.
- **El generador de la práctica no usa el motor ni la teoría**: tablas propias, y su prueba rehace la respuesta con otras.
- **La tarjeta de nombres** (`quim-nomenclatura`) con un `<tspan>` por parte: el romano no se monta sobre la última letra.
- **Los símbolos en la letra con serifa** en las fichas y la fórmula de la tarjeta (`serif`), y `oculta` para el «?».

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Los Datos no contradicen la respuesta**: si un Dato da los EO de un elemento, el EO que la respuesta (o una alternativa que se descarta) le asigna está en la lista (A1). | Sí, en química: comparar «EO del X: …» con el EO calculado del X en cada alternativa. |
| **Una explicación que cuenta («tiene dos», «tres moléculas») cuenta lo mismo que los Datos** (M1). | Parcial: palabras de número contra la lista de su Dato. |
| **Las ecuaciones químicas escritas con «+» y «→» o «da» cuadran átomo por átomo**, o dicen que no están balanceadas (M4). | Sí: `igualdad-falsa` para fórmulas (contar átomos a los dos lados). |
| **Dos alternativas con la misma composición** solo si un Dato dice qué las distingue (orden, paréntesis) (M5). | Sí, con un lector de fórmulas. |
| **Un guion de terminación no queda solo al final del renglón** («-ico», «-uro») (M11). | Sí: buscar «-» delante de una terminación sin U+2060 en todo texto visible. |
| **El papel cubre cada idea de la unidad** (M12). | Sí: `papel-reglas.js` con las ideas de `_datos`. |
| **Una manija de arrastre no tapa lo que la leyenda nombra** (B6). | Parcial: la manija no cae sobre un elemento de la figura que esté solo. |

## Correcciones (19 nov)

Hechas en el mismo cierre, junto con las notas de los dos lectores en frío (ver `rutinas/frio/quimica.nomenclatura-inorganica.md`,
«Correcciones de la ronda 1»). Se mantiene la v0.2.0 (la unidad no se había publicado con esta versión).
- Copias de antes: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-ni/antes/`.
- Capturas de después: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-ni/despues/`.
- El guion de correcciones: `.../e7-cierre-ni/corregir.py`.

**Pruebas nuevas.** Todas fallan con los archivos de antes (comprobado en `.../e7-cierre-ni/viejo/` y `.../viejo-gen-r/`):
- al final de `nomenclatura-inorganica.test.js`, 9: A1 (Datos y dióxidos), M1–M2 (cuentas y listas), M3 (resuelve de la
  idea 6), M4 y M6 (igualdades y la regla de sales), M7 (yeso), M8 (Datos de los ejemplos), M11 y B4 (guiones y
  palabras), B6 (manija), M5 (orden del hidruro);
- al final de `generador.test.js`, 2: M12 (papel) y B2 con M11.

**Después:**
- unidad 14 de 14; generador 7 de 7; `quim-nomenclatura`, `quim-fichas` y `convencion` en verde (no cambiaron);
- validador con `calidad: 2` simulada y 400 semillas: 0 problemas;
- `cuentas.js`, `cuentas-gen.js` y `pares.js`: sin fallas (quedan, a propósito, el Ba(OH)₂ con romano descartado por su
  Dato y los hidruros escritos al revés, ahora con su Dato);
- `ecuaciones-ancho.js`: «todo cabe» (53 pantallas, 312 renglones);
- capturas de después (132, md5sum sin repetidas): la manija de las sales ya no tapa el cuadrito, la regla de peróxidos
  y el yeso como se describe arriba;
- el papel, regenerado con `herramientas/papel-generador.js nomenclatura-practica`.

| # | Qué se hizo |
|---|---|
| A1 | `AT3.dioxidos` sin el MnO₂. |
| M1, M2 | `listaY`, `estadosDe` y `CUANTOS`: «EO del yodo: +1, +3, +5 y +7» y «El yodo tiene cuatro». |
| M3 | `RES6` = NaHSeO₄, Ca(HSO₄)₂, LiHSO₃ y ZnSO₄·7H₂O, con `DATO_RES6` (ácido de origen o «hepta 7») y `D5.aniones`. |
| M4 | `lectura4` de los metales: «Na₂O con agua da NaOH: un OH⁻ por el +1»; flecha «con agua» en `arbol4` y en Mira. |
| M5 | `D3.orden` en `casoHidruro`. |
| M6 | La regla de sales termina en Fe₂(SO₄)₃. |
| M7 | Opciones del yeso más parejas («Dos moléculas de agua, sin carga»…), mismos `id`; Datos solo con los iones. |
| M8 | Datos de seis ejemplos; «Otro bicarbonato» con el ácido de origen y «bicarbonato de potasio» en la respuesta; la V/F de la idea 4 con la cuenta del N en su ecuación. |
| M9 | Regla de peróxidos reescrita; «los valores de siempre»; fichas de «Así se resuelve» con EO («Li +1», «O₂ 2·(−1)»), sin la cuenta. |
| M10 | Misión de la idea 1; leyenda de -oso y del punteado; consigna de la idea 2 con «Con un solo EO, sin romano». |
| M11 | U+2060 tras el guion de -oso, -ico, -uro, -ito, -ato, -hídrico y en «hipo-…» (139 en la teoría y los del generador). |
| M12 | `PAPEL` en el generador; papel regenerado: eo-neutro, fórmula de peróxido, hidróxido, tradicional de óxido, fórmula de sal, EO con dos átomos, nombre de oxácido y oxígenos de un hidrato. |
| B1–B8 | Todas hechas, salvo B5 (ver su fila). Las seis condiciones de «Vale si» reescritas como condición y dentro del tope de 22 palabras. |

### Pendiente

- **El «Cl» del árbol de la idea 4** (`quim-cadena`, pieza compartida que no es de esta unidad) se lee «CI»: necesita una
  opción `serif`, aditiva, como la que ganó `quim-fichas`. Los botones, Datos, enunciados y leyendas son la letra de la app
  (`--font`): un arreglo para toda la app lo decide la sesión o Gerson.
- **La tarjeta de la convención**: «ya no recomiendan… el nombre “anhídrido”» queda **sin fuente comprobada** (el Red Book
  de 2005 no nombra la palabra). Propuesta: «no usan el nombre “anhídrido”». No lo cambié: `nucleo/convencion.js` es
  compartido y el texto no es falso; lo decide la sesión.
- **Huecos blancos** bajo `quim-fichas` sin cuenta (Predice de la idea 1) y la columna vacía del hierro en Mira de la idea
  4: alto fijo de las piezas, a propósito.
- **Para Gerson** (decidido por la sesión, Gerson revisa después): los EO del nitrógeno se dan como +1, +3 y +5 en los
  óxidos (idea 2, del motor) y como +3 y +5 en los oxácidos (idea 4, propuesta §12, 5). Las dos listas son de academia; el
  N también tiene +2 y +4 (NO, NO₂), que la unidad no usa.
