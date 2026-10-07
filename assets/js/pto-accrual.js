(()=>{
  const root=document.querySelector("[data-pto-accrual]");
  if(!root)return;
  const q=id=>document.getElementById(id);

  const fields={
    current:{id:"pto-current",error:"pto-current-error"},
    used:{id:"pto-used",error:"pto-used-error"},
    carry:{id:"pto-carry",error:"pto-carry-error"},
    cap:{id:"pto-cap",error:"pto-cap-error"},
    dayHours:{id:"pto-day-hours",error:"pto-day-hours-error"},
    rate:{id:"pto-rate",error:"pto-rate-error"},
    worked:{id:"pto-worked",error:"pto-worked-error"},
    periods:{id:"pto-periods",error:"pto-periods-error"},
    perPeriod:{id:"pto-per-period",error:"pto-per-period-error"},
    annual:{id:"pto-annual",error:"pto-annual-error"},
    periodsYear:{id:"pto-periods-year",error:"pto-periods-year-error"},
    periodsElapsed:{id:"pto-periods-elapsed",error:"pto-periods-elapsed-error"},
    fixed:{id:"pto-fixed",error:"pto-fixed-error"}
  };
  const resultIds=["pto-projected","pto-days","pto-earned","pto-cap-reduction","pto-used-out","pto-carry-out"];
  const methodLabels={hours:"Per hour worked",period:"Per pay period",annual:"From annual allowance",fixed:"Fixed / front-loaded amount"};
  let lastSummary="";

  function setField(field,message=""){
    const input=q(field.id),error=q(field.error);
    const invalid=Boolean(message);
    input.setAttribute("aria-invalid",String(invalid));
    error.textContent=message;
    error.hidden=!invalid;
    return !invalid;
  }

  function parseRequired(field,label,{min=0,max=Infinity,integer=false}={}){
    const raw=q(field.id).value.trim();
    if(raw===""){setField(field,label+" is required.");return null}
    const value=Number(raw);
    if(!Number.isFinite(value)){setField(field,"Enter a valid "+label.toLowerCase()+".");return null}
    if(integer&&!Number.isInteger(value)){setField(field,label+" must be a whole number.");return null}
    if(value<min||value>max){
      const range=max<Infinity?" from "+min+" to "+max:" of at least "+min;
      setField(field,label+" must be"+range+".");
      return null;
    }
    setField(field);
    return value;
  }

  function parseOptionalNonnegative(field,label){
    const raw=q(field.id).value.trim();
    if(raw===""){setField(field);return 0}
    const value=Number(raw);
    if(!Number.isFinite(value)){setField(field,"Enter a valid "+label.toLowerCase()+".");return null}
    if(value<0){setField(field,label+" must be 0 or more.");return null}
    setField(field);
    return value;
  }

  function showFor(method){
    document.querySelectorAll("[data-hours-fields]").forEach(el=>el.hidden=method!=="hours");
    document.querySelectorAll("[data-period-fields]").forEach(el=>el.hidden=method!=="period");
    document.querySelectorAll("[data-annual-fields]").forEach(el=>el.hidden=method!=="annual");
    document.querySelectorAll("[data-fixed-fields]").forEach(el=>el.hidden=method!=="fixed");
  }

  function clearResults(){
    resultIds.forEach(id=>q(id).textContent="—");
    q("pto-formula").textContent="Fix the highlighted values to calculate PTO accrual.";
    lastSummary="";
  }

  function calc(){
    const method=q("pto-method").value;
    showFor(method);

    const current=parseRequired(fields.current,"Current PTO balance",{min:0});
    const used=parseRequired(fields.used,"PTO used",{min:0});
    const carry=parseRequired(fields.carry,"Carryover added",{min:0});
    const cap=parseOptionalNonnegative(fields.cap,"Final balance cap");
    const dayHours=parseRequired(fields.dayHours,"Hours per workday",{min:0.01,max:24});

    let earned=null;
    let formula="";
    let methodDetail="";

    if(method==="hours"){
      const rate=parseRequired(fields.rate,"PTO earned per hour worked",{min:0});
      const worked=parseRequired(fields.worked,"Eligible hours worked",{min:0});
      if(rate!==null&&worked!==null){
        earned=worked*rate;
        formula=worked.toFixed(2)+" eligible hours × "+rate.toFixed(4)+" = "+earned.toFixed(2)+" PTO hours earned";
        methodDetail=worked.toFixed(2)+" eligible hours at "+rate.toFixed(4)+" PTO hour per eligible hour";
      }
    }else if(method==="period"){
      const periods=parseRequired(fields.periods,"Completed eligible pay periods",{min:0,integer:true});
      const perPeriod=parseRequired(fields.perPeriod,"PTO hours per pay period",{min:0});
      if(periods!==null&&perPeriod!==null){
        earned=periods*perPeriod;
        formula=periods+" eligible pay periods × "+perPeriod.toFixed(2)+" = "+earned.toFixed(2)+" PTO hours earned";
        methodDetail=periods+" eligible pay periods at "+perPeriod.toFixed(2)+" PTO hours per period";
      }
    }else if(method==="annual"){
      const annual=parseRequired(fields.annual,"Annual PTO allowance",{min:0});
      const periodsYear=parseRequired(fields.periodsYear,"Eligible pay periods per year",{min:1,max:366,integer:true});
      const periodsElapsed=parseRequired(fields.periodsElapsed,"Completed eligible periods",{min:0,max:366,integer:true});
      if(periodsYear!==null&&periodsElapsed!==null&&periodsElapsed>periodsYear){
        setField(fields.periodsElapsed,"Completed eligible periods cannot exceed eligible pay periods per year.");
      }
      if(annual!==null&&periodsYear!==null&&periodsElapsed!==null&&periodsElapsed<=periodsYear){
        const perPeriod=annual/periodsYear;
        earned=perPeriod*periodsElapsed;
        formula=annual.toFixed(2)+" annual PTO hours ÷ "+periodsYear+" periods × "+periodsElapsed+" completed = "+earned.toFixed(2)+" PTO hours earned";
        methodDetail=annual.toFixed(2)+" annual PTO hours across "+periodsYear+" eligible periods; "+periodsElapsed+" completed";
      }
    }else if(method==="fixed"){
      const fixed=parseRequired(fields.fixed,"Fixed PTO hours added",{min:0});
      if(fixed!==null){
        earned=fixed;
        formula=fixed.toFixed(2)+" PTO hours added";
        methodDetail=fixed.toFixed(2)+" fixed PTO hours added";
      }
    }else{
      earned=null;
    }

    const valid=[current,used,carry,cap,dayHours,earned].every(value=>value!==null);
    if(!valid){
      clearResults();
      q("pto-status").textContent="Check the highlighted inputs before using the result.";
      return;
    }

    const uncapped=current+carry+earned-used;
    const capReduction=cap>0&&uncapped>cap?uncapped-cap:0;
    const projected=capReduction>0?cap:uncapped;
    const days=projected/dayHours;

    q("pto-projected").textContent=projected.toFixed(2)+" h";
    q("pto-days").textContent=days.toFixed(2)+" days";
    q("pto-earned").textContent=earned.toFixed(2)+" h";
    q("pto-cap-reduction").textContent=capReduction.toFixed(2)+" h";
    q("pto-used-out").textContent=used.toFixed(2)+" h";
    q("pto-carry-out").textContent=carry.toFixed(2)+" h";
    q("pto-formula").textContent=formula;

    if(capReduction>0){
      q("pto-status").textContent="Valid estimate. The final-balance cap reduced the arithmetic projection by "+capReduction.toFixed(2)+" hours.";
    }else if(cap>0){
      q("pto-status").textContent="Valid estimate. The final-balance cap is not reached by this projection.";
    }else{
      q("pto-status").textContent="Valid estimate. No final-balance cap applied.";
    }

    lastSummary=[
      "PTO accrual method: "+methodLabels[method],
      "Method inputs: "+methodDetail,
      "PTO earned: "+earned.toFixed(2)+" hours",
      "Current balance: "+current.toFixed(2)+" hours",
      "Carryover added: "+carry.toFixed(2)+" hours",
      "PTO used: "+used.toFixed(2)+" hours",
      "Final balance cap: "+(cap>0?cap.toFixed(2)+" hours":"none"),
      "Cap reduction: "+capReduction.toFixed(2)+" hours",
      "Projected PTO balance: "+projected.toFixed(2)+" hours",
      "Hours per workday: "+dayHours.toFixed(2),
      "Projected workdays: "+days.toFixed(2)
    ].join("\n");
  }

  root.addEventListener("input",calc);
  root.addEventListener("change",calc);
  q("pto-example").addEventListener("click",()=>{
    q("pto-method").value="annual";
    q("pto-current").value="12";
    q("pto-used").value="8";
    q("pto-carry").value="4";
    q("pto-cap").value="64";
    q("pto-day-hours").value="8";
    q("pto-annual").value="120";
    q("pto-periods-year").value="26";
    q("pto-periods-elapsed").value="13";
    calc();
  });
  q("pto-copy").addEventListener("click",async()=>{
    if(!lastSummary){q("pto-status").textContent="Enter valid values before copying the result.";return}
    try{
      await navigator.clipboard.writeText(lastSummary);
      q("pto-status").textContent="Result copied to clipboard.";
    }catch{
      q("pto-status").textContent="Copy was unavailable in this browser. Select the visible results instead.";
    }
  });
  q("pto-reset").addEventListener("click",()=>{
    q("pto-method").value="hours";
    q("pto-current").value="0";
    q("pto-used").value="0";
    q("pto-carry").value="0";
    q("pto-cap").value="0";
    q("pto-day-hours").value="8";
    q("pto-rate").value="0.05";
    q("pto-worked").value="160";
    q("pto-periods").value="1";
    q("pto-per-period").value="4";
    q("pto-annual").value="120";
    q("pto-periods-year").value="26";
    q("pto-periods-elapsed").value="13";
    q("pto-fixed").value="8";
    calc();
  });
  calc();
})();
