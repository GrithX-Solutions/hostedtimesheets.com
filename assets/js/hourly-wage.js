(()=>{
  const q=id=>document.getElementById(id);
  const root=document.querySelector("[data-hourly-wage]");
  if(!root)return;

  const fields={
    rate:{id:"hw-rate",error:"hw-rate-error"},
    hours:{id:"hw-hours",error:"hw-hours-error"},
    weeks:{id:"hw-weeks",error:"hw-weeks-error"},
    days:{id:"hw-days",error:"hw-days-error"},
    ot:{id:"hw-ot-hours",error:"hw-ot-hours-error"},
    mult:{id:"hw-ot-multiplier",error:"hw-ot-multiplier-error"}
  };
  const resultIds=["hw-daily","hw-weekly","hw-biweekly","hw-monthly","hw-annual","hw-ot-pay","hw-weekly-total","hw-annual-total"];
  const inputIds=["hw-rate","hw-hours","hw-weeks","hw-days","hw-currency","hw-ot-hours","hw-ot-multiplier"];
  let lastSummary="";

  function money(value){
    const currency=q("hw-currency").value||"USD";
    try{return new Intl.NumberFormat(undefined,{style:"currency",currency,maximumFractionDigits:2}).format(value)}
    catch{return value.toFixed(2)}
  }

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

  function parseOptionalNonnegative(field,label,{max=Infinity}={}){
    const raw=q(field.id).value.trim();
    if(raw===""){setField(field);return 0}
    const value=Number(raw);
    if(!Number.isFinite(value)){setField(field,"Enter a valid "+label.toLowerCase()+".");return null}
    if(value<0||value>max){
      const range=max<Infinity?" from 0 to "+max:" of 0 or more";
      setField(field,label+" must be"+range+".");
      return null;
    }
    setField(field);
    return value;
  }

  function clearResults(){
    resultIds.forEach(id=>q(id).textContent="—");
    q("hw-formula").textContent="Fix the highlighted values to calculate gross pay.";
    lastSummary="";
  }

  function calc(){
    const rate=parseRequired(fields.rate,"Hourly wage",{min:0});
    const hours=parseRequired(fields.hours,"Regular hours per week",{min:0,max:168});
    const weeks=parseRequired(fields.weeks,"Weeks per year",{min:1,max:53,integer:true});
    const days=parseRequired(fields.days,"Days per week",{min:1,max:7,integer:true});
    const ot=parseOptionalNonnegative(fields.ot,"Overtime hours per week",{max:168});

    let mult=null;
    const multRaw=q(fields.mult.id).value.trim();
    if(ot!==null&&ot===0&&multRaw===""){
      setField(fields.mult);
      mult=1.5;
    }else{
      mult=parseRequired(fields.mult,"Overtime multiplier",{min:1});
    }

    const valid=[rate,hours,weeks,days,ot,mult].every(value=>value!==null);
    if(valid&&hours+ot>168){
      setField(fields.ot,"Regular plus overtime hours cannot exceed 168 hours per week.");
    }
    if(!valid||hours+ot>168){
      clearResults();
      q("hw-status").textContent="Check the highlighted input"+((!valid||hours+ot>168)?"s":"")+" before using the result.";
      return;
    }

    const weekly=rate*hours;
    const annual=weekly*weeks;
    const overtimeRate=rate*mult;
    const otPay=overtimeRate*ot;
    const weeklyTotal=weekly+otPay;
    const annualTotal=annual+otPay*weeks;

    q("hw-daily").textContent=money(weekly/days);
    q("hw-weekly").textContent=money(weekly);
    q("hw-biweekly").textContent=money(weekly*2);
    q("hw-monthly").textContent=money(annual/12);
    q("hw-annual").textContent=money(annual);
    q("hw-ot-pay").textContent=money(otPay);
    q("hw-weekly-total").textContent=money(weeklyTotal);
    q("hw-annual-total").textContent=money(annualTotal);
    q("hw-formula").textContent=rate.toFixed(2)+" × "+hours.toFixed(2)+" regular hours × "+weeks+" weeks = "+money(annual)+" regular annual gross pay";
    q("hw-status").textContent=ot>0
      ?"Valid estimate. Annual pay including overtime assumes "+ot.toFixed(2)+" overtime hours repeat across all "+weeks+" paid weeks."
      :"Valid estimate using regular hours only.";

    lastSummary=[
      "Hourly wage: "+money(rate)+"/hour",
      "Regular hours/week: "+hours.toFixed(2),
      "Paid weeks/year: "+weeks,
      "Weekly regular pay: "+money(weekly),
      "Biweekly regular pay: "+money(weekly*2),
      "Average monthly regular pay: "+money(annual/12),
      "Annual regular pay: "+money(annual),
      "Weekly overtime pay: "+money(otPay),
      "Weekly pay including overtime: "+money(weeklyTotal),
      "Annual pay including overtime: "+money(annualTotal)
    ].join("\n");
  }

  inputIds.forEach(id=>q(id).addEventListener("input",calc));
  q("hw-currency").addEventListener("change",calc);
  q("hw-example").addEventListener("click",()=>{
    q("hw-rate").value="22.50";
    q("hw-hours").value="40";
    q("hw-weeks").value="52";
    q("hw-days").value="5";
    q("hw-currency").value="USD";
    q("hw-ot-hours").value="5";
    q("hw-ot-multiplier").value="1.5";
    calc();
  });
  q("hw-copy").addEventListener("click",async()=>{
    if(!lastSummary){q("hw-status").textContent="Enter valid values before copying the result.";return}
    try{
      await navigator.clipboard.writeText(lastSummary);
      q("hw-status").textContent="Result copied to clipboard.";
    }catch{
      q("hw-status").textContent="Copy was unavailable in this browser. Select the visible results instead.";
    }
  });
  q("hw-reset").addEventListener("click",()=>{
    q("hw-rate").value="25";
    q("hw-hours").value="40";
    q("hw-weeks").value="52";
    q("hw-days").value="5";
    q("hw-currency").value="USD";
    q("hw-ot-hours").value="0";
    q("hw-ot-multiplier").value="1.5";
    calc();
  });
  calc();
})();
