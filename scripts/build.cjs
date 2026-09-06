const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
const files=['index.html','assets/styles.css','assets/app.js','assets/model.js','assets/data.js','assets/thailand.js','assets/bala.png','assets/tmu.png','assets/favicon.svg'];
// Public allowlist excludes research PDFs, credentials, repository metadata and tests.
fs.mkdirSync(out,{recursive:true});
for(const file of files){const src=path.join(root,file);if(!fs.statSync(src).size)throw new Error('Empty asset: '+file);if(file.endsWith('.js'))new vm.Script(fs.readFileSync(src,'utf8'),{filename:file});fs.mkdirSync(path.dirname(path.join(out,file)),{recursive:true});fs.copyFileSync(src,path.join(out,file));}
fs.writeFileSync(path.join(out,'.nojekyll'),'');console.log('Production site ready in dist/: '+files.length+' public files.');
