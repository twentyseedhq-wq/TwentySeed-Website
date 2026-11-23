/* Sandbox-only subscription simulator. No payments, API calls, or network access. */
(function(root){
'use strict';
const PLANS=Object.freeze({free:{cents:0,interval:'month'},family:{cents:500,interval:'month'}});
const validDate=v=>{const d=new Date(v);if(!Number.isFinite(d.getTime()))throw Error('Invalid date');return d};
const addMonth=d=>{const x=new Date(d),day=x.getUTCDate();x.setUTCDate(1);x.setUTCMonth(x.getUTCMonth()+1);const last=new Date(Date.UTC(x.getUTCFullYear(),x.getUTCMonth()+1,0)).getUTCDate();x.setUTCDate(Math.min(day,last));return x};
function createSandboxBilling(storage,clock=()=>new Date()){
 if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function')throw Error('Storage required');
 const key='twentyseed.billing.sandbox.v1';
 const load=()=>{try{const v=JSON.parse(storage.getItem(key)||'null');return v&&v.sandbox===true&&PLANS[v.plan]&&['active','canceled'].includes(v.status)?v:null}catch{return null}};
 const persist=v=>{storage.setItem(key,JSON.stringify(v));return v};
 const current=()=>load()||{sandbox:true,plan:'free',status:'active',startedAt:null,renewsAt:null,canceledAt:null};
 return {
  plans:PLANS,
  current,
  subscribe(plan){if(!PLANS[plan])throw Error('Unknown plan');const now=validDate(clock());return persist({sandbox:true,plan,status:'active',startedAt:now.toISOString(),renewsAt:plan==='free'?null:addMonth(now).toISOString(),canceledAt:null})},
  cancel(){const v=current();if(v.plan==='free')return v;return persist({...v,status:'canceled',canceledAt:validDate(clock()).toISOString()})},
  access(){const v=current();return v.plan==='family'&&(v.status==='active'||(v.status==='canceled'&&v.renewsAt&&validDate(clock())<new Date(v.renewsAt)))},
  reset(){storage.removeItem(key)}
 };
}
root.createSandboxBilling=createSandboxBilling;
if(typeof module!=='undefined')module.exports=createSandboxBilling;
})(typeof globalThis!=='undefined'?globalThis:this);
