import json,re,sys
pl,out=sys.argv[1],sys.argv[2]
d=json.load(open('plantillas/%s/casos.json'%pl))
cs=d['casos'] if isinstance(d,dict) else d
res=[]
for i,c in enumerate(cs):
  n=re.sub(r'\([^)]*\)','',c['nombre'].split('→')[0]).strip(' :;,')
  e={'i':i,'nombre':n,'fn':c['fn'],'args':c['args'],'pide':list(c['espera'].keys())}
  if c.get('tambien'): e['tambien']=[{'fn':t.get('fn',c['fn']),'args':t['args'],'pide':list(t['espera'].keys())} for t in c['tambien']]
  res.append(e)
json.dump(res,open(out,'w'),ensure_ascii=False,indent=1); print(len(res))
