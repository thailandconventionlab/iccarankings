const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),base='https://thailandconventionlab.github.io/iccarankings/';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('both entry pages expose the new title and a real, correctly sized public cover without JavaScript',()=>{
 for(const file of ['index.html','dashboard.html']){
  const head=read(file).split('</head>')[0];
  const meta=name=>head.match(new RegExp('<meta (?:property|name)="'+name+'" content="([^"]+)"'))?.[1];
  assert.equal(meta('og:title'),'Thailand Conventions Lab | City Ranking 2016-2025');
  assert.equal(meta('twitter:title'),meta('og:title'));
  assert.equal(meta('og:url'),base+(file==='index.html'?'':file));
  assert.ok(head.includes('<link rel="canonical" href="'+meta('og:url')+'">'));
  const imageUrl=new URL(meta('og:image'));
  assert.ok(imageUrl.href.startsWith(base+'assets/'));
  assert.equal(meta('twitter:image'),imageUrl.href);
  const png=fs.readFileSync(path.join(root,imageUrl.pathname.slice('/iccarankings/'.length)));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(Number(meta('og:image:width')),png.readUInt32BE(16));
  assert.equal(Number(meta('og:image:height')),png.readUInt32BE(20));
  assert.ok(png.length>100_000&&png.length<8_000_000);
  assert.ok(meta('og:description').length>30);
 }
});

test('Home has working static destinations and local assets under the GitHub Pages project path',()=>{
 for(const file of ['index.html','dashboard.html']){
  const html=read(file);
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   const value=match[1].replace(/&amp;/g,'&');
   if(/^(?:https?:|#)/.test(value))continue;
   const url=new URL(value,base+file);
   assert.ok(url.pathname.startsWith('/iccarankings/'),value);
   assert.ok(fs.existsSync(path.join(root,decodeURIComponent(url.pathname.slice('/iccarankings/'.length)))),value);
  }
 }
 const home=read('index.html');
 assert.ok(home.includes('dashboard.html?view=overview&amp;year=2025'));
 assert.ok(!home.includes('src="assets/app.js"'));
 assert.ok(read('dashboard.html').includes('src="assets/app.js"'));
 const hero=fs.readFileSync(path.join(root,'assets/thailand-home-hero-v2.png'));
 assert.ok(home.includes('width="'+hero.readUInt32BE(16)+'" height="'+hero.readUInt32BE(20)+'"'));
});

// Minimal collaborators for URL/language logic; no browser or layout automation.
function home(query='',hash=''){
 const make=attributes=>({attributes:{...attributes},dataset:{lang:attributes['data-lang']},getAttribute(name){return this.attributes[name];},setAttribute(name,value){this.attributes[name]=value;},addEventListener(name,handler){this[name]=handler;}});
 const text=make({'data-th':'เข้าสู่แดชบอร์ด','data-en':'Explore the dashboard'});
 const alt=make({'data-th-alt':'ภาพประกอบ','data-en-alt':'Illustration'});
 const buttons=['th','en'].map(lang=>make({'data-lang':lang}));
 const links=['dashboard.html?view=overview&year=2025','dashboard.html?view=policy'].map(href=>make({href}));
 const selectors={'[data-th][data-en]':[text],'[data-th-alt][data-en-alt]':[alt],'[data-lang]':buttons,'[data-dashboard-link]':links};
 const document={documentElement:{lang:'th'},querySelectorAll(selector){assert.ok(selectors[selector],selector);return selectors[selector];}};
 const ctx={document,URLSearchParams,location:{search:query,hash,pathname:'/iccarankings/',replace(url){ctx.redirect=url;}},history:{replaceState(a,b,url){ctx.saved=url;}}};
 vm.runInNewContext(read('assets/home.js'),ctx);
 return {ctx,text,alt,buttons,links};
}

test('legacy dashboard links retain their filters, language and hash',()=>{
 for(const view of ['overview','compare','policy','data','sources']){
  const query='?view='+view+'&year=2024&lang=en&region=north&q=Chiang%20Mai&start=2016&end=2025';
  assert.equal(home(query,'#main').ctx.redirect,'dashboard.html'+query+'#main');
 }
 assert.equal(home('?view=https://example.test').ctx.redirect,undefined);
});

test('Home language switches visible copy and preserves dashboard destinations and selected year',()=>{
 const h=home('?lang=en','#main');
 assert.equal(h.ctx.document.documentElement.lang,'en');
 assert.equal(h.text.textContent,'Explore the dashboard');
 assert.equal(h.alt.alt,'Illustration');
 assert.equal(h.buttons[1].attributes['aria-pressed'],'true');
 assert.equal(h.links[0].attributes.href,'dashboard.html?view=overview&year=2025&lang=en');
 h.buttons[0].click();
 assert.equal(h.text.textContent,'เข้าสู่แดชบอร์ด');
 assert.equal(h.links[1].attributes.href,'dashboard.html?view=policy&lang=th');
 assert.equal(h.ctx.saved,'/iccarankings/#main');
});
