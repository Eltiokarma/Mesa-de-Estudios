# Trigonometría · Transformaciones y series trigonométricas

## 1. Resumen en 5 líneas

Esta unidad enseña a cambiar la forma de una expresión trigonométrica sin cambiar su valor ni perder sus condiciones de existencia.
Relaciona giros, proyecciones, sumas, productos y agrupaciones finitas mediante objetos que el alumno puede mover y comparar.
Lo más difícil es reconocer qué transformación sirve para el objetivo, conservar signos y distinguir una suma de valores de la función aplicada a una suma.
Las series son aquí sumas finitas de senos y cosenos con ángulos en progresión aritmética; también se trabajan productos que se reducen por emparejamiento o duplicación.
La secuencia llega a problemas de admisión con condiciones, pero entrega las identidades necesarias y exige explicar su elección, no recitarlas de memoria.

## 2. Qué se pregunta en los exámenes

La fuente curricular principal es la guía oficial CEPREUNI 2023-2, página 11 del PDF: diferencia transformaciones de suma a producto, de producto a suma, series con arcos en progresión aritmética y productorias. Eso confirma alcance curricular, no frecuencia de examen. Se consultaron además un solucionario institucional UNI y dos reproducciones de academia. La dificultad de la tabla es una valoración pedagógica de los pasos necesarios; no es una clasificación publicada por las universidades.

| Tipo de pregunta | Universidad o programa | Dificultad | Frecuencia que permite afirmar la muestra | Fuente |
|---|---|---|---|---|
| Convertir suma o diferencia de senos y cosenos en un producto para simplificar. | CEPREUNI, ciclo preuniversitario 2023-2. | Media: identificar semisuma, semidiferencia y signo. | Contenido explícito del temario; no permite contar preguntas de admisión. | [F01], apartado Transformaciones trigonométricas. |
| Transformar productos en sumas y combinar datos sobre dos ángulos para hallar otro producto. | UNI 2023-I, segunda prueba, pregunta 31, según reproducción de academia. | Media-alta: conectar datos y evitar resolver ángulos innecesarios. | Un caso localizado; no se afirma que sea el tipo más frecuente. | [F02], página interna 13. |
| Obtener una relación trigonométrica desde una figura y convertir una diferencia de cosenos para cerrar la solución. | UNMSM 2018-I, bloque de Ingeniería/Humanidades reproducido por ADUNI. | Alta: integrar lectura geométrica, cocientes y transformación. | Un caso localizado; muestra insuficiente para estimar recurrencia. | [F03], páginas internas 23–24. |
| Factorizar una ecuación trigonométrica conservando las restricciones de una razón recíproca. | UNI 2019-II, pregunta 34 del bloque de Matemática. | Media-alta: dominio, factorización y selección de soluciones. | Caso complementario observado; no demuestra frecuencia de sumas o series. | [F04], solucionario institucional. |
| Reducir sumas de senos o cosenos cuyos ángulos avanzan siempre lo mismo. | CEPREUNI 2023-2. | Alta cuando hay que reconocer número de términos y extremos. | Exigencia curricular explícita; no se verificó una colección de ítems oficiales suficiente. | [F01]. |
| Reducir productorias de senos, cosenos o tangentes. | CEPREUNI 2023-2. | Media con parejas complementarias; alta con duplicación reiterada. | Exigencia curricular explícita; frecuencia de examen no establecida. | [F01]. |
| Transferir estas transformaciones a UNA Puno, UNSA o UNSAAC. | Universidades regionales solicitadas. | No asignada sin un ítem verificable. | No se reunió evidencia específica suficiente en esta revisión. | Pendiente de cotejo institucional; no se extrapola desde UNI. |

Los documentos de academia sirven para reconocer demandas y formatos; no se reutilizan figuras, enunciados ni soluciones. La presencia curricular de un tema no demuestra su frecuencia de examen.

## 3. Errores típicos

Se leyó el artículo original de Weber, publicado en 2005, incluidos resultados e entrevistas. Describe dos estudios de caso universitarios, no una muestra de postulantes peruanos. Los comportamientos documentados se aprovechan como alertas de diseño; las opciones concretas de esta unidad son originales y necesitan validación local. Las causas propuestas para los errores hipotéticos son interpretaciones pedagógicas, no hallazgos experimentales.

| Código | Qué hace el alumno | Por qué puede hacerlo | Etiqueta | Fuente |
|---|---|---|---|---|
| TT-01 | Se paraliza si el ángulo no es notable o no recibe un triángulo con medidas. | Vincula el seno a un procedimiento disparado por una figura conocida, sin disponer de una representación que pueda construir. | DOCUMENTADO | Keith Weber, 2005, resultados e entrevistas, pp. 100–103; [F05]. |
| TT-02 | Considera demostrada una identidad porque funciona con uno o varios ángulos elegidos. | Confunde una comprobación particular con una justificación que vale para cualquier ángulo permitido. | DOCUMENTADO | Weber, 2005, discusión de la identidad pitagórica, p. 100; [F05]. |
| TT-03 | Reemplaza el seno de una suma por la suma de los senos, o el seno del doble por el doble del seno. | Extiende indebidamente la distributividad de una multiplicación a una función. | HIPÓTESIS | No se atribuye este distractor específico al artículo de Weber; diseño de la propuesta, 2026. |
| TT-04 | Sustituye dos proyecciones por dos veces la proyección del ángulo medio, aunque las marcas estén separadas. | Conserva el centro de los ángulos, pero pierde el efecto de su separación. | HIPÓTESIS | Propuesta, 2026; requiere entrevistas con alumnos. |
| TT-05 | Pierde el signo de una diferencia o decide el signo por el nombre seno/coseno. | Manipula la forma escrita sin volver a la posición de las marcas ni al orden de la resta. | HIPÓTESIS | Propuesta, 2026. |
| TT-06 | Suma factores, omite el factor un medio o confunde producto con suma. | Atiende a los ángulos y deja de controlar la operación exterior. | HIPÓTESIS | Propuesta, 2026. |
| TT-07 | Cancela términos dentro de una suma o cancela un factor que puede valer cero sin conservar la exclusión. | Trata simplificar como borrar símbolos iguales y no como dividir por un factor no nulo. | HIPÓTESIS | Propuesta, 2026. |
| TT-08 | Cree que una expresión simplificada queda definida donde el cociente original era cero entre cero. | Confunde coincidencia de valores en un dominio con igualdad de dominios. | HIPÓTESIS | Propuesta, 2026. |
| TT-09 | Cuenta intervalos como términos o toma como último ángulo el siguiente al que corresponde. | La lista abreviada oculta el primer término y el papel del índice. | HIPÓTESIS | Propuesta, 2026. |
| TT-10 | Cancela extremos de una suma telescópica o supone que toda suma simétrica vale cero. | Reconoce un patrón visual, pero no comprueba signos ni parejas efectivas. | HIPÓTESIS | Propuesta, 2026. |
| TT-11 | Considera que duplicar ángulos vuelve cada coseno igual al anterior, o que varios factores positivos necesariamente aumentan el producto. | Confunde repetición de una regla con repetición del valor y no controla factores menores que uno. | HIPÓTESIS | Propuesta, 2026. |
| TT-12 | Mezcla grados y radianes o interpreta un cuadrado de seno como duplicación del ángulo. | Lee los signos como adornos y no identifica sobre qué objeto actúa cada operación. | HIPÓTESIS | Propuesta, 2026. |

No se halló en esta revisión una investigación peruana original que valide el conjunto de errores específicos de transformaciones y productorias. Esa ausencia se declara; no se completa con porcentajes inventados. El registro de un error en la app debe guardar la justificación elegida y el paso realizado, porque una respuesta incorrecta aislada no identifica su causa.

## 4. Lo que la unidad da por sabido

Se necesitan fracciones, distributividad, factorización elemental, productos notables y la prohibición de dividir por cero. El alumno debe reconocer una vuelta, media vuelta y cuarto de vuelta; distinguir grados de radianes; interpretar seno y coseno como proyecciones divididas por el radio; y usar la identidad pitagórica. No se exige recordar valores notables: se entrega una tabla cuando un ejercicio los necesita.

Antes de comenzar se ofrece una recuperación breve con una rueda de bicicleta inmóvil. Una marca sobre el aro tiene altura respecto del centro y desplazamiento horizontal respecto del mismo centro. Se llama radio, representado por la letra r, a la distancia del centro al aro; h es la altura con signo de la marca; x es su desplazamiento horizontal con signo. Para un ángulo θ, leído «theta», medido desde la dirección horizontal positiva, h/r = sen θ y x/r = cos θ. El signo expresa posición respecto del centro; no significa una longitud física negativa.

La recuperación pide localizar arriba, abajo, derecha e izquierda antes de mostrar una circunferencia aislada. Si falla, vuelve a la fotografía esquemática de la rueda y a una regla superpuesta. Si acierta, permite pasar de inmediato. En toda la unidad se entiende sen² θ como el cuadrado del valor sen θ; sen(2θ) significa evaluar el seno en un ángulo doble. Estas dos escrituras nunca se intercambian.

La progresión aritmética no se presupone como tema dominado: se explica al llegar a las series. Tampoco se presupone notación de sumatoria o productoria. Se enseñan a partir de listas cortas y solo después se abrevia. No se requieren números complejos, cálculo, series infinitas, Fourier ni modelos de corriente alterna. Las fórmulas de arco mitad y triple pertenecen a una recuperación opcional anterior; no son necesarias para completar la ruta central diseñada aquí.

## 5. Las ideas, en orden

La escena inicial siempre conserva un objeto completo. Las letras y proyecciones aparecen al tocarlas, con lectura en palabras. Cada misión tiene un estado final verificable; no se aprueba por permanecer cierto tiempo en pantalla. Las predicciones usan una configuración reservada, distinta de las ensayadas. La respuesta y el vínculo con el error se muestran después de responder. Las tablas que siguen son especificaciones para el equipo, no pantallas que expongan la clave de antemano.

### Idea 1. Dos giros, una posición

**Pregunta que responde:** ¿cómo se relaciona la posición final de dos giros con las posiciones asociadas a cada giro?

**Aprendizaje:** el alumno distingue sumar ángulos de sumar sus senos y reconstruye las identidades de suma, diferencia y ángulo doble.

**Objeto de la primera pantalla:** una rueda de bicicleta de un taller, con una cinta de color pegada al aro. Se ve el soporte que deja la rueda elevada y el centro fijo. Es reconocible como una bicicleta reparada; no se presenta como un diagrama sin contexto. El radio mostrado es una medida didáctica, no una especificación de una marca comercial.

#### Lee

1. «La cinta gira con la rueda. Su distancia al centro se mantiene mientras cambia de posición».
2. «La altura se mide desde el centro: arriba es positiva y abajo es negativa. El desplazamiento horizontal se mide hacia la derecha o la izquierda».
3. «Un giro puede continuar desde donde terminó otro. Llamaremos alfa al primer giro y beta al segundo».
4. «El seno y el coseno describen proyecciones de una posición. La palabra que aparece fuera del paréntesis indica qué se hace con el ángulo que está dentro».

#### Juega

El alumno arrastra una manija y coloca la cinta en dos alojamientos, uno a 30° y otro a 60°, siempre comenzando desde la derecha. Debe emparejar cada posición con las tarjetas «altura positiva» y «desplazamiento horizontal positivo». La meta es completar las dos posiciones y sus dos signos. El programa comprueba el alojamiento y las tarjetas, sin mostrar todavía dos giros encadenados ni una suma de senos.

Una opción accesible permite elegir los alojamientos mediante botones. Al deslizar, una guía se fija en posiciones exactas; la aprobación no depende de precisión motriz. Los números decimales de una proyección permanecen ocultos para que la misión sea reconocer el significado, no copiar una lectura.

#### Predice

Se reserva una nueva acción: la marca parte de la derecha y gira primero 45° y luego otros 45°, en el mismo sentido. **¿Cuál será su altura final dividida entre el radio?** Se entrega, si hace falta, la posición de un cuarto de vuelta; no se entrega una identidad de suma.

| Opción | Respuesta propuesta | Clave y diagnóstico |
|---|---|---|
| A | Uno: la marca queda arriba del centro, a un radio de altura. | Correcta. |
| B | Raíz de dos: se suman las dos alturas normalizadas de 45°. | Incorrecta: TT-03. |
| C | Cero: dos giros iguales hacen que la marca vuelva al inicio. | Incorrecta: TT-11. |
| D | No se puede decidir porque falta un triángulo con lados conocidos. | Incorrecta: TT-01. |

#### Mira

La rueda realiza los dos giros completos, con pausa entre ellos. Se marca la posición superior y se compara su altura con el radio. Después aparece una construcción propia de dos direcciones perpendiculares que giran juntas. Se descompone el desplazamiento en componentes; las piezas se proyectan sobre la horizontal y vertical. La animación muestra por qué sumar los ángulos cambia también la orientación desde la que se proyecta el segundo movimiento.

#### La regla

Las letras griegas α y β representan respectivamente el primer y el segundo ángulo. Si ambos se expresan en la misma unidad angular, para cualquier valor real de esos ángulos:

$$\operatorname{sen}(\alpha+\beta)=\operatorname{sen}\alpha\cos\beta+\cos\alpha\operatorname{sen}\beta,$$
$$\operatorname{sen}(\alpha-\beta)=\operatorname{sen}\alpha\cos\beta-\cos\alpha\operatorname{sen}\beta,$$
$$\cos(\alpha+\beta)=\cos\alpha\cos\beta-\operatorname{sen}\alpha\operatorname{sen}\beta,$$
$$\cos(\alpha-\beta)=\cos\alpha\cos\beta+\operatorname{sen}\alpha\operatorname{sen}\beta.$$

La escritura sen en estas fórmulas significa seno. No es una variable ni un factor que pueda cancelarse. La derivación usa que un desplazamiento en la nueva dirección horizontal aporta cos α a la horizontal inicial y sen α a la vertical inicial; el desplazamiento perpendicular aporta −sen α y cos α. Al sumar las contribuciones aparecen los productos anteriores. Para giros de otros cuadrantes se conservan las proyecciones con signo.

Al tomar el segundo ángulo igual al primero se obtiene sen(2α) = 2 sen α cos α y cos(2α) = cos² α − sen² α. Con sen² α + cos² α = 1 también resulta cos(2α) = 2 cos² α − 1 = 1 − 2 sen² α. No son cinco reglas desconectadas: las dos últimas formas sustituyen una parte usando la relación pitagórica. Estas identidades sirven tanto en grados como en radianes, siempre sin mezclarlos. [F06]

#### Palabras nuevas

- **Proyección:** la parte de una posición que se ve al medir en una dirección. Ejemplos: altura de la cinta respecto del centro; avance horizontal de una manivela; separación vertical de una marca en un disco.
- **Composición:** hacer una acción y continuar con otra desde el punto alcanzado. Ejemplos: girar y volver a girar; avanzar una marca dos sectores seguidos; orientar una tabla y después ajustar su inclinación.
- **Identidad:** una igualdad que sigue funcionando en todos los casos permitidos. Ejemplos: sumar cero conserva un número; distribuir un producto conserva su valor; las proyecciones de un giro cumplen la relación pitagórica.

#### Así se resuelve

**Ejercicio original:** expresar exactamente la altura normalizada de una marca después de un giro de 75°, usando los valores de 45° y 30° entregados en una tabla.

1. La altura normalizada pide seno, no coseno ni longitud de arco.
2. Se escribe 75° como 45° + 30°; es una elección porque la tabla contiene ambos ángulos.
3. Se selecciona la identidad de seno de suma y se escribe completa antes de sustituir.
4. Con sen 45° = cos 45° = √2/2, sen 30° = 1/2 y cos 30° = √3/2, resulta sen 75° = (√6 + √2)/4.
5. Se comprueba que el resultado es positivo y menor que uno. La marca está en el primer cuadrante. Si se pidiera altura en centímetros, se multiplicaría por el radio dado; aquí se pidió una razón, por lo que el resultado no lleva centímetros.

#### Ahora tú

La entrada pide reconocer una suma de ángulos frente a una suma de senos. Sigue una elección entre dos descomposiciones posibles de un ángulo, con tabla de valores. Después se reconstruye una fórmula de doble ángulo desde la suma, identificando qué se repite. El nivel de admisión combina una condición sobre seno o coseno con un cuadrante y solicita una expresión de ángulo doble; se entrega la identidad pitagórica y se exige justificar el signo del valor recuperado. Ningún ejercicio necesita todavía sumas a producto ni sumatorias.

### Idea 2. Dos marcas alrededor de un centro

**Pregunta que responde:** ¿qué se gana al mirar el ángulo medio y la separación de dos marcas?

**Aprendizaje:** el alumno transforma sumas y diferencias de senos o cosenos en productos, interpretando cada factor.

**Objeto de la primera pantalla:** un aro de adorno para una actividad escolar, sostenido verticalmente, con dos pinzas de colores a igual distancia del centro. El aro es un objeto artesanal posible en un colegio peruano; no se atribuye a una festividad concreta ni a una técnica patrimonial. Se mantienen el soporte y las pinzas visibles al superponer las proyecciones.

#### Lee

1. «Dos pinzas pueden estar en lados distintos del mismo aro. Las dos tienen el mismo radio».
2. «Podemos juntar sus desplazamientos horizontales o comparar uno con el otro. Juntar no es lo mismo que medir el arco entre ellas».
3. «La dirección intermedia queda a mitad de camino entre dos direcciones. La separación cuenta cuánto se apartan de ella».

#### Juega

El alumno ubica dos pinzas en alojamientos de 20° y 160°, o de 40° y 140°. Debe conseguir que la suma de los desplazamientos horizontales sea cero, manteniendo ambas pinzas por encima del centro. El programa verifica ángulos suplementarios y signos verticales positivos. Solo ofrece estas dos parejas y sus versiones intercambiadas; no deja ensayar dos ángulos agudos próximos.

La misión hace visible una compensación sin enseñar la fórmula general. Al intercambiar las pinzas, la suma no cambia. Un botón de comparación muestra cada segmento horizontal por separado y su reunión sobre una regla, sin convertirlos en longitudes siempre positivas.

#### Predice

Ahora las pinzas estarán a 30° y 50°. Otra referencia muestra dos copias de la proyección horizontal correspondiente a 40°. **¿Cómo será la suma horizontal de las pinzas frente a esa referencia?** La configuración no estuvo disponible en el juego.

| Opción | Respuesta propuesta | Clave y diagnóstico |
|---|---|---|
| A | Será positiva, pero menor que la referencia. | Correcta. |
| B | Será exactamente igual porque el ángulo del medio es 40°. | Incorrecta: TT-04. |
| C | Será mayor porque separar las pinzas añade desplazamiento. | Incorrecta: TT-03. |
| D | Será negativa porque se está comparando una pareja de ángulos. | Incorrecta: TT-05. |

#### Mira

Se reúne la longitud horizontal con signo de cada pinza. Luego las pinzas se acercan simétricamente a 40°, manteniendo el ángulo medio. La suma crece hasta alcanzar la referencia cuando coinciden. La separación original deja un factor menor que uno. Se informa que esta observación orienta la explicación, pero la demostración usa las identidades de la idea anterior.

#### La regla

Se llama μ, leído «mu», al ángulo medio: μ = (α + β)/2. Se llama ν, leído «nu», a la semidiferencia con signo: ν = (α − β)/2. Entonces α = μ + ν y β = μ − ν. Al sustituir estas dos expresiones en las identidades de la idea 1 y sumar o restar se obtiene:

$$\operatorname{sen}\alpha+\operatorname{sen}\beta=2\operatorname{sen}\mu\cos\nu,$$
$$\operatorname{sen}\alpha-\operatorname{sen}\beta=2\cos\mu\operatorname{sen}\nu,$$
$$\cos\alpha+\cos\beta=2\cos\mu\cos\nu,$$
$$\cos\alpha-\cos\beta=-2\operatorname{sen}\mu\operatorname{sen}\nu.$$

Valen para cualquier par de ángulos reales. No hay denominadores que excluyan valores. El orden α − β importa en las diferencias: al intercambiar los ángulos, ν cambia de signo. La suma de cosenos conserva el valor porque el coseno de ν coincide con el de −ν. La diferencia de cosenos cambia de signo; la señal menos de su fórmula no se puede omitir. [F07]

La explicación no pide recordar «el signo extraño». Se reconstruye una vez restando cos(μ + ν) y cos(μ − ν): los productos de cosenos se cancelan y quedan dos productos negativos de senos. Después, en un ejercicio, se consulta la fórmula y se comprueba el orden de la diferencia. La utilidad de la transformación es crear factores comunes o valores reconocibles.

#### Palabras nuevas

- **Semisuma:** sumar dos cantidades y tomar la mitad. Ejemplos: ángulo medio entre 30° y 50°; promedio de dos marcas angulares; centro de dos orientaciones cercanas.
- **Semidiferencia:** restar en el orden indicado y tomar la mitad. Ejemplos: separación firmada entre dos pinzas; diferencia angular al intercambiar colores; distancia angular desde una dirección hasta el punto medio con orientación.
- **Factor:** una de las partes que se multiplican. Ejemplos: el dos que acompaña a una fórmula; el seno del ángulo medio; el coseno de la semidiferencia.

#### Así se resuelve

**Ejercicio original:** simplificar cos 20° − cos 100° sin aproximar cada coseno.

1. Se reconoce una diferencia de cosenos, no una suma ni seno de una diferencia.
2. El ángulo medio es 60° y la semidiferencia, respetando el orden, es −40°.
3. Se consulta la cuarta transformación: la expresión es −2 sen 60° sen(−40°).
4. Como sen(−40°) = −sen 40°, los dos signos negativos se compensan. Usando el valor de sen 60° entregado, queda √3 sen 40°.
5. No hace falta convertir sen 40° en decimal: la meta era simplificar. Además, cos 20° es positivo y cos 100° negativo, por lo que su diferencia debe ser positiva. El resultado satisface ese control.

#### Ahora tú

Primero se identifican media y semidiferencia en parejas dadas. Luego se elige la transformación correcta y se detecta una inversión accidental de la resta. Después se simplifican expresiones con un factor repetido, sin dividir todavía por él. El tramo de admisión parte de una figura original con proyecciones o de datos angulares y exige una diferencia de cosenos que cree un producto útil. Si la figura requiere una relación geométrica adicional, esa relación debe figurar en los datos del ejercicio.

### Idea 3. Un producto también se puede desarmar

**Pregunta que responde:** ¿cuándo conviene cambiar una multiplicación por una suma o diferencia?

**Aprendizaje:** el alumno reconoce los productos de dos razones y elige una forma equivalente que permita sumar términos o aprovechar datos.

**Objeto de la primera pantalla:** una mesa de costura con una pieza rectangular de tela y dos reglas articuladas que permiten elegir sus dimensiones. Se trata de una maqueta de medición, no de una afirmación sobre un telar real. La longitud de referencia se llama L, leída «ele», y las dimensiones seleccionadas son fracciones de ella.

#### Lee

1. «Una pieza rectangular combina una medida horizontal con otra vertical. Su superficie depende de las dos».
2. «Las reglas de la maqueta permiten elegir partes de una longitud de referencia. Sus marcas están relacionadas con las proyecciones de dos direcciones».
3. «Un producto puede aparecer escrito de distintas maneras. Cambiar la escritura solo sirve si conserva la cantidad que se está midiendo».

#### Juega

El alumno ajusta el ancho a L/2 manteniendo la altura en L y debe cubrir exactamente media plantilla cuadrada, sin superposición ni huecos. Puede comparar con otra configuración de ancho L y altura L. La meta se verifica por dimensiones y cobertura. El juego no permite reducir simultáneamente ancho y altura: esa situación queda reservada para la predicción.

Tras colocar la pieza aparece que su altura puede describirse como L sen α y el ancho como L cos β, con ángulos agudos o rectos apropiados. Esta descripción recupera proyecciones, pero no muestra ninguna identidad de producto a suma.

#### Predice

En una nueva pieza, tanto el ancho como la altura serán la mitad de L. **¿Qué parte de la plantilla cuadrada ocupará?**

| Opción | Respuesta propuesta | Clave y diagnóstico |
|---|---|---|
| A | La cuarta parte. | Correcta. |
| B | Toda la plantilla, porque se suman las dos mitades. | Incorrecta: TT-06. |
| C | La mitad, porque basta conservar una de las dos reducciones. | Incorrecta: TT-07. |
| D | El doble de la plantilla, porque intervienen dos medidas. | Incorrecta: TT-11. |

#### Mira

Se muestran cuatro copias de la nueva pieza cubriendo el cuadrado. Después la escena se reduce a las dos razones que determinaron las medidas. El producto es una cantidad diferente de la suma. Para encontrar una suma equivalente se recuperan, una al lado de otra, las expresiones de seno de suma y seno de diferencia de la idea 1. Al agregarlas desaparece uno de los productos; al dividir entre dos se recupera el otro.

#### La regla

Para ángulos reales expresados en una unidad común:

$$\operatorname{sen}\alpha\cos\beta=\frac{\operatorname{sen}(\alpha+\beta)+\operatorname{sen}(\alpha-\beta)}2,$$
$$\cos\alpha\operatorname{sen}\beta=\frac{\operatorname{sen}(\alpha+\beta)-\operatorname{sen}(\alpha-\beta)}2,$$
$$\cos\alpha\cos\beta=\frac{\cos(\alpha+\beta)+\cos(\alpha-\beta)}2,$$
$$\operatorname{sen}\alpha\operatorname{sen}\beta=\frac{\cos(\alpha-\beta)-\cos(\alpha+\beta)}2.$$

La segunda forma también se puede obtener intercambiando los ángulos en la primera. El orden de la diferencia debe seguir siendo coherente. Las identidades no necesitan que los ángulos sean agudos; esa restricción solo correspondía a la tela, cuyas dimensiones físicas deben ser positivas. Cuando una proyección cambia de signo, la identidad algebraica sigue siendo válida, pero deja de representar directamente una superficie positiva de tela. [F07]

Un mismo producto tiene varias representaciones útiles. Si se necesita sumar expresiones semejantes, conviene abrirlo. Si se necesita cancelar un factor permitido, puede convenir cerrarlo. El criterio es el objetivo del problema. No se premia transformar por transformar ni producir una expresión más larga sin utilizarla.

#### Palabras nuevas

- **Equivalente:** otra manera de expresar la misma cantidad en las condiciones indicadas. Ejemplos: media unidad y dos cuartos; un producto y su suma transformada; una superficie medida con piezas grandes o pequeñas.
- **Término:** una parte separada de las otras por suma o resta al nivel que se está mirando. Ejemplos: cada seno de una suma de dos senos; cada coseno de una diferencia; cada área que se agrega a una superficie total.
- **Normalizar:** comparar con una referencia para trabajar con una razón. Ejemplos: altura dividida entre radio; ancho dividido entre L; superficie de tela dividida entre L².

#### Así se resuelve

**Ejercicio original:** simplificar sen 50° cos 20° + cos 50° sen 20° mostrando la utilidad de abrir ambos productos.

1. La meta es reconocer una sola razón trigonométrica. Se mantienen los dos productos completos.
2. El primero se convierte en la mitad de sen 70° + sen 30°.
3. El segundo se convierte en la mitad de sen 70° − sen 30°.
4. Se reúnen términos: los de 30° se cancelan por ser opuestos, y los dos de 70° forman dos veces ese seno. Al conservar el factor un medio queda sen 70°.
5. Se contrasta con la identidad de seno de suma de la idea 1. Las dos rutas coinciden. Abrir productos no fue indispensable en este caso, pero permitió ver qué piezas desaparecen y prepara las cadenas de la idea 5.

#### Ahora tú

Se comienza distinguiendo producto, suma y función de un ángulo compuesto. Sigue transformar un único producto sin calcular valores. Después se elige entre abrir o cerrar una expresión, explicando qué término se quiere reunir. El nivel de admisión combina una suma de cosenos conocida y el coseno del ángulo suma para obtener otro producto, con todas las identidades disponibles. La evaluación acepta rutas válidas distintas si conservan condiciones y llegan a la cantidad solicitada.

### Idea 4. Simplificar sin borrar condiciones

**Pregunta que responde:** ¿una expresión más corta puede usarse en los mismos ángulos que la original?

**Aprendizaje:** el alumno transforma cocientes, comprueba denominadores y distingue una identidad de una coincidencia en casos particulares.

**Objeto de la primera pantalla:** el mismo aro escolar sobre una mesa, ahora con una ficha de medición escrita por un estudiante para su equipo. La ficha solicita dividir la suma de alturas entre la suma de desplazamientos horizontales. Se ve quién mide, qué objeto se mide y qué dos cantidades se dividen; no se inventa un instrumento comercial que funcione con esa regla.

#### Lee

1. «La ficha compara dos sumas de medidas del aro. Antes de dividir hay que saber cuánto vale la cantidad de abajo».
2. «Dos marcas pueden compensar sus desplazamientos. Una compensación exacta es diferente de una medida pequeña».
3. «Al escribir una cuenta de otra forma, hay que conservar las condiciones con las que empezó».

#### Juega

Se ofrecen únicamente parejas de ángulos agudos, por ejemplo alojamientos entre 10° y 70°. El alumno selecciona una pareja y organiza las tarjetas de numerador y denominador de la ficha. Debe conseguir una división bien formada con denominador positivo y asociar cada sumando a su pinza. No se muestra todavía la pareja de marcas opuestas ni la fórmula simplificada. El sistema verifica correspondencia de medidas y existencia del cociente.

#### Predice

Se colocarán ahora las pinzas a 0° y 180°. **¿Qué ocurre con la división solicitada en la ficha?**

| Opción | Respuesta propuesta | Clave y diagnóstico |
|---|---|---|
| A | No está definida: ambas sumas valen cero y no se puede dividir entre cero. | Correcta. |
| B | Vale cero, porque la suma de alturas vale cero. | Incorrecta: TT-07. |
| C | Vale uno, porque cero dividido entre sí mismo debe cancelarse. | Incorrecta: TT-08. |
| D | Es válida porque la misma ficha funcionó con las parejas anteriores. | Incorrecta: TT-02. |

#### Mira

Las alturas son cero y los desplazamientos horizontales se compensan. La ficha conserva escrito «división no definida». No aparece infinito ni un valor aproximado enorme. Luego se transforman las dos sumas, se hace visible el factor común y se muestra que precisamente puede desaparecer en la nueva configuración. Cancelarlo habría ocultado una restricción real.

#### La regla

La letra Q representa el cociente de la ficha, sin unidades cuando ambas sumas son longitudes medidas igual:

$$Q=\frac{\operatorname{sen}\alpha+\operatorname{sen}\beta}{\cos\alpha+\cos\beta}.$$

Existe si cos α + cos β es distinto de cero. Usando μ y ν de la idea 2, el denominador es 2 cos μ cos ν. Por tanto se necesita simultáneamente cos μ ≠ 0 y cos ν ≠ 0. En ese dominio se cancela el factor común 2 cos ν y resulta Q = tan μ, donde tan μ = sen μ/cos μ. La tangente por sí sola solo exige cos μ ≠ 0; por eso escribirla no autoriza a reincorporar los valores excluidos por cos ν = 0.

Para demostrar una identidad se transforma un lado mediante igualdades válidas en el dominio declarado, o se llevan ambos lados a una expresión común. Una comprobación con una calculadora es útil para detectar un error, pero no prueba todos los casos. En cambio, un solo caso permitido donde los valores difieran sí basta para refutar una supuesta identidad. La cancelación opera sobre factores completos, nunca sobre términos separados por una suma. Las condiciones se escriben antes de la primera cancelación y se conservan al final.

#### Palabras nuevas

- **Dominio:** los valores que se pueden usar sin romper la cuenta. Ejemplos: denominador distinto de cero; ángulos donde existe una tangente; parejas que cumplen las condiciones de la ficha.
- **Cancelar:** dividir arriba y abajo por el mismo factor permitido. Ejemplos: quitar un factor dos común; reducir un factor coseno no nulo; simplificar una fracción con una unidad de longitud común.
- **Contraejemplo:** un caso que muestra que una afirmación general falla. Ejemplos: una pareja que anula el denominador; un ángulo donde una identidad propuesta da valores diferentes; una suma que no equivale al seno de la suma.

#### Así se resuelve

**Ejercicio original:** simplificar el cociente Q de la ficha cuando α = 20° y β = 40°, e informar por qué la simplificación es válida.

1. El ángulo medio es 30° y la semidiferencia es −10°.
2. Se transforma el numerador en 2 sen 30° cos(−10°) y el denominador en 2 cos 30° cos(−10°).
3. Ambos cosenos del denominador son positivos, de modo que ninguno es cero. Se puede cancelar el factor común.
4. Queda tan 30°. Con los valores suministrados, el resultado exacto es 1/√3, que también puede escribirse √3/3.
5. La respuesta incluye la razón de validez: la pareja concreta pertenece al dominio original. No se concluye que cualquier pareja de ángulos admita el mismo procedimiento sin revisión.

#### Ahora tú

La primera tarea solo clasifica cocientes definidos e indefinidos. La siguiente localiza una cancelación ilegal en una solución breve. Después se simplifica un cociente dejando escritas sus exclusiones. El nivel de admisión combina dos condiciones trigonométricas y pide un valor o una afirmación verdadera sobre el dominio. Se permiten ángulos variables, pero se entrega la descripción de los ceros del seno o coseno cuando sea necesaria; no se exige una resolución general de ecuaciones trigonométricas que no se haya enseñado.

### Idea 5. Muchas marcas, un paso constante

**Pregunta que responde:** ¿cómo sumar muchas proyecciones sin calcularlas una por una?

**Aprendizaje:** el alumno identifica una progresión de ángulos, cuenta sus términos y obtiene una suma finita mediante cancelaciones justificadas.

**Objeto de la primera pantalla:** una guirnalda de pequeñas luces sobre un arco circular de cartón para una feria escolar. Todas las luces están a la misma distancia del centro, pero no necesariamente rodean la circunferencia completa. No se atribuyen al montaje propiedades eléctricas: la actividad solo estudia posiciones.

#### Lee

1. «Las luces ocupan alojamientos del arco. Entre una dirección y la siguiente se avanza siempre el mismo ángulo».
2. «Una lista tiene un primer elemento y un último. El número de espacios entre elementos no es igual al número de elementos».
3. «La suma de alturas con signo cuenta cuánto aportan todas las luces respecto del centro. No es la longitud del cable».
4. «Una lista larga se puede escribir de forma abreviada, conservando cómo comienza y dónde termina».

#### Juega

Se entregan cinco luces y cinco alojamientos: 20°, 40°, 60°, 80° y 100°. El alumno debe ocuparlos en orden y colocar una tarjeta de 20° en cada separación consecutiva. La meta exige cinco luces y cuatro separaciones correctas. Se puede cambiar el color de las luces, pero no los ángulos ni la cantidad. No se calcula la suma de proyecciones y no se presenta una lista que termine en 180°.

#### Predice

Una nueva guirnalda tendrá luces en 30°, 60°, 90°, 120°, 150° y 180°. **Si se suman sus alturas con signo respecto del centro, qué resultado cualitativo se espera?**

| Opción | Respuesta propuesta | Clave y diagnóstico |
|---|---|---|
| A | Una suma positiva: hay cinco alturas positivas y una nula. | Correcta. |
| B | Cero, porque toda distribución simétrica se cancela. | Incorrecta: TT-10. |
| C | Una suma negativa, porque el último ángulo ya es media vuelta. | Incorrecta: TT-05. |
| D | No se puede sumar: faltaría una séptima luz para completar seis separaciones. | Incorrecta: TT-09. |

#### Mira

Se dibujan los segmentos verticales desde el centro, manteniendo visibles las luces. Las parejas simétricas tienen alturas iguales positivas, no opuestas. La última altura es cero. Después se abre una lista de senos y cada término conserva el color de su luz. El tamaño de la expresión se reduce mediante una transformación que convierte cada aporte en la diferencia de dos cosenos vecinos.

#### La regla

El ángulo inicial sigue llamándose α. La letra griega δ, leída «delta», es el paso angular constante. La letra n es el número de términos y debe ser un entero positivo. La letra k es el índice que recorre las posiciones desde cero hasta n − 1. Los ángulos son α, α + δ, α + 2δ, hasta α + (n − 1)δ. Esa lista es una progresión aritmética de ángulos; no afirma que sus senos formen una progresión aritmética.

El signo ∑ se lee «suma de». Se definen S_n como la suma de senos y C_n como la suma de cosenos:

$$S_n=\sum_{k=0}^{n-1}\operatorname{sen}(\alpha+k\delta),\qquad C_n=\sum_{k=0}^{n-1}\cos(\alpha+k\delta).$$

Si sen(δ/2) ≠ 0:

$$S_n=\frac{\operatorname{sen}(n\delta/2)}{\operatorname{sen}(\delta/2)}\operatorname{sen}\left(\alpha+\frac{(n-1)\delta}{2}\right),$$
$$C_n=\frac{\operatorname{sen}(n\delta/2)}{\operatorname{sen}(\delta/2)}\cos\left(\alpha+\frac{(n-1)\delta}{2}\right).$$

La demostración no aparece como un salto. Se multiplica cada seno por 2 sen(δ/2) y se usa producto a suma. El término de índice k se convierte en cos(α + (k − 1/2)δ) − cos(α + (k + 1/2)δ). Al sumar, cada coseno interior aparece una vez positivo y otra negativo. Sobreviven cos(α − δ/2) y −cos(α + (n − 1/2)δ). La diferencia se transforma con la idea 2 y se divide por el factor no nulo. Para C_n se repite el procedimiento con diferencias de senos.

Si δ es un múltiplo entero de una vuelta, el denominador anterior se anula. Se vuelve entonces a la lista original: todas las razones coinciden, de modo que S_n = n sen α y C_n = n cos α. No se evalúa una fracción cero entre cero. Aquí «serie» significa suma finita; no se toman límites ni se discute convergencia. La derivación es propia a partir de las identidades ya presentadas; su pertinencia curricular está respaldada por [F01].

#### Palabras nuevas

- **Progresión aritmética:** una lista que avanza con el mismo paso. Ejemplos: direcciones separadas por 20°; marcas cada media vuelta; una secuencia de ángulos que retrocede 10° cada vez.
- **Índice:** la etiqueta que indica qué lugar de una lista se está usando. Ejemplos: k = 0 para la primera luz; k = 1 para la segunda; k = n − 1 para la última.
- **Telescópica:** una suma en la que partes interiores se compensan al escribirlas completas. Ejemplos: diferencias de cosenos vecinos; diferencias de senos consecutivos; una cadena de aumentos y disminuciones que conserva sus extremos.

#### Así se resuelve

**Ejercicio original:** sumar las alturas normalizadas de tres marcas situadas a 20°, 40° y 60° sin aproximar por separado cada seno.

1. Se identifica α = 20°, δ = 20° y n = 3. Hay dos separaciones y tres términos.
2. Se comprueba que sen(δ/2) = sen 10° no es cero.
3. Se sustituye en la fórmula: S_n = [sen 30°/sen 10°] sen 40°.
4. Con sen 30° = 1/2, la respuesta exacta es sen 40°/(2 sen 10°). Se deja así porque el objetivo es una expresión reducida, no una aproximación decimal.
5. Como control independiente, se emparejan los extremos: sen 20° + sen 60° = 2 sen 40° cos 20°. Al añadir sen 40° se obtiene otra forma equivalente. El control no sustituye la prueba general, pero ayuda a localizar una equivocación de índice.

#### Ahora tú

La progresión comienza escribiendo listas completas desde una notación abreviada. Sigue elegir n y δ a partir de extremos dados. Después se reduce una cadena corta mostrando qué términos se cancelan. El nivel de admisión mezcla una suma de senos y otra de cosenos con el mismo paso, para formar un cociente y revisar sus exclusiones. Se incluye un caso de paso igual a una vuelta para comprobar que el alumno decide volver a la lista, en lugar de aplicar una fórmula fuera de sus condiciones.

### Idea 6. Productos que se encadenan

**Pregunta que responde:** ¿cómo reconocer una productoria que puede reducirse por parejas o por duplicación?

**Aprendizaje:** el alumno distingue sumar de multiplicar listas y elige una transformación que conecte factores sucesivos.

**Objeto de la primera pantalla:** una mesa de corte con plantillas rectangulares transparentes y reglas articuladas. Cada plantilla reduce una longitud de referencia según la proyección de un brazo. Se identifica como un modelo escolar de medición inspirado en un taller; no se afirma que una máquina real transmita movimiento mediante esa regla.

#### Lee

1. «Aplicar una reducción y después otra combina dos factores. Cada paso actúa sobre lo que quedó del anterior».
2. «La lista de factores puede seguir un patrón angular. Reconocer el patrón ayuda a elegir qué piezas juntar primero».
3. «Algunas parejas forman una cantidad sencilla. Otras se conectan con el doble del ángulo anterior».

#### Juega

El alumno superpone una plantilla que conserva la mitad de una longitud y otra que conserva todo lo recibido. Debe seleccionar la tira que representa la longitud final y ordenar las tarjetas de los dos pasos. La meta es identificar que el segundo paso no modifica lo que entregó el primero. Las plantillas disponibles tienen factores positivos; no se ofrecen dos reducciones simultáneas ni la cadena de ángulos dobles.

#### Predice

En una nueva secuencia, la primera plantilla conserva la mitad y la segunda también conserva la mitad de lo recibido. **¿Qué parte de la longitud inicial quedará?**

| Opción | Respuesta propuesta | Clave y diagnóstico |
|---|---|---|
| A | La cuarta parte. | Correcta. |
| B | Toda la longitud, al sumar las dos mitades. | Incorrecta: TT-06. |
| C | La mitad, porque la segunda operación repite la primera y no cuenta otra vez. | Incorrecta: TT-11. |
| D | Cero, porque se cancelan dos factores iguales. | Incorrecta: TT-07. |

#### Mira

Las dos plantillas actúan sucesivamente y la tira final ocupa un cuarto de la original. Después se abandona la interpretación de longitudes para presentar productos con signo: un factor trigonométrico puede ser negativo, y eso requiere una lectura algebraica. Se conectan tres tarjetas, sen α, 2 cos α y 2 cos(2α), mostrando que cada identidad de ángulo doble prepara la siguiente.

#### La regla

El símbolo ∏ se lee «producto de» y exige multiplicar todos los factores del índice inicial al final. No significa sumar. Se define P_n como el producto de cosenos de ángulos que se duplican:

$$P_n=\prod_{k=0}^{n-1}\cos(2^k\alpha).$$

La identidad sen(2α) = 2 sen α cos α permite construir, paso a paso:

$$2^n\operatorname{sen}\alpha\,P_n=\operatorname{sen}(2^n\alpha).$$

Esta igualdad multiplicativa vale para todo α. Si sen α ≠ 0 se puede despejar:

$$P_n=\frac{\operatorname{sen}(2^n\alpha)}{2^n\operatorname{sen}\alpha}.$$

Si sen α = 0 se evalúa el producto original; no se usa el cociente. Para verificar la cadena, se escribe primero n = 1; luego se multiplica por 2 cos(2α), formando sen(4α); se continúa de la misma manera. El número de factores es n y el último coseno contiene 2 elevado a n − 1, mientras el seno final contiene 2 elevado a n. Confundirlos es un error de extremos.

Otras productorias se reducen por parejas: sen α cos α = sen(2α)/2; sen α sen(90° − α) = sen(2α)/2; y tan α tan(90° − α) = 1 cuando ambas tangentes existen. La última exige sen α ≠ 0 y cos α ≠ 0. En radianes se sustituye 90° por π/2. Las relaciones complementarias se justifican intercambiando las proyecciones de un ángulo y su complemento; la de tangentes se deduce escribiendo cada una como cociente.

No existe una única fórmula sencilla que reduzca cualquier lista arbitraria de senos, cosenos o tangentes. Se inspeccionan ángulos, parejas y condiciones. Los productos de tres o cuatro factores sin patrón pueden abrirse repetidamente con la idea 3. La fórmula de duplicación no corresponde a ángulos en progresión aritmética salvo coincidencias particulares; tampoco se aplica a una lista de tangentes sustituyendo el nombre de la función.

#### Palabras nuevas

- **Productoria:** una manera corta de pedir varias multiplicaciones. Ejemplos: tres cosenos consecutivos de una cadena; dos tangentes complementarias; factores de reducción aplicados uno después de otro.
- **Encadenar:** hacer que el resultado de un paso sirva para el siguiente. Ejemplos: formar un seno doble; usarlo para obtener un seno cuádruple; repetir una reducción sobre una tira ya reducida.
- **Complementarios:** dos ángulos que juntos completan un cuarto de vuelta. Ejemplos: 20° y 70°; 35° y 55°; dos ángulos agudos de un triángulo rectángulo.

#### Así se resuelve

**Ejercicio original:** reducir cos 15° cos 30° cos 60° sin multiplicar tres aproximaciones decimales.

1. Los ángulos se duplican: 15°, 30° y 60°. Por tanto α = 15° y n = 3.
2. Se añade provisionalmente el factor 8 sen 15° a la expresión. No es una modificación del valor que se esconda: se escribe una igualdad multiplicativa completa.
3. Primero 2 sen 15° cos 15° se convierte en sen 30°; luego otro factor dos y cos 30° producen sen 60°; el último dos y cos 60° producen sen 120°.
4. Como sen 15° no es cero, se despeja el producto: P_n = sen 120°/(8 sen 15°). Con el valor de sen 120° suministrado, queda √3/(16 sen 15°).
5. La forma reducida es exacta. Se contrasta el signo positivo con los tres cosenos originales y se comprueba que el producto es menor que cada factor, pues todos están entre cero y uno. No se fuerza una racionalización que el objetivo no solicita.

#### Ahora tú

Primero se expande una productoria de dos o tres factores. Después se decide si conviene emparejar complementarios, aplicar duplicación o abrir productos. Se continúa con cadenas que requieren conservar un factor inicial para usar la identidad de seno doble. El nivel de admisión combina una productoria con una suma reducida de la idea 5 y solicita simplificar con restricciones. Se excluyen productos especiales sobre todas las raíces de la unidad y fórmulas de Fourier: necesitarían fundamentos que esta unidad no introduce.

## 6. Tabla de letras y símbolos de la unidad

| Letra o símbolo | Significado único en esta unidad | Unidad y advertencia |
|---|---|---|
| r | Radio del aro o de la rueda. | cm o m, según datos; no es razón de progresión. |
| h | Altura con signo respecto del centro. | Misma unidad que r. |
| x | Desplazamiento horizontal con signo respecto del centro. | Longitud; no se usa como ángulo desconocido. |
| θ | Ángulo de una posición individual durante la recuperación. | Grados o radianes, indicados. |
| α | Primer ángulo; también ángulo inicial de una lista. | Se conserva el significado de inicio al pasar a series. |
| β | Segundo ángulo de una pareja. | Grados o radianes. |
| μ | Ángulo medio de α y β. | Misma unidad angular. |
| ν | Semidiferencia con signo de α y β. | Misma unidad angular. |
| δ | Paso angular constante de una progresión aritmética. | No es un cambio genérico de cualquier magnitud. |
| L | Longitud de referencia de las plantillas. | cm o m; evitar confundir la ele con el número uno. |
| Q | Cociente entre suma de senos y suma de cosenos de la ficha. | Sin unidad; no representa carga eléctrica. |
| n | Número total de términos o factores. | Entero positivo, sin unidad. |
| k | Índice de posición contado desde cero. | Entero, sin unidad; no es una constante física. |
| S_n | Suma de n senos con paso angular constante. | Sin unidad. |
| C_n | Suma de n cosenos con paso angular constante. | Sin unidad; no es una combinación de conteo. |
| P_n | Producto de n cosenos con duplicación sucesiva del ángulo. | Sin unidad; no es perímetro. |
| sen, cos, tan | Seno, coseno y tangente. | Valores sin unidad; cada función recibe un ángulo. |
| ∑, ∏ | Suma indicada y producto indicado. | Incluyen límites e índice; no son intercambiables. |
| °, rad, π | Grado, radián y número pi. | π es un número; π rad corresponde a media vuelta. |
| ≠, =, √ | Distinto de, igual a y raíz cuadrada principal. | La raíz principal es no negativa. |

Toda fórmula de una actividad debe acompañarse de su lectura verbal al primer uso. Las fórmulas escritas con sen mantienen esa abreviatura en las pantallas, aunque una biblioteca de cálculo interna utilice otra. Las medidas de la escena no cambian de unidad dentro de una comparación sin conversión explícita.

## 7. Otras formas de explicarla y su riesgo

| Forma de explicación | Idea para la que conviene | Uso propuesto | Riesgo y corrección | Fuente o procedencia |
|---|---|---|---|---|
| Rueda con marca y proyecciones con signo. | 1 y recuperación. | Conectar un giro con una cantidad que puede variar continuamente. | Interpretar seno como una longitud fija o necesitar siempre un triángulo dibujado. Dividir por el radio y conservar el círculo completo. | Diseño propio; diálogo con las dificultades de representación analizadas en [F05]. |
| Dos marcas simétricas alrededor de una dirección media. | 2. | Separar el efecto del ángulo medio del de la separación. | Suponer que todo promedio de senos coincide con el seno del promedio. Mantener la separación como variable visible. | Diseño propio; identidades verificadas con [F07]. |
| Dos identidades escritas una debajo de otra. | 3. | Mostrar cancelaciones que producen el factor un medio. | Convertir la manipulación en copia mecánica. Pedir señalar qué término se elimina y por qué. | Desarrollo algebraico propio basado en [F06] y [F07]. |
| Rectángulo de tela. | 3 y 6. | Dar sentido a producto y reducción sucesiva. | Interpretar cualquier producto negativo como superficie física. Limitar la escena a medidas positivas y separar la extensión algebraica. | Analogía original; no se presenta como resultado experimental. |
| Tarjetas de factores y condiciones de dominio. | 4. | Hacer visible qué se divide y qué valores se excluyen. | Creer que simplificar equivale a borrar. Mostrar la división por el factor y conservar una tarjeta de exclusiones. | Diseño propio. |
| Lista desplegable que colorea términos opuestos. | 5. | Comprender una suma telescópica antes de memorizar su forma final. | Cancelar por semejanza visual sin controlar signo e índice. Unir únicamente expresiones exactamente iguales con signos opuestos. | Derivación propia. |
| Cadena de duplicación que conserva el seno inicial. | 6. | Construir la productoria a partir del ángulo doble. | Olvidar el factor inicial añadido o extrapolar a cualquier patrón. Mantener ambos lados completos en cada paso. | Derivación propia; pertinencia curricular en [F01]. |

Las escenas pueden resolverse con ilustración plana y elementos manipulables. No se necesita una simulación física pesada. Una visualización numérica ayuda a detectar contradicciones, pero nunca se presenta como una demostración universal. La prueba algebraica llega después de la observación y puede releerse sin repetir el juego.

## 8. Datos del mundo, con fuente

| Dato comprobable | Fuente | Uso posible y límite |
|---|---|---|
| El Molino de Sabandía se ubica en Arequipa y el BCRP lo describe como una construcción de 1621 que aprovecha la fuerza del agua para la molienda. | BCRP, 2016, informe económico y social de la región Arequipa; [F08]. Se leyó el pasaje indexado del documento. | Contexto opcional para hablar de objetos que giran. No se infieren diámetro, velocidad de giro ni potencia de sus mecanismos. |
| La documentación operativa de Osinergmin consultada establece 60 Hz como frecuencia regulada de referencia del sistema eléctrico. | Osinergmin, 2017, Resolución 086-2017-OS/CD, apartado 7.6.3; [F09]. Pasaje indexado verificado. | Nota cultural sobre repetición periódica; no se usa para enseñar redes eléctricas ni para atribuir forma sinusoidal perfecta a una medición real. |
| La guía CEPREUNI 2023-2 incluye explícitamente series de senos y cosenos con arcos en progresión aritmética y productorias. | CEPREUNI, 2023; [F01]. | Justifica el nivel de llegada de la propuesta; no es una frecuencia observada de examen. |

Los radios de ruedas, longitudes de tela, alojamientos angulares y cantidades de luces usados en las escenas son datos didácticos originales. Se rotulan como tales y no se presentan como mediciones de Sabandía ni de un taller identificado. No se necesitan cifras patrimoniales para resolver la matemática. El equipo debe evitar usar fotografías ajenas sin autorización: puede dibujar objetos propios reconocibles sin reproducir una figura protegida.

## 9. Dudas y decisiones

Se eligió interpretar «series trigonométricas» conforme al alcance explícito del temario CEPREUNI: sumas finitas con progresión aritmética. No se introducen series de Fourier. La expresión «productorias de senos, cosenos y tangentes» es amplia; se cubren las familias que pueden derivarse con lo enseñado: parejas complementarias, productos cortos transformables y cadenas de cosenos con ángulo doble. Si el proyecto necesita otras familias, debe reservarles una ampliación con fundamentos propios.

Las identidades de arco compuesto se recuperan en la idea 1 porque son la base de todo lo demás. No se vuelve a desarrollar un curso completo de razones trigonométricas. La recuperación de arco mitad y triple queda fuera de la ruta central: aparecen en el temario anterior al bloque de transformaciones, pero no hacen falta para los ejercicios propuestos aquí. La tabla de examen señala demandas relacionadas sin prometer que esta unidad resuelva por sí sola cualquier problema que mezcle geometría y trigonometría.

No se confirmó una distribución de frecuencias entre UNMSM, UNI y universidades regionales. La muestra mezcla documentos institucionales y reproducciones de academia claramente identificadas. Antes de asignar pesos a un simulacro comercial conviene construir un registro de ítems por periodo, área y procedencia; esa tarea no se sustituye por contar menciones en un temario.

La investigación de errores documentada es internacional y universitaria. No prueba que los distractores propuestos discriminen bien entre alumnos peruanos. El dueño del proyecto debe decidir el momento de una prueba breve con estudiantes y si ofrece el nivel de productorias como tramo obligatorio o como profundización. Esa decisión no impide implementar la secuencia; afecta su presentación y el seguimiento del aprendizaje.

**Revisión de dependencias:** la idea 1 solo usa proyecciones y álgebra previas; la 2 deriva de la 1; la 3 también deriva de la 1; la 4 utiliza la 2 y división por cero; la 5 utiliza 2 y 3 y enseña sus propios índices; la 6 usa 1 y 3, y explica productoria antes de abreviarla. No se requiere una regla futura para resolver una misión o una predicción. En los desafíos finales de la idea 6 sí se integran aprendizajes ya recorridos de la idea 5.

**Revisión de predicciones:** cada idea tiene cuatro opciones y exactamente tres distractores vinculados a códigos de la sección 3. Las configuraciones reservadas no se pueden reproducir en su juego previo. Las elecciones erróneas se tratan como indicios, no como diagnósticos psicológicos. El programa debe distinguir «respuesta cambiada tras observar» de «predicción inicial».

**Revisión de implementación matemática:** el equipo recalculará expresiones, comprobará denominadores y usará valores exactos para validar alojamientos y respuestas simbólicas. Las tolerancias visuales del arrastre no deben permitir aprobar una expresión indefinida. No se incluye un banco final de ejercicios numéricos ni código de la app; los ejemplos resueltos sirven para hacer verificable la propuesta pedagógica.

## 10. Fuentes

- **[F01] Centro Preuniversitario de la Universidad Nacional de Ingeniería, 2023.** *Guía preuniversitario, ciclo 2023-2*. Documento institucional; se consultó el bloque de Trigonometría, especialmente la página 11 del PDF. [PDF oficial](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Pre_PS_2023-2.pdf).
- **[F02] Academia no identificada con certeza en la extracción, 2023.** *Solucionario segunda prueba de admisión UNI 2023-I, miércoles 15 de febrero*. Reproducción alojada en Scribd; se leyó el contenido interno, incluida la pregunta 31. El título y resumen automáticos del portal no se tomaron como evidencia. [Documento reproducido](https://es.scribd.com/document/630542886/UNI-2023-1-SOLUCIONARIO-15-DE-FEBRERO).
- **[F03] Academia ADUNI, 2017, proceso 2018-I.** *Solucionario San Marcos 2018-I, Ingeniería/Humanidades y Ciencias Jurídicas y Sociales*. Reproducción en uDocz; se consultó el bloque de Trigonometría y su clasificación temática. No se copian sus problemas ni sus lecturas. [Reproducción](https://www.udocz.com/apuntes/37467/examen-de-admision-san-marcos-resuelto-2018-1).
- **[F04] Universidad Nacional de Ingeniería, 2019.** *Solucionario del examen de admisión 2019-II*. Publicación alojada por la oficina de admisión; se consultó el bloque de Matemática, incluida la pregunta 34. [PDF institucional](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20192.pdf).
- **[F05] Weber, Keith, 2005.** *Students’ Understanding of Trigonometric Functions*. Mathematics Education Research Journal, 17(3), 91–112. Fuente original leída; estudios de caso, sin extrapolación de porcentajes a Perú. [Texto completo en ERIC](https://files.eric.ed.gov/fulltext/EJ747914.pdf). [DOI](https://doi.org/10.1007/BF03217423).
- **[F06] OpenStax, sin fecha consignada en las páginas consultadas.** *Precalculus 2e*, secciones 7.2 y 7.3: identidades de suma/diferencia y de ángulo doble. Se consultaron las relaciones matemáticas, no se adaptaron sus ejercicios o figuras. [Sección 7.2](https://openstax.org/books/precalculus-2e/pages/7-2-sum-and-difference-identities). [Sección 7.3](https://openstax.org/books/precalculus-2e/pages/7-3-double-angle-half-angle-and-reduction-formulas).
- **[F07] OpenStax, sin fecha consignada en la página consultada.** *Precalculus 2e*, sección 7.4, *Sum-to-Product and Product-to-Sum Formulas*. Referencia técnica primaria de las identidades; ejemplos y secuencia de esta propuesta originales. [Sección 7.4](https://openstax.org/books/precalculus-2e/pages/7-4-sum-to-product-and-product-to-sum-formulas).
- **[F08] Banco Central de Reserva del Perú, 2016.** *Informe económico y social, región Arequipa*. Se verificó el pasaje indexado relativo a Sabandía; la apertura directa mostró un visor sin extracción completa. No se afirma haber leído todo el informe. [PDF institucional](https://www.bcrp.gob.pe/docs/Proyeccion-Institucional/Encuentros-Regionales/2016/arequipa/ies-arequipa-2016.pdf).
- **[F09] Osinergmin, 2017.** *Resolución de Consejo Directivo N.º 086-2017-OS/CD*, apartado 7.6.3. Se consultó el pasaje indexado sobre frecuencia de referencia; se utiliza como dato del documento, no como revisión de vigencia normativa integral. [PDF institucional](https://www.osinergmin.gob.pe/Resoluciones/pdf/2017/OSINERGMIN%20No.086-2017-OS-CD.pdf).

Revisión: 22 de noviembre de 2026. Las escenas, misiones, predicciones y ejemplos resueltos son originales; no constituyen resultados de una intervención educativa ya evaluada.
