(()=>{"use strict";
const root=document.querySelector("[data-clock-out]");if(!root)return;
const $=s=>document.querySelector(s);
const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0));
const parseTime=v=>{const m=/^(\d{1,2}):(\d{2})$/.exec(v||"");if(!m)return null;const h=Number(m[1]),n=Number(m[2]);return h>=0&&h<24&&n>=0&&n<60?h*60+n:null};
const pad=n=>String(n).padStart(2,"0");
const format24=m=>`${pad(Math.floor(m/60)%24)}:${pad(m%60)}`;
const format12=m=>{const h24=Math.floor(m/60)%24,n=m%60,ampm=h24>=12?"PM":"AM",h=h24%12||12;return `${h}:${pad(n)} ${ampm}`};
const spanText=m=>{const d=Math.floor(m/1440),r=m%1440,h=Math.floor(r/60),n=r%60;return `${d?d+"d ":""}${h}h ${pad(n)}m`};
function calc(){
 const start=parseTime($("#co-start").value),hours=Math.floor(clamp($("#co-hours").value,0,72)),minutes=Math.floor(clamp($("#co-minutes").value,0,59)),breakMin=Math.floor(clamp($("#co-break").value,0,1440));
 if(start===null){$("#co-time-12").textContent="—";$("#co-time-24").textContent="—";$("#co-day").textContent="Enter a valid clock-in time";$("#co-paid").textContent="—";$("#co-span").textContent="—";$("#co-formula").textContent="Enter a valid clock-in time.";return}
 const paidMinutes=Math.round(hours*60+minutes),span=paidMinutes+breakMin,total=start+span,dayOffset=Math.floor(total/1440),clock=total%1440;
 $("#co-time-12").textContent=format12(clock);$("#co-time-24").textContent=format24(clock);
 $("#co-day").textContent=dayOffset===0?"Same day":dayOffset===1?"Next day":`${dayOffset} days later`;
 $("#co-paid").textContent=`${spanText(paidMinutes)} · ${(paidMinutes/60).toFixed(2)} h`;
 $("#co-span").textContent=spanText(span);
 $("#co-formula").textContent=`${format12(start)} + ${spanText(paidMinutes)} paid work + ${breakMin}m unpaid break = ${format12(clock)}${dayOffset?" · "+$("#co-day").textContent:""}`;
}
root.addEventListener("input",calc);root.addEventListener("change",calc);
root.querySelectorAll("[data-hours-preset]").forEach(b=>b.addEventListener("click",()=>{const v=Number(b.dataset.hoursPreset);$("#co-hours").value=String(Math.floor(v));$("#co-minutes").value=String(Math.round((v%1)*60));calc()}));
root.querySelectorAll("[data-break-preset]").forEach(b=>b.addEventListener("click",()=>{$("#co-break").value=b.dataset.breakPreset;calc()}));
$("#co-now").addEventListener("click",()=>{const d=new Date;$("#co-start").value=`${pad(d.getHours())}:${pad(d.getMinutes())}`;calc()});
$("#co-reset").addEventListener("click",()=>{$("#co-start").value="08:30";$("#co-hours").value="8";$("#co-minutes").value="0";$("#co-break").value="30";calc()});
$("#co-copy").addEventListener("click",async()=>{const t=`${$("#co-time-12").textContent} (${$("#co-time-24").textContent})${$("#co-day").textContent==="Same day"?"":" · "+$("#co-day").textContent}`;try{await navigator.clipboard.writeText(t);$("#co-copy").textContent="Copied";setTimeout(()=>$("#co-copy").textContent="Copy clock-out time",1200)}catch{}});
calc();
})();