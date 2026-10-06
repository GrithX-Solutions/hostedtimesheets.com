(()=>{
"use strict";
const root=document.querySelector("[data-decimal-hours]");
if(!root)return;

const byId=id=>document.getElementById(id);
const modeInputs=[...root.querySelectorAll('input[name="dh-mode"]')];
const timeGroup=byId("dh-time-fields");
const decimalGroup=byId("dh-decimal-fields");
const hoursInput=byId("dh-hours");
const minutesInput=byId("dh-minutes");
const secondsInput=byId("dh-seconds");
const decimalInput=byId("dh-decimal-input");
const precisionInput=byId("dh-precision");
const rateInput=byId("dh-rate");
const currencyInput=byId("dh-currency");
const primaryLabel=byId("dh-primary-label");
const primaryValue=byId("dh-primary");
const secondaryLabel=byId("dh-secondary-label");
const secondaryValue=byId("dh-secondary");
const totalMinutesValue=byId("dh-total-minutes");
const totalSecondsValue=byId("dh-total-seconds");
const payValue=byId("dh-pay");
const formulaValue=byId("dh-formula");
const statusValue=byId("dh-status");
const copyButton=byId("dh-copy");

const errors={
  hours:byId("dh-hours-error"),
  minutes:byId("dh-minutes-error"),
  seconds:byId("dh-seconds-error"),
  decimal:byId("dh-decimal-error"),
  rate:byId("dh-rate-error")
};

let copyValue="";

const mode=()=>modeInputs.find(input=>input.checked)?.value||"time-to-decimal";

const setError=(input,errorEl,message)=>{
  const invalid=Boolean(message);
  input.setAttribute("aria-invalid",String(invalid));
  errorEl.hidden=!invalid;
  errorEl.textContent=message||"";
};

const clearOutput=()=>{
  primaryValue.textContent="—";
  secondaryValue.textContent="—";
  totalMinutesValue.textContent="—";
  totalSecondsValue.textContent="—";
  payValue.textContent="—";
  copyValue="";
};

const parseWhole=(input,{name,max=null,blankZero=true})=>{
  const raw=input.value.trim();
  if(raw===""){
    if(blankZero)return {valid:true,value:0};
    return {valid:false,message:`${name} is required.`};
  }
  const value=Number(raw);
  if(!Number.isFinite(value)||value<0||!Number.isInteger(value)){
    return {valid:false,message:`${name} must be a whole number zero or greater.`};
  }
  if(max!==null&&value>max){
    return {valid:false,message:`${name} must be a whole number from 0 to ${max}.`};
  }
  return {valid:true,value};
};

const parseDecimal=()=>{
  const raw=decimalInput.value.trim();
  if(raw==="")return {valid:false,message:"Decimal hours is required."};
  const value=Number(raw);
  if(!Number.isFinite(value)||value<0)return {valid:false,message:"Decimal hours must be zero or greater."};
  return {valid:true,value,raw};
};

const parseRate=()=>{
  const raw=rateInput.value.trim();
  if(raw==="")return {valid:true,value:null};
  const value=Number(raw);
  if(!Number.isFinite(value)||value<0)return {valid:false,message:"Hourly rate must be zero or greater."};
  return {valid:true,value};
};

const normalizedDuration=totalSeconds=>{
  const hours=Math.floor(totalSeconds/3600);
  const remaining=totalSeconds%3600;
  const minutes=Math.floor(remaining/60);
  const seconds=remaining%60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const formatTrim=(value,places=6)=>{
  if(Number.isInteger(value))return String(value);
  return value.toFixed(places).replace(/0+$/,"").replace(/\.$/,"");
};

const formatExact=value=>{
  const rounded=Number(value.toFixed(6));
  const text=formatTrim(rounded,6);
  return Math.abs(value-rounded)>1e-9?`${text}…`:text;
};

const formatMoney=(value,currency)=>new Intl.NumberFormat("en-US",{
  style:"currency",
  currency,
  minimumFractionDigits:2,
  maximumFractionDigits:2
}).format(value);

const setPay=(rate,sourceHours)=>{
  if(rate===null){
    payValue.textContent="—";
    return;
  }
  payValue.textContent=formatMoney(sourceHours*rate,currencyInput.value);
};

const validateRate=()=>{
  const rate=parseRate();
  setError(rateInput,errors.rate,rate.valid?"":rate.message);
  return rate;
};

const calculateTimeToDecimal=()=>{
  const hours=parseWhole(hoursInput,{name:"Whole hours"});
  const minutes=parseWhole(minutesInput,{name:"Minutes",max:59});
  const seconds=parseWhole(secondsInput,{name:"Seconds",max:59});
  const rate=validateRate();

  setError(hoursInput,errors.hours,hours.valid?"":hours.message);
  setError(minutesInput,errors.minutes,minutes.valid?"":minutes.message);
  setError(secondsInput,errors.seconds,seconds.valid?"":seconds.message);
  setError(decimalInput,errors.decimal,"");

  primaryLabel.textContent="Decimal hours";
  secondaryLabel.textContent="Normalized time";

  if(!hours.valid||!minutes.valid||!seconds.valid){
    clearOutput();
    formulaValue.textContent="Fix the highlighted time fields to calculate.";
    statusValue.textContent="Enter valid whole hours, minutes and seconds.";
    return;
  }

  const totalSeconds=hours.value*3600+minutes.value*60+seconds.value;
  const decimalExact=totalSeconds/3600;
  const precision=Number(precisionInput.value);
  const display=decimalExact.toFixed(precision);
  const normalized=normalizedDuration(totalSeconds);

  primaryValue.textContent=display;
  secondaryValue.textContent=normalized;
  totalMinutesValue.textContent=formatTrim(totalSeconds/60,6);
  totalSecondsValue.textContent=totalSeconds.toLocaleString("en-US");
  setPay(rate.valid?rate.value:null,decimalExact);
  if(!rate.valid)payValue.textContent="—";

  formulaValue.textContent=`${totalSeconds.toLocaleString("en-US")} ÷ 3,600 = ${formatExact(decimalExact)} hours → ${display} at ${precision} places`;
  statusValue.textContent=rate.valid?"Time converted to decimal hours.":"Time converted. Fix the hourly rate to estimate pay.";
  copyValue=display;
};

const calculateDecimalToTime=()=>{
  const decimal=parseDecimal();
  const rate=validateRate();

  setError(decimalInput,errors.decimal,decimal.valid?"":decimal.message);
  setError(hoursInput,errors.hours,"");
  setError(minutesInput,errors.minutes,"");
  setError(secondsInput,errors.seconds,"");

  primaryLabel.textContent="Time";
  secondaryLabel.textContent="Decimal input";

  if(!decimal.valid){
    clearOutput();
    formulaValue.textContent="Enter a valid decimal-hour value to convert.";
    statusValue.textContent="Decimal hours must be zero or greater.";
    return;
  }

  const exactSeconds=decimal.value*3600;
  const roundedSeconds=Math.round(exactSeconds);
  const normalized=normalizedDuration(roundedSeconds);

  primaryValue.textContent=normalized;
  secondaryValue.textContent=decimal.raw;
  totalMinutesValue.textContent=formatTrim(roundedSeconds/60,6);
  totalSecondsValue.textContent=roundedSeconds.toLocaleString("en-US");
  setPay(rate.valid?rate.value:null,decimal.value);
  if(!rate.valid)payValue.textContent="—";

  const exactSecondsText=formatExact(exactSeconds);
  formulaValue.textContent=`${decimal.raw} × 3,600 = ${exactSecondsText} seconds → ${normalized} after nearest-second rounding`;
  statusValue.textContent=rate.valid?"Decimal hours converted to time.":"Time converted. Fix the hourly rate to estimate pay.";
  copyValue=normalized;
};

const calculate=()=>{
  const currentMode=mode();
  const timeActive=currentMode==="time-to-decimal";
  timeGroup.hidden=!timeActive;
  decimalGroup.hidden=timeActive;
  timeGroup.setAttribute("aria-hidden",String(!timeActive));
  decimalGroup.setAttribute("aria-hidden",String(timeActive));
  precisionInput.closest("[data-dh-precision-wrap]").hidden=!timeActive;

  if(timeActive)calculateTimeToDecimal();
  else calculateDecimalToTime();
};

root.addEventListener("input",calculate);
root.addEventListener("change",calculate);

copyButton.addEventListener("click",async()=>{
  if(!copyValue)return;
  const original=copyButton.textContent;
  try{
    await navigator.clipboard.writeText(copyValue);
    copyButton.textContent="Copied";
  }catch{
    copyButton.textContent="Copy failed";
  }
  setTimeout(()=>{copyButton.textContent=original;},1200);
});

calculate();
})();