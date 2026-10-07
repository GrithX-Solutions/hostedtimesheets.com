(()=>{
  const root=document.querySelector("[data-billable-hours]");
  if(!root)return;
  const $=s=>root.querySelector(s)||document.querySelector(s);
  const moneyIds=["bh-revenue","bh-effective-rate","bh-target-value","bh-value-delta"];
  let lastSummary="";

  const money=(v,c)=>new Intl.NumberFormat("en-US",{style:"currency",currency:c,maximumFractionDigits:2}).format(v);
  const signedMoney=(v,c)=>(v>=0?"+":"-")+money(Math.abs(v),c);

  function setField(input,error,message=""){
    const invalid=Boolean(message);
    input.setAttribute("aria-invalid",String(invalid));
    error.textContent=message;
    error.hidden=!invalid;
    return !invalid;
  }

  function parseRequired(id,errorId,label){
    const input=$(id),error=$(errorId),raw=input.value.trim();
    if(raw===""){setField(input,error,label+" is required.");return null}
    const value=Number(raw);
    if(!Number.isFinite(value)){setField(input,error,"Enter a finite "+label.toLowerCase()+".");return null}
    if(value<0){setField(input,error,label+" must be at or above 0.");return null}
    setField(input,error);
    return value;
  }

  function parseOptionalRate(){
    const input=$("#bh-rate"),error=$("#bh-rate-error"),raw=input.value.trim();
    if(raw===""){setField(input,error);return {valid:true,value:null}}
    const value=Number(raw);
    if(!Number.isFinite(value)||value<0){
      setField(input,error,"Billing rate must be a finite number at or above 0.");
      return {valid:false,value:null};
    }
    setField(input,error);
    return {valid:true,value};
  }

  function parseOptionalTarget(){
    const input=$("#bh-target"),error=$("#bh-target-error"),raw=input.value.trim();
    if(raw===""){setField(input,error);return {valid:true,value:null}}
    const value=Number(raw);
    if(!Number.isFinite(value)){setField(input,error,"Enter a finite target utilization.");return {valid:false,value:null}}
    if(value<0||value>100){setField(input,error,"Target utilization must be from 0% to 100%.");return {valid:false,value:null}}
    setField(input,error);
    return {valid:true,value};
  }

  function clearCore(message){
    for(const id of ["bh-utilization","bh-nonbillable","bh-revenue","bh-effective-rate","bh-target-hours","bh-target-delta","bh-target-value","bh-value-delta"]) $("#"+id).textContent="—";
    $("#bh-formula").textContent="Fix the highlighted worked and billable hour inputs to calculate.";
    $("#bh-status").textContent=message||"Check the highlighted hour inputs before using the result.";
    lastSummary="";
  }

  function calc(){
    const total=parseRequired("#bh-total","#bh-total-error","Total worked hours");
    const billable=parseRequired("#bh-billable","#bh-billable-error","Billable hours");
    const rate=parseOptionalRate();
    const target=parseOptionalTarget();
    const currency=$("#bh-currency").value;

    if(total!==null&&billable!==null&&billable>total){
      setField($("#bh-billable"),$("#bh-billable-error"),"Billable hours cannot exceed total worked hours for the same period.");
      clearCore();
      return;
    }
    if(total===null||billable===null){clearCore();return}

    const nonBillable=total-billable;
    const utilization=total>0?billable/total*100:null;
    $("#bh-nonbillable").textContent=nonBillable.toFixed(2);
    $("#bh-utilization").textContent=utilization===null?"N/A":utilization.toFixed(1)+"%";
    $("#bh-formula").textContent=utilization===null
      ?"0 total worked hours: billable utilization is undefined."
      :billable.toFixed(2)+" ÷ "+total.toFixed(2)+" × 100 = "+utilization.toFixed(1)+"% utilization";

    let revenue=null,effective=null;
    if(rate.valid&&rate.value!==null){
      revenue=billable*rate.value;
      effective=total>0?revenue/total:null;
      if(!Number.isFinite(revenue)||!Number.isFinite(effective===null?0:effective)){
        setField($("#bh-rate"),$("#bh-rate-error"),"Rate × hours is too large to format safely.");
        rate.valid=false;revenue=null;effective=null;
      }
    }
    $("#bh-revenue").textContent=revenue===null?"—":money(revenue,currency);
    $("#bh-effective-rate").textContent=rate.valid&&rate.value!==null?(effective===null?"N/A":money(effective,currency)):"—";

    let targetHours=null,hoursDelta=null,targetValue=null,valueDelta=null;
    if(target.valid&&target.value!==null){
      targetHours=total*(target.value/100);
      hoursDelta=billable-targetHours;
      $("#bh-target-hours").textContent=targetHours.toFixed(2);
      $("#bh-target-delta").textContent=(hoursDelta>=0?"+":"")+hoursDelta.toFixed(2)+" hrs";
      if(rate.valid&&rate.value!==null){
        targetValue=targetHours*rate.value;
        valueDelta=revenue-targetValue;
        if(!Number.isFinite(targetValue)||!Number.isFinite(valueDelta)){
          setField($("#bh-rate"),$("#bh-rate-error"),"Rate × target hours is too large to format safely.");
          rate.valid=false;targetValue=null;valueDelta=null;
        }
      }
    }else{
      $("#bh-target-hours").textContent="—";
      $("#bh-target-delta").textContent="—";
    }
    $("#bh-target-value").textContent=targetValue===null?"—":money(targetValue,currency);
    $("#bh-value-delta").textContent=valueDelta===null?"—":signedMoney(valueDelta,currency);
    if(!rate.valid) moneyIds.forEach(id=>$("#"+id).textContent="—");

    const issues=[];
    if(!rate.valid)issues.push("billing rate");
    if(!target.valid)issues.push("target utilization");
    if(utilization===null){
      $("#bh-status").textContent=issues.length
        ?"Utilization is N/A because total worked hours are zero. Fix "+issues.join(" and ")+" for the related optional outputs."
        :"Utilization is N/A because total worked hours are zero. Other defined zero-hour arithmetic remains available.";
    }else if(issues.length){
      $("#bh-status").textContent="Utilization is valid. Fix "+issues.join(" and ")+" for the related optional outputs.";
    }else{
      $("#bh-status").textContent="Valid utilization. Billable value is simple hours × rate arithmetic; currency formatting does not perform FX conversion.";
    }

    const rateText=rate.valid&&rate.value!==null?money(rate.value,currency)+"/hour":"Not entered";
    const revenueText=rate.valid&&revenue!==null?money(revenue,currency):"Not available";
    const effectiveText=rate.valid&&rate.value!==null?(effective===null?"N/A":money(effective,currency)+"/worked hour"):"Not available";
    const targetText=target.valid&&target.value!==null?target.value.toFixed(1)+"%":"Not entered";
    const targetHoursText=targetHours===null?"Not available":targetHours.toFixed(2);
    const hoursDeltaText=hoursDelta===null?"Not available":(hoursDelta>=0?"+":"")+hoursDelta.toFixed(2)+" hrs";
    const targetValueText=targetValue===null?"Not available":money(targetValue,currency);
    const valueDeltaText=valueDelta===null?"Not available":signedMoney(valueDelta,currency);
    const summary=[
      "Billable hours calculation",
      "Total worked hours: "+total.toFixed(2),
      "Billable hours: "+billable.toFixed(2),
      "Non-billable hours: "+nonBillable.toFixed(2),
      "Billable utilization: "+(utilization===null?"N/A":utilization.toFixed(1)+"%"),
      "Billing rate: "+rateText,
      "Estimated billable value: "+revenueText,
      "Effective value per worked hour: "+effectiveText,
      "Target utilization: "+targetText,
      "Target billable hours: "+targetHoursText,
      "Hours vs target: "+hoursDeltaText,
      "Value at target: "+targetValueText,
      "Value vs target: "+valueDeltaText,
      "Currency format: "+currency+" (formatting only; no FX conversion)"
    ].join("\n");
    lastSummary=issues.length?"":summary;
  }

  async function copyResult(){
    if(!lastSummary){$("#bh-status").textContent="Enter valid worked and billable hours before copying the result.";return}
    try{await navigator.clipboard.writeText(lastSummary);$("#bh-status").textContent="Result copied to clipboard."}
    catch{$("#bh-status").textContent="Copy was unavailable in this browser. Select the visible result instead."}
  }

  root.addEventListener("input",calc);
  root.addEventListener("change",calc);
  $("#bh-copy").addEventListener("click",copyResult);
  $("#bh-example").addEventListener("click",()=>{
    $("#bh-total").value="45";
    $("#bh-billable").value="28";
    $("#bh-rate").value="65";
    $("#bh-currency").value="USD";
    $("#bh-target").value="70";
    calc();
  });
  $("#bh-reset").addEventListener("click",()=>{
    $("#bh-total").value="40";
    $("#bh-billable").value="30";
    $("#bh-rate").value="100";
    $("#bh-currency").value="USD";
    $("#bh-target").value="75";
    calc();
  });
  calc();
})();
