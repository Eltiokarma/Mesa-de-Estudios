# Reporte: teoría de personajes (14 nov 2026)

Rama `teoria/personajes`, que sale de `claude/awesome-einstein-ch5g9a`. El encargo está en `rutinas/encargos/teoria-personajes.md`.

> Todo lo de aquí es **provisional**. El arte final de los ocho compañeros es de Gerson: lo hará con su MCP e IA generativa y después en Rive. Estos respaldos solo ocupan el hueco mientras tanto.

## Qué se hizo

- **Ocho respaldos SVG** en `app/mascotas/<id>/` para luma, nox, tilo, bruna, neri, mara, faro e iris. Cada uno trae:
  - `mascota.json` con `riv: null` y `provisional: true`, una nota que dice que el arte final es de Gerson y el mismo contrato que el gato (máquina `Mesa`, entradas `pose` y `reducido`);
  - `respaldo.svg` con las capas del gato.
- **Un solo generador**, `herramientas/personajes.js`, para que salgan de la misma mano. Los ocho comparten esqueleto, contorno (la tinta ciruela de 3 unidades del gato), ojos y cejas; cambian la cabeza, la cola, la prenda y la paleta.
- **`nucleo/mascota.css`**: el gato queda igual.
  - Los centros de giro se leen de variables CSS del `<svg>` (`--m-cabeza`, `--m-cola`, etc.); si faltan, se usan los valores del gato.
  - Hay dos capas nuevas que solo traen los compañeros:
    - `m-ceja-i` y `m-ceja-d` suben al saludar y al celebrar, levantan una sola al esperar la predicción y se alzan por el centro al acompañar un error;
    - `m-brazo` saluda con la ola, apunta al mensaje, se abre al esperar, acompañar y ayudar, y sube al celebrar y en el hito.
  - Las ocho poses del repertorio funcionan. Con movimiento reducido se ve el estado final.
- **`app/mascotas/registro.json`**: cada curso tiene su compañero. El gato sigue siendo `porDefecto`.
- **`app/sw.js`**: los 16 archivos nuevos entraron a la CASCARA y VERSION pasó de v178 a v179.
- **`docs/personajes.md`**: hoja de modelo con lo común (proporciones de 2,8 cabezas, contorno, ojos, economía y paleta) y una fila por personaje. Cada fila trae rasgos fijos, paleta, prenda, acento y qué lo separa de la especie más parecida (nutria/castora, lechuza/cuervo, zorro/gato). También están los chequeos y el ciclo de corrección.
- **Hojas** en `docs/referencias/`, que se regeneran con `node herramientas/personajes-hoja.js`:
  - `personajes-respaldo.png`: comparativa a 120, 72 y 40 px y en grises;
  - `personajes-poses.png`: los ocho por las ocho poses a 72 px;
  - `personajes-ciegas.png`: hoja a ciegas, numerada y sin nombres;
  - `personajes-jerarquia.png`: vista normal, en grises y en silueta;
  - `personajes-miniatura.png`: los ocho a 24 px;
  - `personajes-montados.png`: los ocho montados por curso con `nucleo/mascota.js` real en `probar.html`, en la pose «señala».
- Un commit para la base y uno por personaje, con push después de cada uno. En cada commit corrió `nucleo/mascota.test.js` en verde (12 de 12). Al final, `npm test` completo: 8192 de 8192 en verde.

## Pasos del skill de arte, a la vista

- **Afirmación:** ocho compañeros de la misma familia; mismo cuerpo de unas tres cabezas con una prenda, y la especie se lee por la silueta de la cabeza y de la cola.
- **Tamaño final:** 72 px en la teoría, y tienen que leerse a 40 px y en grises.
- **Conceptos:** los evalué para la familia, no por personaje.

| Concepto de construcción | Claridad a 40 px | Pertinencia (guía) | Veredicto |
| --- | --- | --- | --- |
| Solo cabezas (como el ícono del gato) | Alta | Baja: la guía pide cuerpo completo y gestos de manos | No |
| Cuerpo completo de 3 cabezas, frontal, un esqueleto común | Media-alta | Alta: prendas, manos y cola visibles | **Sí** |
| Tres cuartos con el cuerpo girado | Media | Alta, pero cada especie pediría dibujo propio y se pierde la mano común | No por ahora: queda para el arte final |
| Silueta con prenda como masa principal y cara mínima | Alta | Media: la guía pide leer cejas y párpados | No |
| Cuerpos distintos por especie (tortuga ancha, nutria larga) | Media | Media: rompe «misma construcción» | Solo en la cabeza, la cola y el caparazón |
| Personajes con accesorio de su curso (regla, matraz) | Baja a 40 px | La guía dice que ningún instrumento es inseparable de la mano | No |

- **Hoja de jerarquía:** está en `personajes-jerarquia.png`. En grises domina la cara de cada uno: los ojos oscuros sobre caras claras, o un disco claro sobre las caras oscuras.
- **Chequeos:**
  - Tamaño: a 40 px se lee la especie de los ocho; a 24 px no se usa.
  - Grises: se separan por valor.
  - Silueta: la tortuga es la más débil; la nutria y la lechuza se leen a medias.
  - Familia: un solo esqueleto.
  - Capas: los miembros entran y salen desde el hombro, no aparecen ni se desvanecen.
  - Contrato: `npm test` en verde.
- **Ciclo de corrección:** está en `docs/personajes.md`. Fueron seis hipótesis con una variable cada una. Cinco corrigieron el problema; la del caparazón con festones se descartó porque se leía como nube.

## No verificado

- **Reconocimiento por personas:** nadie ha visto la hoja a ciegas. Las hipótesis registradas antes de la prueba están en `docs/personajes.md`:
  - la nutria se leerá como hámster o marmota;
  - el cuervo, como «pájaro» o pingüino;
  - la tortuga, en silueta, quizá no se reconozca.
- **Celular real:** no se probó en un celular de verdad ni en tema oscuro dentro de la app. Las hojas van sobre crema; el contorno ciruela debería separarlos también del fondo oscuro, pero no está medido.
- **Teoría con la mascota montada:** no la vi dentro de la pantalla de teoría, porque la app pide la prueba de entrada antes. La comprobé con el mismo código (`nucleo/mascota.js` y `registro.json`) en `probar.html`: cada curso monta a su compañero y no hay avisos en la consola.
- **Animación cuadro a cuadro:** no hice la tira de cuadros; solo revisé los estados finales.
- **Pegado del arte final:** las expresiones E0–E9 de la guía no están dibujadas. El respaldo solo tiene ojos felices o abiertos y cejas que se mueven. `data-expresion` ya viaja para el `.riv`.

## Vectores que Gerson tendría que encargar para la versión final

Por personaje, según «Entrega de las ocho hojas visuales» de la guía y su separación vectorial:

1. **Hoja de modelo:**
   - vista frontal y de tres cuartos;
   - pose neutra de cuerpo completo;
   - diez cabezas E0–E9 del mismo rostro;
   - cinco gestos G1–G5.
2. **Piezas separadas con su pivote** (lista de la guía, por personaje):
   - **Luma:** cabeza, cuello, torso con cárdigan, caparazón trasero, dos brazos, dos manos, dos piernas y pies. Las placas no se animan.
   - **Nox:**
     - pico superior e inferior, párpados, cejas y cabeza;
     - torso, dos alas-brazos con el extremo articulado (tres plumas como máximo);
     - faldones del impermeable, capucha y dos patas.
   - **Tilo:**
     - cabeza, hocico blanco, ojos, párpados, cejas y boca;
     - orejas con base y punta;
     - torso con pechera, brazos y manos, piernas;
     - cola de tres segmentos, dos extremos de bufanda y bigotes en grupos.
   - **Bruna:**
     - cabeza, hocico, mandíbula y dientes en una sola pieza;
     - torso, dos brazos y manos, piernas, cola;
     - delantal, tirantes y las gafas aparte (sin tapar las cejas).
   - **Neri:**
     - cabeza, hocico, párpados y cejas;
     - torso, hombros, brazos y manos, piernas y pies;
     - cola de dos segmentos.
   - **Mara:**
     - orejas con dos articulaciones cada una;
     - cabeza, hocico, ojos y cejas;
     - torso con suéter (el cuello no tapa el giro de la cabeza), brazos y manos, piernas.
   - **Faro:**
     - orejas, cabeza, hocico, mandíbula y cejas;
     - torso, chaqueta, brazos y manos, piernas, cola de tres segmentos;
     - cuello alto anclado al torso.
   - **Iris:**
     - disco facial, pico, ojos, párpados, arcos de ceja y cabeza;
     - torso, alas-brazos con sus extremos, abrigo, pañuelo y patas.
3. **Contrato del `.riv`:**
   - máquina `Mesa` con las entradas `pose` (0–7) y `reducido`, como dice `nucleo/mascota.js`;
   - la guía propone además `mood` (E0–E9), `lookTarget` y `action`, que la app todavía no envía.
4. **Lo que el respaldo ya fijó y conviene conservar o decidir de nuevo a propósito:**
   - paletas, prendas y contorno de una tinta (`docs/personajes.md`);
   - el brazo del lado del mensaje como gesto de señalar.

## Para retomar

- Para cambiar un personaje: editar `herramientas/personajes.js` → correr `node herramientas/personajes.js` → correr `node herramientas/personajes-hoja.js` → mirar las hojas → `npm test`. Si cambia la cáscara, subir VERSION en `app/sw.js`.
- Cuando llegue un `.riv`: copiarlo en `app/mascotas/<id>/`, poner su nombre en `riv`, probarlo en `app/mascotas/probar.html` y agregarlo a la CASCARA.
