(()=>{
  const q=id=>document.getElementById(id);
  const root=document.querySelector("[data-salary-hourly]");
  if(!root)return;

  const fields={
    salary:{id:"sh-salary",error:"sh-salary-error"},
    hours:{id:"sh-hours",error:"sh-hours-error"},
    weeks:{id:"sh-weeks",error:"sh-weeks-error"},
    days:{id:"sh-days",error:"sh-days-error"}
  };
  const resultIds=["sh-hourly","sh-daily","sh-weekly","sh-biweekly","sh-monthly","sh-annual-hours"];
  let lastSummary="";

  function money(value){
    const currency=q("sh-currency").value||"USD";
    try{return new Intl.NumberFormat(undefined,{style:"currency",currency,maximumFractionDigits:2}).format(value)}
    catch{return value.toFixed(2)}
  }

  function number(value){
    return new Intl.NumberFormat(undefined,{maximumFractionDigits:2}).format(value);
  }

  function setField(field,message=""){
    const input=q(field.id),error=q(field.error);
    const invalid=Boolean(message);
    input.setAttribute("aria-invalid",String(invalid));
    error.textContent=message;
    error.hidden=!invalid;
    return !invalid;
  }

  function parseRequired(field,label,{min=0,max=Infinity,integer=false,strictPositive=false}={}){
    const input=q(field.id);
    if(input.validity?.badInput){
      setField(field,"Enter a valid "+label.toLowerCase()+".");
      return null;
    }
    const raw=input.value.trim();
    if(raw===""){
      setField(field,label+" is required.");
      return null;
    }
    const value=Number(raw);
    if(!Number.isFinite(value)){
      setField(field,"Enter a valid "+label.toLowerCase()+".");
      return null;
    }
    if(integer&&!Number.isInteger(value)){
      setField(field,label+" must be a whole number.");
      return null;
    }
    if((strictPositive&&value<=0)||value<min||value>max){
      let rule;
      if(value>max&&max<Infinity)rule=" no more than "+max;
      else if(strictPositive&&value<=0)rule=" greater than 0";
      else if(max<Infinity)rule=" from "+min+" to "+max;
      else rule=" of at least "+min;
      setField(field,label+" must be"+rule+".");
      return null;
    }
    setField(field);
    return value;
  }

  function clearResults(){
    resultIds.forEach(id=>q(id).textContent="—");
    q("sh-formula").textContent="Fix the highlighted values to calculate the salary-to-hourly equivalents.";
    q("sh-status").textContent="Results are paused until every required value is valid.";
    lastSummary="";
  }

  function calc(){
    const salary=parseRequired(fields.salary,"Annual gross salary",{min:0});
    const hours=parseRequired(fields.hours,"Hours per paid workweek",{min:0,max:168,strictPositive:true});
    const weeks=parseRequired(fields.weeks,"Paid weeks per year",{min:0,max:53,strictPositive:true});
    const days=parseRequired(fields.days,"Workdays per week",{min:1,max:7,integer:true});

    if([salary,hours,weeks,days].some(value=>value===null)){
      clearResults();
      return;
    }

    const annualHours=hours*weeks;
    const hourly=salary/annualHours;
    const weekly=salary/weeks;
    const daily=weekly/days;
    const biweekly=weekly*2;
    const monthly=salary/12;

    q("sh-hourly").textContent=money(hourly);
    q("sh-daily").textContent=money(daily);
    q("sh-weekly").textContent=money(weekly);
    q("sh-biweekly").textContent=money(biweekly);
    q("sh-monthly").textContent=money(monthly);
    q("sh-annual-hours").textContent=number(annualHours);
    q("sh-formula").textContent=money(salary)+" ÷ ("+number(hours)+" hours × "+number(weeks)+" paid weeks = "+number(annualHours)+" annual hours) = "+money(hourly)+"/hour";
    q("sh-status").textContent="Valid gross conversion. Weekly and biweekly equivalents use the paid weeks entered; monthly is annual salary ÷ 12. Currency changes formatting only.";

    lastSummary=[
      "Salary to hourly conversion",
      "Currency format: "+q("sh-currency").value+" (formatting only; no FX conversion)",
      "Annual gross salary: "+money(salary),
      "Hours per paid workweek: "+number(hours),
      "Paid weeks per year: "+number(weeks),
      "Workdays per week: "+days,
      "Annual paid hours: "+number(annualHours),
      "Hourly equivalent: "+money(hourly),
      "Daily equivalent: "+money(daily),
      "Weekly equivalent: "+money(weekly),
      "Biweekly equivalent (2 paid weeks): "+money(biweekly),
      "Average monthly equivalent: "+money(monthly)
    ].join("\n");
  }

  root.addEventListener("input",calc);
  root.addEventListener("change",calc);

  q("sh-example").addEventListener("click",()=>{
    q("sh-salary").value="60000";
    q("sh-hours").value="37.5";
    q("sh-weeks").value="52";
    q("sh-days").value="5";
    q("sh-currency").value="USD";
    calc();
  });

  q("sh-copy").addEventListener("click",async()=>{
    if(!lastSummary){
      q("sh-status").textContent="Enter valid values before copying the result.";
      return;
    }
    try{
      await navigator.clipboard.writeText(lastSummary);
      q("sh-status").textContent="Salary-to-hourly breakdown copied.";
    }catch{
      q("sh-status").textContent="Copy is unavailable in this browser. You can print the visible result instead.";
    }
  });

  q("sh-print").addEventListener("click",()=>window.print());

  q("sh-reset").addEventListener("click",()=>{
    q("sh-salary").value="52000";
    q("sh-hours").value="40";
    q("sh-weeks").value="52";
    q("sh-days").value="5";
    q("sh-currency").value="USD";
    calc();
  });

  calc();
})();
