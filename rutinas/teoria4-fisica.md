# Ronda 4, física: el 3D (15 nov 2026)

Rama `teoria4/fisica`, desde `main` (6cfbfa7). Encargo: `rutinas/encargos/teoria4-fisica.md`. Molde: `docs/3d.md`.

Resumen: **seis mesas 3D**, una por unidad, todas sobre **una sola pieza viva nueva** (`fis-espacio-3d`) y **un módulo nuevo** (`nucleo/fisica3d.js`) que arma las escenas con los motores de plantilla que ya existían. Cuatro unidades son de 3D necesario y dos de contexto. Cada mesa va primera en su laboratorio, sin cambiar el `id` de las que ya estaban (todas quedan con 4 mesas).

## 1. Las 20 unidades

| Unidad | Clase | Razón | Qué se hizo |
| --- | --- | --- | --- |
| Magnitudes y vectores | **3D necesario** | A × B sale del plano de A y B; las componentes en el espacio son tres sombras | Mesa «Flechas en el espacio» (`flechas-espacio`), 5 retos |
| MRU, MRUV y caída libre | Plano | Todo ocurre sobre una recta y en gráficas | Nada |
| Movimiento parabólico y circular | 3D de contexto | La trayectoria es plana, pero ver a la vez la sombra del suelo (MRU) y la de la pared (MRUV) acerca «un reloj, dos movimientos» | Mesa «La pelota y sus dos sombras» (`dos-sombras-3d`), control t, 4 retos |
| Estática | Plano | Fuerzas coplanares; los momentos se leen en el plano | Nada |
| Dinámica | 3D de contexto | Plano inclinado, ascensor y poleas son lugares reales, pero se miden en el plano | No alcanzó |
| Gravitación | 3D de contexto | La órbita es plana, pero su plano puede inclinarse y siempre pasa por el centro de la Tierra | Mesa «Órbitas en cualquier plano» (`orbita-plano-3d`), control t, 4 retos |
| Trabajo y energía | Plano | Rampas y barras de energía; el 3D no agrega | Nada |
| Impulso y choques | Plano | Choques en un riel (1D) y gráficas F–t | Nada |
| Oscilaciones | Plano | Resorte, péndulo y curva x–t; el círculo de referencia es plano | Nada |
| Ondas mecánicas | Plano | Cuerda y gráficas; transversal en un plano | Nada |
| Fluidos | 3D de contexto | Vasos y bloque que flota son objetos reales; la presión se mide por profundidad | No alcanzó |
| Temperatura y calor | Plano | Gráficas T–t y dilatación lineal | Nada |
| Termodinámica | Plano | Diagrama P–V | Nada |
| Electrostática | 3D de contexto | El campo de una carga sale en todas direcciones, pero las ideas de la unidad se miden en una recta o entre placas | No alcanzó |
| Corriente y circuitos | Plano | Circuitos y gráficas V–I | Nada |
| Magnetismo | **3D necesario** | F = q v × B es perpendicular a v y a B: sin girar no se ve la mano derecha | Mesa «La mano derecha en 3D» (`mano-derecha-3d`), 5 retos |
| Inducción electromagnética | **3D necesario** | El flujo depende de cuánto se inclina la espira respecto del campo: su sombra | Mesa «La espira y su sombra» (`espira-sombra-3d`), 5 retos |
| Ondas electromagnéticas | **3D necesario** | E y B oscilan en planos perpendiculares entre sí y al avance | Mesa «E y B que avanzan» (`onda-3d`), control t, 4 retos |
| Óptica geométrica | Plano | Rayos en un plano | Nada |
| Física moderna | Plano | Fotoeléctrico, rectas y niveles | Nada |

Orden de trabajo: primero las cuatro necesarias en el orden del curso, después dos de contexto (parabólico y gravitación).

## 2. Pieza nueva

**`nucleo/kit/piezas/fis-espacio-3d.js`** (+ `.test.js`, 5 pruebas): el espacio de física, sobre `Kit.vivo3d.montar`. Dibuja lo que le pasan: ejes, flechas, trazos (también punteados), bolas, caras planas y rótulos HTML del color de su variable. No calcula nada. Usa coordenadas de física con z hacia arriba y las pasa a three.js como (x, z, −y), que conserva la mano derecha (la prueba comprueba que x̂ × ŷ = ẑ). `escala` ajusta la escena al cuadro sin engrosar flechas ni bolas. Respaldo plano en SVG con la misma proyección, `alt` con los números y `mallas(datos)` para el presupuesto.

La usan las seis unidades: magnitudes y vectores, movimiento parabólico y circular, gravitación, magnetismo, inducción electromagnética y ondas electromagnéticas.

Clases de three.js: solo las del paquete (`Line`, `LineBasicMaterial`, `LineDashedMaterial`, `Mesh`, `SphereGeometry`, `BufferGeometry` y las de `h.flecha`). No hizo falta pedir ninguna.

## 3. Módulo nuevo y motores

**`nucleo/fisica3d.js`** (+ `nucleo/fisica3d.test.js`, 7 pruebas): una función por escena (`vectores`, `lorentz`, `espira`, `ondaEM`, `tiro`, `orbita`). Cada una toma los valores de la mesa, pide los números al motor de plantilla y devuelve `{ datos, … }` con lo que miden la lectura y los retos. Así la flecha, la lectura y el reto usan el mismo número (regla 1).

| Escena | Motor que usa | Qué se comprueba aparte (cuenta escrita a mano en la prueba) |
| --- | --- | --- |
| vectores | `plantillas/vectores` (escalar, vectorial) | \|A\|, A · B y A × B en 5 casos |
| lorentz | `plantillas/magnetismo` (fuerzaCarga) | F = q(0, v_z, −v_y) con B = x̂ en 48 combinaciones de θ, φ y signo |
| espira | `plantillas/induccion` (flujo) | Φ = B·A·cos θ en 5 casos; la sombra mide A·\|cos θ\| |
| ondaEM | `plantillas/ondas-electromagneticas` (ondaDeLambda, campos, instante) | f = c/λ, T, B₀ = E₀/c, E en el origen = −E₀ sen(2πt/T); E y B perpendiculares y del mismo largo |
| tiro | `plantillas/tiro-parabolico` (proyectil) | x e y con g = 10, 37° de academia, la pelota se queda en el suelo, 37° y 53° con el mismo alcance |
| orbita | `plantillas/gravitacion` (orbita, geoestacionario) | T = 2π√(r³/GM) y v = √(GM/r) con GM = g₀R²; el satélite queda en su plano inclinado, a r del centro, y g apunta al centro |

No hubo que tocar ningún motor de plantilla.

## 4. Pedidos y avisos para la sesión principal

1. **`contenido/teoria/teoria.test.js` acepta `/nucleo/fisica3d.js` en `requiere`** (una línea del regex). Antes solo admitía piezas, motores de plantilla y `nucleo/elementos.js`. Las seis unidades cargan el módulo por `requiere`, así que **no hace falta tocar `app/`**: funciona tal cual. Si se prefiere sumarlo a `BASE` de `app/teoria.js` (como `geometria3d.js`), se puede quitar de los `requiere` y revertir esa línea.
2. **Sin conexión:** las seis unidades piden ahora motores de plantilla (`vectores`, `magnetismo`, `induccion`, `ondas-electromagneticas`, `tiro-parabolico` y `gravitacion`), además de `nucleo/fisica3d.js` y la pieza. No revisé si el service worker los guarda al abrir la unidad o solo cuando ya se visitaron. Conviene comprobarlo, igual que con el motor de enlace.
3. **Validador del glosario:** las mesas no estrenan términos técnicos. Usan los que ya estaban: componente, producto vectorial y escalar, campo magnético, fuerza magnética, flujo magnético, onda electromagnética, período, órbita y velocidad orbital. «Sombra», «plano», «inclinación» y «polos» se dejaron como palabras comunes.
4. **Prueba de `node --test … nucleo/`:** con Node 22, pasar la carpeta `nucleo/` como argumento falla («test failed» sin pruebas). Usé `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'`. Habría que corregir el comando en el encargo y en `docs/3d.md` §4.

## 5. Cómo se comprobó

- `npm run catalogo` y `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'` en verde después de cada unidad (642 pruebas al final). El validador busca cada reto en toda la grilla.
- Cada mesa se recorrió con Playwright a 360 × 780, con swiftshader:
  - el lienzo aparece;
  - girar cambia la figura (comparando capturas del lienzo);
  - «Vista inicial» la deja igual al inicio;
  - la lupa abre;
  - «Pista» y «Muéstrame» resuelven el primer reto;
  - «Guardar este caso» deja una miniatura;
  - cero errores en la consola en las seis.
- Miré las capturas. Correcciones que salieron de ahí:
  - la escena se salía del cuadro (se agregó `escala`);
  - la onda se veía chica y de frente;
  - en el tiro, los rótulos x y vy chocaban;
  - en la órbita, la flecha g tapaba el rótulo r;
  - en magnetismo, la carga iba en rojo, que en esa unidad es la corriente; pasó a tinta.
- `npm test` completo antes del último push: 8578 pruebas, 8578 en verde.

## 6. No verificado

- El Redmi 15C de Gerson ni ningún celular real: la emulación con swiftshader no mide fluidez.
- Que los rótulos HTML no se encimen en todos los ángulos: se revisó la vista de partida y una vista girada por mesa, no la grilla completa.
- Modo ahorro y tema oscuro de estas mesas: los da la base común, pero no capturé las seis así.
- Lector de pantalla real (el `aria-label` del lienzo sale del `alt` de cada escena).
- Los términos del glosario: solo se revisó a mano que no hubiera palabras nuevas sin explicar. No corrí `herramientas/palabras-glosario.js`.

## 7. Reporte de diseño

```
## Reporte de diseño
Ficha de tarea:
  Promesa: girar con el dedo una escena de física donde la profundidad es la idea (o la vuelve cercana) y probar casos
    con − y +, sin preguntas.
  Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja a 360 px, a veces sin conexión.
  Resultado observable: dice hacia dónde sale A × B o F, por qué el flujo es la sombra de la espira, que E y B van
    cruzados, que la sombra del suelo avanza pareja y que toda órbita rodea el centro.
  Orden de atención: 1.º la escena 3D · 2.º la lectura en vivo · acción: los controles con − y + · fondo: Tilo y el reto.
  Estados: cargando (respaldo plano) · sin WebGL 2 (vista plana con aviso) · 3D cortado (vuelve solo) · reto pendiente
    · logrado · visto con ayuda · caso guardado.
  Duda que resuelve: ¿qué se ve distinto cuando la misma relación se gira en el espacio?
Sistema: existente (tokens de la app, colores de variable por unidad, base vivo3d). Nada nuevo de sistema: cada mesa usa
  los colores que su unidad ya fijó (regla 4); la carga de magnetismo pasó a tinta porque el rojo es I en esa unidad.
Carácter: los de la app · firma: las sombras punteadas (caja de componentes, parte de v que cruza B, sombra de la espira,
  sombras del tiro) repiten un mismo gesto en cuatro mesas: proyectar para medir.
Movimientos: ninguno automático. Todo cambio en el tiempo va por el control t (simulación con el reloj del modelo, lineal,
  sin arrancar sola); girar sigue al dedo uno a uno (base común). Variante reducida: idéntica, porque nada se anima solo.
Verificación: Playwright 360 × 780 con swiftshader en las seis mesas (lienzo, giro, vista inicial, lupa, Muéstrame,
  miniatura, 0 errores). Presupuesto: la prueba de la pieza mide ≤ 60 mallas en el peor caso de cada escena (la onda
  usa 52, la más cargada). Rótulos HTML de texto real, del color de su variable.
  Puntos en «no»: contraste de los rótulos sobre el lienzo no medido aquí (usan la clase «var» de la app, ya medida);
  la flecha g y la v de la órbita no codifican el valor con el largo (se dice en el código y la lectura da v).
No verificado: teléfono real, lector de pantalla, tema oscuro y modo ahorro capturados, personas reales.
Hipótesis: girar la escena de magnetismo hasta ver v, B y F a la vez reduce el error de poner F a lo largo de B (MG del
  informe de electromagnetismo); se comprobaría con la tasa de ese error en la práctica antes y después de abrir la mesa.
  La sombra de la espira debería bajar el error FL-SEN (usar seno en vez de coseno); mismo método.
Conflictos: docs/3d.md pide «node --test … nucleo/», que con Node 22 falla con la carpeta; se usó el patrón de archivos.
```
