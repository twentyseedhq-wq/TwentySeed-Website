// Pure weekly packet planner; generator injected for testing.
const buildPacket = (students,days,generate)=>{if(!students.length||days<1||days>7||!Number.isInteger(days))throw Error("Invalid packet");return students.flatMap(s=>Array.from({length:days},(_,d)=>s.kinds.map(kind=>({student:s.name,day:d+1,kind,result:generate(kind,s)}))).flat())};
if(typeof module!=='undefined')module.exports=buildPacket;
