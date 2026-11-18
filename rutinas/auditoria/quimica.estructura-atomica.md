# Auditoría de contenido: «Estructura atómica» (quimica.estructura-atomica)

18 nov 2026, noche. Auditor externo (fase 7 del método), sin editar la unidad. Contrato: `docs/plan-calidad.md` §3 (13
puntos) y §5. Formato: `docs/teoria.md` 4e, 4f, 4h, 4i y §5. Vara: `docs/molde-unidad.md` §2–§7 y §10. Decisiones:
`docs/etapa4/decisiones.md` (Estructura atómica y segunda ronda) y `docs/etapa4/propuesta-quimica.md`. Lo que ya
encontró el lector en frío (`rutinas/frio/quimica.estructura-atomica.md`) no se repite: se confirma en una línea y se
dice hasta dónde llega, porque él solo vio capturas.

**Qué se revisó.**
- `contenido/teoria/quimica/estructura-atomica.js` (v0.3.0, `calidad: 2`): las 6 ideas con sus 7 momentos, los 90
  ejemplos, «Ahora tú» y «Así se resuelve», el glosario (30 términos), las 3 mesas y la historia.
- Las piezas `quim-atomo` (paleta `zne`), `quim-cajas`, `quim-objeto`, `quim-hotel` y `quim-lamina`, y la tarjeta
  `ultimo-electron` de `nucleo/convencion.js`.
- La práctica: `particulas-nucleo`, `niveles-orbitales`, `configuracion-ubicacion` con `{ unidad }` (generarEA),
  `quimica-conceptos` con `{ unidad }`, sus `papel.json`, y la escena `atomo-y-tabla` con su papel.
- La app en mi propio servidor (puerto 4214, apagado al final): 134 capturas a 390 × 844 con `--entera` (momentos, 90
  ejemplos, glosario y laboratorio), sin errores de página.
- Scripts en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/aud-qui/`: `volcar.js` (solo
  extrae textos y `_datos`), `quim.py` (configuraciones, iones, Hund y último electrón escritos aparte), `ahora.py`,
  `nivel3.py`, `gen.py`, `datos.py` (qué falta en cada recuadro «Datos»), `iguales.js`; capturas en `cap/`.

**Pruebas.** `node --test` de la unidad, las 5 piezas, los 4 generadores, `atomo-y-tabla` y `convencion`: 326 de 326.
`contenido/teoria/teoria.test.js`: 160 de 160.

**Cuentas.** Rehechas con `quim.py`, que no carga la unidad ni los generadores (Madelung con las excepciones declaradas;
catión por mayor n y, a igual n, mayor ℓ; anión por el orden; Hund; último electrón con la convención de la tarjeta).
- «Ahora tú»: 72 (semillas 0–11 de las 6 ideas, todos los tipos), parseadas del texto de la pregunta. 72 de 72, con la
  correcta única entre las opciones.
- «Así se resuelve»: 18 (semillas 0–2). 18 de 18.
- Ejemplos de nivel 3: los 30. 30 de 30 con la letra de la respuesta. Los de nivel 1 y 2, a mano: todos bien.
- Generadores: 144 problemas, 3 semillas por tipo y subtipo (`particulas-nucleo` 11 variantes, `niveles-orbitales` 11,
  `configuracion-ubicacion` 13, `quimica-conceptos` 13), recalculados desde `_datos`. 144 de 144.
- **264 respuestas rehechas y ningún error de cuenta.** Los núclidos de `particulas-nucleo` existen todos; Cr, Cu, Cr³⁺,
  Cu²⁺ (3d⁹), Fe²⁺/Fe³⁺, Co²⁺, Sn²⁺ (salen los 5p), Tl⁺ y W están bien. Los iones de transición pierden el 4s antes que
  el 3d en todo el código.
- Los errores están en **la historia**, en **dos explicaciones de distractores** y en **lo que falta en «Datos»**.

**Lo que dijo el lector en frío, verificado.**
- Es real y sigue en el código: Thomson 1904 (y está en 4 sitios más: A1); [Ar] sin definir en 11, 15, 17 y 18 (son 10
  ejemplos: A3); el 4s que sale primero ausente en 15, 17 y 18 (falta en todos los ejercicios de catión: A2); Hund
  ausente en 17 y 18 (A2); el Cu²⁺ «pierden sus 4s» → 3d⁹ (M6); Datos regala la respuesta en el 16 (B3); 03 más fácil
  que 02 (B4); las proporciones fijas de Dalton sin enseñar (también en la práctica: A4); C-14 → N-14 junto a «el núcleo
  no cambia»; mₗ y ℓ = 1 → p sin presentar en el juego de la idea 3; Ni²⁺ con el frasco de sulfato ferroso; la combi
  difícil de leer; el 2p² y el 3d⁶ dibujados con Hund antes de la idea 6.
- Fue efecto de la captura (solo vio la tarjeta 1 de «Lee»): [Ne] sí se presenta en «Lee» de la idea 4 (tarjeta 3) y el
  imán sí se presenta en «Lee» de la idea 6 (tarjeta 2) y en «Mira». Queda la parte real: [Ne] no está en la leyenda
  del juego de la idea 5 (M8) y la regla de la idea 6 no dice que «paramagnética» es «la atrae un imán».

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10 (dato falso) | `estructura-atomica.js:968` (Mira de la idea 2, paso 2), `:658` (V/F de «Ahora tú» y de «Así se resuelve»), `:792` (datos del ejemplo «La carga positiva de Thomson»), `:852` (resuelto del V/F de Dalton) | El lector halló un sitio; son cuatro. «Thomson, 1904: halló el electrón…», «el electrón llegó con Thomson, en 1904». Thomson identificó el electrón en **1897**; 1904 es su modelo. La práctica de la misma unidad dice lo correcto: `quimica-conceptos/generador.js:1078` da «Electrón: descubierto en 1897» junto a «Thomson 1904». El alumno ve las dos fechas para el mismo hecho. | «Thomson, 1897: halló el electrón; en 1904 lo metió en una esfera positiva» (Mira). En `:658` y `:852`: «el electrón se descubrió en 1897, después de Dalton». En `:792`: «Thomson halló el electrón en 1897; su modelo es de 1904». |
| A2 | 13 | `DC` (`:183`) y `DEA` (`configuracion-ubicacion/generador.js:690`): no tienen ninguna línea con la regla de salida del catión ni con Hund. Faltan en las ideas 5 y 6: ejemplos (Fe³⁺, Zn²⁺, Cu⁺, Mn²⁺, Cr³⁺, Co²⁺, Fe²⁺/Fe³⁺, Sn²⁺; idea 6: Mn²⁺, Co²⁺, Fe³⁺, el diamagnético), `casoCationD`, `casoElectronesD`, `casoIon54`, `casoUltimoCat`, `casoDesap`, `casoDesapCat`, `casoMagnetico`, los dos «Así se resuelve» y, en la práctica, `eaCation`, `eaDesapareados`, `eaMagnetico`, `eaCuanticos` (cation) y el papel p3 | `datos.py`: 39 ejercicios de catión sin «salen primero los de mayor n»; 25 de desapareados sin Hund. Solo 2 ejemplos de la idea 6 traen Hund y nadie trae la regla del catión. En la idea 4 el orden de llenado sí va en «Datos» (es la herramienta), así que en las ideas 5 y 6 falta la herramienta equivalente. El lector se trabó justo ahí (15, 17 y 18: «¿por qué los 4s? No está en ningún lado»). | Dos líneas en `DC` y en `DEA`: `catión: 'Catión: salen primero los de mayor n; a igual n, los de mayor ℓ'` y `hund: 'Hund: una flecha en cada caja vacía antes de aparear'`. Ponerlas en todo ejercicio de catión o de desapareados (también en el papel), y una prueba que lo exija por tipo. |
| A3 | 13 | Ejemplos «El último nivel del bromo», «El último nivel del cobre», «Niveles llenos del bromo», «Los 3d del Fe²⁺ y Fe³⁺», «El Mn²⁺ y el imán», «El último del escandio» y «El cinc» (los dos dan [Ar] en el enunciado), «El último del Co²⁺», «Los solos del Fe³⁺» y «Los solos del cromo» | Son 10 ejemplos que usan [Ar] sin `DC.ar` en «Datos» (el lector vio 4). La captura `claro-cel-ej-desapareados-isoelectronicos-11.png` lo muestra: el resuelto empieza con «[Ar] 4s² 3d⁷» y los datos no dicen qué es [Ar]. | Agregar `DC.ar` a esos 10. Una prueba: si el enunciado o el resuelto tiene [Ne], [Ar] o [Kr], sus datos traen la línea del gas. |
| A4 | 13, 9 | `quimica-conceptos/generador.js:261-268` (tema `dalton`) y `:1078` (`DATOS_TEMA.dalton`); `casoEvidencia` (`:694-700`, «proporciones fijas», «rayos catódicos»); papel de `quimica-conceptos` p11 | El lector lo vio en la teoría, pero la práctica lo agranda. La práctica pide los postulados de Dalton: dal2 («iguales en masa»), dal3 («solo se reordenan»), dal4 («proporciones de números enteros sencillos») y dal7. Sus datos son solo los años y «Electrón: 1897. Neutrón: 1932». La teoría nunca enseña esos postulados: dice «esferas macizas que no se parten». Lo mismo en «Ahora tú»: 2 de las 5 evidencias de `casoEvidencia` (las proporciones fijas y los rayos catódicos) no salen en ningún «Lee», «Mira» ni regla, y sus datos son los años. La propuesta aprobada (§9) pedía «las definiciones o postulados entre los que se elige». | Una tarjeta de «Lee» o un paso de «Mira» con los tres postulados (átomos indivisibles e iguales dentro de un elemento; se reordenan en una reacción; se combinan en números enteros) y los rayos catódicos de Thomson. Esas mismas líneas en `DATOS_TEMA.dalton` y en `casoEvidencia`. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 10, 13 | Ejemplo «El último del Co²⁺», `:2287` | «La D llena cada caja con dos antes de pasar». Pero llenar sin Hund da (3; 2; **+1; +½**), que es la **C**. La D, (3; 2; +2; −½), no sale de ese error ni de ninguno nombrado (`nivel3.py`). El alumno que comprueba no lo encuentra. | «La C llena cada caja con dos antes de pasar. La D…» (o cambiar la D por otro error con su explicación). |
| M2 | Decisión (propuesta §2 y §9) | `plantillas/atomo-y-tabla/plantilla.json` (sin `"rehacer": true`); `atomo-y-tabla/papel.json` (los 10 problemas sin `unidades`) | La decisión era mandar la escena a «Más mesas del tema». Sigue en la lista de la unidad como cualquier otra. Su papel sale entero desde Estructura atómica, también p5–p9: periodo, grupo, radio, energía de ionización y radios de isoelectrónicos. Eso es de Tabla periódica, llega después (punto 9) y salió a propósito de esta unidad. Además el papel no trae «Datos» (punto 13) y escribe «l» y «n + l» en vez de ℓ. | `"rehacer": true` en la plantilla; `unidades` en cada problema del papel (p1–p4 y p10 aquí, p5–p9 en Tabla periódica); datos al final con `herramientas/papel-generador.js`, y ℓ. |
| M3 | Decisión (pregunta 9) | `nucleo/convencion.js:43-50`; comentario de la unidad `:2096-2098` | La decisión pedía la convención de mₗ y mₛ «confirmada con un libro de `fuentes/`». No está confirmada: `fuentes/libros/` está vacía. Es la respuesta de todos los ejercicios del último electrón (teoría y práctica). Si la academia o el examen usan otra, el alumno aprende un signo que le marcan mal. | Confirmar con un solucionario oficial de San Marcos o de la UNI (2024-II, 2026-I, 2027-I ya están clasificados) y citarlo en la tarjeta. Mientras tanto, avisar a Gerson de que está pendiente. |
| M4 | 3, 9 | Regla de la idea 5, `:2057`; regla de la idea 6, `:2415` | La regla que ponen «Así se resuelve», el Sn²⁺ de nivel 3 y `casoIon54` (a igual n, sale primero el de mayor ℓ) va en la `condicion`, que la app pinta como «**Vale si** a igual n, sale primero…» (`app/teoria.js:703`). Eso se lee como un requisito y no como una regla. Pasa lo mismo en la idea 6 («Vale si convención del examen…»), la 4 («Vale si átomos neutros…») y la 3 («Vale si… El hotel es una analogía»). El lector lo vio solo en la idea 2. | Pasar «a igual n, sale primero el de mayor ℓ» al `texto` de la regla 5. Reescribir las condiciones 3, 4 y 6 como condiciones de verdad («los átomos son neutros y están en su estado de menor energía»), o mover la nota a `voz` o a la tarjeta de convención. |
| M5 | 5, 9 | Teoría: `abreviada()` (`:154`, «el gas más grande contenido») contra el generador (`configuracion-ubicacion/generador.js`, cabecera: «el gas con MENOS electrones que la especie») | La misma especie sale abreviada distinto en la teoría y en la práctica. Br⁻: teoría «[Kr]» (`casoIon54`), práctica «[Ar] 4s² 3d¹⁰ 4p⁶». Cl⁻: juego de la idea 5 «[Ar]», práctica «[Ne] 3s² 3p⁶». Te²⁻: teoría «[Kr] 5s² 4d¹⁰ 5p⁶» (no hay [Xe] en `GASES`), aunque para el Br⁻ sí usa el gas propio. Las dos formas son correctas, pero el alumno ve dos respuestas para lo mismo. | Elegir una sola regla para la unidad (recomiendo la del generador: con el gas anterior, «[Ar] 3s²…» nunca es la especie entera) y usarla en `abreviada` de la teoría, con una prueba que compare las dos. |
| M6 | 13 | Ejemplo «Un ion sin electrones solos», `:2315` | Confirmo lo del lector: «Los cinco pierden sus 4s: quedan … 3d⁹» no da el Cu²⁺ desde [Ar] 4s¹ 3d¹⁰, que está en los datos. Tampoco define «diamagnético». | «El Cu²⁺ pierde su único 4s y uno del 3d: 3d⁹». En datos, `DEA.magnetico` (la misma línea de la práctica). |
| M7 | 6, 10 | Comentario `:39-40` contra el ejemplo «Un arándano en el estadio», `:805-812` | El comentario dice que el arándano de OpenStax «no se usa» porque no se pudo comprobar, pero el ejemplo lo usa en título y enunciado. Además invierte la imagen. En OpenStax el átomo **es** el estadio y el arándano su núcleo; aquí, con 100 000, sale «1 km: más largo que un estadio». El título promete una cosa y la respuesta dice otra. | Título y enunciado propios, sin arándano ni estadio: «Si el núcleo midiera 1 cm, como una canica…» (y corregir el comentario), o comprobar la fuente y usar la imagen tal cual. |
| M8 | 3 | Juego de la idea 5 (`:2005-2011`); captura `claro-cel-configuracion-iones-2-juega.png` | La figura dice «Cl: [Ne] 3s² 3p⁵» (y [Ar] con otras cargas), pero la leyenda no dice qué es [Ne] ni [Ar]. «Lee» de la idea 4 los presenta, pero el contrato los pide en la misma pantalla. | Agregar a la leyenda `{ s: '[Ne]', t: 'los 10 electrones del neón' }` y `[Ar]`. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 13 | Ejemplo «Isóbaros e isótonos», `:478` | «La A, la B y la E cambian los pares: Ar y K no comparten A ni N». La E (isóbaros K y Ca; isótonos Ar y Ca) no tiene el par Ar y K: queda sin explicar. | «La E cruza los dos pares: K y Ca no comparten A, y Ar y Ca no comparten N». |
| B2 | 13 | `casoEscala`, `:725`; `niveles-orbitales` `tESub` | El distractor «unidad» (100 km para 1 mm) dice «falta convertirlo», pero el error es haber convertido mal. Con n = 5, `QM-N-L` dice «es todo el nivel 4». | «Bien multiplicar. Pero 100 000 mm son 100 m, no 100 km». Con n = 5, usar el nivel 5 o sacar el distractor. |
| B3 | 13 | Ejemplo «Una flecha hacia abajo», `:2222` | Confirmo lo del lector: `DC.conv2` contiene la respuesta («las ↓ (mₛ = −½)»). | Dar la convención de las ↑ y preguntar por la ↓ con «la otra flecha del mismo cuarto», o subir el ejemplo a una caja con dos flechas. |
| B4 | Molde §3 (niveles) | Idea 1, nivel 3 «Lo que comparten dos isótopos» contra nivel 2 «Dos átomos de cloro» | Confirmo lo del lector: los mismos números (Cl-35 y Cl-37) y un solo paso. | Un nivel 3 que cruce isótopo e ion: «³⁵Cl⁻ y ³⁷Cl: ¿qué tienen igual?». |
| B5 | 10 | Juego de la idea 1 (n de 0 a 14 con Z ≤ 12) y de la idea 5 (carga de −3 a +3 con Z ≤ 20) | La lectura presenta como reales «hidrógeno, A = 15», «Na³⁻» o «Ne³⁻ → 1s² … 3p³». Los rangos están aprobados, pero la lectura no avisa que esas especies no existen. | Que la lectura agregue «(no existe en la naturaleza)» fuera de una lista de núclidos e iones reales, como ya hace con «no tiene tantos electrones». |
| B6 | 10 | Glosario «diamagnético», `:2593`; `DEA.magnetico` | «Un imán no la atrae»: está bien para el examen, pero un diamagnético es repelido muy débilmente. | «Un imán no la atrae (la empuja muy débilmente)». |
| B7 | Molde §2 | `iguales.js`: «Así se resuelve» de las ideas 3 y 5 | 3 de 12 resueltos tienen la misma pregunta que un «Ahora tú» de las semillas 0–59 (p. ej. «¿Cuántos orbitales tiene el subnivel 3p?», «…del ion Ni²⁺»). | Sacar el caso resuelto de la lista de «Ahora tú» con un filtro por semilla, o dar al resuelto otra lista (los 4d del nivel 5). |
| B8 | 5 | Mesa «cajas-ion», `:2688` y `:2469` | El control «Carga» no tiene `color: 'c-h'`, a diferencia del juego de la idea 5 y de «arma-ion». El rótulo dice «Cl: 1 desapareados». | `color: 'c-h'` y el singular. |

## Lo que está bien y hay que copiar al molde

- **La química del motor de la unidad, sin un solo error en 264 respuestas**, con todas las trampas del examen como
  distractores calculados: QM-ULTIMO (el último en entrar sale primero), QM-REPARTE, la anomalía olvidada, QM-5P-ANTES,
  QM-S-PRIMERO (Sn²⁺) y QM-ULTIMO-4S. Las listas excluyen a propósito lo que no sigue la regla (Nb, Ru, Rh, Pd, Pt,
  lantánidos) y nunca piden el último electrón del Cr ni del Cu. Hay que copiarlo: **una lista de exclusiones
  declarada en la cabecera**.
- **El nitrógeno nunca sale como N suelto**: `SIMB_Q` lo pone como ¹⁴N, la práctica lo saca de las listas
  (`zx === 7 → null`) y una prueba lo revisa. Así se resuelve una letra que choca, sin cambiar la notación del libro.
- **Los datos por línea, compartidos entre teoría y práctica** (`DC` = `DEA`, `DF1` = `D` de `particulas-nucleo`), con
  el orden de llenado que crece con el problema (`DEA.orden(e)`: hasta 4p, 5p o 6p). Falta agregar la regla del catión
  y Hund (A2).
- **Predice de la idea 4, movida al electrón 37** (5s contra 4d), porque el juego ya mostraba el 19. Está anotado y
  avisado. Así se cumple «predecir lo que el juego no mostró».
- **`cerrarEA` rechaza dos alternativas con el mismo código de error** y agrega «Así salen N» a la explicación que no
  lo dice. Las dos son reglas baratas para todo generador.
- **La práctica de `configuracion-ubicacion` separada por unidad** con `generarEA` y `unidadCatalogo`, sin cambiar las
  semillas de antes. Es el modelo para cualquier generador compartido.
- **Las cuentas del alfa en `desvio()`** (Thomson, Dalton y nuclear) están en el código y la lectura dice «casi nada»
  o «rebota»: se ve el modelo sin inventar cifras.

## Reglas que faltan en el contrato o el validador

1. **Una fecha, un hecho, en toda la unidad y su práctica.** Se puede comprobar en parte: una tabla de hechos
   históricos de la unidad (`historia: { 'electrón': 1897, 'modelo de Thomson': 1904 … }`) y una prueba que busque en
   los textos «<científico> … <año>» y exija que el año sea el de la tabla. Habría detectado A1 en los 4 sitios y la
   contradicción con `quimica-conceptos`.
2. **La regla que el ejercicio practica va en «Datos» si es una herramienta** (orden de llenado, salida del catión,
   Hund). Se puede comprobar por tipo: cada tipo declara sus líneas obligatorias y la prueba las exige en 400 semillas,
   en la teoría y en el generador (A2).
3. **Un símbolo abreviado en el resuelto exige su línea en datos.** Se comprueba con texto: si el enunciado, las
   alternativas o el resuelto tienen `[Gas]`, los datos traen `[Gas]:` (A3, M8). Lo mismo para términos definidos con un
   dato (paramagnético, diamagnético).
4. **Cada explicación de distractor de un ejemplo de nivel 3 se rehace con el motor.** Hoy los ejemplos son texto a
   mano. Que cada `{ letra, error }` declare el error, que la prueba lo calcule con las funciones de la unidad (sin
   Hund, sin excepción, saca del 3d) y que lo compare con la alternativa (M1, B1). Solo es automático en las unidades
   con motor de errores. En las demás, lo rehace el auditor.
5. **Una práctica de V/F solo afirma lo que enseña la teoría o lo que dan sus datos.** Es semiautomático: cada
   proposición declara la idea y la línea («Lee», «Mira», regla o dato) que la respalda, y la prueba exige que esa
   línea exista (A4).
6. **«Vale si» solo con condiciones.** El validador puede rechazar una `condicion` que empiece por «convención», «a
   igual», un sustantivo sin verbo o que traiga dos frases (M4). La otra opción es cambiar el rótulo de la app a
   «Ojo:» cuando la condición no es una condición.
7. **Una escena que la propuesta manda a «Más mesas del tema» lleva `rehacer: true`, y su papel lleva `unidades`.** Se
   puede comprobar cruzando `docs/etapa*/decisiones.md` (lista de plantillas a rehacer) con `plantilla.json`. Sin eso,
   basta una prueba de que todo papel de una plantilla con dos unidades o más declara `unidades` en cada problema (M2).
8. **Una sola forma de abreviar por unidad**, con una prueba que compare las funciones de la teoría y del generador en
   las mismas especies (M5).
9. **La convención de signos que exige una decisión se marca como pendiente en la tarjeta** hasta que tenga fuente, y
   el validador avisa si una tarjeta de convención no trae `fuente` (M3).

## Correcciones

(Pendiente: la sesión que corrija anota aquí qué hizo con cada hallazgo.)
