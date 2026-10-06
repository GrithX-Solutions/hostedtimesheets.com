(()=>{"use strict";
  const root=document.querySelector("[data-clock-out]");
  if(!root)return;
  const $=selector=>root.querySelector(selector)||document.querySelector(selector);
  const fields=[
    ["#co-start","#co-start-error"],
    ["#co-hours","#co-hours-error"],
    ["#co-minutes","#co-minutes-error"],
    ["#co-break","#co-break-error"],
    ["#co-extra-break","#co-extra-break-error"]
  ];
  const outputIds=["#co-time-12","#co-time-24","#co-day","#co-paid","#co-unpaid","#co-span"];

  const pad=n=>String(n).padStart(2,"0");
  const format24=m=>`${pad(Math.floor(m/60)%24)}:${pad(m%60)}`;
  const format12=m=>{
    const h24=Math.floor(m/60)%24;
    const minutes=m%60;
    const ampm=h24>=12?"PM":"AM";
    const hour=h24%12||12;
    return `${hour}:${pad(minutes)} ${ampm}`;
  };
  const spanText=m=>{
    const days=Math.floor(m/1440);
    const remainder=m%1440;
    const hours=Math.floor(remainder/60);
    const minutes=remainder%60;
    return `${days?days+"d ":""}${hours}h ${pad(minutes)}m`;
  };
  const breakText=m=>{
    const hours=Math.floor(m/60);
    const minutes=m%60;
    return hours?`${hours}h ${pad(minutes)}m`:`${minutes}m`;
  };

  function clearErrors(){
    for(const [fieldSelector,errorSelector] of fields){
      const field=$(fieldSelector),error=$(errorSelector);
      field?.setAttribute("aria-invalid","false");
      if(error){error.hidden=true;error.textContent="";}
    }
  }

  function setError(fieldSelector,errorSelector,message){
    const field=$(fieldSelector),error=$(errorSelector);
    field?.setAttribute("aria-invalid","true");
    if(error){error.textContent=message;error.hidden=false;}
  }

  function parseTime(){
    const field=$("#co-start");
    const value=field.value.trim();
    if(!value){
      setError("#co-start","#co-start-error","Enter a clock-in time.");
      return null;
    }
    const match=/^(\d{2}):(\d{2})$/.exec(value);
    if(!match){
      setError("#co-start","#co-start-error","Enter a valid clock-in time.");
      return null;
    }
    const hours=Number(match[1]),minutes=Number(match[2]);
    if(hours<0||hours>23||minutes<0||minutes>59){
      setError("#co-start","#co-start-error","Enter a valid clock-in time.");
      return null;
    }
    return hours*60+minutes;
  }

  function integerValue(fieldSelector,errorSelector,label,min,max,{optional=false}={}){
    const raw=$(fieldSelector)?.value.trim()??"";
    if(raw===""){
      if(optional)return 0;
      setError(fieldSelector,errorSelector,`Enter ${label.toLowerCase()}.`);
      return null;
    }
    const value=Number(raw);
    if(!Number.isFinite(value)||!Number.isInteger(value)){
      setError(fieldSelector,errorSelector,`${label} must be a whole number.`);
      return null;
    }
    if(value<min||value>max){
      setError(fieldSelector,errorSelector,`${label} must be between ${min} and ${max}.`);
      return null;
    }
    return value;
  }

  function clearResults(message="Fix the highlighted fields to calculate a clock-out time."){
    $("#co-time-12").textContent="—";
    $("#co-time-24").textContent="—";
    $("#co-day").textContent="—";
    $("#co-paid").textContent="—";
    $("#co-unpaid").textContent="—";
    $("#co-span").textContent="—";
    $("#co-formula").textContent="Enter valid values to see the clock-out formula.";
    $("#co-status").textContent=message;
  }

  function calc(){
    clearErrors();
    const start=parseTime();
    const hours=integerValue("#co-hours","#co-hours-error","Paid hours",0,72);
    const minutes=integerValue("#co-minutes","#co-minutes-error","Paid minutes",0,59);
    const primaryBreak=integerValue("#co-break","#co-break-error","Unpaid break",0,1440);
    const extraBreak=integerValue("#co-extra-break","#co-extra-break-error","Additional unpaid break",0,1440,{optional:true});
    if([start,hours,minutes,primaryBreak,extraBreak].some(value=>value===null)){
      clearResults();
      return;
    }

    const paidMinutes=hours*60+minutes;
    const totalBreak=primaryBreak+extraBreak;
    const span=paidMinutes+totalBreak;
    const absoluteFinish=start+span;
    const dayOffset=Math.floor(absoluteFinish/1440);
    const clock=((absoluteFinish%1440)+1440)%1440;

    $("#co-time-12").textContent=format12(clock);
    $("#co-time-24").textContent=format24(clock);
    $("#co-day").textContent=dayOffset===0?"Same day":dayOffset===1?"Next day":`${dayOffset} days later`;
    $("#co-paid").textContent=`${spanText(paidMinutes)} · ${(paidMinutes/60).toFixed(2)} h`;
    $("#co-unpaid").textContent=breakText(totalBreak);
    $("#co-span").textContent=spanText(span);

    const breakPhrase=totalBreak===0?"0m unpaid break":`${breakText(totalBreak)} unpaid break`;
    const suffix=dayOffset?" · "+$("#co-day").textContent:"";
    $("#co-formula").textContent=`${format12(start)} + ${spanText(paidMinutes)} paid work + ${breakPhrase} = ${format12(clock)}${suffix}`;
    $("#co-status").textContent="Clock-out time calculated from your paid-work target and unpaid breaks.";
  }

  function setValues(values){
    for(const [selector,value] of Object.entries(values))$(selector).value=String(value);
    calc();
  }

  function loadExample(kind){
    if(kind==="partial"){
      setValues({"#co-start":"09:00","#co-hours":7,"#co-minutes":30,"#co-break":0,"#co-extra-break":""});
    }else if(kind==="overnight"){
      setValues({"#co-start":"22:00","#co-hours":8,"#co-minutes":0,"#co-break":0,"#co-extra-break":""});
    }else{
      setValues({"#co-start":"08:30","#co-hours":8,"#co-minutes":0,"#co-break":30,"#co-extra-break":""});
    }
  }

  async function copySchedule(){
    if($("#co-time-12").textContent==="—"){
      $("#co-status").textContent="Enter valid values before copying the schedule.";
      return;
    }
    const text=[
      `Clock in: ${format12(parseTime())}`,
      `Paid work: ${$("#co-paid").textContent}`,
      `Unpaid break: ${$("#co-unpaid").textContent}`,
      `Total time at work: ${$("#co-span").textContent}`,
      `Clock out: ${$("#co-time-12").textContent} (${$("#co-time-24").textContent}) · ${$("#co-day").textContent}`
    ].join("\n");
    try{
      await navigator.clipboard.writeText(text);
      const button=$("#co-copy"),original=button.textContent;
      button.textContent="Copied";
      window.setTimeout(()=>{button.textContent=original;},1200);
    }catch{
      $("#co-status").textContent="Copy was unavailable in this browser. Your calculated values are still shown above.";
    }
  }

  root.addEventListener("input",event=>{if(event.target.matches("input,select"))calc();});
  root.addEventListener("change",event=>{if(event.target.matches("input,select"))calc();});

  root.querySelectorAll("[data-hours-preset]").forEach(button=>button.addEventListener("click",()=>{
    const value=Number(button.dataset.hoursPreset);
    $("#co-hours").value=String(Math.floor(value));
    $("#co-minutes").value=String(Math.round((value%1)*60));
    calc();
  }));

  root.querySelectorAll("[data-break-preset]").forEach(button=>button.addEventListener("click",()=>{
    $("#co-break").value=button.dataset.breakPreset;
    calc();
  }));

  $("#co-now").addEventListener("click",()=>{
    const now=new Date();
    $("#co-start").value=`${pad(now.getHours())}:${pad(now.getMinutes())}`;
    calc();
  });
  $("#co-example-standard").addEventListener("click",()=>loadExample("standard"));
  $("#co-example-partial").addEventListener("click",()=>loadExample("partial"));
  $("#co-example-overnight").addEventListener("click",()=>loadExample("overnight"));
  $("#co-reset").addEventListener("click",()=>loadExample("standard"));
  $("#co-copy").addEventListener("click",copySchedule);

  calc();
})();