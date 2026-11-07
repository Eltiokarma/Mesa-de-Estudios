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
