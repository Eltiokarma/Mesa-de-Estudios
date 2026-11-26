# Auditoría de contenido: «Reacciones químicas y balance» (quimica.reacciones-y-balance)

26 nov 2026. Auditor externo (cierre delegado, `docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa9/propuesta-quimica.md`. Antes pasó el redactor
(`rutinas/redaccion/quimica.reacciones-y-balance.md`), con cinco notas para el auditor; aquí se cierran. Lo que vieron
los dos lectores en frío está en `rutinas/frio/quimica.reacciones-y-balance.md`.

**Qué se revisó.**
- La teoría `contenido/teoria/quimica/reacciones-y-balance.js`: las 6 ideas con sus 7 momentos, los 90 ejemplos,
  «Ahora tú» y «Así se resuelve» en 200 semillas por idea, el juego de cada idea en toda su grilla, el glosario, el
  laboratorio y la historia.
- El motor compartido `plantillas/balance-reacciones/motor.js` (la unidad toma de ahí balances, EO, redox e
  ion-electrón) y la pieza nueva `nucleo/kit/piezas/quim-reaccion.js`.
- La práctica `plantillas/reacciones-practica/` (18 tipos en 6 ideas): 800 semillas mirando el enunciado y la
  respuesta, y su papel.
- La app a 390 px con `--entera --lector` (servidor propio, puerto 4233): 42 momentos y 90 ejemplos.

**Las herramientas, propias** (en
`/tmp/claude-0/-home-user-Mesa-de-Estudios/c6e6072f-61c1-5ae4-9fde-081abfdefa41/scratchpad/cierre-quimica/`), escritas
sin abrir el motor ni la prueba del autor:
- `quimica.js`: un lector de fórmulas en Unicode (subíndices, superíndices de carga, paréntesis, hidratos, estados,
  e⁻) y un extractor de ecuaciones de cualquier texto, con el balance de átomos y de carga de cada una.
- `balance.js`: balance por espacio nulo con fracciones exactas (Gauss propio), semirreacción en medio ácido y básico
  (A, B, H₂O, H⁺ u OH⁻, e⁻ con signo libre) y ecuación global.
- `recolectar.js` + `revisar.js`: juntan **64 302 textos** que ve el alumno (todo lo de arriba) y las **282 cajas de
  partículas** dibujadas; `respuestas.js` rehace las respuestas de «Ahora tú».

**Cuentas.**
- **6276 ecuaciones** leídas en los textos (1097 distintas). Cuadran en átomos y carga todas las que se presentan como
  terminadas. Las 883 «distintas que no cuadran» son, una por una, lo que debe no cuadrar: esqueletos que el alumno
  balancea, el juego del metano en toda su grilla, distractores, pasos intermedios del ion-electrón (antes de los
  electrones) y preguntas con un «__». Revisé a mano todas las que traen coeficientes y no son del juego ni
  distractores (27): ninguna se presenta como terminada sin serlo, salvo la tarjeta «El hidrógeno» (M2).
- **67 vasos distintos** (en todos los cortes de Mira y la grilla del juego): neutros todos, con la carga leída del
  rótulo de la lupa (no de la tabla del autor).
- **512 respuestas de «Ahora tú»** rehechas con mi balance (coeficiente del espacio, átomos de un elemento, suma de
  coeficientes, coeficiente del O₂, agua y su lado, OH⁻ y su lado, electrones que faltan y su lado, suma de la global
  en ácido y en básico): ninguna mal. Las demás formas (agente con su coeficiente, electrones por unidad, dismutación,
  clase por forma y calor, indicio) se revisaron a mano en todas sus variantes distintas: bien.
- Ejemplos de nivel 3 de las ideas 3 a 6, a mano: bien (P + HNO₃: 3, 5, 2, 3, 5 y suma 18; Fe²⁺ + Cr₂O₇²⁻: 36;
  oxalato: 16 H⁺; MnO₄⁻ + SO₃²⁻ en básico: 2 OH⁻ a la derecha; Zn + NO₃⁻ → NH₄⁺: 4 Zn; 4 NH₃ + 5 O₂: 20 e⁻). Los
  distractores muestran el valor de su error.
- Práctica: tres semillas por forma de pregunta, a mano (Zn + HNO₃ → NH₄NO₃: 4, 10, 4, 1, 3 y suma 22; P₄O₁₀: 7;
  SO₂ + Cr₂O₇²⁻: 12; C₈H₁₈: 25 O₂; MnO₂ + 4 H⁺: 2 e⁻ a la izquierda; agentes y saltos de EO): bien.
- Validador simulando `calidad: 2` con 400 semillas: sin problemas antes y después. Regla del papel simulando la marca:
  sin fallas. `herramientas/ecuaciones-ancho.js`: todo cabe (54 pantallas, 242 renglones).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, regla 1 | Motor compartido `balance-reacciones/motor.js`, `redox().electrones` (hallazgo del escritor) | Multiplicaba todo el reactivo por la subida: K₂Cr₂O₇ + HCl daba **14** (son 6), MnO₂ + HCl 4 (2), KMnO₄ + HCl 16 (10), la dismutación del Cl₂ **30** (5) y la del H₂O₂ 4 (2). La unidad lo esquivaba tomando «el menor de los dos lados», que falla en la dismutación. | Contar átomo por átomo: los que salen con el mismo EO no cambian; los demás se emparejan en orden de EO. Prueba que falle con el de antes. |
| A2 | 10 | Idea 3, ejemplo «Una fracción que se va» (nota 1 del redactor) | «Solo el 5/2 por 2 dejaría el carbono en 1 contra 2»: con 1, 5, 2, 1 el carbono cuadra (2 y 2); el que no cuadra es el oxígeno (10 contra 5). | Decir el oxígeno, 10 contra 5. |
| A3 | 10 | Idea 6, ejemplo «Una oxidación» (lector B) | «Faltan 2 O a la derecha, así que van 2 H₂O a la izquierda»: SO₂ → SO₄²⁻, los O faltan a la izquierda. El generador dice el lado bien («aquí faltan a la…»): el error es solo de la tarjeta. | «Faltan 2 O a la izquierda». |
| A4 | 13 | Idea 5, «Así se resuelve» (Fe + Cl₂ → FeCl₃, Al + Br₂, Li + N₂) y ejemplo «Plomo y amoníaco» (lector B) | Los Datos (D_EO) dan H, O y grupos 1 y 2; no dan el −1 del halógeno en una sal sin oxígeno, y sin él no se saca el +3 del Fe. «Plomo y amoníaco» no da el −2 del O. | Línea nueva en D_EO («cloro, bromo o yodo en una sal sin oxígeno: −1») y el −2 del O en la tarjeta. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 10 | Idea 5, Juega (lector B) | «2 Cu + 1 AgNO₃ → 2 Cu(NO₃)₂ + 1 Ag»: con cualquier valor de los deslizadores el N y el O no cuadran, y nada avisa. | Ecuación iónica, Cu + Ag⁺ → Cu²⁺ + Ag: los átomos siempre cuadran y la carga cuadra justo cuando los electrones. |
| M2 | 7 | Idea 6, ejemplo «El hidrógeno» (lector B) | ClO₃⁻ + 6 H⁺ → Cl⁻ + 3 H₂O aparece como resultado, con carga +5 contra −1. | Decir que la carga todavía no cuadra: faltan los electrones. |
| M3 | 3, 13 | Ejemplos «Fósforo en ácido nítrico» y «Zinc y nitrato» (lector B) | «El H y el O cuadran con 2 H₂O» y la semirreacción del nitrato a amonio salen armadas: no se ve de dónde salen el 2, el 10 y el 8. | Un paso con la cuenta (9 H y 17 O contra 5 y 15; 3 + 4 = 10 H y +9 contra +1). |
| M4 | 3 | Idea 6, Mira (lector B) | El recuadro trae la semirreacción terminada desde el paso 1, y una fila «básico» en un ejercicio de medio ácido. | Recuadro con NO₃⁻ → NO; la fila «básico» se queda (se llena recién en el paso 4, que la explica): «si fuera básico» se salía del lienzo a 390 px. |
| M5 | 3, 12 | Idea 6, la regla (lector B) | «Vale si el medio es ácido; en medio básico, además…» se lee como contradicción. | «…el medio es ácido, con H⁺. En medio básico se hace lo mismo y al final se suman OH⁻…». |
| M6 | 3, 4 | Idea 2, Mira (lector A) | «CH₄ + 2 O₂ → CO₂ + 2 H₂O: ni una ni otra» no dice qué es; la caja «calor con los productos: exotérmica» sin flecha, y la ecuación sin «+ calor». | Nodo con «+ calor» y «combustión: no es ninguna de las cuatro formas», con flecha; en el calor, «sale» → «exotérmica». |
| M7 | 3, 1 | Lupas de las ideas 1 y 3 (lector A) | El mismo ⊙ es Zn(s), Fe³⁺ y Fe metálico; en la idea 3 la leyenda dice «⊙ 1, ● 2» sin el elemento. | Fe³⁺ como ion (hueco, como el Zn²⁺) y la cuenta con el nombre: «Fe: 1», «O: 2». |
| M8 | 1 | Lee de las ideas 4, 5 y 6 (lector B) | El zinc en sulfato de cobre, el árbol de plata y el permanganato salen grises: el azul, la capa rojiza, la plata y el morado son el indicio que la idea cuenta. | Color de cada sustancia en la pieza (de prueba, como los objetos). |
| M9 | 5 | Pieza `quim-reaccion`, ecuación del inventario (lector B) | En la serif, «→» se ve como un guion corto. | La flecha en la letra de la interfaz. |
| M10 | 9 | Idea 1, ejemplo «El estado que falta» (nivel 3; lector A) | El enunciado ya dice «sale un gas»: es más fácil que el nivel 2. | Nivel 3 de verdad: bicarbonato en el horno, con el agua a 180 °C (vapor, no líquido). |
| M11 | 6, 10 | Glosario, «endotérmica» (nota 2 del redactor) | Su ejemplo «compresa fría» es una disolución, y la idea 1 enseña que disolver no es reaccionar. | Bicarbonato con vinagre, que se enfría mientras burbujea. |
| M12 | 10 | Glosario, «redox» (nota 4 del redactor) | «uno se oxida y otro se reduce» contradice la dismutación que enseña la idea 5. | «algo se oxida y algo se reduce, a veces el mismo elemento». |
| M13 | 3 | Idea 6, ejemplos «Verdadero o falso» y «En medio básico» (nota 3 del redactor) | La B se explica solo con «cruza los agentes» (también da la II como verdadera); la D, «cuenta el agua», no dice de dónde sale el 1. | Decir las dos cosas de la B; la D da el coeficiente del agua que queda. |
| M14 | 5 | Idea 5, «Así se resuelve» y un `siFuera`; práctica, `siFuera` de EC11 | «Cada Li pierde 1 electrones», «Un Na pierde 1 electrones», «Con 1 electrones» (12 semillas de 400; 13 de 800 en la práctica). | «un electrón». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 7 | Idea 2, juego (lector A) | «A + B → AB: dos sustancias forman una» se lee cortado. | «dos sustancias se juntan en una sola» (y «una sola sustancia se separa en dos»). |
| B2 | 3 | Idea 2, «Ahora tú» (lector A) | Bruna dice «después busca dónde está el calor» también cuando solo se pide la forma. | «Mira qué te piden: la forma, el calor o las dos cosas.» |
| B3 | 5 | Idea 2, ejemplo «Relaciona» (lector A) | «Ia, IIb» se lee «la». | «I-b, II-a, III-c». |
| B4 | 13 | Idea 5, voz de Predice (lector B) | «Cuenta cuántos átomos de hierro hay» casi da la respuesta. | «Mira la fórmula entera, no solo el símbolo del hierro.» |
| B5 | 1 | Los 90 ejemplos (lectores A y B) | Ninguna tarjeta trae dibujo. En química pasa igual en las unidades ya cerradas (Mol: 2 de 90; Nomenclatura: 5 de 90), y el molde pide «figura sin respuesta» cuando hay figura. | Para Gerson: si los ejemplos de química llevan figura. |
| B6 | 13 | Idea 1, «Ahora tú» (lector A) | Na + H₂O también calienta, y el indicio que se pide es el gas. Ninguna opción dice calor, así que no hay dos correctas. | Nada (anotado). |
| B7 | 1 | Idea 4, Predice (lector B) | La recta de EO vacía no dice para qué está. | Pendiente: un título en la recta («Aquí se dibujan los saltos»). |
| B8 | — | Motor, `electronesPorUnidad` | En la dismutación suma la subida y la bajada en la misma especie (Cl₂: 12). La unidad no lo usa en dismutaciones. | Anotado para quien rehaga la escena vieja. |

## Lo que está bien y hay que copiar al molde

- **La prueba propia de la unidad cuenta átomos y carga de cada ecuación escrita**, en los ejemplos y en 400 semillas,
  y la neutralidad de cada vaso. Mis herramientas, escritas aparte, no encontraron nada que esa prueba dejara pasar
  salvo un texto («dejaría el carbono…») que no es ecuación.
- Los distractores de química salen del motor con su error nombrado (agua del lado contrario, electrones por átomo y
  no por especie, sumar sin igualar, el coeficiente del otro agente): todos dan el valor de su error.
- El juego del metano y el del permanganato llevan la cuenta de átomos y de carga en la misma pantalla, con «≠» hasta
  que cuadra: el lector A lo llamó «lo mejor de la unidad».
- La lupa con iones que dice «un modelo, no a escala» y cuenta cada especie con su carga.

## Reglas que faltan en el contrato o el validador

| Regla | Por qué | ¿Automática? |
|---|---|---|
| Toda ecuación química escrita cuadra en átomos y carga, salvo las marcadas como esqueleto, paso a medias o distractor. | A2, M1, M2. La unidad ya lo prueba por su cuenta; en otras unidades de química no. | Sí: un extractor de ecuaciones como el de esta auditoría, en el validador de química con `calidad: 2`. |
| Cada partícula de una lupa tiene una sola forma en toda la unidad (átomo neutro, ion, molécula). | M7. | Sí: `atomos` de la lupa, una forma por (elemento, carga). |
| La concordancia con un número armado: «1 electrones», «1 átomos». | M14. | Sí: regex en 400 semillas (`\b1 (electrones|átomos|moléculas)\b`). |
| Una semirreacción mostrada antes de los electrones dice que le faltan. | M2. | Parcial: carga distinta a cada lado sin «falta»/«todavía» en el mismo paso. |
| Un objeto de «Lee» cuyo texto nombra un color lo muestra. | M8. | No. |

## Correcciones (26 nov)

Todas con su prueba. Prueba de la unidad: test nuevo «auditoría: lo que el auditor y los lectores encontraron no
vuelve»; motor: test nuevo «redox: los electrones cuentan solo los átomos que cambian de EO» (con el motor de antes
falla: 14 en vez de 6); pieza: test nuevo de colores y flecha (con la pieza de antes falla: no hay ningún color).

- **A1** Motor arreglado (`redox`): átomos que conservan su EO se descuentan; los que cambian se emparejan en orden de
  EO; además comprueba que lo perdido sea lo ganado. Da 6, 2, 10, 5, 2, 2 (Fe + Fe³⁺), 6 (Cu + HNO₃) y 8 (Fe₃O₄). Las
  escenas que lo usan siguen en verde (`balance-reacciones` 45 pruebas, `reacciones-practica`, `elementos-escenas`).
  **Parche quitado**: la unidad toma `MB.redox(...).electrones` y la prueba de la práctica también (y comprueba que
  coincida con lo que pierde el reductor o gana el oxidante).
- **A2–A4, M1–M7, M10–M14, B1–B4** como dice la tabla.
- **M8** Colores en la pieza: solución azul de Cu²⁺, lámina de zinc gris con la parte mojada rojiza, alambre de cobre
  con cristales de plata en una solución celeste, frasco y vaso morados. Hex propios (`SUST`), no de variable ni de
  elemento; de prueba, como los objetos: **decidido por la sesión, Gerson revisa después**.
- **M9** La flecha de la ecuación del inventario va en `system-ui`.
- **Quedan:** B5 (dibujos en los ejemplos: decisión de Gerson), B6 (nada que corregir), B7 y B8 (menores).
- Después: validador simulando `calidad: 2` con 400 semillas, sin problemas; `ecuaciones-ancho`, todo cabe;
  `npm run catalogo`; `teoria.test.js` en verde (267 pruebas con las de química y piezas); papel de la práctica
  regenerado.
