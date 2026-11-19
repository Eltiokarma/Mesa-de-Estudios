/*
 * Teoría de «Verdades y mentiras» (razonamiento-matematico.verdades-y-mentiras). Molde: docs/teoria.md y
 * docs/molde-unidad.md. Etapa 6 del plan de calidad (docs/plan-calidad.md §7), tercera unidad de la rama «Lógica», después
 * de Razonamiento deductivo y Ordenamiento de información. Propuesta: docs/etapa6/propuesta-razonamiento-matematico.md
 * (Gerson delegó el criterio y revisa después). Seis ideas: 1. suposicion «Suponer y comprobar» (el juego de las
 * tarjetas) · 2. negar-bien «Lo contrario de “todos”» (la lista de notas del simulacro) · 3. contradictorias «Dos frases
 * que se contradicen» (el vidrio roto) · 4. solo-uno-veraz «Cuando solo uno dice la verdad» (la pelota escondida) ·
 * 5. verdad-y-mentira «Una verdad y una mentira» (el podio) · 6. cuantos-mienten «¿Cuántos mienten?» (la última ronda de
 * tarjetas). Los ids publicados (suposicion, contradictorias, negar-bien) no cambian; el orden sí.
 * Público: 5.º de secundaria y preuniversitario.
 *
 * Paleta de deducción (la de la rama Lógica, decisión de Gerson del 17 nov para Razonamiento deductivo): un papel fijo
 * por color en la teoría, los ejemplos, la escena y la práctica.
 *   tinta ....... lo que amarra: personas, frases, condiciones («solo uno miente»), el objeto, el choque (✗ «choca»)
 *   o naranja ... lo primero: lo que se supone (la tarjeta volteada, el culpable, la mochila, la frase supuesta cierta,
 *                 cuántos mienten)
 *   i turquesa .. lo segundo: lo que sale de suponer («cierta» o «falsa»)
 *   f violeta ... lo seguro y lo pedido, ya comprobado (antes de comprobar, en tinta o «?»)
 *   gris ........ lo descartado: la suposición que choca (tinta al 55 %, con su raya)
 *   Sin verde ni carmín en toda la unidad. La pieza rm-veraz fija esos papeles y verdades-y-mentiras.test.js falla si
 *   aparece verde o carmín, o si una figura de antes de responder trae violeta.
 * Letras: ninguna de fórmula (letras: {}). VERAZ y MIENTE son lo que dice la tarjeta; «cierta» y «falsa», lo que vale una
 * frase (nunca «verdadera», para no mezclarla con «veraz»). Las personas nunca se abrevian por su inicial: A a E son solo
 * las alternativas de los ejemplos tipo examen (campo alternativas; la letra correcta, 6 veces cada una en los 30).
 * «Choque» y «suponer» los estrena esta unidad (Ordenamiento los evitó a propósito).
 * Errores: códigos RMP de docs/investigacion/codigos-rm-procesos.md, todos hipótesis (no hay datos de alumnos): RMP72
 * quedarse con una suposición que choca, RMP77 lo posible por lo seguro, RMP78 creer que no se deduce nada, RMP144
 * creerle a una frase que cualquiera diría, RMP145 confundir «Yo digo la verdad» con «Yo miento», RMP146 negar «todos» con
 * «ninguno», RMP147 negar «más de k» como «menos de k», RMP148 no ver el par que se contradice, RMP149 creerle a quien
 * está fuera del par, RMP150 creerle o negarle las dos frases a quien dice una verdad y una mentira, RMP151 creerle a la
 * frase sobre cuántos mienten.
 * Historia: Boole (SEP). Compañero: Faro (zorro).
 *
 * Ficha de tarea (diseno-y-animacion), idea 1:
 *   Promesa: decidir quién es veraz y quién mentiroso suponiendo tarjetas y revisando cada frase.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin conexión en el aula.
 *   Resultado observable: dice qué frase choca con qué tarjeta y cuál suposición queda sin choques.
 *   Orden de atención: 1.º las tarjetas y los globos · 2.º lo que vale cada frase y si encaja · acción: voltear tarjetas.
 *   Estados: juego sin tocar · tarjetas volteadas · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿cómo sé quién miente si todos hablan?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f0 = x => Kit.formatear(x, 0);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  function opcionesTexto(correcta, distractores, max = 4) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (!d || vistos.has(d.texto) || ops.length >= max) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  }
  const lista = (xs, y = 'y') => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}` : xs.join(''));
  const VZ = 'rm-veraz';
  const F = t => ({ v: 'c-f', t });   // lo seguro y lo pedido, en violeta
  const O = t => ({ v: 'c-o', t });   // lo que se supone, en naranja
  const I = t => ({ v: 'c-i', t });   // lo que sale de suponer, en turquesa
  const vf = b => (b ? 'cierta' : 'falsa');
  const ES = b => (b ? 'VERAZ' : 'MIENTE');
  const CHOCA = { t: '✗ choca' }, ENCAJA = { t: 'encaja' };

  // ---------- Veraces y mentirosos (ideas 1 y 6) ----------
  // Una frase es { de: 'Ana', f: { m: 'Beto' } | { v: 'Beto' } | { mm: [x, y] } | { vv: [x, y] } | { yo: 'V' | 'M' } |
  // { k: n } | { alMenos: n } }: «Beto miente», «Beto dice la verdad», «x y y mienten», «x y y dicen la verdad», «Yo digo la
  // verdad» o «Yo miento», «Aquí mienten exactamente n», «Aquí mienten por lo menos n». v: { nombre: true si es veraz }.
  const NUMS = ['ninguno', 'uno', 'dos', 'tres', 'cuatro', 'cinco'];
  function textoFrase(de, f, gente) {
    if (f.yo) return f.yo === 'V' ? 'Yo digo la verdad' : 'Yo miento';
    if (f.m) return `${f.m} miente`;
    if (f.v) return `${f.v} dice la verdad`;
    if (f.k !== undefined) return f.k === gente.length ? `Aquí mentimos ${gente.length === 2 ? 'los dos' : `los ${NUMS[f.k]}`}` : `Aquí ${f.k === 1 ? 'miente' : 'mienten'} exactamente ${NUMS[f.k]}`;
    if (f.alMenos !== undefined) return `Aquí ${f.alMenos === 1 ? 'miente' : 'mienten'} por lo menos ${NUMS[f.alMenos]}`;
    const xs = f.mm || f.vv, mienten = !!f.mm;
    if (xs.includes(de)) {
      if (gente.length === 2) return mienten ? 'Los dos mentimos' : 'Los dos decimos la verdad';
      return `${xs.find(x => x !== de)} y yo ${mienten ? 'mentimos' : 'decimos la verdad'}`;
    }
    return `${xs[0]} y ${xs[1]} ${mienten ? 'mienten' : 'dicen la verdad'}`;
  }
  function valorFrase(de, f, v) {
    if (f.yo) return f.yo === 'V' ? v[de] : !v[de];
    if (f.m) return !v[f.m];
    if (f.v) return v[f.v];
    if (f.mm) return f.mm.every(x => !v[x]);
    if (f.vv) return f.vv.every(x => v[x]);
    const mienten = Object.values(v).filter(x => !x).length;
    if (f.k !== undefined) return mienten === f.k;
    return mienten >= f.alMenos;
  }
  const suposiciones = gente => Array.from({ length: 2 ** gente.length }, (_, m) => Object.fromEntries(gente.map((x, i) => [x, !((m >> (gente.length - 1 - i)) & 1)])));
  const encaja = (frases, v) => frases.every(x => valorFrase(x.de, x.f, v) === v[x.de]);
  const quedanKK = (gente, frases) => suposiciones(gente).filter(v => encaja(frases, v));
  // La primera frase que choca con una suposición: quién la dice y qué sale.
  const chocaEn = (frases, v) => frases.find(x => valorFrase(x.de, x.f, v) !== v[x.de]);
  const D_TARJ = 'Cada uno es veraz o mentiroso. El veraz siempre dice la verdad; el mentiroso siempre miente.';
  const dicho = (x, gente) => `${x.de} dice: «${textoFrase(x.de, x.f, gente)}».`;
  // Quiénes dicen la verdad, dicho en palabras («Solo Ana», «Ana y Ciro», «Nadie», «Los tres»).
  function veracesTxt(gente, v) {
    const q = gente.filter(x => v[x]);
    if (!q.length) return 'Nadie';
    if (q.length === gente.length) return gente.length === 2 ? 'Los dos' : `Los ${NUMS[gente.length]}`;
    return q.length === 1 ? `Solo ${q[0]}` : lista(q);
  }
  // «Solo Ana dice la verdad», «Ana y Ciro mienten», «Nadie miente».
  const conVerbo = (t, mienten) => `${t} ${/^(Solo|Nadie)/.test(t) ? (mienten ? 'miente' : 'dice la verdad') : (mienten ? 'mienten' : 'dicen la verdad')}`;
  const mienteTxt = (gente, v) => { const q = gente.filter(x => !v[x]); return !q.length ? 'Nadie' : q.length === gente.length ? (gente.length === 2 ? 'Los dos' : `Los ${NUMS[gente.length]}`) : q.length === 1 ? `Solo ${q[0]}` : lista(q); };
  // Por qué una suposición no vale: la primera frase que choca (cuenta hecha, no frase genérica).
  function porQueChoca(frases, v) {
    const x = chocaEn(frases, v), val = valorFrase(x.de, x.f, v);
    return `Con esas tarjetas, la frase de ${x.de} sale ${vf(val)} y ${x.de} ${v[x.de] ? 'es veraz' : 'miente'}: choca.`;
  }
  // Los renglones de quien habla: su tarjeta (boca abajo, supuesta o dada), su frase y, si se pide, lo que vale y si encaja.
  function hablaKK(gente, frases, o = {}) {
    return gente.filter(q => o.todos !== false || frases.some(x => x.de === q)).map(q => {
      const x = frases.find(y => y.de === q), h = { quien: q, dice: x ? [textoFrase(q, x.f, gente)] : [] };
      if (o.tarjetas !== false) {
        h.tarjeta = o.v ? (o.v[q] ? 'V' : 'M') : o.dadas && o.dadas[q] !== undefined ? (o.dadas[q] ? 'V' : 'M') : '?';
        h.papelTarjeta = o.v ? (o.seguro ? 'seguro' : 'supuesto') : 'amarra';
      }
      if (o.toque) h.toque = o.toque[q];
      if (o.v && x && o.valores !== false) {
        const val = valorFrase(q, x.f, o.v);
        h.valores = [{ t: vf(val), papel: 'sale' }];
        h.estado = val === o.v[q] ? ENCAJA : CHOCA;
      }
      return h;
    });
  }
  const tablaCasos = (gente, frases, casos, o = {}) => ({
    titulo: o.titulo, columnas: gente.concat(['Encaja']),
    filas: casos.map(v => {
      const ok = encaja(frases, v);
      return { celdas: gente.map(x => ({ t: ES(v[x]), papel: 'supuesto' })).concat([ok ? ENCAJA : CHOCA]), fuera: ok ? undefined : (o.tachar === undefined ? true : o.tachar), seguro: ok && o.seguro !== undefined ? o.seguro : undefined, desde: o.desde };
    }),
  });

  // ---------- Idea 1: suponer y comprobar (fase 2) ----------
  // Objeto de la primera pantalla: el juego de las tarjetas en la hora de tutoría (rm-veraz, escena «tarjetas», dibujo de
  // prueba). Ana y Beto tienen su tarjeta boca abajo y cada uno dice una frase. Cambia: la tarjeta que se supone de cada
  // uno. · Permanece: las dos frases. · Progresa: cuáles frases encajan. · Se reserva: una frase que cualquiera diría
  // («Yo digo la verdad»: la predicción; el juego solo muestra frases que deciden). · Debe verse: una suposición vale si
  // ninguna frase choca con la tarjeta de quien la dice.
  // Todo lo que se ve sale de valorFrase y encaja: ningún «cierta», «falsa» ni «choca» se escribe a mano.
  const J1 = ['Ana', 'Beto'];
  const FJ1 = [{ de: 'Ana', f: { m: 'Beto' } }, { de: 'Beto', f: { mm: ['Ana', 'Beto'] } }];
  const SOL_J1 = quedanKK(J1, FJ1);
  if (SOL_J1.length !== 1) throw new Error('juego de la idea 1: debe encajar una sola suposición');
  const vJ1 = val => ({ Ana: val.a === 'V', Beto: val.b === 'V' });
  function lecturaJ1(val) {
    const v = vJ1(val), x = chocaEn(FJ1, v);
    if (!x) return ['Las dos frases encajan con sus tarjetas: ', 'sin choque'];
    return [`${x.de} ${v[x.de] ? 'es veraz' : 'miente'}, pero su frase sale ${vf(valorFrase(x.de, x.f, v))}: choca`];
  }
  // La predicción: Ciro dice «Yo digo la verdad». Encaja con las dos tarjetas: la frase no decide.
  const FP1 = [{ de: 'Ciro', f: { yo: 'V' } }], FM1 = [{ de: 'Dina', f: { yo: 'M' } }];
  const QP1 = quedanKK(['Ciro'], FP1), QM1 = quedanKK(['Dina'], FM1);
  if (QP1.length !== 2 || QM1.length !== 0) throw new Error('predicción de la idea 1: las cuentas no cuadran');
  const filaUno = (q, fr, v, desde) => ({ celdas: [q, { t: ES(v[q]), papel: 'supuesto' }, { t: vf(valorFrase(q, fr.f, v)), papel: 'sale' }, encaja([fr], v) ? ENCAJA : CHOCA], fuera: encaja([fr], v) ? undefined : desde + 1, desde });
  const casosP1 = (conDina, d0 = 0) => ({ columnas: ['Quién', 'Tarjeta', 'Su frase', 'Encaja'],
    filas: [filaUno('Ciro', FP1[0], { Ciro: true }, d0 ? 1 : 0), filaUno('Ciro', FP1[0], { Ciro: false }, d0 ? 2 : 0)]
      .concat(conDina ? [filaUno('Dina', FM1[0], { Dina: true }, d0 ? 4 : 0), filaUno('Dina', FM1[0], { Dina: false }, d0 ? 4 : 0)] : []) });

  // ---------- Casos de «Así se resuelve» y «Ahora tú» de la idea 1 ----------
  // Ningún par empieza con la misma letra. Sin Ana ni Beto: son los del juego y de la regla (sesión, 19 nov: «Así se
  // resuelve» y «Ahora tú» son otros casos, no la misma pareja con otra frase).
  const NOMBRES = ['Ciro', 'Dina', 'Eva', 'Fito', 'Gaby', 'Hugo', 'Rosa', 'Nora'];
  const INTROS = [
    'En la hora de tutoría juegan con tarjetas boca abajo, VERAZ o MIENTE.',
    'En el juego de las tarjetas, cada uno saca una sin mostrarla: VERAZ o MIENTE.',
    'Otra ronda del juego de las tarjetas: cada uno tiene VERAZ o MIENTE.',
  ];
  function frasePosible(r, de, gente) {
    const otros = gente.filter(x => x !== de), x = r.elegir(otros), y = r.elegir(otros.filter(z => z !== x).concat([de]));
    return r.elegir([{ m: x }, { m: x }, { v: x }, { mm: [x, y].sort((a, b) => gente.indexOf(a) - gente.indexOf(b)) }, { vv: [x, y].sort((a, b) => gente.indexOf(a) - gente.indexOf(b)) }]);
  }
  // Un acertijo de k personas con `quedan` suposiciones que encajan (y, si quedan 2, alguien con la misma tarjeta en las dos).
  function casoKK(r, k, quedan = 1) {
    for (let t = 0; t < 600; t++) {
      const gente = r.barajar(NOMBRES).slice(0, k).sort((a, b) => NOMBRES.indexOf(a) - NOMBRES.indexOf(b));
      const frases = gente.map(de => ({ de, f: frasePosible(r, de, gente) }));
      if (new Set(frases.map(x => textoFrase(x.de, x.f, gente))).size < k) continue;
      const q = quedanKK(gente, frases);
      if (q.length !== quedan) continue;
      const fijos = gente.filter(x => q.every(v => v[x] === q[0][x]));
      if (quedan === 2 && fijos.length !== 1) continue;
      return { gente, frases, q, sol: q[0], fijos };
    }
    return null;
  }
  // La cadena: con la tarjeta supuesta de una persona, lo que obligan las frases una tras otra (sin bifurcar).
  function cadena(gente, frases, quien, val) {
    const v = { [quien]: val }, pasos = [], sabe = z => v[z] !== undefined;
    for (let vuelta = 0; vuelta < 8 && !gente.every(sabe); vuelta++) {
      let avanzo = false;
      const pone = (z, b, x, deLaFrase) => { v[z] = b; pasos.push({ por: x, sale: z, deLaFrase }); avanzo = true; };
      for (const x of frases) {
        const xs = x.f.mm || x.f.vv, uno = x.f.m || x.f.v;
        if (sabe(x.de)) {
          // La tarjeta de quien habla dice si su frase es cierta; de ahí sale la tarjeta de quien nombra.
          if (uno && !sabe(uno)) pone(uno, x.f.m ? !v[x.de] : v[x.de], x);
          if (xs) {
            const quiere = Boolean(x.f.vv), sin = xs.filter(z => !sabe(z));
            if (v[x.de]) sin.forEach(z => pone(z, quiere, x));
            else if (sin.length === 1 && xs.filter(z => v[z] === quiere).length === 1) pone(sin[0], !quiere, x);
          }
        } else {
          // Quien habla sin tarjeta todavía: si su frase ya se puede evaluar, su tarjeta sale de lo que vale.
          const nombrados = uno ? [uno] : xs || [];
          if (nombrados.length && !nombrados.includes(x.de) && nombrados.every(sabe)) pone(x.de, valorFrase(x.de, x.f, v), x, true);
        }
      }
      if (!avanzo) break;
    }
    const completo = gente.every(sabe);
    return { v, pasos, completo, choque: completo ? chocaEn(frases, v) : null };
  }
  // Un acertijo para «Así se resuelve»: alguien cuya tarjeta, supuesta de las dos maneras, arma la cadena completa.
  function casoResuelve(r) {
    for (let t = 0; t < 200; t++) {
      const c = casoKK(r, 3, 1);
      if (!c) continue;
      for (const p of c.gente) {
        const a = cadena(c.gente, c.frases, p, true), b = cadena(c.gente, c.frases, p, false);
        if (a.completo && b.completo && a.pasos.length <= 3 && b.pasos.length <= 3) return Object.assign(c, { p, ramas: [a, b] });
      }
    }
    return null;
  }
  // «Supón que Ana es veraz: Beto miente (frase de Ana) y Ciro es veraz (frase de Beto). La frase de Ciro sale falsa: choca.»
  function textoRama(c, rama, val) {
    const es = (z, b) => `${z} ${b ? 'es veraz' : 'miente'}`;
    const partes = rama.pasos.map(p => `${es(p.sale, rama.v[p.sale])} (${p.deLaFrase ? 'por lo que vale su frase' : `frase de ${p.por.de}`})`);
    const cabeza = `Si ${es(c.p, val)}: ${lista(partes)}.`;
    if (rama.choque) { const x = rama.choque; return `${cabeza} ${es(x.de, rama.v[x.de])} y su frase sale ${vf(valorFrase(x.de, x.f, rama.v))}: choca.`; }
    return `${cabeza} Las tres frases encajan.`;
  }

  const suposicion = {
    id: 'suposicion',
    titulo: 'Suponer y comprobar',
    pregunta: '¿Cómo se sabe quién miente si todos hablan?',
    temas: ['Personajes que siempre mienten o dicen la verdad', 'Método de suposición'],
    pieza: VZ,
    aprendizaje: 'Se supone la tarjeta y se revisa cada frase: el veraz dice algo cierto, el mentiroso algo falso; lo que choca se descarta.',
    actividad: 'Voltear las tarjetas y revisar si cada frase encaja con quien la dice.',
    // Lee: el juego de las tarjetas, las dos capas de cada frase y qué es suponer. No dice qué pasa con una frase que
    // cualquiera diría (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'El juego de las tarjetas', texto: 'En la hora de tutoría, el profesor reparte tarjetas boca abajo. Quien saca VERAZ siempre dice la verdad; quien saca MIENTE, siempre miente. Nadie muestra la suya.',
          pieza: VZ, dibujo: { datos: { escena: 'tarjetas', panel: false, habla: hablaKK(J1, FJ1) }, estado: {} } },
        { titulo: 'Dos cosas en cada frase', texto: 'Ante cada frase hay dos preguntas distintas: qué tarjeta tiene quien habla y si lo que dice es cierto. El veraz solo dice cosas ciertas; el mentiroso, solo falsas.' },
        { titulo: 'Suponer', texto: 'Suponer es dar un caso por cierto para probarlo: «supongo que Ana tiene VERAZ». Después revisas cada frase. Si una no encaja con la tarjeta de quien la dice, hay un choque.' },
        { titulo: 'Qué mirar al jugar', texto: 'Voltea la tarjeta de Ana y la de Beto. A la derecha verás si cada frase sale cierta o falsa, y si encaja o choca. Busca la suposición sin ningún choque.' },
      ],
    },
    juega: {
      pieza: VZ,
      consigna: 'En la hora de tutoría, Ana y Beto tienen su tarjeta boca abajo. Ana dice: «Beto miente». Beto dice: «Los dos mentimos».',
      mision: {
        texto: 'Voltea las dos tarjetas hasta que ninguna frase choque.',
        logrado: v => encaja(FJ1, vJ1(v)),
        bien: [`Ana ${ES(SOL_J1[0].Ana)} y Beto ${ES(SOL_J1[0].Beto)}: las dos frases encajan. Las otras ${f0(suposiciones(J1).length - 1)} suposiciones chocan.`],
      },
      voz: 'Primero la tarjeta, después la frase: ¿encajan?',
      leyenda: [
        { s: O('VERAZ / MIENTE'), t: 'la tarjeta que supones' },
        { s: I('cierta / falsa'), t: 'lo que vale su frase' },
        { s: '✗ choca', t: 'la frase no va con su tarjeta' },
        { s: 'encaja', t: 'la frase sí va con su tarjeta' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Tarjeta de Ana', opciones: [{ valor: 'V', texto: 'Veraz' }, { valor: 'M', texto: 'Miente' }] },
        { id: 'b', etiqueta: 'Tarjeta de Beto', opciones: [{ valor: 'V', texto: 'Veraz' }, { valor: 'M', texto: 'Miente' }] },
      ],
      dibujo: val => ({ datos: { escena: 'tarjetas', habla: hablaKK(J1, FJ1, { v: vJ1(val), toque: { Ana: 'a', Beto: 'b' } }) }, estado: {} }),
      lectura: val => lecturaJ1(val),
      minimo: suposiciones(J1).length,
    },
    predice: {
      pregunta: 'Otro día, Ciro mira su tarjeta y dice: «Yo digo la verdad». ¿Qué se sabe de la tarjeta de Ciro?',
      datos: [D_TARJ],
      voz: 'Prueba las dos tarjetas de Ciro, una por una.',
      opciones: [
        { id: 'c', texto: 'Nada: un veraz y un mentiroso dirían lo mismo', correcta: true },
        { id: 'cree', texto: 'Que tiene VERAZ', error: 'RMP144',
          siFuera: 'Un veraz lo diría, pero un mentiroso también: para él, decir «digo la verdad» es mentir.' },
        { id: 'desconfia', texto: 'Que tiene MIENTE', error: 'RMP144',
          siFuera: 'Un mentiroso lo diría, pero un veraz también: en su boca, la frase es cierta.' },
        { id: 'nadie', texto: 'Nadie puede decir esa frase', error: 'RMP145',
          siFuera: 'Eso pasa con «Yo miento». «Yo digo la verdad» encaja con las dos tarjetas.' },
      ],
      // El planteamiento lleva la tabla de las dos tarjetas por probar, vacía: así no queda aire y no adelanta nada.
      dibujo: { datos: { escena: 'tarjetas', habla: hablaKK(['Ciro'], FP1), casos: { columnas: ['Quién', 'Tarjeta', 'Su frase', 'Encaja'],
        filas: [true, false].map(b => ({ celdas: ['Ciro', { t: ES(b), papel: 'supuesto' }, '?', '?'] })) } }, estado: {} },
      revelar: { datos: { escena: 'tarjetas', habla: hablaKK(['Ciro'], FP1), casos: casosP1(false) }, estado: {} },
      coincide: `Coincide: las ${f0(QP1.length)} suposiciones encajan. Esa frase sola no decide la tarjeta.`,
      noCoincide: 'Revisemos: un veraz diría «digo la verdad», y un mentiroso, para mentir, también.',
    },
    mira: {
      pieza: VZ,
      datos: { escena: 'tarjetas', habla: hablaKK(['Ciro'], FP1).concat(hablaKK(['Dina'], FM1).map(h => Object.assign(h, { desde: 4 }))), casos: casosP1(true, 1) },
      voz: 'Una tarjeta, después la otra; mira qué queda en pie.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Supón que Ciro tiene VERAZ: «digo la verdad» sale cierta. Encaja.' },
        { estado: { corte: 2 }, texto: 'Supón que tiene MIENTE: la frase sale falsa, como debe. También encaja.' },
        { estado: { corte: 3 }, texto: ['Quedan ', String(QP1.length), ' suposiciones en pie: la frase no dice qué tarjeta tiene.'] },
        { estado: { corte: 4 }, texto: 'Con «Yo miento» pasa lo contrario: las dos tarjetas chocan.' },
        { estado: { corte: 5 }, texto: 'Por eso nadie dice «Yo miento». Para decidir, hace falta una frase que choque.' },
      ],
    },
    regla: {
      texto: 'Supón la tarjeta de cada uno y revisa cada frase: el veraz dice algo cierto y el mentiroso, algo falso. Si una frase choca, esa suposición se descarta.',
      ecuacion: [{ llave: ['VERAZ'], nota: 'tarjeta supuesta', color: 'c-o' }, ': su frase es ', { llave: ['cierta'], nota: 'lo que sale', color: 'c-i' },
        '   ·   ', { llave: ['MIENTE'], nota: 'tarjeta supuesta', color: 'c-o' }, ': su frase es ', { llave: ['falsa'], nota: 'lo que sale', color: 'c-i' }],
      condicion: 'cada uno miente siempre o dice siempre la verdad. Seguro: lo que vale en todas las suposiciones que quedan.',
      voz: 'Una suposición vale solo si ninguna frase choca.',
      // Dibujo propio de la regla: las cuatro suposiciones del juego, lado a lado (lo que se compara se ve junto).
      dibujo: { pieza: VZ, datos: { habla: hablaKK(J1, FJ1, { tarjetas: false }), casos: tablaCasos(J1, FJ1, suposiciones(J1), { seguro: true }) }, estado: {} },
    },
    ejemplos: null,   // se completa abajo (EJEMPLOS_SUP)
    // Así se resuelve: tres personas; se supone la tarjeta de una, se sigue la cadena que obligan las frases y se descarta
    // la rama que choca. Cada paso de la cadena sale de cadena() y el choque, de chocaEn: nada se escribe a mano.
    // «Ahora tú» pide otras cosas: dos personas, quién dice la verdad entre tres, qué tarjeta es segura y el de cuatro.
    resuelve: {
      pieza: VZ,
      generar(s) {
        const r = azar(s + 900), c = casoResuelve(r);
        const [a, b] = c.ramas, buena = a.choque ? b : a, mala = a.choque ? a : b;
        return {
          enunciado: `${INTROS[s % INTROS.length]} Hablan ${lista(c.gente)}. ¿Quiénes dicen la verdad?`,
          datos: [D_TARJ, ...c.frases.map(x => dicho(x, c.gente))],
          dibujo: { datos: { escena: 'tarjetas', habla: hablaKK(c.gente, c.frases) }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden quiénes dicen la verdad: de cada uno hay que saber si tiene VERAZ o MIENTE.' },
            { tipo: 'datos', texto: `Son tres y cada uno tiene una de dos tarjetas: hay ${f0(suposiciones(c.gente).length)} suposiciones.`, ecuacion: [`2 × 2 × 2 = ${f0(suposiciones(c.gente).length)}`] },
            { tipo: 'regla', texto: `Supongo la tarjeta de ${c.p} y sigo lo que obliga cada frase. Si una frase choca, esa suposición se descarta.` },
            { tipo: 'aplica', texto: textoRama(c, mala, mala === a), dibujo: { datos: { escena: 'tarjetas', habla: hablaKK(c.gente, c.frases, { v: mala.v }) }, estado: {} } },
            { tipo: 'aplica', texto: textoRama(c, buena, buena === a), dibujo: { datos: { escena: 'tarjetas', habla: hablaKK(c.gente, c.frases, { v: buena.v, seguro: true }) }, estado: {} } },
            { tipo: 'sentido', texto: `Las dos tarjetas de ${c.p} quedaron probadas y solo una encaja: la respuesta no depende de por dónde empecé.` },
          ],
          respuesta: [F(conVerbo(veracesTxt(c.gente, c.sol), false))],
        };
      },
    },
    // Ahora tú, por tipos (semilla % 4): 0 dos personas, ¿quiénes dicen la verdad?; 1 tres personas, lo mismo; 2 tres
    // personas con dos suposiciones en pie, ¿qué tarjeta tiene X? (lo seguro); 3 nivel examen, cuatro personas, ¿quiénes
    // mienten? Cada distractor es otra suposición y su explicación dice la frase exacta que choca (porQueChoca).
    ahoraTu: {
      pieza: VZ,
      voz: 'Supón una tarjeta y sigue lo que obliga cada frase.',
      generar(s) {
        const r = azar(s), tipo = s % 4, k = tipo === 0 ? 2 : tipo === 3 ? 4 : 3;
        const c = casoKK(r, k, tipo === 2 ? 2 : 1);
        const intro = INTROS[Math.floor(s / 4) % INTROS.length], datos = [D_TARJ, ...c.frases.map(x => dicho(x, c.gente))];
        const dibujo = { datos: { escena: 'tarjetas', habla: hablaKK(c.gente, c.frases) }, estado: {} };
        const solDib = v => ({ datos: { escena: 'tarjetas', habla: hablaKK(c.gente, c.frases, { v, seguro: true }) }, estado: {} });
        const lejos = v => c.gente.filter(x => v[x] !== c.sol[x]).length;
        if (tipo === 2) {
          const x = c.fijos[0], es = c.sol[x];
          const ops = [{ id: 'c', texto: `${x} tiene ${ES(es)}`, correcta: true },
            { id: 'otra', texto: `${x} tiene ${ES(!es)}`, error: 'RMP72', siFuera: porQueChoca(c.frases, Object.assign({}, c.q[0], { [x]: !es })).replace('Con esas tarjetas', `Con ${x} ${es ? 'mintiendo' : 'veraz'} y los demás como antes`) },
            { id: 'nose', texto: `No se sabe la tarjeta de ${x}`, error: 'RMP78', siFuera: `Quedan ${f0(c.q.length)} suposiciones que encajan, pero en las dos ${x} tiene ${ES(es)}.` }];
          const otro = c.gente.find(z => z !== x), po = c.q[0][otro];
          ops.push({ id: 'posible', texto: `${otro} tiene ${ES(po)}`, error: 'RMP77', siFuera: `Pasa en una de las ${f0(c.q.length)} suposiciones que encajan; en la otra, ${otro} tiene ${ES(!po)}.` });
          return { pregunta: `${intro} Hablan ${lista(c.gente)}. ¿Qué es seguro?`, datos, dibujo, opciones: ops,
            solucion: { texto: `Encajan ${f0(c.q.length)} suposiciones y en las dos ${x} tiene ${ES(es)}.`, dibujo: { datos: { escena: 'tarjetas', habla: hablaKK(c.gente, c.frases, { tarjetas: false }), casos: tablaCasos(c.gente, c.frases, c.q, { seguro: true }) }, estado: {} } } };
        }
        const txt = tipo === 3 ? mienteTxt : veracesTxt;
        const otras = suposiciones(c.gente).filter(v => !encaja(c.frases, v)).sort((p, q) => lejos(p) - lejos(q) || r() - 0.5);
        const ops = opcionesTexto(txt(c.gente, c.sol), otras.map((v, i) => ({ id: `s${i}`, texto: txt(c.gente, v), error: 'RMP72', siFuera: porQueChoca(c.frases, v) })), tipo === 0 ? 4 : 5);
        return { pregunta: `${intro} Hablan ${lista(c.gente)}. ¿Quiénes ${tipo === 3 ? 'mienten' : 'dicen la verdad'}?`, datos, dibujo, opciones: ops,
          solucion: { texto: `Es la única suposición en que ninguna frase choca. ${conVerbo(txt(c.gente, c.sol), tipo === 3)}.`, dibujo: solDib(c.sol) } };
      },
    },
  };

  // ---------- Ejemplos resueltos de «Suponer y comprobar» (pestaña «Ejemplos»; molde §3) ----------
  // Cada uno se resolvió aparte con un script que no usa el código de la unidad (scratchpad e6-rm/kk.py y kk2.py: todas las
  // suposiciones de tarjetas): 1 Beto MIENTE · 2 Ciro VERAZ · 3 choca · 4 hay 8 · 5 Dina VERAZ · 6 solo Ana · 7 Ana y Ciro ·
  // 8 quedan 2 (VERAZ y VERAZ, MIENTE y MIENTE) · 9 miente Ciro · 10 Ana MIENTE y Beto VERAZ · 11 solo Beto (A) · 12 mienten
  // dos (B) · 13 mienten Teo, Nora y Leo (C) · 14 quedan 2 y en las dos Gino miente (D) · 15 Teo y Omar (E). La prueba de la
  // unidad repite esas cuentas leyendo el texto de los datos. La figura es el planteamiento: tarjetas boca abajo (o la que
  // da el enunciado), nunca la tarjeta deducida. Las frases van en los datos, una por línea; la respuesta, en violeta.
  const fig = (gente, frases, o) => ({ pieza: VZ, datos: { escena: 'tarjetas', habla: hablaKK(gente, frases, o) }, estado: {} });
  const FR = (de, f) => ({ de, f });
  const E1 = [FR('Ana', { m: 'Beto' })], E2 = [FR('Beto', { m: 'Ciro' })], E5 = [FR('Dina', { m: 'Ana' })];
  const E3 = [FR('Rosa', { vv: ['Rosa', 'Leo'] })];
  const E6 = [FR('Nora', { m: 'Teo' }), FR('Teo', { vv: ['Nora', 'Teo'] })];
  const E7 = [FR('Ana', { m: 'Beto' }), FR('Beto', { m: 'Ciro' })];
  const E8 = [FR('Sara', { v: 'Gino' }), FR('Gino', { v: 'Sara' })];
  const E9 = [FR('Lucho', { m: 'Omar' }), FR('Maru', { v: 'Lucho' }), FR('Omar', { mm: ['Lucho', 'Omar'] })];
  const E10 = [FR('Pía', { mm: ['Pía', 'Gino'] })];
  const E11 = [FR('Ana', { m: 'Beto' }), FR('Beto', { m: 'Ciro' }), FR('Ciro', { mm: ['Ana', 'Beto'] })];
  const E12 = [FR('Lucho', { vv: ['Vilma', 'Gino'] }), FR('Vilma', { mm: ['Lucho', 'Gino'] }), FR('Gino', { m: 'Lucho' })];
  const E13 = [FR('Rosa', { m: 'Nora' }), FR('Teo', { vv: ['Nora', 'Leo'] }), FR('Nora', { vv: ['Rosa', 'Nora'] }), FR('Leo', { v: 'Nora' })];
  const E14 = [FR('Sara', { mm: ['Gino', 'Pía'] }), FR('Gino', { mm: ['Sara', 'Pía'] }), FR('Pía', { m: 'Sara' })];
  const E15 = [FR('Maru', { mm: ['Maru', 'Teo'] }), FR('Teo', { v: 'Omar' }), FR('Omar', { m: 'Maru' })];
  const dat = (gente, frases, extra = []) => [D_TARJ, ...extra, ...frases.map(x => dicho(x, gente))];
  const EJEMPLOS_SUP = [
    { nivel: 1, titulo: 'Una tarjeta a la vista', figura: fig(['Ana', 'Beto'], E1, { dadas: { Ana: true } }),
      enunciado: 'Ana muestra su tarjeta: es VERAZ. Ana dice algo de Beto. ¿Qué tarjeta tiene Beto?',
      datos: dat(['Ana', 'Beto'], E1),
      solucion: [
        { texto: 'Ana tiene VERAZ: todo lo que dice es cierto.' },
        { texto: ['Su frase, «Beto miente», es cierta: Beto tiene la tarjeta ', F('MIENTE'), '.'] },
      ],
      respuesta: [F('MIENTE')] },
    { nivel: 1, titulo: 'Lo que dice un mentiroso', figura: fig(['Beto', 'Ciro'], E2, { dadas: { Beto: false } }),
      enunciado: 'Beto muestra su tarjeta: es MIENTE. Beto dice algo de Ciro. ¿Qué tarjeta tiene Ciro?',
      datos: dat(['Beto', 'Ciro'], E2),
      solucion: [
        { texto: 'Beto tiene MIENTE: todo lo que dice es falso.' },
        { texto: ['«Ciro miente» es falsa: Ciro no miente. Ciro tiene la tarjeta ', F('VERAZ'), '.'] },
      ],
      respuesta: [F('VERAZ')] },
    { nivel: 1, titulo: '¿Encaja o choca?', figura: fig(['Rosa', 'Leo'], E3),
      enunciado: 'Rosa y Leo tienen su tarjeta boca abajo. Rosa habla. Supón que Rosa tiene VERAZ y Leo, MIENTE. ¿Esa suposición encaja?',
      datos: dat(['Rosa', 'Leo'], E3),
      solucion: [
        { texto: 'Con Leo mintiendo, «Los dos decimos la verdad» sale falsa.' },
        { texto: ['Pero Rosa, que tiene VERAZ, no puede decir algo falso: ', F('choca'), '. Esa suposición se descarta.'] },
      ],
      respuesta: [F('No encaja: choca'), ' en la frase de Rosa'] },
    { nivel: 1, titulo: 'Cuántas suposiciones hay', figura: fig(['Ana', 'Beto', 'Ciro'], []),
      enunciado: 'Ana, Beto y Ciro juegan con tarjetas boca abajo. ¿Cuántas suposiciones distintas de tarjetas hay que probar, como máximo?',
      datos: dat(['Ana', 'Beto', 'Ciro'], [], ['Cada tarjeta es VERAZ o MIENTE.']),
      solucion: [
        { texto: 'Cada uno tiene una de dos tarjetas. Por cada tarjeta de Ana hay dos de Beto, y por cada una de esas, dos de Ciro.',
          ecuacion: ['2 × 2 × 2 = ', F('8')] },
      ],
      respuesta: [F('8 suposiciones')] },
    { nivel: 1, titulo: 'La tarjeta de quien habla', figura: fig(['Dina', 'Ana'], E5, { dadas: { Ana: false } }),
      enunciado: 'Ana muestra su tarjeta: es MIENTE. Dina dice algo de Ana. ¿Qué tarjeta tiene Dina?',
      datos: dat(['Dina', 'Ana'], E5),
      solucion: [
        { texto: 'Ana tiene MIENTE: la frase de Dina, «Ana miente», es cierta.' },
        { texto: ['Quien dice algo cierto no puede tener MIENTE: Dina tiene ', F('VERAZ'), '.'] },
      ],
      respuesta: [F('VERAZ')] },
    { nivel: 2, titulo: 'Dos que hablan', figura: fig(['Nora', 'Teo'], E6),
      enunciado: 'Nora y Teo tienen su tarjeta boca abajo y hablan. ¿Quiénes dicen la verdad?',
      datos: dat(['Nora', 'Teo'], E6),
      solucion: [
        { texto: 'Supón que Teo tiene VERAZ: «Los dos decimos la verdad» es cierta, y Nora también es veraz.' },
        { texto: 'Pero entonces «Teo miente», la frase de Nora, sale falsa con Nora veraz: choca. Teo tiene MIENTE.' },
        { texto: ['Con Teo mintiendo, «Teo miente» es cierta: Nora es veraz. La frase de Teo sale falsa: encaja. ', F('Solo Nora'), ' dice la verdad.'] },
      ],
      respuesta: [F('Solo Nora')] },
    { nivel: 2, titulo: 'Una cadena de tres', figura: fig(['Ana', 'Beto', 'Ciro'], E7, { dadas: { Ciro: true } }),
      enunciado: 'Ciro muestra su tarjeta: es VERAZ. Ana y Beto tienen la suya boca abajo y hablan. ¿Quiénes dicen la verdad?',
      datos: dat(['Ana', 'Beto', 'Ciro'], E7),
      solucion: [
        { texto: 'Ciro es veraz: «Ciro miente», la frase de Beto, es falsa. Beto tiene MIENTE.' },
        { texto: '«Beto miente», la frase de Ana, es cierta: Ana tiene VERAZ.' },
        { texto: ['Dicen la verdad ', F('Ana y Ciro'), '; Beto miente.'] },
      ],
      respuesta: [F('Ana y Ciro')] },
    { nivel: 2, titulo: 'Dos suposiciones en pie', figura: fig(['Sara', 'Gino'], E8),
      enunciado: 'Sara y Gino tienen su tarjeta boca abajo y hablan. ¿Qué se puede asegurar de sus tarjetas?',
      datos: dat(['Sara', 'Gino'], E8),
      solucion: [
        { texto: 'Si Sara tiene VERAZ, Gino también, y la frase de Gino sale cierta: encaja.' },
        { texto: 'Si Sara tiene MIENTE, Gino también miente, y su frase «Sara dice la verdad» sale falsa: encaja también.' },
        { texto: ['Quedan 2 suposiciones. En las dos, ', F('sus tarjetas son iguales'), ', pero no se sabe cuáles.'] },
      ],
      respuesta: [F('Sus tarjetas son iguales'), '; no se sabe si VERAZ o MIENTE'] },
    { nivel: 2, titulo: 'La suposición que se descarta', figura: fig(['Lucho', 'Maru', 'Omar'], E9),
      enunciado: 'Lucho, Maru y Omar tienen su tarjeta boca abajo y hablan. ¿Quién miente?',
      datos: dat(['Lucho', 'Maru', 'Omar'], E9),
      solucion: [
        { texto: 'Supón que Lucho miente: Maru miente (dice que Lucho dice la verdad) y Omar es veraz (Lucho dijo que miente).' },
        { texto: 'Omar veraz diría «Lucho y yo mentimos», que sale falsa: choca. Lucho tiene VERAZ.' },
        { texto: ['Con Lucho veraz: Omar miente, Maru es veraz y la frase de Omar sale falsa, como debe. Miente ', F('Omar'), '.'] },
      ],
      respuesta: [F('Solo Omar')] },
    { nivel: 2, titulo: 'Una frase que habla de dos', figura: fig(['Pía', 'Gino'], E10),
      enunciado: 'Pía y Gino tienen su tarjeta boca abajo. Solo Pía habla. ¿Qué tarjeta tiene cada uno?',
      datos: dat(['Pía', 'Gino'], E10),
      solucion: [
        { texto: 'Si Pía tuviera VERAZ, «Los dos mentimos» sería cierta y Pía mentiría: choca. Pía tiene MIENTE.' },
        { texto: 'Entonces su frase es falsa: no mienten los dos. Como Pía miente, Gino no miente.' },
        { texto: ['Pía tiene ', F('MIENTE'), ' y Gino, ', F('VERAZ'), '.'] },
      ],
      respuesta: [F('Pía MIENTE y Gino VERAZ')] },
    { nivel: 3, titulo: 'Tres frases encadenadas', figura: fig(['Ana', 'Beto', 'Ciro'], E11),
      enunciado: 'Ana, Beto y Ciro tienen su tarjeta boca abajo y hablan. ¿Quiénes dicen la verdad?',
      alternativas: ['Solo Beto', 'Ana y Ciro', 'Solo Ciro', 'Nadie', 'Beto y Ciro'],
      datos: dat(['Ana', 'Beto', 'Ciro'], E11),
      solucion: [
        { texto: 'Supón que Ana es veraz: Beto miente, y entonces Ciro es veraz. Ciro diría «Ana y Beto mienten», falsa: choca.' },
        { texto: 'Ana miente: Beto es veraz, y Ciro miente. La frase de Ciro sale falsa, como debe: encaja.' },
        { texto: 'B choca en la frase de Ciro. Con C o D, Ana mentiría diciendo algo cierto; con E, Beto sería veraz con una frase falsa.' },
      ],
      respuesta: [{ negrita: 'A' }, ': ', F('solo Beto')] },
    { nivel: 3, titulo: '¿Cuántos mienten?', figura: fig(['Lucho', 'Vilma', 'Gino'], E12),
      enunciado: 'Lucho, Vilma y Gino tienen su tarjeta boca abajo y hablan. ¿Cuántos de ellos mienten?',
      alternativas: ['Uno', 'Dos', 'Tres', 'Ninguno', 'No se puede saber'],
      datos: dat(['Lucho', 'Vilma', 'Gino'], E12),
      solucion: [
        { texto: 'Supón que Gino miente: Lucho es veraz, y por su frase Gino diría la verdad: choca. Gino es veraz.' },
        { texto: 'Gino veraz: Lucho miente. Lucho dijo «Vilma y Gino dicen la verdad»: es falsa, así que Vilma miente.' },
        { texto: 'Vilma dijo «Lucho y Gino mienten»: falsa, como debe. Mienten 2, Lucho y Vilma.' },
        { texto: 'A y D dejarían a Lucho o a Vilma como veraces con una frase falsa; C choca con Gino. E no vale: encaja una sola.' },
      ],
      respuesta: [{ negrita: 'B' }, ': ', F('dos')] },
    { nivel: 3, titulo: 'Cuatro en la ronda', figura: fig(['Rosa', 'Teo', 'Nora', 'Leo'], E13),
      enunciado: 'Rosa, Teo, Nora y Leo tienen su tarjeta boca abajo y hablan. ¿Quiénes mienten?',
      alternativas: ['Solo Nora', 'Teo y Leo', 'Teo, Nora y Leo', 'Rosa y Nora', 'Los cuatro'],
      datos: dat(['Rosa', 'Teo', 'Nora', 'Leo'], E13),
      solucion: [
        { texto: 'Supón que Nora es veraz: su frase dice que Rosa también lo es, y Rosa dijo «Nora miente»: choca. Nora miente.' },
        { texto: '«Nora miente» es cierta: Rosa es veraz. Leo dijo «Nora dice la verdad», falsa: Leo miente.' },
        { texto: 'Teo dijo «Nora y Leo dicen la verdad», falsa: Teo miente. Nora, con Rosa veraz y ella mintiendo, dice algo falso: encaja.' },
        { texto: 'A y D dejan a Teo veraz con una frase falsa. B deja a Rosa veraz diciendo algo falso. E, a Rosa mintiendo con una frase cierta.' },
      ],
      respuesta: [{ negrita: 'C' }, ': ', F('Teo, Nora y Leo')] },
    { nivel: 3, titulo: 'Lo seguro con dos en pie', figura: fig(['Sara', 'Gino', 'Pía'], E14),
      enunciado: 'Sara, Gino y Pía tienen su tarjeta boca abajo y hablan. ¿Qué es seguro?',
      alternativas: ['Sara dice la verdad', 'Pía miente', 'Sara y Pía mienten', 'Gino miente', 'No se puede asegurar nada'],
      datos: dat(['Sara', 'Gino', 'Pía'], E14),
      solucion: [
        { texto: 'Si Gino fuera veraz, Sara y Pía mentirían; pero entonces «Sara miente», la frase de Pía, sería cierta: choca. Gino miente.' },
        { texto: 'Con Gino mintiendo encajan dos: Sara veraz y Pía mintiendo, o Sara mintiendo y Pía veraz.' },
        { texto: 'A y B pasan en una sola de las dos: posibles, no seguras. C no pasa en ninguna; E no vale, porque Gino miente en las dos.' },
      ],
      respuesta: [{ negrita: 'D' }, ': ', F('Gino miente')] },
    { nivel: 3, titulo: 'Quién dice la verdad', figura: fig(['Maru', 'Teo', 'Omar'], E15),
      enunciado: 'Maru, Teo y Omar tienen su tarjeta boca abajo y hablan. ¿Quiénes dicen la verdad?',
      alternativas: ['Solo Maru', 'Solo Omar', 'Maru y Teo', 'Nadie', 'Teo y Omar'],
      datos: dat(['Maru', 'Teo', 'Omar'], E15),
      solucion: [
        { texto: 'Maru no puede ser veraz: «Teo y yo mentimos» diría que ella miente. Maru miente, y su frase es falsa: Teo no miente.' },
        { texto: 'Teo es veraz: Omar dice la verdad. Omar dijo «Maru miente»: cierta, como debe.' },
        { texto: 'A y C ponen a Maru como veraz: choca. B y D dejan a Teo como mentiroso, y entonces Maru diría algo cierto: choca.' },
      ],
      respuesta: [{ negrita: 'E' }, ': ', F('Teo y Omar')] },
  ];
  suposicion.ejemplos = EJEMPLOS_SUP;

  // ---------- Idea 2: lo contrario de «todos» ----------
  // Objeto: la lista de notas del simulacro, pegada en el mural (rm-veraz, escena «mural»). Cambia: cuántos aprobaron. ·
  // Permanece: las dos frases «Todos aprobaron» y «Ninguno aprobó». · Progresa: los casos en que las dos fallan. · Se
  // reserva: qué es seguro cuando un mentiroso dice «todos» (la predicción). · Debe verse: las dos frases pueden ser falsas
  // a la vez, así que una no es lo contrario de la otra.
  const A4 = ['Ana', 'Beto', 'Ciro', 'Dina'];
  const FRASES_J2 = [{ t: 'Todos aprobaron', ok: ap => ap.every(Boolean) }, { t: 'Ninguno aprobó', ok: ap => !ap.some(Boolean) }];
  const apDe = (n, gente = A4) => gente.map((_, k) => k < n);
  const muralDe = (n, o = {}) => ({ escena: 'mural', tituloLista: o.titulo || 'Simulacro: notas', lista: A4.map((t, k) => ({ t, ok: o.sinSaber ? null : k < n })),
    habla: FRASES_J2.map(x => ({ quien: null, dice: [x.t], valores: o.sinValores ? [] : [{ t: vf(x.ok(apDe(n))), papel: 'sale' }] })) });
  function lecturaJ2(n) {
    const [t, ni] = FRASES_J2.map(x => x.ok(apDe(n)));
    if (t) return ['«Todos» es cierta y «ninguno», falsa'];
    if (ni) return ['«Ninguno» es cierta y «todos», falsa'];
    return ['Las dos frases son falsas a la vez'];
  }
  // Los casos de «Así se resuelve» y «Ahora tú» de la idea 2. Cada uno trae lo que dice el mentiroso, su contraria (ok) y
  // los errores que se cometen al negar, con la cuenta de por qué fallan.
  const D_NEG = ['Lo que dice quien siempre miente es falso.', 'Al menos uno: uno o más. A lo más 5: 5 o menos.'];
  const GRUPOS = [
    { g: 'los de mi grupo', pl: 'aprobaron', sg: 'aprobó', no: 'no aprobó', fem: false },
    { g: 'mis primos', pl: 'son de Puno', sg: 'es de Puno', no: 'no es de Puno', fem: false },
    { g: 'las cajas del aula', pl: 'están llenas', sg: 'está llena', no: 'no está llena', fem: true },
    { g: 'los buses de la ruta', pl: 'pasaron a tiempo', sg: 'pasó a tiempo', no: 'no pasó a tiempo', fem: false },
  ];
  const QUIEN2 = ['Rosa', 'Teo', 'Omar', 'Nora', 'Leo', 'Sara', 'Gino', 'Pía'];
  const sinArticulo = g => g.replace(/^(los|las|mis) /, '');
  function casoNegar(r, tipo) {
    const quien = r.elegir(QUIEN2), G = r.elegir(GRUPOS), uno = G.fem ? 'una' : 'uno', todos = G.fem ? 'Todas' : 'Todos', ning = G.fem ? 'Ninguna' : 'Ninguno';
    const de = `${ning} de ${G.g}`;
    if (tipo === 0) {
      const dice = `${todos} ${G.g} ${G.pl}`, ok = `Al menos ${uno} de ${G.g} ${G.no}`;
      return { quien, dice, ok, corto: G.fem ? 'todas' : 'todos', cortoOk: `al menos ${uno} no`,
        regla: 'Una frase con «todos» se rompe con un solo caso que no cumple: su contraria es «al menos uno no cumple».',
        prueba: `Compruebo: si solo ${uno} ${G.no}, la frase dicha ya es falsa y su contraria se cumple. No hace falta que fallen ${G.fem ? 'todas' : 'todos'}.`,
        mal: [
          { id: 'ninguno', texto: `${de} ${G.sg}`, error: 'RMP146', siFuera: `Es un caso posible, pero «${G.fem ? 'todas' : 'todos'}» también falla si solo ${uno} ${G.no}.` },
          { id: 'algunos', texto: `Algunos ${G.pl} y otros no`.replace(/^Algunos/, G.fem ? 'Algunas' : 'Algunos').replace(/otros/, G.fem ? 'otras' : 'otros'), error: 'RMP77', siFuera: `Puede pasar, pero también es posible que ${G.fem ? 'ninguna' : 'ninguno'} ${G.sg}.` },
          { id: 'otro', texto: `Al menos ${uno} de ${G.g} ${G.sg}`, error: 'RMP146', siFuera: 'Esa es la contraria de «ninguno». Lo dicho fue con «todos»: basta uno que no.' },
          { id: 'nada', texto: 'Nada: no se sabe cuáles', error: 'RMP78', siFuera: `No se sabe cuáles, pero sí que no ${G.pl === 'aprobaron' ? 'aprobaron' : G.pl.replace(/^son/, 'son').replace(/^están/, 'están')} ${G.fem ? 'todas' : 'todos'}.` },
        ] };
    }
    if (tipo === 1) {
      const dice = `${de} ${G.sg}`, ok = `Al menos ${uno} de ${G.g} ${G.sg}`;
      return { quien, dice, ok, corto: G.fem ? 'ninguna' : 'ninguno', cortoOk: `al menos ${uno}`,
        regla: 'Una frase con «ninguno» se rompe con un solo caso que sí cumple: su contraria es «al menos uno cumple».',
        prueba: `Compruebo: si solo ${uno} ${G.sg}, la frase dicha ya es falsa y su contraria se cumple. No hace falta que cumplan ${G.fem ? 'todas' : 'todos'}.`,
        mal: [
          { id: 'todos', texto: `${todos} ${G.g} ${G.pl}`, error: 'RMP146', siFuera: `Es un caso posible, pero «${G.fem ? 'ninguna' : 'ninguno'}» también falla si solo ${uno} ${G.sg}.` },
          { id: 'otro', texto: `Al menos ${uno} de ${G.g} ${G.no}`, error: 'RMP146', siFuera: 'Esa es la contraria de «todos». Lo dicho fue con «ninguno»: basta uno que sí.' },
          { id: 'algunos', texto: `${G.fem ? 'Algunas' : 'Algunos'} ${G.pl} y ${G.fem ? 'otras' : 'otros'} no`, error: 'RMP77', siFuera: `Puede pasar, pero también es posible que ${G.fem ? 'todas' : 'todos'} ${G.pl}.` },
          { id: 'nada', texto: 'Nada: no se sabe cuáles', error: 'RMP78', siFuera: `No se sabe cuáles, pero sí que ${uno} o más ${G.fem ? 'cumplen' : 'cumplen'}.` },
        ] };
    }
    // tipo 2: una cantidad con «más de» o «menos de» (soles o años).
    const mas = r() < 0.5, soles = r() < 0.5, k = soles ? r.elegir([10, 20, 30, 50]) : r.ent(14, 17), u = soles ? 'soles' : 'años';
    const dice = `Tengo ${mas ? 'más' : 'menos'} de ${k} ${u}`, ok = `${quien} tiene ${k} ${u} o ${mas ? 'menos' : 'más'}`;
    return { quien, dice, ok, corto: `${mas ? 'más' : 'menos'} de ${k}`, cortoOk: `${k} o ${mas ? 'menos' : 'más'}`,
      regla: `Lo contrario de «${mas ? 'más' : 'menos'} de ${k}» no es «${mas ? 'menos' : 'más'} de ${k}»: con ${k} justos, la frase dicha también es falsa. Es «${k} o ${mas ? 'menos' : 'más'}».`,
      prueba: `Compruebo: con ${k} ${u} justos la frase dicha es falsa, y con ${mas ? k + 1 : k - 1} ${u} sería cierta. Por eso el ${k} entra.`,
      mal: [
        { id: 'sinK', texto: `${quien} tiene ${mas ? 'menos' : 'más'} de ${k} ${u}`, error: 'RMP147', siFuera: `Casi: falta el ${k}. Con ${k} ${u} justos, «${mas ? 'más' : 'menos'} de ${k}» también es falsa.` },
        { id: 'cree', texto: `${quien} tiene ${mas ? 'más' : 'menos'} de ${k} ${u}`, error: 'RMP49', siFuera: `Eso es creerle. ${quien} siempre miente: lo que dijo es falso.` },
        { id: 'justo', texto: `${quien} tiene ${k} ${u} justos`, error: 'RMP77', siFuera: `Puede pasar, pero también ${mas ? k - 1 : k + 1} ${u} hacen falsa la frase.` },
      ] };
  }
  // Nivel examen: tres frases de un mentiroso sobre su edad. «Menos de a» (tiene a o más), «más de a + 1» (a + 1 o menos)
  // y «tengo a + 1» (no tiene a + 1): queda a. Las opciones salen de creerle una frase o de olvidar la tercera.
  function casoEdad(r) {
    const quien = r.elegir(QUIEN2), a = r.ent(14, 17), frases = [`Tengo menos de ${a} años`, `Tengo más de ${a + 1} años`, `Tengo ${a + 1} años`];
    const sirve = e => !(e < a) && !(e > a + 1) && e !== a + 1;
    const edades = [12, 13, 14, 15, 16, 17, 18, 19, 20].filter(sirve);
    if (edades.length !== 1 || edades[0] !== a) throw new Error('casoEdad: no queda una sola edad');
    const op = (e, id, error, siFuera) => ({ id, texto: `${e} años`, error, siFuera });
    return { quien, frases, datos: frases.map((t, i) => `Frase ${i + 1}: «${t}».`),
      opciones: [{ id: 'c', texto: `${a} años`, correcta: true },
        op(a + 1, 'olvida', 'RMP72', `Cumple lo contrario de las frases 1 y 2, pero la frase 3 dice ${a + 1} y es falsa.`),
        op(a - 1, 'cree1', 'RMP49', `Eso es creerle la frase 1. Como miente, tiene ${a} años o más.`),
        op(a + 2, 'cree2', 'RMP49', `Eso es creerle la frase 2. Como miente, tiene ${a + 1} años o menos.`),
        { id: 'nose', texto: 'No se puede saber', error: 'RMP78', siFuera: `Cada frase descarta edades: juntas dejan solo ${a}.` }],
      solucion: `Lo contrario de cada frase: ${a} o más, ${a + 1} o menos, y no ${a + 1}. Queda ${a}.` };
  }
  const negar = {
    id: 'negar-bien',
    titulo: 'Lo contrario de «todos»',
    pregunta: '¿Qué es lo contrario de «todos aprobaron»?',
    temas: ['Personajes que siempre mienten o dicen la verdad'],
    pieza: VZ,
    aprendizaje: 'Lo contrario de «todos cumplen» es «al menos uno no cumple», no «ninguno»; lo contrario de «más de 5» es «5 o menos».',
    actividad: 'Cambiar cuántos aprobaron y ver cuándo cada frase es cierta.',
    lee: {
      tarjetas: [
        { titulo: 'La lista del mural', texto: 'Después del simulacro, la lista de notas se pega en el mural del aula. Dice quién aprobó y quién no.',
          pieza: VZ, dibujo: { datos: Object.assign(muralDe(2), { habla: [] }), estado: {} } },
        { titulo: 'Palabras que cuentan', texto: '«Todos», «ninguno» y «al menos uno» dicen cuántos cumplen algo. «Al menos uno» quiere decir uno o más: también pueden ser todos.' },
        { titulo: 'Lo contrario de una frase', texto: 'Lo contrario de una frase, su negación, es otra que es falsa justo cuando la primera es cierta, y cierta cuando la primera es falsa. Lo que dice un mentiroso es falso: su contraria es cierta.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia cuántos de los cuatro aprobaron. Mira cuándo es cierta «Todos aprobaron» y cuándo «Ninguno aprobó».' },
      ],
    },
    juega: {
      pieza: VZ,
      consigna: 'En la lista del mural hay cuatro alumnos. Debajo, dos frases que alguien dijo sobre el simulacro.',
      mision: {
        texto: 'Haz que «Todos aprobaron» y «Ninguno aprobó» sean falsas a la vez.',
        logrado: v => FRASES_J2.every(x => !x.ok(apDe(v.n))),
        bien: 'Las dos fallan juntas: por eso «ninguno» no es lo contrario de «todos».',
      },
      voz: 'Mira las dos frases a la vez.',
      leyenda: [
        { s: 'aprobó / no aprobó', t: 'lo que dice la lista' },
        { s: I('cierta / falsa'), t: 'lo que vale cada frase con esa lista' },
      ],
      controles: [{ id: 'n', etiqueta: 'Aprobaron', min: 0, max: 4, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: muralDe(v.n), estado: {} }),
      lectura: v => lecturaJ2(v.n),
      minimo: 3,
    },
    predice: {
      pregunta: 'Rosa siempre miente. Sobre el simulacro de los cuatro, dice: «Todos aprobaron». ¿Qué es seguro?',
      datos: ['Lo que dice quien siempre miente es falso.'],
      voz: 'Piensa en todos los casos en que «todos aprobaron» es falsa.',
      opciones: [
        { id: 'c', texto: 'Al menos uno no aprobó', correcta: true },
        { id: 'ninguno', texto: 'Ninguno aprobó', error: 'RMP146',
          siFuera: 'Es un caso posible, pero «todos» también falla si solo uno no aprobó.' },
        { id: 'algunos', texto: 'Algunos aprobaron y otros no', error: 'RMP77',
          siFuera: 'Puede pasar, pero también es posible que nadie aprobara: no es seguro.' },
        { id: 'nada', texto: 'Nada: no se sabe quiénes aprobaron', error: 'RMP78',
          siFuera: 'No se sabe quiénes, pero sí algo: la lista no puede tener a los cuatro aprobados.' },
      ],
      dibujo: { datos: Object.assign(muralDe(4, { sinSaber: true, titulo: 'Simulacro: ¿notas?' }), { habla: [{ quien: 'Rosa', dice: ['Todos aprobaron'] }] }), estado: {} },
      revelar: { datos: { escena: 'mural', tituloLista: 'Simulacro: notas', lista: A4.map((t, k) => ({ t, ok: k < 3 })), habla: [{ quien: 'Rosa', dice: ['Todos aprobaron'], valores: [{ t: 'falsa', papel: 'sale' }] }], nota: 'Basta uno que no aprobó para que sea falsa' }, estado: {} },
      coincide: 'Coincide: «todos» se rompe con un solo caso que no cumple.',
      noCoincide: 'Revisemos: «todos aprobaron» ya es falsa si falla uno solo, y también si fallan todos.',
    },
    mira: {
      pieza: VZ,
      datos: {
        casos: { columnas: ['Aprobaron', '«Todos»', '«Ninguno»'],
          filas: [3, 1, 0].map((nn, i) => ({ celdas: [`${f0(nn)} de 4`, { t: vf(nn === 4), papel: 'sale' }, { t: vf(nn === 0), papel: 'sale' }], desde: i + 1 })) },
        nota: [{ t: 'En los tres, «todos» es falsa', desde: 3 }, { t: 'Lo común: al menos uno no aprobó', desde: 4, fuerte: true }], notas: 2,
      },
      voz: 'Junta los casos en que «todos» falla y busca qué tienen en común.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Si falla uno solo, «Todos aprobaron» ya es falsa.' },
        { estado: { corte: 2 }, texto: 'También es falsa si fallan tres.' },
        { estado: { corte: 3 }, texto: 'Y si fallan los cuatro: ahí «Ninguno aprobó» es cierta.' },
        { estado: { corte: 4 }, texto: 'Lo que se repite en todos esos casos es lo contrario de «todos».', ecuacion: ['lo contrario de «todos» = «al menos uno no»'] },
      ],
    },
    regla: {
      texto: 'Lo contrario de «todos cumplen» es «al menos uno no cumple»; de «ninguno cumple», «al menos uno cumple»; de «más de 5», «a lo más 5»: 5 o menos.',
      ecuacion: ['contrario de ', { llave: ['todos'], nota: 'cumplen' }, ' = ', { llave: ['al menos uno no'], nota: 'basta uno', color: 'c-i' },
        '   ·   ', 'contrario de ', { llave: ['más de 5'], nota: '6, 7, 8…' }, ' = ', { llave: ['5 o menos'], nota: 'el 5 entra', color: 'c-i' }],
      condicion: 'lo contrario es falso justo cuando la frase es cierta. Con «menos de 5», lo contrario es «5 o más».',
      voz: 'Antes de negar, piensa: ¿con qué caso se rompe la frase?',
    },
    ejemplos: null,   // se completa abajo (EJEMPLOS_NEG)
    // Así se resuelve y «Ahora tú»: un mentiroso dice una frase con «todos», «ninguno», «más de» o «menos de»; se escribe
    // su contraria. El nivel examen de «Ahora tú»: tres frases de un mentiroso sobre su edad, que juntas la fijan.
    resuelve: {
      pieza: VZ,
      generar(s) {
        const c = casoNegar(azar(s + 900), s % 3);
        return {
          enunciado: `En el recreo, ${c.quien}, que siempre miente, dice: «${c.dice}». ¿Qué es seguro?`,
          datos: D_NEG.concat(c.datoExtra || []),
          dibujo: { datos: { habla: [{ quien: c.quien, dice: [c.dice], tarjeta: 'M', papelTarjeta: 'amarra' }] }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden lo que es seguro cuando alguien que siempre miente dice «${c.dice}».` },
            { tipo: 'datos', texto: `${c.quien} siempre miente: su frase es falsa. Lo seguro es lo que vale en todos los casos en que esa frase falla.` },
            { tipo: 'regla', texto: c.regla },
            { tipo: 'aplica', texto: `Escribo lo contrario de lo que dijo: «${c.ok}».`, ecuacion: [`contrario de «${c.corto}» = «${c.cortoOk}»`] },
            { tipo: 'sentido', texto: c.prueba },
          ],
          respuesta: [F(c.ok)],
        };
      },
    },
    ahoraTu: {
      pieza: VZ,
      voz: 'Piensa en el caso más pequeño que rompe la frase.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 3) {
          const c = casoEdad(r);
          return { pregunta: `${c.quien} siempre miente. Dice tres frases sobre su edad. ¿Cuántos años tiene?`, datos: D_NEG.concat(c.datos),
            dibujo: { datos: { habla: [{ quien: c.quien, dice: c.frases, tarjeta: 'M', papelTarjeta: 'amarra' }] }, estado: {} },
            opciones: c.opciones, solucion: { texto: c.solucion } };
        }
        const c = casoNegar(r, tipo);
        return { pregunta: `${c.quien} siempre miente y dice: «${c.dice}». ¿Qué es seguro?`, datos: D_NEG.concat(c.datoExtra || []),
          dibujo: { datos: { habla: [{ quien: c.quien, dice: [c.dice], tarjeta: 'M', papelTarjeta: 'amarra' }] }, estado: {} },
          opciones: opcionesTexto(c.ok, c.mal),
          solucion: { texto: 'La frase dicha es falsa. Lo seguro es su contraria:', ecuacion: [F(c.ok)] } };
      },
    },
  };

  // ---------- Ejemplos resueltos de «Lo contrario de “todos”» ----------
  // Comprobados aparte (scratchpad e6-rm/negar.py: todos los casos posibles de cada lista o cantidad): 1 al menos uno no
  // aprobó · 2 al menos uno es de Juliaca · 3 a lo más 10 · 4 16 o más · 5 al menos una no está llena · 6 Dina desaprobó ·
  // 7 el de 20 · 8 Teo no es mayor · 9 el par 2 · 10 5 o 6 lápices · 11 al menos uno juega fútbol (B) · 12 15 años (C) ·
  // 13 Maru es de Juliaca (D) · 14 Beto no aprobó (E) · 15 el billete de 50 (A). La figura: quien habla, con su tarjeta
  // MIENTE (un dato del enunciado), y su frase; nunca la contraria.
  const miente1 = (q, ...fr) => ({ quien: q, dice: fr, tarjeta: 'M', papelTarjeta: 'amarra' });
  const figN = (habla, extra) => ({ pieza: VZ, datos: Object.assign({ habla }, extra || {}), estado: {} });
  const D_M = q => `${q} siempre miente.`;
  const EJEMPLOS_NEG = [
    { nivel: 1, titulo: 'Lo contrario de «todos»', figura: figN([miente1('Rosa', 'Todos los de mi grupo aprobaron')]),
      enunciado: 'Rosa habla del simulacro de su grupo. ¿Qué es seguro?',
      datos: [...D_NEG, D_M('Rosa'), 'Rosa dice: «Todos los de mi grupo aprobaron».'],
      solucion: [
        { texto: 'Rosa siempre miente: «todos aprobaron» es falsa.' },
        { texto: ['Para que sea falsa basta uno que no aprobó. Es seguro que ', F('al menos uno no aprobó'), '.'] },
      ],
      respuesta: [F('Al menos uno de su grupo no aprobó')] },
    { nivel: 1, titulo: 'Lo contrario de «ninguno»', figura: figN([miente1('Teo', 'Ninguno de mis primos es de Juliaca')]),
      enunciado: 'Teo habla de sus primos. ¿Qué es seguro?',
      datos: [...D_NEG, D_M('Teo'), 'Teo dice: «Ninguno de mis primos es de Juliaca».'],
      solucion: [
        { texto: 'La frase de Teo es falsa. «Ninguno» se rompe con un solo primo que sí es de Juliaca.' },
        { texto: ['Es seguro que ', F('al menos uno de sus primos es de Juliaca'), '.'] },
      ],
      respuesta: [F('Al menos uno de sus primos es de Juliaca')] },
    { nivel: 1, titulo: 'Lo contrario de «más de»', figura: figN([miente1('Omar', 'Tengo más de 10 soles')]),
      enunciado: 'Omar habla de cuánto dinero tiene. ¿Qué es seguro?',
      datos: [...D_NEG, D_M('Omar'), 'Omar dice: «Tengo más de 10 soles».'],
      solucion: [
        { texto: 'La frase es falsa. Con 10 soles justos, «más de 10» también es falsa: el 10 entra.' },
        { texto: ['Omar tiene ', F('a lo más 10 soles'), ': 10 o menos.'] },
      ],
      respuesta: [F('Omar tiene 10 soles o menos')] },
    { nivel: 1, titulo: 'Lo contrario de «menos de»', figura: figN([miente1('Nora', 'Tengo menos de 16 años')]),
      enunciado: 'Nora habla de su edad. ¿Qué es seguro?',
      datos: [...D_NEG, D_M('Nora'), 'Nora dice: «Tengo menos de 16 años».'],
      solucion: [
        { texto: 'La frase es falsa. Con 16 años justos, «menos de 16» ya es falsa.' },
        { texto: ['Nora tiene ', F('16 años o más'), '.'] },
      ],
      respuesta: [F('Nora tiene 16 años o más')] },
    { nivel: 1, titulo: 'Una frase sin quien la diga', figura: figN([{ quien: null, dice: ['Todas las cajas del aula están llenas'] }]),
      enunciado: '¿Cuál es lo contrario de la frase del recuadro?',
      datos: ['Lo contrario de una frase es falso justo cuando ella es cierta.', 'Al menos uno: uno o más.'],
      solucion: [
        { texto: 'La frase se rompe con una sola caja que no esté llena; no hace falta que estén vacías todas.' },
        { texto: ['Lo contrario es «', F('al menos una caja no está llena'), '».'] },
      ],
      respuesta: [F('Al menos una caja del aula no está llena')] },
    { nivel: 2, titulo: 'El que falta en la lista', figura: figN([miente1('Sara', 'Ninguno de los cuatro desaprobó')],
      { escena: 'mural', lista: [{ t: 'Ana', ok: true }, { t: 'Beto', ok: true }, { t: 'Ciro', ok: true }, { t: 'Dina', ok: null }] }),
      enunciado: 'En la lista del mural se ven las notas de Ana, Beto y Ciro, pero no la de Dina. Sara habla de los cuatro. ¿Aprobó Dina?',
      datos: [...D_NEG, D_M('Sara'), 'Sara dice: «Ninguno de los cuatro desaprobó».'],
      solucion: [
        { texto: 'La frase de Sara es falsa: al menos uno de los cuatro desaprobó.' },
        { texto: 'Ana, Beto y Ciro aprobaron: ninguno de ellos es el que desaprobó.' },
        { texto: ['Queda Dina: ', F('Dina desaprobó'), '.'] },
      ],
      respuesta: [F('No: Dina desaprobó')] },
    { nivel: 2, titulo: 'Un solo billete', figura: figN([miente1('Gino', 'Tengo más de 30 soles')]),
      enunciado: 'Gino tiene un solo billete: de 20, de 50 o de 100 soles. Gino habla de su dinero. ¿Qué billete tiene?',
      datos: [...D_NEG, D_M('Gino'), 'Gino dice: «Tengo más de 30 soles».'],
      solucion: [
        { texto: 'La frase es falsa: Gino tiene a lo más 30 soles, 30 o menos.' },
        { texto: ['De los tres billetes, el único de 30 o menos es el de ', F('20 soles'), '.'] },
      ],
      respuesta: [F('El billete de 20 soles')] },
    { nivel: 2, titulo: '«Los dos» también es «todos»', figura: figN([miente1('Pía', 'Mis dos hermanos son mayores que yo')]),
      enunciado: 'Pía tiene dos hermanos, Leo y Teo. Leo es mayor que Pía. ¿Qué se sabe de Teo?',
      datos: [...D_NEG, D_M('Pía'), 'Pía dice: «Mis dos hermanos son mayores que yo».'],
      solucion: [
        { texto: '«Los dos» es «todos» con dos personas. Lo contrario: al menos uno de los dos no es mayor que Pía.' },
        { texto: ['Leo sí es mayor. Entonces ', F('Teo no es mayor que Pía'), '.'] },
      ],
      respuesta: [F('Teo no es mayor que Pía')] },
    { nivel: 2, titulo: '¿Cuál par se opone de verdad?', figura: figN([{ quien: null, dice: ['Todos aprobaron', 'Ninguno aprobó'] }, { quien: null, dice: ['Todos aprobaron', 'Al menos uno no aprobó'] }]),
      enunciado: 'Arriba, el par 1; abajo, el par 2. Son frases sobre los cuatro alumnos de la lista. ¿En qué par siempre una frase es cierta y la otra falsa?',
      datos: ['Lo contrario de una frase es falso justo cuando ella es cierta.', 'En la lista hay 4 alumnos.'],
      solucion: [
        { texto: 'Par 1: con 2 de 4 aprobados, «Todos» es falsa y «Ninguno» también. Pueden fallar juntas.' },
        { texto: 'Par 2: si los 4 aprobaron, la primera es cierta y la segunda falsa; si alguno no, al revés.' },
        { texto: ['En el ', F('par 2'), ' siempre una es cierta y la otra falsa.'] },
      ],
      respuesta: [F('En el par 2')] },
    { nivel: 2, titulo: 'Lápices en la caja', figura: figN([miente1('Lucho', 'En mi caja hay más de 6 lápices')]),
      enunciado: 'La caja de Lucho tiene 5, 6 o 7 lápices. Lucho habla de su caja. ¿Cuántos lápices puede tener?',
      datos: [...D_NEG, D_M('Lucho'), 'Lucho dice: «En mi caja hay más de 6 lápices».'],
      solucion: [
        { texto: 'La frase es falsa: hay a lo más 6 lápices, 6 o menos.' },
        { texto: ['De 5, 6 y 7, quedan ', F('5 o 6'), '. El 6 entra: con 6 justos, «más de 6» es falsa.'] },
      ],
      respuesta: [F('5 o 6 lápices')] },
    { nivel: 3, titulo: 'Dos frases sobre los primos', figura: figN([miente1('Leo', 'Ninguno de mis primos juega fútbol', 'Todos mis primos juegan vóley')]),
      enunciado: 'Leo tiene tres primos y habla de ellos. ¿Qué es seguro?',
      alternativas: ['Ninguno de sus primos juega vóley', 'Al menos uno de sus primos juega fútbol', 'Todos sus primos juegan fútbol', 'Ninguno de sus primos juega fútbol', 'No se puede asegurar nada'],
      datos: [...D_NEG, D_M('Leo'), 'Frase 1: «Ninguno de mis primos juega fútbol».', 'Frase 2: «Todos mis primos juegan vóley».'],
      solucion: [
        { texto: 'Frase 1 falsa: al menos uno juega fútbol. Frase 2 falsa: al menos uno no juega vóley.' },
        { texto: 'A y C son casos posibles, no seguros: también puede que solo uno no juegue vóley o que solo uno juegue fútbol.' },
        { texto: 'D es creerle la frase 1. E no vale: sí se asegura algo.' },
      ],
      respuesta: [{ negrita: 'B' }, ': ', F('al menos uno juega fútbol')] },
    { nivel: 3, titulo: 'Tres frases sobre la edad', figura: figN([miente1('Lucho', 'Tengo menos de 15 años', 'Tengo más de 16 años', 'Tengo 16 años')]),
      enunciado: 'Lucho dice tres frases sobre su edad. ¿Cuántos años tiene?',
      alternativas: ['14 años', '16 años', '15 años', '17 años', 'No se puede saber'],
      datos: [...D_NEG, D_M('Lucho'), 'Frase 1: «Tengo menos de 15 años».', 'Frase 2: «Tengo más de 16 años».', 'Frase 3: «Tengo 16 años».'],
      solucion: [
        { texto: 'Lo contrario de cada una: tiene 15 o más, 16 o menos, y no tiene 16.' },
        { texto: 'Con 15 o más y 16 o menos quedan 15 y 16. La frase 3 descarta el 16: queda 15.' },
        { texto: 'A es creerle la frase 1; D, la frase 2. B cumple las dos primeras al revés, pero choca con la frase 3. E no vale: queda una sola edad.' },
      ],
      respuesta: [{ negrita: 'C' }, ': ', F('15 años')] },
    { nivel: 3, titulo: 'El equipo de Maru', figura: figN([miente1('Maru', 'Todos los del equipo son de Puno', 'Ninguno del equipo es de Juliaca')]),
      enunciado: 'En el equipo están Maru, Teo y Sara. Cada uno es de Puno o de Juliaca. Teo y Sara son de Puno. ¿Qué es seguro?',
      alternativas: ['Maru es de Puno', 'Nadie del equipo es de Juliaca', 'Teo es de Juliaca', 'Maru es de Juliaca', 'No se puede saber'],
      datos: [...D_NEG, D_M('Maru'), 'Frase 1: «Todos los del equipo son de Puno».', 'Frase 2: «Ninguno del equipo es de Juliaca».'],
      solucion: [
        { texto: 'Frase 1 falsa: al menos uno del equipo no es de Puno. Teo y Sara sí lo son: ese uno es Maru.' },
        { texto: 'Maru no es de Puno: es de Juliaca. La frase 2 queda falsa, como debe.' },
        { texto: 'A y B son creerle a Maru. C choca con el dato de que Teo es de Puno. E no vale: queda una sola.' },
      ],
      respuesta: [{ negrita: 'D' }, ': ', F('Maru es de Juliaca')] },
    { nivel: 3, titulo: 'Los dos aprobaron', figura: figN([miente1('Ciro', 'Ana y Beto aprobaron')]),
      enunciado: 'Ciro habla del examen de Ana y Beto. Se sabe que Ana aprobó. ¿Qué es seguro?',
      alternativas: ['Beto aprobó', 'Ninguno de los dos aprobó', 'Ana no aprobó', 'No se puede saber', 'Beto no aprobó'],
      datos: [...D_NEG, D_M('Ciro'), 'Ciro dice: «Ana y Beto aprobaron».'],
      solucion: [
        { texto: 'Lo contrario de «los dos aprobaron» es «al menos uno de los dos no aprobó».' },
        { texto: 'Ana aprobó: el que no aprobó es Beto.' },
        { texto: 'A es creerle a Ciro. B niega con «ninguno» y C choca con el dato. D no vale: Ana aprobó y eso decide.' },
      ],
      respuesta: [{ negrita: 'E' }, ': ', F('Beto no aprobó')] },
    { nivel: 3, titulo: 'El billete de Fito', figura: figN([miente1('Fito', 'Tengo más de 50 soles'), miente1('Gaby', 'Fito tiene menos de 50 soles'), { quien: 'Hugo', dice: ['Fito tiene un solo billete'], tarjeta: 'V', papelTarjeta: 'amarra' }]),
      enunciado: 'Fito y Gaby siempre mienten; Hugo siempre dice la verdad. ¿Cuánto dinero tiene Fito?',
      alternativas: ['50 soles', '20 soles', '100 soles', 'Más de 50 soles', 'No se puede saber'],
      datos: ['Lo que dice quien siempre miente es falso; lo que dice quien siempre dice la verdad, cierto.', 'A lo más 5: 5 o menos.',
        'Fito dice: «Tengo más de 50 soles».', 'Gaby dice: «Fito tiene menos de 50 soles».', 'Hugo dice: «Fito tiene un solo billete».', 'Hay billetes de 10, 20, 50, 100 y 200 soles.'],
      solucion: [
        { texto: 'Lo que dice Fito es falso: tiene a lo más 50 soles. Lo que dice Gaby es falso: tiene 50 o más.' },
        { texto: 'Con 50 o menos y 50 o más, Fito tiene 50 justos. Hugo dice la verdad: es un billete de 50.' },
        { texto: 'B es creerle a Gaby; C y D, creerle a Fito. E no vale: las dos frases juntas fijan los 50.' },
      ],
      respuesta: [{ negrita: 'A' }, ': ', F('50 soles')] },
  ];
  negar.ejemplos = EJEMPLOS_NEG;

  // ---------- Culpables y lugares (ideas 3 y 4) ----------
  // Una frase es { de, f: { fue: X } | { noFue: X } | { miente: Y } }: «Fue X» (o «Fui yo»), «No fue X» (o «Yo no fui»),
  // «Y miente» (la frase de Y es falsa). El contexto cambia solo las palabras: quién fue, quién ganó, en qué mochila está.
  // c es el culpable (o el ganador, o el dueño de la mochila) que se supone. La condición: cuántas frases son falsas.
  const CTX = {
    fue: { si: (x, de) => (x === de ? 'Fui yo' : `Fue ${x}`), no: (x, de) => (x === de ? 'Yo no fui' : `No fue ${x}`), supon: x => `Supón: fue ${x}`, es: x => `fue ${x}`, pide: '¿Quién fue?' },
    gano: { si: (x, de) => (x === de ? 'Gané yo' : `Ganó ${x}`), no: (x, de) => (x === de ? 'Yo no gané' : `No ganó ${x}`), supon: x => `Supón: ganó ${x}`, es: x => `ganó ${x}`, pide: '¿Quién ganó?' },
    mochila: { si: (x, de) => (x === de ? 'Está en la mía' : `Está en la de ${x}`), no: (x, de) => (x === de ? 'No está en la mía' : `No está en la de ${x}`), supon: x => `Supón: está en la de ${x}`, es: x => `está en la de ${x}`, pide: '¿En qué mochila está la pelota?' },
  };
  const textoC = (x, ctx) => (x.f.fue ? CTX[ctx].si(x.f.fue, x.de) : x.f.noFue ? CTX[ctx].no(x.f.noFue, x.de) : `${x.f.miente} miente`);
  // Lo contrario, dicho en tercera persona («No fue Ana», «Está en la de Dina», «Beto dice la verdad»).
  const contrariaC = (x, ctx) => (x.f.fue ? CTX[ctx].no(x.f.fue, null) : x.f.noFue ? CTX[ctx].si(x.f.noFue, null) : `${x.f.miente} dice la verdad`);
  function valorC(frases, x, c) {
    if (x.f.fue) return c === x.f.fue;
    if (x.f.noFue) return c !== x.f.noFue;
    return !valorC(frases, frases.find(y => y.de === x.f.miente), c);
  }
  const falsasC = (frases, c) => frases.filter(x => !valorC(frases, x, c)).length;
  const cumpleC = (gente, frases, k) => gente.filter(c => falsasC(frases, c) === k);
  // Los pares de frases que se contradicen: con cualquier culpable, una es cierta y la otra falsa.
  const paresC = (gente, frases) => {
    const out = [];
    for (let i = 0; i < frases.length; i++) for (let j = i + 1; j < frases.length; j++) if (gente.every(c => valorC(frases, frases[i], c) !== valorC(frases, frases[j], c))) out.push([frases[i].de, frases[j].de]);
    return out;
  };
  const plFalsas = n => `${f0(n)} ${n === 1 ? 'frase falsa' : 'frases falsas'}`;
  const plCiertas = n => `${f0(n)} ${n === 1 ? 'frase cierta' : 'frases ciertas'}`;
  const dichoC = (x, ctx) => `${x.de} dice: «${textoC(x, ctx)}».`;
  // Los renglones: quién dice qué; con c, lo que vale cada frase (y el anillo naranja en el culpable supuesto).
  function hablaC(frases, ctx, o = {}) {
    return frases.map(x => {
      const h = { quien: x.de, dice: [textoC(x, ctx)] };
      if (o.c !== undefined && o.c !== null) {
        const v = valorC(frases, x, o.c);
        h.valores = [Object.assign({ t: vf(v), papel: 'sale' }, o.desde !== undefined ? { desde: o.desde } : {})];
        if (ctx !== 'mochila' && x.de === o.c) h.anillo = o.seguro ? { papel: 'seguro', desde: o.desde } : 'supuesto';
      }
      if (o.anillos && o.anillos[x.de]) h.anillo = o.anillos[x.de];
      return h;
    });
  }
  const QUIEN34 = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gaby', 'Hugo', 'Rosa', 'Nora'];
  // Un caso de k sospechosos con `falsas` frases falsas exactas, una sola respuesta y al menos un par que se contradice.
  function casoC(r, n, falsas, ctx) {
    for (let t = 0; t < 3000; t++) {
      const gente = r.barajar(QUIEN34.filter(x => !['Ana', 'Beto', 'Ciro', 'Dina'].includes(x) || t % 2)).slice(0, n);
      const frases = gente.map(de => {
        const tipo = r.elegir(['fue', 'noFue', 'fue', 'noFue', 'miente']), x = r.elegir(gente);
        if (tipo === 'miente') { const y = r.elegir(gente.filter(z => z !== de)); return { de, f: { miente: y } }; }
        return { de, f: { [tipo]: x } };
      });
      if (frases.some(x => x.f.miente && frases.find(y => y.de === x.f.miente).f.miente)) continue;
      if (new Set(frases.map(x => textoC(x, ctx))).size < n) continue;
      const sol = cumpleC(gente, frases, falsas), pares = paresC(gente, frases);
      if (sol.length !== 1 || !pares.length) continue;
      const c = sol[0], fuera = frases.filter(x => !pares[0].includes(x.de));
      return { gente, frases, c, pares, par: pares[0], fuera, falsas, mentirosos: frases.filter(x => !valorC(frases, x, c)).map(x => x.de) };
    }
    return null;
  }
  const verbo = (xs, uno, varios) => (xs.length === 1 ? uno : varios);

  // ---------- Idea 3: dos frases que se contradicen ----------
  // Objeto: el vidrio roto de la ventana del aula (rm-veraz, escena «ventana»). Cambia: el culpable que se supone. ·
  // Permanece: las cuatro frases. · Progresa: cuántas salen falsas. · Se reserva: el atajo del par, que dice quiénes dicen
  // la verdad sin probar culpables (la predicción, con otro caso). · Debe verse: con el dato «solo uno miente», sirve el
  // culpable que deja una sola frase falsa.
  const S3 = ['Ana', 'Beto', 'Ciro', 'Dina'];
  const F3 = [{ de: 'Ana', f: { fue: 'Beto' } }, { de: 'Beto', f: { fue: 'Dina' } }, { de: 'Ciro', f: { noFue: 'Ciro' } }, { de: 'Dina', f: { miente: 'Beto' } }];
  const SOL3 = cumpleC(S3, F3, 1);
  if (SOL3.length !== 1) throw new Error('juego de la idea 3: debe servir un solo culpable');
  // La predicción: el queque del compartir. Eva y Gaby se contradicen; Fito y Hugo dicen la verdad.
  const SP3 = ['Eva', 'Fito', 'Gaby', 'Hugo'];
  const FP3 = [{ de: 'Eva', f: { fue: 'Gaby' } }, { de: 'Fito', f: { noFue: 'Eva' } }, { de: 'Gaby', f: { miente: 'Eva' } }, { de: 'Hugo', f: { fue: 'Fito' } }];
  const SOLP3 = cumpleC(SP3, FP3, 1), PARP3 = paresC(SP3, FP3);
  if (SOLP3.length !== 1 || PARP3.length !== 1 || PARP3[0].join() !== 'Eva,Gaby') throw new Error('predicción de la idea 3: las cuentas no cuadran');
  const VERACES_P3 = SP3.filter(x => !PARP3[0].includes(x));
  const D_SOLO1 = 'Solo una de las frases es falsa: los demás dicen la verdad.';
  const contradictorias = {
    id: 'contradictorias',
    titulo: 'Dos frases que se contradicen',
    pregunta: '¿Qué tienen de especial dos frases que se contradicen?',
    temas: ['Afirmaciones contradictorias'],
    pieza: VZ,
    aprendizaje: 'En un par que se contradice, una frase es cierta y otra falsa; si solo uno miente, está en ese par.',
    actividad: 'Suponer culpables y contar cuántas frases salen falsas con cada uno.',
    lee: {
      tarjetas: [
        { titulo: 'El vidrio roto', texto: 'En el recreo, alguien rompió el vidrio de la ventana con la pelota. Hay cuatro sospechosos y cada uno dice una frase. Se sabe algo más: solo uno de ellos miente.',
          pieza: VZ, dibujo: { datos: { escena: 'ventana', habla: hablaC(F3, 'fue') }, estado: {} } },
        { titulo: 'Suponer un culpable', texto: 'Se supone que fue uno y se revisa cada frase: ¿sale cierta o falsa? Después se cuentan las falsas y se comparan con el dato del enunciado.' },
        { titulo: 'Frases que hablan de frases', texto: '«Beto miente» no habla del vidrio: dice que la frase de Beto es falsa. Para saber si es cierta, primero mira qué dijo Beto.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia de culpable y mira cuántas frases salen falsas. Busca el que deja justo una, como pide el dato.' },
      ],
    },
    juega: {
      pieza: VZ,
      consigna: 'Uno de los cuatro rompió el vidrio y solo uno miente. A la derecha, lo que vale cada frase con el culpable que supones.',
      mision: {
        texto: 'Supón culpables hasta que quede una sola frase falsa.',
        logrado: v => falsasC(F3, S3[v.c]) === 1,
        bien: [`Con ${SOL3[0]} culpable sale una sola frase falsa. Con los otros, ${lista(S3.filter(x => x !== SOL3[0]).map(x => f0(falsasC(F3, x))))} falsas.`],
      },
      voz: 'Cuenta las falsas con cada culpable.',
      leyenda: [
        { s: O('Supón: fue…'), t: 'el culpable que pruebas (con su anillo)' },
        { s: I('cierta / falsa'), t: 'lo que vale cada frase así' },
      ],
      controles: [{ id: 'c', etiqueta: 'Supón que fue', opciones: S3.map((x, k) => ({ valor: k, texto: x })) }],
      dibujo: v => ({ datos: { escena: 'ventana', supuesto: CTX.fue.supon(S3[v.c]), habla: hablaC(F3, 'fue', { c: S3[v.c] }) }, estado: {} }),
      lectura: v => { const n = falsasC(F3, S3[v.c]); return [`Si fue ${S3[v.c]}: ${plFalsas(n)}; se pide 1`]; },
      minimo: S3.length,
    },
    predice: {
      pregunta: 'Otro día alguien se comió el queque del compartir, y solo uno de los cuatro miente. Sin probar culpables, ¿qué se puede asegurar?',
      datos: [D_SOLO1, ...FP3.map(x => dichoC(x, 'fue'))],
      voz: 'Busca dos frases que no puedan valer lo mismo.',
      opciones: [
        { id: 'c', texto: `${lista(VERACES_P3)} dicen la verdad`, correcta: true },
        { id: 'par', texto: 'Eva y Gaby dicen la verdad', error: 'RMP148', siFuera: 'Eva y Gaby se contradicen: una de las dos es la que miente.' },
        { id: 'hugo', texto: 'Hugo miente', error: 'RMP148', siFuera: 'Hugo está fuera del par que se contradice: el que miente está entre Eva y Gaby.' },
        { id: 'nada', texto: 'Nada, sin probar cada culpable', error: 'RMP78', siFuera: 'Sí se sabe algo: si Eva miente, Gaby acierta, y al revés. El que miente está ahí.' },
      ],
      dibujo: { datos: { habla: hablaC(FP3, 'fue') }, estado: {} },
      revelar: { datos: { habla: hablaC(FP3, 'fue', { anillos: Object.fromEntries(VERACES_P3.map(x => [x, 'seguro'])) }), nota: 'Eva y Gaby: una de las dos es la falsa' }, estado: {} },
      coincide: `Coincide: Eva y Gaby se contradicen, así que el que miente está entre ellas. ${lista(VERACES_P3)} dicen la verdad.`,
      noCoincide: 'Revisemos: si la frase de Eva es falsa, «Eva miente» es cierta; si es cierta, es falsa. Una de las dos miente.',
    },
    mira: {
      pieza: VZ,
      datos: { habla: hablaC(FP3, 'fue', { anillos: Object.fromEntries(VERACES_P3.map(x => [x, { papel: 'seguro', desde: 3 }])) }).map(h => (h.quien === SOLP3[0] ? Object.assign(h, { anillo: { papel: 'seguro', desde: 3 } }) : h))
        .map(h => Object.assign(h, { valores: [{ t: vf(valorC(FP3, FP3.find(x => x.de === h.quien), SOLP3[0])), papel: 'sale', desde: 5 }] })),
        seguro: `Fue ${SOLP3[0]}`, seguroDesde: 4, casos: { columnas: ['Si fue', 'Eva dice', 'Gaby dice'], filas: SP3.map(c => ({ celdas: [c, { t: vf(valorC(FP3, FP3[0], c)), papel: 'sale' }, { t: vf(valorC(FP3, FP3[2], c)), papel: 'sale' }], desde: 1 })) } },
      voz: 'Primero el par, después lo que dicen los demás.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Con cualquier culpable, si Eva acierta, Gaby falla; y al revés.' },
        { estado: { corte: 2 }, texto: 'Se contradicen: una de las dos es la frase falsa.' },
        { estado: { corte: 3 }, texto: `Solo uno miente: ${lista(VERACES_P3)} dicen la verdad.` },
        { estado: { corte: 4 }, texto: `Hugo dice «Fue Fito», y es cierto: fue ${SOLP3[0]}.` },
        { estado: { corte: 5 }, texto: `Se comprueba: con ${SOLP3[0]} culpable, solo la frase de Eva es falsa.` },
      ],
    },
    regla: {
      texto: 'Dos frases se contradicen si una dice justo lo contrario de la otra: siempre una es cierta y la otra, falsa. Si solo uno miente, está en ese par.',
      ecuacion: [{ llave: ['una frase'], nota: 'cierta o falsa' }, ' y ', { llave: ['su contraria'], nota: 'al revés' }, ': ', { llave: ['una cierta, una falsa'], nota: 'siempre', color: 'c-i' }],
      condicion: 'una es la negación de la otra, y los de fuera del par dicen la verdad. «Fue Ana» y «Fue Beto» no.',
      voz: 'Antes de suponer, busca el par que se contradice.',
    },
    ejemplos: null,   // EJEMPLOS_CONTRA, abajo
    // Así se resuelve: cinco sospechosos y solo uno miente; se busca el par, se cree a los de fuera y se comprueba. Todo sale
    // de paresC, cumpleC y valorC. «Ahora tú» pregunta quién fue o quién miente, con 4 o 5.
    resuelve: {
      pieza: VZ,
      generar(s) {
        const r = azar(s + 900), c = casoC(r, 5, 1, 'fue'), [a, b] = c.par, fuera = c.fuera.map(x => x.de);
        const quedan = c.gente.filter(z => c.fuera.every(x => valorC(c.frases, x, z)));
        return {
          enunciado: `${['Durante el recreo alguien escondió el borrador de la pizarra.', 'Alguien dejó el caño del baño abierto.', 'Alguien pisó el jardín recién sembrado.'][s % 3]} Hay cinco sospechosos y solo uno miente. ¿Quién fue?`,
          datos: [D_SOLO1, ...c.frases.map(x => dichoC(x, 'fue'))],
          dibujo: { datos: { habla: hablaC(c.frases, 'fue') }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden quién fue, entre los cinco sospechosos.' },
            { tipo: 'datos', texto: `Son cinco frases y solo una es falsa: la de quien miente.` },
            { tipo: 'regla', texto: 'Busco dos frases que se contradigan: una de las dos es la falsa, y todas las demás son ciertas.' },
            { tipo: 'aplica', texto: `Las frases de ${a} y ${b} se contradicen. Entonces ${lista(fuera)} dicen la verdad.`,
              dibujo: { datos: { habla: hablaC(c.frases, 'fue', { anillos: Object.fromEntries(fuera.map(x => [x, 'seguro'])) }) }, estado: {} } },
            { tipo: 'aplica', texto: quedan.length === 1 ? `Con lo que dicen ${lista(fuera)}, solo queda ${c.c}.`
              : `Con lo que dicen ${lista(fuera)}, puede ser ${lista(quedan, 'o')}. Solo con ${c.c} queda una sola frase falsa.`,
              dibujo: { datos: { habla: hablaC(c.frases, 'fue', { c: c.c, seguro: true }) }, estado: {} } },
            { tipo: 'sentido', texto: `Compruebo: si fue ${c.c}, la única frase falsa es la de ${c.mentirosos[0]}, que está en el par.` },
          ],
          respuesta: [F(`Fue ${c.c}`)],
        };
      },
    },
    ahoraTu: {
      pieza: VZ,
      voz: 'Busca el par que se contradice y cree a los demás.',
      generar(s) {
        const r = azar(s), tipo = s % 4, n = tipo < 2 ? 4 : 5, c = casoC(r, n, 1, 'fue');
        const datos = [D_SOLO1, ...c.frases.map(x => dichoC(x, 'fue'))], dibujo = { datos: { habla: hablaC(c.frases, 'fue') }, estado: {} };
        const intro = ['Alguien rompió una maceta del patio.', 'Alguien dejó abierta la puerta del laboratorio.', 'Alguien se llevó la pelota de vóley.'][Math.floor(s / 4) % 3];
        const mentiroso = c.mentirosos[0];
        if (tipo % 2 === 0) {
          const acusa = c.frases.find(x => x.de === mentiroso && x.f.fue);
          const ops = c.gente.map(z => (z === c.c ? { id: 'c', texto: z, correcta: true }
            : { id: `g${c.gente.indexOf(z)}`, texto: z, error: acusa && acusa.f.fue === z ? 'RMP49' : 'RMP72',
              siFuera: `${acusa && acusa.f.fue === z ? `Eso dice ${mentiroso}, pero miente. ` : ''}Si fuera ${z}, quedarían ${plFalsas(falsasC(c.frases, z))}; el dato pide 1.` }));
          return { pregunta: `${intro} Hay ${n === 4 ? 'cuatro' : 'cinco'} sospechosos y solo uno miente. ¿Quién fue?`, datos, dibujo, opciones: ops,
            solucion: { texto: `${c.par[0]} y ${c.par[1]} se contradicen; los demás dicen la verdad. Solo con ${c.c} queda una frase falsa.`, dibujo: { datos: { habla: hablaC(c.frases, 'fue', { c: c.c, seguro: true }) }, estado: {} } } };
        }
        const ops = c.gente.map(z => (z === mentiroso ? { id: 'c', texto: z, correcta: true }
          : { id: `g${c.gente.indexOf(z)}`, texto: z, error: c.par.includes(z) ? 'RMP148' : 'RMP72',
            siFuera: c.par.includes(z) ? `${z} está en el par, pero si mintiera ${z}, ningún culpable dejaría ciertas las demás frases.`
              : `${z} está fuera del par que se contradice: dice la verdad.` }));
        return { pregunta: `${intro} Hay ${n === 4 ? 'cuatro' : 'cinco'} sospechosos y solo uno miente. ¿Quién miente?`, datos, dibujo, opciones: ops,
          solucion: { texto: `${c.par[0]} y ${c.par[1]} se contradicen. Con los demás, fue ${c.c}: la frase falsa es la de ${mentiroso}.`, dibujo: { datos: { habla: hablaC(c.frases, 'fue', { c: c.c, seguro: true }) }, estado: {} } } };
      },
    },
  };

  // ---------- Idea 4: cuando solo uno dice la verdad ----------
  // Objeto: la pelota escondida en una de cuatro mochilas (rm-veraz, escena «mochilas»). Cambia: la mochila que se supone.
  // · Permanece: las cuatro frases. · Progresa: cuántas salen ciertas. · Se reserva: el atajo (el veraz está en el par, los
  // demás mienten y lo contrario de lo que dicen es cierto), con otro caso en la predicción. · Debe verse: con «solo uno
  // dice la verdad», sirve la mochila que deja una sola frase cierta.
  const F4 = [{ de: 'Ana', f: { fue: 'Beto' } }, { de: 'Beto', f: { noFue: 'Beto' } }, { de: 'Ciro', f: { fue: 'Ciro' } }, { de: 'Dina', f: { noFue: 'Dina' } }];
  const ciertasC = (frases, c) => frases.length - falsasC(frases, c);
  const SOL4 = cumpleC(S3, F4, 3);
  if (SOL4.length !== 1) throw new Error('juego de la idea 4: debe servir una sola mochila');
  const SP4 = ['Eva', 'Fito', 'Gaby', 'Hugo'];
  const FP4 = [{ de: 'Eva', f: { fue: 'Fito' } }, { de: 'Fito', f: { noFue: 'Fito' } }, { de: 'Gaby', f: { fue: 'Hugo' } }, { de: 'Hugo', f: { noFue: 'Gaby' } }];
  const SOLP4 = cumpleC(SP4, FP4, 3), PARP4 = paresC(SP4, FP4);
  if (SOLP4.length !== 1 || PARP4.length !== 1) throw new Error('predicción de la idea 4: las cuentas no cuadran');
  const D_SOLOV = 'Solo una de las frases es cierta: los demás mienten.';
  const mochilasDe = (gente, c, papel) => gente.map(t => (t === c ? { t, pelota: papel } : { t }));
  const soloVeraz = {
    id: 'solo-uno-veraz',
    titulo: 'Cuando solo uno dice la verdad',
    pregunta: '¿Qué cambia si solo uno dice la verdad?',
    temas: ['Afirmaciones contradictorias'],
    pieza: VZ,
    aprendizaje: 'Si solo uno dice la verdad, el veraz está en el par que se contradice: los demás mienten, y su contraria es cierta.',
    actividad: 'Suponer en qué mochila está la pelota y contar las frases ciertas.',
    lee: {
      tarjetas: [
        { titulo: 'La pelota escondida', texto: 'Antes de la clase, alguien escondió la pelota en una de las cuatro mochilas colgadas en la pared. Cada dueño dice una frase. Esta vez, solo uno dice la verdad.',
          pieza: VZ, dibujo: { datos: { escena: 'mochilas', objetos: mochilasDe(S3), habla: hablaC(F4, 'mochila') }, estado: {} } },
        { titulo: 'Contar las ciertas', texto: 'Se supone en qué mochila está y se revisa cada frase. Ahora el dato habla de las ciertas: debe quedar exactamente una. Lo mismo pasa con cajas que llevan un rótulo.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia la mochila y cuenta las frases ciertas. Busca la que deja justo una.' },
      ],
    },
    juega: {
      pieza: VZ,
      consigna: 'La pelota está en una de las cuatro mochilas y solo uno de los dueños dice la verdad.',
      mision: {
        texto: 'Busca la mochila que deja una sola frase cierta.',
        logrado: v => ciertasC(F4, S3[v.c]) === 1,
        bien: [`En la de ${SOL4[0]}: una sola frase cierta. En las otras: ${lista(S3.filter(x => x !== SOL4[0]).map(x => f0(ciertasC(F4, x))))}.`],
      },
      voz: 'Cuenta las ciertas con cada mochila.',
      leyenda: [
        { s: O('círculo naranja'), t: 'la mochila que supones' },
        { s: I('cierta / falsa'), t: 'lo que vale cada frase así' },
      ],
      controles: [{ id: 'c', etiqueta: 'Supón que está en la de', opciones: S3.map((x, k) => ({ valor: k, texto: x })) }],
      dibujo: v => ({ datos: { escena: 'mochilas', supuesto: CTX.mochila.supon(S3[v.c]), objetos: mochilasDe(S3, S3[v.c], 'supuesto'), habla: hablaC(F4, 'mochila', { c: S3[v.c] }) }, estado: {} }),
      lectura: v => { const n = ciertasC(F4, S3[v.c]); return [`En la de ${S3[v.c]}: ${plCiertas(n)}; se pide 1`]; },
      minimo: S3.length,
    },
    predice: {
      pregunta: 'Otro recreo: la pelota está en una de las mochilas de Eva, Fito, Gaby y Hugo, y solo uno dice la verdad. ¿Dónde está la pelota?',
      datos: [D_SOLOV, ...FP4.map(x => dichoC(x, 'mochila'))],
      voz: 'Busca el par: ¿quiénes quedan fuera?',
      opciones: [
        { id: 'c', texto: `En la de ${SOLP4[0]}`, correcta: true },
        { id: 'gaby', texto: 'En la de Hugo', error: 'RMP149', siFuera: `Eso dice Gaby, que está fuera del par: miente. Con la pelota ahí habría ${plCiertas(ciertasC(FP4, 'Hugo'))}.` },
        { id: 'eva', texto: 'En la de Fito', error: 'RMP149', siFuera: `Eso dice Eva, pero así dirían la verdad ${f0(ciertasC(FP4, 'Fito'))}: Eva y Hugo.` },
        { id: 'nada', texto: 'No se sabe sin probar cada mochila', error: 'RMP78', siFuera: 'Sí se sabe: Eva y Fito se contradicen, y lo que dice Hugo es falso.' },
      ],
      dibujo: { datos: { escena: 'mochilas', objetos: mochilasDe(SP4), habla: hablaC(FP4, 'mochila') }, estado: {} },
      revelar: { datos: { escena: 'mochilas', seguro: `Está en la de ${SOLP4[0]}`, objetos: mochilasDe(SP4, SOLP4[0], 'seguro'), habla: hablaC(FP4, 'mochila', { c: SOLP4[0] }) }, estado: {} },
      coincide: `Coincide: Eva y Fito se contradicen, Gaby y Hugo mienten, y lo contrario de lo que dice Hugo es cierto.`,
      noCoincide: `Revisemos: Hugo miente, así que lo contrario de «No está en la de Gaby» es cierto.`,
    },
    mira: {
      pieza: VZ,
      datos: { escena: 'mochilas', seguro: `Está en la de ${SOLP4[0]}`, seguroDesde: 3, objetos: SP4.map(t => (t === SOLP4[0] ? { t, pelota: 'seguro', desde: 3 } : { t })),
        habla: hablaC(FP4, 'mochila').map(h => Object.assign(h, { valores: [{ t: vf(valorC(FP4, FP4.find(x => x.de === h.quien), SOLP4[0])), papel: 'sale', desde: 4 }] })),
        nota: [{ t: 'Eva y Fito se contradicen: ahí está el veraz', desde: 1 }, { t: 'Gaby y Hugo mienten', desde: 2 }], notas: 2 },
      voz: 'Primero el par; después, lo contrario de lo que dicen los demás.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Eva y Fito se contradicen: uno de los dos dice la verdad.' },
        { estado: { corte: 2 }, texto: 'Como solo uno dice la verdad, Gaby y Hugo mienten.' },
        { estado: { corte: 3 }, texto: `Hugo miente: lo contrario de su frase es cierto. Está en la de ${SOLP4[0]}.` },
        { estado: { corte: 4 }, texto: `Se comprueba: con la pelota ahí, solo es cierta la frase de Fito.` },
      ],
    },
    regla: {
      texto: 'Si solo uno dice la verdad y dos frases se contradicen, el veraz está en ese par: los demás mienten. Lo contrario de lo que dicen ellos es cierto.',
      ecuacion: [{ llave: ['el par que se contradice'], nota: 'ahí está el veraz' }, '   ·   ', { llave: ['los demás'], nota: 'mienten' }, ': ', { llave: ['lo contrario de lo que dicen'], nota: 'es cierto', color: 'c-i' }],
      condicion: 'el dato dice cuántas frases son ciertas. Con «solo uno miente» es al revés: el mentiroso está en el par.',
      voz: 'Lee bien el dato: ¿cuántos dicen la verdad?',
    },
    ejemplos: null,   // EJEMPLOS_VERAZ, abajo
    resuelve: {
      pieza: VZ,
      generar(s) {
        const r = azar(s + 900), c = casoC(r, 5, 4, 'fue'), [a, b] = c.par, fuera = c.fuera;
        const veraz = c.gente.find(z => !c.mentirosos.includes(z));
        return {
          enunciado: `${['En la feria del colegio alguien probó la torta antes de tiempo.', 'Alguien escondió las tizas del aula.', 'Alguien cambió la hora del reloj del patio.'][s % 3]} Hay cinco sospechosos y solo uno dice la verdad. ¿Quién fue?`,
          datos: [D_SOLOV, ...c.frases.map(x => dichoC(x, 'fue'))],
          dibujo: { datos: { habla: hablaC(c.frases, 'fue') }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden quién fue, entre los cinco sospechosos.' },
            { tipo: 'datos', texto: 'Son cinco frases y solo una es cierta: cuatro son falsas.' },
            { tipo: 'regla', texto: 'Busco el par que se contradice: ahí está el veraz. Los demás mienten, y lo contrario de lo que dicen es cierto.' },
            { tipo: 'aplica', texto: `${a} y ${b} se contradicen. ${lista(fuera.map(x => x.de))} mienten: es cierto ${lista(fuera.map(x => `«${contrariaC(x, 'fue')}»`))}.` },
            { tipo: 'aplica', texto: `Con eso, ${c.gente.filter(z => fuera.every(x => !valorC(c.frases, x, z))).length === 1 ? `solo queda ${c.c}` : `solo con ${c.c} queda una sola frase cierta`}.`,
              dibujo: { datos: { habla: hablaC(c.frases, 'fue', { c: c.c, seguro: true }) }, estado: {} } },
            { tipo: 'sentido', texto: `Compruebo: si fue ${c.c}, la única frase cierta es la de ${veraz}, que está en el par.` },
          ],
          respuesta: [F(`Fue ${c.c}`)],
        };
      },
    },
    ahoraTu: {
      pieza: VZ,
      voz: 'El veraz está en el par: los demás mienten.',
      generar(s) {
        const r = azar(s), tipo = s % 4, n = tipo === 3 ? 5 : 4, ctx = tipo === 0 ? 'mochila' : 'fue', c = casoC(r, n, n - 1, ctx);
        const datos = [D_SOLOV, ...c.frases.map(x => dichoC(x, ctx))];
        const dibujo = { datos: ctx === 'mochila' ? { escena: 'mochilas', objetos: mochilasDe(c.gente), habla: hablaC(c.frases, ctx) } : { habla: hablaC(c.frases, ctx) }, estado: {} };
        const sol = { datos: ctx === 'mochila' ? { escena: 'mochilas', objetos: mochilasDe(c.gente, c.c, 'seguro'), habla: hablaC(c.frases, ctx, { c: c.c }) } : { habla: hablaC(c.frases, ctx, { c: c.c, seguro: true }) }, estado: {} };
        const veraz = c.gente.find(z => !c.mentirosos.includes(z));
        if (tipo === 2) {
          const ops = c.gente.map(z => (z === veraz ? { id: 'c', texto: z, correcta: true }
            : { id: `g${c.gente.indexOf(z)}`, texto: z, error: c.par.includes(z) ? 'RMP148' : 'RMP149',
              siFuera: c.par.includes(z) ? `${z} está en el par, pero si su frase fuera la cierta ningún culpable dejaría falsas todas las demás.` : `${z} está fuera del par que se contradice: miente.` }));
          return { pregunta: `Alguien borró la pizarra. Hay cuatro sospechosos y solo uno dice la verdad. ¿Quién dice la verdad?`, datos, dibujo, opciones: ops,
            solucion: { texto: `${c.par[0]} y ${c.par[1]} se contradicen; los demás mienten. Con eso fue ${c.c}, y la frase cierta es la de ${veraz}.`, dibujo: sol } };
        }
        const texto = z => (ctx === 'mochila' ? `En la de ${z}` : z);
        const cree = c.fuera.find(x => x.f.fue);
        const ops = c.gente.map(z => (z === c.c ? { id: 'c', texto: texto(z), correcta: true }
          : { id: `g${c.gente.indexOf(z)}`, texto: texto(z), error: cree && cree.f.fue === z ? 'RMP149' : 'RMP72',
            siFuera: `${cree && cree.f.fue === z ? `Eso dice ${cree.de}, que miente. ` : ''}${ctx === 'mochila' ? 'Con la pelota ahí' : `Si fuera ${z}`}, habría ${plCiertas(ciertasC(c.frases, z))}; el dato pide 1.` }));
        return { pregunta: ctx === 'mochila' ? 'La pelota está en una de las cuatro mochilas y solo uno de los dueños dice la verdad. ¿En qué mochila está?'
          : `Alguien ${tipo === 1 ? 'pintó la carpeta' : 'apagó la luz del aula'}. Hay ${n === 4 ? 'cuatro' : 'cinco'} sospechosos y solo uno dice la verdad. ¿Quién fue?`, datos, dibujo, opciones: ops,
          solucion: { texto: `${c.par[0]} y ${c.par[1]} se contradicen: los demás mienten. Solo ${ctx === 'mochila' ? `en la de ${c.c}` : `con ${c.c}`} queda una frase cierta.`, dibujo: sol } };
      },
    },
  };


  // ---------- Ejemplos de «Dos frases que se contradicen» ----------
  // Comprobados aparte (scratchpad e6-rm/culpa.py: cada culpable posible y sus frases falsas): 1 no fallan juntas · 2 sí
  // pueden fallar juntas · 3 y 4 se contradicen · 5 Ciro y Dina dicen la verdad · 6 fue Beto · 7 miente Leo · 8 ganó Pía ·
  // 9 Omar recibió 20 (quedan 2 repartos y en los dos) · 10 fue Maru · 11 fue Ciro (C) · 12 miente Sara (D) · 13 6 aciertos
  // (E) · 14 caja 3 (A) · 15 fue Beto, con dos que mienten (B). La figura: quién dice qué, sin valores ni marcas.
  const FC = (de, f) => ({ de, f });
  const figC = (frases, ctx, extra) => ({ pieza: VZ, datos: Object.assign({ habla: hablaC(frases, ctx) }, extra || {}), estado: {} });
  const D_CONTRA = 'Lo contrario de una frase es falso justo cuando ella es cierta.';
  const C1 = [FC('Ana', { fue: 'Ciro' }), FC('Beto', { noFue: 'Ciro' })], C2 = [FC('Ana', { fue: 'Ciro' }), FC('Beto', { fue: 'Dina' })];
  const C3 = [FC('Ana', { fue: 'Beto' }), FC('Beto', { noFue: 'Beto' })], C4 = [FC('Beto', { fue: 'Dina' }), FC('Dina', { miente: 'Beto' })];
  const C6 = [FC('Ana', { fue: 'Beto' }), FC('Beto', { noFue: 'Beto' }), FC('Ciro', { fue: 'Beto' })];
  const C7 = [FC('Rosa', { fue: 'Leo' }), FC('Leo', { miente: 'Rosa' }), FC('Nora', { noFue: 'Teo' }), FC('Teo', { fue: 'Leo' })];
  const C8 = [FC('Sara', { fue: 'Pía' }), FC('Pía', { fue: 'Maru' }), FC('Maru', { miente: 'Pía' }), FC('Gino', { noFue: 'Gino' })];
  const C10 = [FC('Nora', { noFue: 'Leo' }), FC('Leo', { miente: 'Maru' }), FC('Maru', { fue: 'Nora' }), FC('Teo', { fue: 'Maru' })];
  const C11 = [FC('Ana', { fue: 'Ciro' }), FC('Beto', { noFue: 'Beto' }), FC('Ciro', { noFue: 'Dina' }), FC('Dina', { noFue: 'Eva' }), FC('Eva', { fue: 'Dina' })];
  const C12 = [FC('Lucho', { fue: 'Teo' }), FC('Vilma', { noFue: 'Sara' }), FC('Gino', { fue: 'Teo' }), FC('Sara', { fue: 'Gino' }), FC('Teo', { noFue: 'Gino' })];
  const C15 = [FC('Ana', { noFue: 'Ciro' }), FC('Beto', { miente: 'Ana' }), FC('Ciro', { fue: 'Beto' }), FC('Dina', { fue: 'Beto' }), FC('Eva', { fue: 'Ciro' })];
  const RESP13 = ['Ana', 'Beto'].map((q, i) => ({ celdas: [q, ...['V', 'F', 'F', 'V', 'V', 'F'].map(x => (i ? (x === 'V' ? 'F' : 'V') : x))] }));
  const EJEMPLOS_CONTRA = [
    { nivel: 1, titulo: 'Una frase y su negación', figura: figC(C1, 'fue'),
      enunciado: 'Ana y Beto hablan de quién rompió el vidrio. ¿Pueden ser falsas las dos frases a la vez?',
      datos: [D_CONTRA, ...C1.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Si fue Ciro, la frase de Ana es cierta y la de Beto, falsa. Si no fue Ciro, al revés.' },
        { texto: ['Nunca fallan juntas ni aciertan juntas: ', F('se contradicen'), '.'] },
      ],
      respuesta: [F('No'), ': siempre una es cierta y la otra, falsa'] },
    { nivel: 1, titulo: 'Distintas no es contrarias', figura: figC(C2, 'fue'),
      enunciado: 'Los sospechosos son Ana, Beto, Ciro y Dina. Ana y Beto hablan. ¿Sus frases se contradicen?',
      datos: [D_CONTRA, ...C2.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Si fue Ana, o si fue Beto, las dos frases son falsas a la vez.' },
        { texto: ['Pueden fallar juntas: ', F('no se contradicen'), '. Solo son frases distintas.'] },
      ],
      respuesta: [F('No se contradicen')] },
    { nivel: 1, titulo: '«Yo no fui»', figura: figC(C3, 'fue'),
      enunciado: 'Ana y Beto hablan de quién rompió el vidrio. ¿Sus frases se contradicen?',
      datos: [D_CONTRA, ...C3.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: '«Yo no fui», dicho por Beto, es «No fue Beto»: justo lo contrario de «Fue Beto».' },
        { texto: ['Si una es cierta, la otra es falsa: ', F('sí se contradicen'), '.'] },
      ],
      respuesta: [F('Sí se contradicen')] },
    { nivel: 1, titulo: 'Una frase sobre otra frase', figura: figC(C4, 'fue'),
      enunciado: 'Beto habla de quién rompió el vidrio, y Dina habla de lo que dijo Beto. ¿Sus frases se contradicen?',
      datos: [D_CONTRA, ...C4.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Si la frase de Beto es cierta, «Beto miente» es falsa. Si es falsa, «Beto miente» es cierta.' },
        { texto: ['Siempre una cierta y una falsa: ', F('se contradicen'), '.'] },
      ],
      respuesta: [F('Sí se contradicen')] },
    { nivel: 1, titulo: 'Los que están fuera del par', figura: figC(C1, 'fue'),
      enunciado: 'Ana, Beto, Ciro y Dina son los sospechosos, y solo uno de los cuatro miente. Ana y Beto hablan. ¿Qué se sabe de Ciro y de Dina?',
      datos: [D_SOLO1, ...C1.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Ana y Beto se contradicen: uno de los dos miente.' },
        { texto: ['Como miente uno solo, ', F('Ciro y Dina dicen la verdad'), ', digan lo que digan.'] },
      ],
      respuesta: [F('Ciro y Dina dicen la verdad')] },
    { nivel: 2, titulo: 'Tres sospechosos', figura: figC(C6, 'fue', { escena: 'ventana' }),
      enunciado: 'Uno de los tres rompió el vidrio y solo uno de ellos miente. ¿Quién fue?',
      datos: [D_SOLO1, ...C6.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Ana y Beto se contradicen: el que miente es uno de los dos.' },
        { texto: 'Ciro está fuera del par y dice la verdad: fue Beto.' },
        { texto: ['Fue ', F('Beto'), ', y su «Yo no fui» es la única frase falsa.'] },
      ],
      respuesta: [F('Fue Beto')] },
    { nivel: 2, titulo: '¿Quién miente?', figura: figC(C7, 'fue'),
      enunciado: 'Uno de los cuatro dejó la puerta abierta y solo uno miente. ¿Quién miente?',
      datos: [D_SOLO1, ...C7.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Rosa y Leo se contradicen: «Rosa miente» dice que la frase de Rosa es falsa.' },
        { texto: 'Nora y Teo dicen la verdad: fue Leo, como dice Teo.' },
        { texto: ['Entonces «Fue Leo», de Rosa, es cierta, y «Rosa miente» es falsa: miente ', F('Leo'), '.'] },
      ],
      respuesta: [F('Miente Leo')] },
    { nivel: 2, titulo: 'La ganadora de la rifa', figura: figC(C8, 'gano'),
      enunciado: 'Uno de los cuatro ganó la rifa del aniversario. Solo una de sus frases es falsa. ¿Quién ganó?',
      datos: [D_SOLO1, ...C8.map(x => dichoC(x, 'gano'))],
      solucion: [
        { texto: 'Pía y Maru se contradicen: «Pía miente» niega lo que dice Pía.' },
        { texto: 'Sara y Gino dicen la verdad: ganó Pía, como dice Sara.' },
        { texto: ['Ganó ', F('Pía'), '. La frase falsa es la suya, «Ganó Maru».'] },
      ],
      respuesta: [F('Ganó Pía')] },
    { nivel: 2, titulo: 'Tres sobres', figura: { pieza: VZ, datos: { habla: [{ quien: 'Lucho', dice: ['Recibí 50 soles'] }, { quien: 'Vilma', dice: ['Lucho miente'] }, { quien: 'Omar', dice: ['Recibí 20 soles'] }] }, estado: {} },
      enunciado: 'Lucho, Vilma y Omar recibieron sobres de 10, 20 y 50 soles, uno cada uno. Solo uno miente. ¿Cuánto recibió Omar?',
      datos: [D_SOLO1, 'Lucho dice: «Recibí 50 soles».', 'Vilma dice: «Lucho miente».', 'Omar dice: «Recibí 20 soles».'],
      solucion: [
        { texto: 'Lucho y Vilma se contradicen: el que miente está entre los dos.' },
        { texto: 'Omar está fuera del par y dice la verdad: recibió 20 soles.' },
        { texto: ['Lucho puede tener 50 o 10; en los dos casos, Omar tiene ', F('20 soles'), '.'] },
      ],
      respuesta: [F('20 soles')] },
    { nivel: 2, titulo: 'El par escondido', figura: figC(C10, 'fue'),
      enunciado: 'Uno de los cuatro pintó la carpeta y solo uno miente. ¿Quién fue?',
      datos: [D_SOLO1, ...C10.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Leo y Maru se contradicen: «Maru miente» niega lo que dice Maru.' },
        { texto: 'Nora y Teo dicen la verdad: fue Maru, como dice Teo.' },
        { texto: ['Fue ', F('Maru'), '. Su frase, «Fue Nora», es la falsa.'] },
      ],
      respuesta: [F('Fue Maru')] },
    { nivel: 3, titulo: 'Cinco sospechosos', figura: figC(C11, 'fue'),
      enunciado: 'Uno de los cinco se comió las galletas del compartir y solo uno miente. ¿Quién fue?',
      alternativas: ['Beto', 'Dina', 'Ciro', 'Eva', 'Ana'],
      datos: [D_SOLO1, ...C11.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Ciro y Eva se contradicen: «No fue Dina» y «Fue Dina». La falsa es una de las dos.' },
        { texto: 'Ana, Beto y Dina dicen la verdad. Ana dice «Fue Ciro»: fue Ciro.' },
        { texto: 'Con Ciro, la única falsa es la de Eva. Con cualquier otro, la frase de Ana sería falsa y también alguna más.' },
      ],
      respuesta: [{ negrita: 'C' }, ': ', F('Ciro')] },
    { nivel: 3, titulo: '¿Quién es el que miente?', figura: figC(C12, 'fue'),
      enunciado: 'Uno de los cinco se llevó la llave del laboratorio y solo uno miente. ¿Quién miente?',
      alternativas: ['Teo', 'Lucho', 'Gino', 'Sara', 'Vilma'],
      datos: [D_SOLO1, ...C12.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Sara y Teo se contradicen: «Fue Gino» y «No fue Gino».' },
        { texto: 'Lucho, Vilma y Gino dicen la verdad: fue Teo. Entonces «No fue Gino» es cierta y miente Sara.' },
        { texto: 'A es el otro del par: su frase es la cierta. B, C y E están fuera del par: dicen la verdad.' },
      ],
      respuesta: [{ negrita: 'D' }, ': ', F('Sara')] },
    { nivel: 3, titulo: 'Respuestas al revés', figura: { pieza: VZ, datos: { casos: { titulo: 'Lo que marcó cada uno', columnas: ['', '1', '2', '3', '4', '5', '6'], filas: RESP13 } }, estado: {} },
      enunciado: 'En una prueba de 6 preguntas de verdadero o falso, Ana y Beto marcaron al revés en todas. ¿Cuántas acertaron entre los dos?',
      alternativas: ['12', '3', 'Depende de la clave', '0', '6'],
      datos: ['Cada pregunta tiene una sola respuesta correcta: V o F.', 'V: verdadero. F: falso.'],
      solucion: [
        { texto: 'En cada pregunta, uno marcó V y el otro F: sus respuestas se contradicen.' },
        { texto: 'Por eso en cada pregunta acierta uno y falla el otro: un acierto por pregunta.', ecuacion: ['6 × 1 = ', F('6')] },
        { texto: 'A cuenta dos aciertos por pregunta; B supone la mitad; C no hace falta: con cualquier clave son 6; D, ninguno.' },
      ],
      respuesta: [{ negrita: 'E' }, ': ', F('6 aciertos')] },
    { nivel: 3, titulo: 'Tres cajas con cartel', figura: { pieza: VZ, datos: { escena: 'mochilas', objeto: 'caja', objetos: [{ t: 'Caja 1' }, { t: 'Caja 2' }, { t: 'Caja 3' }],
      habla: [{ quien: null, dice: ['Caja 1: El premio está aquí'] }, { quien: null, dice: ['Caja 2: El premio está en la caja 3'] }, { quien: null, dice: ['Caja 3: El premio no está en la caja 1'] }] }, estado: {} },
      enunciado: 'El premio está en una de las tres cajas, y cada caja tiene un cartel. Solo uno de los carteles es falso. ¿Dónde está el premio?',
      alternativas: ['En la caja 3', 'En la caja 1', 'En la caja 2', 'En ninguna', 'No se puede saber'],
      datos: ['Solo uno de los tres carteles es falso.', 'Caja 1: «El premio está aquí».', 'Caja 2: «El premio está en la caja 3».', 'Caja 3: «El premio no está en la caja 1».'],
      solucion: [
        { texto: 'Los carteles 1 y 3 se contradicen: el falso es uno de los dos.' },
        { texto: 'El cartel 2 está fuera del par y es cierto: el premio está en la caja 3.' },
        { texto: 'Con el premio en la 1 o en la 2, el cartel 2 sería falso y también otro. D y E no valen: el cartel 2 decide.' },
      ],
      respuesta: [{ negrita: 'A' }, ': ', F('en la caja 3')] },
    { nivel: 3, titulo: 'Dos que mienten', figura: figC(C15, 'fue'),
      enunciado: 'Uno de los cinco rayó la mesa. Esta vez mienten dos, ni más ni menos. ¿Quién fue?',
      alternativas: ['Ciro', 'Beto', 'Ana', 'Dina', 'Eva'],
      datos: ['Mienten dos: sus frases son falsas y las otras tres, ciertas.', ...C15.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Ana se contradice con Beto y también con Eva: en cada par hay una frase falsa.' },
        { texto: 'Si Ana mintiera, Beto y Eva acertarían, y Ciro y Dina, que dicen lo mismo, darían 1 o 3 falsas: no 2.' },
        { texto: 'Ana dice la verdad: mienten Beto y Eva, y Ciro y Dina aciertan. Fue Beto.' },
        { texto: 'Con A, C, D o E culpables, las frases de Ciro y Dina serían falsas: más de dos falsas.' },
      ],
      respuesta: [{ negrita: 'B' }, ': ', F('Beto')] },
  ];
  contradictorias.ejemplos = EJEMPLOS_CONTRA;

  // ---------- Ejemplos de «Cuando solo uno dice la verdad» ----------
  // Comprobados aparte (scratchpad e6-rm/culpa.py, con «una sola cierta»): 1 Ciro y Dina mienten · 2 no está en la de Ciro
  // · 3 está en la de Dina · 4 cuatro falsas · 5 no fue Dina · 6 fue Ciro · 7 en la de Nora · 8 ganó Sara · 9 dice la verdad
  // Lucho · 10 en la de Teo · 11 fue Beto (D) · 12 caja 2 (E) · 13 dice la verdad Leo (A) · 14 Omar no recibió 50, con dos
  // repartos posibles (B) · 15 fue Gino (C).
  const V6 = [FC('Ana', { fue: 'Beto' }), FC('Beto', { noFue: 'Beto' }), FC('Ciro', { noFue: 'Ciro' })];
  const V7 = [FC('Rosa', { fue: 'Leo' }), FC('Leo', { noFue: 'Leo' }), FC('Nora', { noFue: 'Nora' })];
  const V8 = [FC('Sara', { fue: 'Gino' }), FC('Gino', { fue: 'Pía' }), FC('Pía', { noFue: 'Sara' }), FC('Omar', { noFue: 'Gino' })];
  const V9 = [FC('Lucho', { noFue: 'Lucho' }), FC('Vilma', { miente: 'Lucho' }), FC('Teo', { fue: 'Pía' }), FC('Pía', { noFue: 'Vilma' })];
  const V10 = [FC('Rosa', { fue: 'Leo' }), FC('Nora', { noFue: 'Leo' }), FC('Leo', { fue: 'Nora' }), FC('Teo', { noFue: 'Teo' })];
  const V11 = [FC('Ana', { noFue: 'Ciro' }), FC('Beto', { noFue: 'Beto' }), FC('Ciro', { fue: 'Eva' }), FC('Dina', { noFue: 'Beto' }), FC('Eva', { miente: 'Ana' })];
  const V13 = [FC('Rosa', { fue: 'Maru' }), FC('Nora', { fue: 'Leo' }), FC('Leo', { miente: 'Nora' }), FC('Teo', { noFue: 'Nora' }), FC('Maru', { fue: 'Maru' })];
  const V15 = [FC('Sara', { fue: 'Omar' }), FC('Gino', { noFue: 'Gino' }), FC('Pía', { miente: 'Omar' }), FC('Omar', { fue: 'Gino' }), FC('Lucho', { fue: 'Lucho' })];
  const figV = (frases, ctx, extra) => figC(frases, ctx, extra);
  const EJEMPLOS_VERAZ = [
    { nivel: 1, titulo: 'El veraz, dentro del par', figura: figV(C1, 'fue'),
      enunciado: 'Ana, Beto, Ciro y Dina son los sospechosos, y solo uno dice la verdad. Ana y Beto hablan. ¿Qué se sabe de Ciro y de Dina?',
      datos: [D_SOLOV, ...C1.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Ana y Beto se contradicen: uno de los dos dice la verdad.' },
        { texto: ['Como solo uno dice la verdad, ', F('Ciro y Dina mienten'), '.'] },
      ],
      respuesta: [F('Ciro y Dina mienten')] },
    { nivel: 1, titulo: 'Lo que dice uno que miente', figura: figV([FC('Ciro', { fue: 'Ciro' })], 'mochila', { escena: 'mochilas', objetos: mochilasDe(S3) }),
      enunciado: 'La pelota está en una de las cuatro mochilas. Ciro miente. ¿Qué se sabe de su mochila?',
      datos: ['Lo que dice quien miente es falso: su contraria es cierta.', 'Ciro dice: «Está en la mía».'],
      solucion: [
        { texto: 'Ciro miente: «Está en la mía» es falsa.' },
        { texto: ['Lo contrario es cierto: ', F('no está en la mochila de Ciro'), '.'] },
      ],
      respuesta: [F('No está en la de Ciro')] },
    { nivel: 1, titulo: 'Una contraria que ubica', figura: figV([FC('Dina', { noFue: 'Dina' })], 'mochila', { escena: 'mochilas', objetos: mochilasDe(S3) }),
      enunciado: 'La pelota está en una de las cuatro mochilas. Dina miente. ¿Dónde está la pelota?',
      datos: ['Lo que dice quien miente es falso: su contraria es cierta.', 'Dina dice: «No está en la mía».'],
      solucion: [
        { texto: 'Dina miente: «No está en la mía» es falsa.' },
        { texto: ['Lo contrario es cierto: está ', F('en la mochila de Dina'), '.'] },
      ],
      respuesta: [F('En la mochila de Dina')] },
    { nivel: 1, titulo: '¿Cuántas son falsas?', figura: { pieza: VZ, datos: { habla: ['Rosa', 'Nora', 'Leo', 'Teo', 'Maru'].map(q => ({ quien: q, dice: [] })) }, estado: {} },
      enunciado: 'Cinco sospechosos dicen una frase cada uno, y solo uno dice la verdad. ¿Cuántas frases son falsas?',
      datos: [D_SOLOV, 'Cada uno dice una sola frase.'],
      solucion: [
        { texto: 'Una sola frase es cierta: la de quien dice la verdad. Las de los otros son falsas.', ecuacion: ['5 − 1 = ', F('4')] },
      ],
      respuesta: [F('4 frases falsas')] },
    { nivel: 1, titulo: 'Uno de fuera acusa', figura: figV(C1.concat([FC('Ciro', { fue: 'Dina' })]), 'fue'),
      enunciado: 'Ana, Beto, Ciro y Dina son los sospechosos, y solo uno dice la verdad. ¿Fue Dina?',
      datos: [D_SOLOV, ...C1.concat([FC('Ciro', { fue: 'Dina' })]).map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Ana y Beto se contradicen: el veraz es uno de los dos. Ciro miente.' },
        { texto: ['«Fue Dina» es falsa: ', F('no fue Dina'), '.'] },
      ],
      respuesta: [F('No fue Dina')] },
    { nivel: 2, titulo: 'Tres sospechosos', figura: figV(V6, 'fue'),
      enunciado: 'Uno de los tres rompió el vidrio y solo uno dice la verdad. ¿Quién fue?',
      datos: [D_SOLOV, ...V6.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Ana y Beto se contradicen: el veraz es uno de los dos.' },
        { texto: 'Ciro miente: lo contrario de «Yo no fui» es cierto.' },
        { texto: ['Fue ', F('Ciro'), '. Se comprueba: solo «Yo no fui», de Beto, es cierta.'] },
      ],
      respuesta: [F('Fue Ciro')] },
    { nivel: 2, titulo: 'Tres mochilas', figura: figV(V7, 'mochila', { escena: 'mochilas', objetos: mochilasDe(['Rosa', 'Leo', 'Nora']) }),
      enunciado: 'La pelota está en una de las tres mochilas, y solo uno de los dueños dice la verdad. ¿En cuál está?',
      datos: [D_SOLOV, ...V7.map(x => dichoC(x, 'mochila'))],
      solucion: [
        { texto: 'Rosa y Leo se contradicen: el veraz es uno de los dos.' },
        { texto: 'Nora miente: lo contrario de «No está en la mía» es cierto.' },
        { texto: ['Está en la de ', F('Nora'), '. Solo es cierta la frase de Leo.'] },
      ],
      respuesta: [F('En la de Nora')] },
    { nivel: 2, titulo: 'La rifa otra vez', figura: figV(V8, 'gano'),
      enunciado: 'Uno de los cuatro ganó la rifa y solo uno dice la verdad. ¿Quién ganó?',
      datos: [D_SOLOV, ...V8.map(x => dichoC(x, 'gano'))],
      solucion: [
        { texto: 'Sara y Omar se contradicen: «Ganó Gino» y «No ganó Gino». Ahí está el veraz.' },
        { texto: 'Gino y Pía mienten: no ganó Pía, y lo contrario de «No ganó Sara» es cierto.' },
        { texto: ['Ganó ', F('Sara'), '. Solo es cierta la frase de Omar.'] },
      ],
      respuesta: [F('Ganó Sara')] },
    { nivel: 2, titulo: '¿Quién dice la verdad?', figura: figV(V9, 'fue'),
      enunciado: 'Uno de los cuatro escondió el plumón y solo uno dice la verdad. ¿Quién dice la verdad?',
      datos: [D_SOLOV, ...V9.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Lucho y Vilma se contradicen: «Lucho miente» niega lo que dice Lucho.' },
        { texto: 'Teo y Pía mienten: no fue Pía, y lo contrario de «No fue Vilma» es cierto: fue Vilma.' },
        { texto: ['Con Vilma culpable, «Yo no fui», de Lucho, es cierta: dice la verdad ', F('Lucho'), '.'] },
      ],
      respuesta: [F('Lucho')] },
    { nivel: 2, titulo: 'Cuatro mochilas', figura: figV(V10, 'mochila', { escena: 'mochilas', objetos: mochilasDe(['Rosa', 'Nora', 'Leo', 'Teo']) }),
      enunciado: 'La pelota está en una de las cuatro mochilas, y solo uno de los dueños dice la verdad. ¿En cuál está?',
      datos: [D_SOLOV, ...V10.map(x => dichoC(x, 'mochila'))],
      solucion: [
        { texto: 'Rosa y Nora se contradicen: «Está en la de Leo» y «No está en la de Leo».' },
        { texto: 'Leo y Teo mienten: no está en la de Nora, y lo contrario de «No está en la mía» es cierto.' },
        { texto: ['Está en la de ', F('Teo'), '. Solo es cierta la frase de Nora.'] },
      ],
      respuesta: [F('En la de Teo')] },
    { nivel: 3, titulo: 'Cinco y un solo veraz', figura: figV(V11, 'fue'),
      enunciado: 'Uno de los cinco rompió la ventana del laboratorio y solo uno dice la verdad. ¿Quién fue?',
      alternativas: ['Ana', 'Ciro', 'Eva', 'Beto', 'Dina'],
      datos: [D_SOLOV, ...V11.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Ana y Eva se contradicen: «Ana miente» niega lo que dice Ana. Ahí está el único veraz.' },
        { texto: 'Beto, Ciro y Dina mienten: es cierto «Fue Beto», «No fue Eva» y «Fue Beto».' },
        { texto: 'Fue Beto. Con cualquier otro, «Yo no fui», de Beto, sería cierta, y con la del par serían dos.' },
      ],
      respuesta: [{ negrita: 'D' }, ': ', F('Beto')] },
    { nivel: 3, titulo: 'Un solo rótulo cierto', figura: { pieza: VZ, datos: { escena: 'mochilas', objeto: 'caja', objetos: [{ t: 'Caja 1' }, { t: 'Caja 2' }, { t: 'Caja 3' }],
      habla: [{ quien: null, dice: ['Caja 1: El premio está aquí'] }, { quien: null, dice: ['Caja 2: El premio no está aquí'] }, { quien: null, dice: ['Caja 3: El premio no está en la caja 1'] }] }, estado: {} },
      enunciado: 'El premio está en una de las tres cajas. Solo uno de los rótulos es cierto. ¿Dónde está el premio?',
      alternativas: ['En la caja 1', 'En la caja 3', 'En ninguna', 'No se puede saber', 'En la caja 2'],
      datos: ['Solo uno de los tres rótulos es cierto.', 'Caja 1: «El premio está aquí».', 'Caja 2: «El premio no está aquí».', 'Caja 3: «El premio no está en la caja 1».'],
      solucion: [
        { texto: 'Los rótulos 1 y 3 se contradicen: el único cierto está ahí.' },
        { texto: 'El rótulo 2 es falso: lo contrario de «El premio no está aquí» es cierto.' },
        { texto: 'Está en la caja 2. Con la 1 o la 3, el rótulo 2 sería cierto, y con el del par, dos ciertos. C y D no valen.' },
      ],
      respuesta: [{ negrita: 'E' }, ': ', F('en la caja 2')] },
    { nivel: 3, titulo: 'El único que dice la verdad', figura: figV(V13, 'fue'),
      enunciado: 'Uno de los cinco movió el reloj del patio y solo uno dice la verdad. ¿Quién dice la verdad?',
      alternativas: ['Leo', 'Nora', 'Teo', 'Rosa', 'Maru'],
      datos: [D_SOLOV, ...V13.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Nora y Leo se contradicen: el único veraz es uno de los dos.' },
        { texto: 'Rosa, Teo y Maru mienten: no fue Maru, y lo contrario de «No fue Nora» es cierto: fue Nora.' },
        { texto: 'Con Nora culpable, «Fue Leo» es falsa y «Nora miente» es cierta. B está en el par, pero falla; C, D y E mienten.' },
      ],
      respuesta: [{ negrita: 'A' }, ': ', F('Leo')] },
    { nivel: 3, titulo: 'El sobre de 50', figura: { pieza: VZ, datos: { habla: [{ quien: 'Lucho', dice: ['Recibí 50 soles'] }, { quien: 'Vilma', dice: ['Lucho miente'] }, { quien: 'Omar', dice: ['Recibí 50 soles'] }] }, estado: {} },
      enunciado: 'Lucho, Vilma y Omar recibieron sobres de 10, 20 y 50 soles, uno cada uno. Solo uno dice la verdad. ¿Quién, con seguridad, no recibió 50?',
      alternativas: ['Lucho', 'Omar', 'Vilma', 'Ninguno', 'No se puede saber'],
      datos: [D_SOLOV, 'Lucho dice: «Recibí 50 soles».', 'Vilma dice: «Lucho miente».', 'Omar dice: «Recibí 50 soles».'],
      solucion: [
        { texto: 'Lucho y Vilma se contradicen: el veraz está entre ellos.' },
        { texto: 'Omar miente: lo contrario de «Recibí 50 soles» es cierto. Omar no recibió 50.' },
        { texto: 'El de 50 lo tiene Lucho o Vilma: A y C son posibles, no seguros. D y E no valen: Omar seguro no.' },
      ],
      respuesta: [{ negrita: 'B' }, ': ', F('Omar')] },
    { nivel: 3, titulo: 'Uno en dos pares', figura: figV(V15, 'fue'),
      enunciado: 'Uno de los cinco se llevó la pelota de básquet y solo uno dice la verdad. ¿Quién fue?',
      alternativas: ['Sara', 'Omar', 'Gino', 'Lucho', 'Pía'],
      datos: [D_SOLOV, ...V15.map(x => dichoC(x, 'fue'))],
      solucion: [
        { texto: 'Omar se contradice con Gino y con Pía. Si Omar mintiera, Gino y Pía dirían la verdad: serían dos.' },
        { texto: 'Omar dice la verdad: fue Gino. Sara, Gino, Pía y Lucho mienten, como debe.' },
        { texto: 'Con cualquier otro culpable, Gino y Pía dirían la verdad: dos o más ciertas.' },
      ],
      respuesta: [{ negrita: 'C' }, ': ', F('Gino')] },
  ];
  soloVeraz.ejemplos = EJEMPLOS_VERAZ;

  // ---------- Idea 5: una verdad y una mentira ----------
  // Una frase de la carrera es { x, k }: «x llegó en el puesto k» («Llegué segunda» si x es quien habla). Cada atleta dice
  // dos y una sola es cierta. o: el orden de llegada (o[0] ganó). Todo sale de permutar y contar (vymEncaja).
  const FEM = new Set(['Ana', 'Dina', 'Eva', 'Gaby', 'Rosa', 'Nora', 'Maru', 'Sara', 'Pía', 'Vilma']);
  const ORDM = ['primero', 'segundo', 'tercero', 'cuarto'], ORDF = ['primera', 'segunda', 'tercera', 'cuarta'];
  const ordDe = (x, k) => (FEM.has(x) ? ORDF : ORDM)[k - 1];
  const textoP = (de, p) => (p.x === de ? `Llegué ${ordDe(de, p.k)}` : `${p.x} llegó ${ordDe(p.x, p.k)}`);
  const permutar = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((x, i) => permutar(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))));
  const valorP = (p, o) => o.indexOf(p.x) + 1 === p.k;
  const unaYUna = (x, o) => x.dos.filter(p => valorP(p, o)).length === 1;
  const vymEncaja = (frases, o) => frases.every(x => unaYUna(x, o));
  const vymQuedan = (gente, frases) => permutar(gente).filter(o => vymEncaja(frases, o));
  function hablaP(frases, o, extra = {}) {
    return frases.map(x => {
      const h = { quien: x.de, dice: x.dos.map(p => textoP(x.de, p)) };
      if (o) { h.valores = x.dos.map(p => Object.assign({ t: vf(valorP(p, o)), papel: 'sale' }, extra.desde !== undefined ? { desde: extra.desde } : {})); h.estado = unaYUna(x, o) ? ENCAJA : CHOCA; }
      return h;
    });
  }
  const podioDe = (o, papel) => ({ escena: 'podio', podio: o ? o.slice() : [], papelPodio: papel });
  const G5 = ['Ana', 'Beto', 'Ciro'];
  const P = (x, k) => ({ x, k });
  const F5 = [{ de: 'Ana', dos: [P('Ana', 2), P('Beto', 1)] }, { de: 'Beto', dos: [P('Beto', 2), P('Ana', 3)] }, { de: 'Ciro', dos: [P('Ciro', 2), P('Beto', 3)] }];
  const ORD5 = permutar(G5), SOL5 = vymQuedan(G5, F5);
  if (SOL5.length !== 1) throw new Error('juego de la idea 5: debe encajar un solo podio');
  function lecturaJ5(o) {
    const x = F5.find(y => !unaYUna(y, o));
    if (!x) return ['Cada uno dijo una verdad y una mentira: ', 'encaja'];
    return [`${x.de}: sus dos frases salen ${valorP(x.dos[0], o) ? 'ciertas' : 'falsas'}: choca`];
  }
  // La predicción: Dina dice «Llegué segunda» y «Llegué tercera»; en una carrera de cuatro.
  const FP5 = { de: 'Dina', dos: [P('Dina', 2), P('Dina', 3)] };
  const PUESTOS_P5 = [1, 2, 3, 4].filter(k => FP5.dos.filter(p => p.k === k).length === 1);
  const filaP5 = (k, d) => { const n = FP5.dos.filter(p => p.k === k).length; return { celdas: [`${ordDe('Dina', k)}`, { t: vf(k === 2), papel: 'sale' }, { t: vf(k === 3), papel: 'sale' }, n === 1 ? ENCAJA : CHOCA], fuera: n === 1 ? undefined : d + 1, desde: d }; };
  const D_VYM = 'Cada uno dice dos frases: una es cierta y la otra, falsa.';
  // Un caso de n atletas con un solo orden que encaja; en «Así se resuelve», alguien cuya frase falsa, supuesta cierta, choca.
  const QUIEN5 = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gaby', 'Hugo'];
  function casoP(r, n) {
    for (let t = 0; t < 4000; t++) {
      const gente = r.barajar(QUIEN5).slice(0, n), todos = permutar(gente);
      const frases = gente.map(de => {
        const a = P(de, r.ent(1, n)), y = r.elegir(gente.filter(z => z !== de)), b = P(y, r.ent(1, n));
        return { de, dos: r() < 0.5 ? [a, b] : [b, a] };
      });
      const textos = frases.flatMap(x => x.dos.map(p => `${p.x}${p.k}`));
      if (new Set(textos).size < textos.length) continue;
      const q = todos.filter(o => vymEncaja(frases, o));
      if (q.length !== 1) continue;
      return { gente, frases, o: q[0], todos };
    }
    return null;
  }
  const verdadYMentira = {
    id: 'verdad-y-mentira',
    titulo: 'Una verdad y una mentira',
    pregunta: '¿Qué se sabe de alguien que dice una verdad y una mentira?',
    temas: ['Método de suposición'],
    pieza: VZ,
    aprendizaje: 'Si cada uno dice una verdad y una mentira, sus dos frases no valen lo mismo: se supone cierta una y la otra queda falsa.',
    actividad: 'Armar el podio y mirar si cada atleta dijo una verdad y una mentira.',
    lee: {
      tarjetas: [
        { titulo: 'El podio de la carrera', texto: 'Terminó la carrera del aniversario. Ana, Beto y Ciro subieron al podio, y cada uno dice dos frases sobre los puestos.',
          pieza: VZ, dibujo: { datos: Object.assign(podioDe(['?', '?', '?']), { habla: hablaP(F5) }), estado: {} } },
        { titulo: 'Ni veraz ni mentiroso', texto: 'Aquí nadie tiene tarjeta. El dato es otro: sobre los puestos de llegada, cada uno dijo una frase cierta y una falsa. No se sabe cuál es cuál.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia el orden del podio. A la derecha verás si cada frase sale cierta o falsa. Busca el podio en que nadie dice dos verdades ni dos mentiras.' },
      ],
    },
    juega: {
      pieza: VZ,
      consigna: 'Ana, Beto y Ciro llegaron a la meta en los tres primeros puestos. Cada uno dijo una verdad y una mentira.',
      mision: {
        texto: 'Arma el podio en que cada uno dijo una verdad y una mentira.',
        logrado: v => vymEncaja(F5, ORD5[v.o]),
        bien: [`Podio ${SOL5[0].join(', ')}: cada uno, una verdad y una mentira. Los otros ${f0(ORD5.length - 1)} chocan.`],
      },
      voz: 'Mira las dos frases de cada atleta juntas.',
      leyenda: [
        { s: O('nombres del podio'), t: 'el orden que supones' },
        { s: I('cierta / falsa'), t: 'lo que vale cada frase así' },
        { s: '✗ choca', t: 'dos verdades o dos mentiras' },
      ],
      controles: [{ id: 'o', etiqueta: 'Podio (1.º, 2.º, 3.º)', opciones: ORD5.map((o, k) => ({ valor: k, texto: o.join(', ') })) }],
      dibujo: v => ({ datos: Object.assign(podioDe(ORD5[v.o], 'supuesto'), { habla: hablaP(F5, ORD5[v.o]) }), estado: {} }),
      lectura: v => lecturaJ5(ORD5[v.o]),
      minimo: 4,
    },
    predice: {
      pregunta: 'En otra carrera de cuatro, Dina dice: «Llegué segunda» y «Llegué tercera». Una es verdad y la otra, mentira. ¿Qué se sabe de Dina?',
      datos: ['En la carrera hay cuatro puestos, del primero al cuarto, uno por atleta.'],
      voz: 'Prueba cada puesto de Dina.',
      opciones: [
        { id: 'c', texto: 'Llegó segunda o tercera', correcta: true },
        { id: 'primera', texto: 'Llegó segunda', error: 'RMP150', siFuera: 'Puede ser, pero también tercera: así la frase cierta sería la otra.' },
        { id: 'niega', texto: 'Llegó primera o cuarta', error: 'RMP150', siFuera: 'Así las dos frases serían falsas. Dina dijo una verdad: no miente en todo.' },
        { id: 'nada', texto: 'Nada: no se sabe cuál es la verdad', error: 'RMP78', siFuera: 'No se sabe cuál, pero en los dos casos Dina no ganó ni llegó última.' },
      ],
      dibujo: { datos: { habla: hablaP([FP5]), casos: { columnas: ['Si llegó', 'Frase 1', 'Frase 2', 'Encaja'], filas: [1, 2, 3, 4].map(k => ({ celdas: [ordDe('Dina', k), '?', '?', '?'] })) } }, estado: {} },
      revelar: { datos: { habla: hablaP([FP5]), casos: { columnas: ['Si llegó', 'Frase 1', 'Frase 2', 'Encaja'], filas: [1, 2, 3, 4].map(k => filaP5(k, 0)).map(f => Object.assign(f, { fuera: f.fuera === undefined ? undefined : true })) } }, estado: {} },
      coincide: `Coincide: en ${lista(PUESTOS_P5.map(k => ordDe('Dina', k)), 'o')}, una frase es cierta y la otra falsa.`,
      noCoincide: 'Revisemos: si llegó primera o cuarta, las dos frases son falsas, y Dina dijo una verdad.',
    },
    mira: {
      pieza: VZ,
      datos: { habla: hablaP([FP5]), casos: { columnas: ['Si llegó', 'Frase 1', 'Frase 2', 'Encaja'], filas: [1, 4, 2, 3].map((k, i) => filaP5(k, i < 2 ? 1 : 3)) } },
      voz: 'Una verdad y una mentira: ni dos ciertas ni dos falsas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Si llegó primera o cuarta, las dos frases salen falsas.' },
        { estado: { corte: 2 }, texto: 'Dos mentiras chocan con el dato: esos puestos se descartan.' },
        { estado: { corte: 3 }, texto: 'Las dos no pueden ser ciertas: nadie llega en dos puestos.' },
        { estado: { corte: 4 }, texto: 'Quedan segunda y tercera. Seguro: no ganó ni llegó última.' },
      ],
    },
    regla: {
      texto: 'Si cada uno dice una verdad y una mentira, supón cierta una de sus frases: la otra es falsa. Sigue la cadena; si algo choca, la cierta era la otra.',
      ecuacion: [{ llave: ['supón cierta una'], nota: 'lo que supones', color: 'c-o' }, ': ', { llave: ['la otra es falsa'], nota: 'lo que sale', color: 'c-i' }],
      condicion: 'cada uno dice una frase cierta y una falsa: no es veraz ni mentiroso, y no se niegan las dos.',
      voz: 'Una frase supuesta cierta obliga a la otra.',
      dibujo: { pieza: VZ, datos: Object.assign(podioDe(SOL5[0]), { seguroPodio: true, habla: hablaP(F5, SOL5[0]) }), estado: {} },
    },
    ejemplos: null,   // EJEMPLOS_VYM, abajo
    resuelve: {
      pieza: VZ,
      generar(s) {
        const r = azar(s + 900), c = casoP(r, 3);
        // Se supone cierta la frase que es falsa en la solución: choca. Después, la otra.
        const x = c.frases[0], mala = x.dos.findIndex(p => !valorP(p, c.o)), buena = 1 - mala;
        const conMala = c.todos.filter(o => valorP(x.dos[mala], o) && !valorP(x.dos[buena], o));
        const quien = conMala.length ? conMala.map(o => c.frases.find(y => !unaYUna(y, o)).de) : [];
        return {
          enunciado: `${['En la carrera del aniversario,', 'En la posta del colegio,', 'En la competencia de natación,'][s % 3]} ${lista(c.gente)} llegaron en los tres primeros puestos. ¿Quién ganó?`,
          datos: [D_VYM, ...c.frases.map(y => `${y.de} dice: «${textoP(y.de, y.dos[0])}» y «${textoP(y.de, y.dos[1])}».`)],
          dibujo: { datos: Object.assign(podioDe(['?', '?', '?']), { habla: hablaP(c.frases) }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden quién llegó primero.' },
            { tipo: 'datos', texto: 'Cada uno dijo dos frases, una cierta y una falsa. Hay 6 órdenes posibles de llegada.', ecuacion: ['3 × 2 × 1 = 6'] },
            { tipo: 'regla', texto: `Supongo cierta una frase de ${x.de}: la otra queda falsa. Si algo choca, la cierta era la otra.` },
            { tipo: 'aplica', texto: conMala.length ? `Si es cierta «${textoP(x.de, x.dos[mala])}», quedan ${f0(conMala.length)} ${conMala.length === 1 ? 'orden' : 'órdenes'}, y en ${conMala.length === 1 ? 'él' : 'cada uno'} alguien dice dos verdades o dos mentiras (${lista([...new Set(quien)])}): choca.`
              : `«${textoP(x.de, x.dos[mala])}» no puede ser la cierta: con ella, la otra frase también saldría cierta o no queda orden posible.` },
            { tipo: 'aplica', texto: `Entonces es cierta «${textoP(x.de, x.dos[buena])}». Queda un solo orden: ${c.o.join(', ')}.`, dibujo: { datos: Object.assign(podioDe(c.o), { seguroPodio: true, habla: hablaP(c.frases, c.o) }), estado: {} } },
            { tipo: 'sentido', texto: 'Compruebo: con ese orden, cada uno tiene una frase cierta y una falsa.' },
          ],
          respuesta: [F(`Ganó ${c.o[0]}`)],
        };
      },
    },
    ahoraTu: {
      pieza: VZ,
      voz: 'Supón cierta una frase y sigue lo que obliga.',
      generar(s) {
        const r = azar(s), tipo = s % 4, n = tipo === 3 ? 4 : 3, c = casoP(r, n);
        const datos = [D_VYM, ...c.frases.map(y => `${y.de} dice: «${textoP(y.de, y.dos[0])}» y «${textoP(y.de, y.dos[1])}».`)];
        const dibujo = { datos: Object.assign(podioDe(Array(Math.min(n, 4)).fill('?')), { habla: hablaP(c.frases) }), estado: {} };
        const sol = { datos: Object.assign(podioDe(c.o), { seguroPodio: true, habla: hablaP(c.frases, c.o) }), estado: {} };
        const k = tipo === 1 ? n : tipo === 2 ? 2 : 1, pide = tipo === 2 ? r.elegir(c.gente) : null;
        const correcta = pide ? ordDe(pide, c.o.indexOf(pide) + 1) : c.o[k - 1];
        const cree = c.frases.map(y => y.dos[0]);
        const ops = (pide ? [1, 2, 3, 4].slice(0, n).map(j => ordDe(pide, j)) : c.gente).map(z => {
          if (z === correcta) return { id: 'c', texto: pide ? `Llegó ${z}` : z, correcta: true };
          const ok = pide ? (o => o.indexOf(pide) + 1 === [1, 2, 3, 4].find(j => ordDe(pide, j) === z)) : (o => o[k - 1] === z);
          const viene = !pide && cree.find(p => p.x === z && p.k === k);
          const ordenes = c.todos.filter(ok), quien = [...new Set(ordenes.map(o => c.frases.find(y => !unaYUna(y, o)).de))];
          return { id: `z${z}`, texto: pide ? `Llegó ${z}` : z, error: viene ? 'RMP150' : 'RMP72',
            siFuera: `${viene ? 'Lo dice una frase, pero puede ser la falsa. ' : ''}Así, en cada orden posible choca alguien: ${lista(quien)}.` };
        });
        return { pregunta: `${['Terminó la carrera del aniversario.', 'Terminó la posta del colegio.'][Math.floor(s / 4) % 2]} ${pide ? `¿En qué puesto llegó ${pide}?` : k === 1 ? '¿Quién ganó?' : '¿Quién llegó último?'}`.replace(/último\?$/, FEM.has(correcta) && k === n ? 'última?' : 'último?'),
          datos, dibujo, opciones: ops,
          solucion: { texto: `Queda un solo orden en que cada uno dice una verdad y una mentira: ${c.o.join(', ')}.`, dibujo: sol } };
      },
    },
  };

  // ---------- Ejemplos de «Una verdad y una mentira» ----------
  // Comprobados aparte (scratchpad e6-rm/podio.py e i56.py: todos los órdenes de llegada y todos los repartos de oficios):
  // 1 Leo segundo · 2 Teo no ganó · 3 ganó Maru o Gino · 4 Sara tercera · 5 seis podios · 6 ganó Teo · 7 Pía última ·
  // 8 ganó Eva · 9 Rosa segunda · 10 Omar médico · 11 ganó Teo (E) · 12 Sara última (A) · 13 Gaby tercera (B) · 14 Rosa
  // tercera (C) · 15 Sara, profesora (D). La figura: el podio vacío (o con el dato) y lo que dice cada uno.
  const VP = (de, ...ps) => ({ de, dos: ps.map(([x, k]) => P(x, k)) });
  const figP = (frases, podio) => ({ pieza: VZ, datos: Object.assign(podioDe(podio || ['?', '?', '?']), { habla: hablaP(frases) }), estado: {} });
  const datP = frases => [D_VYM, ...frases.map(y => `${y.de} dice: «${textoP(y.de, y.dos[0])}» y «${textoP(y.de, y.dos[1])}».`)];
  const Y1 = [VP('Rosa', ['Rosa', 1], ['Leo', 2])], Y2 = [VP('Teo', ['Teo', 1], ['Nora', 2])], Y3 = [VP('Maru', ['Maru', 1], ['Gino', 1])], Y4 = [VP('Sara', ['Sara', 3], ['Omar', 1])];
  const Y6 = [VP('Leo', ['Leo', 3], ['Nora', 1]), VP('Nora', ['Nora', 2], ['Leo', 2]), VP('Teo', ['Teo', 1], ['Leo', 1])];
  const Y7 = [VP('Sara', ['Sara', 2], ['Pía', 1]), VP('Gino', ['Gino', 1], ['Pía', 2]), VP('Pía', ['Pía', 3], ['Gino', 3])];
  const Y8 = [VP('Gaby', ['Gaby', 3], ['Eva', 2]), VP('Hugo', ['Hugo', 1], ['Eva', 1]), VP('Eva', ['Eva', 3], ['Hugo', 2])];
  const Y9 = [VP('Maru', ['Maru', 3], ['Rosa', 1]), VP('Omar', ['Omar', 1], ['Maru', 2]), VP('Rosa', ['Rosa', 2], ['Maru', 1])];
  const Y11 = [VP('Rosa', ['Teo', 1], ['Rosa', 4]), VP('Leo', ['Rosa', 1], ['Leo', 2]), VP('Nora', ['Leo', 1], ['Nora', 4]), VP('Teo', ['Rosa', 3], ['Teo', 4])];
  const Y12 = [VP('Sara', ['Pía', 4], ['Sara', 4]), VP('Gino', ['Gino', 1], ['Omar', 3]), VP('Pía', ['Gino', 4], ['Pía', 3]), VP('Omar', ['Sara', 1], ['Omar', 2])];
  const Y13 = [VP('Vilma', ['Vilma', 4], ['Gaby', 3]), VP('Lucho', ['Hugo', 2], ['Lucho', 2]), VP('Gaby', ['Vilma', 1], ['Gaby', 4]), VP('Hugo', ['Hugo', 4], ['Vilma', 2])];
  const Y14 = [VP('Rosa', ['Rosa', 3], ['Teo', 1]), VP('Leo', ['Nora', 1], ['Leo', 1]), VP('Nora', ['Leo', 3], ['Nora', 2]), VP('Teo', ['Rosa', 1], ['Teo', 4])];
  // Los oficios (ejemplos 10 y 15): cada frase es { x, j }: «x es j» («Soy j» si x habla). Una cierta y una falsa.
  const OFICIO = { medico: ['médico', 'médica'], profesor: ['profesor', 'profesora'], ingeniero: ['ingeniero', 'ingeniera'] };
  const of = (x, j) => OFICIO[j][FEM.has(x) ? 1 : 0];
  const textoO = (de, p) => (p.x === de ? `Soy ${of(de, p.j)}` : `${p.x} es ${of(p.x, p.j)}`);
  const VO = (de, ...ps) => ({ de, dos: ps.map(([x, j]) => ({ x, j })) });
  const Y10 = [VO('Lucho', ['Lucho', 'ingeniero'], ['Vilma', 'medico']), VO('Vilma', ['Vilma', 'profesor'], ['Omar', 'profesor']), VO('Omar', ['Omar', 'medico'], ['Lucho', 'profesor'])];
  const Y15 = [VO('Pía', ['Pía', 'ingeniero'], ['Sara', 'ingeniero']), VO('Gino', ['Gino', 'medico'], ['Sara', 'medico']), VO('Sara', ['Sara', 'profesor'], ['Pía', 'medico'])];
  const figO = frases => ({ pieza: VZ, datos: { habla: frases.map(y => ({ quien: y.de, dice: y.dos.map(p => textoO(y.de, p)) })) }, estado: {} });
  const datO = frases => [D_VYM, 'Son tres oficios distintos: médico, profesor e ingeniero, uno para cada uno.', ...frases.map(y => `${y.de} dice: «${textoO(y.de, y.dos[0])}» y «${textoO(y.de, y.dos[1])}».`)];
  const EJEMPLOS_VYM = [
    { nivel: 1, titulo: 'Una frase decide la otra', figura: figP(Y1),
      enunciado: 'Rosa, Leo y Nora corrieron la posta. Se sabe que Rosa llegó tercera. ¿En qué puesto llegó Leo?',
      datos: datP(Y1),
      solucion: [
        { texto: 'Rosa llegó tercera: «Llegué primera» es su frase falsa.' },
        { texto: ['Entonces la otra es la cierta: Leo llegó ', F('segundo'), '.'] },
      ],
      respuesta: [F('Segundo')] },
    { nivel: 1, titulo: 'Si una es cierta', figura: figP(Y2),
      enunciado: 'Teo, Nora y Gino corrieron. Se sabe que Nora llegó segunda. ¿Ganó Teo?',
      datos: datP(Y2),
      solucion: [
        { texto: 'Nora llegó segunda: la frase «Nora llegó segunda» es la cierta.' },
        { texto: ['Entonces «Llegué primero» es la falsa: ', F('Teo no ganó'), '.'] },
      ],
      respuesta: [F('No: Teo no ganó')] },
    { nivel: 1, titulo: 'Dos que dicen ganar', figura: figP(Y3),
      enunciado: 'Maru, Gino y Omar corrieron. Maru dice dos frases. ¿Qué es seguro?',
      datos: datP(Y3),
      solucion: [
        { texto: 'Las dos no pueden ser ciertas: hay un solo primero.' },
        { texto: ['Una sí es cierta. Entonces ', F('ganó Maru o ganó Gino'), '; Omar no ganó.'] },
      ],
      respuesta: [F('Ganó Maru o ganó Gino')] },
    { nivel: 1, titulo: 'El dato que falta', figura: figP(Y4),
      enunciado: 'Sara, Omar y Pía corrieron. Se sabe que Omar llegó segundo. ¿En qué puesto llegó Sara?',
      datos: datP(Y4),
      solucion: [
        { texto: 'Omar llegó segundo: «Omar llegó primero» es la frase falsa.' },
        { texto: ['La otra es la cierta: Sara llegó ', F('tercera'), '.'] },
      ],
      respuesta: [F('Tercera')] },
    { nivel: 1, titulo: 'Cuántos podios hay', figura: { pieza: VZ, datos: podioDe(['?', '?', '?']), estado: {} },
      enunciado: 'Tres atletas suben al podio. ¿De cuántas maneras distintas pueden quedar ordenados?',
      datos: ['Cada puesto, del 1 al 3, es de un solo atleta.'],
      solucion: [
        { texto: 'El primero puede ser cualquiera de los 3; el segundo, cualquiera de los 2 que quedan; el tercero, el último.', ecuacion: ['3 × 2 × 1 = ', F('6')] },
      ],
      respuesta: [F('6 podios')] },
    { nivel: 2, titulo: 'Quién ganó la posta', figura: figP(Y6),
      enunciado: 'Leo, Nora y Teo llegaron en los tres primeros puestos. ¿Quién ganó?',
      datos: datP(Y6),
      solucion: [
        { texto: 'Supón cierta «Nora llegó primera», de Leo. Teo no ganó: su cierta sería «Leo llegó primero». Dos primeros: choca.' },
        { texto: 'Entonces es cierta «Llegué tercero»: Leo llegó tercero. Teo, con «Leo llegó primero» falsa, ganó.' },
        { texto: ['Nora llegó segunda: una verdad y una mentira, como debe. Ganó ', F('Teo'), '.'] },
      ],
      respuesta: [F('Ganó Teo')] },
    { nivel: 2, titulo: 'Quién llegó última', figura: figP(Y7),
      enunciado: 'Sara, Gino y Pía llegaron en los tres primeros puestos. ¿Quién llegó en el tercer puesto?',
      datos: datP(Y7),
      solucion: [
        { texto: 'Supón cierta «Gino llegó tercero», de Pía. Gino no ganó: Pía llegó segunda. Sara, primera, diría dos mentiras: choca.' },
        { texto: 'Entonces es cierta «Llegué tercera»: Pía llegó en el tercer puesto.' },
        { texto: ['Gino ganó y Sara llegó segunda: cada uno con una verdad y una mentira. Tercera: ', F('Pía'), '.'] },
      ],
      respuesta: [F('Pía')] },
    { nivel: 2, titulo: 'Dos que dicen ser terceras', figura: figP(Y8),
      enunciado: 'Gaby, Hugo y Eva llegaron en los tres primeros puestos. ¿Quién ganó?',
      datos: datP(Y8),
      solucion: [
        { texto: 'Las dos frases de Hugo hablan del primero: ganó Hugo o ganó Eva.' },
        { texto: 'Si ganó Hugo, Eva llegó tercera y Gaby segunda: Gaby diría dos mentiras. Choca.' },
        { texto: ['Ganó ', F('Eva'), '. Hugo fue segundo y Gaby, tercera: cada uno con una verdad y una mentira.'] },
      ],
      respuesta: [F('Ganó Eva')] },
    { nivel: 2, titulo: 'El puesto de Rosa', figura: figP(Y9),
      enunciado: 'Maru, Omar y Rosa llegaron en los tres primeros puestos. ¿En qué puesto llegó Rosa?',
      datos: datP(Y9),
      solucion: [
        { texto: 'Supón cierta «Rosa llegó primera», de Maru. Rosa no es segunda: su cierta sería «Maru llegó primera». Dos primeras: choca.' },
        { texto: 'Entonces Maru llegó tercera. Rosa: «Maru llegó primera» es falsa, así que «Llegué segunda» es cierta.' },
        { texto: ['Rosa llegó ', F('segunda'), '; Omar ganó: también con una verdad y una mentira.'] },
      ],
      respuesta: [F('Segunda')] },
    { nivel: 2, titulo: 'Tres oficios', figura: figO(Y10),
      enunciado: 'Lucho, Vilma y Omar son médico, profesor e ingeniero, uno cada uno. ¿Qué oficio tiene Omar?',
      datos: datO(Y10),
      solucion: [
        { texto: 'Supón cierta «Vilma es médica», de Lucho. Vilma no es profesora: es cierta «Omar es profesor», y Lucho sería ingeniero: choca.' },
        { texto: 'Entonces Lucho es ingeniero y Vilma no es médica: es profesora.' },
        { texto: ['Omar es ', F('médico'), '. Cada uno dijo una verdad y una mentira.'] },
      ],
      respuesta: [F('Médico')] },
    { nivel: 3, titulo: 'Cuatro en la meta', figura: figP(Y11, ['?', '?', '?', '?']),
      enunciado: 'Rosa, Leo, Nora y Teo llegaron en los cuatro primeros puestos. ¿Quién ganó?',
      alternativas: ['Rosa', 'Leo', 'Nora', 'No se puede saber', 'Teo'],
      datos: datP(Y11),
      solucion: [
        { texto: 'Rosa y Nora dicen «Llegué cuarta»: no pueden acertar las dos.' },
        { texto: 'Si Nora no fuera cuarta, ganaría Leo; Leo no sería segundo y su cierta sería «Rosa llegó primera»: choca.' },
        { texto: 'Nora llegó cuarta. Rosa no lo es: es cierta «Teo llegó primero». Leo, segundo; Rosa, tercera.' },
        { texto: 'A, B y C dejan a alguien con dos verdades o dos mentiras; D no vale: queda un solo orden.' },
      ],
      respuesta: [{ negrita: 'E' }, ': ', F('Teo')] },
    { nivel: 3, titulo: 'El último lugar', figura: figP(Y12, ['?', '?', '?', '?']),
      enunciado: 'Sara, Gino, Pía y Omar llegaron en los cuatro primeros puestos. ¿Quién llegó en el último lugar?',
      alternativas: ['Sara', 'Pía', 'Gino', 'Omar', 'No se puede saber'],
      datos: datP(Y12),
      solucion: [
        { texto: 'Las dos frases de Sara hablan de la cuarta: la cuarta es Sara o Pía.' },
        { texto: 'Si Pía fuera cuarta, su cierta sería «Gino llegó cuarto»: dos cuartos, choca.' },
        { texto: 'Sara llegó cuarta. Omar no acierta «Sara llegó primera»: es segundo. Gino, primero; Pía, tercera.' },
        { texto: 'B choca; C y D dejarían a alguien con dos mentiras; E no vale.' },
      ],
      respuesta: [{ negrita: 'A' }, ': ', F('Sara')] },
    { nivel: 3, titulo: 'El tercer puesto', figura: figP(Y13, ['?', '?', '?', '?']),
      enunciado: 'Vilma, Lucho, Gaby y Hugo llegaron en los cuatro primeros puestos. ¿Quién llegó en el tercer puesto?',
      alternativas: ['Vilma', 'Gaby', 'Lucho', 'Hugo', 'No se puede saber'],
      datos: datP(Y13),
      solucion: [
        { texto: 'Las dos frases de Lucho hablan del segundo: el segundo es Lucho o Hugo.' },
        { texto: 'Si Hugo fuera segundo, su cierta sería «Vilma llegó segunda»: dos segundos, choca.' },
        { texto: 'Lucho es segundo. Hugo no acierta «Vilma llegó segunda»: es cuarto. Gaby, sin ser cuarta, acierta «Vilma llegó primera».' },
        { texto: 'Gaby llegó tercera. A y C tienen el 1 y el 2; D, el 4; E no vale.' },
      ],
      respuesta: [{ negrita: 'B' }, ': ', F('Gaby')] },
    { nivel: 3, titulo: 'Rosa en la meta', figura: figP(Y14, ['?', '?', '?', '?']),
      enunciado: 'Rosa, Leo, Nora y Teo llegaron en los cuatro primeros puestos. ¿En qué puesto llegó Rosa?',
      alternativas: ['Primera', 'Segunda', 'Tercera', 'Cuarta', 'No se puede saber'],
      datos: datP(Y14),
      solucion: [
        { texto: 'Las dos frases de Leo hablan del primero: ganó Nora o ganó Leo.' },
        { texto: 'Si ganó Nora, su cierta sería «Leo llegó tercero»; Teo sería cuarto y Rosa, segunda, diría dos mentiras: choca.' },
        { texto: 'Ganó Leo. Nora acierta «Llegué segunda»; Teo, «Llegué cuarto». Rosa llegó tercera.' },
        { texto: 'A, B y D dejan a alguien con dos verdades o dos mentiras; E no vale.' },
      ],
      respuesta: [{ negrita: 'C' }, ': ', F('tercera')] },
    { nivel: 3, titulo: 'Quién enseña', figura: figO(Y15),
      enunciado: 'Pía, Gino y Sara son médico, profesor e ingeniero, uno cada uno. ¿Quién es el que enseña, el profesor?',
      alternativas: ['Pía', 'Gino', 'Nadie', 'Sara', 'No se puede saber'],
      datos: datO(Y15),
      solucion: [
        { texto: 'Las dos frases de Pía hablan de la ingeniera: es Pía o es Sara.' },
        { texto: 'Si Sara fuera ingeniera, su cierta sería «Pía es médica»; Gino, profesor, diría dos mentiras: choca.' },
        { texto: 'Pía es ingeniera. Sara no acierta «Pía es médica»: es profesora. Gino, médico.' },
        { texto: 'A es ingeniera y B médico; C y E no valen: el profesor es Sara.' },
      ],
      respuesta: [{ negrita: 'D' }, ': ', F('Sara')] },
  ];
  verdadYMentira.ejemplos = EJEMPLOS_VYM;

  // ---------- Idea 6: ¿cuántos mienten? ----------
  // Las frases hablan de cuántos mienten en el grupo, también quien la dice ({ k: n } y { alMenos: n } de valorFrase). Se
  // supone cuántos mienten: las frases ciertas tienen que ser justo las de los veraces. Todo sale de quedanKK.
  const D_K = 'Veraz: siempre dice la verdad; mentiroso: siempre miente. Cada frase cuenta a todos, también a quien habla.';
  const G6 = ['Ana', 'Beto', 'Ciro', 'Dina'];
  const F6 = G6.map((de, i) => ({ de, f: { k: i + 1 } }));
  const SOL6 = quedanKK(G6, F6);
  if (SOL6.length !== 1) throw new Error('juego de la idea 6: debe encajar una sola suposición');
  const MIENTEN6 = G6.filter(x => !SOL6[0][x]).length;
  // Con k mentirosos supuestos, quién dice algo cierto (esos serían los veraces) y si la cuenta cuadra.
  function supK(gente, frases, k) {
    const v0 = Object.fromEntries(gente.map((x, i) => [x, i >= k]));   // cualquier grupo de k mentirosos: las frases solo cuentan
    const ciertas = frases.filter(x => valorFrase(x.de, x.f, v0)).map(x => x.de);
    return { ciertas, cuadra: ciertas.length === gente.length - k };
  }
  const nMienten = k => (k === 0 ? 'nadie' : `${f0(k)}`);
  // «Si no miente nadie», «Si miente 1», «Si mienten 3».
  const siMienten = k => (k === 0 ? 'no miente nadie' : `${k === 1 ? 'miente' : 'mienten'} ${f0(k)}`);
  function lecturaJ6(k) {
    const { ciertas, cuadra } = supK(G6, F6, k);
    if (cuadra) return [`Si ${siMienten(k)}: ${plCiertas(ciertas.length)}, ${f0(ciertas.length)} ${ciertas.length === 1 ? 'veraz' : 'veraces'}: `, 'encaja'];
    return [`Si ${siMienten(k)}: ${plCiertas(ciertas.length)}; harían falta ${f0(G6.length - k)}`];
  }
  const hablaK = (gente, frases, k) => {
    if (k === undefined) return hablaKK(gente, frases);
    const { ciertas } = supK(gente, frases, k), v = Object.fromEntries(gente.map(x => [x, ciertas.includes(x)]));
    return gente.map(q => ({ quien: q, dice: [textoFrase(q, frases.find(x => x.de === q).f, gente)], tarjeta: v[q] ? 'V' : 'M', papelTarjeta: 'supuesto', valores: [{ t: vf(ciertas.includes(q)), papel: 'sale' }] }));
  };
  const GP6 = ['Eva', 'Fito', 'Gaby'], FP6 = GP6.map(de => ({ de, f: { k: 1 } })), SOLP6 = quedanKK(GP6, FP6);
  if (SOLP6.length !== 1 || GP6.some(x => SOLP6[0][x])) throw new Error('predicción de la idea 6: deben mentir los tres');
  const filaP6 = (k, d) => { const { ciertas, cuadra } = supK(GP6, FP6, k); return { celdas: [nMienten(k), { t: vf(ciertas.length > 0), papel: 'sale' }, f0(ciertas.length), cuadra ? ENCAJA : CHOCA], fuera: cuadra ? undefined : d + 1, desde: d }; };
  const cuantos = {
    id: 'cuantos-mienten',
    titulo: '¿Cuántos mienten?',
    pregunta: '¿Qué pasa si una frase habla de cuántos mienten?',
    temas: ['Personajes que siempre mienten o dicen la verdad', 'Método de suposición'],
    pieza: VZ,
    aprendizaje: 'Se supone cuántos mienten: las frases ciertas deben ser justo las de los veraces. Quienes dicen lo mismo tienen la misma tarjeta.',
    actividad: 'Suponer cuántos mienten y contar las frases que salen ciertas.',
    lee: {
      tarjetas: [
        { titulo: 'La última ronda', texto: 'Última ronda del juego de las tarjetas. Ahora las frases no hablan de una persona: hablan de cuántos mienten en el grupo, contando a quien habla.',
          pieza: VZ, dibujo: { datos: { escena: 'tarjetas', panel: false, habla: hablaKK(G6, F6) }, estado: {} } },
        { titulo: 'Contar dos veces', texto: 'Si supones cuántos mienten, cada frase sale cierta o falsa. Quien dice algo cierto es veraz; quien dice algo falso, miente. Esa cuenta tiene que coincidir con lo supuesto.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia cuántos mienten. Mira cuántas frases salen ciertas y si alcanzan para los veraces que harían falta.' },
      ],
    },
    juega: {
      pieza: VZ,
      consigna: 'Ana, Beto, Ciro y Dina tienen su tarjeta. Cada uno dice cuántos mienten entre los cuatro.',
      mision: {
        texto: 'Supón cuántos mienten hasta que todo encaje.',
        logrado: v => supK(G6, F6, v.k).cuadra,
        bien: [`Mienten ${f0(MIENTEN6)}: hay una sola frase cierta y un solo veraz. Cuadra.`],
      },
      voz: '¿Cuántas frases ciertas? ¿Cuántos veraces harían falta?',
      leyenda: [
        { s: O('Supón: miente…'), t: 'la cuenta que pruebas' },
        { s: O('VERAZ / MIENTE'), t: 'la tarjeta que le toca a cada uno' },
        { s: I('cierta / falsa'), t: 'lo que vale su frase con esa cuenta' },
      ],
      controles: [{ id: 'k', etiqueta: 'Supón que mienten', min: 0, max: 4, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: v => ({ datos: { escena: 'tarjetas', supuesto: `Supón: ${siMienten(v.k)}`, habla: hablaK(G6, F6, v.k) }, estado: {} }),
      lectura: v => lecturaJ6(v.k),
      minimo: 4,
    },
    predice: {
      pregunta: 'En otra ronda, Eva, Fito y Gaby dicen lo mismo: «Aquí miente exactamente uno». ¿Cuántos de los tres mienten?',
      datos: [D_TARJ, 'La frase habla de los tres, también de quien la dice.'],
      voz: 'Si dicen lo mismo, ¿pueden tener tarjetas distintas?',
      opciones: [
        { id: 'c', texto: 'Los tres', correcta: true },
        { id: 'uno', texto: 'Uno', error: 'RMP151', siFuera: 'Si mintiera uno, la frase sería cierta: los tres serían veraces y no mentiría nadie.' },
        { id: 'ninguno', texto: 'Ninguno', error: 'RMP144', siFuera: 'Que coincidan no los hace veraces: sin mentirosos, la frase saldría falsa.' },
        { id: 'nose', texto: 'No se puede saber', error: 'RMP78', siFuera: 'Sí se sabe: se prueba cada cuenta y solo una encaja.' },
      ],
      dibujo: { datos: { escena: 'tarjetas', habla: hablaKK(GP6, FP6), casos: { columnas: ['Mienten', 'La frase', 'Veraces', 'Encaja'], filas: [0, 1, 2, 3].map(k => ({ celdas: [nMienten(k), '?', '?', '?'] })) } }, estado: {} },
      revelar: { datos: { escena: 'tarjetas', habla: hablaKK(GP6, FP6), casos: { columnas: ['Mienten', 'La frase', 'Veraces', 'Encaja'], filas: [0, 1, 2, 3].map(k => filaP6(k, 0)).map(f => Object.assign(f, { fuera: f.fuera === undefined ? undefined : true })) } }, estado: {} },
      coincide: 'Coincide: si la frase fuera cierta, los tres serían veraces y nadie mentiría. Es falsa: mienten los tres.',
      noCoincide: 'Revisemos: los tres dicen lo mismo, así que tienen la misma tarjeta. Con los tres veraces, la frase sería falsa.',
    },
    mira: {
      pieza: VZ,
      datos: { escena: 'tarjetas', habla: hablaKK(GP6, FP6), casos: { columnas: ['Mienten', 'La frase', 'Veraces', 'Encaja'], filas: [0, 1, 2, 3].map((k, i) => filaP6(k, i < 3 ? 1 : 3)) } },
      voz: 'Una cuenta por renglón.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Dicen lo mismo: la frase es cierta para los tres, o falsa para todos.' },
        { estado: { corte: 2 }, texto: 'Con 1 mintiendo, la frase es cierta y serían tres veraces: choca.' },
        { estado: { corte: 3 }, texto: 'Con los tres mintiendo, la frase es falsa y no hay veraces: encaja.' },
        { estado: { corte: 4 }, texto: 'Quienes dicen lo mismo tienen la misma tarjeta.' },
      ],
    },
    regla: {
      texto: 'Supón cuántos mienten y mira qué frases salen ciertas: deben ser justo las de quienes no mienten. Quienes dicen lo mismo tienen la misma tarjeta.',
      ecuacion: [{ llave: ['los que mienten'], nota: 'lo que supones', color: 'c-o' }, '   ·   ', { llave: ['frases ciertas'], nota: 'lo que sale', color: 'c-i' }, ' = ', { llave: ['los que no mienten'], nota: 'los veraces' }],
      condicion: 'la frase cuenta a todos los del grupo, también a quien la dice. «Por lo menos 2»: 2 o más.',
      voz: 'Dos cuentas que tienen que coincidir.',
      dibujo: { pieza: VZ, datos: { escena: 'tarjetas', habla: hablaK(G6, F6, MIENTEN6).map(h => Object.assign(h, { papelTarjeta: 'seguro' })) }, estado: {} },
    },
    ejemplos: null,   // EJEMPLOS_CUANTOS, abajo
    resuelve: {
      pieza: VZ,
      generar(s) {
        const r = azar(s + 900), n = 4 + (s % 2), c = casoCuantos(r, n, 'k');
        const filas = Array.from({ length: n + 1 }, (_, k) => k), { ciertas } = supK(c.gente, c.frases, c.mienten);
        return {
          enunciado: `${INTROS[s % 3]} Hablan ${lista(c.gente)}, y cada uno dice cuántos mienten. ¿Cuántos mienten?`,
          datos: [D_K, ...c.frases.map(x => dicho(x, c.gente))],
          dibujo: { datos: { escena: 'tarjetas', habla: hablaKK(c.gente, c.frases) }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden cuántos de los ${NUMS[n]} mienten.` },
            { tipo: 'regla', texto: 'Supongo cuántos mienten y cuento las frases ciertas. Tienen que ser tantas como los que no mienten.' },
            { tipo: 'cuentas', texto: 'Para cada cuenta: frases ciertas contra veraces que harían falta.',
              ecuacion: [filas.map(k => `${f0(k)}: ${f0(supK(c.gente, c.frases, k).ciertas.length)} y ${f0(n - k)}`).join('   ·   ')] },
            { tipo: 'aplica', texto: `Solo con ${f0(c.mienten)} coinciden: ${ciertas.length ? `es cierta la frase de ${lista(ciertas)}` : 'ninguna frase es cierta'}, y mienten los demás.`,
              dibujo: { datos: { escena: 'tarjetas', habla: hablaK(c.gente, c.frases, c.mienten).map(h => Object.assign(h, { papelTarjeta: 'seguro' })) }, estado: {} } },
            { tipo: 'sentido', texto: `Compruebo: ${f0(c.mienten)} dicen algo falso y ${f0(n - c.mienten)} algo cierto. Cada tarjeta encaja con su frase.` },
          ],
          respuesta: [F(`Mienten ${f0(c.mienten)}`)],
        };
      },
    },
    ahoraTu: {
      pieza: VZ,
      voz: 'Supón una cuenta y compara las dos.',
      generar(s) {
        const r = azar(s), tipo = s % 4, n = tipo === 3 ? 5 : 4, c = casoCuantos(r, n, tipo === 1 ? 'alMenos' : tipo >= 2 ? 'repite' : 'k');
        const datos = [D_K, ...(c.usaAlMenos ? ['Por lo menos 2: 2 o más.'] : []), ...c.frases.map(x => dicho(x, c.gente))];
        const num = k => (k === 0 ? 'Ninguno' : k === n ? `Los ${NUMS[n]}` : NUMS[k].replace(/^./, m => m.toUpperCase()));
        const ops = Array.from({ length: n + 1 }, (_, k) => k).map(k => {
          if (k === c.mienten) return { id: 'c', texto: num(k), correcta: true };
          const { ciertas } = supK(c.gente, c.frases, k), cree = c.frases.some(x => x.f.k === k || x.f.alMenos === k);
          return { id: `k${k}`, texto: num(k), error: cree ? 'RMP151' : 'RMP72',
            siFuera: `${cree ? 'Alguien lo dice, pero eso no basta. ' : ''}Con ${f0(k)} mintiendo saldrían ${plCiertas(ciertas.length)}, y harían falta ${f0(n - k)} veraces.` };
        });
        const quitar = ops.filter(o => !o.correcta);
        while (ops.length > 5) ops.splice(ops.indexOf(quitar.pop()), 1);
        return { pregunta: `${INTROS[Math.floor(s / 4) % 3]} Hablan ${lista(c.gente)}. ¿Cuántos de ellos mienten?`, datos,
          dibujo: { datos: { escena: 'tarjetas', habla: hablaKK(c.gente, c.frases) }, estado: {} }, opciones: ops,
          solucion: { texto: `Solo con ${f0(c.mienten)} mintiendo, las frases ciertas son tantas como los veraces: ${f0(n - c.mienten)}.`,
            dibujo: { datos: { escena: 'tarjetas', habla: hablaK(c.gente, c.frases, c.mienten).map(h => Object.assign(h, { papelTarjeta: 'seguro' })) }, estado: {} } } };
      },
    },
  };
  // ---------- Ejemplos de «¿Cuántos mienten?» ----------
  // Comprobados aparte (scratchpad e6-rm/i6.py: todas las suposiciones de tarjetas): 1 Leo MIENTE · 2 mienten dos · 3 Gino
  // MIENTE · 4 no pueden tener tarjetas distintas · 5 a lo más una cierta · 6 mienten dos · 7 mienten dos · 8 mienten
  // cuatro · 9 mienten los cuatro · 10 miente Eva · 11 Rosa y Nora (A) · 12 los cuatro (B) · 13 dos (C) · 14 Teo y Maru (D)
  // · 15 tres (E).
  const K = (de, f) => ({ de, f });
  const figK = (gente, frases, o) => ({ pieza: VZ, datos: { escena: 'tarjetas', habla: hablaKK(gente, frases, o) }, estado: {} });
  const datK = (gente, frases, extra = []) => [D_K, ...extra, ...frases.map(x => dicho(x, gente))];
  const W1 = ['Rosa', 'Leo'], K1 = [K('Rosa', { k: 1 })];
  const W2 = ['Sara', 'Gino', 'Pía'], K2 = [K('Sara', { alMenos: 2 })];
  const W3 = ['Gino', 'Omar', 'Teo'], K3 = [K('Gino', { k: 3 })];
  const W4 = ['Pía', 'Omar', 'Nora', 'Teo'], K4 = [K('Pía', { k: 1 }), K('Omar', { k: 1 })];
  const W5 = ['Ana', 'Beto', 'Ciro', 'Dina'], K5 = W5.map((de, i) => K(de, { k: i + 1 }));
  const W6 = ['Lucho', 'Vilma', 'Teo'], K6 = W6.map((de, i) => K(de, { k: i + 1 }));
  const W7 = ['Rosa', 'Leo', 'Nora', 'Teo'], K7 = W7.map((de, i) => K(de, { alMenos: i + 1 }));
  const W8 = ['Sara', 'Gino', 'Pía', 'Omar', 'Lucho'], K8 = W8.map((de, i) => K(de, { k: i + 1 }));
  const W9 = ['Hugo', 'Gaby', 'Fito', 'Eva'], K9 = [K('Hugo', { k: 1 }), K('Gaby', { k: 1 }), K('Fito', { k: 3 }), K('Eva', { k: 3 })];
  const W10 = ['Hugo', 'Eva', 'Fito'], K10 = [K('Hugo', { alMenos: 1 }), K('Eva', { m: 'Hugo' }), K('Fito', { v: 'Hugo' })];
  const W11 = ['Rosa', 'Leo', 'Nora', 'Teo'], K11 = [K('Rosa', { m: 'Teo' }), K('Leo', { alMenos: 3 }), K('Nora', { k: 2 }), K('Teo', { k: 3 })];
  const W12 = ['Sara', 'Gino', 'Pía', 'Omar'], K12 = [K('Sara', { k: 1 }), K('Gino', { k: 1 }), K('Pía', { v: 'Sara' }), K('Omar', { v: 'Gino' })];
  const W13 = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva'], K13 = [K('Ana', { k: 4 }), K('Beto', { m: 'Eva' }), K('Ciro', { k: 2 }), K('Dina', { v: 'Eva' }), K('Eva', { v: 'Ciro' })];
  const W14 = ['Rosa', 'Nora', 'Leo', 'Teo', 'Maru'], K14 = [K('Rosa', { alMenos: 5 }), K('Nora', { m: 'Maru' }), K('Leo', { k: 1 }), K('Teo', { alMenos: 1 }), K('Maru', { alMenos: 1 })];
  const W15 = ['Sara', 'Gino', 'Pía', 'Omar', 'Lucho'], K15 = [K('Sara', { m: 'Omar' }), K('Gino', { k: 1 }), K('Pía', { v: 'Omar' }), K('Omar', { k: 1 }), K('Lucho', { m: 'Omar' })];
  const D_PLM = 'Por lo menos 2: 2 o más.';
  const EJEMPLOS_CUANTOS = [
    { nivel: 1, titulo: 'Si quien habla es veraz', figura: figK(W1, K1, { dadas: { Rosa: true } }),
      enunciado: 'Rosa y Leo juegan con las tarjetas. Rosa muestra la suya: es VERAZ. ¿Qué tarjeta tiene Leo?',
      datos: datK(W1, K1),
      solucion: [
        { texto: 'Rosa es veraz: es cierto que entre los dos miente exactamente uno.' },
        { texto: ['Rosa no miente: el que miente es Leo. Leo tiene ', F('MIENTE'), '.'] },
      ],
      respuesta: [F('MIENTE')] },
    { nivel: 1, titulo: 'Por lo menos dos', figura: figK(W2, K2, { dadas: { Sara: true } }),
      enunciado: 'Sara, Gino y Pía juegan con las tarjetas. Sara muestra la suya: es VERAZ. ¿Cuántos de los tres mienten?',
      datos: datK(W2, K2, [D_PLM]),
      solucion: [
        { texto: 'Sara es veraz: mienten 2 o más. Pero Sara no miente: de los tres, a lo más mienten 2.' },
        { texto: ['Mienten ', F('2'), ': Gino y Pía.'] },
      ],
      respuesta: [F('Dos: Gino y Pía')] },
    { nivel: 1, titulo: 'Una frase que se acusa', figura: figK(W3, K3),
      enunciado: 'Gino, Omar y Teo tienen su tarjeta boca abajo. Solo Gino habla. ¿Qué tarjeta tiene Gino?',
      datos: datK(W3, K3),
      solucion: [
        { texto: 'Si Gino fuera veraz, su frase diría que mienten los tres, también él: choca.' },
        { texto: ['Gino tiene ', F('MIENTE'), ': su frase es falsa, y no mienten los tres.'] },
      ],
      respuesta: [F('MIENTE')] },
    { nivel: 1, titulo: 'Dos que dicen lo mismo', figura: figK(W4, K4),
      enunciado: 'Pía, Omar, Nora y Teo juegan con las tarjetas. Pía y Omar dicen la misma frase. ¿Pueden tener tarjetas distintas?',
      datos: datK(W4, K4),
      solucion: [
        { texto: 'La misma frase vale lo mismo en boca de los dos: cierta para ambos o falsa para ambos.' },
        { texto: ['Con una frase cierta los dos son veraces; con una falsa, los dos mienten: ', F('no'), '.'] },
      ],
      respuesta: [F('No: tienen la misma tarjeta')] },
    { nivel: 1, titulo: 'Números distintos', figura: figK(W5, K5),
      enunciado: 'Ana, Beto, Ciro y Dina dicen cuántos mienten entre los cuatro. ¿Cuántas de sus frases pueden ser ciertas a la vez?',
      datos: datK(W5, K5),
      solucion: [
        { texto: 'Cada uno da un número distinto, y la cantidad de mentirosos es una sola.' },
        { texto: ['Por eso acierta ', F('una, como máximo'), ': las otras dicen otro número.'] },
      ],
      respuesta: [F('Una, como máximo')] },
    { nivel: 2, titulo: 'Tres números', figura: figK(W6, K6),
      enunciado: 'Lucho, Vilma y Teo juegan con las tarjetas y hablan. ¿Cuántos de ellos mienten?',
      datos: datK(W6, K6),
      solucion: [
        { texto: 'A lo más una frase es cierta: hay a lo más un veraz, y mienten 2 o 3.' },
        { texto: 'Con 3 mentirosos, Teo acertaría y sería veraz: choca. Con 2, acierta Vilma: un veraz y dos mentirosos.' },
        { texto: ['Mienten ', F('2'), ': Lucho y Teo.'] },
      ],
      respuesta: [F('Dos')] },
    { nivel: 2, titulo: 'Por lo menos', figura: figK(W7, K7),
      enunciado: 'Rosa, Leo, Nora y Teo juegan con las tarjetas y hablan. ¿Cuántos de ellos mienten?',
      datos: datK(W7, K7, [D_PLM]),
      solucion: [
        { texto: 'Con 0 mentirosos ninguna frase acierta, y harían falta 4 veraces. Con 1, acierta una sola y harían falta 3. Choca.' },
        { texto: 'Con 3, aciertan tres frases, pero habría 1 veraz. Con 4, aciertan las cuatro. Choca.' },
        { texto: ['Con 2, aciertan dos frases y hay 2 veraces, Rosa y Leo. Mienten ', F('2'), ': Nora y Teo.'] },
      ],
      respuesta: [F('Dos')] },
    { nivel: 2, titulo: 'Cinco números', figura: figK(W8, K8),
      enunciado: 'Sara, Gino, Pía, Omar y Lucho juegan con las tarjetas y hablan. ¿Cuántos de ellos mienten?',
      datos: datK(W8, K8),
      solucion: [
        { texto: 'Dan cinco números distintos: a lo más uno acierta.' },
        { texto: 'Si nadie acierta, mienten los cinco, y Lucho acertaría: choca. Acierta uno solo y mienten 4.' },
        { texto: ['El que acierta es Omar, que dice «exactamente cuatro». Mienten ', F('4'), '.'] },
      ],
      respuesta: [F('Cuatro')] },
    { nivel: 2, titulo: 'Dos parejas', figura: figK(W9, K9),
      enunciado: 'Hugo, Gaby, Fito y Eva juegan con las tarjetas y hablan. ¿Cuántos de ellos mienten?',
      datos: datK(W9, K9),
      solucion: [
        { texto: 'Hugo y Gaby dicen lo mismo, y también Fito y Eva: cada pareja tiene la misma tarjeta.' },
        { texto: 'Si Hugo y Gaby fueran veraces, mentirían 1 o 3: no 1, porque serían 2 mintiendo. Choca. Si Fito y Eva, mentirían 2, no 3: choca.' },
        { texto: ['Mienten ', F('los cuatro'), ': ninguno dijo «cuatro», así que todas las frases son falsas.'] },
      ],
      respuesta: [F('Los cuatro')] },
    { nivel: 2, titulo: 'Dos frases sobre Hugo', figura: figK(W10, K10),
      enunciado: 'Hugo, Eva y Fito juegan con las tarjetas y hablan. ¿Quién miente?',
      datos: datK(W10, K10, ['Por lo menos 1: 1 o más.']),
      solucion: [
        { texto: 'Eva y Fito dicen lo contrario sobre Hugo: uno de los dos miente. Ya hay por lo menos un mentiroso.' },
        { texto: 'Entonces la frase de Hugo es cierta: Hugo es veraz, y también Fito.' },
        { texto: ['Miente ', F('Eva'), '.'] },
      ],
      respuesta: [F('Solo Eva')] },
    { nivel: 3, titulo: 'Cuatro que cuentan', figura: figK(W11, K11),
      enunciado: 'Rosa, Leo, Nora y Teo juegan con las tarjetas y hablan. ¿Quiénes dicen la verdad?',
      alternativas: ['Rosa y Nora', 'Solo Nora', 'Leo y Teo', 'Nadie', 'Rosa, Nora y Teo'],
      datos: datK(W11, K11, ['Por lo menos 3: 3 o más.']),
      solucion: [
        { texto: 'Con 3 mentirosos, Leo y Teo acertarían: 2 veraces, pero con 3 de 4 mintiendo solo hay 1. Con 4, Leo acertaría. Choca.' },
        { texto: 'Con 0 o 1 mentiroso, fallan Leo, Nora y Teo: no alcanzan los veraces. Choca.' },
        { texto: 'Con 2: acierta Nora; Leo y Teo mienten, y «Teo miente» es cierta. Veraces: Rosa y Nora.' },
        { texto: 'B, C, D y E no dejan dos veraces con dos mentirosos.' },
      ],
      respuesta: [{ negrita: 'A' }, ': ', F('Rosa y Nora')] },
    { nivel: 3, titulo: 'Los que van juntos', figura: figK(W12, K12),
      enunciado: 'Sara, Gino, Pía y Omar juegan con las tarjetas y hablan. ¿Cuántos de ellos mienten?',
      alternativas: ['Uno', 'Los cuatro', 'Dos', 'Ninguno', 'Tres'],
      datos: datK(W12, K12),
      solucion: [
        { texto: 'Sara y Gino dicen lo mismo: misma tarjeta. Pía le cree a Sara y Omar a Gino: los cuatro van juntos.' },
        { texto: 'O mienten 0, o mienten 4. Con 0, «miente exactamente uno» saldría falsa en boca de veraces: choca.' },
        { texto: 'Mienten los cuatro: sus frases son falsas, como debe. A, C y E separan a quienes van juntos; D choca.' },
      ],
      respuesta: [{ negrita: 'B' }, ': ', F('los cuatro')] },
    { nivel: 3, titulo: 'Una cadena de confianza', figura: figK(W13, K13),
      enunciado: 'Ana, Beto, Ciro, Dina y Eva juegan con las tarjetas y hablan. ¿Cuántos de ellos mienten?',
      alternativas: ['Cuatro', 'Tres', 'Dos', 'Uno', 'Ninguno'],
      datos: datK(W13, K13),
      solucion: [
        { texto: 'Eva le cree a Ciro y Dina a Eva: Ciro, Dina y Eva tienen la misma tarjeta. Beto dice lo contrario de Dina.' },
        { texto: 'Si esos tres mintieran, Beto sería veraz, y Ana chocaría: con ella mintiendo serían 4, y con ella veraz, 3.' },
        { texto: 'Ciro, Dina y Eva son veraces: mienten exactamente 2, como dice Ciro: Ana y Beto.' },
        { texto: 'A choca con lo que dice Ciro; B, D y E no cuadran con tres veraces.' },
      ],
      respuesta: [{ negrita: 'C' }, ': ', F('dos')] },
    { nivel: 3, titulo: 'Por lo menos cinco', figura: figK(W14, K14),
      enunciado: 'Rosa, Nora, Leo, Teo y Maru juegan con las tarjetas y hablan. ¿Quiénes dicen la verdad?',
      alternativas: ['Solo Rosa', 'Leo, Teo y Maru', 'Nora y Leo', 'Teo y Maru', 'Nadie'],
      datos: datK(W14, K14),
      solucion: [
        { texto: 'Si Rosa fuera veraz, mentirían los cinco, también ella: choca. Rosa miente.' },
        { texto: 'Ya hay un mentiroso: Teo y Maru aciertan. Entonces «Maru miente» es falsa: Nora miente.' },
        { texto: 'Mienten 3, no 1: Leo también miente. Veraces: Teo y Maru.' },
        { texto: 'A choca; B y C ponen veraz a Leo o a Nora con una frase falsa; E deja falsas frases ciertas.' },
      ],
      respuesta: [{ negrita: 'D' }, ': ', F('Teo y Maru')] },
    { nivel: 3, titulo: 'Tres juntos, dos al revés', figura: figK(W15, K15),
      enunciado: 'En la última ronda hablan Sara, Gino, Pía, Omar y Lucho. ¿Cuántos de ellos mienten?',
      alternativas: ['Uno', 'Dos', 'Cuatro', 'Ninguno', 'Tres'],
      datos: datK(W15, K15),
      solucion: [
        { texto: 'Gino y Omar dicen lo mismo, y Pía le cree a Omar: los tres van juntos. Sara y Lucho dicen lo contrario de Pía.' },
        { texto: 'Si Omar fuera veraz, Sara y Lucho mentirían: 2 mentirosos, no 1. Choca.' },
        { texto: 'Omar miente, con Gino y Pía; Sara y Lucho son veraces. Mienten 3, y «exactamente uno» es falsa.' },
        { texto: 'A, B, C y D no cuadran con las tarjetas que obligan las frases.' },
      ],
      respuesta: [{ negrita: 'E' }, ': ', F('tres')] },
  ];
  cuantos.ejemplos = EJEMPLOS_CUANTOS;

  // Un acertijo de n personas con frases de cuántos mienten. modo 'k': cada uno dice «exactamente j» (j distinto o no);
  // 'alMenos': «por lo menos j»; 'repite': dos frases, repetidas. Una sola cuenta tiene que cuadrar.
  function casoCuantos(r, n, modo) {
    for (let t = 0; t < 4000; t++) {
      const gente = r.barajar(NOMBRES).slice(0, n).sort((a, b) => NOMBRES.indexOf(a) - NOMBRES.indexOf(b));
      let frases;
      if (modo === 'k') { const js = r.barajar(Array.from({ length: n }, (_, j) => j + 1)).slice(0, n); frases = gente.map((de, i) => ({ de, f: { k: js[i] } })); }
      else if (modo === 'alMenos') { const js = r.barajar(Array.from({ length: n }, (_, j) => j + 1)); frases = gente.map((de, i) => ({ de, f: r() < 0.75 ? { alMenos: js[i] } : { k: js[i] } })); }
      else { const a = r.ent(1, n), b = r.ent(1, n); if (a === b) continue; frases = gente.map((de, i) => ({ de, f: { k: i < Math.ceil(n / 2) ? a : b } })); }
      const cuadran = Array.from({ length: n + 1 }, (_, k) => k).filter(k => supK(gente, frases, k).cuadra);
      if (cuadran.length !== 1) continue;
      if (modo === 'alMenos' && !frases.some(x => x.f.alMenos !== undefined)) continue;
      // La cuenta que cuadra deja una sola suposición de tarjetas (las que dicen algo cierto son las veraces).
      if (quedanKK(gente, frases).length !== 1) continue;
      return { gente, frases, mienten: cuadran[0], usaAlMenos: frases.some(x => x.f.alMenos !== undefined) };
    }
    return null;
  }

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1 (idea 1): el acertijo de tres con la frase de Ciro cambiable: hay frases con una, ninguna o varias suposiciones
  // que encajan (el caso raro: la información no decide). Todo sale de encaja y quedanKK.
  const T3 = ['Ana', 'Beto', 'Ciro'];
  const FRASES_CIRO = [{ mm: ['Ana', 'Beto'] }, { m: 'Ana' }, { v: 'Beto' }, { v: 'Ana' }];
  const fr3 = k => [{ de: 'Ana', f: { m: 'Beto' } }, { de: 'Beto', f: { m: 'Ciro' } }, { de: 'Ciro', f: FRASES_CIRO[k] }];
  const v3 = val => ({ Ana: val.a === 'V', Beto: val.b === 'V', Ciro: val.c === 'V' });
  const cuantasEncajan = k => quedanKK(T3, fr3(k)).length;
  const VM = [{ valor: 'V', texto: 'Veraz' }, { valor: 'M', texto: 'Miente' }];
  const mesaTres = {
    id: 'tres-que-hablan', titulo: 'Tres que hablan', pieza: VZ,
    consigna: 'Ana dice «Beto miente» y Beto, «Ciro miente». Cambia lo que dice Ciro y voltea las tarjetas: ¿cuántas suposiciones encajan?',
    controles: [
      { id: 'fc', etiqueta: 'Ciro dice', opciones: FRASES_CIRO.map((f, k) => ({ valor: k, texto: textoFrase('Ciro', f, T3) })) },
      { id: 'a', etiqueta: 'Ana', opciones: VM }, { id: 'b', etiqueta: 'Beto', opciones: VM }, { id: 'c', etiqueta: 'Ciro', opciones: VM },
    ],
    dibujo: val => ({ datos: { escena: 'tarjetas', habla: hablaKK(T3, fr3(val.fc), { v: v3(val), toque: { Ana: 'a', Beto: 'b', Ciro: 'c' } }) }, estado: {} }),
    lectura: val => [encaja(fr3(val.fc), v3(val)) ? 'Encaja' : 'Choca', ` · ${f0(cuantasEncajan(val.fc))} de 8 suposiciones encajan`],
    invitaciones: [
      { texto: 'Encuentra una suposición que encaje con lo que dice Ciro.', logrado: val => encaja(fr3(val.fc), v3(val)),
        bien: 'Ninguna frase choca. ¿Será la única? Prueba las otras.' },
      { texto: 'Elige una frase de Ciro con la que ninguna suposición encaje.', logrado: val => cuantasEncajan(val.fc) === 0,
        bien: 'Con esa frase el acertijo no tiene salida: todas las suposiciones chocan.' },
      { texto: 'Elige una frase de Ciro con la que encaje más de una suposición.', logrado: val => cuantasEncajan(val.fc) > 1,
        bien: 'Encajan dos: la información todavía no decide entre ellas.' },
      { texto: 'Guarda dos suposiciones distintas que encajen con la misma frase de Ciro.',
        logrado: (val, g) => g.some(x => g.some(y => x.fc === y.fc && JSON.stringify(v3(x)) !== JSON.stringify(v3(y)) && encaja(fr3(x.fc), v3(x)) && encaja(fr3(y.fc), v3(y)))),
        bien: 'Dos repartos de tarjetas, los dos sin choques: no hay respuesta única.' },
    ],
  };
  // Mesa 2 (ideas 3 y 4): el vidrio roto con las dos condiciones del examen, «solo uno miente» o «solo uno dice la verdad».
  const pideFalsas = cond => (cond === 'miente' ? 1 : S3.length - 1);
  const encajaCulpa = val => falsasC(F3, S3[val.c]) === pideFalsas(val.cond);
  const mesaCulpa = {
    id: 'quien-fue', titulo: '¿Quién rompió el vidrio?', pieza: VZ,
    consigna: 'Supón culpables y cambia la condición. Cuenta las frases falsas que deja cada culpable.',
    controles: [
      { id: 'cond', etiqueta: 'Condición', opciones: [{ valor: 'miente', texto: 'Solo uno miente' }, { valor: 'veraz', texto: 'Solo uno dice la verdad' }] },
      { id: 'c', etiqueta: 'Supón que fue', opciones: S3.map((x, k) => ({ valor: k, texto: x })) },
    ],
    dibujo: val => ({ datos: { escena: 'ventana', supuesto: CTX.fue.supon(S3[val.c]), habla: hablaC(F3, 'fue', { c: S3[val.c] }) }, estado: {} }),
    lectura: val => [`${plFalsas(falsasC(F3, S3[val.c]))}; se piden ${f0(pideFalsas(val.cond))} · `, encajaCulpa(val) ? 'encaja' : 'no encaja'],
    invitaciones: [
      { texto: 'Con «solo uno miente», encuentra al culpable que encaja.', logrado: val => val.cond === 'miente' && encajaCulpa(val),
        bien: 'Una sola frase falsa: la de Beto, que se contradice con la de Dina.' },
      { texto: 'Cambia a «solo uno dice la verdad» y busca de nuevo.', logrado: val => val.cond === 'veraz' && encajaCulpa(val),
        bien: 'Otra condición, otro culpable. Las frases eran las mismas.' },
      { texto: 'Busca al sospechoso que deja más frases falsas.', logrado: val => falsasC(F3, S3[val.c]) === Math.max(...S3.map(x => falsasC(F3, x))),
        bien: 'Con él fallan tres: justo lo que pide «solo uno dice la verdad».' },
      { texto: 'Guarda los dos culpables que encajan, uno con cada condición.',
        logrado: (val, g) => g.some(x => x.cond === 'miente' && encajaCulpa(x)) && g.some(x => x.cond === 'veraz' && encajaCulpa(x)),
        bien: 'La condición del enunciado decide quién fue. Léela antes de suponer.' },
    ],
  };
  // Mesa 3 (idea 2): seis alumnos en la lista; cada frase junto a su contraria: siempre valen lo opuesto.
  const SEIS = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito'];
  const frasesSeis = n => { const ap = SEIS.map((_, k) => k < n); return { ap, todos: ap.every(Boolean), ninguno: !ap.some(Boolean) }; };
  const datosSeis = val => {
    const { todos, ninguno } = frasesSeis(val.n);
    return { escena: 'mural', lista: SEIS.map((t, k) => ({ t, ok: k < val.n })), habla: [
      { quien: null, dice: ['Todos aprobaron', 'Al menos uno no aprobó'], valores: [{ t: vf(todos), papel: 'sale' }, { t: vf(!todos), papel: 'sale' }] },
      { quien: null, dice: ['Ninguno aprobó', 'Al menos uno aprobó'], valores: [{ t: vf(ninguno), papel: 'sale' }, { t: vf(!ninguno), papel: 'sale' }] }] };
  };
  const mesaSeis = {
    id: 'seis-alumnos', titulo: 'Cada frase y su contraria', pieza: VZ,
    consigna: 'Cambia cuántos aprobaron. Cada frase está junto a su contraria: compara cómo cambian.',
    controles: [{ id: 'n', etiqueta: 'Aprobaron', min: 0, max: 6, paso: 1, inicio: 6, decimales: 0 }],
    dibujo: val => ({ datos: datosSeis(val), estado: {} }),
    lectura: val => [`${f0(val.n)} de 6 aprobaron · `, val.n === 6 ? '«todos» se cumple' : val.n === 0 ? '«ninguno» se cumple' : 'ni «todos» ni «ninguno»'],
    invitaciones: [
      { texto: 'Haz que «Todos aprobaron» y «Ninguno aprobó» sean falsas a la vez.', logrado: val => !frasesSeis(val.n).todos && !frasesSeis(val.n).ninguno,
        bien: 'Las dos fallan juntas: por eso «ninguno» no es lo contrario de «todos».' },
      { texto: 'Haz el menor cambio que vuelve falsa «Todos aprobaron».', logrado: val => val.n === 5,
        bien: 'Basta uno que no aprobó. Un solo caso rompe un «todos».' },
      { texto: 'Haz que «Ninguno aprobó» se cumpla y mira su contraria.', logrado: val => frasesSeis(val.n).ninguno,
        bien: 'Una frase y su contraria nunca valen lo mismo.' },
      { texto: 'Guarda dos casos distintos donde «Todos aprobaron» sea falsa.',
        logrado: (val, g) => g.some(x => g.some(y => x.n !== y.n && !frasesSeis(x.n).todos && !frasesSeis(y.n).todos)),
        bien: '«Todos» falla de muchas maneras. Lo común a todas: al menos uno no aprobó.' },
    ],
  };

  return {
    unidad: 'razonamiento-matematico.verdades-y-mentiras',
    version: '0.3.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-veraz.js'],
    letras: {},
    // Glosario (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso, de 2 a 4 por idea con su `simple`.
    glosario: [
      // Idea 1
      { termino: 'veraz', def: 'Persona que siempre dice la verdad: todo lo que afirma es cierto.', simple: 'Quien nunca miente.',
        formas: ['veraz', 'veraces'], ejemplos: [
          'Si Ana es veraz y dice «Beto miente», Beto miente.',
          'En el juego, la tarjeta VERAZ obliga a decir solo cosas ciertas.',
          'Un veraz puede hablar de otros y de sí mismo, siempre con algo cierto.'], ver: ['mentiroso'] },
      { termino: 'mentiroso', def: 'Persona que siempre miente: todo lo que afirma es falso.', simple: 'Quien nunca dice la verdad.',
        formas: ['mentiroso', 'mentirosos', 'mentirosa', 'mentirosas'], ejemplos: [
          'Si Beto es mentiroso y dice «Ana miente», Ana dice la verdad.',
          'La tarjeta MIENTE obliga a decir solo cosas falsas.',
          'Un mentiroso que dice «Ciro dice la verdad» deja a Ciro como mentiroso.'], ver: ['veraz', 'negación'] },
      { termino: 'suposición', def: 'Caso que se da por cierto solo para probarlo y ver si choca con algo.', simple: 'Un «¿y si fuera así?» que se prueba.',
        formas: ['suposición', 'suposiciones'], ejemplos: [
          'Supón que Ana tiene VERAZ y revisa cada frase.',
          'Con dos personas hay 4 suposiciones de tarjetas.',
          'Una suposición que choca se descarta; la que no, queda en pie.'], ver: ['choque'] },
      { termino: 'choque', def: 'Lo que pasa cuando una frase no puede cumplirse con lo supuesto: obliga a descartar esa suposición.', simple: 'Cuando algo no encaja con lo supuesto.',
        formas: ['choque', 'choques', 'choca', 'chocan'], ejemplos: [
          'Ana con VERAZ diciendo algo falso es un choque.',
          'Un mentiroso que dice algo cierto también choca.',
          'Si todas las suposiciones chocan, el acertijo no tiene salida.'], ver: ['suposición'] },
      // Idea 2
      { termino: 'negación', def: 'Frase que es falsa justo cuando otra es cierta, y cierta cuando la otra es falsa.', simple: 'Lo contrario exacto de una frase.',
        formas: ['negación', 'negaciones'], ejemplos: [
          'La negación de «Ana vino» es «Ana no vino».',
          'Una frase y su negación nunca son ciertas a la vez.',
          'Tampoco son falsas a la vez: siempre una de las dos acierta.'], ver: ['al menos uno'] },
      { termino: 'al menos uno', def: 'Uno o más: la frase vale con uno, con varios o con todos.', simple: 'Uno o más; también pueden ser todos.',
        formas: ['al menos uno', 'al menos una'], ejemplos: [
          '«Al menos uno tiene celular» vale con uno, con dos o con todos.',
          'Si ninguno vino, «al menos uno vino» es falsa.',
          'Con 3 de 4 que cumplen, «al menos uno cumple» es cierta.'], ver: ['negación'] },
      { termino: 'a lo más', def: 'Ese número o menos, nunca uno mayor: con 5, admite el 5, el 4, el 3…', simple: 'Ese número o menos.',
        formas: ['a lo más'], ejemplos: [
          'Quien tiene a lo más 20 soles no tiene 21.',
          '«Tengo a lo más 2 hermanos» vale con 0, 1 o 2.',
          'A lo más 3 en una mesa de 6: quedan 3 sillas o más libres.'], ver: ['negación'] },
      // Idea 3
      { termino: 'frases contradictorias', def: 'Dos frases en las que una dice justo lo contrario de la otra: siempre una acierta y la otra falla.', simple: 'Dos frases que no aciertan ni fallan juntas.',
        formas: ['frases contradictorias', 'se contradicen', 'se contradice'], ejemplos: [
          '«Fue Ana» y «No fue Ana» se contradicen.',
          '«Hoy llueve» y «Hoy no llueve» se contradicen.',
          '«Fue Ana» y «Fue Beto» no: si fue Ciro, fallan las dos.'], ver: ['negación'] },
      { termino: 'sospechoso', def: 'Cada persona que podría haber hecho lo que se averigua.', simple: 'Alguien que pudo haberlo hecho.',
        formas: ['sospechoso', 'sospechosos', 'sospechosa'], ejemplos: [
          'Si son cuatro sospechosos, hay cuatro culpables por probar.',
          'Un sospechoso que dice «Yo no fui» puede mentir o no.',
          'El culpable es uno de los sospechosos.'], ver: ['culpable'] },
      { termino: 'culpable', def: 'Quien hizo lo que se averigua: rompió el vidrio, se comió el queque.', simple: 'Quien lo hizo.',
        formas: ['culpable', 'culpables'], ejemplos: [
          'Suponer un culpable es probar «¿y si fue Beto?».',
          'Con cada culpable supuesto, cada frase sale cierta o falsa.',
          'Si dos culpables encajan, el acertijo no decide.'], ver: ['sospechoso'] },
      // Idea 4
      { termino: 'exactamente', def: 'Ni más ni menos: si se dice uno, es uno; no cero ni dos.', simple: 'Justo esa cantidad.',
        formas: ['exactamente'], ejemplos: [
          'Exactamente una cierta: si salen dos, no encaja.',
          'Con cinco frases y exactamente una cierta, hay cuatro falsas.',
          '«Exactamente dos» no vale si son tres.'] },
      { termino: 'rótulo', def: 'Letrero pegado en una caja o un frasco que dice algo sobre lo que tiene.', simple: 'El letrero de una caja.',
        formas: ['rótulo', 'rótulos'], ejemplos: [
          'El rótulo «Azúcar» en un frasco de sal es falso.',
          'Un rótulo puede hablar de otra caja: «El premio está en la caja 3».',
          'Si solo un rótulo es cierto, los otros dicen algo falso.'] },
      // Idea 5
      { termino: 'podio', def: 'Tarima de tres escalones donde suben los tres primeros de una carrera.', simple: 'Donde suben los ganadores.',
        formas: ['podio', 'podios'], ejemplos: [
          'En el podio, el escalón más alto es del primero.',
          'Con tres atletas hay seis podios posibles.',
          'El segundo va a la izquierda del primero, y el tercero, a la derecha.'] },
      { termino: 'puesto de llegada', def: 'El lugar en que alguien termina una carrera: primero, segundo, tercero…', simple: 'En qué lugar llegó.',
        formas: ['puesto de llegada', 'puestos de llegada'], ejemplos: [
          'Dos atletas no comparten un puesto de llegada.',
          '«Llegué segunda» habla del puesto de llegada de quien lo dice.',
          'Con cuatro atletas hay cuatro puestos de llegada.'] },
      // Idea 6
      { termino: 'por lo menos', def: 'Esa cantidad o más: con 2, vale para 2, 3, 4…', simple: 'Esa cantidad o más.',
        formas: ['por lo menos'], ejemplos: [
          '«Por lo menos dos mienten» vale si mienten dos o tres.',
          'Si mienten cuatro, «por lo menos uno miente» es cierta.',
          'Con cero mentirosos, «por lo menos uno» es falsa.'], ver: ['al menos uno'] },
      { termino: 'misma tarjeta', def: 'Las dos tarjetas son iguales: los dos son veraces o los dos mienten.', simple: 'Los dos veraces o los dos mentirosos.',
        formas: ['misma tarjeta'], ejemplos: [
          'Ana y Beto tienen la misma tarjeta si los dos son veraces.',
          'Quien dice «Ana dice la verdad» tiene la misma tarjeta que Ana.',
          'Quien dice «Ana miente» tiene la tarjeta contraria a la de Ana.'] },
    ],
    // Laboratorio: el acertijo de tres con la frase de Ciro cambiable, el vidrio roto con las dos condiciones y la lista de
    // seis con cada frase junto a su contraria. Las ideas 5 y 6 aportan su juego.
    laboratorio: [mesaTres, mesaCulpa, mesaSeis],
    laboratorioIdeas: { 'tres-que-hablan': ['suposicion'], 'quien-fue': ['contradictorias', 'solo-uno-veraz'], 'seis-alumnos': ['negar-bien'] },
    historia: {
      texto: 'En 1847 y 1854, George Boole propuso tratar las frases lógicas con un álgebra: cada una es verdadera o falsa, y se combinan con reglas. Las tablas de verdad que usamos hoy llegaron después. Los acertijos de veraces y mentirosos juntan dos capas: lo que dice la frase y quién la dice.',
      pregunta: '¿Se puede atrapar a un mentiroso solo con lógica?',
      fuente: { titulo: 'George Boole · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/archives/sum2021/entries/boole/' },
    },
    ideas: [suposicion, negar, contradictorias, soloVeraz, verdadYMentira, cuantos],
  };
});
