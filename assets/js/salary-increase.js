(()=>{
"use strict";
const root=document.querySelector("[data-salary-increase]");
if(!root)return;

const q=id=>document.getElementById(id);
const mode=q("si-mode");
const currency=q("si-currency");
const current=q("si-current");
const percent=q("si-percent");
const flat=q("si-flat");
const nextInput=q("si-new-input");
const hours=q("si-hours");
const weeks=q("si-weeks");
const calcStatus=q("si-status");
const scheduleStatus=q("si-schedule-status");
const formula=q("si-formula");

const errors={
  current:q("si-current-error"),
  percent:q("si-percent-error"),
  flat:q("si-flat-error"),
  next:q("si-new-error"),
  hours:q("si-hours-error"),
  weeks:q("si-weeks-error")
};

const outputIds=[
  "si-current-annual","si-new","si-annual-change","si-change",
  "si-current-monthly","si-new-monthly","si-monthly-change",
  "si-current-biweekly","si-new-biweekly","si-biweekly-change",
  "si-current-weekly","si-new-weekly","si-weekly-change",
  "si-old-hourly","si-new-hourly","si-hourly-change","si-annual-hours"
];

const money=(value,{signed=false}={})=>{
  const c=currency.value||"USD";
  try{
    return new Intl.NumberFormat("en-US",{
      style:"currency",
      currency:c,
      minimumFractionDigits:2,
      maximumFractionDigits:2,
      signDisplay:signed?"exceptZero":"auto"
    }).format(value);
  }catch{
    const abs=Math.abs(value).toFixed(2);
    const sign=signed&&value>0?"+":value<0?"−":"";
    return sign+abs;
  }
};

const percentText=(value,{signed=false}={})=>{
  if(value===null)return "N/A";
  const abs=Math.abs(value);
  const places=Math.abs(abs-Number(abs.toFixed(2)))<1e-9?2:4;
  const base=abs.toFixed(places);
  if(value<0)return "−"+base+"%";
  if(signed&&value>0)return "+"+base+"%";
  return base+"%";
};

const setError=(input,errorEl,message)=>{
  const invalid=Boolean(message);
  input.setAttribute("aria-invalid",String(invalid));
  errorEl.hidden=!invalid;
  errorEl.textContent=message||"";
};

const parseRequiredNumber=(input,label,{min=0,integer=false,max=null}={})=>{
  const raw=input.value.trim();
  if(raw==="")return {valid:false,message:`Enter ${label}.`};
  const value=Number(raw);
  if(!Number.isFinite(value))return {valid:false,message:`${label[0].toUpperCase()+label.slice(1)} must be a valid number.`};
  if(value<min)return {valid:false,message:min===0?`${label[0].toUpperCase()+label.slice(1)} must be zero or greater.`:`${label[0].toUpperCase()+label.slice(1)} must be at least ${min}.`};
  if(integer&&!Number.isInteger(value))return {valid:false,message:`${label[0].toUpperCase()+label.slice(1)} must be a whole number from ${min} to ${max}.`};
  if(max!==null&&value>max)return {valid:false,message:`${label[0].toUpperCase()+label.slice(1)} must be a whole number from ${min} to ${max}.`};
  return {valid:true,value};
};

const clearSalaryOutputs=()=>{
  outputIds.forEach(id=>q(id).textContent="—");
};

const toggleMode=()=>{
  const m=mode.value;
  document.querySelectorAll("[data-percent-field]").forEach(el=>el.hidden=m!=="percent");
  document.querySelectorAll("[data-flat-field]").forEach(el=>el.hidden=m!=="flat");
  document.querySelectorAll("[data-compare-field]").forEach(el=>el.hidden=m!=="compare");
  const compare=m==="compare";
  q("si-annual-change-label").textContent=compare?"Annual change":"Annual increase";
  q("si-percent-change-label").textContent=compare?"Percentage change":"Increase percentage";
  q("si-monthly-change-label").textContent=compare?"Monthly change":"Monthly increase";
  q("si-biweekly-change-label").textContent=compare?"Biweekly change":"Biweekly increase";
  q("si-weekly-change-label").textContent=compare?"Weekly change":"Weekly increase";
  q("si-hourly-change-label").textContent=compare?"Hourly change":"Hourly increase";
};

const salaryInputs=()=>{
  const currentParsed=parseRequiredNumber(current,"current annual salary",{min:0});
  setError(current,errors.current,currentParsed.valid?"":currentParsed.message);

  let modeParsed;
  if(mode.value==="percent"){
    modeParsed=parseRequiredNumber(percent,"raise percentage",{min:0});
    setError(percent,errors.percent,modeParsed.valid?"":modeParsed.message);
    setError(flat,errors.flat,"");
    setError(nextInput,errors.next,"");
  }else if(mode.value==="flat"){
    modeParsed=parseRequiredNumber(flat,"flat annual raise",{min:0});
    setError(flat,errors.flat,modeParsed.valid?"":modeParsed.message);
    setError(percent,errors.percent,"");
    setError(nextInput,errors.next,"");
  }else{
    modeParsed=parseRequiredNumber(nextInput,"new annual salary",{min:0});
    setError(nextInput,errors.next,modeParsed.valid?"":modeParsed.message);
    setError(percent,errors.percent,"");
    setError(flat,errors.flat,"");
  }

  return {current:currentParsed,modeValue:modeParsed};
};

const scheduleInputs=()=>{
  const h=parseRequiredNumber(hours,"hours per week",{min:.25});
  const w=parseRequiredNumber(weeks,"weeks per year",{min:1,integer:true,max:53});
  setError(hours,errors.hours,h.valid?"":h.message);
  setError(weeks,errors.weeks,w.valid?"":w.message);
  return {hours:h,weeks:w,valid:h.valid&&w.valid};
};

const renderPeriod=(currentAnnual,nextAnnual,diff,compare)=>{
  q("si-current-annual").textContent=money(currentAnnual);
  q("si-new").textContent=money(nextAnnual);
  q("si-annual-change").textContent=money(diff,{signed:compare});

  const rows=[
    ["monthly",12],
    ["biweekly",26],
    ["weekly",52]
  ];
  rows.forEach(([name,divisor])=>{
    q(`si-current-${name}`).textContent=money(currentAnnual/divisor);
    q(`si-new-${name}`).textContent=money(nextAnnual/divisor);
    q(`si-${name}-change`).textContent=money(diff/divisor,{signed:compare});
  });
};

const calculate=()=>{
  toggleMode();
  const primary=salaryInputs();
  const schedule=scheduleInputs();

  if(!primary.current.valid||!primary.modeValue.valid){
    clearSalaryOutputs();
    calcStatus.textContent="Fix the highlighted salary fields to calculate.";
    scheduleStatus.textContent=schedule.valid?"Schedule inputs are valid.":"Hourly equivalents are unavailable until the schedule fields are valid.";
    formula.textContent="Enter valid salary inputs to see the calculation.";
    return;
  }

  const currentAnnual=primary.current.value;
  const m=mode.value;
  let nextAnnual=0;
  let diff=0;
  let pct=null;

  if(m==="percent"){
    pct=primary.modeValue.value;
    diff=currentAnnual*pct/100;
    nextAnnual=currentAnnual+diff;
  }else if(m==="flat"){
    diff=primary.modeValue.value;
    nextAnnual=currentAnnual+diff;
    pct=currentAnnual>0?diff/currentAnnual*100:(diff===0?0:null);
  }else{
    nextAnnual=primary.modeValue.value;
    diff=nextAnnual-currentAnnual;
    pct=currentAnnual>0?diff/currentAnnual*100:(nextAnnual===0?0:null);
  }

  const compare=m==="compare";
  renderPeriod(currentAnnual,nextAnnual,diff,compare);
  q("si-change").textContent=percentText(pct,{signed:compare});

  if(schedule.valid){
    const annualHours=schedule.hours.value*schedule.weeks.value;
    const oldHourly=currentAnnual/annualHours;
    const newHourly=nextAnnual/annualHours;
    const hourlyDiff=newHourly-oldHourly;
    q("si-annual-hours").textContent=annualHours.toLocaleString("en-US",{maximumFractionDigits:2});
    q("si-old-hourly").textContent=money(oldHourly);
    q("si-new-hourly").textContent=money(newHourly);
    q("si-hourly-change").textContent=money(hourlyDiff,{signed:compare});
    scheduleStatus.textContent=`Hourly equivalents use ${schedule.hours.value} hours/week × ${schedule.weeks.value} weeks/year = ${annualHours.toLocaleString("en-US",{maximumFractionDigits:2})} annual hours.`;
  }else{
    q("si-annual-hours").textContent="—";
    q("si-old-hourly").textContent="—";
    q("si-new-hourly").textContent="—";
    q("si-hourly-change").textContent="—";
    scheduleStatus.textContent="Hourly equivalents are unavailable until hours per week and weeks per year are valid. Salary and pay-period results remain available.";
  }

  if(m==="percent"){
    formula.textContent=`${money(currentAnnual)} × ${percentText(pct)} = ${money(diff)} increase; new salary ${money(nextAnnual)}.`;
  }else if(m==="flat"){
    formula.textContent=pct===null
      ?`${money(currentAnnual)} + ${money(diff)} = ${money(nextAnnual)}; percentage change is unavailable because the current salary is zero.`
      :`${money(currentAnnual)} + ${money(diff)} = ${money(nextAnnual)} (${percentText(pct)} increase).`;
  }else{
    formula.textContent=pct===null
      ?`${money(nextAnnual)} − ${money(currentAnnual)} = ${money(diff,{signed:true})}; percentage change is unavailable because the current salary is zero.`
      :`${money(nextAnnual)} − ${money(currentAnnual)} = ${money(diff,{signed:true})} (${percentText(pct,{signed:true})}).`;
  }

  calcStatus.textContent=m==="compare"?"Salary comparison calculated.":"Salary increase calculated.";
};

["si-mode","si-currency","si-current","si-percent","si-flat","si-new-input","si-hours","si-weeks"].forEach(id=>{
  q(id).addEventListener("input",calculate);
  q(id).addEventListener("change",calculate);
});

q("si-example").addEventListener("click",()=>{
  mode.value="percent";
  currency.value="USD";
  current.value="60000";
  percent.value="5";
  hours.value="40";
  weeks.value="52";
  calculate();
});

q("si-flat-example").addEventListener("click",()=>{
  mode.value="flat";
  currency.value="USD";
  current.value="60000";
  flat.value="3000";
  hours.value="40";
  weeks.value="52";
  calculate();
});

q("si-reset").addEventListener("click",()=>{
  mode.value="percent";
  currency.value="USD";
  current.value="60000";
  percent.value="5";
  flat.value="3000";
  nextInput.value="63000";
  hours.value="40";
  weeks.value="52";
  calculate();
});

calculate();
})();