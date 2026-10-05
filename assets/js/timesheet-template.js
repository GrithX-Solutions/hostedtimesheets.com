(()=>{
  const MAX_ROWS=14;
  const WEEK_DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const parseTime=value=>{
    if(!value)return null;
    const match=/^(\d{1,2}):(\d{2})$/.exec(String(value));
    if(!match)return null;
    const hours=Number(match[1]);
    const minutes=Number(match[2]);
    if(!Number.isInteger(hours)||!Number.isInteger(minutes)||hours<0||hours>23||minutes<0||minutes>59)return null;
    return hours*60+minutes;
  };

  const parseDate=value=>{
    if(!value)return null;
    const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    if(!match)return null;
    const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
    const date=new Date(year,month-1,day);
    if(date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day)return null;
    return date;
  };

  const toIsoDate=date=>{
    const year=date.getFullYear();
    const month=String(date.getMonth()+1).padStart(2,"0");
    const day=String(date.getDate()).padStart(2,"0");
    return year+"-"+month+"-"+day;
  };

  const dateInfo=(periodStart,index)=>{
    const start=parseDate(periodStart);
    if(!start){
      return {iso:"",dayLabel:"Day "+(index+1),dateLabel:""};
    }
    const date=new Date(start.getFullYear(),start.getMonth(),start.getDate());
    date.setDate(date.getDate()+index);
    return {
      iso:toIsoDate(date),
      dayLabel:WEEK_DAYS[date.getDay()],
      dateLabel:new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(date)
    };
  };

  const visibleRowCount=type=>type==="biweekly"?14:7;

  const createModel=()=>Array.from({length:MAX_ROWS},()=>({
    start:"",
    end:"",
    breakValue:"0"
  }));

  const readBreak=value=>{
    if(value===null||value===undefined||String(value).trim()===""){
      return {valid:true,value:0};
    }
    const number=Number(value);
    if(!Number.isFinite(number)||number<0||!Number.isInteger(number)){
      return {valid:false,value:null};
    }
    return {valid:true,value:number};
  };

  const evaluateRow=(row={})=>{
    const start=String(row.start??"").trim();
    const end=String(row.end??"").trim();
    const hasStart=start!=="";
    const hasEnd=end!=="";

    if(!hasStart&&!hasEnd){
      return {status:"empty",valid:true,grossMinutes:0,breakMinutes:0,netMinutes:0,message:""};
    }
    if(hasStart!==hasEnd){
      return {status:"incomplete",valid:false,grossMinutes:null,breakMinutes:null,netMinutes:null,message:"Enter both clock in and clock out."};
    }

    const startMinutes=parseTime(start);
    const endMinutes=parseTime(end);
    if(startMinutes===null||endMinutes===null){
      return {status:"invalid-time",valid:false,grossMinutes:null,breakMinutes:null,netMinutes:null,message:"Enter valid clock-in and clock-out times."};
    }
    if(startMinutes===endMinutes){
      return {status:"equal-punches",valid:false,grossMinutes:null,breakMinutes:null,netMinutes:null,message:"Clock in and clock out are the same. Enter the intended shift times."};
    }

    let grossMinutes=endMinutes-startMinutes;
    if(grossMinutes<0)grossMinutes+=1440;

    const breakInput=readBreak(row.breakValue);
    if(!breakInput.valid){
      return {status:"invalid-break",valid:false,grossMinutes,breakMinutes:null,netMinutes:null,message:"Break minutes must be a whole number of 0 or more."};
    }
    if(breakInput.value>grossMinutes){
      return {status:"break-overrun",valid:false,grossMinutes,breakMinutes:breakInput.value,netMinutes:null,message:"Break minutes cannot exceed the shift length."};
    }

    return {
      status:"valid",
      valid:true,
      grossMinutes,
      breakMinutes:breakInput.value,
      netMinutes:grossMinutes-breakInput.value,
      message:""
    };
  };

  const formatMinutes=minutes=>{
    const value=Math.max(0,Math.round(Number(minutes)||0));
    const hours=Math.floor(value/60);
    const rest=value%60;
    return hours+"h "+String(rest).padStart(2,"0")+"m";
  };

  const decimalHours=minutes=>(Math.max(0,Number(minutes)||0)/60).toFixed(4);

  const summarize=(model,type)=>{
    const count=visibleRowCount(type);
    const results=model.slice(0,count).map(evaluateRow);
    const week1Minutes=results.slice(0,7).reduce((sum,result)=>sum+(result.status==="valid"?result.netMinutes:0),0);
    const week2Minutes=type==="biweekly"
      ?results.slice(7,14).reduce((sum,result)=>sum+(result.status==="valid"?result.netMinutes:0),0)
      :0;
    return {
      results,
      week1Minutes,
      week2Minutes,
      totalMinutes:week1Minutes+week2Minutes,
      validRows:results.filter(result=>result.status==="valid").length,
      invalidRows:results.filter(result=>!result.valid).length
    };
  };

  const csvEscape=value=>'"'+String(value??"").replaceAll('"','""')+'"';

  const buildCsv=({employee="",company="",periodStart="",type="weekly",model=createModel()}={})=>{
    const count=visibleRowCount(type);
    const rows=[
      ["Employee",employee],
      ["Company",company],
      ["Period Start",periodStart],
      ["Template Type",type==="biweekly"?"Biweekly":"Weekly"],
      [],
      ["Week","Date","Day","Clock In","Clock Out","Break Minutes","Net Minutes","Decimal Hours"]
    ];

    for(let index=0;index<count;index++){
      const entry=model[index]||{start:"",end:"",breakValue:"0"};
      const info=dateInfo(periodStart,index);
      const result=evaluateRow(entry);
      const breakValue=String(entry.breakValue??"").trim()===""?"0":String(entry.breakValue);
      rows.push([
        String(Math.floor(index/7)+1),
        info.iso,
        info.dayLabel,
        entry.start||"",
        entry.end||"",
        breakValue,
        result.status==="valid"?String(result.netMinutes):"",
        result.status==="valid"?decimalHours(result.netMinutes):""
      ]);
    }

    return rows.map(row=>row.map(csvEscape).join(",")).join("\n");
  };

  const api={
    parseTime,parseDate,toIsoDate,dateInfo,visibleRowCount,createModel,readBreak,
    evaluateRow,formatMinutes,decimalHours,summarize,csvEscape,buildCsv
  };
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(typeof document==="undefined")return;

  const root=document.querySelector("[data-template]");
  if(!root)return;

  const $=selector=>document.querySelector(selector);
  const tbody=$("#tt-body");
  const model=createModel();

  const setInvalid=(input,invalid)=>{
    if(!input)return;
    if(invalid)input.setAttribute("aria-invalid","true");
    else input.removeAttribute("aria-invalid");
  };

  const rowMarkup=(index,type,periodStart)=>{
    const entry=model[index];
    const info=dateInfo(periodStart,index);
    const errorId="tt-row-error-"+index;
    return `<tr data-template-row data-index="${index}" data-state="empty">
      <td data-date>${info.dateLabel||"—"}</td>
      <td><span data-day>${info.dayLabel}</span><small class="tt-row-error" id="${errorId}" data-row-error hidden></small></td>
      <td><input aria-label="${info.dayLabel} clock in" aria-describedby="${errorId}" data-field="start" type="time" value="${entry.start}"></td>
      <td><input aria-label="${info.dayLabel} clock out" aria-describedby="${errorId}" data-field="end" type="time" value="${entry.end}"></td>
      <td><input aria-label="${info.dayLabel} break minutes" aria-describedby="${errorId}" data-field="breakValue" type="number" min="0" step="1" value="${entry.breakValue}"></td>
      <td class="hours-output" data-hours>—</td>
    </tr>`;
  };

  const renderRows=()=>{
    const type=$("#tt-type").value;
    const count=visibleRowCount(type);
    const periodStart=$("#tt-start").value;
    let html="";

    for(let index=0;index<count;index++){
      if(type==="biweekly"&&(index===0||index===7)){
        html+=`<tr class="tt-week-heading"><th colspan="6" scope="rowgroup">Week ${index===0?1:2}</th></tr>`;
      }
      html+=rowMarkup(index,type,periodStart);
    }
    tbody.innerHTML=html;

    for(let index=0;index<count;index++)refreshRow(index);
    renderTotals();
    updatePrintMeta();
  };

  const refreshRow=index=>{
    const tr=tbody.querySelector(`[data-template-row][data-index="${index}"]`);
    if(!tr)return;
    const result=evaluateRow(model[index]);
    const error=tr.querySelector("[data-row-error]");
    const hours=tr.querySelector("[data-hours]");
    const start=tr.querySelector('[data-field="start"]');
    const end=tr.querySelector('[data-field="end"]');
    const breakInput=tr.querySelector('[data-field="breakValue"]');

    setInvalid(start,false);
    setInvalid(end,false);
    setInvalid(breakInput,false);

    if(["incomplete","invalid-time","equal-punches"].includes(result.status)){
      setInvalid(start,true);
      setInvalid(end,true);
    }
    if(["invalid-break","break-overrun"].includes(result.status)){
      setInvalid(breakInput,true);
    }

    tr.dataset.state=result.status;
    error.textContent=result.message;
    error.hidden=!result.message;
    hours.textContent=result.status==="valid"?formatMinutes(result.netMinutes):"—";
  };

  const renderTotals=()=>{
    const type=$("#tt-type").value;
    const summary=summarize(model,type);
    const week1Card=$("#tt-week1-card");
    const week2Card=$("#tt-week2-card");
    const totalLabel=$("#tt-total-label");

    $("#tt-total").textContent=formatMinutes(summary.totalMinutes);
    $("#tt-week1").textContent=formatMinutes(summary.week1Minutes);
    $("#tt-week2").textContent=formatMinutes(summary.week2Minutes);
    $("#tt-valid-rows").textContent=String(summary.validRows);

    if(type==="biweekly"){
      totalLabel.textContent="Biweekly total";
      week1Card.hidden=false;
      week2Card.hidden=false;
    }else{
      totalLabel.textContent="Weekly total";
      week1Card.hidden=true;
      week2Card.hidden=true;
    }

    const status=$("#tt-status");
    status.textContent=summary.invalidRows
      ?summary.invalidRows+" "+(summary.invalidRows===1?"row needs":"rows need")+" attention. Totals exclude invalid or incomplete rows."
      :"";
  };

  const updatePrintMeta=()=>{
    $("#tt-print-type").textContent=$("#tt-type").value==="biweekly"?"Biweekly":"Weekly";
    $("#tt-print-employee").textContent=$("#tt-employee").value.trim()||"—";
    $("#tt-print-company").textContent=$("#tt-company").value.trim()||"—";
    $("#tt-print-start").textContent=$("#tt-start").value||"—";
  };

  tbody.addEventListener("input",event=>{
    const input=event.target.closest("[data-field]");
    if(!input)return;
    const tr=input.closest("[data-template-row]");
    if(!tr)return;
    const index=Number(tr.dataset.index);
    model[index][input.dataset.field]=input.value;
    refreshRow(index);
    renderTotals();
  });

  $("#tt-type").addEventListener("change",renderRows);
  $("#tt-start").addEventListener("change",renderRows);
  $("#tt-employee").addEventListener("input",updatePrintMeta);
  $("#tt-company").addEventListener("input",updatePrintMeta);

  $("#tt-print").addEventListener("click",()=>{
    updatePrintMeta();
    window.print();
  });

  $("#tt-csv").addEventListener("click",()=>{
    const type=$("#tt-type").value;
    const csv=buildCsv({
      employee:$("#tt-employee").value,
      company:$("#tt-company").value,
      periodStart:$("#tt-start").value,
      type,
      model
    });
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.download=type==="biweekly"?"hostedtimesheets-biweekly-timesheet.csv":"hostedtimesheets-weekly-timesheet.csv";
    link.click();
    URL.revokeObjectURL(url);
    $("#tt-status").textContent="CSV downloaded from the current visible template.";
  });

  renderRows();
})();