# Encargo de una unidad completa con criterio delegado (desde la Etapa 6, 19 nov 2026)

Este encargo junta las fases 1 a 5 del método (`LEEME.md`) en un solo agente, porque Gerson delegó el criterio (19 nov):
nada espera su visto bueno. Lo que se aprendió en la Etapa 5 va en la sección «Lo que encontraron los auditores».
El cierre (lector en frío, auditor, correcciones) va en `cierre-delegado.md`, con otros agentes.

Quien te llama te da: `UNIDAD`, `ARCHIVO`, `CURSO`, `PROPUESTA` (ruta del documento a escribir), `PORT` y `SCRATCH`.
Trabajas en `/home/user/mesa-de-estudios`. Español neutro para el alumno.

## Convivencia (hay otros agentes trabajando a la vez)
- Toca solo tu unidad, tu curso y tus piezas y plantillas nuevas. Un archivo compartido (`nucleo/`, `app/`, `herramientas/`,
  una pieza o una plantilla que usan otras unidades, `catalogo/pruebas/verificar.js`, `nucleo/avance.js`,
  `nucleo/repaso-tipos.js`, `docs/datos/admision-unmsm.csv`): cambio mínimo en un bloque propio, sin reformatear, y dilo.
- No toques `app/sw.js`, `docs/pendientes.md`, `CLAUDE.md` ni `docs/molde-unidad.md`.
- **No hagas commits ni `git stash`/`checkout`/`reset`.** No corras `npm test` completo: `node --test` sobre tus archivos,
  `contenido/teoria/teoria.test.js` (si falla por otra unidad, ignóralo y dilo) y los tests comunes que toques.
  `npm run -s catalogo` sí.
- Servidor propio: `PORT=<PORT> node herramientas/servidor.js &`, guarda el PID, ciérralo con `kill <PID>`. Nunca `pkill`.
  Un solo navegador a la vez. Capturas: `MESA_URL=http://localhost:<PORT> node herramientas/capturas-teoria.js ...`; si se
  cae por tiempo, una copia en SCRATCH limitada a la idea que revisas y con más espera.

## Fase 1: propuesta (escribe `PROPUESTA`)
Lee `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/LEEME.md`, `1-ideas.md`,
`2-ejemplos.md`, `3-practica.md`, `reglas-validador.md`, y las decisiones de `docs/etapa2/` a `docs/etapa5/`. Modelo de
formato y profundidad: la propuesta de tu curso en `docs/etapa5/`; modelo de unidad terminada: la unidad con `calidad: 2`
anterior de tu rama, con su auditoría y su informe del lector (lee qué se corrigió para no repetirlo). Lee lo que hoy
tiene tu unidad, su ficha en `catalogo/cursos/<CURSO>.json`, sus plantillas, el informe de `docs/investigacion/`, el
temario, los ítems de `catalogo/pruebas/<CURSO>.json` y las preguntas de San Marcos (`docs/datos/admision-unmsm.csv`).
Revisa las unidades vecinas de la rama para no repetir ni adelantar. Escribe la propuesta con las secciones de siempre y
termina en **«Decisiones tomadas (Gerson revisa después)»**: cada duda con la opción elegida, el motivo y la descartada.
Solo un choque grave con algo publicado o con una decisión escrita de Gerson va arriba como «CONFLICTO CRÍTICO», sin
resolverlo. Más de 6 ideas: parte la unidad (la primera conserva el `id`; migración del avance en `nucleo/avance.js`,
bloque propio con su test, como `partidoTP` o `partidoPC`) o declara `septimaIdea`.

## Fase 2: idea 1 completa, y aviso a la sesión
La idea 1 con todos sus momentos, glosario, 15 ejemplos, cuentas recalculadas aparte y capturas miradas. Al terminarla,
manda a la sesión (SendMessage a `main`) un mensaje corto con las rutas de las capturas de Juega, Predice y La regla, y
**sigue sin esperar**. Si la sesión te contesta con notas, aplícalas.

## Fases 3 a 5: el resto
Las demás ideas (15 ejemplos cada una), la práctica por idea (generador con `TIPOS_POR_IDEA`, casos verificados aparte,
papel con `datos`, escenas viejas a «Más mesas del tema» con `"rehacer"`), la ficha del catálogo, hasta dos ítems para la
prueba del curso (a la reserva si las formas ya tienen 10 pares) y una prueba propia de la unidad. **No marques
`calidad: 2`**, pero comprueba que pasaría el validador simulándolo.

## Lo que encontraron los auditores de la Etapa 5 (evítalo desde el principio)
1. **Igualdades y afirmaciones falsas en algunas semillas.** Evalúa aparte, en 400 semillas, toda igualdad escrita
   («P(0) = 9», «2·0,63 = 1,26», «2π/3 · 4 = …») y toda frase que afirme un hecho del caso («una casilla es distinta»,
   «x = 2 los separa»). Redondeos con «≈», nunca con «=».
2. **Explicaciones de distractores.** Cada `siFuera` y cada explicación de una alternativa incorrecta da el valor que ese
   error produce de verdad, con herramientas que el ejercicio da (nada de fórmulas no presentadas ni datos que no están).
3. **Una sola respuesta.** Comprueba por fuerza bruta que cada pregunta con alternativas tiene una sola correcta, y que
   los datos fijan el caso (en geometría: un solo triángulo cuando se pide un valor).
4. **Lo previo no delata.** Glosario (`simple`, definición y ejemplos), Lee, consigna, misión, leyenda, lectura y Datos de
   Predice no traen la respuesta de la predicción ni de la misión. Datos de Predice: valores y equivalencias, nunca la
   relación que se predice.
5. **Figuras.** Ninguna figura muestra la respuesta antes de resolver. Si lo pedido se puede medir en una figura a escala,
   «El dibujo no está a escala». Cada rótulo va sobre lo que mide (la medida de AB sobre AB entero, en llave); nada
   encimado; la leyenda solo nombra lo que se ve.
6. **Notación.** Toda letra o símbolo se dice en palabras antes de usarse, con un solo significado en la unidad (campo
   `letras`). Nada que llegue en una unidad posterior. Componentes o magnitudes distintas que se comparan se distinguen.
7. **Ecuaciones a 390 px.** Ninguna igualdad partida a la mitad: corre `node herramientas/ecuaciones-ancho.js` sobre tu
   unidad (ver su cabecera) y corrige lo que salga.
8. **Repetición.** «Ahora tú» no repite el caso de «Así se resuelve», de un ejemplo ni de la predicción.
9. **Niveles.** Los ejemplos de nivel 3 son más difíciles que los de nivel 2; la letra correcta repartida entre A–E.
10. **Verbal.** La correcta nunca es la más larga ni la más corta, no es la única palabra contenida en otra alternativa,
    y la oración que define o la respuesta cambian de lugar entre casos.
11. **Papel de escenas compartidas.** Cada problema dice de qué unidad es (`"unidades"`).
12. **Objetos creíbles.** Medidas posibles (una escalera de 40 m no lo es) y el objeto del enunciado igual al del dibujo.

## Mensaje final (texto plano, corto)
Ideas en una línea cada una (título · objeto · misión · predicción); práctica (tipos por idea); decisiones que Gerson
debería mirar (máximo 6) y cualquier CONFLICTO CRÍTICO; tests y cuentas recalculadas; lo que saldría del validador con
`calidad: 2`; **«Listo para integrar: sí/no»** y la **lista exacta de archivos** para el commit (marca los compartidos;
`app/datos/` no hace falta: la sesión lo regenera); rutas de una captura por idea.
