# Los ocho compañeros: hoja de modelo de los respaldos SVG

14 nov 2026 · Sesión `teoria/personajes`.

> **Provisional.** Estos dibujos solo ocupan el hueco de la mascota mientras no existan los `.riv`. El arte final es de Gerson: lo hará con su MCP e IA generativa y luego en Rive, siguiendo `docs/teoria/fuentes/guia-personajes.pdf`. Cuando llegue un `.riv`, se copia en `app/mascotas/<id>/` y se pone su nombre en `riv` de `mascota.json`; el respaldo queda para cuando el `.riv` no carga.

- Los ocho salen de un solo generador, `herramientas/personajes.js`, para que parezcan de la misma mano. Si se cambia algo, se cambia ahí y se corre `node herramientas/personajes.js`; no se editan los SVG a mano.
- Las hojas de revisión salen de `node herramientas/personajes-hoja.js` y quedan en `docs/referencias/`:
  - `personajes-respaldo.png` es la comparativa;
  - `personajes-poses.png` trae las ocho poses de cada uno;
  - `personajes-ciegas.png` va sin nombres;
  - `personajes-jerarquia.png` trae la vista normal, en grises y en silueta;
  - `personajes-miniatura.png` los muestra a 24 px.

## Lo común (la familia)

| Rasgo | Valor |
| --- | --- |
| Lienzo | viewBox 0 0 120 120. Piso en y = 109; se muestra a 72 px (`nucleo/mascota.css`) y se revisa a 40 px |
| Proporciones | Cabeza de unas 32 unidades de alto (de y ≈ 20 a 53) y figura de unas 90 (de la coronilla a los pies): **2,8 cabezas**, sin contar orejas ni cresta. La guía pide «unas tres» sin volverlos bebés |
| Esqueleto | Hombros en (47, 61) y (73, 61); manos en (41,5; 87) y (78,5; 87); cuello en (60, 56); ojos en (52,5; 36) y (67,5; 36); piernas cortas de 92 a 103, pies en y = 105. Torso igual en los ocho (`TORSO`) |
| Contorno | Tinta ciruela `#3b2a52` de 3 unidades, el mismo del gato de la app (1,8 px a 72 px). Detalles interiores de 1,6 a 2,4 |
| Ojos | Óvalo oscuro pequeño (2,7 × 3,3), sin brillo, para que la mirada no dependa de un punto blanco que desaparece al reducir. Con pelaje oscuro (Nox, Tilo) van sobre un disco claro sin contorno: con contorno se leían como lentes |
| Cejas | Un trazo de 2,4 sobre cada ojo, en capas propias (`m-ceja-i`, `m-ceja-d`) que se mueven con la pose |
| Ojos felices | Dos arcos hacia arriba; los pone el CSS en reposo, celebra e hito |
| Economía | Una prenda principal, un acento y, como mucho, un accesorio. Sin texturas, sin degradados, sin mejillas rosadas |
| Paleta | Apagada y propia de cada uno. No usa la lavanda `#7f5ae0` ni el rosa `#ffd3e2` de la marca. Las variables de las escenas usan tantos colores que no se pueden esquivar todos; por eso la mascota nunca va dentro de la figura (escena viva §6). **Los colores distinguen personajes, nunca codifican acierto o error** |

### Capas y poses

Son las mismas capas que el gato (`m-salto`, `m-todo`, `m-cola`, `m-cuerpo`, `m-cabeza`, `m-oreja-i/d`, `m-ojos-felices`, `m-ojos-abiertos`), cada una con su `.m-g` interior para el gesto. Hay dos capas nuevas que el gato no tiene, y el gato queda igual:

- `m-ceja-i` y `m-ceja-d`:
  - suben al saludar, al celebrar y en el hito;
  - al esperar la predicción sube solo una (E3);
  - al acompañar un error se levantan por el centro (E5 y E8: «revisemos», sin pena).
- `m-brazo`: el brazo del lado del mensaje.
  - Al saludar se levanta y hace la ola.
  - Al señalar, apunta al mensaje.
  - Al esperar, acompañar y ayudar se abre.
  - Al celebrar y en el hito sube sin tapar la cara.

Los centros de giro de cada respaldo van como variables CSS en su `<svg>` (`--m-cabeza`, `--m-cola`, `--m-oreja-i`, `--m-oreja-d`, `--m-ojos`, `--m-ceja-i`, `--m-ceja-d`, `--m-brazo`). `nucleo/mascota.css` las usa y, si faltan, cae en los valores del gato.

- Si una especie no tiene orejas (tortuga, cuervo y lechuza), sus grupos `m-oreja` van vacíos.
- Una pose no cambia ningún rasgo de identidad.

## Los ocho

| Personaje | Rasgos fijos | Paleta | Prenda y acento | Qué lo separa del que más se le parece |
| --- | --- | --- | --- | --- |
| **Luma**, tortuga (aritmética) | Cabeza calva y redonda sobre un cuello corto, caparazón oscuro que asoma por los dos lados, placas sugeridas con cuatro trazos, cara clara, boca ancha y tranquila | piel `#8f9a6c`, cara `#dcdcb6`, caparazón `#66653a`, placas `#85844f` | Cárdigan crema `#efdfbd` con dos botones; peto `#c9c58e` en la V | Única especie con caparazón: la silueta es una cabeza chica sobre un óvalo ancho. El caparazón no es escondite |
| **Nox**, cuervo (álgebra) | Cabeza negra grafito con cresta de tres plumas, pico gris que sale de la barbilla, ojos sobre disco claro, alas con tres puntas en lugar de manos, patas de dos formas grandes | plumaje `#2e3136`, pico `#767a82`, disco del ojo `#ece6da`, cejas `#b6b9c0` | Impermeable mostaza `#c9a23a` con cierre y capucha baja `#a8851f` detrás del cuello | Frente a la lechuza: negro y sin disco facial, cresta en punta y pico largo que rompe la silueta. La lechuza es parda, tiene la cara en corazón clara y el pico corto |
| **Tilo**, gato bicolor (física) | Negro con hocico y patas blancas, orejas triangulares, bigotes en grupos de dos, ojos ámbar, cola larga y delgada que sube | negro `#2b2932`, blanco `#f6f1e8`, ojo `#e2b455`, interior de oreja `#7d6476` | Jersey azul polvo `#93abc6`; bufanda ocre `#c98a2c` con un extremo colgando | Frente al zorro: cabeza redonda con hocico corto, blanco y negro, y cola fina sin punta clara. El zorro es naranja, de hocico en punta, con mejillas que se abren y cola gruesa de punta crema |
| **Bruna**, castora (química) | Cabeza ancha y redonda, orejas chicas y redondas arriba, hocico claro con nariz oscura, **dos incisivos**, cola de paleta ancha con tres líneas | pelo `#8f5631`, hocico `#e2c29b`, dientes `#fbf6ec`, cola `#5b3f2e` | Delantal verde botella `#2e6a4c` con tirantes sobre camisa crema `#efe6d2`. Gafas: solo en una escena de laboratorio, no en el respaldo | Frente a la nutria: más rojiza y maciza, con dientes, orejas arriba y cola plana en paleta. La nutria es gris parda, de cabeza chata, sin dientes, con orejas bajas, máscara clara y cola larga que se afina |
| **Neri**, nutria (geometría) | Cabeza chata y ancha, orejas pequeñas bajas a los lados, máscara crema grande que sube hasta los ojos, nariz ancha, bigotes, barriga crema y cola gruesa que se afina en el piso | pelo `#7a5d45`, crema `#f0e2c8`, manos y pies `#5f4938` | Chaleco terracota `#c0623d` abierto | Lo de la fila de Bruna |
| **Mara**, coneja (trigonometría) | Orejas largas en V suave con interior blush, hocico de dos lóbulos con boca en Y, cola pompón y pies largos | pelo `#f2dfd3`, interior `#e2a59f`, hocico `#fbf2ec`, nariz `#b8737b` | Suéter oliva `#7c8749` con el punto sugerido en tres V y dos líneas `#9aa660` | Las orejas largas mandan en la silueta; ninguna otra especie las tiene |
| **Faro**, zorro (razonamiento matemático) | Orejas grandes con punta oscura, mejillas que se abren en punta, máscara crema, patas y manos oscuras, cola grande de punta crema | pelo `#c46f37`, crema `#f1e2c6`, oscuro `#3f2d2b` | Chaqueta azul pizarra `#506579` y cuello alto crema que no tapa la mandíbula | Lo de la fila de Tilo. La boca es una sonrisa abierta y suave, nunca una mueca «astuta» |
| **Iris**, lechuza (razonamiento verbal) | Cabeza de techo plano con dos esquinas, disco facial claro en corazón, pico corto, alas con tres puntas | pluma `#a87b55`, disco `#f4e8d4`, pico y patas `#d6a85c` | Abrigo carbón `#403e46` con capa `#5b5862`; pañuelo ocre `#c9973a` en triángulo | Lo de la fila de Nox. El disco facial no se deforma con la expresión: la mueven los párpados y las cejas |

## Chequeos hechos

- **72 px y 40 px:** a 40 px se reconocen las cabezas y las colas de los ocho. A 24 px (`personajes-miniatura.png`) quedan manchas de color: ahí no se usa.
- **Grises:** se separan por valor. Nox y Tilo son las masas oscuras, Mara la clara y Luma la del medio con cárdigan claro. Las cabezas de Bruna y Neri tienen un valor parecido; las separan la máscara clara de Neri y los dientes de Bruna.
- **Silueta sola:** zorro, gato, coneja, castora y cuervo se reconocen. La nutria y la lechuza, a medias. La tortuga se lee como un muñeco de cabeza chica sobre un óvalo: es la más débil.
- **Familia:** los ocho comparten esqueleto, contorno, ojos y cejas, y tienen una prenda cada uno.
- **Poses:** las ocho funcionan con el CSS real (`personajes-poses.png`). Con movimiento reducido se ve el estado final.

### Ciclo de corrección (lo que se vio y qué se cambió)

1. Los ojos sobre pelaje oscuro parecían lentes. Hipótesis: el contorno del disco claro. Se quitó el contorno y el disco se achicó a 4. Se corrigió.
2. Neri se confundía con Bruna. Hipótesis: tenían la misma cabeza. La de Neri pasó a chata y ancha, con orejas bajas, máscara grande y un pelaje más gris. Se corrigió.
3. El pico de Nox no salía de la silueta. Se alargó hasta debajo de la barbilla. Se corrigió.
4. En «celebra» e «hito», el brazo tapaba la cara. Se bajaron los ángulos de −150°/−160° a −140°/−146°. Se corrigió.
5. La silueta de Iris era un bloque. Se le dio techo plano con esquinas. Se corrigió.
6. La silueta de Luma era un muñeco de nieve. Hipótesis: al caparazón le falta borde de placas. Con festones se leyó como nube, así que **se descartó**. Quedó el caparazón liso con cuello. Sigue siendo la más débil.

## Prueba a ciegas (pendiente: la hace una persona)

Muestra `docs/referencias/personajes-ciegas.png` sin decir nada y pregunta «¿qué animal es cada uno?».

La clave es 1 nutria, 2 zorro, 3 lechuza, 4 tortuga, 5 gato, 6 castora, 7 coneja y 8 cuervo.

Hipótesis registradas antes de la prueba:
- La 1 se leerá como hámster o marmota.
- La 8, como «pájaro» o pingüino más que como cuervo.
- La 3, como búho; eso se acepta.
- La 4 puede no leerse como tortuga si se mira solo la silueta.
