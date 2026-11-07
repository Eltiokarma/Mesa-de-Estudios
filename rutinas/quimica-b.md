# Rutina de química B: reporte

Sesión paralela a la conversación principal, en la rama `rutina/quimica-b`. Orden: materia y energía, nomenclatura inorgánica, hidrocarburos, funciones orgánicas y, si queda tiempo, biomoléculas, recursos naturales y ambiente. No toca enlace ni líquidos y sólidos (son de la rutina de química). Cada plantilla pasa por cuatro manos: constructor, verificador independiente (sin leer el motor), revisor de contenido y correcciones del mismo constructor.

## 7 nov 2026 · Informe de ideas erróneas

`docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md`, hecho con un subagente investigador. Códigos MA1–MA11 (materia), NO1–NO4 (nomenclatura), HC1–HC4 (hidrocarburos), FO1–FO4 (funciones orgánicas), AM1–AM2 (ambiente); BI y RN sin estudios.

**Ojo:** el proxy de la sesión rechazó todos los sitios de artículos (ERIC, RSC, Redalyc, SciELO, DergiPark…); solo funcionó el buscador. Las cifras firmes son las que ya estaban en informes vecinos (Salame y Casino 2021, Georgiou y Sharma 2010, Casado y Raviolo 2005, Schmidt 1996, etc.); lo nuevo está marcado «resumen» o «sin verificar». Casi toda la nomenclatura y los errores de cálculo de examen son hipótesis. No hay ningún dato peruano (hay dos tesis de la UNSM sin abrir).

## 7 nov 2026 · La lupa y la balanza (`plantillas/materia-energia/`)

**Qué hice.**

- **`motor.js`** (UMD, `window.MotorMateria`, sin DOM): especies y cajas de partículas (elemento, compuesto, mezcla homogénea o heterogénea), conteo de academia de fases, componentes, elementos y átomos (`contarSistema`), cambio físico, químico o nuclear con conservación de átomos, burbujas al hervir, balanza en frasco cerrado y abierto (`evaporar`, `quemarMetal`), separación de mezclas con el método equivocado, E = mc², masa desde la energía, defecto de masa y balanza nuclear (en gramos), propiedades intensivas y extensivas, físicas y químicas, y la meseta de ebullición en Juliaca. Convenciones escritas en la cabecera: las propiedades químicas cuentan como intensivas; el aceite no tiene fórmula.
- **`casos.json`:** 24 casos con sus «tambien». **`motor.test.js`:** 45 pruebas (casos, papel, conservación de átomos y masa, E = mc² y su inversa, distractores distintos). **`papel.json`:** 10 problemas propios.
- **`index.html`, paso a paso** (8 pasos, 7 predicciones que bloquean):
  1. ¿en qué caja hay un compuesto? (MA9, parcial e hipótesis);
  2. el vaso con agua, hielo, aceite, sal disuelta y arena: 4 fases y 4 componentes (hipótesis);
  3. ¿qué hay en las burbujas? (MA1, parcial);
  4. el alcohol que se evapora en el frasco cerrado: la balanza no cambia; luego se destapa y baja (MA4, parcial);
  5. azúcar en agua contra clavo oxidado: solo el clavo forma sustancia nueva (MA3 y MA2, parcial);
  6. separar agua con sal: evaporar; el explorador ejecuta el método elegido (filtrar no separa nada);
  7. E = mc² con 1 g: 9 × 10¹³ J (errores de gramos, de c en km/s y sin el cuadrado, hipótesis).
- **¿Qué pasa si…?** (5): la lana de acero que arde en balanza abierta (sube), oxígeno con ozono (mezcla de un solo elemento), un átomo de azufre (sin color ni punto de fusión: MA11, documentado), agua que hierve en Juliaca a 87 °C (MA6 y MA7, documentados con Georgiou y Sharma 2010) y la balanza de un reactor (2 g menos).

**Subagentes y lo que corrigieron.**

- **Verificador:** recalculó con fracciones los 24 casos sin leer el motor; todos los números coinciden. Corrigió: el granito tiene 3 fases (cuarzo, feldespato y mica), no 2; el distractor de c en km/s iba en kg y la masa que baja en g (ahora todo en g).
- **Revisor:** una grave — en el reactor, «0 g» era defendible porque el enunciado encerraba todo en una caja; ahora la energía sale como calor y radiación. Medias: texto y lupa del clavo contaban distinto el O del agua; la lupa de la lana insinuaba el O₂ antes de responder; la cita de Juliaca estaba mal («entre 2 y 2,5 de cada 10») y su distractor pasó a MA7-sigue-subiendo; p8 decía «cien millones» y es 300 millones (c veces); rótulos tapados en PC; SiO₂ coloreado cerca de las fases. Bajas: contraste de chips en opciones marcadas (la masa pasó a #756300), «unos 14 000 años», divisiones con paréntesis, dibujo del azúcar, el clavo y el hierro sólido, leyendas de dibujos simplificados, rótulos del vaso ocultos antes de responder, la retro de la alternativa que acierta «sube» por la razón equivocada. Todo aplicado.

**Colores.** Elementos con `nucleo/elementos.js` (`Elementos.css(['H','C','O','Na','Si','S','Cl','Fe'])`, bloque puesto después de los `:root` de la escena: si va antes, `elementos-escenas.test.js` lee mal `--ink`; conviene decirlo en el brief). La integradora separó O–Na y C–Fe en la paleta para esta escena.

| Variable | Claro | Oscuro | ΔE00 mínimo con su vista |
| --- | --- | --- | --- |
| masa m y Δm (mostaza) | #756300 | #e3c84a | 22,2 |
| energía E (magenta) | #b3246b | #ff86bd | 26,9 |
| rapidez de la luz c (verde oscuro) | #255c1f | #5fe06a | 22,2 |
| fases (naranja) | #a05200 | #f0a04a | 29,1 |
| componentes (azul) | #1f5fbf | #7cb0ff | 26,8 |
| temperatura T, solo en Juliaca (ámbar) | #8f5800 | #ffc04d | 33,8 |

Mínimo de la escena contando pares de elementos: 20,3. Contraste mínimo de las variables: 4,70 (papel, tarjeta, chip al 8 % y opciones marcadas). Pares parecidos que nunca comparten vista: componentes–Fe y fases–T. `--oxido` (ocre del clavo) es decorativo, no nombra variable.

**Pruebas.** `npm test`: 2331, pasan 2329; fallan solo `catalogo.json` y «cada plantilla está en el catálogo» (falta integrar). `nucleo/elementos-escenas.test.js` en verde con la entrada de esta escena. Playwright a 390×844 y 1366×768, claro y oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes, avance bloqueado hasta responder, lienzo a la vista al responder en el celular.

**Pendiente.**

- Aire con N₂ en la lana: no se puso porque N–Fe está en `Elementos.CERCANOS` (ΔE00 ≈ 4 con la paleta nueva).
- En el celular, la línea punteada de la lupa roza el rótulo «se evaporó el agua».
- Azúcar, aceite y herrumbre dibujados simplificados (las leyendas lo dicen).
- El dibujo fijo del celular tapa la pregunta hasta desplazar (es de `nucleo/celular.js`, pasa en todas las escenas).
- Casi todos los distractores son hipótesis; documentados solo MA11, MA6 y MA7.
- Sin ítems en el banco de química.

### Pedidos para la integración

- **Catálogo:** agregar `materia-energia` a `quimica.materia-y-energia` en `catalogo/cursos/quimica.json`; `npm run catalogo`; subir `VERSION` en `app/sw.js`.
- **`docs/diseno.md`:** «Variables de la lupa y la balanza (`plantillas/materia-energia/`): los elementos con la paleta común (H, C, O, Na, Si, S, Cl, Fe); masa m y Δm mostaza (#756300, oscuro #e3c84a), energía E magenta (#b3246b, oscuro #ff86bd), rapidez de la luz c verde oscuro (#255c1f, oscuro #5fe06a), fases naranja (#a05200, oscuro #f0a04a), componentes azul (#1f5fbf, oscuro #7cb0ff) y temperatura T ámbar (#8f5800, oscuro #ffc04d, solo en Juliaca); ΔE00 mínimo 20,3; contraste mínimo 4,70. Componentes–Fe y fases–T nunca comparten vista.»
- **`docs/metodo/brief-plantilla.md`:** el bloque de `Elementos.css()` va después de los `:root` propios de la escena.
- **`docs/pendientes.md`:** «**La lupa y la balanza** (`plantillas/materia-energia/`, rutina de química B, 7 nov 2026): elemento, compuesto y mezcla por sus partículas, fases y componentes, cambio físico, químico y nuclear con la balanza en frasco cerrado y abierto, separación de mezclas y E = mc² con defecto de masa; 24 casos verificados aparte; 10 de papel; 7 predicciones y 5 «¿qué pasa si…?». Documentados MA11, MA6 y MA7; lo demás parcial o hipótesis. Falta: aire con N₂ en la lana (N–Fe cercanos en la paleta) y calor sensible y latente (está en calorimetría). Sin ítems en el banco de química.»
- **`CLAUDE.md`, historia:** «Materia y energía (7 nov 2026, rutina de química B): `plantillas/materia-energia/` (la lupa y la balanza: elemento, compuesto y mezcla, fases y componentes, físico contra químico con la balanza, separación y E = mc²; 24 casos verificados aparte). Informe nuevo: `docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md`.»

## 7 nov 2026 · El árbol de las funciones (`plantillas/nomenclatura-inorganica/`)

**Qué hice.**

- **`motor.js`** (UMD, `window.MotorNomenclatura`, sin DOM; convenciones en la cabecera, líneas 1 a 56): tabla de estados de oxidación de academia; parser de fórmulas con paréntesis, hidratos, iones y (ac); estados de oxidación con fracciones exactas (Fe₃O₄ +8/3, Na₂S₂O₃ +2, KMnO₄, K₂Cr₂O₇, NH₄⁺, H₂O₂, NaH, OF₂); fórmula desde dos iones (cruce y simplificación; el O₂²⁻ es una ficha que no se parte; rechaza compuestos que no existen, como peróxidos de Al o Fe y óxidos de amonio); clasificación de 14 funciones (con óxido neutro y óxido salino); el árbol (óxido, hidróxido, oxácido con meta, piro y orto para P y B, di- para S y Cr, hidruro, hidrácido, neutralización total o parcial); nombres en sistemática, stock (y «stock funcional» de los oxácidos) y tradicional, por partes con su color, y el camino inverso del nombre a la fórmula. Formas principales pentóxido y heptóxido (el parser acepta pentaóxido), romano con espacio «hierro (III)» igual en escena, papel y casos.
- **`casos.json`:** 25 casos. **`motor.test.js`:** 52 pruebas: las cargas cuadran en todo lo que se forma, cada nombre vuelve a su fórmula y ninguno sirve para dos, los nombres con error nunca son un nombre correcto de la misma sustancia, y recorren todas las parejas de la mesa y el árbol libres. **`papel.json`:** 10 problemas propios.
- **`index.html`:** tres vistas (el árbol, la mesa de fichas y el cloro con sus cuatro estados) y un panel con los tres nombres. Paso a paso (8 pasos, 6 predicciones que bloquean): estado del Fe en Fe₂O₃ (+3), su nombre stock, Al³⁺ con SO₄²⁻, Pb⁴⁺ con O²⁻ (PbO₂, y el peróxido Na₂O₂ que no se simplifica), SO₃ + H₂O → H₂SO₄ y el nombre tradicional del Na₂SO₄; el paso 8 es el mapa del hidrácido y la tabla de funciones. ¿Qué pasa si…? (5): el azufre con +4 (sulfito; después, la mesa libre), el cloro y sus cuatro (perclórico; después, el árbol libre con nodos que se destapan), la magnetita (estado promedio +8/3), el bicarbonato de potasio (quitar un solo H) y la caparrosa FeSO₄·7H₂O. Todo es hipótesis salvo lo que se apoya en NO1 y NO2 (parcial, con cautela); ningún 'documentado'.

**Subagentes y lo que corrigieron.**

- **Verificador:** todos los valores coinciden. Pidió renombrar la carga del catión (era la total; ahora `cargaTotalCation` y `cargaPorCation`), «óxido salino (doble)» para el Fe₃O₄, y avisó de usos de academia: pentóxido, «sistemática funcional» y tablas de estados más amplias.
- **Revisor:** dos graves. La mesa libre reventaba con NH₄⁺ e inventaba peróxidos ((NH₄)₂O₂, Al₂O₆, FeO₂, y un «PbO₂ óxido de plomo (IV)» con fichas de Pb²⁺); y tras responder los experimentos 1 y 2, la vista libre pisaba la respuesta. Medias: la correcta era la única con la cuenta completa; el +3 de la magnetita era defendible; la caparrosa mostraba Fe²⁺ antes de responder; faltaba el «?» del paso 6; citas de NO1 y NO2; lo absoluto de hipo-; el árbol era un mapa estático; contraste de las fichas (tinte al 8 %). Bajas: pentóxido, «Stock (funcional)», monosulfuro de hierro, notas de MnO₂ y H₃PO₃, textos chicos, avisos cuando un ion se apaga y radio de toque igual para capturar y tocar. Todo aplicado.

**Colores.** Sin variables propias: carga, estado de oxidación, romano y coeficientes en tinta, porque no hay tono a ΔE00 ≥ 20 de los 14 elementos (el fucsia de balance queda a 13 del S y a 11 del K). Elementos con `Elementos.css(['H','C','N','O','Na','Al','P','S','Cl','K','Ca','Fe','Zn','Pb'])`, después de los `:root` propios. Pares de `Elementos.CERCANOS` evitados cambiando el ejemplo: Cu–O (sulfato de cobre → caparrosa, el CuSO₄ queda solo en el papel) y C–Na (bicarbonato de sodio → de potasio). En la mesa y el árbol libres se apagan C–Na, Zn–C, K–S, Ca–S, Al–N, Fe–N y Pb–P, con aviso al alumno; Cu, Ag, Hg, Br e I no entran a las vistas libres. Pares más justos que salen juntos: Fe–S 20,3, Na–H 20,7, Pb–O 21,1, H–C 21,5. Contraste mínimo del texto en fichas y opciones marcadas: 4,59.

**Pruebas.** `npm test`: 2724, pasan 2722; fallan solo `catalogo.json` y «está en el catálogo». `elementos-escenas.test.js` con la entrada de abajo: 14 de 14 (en el scratchpad). Playwright a 390×844 y 1366×768, claro y oscuro, con y sin movimiento reducido, recorriendo todas las parejas libres: sin errores de consola ni desbordes.

**Pendiente.**

- **Para Gerson:** confirmar con su academia el romano con espacio («hierro (III)» o «hierro(III)»), el «tetraoxosulfato (VI) de…» y si su tabla de estados incluye S +2, N +1 y P +1 (hoy no).
- NH₄OH no tiene nombre común aparte (no se le pone «amoniaco», que es el NH₃).
- En el celular, al cambiar los selectores libres el dibujo queda fuera de la vista.
- Co está en el motor sin color en la paleta; no sale en la escena.
- Sin ítems en el banco de química.

### Pedidos para la integración

- **Catálogo:** `nomenclatura-inorganica` en `quimica.nomenclatura-inorganica`; `npm run catalogo`; subir `VERSION`.
- **`nucleo/elementos-escenas.test.js`:**
  ```js
    'nomenclatura-inorganica': {
      elementos: ['H', 'C', 'N', 'O', 'Na', 'Al', 'P', 'S', 'Cl', 'K', 'Ca', 'Fe', 'Zn', 'Pb'],
      vistas: [
        [['Fe', 'O', 'H'], []], [['Al', 'S', 'O'], []], [['Pb', 'O'], []], [['Na', 'O'], []],
        [['Na', 'S', 'O', 'H'], []], [['Na', 'Cl', 'O', 'H'], []], [['Cl', 'O', 'H'], []],
        [['K', 'C', 'O', 'H'], []], [['Fe', 'S', 'O', 'H'], []],
        // Mesa y árbol libres: las parejas de Elementos.CERCANOS se apagan.
        [['Na', 'O', 'H', 'N', 'P', 'S', 'Cl'], []], [['K', 'O', 'H', 'C', 'N', 'P', 'Cl'], []],
        [['Ca', 'O', 'H', 'C', 'N', 'P', 'Cl'], []], [['Al', 'O', 'H', 'C', 'P', 'S', 'Cl'], []],
        [['Fe', 'O', 'H', 'C', 'P', 'S', 'Cl'], []], [['Zn', 'O', 'H', 'N', 'P', 'S', 'Cl'], []],
        [['Pb', 'O', 'H', 'C', 'N', 'S', 'Cl'], []], [['N', 'H', 'O', 'C', 'P', 'S', 'Cl'], []],
      ] },
  ```
- **`docs/diseno.md`:** «Variables del árbol de las funciones (`plantillas/nomenclatura-inorganica/`): solo los elementos de la paleta común (H, C, N, O, Na, Al, P, S, Cl, K, Ca, Fe, Zn, Pb); carga, estado de oxidación, número romano y coeficientes en tinta (ningún tono queda a ΔE00 ≥ 20 de los catorce). Las fichas llevan tinte al 8 %. En la mesa y el árbol libres, las parejas de `Elementos.CERCANOS` se apagan con aviso; Cu, Ag, Hg, Br e I no entran.»
- **`docs/pendientes.md`:** «**El árbol de las funciones** (`plantillas/nomenclatura-inorganica/`, rutina de química B, 7 nov 2026): estados de oxidación (también fraccionarios), funciones inorgánicas como árbol que se destapa, mesa de fichas con cruce y simplificación (el peróxido no se parte), nombres en sistemática, stock y tradicional, sales ácidas e hidratadas; 25 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todo hipótesis o parcial (NO1, NO2). **Para Gerson:** romano con o sin espacio, «tetraoxosulfato (VI)» y si la tabla de estados incluye S +2, N +1 y P +1. Sin ítems en el banco de química.»
- **`CLAUDE.md`, historia:** «Nomenclatura inorgánica (7 nov 2026, rutina de química B): `plantillas/nomenclatura-inorganica/` (el árbol de las funciones: estados de oxidación, árbol de óxidos, hidróxidos, ácidos y sales, mesa de fichas que cruza cargas y los tres nombres a la vez; 25 casos verificados aparte).»

## 7 nov 2026 · Bolitas y palitos (`plantillas/hidrocarburos/`)

**Qué hice.**

- **`motor.js`** (UMD, `window.MotorHidrocarburos`, sin DOM; 8 convenciones en la cabecera, líneas 1 a 64). Cadena principal de alquenos con la regla escolar (IUPAC 1979/93: primero la de más enlaces múltiples, luego la más larga); `nombre().difiereIUPAC2013` avisa cuando la regla de 2013 elegiría otra, y la escena evita esas moléculas en las predicciones. Localizador delante del sufijo (but-2-eno) y la forma antigua (2-buteno) aparte.
  - Lee semidesarrolladas y SMILES sencillos con valencia 4 comprobada.
  - Fórmula, tipo, fórmula general, insaturaciones, tipos de carbono, hibridación y ángulo, σ y π.
  - Forma canónica (con o sin cis/trans) para decidir si dos dibujos son la misma molécula.
  - Nombre IUPAC de C1 a C10 (ramas alfabéticas, isopropil, sec- y terc-butil, dienos y eninos, ciclos, benceno, tolueno y xilenos, cis-/trans-).
  - Enumera isómeros: alcanos hasta C10, alquenos y alquinos hasta C8, cicloalcanos hasta C6.
  - Coordenadas 2D con z; `girar` rota una rama alrededor de un enlace simple y se niega en el doble y en anillos; `intercambiar` hace cis↔trans; `armar` agrega o quita C y cambia órdenes de enlace.
  - Puntos de ebullición de tabla (CRC), los mismos de `liquidos-y-solidos`.
- **`casos.json`:** 23 casos. **`motor.test.js`:** 48 pruebas (conteos conocidos hasta C10 = 75, hexenos 13 y 17 con cis-trans, alquinos C7 = 14, cicloalcanos C6 = 12; la semidesarrollada vuelve a la misma molécula; la forma canónica no depende del orden; girar no cambia la molécula y conserva largos; intercambiar cambia la molécula si y solo si hay cis-trans; ningún error da el nombre correcto). **`papel.json`:** 10 problemas propios.
- **`index.html`, paso a paso** (8 pasos, 7 predicciones que bloquean):
  1. pentano recto contra torcido: la misma sustancia (HC1 y HC3, hipótesis o parcial);
  2. CH₃–CH(C₂H₅)–CH₂–CH₃: 3-metilpentano (HC3);
  3. cuántos C₅H₁₂: 3;
  4. cis-trans: solo el but-2-eno (HC4, parcial);
  5. ebullición del pentano contra el 2,2-dimetilpropano: el pentano (HC2, **documentado**, Schmidt 1996, con cautela);
  6. 4-metilpent-2-eno (numerar por el doble enlace);
  7. hibridación del propino: sp, sp, sp³.
- **¿Qué pasa si…?** (5): arma tu alcano (luego armado libre), los 5 isómeros del C₆H₁₄, girar el 2-metilpropeno (cis = trans), ciclobutano contra but-1-eno (isómeros) y el ángulo del etino (180°).

**Subagentes y lo que corrigieron.**

- **Verificador:** sin leer el motor, recalculó los 23 casos con árboles libres y forma canónica AHU (C1 a C10 = A000602), alquenos como árbol con un enlace marcado y un nombrador propio por fuerza bruta; todo coincide y los puntos de ebullición difieren menos de 0,1 °C del CRC.
- **Revisor:** tres graves. Arrastrar un enlace congelaba la escena sin movimiento reducido (`blanco = null` antes de animar); en la ebullición cada molécula se escalaba sola y el 2,2-dimetilpropano parecía tocar más que el pentano (ahora misma escala); el etino y el propino dibujados en línea regalaban el 180° y la hibridación (ahora solo la fórmula hasta responder). Medias: número de opción mal en una retro, cita de HC2 más cautelosa («cerca de 1 de cada 5 de 246», «acertó 3 de cada 10»), el aviso de IUPAC 2013 que se prometía y no salía, el lienzo fuera de vista en la mesa del celular, «2-buteno» como forma de muchos libros, y el 3-metilpentano redibujado en zigzag. Bajas: nube pálida, termómetro, H del CH₃ que salían en cruz de 90° (el motor ahora los separa como máximo 60°), cautela con Şendur, «más compacta», «unos 120°». Todo aplicado.

**Colores.** C y H con `Elementos.css(['C','H'])`, después de los `:root` propios.

| Variable | Claro | Oscuro |
| --- | --- | --- |
| cadena principal | #1f5fbf | #7cb0ff |
| localizadores | #b3246b | #ff86bd |
| sustituyentes | #a05200 | #f0a04a |
| enlace doble o triple | #4d00b8 | #b27aff |
| temperatura de ebullición T | #255c1f | #5fe06a |
| ángulo de enlace | #756300 | #e3c84a |

ΔE00 ≥ 20 entre los que salen juntos (el más justo, T–H 20,4); sustituyentes–ángulo 18,9 nunca comparten dibujo (las vistas de hibridación no tienen ramas). Contraste mínimo 4,54 (C sobre su chip).

**Pruebas.** `npm test`: 3177, pasan 3175; fallan solo `catalogo.json` y «está en el catálogo». `elementos-escenas` con la entrada de abajo: 18 de 18 (en el scratchpad). `herramientas/pasada-celular.py` sin QUEDA. Playwright a 390×844 y 1366×768, claro y oscuro, con y sin movimiento reducido, con arrastre real de enlace por ratón y por toque: sin errores de consola ni desbordes.

**Pendiente.**

- Sin Z/E: solo cis/trans respecto de la cadena principal.
- El 109,5° del sp³ va en el texto; el dibujo plano no lo muestra.
- Algunos H se enciman en los C₈ muy ramificados.
- Puntos de ebullición de tabla, por contrastar con el libro que se use.
- Confirmar en un celular real que el arrastre de un enlace se queda con el dedo.
- Sin ítems en el banco de química.

### Pedidos para la integración

- **Catálogo:** `hidrocarburos` en `quimica.hidrocarburos`; `npm run catalogo`; subir `VERSION`.
- **`nucleo/elementos-escenas.test.js`:**
  ```js
    'hidrocarburos': {
      elementos: ['C', 'H'],
      vistas: [
        [['C', 'H'], ['--c-cad', '--c-loc', '--c-sus', '--c-mul']],
        [['C', 'H'], ['--c-T']],
        [['C', 'H'], ['--c-mul', '--c-ang']],
      ] },
  ```
- **`docs/diseno.md`:** «Variables de bolitas y palitos (`plantillas/hidrocarburos/`): C y H de la paleta común; cadena principal azul (#1f5fbf, oscuro #7cb0ff), localizadores magenta (#b3246b, oscuro #ff86bd), sustituyentes naranja (#a05200, oscuro #f0a04a), enlace doble o triple violeta (#4d00b8, oscuro #b27aff), temperatura de ebullición T verde oscuro (#255c1f, oscuro #5fe06a) y ángulo mostaza (#756300, oscuro #e3c84a); ΔE00 mínimo 20,4 (T–H); sustituyentes y ángulo (18,9) nunca comparten dibujo; contraste mínimo 4,54.»
- **`docs/pendientes.md`:** «**Bolitas y palitos** (`plantillas/hidrocarburos/`, rutina de química B, 7 nov 2026): la molécula como grafo (girar un enlace simple no cambia la sustancia, el doble no gira), cadena principal y numeración IUPAC con la regla escolar de alquenos (avisa cuando la de 2013 difiere), isómeros contados hasta C10, cis-trans, hibridación y ángulos, ebullición y ramificación; armado libre; 23 casos verificados aparte; 10 de papel; 7 predicciones y 5 «¿qué pasa si…?»; documentado solo HC2 (Schmidt 1996). Falta: Z/E y confirmar el arrastre en un celular real. Sin ítems en el banco de química.»
- **`CLAUDE.md`, historia:** «Hidrocarburos (7 nov 2026, rutina de química B): `plantillas/hidrocarburos/` (bolitas y palitos: la molécula como grafo, cadena principal y nombre IUPAC, isómeros, cis-trans, hibridación y ebullición; 23 casos verificados aparte).»

## 7 nov 2026 · El grupo que se cambia (`plantillas/funciones-organicas/`)

**Qué hice.**

- **`motor.js`** (UMD, `window.MotorFunciones`, sin DOM; cabecera hasta la línea 64). Adapta el grafo, la forma canónica y las coordenadas de hidrocarburos (copiados a su carpeta).
  - Lee semidesarrolladas y SMILES con C, O y N (valencias 4, 2 y 3; dobles y triples).
  - Detecta grupos y familia; el grupo principal sale por prioridad (ácido > éster > amida > nitrilo > aldehído > cetona > alcohol > amina > éter).
  - Nombra con IUPAC 1979/93 los compuestos monofuncionales de C1 a C8 (-ol, -al, -ona, ácido …-oico, …-oato de …-ilo, -amida, -nitrilo, -amina con N-, éteres como alcoxi), con la forma anterior, el nombre común de una lista y el benceno con un grupo.
  - Calcula el tipo de alcohol y de amina, los puentes de hidrógeno (entre moléculas y con agua) y la ebullición de tabla (CRC y NIST).
  - Compara isomería (función, posición o cadena) y enumera isómeros de verdad con la convención de la cabecera: esqueleto saturado, un solo grupo, sin O–O, O–N ni N–N y sin estereoisómeros. Así C₂H₆O = 2, C₃H₈O = 3, C₄H₁₀O = 7 y C₄H₈O₂ = 6.
  - Trae la caja de grupos (`ponerGrupo`) y la esterificación con el origen de cada átomo.
- **`casos.json`:** 24 casos. **`motor.test.js`:** 47 pruebas (cuentas por familia hasta C₆H₁₄O y C₅H₁₃N, nombres únicos al barajar átomos, errores que nunca dan la respuesta, puentes contra H unidos a O o N, la caja, la esterificación que conserva átomos). **`papel.json`:** 10 problemas propios.
- **`index.html`, paso a paso** (8 pasos, 7 predicciones que bloquean):
  1. ¿el CH₃–O–CH₃ es isómero del etanol? (FO1, parcial);
  2. ¿cuál hierve más? El etanol (FO2, **documentado**, Schmidt 1996, tabla 1, citado como «en otra pregunta»);
  3. propanal y propanona;
  4. 2-metilpropan-2-ol: terciario;
  5. CH₃–COO–CH₃: etanoato de metilo, con la parte del ácido y la del alcohol en colores distintos;
  6. terc-butilamina: primaria;
  7. pentan-2-ona, y la tabla de prioridad.
- **¿Qué pasa si…?** (5): mover el C=O del butanal al carbono 3 (luego la caja con el C=O), los isómeros de C₃H₈O, la fórmula del etanoato de etilo (C₄H₈O₂, con el ¹⁸O de Roberts y Urey 1938 dicho como química), el H que falta para el puente (metanamina contra metoximetano; FO2 parcial) y con qué grupo hierve más (–COOH; luego la caja libre con 9 grupos y de 1 a 6 C).

**Subagentes y lo que corrigieron.**

- **Verificador:** sin leer el motor, contó isómeros por fuerza bruta sobre árboles etiquetados (Prüfer) y comprobó nombres, clases, puentes y fórmulas en los 24 casos: todo coincide; los puntos de ebullición, a menos de 1 °C de CRC/NIST. Avisó que la propan-1-amina (47,2 °C) hierve casi igual que el propanal (48 °C) aunque forma puentes: se agregó una nota.
- **Revisor:** dos graves. El paso 3 decía que el metoximetano es gas de aerosoles antes de preguntar cuál hierve más, y el experimento 2 nombraba «alcoholes o éteres» y así descartaba FO1. Medias: la pregunta del paso 2 traía la definición que la contestaba; la cita de FO2 era de otra pregunta y decía «resumen» cuando el informe la dio por leída; los códigos del experimento 4 estaban cruzados; el papel p4 daba las temperaturas en el orden de la respuesta; el estado de la caja numeraba distinto que el dibujo; un ejemplo de isomería de cadena también cambiaba la posición; propan-2-ona y butan-2-ona como formas aceptadas. Bajas: contraste en opciones marcadas (tinte al 6 %, mínimo 4,59), anillos de «lugares» en punteado grueso de tinta, fila del éster sin sus dos colores en la tabla, espacios duros y guiones que no cortan, H con letra en los pares, la reacción a una sola escala, nota del HCN y textos del papel. Todo aplicado.

**Colores.** C, H, O y N con `Elementos.css(['C','H','O','N'])`; ningún par de esos cuatro está en `Elementos.CERCANOS`. No se pudieron reusar los de hidrocarburos: su azul de cadena queda a 7,1 del N y su magenta a 10,8 del O.

| Variable | Claro | Oscuro |
| --- | --- | --- |
| cadena principal | #187a00 | #59ce3b |
| localizador | #81310e | #ff621f |
| grupo funcional | #2c18dc | #958de2 |
| temperatura de ebullición T | #665200 | #ceb13b |
| puente de hidrógeno | #8f0081 | #ff33eb |
| parte del ácido (éster) | #a35200 | #e98f35 |
| parte del alcohol (éster) | #9d00e0 | #e099ff |

En cada vista, ΔE00 ≥ 20 entre los que salen juntos. El mínimo de una variable contra un elemento o la tinta es 22,2; entre variables, 23,2 (localizador–T); entre elementos, 21,2 (C–N). Los pares que nunca comparten dibujo quedan más cerca: localizador–ácido 13,6, grupo–alcohol 13,9, puente–alcohol 14,4, T–ácido 19,3 y grupo–puente 19,8. Por eso, en la caja y en la tabla de prioridad el nombre del éster va en tinta. Contraste mínimo 4,59.

**Pruebas.** `npm test`: 3451, pasan 3449; fallan solo `catalogo.json` y «está en el catálogo». `elementos-escenas` con la entrada de abajo: 26 de 26 (en el scratchpad). `pasada-celular.py` sin cambios ni QUEDA. Playwright a 390×844 y 1366×768, claro y oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes.

**Pendiente.**

- `isomeros()` no enumera amidas, aunque sí las nombra. Tampoco maneja compuestos con varios grupos, anillos o C=C: lanza un error claro.
- Los puntos de ebullición son de tabla; contrastarlos con el libro que se use.
- El HCN está en la caja con una nota de que en las academias se trata como inorgánico.
- Sin ítems en el banco de química.

### Pedidos para la integración

- **Catálogo:** `funciones-organicas` en `quimica.funciones-organicas`; `npm run catalogo`; subir `VERSION`.
- **`nucleo/elementos-escenas.test.js`:**
  ```js
    'funciones-organicas': {
      elementos: ['C', 'H', 'O', 'N'],
      vistas: [
        [['C', 'H', 'O', 'N'], ['--c-cad', '--c-loc', '--c-gf', '--c-T']],
        [['C', 'H', 'O', 'N'], ['--c-pu', '--c-T']],
        [['C', 'H', 'O'], ['--c-ac', '--c-al']],
      ] },
  ```
- **`docs/diseno.md`:** «Variables del grupo que se cambia (`plantillas/funciones-organicas/`): C, H, O y N de la paleta común; cadena principal verde (#187a00, oscuro #59ce3b), localizador marrón rojizo (#81310e, oscuro #ff621f), grupo funcional índigo (#2c18dc, oscuro #958de2), temperatura de ebullición T ocre (#665200, oscuro #ceb13b), puente de hidrógeno magenta (#8f0081, oscuro #ff33eb), y en el éster la parte del ácido naranja (#a35200, oscuro #e98f35) y la del alcohol violeta (#9d00e0, oscuro #e099ff). ΔE00 mínimo 21,2 dentro de cada vista y contraste mínimo 4,59. Los colores de cadena y localizador no son los de hidrocarburos, porque aquel azul choca con el N y aquel magenta con el O. Los pares cercanos (localizador–ácido, grupo–alcohol, puente–alcohol) nunca comparten dibujo: el nombre del éster va en tinta en la caja y en la tabla de prioridad. Los lugares para el grupo van en punteado grueso de tinta.»
- **`docs/pendientes.md`:** «**El grupo que se cambia** (`plantillas/funciones-organicas/`, rutina de química B, 7 nov 2026): el mismo esqueleto con el grupo que se mueve o se cambia (familia, nombre IUPAC y común, fórmula, ebullición y puentes de hidrógeno), isomería de función, posición y cadena, clases de alcohol y amina, el éster con sus dos partes y la esterificación; caja de grupos libre; 24 casos verificados aparte; 10 de papel; 7 predicciones y 5 «¿qué pasa si…?»; documentado solo FO2 (Schmidt 1996). Falta: amidas en el conteo de isómeros y compuestos con varios grupos. Sin ítems en el banco de química.»
- **`CLAUDE.md`, historia:** «Funciones orgánicas (7 nov 2026, rutina de química B): `plantillas/funciones-organicas/` (el grupo que se cambia: grupos funcionales, nombres, isomería de función, clases de alcohol y amina, puentes de hidrógeno y el éster con sus dos partes; 24 casos verificados aparte). Con esto la rutina de química B terminó su lista.»
