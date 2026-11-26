# Redacción: fisica.gravitacion

26 nov 2026. Pasada aparte sobre una unidad ya cerrada (`calidad: 2`), con `docs/metodo/unidad/redaccion-delegada.md`
y el criterio de `escribidor-escribano`. Solo texto: ningún número, respuesta, distractor, dato ni dibujo cambió. La
marca `calidad: 2` se queda y el validador sigue en cero.

Archivos: `contenido/teoria/fisica/gravitacion.js` y la práctica `plantillas/fis-gravitacion/generador.js`, con su
`papel.json` regenerado por `herramientas/papel-generador.js` (no se edita a mano).

## Qué cambió, por tipo de problema

**1. Las explicaciones de cada alternativa eran telegrama** (unas 300 entre la teoría y la práctica). El molde era
«Bien + infinitivo; + error.» sin verbo conjugado en la primera parte. En la idea 2 era peor: un rescate genérico por
tipo («Bien ubicas el punto;») pegado a una causa en tercera persona que una expresión regular pasaba a segunda. Ahora
cada causa dice qué se hizo bien, qué faltó y, cuando cabe, por qué, en una oración completa que sigue empezando por
«Bien » (lo exigen las pruebas) y cierra con «Así sale X.» en las seis ideas (antes alternaban «Sale» y «Así sale»).

> Antes: «Bien cambiar las masas; dividiste solo una vez por distancia. Así sale 480 N.»
> Después: «Bien cambiadas las masas, pero dividiste una sola vez entre el factor de separación, y ese factor va al
> cuadrado. Así sale 480 N.»

> Antes (idea 2): «Bien ubicas el punto; usas la distancia sin elevarla al cuadrado. Sale ≈ 1,222 × 10⁸ N/kg.»
> Después: «Bien ubicado el punto, pero usaste la distancia sin elevarla al cuadrado. Así sale ≈ 1,222 × 10⁸ N/kg.»

**2. Las explicaciones de los ejemplos de nivel 3 eran etiquetas** («6 400: usa la distancia sin elevarla al
cuadrado.», «B omite raíz.», «24 es lineal.»). Ahora todas tienen la forma «X sale si…», en segunda persona y presente
(«24 sale si usas una relación lineal.»). En energía, el texto salía de recortar la causa larga con una expresión
regular; ahora hay un mapa propio de causas cortas, como en las otras ideas.

**3. Pasos de «Así se resuelve» que no decían el porqué o saltaban.** Se dice qué se despeja y de dónde sale cada
cuenta.

> Antes: «Despejamos la separación; el signo negativo cancela el de la energía dada.»
> Después: «Despejamos r de la energía potencial; el signo menos de la fórmula cancela el de la energía dada.»

> Antes: «Ambas órbitas comparten GM. Igualamos los productos de rapidez cuadrada por radio.»
> Después: «Las dos órbitas tienen el mismo GM, así que el cuadrado de la rapidez por el radio es igual en ambas;
> despejamos el segundo radio.»

**4. Reglas, «Vale si», «Lee» y Mira en ráfaga o en jerga.** Las seis condiciones ahora continúan «Vale si» (antes
empezaban con un sustantivo: «Vale si Cuerpos pequeños…», «Vale si Fuera de una fuente esférica con masa distribuida
radialmente…»). Salen «distribuida radialmente», «apreciablemente», «separación central», «salida radial exterior»,
«ensayos didácticos», «cota», «Peso: masa por campo».

> Regla 2, antes: «El campo depende de la fuente y del lugar. Peso: masa por campo. Dos campos se suman con sus
> sentidos. Una balanza mide cuánto la aprietan, no el peso.»
> Después: «El campo depende del planeta y de la distancia a su centro, no de la sonda, y el peso es la masa por ese
> campo. Los campos de dos fuentes se suman con sus sentidos. Una balanza mide cuánto la aprietan, no el peso.»

> Lee 2.3, antes: «El radio R va del centro a la superficie. La altura h empieza en la superficie. La distancia r
> empieza en el centro. El producto GM = G·M reúne la constante y la masa de la fuente.»
> Después: «El radio R va del centro a la superficie, y la altura h, de la superficie hacia arriba; la distancia r se
> mide desde el centro. GM es la constante G por la masa del planeta, que los problemas suelen dar como un solo dato.»

**5. Enunciados y leyendas.** «La masa fuente pasa a 2 veces, la masa atraída a 1,5 veces…» pasa a «La masa fuente
pasa a ser 2 veces la original; la de la sonda, 1,5 veces la suya…»; «separaciones centrales», «escape superficial» y
«energía mecánica circular» se dicen en palabras; «producto de G por la masa fuente» pasa a «G por la masa del
planeta». Las misiones cumplidas confirman con el hecho («Coincide: con esa masa, el peso de la sonda es 250 N.»).

**6. Práctica.** Las 83 explicaciones, con el mismo arreglo del punto 1 (tope de 30 palabras de su prueba). Tres
enunciados dicen «en línea recta hacia afuera» en vez de «radialmente», y el de áreas dice «la línea que va del foco a
la sonda» en vez de «el radio desde el foco». Los dos datos de modelo dejan «fuente esférica fija dominante; salida
radial exterior hacia afuera». El papel se regeneró.

No cambiaron: las lecturas en vivo del juego de órbitas (tope 12; cualquier versión más clara lo pasaba y las pruebas
buscan «g mayor que» y «g menor que»), los Datos con fórmulas (son leyendas de fórmula) y los Datos que las pruebas
leen con regex («fuente dominante fija», «semieje mayor… separación instantánea», «sin aire»).

## Para el auditor

1. **Idea 1, tipo «mutua»: dos causas decían lo contrario de la cuenta.** «por-masas» (F₀·m_B/m_A, que baja la
   fuerza porque m_B es la sonda) decía «aumentaste una de las fuerzas mutuas», e «inversa-masas» (F₀·m_A/m_B, que la
   sube) decía «redujiste». Ahora dicen qué se hizo («multiplicaste la fuerza por la masa de B entre la de A»), sin
   «aumentar» ni «reducir». Los números no cambiaron.
2. **Idea 1, ejemplo 14 (punto de fuerza nula):** la alternativa «lineal» (6 400) se explicaba como «usa la distancia
   sin elevarla al cuadrado», pero en ese tipo el error es no sacar la raíz de la razón de masas. Ahora en ese tipo
   dice «no sacas la raíz».
3. **Idea 5, Datos de la rapidez en los extremos:** seguía diciendo «p indica el punto más cercano y a el más lejano»
   después de que la auditoría cambió los subíndices a «cerca» y «lejos». Ahora: «Los subíndices cerca y lejos marcan
   los extremos de la órbita.» (se mantiene «Solo allí… perpendicular», que la prueba lee).
4. **Idea 3, «sin-toneladas»:** la causa decía «Bien convertir kilómetros», pero ese tipo no convierte kilómetros.
   Ahora: «Bien planteada la cuenta, pero dejaste la masa en toneladas…».
5. **Práctica, Kepler «SIN-RAIZ»** (T₁·(a₂/a₁)³): decía «faltó sacar su raíz»; ahora «su raíz cuadrada», que es la
   que falta.
6. Quedan con jerga leve, porque son Datos de 22 palabras como tope o los leen las pruebas: el modelo de Kepler
   («misma fuente dominante fija y masas orbitantes despreciables») y la línea de condiciones de escape (ahora «Sale
   desde fuera, en línea recta hacia afuera…»). En la práctica siguen «E_PG», «r_A» y otros subíndices en texto plano
   (B4 de la auditoría: es de la app).

## Comprobación

- `contenido/teoria/fisica/gravitacion*.test.js` (10 archivos, con el validador en `calidad: 2` y 400 semillas): 57
  en verde.
- `plantillas/fis-gravitacion/*.test.js` (generador y oráculo): 30 en verde. `papel-generador.js --revisar`: al día.
- `contenido/teoria/teoria.test.js`: 164 en verde, después de `npm run catalogo`. Antes había 1 falla: el glosario de
  física estaba desactualizado, porque cambié la definición de «masa de prueba». `npm run catalogo` reescribió
  `app/datos/glosario/fisica.json` y `app/datos/catalogo.json`. En este último, el cambio de 52 a 53 términos viene de
  Impulso, no de esta unidad.
- `ecuaciones-ancho.js fisica.gravitacion`: 16 pantallas sin hallazgos. Mira de la idea 1 no abrió en ese barrido y
  se repitió aparte con `--momentos=mira`: 15 pantallas, todo cabe.
