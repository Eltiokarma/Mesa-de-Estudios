import math, itertools, colorsys
def hex2rgb(h): h=h.lstrip('#'); return [int(h[i:i+2],16)/255 for i in (0,2,4)]
def lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def lum(h): r,g,b=[lin(x) for x in hex2rgb(h)]; return 0.2126*r+0.7152*g+0.0722*b
def contraste(a,b): la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
def lab(h):
    r,g,b=[lin(x) for x in hex2rgb(h)]
    X=(0.4124*r+0.3576*g+0.1805*b)/0.95047; Y=0.2126*r+0.7152*g+0.0722*b; Z=(0.0193*r+0.1192*g+0.9505*b)/1.08883
    f=lambda t: t**(1/3) if t>0.008856 else 7.787*t+16/116
    return 116*f(Y)-16, 500*(f(X)-f(Y)), 200*(f(Y)-f(Z))
def de(a,b):  # CIEDE2000
    L1,a1,b1=lab(a); L2,a2,b2=lab(b)
    C1=math.hypot(a1,b1); C2=math.hypot(a2,b2); Cm=(C1+C2)/2
    G=0.5*(1-math.sqrt(Cm**7/(Cm**7+25**7))); a1p=(1+G)*a1; a2p=(1+G)*a2
    C1p=math.hypot(a1p,b1); C2p=math.hypot(a2p,b2)
    h1p=math.degrees(math.atan2(b1,a1p))%360; h2p=math.degrees(math.atan2(b2,a2p))%360
    dL=L2-L1; dC=C2p-C1p; dh=h2p-h1p
    if C1p*C2p==0: dh=0
    elif dh>180: dh-=360
    elif dh<-180: dh+=360
    dH=2*math.sqrt(C1p*C2p)*math.sin(math.radians(dh/2))
    Lm=(L1+L2)/2; Cmp=(C1p+C2p)/2
    hm=(h1p+h2p)/2 if abs(h1p-h2p)<=180 else (h1p+h2p+360)/2
    if C1p*C2p==0: hm=h1p+h2p
    T=1-0.17*math.cos(math.radians(hm-30))+0.24*math.cos(math.radians(2*hm))+0.32*math.cos(math.radians(3*hm+6))-0.2*math.cos(math.radians(4*hm-63))
    dt=30*math.exp(-((hm-275)/25)**2); RC=2*math.sqrt(Cmp**7/(Cmp**7+25**7))
    SL=1+0.015*(Lm-50)**2/math.sqrt(20+(Lm-50)**2); SC=1+0.045*Cmp; SH=1+0.015*Cmp*T; RT=-math.sin(math.radians(2*dt))*RC
    return math.sqrt((dL/SL)**2+(dC/SC)**2+(dH/SH)**2+RT*(dC/SC)*(dH/SH))
claro={'m':'#b85a06','h':'#4f7a17','v':'#c0364a','x':'#0f766e','k':'#6b3dbd','F':'#1f5fbf','f':'#8f5800','P':'#b3246b'}
oscuro={'m':'#f0a04a','h':'#a3d65e','v':'#f17384','x':'#5ed9c8','k':'#ab8cf2','F':'#7cb0ff','f':'#ffc04d','P':'#ff86bd'}
PAPEL_C, PAPEL_O = '#fdf7f1', '#241c2e'
def hsl(hh,s,l):
    r,g,b=colorsys.hls_to_rgb(hh/360,l,s); return '#%02x%02x%02x'%(round(r*255),round(g*255),round(b*255))
# candidatos claros con contraste AA sobre papel crema
cands=[hsl(h,s,l) for h in range(0,360,6) for s in (0.45,0.6,0.75,0.9) for l in (0.22,0.28,0.34,0.40) ]
cands=[c for c in cands if contraste(c,PAPEL_C)>=4.5]
def peor(sel, base): 
    todos=list(base.values())+sel
    return min(de(a,b) for a,b in itertools.combinations(todos,2))
print('peor par actual (claro):', round(peor([],claro),1))
# búsqueda voraz de 3
sel=[]
for _ in range(3):
    best=max(cands, key=lambda c: min(de(c,o) for o in list(claro.values())+sel))
    sel.append(best); print('elegido', best, round(min(de(best,o) for o in list(claro.values())+sel[:-1]),1), 'contraste', round(contraste(best,PAPEL_C),2))
print('peor par con 11:', round(peor(sel,claro),1))
# versión oscura: misma tonalidad, más clara
import colorsys as cs
out=[]
for c in sel:
    r,g,b=hex2rgb(c); h,l,s=cs.rgb_to_hls(r,g,b)
    best=None
    for L in [x/100 for x in range(55,86)]:
        for S in (0.5,0.65,0.8,0.95):
            cc=hsl(h*360,S,L)
            if contraste(cc,PAPEL_O)<4.5: continue
            sc=min(de(cc,o) for o in list(oscuro.values())+out)
            if best is None or sc>best[0]: best=(sc,cc)
    out.append(best[1]); print('oscuro', c,'->',best[1], round(best[0],1), round(contraste(best[1],PAPEL_O),2))
print('peor par oscuro con 11:', round(peor(out,oscuro),1))
for k,v in claro.items(): print(k, v, round(contraste(v,PAPEL_C),2), oscuro[k], round(contraste(oscuro[k],PAPEL_O),2))
print('\n--- con tinta, gris, ok y warn como colores a evitar ---')
evitarC={'ink':'#2d2340','muted':'#716579','ok':'#1d7f58','warn':'#c8363b'}
evitarO={'ink':'#f1ebf7','muted':'#a99cb8','ok':'#4fd09a','warn':'#ff7b7f'}
def chroma(h): L,a,b=lab(h); return math.hypot(a,b)
cands=[hsl(h,s,l) for h in range(0,360,4) for s in (0.55,0.7,0.85) for l in (0.30,0.34,0.38,0.42)]
cands=[c for c in cands if contraste(c,PAPEL_C)>=4.5 and chroma(c)>=35]
sel=[]
for _ in range(3):
    pool=list(claro.values())+list(evitarC.values())+sel
    best=max(cands, key=lambda c: min(de(c,o) for o in pool))
    sel.append(best); print('claro', best, 'ΔE mín', round(min(de(best,o) for o in pool),1), 'contraste', round(contraste(best,PAPEL_C),2))
out=[]
for c in sel:
    r,g,b=hex2rgb(c); h,l,s=colorsys.rgb_to_hls(r,g,b)
    best=None
    for L in [x/100 for x in range(55,86)]:
        for S in (0.55,0.7,0.85,0.95):
            for dh in (-12,-6,0,6,12):
                cc=hsl((h*360+dh)%360,S,L)
                if contraste(cc,PAPEL_O)<4.5 or chroma(cc)<30: continue
                sc=min(de(cc,o) for o in list(oscuro.values())+list(evitarO.values())+out)
                if best is None or sc>best[0]: best=(sc,cc)
    out.append(best[1]); print('oscuro', c,'->',best[1], 'ΔE mín', round(best[0],1), 'contraste', round(contraste(best[1],PAPEL_O),2))
