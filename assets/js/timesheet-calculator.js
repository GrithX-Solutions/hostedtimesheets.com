(()=>{
  const SUPPORTED_INCREMENTS=new Set([1,5,6,10,15,30]);
  const SUPPORTED_MODES=new Set(["nearest","up","down"]);

  const parseTime=(value)=>{
    if(!value)return null;
    const match=/^(\d{1,2}):(\d{2})$/.exec(String(value));
    if(!match)return null;
    const hours=Number(match[1]),minutes=Number(match[2]);
    if(!Number.isInteger(hours)||!Number.isInteger(minutes)||hours<0||hours>23||minutes<0||minutes>59)return null;
    return hours*60+minutes;
  };

  const decimalHours=(minutes)=>{
    const raw=(minutes/60).toFixed(4);
    const parts=raw.split(".");
    let decimals=(parts[1]||"").replace(/0+$/,"");
    decimals=decimals.padEnd(2,"0");
    return parts[0]+"."+decimals;
  };

  const formatDuration=(minutes)=>{
    const rounded=Math.max(0,Math.round(minutes));
    const hours=Math.floor(rounded/60),rest=rounded%60;
    return hours?(hours+"h"+(rest?" "+rest+"m":"")):(rest+"m");
  };

  const applyRounding=(minutes,increment,mode)=>{
    const inc=SUPPORTED_INCREMENTS.has(Number(increment))?Number(increment):1;
    const selected=SUPPORTED_MODES.has(mode)?mode:"nearest";
    if(inc<=1)return minutes;
    const quotient=minutes/inc;
    if(selected==="up")return Math.ceil(quotient)*inc;
    if(selected==="down")return Math.floor(quotient)*inc;
    return Math.round(quotient)*inc;
  };

  const readNonNegative=(value,{optional=false,integer=false}={})=>{
    if(value===null||value===undefined||String(value).trim()===""){
      return optional?{valid:true,value:null,blank:true}:{valid:false,value:null,blank:true};
    }
    const number=Number(value);
    if(!Number.isFinite(number)||number<0||(integer&&!Number.isInteger(number))){
      return {valid:false,value:null,blank:false};
    }
    return {valid:true,value:number,blank:false};
  };

  const evaluateRow=({start="",end="",breakValue="",increment=1,mode="nearest"}={})=>{
    const hasStart=String(start).trim()!=="";
    const hasEnd=String(end).trim()!=="";
    if(!hasStart&&!hasEnd){
      return {status:"empty",valid:true,workedMinutes:0,breakMinutes:0,message:""};
    }
    if(hasStart!==hasEnd){
      return {status:"incomplete",valid:false,workedMinutes:null,breakMinutes:null,message:"Enter both clock in and clock out."};
    }
    const startMinutes=parseTime(start),endMinutes=parseTime(end);
    if(startMinutes===null||endMinutes===null){
      return {status:"invalid",valid:false,workedMinutes:null,breakMinutes:null,message:"Enter valid clock-in and clock-out times."};
    }
    if(startMinutes===endMinutes){
      return {status:"ambiguous",valid:false,workedMinutes:null,breakMinutes:null,message:"Clock in and clock out are the same. Enter the intended shift times."};
    }
    let grossMinutes=endMinutes-startMinutes;
    if(grossMinutes<0)grossMinutes+=1440;

    const breakInput=readNonNegative(breakValue,{optional:true,integer:true});
    if(!breakInput.valid){
      return {status:"invalid-break",valid:false,workedMinutes:null,breakMinutes:null,message:"Enter unpaid break minutes as a whole number of 0 or more."};
    }
    const breakMinutes=breakInput.value===null?0:breakInput.value;
    if(breakMinutes>grossMinutes){
      return {status:"break-overrun",valid:false,workedMinutes:null,breakMinutes:null,message:"Unpaid break cannot exceed the shift length."};
    }

    const rawNetMinutes=grossMinutes-breakMinutes;
    const workedMinutes=applyRounding(rawNetMinutes,increment,mode);
    return {status:"valid",valid:true,workedMinutes,breakMinutes,grossMinutes,rawNetMinutes,message:""};
  };

  const summarize=(rowResults,{threshold="",rate="",multiplier=""}={})=>{
    const validRows=rowResults.filter(row=>row.status==="valid");
    const totalMinutes=validRows.reduce((sum,row)=>sum+row.workedMinutes,0);
    const totalBreakMinutes=validRows.reduce((sum,row)=>sum+row.breakMinutes,0);
    const invalidRows=rowResults.filter(row=>!row.valid).length;

    const thresholdInput=readNonNegative(threshold);
    const rateInput=readNonNegative(rate,{optional:true});
    const multiplierInput=readNonNegative(multiplier);

    let regularMinutes=null,overtimeMinutes=null,grossPay=null;
    if(thresholdInput.valid){
      const thresholdMinutes=thresholdInput.value*60;
      regularMinutes=Math.min(totalMinutes,thresholdMinutes);
      overtimeMinutes=Math.max(0,totalMinutes-thresholdMinutes);
      if(rateInput.valid&&rateInput.value!==null&&multiplierInput.valid){
        grossPay=(regularMinutes/60*rateInput.value)+(overtimeMinutes/60*rateInput.value*multiplierInput.value);
      }
    }

    return {
      totalMinutes,totalBreakMinutes,invalidRows,
      thresholdInput,rateInput,multiplierInput,
      regularMinutes,overtimeMinutes,grossPay
    };
  };

  const api={parseTime,decimalHours,formatDuration,applyRounding,readNonNegative,evaluateRow,summarize};
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(typeof document==="undefined")return;

  const rows=[...document.querySelectorAll("[data-day-row]")];
  if(!rows.length)return;
  const $=selector=>document.querySelector(selector);
  const calculator=$("[data-calculator]");
  const statusEl=$("#calculator-status");
  let transientStatus="";

  const money=(value,currency)=>new Intl.NumberFormat("en-US",{
    style:"currency",currency,minimumFractionDigits:2,maximumFractionDigits:2
  }).format(value);

  const setInvalid=(input,invalid)=>{
    if(!input)return;
    if(invalid)input.setAttribute("aria-invalid","true");
    else input.removeAttribute("aria-invalid");
  };

  const readRow=(row)=>{
    const start=row.querySelector("[data-start]");
    const end=row.querySelector("[data-end]");
    const breakInput=row.querySelector("[data-break]");
    return {
      start,end,breakInput,
      result:evaluateRow({
        start:start.value,
        end:end.value,
        breakValue:breakInput.value,
        increment:Number($("#rounding").value),
        mode:$("#rounding-mode").value
      })
    };
  };

  const renderRowState=(row,rowState)=>{
    const {start,end,breakInput,result}=rowState;
    const error=row.querySelector("[data-row-error]");
    const hours=row.querySelector("[data-hours]");
    setInvalid(start,false);setInvalid(end,false);setInvalid(breakInput,false);

    if(result.status==="incomplete"||result.status==="ambiguous"||result.status==="invalid"){
      setInvalid(start,true);setInvalid(end,true);
    }
    if(result.status==="invalid-break"||result.status==="break-overrun"){
      setInvalid(breakInput,true);
    }

    if(error){
      error.textContent=result.message||"";
      error.hidden=!result.message;
    }
    hours.textContent=result.status==="valid"?decimalHours(result.workedMinutes):"0.00";
    row.dataset.state=result.status;
  };

  function calc(){
    const rowStates=rows.map(row=>({row,...readRow(row)}));
    rowStates.forEach(item=>renderRowState(item.row,item));
    const summary=summarize(rowStates.map(item=>item.result),{
      threshold:$("#overtime-threshold").value,
      rate:$("#hourly-rate").value,
      multiplier:$("#overtime-multiplier").value
    });

    $("#total-hours").textContent=decimalHours(summary.totalMinutes);
    $("#summary-human").textContent=formatDuration(summary.totalMinutes);
    $("#summary-decimal").textContent=decimalHours(summary.totalMinutes)+" decimal hours";
    $("#total-break").textContent=formatDuration(summary.totalBreakMinutes);

    $("#regular-hours").textContent=summary.regularMinutes===null?"—":decimalHours(summary.regularMinutes);
    $("#overtime-hours").textContent=summary.overtimeMinutes===null?"—":decimalHours(summary.overtimeMinutes);
    $("#gross-pay").textContent=summary.grossPay===null?"—":money(summary.grossPay,$("#currency").value);

    const messages=[];
    if(summary.invalidRows){
      messages.push(summary.invalidRows+" "+(summary.invalidRows===1?"row needs":"rows need")+" attention. Totals exclude invalid rows.");
    }
    if(!summary.thresholdInput.valid){
      messages.push("Enter a non-negative overtime threshold to separate regular and overtime hours.");
    }
    if(!summary.rateInput.valid){
      messages.push("Hourly rate must be 0 or more, or leave it blank.");
    }else if(summary.rateInput.value===null){
      messages.push("Hourly rate is blank; hours are calculated but pay is not estimated.");
    }
    if(!summary.multiplierInput.valid){
      messages.push("Enter a non-negative overtime multiplier to estimate gross pay.");
    }
    if(transientStatus)messages.unshift(transientStatus);
    if(statusEl)statusEl.textContent=messages.join(" ");
    transientStatus="";

    return {rowStates,summary};
  }

  calculator.addEventListener("input",calc);
  calculator.addEventListener("change",calc);

  $("#load-example").addEventListener("click",()=>{
    rows.forEach((row,index)=>{
      row.querySelector("[data-start]").value=index<5?"09:00":"";
      row.querySelector("[data-end]").value=index<5?"17:30":"";
      row.querySelector("[data-break]").value=index<5?"30":"0";
    });
    calc();
  });

  $("#copy-monday").addEventListener("click",()=>{
    const monday=rows[0];
    const mondayState=readRow(monday);
    if(mondayState.result.status!=="valid"){
      transientStatus="Monday must contain a valid shift before it can be copied.";
      calc();
      return;
    }
    for(let index=1;index<=4;index++){
      rows[index].querySelector("[data-start]").value=mondayState.start.value;
      rows[index].querySelector("[data-end]").value=mondayState.end.value;
      rows[index].querySelector("[data-break]").value=mondayState.breakInput.value;
    }
    transientStatus="Copied Monday to Tuesday through Friday.";
    calc();
  });

  $("#reset-calculator").addEventListener("click",()=>{
    rows.forEach(row=>{
      row.querySelector("[data-start]").value="";
      row.querySelector("[data-end]").value="";
      row.querySelector("[data-break]").value="30";
    });
    $("#hourly-rate").value="25";
    $("#overtime-threshold").value="40";
    $("#overtime-multiplier").value="1.5";
    $("#rounding").value="1";
    $("#rounding-mode").value="nearest";
    transientStatus="";
    calc();
  });

  $("#print-result").addEventListener("click",()=>window.print());

  $("#download-csv").addEventListener("click",()=>{
    const {rowStates,summary}=calc();
    const data=[["Day","Clock In","Clock Out","Unpaid Break Minutes","Worked Minutes","Decimal Hours","Status"]];
    rowStates.forEach(({row,start,end,breakInput,result})=>{
      const worked=result.status==="valid"?String(result.workedMinutes):"";
      const decimal=result.status==="valid"?decimalHours(result.workedMinutes):"";
      data.push([
        row.dataset.day,start.value,end.value,breakInput.value,worked,decimal,
        result.status==="valid"?"Valid":result.status==="empty"?"Empty":result.message
      ]);
    });
    data.push([]);
    data.push(["TOTAL WORKED MINUTES","","","",""+summary.totalMinutes,"",""]);
    data.push(["TOTAL DECIMAL HOURS","","","","",decimalHours(summary.totalMinutes),""]);
    data.push(["TOTAL UNPAID BREAK MINUTES","","","",""+summary.totalBreakMinutes,"",""]);
    if(summary.regularMinutes!==null)data.push(["REGULAR HOURS","","","","",decimalHours(summary.regularMinutes),""]);
    if(summary.overtimeMinutes!==null)data.push(["OVERTIME HOURS","","","","",decimalHours(summary.overtimeMinutes),""]);
    if(summary.grossPay!==null)data.push(["ESTIMATED GROSS PAY","","","","",money(summary.grossPay,$("#currency").value),""]);

    const csv=data.map(record=>record.map(value=>'"'+String(value??"").replaceAll('"','""')+'"').join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.download="hostedtimesheets-time-card.csv";
    link.click();
    URL.revokeObjectURL(url);
  });

  calc();
})();