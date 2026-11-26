/* Grade-aware math curriculum, independent of UI. */
(function(root){
const limits=[5,10,20,100,1000,10000];
function math(grade,kind,n,random=Math.random){
 if(!Number.isInteger(grade)||grade<0||grade>5||!Number.isInteger(n)||n<1||n>48)throw Error("Invalid grade or count");
 const pick=m=>Math.floor(random()*m)+1, rows=[];
 for(let i=0;i<n;i++){
 let a=pick(limits[grade]),b=pick(limits[grade]),q,answer;
 if(kind==="Arithmetic"||kind==="Word problems"){
 const op=grade<2?pick(2):grade===2?pick(2):pick(4);
 if(op===2&&a<b)[a,b]=[b,a];
 if(op>=3){a=pick(grade===3?10:12);b=pick(12);}
 if(op===4)a*=b;
 answer=[a+b,a-b,a*b,a/b][op-1];
 q=kind==="Arithmetic"?a+" "+["+","−","×","÷"][op-1]+" "+b+" = ____":[
 "There are "+a+" apples. Add "+b+" apples. How many now?",
 "There are "+a+" apples. Give away "+b+". How many remain?",
 "There are "+a+" bags with "+b+" apples each. How many apples?",
 "Share "+a+" apples equally among "+b+" children. How many per child?"
 ][op-1];
 }else if(kind==="Geometry"){
 if(grade<2){const shapes=[["triangle",3],["square",4],["rectangle",4],["pentagon",5],["hexagon",6]];const s=shapes[pick(grade===0?3:5)-1];q="How many straight sides does a "+s[0]+" have?";answer=s[1];}
 else {a=pick(12);b=pick(12);const area=grade>=3&&pick(2)===1;q="A rectangle is "+a+" units long and "+b+" units wide. Find its "+(area?"area.":"perimeter.");answer=area?a*b:2*(a+b);}
 }else if(kind==="Telling time"){
 a=pick(12);b=grade===0?0:grade===1?(pick(2)-1)*30:grade===2?(pick(12)-1)*5:pick(60)-1;q=b+" minutes after "+a+" o’clock";answer=a+":"+String(b).padStart(2,"0");
 }else if(kind==="Money"){
 a=pick(grade<2?5:12);b=pick(10);const coin=grade===0?1:grade===1?5:25;q=a+" "+(coin===1?"pennies":coin===5?"nickels":"quarters")+(grade>=2?" and "+b+" dimes":"")+". Total cents?";answer=a*coin+(grade>=2?10*b:0);
 }else if(kind==="Fractions"){
 const d=grade<2?2:grade===2?4:pick(10)+2;a=pick(d-1);b=pick(d-1);
 if(grade<3){q="A shape has "+d+" equal parts. "+a+" are shaded. What fraction is shaded?";answer=a+"/"+d;}
 else {const gcd=(x,y)=>y?gcd(y,x%y):x;const s=a+b,g=gcd(s,d);q=a+"/"+d+" + "+b+"/"+d+" = ____ (simplify)";answer=d/g===1?String(s/g):s/g+"/"+d/g;}
 }else throw Error("Unknown math worksheet");
 rows.push({q,a:String(answer)});
 }
 return {instructions:"Solve each problem. Show your work when needed.",items:rows};
}
const api={math,kinds:["Arithmetic","Word problems","Geometry","Telling time","Money","Fractions"]};
if(typeof module!=="undefined")module.exports=api;else root.TwentySeedCurriculum=api;
})(typeof globalThis!=="undefined"?globalThis:this);
