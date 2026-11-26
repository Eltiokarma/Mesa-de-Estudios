# Errores propuestos para la práctica de Impulso y choques

Este registro corresponde a `plantillas/fis-impulso-choques/generador.js`, función `construir`. Enumera sus **76 códigos distintos**: 74 empiezan con `IC-` y dos son `U4-IC` y `U1-IC`. Describe operaciones que producen alternativas, no resultados de una investigación con estudiantes.

**Respaldo de todas las filas: hipótesis de diseño propio, sin soporte empírico específico.** La fuente es el diseño determinístico de esta plantilla y este documento. El generador marca cada alternativa con `respaldo: 'hipotesis'` y `fuente: 'docs/etapa9/errores-fisica.md'`. Ninguna fila afirma que el error sea frecuente ni que seleccionar su alternativa demuestre una concepción del alumno. Una misma respuesta puede tener causas distintas; la hipótesis sirve para ofrecer una reparación concreta y deberá contrastarse con observación posterior.

Los códigos `U4-IC` y `U1-IC` se relacionan, por su prefijo, con las familias generales de errores de unidades `U4` y `U1`. Aquí siguen siendo **hipótesis propias**, sin trasladar automáticamente evidencia de otra unidad ni convertir esa relación de nombres en respaldo empírico.

## Cómo reproducir los valores

Se parte del objeto `_datos` devuelto por `generar`. Su campo `tipo` selecciona una de las 18 familias. En las tablas, los nombres sin prefijo son los campos de ese objeto: por ejemplo, `m1` significa `_datos.m1`. `R` es el resultado correcto de esa familia, definido en la tabla siguiente; no se toma de una alternativa. Todas las operaciones usan los números originales, antes de formatear.

Las componentes horizontales positivas apuntan a la derecha; las negativas, a la izquierda. Las posiciones comparten un origen. `u1` y `u2` son las componentes iniciales de A y B; `w1` y `w2`, las finales cuando están dadas. `u` y `w` son las componentes inicial y final de un solo cuerpo. `m`, `m1`, `m2`, `mc` y `ml` son masas; las dos últimas corresponden al carrito vacío y su carga. `p` es la componente de cantidad de movimiento del conjunto; `F`, `F1` y `F2` son componentes de fuerza neta. `dt`, `t1`, `t2` y `t` son duraciones. `x1`, `x2` y `posiciones` son posiciones con signo. `h0` es la distancia vertical de caída del centro de la pelota y `h1` la de ascenso posterior desde el mismo nivel. `e` es el coeficiente de restitución. `mu` es el coeficiente de rozamiento cinético.

**Dos significados locales que no deben mezclarse:** en `conversiones`, el campo `g` es el número de gramos de la esfera; en `adhesion-rampa` y `rebote-tiempo`, `g` es la aceleración gravitatoria. En `retroceso`, el campo `V` es la componente inicial común de ambos carritos; la velocidad común calculada tras una adhesión se llama `Vc` en este documento. El campo `I` de `balance-externo` es el impulso externo dado; `It` representa el impulso calculado de los dos tramos de una gráfica.

Abreviaturas de cálculo:

- `abs(x)` es el valor absoluto; `sqrt(x)`, la raíz cuadrada no negativa. `x²` significa `x*x`. Las matrices se indexan desde cero, como en JavaScript.
- `M = m1 + m2`; `P = m1*u1 + m2*u2`; `Vc = P/M`.
- `E_Ci = (m1*u1² + m2*u2²)/2`; `E_Cf = M*Vc²/2`. Son las energías cinéticas inicial y final de una adhesión.
- `A = ((m1-m2)*u1 + 2*m2*u2)/M`; `B = (2*m1*u1 + (m2-m1)*u2)/M`. Son las componentes finales de A y B en un choque frontal elástico aislado. Estas expresiones permiten reproducir los resultados del motor sin llamarlo.
- `S = m1*x1 + m2*x2`; `x0 = S/M`.
- `M3 = masas[0]+masas[1]+masas[2]`; `S3 = masas[0]*posiciones[0]+masas[1]*posiciones[1]+masas[2]*posiciones[2]`.
- `T(z) = abs(z)` si `pide === 'modulo'`; en cualquier otro caso, `T(z) = z`.
- `mc`, `ml`, `p`, `unidadSalida`, `pide`, `masas` y los demás nombres de entrada conservan exactamente el significado del objeto `_datos`; no se redondean antes de operar.

| Familia (`_datos.tipo`) | Resultado correcto `R` y auxiliares locales | Unidad mostrada |
|---|---|---|
| `componente` | `R = T(m*u)` | kg·m/s |
| `conversiones` | `mg = g/1000`; `us = kmh/3.6`; `R = T(mg*us)` | kg·m/s |
| `despeje-carga` | `k = 3.6` si `unidadSalida === 'km/h'`, o `k = 1` si es `'m/s'`; `R = p/(mc+ml)*k` | `unidadSalida` |
| `fuerza-constante` | `R = F*dt` | N·s |
| `rebote-media` | `Ir = m*(w-u)`; `R = Ir/dt` | N |
| `tramos-velocidad` | `It = F1*t1/2 + F2*t2`; `R = u + It/m` | m/s |
| `adhesion` | `R = Vc` | m/s |
| `retroceso` | `R = (M*V-m2*w2)/m1` | m/s |
| `balance-externo` | `Pf = P+I`; `R = (Pf-m2*w2)/m1` | m/s |
| `elastico-frontal` | `R = A` si `pide === 'v1'`; `R = B` si `pide === 'v2'` | m/s |
| `energia-transformada` | `R = E_Ci-E_Cf` | J |
| `adhesion-rampa` | `a = g` si `pide === 'altura'`; `a = mu*g` si `pide === 'distancia'`; `R = Vc²/(2*a)` | m |
| `rapidez-relativa` | `R = (w2-w1)/(u1-u2)` | Sin unidad |
| `alturas` | `R = sqrt(h1/h0)` | Sin unidad |
| `rebote-tiempo` | `L = sqrt(2*g*h0)`; `R = 2*e*L/g` | s |
| `dos-cuerpos` | `R = S/M` | m |
| `tres-cuerpos` | `R = S3/M3` | m |
| `evolucion` | `vc = P/M`; `R = x0+vc*t` | m |

## Tabla completa de hipótesis y operaciones

La columna «Valor candidato» reconstruye el número que recibe `err(...)`. La unidad que se imprime es siempre la de la pregunta, incluso cuando la operación equivocada tenga dimensiones incompatibles: esa incompatibilidad es parte de la hipótesis, no una igualdad física válida. `R` y los auxiliares corresponden exclusivamente a la familia de la misma fila.

| Familia | Código | Valor candidato | Hipótesis de operación equivocada |
|---|---|---|---|
| `componente` | `IC-COMP-1` | `-R` | Invierte el signo pedido; si se solicita módulo, entrega un número negativo. |
| `componente` | `IC-COMP-2` | `T(u)` | Omite el factor de masa y entrega la velocidad como cantidad de movimiento. |
| `componente` | `IC-COMP-3` | `T(u/m)` | Divide entre la masa en vez de multiplicar por ella. |
| `componente` | `IC-COMP-4` | `T(m*u²)` | Eleva la velocidad al cuadrado al construir la cantidad de movimiento. |
| `conversiones` | `U4-IC` | `T(g*us)` | Convierte la velocidad, pero usa el número de gramos como si fueran kilogramos. |
| `conversiones` | `U1-IC` | `T(mg*kmh)` | Convierte la masa, pero usa el número de km/h como si fueran m/s. |
| `conversiones` | `IC-CONV-1` | `-R` | Convierte las unidades y después invierte el signo del resultado solicitado. |
| `conversiones` | `IC-CONV-2` | `T(us)` | Convierte la velocidad al SI, pero omite multiplicarla por la masa convertida. |
| `despeje-carga` | `IC-CARGA-1` | `p/mc*k` | Divide la cantidad de movimiento del conjunto solo entre la masa del carrito vacío. |
| `despeje-carga` | `IC-CARGA-2` | `p/ml*k` | Cuenta únicamente la masa de la carga al despejar la velocidad. |
| `despeje-carga` | `IC-CARGA-3` | `p*(mc+ml)*k` | Multiplica por la masa total cuando debe dividir entre ella. |
| `despeje-carga` | `IC-CARGA-4` | `-R` | Invierte el sentido después de usar correctamente la masa conjunta. |
| `fuerza-constante` | `IC-FUERZA-1` | `F` | Omite la duración y presenta el número de la fuerza como impulso. |
| `fuerza-constante` | `IC-FUERZA-2` | `F/dt` | Divide fuerza entre duración en lugar de multiplicarlas. |
| `fuerza-constante` | `IC-FUERZA-3` | `-R` | Cambia el signo del impulso respecto del de la fuerza constante. |
| `fuerza-constante` | `IC-FUERZA-4` | `R/2` | Usa el área de un triángulo para un pulso de fuerza constante rectangular. |
| `rebote-media` | `IC-REBOTE-1` | `m*(abs(w)-abs(u))/dt` | Resta las rapideces de salida y llegada, perdiendo sus sentidos opuestos. |
| `rebote-media` | `IC-REBOTE-2` | `-m*u/dt` | Cuenta el impulso de detención, pero omite la salida de la pelota en sentido contrario. |
| `rebote-media` | `IC-REBOTE-3` | `Ir` | Entrega el impulso como fuerza media sin dividir entre el tiempo de contacto. |
| `rebote-media` | `IC-REBOTE-4` | `-R` | Conserva la magnitud calculada y asigna a la fuerza el sentido contrario. |
| `rebote-media` | `IC-REBOTE-5` | `m*(w-u)/dt²` | Divide el impulso dos veces entre la duración del contacto. |
| `tramos-velocidad` | `IC-TRAMOS-1` | `u+(F1*t1+F2*t2)/m` | Trata el primer tramo creciente como un rectángulo de altura final. |
| `tramos-velocidad` | `IC-TRAMOS-2` | `u+(F1*t1/2-F2*t2)/m` | Resta la componente negativa del segundo impulso y así la convierte en aporte positivo. |
| `tramos-velocidad` | `IC-TRAMOS-3` | `It/m` | Confunde el cambio de velocidad con la velocidad final y omite la componente inicial. |
| `tramos-velocidad` | `IC-TRAMOS-4` | `u+It` | Suma el impulso directamente a la velocidad inicial, sin dividirlo entre la masa. |
| `adhesion` | `IC-ADH-1` | `(u1+u2)/2` | Promedia las velocidades con pesos iguales aunque las masas puedan diferir. |
| `adhesion` | `IC-ADH-2` | `P/m1` | Divide la cantidad de movimiento total solo entre la masa de A. |
| `adhesion` | `IC-ADH-3` | `m1*u1/M` | Omite la cantidad de movimiento inicial de B en el numerador. |
| `adhesion` | `IC-ADH-4` | `(m1*abs(u1)+m2*abs(u2))/M` | Sustituye las componentes iniciales por sus rapideces y suma sin sus signos. |
| `adhesion` | `IC-ADH-5` | `-R` | Invierte el signo de la velocidad conjunta después del balance. |
| `retroceso` | `IC-RET-1` | `-m2*w2/m1` | Supone que la cantidad de movimiento inicial del sistema era cero. |
| `retroceso` | `IC-RET-2` | `(M*V+m2*w2)/m1` | Suma el aporte final de B cuando debe restarlo al despejar el de A. |
| `retroceso` | `IC-RET-3` | `(M*V-m2*w2)/M` | Calcula la cantidad de movimiento final de A, pero la divide entre la masa de ambos. |
| `retroceso` | `IC-RET-4` | `-R` | Cambia el signo final sin que lo justifique el balance del sistema. |
| `balance-externo` | `IC-EXT-1` | `(P-m2*w2)/m1` | Conserva la cantidad de movimiento total pese al impulso externo dado. |
| `balance-externo` | `IC-EXT-2` | `(P-I-m2*w2)/m1` | Resta la componente de impulso externo en lugar de sumarla con su signo. |
| `balance-externo` | `IC-EXT-3` | `(Pf+m2*w2)/m1` | Suma el aporte final de B al despejar la velocidad final de A. |
| `balance-externo` | `IC-EXT-4` | `(Pf-m2*w2)/M` | Divide la cantidad de movimiento final de A entre la masa total del sistema. |
| `elastico-frontal` | `IC-ELAS-1` | `Vc` | Resuelve una adhesión y entrega la velocidad común de un choque perfectamente inelástico. |
| `elastico-frontal` | `IC-ELAS-2` | `u2` si `pide === 'v1'`; `u1` si `pide === 'v2'` | Aplica el intercambio directo de velocidades a un caso de masas distintas. |
| `elastico-frontal` | `IC-ELAS-3` | `B` si `pide === 'v1'`; `A` si `pide === 'v2'` | Resuelve ambas componentes, pero entrega la del carrito que no se pidió. |
| `elastico-frontal` | `IC-ELAS-4` | `-R` | Invierte el sentido de la componente final calculada. |
| `energia-transformada` | `IC-ENER-1` | `E_Ci` | Supone que toda la energía cinética inicial se transforma en el impacto. |
| `energia-transformada` | `IC-ENER-2` | `E_Cf` | Confunde la energía cinética que queda después con la que se transformó. |
| `energia-transformada` | `IC-ENER-3` | `2*R` | Omite el factor un medio en las energías cinéticas inicial y final. |
| `energia-transformada` | `IC-ENER-4` | `R/2` | Aplica otra vez el factor un medio a una diferencia que ya lo incluye. |
| `adhesion-rampa` | `IC-RAMPA-1` | `E_Ci/(M*a)` | Usa toda la energía cinética anterior al choque para el recorrido posterior. |
| `adhesion-rampa` | `IC-RAMPA-2` | `u1²/(2*a)` | Usa la velocidad inicial de A para la subida o el frenado del conjunto unido. |
| `adhesion-rampa` | `IC-RAMPA-3` | `2*R` | Omite el factor un medio de la energía cinética posterior al choque. |
| `adhesion-rampa` | `IC-RAMPA-4` | `R/2` | Divide otra vez entre dos después de incluir el factor un medio. |
| `adhesion-rampa` | `IC-RAMPA-5` | `Vc/(2*a)` | Usa la velocidad conjunta sin elevarla al cuadrado. |
| `rapidez-relativa` | `IC-REL-1` | `1/R` | Invierte la razón y divide acercamiento entre separación. |
| `rapidez-relativa` | `IC-REL-2` | `-R` | Invierte el orden de una sola de las diferencias de componentes. |
| `rapidez-relativa` | `IC-REL-3` | `w2/u1` | Compara una velocidad final de B con una inicial de A, sin formar rapideces relativas. |
| `rapidez-relativa` | `IC-REL-4` | `(w1+w2)/(u1+u2)` | Suma las componentes de cada instante en vez de restarlas. |
| `rapidez-relativa` | `IC-REL-5` | `R²` | Eleva al cuadrado la razón de rapideces que ya representa el coeficiente. |
| `alturas` | `IC-ALT-1` | `h1/h0` | Entrega la razón de alturas sin extraer su raíz cuadrada. |
| `alturas` | `IC-ALT-2` | `sqrt(h0/h1)` | Extrae la raíz, pero invierte la razón de alturas. |
| `alturas` | `IC-ALT-3` | `1-R` | Entrega el complemento del coeficiente en vez del coeficiente. |
| `alturas` | `IC-ALT-4` | `1-h1/h0` | Entrega la fracción de energía transformada en vez de la razón de rapideces. |
| `rebote-tiempo` | `IC-VUELO-1` | `R/2` | Cuenta solamente la subida y omite la bajada hasta el mismo nivel. |
| `rebote-tiempo` | `IC-VUELO-2` | `2*L/g` | Usa la rapidez de llegada al piso sin reducirla mediante el coeficiente de restitución. |
| `rebote-tiempo` | `IC-VUELO-3` | `2*e²*L/g` | Multiplica dos veces la rapidez por el coeficiente aunque solo hay un rebote previo. |
| `rebote-tiempo` | `IC-VUELO-4` | `2*L/(e*g)` | Divide la rapidez de llegada entre el coeficiente en lugar de multiplicarla por él. |
| `dos-cuerpos` | `IC-CM2-1` | `(x1+x2)/2` | Promedia las posiciones sin ponderarlas por sus masas. |
| `dos-cuerpos` | `IC-CM2-2` | `S/2` | Suma los productos masa por posición, pero divide entre el número de cuerpos. |
| `dos-cuerpos` | `IC-CM2-3` | `(m1*abs(x1)+m2*abs(x2))/M` | Quita los signos de las posiciones medidas desde el origen común. |
| `dos-cuerpos` | `IC-CM2-4` | `(m2*x1+m1*x2)/M` | Intercambia las masas asociadas a las dos posiciones. |
| `tres-cuerpos` | `IC-CM3-1` | `(posiciones[0]+posiciones[1]+posiciones[2])/3` | Hace una media simple de las tres posiciones. |
| `tres-cuerpos` | `IC-CM3-2` | `S3/3` | Divide la suma ponderada entre tres en lugar de dividirla entre la masa total. |
| `tres-cuerpos` | `IC-CM3-3` | `(masas[0]*posiciones[0]+masas[1]*posiciones[1])/(masas[0]+masas[1])` | Excluye por completo al tercer cuerpo del sistema pedido. |
| `tres-cuerpos` | `IC-CM3-4` | `(masas[0]*abs(posiciones[0])+masas[1]*abs(posiciones[1])+masas[2]*abs(posiciones[2]))/M3` | Reemplaza cada posición por su valor absoluto antes de ponderarla. |
| `evolucion` | `IC-EVOL-1` | `x0` | Interpreta fuerza externa neta cero como centro de masa en reposo. |
| `evolucion` | `IC-EVOL-2` | `vc*t` | Entrega el desplazamiento sin sumar la posición inicial. |
| `evolucion` | `IC-EVOL-3` | `(x1+x2)/2+(u1+u2)*t/2` | Promedia posiciones y velocidades sin ponderarlas por las masas. |
| `evolucion` | `IC-EVOL-4` | `x0-vc*t` | Resta el desplazamiento con signo en lugar de sumarlo a la posición inicial. |

## Qué candidatos se excluyen

La tabla registra el catálogo completo de operaciones de `construir`, **no promete que todos los códigos aparezcan en cada caso ni en cada semilla**. El generador baraja los candidatos y aplica los filtros siguientes antes de armar las alternativas:

1. Descarta casos cuyo resultado correcto no sea finito, no pueda representarse con tres decimales dentro de la tolerancia numérica usada por `exacto`, o tenga magnitud menor que `1e-8`. También verifica esa precisión en las entradas numéricas y en los valores intermedios específicos que comprueba el código. La comprobación computacional admite el error binario de punto flotante; no convierte una aproximación decimal física en una igualdad exacta.
2. Cada distractor debe ser finito y pasar `exacto`. `P.enEscala` exige que la razón `abs(valor)/abs(R)` esté entre `1/20` y `20`, inclusive. Para códigos de unidades reconocidos, incluidos `U4-IC` y `U1-IC`, amplía el intervalo a `1/1000`–`1000`, con el margen binario `1e-9` definido en el núcleo. Esto permite, por ejemplo, el factor 1000 del error de gramos. **Los candidatos cero quedan fuera de escala** porque `R` no es cero. Los cocientes no finitos también se excluyen.
3. Descarta los valores cuyo texto formateado coincide con la correcta o con otro candidato ya aceptado. La comparación se realiza tras `P.formatear(..., 3)` y añadir la unidad. Por ello un error puede desaparecer cuando accidentalmente produce la respuesta correcta o coincide con otra operación. No se reemplaza por un número inventado.
4. Requiere al menos tres distractores válidos. `P.armar` solicita un máximo de cinco alternativas totales y baraja las letras; si solo hay tres distractores, entrega cuatro alternativas totales. Los valores negativos están permitidos como candidatos, pero no suprimen los filtros de escala, precisión y unicidad.
5. Además, `elastico-frontal` descarta masas iguales; `adhesion-rampa` requiere `Vc > 0`; `evolucion` descarta cantidad de movimiento inicial de magnitud menor que `1e-8`. Son restricciones de selección de los casos de esta práctica, no condiciones generales de validez de las leyes físicas.

Para auditar una alternativa, se identifica su código, se localiza la fila de su familia y se evalúa la operación con `_datos`. Después se aplica el mismo formato de tres decimales y la unidad indicada. La letra A–E depende del barajado y no identifica una operación fija. La comparación de códigos de esta tabla con los argumentos de `err(...)` debe dar 76 códigos, sin faltantes ni duplicados.

## Hipótesis adicionales de los dos pares de reserva del curso

Estos ocho códigos pertenecen a `catalogo/pruebas/fisica.json`, pares `fis-33` y `fis-34`, y no se incluyen en los 76 códigos de la plantilla. Todos tienen `respaldo: hipotesis`. Sus valores se calculan en un bloque propio de `catalogo/pruebas/verificar.js` y se contrastan por otro camino en `contenido/teoria/fisica/impulso-y-choques-curso.test.js`.

Para `fis-33`, `m` es la masa en kilogramos, `u` la rapidez de llegada a la derecha, `w` la rapidez de salida a la izquierda y `t` la duración en segundos. La respuesta es `-m*(w+u)/t`.

| Código | Operación equivocada |
| --- | --- |
| IC9-ignora-rebote | `-m*u/t`: cuenta solo la detención y omite la salida opuesta. |
| IC9-omite-sentido-salida | `m*(w-u)/t`: resta rapideces sin el signo de la salida. |
| IC9-resta-invertida | `m*(u+w)/t`: invierte la resta entre los estados final e inicial. |
| IC9-impulso-como-fuerza | `-m*(w+u)`: entrega el número del impulso como fuerza. |

Para `fis-34`, `M=mA+mB`, `x0=(mA*xA+mB*xB)/M` y `vc=(mA*u-mB*w)/M`. A avanza a la derecha con rapidez `u` y B a la izquierda con rapidez `w`. La fuerza externa neta horizontal es nula durante todo el intervalo `t`; la respuesta es `x0+vc*t`.

| Código | Operación equivocada |
| --- | --- |
| IC9-centro-sin-avance | `x0`: omite el desplazamiento posterior del centro. |
| IC9-posicion-promedio-simple | `(xA+xB)/2+vc*t`: da igual peso a las posiciones iniciales. |
| IC9-velocidad-promedio-simple | `x0+(u-w)*t/2`: da igual peso a las velocidades. |
| IC9-velocidades-sin-signo | `x0+(mA*u+mB*w)*t/M`: trata ambos movimientos como si fueran hacia la derecha. |
