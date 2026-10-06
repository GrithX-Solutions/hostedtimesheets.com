(()=>{
  const root=document.querySelector("[data-overtime]");
  if(!root)return;
  const $=selector=>root.querySelector(selector)||document.querySelector(selector);
  const currencies=new Set(["USD","GBP","EUR","CAD","AUD","AED","SAR"]);
  const outputIds=["#ot-total-out","#ot-regular-hours","#ot-hours","#ot-double-hours","#ot-regular-pay","#ot-pay","#ot-double-pay","#ot-gross"];
  const errorFields=[
    ["#ot-rate","#ot-rate-error"],["#ot-multiplier","#ot-multiplier-error"],
    ["#ot-total","#ot-total-error"],["#ot-threshold","#ot-threshold-error"],
    ["#ot-regular-input","#ot-regular-input-error"],["#ot-overtime-input","#ot-overtime-input-error"],
    ["#ot-double-input","#ot-double-input-error"],["#ot-double-multiplier","#ot-double-multiplier-error"]
  ];

  const money=(value,currency)=>new Intl.NumberFormat("en-US",{style:"currency",currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
  const fixed=value=>value.toFixed(2);

  function clearErrors(){
    for(const [fieldSelector,errorSelector] of errorFields){
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

  function numberValue(fieldSelector,errorSelector,label,{positive=false}={}){
    const raw=$(fieldSelector)?.value.trim()??"";
    if(raw===""){
      setError(fieldSelector,errorSelector,`Enter ${label.toLowerCase()}.`);
      return null;
    }
    const value=Number(raw);
    if(!Number.isFinite(value)){
      setError(fieldSelector,errorSelector,`Enter a valid ${label.toLowerCase()}.`);
      return null;
    }
    if(positive?value<=0:value<0){
      setError(fieldSelector,errorSelector,positive?`${label} must be greater than zero.`:`${label} cannot be negative.`);
      return null;
    }
    return value;
  }

  function clearResults(message="Fix the highlighted fields to calculate overtime pay."){
    for(const id of outputIds)$(id).textContent="—";
    $("#ot-formula").textContent="Enter valid values to see the pay formula.";
    $("#ot-status").textContent=message;
  }

  function currentCurrency(){
    const value=$("#ot-currency").value;
    return currencies.has(value)?value:"USD";
  }

  function setModeVisibility(){
    const classified=$("#ot-mode").value==="classified";
    $("#ot-total-mode").hidden=classified;
    $("#ot-classified-mode").hidden=!classified;
  }

  function calc(){
    clearErrors();
    setModeVisibility();
    const mode=$("#ot-mode").value;
    const currency=currentCurrency();
    const rate=numberValue("#ot-rate","#ot-rate-error","Regular hourly rate");
    const overtimeMultiplier=numberValue("#ot-multiplier","#ot-multiplier-error","Overtime multiplier",{positive:true});
    if(rate===null||overtimeMultiplier===null){
      clearResults();
      return;
    }

    let totalHours=0,regularHours=0,overtimeHours=0,doubleTimeHours=0,doubleTimeMultiplier=0;
    if(mode==="classified"){
      const regular=numberValue("#ot-regular-input","#ot-regular-input-error","Regular hours");
      const overtime=numberValue("#ot-overtime-input","#ot-overtime-input-error","Overtime hours");
      const doubleTime=numberValue("#ot-double-input","#ot-double-input-error","Double-time hours");
      const doubleMultiplier=numberValue("#ot-double-multiplier","#ot-double-multiplier-error","Double-time multiplier",{positive:true});
      if([regular,overtime,doubleTime,doubleMultiplier].some(value=>value===null)){
        clearResults();
        return;
      }
      regularHours=regular;
      overtimeHours=overtime;
      doubleTimeHours=doubleTime;
      doubleTimeMultiplier=doubleMultiplier;
      totalHours=regularHours+overtimeHours+doubleTimeHours;
    }else{
      const total=numberValue("#ot-total","#ot-total-error","Total hours");
      const threshold=numberValue("#ot-threshold","#ot-threshold-error","Overtime threshold");
      if(total===null||threshold===null){
        clearResults();
        return;
      }
      totalHours=total;
      regularHours=Math.min(totalHours,threshold);
      overtimeHours=Math.max(0,totalHours-threshold);
      doubleTimeHours=0;
    }

    const overtimeRate=rate*overtimeMultiplier;
    const doubleTimeRate=doubleTimeHours>0?rate*doubleTimeMultiplier:0;
    const regularPay=regularHours*rate;
    const overtimePay=overtimeHours*overtimeRate;
    const doubleTimePay=doubleTimeHours*doubleTimeRate;
    const gross=regularPay+overtimePay+doubleTimePay;

    $("#ot-total-out").textContent=fixed(totalHours);
    $("#ot-regular-hours").textContent=fixed(regularHours);
    $("#ot-hours").textContent=fixed(overtimeHours);
    $("#ot-double-hours").textContent=fixed(doubleTimeHours);
    $("#ot-regular-pay").textContent=money(regularPay,currency);
    $("#ot-pay").textContent=money(overtimePay,currency);
    $("#ot-double-pay").textContent=money(doubleTimePay,currency);
    $("#ot-gross").textContent=money(gross,currency);

    const parts=[`${fixed(regularHours)} regular hrs × ${money(rate,currency)}`];
    if(overtimeHours>0)parts.push(`${fixed(overtimeHours)} overtime hrs × ${money(overtimeRate,currency)}`);
    if(doubleTimeHours>0)parts.push(`${fixed(doubleTimeHours)} double-time hrs × ${money(doubleTimeRate,currency)}`);
    $("#ot-formula").textContent=`${parts.join(" + ")} = ${money(gross,currency)}`;
    $("#ot-status").textContent=mode==="classified"
      ?"Gross pay calculated from the regular, overtime and double-time hours you classified."
      :"Overtime estimate calculated from total hours and your selected threshold.";
  }

  function setValues(values){
    for(const [id,value] of Object.entries(values))$(id).value=String(value);
    calc();
  }

  async function copyResult(){
    if($("#ot-gross").textContent==="—"){
      $("#ot-status").textContent="Enter valid values before copying the result.";
      return;
    }
    const text=[
      "Overtime calculator result",
      `Total hours: ${$("#ot-total-out").textContent}`,
      `Regular hours: ${$("#ot-regular-hours").textContent}`,
      `Overtime hours: ${$("#ot-hours").textContent}`,
      `Double-time hours: ${$("#ot-double-hours").textContent}`,
      `Regular pay: ${$("#ot-regular-pay").textContent}`,
      `Overtime pay: ${$("#ot-pay").textContent}`,
      `Double-time pay: ${$("#ot-double-pay").textContent}`,
      `Estimated gross pay: ${$("#ot-gross").textContent}`,
      $("#ot-formula").textContent
    ].join("\n");
    try{
      await navigator.clipboard.writeText(text);
      const button=$("#ot-copy"),original=button.textContent;
      button.textContent="Copied";
      window.setTimeout(()=>{button.textContent=original;},1200);
    }catch{
      $("#ot-status").textContent="Copy was unavailable in this browser. Your calculated values are still shown above.";
    }
  }

  root.addEventListener("input",event=>{
    if(event.target.matches("input,select"))calc();
  });
  root.addEventListener("change",event=>{
    if(event.target.matches("input,select"))calc();
  });
  $("#ot-example").addEventListener("click",()=>{
    $("#ot-mode").value="total";
    setValues({"#ot-total":45,"#ot-rate":25,"#ot-threshold":40,"#ot-multiplier":1.5,"#ot-currency":"USD"});
  });
  $("#ot-double-example").addEventListener("click",()=>{
    $("#ot-mode").value="classified";
    setValues({"#ot-regular-input":40,"#ot-overtime-input":5,"#ot-double-input":2,"#ot-rate":25,"#ot-multiplier":1.5,"#ot-double-multiplier":2,"#ot-currency":"USD"});
  });
  $("#ot-reset").addEventListener("click",()=>{
    $("#ot-mode").value="total";
    setValues({"#ot-total":40,"#ot-rate":25,"#ot-threshold":40,"#ot-multiplier":1.5,"#ot-regular-input":40,"#ot-overtime-input":5,"#ot-double-input":0,"#ot-double-multiplier":2,"#ot-currency":"USD"});
  });
  $("#ot-copy").addEventListener("click",copyResult);
  calc();
})();