(()=>{
  const q=id=>document.getElementById(id),root=document.querySelector("[data-salary-bonus]");
  if(!root)return;

  const fields={
    salary:{id:"sb-salary",error:"sb-salary-error"},
    percent:{id:"sb-percent",error:"sb-percent-error"},
    fixed:{id:"sb-fixed",error:"sb-fixed-error"},
    target:{id:"sb-target",error:"sb-target-error"},
    hours:{id:"sb-hours",error:"sb-hours-error"},
    weeks:{id:"sb-weeks",error:"sb-weeks-error"}
  };
  const resultIds=["sb-total","sb-bonus","sb-bonus-pct","sb-monthly","sb-biweekly","sb-weekly","sb-base-hourly","sb-total-hourly"];
  const modeLabels={percent:"Percentage of salary",fixed:"Fixed annual bonus",target:"Target total compensation"};
  let lastSummary="";

  function money(v){
    const c=q("sb-currency").value||"USD";
    try{return new Intl.NumberFormat(undefined,{style:"currency",currency:c,maximumFractionDigits:2}).format(v)}
    catch{return v.toFixed(2)}
  }

  function setField(field,message=""){
    const input=q(field.id),error=q(field.error),invalid=Boolean(message);
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

  function toggle(mode){
    document.querySelectorAll("[data-percent-field]").forEach(el=>el.hidden=mode!=="percent");
    document.querySelectorAll("[data-fixed-field]").forEach(el=>el.hidden=mode!=="fixed");
    document.querySelectorAll("[data-target-field]").forEach(el=>el.hidden=mode!=="target");
  }

  function clearResults(){
    resultIds.forEach(id=>q(id).textContent="—");
    q("sb-formula").textContent="Fix the highlighted values to calculate salary with bonus.";
    lastSummary="";
  }

  function calc(){
    const mode=q("sb-mode").value;
    toggle(mode);

    const salary=parseRequired(fields.salary,"Base annual salary",{min:0});
    const hours=parseRequired(fields.hours,"Hours per week",{min:0.25,max:168});
    const weeks=parseRequired(fields.weeks,"Workweeks per year",{min:1,max:53,integer:true});

    let bonus=null,total=null,inputDetail="",formula="";

    if(mode==="percent"){
      const percent=parseRequired(fields.percent,"Bonus percentage",{min:0});
      if(salary!==null&&percent!==null){
        bonus=salary*percent/100;
        total=salary+bonus;
        inputDetail=percent.toFixed(2)+"% of base salary";
        formula=money(salary)+" × "+percent.toFixed(2)+"% = "+money(bonus)+" bonus; total "+money(total);
      }
    }else if(mode==="fixed"){
      const fixed=parseRequired(fields.fixed,"Bonus amount",{min:0});
      if(salary!==null&&fixed!==null){
        bonus=fixed;
        total=salary+bonus;
        inputDetail=money(fixed)+" fixed annual bonus";
        formula=money(salary)+" + "+money(bonus)+" bonus = "+money(total)+" total compensation";
      }
    }else if(mode==="target"){
      const target=parseRequired(fields.target,"Target total compensation",{min:0});
      if(salary!==null&&target!==null&&target<salary){
        setField(fields.target,"Target total compensation cannot be less than base annual salary.");
      }
      if(salary!==null&&target!==null&&target>=salary){
        bonus=target-salary;
        total=target;
        inputDetail=money(target)+" target total compensation";
        formula=money(target)+" target − "+money(salary)+" base salary = "+money(bonus)+" required bonus";
      }
    }

    const valid=[salary,hours,weeks,bonus,total].every(v=>v!==null);
    if(!valid){
      clearResults();
      q("sb-status").textContent="Check the highlighted inputs before using the result.";
      return;
    }

    const bonusPct=salary>0?bonus/salary*100:null;
    const annualHours=hours*weeks;
    q("sb-total").textContent=money(total);
    q("sb-bonus").textContent=money(bonus);
    q("sb-bonus-pct").textContent=bonusPct===null?"N/A":bonusPct.toFixed(2)+"%";
    q("sb-monthly").textContent=money(total/12);
    q("sb-biweekly").textContent=money(total/26);
    q("sb-weekly").textContent=money(total/52);
    q("sb-base-hourly").textContent=money(salary/annualHours);
    q("sb-total-hourly").textContent=money(total/annualHours);
    q("sb-formula").textContent=formula;
    q("sb-status").textContent=bonusPct===null&&bonus>0
      ?"Valid gross estimate. Bonus percentage is undefined because base salary is zero. Currency selection formats values only; no exchange-rate conversion is performed."
      :"Valid gross estimate. Currency selection formats values only; no exchange-rate conversion is performed.";

    lastSummary=[
      "Salary + bonus calculation: "+modeLabels[mode],
      "Currency format: "+q("sb-currency").value+" (formatting only; no FX conversion)",
      "Base annual salary: "+money(salary),
      "Mode input: "+inputDetail,
      "Annual bonus: "+money(bonus),
      "Bonus as % of base salary: "+(bonusPct===null?"N/A":bonusPct.toFixed(2)+"%"),
      "Total annual compensation: "+money(total),
      "Monthly equivalent: "+money(total/12),
      "Biweekly equivalent: "+money(total/26),
      "Weekly equivalent: "+money(total/52),
      "Base hourly equivalent: "+money(salary/annualHours),
      "Hourly including bonus: "+money(total/annualHours),
      "Hourly assumption: "+hours.toFixed(2)+" hours/week × "+weeks+" workweeks/year"
    ].join("\n");
  }

  root.addEventListener("input",calc);
  root.addEventListener("change",calc);
  q("sb-example").addEventListener("click",()=>{
    q("sb-salary").value="60000";
    q("sb-mode").value="percent";
    q("sb-percent").value="10";
    q("sb-fixed").value="6000";
    q("sb-target").value="90000";
    q("sb-hours").value="40";
    q("sb-weeks").value="52";
    q("sb-currency").value="USD";
    calc();
  });
  q("sb-copy").addEventListener("click",async()=>{
    if(!lastSummary){q("sb-status").textContent="Enter valid values before copying the result.";return}
    try{
      await navigator.clipboard.writeText(lastSummary);
      q("sb-status").textContent="Result copied to clipboard.";
    }catch{
      q("sb-status").textContent="Copy was unavailable in this browser. Select the visible results instead.";
    }
  });
  q("sb-reset").addEventListener("click",()=>{
    q("sb-salary").value="60000";
    q("sb-mode").value="percent";
    q("sb-percent").value="10";
    q("sb-fixed").value="6000";
    q("sb-target").value="90000";
    q("sb-hours").value="40";
    q("sb-weeks").value="52";
    q("sb-currency").value="USD";
    calc();
  });
  calc();
})();
