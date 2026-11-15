# Ronda 4, química: el 3D con three.js (15 nov 2026)

Rama `teoria4/quimica`, salida de `main`. Encargo: `rutinas/encargos/teoria4-quimica.md`. Molde: `docs/3d.md`.

Hecho: cuatro mesas 3D nuevas en tres unidades «3D necesario» (estructura atómica, líquidos y sólidos, hidrocarburos),
dos piezas vivas nuevas, tres motores ampliados con pruebas y casos verificados aparte en Python. Enlace químico ya
tenía su mesa: no se rehizo (su pieza recibió dos opciones nuevas, compatibles).

## 1. Las 20 unidades

| Unidad | Clase | Razón | Qué se hizo |
| --- | --- | --- | --- |
| materia-y-energia | plano | Estados, mezclas y curvas de calentamiento se leen en una caja o un gráfico plano. | Nada |
| estructura-atomica | **3D necesario** | La forma de un orbital (lóbulos, nodos esféricos y planos) solo se entiende girándolo y cortándolo. | Mesa «La nube del orbital» (pieza nueva `quim-orbital-3d`) |
| tabla-periodica | contexto | Las alturas sobre la tabla repetirían lo que el color ya dice; el 3D adornaría. | Nada (candidata de contexto, baja prioridad) |
| enlace-quimico | 3D necesario | Forma molecular y dipolos. | Ya tenía «La molécula que gira»; no se tocó la mesa |
| nomenclatura-inorganica | plano | Fórmulas, cargas y nombres. | Nada |
| mol-y-composicion | plano | Barras, balanza y conteo. | Nada |
| reacciones-y-balance | plano | Contar átomos y electrones; una molécula en 3D no cambia el balance. | Nada |
| estequiometria | contexto | La mesa de laboratorio acercaría la escena, pero el cálculo es plano. | Nada |
| gases | contexto | Partículas en una caja real; la presión y el volumen se leen igual en 2D. | Nada |
| liquidos-y-solidos | **3D necesario** | Contar átomos por celda (⅛, ½, 1) y vecinos exige ver la celda y sus vecinas en el espacio. | Mesa «La celda que se repite» (pieza nueva `quim-red-3d`) |
| soluciones | plano | Concentración y curvas de solubilidad. | Nada |
| cinetica-quimica | contexto | La orientación del choque es 3D, pero la unidad la enseña con el perfil de energía. | Nada |
| equilibrio-quimico | plano | Q contra K, partículas y curvas. | Nada |
| acidos-y-bases | plano | pH, dilución y titulación. | Nada |
| electroquimica | contexto | La pila es un objeto real; los potenciales y Faraday se leen en plano. | Nada |
| hidrocarburos | **3D necesario** | El giro alrededor de un enlace simple (y no del doble) y el espejo que no encaja son relaciones en el espacio. | Mesas «El enlace que gira» y «El espejo que no encaja» (reusan `quim-molecula-3d`) |
| funciones-organicas | contexto | Grupos funcionales, nombres y clases se enseñan en plano; la isomería óptica vive en hidrocarburos. | Nada |
| biomoleculas-y-productos-naturales | contexto | Hélices y anillos en silla serían cercanos, pero la unidad pide uniones e hidrólisis, no formas. | Nada |
| recursos-naturales | plano | Destilación, octanaje y menas: esquemas y barras. | Nada |
| ambiente-y-quimica-aplicada | plano | Cadenas de causas y porcentajes. | Nada |

Las de «contexto» quedan sin hacer: según `docs/3d.md`, «un 3D que solo adorna distrae», y el tiempo fue a la cuarta
mesa necesaria (el espejo).

## 2. Las mesas nuevas (todas primeras en su laboratorio, sin cambiar ids existentes)

| Unidad | Mesa (`id`) | Controles | Retos | Glosario nuevo |
| --- | --- | --- | --- | --- |
| estructura-atomica | La nube del orbital (`nube-orbital`) | 14 orbitales (1s a 3d), nube entera o cortada, nodos ocultos o a la vista, tamaño ampliado o a la misma escala | 5: hueco esférico, dos planos nodales, p sobre z, el más grande (extremo), 2p y 3p guardados (comparación) | nodo, plano nodal, radio de Bohr |
| liquidos-y-solidos | La celda que se repite (`celda-se-repite`) | red CS, BCC o FCC; una celda u ocho; esferas de tamaño real o chicas | 5: 4 átomos por celda, 8 vecinos, la menos vacía (extremo), un átomo entero, el doble de átomos (comparación) | red cristalina, celda unitaria, número de coordinación, empaquetamiento |
| hidrocarburos | El enlace que gira (`enlace-que-gira`) | etano, butano, cis- y trans-but-2-eno; φ de 0° a 330° (− y +); de costado o a lo largo del enlace | 5: anti (extremo), etano eclipsado, gauche, cis con dos φ (comparación), cis contra trans (comparación) | conformación, eclipsada, alternada, anti, gauche |
| hidrocarburos | El espejo que no encaja (`espejo-no-encaja`) | CHFCl₂, CH₂FCl o CHFClBr; giro de la copia de 0° a 330° | 4: encajar la copia, la que no encaja nunca, CHFClBr con dos giros, una que encaja y otra no | quiral |

Ninguna mesa tiene animación continua: lo que cambia (φ, el giro de la copia) es un control. Las lecturas en vivo salen
del motor y tienen 12 palabras o menos. El validador (`contenido/teoria/teoria.test.js`) comprueba cada reto en toda la
grilla.

## 3. Piezas nuevas o tocadas

| Pieza | Qué es | Unidades |
| --- | --- | --- |
| `nucleo/kit/piezas/quim-orbital-3d.js` (nueva) | Nube de puntos de un orbital (`THREE.Points`, dos colores por el signo de ψ: c-i y c-f), ejes x, y, z rotulados, nodos tenues (esferas, planos, conos) y rótulos «ψ +» y «ψ −». Respaldo SVG con 530 puntos y los nodos esféricos. | estructura-atomica |
| `nucleo/kit/piezas/quim-red-3d.js` (nueva) | Celda cúbica con el trozo de cada esfera que queda dentro (`SphereGeometry` con φ y θ recortados y tapas `CircleGeometry`), rótulos ⅛, ½ y 1; o bloque de 2 × 2 × 2 celdas con `InstancedMesh`, el átomo del centro y sus vecinos en naranja. Respaldo SVG. | liquidos-y-solidos |
| `nucleo/kit/piezas/quim-molecula-3d.js` (dos opciones nuevas) | `escala` (achica todo para que quepan dos moléculas) y `simbolos` (rótulo HTML con el símbolo de cada átomo que no es C). Sin ellas, la pieza dibuja igual que antes: la mesa de enlace químico se recorrió de nuevo. | hidrocarburos (las dos mesas), enlace-quimico (sin cambios) |

Pruebas en Node al lado de cada pieza: el respaldo y el `alt` muestran lo que calcula el motor, los trozos de esfera caen
dentro del cubo (también su volumen: ⅛, ½, 1), los rótulos caen donde ψ tiene su signo y girar conserva distancias.

Presupuesto: la escena más cargada es el bloque FCC con esferas reales: 63 esferas instanciadas de unos 250 triángulos
(≈ 16 000 triángulos; ≈ 9 000 en modo ahorro) en 5 mallas. La celda FCC usa 45 mallas y menos de 3000 triángulos. El
butano, 27 mallas y unos 12 000 triángulos. Sin sombras, sin texturas ni modelos.

## 4. Motores ampliados (regla 1) y sus pruebas

El validador solo deja cargar en el navegador piezas, `nucleo/elementos.js` y motores de `plantillas/<tema>/motor.js`
(ver pedido 1), así que el cálculo vive en los motores de cada plantilla:

| Motor | Qué se agregó | Pruebas | Verificación aparte |
| --- | --- | --- | --- |
| `plantillas/atomo-y-tabla/motor.js` | Orbitales del hidrógeno: `ORBITALES`, `orbital` (n, l, nodos, planos, conos, r90), `psi`, `nube` (muestra determinística con densidad \|ψ\|², entera o en lámina), `lobulos`, `mayorOrbital` | 10 casos en `casos.json` y `orbitales.test.js` (normalización, nodos con ψ = 0, 90 % de la nube dentro de r90, signo de cada punto, hueco del 2s cortado) | Python con la fórmula general de R_nl (Laguerre asociado) e integración: r90, nodos y ψ coinciden |
| `plantillas/liquidos-y-solidos/motor.js` | Redes cúbicas: `celda` (sitios, fracción, átomos por celda, r/a, coordinación por fuerza bruta, empaquetamiento), `bloqueRed`, `vecinosRed`, `puntosRed` | 4 casos en `casos.json` y `redes.test.js` (ninguna esfera se encima, vecinos del centro, orden CS < BCC < FCC) | Python: volumen ocupado contado en una grilla de 200³, sin fracciones por sitio |
| `plantillas/hidrocarburos/motor.js` | `conformacion` (etano, butano y but-2-enos con geometría ideal y diedro φ), `diedro`, `distanciaMaxima`; `espejo` y `tetraedro` (CHFCl₂, CH₂FCl, CHFClBr) | 2 casos más en `casos.json` (queda en 25, su tope), `conformaciones.test.js` (largos, ángulos, diedro medido = φ, el doble no gira, sin choques) y `espejo.test.js` | Python: distancias con el método NeRF; superposición del espejo buscando en todas las rotaciones, no solo en la vertical |

## 5. Pedidos a la base o a la app

1. **Módulos de `nucleo/` en el navegador.** El encargo sugería módulos nuevos en `nucleo/`, pero
   `contenido/teoria/teoria.test.js` solo acepta en `requiere` piezas, `nucleo/elementos.js` y motores de plantilla, y
   `app/teoria.js` solo carga `nucleo/geometria3d.js` en su `BASE`. Por eso el cálculo fue a los motores de plantilla.
   Si la sesión principal prefiere `nucleo/orbitales.js` o `nucleo/redes.js`, hay que abrir esa regla y sumarlos a la app.
   **No hace falta nada para integrar esta rama:** todo lo que usa ya se carga por `requiere`.
2. **Rótulo con fondo propio** (`h.etiqueta(pos, texto, { fondo: true })` en `nucleo/kit/vivo3d.js` y su CSS). Caso:
   en `quim-red-3d` el «½» cae delante de la media esfera turquesa y el texto turquesa sobre turquesa casi no se lee.
   Lo mitigué poniendo el rótulo afuera del cubo y eligiendo el sitio más cercano a la cámara, pero desde otros ángulos
   vuelve a caer sobre una esfera.
3. **Rótulos tapados.** Los rótulos HTML se ven aunque su átomo quede detrás de otro (en «El espejo que no encaja», el
   «Cl» de atrás aparece sobre el carbono). Pedido: que `vivo3d` atenúe un rótulo cuando su punto queda tapado
   (rayo desde la cámara) o una opción `ocultable`.
4. **Distancia de cámara por datos.** `SPEC.distancia` es fija; para dos moléculas lado a lado usé `datos.escala` en la
   pieza. Una `distancia` que la mesa pueda pedir sería más limpia.
5. **`node --test nucleo/` no corre en Node 22 de este contenedor** (falla con un directorio suelto); usé
   `node --test 'nucleo/**/*.test.js'`. Conviene corregir esa línea en `docs/3d.md` y en los encargos.
6. **El servidor local se cae** si una unidad lanza un error al cargarse mientras se edita (arma el glosario al vuelo).
   No es de esta rama; solo aviso.

## 6. Cómo se comprobó

- `npm run catalogo` y `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'` después de cada unidad; `npm
  test` completo antes del último push (resultado al final de este archivo).
- Recorrido con Playwright a 360 × 780 y swiftshader (`--use-angle=swiftshader --enable-unsafe-swiftshader`), en las
  cuatro mesas: el lienzo aparece; girar cambia la figura; «Vista inicial» la deja igual (comparación de píxeles del
  lienzo); la lupa abre; «Pista» y «Muéstrame» resuelven un reto; el caso guardado tiene miniatura; ningún error en la
  consola. Se repitió en «La molécula que gira» de enlace químico después de tocar su pieza.
- Capturas miradas una por una. Arreglos que salieron de mirarlas: el rótulo «z» se salía del lienzo (ejes más cortos);
  los rótulos «+» y «−» del 3dxy caían encimados en el núcleo (ahora los ubica el motor con `lobulos`); el 1s a la misma
  escala era un punto (la mesa abre en «Ampliado»); los d del plano xy se ven desde arriba; los rótulos ⅛ y ½ se perdían
  (afuera del cubo); y un error mío en `quim-molecula-3d` (una variable `k` que tapaba la del bucle dejó los enlaces
  con radio 0) que se vio en la captura del espejo y se corrigió antes de subir.

## 7. No verificado

- El Redmi 15C ni ningún celular real: rendimiento de 1600 puntos y del bloque FCC con esferas reales.
- El tema oscuro de las cuatro mesas (los colores salen de las variables CSS, pero no se miró una captura).
- Lectores de pantalla reales (los `aria-label` y `alt` se probaron solo como texto).
- Personas reales: si «cortar la nube» se entiende sin ayuda, y si «Giro de la copia» se lee como lo que es.
- Los contrastes de los rótulos sobre las figuras (pedido 2) no se midieron.
- Que «anti» sea la conformación más estable y «gauche» algo menos sigue el texto de OpenStax, Organic Chemistry §3.7;
  la mesa no da energías, solo la distancia entre los CH₃ que calcula el motor.
- El espejo solo deja girar la copia alrededor del eje vertical. La prueba en Python confirma que, para estas tres
  moléculas, eso basta (las aquirales encajan con 120°; CHFClBr no encaja con ninguna rotación), pero con otras
  moléculas haría falta otro eje.

## Reporte de diseño

```
Ficha de tarea:
  Promesa: girar y cortar un objeto químico hasta ver la relación que el plano esconde (nodo, fracción de celda,
    giro alrededor de un enlace, espejo que no encaja).
  Persona y condiciones: postulante de 3.º–5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
  Resultado observable: dice cuántos nodos y de qué tipo tiene un orbital; cuenta átomos por celda y vecinos; dice si
    un enlace gira y si una molécula es quiral.
  Orden de atención: 1.º la figura 3D · 2.º la lectura en vivo · acción: un control a la vez · fondo: la tarjeta del reto.
  Estados: vista inicial · girada · control cambiado · lupa · reto con pista · «Muéstrame» · logrado · guardado ·
    sin WebGL 2 (respaldo SVG con aviso de la base).
  Duda que resuelve: ¿el orbital es una órbita?, ¿por qué 4 átomos y no 14?, ¿cis puede volverse trans girando?,
    ¿una molécula y su espejo son la misma?
Sistema: existente (docs/diseno.md, colores de variable de app/estilos.css, base vivo3d). Decisiones nuevas: signo de ψ
  en c-i (+) y c-f (−); lo que cuenta para la celda en c-i y el número de coordinación en c-o; φ en c-d (el ángulo, como
  en enlace químico). Quedan escritas en los encabezados de las piezas y en este reporte.
Carácter: los del proyecto (cálido, claro, resolutivo) · firma: la de la base (mesa que se gira, «Vista inicial»).
Movimientos: ninguno propio. Girar sigue al dedo (base); φ y el giro de la copia cambian por pasos de 30° con − y +,
  sin animación: el estado final se entiende solo (ley 5). Variante reducida: la misma.
Verificación: en «no» → rótulos con contraste bajo sobre objetos del mismo color (pedido 2) y rótulos de átomos tapados
  (pedido 3). Mediciones: comparación de píxeles del lienzo (girar ≠ inicio; «Vista inicial» = inicio) en las cuatro
  mesas; conteo de triángulos estimado por geometría (§3).
No verificado: celular real, tema oscuro, lector de pantalla, personas (§7).
Hipótesis: cortar la nube hace visible el nodo radial que la nube entera esconde; se comprobaría con el reto 1 de la
  nube (cuántos lo logran solos frente a «Muéstrame») en la medición de la exploración. Contar trozos en la celda baja el
  error «14 átomos» (QM: contar enteros), medible con el reto 1 de la celda.
Conflictos: el encargo pedía módulos en nucleo/ y el validador no los deja cargar (pedido 1). docs/3d.md dice
  «node --test … nucleo/», que aquí no corre (pedido 5).
```

## Resultado final

`npm test` completo antes del último push (15 nov 2026): 8614 pruebas, 8614 en verde, 0 fallas.
