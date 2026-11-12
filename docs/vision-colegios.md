# Gestión para colegios: plan

12 de noviembre de 2026 · Decisión del equipo, discutida en sesión. Todavía no se programa: este documento fija el modelo, los precios, el orden de trabajo y lo que falta averiguar. Cuando se apruebe, lo esencial pasa a `docs/fundacional.md`.

## La idea

El colegio es el socio que nos abre la puerta. Además de Mesa de Estudios, le damos un sistema de gestión para todo el colegio:

- **Profesores:** suben la foto de su registro o de un examen, el sistema lee las notas y el profesor las confirma. Sin tipear.
- **Papás:** ven en el celular las notas, los comunicados de la profesora (un "grupo en la nube" que no reemplaza a WhatsApp, pero deja todo ordenado) y el avance de cada curso. Más adelante, escuela de padres e información útil.
- **Dirección:** resumen por sección y exportación a Excel o CSV en el formato que pida cualquier otro sistema donde el colegio tenga que entregar sus notas. Nos acoplamos; no le pedimos al colegio que cambie nada.
- **La brecha con la UNI:** el papá y el profesor ven qué parte del temario de admisión ya se cubrió y qué falta, aunque el alumno esté bien en el colegio. Se mide con los datos de Mesa de Estudios (predicciones y pruebas de entrada y salida) y con la programación anual del colegio, no con las notas, porque en secundaria se califica por competencias y no por temas. Se presenta como un plan para el profesor, que quiere darle más a sus alumnos, no como un reproche.

La meta es pasar de ser un *solver* a ser la plataforma del colegio.

## Modelo de negocio

Solo colegios privados, empezando por los pequeños. El colegio nos paga por alumno matriculado y decide si lo traslada a la pensión.

| Plan | Qué incluye | Precio por alumno al mes |
| --- | --- | --- |
| Solo Mesa de Estudios | Mesa en los grados con contenido (hoy 3.º a 5.º de secundaria) | S/ 12 |
| Solo gestión | Gestión para todo el colegio | S/ 6 |
| **Completo** | Mesa y gestión en los grados con contenido | **S/ 16** |
| | Gestión en el resto del colegio | S/ 4 |

- La gestión nunca va gratis ni por debajo de S/ 4: cada plan se paga solo y ningún colegio subsidia a otro.
- Se dice "incluido", no "gratis". Lo gratis no se valora y después no se puede cobrar.
- Que Mesa sola cueste S/ 12 hace obvio el completo: por S/ 4 más se digitaliza todo el colegio.
- Lo que el colegio cobre a los papás es decisión suya. No le damos comisión.
- Se puede presentar como precio por año (10 meses de clase).
- Piloto: precio bajo o gratis el primer bimestre, a cambio de datos y de un testimonio.

### Costos estimados (colegio de 200 alumnos, 70 de 3.º a 5.º)

| Concepto | Por mes |
| --- | --- |
| Servidor, base de datos y fotos | S/ 75 a 225 |
| Lectura de fotos con IA (API, pago por uso) | menos de S/ 50 |
| Soporte a papás y profesores (medio tiempo repartido entre 3 colegios) | unos S/ 500 |
| **Total** | **unos S/ 700** |

Ingreso del plan completo: 70 × 16 + 130 × 4 = S/ 1,640 al mes. Margen: unos S/ 940. Solo gestión: 200 × 6 = S/ 1,200, con un margen de unos S/ 500.

Son estimaciones; el soporte es el costo grande y se reparte mejor con más colegios. Con un solo colegio, el soporte lo pone el equipo.

### La IA para leer notas va por API, no por suscripción

Las suscripciones (Claude Max, ChatGPT Pro) son para que el equipo trabaje; no se pueden usar como motor de un producto y tienen límites. El servidor llama a la API y se paga por uso. Con los precios de noviembre de 2026, una foto de registro cuesta unos US$ 0.03 con el modelo más caro y menos de US$ 0.001 con el más barato (Haiku). Falta probar con fotos reales qué modelo lee bien la letra de los profesores.

## Condiciones del contrato

1. **Por alumno matriculado**, no por papá que paga. La morosidad la absorbe el colegio.
2. **Antes de la matrícula.** Para trasladar el costo a la pensión, el colegio tiene que anunciarlo antes de matricular; subir la pensión a mitad de año puede traerle problemas con el Indecopi (por confirmar con abogado). Los colegios fijan las pensiones de 2027 entre noviembre y enero: esa es la ventana.
3. **El papá ve el valor desde la primera semana:** notas, comunicados y avance. Si paga más y no ve nada, el colegio cancela.

## Privacidad

Hoy la app es anónima y no tiene servidor. La gestión maneja datos personales de menores, y eso cambia todo:

- Ley 29733 de Protección de Datos Personales y su reglamento nuevo (DS 016-2024-JUS, vigente desde marzo de 2025).
- Por confirmar con abogado: quién es el responsable del banco de datos (probablemente el colegio) y quién el encargado del tratamiento (nosotros), el contrato entre ambos, el consentimiento de los papás y el aviso en caso de filtración.
- La IA lee, el profesor confirma. Ninguna nota llega a un papá sin que el profesor la haya revisado.
- Los promedios y las alertas los calcula código determinístico, nunca la IA (como la regla 1 de `CLAUDE.md`).
- Para entrar, un código que da el colegio, sin contraseñas que se olvidan. Reduce el soporte.

## Grados

Hoy el catálogo tiene 151 unidades, todas de 3.º a 5.º de secundaria, y hay 11 módulos construidos, casi todos de física y química.

| Grados | Qué hay para marzo de 2027 | Plan |
| --- | --- | --- |
| 3.º a 5.º de secundaria | Mesa de Estudios (se refuerza) | Completo |
| 5.º y 6.º de primaria, 1.º y 2.º de secundaria | Matemática con generadores de predicciones, si sobra capacidad | Precio intermedio por definir hasta que lleguen las ciencias |
| 1.º a 4.º de primaria | Nada de Mesa | Solo gestión, S/ 4 |

Para primaria y los primeros grados de secundaria:

- El mensaje no es la UNI sino "su hijo entiende matemática de verdad".
- La matemática de esos grados (fracciones, decimales, proporcionalidad, porcentajes, ecuaciones de primer grado) encaja con el formato de predicciones que ya existe.
- Los errores con fracciones y decimales están muy estudiados; hay que hacer el informe con fuentes antes de construir.
- Ciencia y Tecnología en esos grados es sobre todo biología, que hoy no existe en Mesa de Estudios. Queda para después.
- Niños de 10 a 12 años necesitan otra interfaz: menos texto, botones grandes y sesiones cortas.
- No se promete contenido que no existe.

## Frentes de trabajo

| Frente | Qué | Cuándo |
| --- | --- | --- |
| 1 | Lanzamiento en el colegio con 3.º a 5.º | Diciembre de 2026 (ya en la hoja de ruta) |
| 2 | Prototipo de gestión y presentación al director | Antes de que el colegio fije las pensiones de 2027 |
| 3 | Reforzar 3.º a 5.º con más módulos en las unidades que más pregunta la UNI | Enero y febrero de 2027 |
| 4 | Matemática para 5.º y 6.º de primaria y 1.º y 2.º de secundaria | **Solo si sobra capacidad** |

El cuarto frente no se vende ni se apura, pero tampoco se deja pasar: si sobra tiempo de las suscripciones de IA, se trabaja aquí, porque es capacidad que ya se pagó. Por eso sus tareas están listas en la hoja de ruta, en orden, para arrancar sin planear de nuevo.

El cuello de botella no es el código sino la revisión del equipo: cada módulo necesita su informe de errores y sus casos verificados.

### El prototipo de gestión

Datos inventados, sin servidor, con el diseño de `docs/diseno.md` y el OCR simulado (la pantalla lo dice). Cuenta una historia en este orden:

1. El profesor sube la foto de su registro, ve la tabla leída y la confirma o corrige celda por celda.
2. El papá ve las notas y los comunicados en su celular.
3. El papá ve la brecha con la UNI (con el catálogo real) y prueba un simulador.
4. El director ve el resumen por sección y exporta a Excel o CSV.

En verano se construye lo real: servidor, cuentas, OCR por API y exportación. El piloto arranca con las clases de marzo de 2027.

## Preguntas abiertas

- ¿Cuántos alumnos tiene el colegio piloto, en total y de 3.º a 5.º?
- ¿Cuánto cobra de pensión? ¿Cuándo fija las de 2027?
- ¿Cómo registran hoy las notas los profesores (cuaderno, Excel, otro sistema)? Hacen falta 10 a 20 fotos reales de registros para probar el OCR.
- ¿En qué otro sistema tiene que entregar las notas el colegio, y en qué formato?
- Abogado: contrato con el colegio, datos de menores y cobro dentro de la pensión.
