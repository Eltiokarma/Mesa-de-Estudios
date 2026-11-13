const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {pathToFileURL}=require('url');
(async()=>{
const d=path.resolve(__dirname,'../fuentes/ocr-local/cuzcano/cierre-multicurso-814'),expected=JSON.parse(fs.readFileSync(path.join(d,'avance.json'),'utf8'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:390,height:844}}),report={};
for(const name of ['index.html',...expected.temas.map(t=>t.lector)]){
 await page.goto(pathToFileURL(path.join(d,name)).href);const width=await page.evaluate(()=>document.documentElement.scrollWidth);if(width!==390)throw Error('Ancho:'+width);
 const count=await page.locator('#fichas tbody tr').count(),theme=expected.temas.find(t=>t.lector===name);if(count!==(theme?100:814))throw Error('Conteo:'+count);
 await page.locator('#c').check();const obs=await page.locator('#fichas tbody tr:visible').count();if(obs!==(theme?theme.observaciones_acumuladas:expected.con_observaciones_en_nuevos))throw Error('Condiciones:'+obs);
 await page.locator('#c').uncheck();await page.locator('#q').fill('xyz_inexistente');if(await page.locator('#fichas tbody tr:visible').count())throw Error('Filtro');await page.locator('#q').fill('');
 if(!await page.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0)))throw Error('Imagen');
 const links=await page.locator('a').evaluateAll(xs=>xs.map(a=>a.getAttribute('href')));
 for(const href of links){const [file,anchor]=href.split('#'),target=path.resolve(d,file);if(!fs.existsSync(target))throw Error('Ausente:'+href);if(anchor&&!fs.readFileSync(target,'utf8').includes('id="'+anchor+'"'))throw Error('Ancla:'+href);}
 await page.screenshot({path:path.join(d,name.replace('.html','-mobile.png'))});report[name]={filas:count,ancho:width,observaciones:obs,enlaces_validos:links.length};
}
await browser.close();fs.writeFileSync(path.join(d,'qa-lectores.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
