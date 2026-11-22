// Local parent profiles. No credentials or personal data sent to a server.
const createProfiles = storage => {
 const key='twentyseed.profiles.v1';
 const read=()=>{try{const p=JSON.parse(storage.getItem(key)||'[]');return Array.isArray(p)?p:[]}catch{return []}};
 const save=profiles=>storage.setItem(key,JSON.stringify(profiles));
 const clean=p=>{if(!p||typeof p.name!=='string'||!p.name.trim()||!Array.isArray(p.kinds)||!p.kinds.length)throw Error('Name and worksheet categories required');return {name:p.name.trim().slice(0,60),kinds:[...new Set(p.kinds)],n:[6,12,18,24,36,48].includes(p.n)?p.n:12,max:[10,12,50].includes(p.max)?p.max:12,op:['+','−','×','÷'].includes(p.op)?p.op:'+',words:Array.isArray(p.words)?p.words.filter(w=>typeof w==='string').slice(0,18):[]}};
 return {list:read,add(p){const list=read();list.push(clean(p));save(list);return list},replace(i,p){const list=read();if(!Number.isInteger(i)||i<0||i>=list.length)throw Error('Invalid student');list[i]=clean(p);save(list);return list},remove(i){const list=read();if(!Number.isInteger(i)||i<0||i>=list.length)throw Error('Invalid student');list.splice(i,1);save(list);return list}};
};
if(typeof module!=='undefined')module.exports=createProfiles;
