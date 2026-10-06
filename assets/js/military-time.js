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

const ones=["zero","one","two","three","four","five","six","seven","eight","nine"];
const teens=["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const tens=["","","twenty","thirty","forty","fifty"];
const numberWords=n=>{
  if(n<10)return ones[n];
  if(n<20)return teens[n-10];
  const t=Math.floor(n/10),u=n%10;
  return u?`${tens[t]}-${ones[u]}`:tens[t];
};
const spoken=(h,m)=>{
  const hour=h<10?`zero ${numberWords(h)}`:numberWords(h);
  const minute=m===0?"hundred":m<10?`zero ${numberWords(m)}`:numberWords(m);
  const value=`${hour} ${minute} hours`;
  return value.charAt(0).toUpperCase()+value.slice(1);
};

const validationMessage=raw=>{
  const value=(raw||"").trim();
  if(!value)return"Enter a time to convert.";
  if(value.replace(/\s+/g,"")==="2400")return"Use 0000 for midnight. This converter does not accept 2400.";
  return"Enter a valid time such as 1730, 17:30, 5:30 PM, noon, or midnight.";
};

function invalid(raw){
  q("mt-input").setAttribute("aria-invalid","true");
  q("mt-input-error").textContent=validationMessage(raw);
  q("mt-input-error").hidden=false;
  q("mt-standard").textContent="—";
  q("mt-military").textContent="—";
  q("mt-clock24").textContent="—";
  q("mt-label").textContent="—";
  q("mt-spoken").textContent="—";
  q("mt-formula").textContent="Accepted examples: 1730, 17:30, 5:30 PM, noon, midnight.";
  q("mt-status").textContent="Fix the time input to convert it.";
}

function render(){
  const raw=q("mt-input").value;
  const value=parse(raw);
  if(!value){invalid(raw);return;}
  q("mt-input").setAttribute("aria-invalid","false");
  q("mt-input-error").textContent="";
  q("mt-input-error").hidden=true;
  q("mt-standard").textContent=standard(value.h,value.m);
  q("mt-military").textContent=military(value.h,value.m);
  q("mt-clock24").textContent=clock24(value.h,value.m);
  q("mt-label").textContent=note(value.h,value.m);
  q("mt-spoken").textContent=spoken(value.h,value.m);
  q("mt-formula").textContent=`${raw.trim()} = ${military(value.h,value.m)} military = ${clock24(value.h,value.m)} 24-hour = ${standard(value.h,value.m)}`;
  q("mt-status").textContent="Valid time converted into military, standard and 24-hour formats.";
}

async function copyOutput(id,buttonId,defaultText){
  const value=q(id).textContent;
  if(value==="—"){
    q("mt-status").textContent="Enter a valid time before copying a result.";
    return;
  }
  try{
    await navigator.clipboard.writeText(value);
    q(buttonId).textContent="Copied";
    window.setTimeout(()=>{q(buttonId).textContent=defaultText;},1200);
  }catch{
    q("mt-status").textContent="Copy was unavailable in this browser. Your converted values are still shown above.";
  }
}

q("mt-input").addEventListener("input",render);
q("mt-input").addEventListener("change",render);
root.querySelectorAll("[data-mt-preset]").forEach(btn=>btn.addEventListener("click",()=>{q("mt-input").value=btn.dataset.mtPreset;render()}));
q("mt-now").addEventListener("click",()=>{const d=new Date;q("mt-input").value=`${pad(d.getHours())}:${pad(d.getMinutes())}`;render()});
q("mt-reset").addEventListener("click",()=>{q("mt-input").value="1730";render()});
q("mt-copy-military").addEventListener("click",()=>copyOutput("mt-military","mt-copy-military","Copy military"));
q("mt-copy-standard").addEventListener("click",()=>copyOutput("mt-standard","mt-copy-standard","Copy standard"));
q("mt-print").addEventListener("click",()=>window.print());
render();
})();