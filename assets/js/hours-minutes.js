(()=>{
  const root=document.querySelector("[data-hours-minutes]");
  if(!root)return;

  const $=s=>root.querySelector(s)||document.querySelector(s);
  const MAX_DURATIONS=10;
  const MAX_HOURS=Math.floor(Number.MAX_SAFE_INTEGER/60);
  const resultIds=["hm-total-minutes","hm-decimal","hm-hours-display"];
  const modeLabels={convert:"Convert one duration",add:"Add two durations",subtract:"Subtract second duration",multi:"Add/subtract multiple durations"};
  let nextExtraIndex=3,lastTotalMinutes=null,lastDecimal=null,lastSummary="";

  const money=(v,c)=>new Intl.NumberFormat("en-US",{style:"currency",currency:c,maximumFractionDigits:2}).format(v);
  const decimalText=v=>{
    const [whole,fraction]=v.toFixed(4).split(".");
    const trimmed=fraction.replace(/0+$/,"").padEnd(2,"0");
    return whole+"."+trimmed;
  };
  const durationText=minutes=>{
    const sign=minutes<0?"-":"",abs=Math.abs(minutes),hours=Math.floor(abs/60),mins=abs%60;
    return sign+hours+"h "+String(mins).padStart(2,"0")+"m";
  };

  function setField(input,error,message=""){
    const invalid=Boolean(message);
    input.setAttribute("aria-invalid",String(invalid));
    error.textContent=message;
    error.hidden=!invalid;
    return !invalid;
  }

  function clearField(inputId,errorId){
    const input=$("#"+inputId),error=$("#"+errorId);
    if(input&&error)setField(input,error);
  }

  function parseWhole(inputId,errorId,label,{min=0,max=MAX_HOURS}={}){
    const input=$("#"+inputId),error=$("#"+errorId),raw=input.value.trim();
    if(raw===""){setField(input,error,label+" is required.");return null}
    const value=Number(raw);
    if(!Number.isFinite(value)){setField(input,error,"Enter a valid "+label.toLowerCase()+".");return null}
    if(!Number.isInteger(value)){setField(input,error,label+" must be a whole number.");return null}
    if(value<min||value>max){
      const range=max===59?" from 0 to 59":" at or above 0";
      setField(input,error,label+" must be"+range+".");
      return null;
    }
    setField(input,error);
    return value;
  }

  function parseDuration(hoursId,hoursErrorId,minutesId,minutesErrorId,label){
    const hours=parseWhole(hoursId,hoursErrorId,label+" hours");
    const minutes=parseWhole(minutesId,minutesErrorId,label+" minutes",{min:0,max:59});
    if(hours===null||minutes===null)return null;
    const total=hours*60+minutes;
    if(!Number.isSafeInteger(total)){
      setField($("#"+hoursId),$("#"+hoursErrorId),label+" hours is too large to calculate safely.");
      return null;
    }
    return {hours,minutes,total};
  }

  function parseOptionalRate(){
    const input=$("#hm-rate"),error=$("#hm-rate-error"),raw=input.value.trim();
    if(raw===""){setField(input,error);return {valid:true,value:null}}
    const value=Number(raw);
    if(!Number.isFinite(value)||value<0){
      setField(input,error,"Hourly rate must be a finite number at or above 0.");
      return {valid:false,value:null};
    }
    setField(input,error);
    return {valid:true,value};
  }

  function clearCoreResults(message){
    resultIds.forEach(id=>$("#"+id).textContent="—");
    $("#hm-pay").textContent="—";
    $("#hm-formula").textContent="Fix the highlighted duration inputs to calculate.";
    $("#hm-status").textContent=message||"Check the highlighted inputs before using the result.";
    lastTotalMinutes=null;lastDecimal=null;lastSummary="";
  }

  function clearExtraErrors(){
    root.querySelectorAll("[data-hm-extra-row]").forEach(row=>{
      const idx=row.dataset.rowIndex;
      clearField("hm-extra-"+idx+"-hours","hm-extra-"+idx+"-hours-error");
      clearField("hm-extra-"+idx+"-minutes","hm-extra-"+idx+"-minutes-error");
    });
  }

  function syncVisibility(){
    const mode=$("#hm-mode").value,needsSecond=mode!=="convert",multi=mode==="multi";
    root.querySelectorAll("[data-hm-second]").forEach(el=>el.hidden=!needsSecond);
    root.querySelectorAll("[data-hm-multi-op]").forEach(el=>el.hidden=!multi);
    $("#hm-extra-wrap").hidden=!multi;
    if(!needsSecond){
      clearField("hm-hours-2","hm-hours-2-error");
      clearField("hm-minutes-2","hm-minutes-2-error");
    }
    if(!multi)clearExtraErrors();
  }

  function operationSign(op){return op==="subtract"?-1:1}

  function addExtraRow(hours=0,minutes=0,op="add"){
    const existing=root.querySelectorAll("[data-hm-extra-row]").length;
    if(existing+2>=MAX_DURATIONS){
      $("#hm-status").textContent="Multi-duration mode supports up to "+MAX_DURATIONS+" durations total.";
      return null;
    }
    const idx=nextExtraIndex++;
    const row=document.createElement("div");
    row.className="settings-grid";
    row.dataset.hmExtraRow="";
    row.dataset.rowIndex=String(idx);
    row.innerHTML='<label><span>Duration '+idx+' operation</span><select id="hm-extra-'+idx+'-op"><option value="add">Add (+)</option><option value="subtract">Subtract (−)</option></select></label>'+
      '<label><span>Duration '+idx+' hours</span><input id="hm-extra-'+idx+'-hours" type="number" min="0" step="1" value="'+hours+'" aria-describedby="hm-extra-'+idx+'-hours-error" aria-invalid="false"><small class="field-error" id="hm-extra-'+idx+'-hours-error" hidden></small></label>'+
      '<label><span>Duration '+idx+' minutes</span><input id="hm-extra-'+idx+'-minutes" type="number" min="0" max="59" step="1" value="'+minutes+'" aria-describedby="hm-extra-'+idx+'-minutes-error" aria-invalid="false"><small class="field-error" id="hm-extra-'+idx+'-minutes-error" hidden></small></label>'+
      '<div class="actions no-print"><button class="button button-ghost" type="button" data-hm-remove-row aria-label="Remove duration '+idx+'">Remove duration</button></div>';
    row.querySelector("select").value=op;
    row.querySelector("[data-hm-remove-row]").addEventListener("click",()=>{row.remove();updateAddRowState();calc()});
    $("#hm-extra-rows").appendChild(row);
    updateAddRowState();
    return row;
  }

  function updateAddRowState(){
    const count=2+root.querySelectorAll("[data-hm-extra-row]").length;
    $("#hm-add-row").disabled=count>=MAX_DURATIONS;
  }

  function calc(){
    syncVisibility();
    const mode=$("#hm-mode").value,currency=$("#hm-currency").value;
    const first=parseDuration("hm-hours","hm-hours-error","hm-minutes","hm-minutes-error","First");
    let totalMinutes=first?first.total:null,formula="",durationParts=[];

    if(first)durationParts.push(first.total);

    if(mode!=="convert"){
      const second=parseDuration("hm-hours-2","hm-hours-2-error","hm-minutes-2","hm-minutes-2-error","Second");
      if(!second)totalMinutes=null;
      else if(totalMinutes!==null){
        const op=mode==="add"?"add":mode==="subtract"?"subtract":$("#hm-op-2").value;
        totalMinutes+=operationSign(op)*second.total;
        durationParts.push(operationSign(op)*second.total);
      }
    }

    if(mode==="multi"){
      for(const row of root.querySelectorAll("[data-hm-extra-row]")){
        const idx=row.dataset.rowIndex;
        const duration=parseDuration("hm-extra-"+idx+"-hours","hm-extra-"+idx+"-hours-error","hm-extra-"+idx+"-minutes","hm-extra-"+idx+"-minutes-error","Duration "+idx);
        if(!duration){totalMinutes=null;continue}
        if(totalMinutes!==null){
          const sign=operationSign($("#hm-extra-"+idx+"-op").value);
          totalMinutes+=sign*duration.total;
          durationParts.push(sign*duration.total);
        }
      }
    }

    if(totalMinutes!==null&&!Number.isSafeInteger(totalMinutes)){
      clearCoreResults("The combined duration is too large to calculate safely in this browser.");
      return;
    }

    const rate=parseOptionalRate();
    if(totalMinutes===null){clearCoreResults();return}

    const decimal=totalMinutes/60;
    $("#hm-total-minutes").textContent=String(totalMinutes);
    $("#hm-decimal").textContent=decimalText(decimal);
    $("#hm-hours-display").textContent=durationText(totalMinutes);

    let payText="—",paySummary="Not entered";
    if(rate.valid&&rate.value!==null){
      const pay=decimal*rate.value;
      if(Number.isFinite(pay)){
        payText=money(pay,currency);
        paySummary=payText+" at "+money(rate.value,currency)+"/hour";
      }else{
        setField($("#hm-rate"),$("#hm-rate-error"),"Rate × duration result is too large to format.");
      }
    }
    $("#hm-pay").textContent=payText;

    if(mode==="convert")formula=first.hours+" × 60 + "+first.minutes+" = "+totalMinutes+" minutes";
    else if(mode==="add")formula="("+first.hours+" × 60 + "+first.minutes+") + ("+$("#hm-hours-2").value+" × 60 + "+$("#hm-minutes-2").value+") = "+totalMinutes+" minutes";
    else if(mode==="subtract")formula="("+first.hours+" × 60 + "+first.minutes+") − ("+$("#hm-hours-2").value+" × 60 + "+$("#hm-minutes-2").value+") = "+totalMinutes+" minutes";
    else formula=durationParts.map((v,i)=>i===0?String(v):(v<0?"− "+Math.abs(v):"+ "+v)).join(" ")+" = "+totalMinutes+" minutes";
    $("#hm-formula").textContent=formula;

    const rateProblem=!rate.valid||$("#hm-rate").getAttribute("aria-invalid")==="true";
    $("#hm-status").textContent=rateProblem
      ?"Duration result is valid. Fix the hourly rate to calculate the optional rate × time estimate."
      :"Valid duration. Estimated pay uses the unrounded minute-derived value; currency formatting does not perform FX conversion.";

    lastTotalMinutes=totalMinutes;
    lastDecimal=decimalText(decimal);
    lastSummary=[
      "Hours and minutes calculation: "+modeLabels[mode],
      "Hours and minutes: "+durationText(totalMinutes),
      "Total minutes: "+totalMinutes,
      "Decimal hours: "+lastDecimal,
      "Rate × time estimate: "+(rateProblem?"Unavailable — fix hourly rate":paySummary),
      "Currency format: "+currency+" (formatting only; no FX conversion)"
    ].join("\n");
  }

  async function copyValue(value,success){
    if(value===null||value===""){$("#hm-status").textContent="Enter valid duration values before copying the result.";return}
    try{await navigator.clipboard.writeText(String(value));$("#hm-status").textContent=success}
    catch{$("#hm-status").textContent="Copy was unavailable in this browser. Select the visible result instead."}
  }

  root.addEventListener("input",calc);
  root.addEventListener("change",calc);
  $("#hm-add-row").addEventListener("click",()=>{if(addExtraRow(0,0,"add"))calc()});
  $("#hm-copy-minutes").addEventListener("click",()=>copyValue(lastTotalMinutes,"Total minutes copied to clipboard."));
  $("#hm-copy-decimal").addEventListener("click",()=>copyValue(lastDecimal,"Decimal hours copied to clipboard."));
  $("#hm-copy-result").addEventListener("click",()=>copyValue(lastSummary,"Result copied to clipboard."));
  $("#hm-example").addEventListener("click",()=>{
    $("#hm-mode").value="multi";
    $("#hm-hours").value="7";$("#hm-minutes").value="45";
    $("#hm-hours-2").value="8";$("#hm-minutes-2").value="20";$("#hm-op-2").value="add";
    $("#hm-rate").value="25";$("#hm-currency").value="USD";
    $("#hm-extra-rows").replaceChildren();nextExtraIndex=3;
    addExtraRow(6,10,"add");addExtraRow(0,30,"subtract");
    calc();
  });
  $("#hm-reset").addEventListener("click",()=>{
    $("#hm-mode").value="convert";
    $("#hm-hours").value="8";$("#hm-minutes").value="30";
    $("#hm-hours-2").value="1";$("#hm-minutes-2").value="20";$("#hm-op-2").value="add";
    $("#hm-rate").value="25";$("#hm-currency").value="USD";
    $("#hm-extra-rows").replaceChildren();nextExtraIndex=3;updateAddRowState();calc();
  });
  updateAddRowState();
  calc();
})();
