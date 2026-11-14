# Reporte: ronda 2 de la teoría de Trigonometría (14 nov 2026, noche)

Sesión paralela «teoria2/trigonometria», según `rutinas/encargos/teoria2-trigonometria.md`. Rama `teoria2/trigonometria`, que sale de `claude/awesome-einstein-ch5g9a`. No se integró a `main` ni se abrió PR.

**Cómo se hizo.**
1. La sesión principal agregó a las piezas `trig-plano` y `trig-onda` lo que piden las manijas (inversas de la escala y el ángulo bajo el dedo, con prueba).
2. Hizo la unidad 1, `angulo-trigonometrico`, como modelo del curso: arrastres, llaves, separadores y laboratorio.
3. Las otras 18 unidades las hicieron seis subagentes en paralelo, tres unidades cada uno, con un brief común (contrato §4b, unidad modelo, reglas y método de verificación).
4. La sesión principal revisó cada unidad antes de su commit:
   - el validador con 60 semillas;
   - el catálogo, que no cambió (ninguna unidad cambió `requiere` ni su número de ideas);
   - fichas de muestra a 360 px, con correcciones propias (por ejemplo, la regla del periodo en funciones trigonométricas, que se partía a la mitad).

   Hay un commit por unidad y un push después de cada uno.

## 1. Arrastres: 80 de 86 ideas

| Unidad | Con arrastre | Mesas del laboratorio |
| --- | --- | --- |
| angulo-trigonometrico | 4/4 | dos-giros, tres-escalas, arco-sale |
| longitud-de-arco-y-sector | 5/5 | sector-completo, rodea, faja-libre |
| razones-trigonometricas-agudas | 4/4 | tres-razones, semejantes, complemento-libre |
| triangulos-rectangulos | 3/3 | instrumento, faro, letrero-cerca |
| recta-en-el-plano | 6/6 | dos-puntos, recta-y-punto, triangulo-libre |
| angulos-en-posicion-normal | 4/4 | seis-razones, mismo-lado, giro-y-opuesto |
| reduccion-al-primer-cuadrante | 4/4 | cualquier-giro, siete-relaciones |
| circunferencia-trigonometrica | 4/5 | seis-lineas, dos-arcos, numero-sin-tope |
| identidades-fundamentales | 4/4 | tres-triangulos, dos-miembros |
| arcos-compuestos | 4/4 | suma-diferencia, tangente-fina, ondas-libres |
| arcos-multiples | 3/4 | doble-y-mitad, punto-a-punto, tres-candidatos |
| transformaciones-trigonometricas | 3/4 | rombo-entero, cadena-larga, muchos-dobles |
| funciones-trigonometricas | 4/5 | onda-completa, cuatro-funciones, suma-de-ondas |
| funciones-trigonometricas-inversas | 4/5 | cuatro-ramas, cancela-o-no, tres-reflejos |
| ecuaciones-trigonometricas | 5/5 | tres-funciones, franja-libre, factor-fuera |
| triangulos-oblicuangulos | 5/5 | cosenos-libre, compas-libre, viaje-libre |
| areas-y-lineas-notables | 4/5 | lados-y-angulo, heron-sin-cierre, bisectriz-o-mediana |
| conicas | 5/5 | foco-y-directriz, cuerda-libre, recta-y-parabola |
| coordenadas-polares-y-complejos | 5/5 | radio-negativo, cuatro-cuadrantes, producto-cociente |

**Qué se arrastra:** lo que el fenómeno pide.
- La punta del rayo o el extremo del arco, con `anguloDe` y `cerca`, para que un giro de 700° siga siendo de 700°.
- El borde del sector, el vértice del triángulo, el punto P(x, y) y el punto de la curva.
- La cresta y el fin de la llave del periodo, y la recta y = k por su extremo.
- El foco, el lápiz de la elipse y la punta del vector z.

Los − y + siguen en todas.

**Las 6 ideas sin arrastre, todas por la misma razón:** su control es una opción discreta, una lista sin nada continuo que agarrar.
- circunferencia-trigonometrica, idea 5: cuadrante y línea.
- arcos-multiples, «Bajar la potencia»: qué función.
- transformaciones-trigonometricas, «Un producto, dos ondas»: m es una frecuencia entera.
- funciones-trigonometricas, «Copas fuera de la franja»: lista de funciones.
- funciones-trigonometricas-inversas, idea 5: k salta el hueco −1 < k < 1.
- areas-y-lineas-notables, «Tres radios»: qué triángulo y qué radio.

Sus mesas del laboratorio sí tienen manija donde se puede. La mesa `suma-de-ondas` no tiene: m y n son enteros.

**Cambios de contenido que pidió el arrastre** (los números siguen saliendo del código):
- recta-en-el-plano, idea 3: A y B bajan a y = −3, y C va de 0 a 3.
- recta-en-el-plano, idea 6: m₂ empieza en 2.
- triangulos-oblicuangulos, idea 3: el paso de A pasa de 20 a 10.
- areas-y-lineas-notables:
  - A va de 25 a 150, de 25 en 25 (antes, de 25 a 165 de 20 en 20, fuera de la grilla: ver pedido 1);
  - θ va de 30 a 150, de 15 en 15.

  La predicción de 30° contra 150° sigue reservada.

## 2. Laboratorio: 55 mesas (2 o 3 por unidad)

Cada unidad trae al menos una mesa más rica que sus juegos. Ejemplos:
- `dos-giros`: compara dos giros a la vez.
- `numero-sin-tope`: t de −12 a 12 en espiral.
- `heron-sin-cierre`: lados que no cierran, con la lectura «no hay triángulo».
- `radio-negativo`: r cruza el polo.
- `cuerda-libre`: con c = a la elipse se aplasta en el segmento.
- `rodea`: una rueda alrededor de otra, el caso que la idea solo pregunta.
- `siete-relaciones`: las siete reducciones con su co-razón y su signo, calculados.

Ninguna mesa es copia de un juego. Las lecturas dicen los valores y la conclusión, para que un caso guardado se entienda solo («coterminales, a 2 vueltas», «tangente: k = −m²», «no hay triángulo»).

## 3. Llaves, separadores y tipografía

- **Llaves:** 85 líneas con llave en los 19 archivos (contadas con grep; alguna línea lleva dos), en las reglas y en algunos pasos de «Mira». Las notas tienen 3 palabras o menos: «vueltas enteras», «cuántos radios», «solo B cuenta», «nunca cero», «una sola onda».
- **Separadores:** 113 líneas nuevas con la parte suelta (contadas en el diff); pasaron de `' · '`, `', '` o `'; '` a `'   ·   '`.
  - En la unidad modelo se vio que el separador dentro de un string más largo no parte la línea; el brief lo advirtió.
- **Exponentes:** van con `{ sup }` (sen² x, sen⁻¹, cos² θ).
- **Reglas que se partían a mitad de expresión, corregidas:** seno y coseno de la suma, a sen x + b cos x, la forma cis, De Moivre, los tres radios, Stewart y el periodo.
- **Pieza nueva de color:** c-f (morado) para el segundo objeto que se compara en el laboratorio (θ₂, k, D). Está anotado en el encabezado de cada unidad que lo usa.
- **Hallazgo 9:** casi todas las ideas usan la misma figura en «Juega» y «Mira». Donde no, hay un comentario con la razón:
  - el radián: «Mira» cuenta radios en r = 1;
  - la rueda: «Mira» rodea la moneda reservada;
  - elevación contra depresión;
  - la idea 5 de oblicuángulos: rosa contra viaje.

## 4. Piezas tocadas

Solo se agregaron exports, con prueba; lo que dibujan no cambió. Commit `3cc065b`.
- **`nucleo/kit/piezas/trig-plano.js`:**
  - `geometria(d)` trae además `xDe` y `yDe` (inversas);
  - funciones nuevas `enPx(d, x, y)`, `delPx(d, pt)` y `anguloDe(d, pt, { cx, cy, cerca })`;
  - prueba nueva en `trig-plano.test.js`.
- **`nucleo/kit/piezas/trig-onda.js`:** `geometria(d)` trae `xDe` y `yDe`; prueba nueva en `trig-onda.test.js`.
- **Piezas comunes (`triangulo`, `ejes`, `recta`):** no se tocaron. Su escala se invierte dentro de cada archivo de teoría, con una función lineal.

## 5. Pedidos al molde, con el caso que los pide

1. **`Kit.respuesta.ajustar` redondea al paso contado desde 0, no desde `min`.** Lo encontraron tres subagentes por separado.
   - Con un control de min 25 y paso 20, − y + no recorren 25, 45, 65…
   - El validador solo lo descubre si el control trae manija.
   - Casos: recta-en-el-plano idea 3 (min 1, paso 3), triangulos-oblicuangulos idea 3 (min 30, paso 20) y areas-y-lineas-notables (A de 25 a 165, paso 20).
   - Se corrigieron los controles. Una revisión de los 19 archivos confirma que ningún control de trigonometría queda fuera de su grilla.

   Pido que el ajuste cuente desde `min`, o que el validador avise siempre.
2. **Desborde horizontal del lector a 360 px** (`app/estilos.css`, no se tocó).
   - El `span.lector` de cada chip de idea tiene posición absoluta y se escapa del carrusel `.te-ideas`, que tiene `overflow-x:auto`.
   - El documento mide 692 px en vez de 360, en las ideas y en la ficha de cualquier unidad.
   - Arreglo probable: `.te-ideas{position:relative}`, o `.te-chip{position:relative}`.
3. **La pieza `triangulo` se reescala con los puntos**, y bajo el dedo la figura se mueve.
   - En razones agudas se resolvió con un punto invisible que fija la caja.
   - Pido una `ventana` opcional, como la de `trig-plano`.
4. **Partes que no se puedan partir** (nowrap) en `nucleo/ecuacion.js`. Chromium parte junto a una llave aunque haya espacios duros; hoy se mete toda la expresión dentro de la llave.
5. **La raya de la raíz tacha el numerador** cuando la raíz lleva una fracción adentro: cos(A/2) = √(p(p − a)/(bc)), en `nucleo/ecuacion.js`.
6. **Laboratorio:** hoy no hay forma de avisar el cambio de escala cuando una opción cambia la ventana (`seis-lineas`).
7. **Gesto para opciones discretas:** hoy las mesas de solo opciones (`suma-de-ondas`) quedan sin manija. Sería tocar la opción sobre la figura.

## 6. Lo no verificado

- **Celular real, toque real, lector de pantalla y alumnos:** en Playwright solo se arrastró con mouse, a 360 × 780.
- **Tema oscuro en esta ronda:** no se revisó.
- **El script de recorrido:** arrastra siempre (+40, −30). En manijas angulares con paso grande (15° a 30°), ese empujón es casi radial y no cambia el valor, y el script dice «¡NO CAMBIÓ!». Los subagentes lo repitieron con otras direcciones (copias en el scratchpad) y todas las manijas cambian la lectura.
- **Las reglas dentro de cada idea:** se miraron sobre todo en la ficha (288 px de tarjeta) y en capturas de muestra.
- **Rótulos que todavía se tapan:**
  - funciones-trigonometricas: la manija tapa en parte el rótulo de A (idea 2) y el de «sen x = …» (idea 1); la lectura dice el valor;
  - ecuaciones-trigonometricas: «y = √3/2» queda bajo el botón de la lupa;
  - en la mesa `viaje-libre`, con un tramo muy corto, los rótulos alrededor de C se amontonan;
  - en la ficha de áreas, «S =» se separa de la raíz de Herón y Stewart se parte en dos líneas.
- **Las miniaturas de los casos guardados:** se miraron en las capturas de página completa, no una por una.

## Reporte de diseño

```
Ficha de tarea: el postulante de 3.º a 5.º, en un celular de 360 px de gama baja, agarra la figura (rayo, vértice, punto, cresta) y ve responder la variable que depende de ella; en el laboratorio compara hasta 4 casos guardados.
Sistema: existente (kit, tokens de variable, molde §4b). Decisiones nuevas, escritas en cada encabezado y aquí: c-f morado para el segundo objeto comparado en el laboratorio; la manija del segundo rayo va más corta (0,6–0,7 del radio) para que dos puntas coterminales no se tapen; los giros de varias vueltas se arrastran sin saltar al coterminal (cerca = valor actual).
Carácter: acogedora, viva y precisa · firma: el hilo de color, ahora también en la manija (el anillo lleva el color de la variable que mueve).
Movimientos: ninguno nuevo. El arrastre sigue al dedo uno a uno (lector) y no hay animación propia en las unidades.
Verificación: validador con 60 semillas en verde en las 19 unidades; recorrido en Playwright a 360 × 780 con arrastre real del mouse en cada idea con manija y en cada mesa (2 casos guardados por mesa), sin errores de página; fichas revisadas a 360 px; npm test completo en verde (8491 de 8491) antes del último push.
No verificado: toque real, tema oscuro de esta ronda, lector de pantalla, alumnos.
Hipótesis: agarrar la variable del fenómeno, en vez de mover una barra rotulada, debería bajar el tiempo de «Juega» y subir los aciertos de la predicción. Se comprueba con los eventos «teoria» (ms y correcta) antes y después de la ronda 2.
Conflictos: ninguno con CLAUDE.md. Tres arreglos piden tocar el molde (pedidos 1, 2 y 4), y no se hicieron.
```
