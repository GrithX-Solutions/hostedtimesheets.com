(()=>{"use strict";
const root=document.querySelector("[data-military-time]");if(!root)return;
const q=id=>document.getElementById(id),pad=n=>String(n).padStart(2,"0");
const parse=raw=>{
  const original=(raw||"").trim();
  if(!original)return null;
  const lower=original.toLowerCase();
  if(lower==="midnight")return{h:0,m:0,source:"word"};
  if(lower==="noon")return{h:12,m:0,source:"word"};
  const compact=original.toUpperCase().replace(/\./g,"").replace(/\s+/g," ").trim();
  let match=compact.match(/^(\d{1,2})(?::?([0-5]\d))?\s*(AM|PM)$/);
  if(match){
    const hour=Number(match[1]),minute=Number(match[2]||0),period=match[3];
    if(hour<1||hour>12)return null;
    return{h:(hour%12)+(period==="PM"?12:0),m:minute,source:"12-hour"};
  }
  match=compact.match(/^(\d{1,2}):([0-5]\d)$/);
  if(match){
    const hour=Number(match[1]),minute=Number(match[2]);
    if(hour>23)return null;
    return{h:hour,m:minute,source:"24-hour"};
  }
  const digits=compact.replace(/\s+/g,"");
  if(!/^\d{1,4}$/.test(digits))return null;
  let hour,minute;
  if(digits.length<=2){hour=Number(digits);minute=0}
  else if(digits.length===3){hour=Number(digits.slice(0,1));minute=Number(digits.slice(1))}
  else{hour=Number(digits.slice(0,2));minute=Number(digits.slice(2))}
  if(hour>23||minute>59)return null;
  return{h:hour,m:minute,source:"military"};
};
const standard=(h,m)=>{const period=h>=12?"PM":"AM",hh=h%12||12;return `${hh}:${pad(m)} ${period}`};
const military=(h,m)=>`${pad(h)}${pad(m)}`;
const clock24=(h,m)=>`${pad(h)}:${pad(m)}`;
const note=(h,m)=>h===0&&m===0?"Midnight":h===12&&m===0?"Noon":h<12?"Morning":h<17?"Afternoon":h<21?"Evening":"Night";
function render(){
  const value=parse(q("mt-input").value);
  if(!value){
    q("mt-standard").textContent="—";q("mt-military").textContent="—";q("mt-clock24").textContent="—";q("mt-label").textContent="Enter a valid time";q("mt-formula").textContent="Accepted examples: 1730, 17:30, 5:30 PM, noon, midnight.";return;
  }
  q("mt-standard").textContent=standard(value.h,value.m);
  q("mt-military").textContent=military(value.h,value.m);
  q("mt-clock24").textContent=clock24(value.h,value.m);
  q("mt-label").textContent=note(value.h,value.m);
  q("mt-formula").textContent=`${q("mt-input").value.trim()} = ${military(value.h,value.m)} military = ${clock24(value.h,value.m)} 24-hour = ${standard(value.h,value.m)}`;
}
q("mt-input").addEventListener("input",render);
root.querySelectorAll("[data-mt-preset]").forEach(btn=>btn.addEventListener("click",()=>{q("mt-input").value=btn.dataset.mtPreset;render()}));
q("mt-now").addEventListener("click",()=>{const d=new Date;q("mt-input").value=`${pad(d.getHours())}:${pad(d.getMinutes())}`;render()});
q("mt-reset").addEventListener("click",()=>{q("mt-input").value="1730";render()});
q("mt-copy-military").addEventListener("click",async()=>{if(q("mt-military").textContent==="—")return;try{await navigator.clipboard.writeText(q("mt-military").textContent);q("mt-copy-military").textContent="Copied";setTimeout(()=>q("mt-copy-military").textContent="Copy military",1200)}catch{}});
q("mt-copy-standard").addEventListener("click",async()=>{if(q("mt-standard").textContent==="—")return;try{await navigator.clipboard.writeText(q("mt-standard").textContent);q("mt-copy-standard").textContent="Copied";setTimeout(()=>q("mt-copy-standard").textContent="Copy standard",1200)}catch{}});
q("mt-print").addEventListener("click",()=>window.print());
render();
})();