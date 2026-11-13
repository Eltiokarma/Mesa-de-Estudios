# Encargo de vectores: la mascota en Rive y lo demás

13 de noviembre de 2026. Para quien dibuje la mascota y la anime en Rive: Gerson, un diseñador u otro agente. El hueco en la app ya está hecho (`nucleo/mascota.js`, `nucleo/mascota.css`, `app/mascotas/`). Cuando el `.riv` cumpla el contrato de este documento, la mascota aparece y reacciona sin tocar código. Contrato de fondo: `docs/escena-viva.md`, sección 6.

## 1. Qué es la mascota y qué no

- Es **marco**, no contenido. Vive en un lugar fijo (72 × 72 px), junto al mensaje de retroalimentación y fuera de la figura del ejercicio.
- **Actúa entre tareas** (al llegar, al responder, al terminar) y **descansa mientras el alumno lee o piensa**. Si se mueve mientras el alumno razona, estorba (Mayer, coherencia).
- **No habla.** Lo que dice va en el texto de la app, junto a ella. Ni globos, ni texto dentro del `.riv`.
- **No se toca.** No tiene botones ni zonas que respondan al dedo.
- Ante un error **acompaña y orienta**: no se burla ni se pone triste.

## 2. Hoja de modelo (por llenar)

Una por mascota. Se escribe antes de dibujar y manda en todas las poses. La columna del gato es el ejemplo: es el gatito que ya tiene la app (`Ilus.gato` en `app/ilustraciones.js`) y es el respaldo de hoy.

| Campo | Gato (ejemplo, ya existe) | Mascota nueva |
| --- | --- | --- |
| Nombre | Gato | |
| Qué es | Gatito sentado, de frente | |
| Tres adjetivos de actitud | Tranquilo, contento, cercano | |
| Rasgos de identidad (no cambian en ninguna pose) | Orejas en punta con interior rosa; mejillas rosadas; collar lavanda; cola en S a la derecha | |
| Proporciones, en unidades de cabeza (H = alto de la cabeza sin orejas) | Cabeza 1 H de alto y 1,2 H de ancho; orejas 0,45 H; cuerpo 0,9 H; alto total ≈ 1,8 H | |
| Paleta propia (4 o 5 colores, en hex) | Crema `#fff6ee`, rosa `#ffc7da`, rosa fuerte `#ff9fbf`, lavanda `#cdb9ff` | |
| Contorno | Ciruela `#3b2a52`, 3 unidades en una figura de 120 (≈ 2,5 % del alto) y puntas redondas | |
| Cómo se separa del fondo | Contorno ciruela sobre la tarjeta crema y sobre el ciruela del tema oscuro | |
| Ojos | Cerrados y felices en reposo, celebra e hito; abiertos en las poses que miran | |

**Reglas de la hoja:**
- La paleta propia no usa los colores de las variables (`--c-o` naranja, `--c-i` turquesa, `--c-h` rojo, `--c-d` verde, morado de la distancia focal): la mascota se ve junto a ejercicios donde cada color es una variable (regla 4 de `CLAUDE.md`).
- Se reconoce a **40 px** (mira la vista de 40 px en `probar.html`): orejas, ojos y silueta deben leerse a ese tamaño. Si un rasgo de identidad desaparece a 40 px, está muy chico.
- La silueta funciona sola, en un solo color, sin ojos ni detalles.

## 3. Las ocho poses

Repertorio cerrado e igual para todas las mascotas. Cada pose cambia **pocos rasgos** (ojos, orejas, cola, inclinación) y se queda mientras su mensaje siga en pantalla. Vuelve a `reposo` cuando la app lo pide (cuando empieza la tarea siguiente), no por tiempo.

| Número | Pose | Cuándo la pide la app | Qué debe comunicar | Cómo lo hace el gato de respaldo |
| --- | --- | --- | --- | --- |
| 0 | `reposo` | Mientras el alumno lee, piensa o manipula | «Estoy aquí, tranquilo; tú sigue» | Quieto, ojos felices |
| 1 | `saluda` | Al llegar a la práctica o a una escena | «Hola, empecemos» | Ojos abiertos, cabeza ladeada, la cola se mece |
| 2 | `señala` | Consigna nueva; vuelve sola a `reposo` cuando el alumno toca algo | «Mira aquí» (hacia el mensaje, a su derecha) | Se inclina y mira a la derecha, una oreja hacia adelante |
| 3 | `espera` | Mientras se espera la respuesta (si la app la usa) | «Te espero, sin apuro» | Ojos abiertos, orejas atentas, casi quieto |
| 4 | `celebra` | Acierto | «¡Bien!», sin exagerar | Brinco corto, cola arriba, ojos felices |
| 5 | `acompaña` | Error | «Tranquilo, vamos a verlo juntos» (no triste, no burla) | Ladea la cabeza hacia el mensaje, orejas relajadas, mirada suave |
| 6 | `ayuda` | «No sé» | «Te doy una mano» | Se inclina hacia el mensaje, cabeza curiosa, asiente |
| 7 | `hito` | Fin de la práctica o de la prueba de salida | El momento grande, poco frecuente | Brinco más alto con un leve giro |

**Actuación (igual para todas):**
- Tres golpes por reacción: **anticipación** 120 ms, **acción** 200 ms y **asentamiento** 320 ms. Total: 900 ms como máximo (el hito puede usar todo; las demás, unos 640 ms).
- Cola, orejas y brazos salen unos 40 ms después del cuerpo.
- Un miembro entra y sale desde detrás del cuerpo: no aparece ni se desvanece.
- Celebra más lo difícil que lo rutinario: `celebra` sale en cada acierto, así que debe aguantar verse cincuenta veces; lo grande es para `hito`.
- **Vida en reposo:** como máximo un gesto breve (un parpadeo o una oreja) en los 5 s que siguen a una pose; después, quieta del todo. Nada de respiración ni balanceo en bucle.
- **Movimiento reducido** (entrada `reducido` = verdadero): la pose cambia sin animación, de un salto al estado final, y sin gestos de vida.
- El estado final de cada pose se entiende sin haber visto la animación.

## 4. Contrato técnico con Rive (nombres exactos)

| Qué | Nombre exacto | Tipo | Valores |
| --- | --- | --- | --- |
| Artboard | el **primero** del archivo (nombre libre) | cuadrado; sugerido 240 × 240 | La figura ocupa ~80 % del alto y deja ~10 % libre arriba para el brinco |
| Máquina de estados | `Mesa` | State Machine | Una sola capa basta |
| Entrada | `pose` | Number | 0 reposo, 1 saluda, 2 señala, 3 espera, 4 celebra, 5 acompaña, 6 ayuda, 7 hito |
| Entrada | `reducido` | Boolean | `true` con movimiento reducido |

- Sugerencia de armado: un estado por pose y transiciones desde **Any State** con la condición `pose == n`. Cada estado termina quieto en su pose (animación de una sola pasada, no en bucle).
- Con `reducido` en verdadero, las transiciones duran 0 y no hay gestos de vida.
- Nada de listeners de puntero, eventos, audio, texto ni fuentes. Imágenes de mapa de bits, mejor no (pesan y se ven borrosas).
- El runtime de la app es `@rive-app/canvas` 2.50.0 (`app/vendor/rive/`). Rive marca las entradas de la máquina como «deprecated» a favor del *data binding*; siguen funcionando en esta versión y el contrato sigue con entradas hasta nuevo aviso.
- **Peso:** 150 KB como máximo; mejor por debajo de 60 KB. La app funciona en celulares de gama baja y sin conexión.
- Exporta para el runtime web (el `.riv` del editor, botón *Export → for runtime*).

Si el archivo no cumple el contrato, la app no se rompe: muestra el respaldo SVG y lo avisa en la consola del navegador.

## 5. Cómo probarlo antes de subirlo

1. En el repo: `npm run dev` y abre `http://localhost:4173/app/mascotas/probar.html`.
2. Arrastra tu `.riv` a la caja (o tócala para elegirlo). El archivo no sale de tu navegador.
3. La página dice si cumple el contrato, qué artboards, máquinas y entradas trae y cuánto pesa.
4. Mira la mascota a 40, 72 y 144 px y junto a un mensaje, y toca las ocho poses y «Movimiento reducido».

## 6. Dónde soltarlo

1. Crea la carpeta `app/mascotas/<id>/` (por ejemplo `app/mascotas/vizcacha/`) y copia ahí el `.riv`.
2. Escribe su `mascota.json` (copia el del gato):
   ```json
   { "id": "vizcacha", "nombre": "Vizcacha", "riv": "vizcacha.riv", "maquina": "Mesa",
     "entradas": { "pose": "pose", "reducido": "reducido" }, "respaldo": "respaldo.svg" }
   ```
3. Pon un `respaldo.svg` (viewBox `0 0 120 120`): se ve mientras carga el `.riv`, sin conexión antes de la primera visita y si el archivo falla. Para que el respaldo también actúe, sepáralo en los grupos del gato (`m-salto`, `m-todo`, `m-cola`, `m-cabeza`, `m-oreja-i`, `m-oreja-d`, `m-ojos-felices`, `m-ojos-abiertos`, cada parte con un `<g class="m-g">` adentro); `npm test` lo exige.
4. En `app/mascotas/registro.json`, agrega el id a `mascotas` y asígnalo a los cursos que quieras (o ponlo en `porDefecto`).
5. `npm test` en verde y listo. Para el gato basta cambiar `"riv": null` por `"riv": "gato.riv"`.

## 7. Pregunta abierta para Gerson

**¿La mascota tiene identidad andina o puneña?** (de `docs/pendientes.md`, sección B). Opciones para decidir, sin estereotipos (nada de vestimenta típica usada como disfraz):
- **El gato de hoy:** ya es conocido en la app y no pide nada nuevo.
- **Gato andino** (*Leopardus jacobita*): conserva el gato y lo vuelve del altiplano. Rasgos: cola muy gruesa y anillada, pelaje gris con manchas. Es especie en peligro, lo que puede ser parte de su historia.
- **Vizcacha, alpaca, cuy, suri o zorro andino:** cada uno pide su hoja de modelo y rasgos que lo separen de lo que más se le parece (una vizcacha dibujada de memoria se lee como conejo: cola larga enroscada, orejas medianas, bigotes largos).
- **Una mascota por curso** o una sola para todo: el registro admite las dos cosas.

## 8. Otros vectores (encargo aparte)

El rediseño (`docs/escena-viva.md`) va a necesitar además, cada uno con su propio encargo:

- **Íconos de las piezas del kit** (`nucleo/kit/`): `barra-porcentaje`, `recta`, `balanza`, `flechas`, `triangulo` y `ejes`, para el catálogo de piezas y el selector de práctica. Grilla de 24, trazo de 2 px, puntas redondas, `currentColor`, legibles a 24 px.
- **Viñetas de curso:** hoy existen ocho (`Ilus.viñeta`, 160 × 120). Se rehacen solo si cambia el mundo visual o la mascota.
- **Ilustraciones de estados:** sin pendientes, sin conexión, servidor que no responde y lista vacía, con la mascota cuando tenga sentido.
- **Hitos:** fin de práctica, racha de días y primer logro (aquí vive la única celebración grande).
- **Bienvenida:** dos o tres pantallas de presentación.
- **Íconos de la app:** 192, 512 y la versión *maskable*, si cambia la mascota.

Para todos: solo los colores de marca y de la cáscara (`docs/diseno.md`), nunca los de las variables; SVG propio y liviano; nada copiado de manuales ni de bancos de imágenes (regla 5).

## 9. MRU y MRUV: el carrito (primer objeto de utilería)

14 de noviembre de 2026. Es el único objeto dibujado de la unidad (`docs/pogil-v2-rive.md`, sección 7.5). Mientras llega, la versión A usa un **carrito provisional** hecho con el trazo del kit: rectángulo, dos ruedas y nada más. Sirve para la lógica, no es arte final. Lo demás de la unidad lo dibuja el kit: pista, marcas de cada segundo, regla, gráficas, pelota y flechas de aceleración.

**Para qué sirve.** El alumno lo empuja con el dedo y lo ve avanzar, acelerar y frenar. Si se quita, se pierde lo que se empuja: la marca de la pista sigue, pero no hay de qué es la marca.

**Qué recibe del motor** (nunca lo decide el dibujo): la posición x, la velocidad v y la aceleración a en cada cuadro. Con eso la página gira las ruedas (ángulo = x / radio) y cabecea el cuerpo según a.

| Pieza | Qué es | Cómo se mueve | Nombre del grupo en el SVG |
| --- | --- | --- | --- |
| Cuerpo | Carrito de juguete visto de costado, mirando a la derecha. Sin conductor ni texto | Cabecea: se inclina hasta 4° hacia adelante al frenar y hacia atrás al acelerar, con el pivote entre las dos ruedas | `cuerpo` |
| Rueda delantera | Círculo con un rayo o una marca que deje ver que gira | Gira sobre su centro | `rueda-del` |
| Rueda trasera | Igual a la delantera | Gira sobre su centro | `rueda-tras` |
| Punto de apoyo | Marca invisible en el piso, al centro del carrito | No se mueve: es la posición x del motor. La prueba de fidelidad exige que coincida con la regla dentro de 1 px | `apoyo` |

**Dos variantes, A y B,** para la parte de los dos carritos. Se distinguen por la **forma** (por ejemplo, uno con techo redondo y otro con alerón) y por un tono propio. Las dos tienen el mismo tamaño y las mismas piezas.

**Tamaño y paleta.**
- En pantalla mide unos 56 × 32 px a 360 px de ancho, porque en la pista tienen que caber seis marcas. Se tiene que reconocer a 40 px.
- Lienzo de 112 × 64 unidades, con las ruedas tocando la línea y = 60. Los centros de las ruedas van en x = 26 y x = 86, con radio 10.
- Paleta propia de 3 o 4 colores. **Nunca los colores de las variables:** naranja `--c-o`, turquesa `--c-i`, rojo `--c-h`, verde `--c-d` y morado `--c-f`. En la escena, x, v y a van en esos colores y el carrito no puede confundirse con una variable.
- Contorno ciruela `#3b2a52`, como la mascota, de unos 2,5 px a tamaño real.

**Reglas.**
- SVG propio, sin degradados, filtros ni texto, con menos de 4 KB por variante.
- Los cuatro grupos van separados, con esos `id`, para que la página los mueva sin tocar el dibujo.
- La silueta se entiende sola, en un color.
- Va en `app/utileria/carrito-a.svg` y `app/utileria/carrito-b.svg`. Después, si la versión B lo pide, en Rive con entradas `x`, `v` y `a` (sección 0 de la auditoría).
