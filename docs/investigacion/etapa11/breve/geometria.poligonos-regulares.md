# GE11 · Geometría · Polígonos regulares

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

Regular significa lados y ángulos iguales a la vez.  
El centro permite dividir un polígono convexo regular en triángulos congruentes.  
Se relacionan ángulo central, interior, exterior, radio, lado y apotema.  
Las diagonales se cuentan evitando pares repetidos.  
Lo más difícil es separar propiedades de todo polígono de las que requieren regularidad.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Diagonales trazadas desde varios vértices y ángulo central | UNI | Alta | Aparición 2021-1, Matemática 11 | UNI |
| Ángulo central, apotema y polígonos inscritos | UNI, CEPREUNI | Media/alta | Temario de preparación; no estimada | CEPREUNI, Geometría |
| Polígonos y circunferencias inscritas/circunscritas | UNMSM | Media | Cobertura curricular general, no frecuencia específica | UNMSM, 9 |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| P-REG | Cree que lados iguales bastan para ser regular | Confunde condición necesaria y suficiente | Hipótesis | Diseño propio |
| P-ANG | Confunde ángulo interior, exterior y central | Usa un número sin identificar su vértice | Hipótesis | Diseño propio |
| P-DOB | Cuenta mal las apariciones de una diagonal | No distingue extremos o segmentos | Hipótesis | Diseño propio |
| P-RAD | Confunde radio y apotema | No reconoce la hipotenusa y el cateto del triángulo central | Hipótesis | Diseño propio |

No se halló investigación original específica verificable sobre estos tres distractores en postulantes peruanos.

## 4. Lo que la unidad da por sabido

Ángulos, polígonos convexos, triángulos isósceles, Pitágoras y razones trigonométricas de ángulos agudos. No se requieren funciones inversas.

## 5. Las ideas, en orden

### Idea 1. Repetir una pieza — ¿Qué hace regular a un polígono?

**Aprende:** regularidad exige dos igualdades y permite una partición simétrica.

**Lee / objeto:** marco de espejo formado por varillas iguales. «Las varillas forman lados». «Las uniones forman ángulos». «La igualdad de una característica no decide por sí sola las demás».

**Juega:** coloca varillas de igual longitud hasta cerrar un rombo deformable; valida solo igualdad de lados. No etiqueta aún la figura como regular.

**Predice:** un marco convexo tiene cuatro lados iguales. ¿Qué condición adicional garantiza que sea regular? A) Que todos sus ángulos interiores sean iguales **[correcta]**. B) Ninguna: basta la igualdad de lados [P-REG]. C) Solo que los lados opuestos sean paralelos, propiedad que también tienen rombos no cuadrados [P-REG]. D) Solo que las diagonales se corten en sus puntos medios, sin controlar los ángulos interiores [P-REG].

**Mira:** deforma un rombo y compara sus ángulos con los de un cuadrado.

**La regla:** $n\ge3$ es número de lados. En un polígono convexo regular todos los lados y ángulos interiores son iguales. El ángulo central $\theta=360^\circ/n$; el exterior de giro $\varepsilon=360^\circ/n$; el interior $\alpha=180^\circ-\varepsilon$. La suma interior de cualquier polígono simple de n lados es $(n-2)180^\circ$, derivada de triangulación; la igualdad de cada ángulo exige regularidad o equiangularidad declarada.

**Palabras:** *regular*: repetición igual de lados y ángulos; ejemplos: triángulo equilátero, cuadrado, hexágono regular. *Exterior*: giro al pasar al lado siguiente; ejemplos: giro de un cuadrado, de un pentágono, de un octágono.

**Así se resuelve:** identificar cuál ángulo se da; escribir su relación con n; despejar; exigir n entero al menos tres; verificar el tipo de figura. **Ahora tú:** distinguir → ángulo dado → comparación entre dos polígonos.

### Idea 2. Centro, lado y apotema — ¿Qué triángulo permite medir el polígono?

**Aprende:** la perpendicular del centro al punto medio de un lado crea un triángulo rectángulo.

**Lee / objeto:** tapa regular de una caja con una marca central y una cinta hacia un borde. «El centro es común a los vértices». «Llegar a un vértice y llegar al borde son recorridos diferentes». «El punto medio divide el lado».

**Juega:** une centro y vértices, y marca puntos medios; valida simetría. La medición de la perpendicular no está disponible.

**Predice:** en un polígono regular convexo, ¿cómo se compara la distancia del centro a un vértice con la distancia perpendicular del centro a un lado? A) La primera es mayor **[correcta]**. B) Son iguales porque ambos segmentos salen del centro [P-RAD]. C) La primera es menor, intercambiando radio y apotema [P-RAD]. D) No puede compararse ni conociendo que forman un triángulo rectángulo [P-RAD].

**Mira:** dibuja ambos recorridos y el triángulo rectángulo correspondiente.

**La regla:** $R$ es circunradio, $r$ apotema y $\ell$ lado. La mitad del ángulo central es $\theta/2$, por lo que $\ell=2R\sin(\theta/2)$, $r=R\cos(\theta/2)$, $\ell=2r\tan(\theta/2)$, $R^2=r^2+(\ell/2)^2$. El perímetro $P=n\ell$. Estas relaciones se deducen del triángulo central partido por la perpendicular; las funciones y datos angulares se proporcionan.

**Palabras:** *apotema*: recorrido perpendicular del centro a un lado; ejemplos: hexágono regular, octágono regular, cuadrado. *Inscrito*: cuyos vértices están en una circunferencia; ejemplos: triángulo, cuadrado, hexágono regular inscritos.

**Así se resuelve:** dibujar medio triángulo central; identificar dato y objetivo; seleccionar seno, coseno, tangente o Pitágoras; despejar; comprobar $r<R$. **Ahora tú:** radio-lado → apotema → dos polígonos en una circunferencia.

### Idea 3. Contar conexiones — ¿Cuántas diagonales son distintas?

**Aprende:** cada diagonal tiene dos extremos y puede aparecer en dos conteos.

**Lee / objeto:** marco con clavijas numeradas y cordeles. «Un cordel conecta dos vértices». «Los vecinos ya forman lados». «Un cordel no cambia al recorrerlo al revés».

**Juega:** desde una clavija conecta todos los vértices no vecinos; valida que no hay lados ni autoconnexiones. El conteo desde todos los vértices está bloqueado.

**Predice:** al contar las diagonales que salen de cada vértice y sumar todos esos conteos, ¿cuántas veces aparece una diagonal concreta? A) Dos **[correcta]**. B) Una [P-DOB]. C) Tantas veces como vértices tiene el polígono [P-DOB]. D) Tantas veces como diagonales salen de un solo vértice [P-DOB].

**Mira:** etiqueta cada cordel por sus dos extremos y reúne las dos apariciones.

**La regla:** desde un vértice hay $n-3$ diagonales y el total es $D=n(n-3)/2$, para un polígono simple: la regularidad no es necesaria para contar pares no adyacentes. Si se trazan desde un subconjunto de vértices, se suman sus conteos y se resta una vez cada diagonal cuyos dos extremos pertenecen al subconjunto, porque estaba duplicada. Las longitudes sí dependen de la forma; en el regular una cuerda que abarca $j$ pasos mide $2R\sin(j\pi/n)$, con ángulo en radianes y $j$ entero admisible.

**Palabras:** *diagonal*: unión de vértices no vecinos; ejemplos: un salto de dos, uno de tres, unión de opuestos. *Duplicado*: el mismo objeto contado de nuevo; ejemplos: AB y BA, un cordel desde cada extremo, una pareja escrita al revés.

**Así se resuelve:** decidir si se cuentan todas o un subconjunto; identificar duplicados; escribir conteo; hallar n entero; obtener el ángulo central si se pide. **Ahora tú:** un vértice → total → varios vértices consecutivos y longitudes.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $n,j,D$ | Lados, pasos entre vértices, diagonales | Conteos |
| $\theta,\varepsilon,\alpha$ | Ángulo central, exterior, interior | Grados; jπ/n usa radianes explícitos |
| $R,r,\ell,P$ | Radio, apotema, lado, perímetro | Longitud; P no es punto |
| $\pi,\sin,\cos,\tan$ | Constante y razones trigonométricas | Sin unidad |

## 7. Otras formas de explicarla

Varillas articuladas revelan que equilátero no implica regular para cuatro o más lados. Triángulos centrales explican las medidas; exigen regularidad. Cordeles etiquetados hacen visible el doble conteo; cruzarse en el interior no crea una diagonal nueva. Fuente de alcance: CEPREUNI; deducciones y objetos originales.

## 8. Datos del mundo

El diámetro de 25,50 mm de la moneda BCRP sirve para fijar una circunferencia de referencia e inscribir un polígono ideal. No se afirma que el contorno real de esa moneda sea un polígono regular. Las tapas de cajas son objetos ficticios de medidas declaradas.

## 9. Dudas y decisiones

Se trabaja con polígonos simples convexos regulares, no estrellados. La cuerda general es extensión posterior a las relaciones del triángulo central. Los valores de seno y coseno se entregan: no se exigirán tablas de polígonos memorizadas.

## 10. Fuentes

- UNI (2021). *Solucionario Admisión 2021-1*, Matemática 11. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- CEPREUNI (2023). *Sílabo básico 2023-2*, Polígonos regulares. [Documento](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf).
- UNMSM (proceso 2023-I). *Reglamento de admisión*, Geometría 9. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- BCRP (2021). *Moneda: Toribio Rodríguez de Mendoza*. [Ficha](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf).
