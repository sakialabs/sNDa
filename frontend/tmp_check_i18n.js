const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(),'src');
function walk(dir){
  let res=[];
  for(const f of fs.readdirSync(dir)){
    const fp = path.join(dir,f);
    if(fs.statSync(fp).isDirectory()) res = res.concat(walk(fp));
    else if(/\.tsx?$/.test(f)) res.push(fp);
  }
  return res;
}
const files = walk(root);
const keySet = new Set();
const re = /t\(\s*\"([^\"]+)\"\s*\)|t\.rich\(\s*\"([^\"]+)\"\s*\)/g;
for(const file of files){
  const s = fs.readFileSync(file,'utf8');
  let m;
  while((m=re.exec(s))){
    const k = m[1]||m[2];
    if(k) keySet.add(k);
  }
}
const keys = Array.from(keySet).sort();
const enPath = path.join(process.cwd(),'messages','en.json');
const arPath = path.join(process.cwd(),'messages','ar.json');
function loadJSON(p){ try{ return JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){ console.error('Failed to parse',p,e.message); process.exit(1);} }
const en = loadJSON(enPath);
const ar = loadJSON(arPath);
function hasKey(obj, parts){ let cur = obj; for(const p of parts){ if(cur && Object.prototype.hasOwnProperty.call(cur,p)) cur = cur[p]; else return false; } return typeof cur === 'string' || typeof cur === 'object'; }
const missingInEn = [];
const missingInAr = [];
for(const k of keys){ const parts=k.split('.'); if(!hasKey(en,parts)) missingInEn.push(k); if(!hasKey(ar,parts)) missingInAr.push(k); }
console.log(JSON.stringify({totalKeys: keys.length, missingInEn, missingInAr}, null, 2));
