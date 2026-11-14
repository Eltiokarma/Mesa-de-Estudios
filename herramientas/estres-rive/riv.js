// Lector y escritor mínimo del formato binario de Rive (.riv, versión 7), escrito para la prueba de estrés
// (app/mascotas/estres.html). Solo cubre lo que usan los archivos de prueba: formas con relleno y contorno,
// animaciones lineales con fotogramas clave y máquinas de estados con estados de animación y de mezcla 1D.
// Las claves de tipos y propiedades salen de las definiciones públicas de rive-runtime (MIT, Rive Inc.).
'use strict';

// Tipo de campo en la tabla de contenidos: 0 entero sin signo (varuint; también Id y bool), 1 texto, 2 doble (float32), 3 color.
const T = { uint: 0, string: 1, double: 2, color: 3 };

// Tipos de objeto y sus propiedades (nombre → [clave, tipo]).
const COMUN = { name: [4, T.string], parentId: [5, T.uint] };
const NODO = { ...COMUN, x: [13, T.double], y: [14, T.double], rotation: [15, T.double], scaleX: [16, T.double], scaleY: [17, T.double], opacity: [18, T.double] };
const TIPOS = {
  Backboard: [23, {}],
  Artboard: [1, { ...COMUN, x: [9, T.double], y: [10, T.double], width: [7, T.double], height: [8, T.double], originX: [11, T.double], originY: [12, T.double], clip: [196, T.uint] }],
  Node: [2, NODO],
  Shape: [3, NODO],
  Ellipse: [4, { ...NODO, width: [20, T.double], height: [21, T.double], originX: [123, T.double], originY: [124, T.double] }],
  Rectangle: [7, { ...NODO, width: [20, T.double], height: [21, T.double], originX: [123, T.double], originY: [124, T.double], cornerRadiusTL: [31, T.double], linkCornerRadius: [164, T.uint] }],
  PointsPath: [16, { ...NODO, isClosed: [32, T.uint] }],
  StraightVertex: [5, { ...COMUN, x: [24, T.double], y: [25, T.double], radius: [26, T.double] }],
  Fill: [20, { ...COMUN, isVisible: [41, T.uint], fillRule: [40, T.uint] }],
  Stroke: [24, { ...COMUN, isVisible: [41, T.uint], thickness: [47, T.double], cap: [48, T.uint], join: [49, T.uint], transformAffectsStroke: [50, T.uint] }],
  SolidColor: [18, { ...COMUN, colorValue: [37, T.color] }],
  LinearAnimation: [31, { name: [55, T.string], fps: [56, T.uint], duration: [57, T.uint], speed: [58, T.double], loopValue: [59, T.uint] }],
  KeyedObject: [25, { objectId: [51, T.uint] }],
  KeyedProperty: [26, { propertyKey: [53, T.uint] }],
  KeyFrameDouble: [30, { frame: [67, T.uint], interpolationType: [68, T.uint], value: [70, T.double] }],
  StateMachine: [53, { name: [55, T.string] }],
  StateMachineNumber: [56, { name: [138, T.string], value: [140, T.double] }],
  StateMachineBool: [59, { name: [138, T.string], value: [141, T.uint] }],
  StateMachineLayer: [57, { name: [138, T.string] }],
  EntryState: [63, {}],
  AnyState: [62, {}],
  ExitState: [64, {}],
  AnimationState: [61, { animationId: [149, T.uint] }],
  BlendState1DInput: [76, { inputId: [167, T.uint] }],
  BlendAnimation1D: [75, { animationId: [165, T.uint], value: [166, T.double] }],
  StateTransition: [65, { stateToId: [151, T.uint], flags: [152, T.uint], duration: [158, T.uint] }],
};
const NOMBRE_DE_TIPO = Object.fromEntries(Object.entries(TIPOS).map(([n, [k]]) => [k, n]));
const CLAVE_DE_PROPIEDAD = {};   // clave → [nombre, tipo]
for (const [, [, props]] of Object.entries(TIPOS)) for (const [n, [k, t]] of Object.entries(props)) CLAVE_DE_PROPIEDAD[k] = [n, t];

// Propiedad animable por nombre (para las pistas de las animaciones).
const ANIMABLE = { x: 13, y: 14, rotation: 15, scaleX: 16, scaleY: 17, opacity: 18, width: 20, height: 21 };

class Escritor {
  constructor() { this.b = []; }
  byte(v) { this.b.push(v & 255); }
  varuint(v) { v = Math.floor(v); do { let c = v & 127; v = Math.floor(v / 128); if (v) c |= 128; this.byte(c); } while (v); }
  u32(v) { for (let i = 0; i < 4; i++) this.byte((v >>> (8 * i)) & 255); }
  f32(v) { const a = new DataView(new ArrayBuffer(4)); a.setFloat32(0, v, true); for (let i = 0; i < 4; i++) this.byte(a.getUint8(i)); }
  texto(s) { const u = Buffer.from(String(s), 'utf8'); this.varuint(u.length); for (const c of u) this.byte(c); }
  valor(t, v) { if (t === T.string) this.texto(v); else if (t === T.double) this.f32(v); else if (t === T.color) this.u32(v >>> 0); else this.varuint(v === true ? 1 : v === false ? 0 : v); }
  bytes() { return Uint8Array.from(this.b); }
}

// Color '#rrggbb' o '#aarrggbb' → entero ARGB.
function color(c) {
  let h = c.replace('#', '');
  if (h.length === 6) h = 'ff' + h;
  return parseInt(h, 16) >>> 0;
}

// objetos: [{ tipo: 'Shape', props: { x: 1, ... } }, ...] en el orden del archivo.
function escribir(objetos, { idArchivo = 1 } = {}) {
  const usadas = new Map();
  for (const o of objetos) {
    const def = TIPOS[o.tipo]; if (!def) throw new Error('tipo desconocido: ' + o.tipo);
    for (const n of Object.keys(o.props || {})) { const p = def[1][n]; if (!p) throw new Error(`${o.tipo} no tiene la propiedad ${n}`); usadas.set(p[0], p[1]); }
  }
  const e = new Escritor();
  for (const c of 'RIVE') e.byte(c.charCodeAt(0));
  e.varuint(7); e.varuint(0); e.varuint(idArchivo);
  const claves = [...usadas.keys()].sort((a, b) => a - b);
  for (const k of claves) e.varuint(k);
  e.varuint(0);
  // Tipos de campo: 2 bits por propiedad, 4 propiedades por cada uint32 (así lo lee rive-runtime).
  for (let i = 0; i < claves.length; i += 4) {
    let v = 0;
    for (let j = 0; j < 4 && i + j < claves.length; j++) v |= usadas.get(claves[i + j]) << (2 * j);
    e.u32(v);
  }
  for (const o of objetos) {
    const [clave, props] = TIPOS[o.tipo];
    e.varuint(clave);
    for (const [n, v] of Object.entries(o.props || {})) { if (v === undefined) continue; const [k, t] = props[n]; e.varuint(k); e.valor(t, v); }
    e.varuint(0);
  }
  return e.bytes();
}

// Lector: devuelve la cabecera y los objetos (las propiedades que no conoce se saltan con la tabla de contenidos).
function leer(bytes, tiposExtra = {}) {
  let i = 0;
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const varuint = () => { let r = 0, m = 1, c; do { c = bytes[i++]; r += (c & 127) * m; m *= 128; } while (c & 128); return r; };
  const firma = String.fromCharCode(...bytes.slice(0, 4)); i = 4;
  if (firma !== 'RIVE') throw new Error('no es un .riv');
  const mayor = varuint(), menor = varuint(), idArchivo = varuint();
  const claves = []; for (let k = varuint(); k; k = varuint()) claves.push(k);
  const tipoDe = {};
  let actual = 0, bit = 8;
  for (const k of claves) { if (bit === 8) { actual = dv.getUint32(i, true); i += 4; bit = 0; } tipoDe[k] = (actual >>> bit) & 3; bit += 2; }
  const objetos = [];
  while (i < bytes.length) {
    const tk = varuint(); const o = { tipo: NOMBRE_DE_TIPO[tk] || '#' + tk, props: {} };
    for (let k = varuint(); k; k = varuint()) {
      const t = tipoDe[k] !== undefined ? tipoDe[k] : CLAVE_DE_PROPIEDAD[k] ? CLAVE_DE_PROPIEDAD[k][1] : tiposExtra[k];
      if (t === undefined) throw new Error(`propiedad ${k} sin tipo en el objeto ${o.tipo}`);
      let v;
      if (t === T.string) { const n = varuint(); v = Buffer.from(bytes.slice(i, i + n)).toString('utf8'); i += n; }
      else if (t === T.double) { v = dv.getFloat32(i, true); i += 4; }
      else if (t === T.color) { v = dv.getUint32(i, true); i += 4; }
      else v = varuint();
      o.props[(CLAVE_DE_PROPIEDAD[k] || ['#' + k])[0]] = v;
    }
    objetos.push(o);
  }
  return { mayor, menor, idArchivo, claves, objetos };
}

module.exports = { escribir, leer, color, ANIMABLE, TIPOS };
