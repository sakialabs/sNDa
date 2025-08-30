const fs = require('fs');
const path = require('path');
const enPath = path.join(__dirname, '..', 'messages', 'en.json');
const arPath = path.join(__dirname, '..', 'messages', 'ar.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
function flatten(obj, prefix=''){
  return Object.keys(obj||{}).reduce((acc,k)=>{
    const val = obj[k];
    const key = prefix? `${prefix}.${k}`:k;
    if(typeof val === 'object' && val !== null && !Array.isArray(val)){
      Object.assign(acc, flatten(val, key));
    } else {
      acc[key] = val;
    }
    return acc;
  }, {});
}
const fe = flatten(en);
const fa = flatten(ar);
const missing = Object.keys(fe).filter(k => !fa[k]);
if(missing.length === 0){
  console.log('No missing keys in ar.json');
  process.exit(0);
}
console.log('Missing keys in ar.json:');
missing.forEach(k => {
  console.log(k + ' => ' + JSON.stringify(fe[k]));
});

// also output a JSON object of missing keys with English values to help translate
const missingObj = missing.reduce((acc,k)=>{ acc[k]=fe[k]; return acc; },{});
fs.writeFileSync(path.join(__dirname, 'missing_ar_keys.json'), JSON.stringify(missingObj, null, 2), 'utf8');
console.log('\nWrote frontend/scripts/missing_ar_keys.json with the English strings.');
