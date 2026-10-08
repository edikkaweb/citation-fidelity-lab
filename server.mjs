import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('.',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.mjs':'text/javascript','.json':'application/json','.md':'text/plain; charset=utf-8'};
const port=Number(process.env.CITATION_LAB_PORT||8796);
createServer(async(req,res)=>{
  try {
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405,{'Allow':'GET, HEAD'}).end(); return; }
    const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    const target=p===root?resolve(root,'index.html'):p;
    if(!target.startsWith(root+sep)||target.slice(root.length).includes(`${sep}.`)||target.startsWith(resolve(root,'private-results')+sep)||(!mime[extname(target)]&&target!==resolve(root,'LICENSE'))){res.writeHead(404).end();return;}
    const data=await readFile(target);
    res.writeHead(200,{'Content-Type':mime[extname(target)]||'text/plain; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:data);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port,'127.0.0.1',()=>console.log(`http://127.0.0.1:${port}/`));
