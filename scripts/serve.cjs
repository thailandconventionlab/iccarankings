const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),port=Number(process.env.PORT)||4173;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((req,res)=>{let file;try{file=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
 const target=path.resolve(root,'.'+(file==='/'?'/index.html':file)),rel=path.relative(root,target);
 if(rel.startsWith('..')||path.isAbsolute(rel)||!(rel==='index.html'||rel.startsWith('assets'+path.sep))){res.writeHead(404).end('Not found');return;}
 fs.readFile(target,(err,data)=>{if(err){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(data);});
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
