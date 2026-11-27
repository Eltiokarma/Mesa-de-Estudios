'use strict';
// Péndulo: oráculo independiente por RK4 y cruces del equilibrio, sin importar fórmulas productivas.
const test = require('node:test');
const assert = require('node:assert/strict');
const idea = require('./oscilaciones.js').ideas.find(i => i.id === 'pendulo');
const pieza = require('../../../nucleo/kit/piezas/fis-estatica.js');
const fallos = [], conteos = { ejemplos: 0, resuelve: 0, ahoraTu: 0, escenas: 0, juego: 0, ecuaciones: 0, opciones: 0, integraciones: 0 };
const ejecutar = (donde, f) => { try { f(); } catch (e) { fallos.push({ donde, error: e.message }); } };
const cerca = (a, b, texto = '', tol = 3e-9) => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${texto}: ${a} frente a ${b}`);
const PI = 16 * Math.atan(1 / 5) - 4 * Math.atan(1 / 239);
function raiz(x) { assert.ok(x >= 0); if (!x) return 0; let a = 0, b = Math.max(1, x); for (let k = 0; k < 100; k++) { const c = (a + b) / 2; if (c * c < x) a = c; else b = c; } return (a + b) / 2; }
function rk4(y, h, q, noLineal = false) {
  const derivada = ([theta, u]) => [u, -q * (noLineal ? Math.sin(theta) : theta)];
  const add = (a, k, f) => [a[0] + f * k[0], a[1] + f * k[1]];
  const a = derivada(y), b = derivada(add(y, a, h / 2)), c = derivada(add(y, b, h / 2)), d = derivada(add(y, c, h));
  return [y[0] + h * (a[0] + 2 * b[0] + 2 * c[0] + d[0]) / 6, y[1] + h * (a[1] + 2 * b[1] + 2 * c[1] + d[1]) / 6];
}
const periodos = new Map();
function periodo(L, g, h = .001, noLineal = false) {
  assert.ok(L > 0 && g > 0); const clave = [L, g, h, noLineal].join('/'); if (periodos.has(clave)) return periodos.get(clave);
  let y = [8 * PI / 180, 0], t = 0; const q = g / L;
  while (t < 100) {
    const nuevo = rk4(y, h, q, noLineal);
    if (nuevo[0] <= 0) {
      let a = 0, b = h; for (let j = 0; j < 48; j++) { const medio = (a + b) / 2; if (rk4(y, medio, q, noLineal)[0] > 0) a = medio; else b = medio; }
      assert.ok(nuevo[1] < 0); const T = 4 * (t + (a + b) / 2); periodos.set(clave, T); conteos.integraciones++; return T;
    }
    y = nuevo; t += h;
  }
  throw new Error('No se encontró cruce del equilibrio');
}
const TAU = periodo(1, 1), longitud = (T, g) => g * (T / TAU) ** 2, gravedad = (L, T) => L / (T / TAU) ** 2;
function plano(x) {
  if (x == null) return ''; if (typeof x !== 'object') return String(x); if (Array.isArray(x)) return x.map(plano).join('');
  if (x.t !== undefined) return plano(x.t); if (x.sub) return plano(x.sub[0]) + '_' + plano(x.sub[1]);
  if (x.sup) return '(' + plano(x.sup[0]) + ')^(' + plano(x.sup[1]) + ')';
  if (x.frac) return '((' + plano(x.frac[0]) + ')/(' + plano(x.frac[1]) + '))';
  if (x.raiz) return '√(' + plano(x.raiz) + ')'; if (x.par) return '(' + plano(x.par) + ')';
  return ['texto','ecuacion','enunciado','pregunta','respuesta'].filter(k => x[k] !== undefined).map(k => plano(x[k])).join(' ');
}
function normal(x) { return plano(x).replace(/−/g, '-').replace(/,/g, '.').replace(/[²³]/g, s => s === '²' ? '^(2)' : '^(3)').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1'); }
function expr(s) {
  s = s.replace(/\s/g, '').replace(/[·×]/g, '*').replace(/÷/g, '/').replace(/([\d)])(?=[π√(])/g, '$1*').replace(/π(?=[\d(])/g, 'π*');
  const tokens = s.match(/\d+(?:\.\d+)?(?:e[+-]?\d+)?|[()+\-*/^π√]/gi) || []; assert.equal(tokens.join(''), s, 'Expresión no numérica: ' + s); let i = 0;
  function atom() { if (tokens[i] === '(') { i++; const v = sum(); assert.equal(tokens[i++], ')'); return v; } if (tokens[i] === 'π') { i++; return PI; } if (tokens[i] === '√') { i++; return raiz(atom()); } const t = tokens[i++]; assert.match(t || '', /^\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i); return Number(t); }
  function pow() { const v = atom(); if (tokens[i] !== '^') return v; i++; return v ** unary(); }
  function unary() { if (tokens[i] === '-') { i++; return -unary(); } if (tokens[i] === '+') { i++; return unary(); } return pow(); }
  function mul() { let v = unary(); while (tokens[i] === '*' || tokens[i] === '/') { const o = tokens[i++], w = unary(); v = o === '*' ? v * w : v / w; } return v; }
  function sum() { let v = mul(); while (tokens[i] === '+' || tokens[i] === '-') { const o = tokens[i++], w = mul(); v = o === '+' ? v + w : v - w; } return v; }
  const v = sum(); assert.equal(i, tokens.length); assert.ok(Number.isFinite(v)); return v;
}
function numeros(x) { return (normal(x).replace(/_[A-Za-z0-9]+/g, '').replace(/\^\([23]\)/g, '').match(/[+-]?\d+(?:\.\d+)?/g) || []).map(Number); }
function visible(x, valor, unidad = '', aproximado = false) {
  const texto = plano(x), ns = numeros(texto.split(':')[0]); assert.ok(ns.length, 'Sin valor visible: ' + texto); const n = ns.at(-1);
  if (unidad) assert.ok(texto.includes(unidad), 'Unidad ausente: ' + texto + ' / ' + unidad);
  if (aproximado) assert.match(texto, /≈/, 'Falta aproximación física: ' + texto);
  const diferencia = Math.abs(n - valor);
  if (diferencia > 3e-9 * Math.max(1, Math.abs(valor))) { assert.match(texto, /≈/, 'Redondeo exacto: ' + texto); assert.ok(diferencia <= .005000001, 'Redondeo fuera de intervalo: ' + texto + '; ' + valor); }
  return n;
}
function esperado(c) {
  const o = { unidad: 's', valor: 0, errores: {}, vars: {}, filas: [] }, put = (v, u = 's') => { o.valor = v; o.unidad = u; };
  let T, T1, T2, L, L1, L2, g, g1, g2, q, r;
  switch(c.tipo) {
    case 'longitud-centro': put(c.hilo + c.radio,'cm'); o.errores={'solo-hilo':c.hilo,'resta-radio':c.hilo-c.radio,diametro:c.hilo+2*c.radio,'doble-hilo':2*c.hilo+c.radio}; L=o.valor; break;
    case 'periodo': case 'periodo-cm': L=c.tipo==='periodo'?c.L:c.Lcm/100; g=c.g; T=periodo(L,g); put(T); o.errores={'medio-ciclo':T/2,'sin-2pi':T/TAU,'sin-raiz':TAU*L/g,frecuencia:1/T}; break;
    case 'masa': T1=T2=T=c.T; put(T); q=c.m2/c.m1; o.errores={'raiz-masa':T*raiz(q),'masa-directa':T*q,'raiz-inversa-masa':T/raiz(q),'masa-inversa':T/q}; break;
    case 'frecuencia': T=c.T; put(1/T,'Hz'); o.errores={periodo:T,medios:2/T,dobles:1/(2*T),cuadrado:1/(T*T)}; break;
    case 'razon': L1=c.L1;L2=c.L2;g1=c.g1;g2=c.g2;T1=periodo(L1,g1);T2=periodo(L2,g2);q=T2/T1;put(q,'');r=raiz(c.m2/c.m1);o.errores={'sin-raiz':q*q,invierte:1/q,'incluye-masa':q*r,'divide-masa':q/r}; break;
    case 'longitud': case 'longitud-ciclos': T=c.tipo==='longitud'?c.T:c.dt/c.N;g=c.g;L=longitud(T,g);put(L,'m');o.errores={'sin-dos':4*L,'medio-periodo':L/4,'sin-cuadrado':g*T/(TAU*TAU),'sin-2pi':g*T*T}; break;
    case 'duracion': L=c.L;g=c.g;T=periodo(L,g);put(c.N*T);o.errores={'un-ciclo':T,medios:o.valor/2,divide:c.N/T,'doble-conteo':c.N*o.valor};break;
    case 'gravedad':L=c.L;T=c.T;g=gravedad(L,T);put(g,'m/s²');o.errores={'sin-2pi':L/(T*T),'sin-cuadrado':TAU*TAU*L/T,invierte:1/g,'sin-dos':g/4};break;
    case 'longitud-razon':L1=c.L1;T1=c.T1;T2=c.T2;g=gravedad(L1,T1);L2=longitud(T2,g);put(L2,'m');q=T2/T1;o.errores={lineal:L1*q,invierte:L1/(q*q),raiz:L1*raiz(q),cubo:L1*q*q*q};break;
    case 'duracion-otro':T1=c.dt/c.N1;g1=c.g1;g2=c.g2;L=longitud(T1,g1);T2=periodo(L,g2);put(c.N2*T2);q=T2/T1;o.errores={'invierte-g':c.N2*T1/q,'sin-raiz':c.N2*T1*q*q,'sin-cambio':c.N2*T1,'un-ciclo':T2};break;
    case 'alargar':L1=c.hilo+c.radio;T1=periodo(L1/100,10);T2=T1*c.factor;L2=longitud(T2,10)*100;put(L2-L1,'cm');o.errores={'longitud-total':L2,lineal:L1*(c.factor-1),'solo-hilo':c.hilo*(c.factor*c.factor-1),inversa:L1/(c.factor*c.factor)};break;
    case 'gravedad-razon':L1=c.L1;L2=c.L2;T1=c.dt1/c.N1;T2=c.dt2/c.N2;g1=gravedad(L1,T1);g2=gravedad(L2,T2);put(g2/g1,'');q=T1/T2;r=L2/L1;o.errores={'invierte-tiempo':r/(q*q),'sin-cuadrado':r*q,'sin-longitud':q*q,'sin-periodo':r};break;
    default:throw new Error('Familia sin oráculo: '+c.tipo);
  }
  o.vars={L:L??L1??1,L_1:L1??L??1,L_2:L2??L??1,T:T??T1??1,T_1:T1??T??1,T_2:T2??T??1,g:g??g1??10,g_1:g1??g??10,g_2:g2??g??10,f:1/(T??T1??1),N:c.N??c.N2??1,t:o.valor};
  return o;
}
function ecuaciones(x, vars, donde) {
  for(const cadena of normal(x).split(';')) {
    const partes=cadena.split(/([=≈])/); if(partes.length<3)continue;
    const valores=[];
    for(let j=0;j<partes.length;j+=2){
      const limpio=partes[j].trim().replace(/\s+(?:m\/s\^\(2\)|cm|m|s|Hz)$/, '');
      const letras=limpio.match(/[A-Za-z][A-Za-z_0-9]*/g)||[];
      if(letras.some(k=>!Object.hasOwn(vars,k))){valores.push(null);continue;}
      const texto=limpio.replace(/[A-Za-z][A-Za-z_0-9]*/g,k=>'('+vars[k]+')');
      valores.push({v:expr(texto),literal:!letras.length,texto:limpio});
    }
    for(let j=1;j<valores.length;j++){
      const a=valores[j-1],b=valores[j]; if(!a||!b)continue;conteos.ecuaciones++;
      if(partes[j*2-1]==='='||!b.literal)cerca(a.v,b.v,donde+' igualdad '+cadena,4e-9);
      else {const nd=(b.texto.match(/\.(\d+)/)||[])[1]?.length||0;assert.ok(Math.abs(a.v-b.v)<=.5*10**(-nd)+4e-9*Math.max(1,Math.abs(a.v)),donde+' aproximación '+cadena+'; '+a.v);}
    }
  }
}
const entradas={
 'longitud-centro':['hilo','radio'],periodo:['L'],'periodo-cm':['Lcm'],masa:['T','m1','m2'],frecuencia:['T'],razon:['L1','L2'],longitud:['T'],'longitud-ciclos':['N','dt'],duracion:['L','N'],gravedad:['L','T'],'longitud-razon':['L1','T1','T2'],'duracion-otro':['N1','dt','N2'],alargar:['hilo','radio','factor'],'gravedad-razon':['L1','L2']
};
function tokenValores(x,clave,out=[]){if(Array.isArray(x))x.forEach(t=>tokenValores(t,clave,out));else if(x&&typeof x==='object'){if(x.m===clave&&/^[+-]?\d/.test(x.t||''))out.push(Number(x.t.replace(',','.').split(' ')[0]));for(const[k,v]of Object.entries(x))if(typeof v==='object')tokenValores(v,clave,out);}return out;}
function causa(id, texto) {
 const patrones={'medio-ciclo':/medio ciclo/,'sin-2pi':/omitiste.*2π/,'sin-raiz':/no extrajiste la raíz|sin extraer raíz/,frecuencia:/frecuencia/,
  'raiz-masa':/multiplicaste.*raíz.*masas/,'masa-directa':/multiplicaste.*razón de masas/,'raiz-inversa-masa':/dividiste.*raíz.*masas/,'masa-inversa':/dividiste.*razón de masas/,
  periodo:/copiaste el período/,medios:/cada ida|medio período/,dobles:/dos ciclos/,cuadrado:/período al cuadrado/,invierte:/intercambiaste|invertiste/,
  'incluye-masa':/añadiste.*raíz.*masas/,'divide-masa':/dividiste.*raíz.*masas/,'sin-dos':/omitiste el dos|π en vez de 2π/,'medio-periodo':/medio período/,
  'sin-cuadrado':/no elevaste.*cuadrado|sin elevarlo al cuadrado/,'un-ciclo':/solo un ciclo/,divide:/dividiste entre el período/,'doble-conteo':/dos veces/,
  lineal:/no elevaste.*cuadrado|razón lineal/,raiz:/raíz en vez de elevar/,cubo:/razón al cubo/,'invierte-g':/invertiste.*gravedades/,'sin-cambio':/período anterior/,
  'longitud-total':/longitud total nueva/,'solo-hilo':/solo el hilo|omitiste el radio/,inversa:/invertiste la razón/,'invierte-tiempo':/invertiste.*períodos/,
  'sin-longitud':/omitiste.*longitudes/,'sin-periodo':/solo las longitudes/};
 assert.ok(patrones[id], 'Operación sin descripción comprobada: '+id);assert.match(plano(texto),patrones[id]);
}
function revisarCaso(x,donde){
 const c=x.caso,o=esperado(c),ns=numeros(x.enunciado||x.pregunta);assert.equal(ns.length,entradas[c.tipo].length,donde+' datos primarios');ns.forEach((n,i)=>cerca(n,c[entradas[c.tipo][i]],'Dato visible',1e-12));
 cerca(c.valor,o.valor,donde+' respuesta metadata');assert.equal(c.unidad,o.unidad);
 assert.match(plano(x.datos),/8°/);assert.match(plano(x.datos),/hilo inextensible/);assert.match(plano(x.datos),/sin rozamiento/);
 assert.doesNotMatch(plano(x.datos),/2π|T\s*[=≈]|√|T_1|T_2|L\/g|longitud.*cuadrado/,'Datos adelanta el procedimiento');
 for(const k of ['g','g1','g2'])if(c[k]!==undefined)assert.ok(tokenValores(x.datos,'g').some(n=>Math.abs(n-c[k])<1e-12),donde+' gravedad visible '+k);
 if(c.tipo==='razon')for(const k of ['m1','m2'])assert.ok(tokenValores(x.datos,'m').includes(c[k]),'Masa visible');
 if(c.tipo==='gravedad-razon')for(const[k,sim]of [['N1','N'],['N2','N'],['dt1','t'],['dt2','t']])assert.ok(tokenValores(x.datos,sim).some(n=>Math.abs(n-c[k])<1e-10));
 if(x.respuesta)visible(x.respuesta,o.valor,o.unidad,c.tipo!=='longitud-centro');
 for(const e of c.errores||[]){assert.ok(Object.hasOwn(o.errores,e.id));cerca(e.valor,o.errores[e.id],donde+' error '+e.id);}
 const sol=x.pasos||x.solucion;const filas=Array.isArray(sol)?sol:sol?[sol]:[];
 for(const p of filas)if(p.ecuacion)ecuaciones(p.ecuacion,o.vars,donde);
 if(x.opciones){assert.equal(x.opciones.filter(p=>p.correcta).length,1);assert.equal(new Set(x.opciones.map(p=>plano(p.texto))).size,x.opciones.length);
  let exactas=0,visibles=0;for(const p of x.opciones){conteos.opciones++;if(Math.abs(p.valor-o.valor)<1e-8)exactas++;if(Math.abs(numeros(p.texto)[0]-o.valor)<=.005000001)visibles++;if(p.correcta)visible(p.texto,o.valor,o.unidad,true);else{const id=p.error.replace(/^OS-PEN-/,'');assert.ok(Object.hasOwn(o.errores,id));cerca(p.valor,o.errores[id]);visible(p.texto,o.errores[id],o.unidad,true);assert.match(plano(p.siFuera),/^Bien identificar los datos;/);causa(id,p.siFuera);assert.ok(plano(p.siFuera).split(/\s+/).length<=20);}}
  assert.equal(exactas,1);assert.equal(visibles,1,'Unicidad después de redondear');
 }
 if(x.alternativas){assert.equal(x.alternativas.length,5);assert.equal(new Set(x.alternativas.map(plano)).size,5);const todos=[o.valor,...Object.values(o.errores)];for(const t of x.alternativas){conteos.opciones++;assert.equal(todos.filter(n=>Math.abs(numeros(t)[0]-n)<=.005000001).length,1,'Alternativa equivalente a dos resultados');}assert.equal(x.alternativas.filter(t=>Math.abs(numeros(t)[0]-o.valor)<=.005000001).length,1);const partes=plano(filas.at(-1)).split('.').filter(s=>s.trim());assert.equal(partes.length,4);partes.forEach((p,i)=>visible(p,Object.values(o.errores)[i],o.unidad,true));}
 const fig=x.figura||x.dibujo;if(fig){geometria(fig,donde);const etiquetas=[...(fig.datos.cotas||[]),...(fig.datos.textos||[])].filter(co=>/^L\s*=/.test(plano(co.texto)));assert.equal(etiquetas.length,fig.datos.cotas.length,'Cada cota conserva un rótulo de longitud');for(const co of etiquetas){if(/\?/.test(plano(co.texto)))continue;const L=numeros(co.texto)[0]/100;const dados=[c.L,c.L1,c.L2,c.Lcm===undefined?undefined:c.Lcm/100].filter(n=>n!==undefined);assert.ok(dados.some(n=>Math.abs(n-L)<1e-10),donde+' longitud numérica inventada '+plano(co.texto));}}
 if(c.tipo==='razon'){const sentido=plano(filas.at(-1)||sol);if(/mayor que uno/.test(sentido))assert.ok(o.valor>1);if(/menor que uno/.test(sentido))assert.ok(o.valor<1);}
 return o;
}
const cajasChocan=(a,b)=>Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0)>1e-7&&Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0)>1e-7;
function cortaCaja(b,a,z){let lo=0,hi=1;const dx=z[0]-a[0],dy=z[1]-a[1];for(const[p,q]of [[-dx,a[0]-b.x0],[dx,b.x1-a[0]],[-dy,a[1]-b.y0],[dy,b.y1-a[1]]]){if(Math.abs(p)<1e-12){if(q<0)return false;}else{const r=q/p;if(p<0)lo=Math.max(lo,r);else hi=Math.min(hi,r);if(lo>hi)return false;}}return hi-lo>1e-7;}
function geometria(fig,donde){
 const d=fig.datos||fig,g=pieza.geometria(d,fig.estado||{});conteos.escenas++;
 for(const r of g.rotulos){assert.ok(r.x0>=4-1e-8&&r.x1<=g.W-4+1e-8&&r.y0>=4-1e-8&&r.y1<=g.H-4+1e-8,donde+' margen '+r.texto);}
 for(let a=0;a<g.rotulos.length;a++)for(let b=a+1;b<g.rotulos.length;b++)assert.ok(!cajasChocan(g.rotulos[a],g.rotulos[b]),donde+' rótulos '+g.rotulos[a].texto+' / '+g.rotulos[b].texto);
 const cuerdas=(d.objetos||[]).filter(o=>o.tipo==='cuerda'),pelotas=(d.objetos||[]).filter(o=>o.tipo==='pelota');assert.equal(cuerdas.length,pelotas.length);
 cuerdas.forEach((o,i)=>{cerca(o.a[0],pelotas[i].x);cerca(o.a[1],pelotas[i].y);const co=d.cotas[i];assert.deepEqual(co.de,o.de);assert.deepEqual(co.a,o.a);});
 const trazosCota=(d.cotas||[]).flatMap(co=>{const dx=co.a[0]-co.de[0],dy=co.a[1]-co.de[1],largo=Math.hypot(dx,dy),lado=co.lado||1,normal=[-dy/largo*lado,dx/largo*lado],sep=co.sep??12;
   const a=[co.de[0]+normal[0]*sep,co.de[1]+normal[1]*sep],b=[co.a[0]+normal[0]*sep,co.a[1]+normal[1]*sep];
   return [{de:a,a:b},...[a,b].map(p=>({de:[p[0]-normal[0]*5,p[1]-normal[1]*5],a:[p[0]+normal[0]*5,p[1]+normal[1]*5]}))];});
 for(const r of g.rotulos){for(const li of [...(d.lineas||[]),...cuerdas,...trazosCota])assert.ok(!cortaCaja(r,li.de,li.a),donde+' rótulo sobre línea '+r.texto);for(const p of pelotas){const xx=Math.max(r.x0,Math.min(p.x,r.x1)),yy=Math.max(r.y0,Math.min(p.y,r.y1));assert.ok((xx-p.x)**2+(yy-p.y)**2>=p.r*p.r-1e-7,donde+' rótulo sobre pesa '+r.texto);}}
 if(pelotas.length===1)assert.doesNotMatch(d.alt||'',/Dos péndulos/,'Alt plural con un solo péndulo');
}
function estadoODE(q,t){let y=[8*PI/180,0],pasado=0;while(pasado<t){const h=Math.min(.001,t-pasado);y=rk4(y,h,q);pasado+=h;}return y;}
function juego(v){
 const d=idea.juega.dibujo(v).datos;geometria({datos:d},'juego '+JSON.stringify(v));conteos.juego++;
 const esperadoGanado=v.experimento===0&&v.caso===1;assert.equal(idea.juega.mision.logrado(v),esperadoGanado);
 const largos=[.25,v.experimento===1&&v.caso===1?1:.25],masas=[40,v.experimento===0&&v.caso===1?80:40];
 const cuerdas=d.objetos.filter(o=>o.tipo==='cuerda'), tiempos=d.textos.filter(o=>/^T/.test(plano(o.texto))),angulos=d.textos.filter(o=>/^θ/.test(plano(o.texto))),ms=d.textos.filter(o=>/^m/.test(plano(o.texto)));
 const ts=largos.map(L=>periodo(L,10));
 largos.forEach((L,i)=>{cerca(Math.hypot(cuerdas[i].a[0]-cuerdas[i].de[0],cuerdas[i].a[1]-cuerdas[i].de[1]),150*L,'Escala constante');const y=estadoODE(10/L,Number(v.t.toFixed(2)));const theta=Math.atan2(cuerdas[i].a[0]-cuerdas[i].de[0],cuerdas[i].a[1]-cuerdas[i].de[1]);cerca(theta,y[0],'Movimiento por integración',2e-9);visible(tiempos[i].texto,ts[i],'s',true);visible(angulos[i].texto,y[0]*180/PI,'°',true);visible(ms[i].texto,masas[i],'g');});
 visible(idea.juega.lectura(v),ts[1]/ts[0],'',true);
}

function grupo(nombre, cuerpo) { test(nombre, () => { const inicio = fallos.length; cuerpo(); assert.deepEqual(fallos.slice(inicio), [], nombre); }); }
grupo('Péndulo: integración por eventos, convergencia y límite del modelo pequeño', () => {
ejecutar('calibración RK4',()=>{cerca(TAU,periodo(1,1,.0005),'Convergencia',1e-10);cerca(TAU,2*PI,'Contraste posterior de calibración',1e-10);const noLineal=periodo(1,1,.001,true)/TAU;assert.ok(noLineal>1.0012&&noLineal<1.0013);});

});
grupo('Péndulo: quince ejemplos y cinco alternativas de examen verificadas aparte', () => {
  assert.equal(idea.ejemplos.length, 15);
  for (const nivel of [1, 2, 3]) assert.equal(idea.ejemplos.filter(x => x.nivel === nivel).length, 5);
  const letras = [];
  idea.ejemplos.forEach((x, i) => { conteos.ejemplos++; ejecutar('ejemplo ' + (i + 1), () => { const o = revisarCaso(x, 'ejemplo ' + (i + 1)); if (x.alternativas) letras.push(x.alternativas.findIndex(t => Math.abs(numeros(t)[0] - o.valor) <= .005000001)); }); });
  assert.deepEqual(letras.sort(), [0, 1, 2, 3, 4]);
});
for (const nombre of ['resuelve', 'ahoraTu']) grupo('Péndulo: 400 semillas de ' + nombre + ', datos visibles, ecuaciones y errores', () => {
  for (let semilla = 0; semilla < 400; semilla++) { conteos[nombre]++; ejecutar(nombre + ' ' + semilla, () => { const c = idea[nombre].generar(semilla); assert.deepEqual(c, idea[nombre].generar(semilla)); revisarCaso(c, nombre + ' ' + semilla); }); }
});
grupo('Péndulo: misión, escala y movimiento en toda la malla y 400 instantes', () => {
  const cs = idea.juega.controles;
  assert.deepEqual(cs.find(c => c.id === 'experimento').opciones.map(o => o.valor), [0, 1]);
  assert.deepEqual(cs.find(c => c.id === 'caso').opciones.map(o => o.valor), [0, 1]);
  const t = cs.find(c => c.id === 't'); assert.equal(t.min, 0); assert.equal(t.max, 4); assert.equal(t.paso, .05);
  for (let e = 0; e < 2; e++) for (let c = 0; c < 2; c++) for (let k = 0; k <= 80; k++) ejecutar('malla ' + [e, c, k], () => juego({ experimento: e, caso: c, t: k * .05 }));
  for (let s = 0; s < 400; s++) ejecutar('frame ' + s, () => juego({ experimento: s % 2, caso: Math.floor(s / 2) % 2, t: 4 * s / 399 }));
});
grupo('Péndulo: Predice, Mira y revelación conservan datos y física del caso', () => {
ejecutar('Predice',()=>{
 const p=idea.predice, c=p.caso, o=esperado(c);cerca(c.valor,o.valor);assert.equal(p.opciones.filter(x=>Math.abs(x.valor-o.valor)<1e-9).length,1);
 for(const x of p.opciones){const id=x.error?.replace(/^OS-PEN-/,''),n=x.correcta?o.valor:o.errores[id];visible(x.texto,n,'',true);if(!x.correcta){assert.match(plano(x.siFuera),/^Bien/);causa(id,x.siFuera);}}
 geometria(p.dibujo,'predice');geometria(p.revelar,'revelar');
 const before=plano([idea.lee.tarjetas,idea.juega.consigna,idea.juega.mision.texto,p.datos]);assert.doesNotMatch(before,/1,5|1\.5|tres medios/);
 const labels=p.revelar.datos.textos.filter(x=>/^T/.test(plano(x.texto)));visible(labels[0].texto,periodo(c.L1,c.g1),'s',true);visible(labels[1].texto,periodo(c.L2,c.g2),'s',true);
 assert.ok(tokenValores(p.datos,'g').some(n=>n===c.g1),'Los períodos revelados necesitan el g numérico visible');
 idea.mira.pasos.forEach(x=>{if(x.ecuacion)ecuaciones(x.ecuacion,o.vars,'Mira');});
 assert.match(plano(idea.mira.pasos),/aceleración tangencial, no necesariamente la total/);
});

});
grupo('Péndulo: dibujos de Lee, Mira y Regla sin colisiones ni distancias inventadas', () => {
idea.lee.tarjetas.forEach((x,i)=>{if(x.dibujo)ejecutar('Lee '+i,()=>geometria(x.dibujo,'Lee '+i));});
ejecutar('Regla dibujo',()=>geometria(idea.regla.dibujo,'Regla'));
ejecutar('Mira dibujo',()=>geometria({datos:idea.mira.datos},'Mira'));

});
grupo('Péndulo: controles negativos contra redondeos falsos y cambios de escala física', () => {
ejecutar('controles negativos',()=>{assert.throws(()=>visible('0,88 m',.882,'m'));assert.throws(()=>ecuaciones('0,45 · (2,1/1,5)² = 0,88 m',{},'negativo'));assert.throws(()=>cerca(periodo(.25,10),periodo(1,10)));});

});
