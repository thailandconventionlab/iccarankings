(function(root){
 'use strict';
 const tier=n=>n>=10?'large':n>=2?'medium':'small';
 function cityRows(data,year,filters={}){
  return data.cities.filter(c=>c.n[year]!=null&&(!filters.region||c.region===filters.region)&&(!filters.tier||tier(c.n[year])===filters.tier)&&(!filters.query||`${c.th} ${c.en}`.toLowerCase().includes(filters.query.toLowerCase().trim()))).sort((a,b)=>b.n[year]-a.n[year]||a.en.localeCompare(b.en));
 }
 function delta(current,previous){return current==null||previous==null?null:{absolute:current-previous,percent:previous===0?null:(current-previous)/previous*100};}
 function provinceTotals(rows,year){const out={};rows.forEach(c=>out[c.province]=(out[c.province]||0)+c.n[year]);return out;}
 function scenario(base,target,years){if(!Number.isFinite(target)||target<base||!Number.isInteger(target)||!Number.isInteger(years)||years<1||years>10)throw new Error('Invalid scenario');return {target,additional:target-base,annualGrowth:(Math.pow(target/base,1/years)-1)*100};}
 function csv(rows){const quote=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return '\ufeff'+rows.map(r=>r.map(quote).join(',')).join('\r\n');}
 const api={tier,cityRows,delta,provinceTotals,scenario,csv};
 root.ICCAModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
