# Reporte: teoría de aritmética (14 nov 2026)

Encargo: `rutinas/encargos/teoria-aritmetica.md`. Rama: `teoria/aritmetica`, que sale de `claude/awesome-einstein-ch5g9a`. No se integró a `main`.

**Cómo se hizo.**
- La sesión principal escribió las piezas nuevas y la unidad modelo (porcentajes, con el microguion «cada porcentaje tiene una base»).
- Después, cuatro sesiones hijas escribieron las otras 18 unidades, cada una en su worktree, con su servidor y un commit por unidad.
- La sesión principal integró esos commits con cherry-pick, regeneró el catálogo en cada uno, separó los códigos de error que chocaban y corrió `npm test` completo.

## Unidades hechas

Las 19 unidades del catálogo tienen archivo en `contenido/teoria/aritmetica/`. Todas están en `estado: 'completa'`: cada tema del catálogo está en al menos una idea que lo enseña. Las 19 pasan el validador de `nucleo/teoria.js` con 60 semillas y su recorrido en Playwright a 360 × 780.

| Unidad | Grado | Ideas | Piezas | Ideas (títulos) |
| --- | --- | --- | --- | --- |
| logica-proposicional | 3 | 5 | arit-tabla, recta | Cada conectivo tiene su tabla · El condicional solo falla una vez · Verdadera en todas las filas · Equivalente es misma tabla · Para todo y existe |
| conjuntos | 3 | 5 | arit-venn, arit-tabla | Pertenecer no es estar incluido · Cada operación es una zona · La intersección se cuenta una vez · Cada elemento duplica los subconjuntos · Pares con orden |
| razones-y-proporciones | 3 | 4 | arit-tiras, recta | Restar o dividir: dos comparaciones · Proporción: los productos cruzados · Tres medias para dos números · Razones iguales: la suma también |
| magnitudes-proporcionales | 3 | 4 | ejes, arit-tiras | Cociente fijo o producto fijo · La obra se reparte en días · Repartir según pesos · Capital por tiempo |
| porcentajes | 3 | 5 | barra-porcentaje | Cada porcentaje tiene una base · El segundo muerde lo que quedó · Subir y bajar no se anulan · Costo, lista, venta y ganancia · El impuesto se quita dividiendo |
| numeracion | 3 | 4 | arit-fichas, arit-tabla | Agrupar de b en b · Cada cifra vale según su lugar · Restos leídos de abajo arriba · Contar cifras por bloques |
| cuatro-operaciones | 3 | 6 | arit-fichas, recta, arit-tabla, arit-tiras | Dos escaleras, un rectángulo · Lo que falta para la potencia · Resto por defecto y por exceso · Llevar cuando se llega a b · Multiplicar es sumar por partes · Cuántas cifras tendrá |
| divisibilidad | 3 | 5 | arit-fichas, arit-tabla | Filas de m sin sobrante · Los restos se suman y multiplican · Los restos de potencias se repiten · Los criterios salen de 10 · Soluciones enteras: manda el mcd |
| numeros-primos-y-divisores | 3 | 6 | arit-fichas, arit-tabla | Primo: una sola fila · La criba tacha múltiplos · Una sola factorización · Elegir exponentes cuenta divisores · φ(n) cuenta los coprimos · Fermat y Wilson con un primo |
| mcd-y-mcm | 3 | 5 | arit-tiras, recta, arit-tabla | El trozo común más largo · La primera vez que coinciden · Euclides: medir con el resto · MCD por MCM, con dos números · Los cocientes arman una fracción |
| numeros-racionales | 3 | 5 | arit-tiras, recta, arit-tabla | Partir distinto, misma cantidad · Dónde cae la fracción · Exacto o periódico · Alinear las colas y restar · Exacto según la base |
| potenciacion-y-radicacion | 3 | 4 | arit-tabla, arit-fichas, recta | Los exponentes deciden · Descartar no es confirmar · El cuadrado más grande que cabe · Encerrar la raíz por pasos |
| interes-y-descuento | 4 | 5 | arit-tiras, recta | El interés que gana interés · Nominal, efectiva y continua · Traer el dinero al presente · Descuento comercial y racional · Varias letras, una fecha |
| mezclas-y-aleaciones | 4 | 4 | recta, arit-tiras | El precio medio pesa · El aspa: distancias cruzadas · Grados: litros de alcohol puro · Quilates: oro de cada 24 partes |
| estadistica | 4 | 6 | arit-tabla, ejes, recta | Contar, dividir, acumular · Barras y sectores · Media, mediana y moda · Cuando cada dato pesa distinto · Cortar los datos en cuartos · Qué tan lejos de la media |
| sucesiones-y-series | 4 | 5 | arit-fichas, recta, arit-tiras, arit-tabla | Cada fila agrega lo mismo · La suma es medio rectángulo · Cada término multiplica por r · Diferencias que se vuelven constantes · Sumar sin fin sin pasarse |
| razonamiento-numerico | 4 | 6 | arit-tiras, arit-tabla, recta | Suponer todo igual y corregir · Deshacer de atrás hacia adelante · La diferencia de edades no cambia · Encuentro y alcance · Cada letra es una cifra · ¿Alcanza para una sola respuesta? |
| analisis-combinatorio | 5 | 5 | arit-tabla, arit-fichas | «Y» multiplica, «o» suma · Cada puesto, una opción menos · En ronda, girar no cambia nada · Letras iguales, palabras iguales · Elegir no es ordenar |
| probabilidades | 5 | 5 | arit-tabla, arit-tiras | Contar en el espacio muestral · Lo común se cuenta una vez · Saber algo cambia el denominador · De dónde viene un fallado · El promedio a la larga |

En total son 94 ideas, cada una con sus cinco momentos.
- Cada archivo trae al inicio su ficha de tarea y, sobre cada idea, sus cinco decisiones.
- Luma habla en cada `voz`.
- La historia de cada unidad sale de la matriz y su fuente es la de `historia.fuentes`.

## Piezas nuevas del kit

Las cuatro llevan prefijo `arit-`, su afirmación en el encabezado, `alt` y su `.test.js`. Las pruebas comprueban:
- que la pieza es pura y su figura no cambia de alto;
- que no aparece NaN;
- que el texto mide 14 o más y solo se usan colores de variable;
- la fidelidad propia de cada pieza.

Las cuatro se revisaron renderizadas a 360 px, en color y en grises.

| Pieza | Afirmación | Sirve para |
| --- | --- | --- |
| `arit-tiras` | Todas las tiras se miden con la misma regla; una parte vale lo que mide, no lo que se llama. | Razones, fracciones, reparto, mezclas, capas de interés, cintas de MCD y Euclides |
| `arit-tabla` | Cada fila es un caso que ya se comprobó; nada se afirma de una fila vacía. | Tablas de verdad, registros, frecuencias, la cuadrícula de dos dados y los exponentes de los divisores |
| `arit-venn` | Cada zona es una condición de pertenencia; lo de la intersección se cuenta una sola vez. | Conjuntos y eventos. Las zonas se puntean calculando la pertenencia de cada punto (sin `clipPath` ni ids), y los aros tienen siempre el mismo radio |
| `arit-fichas` | La cantidad de fichas no cambia al reacomodarlas; cambia solo cómo se agrupan. | Base b, filas de m con sobrante, rectángulos de divisores, raíz entera y escaleras |

## Pedidos al molde

Lo que sigue no es de mi carril (`app/` y `nucleo/teoria.js`).

1. **Error en `app/teoria.js` (afecta a todos los cursos).**
   - En `vista()` se lee `const [, , , sub] = location.hash.split('/')`, que siempre da `'teoria'`.
   - Por eso `#/unidad/<id>/teoria/<idea>` y los chips de la fila de ideas abren siempre la primera idea pendiente. Tampoco funciona `…/teoria/ficha`.
   - El arreglo es leer el índice 4.
   - Mis recorridos lo esquivaron marcando como hechas las ideas anteriores.
2. **El valor de un control se sale del borde a 360 px** cuando la unidad es larga («soles», «% anual», «períodos»). Lo esquivamos acortando unidades. `app/teoria.js` debería partir la línea o recortarla.
3. **Tope de alto de la figura.** Una figura de más de unos 450 px tapa las opciones; pasó con 6 tiras. Conviene fijar un tope en el contrato.
4. **Tachar en un paso posterior.** `arit-tabla` solo hace aparecer celdas: no puede tachar en un paso posterior una celda que ya se ve.
   - Por eso el «Mira» de la criba es una tabla resumen y no la grilla tachándose.
   - Una pieza de grilla numérica (`arit-grilla`) lo resolvería.
5. **Pendientes de `arit-fichas`.**
   - Un tramo que todavía no llega se pinta del color del bloque. Debería quedar neutro hasta su paso: en la suma como medio rectángulo, la copia se ve desde el primer paso.
   - No arma la forma en L (gnomon) pegada al cuadrado.
   - Con tres bloques de 7 columnas, las fichas quedan de unos 13 px.
6. **Recta con valores cercanos.** Los rótulos de puntos cercanos en `recta` chocan; se repartieron filas a mano (cuartiles, medias, «cada 12 / cada 18»). Ayudaría que la pieza los separara sola.
7. **Servidor de desarrollo.** A veces no muestra una unidad recién agregada hasta reiniciarlo (caché de módulos).
8. **«Ahora tú» sin figura.** La app deja vacío el espacio de la figura.

## Códigos de error

- **Existentes.** Se usan los de `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`: AR1–AR5, AR13, AR15, AR17, AR19, AR20, RM2 y RM3.
- **Nuevos.** Los nuevos son `AT-*`. **Todos son hipótesis de diseño**, sin dato de prevalencia, y su definición está en el `siFuera` de cada opción.
- **Choques resueltos.**
  - Al integrar, cinco códigos significaban cosas distintas en dos grupos. Se renombraron para que la medición no los mezcle: AT-PAR-ORDEN, AT-COMPRENSION, AT-RAIZ-DECIMAL, AT-RAIZ-MITAD, AT-RAIZ-EXCESO, AT-SUMA-PERIODOS y AT-DESHACER-ORDEN.
  - `AT-SUMA` se usa en nueve unidades con un sentido común: sumar donde se multiplica, o sumar lo que no se suma.

**Por tema:**
- **Porcentajes:** AT-PARTE, AT-RESTA, AT-DIVIDE, AT-CIEN, AT-SIGNO, AT-SENTIDO.
- **Lógica y conjuntos:**
  - AT-O-EXCLUSIVA, AT-SIN-VALOR, AT-TABLA, AT-COND-F, AT-COND-Q, AT-RECIPROCO, AT-TAUTO, AT-DEMORGAN, AT-NEG-CUANT;
  - AT-PERTENECE, AT-VACIO, AT-COMPRENSION, AT-EXTREMO, AT-OPERACION, AT-DOBLE, AT-ZONA, AT-POTENCIA, AT-PROPIO, AT-PAR-ORDEN, AT-PRODUCTO.
- **Combinatoria y probabilidad:**
  - AT-Y-O, AT-SUMA-PRODUCTO, AT-TODOS, AT-CIRCULAR, AT-REPETIDOS;
  - AT-FRECUENCIA, AT-UNIVERSO, AT-COMPLEMENTO, AT-INDEP, AT-INVERSO, AT-BASE, AT-ESPERANZA.
- **Razones, proporcionalidad, interés y mezclas:**
  - INVIERTE, CUAL, CONSTANTE, PARTES, REPARTE-IGUAL, MEDIA, PRODUCTO, SUMA;
  - NO-CAMBIA, INVERSA, OLVIDA, SOLO-CAPITAL, SOLO-TIEMPO;
  - UN-PERIODO, MONTO-INTERES, NOMINAL, TASA-PERIODO, DIVIDE-EFECTIVA, RESTA-FUTURO, COMERCIAL-RACIONAL, SOLO-MAYOR;
  - TOTAL, CRUZA, ASPA-INVERTIDA, PRECIOS, AGUA-NO-CUENTA, LITROS-GRADOS, CIEN, RESTO.
  - Todos llevan el prefijo AT-.
- **Estadística:**
  - F-ACUMULADA, COMPLEMENTO, ESTRICTO, RELATIVA, TIPO-VARIABLE, MUESTRA-VARIABLE, GRADOS-PORCENTAJE;
  - MEDIANA-MEDIA, MEDIANA-RANGO, MEDIANA-ORDEN, MODA, MEDIA-FACTORES;
  - POSICION-VALOR, CUARTIL-MEDIANA, CUARTIL-PORCENTAJE, CUARTIL-OTRO;
  - N-MENOS-1, DESVIOS-SUMAN-CERO, SIGMA-VARIANZA, SIN-CUADRADO.
  - Todos llevan el prefijo AT-.
- **Numeración y operaciones:**
  - AT-CIFRA-B, AT-CERO, AT-DECIMAL, AT-ORDEN, AT-SUMA, AT-COCIENTE, AT-CONTEO, AT-LARGO, AT-BLOQUE, AT-MITAD;
  - AT-CUADRADO, AT-DESDE-1, AT-CA9, AT-CA10, AT-CA-K, AT-EXCESO, AT-LLEVA, AT-PARTES, AT-COTA.
- **Divisibilidad y primos:**
  - AT-PRIMO, AT-RESTO-MAYOR, AT-DEPENDE, AT-CICLO, AT-CRITERIO, AT-DIOF;
  - AT-UNO, AT-CRIBA, AT-PESI, AT-TFA, AT-EXP, AT-SIGMA, AT-EULER, AT-FERMAT.
- **MCD, racionales, potencias, sucesiones y razonamiento numérico:**
  - AT-NOMAX, AT-MENOR, AT-RESTA, AT-SUMA-PERIODOS, AT-EUCLIDES, AT-TRES, AT-RELACION, AT-CONVERGENTE, AT-PREGUNTA;
  - AT-SUMA-AMBOS, AT-INVERTIR, AT-FACTOR, AT-ESCRITURA, AT-NUMERADOR, AT-DIFERENCIA, AT-CLASE, AT-PAR, AT-CHICO, AT-INFINITO, AT-PI, AT-CORTAR, AT-GENERATRIZ, AT-BASE10, AT-POSICION;
  - AT-EXPONENTE, AT-INCLUSION, AT-IMPAR, AT-RAIZ-EXCESO, AT-RAIZ-DECIMAL, AT-RAIZ-MITAD, AT-RESIDUO, AT-FALTA, AT-INDICE, AT-MEDIO, AT-COMPROBAR, AT-REPARTIR;
  - AT-NMENOS1, AT-IMPARES, AT-CUADRADOS, AT-ADITIVO, AT-REGLA-UNICA, AT-LIMITE;
  - AT-FALSA, AT-DESHACER-ORDEN, AT-INVERSA, AT-RELATIVA, AT-CIFRAS, AT-SUFICIENCIA, AT-VERTICES.

## Lo no verificado

- **Celular real, lector de pantalla y alumnos reales.** Todo se probó en Chromium a 360 × 780.
- **Tema oscuro.** Solo se revisó en porcentajes (IGV) y en MCD y MCM. En las otras 17 unidades no se revisó.
- **Grises.** Se revisaron las cuatro piezas, no las 94 ideas una por una.
- **Cálculo independiente.** Las respuestas de «Ahora tú» y de las predicciones las calcula el mismo archivo que arma el caso. No hay un segundo cálculo independiente como el de `casos.json` en las plantillas; el contrato de teoría no lo pide.
- **Historias.** Las fechas y autores salen de la matriz; no se volvieron a contrastar con las fuentes.
- **Ecuaciones del PDF.** No se abrieron las ecuaciones LaTeX del PDF de historia; se trabajó con su resumen en la matriz.

## Lo que quedó flojo

Se vio en las capturas y se deja para una segunda pasada.

- **Contraste y legibilidad:**
  - Criba: lo tachado se apaga solo con opacidad; en grises se distingue poco.
  - Conjuntos, potencia: los ✓ van en rojo (c-h) y pueden leerse como error.
  - Interés: el descuento comercial frente al racional se distingue poco a escala (la parte descontada es delgada), y lo mismo pasa con la tasa efectiva frente a la nominal (12 contra 12,68).
  - Bayes y Euclides: con tasas chicas, los tramos miden pocos px y los rótulos se juntan. En Euclides, las últimas tiras salen muy cortas porque todas van a la misma escala.
  - Recta de 1/35: queda densa.
- **Figuras que adelantan o muestran poco:**
  - Reparto, «Ahora tú»: el largo de cada parte deja ver la proporción antes de responder.
  - Suficiencia: el juego muestra una fila de tabla y no el triángulo dibujado.
  - Restos potenciales: no hay flecha que marque el orden de lectura.
  - Gráficos de estadística: el eje de categorías va numerado y no con nombres.
- **Maquetación:**
  - Sumatorias: la ecuación de la regla se corta en dos líneas.
  - Combinatoria, ronda: queda una fila vacía cuando n = 4.

## Reporte de diseño

- **Ficha de tarea:** una por unidad, como comentario al inicio de cada archivo:

  ```
  Promesa · Persona y condiciones · Resultado observable · Orden de atención · Estados · Duda que resuelve
  ```

  La persona es siempre la misma: postulante de 3.º a 5.º, celular de gama baja de 360 px, sin audio.
- **Sistema:**
  - Es el existente: tokens de `app/estilos.css`, trazo del kit (3, 2 y 1 px), texto de 14 px o más y la línea de tiempo del kit.
  - **Decisión nueva:** la familia `arit-*`, cuyas afirmaciones quedaron escritas en el encabezado de cada pieza.
  - **Colores por unidad (regla 4):** cada unidad fija los suyos en su comentario inicial y los usa en el control, la figura, el texto y la ecuación. En porcentajes, por ejemplo: base naranja, primer cambio turquesa, segundo rojo y resultado verde.
- **Carácter:**
  - Adjetivos: acogedora, viva y precisa (los de `docs/escena-viva.md`).
  - Firma: el hilo de color.
  - Voz de Luma: precisa y tranquila; no usa «es fácil» y no humilla en el error.
  - Cada `siFuera` empieza por lo que el alumno pensó bien y dice en qué caso sería cierto.
- **Movimientos:**
  - No se agregó ninguna animación propia: se usan las clases del kit (`kit-crece`, `kit-aparece`, `kit-cae`) en el paso `paso` (900 ms) de la línea de tiempo.
  - Con movimiento reducido, la variante es la de `kit.css`: fundido de 200 ms y los mismos estados.
  - Nada avanza solo.
- **Estructura visual (cinco decisiones por idea):**
  - Escritas sobre cada idea: qué cambia, qué permanece, qué progresa, qué se reserva y qué debe verse.
  - El «Mira» de cada idea es una progresión de 2 a 7 pasos con rastro y una excepción reservada. Por ejemplo, la cota «base S/ 400» del segundo descuento, o la fila V-F del condicional.
- **Verificación:**
  - Validador de `nucleo/teoria.js` en las 19 unidades con 60 semillas: topes de texto, piezas puras, sin NaN y 5 o más casos distintos.
  - Recorrido en Playwright de los cinco momentos de cada idea a 360 × 780, con hojas de capturas revisadas a ojo. Se corrigió lo que no se leía; por ejemplo:
    - fichas demasiado chicas;
    - rótulos encimados en la recta de defecto y exceso;
    - tablas desbordadas con números de 8 cifras;
    - el valor de un control que se salía del borde.
  - `npm test` completo en verde.
- **No verificado:** lo de la sección anterior, en especial el tema oscuro y el celular real.
- **Hipótesis:** jugar con la base antes de predecir debería bajar AR1 y AR3 en porcentajes. Se comprobaría comparando la tasa de esos códigos en la predicción y en «Ahora tú», con los eventos `teoria` de la medición.
- **Conflictos:**
  - El contrato dice que la ruta `…/teoria/<idea>` abre esa idea; hoy no lo hace (pedido 1).
  - El skill pide un movimiento por oficio; aquí no se agregó ninguno: se reutilizó el del kit.
