# Brief del constructor (rutina verbal-mas, 12 nov 2026)

Eres el constructor de textos de lectura de Mesa de Estudios, una app para postulantes a universidades peruanas. Escribe en `contenido/razonamiento-verbal/textos/` los archivos que te pidan. Trabajas en `/home/user/Mesa-de-Estudios`, rama `rutina/verbal-mas`. **No hagas commit ni push**, no toques el índice ni otros archivos: solo crea los `tNNN.json` que se te encargan.

## Lee antes de escribir

1. `docs/formato-lectura.md`, secciones 5.2, 5.3, 5.5, 5.7 y 5.8 (el formato JSON y las reglas).
2. Dos ejemplos del mismo módulo, enteros:
   - pares A/B: `contenido/razonamiento-verbal/textos/t113.json` y `t120.json`;
   - inglés: `t124.json` y `t130.json`.
3. Los códigos de error: `contenido/razonamiento-verbal/frases.json` (una frase por código RV1 a RV63). Usa solo códigos que existen y que describen de verdad el error.

## Reglas que no se rompen

- **Contenido propio**, escrito desde cero. Nada copiado ni parafraseado de academias, libros ni exámenes. Las firmas son genéricas («Una economista», «Un dirigente vecinal»), nunca personas reales. No inventes citas de personas reales.
- Cada dato del mundo va en `hechos` con una fuente concreta y verificable (institución, ley, informe, artículo con año). Si no estás seguro de un dato, no lo pongas en el texto o escríbelo más general. Mejor pocos datos y seguros.
- De 150 a 350 palabras (contando los dos textos del par); en inglés, mínimo 100 y conviene 150 a 260. De 4 a 5 preguntas (mínimo 3), con 4 o 5 alternativas. Una sola correcta con `evidencia`; cada incorrecta con `codigo` distinto dentro de la pregunta y `explicacion`. Las explicaciones no nombran letras («la alternativa B» está prohibido) y citan oraciones por número («oración 4»).
- **La correcta no se delata** (lo mide `herramientas/alternativas.test.js` en todo el banco):
  - la correcta NO debe ser la más larga en más de 1 de cada 3 preguntas: en la mayoría, alarga uno o dos distractores para que sean igual o más largos que la correcta;
  - la correcta no puede ser la única que justifica: si la correcta lleva «porque», «ya que», «pues», «por eso», «así que», «de modo que» o un «: palabra», que al menos un distractor también lo lleve; mejor aún, que la correcta no los lleve;
  - sin negritas, comillas de énfasis ni marcas.
- Ningún distractor defendible con el texto. Un distractor de «coincidencia» no puede ser algo en que también coinciden de verdad.
- `revision`: déjalo en `null`. `origen`: `"propio"`. `fecha`: `"2026-11-12"`. `version`: 1.

## Pares A/B (módulo `textos-dialecticos`)

- `tipo_texto: "argumentativo"`, `autores` con `desde` y `firma`; dos párrafos (A y B), o tres si hace falta. Oraciones numeradas de corrido.
- Todas las preguntas en la unidad `razonamiento-verbal.textos-argumentativos-y-dialecticos`.
- Unos pares debaten de frente; otros se complementan o discrepan solo en parte (el B concede algo al A). Varía.
- Preguntas como en San Marcos, 5 por par, eligiendo entre: `controversia` (eje del debate), `postura` (qué sostiene uno), `coincidencia`, `discrepancia`, `dialogo` («A le objetaría a B que…», «B diría de A que…»), `sintesis` (lo que integra los dos), `sentido-contextual`, `inferencia`, `compatibilidad`, `incompatibilidad` y `extrapolacion` (condicional: «si se comprobara que…, el autor B…»). **En esta tanda faltan sobre todo** `sintesis`, `extrapolacion`, `incompatibilidad` y `compatibilidad`: cada par lleva al menos una de ellas, y en el conjunto de tus 5 pares aparecen las cuatro.
- Casi siempre una `sentido-contextual` por par (polisemia real: la acepción común es el distractor RV18; el campo asociado, RV19; la palabra vecina, RV5).
- Dos o tres previos `atribuir` por par (códigos fijos: si la aceptada es A o B, el otro autor es RV59 y `ambos` es RV60; si es `ambos`, A y B son RV61; `ninguno` lo eliges tú, puede ser `null`). Varía las aceptadas: que no sea siempre A; incluye `ambos` y alguna vez `ninguno` (una idea que suena a los textos pero ninguno sostiene). La `sonda` es una paráfrasis, no una cita. Puedes sumar un previo `clasificar` o `proposito`.
- Distractores típicos de pares: RV59 (cambia autores), RV60 (lo de uno como de los dos o como el eje), RV61 (desacuerdo donde coinciden), RV62 (pareja con una mitad mal), RV63 (condicional contrario que reconfirma), RV1, RV2, RV8, RV12, RV33.

## Inglés (módulo `lectura-ingles`)

- `"idioma": "en"` en el texto y en cada pregunta; unidad `razonamiento-verbal.lectura-en-ingles`. Enunciados y alternativas en inglés; explicaciones, `pide` de los previos y sus explicaciones en español.
- Géneros variados: noticia, aviso, carta o correo, entrada de blog, reseña, artículo de enciclopedia, biografía (si es inventada, lo dice el texto y `hechos`). Temas peruanos o de ciencia.
- 5 preguntas por texto, eligiendo entre: `sentido-contextual` («In sentence 3, the word X means»), `extrapolacion` («If…, then…», condicional), `incompatibilidad` («Which is incompatible with the text?»), `titulo`, `dato`, `antonimo` (el sinónimo es RV19; otro rasgo, RV21; falso amigo o parecido de forma, RV54 o RV20), `intencion` (propósito), `contexto` (dónde se publicaría, a quién va dirigido), `inferencia`, `idea-principal`. En el conjunto de tus textos aparecen todos los de la lista del encargo: sentido contextual, extrapolación, incompatibilidad, título, dato, antónimo, propósito y dónde se publicaría.
- Al menos un `previo` por texto (`marcar-oracion` en idea principal o título, `proposito`, o `clasificar`).
- Nivel de inglés A2-B1: vocabulario común, oraciones claras.

## Al terminar

Corre `node --test contenido/razonamiento-verbal/banco.test.js` (tus textos aún no están en un índice, pero el test valida todos los archivos de `textos/`) y `node --test herramientas/alternativas.test.js`. Si algo falla por tus textos, arréglalo. Devuelve un resumen corto: ids, título, dificultad, tipos de pregunta y aceptada de cada previo. No pegues los JSON.
