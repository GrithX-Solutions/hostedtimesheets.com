(()=>{
"use strict";
const root=document.querySelector("[data-work-hours]");
if(!root)return;
const byId=id=>document.getElementById(id);
const start=byId("wh-start"),end=byId("wh-end"),breakInput=byId("wh-break"),daysInput=byId("wh-days"),rateInput=byId("wh-rate"),currencyInput=byId("wh-currency"),status=byId("wh-status"),formula=byId("wh-formula"),copyButton=byId("wh-copy");
const errors={start:byId("wh-start-error"),end:byId("wh-end-error"),break:byId("wh-break-error"),days:byId("wh-days-error"),rate:byId("wh-rate-error")};
const outputIds=["wh-gross","wh-daily-time","wh-daily","wh-total-time","wh-weekly","wh-minutes","wh-pay"];
let copyText="";
const setError=(input,errorEl,message)=>{const invalid=Boolean(message);input.setAttribute("aria-invalid",String(invalid));errorEl.hidden=!invalid;errorEl.textContent=message||""};
const parseTime=(input,label)=>{const raw=input.value.trim();if(raw==="")return{valid:false,message:`Enter ${label}.`};const match=raw.match(/^(\d{2}):(\d{2})$/);if(!match)return{valid:false,message:`${label[0].toUpperCase()+label.slice(1)} must be a valid time.`};const hours=Number(match[1]),minutes=Number(match[2]);if(hours>23||minutes>59)return{valid:false,message:`${label[0].toUpperCase()+label.slice(1)} must be a valid time.`};return{valid:true,value:hours*60+minutes}};
const parseWhole=(input,label,{min=0,max=null}={})=>{const raw=input.value.trim();if(raw==="")return{valid:false,message:`Enter ${label}.`};const value=Number(raw);if(!Number.isFinite(value)||!Number.isInteger(value)){const range=max===null?`${min} or greater`:`${min} to ${max}`;return{valid:false,message:`${label[0].toUpperCase()+label.slice(1)} must be a whole number from ${range}.`}}if(value<min||max!==null&&value>max){if(max===null)return{valid:false,message:`${label[0].toUpperCase()+label.slice(1)} must be ${min} or greater.`};return{valid:false,message:`${label[0].toUpperCase()+label.slice(1)} must be a whole number from ${min} to ${max}.`}}return{valid:true,value}};
const parseRate=()=>{const raw=rateInput.value.trim();if(raw==="")return{valid:true,value:null};const value=Number(raw);if(!Number.isFinite(value)||value<0)return{valid:false,message:"Hourly rate must be zero or greater."};return{valid:true,value}};
const duration=minutes=>`${Math.floor(minutes/60)}h ${minutes%60}m`;
const decimal=minutes=>(minutes/60).toFixed(2);
const money=value=>{const supported=new Set(["USD","GBP","EUR","CAD","AUD"]);const currency=supported.has(currencyInput.value)?currencyInput.value:"USD";return new Intl.NumberFormat("en-US",{style:"currency",currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(value)};
const clearOutputs=()=>{outputIds.forEach(id=>byId(id).textContent="—");copyText=""};
const calculate=()=>{
  const s=parseTime(start,"start time"),e=parseTime(end,"end time"),br=parseWhole(breakInput,"unpaid break",{min:0}),days=parseWhole(daysInput,"workdays",{min:1,max:31}),rate=parseRate();
  setError(start,errors.start,s.valid?"":s.message);setError(end,errors.end,e.valid?"":e.message);setError(breakInput,errors.break,br.valid?"":br.message);setError(daysInput,errors.days,days.valid?"":days.message);setError(rateInput,errors.rate,rate.valid?"":rate.message);
  if(!s.valid||!e.valid||!br.valid||!days.valid){clearOutputs();status.textContent="Fix the highlighted time, break or workday fields to calculate.";formula.textContent="Enter valid required inputs to see the work-hours calculation.";return}
  let gross=e.value-s.value;if(gross<0)gross+=1440;
  const net=Math.max(0,gross-br.value),total=net*days.value;
  byId("wh-gross").textContent=duration(gross);byId("wh-daily-time").textContent=duration(net);byId("wh-daily").textContent=decimal(net);byId("wh-total-time").textContent=duration(total);byId("wh-weekly").textContent=decimal(total);byId("wh-minutes").textContent=total.toLocaleString("en-US");
  let payText="—";if(rate.valid&&rate.value!==null)payText=money(total/60*rate.value);byId("wh-pay").textContent=payText;
  const overnight=e.value<s.value?"; overnight shift":"";
  formula.textContent=`${duration(gross)} gross − ${br.value}m break = ${duration(net)} per day; × ${days.value} workday${days.value===1?"":"s"} = ${duration(total)} (${decimal(total)} decimal hours)${overnight}.`;
  status.textContent=rate.valid?(rate.value===null?"Work hours calculated. Add an hourly rate only if you want a gross-pay estimate.":"Work hours and gross-pay estimate calculated."):"Work hours calculated. Fix the hourly rate to estimate pay.";
  copyText=`${duration(net)} per day (${decimal(net)} decimal hours); ${days.value} workday${days.value===1?"":"s"} = ${duration(total)} (${decimal(total)} decimal hours, ${total.toLocaleString("en-US")} minutes)${payText==="—"?"":`; estimated gross pay ${payText}`}.`;
};
root.addEventListener("input",calculate);root.addEventListener("change",calculate);
byId("wh-example").addEventListener("click",()=>{start.value="09:00";end.value="17:30";breakInput.value="30";daysInput.value="5";rateInput.value="25";currencyInput.value="USD";calculate()});
byId("wh-overnight").addEventListener("click",()=>{start.value="22:00";end.value="06:00";breakInput.value="30";daysInput.value="1";rateInput.value="";currencyInput.value="USD";calculate()});
byId("wh-reset").addEventListener("click",()=>{start.value="09:00";end.value="17:30";breakInput.value="30";daysInput.value="5";rateInput.value="";currencyInput.value="USD";calculate()});
copyButton.addEventListener("click",async()=>{if(!copyText)return;const original=copyButton.textContent;try{await navigator.clipboard.writeText(copyText);copyButton.textContent="Copied"}catch{copyButton.textContent="Copy failed"}setTimeout(()=>{copyButton.textContent=original},1200)});
calculate();
})();