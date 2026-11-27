'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./oscilaciones.js');
const E = require('../../../nucleo/ecuacion.js');
const T = require('../../../nucleo/teoria.js');
const Est = require('../../../nucleo/kit/piezas/fis-estatica.js');
require('../../../nucleo/kit/piezas/ejes.js');
const idea = def.ideas.find(x => x.id === 'graficas-mas');
const cerca = (a, b, contexto, tol = 2e-8) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${contexto}: ${a} != ${b}`);

// Oráculo independiente: integra el sistema dx/dt = v, dv/dt = -w²x.
// No importa la tabla trigonométrica ni los resultados exactos de producción.
function integrar(x, v, w, t, pasos = 1024) {
  const h = t / pasos;
  for (let j = 0; j < pasos; j++) {
    const ax = v, av = -w * w * x;
    const bx = v + h * av / 2, bv = -w * w * (x + h * ax / 2);
    const cx = v + h * bv / 2, cv = -w * w * (x + h * bx / 2);
    const dx = v + h * cv, dv = -w * w * (x + h * cx);
    x += h * (ax + 2 * bx + 2 * cx + dx) / 6;
    v += h * (av + 2 * bv + 2 * cv + dv) / 6;
  }
  return { x, v, a: -w * w * x };
}
function bisec(fn, lo, hi) {
  let flo = fn(lo);
  assert.ok(flo * fn(hi) <= 0, 'La raíz debe estar acotada');
  for (let n = 0; n < 65; n++) { const m = (lo + hi) / 2, fm = fn(m); if (flo * fm <= 0) hi = m; else { lo = m; flo = fm; } }
  return (lo + hi) / 2;
}
function primerCruce(A, w, x0, v0, objetivo, signo) {
  const periodo = 2 * Math.PI / w;
  let previo = x0 - objetivo, ta = 0;
  for (let j = 1; j <= 160; j++) {
    const tb = periodo * j / 160, s = integrar(x0, v0, w, tb, 256), actual = s.x - objetivo;
    if (previo * actual <= 0) {
      const t = bisec(t => integrar(x0, v0, w, t, 512).x - objetivo, ta, tb);
      if (t > 1e-7 && Math.sign(integrar(x0, v0, w, t).v) === signo) return t;
    }
    previo = actual; ta = tb;
  }
  throw new Error(`No se encontró el cruce ${objetivo} de amplitud ${A}`);
}
function fichas(n, out = []) {
  if (Array.isArray(n)) n.forEach(x => fichas(x, out));
  else if (n && typeof n === 'object') { if (n.v && n.t !== undefined) out.push(n); else Object.values(n).forEach(x => fichas(x, out)); }
  return out;
}
function cantidad(obj, clave, unidad) {
  const xs = fichas(obj.enunciado || obj.pregunta).filter(x => x.m === clave && String(x.t).endsWith(` ${unidad}`));
  assert.equal(xs.length, 1, `${obj.caso.tipo}: cantidad visible ${clave} en ${unidad}`);
  const v = Number(String(xs[0].t).slice(0, -unidad.length).trim().replace(/[−]/g, '-').replace(/,/g, '.').replace(/[\u202f\u00a0]/g, ''));
  assert.ok(Number.isFinite(v)); return v;
}
function entradas(o) {
  const c = o.caso, texto = E.texto(o.enunciado || o.pregunta), p = { ...c };
  const comprobar = (clave, unidad, nombre = clave) => { const v = cantidad(o, clave, unidad); cerca(v, c[nombre], `${c.tipo}: entrada ${nombre}`); p[nombre] = v; };
  if (['omega-periodo','x-tiempo','v-tiempo','primer-regreso','v-fase-inicial','primer-izquierda'].includes(c.tipo)) comprobar('T', 's');
  if (['x-fase','v-fase','x-tiempo','v-tiempo','a-tiempo','fase-inicial','v-fase-inicial'].includes(c.tipo)) comprobar('A', 'cm');
  if (['v-fase','a-posicion'].includes(c.tipo)) comprobar('omega', 'rad/s', 'w');
  if (['a-posicion','reconstruir-omega'].includes(c.tipo)) comprobar('x', 'cm');
  if (['x-tiempo','v-tiempo'].includes(c.tipo)) comprobar('t', 's');
  if (c.tipo === 'reconstruir-omega') p.a = cantidad(o, 'a', 'cm/s²');
  if (c.tipo === 'reconstruir-amplitud') { comprobar('v', 'cm/s', 'u'); assert.ok(texto.includes('T = π s')); }
  if (c.tipo === 'a-grafica') { cerca(cantidad(o, 't', 's'), c.T / 2, 'Instante de lectura'); cerca(o.figura.datos.y.max, c.max, 'Escala vertical dada'); }
  if (['x-fase','v-fase','x-tiempo','v-tiempo','a-tiempo'].includes(c.tipo)) {
    const q = c.q === undefined ? c.q0 : c.q, d = 12 / q;
    assert.ok(texto.includes(`(π) / ${d} rad`), `${c.tipo}: fase visible`);
  }
  if (c.tipo === 'fase-inicial') {
    cerca(cantidad(o, 'x', 'cm'), -p.A / 2, 'Posición inicial visible'); assert.ok(texto.includes('hacia la izquierda'));
  }
  if (['primer-regreso','reconstruir-omega'].includes(c.tipo)) assert.ok(texto.includes('extremo derecho en reposo'));
  if (['v-fase-inicial','reconstruir-amplitud'].includes(c.tipo)) assert.ok(texto.includes('x = −A / 2 hacia la derecha'));
  if (c.tipo === 'primer-izquierda') assert.ok(texto.includes('centro hacia la derecha') && texto.includes('hacia la izquierda'));
  if (c.tipo === 'a-tiempo') assert.ok(texto.includes('T = 2π s') && texto.includes('(2π) / 3 s'));
  if (c.tipo === 'periodo-ecuacion') assert.ok(texto.includes(`${c.n}πt`) && texto.includes(`${c.A} cos`));
  return p;
}
function resolver(o) {
  const c = entradas(o), pi = Math.PI;
  let esperado, malos, env = {};
  const fase = q => q * pi / 12;
  const estado = (A, w, ph, t) => integrar(A * Math.cos(ph), -A * w * Math.sin(ph), w, t);
  switch (c.tipo) {
    case 'omega-periodo': esperado = bisec(w => w * c.T - 2 * pi, 0, 20); malos = [1 / c.T, pi / c.T, 2 * pi * c.T]; env = { w: esperado, T: c.T }; break;
    case 'x-fase': esperado = estado(c.A, 1, 0, fase(c.q)).x; malos = [-esperado, c.A, 0]; env = { A:c.A, w:1, ph:fase(c.q), t:0, x:esperado }; break;
    case 'v-fase': esperado = estado(c.A, c.w, 0, fase(c.q) / c.w).v; malos = [-esperado, -c.A*c.w, 0]; env = { A:c.A,w:c.w,ph:fase(c.q),t:0,v:esperado }; break;
    case 'a-posicion': esperado = (integrar(c.x, 0, c.w, 1e-5).v - integrar(c.x, 0, c.w, -1e-5).v) / 2e-5; malos = [-esperado, -c.w*c.x, 0]; env = { w:c.w,x:c.x,a:esperado }; break;
    case 'a-grafica': esperado = estado(-c.max, 2*pi/c.T, 0, c.T/2).x; malos = [-c.max,0,c.max/2]; env = { t:c.T/2,a:esperado }; break;
    case 'x-tiempo': { const w=2*pi/c.T, st=estado(c.A,w,fase(c.q0),c.t); esperado=st.x; malos=[estado(c.A,w,0,c.t).x,-esperado,c.A]; env={A:c.A,w,T:c.T,t:c.t,ph:fase(c.q0),...st}; break; }
    case 'v-tiempo': { const w=2*pi/c.T, st=estado(c.A/100,w,fase(c.q0),c.t); esperado=st.v; malos=[-esperado,100*esperado,-c.A/100*w]; env={A:c.A/100,w,T:c.T,t:c.t,ph:fase(c.q0),...st}; break; }
    case 'a-tiempo': { const st=estado(c.A/100,1,pi/3,2*pi/3); esperado=st.a; malos=[-esperado,100*esperado,0]; env={A:c.A/100,w:1,T:2*pi,t:2*pi/3,ph:pi/3,...st}; cerca(st.v,0,'Reposo en el extremo'); assert.ok(st.x<0&&st.a>0); break; }
    case 'periodo-ecuacion': esperado=bisec(t=>c.n*pi*t-2*pi,0,10); malos=[1/c.n,c.n/2,6]; env={A:c.A,w:c.n*pi,T:esperado}; break;
    case 'fase-inicial': esperado=bisec(ph=>Math.cos(ph)+.5,0,pi); malos=[2*pi-esperado,pi-esperado,pi]; env={A:c.A,w:1,ph:esperado,t:0,x:-c.A/2,v:-c.A*Math.sin(esperado)}; assert.ok(env.v<0); break;
    case 'primer-regreso': { const w=2*pi/c.T; esperado=primerCruce(1,w,1,0,.5,1); malos=[c.T/6,c.T/3,c.T/2,c.T]; env={A:1,w,T:c.T,t:esperado,ph:0,...estado(1,w,0,esperado)}; break; }
    case 'v-fase-inicial': { const w=2*pi/c.T, ph=bisec(ph=>Math.cos(ph)+.5,pi,2*pi), st=estado(c.A,w,ph,c.T/12); esperado=st.v; malos=[-esperado,esperado/2,-c.A*w*Math.sin(ph),0]; env={A:c.A,w,T:c.T,t:c.T/12,ph,...st}; cerca(st.x,0,'Cruce central anunciado'); assert.ok(st.v>0); break; }
    case 'primer-izquierda': { const w=2*pi/c.T; esperado=primerCruce(1,w,0,w,-Math.SQRT1_2,-1); malos=[c.T/8,3*c.T/8,c.T/4,7*c.T/8]; env={A:1,w,T:c.T,t:esperado,ph:3*pi/2,...integrar(0,w,w,esperado)}; break; }
    case 'reconstruir-omega': { const w=bisec(w=>w*w*Math.abs(c.x)-c.a,0,30); esperado=primerCruce(1,w,1,0,0,-1); malos=[2*esperado,4*esperado,1/(4*w),pi/(2*w*w)]; env={w,T:2*pi/w,t:esperado,x:c.x,a:c.a}; break; }
    case 'reconstruir-amplitud': { const w=2, A=c.u/w, ph=bisec(ph=>Math.cos(ph)+.5,pi,2*pi), st=estado(A,w,ph,pi/6); esperado=st.x; malos=[-esperado,2*esperado,esperado/2,-2*esperado]; env={A,w,T:pi,t:pi/6,ph,...st}; break; }
    default: assert.fail(`Tipo sin oráculo: ${c.tipo}`);
  }
  return { esperado, malos, env };
}
// Traductor de los nodos documentados; admite solo operaciones matemáticas conocidas.
function expresion(n) {
  if (Array.isArray(n)) return n.map(expresion).join('');
  if (n && typeof n === 'object') {
    if (n.v) return String(n.t);
    if (n.frac) return `(${expresion(n.frac[0])})/(${expresion(n.frac[1])})`;
    if (n.sup) return `(${expresion(n.sup[0])})^(${expresion(n.sup[1])})`;
    if (n.raiz) return `sqrt(${expresion(n.raiz)})`;
    return '?';
  }
  return String(n ?? '');
}
function evaluar(s, env = {}) {
  s = String(s).replace(/cm\/s²|m\/s²|cm\/s|m\/s|rad\/s|rad|cm|\bs\b|\bm\b/g,'').replace(/−/g,'-').replace(/×|·/g,'*').replace(/÷/g,'/').replace(/,/g,'.').replace(/²/g,'^2').replace(/π/g,'pi').replace(/ω/g,'w').replace(/φ/g,'ph').replace(/√(\d+)/g,'sqrt($1)').trim();
  const toks=s.match(/sqrt|sen|cos|pi|ph|[AwxvatT]|\d+(?:\.\d+)?|[()+\-*/^]/g);
  if (!toks || toks.join('')!==s.replace(/\s/g,'')) return null;
  let pos=0,falta=false;
  const inicia=t=>!!t&&/^(?:\d|pi$|ph$|[AwxvatT]$|\(|sqrt|sen|cos)/.test(t);
  function atomo(){const t=toks[pos++];if(t==='('){const z=suma();assert.equal(toks[pos++],')',s);return z;}if(['sqrt','sen','cos'].includes(t))return Math[{sqrt:'sqrt',sen:'sin',cos:'cos'}[t]](atomo());if(t==='pi')return Math.PI;if(/^[AwxvatT]$|^ph$/.test(t)){if(env[t]===undefined)falta=true;return env[t]??0;}assert.ok(t&&/^\d/.test(t),s);return Number(t);}
  function potencia(){let z=atomo();if(toks[pos]==='^'){pos++;z=z**unario();}return z;}
  function unario(){if(toks[pos]==='-'){pos++;return -unario();}if(toks[pos]==='+'){pos++;return unario();}return potencia();}
  function producto(){let z=unario();while(toks[pos]==='*'||toks[pos]==='/'||inicia(toks[pos])){const t=toks[pos];if(t==='*'||t==='/')pos++;const r=unario();z=t==='/'?z/r:z*r;}return z;}
  function suma(){let z=producto();while(toks[pos]==='+'||toks[pos]==='-'){const t=toks[pos++],r=producto();z=t==='+'?z+r:z-r;}return z;}
  const valor=suma();assert.equal(pos,toks.length,s);if(falta)return null;assert.ok(Number.isFinite(valor),s);return valor;
}
function igualdades(eq, env) {
  let n=0;
  for(const trozo of expresion(eq).split(';')) {
    const partes=trozo.split('='); let previo=evaluar(partes[0],env);
    for(const parte of partes.slice(1)){const actual=evaluar(parte,env);if(previo!==null&&actual!==null){cerca(previo,actual,trozo,8e-8);n++;} previo=actual;}
  }
  return n;
}
function comprobar(o) {
  const c=o.caso, r=resolver(o); cerca(c.valor,r.esperado,`${c.tipo}: respuesta física`);
  assert.equal(c.errores.length,r.malos.length);
  c.errores.forEach((e,j)=>cerca(e.valor,r.malos[j],`${c.tipo}: operación errada ${e.codigo}`));
  const valores=[c.valor,...c.errores.map(e=>e.valor)];
  for(let a=0;a<valores.length;a++)for(let b=a+1;b<valores.length;b++)assert.ok(Math.abs(valores[a]-valores[b])>1e-9,'Opciones únicas');
  if(o.opciones){
    assert.equal(o.opciones.filter(x=>x.correcta).length,1);
    for(const op of o.opciones){cerca(evaluar(op.texto),op.valor,`${c.tipo}: alternativa exacta`);if(!op.correcta){assert.ok(op.siFuera.trim().split(/\s+/).length<=40);const literal=op.siFuera.split('obtendrías ')[1].replace(/\.$/,'');cerca(evaluar(literal),op.valor,`${c.tipo}: siFuera`);}}
    assert.equal(o.opciones.filter(x=>Math.abs(x.valor-r.esperado)<1e-7).length,1);
  }
  if(o.alternativas){assert.equal(o.alternativas.length,5);assert.equal(o.alternativas.filter(x=>Math.abs(evaluar(x)-r.esperado)<1e-7).length,1); for(const x of o.alternativas)assert.ok(valores.some(v=>Math.abs(v-evaluar(x))<1e-7));}
  if(o.respuesta)cerca(evaluar(expresion(o.respuesta).split('=').at(-1)),r.esperado,`${c.tipo}: respuesta escrita`);
  let n=0; for(const p of o.pasos||(Array.isArray(o.solucion)?o.solucion:[]))if(p.ecuacion)n+=igualdades(p.ecuacion,r.env);
  if(o.solucion&&!Array.isArray(o.solucion))n+=igualdades(o.solucion.ecuacion,r.env);
  for(const dato of o.datos||[]){
    const s=expresion(dato).replace(/\.$/,'');
    if(s==='1 m = 100 cm'){cerca(1,100/100,'Equivalencia entre metro y centímetro');n++;}
    else n+=igualdades(s,r.env);
    for(const trozo of s.split(';')){const m=/^\s*(sen\([^)]*\))\s*([<>])\s*0$/.exec(trozo);if(m){const v=evaluar(m[1]);assert.ok(m[2]==='<'?v<0:v>0,'Signo trigonométrico dado');}}
  }
  return n;
}
test('Gráficas: quince ejemplos exactos, niveles y primeras llegadas independientes',()=>{
  assert.ok(idea); assert.equal(idea.ejemplos.length,15);
  for(const nivel of [1,2,3])assert.equal(idea.ejemplos.filter(x=>x.nivel===nivel).length,5);
  const esperados=[Math.PI/3,5,-6,18,4,9,-Math.PI*Math.SQRT2/80,.08,2/3,2*Math.PI/3,15,2*Math.PI,10,Math.PI/10,7.5];
  let n=0; idea.ejemplos.forEach((e,j)=>{cerca(e.caso.valor,esperados[j],`Tabla independiente ${j+1}`);n+=comprobar(e);});assert.ok(n>=35,`Igualdades comprobadas: ${n}`);
});
test('Gráficas: 400 semillas por banco, entradas, resultados, errores, ecuaciones y unicidad',()=>{
  const res=new Set(), ahora=new Set();let n=0;
  for(let s=0;s<400;s++){
    const r=idea.resuelve.generar(s),a=idea.ahoraTu.generar(s); n+=comprobar(r);n+=comprobar(a);
    if(s<4)res.add(r.caso.tipo);if(s<12)ahora.add(a.caso.tipo);
    assert.deepEqual(idea.resuelve.generar(s),r);assert.deepEqual(idea.ahoraTu.generar(s),a);
  }
  assert.ok([...res].every(x=>!ahora.has(x)),'Los bancos tienen familias diferentes');assert.ok(n>=1700,`Igualdades: ${n}`);
});
test('Gráficas: reloj, misión, dibujo y lectura coinciden con el mismo décimo',()=>{
  let logros=0;
  for(let j=0;j<=400;j++){
    const bruto=j/100,t=Number(bruto.toFixed(1)),s=integrar(12,0,Math.PI/2,t),v={t:bruto},d=idea.juega.dibujo(v).datos;
    cerca((d.objetos.find(x=>x.tipo==='caja').x-178)/4,s.x,'Posición de la animación');
    const lectura=E.texto(idea.juega.lectura(v));assert.ok(lectura.includes(Math.abs(s.v)<1e-7?'reposo':s.v>0?'hacia la derecha':'hacia la izquierda'));
    assert.equal(idea.juega.mision.logrado(v),t===1);if(t===1)logros++;
    const valor=Number(lectura.match(/[=≈]\s*([−\-\d.,]+)/)[1].replace('−','-').replace(',','.'));assert.ok(Math.abs(valor-s.x)<=.00501);
    const aproximado=Math.abs(s.x*100-Math.round(s.x*100))>1e-6;assert.equal(lectura.includes('≈'),aproximado);
    const g=Est.geometria(d,{}); for(const b of g.rotulos||[])assert.ok(b.x0>=3.9&&b.x1<=316.1&&b.y0>=3.9&&b.y1<=d.alto-3.9);
  }
  assert.ok(logros>0);assert.equal(T.grilla(idea.juega.controles).filter(v=>idea.juega.mision.logrado(v)).length,1);
  const s=integrar(-12,0,Math.PI/4,2);cerca(s.x,0,'Predice: centro');assert.ok(s.v>0);assert.equal(idea.predice.opciones.find(x=>x.correcta).valor,3);
  assert.ok(E.texto(idea.predice.datos).includes('12 cm'));
  assert.ok(idea.predice.revelar.datos.alt.startsWith('A los dos segundos'));
  assert.ok(!idea.predice.revelar.datos.textos.some(x=>x.texto.includes('Estado inicial')));
});
test('Gráficas: curvas y ley del signo comparten el estado inicial de la predicción',()=>{
  for(const [d,clave] of [[idea.mira.datos,'x'],[idea.regla.dibujo.datos,'v']])for(const [t,valor] of d.curvas[0].puntos){const s=integrar(-12,0,Math.PI/4,t);cerca(valor,s[clave],`Curva ${clave}`);}
  for(const e of idea.ejemplos.filter(x=>x.caso.tipo==='a-grafica'))for(const [t,a] of e.figura.datos.curvas[0].puntos){const c=e.caso; cerca(a,integrar(-c.max,0,2*Math.PI/c.T,t).x,'Gráfica de aceleración');}
});
test('Gráficas: figuras estáticas sin rótulos sobre objetos, guías ni flechas',()=>{
  const pisa=(a,b)=>a.x0<b.x1-.2&&b.x0<a.x1-.2&&a.y0<b.y1-.2&&b.y0<a.y1-.2;
  function cruza(b,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1;let lo=0,hi=1;for(const [p,q] of [[-dx,x1-b.x0-1],[dx,b.x1-1-x1],[-dy,y1-b.y0-1],[dy,b.y1-1-y1]]){if(Math.abs(p)<1e-12){if(q<0)return false;}else{const r=q/p;if(p<0)lo=Math.max(lo,r);else hi=Math.min(hi,r);if(lo>hi)return false;}}return true;}
  const dibujos=[idea.predice.dibujo,idea.predice.revelar,...idea.lee.tarjetas.map(x=>x.dibujo).filter(Boolean),...idea.ejemplos.map(x=>x.figura)];
  for(let s=0;s<400;s++){dibujos.push(idea.juega.dibujo({t:s/100}));if(s<12)dibujos.push(idea.resuelve.generar(s).dibujo,idea.ahoraTu.generar(s).dibujo);}
  for(const dibujo of dibujos){if(dibujo.pieza!=='fis-estatica')continue;const d=dibujo.datos,g=Est.geometria(d,dibujo.estado||{});assert.ok(g.rotulos.length>0);
    for(let i=0;i<g.rotulos.length;i++){const b=g.rotulos[i];assert.ok(b.x0>=4-.1&&b.x1<=316+.1&&b.y0>=4-.1&&b.y1<=g.H-4+.1,`Encuadre: ${b.texto}`);
      for(const otro of g.rotulos.slice(i+1))assert.ok(!pisa(b,otro),`Rótulos: ${b.texto} / ${otro.texto}`);
      for(const objeto of g.objetos)assert.ok(!pisa(b,objeto),`Objeto: ${b.texto} / ${objeto.nombre}`);
      for(const l of d.lineas||[])assert.ok(!cruza(b,...l.de,...l.a),`Guía: ${b.texto}`);
      for(const l of g.flechas)assert.ok(!cruza(b,l.x1,l.y1,l.x2,l.y2),`Flecha: ${b.texto}`);
    }
  }
});
