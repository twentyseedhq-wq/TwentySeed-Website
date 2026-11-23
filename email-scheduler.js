/* Local-only email scheduling preview. Never sends mail. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TwentySeedEmailScheduler=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const DAY=86400000;
function date(v){const d=new Date(v);if(!Number.isFinite(d.getTime()))throw Error('Invalid date');return d;}
function email(v){if(typeof v!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))throw Error('Invalid email');return v.trim();}
function schedule(input){
if(!input||typeof input!=='object')throw Error('Schedule required');
const recipient=email(input.recipient),student=String(input.student||'Student').trim().slice(0,80),start=date(input.start),hour=input.hour===undefined?8:Number(input.hour),minute=input.minute===undefined?0:Number(input.minute),count=input.count===undefined?4:Number(input.count);
if(!Number.isInteger(hour)||hour<0||hour>23||!Number.isInteger(minute)||minute<0||minute>59||!Number.isInteger(count)||count<1||count>52)throw Error('Invalid schedule options');
const first=new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth(),start.getUTCDate(),hour,minute));
const out=[];for(let i=0;i<count;i++){const at=new Date(first.getTime()+i*7*DAY);out.push({id:recipient+'|'+at.toISOString(),recipient,scheduledAt:at.toISOString(),subject:'TwentySeed weekly learning packet — '+student,body:'Your weekly learning packet for '+student+' is ready to prepare. Open TwentySeed Learning to generate and print it.',status:'preview-only'});}return out;
}
function due(items,now){const timestamp=date(now).getTime();return items.filter(x=>x.status==='preview-only'&&date(x.scheduledAt).getTime()<=timestamp);}
function toCsv(items){const esc=x=>'"'+String(x).replace(/"/g,'""')+'"';return ['recipient,scheduledAt,subject,body,status',...items.map(x=>[x.recipient,x.scheduledAt,x.subject,x.body,x.status].map(esc).join(','))].join('\r\n');}
return {schedule,due,toCsv};
});