(()=>{"use strict";
const root=document.querySelector("[data-time-duration]");if(!root)return;
const q=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,"0");
const outputIds=["td-duration","td-decimal","td-days","td-minutes","td-seconds","td-net","td-net-decimal"];
const fieldErrors=[
  ["td-start-date","td-start-date-error"],
  ["td-start-time","td-start-time-error"],
  ["td-end-date","td-end-date-error"],
  ["td-end-time","td-end-time-error"],
  ["td-break","td-break-error"]
];

const parseTime=value=>{
  const raw=(value||"").trim();
  const match=/^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(raw);
  if(!match)return null;
  const h=Number(match[1]),m=Number(match[2]),s=Number(match[3]||0);
  if(h>23||m>59||s>59)return null;
  return h*3600+m*60+s;
};

const parseDate=value=>{
  const raw=(value||"").trim();
  const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if(!match)return null;
  const y=Number(match[1]),m=Number(match[2]),d=Number(match[3]);
  const ms=Date.UTC(y,m-1,d);
  const check=new Date(ms);
  if(check.getUTCFullYear()!==y||check.getUTCMonth()!==m-1||check.getUTCDate()!==d)return null;
  return ms/86400000;
};

const parseBreak=value=>{
  const raw=(value||"").trim();
  if(raw==="")return 0;
  const n=Number(raw);
  return Number.isSafeInteger(n)&&n>=0?n:null;
};

const localDate=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const localTime=d=>`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

const fmt=seconds=>{
  const s=Math.max(0,Math.round(seconds));
  const d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60),n=s%60;
  return(d?d+"d ":"")+h+"h "+m+"m "+n+"s";
};
const decHours=seconds=>{
  let value=(seconds/3600).toFixed(4);
  while(value.endsWith("0"))value=value.slice(0,-1);
  if(value.endsWith("."))value=value.slice(0,-1);
  if(!value.includes("."))return value+".00";
  const parts=value.split(".");
  return parts[0]+"."+parts[1].padEnd(2,"0");
};
const totalMinutes=seconds=>{
  const value=seconds/60;
  return Number.isInteger(value)?value.toLocaleString():value.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
};
const totalDays=seconds=>(seconds/86400).toFixed(4);

function clearErrors(){
  for(const [fieldId,errorId] of fieldErrors){
    const field=q(fieldId),error=q(errorId);
    field?.setAttribute("aria-invalid","false");
    if(error){error.hidden=true;error.textContent="";}
  }
}
function setError(fieldId,errorId,message){
  q(fieldId)?.setAttribute("aria-invalid","true");
  const error=q(errorId);
  if(error){error.textContent=message;error.hidden=false;}
}
function clearResults(message){
  outputIds.forEach(id=>q(id).textContent="—");
  q("td-formula").textContent="Enter valid values to calculate the duration.";
  q("td-status").textContent=message;
}
function syncMode(initializeDates=false){
  const dateMode=q("td-mode").value==="datetime";
  document.querySelectorAll("[data-td-date]").forEach(el=>el.hidden=!dateMode);
  if(dateMode&&initializeDates){
    const today=localDate(new Date());
    if(!q("td-start-date").value)q("td-start-date").value=today;
    if(!q("td-end-date").value)q("td-end-date").value=today;
  }
}
function calc(){
  syncMode(false);
  clearErrors();
  const mode=q("td-mode").value;
  const startSeconds=parseTime(q("td-start-time").value);
  const endSeconds=parseTime(q("td-end-time").value);
  const breakMinutes=parseBreak(q("td-break").value);
  let invalid=false;

  if(startSeconds===null){setError("td-start-time","td-start-time-error","Enter a valid start time.");invalid=true;}
  if(endSeconds===null){setError("td-end-time","td-end-time-error","Enter a valid end time.");invalid=true;}
  if(breakMinutes===null){setError("td-break","td-break-error","Break minutes must be a whole number of 0 or more.");invalid=true;}

  let startDay=null,endDay=null;
  if(mode==="datetime"){
    startDay=parseDate(q("td-start-date").value);
    endDay=parseDate(q("td-end-date").value);
    if(startDay===null){setError("td-start-date","td-start-date-error","Enter a valid start date.");invalid=true;}
    if(endDay===null){setError("td-end-date","td-end-date-error","Enter a valid end date.");invalid=true;}
  }

  if(invalid){
    clearResults("Fix the highlighted fields to calculate a duration.");
    return;
  }

  let gross,status;
  if(mode==="datetime"){
    gross=(endDay-startDay)*86400+(endSeconds-startSeconds);
    if(gross<0){
      setError("td-end-date","td-end-date-error","End date and time must not be earlier than the start.");
      q("td-end-time").setAttribute("aria-invalid","true");
      clearResults("End date and time must not be earlier than the start.");
      return;
    }
    status="Date-and-time calculation; no time-zone conversion is applied.";
  }else{
    gross=endSeconds-startSeconds;
    if(gross<0){
      gross+=86400;
      status="End time is earlier than start time, so the end is treated as the next day.";
    }else if(gross===0){
      status="Start and end are the same, so the duration is zero.";
    }else{
      status="Time-only calculation.";
    }
  }

  const breakSeconds=breakMinutes*60;
  const net=Math.max(0,gross-breakSeconds);
  q("td-duration").textContent=fmt(gross);
  q("td-decimal").textContent=decHours(gross);
  q("td-days").textContent=totalDays(gross);
  q("td-minutes").textContent=totalMinutes(gross);
  q("td-seconds").textContent=Math.round(gross).toLocaleString();
  q("td-net").textContent=fmt(net);
  q("td-net-decimal").textContent=decHours(net);
  q("td-formula").textContent="Duration "+fmt(gross)+(breakSeconds?" − "+breakMinutes+"m break = "+fmt(net):"");
  q("td-status").textContent=breakSeconds>gross?status+" Break exceeds the gross duration, so net duration is floored at zero.":status;
}

function loadOvernight(){
  q("td-mode").value="time";
  q("td-start-date").value="";
  q("td-end-date").value="";
  q("td-start-time").value="22:00:00";
  q("td-end-time").value="06:00:00";
  q("td-break").value="30";
  syncMode(false);
  calc();
}
function loadMultiday(){
  q("td-mode").value="datetime";
  q("td-start-date").value="2026-10-04";
  q("td-end-date").value="2026-10-06";
  q("td-start-time").value="09:15:00";
  q("td-end-time").value="12:45:00";
  q("td-break").value="0";
  syncMode(false);
  calc();
}
function reset(){
  q("td-mode").value="time";
  q("td-start-date").value="";
  q("td-end-date").value="";
  q("td-start-time").value="09:00:00";
  q("td-end-time").value="17:30:00";
  q("td-break").value="0";
  syncMode(false);
  calc();
}
async function copyResult(){
  if(q("td-duration").textContent==="—"){
    q("td-status").textContent="Enter valid values before copying the result.";
    return;
  }
  const lines=[
    "Time duration: "+q("td-duration").textContent,
    "Decimal hours: "+q("td-decimal").textContent,
    "Total days: "+q("td-days").textContent,
    "Total minutes: "+q("td-minutes").textContent,
    "Total seconds: "+q("td-seconds").textContent,
    "After break: "+q("td-net").textContent,
    "Net decimal hours: "+q("td-net-decimal").textContent
  ];
  try{
    await navigator.clipboard.writeText(lines.join("\n"));
    const button=q("td-copy"),original=button.textContent;
    button.textContent="Copied";
    window.setTimeout(()=>{button.textContent=original;},1200);
  }catch{
    q("td-status").textContent="Copy was unavailable in this browser. Your calculated values are still shown above.";
  }
}

["td-start-date","td-start-time","td-end-date","td-end-time","td-break"].forEach(id=>{
  q(id).addEventListener("input",calc);
  q(id).addEventListener("change",calc);
});
q("td-mode").addEventListener("change",()=>{syncMode(true);calc();});
q("td-start-now").addEventListener("click",()=>{
  const d=new Date();
  q("td-start-time").value=localTime(d);
  if(q("td-mode").value==="datetime")q("td-start-date").value=localDate(d);
  calc();
});
q("td-end-now").addEventListener("click",()=>{
  const d=new Date();
  q("td-end-time").value=localTime(d);
  if(q("td-mode").value==="datetime")q("td-end-date").value=localDate(d);
  calc();
});
q("td-swap").addEventListener("click",()=>{
  [q("td-start-time").value,q("td-end-time").value]=[q("td-end-time").value,q("td-start-time").value];
  [q("td-start-date").value,q("td-end-date").value]=[q("td-end-date").value,q("td-start-date").value];
  calc();
});
q("td-example-overnight").addEventListener("click",loadOvernight);
q("td-example-multiday").addEventListener("click",loadMultiday);
q("td-reset").addEventListener("click",reset);
q("td-copy").addEventListener("click",copyResult);

syncMode(false);
calc();
})();