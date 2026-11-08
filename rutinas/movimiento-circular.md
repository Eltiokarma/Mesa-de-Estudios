# Rutina de movimiento circular: reporte

Rama `rutina/movimiento-circular`, sacada de `claude/awesome-wozniak-5etl1n`. El mapa que manda es `docs/clasificacion/compendio-movimiento-circunferencial.md` (completo desde el 8 nov 2026). Regla 5: no se abrió ningún PDF; todos los enunciados, números y figuras son propios. Ningún caso sale de una clave del libro. Cada pieza siguió el método de `docs/metodo/`: constructor, verificador ciego, revisor de contenido y correcciones al mismo constructor.

## 8 nov 2026 · Generadores G2, G3, G4 y G8 (formato «predicciones»)

Ya integrados en la principal (sw v133). Están en la unidad `fisica.movimiento-parabolico-y-circular`.

- **`circular-transmision` (G2, C3).** Tipos:
  - tren de 2 a 4 ruedas (faja, cruzada, contacto, eje);
  - discos en fila;
  - sentido de giro con signo;
  - polea de dos gargantas con un bloque;
  - polea móvil (semisuma);
  - α de la última rueda en una reducción.
- **`circular-mcuv` (G3, C8).** Tres de ω0, ωf, α, t y θ, con frenados que se pasan del alto, intervalos que no empiezan en t = 0 y tramos.
- **`circular-enesimo-segundo` (G4).** Lo girado en el segundo m conociendo el segundo k (impares 1, 3, 5…), también con ω0.
- **`circular-encuentros` (G8, C4 y C10).** El n-ésimo encuentro, las vueltas, la separación, el reencuentro en la salida (mcm de los periodos) y con α.
- **Pruebas.** 600 semillas por generador, con un recálculo por otro camino: arcos propagados, simulación paso a paso, bisección o cruces en el tiempo.
- **Verificación ciega.** Coinciden los 46 casos. Además se revisaron 120 semillas a mano: ninguna correcta errada ni ningún distractor defendible.
- **Decisiones de la principal:**
  - `CI-enesimo-segundo` queda partido en sufijos (`-razon-n`, `-cuadrados`, `-total`…) para medir cada error por separado.
  - Se aprobó `formato: 'pi'` en `armar`.
- **Núcleo.**
  - `P.pi(x, unidad, qmax)` y `armar({ formato: 'pi' })`, compatibles hacia atrás: los 9 generadores dan la misma salida en las semillas 0 a 199. Los generadores circulares lo usan y se borraron sus `piTexto` propios.
  - Commit aparte: `formatear(n, 0)` ya no borra los ceros de los enteros (10 daba «1»).

## 8 nov 2026 · Escena `plantillas/movimiento-circular/` («El disco y sus flechas», 0.1.0)

Tiene 5 pestañas y los 23 pasos del mapa 4(a), en el orden pedido. Son 22 predicciones (el paso 1 es el problema) y cada una bloquea. La pestaña 5 lleva las pastillas con la regla de Gerson.

- **Pestaña 1, «El disco que acelera».** Qué flecha cambia de largo; acp = aT a medio radián, con perillas de R y α que muestran que no depende de ellos; segundo a segundo (1, 3, 5); el análogo lineal; las rpm; el triángulo de aceleraciones.
- **Pestaña 2, «Flechas».** |Δv| en el MCU. El paso 9, «Las aceleraciones en A y en B», desarma `CI-mcu-a-constante`: las dos acp se trasladan a un mismo origen. Siguen α contra ω al frenar y dos puntos del mismo disco.
- **Pestaña 3, «Gráficas».** Cuándo se detiene (el vértice de θ-t); área con signo de una ω-t que cruza el eje (18 rad recorridos, neto 0); de la ecuación al disco; dos discos en la misma gráfica. Después de responder, un cursor de tiempo se arrastra con `Celular.arrastre`.
- **Pestaña 4, «Ruedas y poleas».** Polea móvil, reducción que acelera, rueda que rueda.
- **Pestaña 5, «¿Qué pasa si…?».** La bala y la esfera, la gota de barro (rueda de 50 cm, ω ≈ 7,9 rad/s), la bolita que se despega, el reencuentro y la rueda que frena.
- **Motor `MotorCircular`.**
  - Copia, sin moverlas, las funciones circulares de `MotorTiro`; `tiro-parabolico` no se tocó.
  - Suma las funciones de 4(c) que usa la escena, como `convertir`, `aceleracionTotal`, `desdeReposo`, `enesimoSegundo`, `horaria`, `grafica`, `vectorial`, `rodadura`, `poleaMovil`, `atraviesa`, `gotaDeRueda`, `despegaDelDisco` y `reencuentroSalida`.
  - La cabecera termina en la línea 155.
- **Casos.** 45 casos; el verificador ciego recalculó los 284 campos y coinciden todos. Los seis que cambiaron tras la revisión los recalculó la principal.
- **Pruebas.** 70 del motor, con propiedades: acp/aT = 2θ sin importar R ni α, 2n − 1 por segundo y |a| constante con dirección que cambia en el MCU. Papel: 10 problemas propios.
- **Respaldos.** Ninguna opción es «documentado». Van como `parcial` K4, K1, K3, G2, G4, D9 y TR5 (Williams s. f., del informe de trigonometría), con la cita en los términos del informe. Los CI-* son hipótesis.
- **Revisión.** Se corrigieron:
  - tres graves: el paso 5 soltaba la respuesta en la cinta, el título y la leyenda del paso 9 la regalaban, y el color de r⃗ chocaba con los avisos en oscuro (ahora va en tinta);
  - la gota con radio 0,4π m, que olía a libro;
  - θ, que ahora tiene color propio;
  - los códigos cruzados de los pasos 12 y 13;
  - la ambigüedad del paso 21;
  - las citas;
  - las ecuaciones que se cortaban a 390 px;
  - tres distractores poco creíbles («el triple» en la rueda; «cuarto de vuelta» y «grados sin radianes» en la bala, reemplazados por `CI-diametro-por-radio` y `CI-ms-sin-convertir`, para que todas las opciones vayan con π).
- **Comprobado.**
  - Playwright a 390×844 y 1366×768, claro y oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes.
  - `pasada-celular.py`: sin QUEDA. `pasada-pegatina.py`: nada que cambiar. `npm test`: 4596 en verde.
  - No se subió `VERSION` de `app/sw.js`.

### Colores para `docs/diseno.md`

Variables de el disco y sus flechas (`plantillas/movimiento-circular/`):

| Variable | Color | Claro | Oscuro |
| --- | --- | --- | --- |
| v | morado | #8a2aa8 | #ec62e6 |
| acp y a total (la total a trazos) | verde | #466d14 | #a3d65e |
| aT (flechas de 4 px con halo) | ocre oscuro | #4a3b00 | #ffde0a |
| t y el cursor de tiempo | naranja | #a05200 | #f0a04a |
| ω, f y vueltas (f = ω/2π) | turquesa | #0f766e | #5ed9c8 |
| α | azul | #056db3 | #10a7f9 |
| θ | azul pizarra en claro, lavanda en oscuro | #13394b | #8080ff |

- Los cinco primeros son los de `tiro-parabolico`.
- r⃗ y los radios van en tinta. En la pestaña 2, r⃗ lleva flecha encima para no confundirse con el radio r.
- En el paso 21, el ángulo de salida es φ, en tinta.
- ΔE00 mínimo: 20,5 en claro (θ con la tinta) y 20,4 en oscuro (tinta con el gris).
- AA ≥ 4,5 en papel y chip.
- ω queda a ΔE00 11 del verde de «correcto», que siempre lleva texto.

### Pendiente

- La pestaña «Ruedas» de `tiro-parabolico` debería enlazar a esta escena (según el mapa). No se tocó, porque es otra plantilla.
- Variantes del mapa que no entraron:
  - la bobina y la barra que resbala en el paso 18 (la bobina ya está en el motor; faltan `barraResbala` y `alfaMediaVectorial`);
  - la ω que cambia de sentido en el paso 10, que va solo en texto.
- El arrastre del cursor se probó con ratón, no con un dedo real.
- Generadores que faltan: G1, G5, G6, G7 y G9. El motor de la escena ya tiene las funciones que piden.
