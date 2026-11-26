'use strict';
// Oráculo independiente: volumen barrido por segundo y trabajo sobre una porción de 1 m³.
// No importa fórmulas, formato ni solucionador de la teoría bajo prueba.
const test = require('node:test'), assert = require('node:assert/strict');
const def = require(process.env.FLUIDOS_FLUJO_MODULE || './fluidos.js');
const idea = def.ideas.find(i => i.id === 'bernoulli');
const Pieza = require('../../../nucleo/kit/piezas/fis-fluidos-e12.js');
const Estatica = require('../../../nucleo/kit/piezas/fis-estatica.js');
const cerca = (a,b,m='') => assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=2e-9*Math.max(1,Math.abs(a),Math.abs(b)), `${m}: ${a} frente a ${b}`);
const UNIDADES = {'kg/m³':1,'m/s²':1,'L/s':.001,'m³/s':1,'m/s':1,'cm²':.0001,'m²':1,'cm³':.000001,'m³':1,'kPa':1000,'Pa':1,'cm':.01,'m':1,'L':.001,'s':1,'kg':1};
const unidades = {'caudal-tiempo':'L/s','volumen-paso':'L','rapidez-caudal':'m/s','continuidad-area':'m/s','area-continuidad':'cm²','continuidad-diametro':'m/s','tiempo-volumen':'s','presion-horizontal':'kPa','presion-desnivel':'kPa','torricelli-rapidez':'m/s','presion-areas':'kPa','area-desde-presiones':'cm²','altura-desde-caudal':'m','deposito-caudal':'L/s','densidad-desde-presiones':'kg/m³'};
const referencias = [1.5,24,1.5,6,8,2,60,116,154,5,121,4,3.2,3,800];
const conteo = {casos:0,ecuaciones:0,opciones:0,figuras:0};
function buscar(balance) {
  let a=0,b=1; assert.ok(balance(a)<=1e-8,'Balance positivo en cero');
  for(let i=0;balance(b)<0;i++){assert.ok(i<80,'Balance no acotado');b*=2;}
  for(let i=0;i<100;i++){const m=(a+b)/2;if(balance(m)<0)a=m;else b=m;}
  return (a+b)/2;
}
// Un avance de 100v cm en un segundo barre A*100v cm³; 1000 cm³ forman un litro.
const litrosSegundo = (A,v) => A*(100*v)/1000;
function trabajo(rho,v1,v2,z1,z2,g) {
  const volumen=1,masa=rho*volumen;
  return masa*v2*v2/2-masa*v1*v1/2+masa*g*z2-masa*g*z1;
}
function independiente(c) {
  const g=c.g??10;
  let Q,A=c.area,A1=c.area1,A2=c.area2,v=c.rapidez,v1=c.v1,v2=c.v2,V=c.litros,t=c.tiempo,h=c.h,rho=c.rho,p1=c.p1,p2=c.p2,z1=c.z1??0,z2=c.z2??0,valor;
  switch(c.tipo){
    case 'caudal-tiempo': Q=buscar(q=>q*t-V);valor=Q;break;
    case 'volumen-paso': Q=litrosSegundo(A,v);V=Q*t;valor=V;break;
    case 'rapidez-caudal': Q=c.caudal;v=buscar(w=>litrosSegundo(A,w)-Q);valor=v;break;
    case 'continuidad-area':Q=litrosSegundo(A1,v1);v2=buscar(w=>litrosSegundo(A2,w)-Q);valor=v2;break;
    case 'area-continuidad':Q=litrosSegundo(A1,v1);A2=buscar(a=>litrosSegundo(a,v2)-Q);valor=A2;break;
    case 'continuidad-diametro':A1=4*Math.atan(1)*(c.d1/2)**2;A2=4*Math.atan(1)*(c.d2/2)**2;Q=litrosSegundo(A1,v1);v2=buscar(w=>litrosSegundo(A2,w)-Q);valor=v2;break;
    case 'tiempo-volumen':Q=litrosSegundo(A,v);t=buscar(tiempo=>Q*tiempo-V);valor=t;break;
    case 'presion-horizontal':case 'presion-desnivel':p2=p1-trabajo(rho,v1,v2,z1,z2,g)/1000;valor=p2;break;
    case 'presion-areas':Q=litrosSegundo(A1,v1);v2=buscar(w=>litrosSegundo(A2,w)-Q);p2=p1-trabajo(rho,v1,v2,z1,z2,g)/1000;valor=p2;break;
    case 'area-desde-presiones':v2=buscar(w=>trabajo(rho,v1,w,z1,z2,g)-(p1-p2)*1000);Q=litrosSegundo(A1,v1);A2=buscar(a=>litrosSegundo(a,v2)-Q);valor=A2;break;
    case 'torricelli-rapidez':case 'deposito-caudal':v=buscar(w=>trabajo(1,0,w,h,0,g));if(c.tipo==='deposito-caudal'){Q=litrosSegundo(A,v);valor=Q;}else valor=v;break;
    case 'altura-desde-caudal':Q=c.caudal;v=buscar(w=>litrosSegundo(A,w)-Q);h=buscar(altura=>g*altura-v*v/2);valor=h;break;
    case 'densidad-desde-presiones':Q=litrosSegundo(A1,v1);v2=buscar(w=>litrosSegundo(A2,w)-Q);rho=buscar(d=>trabajo(d,v1,v2,z1,z2,g)-(p1-p2)*1000);valor=rho;break;
    default:throw Error('Familia sin oráculo: '+c.tipo);
  }
  for(const [k,x]of Object.entries({A,A1,A2,v,v1,v2,Q,V,t,h,rho,p1,p2}))if(x!==undefined)assert.ok(x>0,k+' físico positivo');
  if(p1!==undefined&&p2!==undefined)cerca((p1-p2)*1000,trabajo(rho,v1,v2,z1,z2,g),'Trabajo de presiones');
  if(Q!==undefined&&A1!==undefined&&A2!==undefined&&v1!==undefined&&v2!==undefined)cerca(litrosSegundo(A1,v1),litrosSegundo(A2,v2),'Volúmenes iguales en 1 s');
  const si=(x,k=1)=>x===undefined?undefined:x*k;
  const ag=A??A1??12,vg=v??v1??((Q??1.2)/(ag*.1)),qg=Q??litrosSegundo(ag,vg),tg=t??2,pg=(p1??100)*1000,rg=rho??1000;
  const env={Q:qg/1000,V:(V??qg*tg)/1000,t:tg,A:ag/10000,A_1:si(A1,.0001),A_2:si(A2,.0001),v:vg,v_1:v1,v_2:v2,h,rho:rg,g,p:pg,p_1:si(p1,1000),p_2:si(p2,1000),z:z1,z_1:z1,z_2:z2,d:(c.d1??Math.sqrt(4*ag/Math.PI))/100,d_1:si(c.d1,.01),d_2:si(c.d2,.01),constante:pg+rg*vg*vg/2+rg*g*z1};
  return {valor,unidad:unidades[c.tipo],env,Q,A,A1,A2,v,v1,v2,V,t,h,rho,p1,p2,z1,z2,g};
}
// Se completa con las operaciones declaradas por el autor, recalculadas aquí sin leer sus valores.
function errores(c,e) {
  let r={};const y=e.valor;
  switch(c.tipo){
    case 'caudal-tiempo':r={invierte:c.tiempo/c.litros,'sin-tiempo':c.litros,'medio-tiempo':c.litros/(c.tiempo/2)};break;
    case 'volumen-paso':r={'sin-tiempo':e.Q,'mitad-tiempo':e.Q*(c.tiempo/2),'doble-area':litrosSegundo(2*c.area,c.rapidez)*c.tiempo};break;
    case 'rapidez-caudal':r={'litro-centimetro':c.caudal/c.area,'doble-area':buscar(w=>litrosSegundo(2*c.area,w)-c.caudal),'mitad-area':buscar(w=>litrosSegundo(c.area/2,w)-c.caudal)};break;
    case 'continuidad-area':r={'razon-inversa':c.v1*c.area2/c.area1,'conserva-rapidez':c.v1,'razon-cuadrada':c.v1*(c.area1/c.area2)**2};break;
    case 'area-continuidad':r={'razon-inversa':c.area1*c.v2/c.v1,'conserva-area':c.area1,'razon-cuadrada':c.area1*(c.v1/c.v2)**2};break;
    case 'continuidad-diametro':r={'diametro-lineal':c.v1*c.d1/c.d2,'conserva-rapidez':c.v1,'razon-inversa':c.v1*e.A2/e.A1};break;
    case 'tiempo-volumen':r={'doble-caudal':c.litros/(2*e.Q),'sin-rapidez':c.litros/litrosSegundo(c.area,1),'mitad-caudal':c.litros/(e.Q/2)};break;
    case 'presion-horizontal':case 'presion-desnivel':case 'presion-areas':{
      const cin=trabajo(e.rho,e.v1,e.v2,0,0,e.g)/1000,altura=trabajo(e.rho,0,0,e.z1,e.z2,e.g)/1000;
      r={'cin-signo':e.p1+cin-altura,'sin-cin':e.p1-altura,...(altura===0?{'sin-medio':e.p1-2*cin}:{'altura-signo':e.p1-cin+altura})};break;}
    case 'area-desde-presiones':{const dp=(c.p1-c.p2)*1000,v0=buscar(w=>c.rho*w*w/2-dp),vMedio=buscar(w=>c.rho*(w*w-c.v1*c.v1)-dp);r={'sin-inicial':e.Q*10/v0,'razon-inversa':c.area1*e.v2/c.v1,'sin-medio':e.Q*10/vMedio};break;}
    case 'torricelli-rapidez':case 'deposito-caudal':{const vSin=buscar(w=>w*w-c.g*c.h),vDoble=buscar(w=>w*w/2-c.g*2*c.h),fn=w=>c.tipo==='deposito-caudal'?litrosSegundo(c.area,w):w;r={'sin-dos':fn(vSin),'sin-raiz':fn(2*c.g*c.h),'doble-altura':fn(vDoble)};break;}
    case 'altura-desde-caudal':r={'sin-dos':e.v*e.v/c.g,'sin-cuadrado':e.v/(2*c.g),'caudal-rapidez':c.caudal*c.caudal/(2*c.g)};break;
    case 'densidad-desde-presiones':{const dp=(c.p1-c.p2)*1000;r={'sin-dos':dp/(e.v2*e.v2-c.v1*c.v1),'sin-inicial':2*dp/(e.v2*e.v2),'sin-cuadrados':2*dp/(e.v2-c.v1)};break;}
  }
  return r;
}
function plano(x){if(x==null)return '';if(typeof x!=='object')return String(x);if(Array.isArray(x))return x.map(plano).join('');if('t'in x)return plano(x.t);if(x.frac)return '('+plano(x.frac[0])+')/('+plano(x.frac[1])+')';if(x.sub)return plano(x.sub[0])+'_'+plano(x.sub[1]);if(x.sup)return '('+plano(x.sup[0])+')^('+plano(x.sup[1])+')';if(x.raiz)return 'sqrt('+plano(x.raiz)+')';if(x.negrita)return plano(x.negrita);return '';}
function texto(x){if(x==null||typeof x==='function')return '';if(typeof x!=='object')return String(x);if(Array.isArray(x))return x.map(texto).join(' ');if(x.t||x.frac||x.sub||x.sup||x.raiz)return plano(x);return Object.values(x).map(texto).join(' ');}
function numero(x){const s=plano(x).replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,'').replace(/−/g,'-'),a=s.match(/[+-]?\d+(?:[,.]\d+)?/g);assert.equal(a?.length,1,'Una cantidad visible: '+s);return Number(a[0].replace(',','.'));}
function visible(x,v,u){const s=plano(x),n=numero(s),d=Math.abs(n-v);assert.ok(s.includes(u),'Unidad '+u+': '+s);if(d>1e-8*Math.max(1,Math.abs(v)))assert.ok(/[≈~]/.test(s),'Aproximación sin signo: '+s+' frente a '+v);const m=s.match(/[+-]?\d+(?:[,.](\d+))?/),dec=m?.[1]?.length||0;assert.ok(d<=.5*10**(-dec)+1e-8,'Redondeo '+s);}
function nodos(x,out=[]){if(Array.isArray(x))x.forEach(v=>nodos(v,out));else if(x&&typeof x==='object'){if(x.v&&/^[+−-]?\d/.test(x.t))out.push(x);else Object.values(x).forEach(v=>{if(typeof v==='object')nodos(v,out);});}return out;}
const entradasUnidad={litros:'L',tiempo:'s',area:'cm²',rapidez:'m/s',caudal:'L/s',area1:'cm²',area2:'cm²',v1:'m/s',v2:'m/s',d1:'cm',d2:'cm',p1:'kPa',p2:'kPa',rho:'kg/m³',z1:'m',z2:'m',h:'m',g:'m/s²'};
const entradaColor={litros:'d',tiempo:'h',area:'d',rapidez:'o',caudal:'o',area1:'d',area2:'d',v1:'o',v2:'o',d1:'d',d2:'d',p1:'i',p2:'i',rho:'f',z1:'d',z2:'d',h:'d',g:'h'};
function entradas(p,c){const publico=[p.enunciado||p.pregunta,p.datos],ns=nodos(publico),tx=texto(publico);
  for(const[k,v]of Object.entries(c)){if(['tipo','valor','unidad','errores','intermedios'].includes(k))continue;const u=entradasUnidad[k];assert.ok(u,'Entrada sin contrato '+k);
    if(k==='g'&&!['presion-horizontal','presion-desnivel','presion-areas','torricelli-rapidez','altura-desde-caudal','deposito-caudal'].includes(c.tipo))continue;
    if((k==='z1'||k==='z2')&&v===0&&/horizontal|misma altura|referencia|z[₁₂_12]*\s*=\s*0/i.test(tx))continue;
    const n=ns.find(n=>Math.abs(numero(n)-v)<1e-9&&plano(n).endsWith(' '+u));assert.ok(n,'Entrada visible '+k+'='+v+' '+u);assert.equal(n.v,'c-'+entradaColor[k],'Color de '+k);
  }
  for(const d of p.datos||[]){const t=plano(d);assert.doesNotMatch(t,/Q\s*=\s*A|Q\s*=\s*V|v\s*=\s*Q|A_1.*v_1.*=.*A_2|v.*=\s*√|p_1.*[+×].*ρ|dividimos|multiplicamos|despejamos|restamos|sumamos/i,'Datos anticipa el camino');}
}
const listaUnidades=Object.keys(UNIDADES).sort((a,b)=>b.length-a.length);
function unidadFinal(s){return listaUnidades.find(u=>s.trim().endsWith(' '+u));}
function evaluar(s,env,factor){s=s.trim().replace(/−/g,'-').replace(/[×·]/g,'*').replace(/,/g,'.').replace(/ρ/g,'rho').replace(/π/g,'pi').replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,'');let salida=factor,explicito=false;
  const reU=new RegExp('([+-]?\\d+(?:\\.\\d+)?)\\s+('+listaUnidades.map(u=>u.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?=$|[)\\s+*/-])','g');
  s=s.replace(reU,(_,n,u)=>{explicito=true;return '('+n+'*'+UNIDADES[u]+')';});
  const u=unidadFinal(s);if(u){s=s.slice(0,-u.length).trim();salida=UNIDADES[u];}let simbolico=false;
  s=s.replace(/\b[A-Za-z]+(?:_[A-Za-z0-9]+)?\b/g,k=>{if(k==='sqrt')return k;if(k==='pi')return '('+(4*Math.atan(1))+')';assert.ok(Number.isFinite(env[k]),'Símbolo sin valor '+k+' en '+s);simbolico=true;return '('+env[k]+')';}).replace(/\^/g,'**');
  assert.match(s,/^[\d\s()+*/.\-sqrt]+$/,'Expresión cerrada '+s);const v=Function('sqrt','"use strict";return ('+s+')')(Math.sqrt);assert.ok(Number.isFinite(v));return v*(simbolico||explicito?1:salida);
}
function ecuaciones(filas,e){for(const fila of filas||[])if(fila?.ecuacion){const bloques=[];for(const s of plano(fila.ecuacion).split(/;|⇒| {3}· {3}/)){if(/^\s*[+−-]/.test(s)&&bloques.length)bloques[bloques.length-1]+=' '+s;else bloques.push(s);}for(const b of bloques){const partes=b.split(/(=|≈|~)/).map(x=>x.trim());if(partes.length<3)continue;const expr=partes.filter((_,i)=>!(i%2)),factores=expr.map((_,i)=>UNIDADES[expr.slice(i).map(unidadFinal).find(Boolean)||'Pa']),vs=expr.map((s,i)=>evaluar(s,e.env,factores[i]));for(let i=1;i<vs.length;i++){if(partes[2*i-1]==='=')cerca(vs[i-1],vs[i],'Igualdad '+b);else{const m=expr[i].match(/^[-+]?\d+(?:,(\d+))?\s/),dec=m?(m[1]||'').length:3;assert.ok(Math.abs(vs[i]-vs[i-1])<=(.5*10**(-dec)+1e-9)*factores[i],'Aproximación '+b);}conteo.ecuaciones++;}}}}
const cruza=(a,b)=>a.x0<b.x1-1e-8&&a.x1>b.x0+1e-8&&a.y0<b.y1-1e-8&&a.y1>b.y0+1e-8;
function corta(c,a,b,m=0){let lo=0,hi=1;const dx=b[0]-a[0],dy=b[1]-a[1];for(const[p,q]of[[-dx,a[0]-c.x0+m],[dx,c.x1-a[0]+m],[-dy,a[1]-c.y0+m],[dy,c.y1-a[1]+m]]){if(Math.abs(p)<1e-12){if(q<0)return false;}else{const t=q/p;if(p<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return false;}}return hi-lo>1e-8;}
function figura(f){assert.ok(f,'Figura');assert.ok(['fis-fluidos-e12','fis-estatica'].includes(f.pieza));const P=f.pieza==='fis-estatica'?Estatica:Pieza,g=P.geometria(f.datos,f.estado||{}),svg=P.dibujar(f.datos,f.estado||{});assert.doesNotMatch(svg,/NaN|Infinity|undefined|\[object Object\]|#[0-9a-f]{3,6}\b|[A-Za-z]_[A-Za-z0-9]/i);assert.equal(g.W,320);assert.ok(P.alt(f.datos,f.estado||{}).length>8);
  if(!g.segmentos){g.segmentos=[];for(const m of g.s.matchAll(/\bd="(M[-\d. ,L]+)"/g)){const ps=[...m[1].matchAll(/[-]?\d+(?:\.\d+)?/g)].map(v=>+v[0]);for(let j=2;j<ps.length;j+=2)g.segmentos.push({id:'trazo-estatico',de:ps.slice(j-2,j),a:ps.slice(j,j+2),grosor:1.2});}}
  for(const b of[...g.rotulos,...g.objetos])assert.ok(b.x0>=4&&b.y0>=4&&b.x1<=316&&b.y1<=g.H-4,'Margen '+b.id);
  for(let i=0;i<g.rotulos.length;i++){const r=g.rotulos[i];for(const t of g.rotulos.slice(i+1))assert.ok(!cruza(r,t),'Rótulos '+r.id+'/'+t.id);for(const s of g.segmentos)assert.ok(!corta(r,s.de,s.a,s.grosor/2),'Trazo '+r.id+'/'+s.id);for(const b of g.objetos.filter(x=>x.solido))assert.ok(!cruza(r,b),'Cuerpo '+r.id+'/'+b.id);for(const f of g.flechas){assert.ok(!corta(r,f.de,f.a,1),'Flecha '+r.id);for(let j=0;j<3;j++)assert.ok(!corta(r,f.punta[j],f.punta[(j+1)%3],1),'Punta '+r.id);}}
  conteo.figuras++;return g;
}
function figuraCaso(p,c,e){const f=p.dibujo||p.figura,g=figura(f),d=f.estado?.datos||f.datos;assert.equal(d.caso,undefined);assert.equal(d.valor,undefined);
  if(['presion-horizontal','presion-desnivel'].includes(c.tipo)){
    assert.equal(f.pieza,'fis-estatica');const lineas=d.lineas,puntos=[lineas[1],lineas[3]];
    cerca(puntos[1].de[1]-puntos[0].de[1],70*(c.z1-c.z2),'Alturas dadas, escala común');
    assert.equal(d.cuerpos,undefined,'Sin áreas de tubo inventadas');
    if(c.tipo==='presion-desnivel'){assert.ok(c.z1>c.z2&&c.v2>c.v1&&e.p2>e.p1,'Afirmación: el descenso compensa la mayor rapidez');}
  }
  if(['torricelli-rapidez','deposito-caudal'].includes(c.tipo)){
    cerca((g.referencias.salida.y-g.referencias['superficie-deposito'].y)/d.escala.vertical,c.h,'Profundidad desde superficie hasta salida');
    assert.equal(g.flechas.length,0,'Sin rapidez intermedia revelada');assert.match(texto(d),/instante/);
  }
  if(['area-continuidad','area-desde-presiones','altura-desde-caudal'].includes(c.tipo)){assert.equal(d.modo,'esquema','Incógnita sin geometría calculada');if(d.flujo)assert.ok(d.flujo.secciones.every(s=>s.area===undefined&&s.z===undefined));if(d.vasos)assert.ok(d.vasos.every(v=>v.nivel===undefined&&v.salida?.altura===undefined));}
  if(['continuidad-area','continuidad-diametro','presion-areas','densidad-desde-presiones','torricelli-rapidez','deposito-caudal','rapidez-caudal'].includes(c.tipo))assert.ok(!(d.flechas||[]).some(f=>f.clase==='rapidez'&&f.ref==='salida'&&!f.cualitativa),'Rapidez desconocida dibujada');
  if(d.tipo==='flujo'&&d.modo!=='esquema'){const[a,b]=d.flujo.secciones;for(const s of[a,b])assert.ok(s.area>0);if(a.z!==undefined&&b.z!==undefined)cerca(g.referencias[a.id].y-g.referencias[b.id].y,(b.z-a.z)*d.escala.vertical,'Desnivel dibujado');if(c.area1!==undefined)cerca(a.area,c.area1/10000);if(c.area2!==undefined)cerca(b.area,c.area2/10000);if(c.d1!==undefined){cerca(a.area,4*Math.atan(1)*(c.d1/200)**2);cerca(b.area,4*Math.atan(1)*(c.d2/200)**2);}}
}
function comprobar(p,nombre){const c=p.caso;assert.ok(c,nombre);const e=independiente(c),er=errores(c,e);cerca(c.valor,e.valor,nombre);assert.equal(c.unidad,e.unidad);entradas(p,c);for(const op of c.errores||[]){assert.ok(op.operacion in er,'Operación sin oráculo '+op.operacion);cerca(op.valor,er[op.operacion]);}if(p.respuesta)visible(p.respuesta,e.valor,e.unidad);ecuaciones(p.pasos||(Array.isArray(p.solucion)?p.solucion:[p.solucion]),e);figuraCaso(p,c,e);
  const intermedios={caudal:e.Q,v2:e.v2,v:e.v,cin:e.rho===undefined?undefined:-trabajo(e.rho,e.v1,e.v2,0,0,e.g)/1000,alt:e.rho===undefined?undefined:-trabajo(e.rho,0,0,e.z1,e.z2,e.g)/1000};
  for(const[k,v]of Object.entries(c.intermedios||{})){assert.ok(k in intermedios,'Intermedio sin operación '+k);cerca(v,intermedios[k],nombre+' intermedio '+k);}
  for(const d of p.datos||[])if(/^1\s/.test(plano(d)))ecuaciones([{ecuacion:plano(d).replace(/\.$/,'')}],e);
  if(p.opciones){assert.equal(p.opciones.length,4);assert.equal(p.opciones.filter(o=>Math.abs(o.valor-e.valor)<1e-8).length,1);assert.equal(p.opciones.filter(o=>o.correcta).length,1);assert.equal(new Set(p.opciones.map(o=>numero(o.texto))).size,4,'Opciones diferentes después de formato');for(const o of p.opciones){const op=(c.errores||[]).find(x=>o.error?.endsWith(x.operacion)),v=o.correcta?e.valor:er[op?.operacion];assert.ok(Number.isFinite(v),'Distractor identificado '+o.error);cerca(o.valor,v);visible(o.texto,v,e.unidad);if(!o.correcta){assert.ok(o.siFuera&&texto(o.siFuera).trim().split(/\s+/).length<=20);const tx=texto(o.siFuera),m=tx.match(/(?:Obtienes|obtienes|dar[ií]a|resulta(?:ría)?)\s+(.+)$/);assert.ok(m,'Resultado explícito de siFuera: '+tx);visible(m[1].replace(/\.$/,''),v,e.unidad);}conteo.opciones++;}}
  if(p.alternativas){assert.equal(p.alternativas.length,4);assert.equal(new Set(p.alternativas.map(numero)).size,4);const valores=[e.valor,...Object.values(er)];for(const a of p.alternativas){const v=valores.find(v=>Math.abs(numero(a)-v)<.00500001);assert.ok(Number.isFinite(v),'Alternativa sin operación');visible(a,v,e.unidad);}assert.equal(p.alternativas.filter(a=>Math.abs(numero(a)-e.valor)<.00500001).length,1);}
  conteo.casos++;return e;
}
test('Flujo: el oráculo y las pruebas negativas funcionan sin resultados productivos',()=>{cerca(independiente({tipo:'presion-areas',p1:132,rho:1000,area1:12,area2:6,v1:2,z1:0,z2:.5,valor:-900}).valor,121);cerca(independiente({tipo:'area-desde-presiones',p1:130,p2:114,rho:1000,area1:12,v1:2,z1:0,z2:0}).valor,4);cerca(independiente({tipo:'deposito-caudal',h:1.8,g:10,area:5}).valor,3);assert.throws(()=>visible('1,33 m/s',4/3,'m/s'),/Aproximación/);assert.throws(()=>ecuaciones([{ecuacion:'v_2 = 6 / 3 * 2 = 5 m/s'}],{unidad:'m/s',env:{v_2:4}}),/Igualdad/);});
test('Flujo: quince familias, referencias independientes, ecuaciones y figuras',()=>{assert.ok(idea,'Idea bernoulli');assert.equal(idea.ejemplos.length,15);assert.deepEqual(idea.ejemplos.map(p=>p.caso.tipo),Object.keys(unidades));assert.deepEqual(idea.ejemplos.reduce((a,p)=>(a[p.nivel-1]++,a),[0,0,0]),[5,5,5]);for(const[i,p]of idea.ejemplos.entries())cerca(comprobar(p,'Ejemplo '+(i+1)).valor,referencias[i]);});
for(const m of['resuelve','ahoraTu'])test('Flujo: 400 semillas independientes de '+m,()=>{const tipos=new Set();for(let s=0;s<400;s++){const p=idea[m].generar(s);comprobar(p,m+'/'+s);tipos.add(p.caso.tipo);}assert.deepEqual([...tipos].sort(),(m==='resuelve'?['presion-areas','deposito-caudal']:['caudal-tiempo','continuidad-diametro','area-desde-presiones']).sort());});
test('Flujo: los bancos no repiten ejemplos ni casos entre momentos',()=>{const firma=c=>JSON.stringify(Object.fromEntries(Object.entries(c).filter(([k])=>!['valor','unidad','intermedios','errores'].includes(k)).sort(([a],[b])=>a.localeCompare(b))));const ej=new Set(idea.ejemplos.map(p=>firma(p.caso))),r=new Set();for(let s=0;s<400;s++){const f=firma(idea.resuelve.generar(s).caso);assert.ok(!ej.has(f));r.add(f);}for(let s=0;s<400;s++){const f=firma(idea.ahoraTu.generar(s).caso);assert.ok(!ej.has(f)&&!r.has(f));}});
test('Flujo: juego, misión y Predice conservan volumen sin adelantar la rapidez',()=>{const j=idea.juega,control=j.controles[0];assert.equal(j.controles.length,1);const ganan=[];for(const op of control.opciones){const estado={[control.id]:op.valor},q=litrosSegundo(4,op.valor),fig=j.dibujo(estado),g=figura(fig);if(j.mision.logrado(estado))ganan.push(op.valor);assert.equal(fig.datos.tipo,'flujo');assert.ok(fig.datos.flujo.secciones.every(s=>s.area===.0004));for(const f of g.flechas)cerca(Math.hypot(f.a[0]-f.de[0],f.a[1]-f.de[1])/fig.datos.escala.rapidez,op.valor);assert.ok(texto(j.lectura(estado)).includes(String(q).replace('.',',')),'Caudal observable');}assert.deepEqual(ganan,[1.5]);assert.equal(j.mision.logrado({[control.id]:control.inicio}),false);
  const p=idea.predice,vs=[4,1,2,8];assert.equal(p.opciones.length,4);assert.equal(p.opciones.filter(o=>o.correcta).length,1);assert.equal(p.opciones.find(o=>o.correcta).valor,4);for(const o of p.opciones){assert.ok(vs.includes(o.valor));visible(o.texto,o.valor,'m/s');if(!o.correcta){const s=texto(o.siFuera);assert.ok(s.split(/\s+/).length<=20);assert.ok(s.includes(String(o.valor)));}}assert.equal(new Set(p.opciones.map(o=>numero(o.texto))).size,4);const antes=figura(p.dibujo),despues=figura(p.revelar);assert.doesNotMatch(texto([idea.lee,j.consigna,j.mision,p.datos,p.dibujo,def.glosario]),/4\s*m\/s/,'Predice adelantada');assert.equal(antes.rotulos.filter(r=>/Rapidez:/.test(r.texto)).length,1);assert.equal(despues.rotulos.filter(r=>/Rapidez:/.test(r.texto)).length,2); visible(antes.rotulos.find(r=>/Rapidez:/.test(r.texto)).texto,2,'m/s');visible(despues.rotulos.find(r=>/Rapidez:/.test(r.texto)&&r.x>160).texto,4,'m/s');
});
test('Flujo: figuras de Lee, Mira y Regla mantienen margen y no cruzan rótulos',()=>{for(const t of idea.lee.tarjetas)if(t.dibujo)figura(t.dibujo);if(idea.regla.dibujo)figura(idea.regla.dibujo);for(const p of idea.mira.pasos)figura({pieza:idea.mira.pieza||'fis-fluidos-e12',datos:idea.mira.datos,estado:p.estado||{}});});

test('Flujo: Mira y Regla cierran en 400 balances independientes de volumen y trabajo',()=>{
  assert.equal(idea.mira.pasos.length,7);
  for(let s=0;s<400;s++){
    const A1=(3+s%9)/10000,A2=A1/(2+s%3),v1=.5+(s%11)/4,Q=A1*v1,v2=buscar(w=>A2*w-Q),rho=700+s%401,g=8+s%5,z1=(s%7)/5,z2=(s%5)/4,p1=150000+s*17;
    const p2=p1-trabajo(rho,v1,v2,z1,z2,g),t=1+s%13,h=v1*v1/(2*g),d=buscar(x=>Math.atan(1)*x*x-A1);
    const env={A:A1,A_1:A1,A_2:A2,v:v1,v_1:v1,v_2:v2,Q,V:Q*t,t,rho,g,p:p1,p_1:p1,p_2:p2,z:z1,z_1:z1,z_2:z2,h,d,constante:p1+rho*v1*v1/2+rho*g*z1};
    ecuaciones(idea.mira.pasos.filter((_,i)=>i!==1),{unidad:'Pa',env});
    ecuaciones([idea.regla],{unidad:'Pa',env});
  }
  const e=independiente({tipo:'continuidad-area',area1:6,area2:3,v1:2});
  ecuaciones([idea.mira.pasos[1]],e);
});

test.after(()=>console.log('Cobertura independiente de Flujo:',JSON.stringify(conteo)));
