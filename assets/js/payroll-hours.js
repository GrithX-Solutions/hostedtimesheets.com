(()=>{
  const root=document.querySelector("[data-payroll-hours]");
  if(!root)return;
  const rows=[...root.querySelectorAll("[data-payroll-row]")];
  const $=s=>root.querySelector(s)||document.querySelector(s);
  const money=(v,c)=>new Intl.NumberFormat("en-US",{style:"currency",currency:c,maximumFractionDigits:2}).format(v);
  let lastState=null;

  function setError(input,message=""){
    let error=input.parentElement.querySelector("[data-error]");
    if(!error){
      error=document.createElement("small");
      error.dataset.error="";
      error.className="field-error";
      input.insertAdjacentElement("afterend",error);
    }
    const invalid=Boolean(message);
    input.setAttribute("aria-invalid",String(invalid));
    error.textContent=message;
    error.hidden=!invalid;
    return !invalid;
  }

  function requiredWhole(input,label,min=0,max=Infinity){
    const raw=input.value.trim();
    if(raw===""){setError(input);return {valid:true,value:0}}
    const value=Number(raw);
    if(!Number.isFinite(value)||!Number.isInteger(value)||value<min||value>max){
      setError(input,max<Infinity?`Enter a whole number from ${min} to ${max}.`:`Enter a whole number of ${min} or more.`);
      return {valid:false,value:null};
    }
    setError(input);return {valid:true,value};
  }

  function optionalNumber(input,label,{min=0,max=Infinity,strictPositive=false}={}){
    const raw=input.value.trim();
    if(raw===""){setError(input);return {valid:true,value:null}}
    const value=Number(raw);
    if(!Number.isFinite(value)||value<min||value>max||(strictPositive&&value<=0)){
      const lower=strictPositive?"greater than zero":`${min} or more`;
      setError(input,max<Infinity?`Enter ${label} from ${min} to ${max}.`:`Enter ${label} ${lower}.`);
      return {valid:false,value:null};
    }
    setError(input);return {valid:true,value};
  }

  function calc(){
    let totalMinutes=0,valid=true;
    const dayStates=[];
    rows.forEach(row=>{
      const h=requiredWhole(row.querySelector("[data-hours]"),"Hours",0);
      const m=requiredWhole(row.querySelector("[data-minutes]"),"Minutes",0,59);
      valid=valid&&h.valid&&m.valid;
      if(!h.valid||!m.valid){
        row.querySelector("[data-decimal]").textContent="—";
        dayStates.push(null);return;
      }
      const minutes=h.value*60+m.value;
      totalMinutes+=minutes;
      row.querySelector("[data-decimal]").textContent=(minutes/60).toFixed(2);
      dayStates.push({hours:h.value,minutes:m.value,decimal:minutes/60});
    });

    const rate=optionalNumber($("#ph-rate"),"an hourly rate",{min:0});
    const threshold=optionalNumber($("#ph-threshold"),"an overtime comparison threshold",{min:0});
    const multiplier=optionalNumber($("#ph-multiplier"),"an overtime multiplier",{min:0,strictPositive:true});
    valid=valid&&rate.valid&&threshold.valid&&multiplier.valid;

    if((threshold.value===null)!==(multiplier.value===null)){
      if(threshold.value===null)setError($("#ph-threshold"),"Enter a threshold when you enter a multiplier, or leave both blank.");
      if(multiplier.value===null)setError($("#ph-multiplier"),"Enter a multiplier when you enter a threshold, or leave both blank.");
      valid=false;
    }

    const total=totalMinutes/60;
    $("#ph-total-minutes").textContent=valid?String(totalMinutes):"—";
    $("#ph-total-decimal").textContent=valid?total.toFixed(2):"—";

    if(!valid){
      for(const id of ["ph-regular","ph-overtime","ph-regular-pay","ph-overtime-pay","ph-gross"])$("#"+id).textContent="—";
      $("#ph-formula").textContent="Fix the highlighted input before using the payroll-hour totals.";
      $("#ph-status").textContent="Results are paused until every entered value is valid.";
      lastState=null;return null;
    }

    const hasOt=threshold.value!==null&&multiplier.value!==null;
    const regular=hasOt?Math.min(total,threshold.value):total;
    const overtime=hasOt?Math.max(0,total-threshold.value):null;
    $("#ph-regular").textContent=hasOt?regular.toFixed(2):"Not split";
    $("#ph-overtime").textContent=hasOt?overtime.toFixed(2):"Not split";

    const hasRate=rate.value!==null;
    if(hasRate){
      const regularPay=regular*rate.value;
      const overtimePay=hasOt?overtime*rate.value*multiplier.value:0;
      $("#ph-regular-pay").textContent=money(regularPay,$("#ph-currency").value);
      $("#ph-overtime-pay").textContent=hasOt?money(overtimePay,$("#ph-currency").value):"Not split";
      $("#ph-gross").textContent=money(regularPay+overtimePay,$("#ph-currency").value);
    }else{
      $("#ph-regular-pay").textContent="Not entered";
      $("#ph-overtime-pay").textContent=hasOt?"Not entered":"Not split";
      $("#ph-gross").textContent="Not entered";
    }

    const whole=Math.floor(totalMinutes/60),mins=totalMinutes%60;
    $("#ph-formula").textContent=`${whole}h ${mins}m = ${total.toFixed(2)} payroll hours`;
    $("#ph-status").textContent=hasOt
      ?"Regular/overtime values use only the threshold and multiplier you entered. The calculator does not decide overtime eligibility."
      :"No overtime split is applied. Enter both an optional threshold and multiplier only if you want a scenario comparison.";
    lastState={totalMinutes,total,dayStates,rate:rate.value,threshold:threshold.value,multiplier:multiplier.value,regular,overtime,hasOt,hasRate,currency:$("#ph-currency").value};
    return lastState;
  }

  function summary(){
    const s=calc();if(!s)return "";
    const lines=["Payroll Hours Calculator",...rows.map((r,i)=>{
      const d=s.dayStates[i];return `${r.children[0].textContent.trim()}: ${d.hours}h ${d.minutes}m = ${d.decimal.toFixed(2)} hours`;
    }),`Total: ${s.totalMinutes} minutes = ${s.total.toFixed(2)} payroll hours`];
    if(s.hasOt)lines.push(`Scenario split: ${s.regular.toFixed(2)} regular, ${s.overtime.toFixed(2)} overtime at ${s.multiplier}× after ${s.threshold} hours`);
    if(s.hasRate)lines.push(`Estimated gross pay: ${$("#ph-gross").textContent}`);
    return lines.join("\n");
  }

  async function copy(){
    const text=summary();if(!text)return;
    try{await navigator.clipboard.writeText(text);$("#ph-status").textContent="Payroll-hour summary copied."}
    catch{$("#ph-status").textContent="Copy is unavailable in this browser. You can print or download CSV instead."}
  }

  function csv(){
    const s=calc();if(!s)return;
    const data=[["Day","Hours","Minutes","Decimal hours"],...rows.map((r,i)=>[r.children[0].textContent.trim(),s.dayStates[i].hours,s.dayStates[i].minutes,s.dayStates[i].decimal.toFixed(2)]),["TOTAL","",s.totalMinutes,s.total.toFixed(2)]];
    const out=data.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(",")).join("\n");
    const a=document.createElement("a"),u=URL.createObjectURL(new Blob([out],{type:"text/csv;charset=utf-8"}));
    a.href=u;a.download="payroll-hours.csv";a.click();URL.revokeObjectURL(u);
    $("#ph-status").textContent="CSV export prepared from the current valid inputs.";
  }

  root.addEventListener("input",calc);
  root.addEventListener("change",calc);
  $("#ph-example").addEventListener("click",()=>{
    const v=[[8,0],[8,15],[7,45],[8,30],[9,0],[0,0],[0,0]];
    rows.forEach((r,i)=>{r.querySelector("[data-hours]").value=v[i][0];r.querySelector("[data-minutes]").value=v[i][1]});
    $("#ph-rate").value="25";$("#ph-threshold").value="40";$("#ph-multiplier").value="1.5";calc();
  });
  $("#ph-reset").addEventListener("click",()=>{
    rows.forEach(r=>{r.querySelector("[data-hours]").value="0";r.querySelector("[data-minutes]").value="0"});
    $("#ph-rate").value="";$("#ph-threshold").value="";$("#ph-multiplier").value="";calc();
  });
  $("#ph-copy").addEventListener("click",copy);
  $("#ph-csv").addEventListener("click",csv);
  $("#ph-print").addEventListener("click",()=>window.print());
  calc();
})();