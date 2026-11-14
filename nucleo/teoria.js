/*
 * Teoría interactiva (docs/teoria.md): el formato de una unidad, su validación y el reparto de personajes.
 * Sin DOM: la pantalla está en app/teoria.js. Funciona en el navegador (window.Teoria) y en Node (pruebas).
 *
 * Una unidad de teoría es un archivo contenido/teoria/<curso>/<unidad>.js que llama a Teoria.unidad({...}).
 * Cada unidad tiene de 2 a 6 ideas, y cada idea recorre los mismos cinco momentos (regla 3: jugar, después
 * predecir, después ver):
 *   1. juega    el alumno mueve la figura sin preguntas (obligatorio, `minimo` cambios distintos)
 *   2. predice  una pregunta neutra sobre algo que el juego no mostró; bloquea hasta responder
 *   3. mira     la explicación como línea de tiempo de la misma figura (Kit.lineaTiempo)
 *   4. regla    la regla con su ecuación y la condición que la hace verdadera; queda en la ficha de repaso
 *   5. ahora tú un caso nuevo, generado con semilla, sin la ayuda del juego
 * Todo número que se ve lo calcula el archivo con código (regla 1); el texto cumple los topes de PRESUPUESTO.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(root, nodo ? require('./ecuacion.js') : root.Ecuacion, nodo ? require('./kit/kit.js') : root.Kit);
  if (nodo) module.exports = api;
  else root.Teoria = Object.assign(root.Teoria || {}, api);
})(typeof self !== 'undefined' ? self : this, function (root, Ecuacion, Kit) {
  'use strict';

  // Los ocho compañeros (docs/teoria/fuentes/guia-personajes.pdf). La asignación es provisional, como dice la guía.
  // `voces`: lo que dice cada uno cuando la unidad no trae su propia `voz`, escrito con su voz de la guía (≤ 16 palabras).
  const PERSONAJES = {
    'aritmetica': { id: 'luma', nombre: 'Luma', animal: 'tortuga', voces: {"prediccion": "Antes de comprobar, ¿qué esperas que pase?", "coincide": "Coincide. Comprobemos por qué.", "noCoincide": "No coincide. Revisemos qué cambió respecto al caso anterior.", "mira": "Paso a paso. Comprueba qué se conserva en cada uno.", "regla": "Esta es la regla. Revisa cuándo vale.", "ahora": "Un caso nuevo. Fija primero la unidad.", "acierto": "La cuenta coincide.", "error": "Revisemos qué representa cada parte y prueba otro.", "nose": "Bien que lo digas. Mira cómo se resuelve y prueba otro.", "fin": "Terminaste esta unidad. Tus reglas quedan en la ficha."} },
    'algebra': { id: 'nox', nombre: 'Nox', animal: 'cuervo', voces: {"prediccion": "Antes de transformar, ¿qué crees que pasa?", "coincide": "Coincide. Ahora veamos por qué se conserva.", "noCoincide": "No coincide. Probemos con un caso concreto.", "mira": "Sigue la transformación paso a paso.", "regla": "Esta es la estructura. Fíjate en su condición.", "ahora": "Otra expresión. Revisa la condición antes de operar.", "acierto": "Se conserva en cada paso.", "error": "Creo que falta un paso. Revisa la solución.", "nose": "Veamos el camino completo. Luego intenta otro.", "fin": "Terminaste esta unidad. La ficha guarda las reglas."} },
    'fisica': { id: 'tilo', nombre: 'Tilo', animal: 'gato bicolor', voces: {"prediccion": "Antes de mover nada: ¿qué crees que pasa?", "coincide": "Coincide. Veamos qué lo explica.", "noCoincide": "Nuestra predicción no coincide. Veamos qué supuesto falló.", "mira": "Mira qué cambia y qué se queda quieto.", "regla": "Ya tenemos modelo, y su letra chica: cuándo vale.", "ahora": "Escena nueva, sin el juego.", "acierto": "La medida coincide con el modelo.", "error": "Comparemos tu cuenta con la escena y prueba otro.", "nose": "Honesto. Aquí está el camino; prueba otro.", "fin": "Unidad terminada. El modelo queda en la ficha."} },
    'quimica': { id: 'bruna', nombre: 'Bruna', animal: 'castora', voces: {"prediccion": "Antes de mirar, anota tu predicción.", "coincide": "Coincide. Ahora veamos qué lo justifica.", "noCoincide": "No coincide. Revisemos el inventario.", "mira": "Revisemos el proceso paso a paso.", "regla": "Esta es la regla. Anota cuándo se cumple.", "ahora": "Caso nuevo. Primero el inventario.", "acierto": "Comprobado.", "error": "Revisemos cada elemento en la solución y prueba otro.", "nose": "Veamos la solución. Después, otro caso.", "fin": "Unidad completa. Todo queda en la ficha."} },
    'geometria': { id: 'neri', nombre: 'Neri', animal: 'nutria', voces: {"prediccion": "Antes de medir, ¿qué crees que pasa?", "coincide": "Coincide. Ahora, por qué pasa siempre.", "noCoincide": "No coincide. Midamos de nuevo la figura.", "mira": "Sigue la construcción paso a paso.", "regla": "Esta es la propiedad. ¿Qué hipótesis la sostiene?", "ahora": "Otra figura. Ubica primero los datos.", "acierto": "La medida lo confirma.", "error": "Contrastemos el dibujo con la medida y prueba otra.", "nose": "Construyámoslo paso a paso. Luego prueba otra figura.", "fin": "Unidad terminada. Las propiedades quedan en la ficha."} },
    'trigonometria': { id: 'mara', nombre: 'Mara', animal: 'coneja', voces: {"prediccion": "Antes de ver, ¿qué esperas?", "coincide": "Coincide. Veamos de dónde sale.", "noCoincide": "No coincide. Recuperemos la convención.", "mira": "Paso a paso, conservando origen y sentido.", "regla": "Esta es la convención. Fíjate cuándo vale.", "ahora": "Un caso nuevo. Ubica primero el ángulo.", "acierto": "Correcto, con su signo.", "error": "Revisemos la convención en la solución y prueba otro.", "nose": "Veamos la solución con calma y prueba otro.", "fin": "Unidad terminada. La ficha guarda las convenciones."} },
    'razonamiento-matematico': { id: 'faro', nombre: 'Faro', animal: 'zorro', voces: {"prediccion": "¿Qué apuestas antes de ver?", "coincide": "Coincide. ¿Vale en todos los casos? Veamos.", "noCoincide": "No coincide. Busquemos el caso que lo explica.", "mira": "Veamos la jugada paso a paso.", "regla": "Esta es la regla. ¿Hay algún caso que la rompa?", "ahora": "Otro reto. Prueba las posibilidades.", "acierto": "Bien justificado.", "error": "Busquemos el contraejemplo en la solución y prueba otro.", "nose": "Vale decirlo. Mira la jugada y prueba otro.", "fin": "Unidad terminada. Las reglas quedan en la ficha."} },
    'razonamiento-verbal': { id: 'iris', nombre: 'Iris', animal: 'lechuza', voces: {"prediccion": "Antes de responder, ¿qué lectura propones?", "coincide": "Se sostiene. Veamos qué frase lo permite.", "noCoincide": "Esa lectura no se sostiene. Volvamos a la frase.", "mira": "Volvamos al texto, paso a paso.", "regla": "Esta es la regla. Señala qué frase la sostiene.", "ahora": "Otro texto. Lee primero lo que dice.", "acierto": "Bien sustentado en el texto.", "error": "Volvamos a las palabras exactas en la solución.", "nose": "Veamos qué dice el texto. Luego prueba otro.", "fin": "Unidad terminada. Las reglas quedan en la ficha."} },
  };

  // Qué expresión (E0–E9 de la guía) y qué pose (contrato de nucleo/mascota.js) toma el personaje en cada momento.
  // La expresión viaja como data-expresion para el futuro .riv; la pose es la que entiende el respaldo SVG de hoy.
  const ACTUACION = {
    llegada: { expresion: 'E0', pose: 'saluda' },
    consigna: { expresion: 'E1', pose: 'señala' },
    juego: { expresion: 'E0', pose: 'reposo' },
    prediccion: { expresion: 'E3', pose: 'espera' },
    coincide: { expresion: 'E7', pose: 'celebra' },
    'no-coincide': { expresion: 'E5', pose: 'acompaña' },
    mira: { expresion: 'E4', pose: 'reposo' },
    regla: { expresion: 'E6', pose: 'reposo' },
    'ahora-tu': { expresion: 'E1', pose: 'reposo' },
    acierto: { expresion: 'E7', pose: 'celebra' },
    error: { expresion: 'E8', pose: 'acompaña' },
    ayuda: { expresion: 'E8', pose: 'ayuda' },
    fin: { expresion: 'E6', pose: 'hito' },
    pausa: { expresion: 'E9', pose: 'reposo' },
  };

  // Topes de palabras (docs/escena-viva.md, regla 1, ampliada para la teoría en docs/teoria.md).
  const PRESUPUESTO = {
    titulo: 6, consigna: 25, voz: 16, pregunta: 40, opcion: 14, siFuera: 20,
    paso: 14, regla: 30, condicion: 22, historia: 70, enunciado: 40, solucion: 20, lectura: 12,
  };
  const MOMENTOS = ['juega', 'predice', 'mira', 'regla', 'ahora-tu'];
  // Texto plano de un texto con partes de ecuación (variables, subíndices, fracciones), para contar y revisar.
  const plano = x => Ecuacion.texto(x === undefined || x === null ? '' : x);
  const palabras = x => Kit.palabras(plano(x));

  // ---------- Registro (navegador) ----------
  const unidades = {};
  function unidad(def) {
    const p = problemas(def);
    if (p.length && root && root.console) root.console.warn(`Teoría ${def && def.unidad}:`, p);
    unidades[def.unidad] = def;
    if (root && typeof root.dispatchEvent === 'function' && typeof root.CustomEvent === 'function') {
      root.dispatchEvent(new root.CustomEvent('teoria:unidad', { detail: def.unidad }));
    }
    return def;
  }

  // ---------- Validación (Node y navegador) ----------
  // problemas(def, { temas, semillas }) → lista de textos; vacía si la unidad cumple el formato.
  //   temas: los temas de la unidad en el catálogo; si se dan, cada uno tiene que estar en alguna idea.
  function problemas(def, o = {}) {
    const out = [];
    const mal = (donde, que) => out.push(`${donde}: ${que}`);
    const tope = (donde, campo, texto) => {
      const n = palabras(texto);
      if (n > PRESUPUESTO[campo]) mal(donde, `${campo} de ${n} palabras (tope ${PRESUPUESTO[campo]})`);
    };
    const ecuacion = (donde, e) => { try { Ecuacion.revisar(e, donde); } catch (err) { out.push(err.message); } };
    if (!def || typeof def !== 'object') return ['la unidad no es un objeto'];
    if (!/^[a-z-]+\.[a-z0-9-]+$/.test(def.unidad || '')) mal('unidad', `id inválido «${def.unidad}»`);
    if (!/^\d+\.\d+\.\d+$/.test(def.version || '')) mal(def.unidad, 'falta version x.y.z');
    if (!Array.isArray(def.ideas) || def.ideas.length < 1) { mal(def.unidad, 'sin ideas'); return out; }
    if (def.ideas.length > 6) mal(def.unidad, `${def.ideas.length} ideas: el tope es 6 (divide la unidad en lecciones más chicas)`);
    if (def.historia) {
      if (!def.historia.texto) mal('historia', 'sin texto');
      else tope('historia', 'historia', def.historia.texto);
      if (def.historia.pregunta) tope('historia', 'voz', def.historia.pregunta);
    }
    const ids = new Set();
    for (const [k, idea] of def.ideas.entries()) {
      const d = `idea ${k + 1} (${idea && idea.id})`;
      if (!idea || !/^[a-z0-9-]+$/.test(idea.id || '')) { mal(d, 'id inválido'); continue; }
      if (ids.has(idea.id)) mal(d, 'id repetido');
      ids.add(idea.id);
      if (!idea.titulo) mal(d, 'sin título'); else tope(d, 'titulo', idea.titulo);
      if (!Array.isArray(idea.temas) || !idea.temas.length) mal(d, 'sin temas del catálogo');
      const pieza = nombre => {
        const id = nombre || idea.pieza;
        if (!id) { mal(d, 'sin pieza'); return null; }
        const P = Kit.piezas[id];
        if (!P) { mal(d, `pieza «${id}» no registrada (¿falta en requiere?)`); return null; }
        return P;
      };
      const dibuja = (donde, dib, nombre) => {
        const P = pieza(nombre);
        if (!P || !dib) { if (!dib) mal(donde, 'sin dibujo'); return; }
        try {
          const svg = P.dibujar(dib.datos, dib.estado || {});
          if (typeof svg !== 'string' || !svg.includes('<svg')) mal(donde, 'la pieza no devolvió un SVG');
          else if (/NaN|undefined|Infinity/.test(svg)) mal(donde, 'el SVG muestra NaN, undefined o Infinity');
          if (svg !== P.dibujar(dib.datos, dib.estado || {})) mal(donde, 'la pieza no es pura: el mismo estado dio otro SVG');
          const alt = P.alt(dib.datos);
          if (!alt || alt.length < 15) mal(donde, 'texto alternativo vacío o muy corto');
        } catch (err) { mal(donde, `la pieza falló: ${err.message}`); }
      };
      const opciones = (donde, ops) => {
        if (!Array.isArray(ops) || ops.length < 2 || ops.length > 5) { mal(donde, 'de 2 a 5 opciones'); return; }
        const buenas = ops.filter(x => x.correcta);
        if (buenas.length !== 1) mal(donde, `${buenas.length} opciones correctas (debe haber una)`);
        const vistos = new Set();
        for (const x of ops) {
          if (!x.id || vistos.has(x.id)) mal(donde, `opción sin id o repetida (${x.id})`);
          vistos.add(x.id);
          const txt = plano(x.texto);
          if (!txt.trim()) mal(donde, 'opción vacía');
          if (vistos.size && ops.filter(y => plano(y.texto) === txt).length > 1) mal(donde, `opción repetida «${txt}»`);
          tope(donde, 'opcion', x.texto);
          if (!x.correcta && !x.siFuera) mal(donde, `la opción ${x.id} no trae siFuera («sería cierto si…»)`);
          if (x.siFuera) tope(donde, 'siFuera', x.siFuera);
          if (/NaN|undefined|null|Infinity/.test(txt)) mal(donde, `opción con ${txt}`);
        }
      };

      // 1. Juega
      const j = idea.juega;
      if (!j) mal(d, 'sin juega (regla 3: se juega antes de cualquier pregunta)');
      else {
        if (!j.consigna) mal(d, 'juega sin consigna'); else tope(`${d} juega`, 'consigna', j.consigna);
        if (j.voz) tope(`${d} juega`, 'voz', j.voz);
        const ctr = j.controles || [];
        if (!ctr.length && typeof j.montar !== 'function') mal(d, 'juega sin controles');
        for (const c of ctr) {
          if (!c.id || !c.etiqueta) mal(`${d} juega`, 'control sin id o etiqueta');
          if (c.opciones) { if (!(c.opciones.length >= 2)) mal(`${d} juega`, `control ${c.id}: opciones de 2 o más`); continue; }
          if (!(c.max > c.min) || !(c.paso > 0)) mal(`${d} juega`, `control ${c.id}: min, max y paso`);
          else if (c.inicio < c.min || c.inicio > c.max) mal(`${d} juega`, `control ${c.id}: inicio fuera de rango`);
          if (c.color && !Ecuacion.COLORES.includes(c.color)) mal(`${d} juega`, `control ${c.id}: color ${c.color}`);
        }
        if (typeof j.dibujo !== 'function') mal(d, 'juega.dibujo(valores) debe ser una función');
        else {
          // Se dibujan el inicio y los extremos de cada control.
          const base = inicio(j);
          const casos = [base];
          for (const c of ctr) {
            if (c.opciones) for (const op of c.opciones) casos.push(Object.assign({}, base, { [c.id]: op.valor }));
            else casos.push(Object.assign({}, base, { [c.id]: c.min }), Object.assign({}, base, { [c.id]: c.max }));
          }
          for (const v of casos) {
            dibuja(`${d} juega ${JSON.stringify(v)}`, j.dibujo(v), j.pieza);
            if (typeof j.lectura === 'function') {
              const l = j.lectura(v);
              ecuacion(`${d} lectura`, l);
              tope(`${d} juega`, 'lectura', l);
              if (/NaN|undefined|Infinity/.test(Ecuacion.texto(l))) mal(`${d} lectura`, 'muestra NaN o undefined');
            }
          }
        }
        if (!(j.minimo >= 1)) mal(d, 'juega.minimo: cuántos casos distintos prueba el alumno antes de seguir (1 o más)');
      }

      // 2. Predice
      const p = idea.predice;
      if (!p) mal(d, 'sin predice');
      else {
        if (!p.pregunta) mal(d, 'predice sin pregunta'); else tope(`${d} predice`, 'pregunta', p.pregunta);
        opciones(`${d} predice`, p.opciones);
        dibuja(`${d} predice`, p.dibujo, p.pieza);
        dibuja(`${d} predice (revelar)`, p.revelar, p.pieza);
        if (p.voz) tope(`${d} predice`, 'voz', p.voz);
      }

      // 3. Mira
      const m = idea.mira;
      if (!m || !Array.isArray(m.pasos) || m.pasos.length < 2) mal(d, 'mira con 2 pasos o más');
      else {
        if (m.pasos.length > 7) mal(d, `mira con ${m.pasos.length} pasos (tope 7)`);
        for (const [i, paso] of m.pasos.entries()) {
          const dd = `${d} mira paso ${i + 1}`;
          if (!paso.texto) mal(dd, 'sin texto'); else tope(dd, 'paso', paso.texto);
          if (paso.ecuacion) ecuacion(dd, paso.ecuacion);
          dibuja(dd, { datos: m.datos, estado: Object.assign({}, m.base || {}, paso.estado || {}) }, m.pieza);
        }
      }

      // 4. Regla
      const r = idea.regla;
      if (!r || !r.texto) mal(d, 'sin regla');
      else {
        tope(`${d} regla`, 'regla', r.texto);
        if (r.ecuacion) ecuacion(`${d} regla`, r.ecuacion);
        if (!r.condicion) mal(d, 'regla sin condición (cuándo vale)'); else tope(`${d} regla`, 'condicion', r.condicion);
      }

      // 5. Ahora tú
      const a = idea.ahoraTu;
      if (!a || typeof a.generar !== 'function') mal(d, 'ahoraTu.generar(semilla) debe ser una función');
      else {
        const vistos = new Set();
        const N = o.semillas || 40;
        for (let s = 0; s < N; s++) {
          let c;
          try { c = a.generar(s); } catch (err) { mal(`${d} ahoraTu semilla ${s}`, `falló: ${err.message}`); continue; }
          const dd = `${d} ahoraTu semilla ${s}`;
          if (!c || !c.pregunta) { mal(dd, 'sin pregunta'); continue; }
          tope(dd, 'enunciado', c.pregunta);
          opciones(dd, c.opciones);
          if (c.dibujo) dibuja(dd, c.dibujo, a.pieza);
          if (!c.solucion || !c.solucion.texto) mal(dd, 'sin solución');
          else { tope(dd, 'solucion', c.solucion.texto); if (c.solucion.ecuacion) ecuacion(dd, c.solucion.ecuacion); }
          if (/NaN|undefined|Infinity/.test(plano(c.pregunta))) mal(dd, 'la pregunta muestra NaN o undefined');
          vistos.add(plano(c.pregunta) + JSON.stringify((c.opciones || []).map(x => plano(x.texto))));
          if (out.length > 60) break;
        }
        if (vistos.size < Math.min(5, N)) mal(d, `ahoraTu da solo ${vistos.size} casos distintos en ${N} semillas (se necesitan 5 o más)`);
      }
    }
    if (!['borrador', 'completa'].includes(def.estado)) mal(def.unidad, 'estado: «borrador» o «completa»');
    if (o.temas) {
      const cubiertos = new Set(def.ideas.flatMap(i => i.temas || []));
      // Una unidad «completa» cubre todos los temas del catálogo; un borrador puede dejar temas para después.
      if (def.estado === 'completa') for (const t of o.temas) if (!cubiertos.has(t)) mal(def.unidad, `el tema del catálogo «${t}» no está en ninguna idea`);
      for (const t of cubiertos) if (!o.temas.includes(t)) mal(def.unidad, `«${t}» no es un tema del catálogo de esta unidad`);
    }
    return out;
  }

  // Valores iniciales de los controles de juega.
  function inicio(juega) {
    const v = {};
    for (const c of (juega && juega.controles) || []) v[c.id] = c.opciones ? (c.inicio !== undefined ? c.inicio : c.opciones[0].valor) : c.inicio;
    return v;
  }

  // Ajusta un valor de control a su paso y rango (lo que dibuja la pieza es siempre un valor limpio).
  function ajustar(c, v) {
    if (c.opciones) return c.opciones.some(o => o.valor === v) ? v : c.opciones[0].valor;
    return Kit.respuesta.ajustar(+v, c.paso, c.min, c.max);
  }

  // Baraja las opciones con la semilla del caso, para que la correcta no quede siempre en el mismo lugar.
  function barajar(ops, semilla) {
    let a = (semilla * 2654435761) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const x = ops.slice();
    for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
    return x;
  }

  return { unidad, unidades, problemas, plano, inicio, ajustar, barajar, PERSONAJES, ACTUACION, PRESUPUESTO, MOMENTOS, palabras };
});
