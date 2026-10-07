(()=>{
  const root=document.querySelector("[data-timeoff]");
  if(!root)return;
  const rows=[...root.querySelectorAll("[data-timeoff-row]")];
  const $=s=>root.querySelector(s)||document.querySelector(s);
  const STORAGE_KEY="hostedtimesheets.timeOffTracker.v1";
  let lastSummary="",lastValid=false;

  const unit=()=>$("#to-unit").value==="days"?"days":"hours";
  const suffix=()=>unit()==="days"?"days":"h";
  const fmt=value=>value.toFixed(2)+" "+suffix();

  function setField(input,message=""){
    const error=input.parentElement.querySelector("[data-error]");
    const invalid=Boolean(message);
    input.setAttribute("aria-invalid",String(invalid));
    if(error){error.textContent=message;error.hidden=!invalid}
    return !invalid;
  }

  function parseCell(input){
    const raw=input.value.trim();
    if(raw===""){setField(input);return {valid:true,value:0}}
    const value=Number(raw);
    if(!Number.isFinite(value)){setField(input,"Enter a finite number or leave this field blank for zero.");return {valid:false,value:null}}
    if(value<0){setField(input,"Enter zero or a positive value. Negative balances are calculated in the results, not entered here.");return {valid:false,value:null}}
    setField(input);
    return {valid:true,value};
  }

  function readRow(row){
    const inputs={opening:row.querySelector("[data-opening]"),earned:row.querySelector("[data-earned]"),used:row.querySelector("[data-used]"),scheduled:row.querySelector("[data-scheduled]")};
    const values={};let valid=true;
    for(const [key,input] of Object.entries(inputs)){
      const parsed=parseCell(input);valid=valid&&parsed.valid;values[key]=parsed.value;
    }
    if(!valid)return {valid:false,inputs,values};
    const current=values.opening+values.earned-values.used;
    const available=current-values.scheduled;
    return {valid:true,inputs,values,current,available};
  }

  function setTotals(value){
    for(const id of ["to-opening","to-earned","to-used","to-scheduled","to-current","to-available","to-shortfall"]) $("#"+id).textContent=value;
    $("#to-short-categories").textContent=value==="—"?"—":value;
  }

  function calc(){
    const totals={opening:0,earned:0,used:0,scheduled:0,current:0,available:0,shortfall:0};
    let shortCategories=0,valid=true;
    const snapshots=[];
    rows.forEach(row=>{
      const state=readRow(row);snapshots.push(state);
      if(!state.valid){
        valid=false;
        row.querySelector("[data-current]").textContent="—";
        row.querySelector("[data-available]").textContent="—";
        row.removeAttribute("data-shortfall");
        return;
      }
      for(const key of ["opening","earned","used","scheduled"])totals[key]+=state.values[key];
      totals.current+=state.current;totals.available+=state.available;
      if(state.available<0){shortCategories+=1;totals.shortfall+=-state.available;row.dataset.shortfall="true"}else row.removeAttribute("data-shortfall");
      row.querySelector("[data-current]").textContent=fmt(state.current);
      row.querySelector("[data-available]").textContent=fmt(state.available);
    });

    lastValid=valid;
    if(!valid){
      setTotals("—");
      $("#to-status").textContent="Fix the highlighted input before using totals, saving, copying or exporting.";
      lastSummary="";
      return {valid:false,snapshots};
    }

    $("#to-opening").textContent=fmt(totals.opening);
    $("#to-earned").textContent=fmt(totals.earned);
    $("#to-used").textContent=fmt(totals.used);
    $("#to-scheduled").textContent=fmt(totals.scheduled);
    $("#to-current").textContent=fmt(totals.current);
    $("#to-available").textContent=fmt(totals.available);
    $("#to-short-categories").textContent=String(shortCategories);
    $("#to-shortfall").textContent=fmt(totals.shortfall);
    $("#to-status").textContent=shortCategories
      ? shortCategories+" categor"+(shortCategories===1?"y is":"ies are")+" below zero after scheduled leave. The shortfall is arithmetic only and does not decide whether a policy allows advance leave."
      :"All entered values are valid. A negative balance would remain visible rather than being silently changed to zero.";

    const lines=[
      "Time Off Tracker",
      "Unit: "+unit(),
      ...rows.map((row,i)=>{
        const st=snapshots[i];
        return row.dataset.category+": opening "+st.values.opening.toFixed(2)+", earned "+st.values.earned.toFixed(2)+", used "+st.values.used.toFixed(2)+", scheduled "+st.values.scheduled.toFixed(2)+", current "+st.current.toFixed(2)+", available "+st.available.toFixed(2);
      }),
      "Opening total: "+totals.opening.toFixed(2),
      "Earned total: "+totals.earned.toFixed(2),
      "Used total: "+totals.used.toFixed(2),
      "Scheduled total: "+totals.scheduled.toFixed(2),
      "Current balance total: "+totals.current.toFixed(2),
      "Available after scheduled total: "+totals.available.toFixed(2),
      "Categories short after scheduled: "+shortCategories,
      "Scheduled shortfall total: "+totals.shortfall.toFixed(2)
    ];
    lastSummary=lines.join("\n");
    return {valid:true,snapshots,totals,shortCategories};
  }

  function snapshot(){
    const state=calc();
    if(!state.valid)return null;
    return {version:1,unit:unit(),rows:rows.map(row=>({
      opening:row.querySelector("[data-opening]").value,
      earned:row.querySelector("[data-earned]").value,
      used:row.querySelector("[data-used]").value,
      scheduled:row.querySelector("[data-scheduled]").value
    }))};
  }

  function saveLocal(){
    const data=snapshot();
    if(!data){$("#to-storage-status").textContent="Fix the highlighted input before saving.";return}
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
      $("#to-storage-status").textContent="Saved in this browser on this device. Use Clear saved data to remove the local copy.";
    }catch{
      $("#to-storage-status").textContent="This browser did not allow local saving. The visible tracker still works without storage.";
    }
  }

  function clearLocal(){
    try{localStorage.removeItem(STORAGE_KEY);$("#to-storage-status").textContent="Saved browser data cleared. The values currently on screen were not changed."}
    catch{$("#to-storage-status").textContent="This browser did not allow access to local storage."}
  }

  function restoreLocal(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw){calc();return}
      const data=JSON.parse(raw);
      if(!data||data.version!==1||!["hours","days"].includes(data.unit)||!Array.isArray(data.rows)||data.rows.length!==rows.length)throw new Error("shape");
      $("#to-unit").value=data.unit;
      rows.forEach((row,i)=>{
        const saved=data.rows[i]||{};
        for(const [key,selector] of [["opening","[data-opening]"],["earned","[data-earned]"],["used","[data-used]"],["scheduled","[data-scheduled]"]]) row.querySelector(selector).value=String(saved[key]??"");
      });
      const state=calc();
      if(!state.valid)throw new Error("invalid");
      $("#to-storage-status").textContent="Saved browser data restored from this device.";
    }catch{
      try{localStorage.removeItem(STORAGE_KEY)}catch{}
      rows.forEach(row=>row.querySelectorAll("input[type=number]").forEach(input=>input.value="0"));
      $("#to-unit").value="hours";calc();
      $("#to-storage-status").textContent="A saved tracker could not be restored and was cleared. No data was sent to Hosted Timesheets.";
    }
  }

  async function copySummary(){
    calc();
    if(!lastValid||!lastSummary){$("#to-status").textContent="Fix the highlighted input before copying.";return}
    try{await navigator.clipboard.writeText(lastSummary);$("#to-status").textContent="Tracker summary copied to clipboard."}
    catch{$("#to-status").textContent="Copy was unavailable in this browser. Use Print tracker or Download CSV instead."}
  }

  function downloadCsv(){
    const state=calc();
    if(!state.valid){$("#to-status").textContent="Fix the highlighted input before exporting CSV.";return}
    const u=unit();
    const data=[
      ["Category","Unit","Opening","Earned","Used","Scheduled","Current Balance","Available After Scheduled"],
      ...rows.map((row,i)=>{const st=state.snapshots[i];return [row.dataset.category,u,st.values.opening.toFixed(2),st.values.earned.toFixed(2),st.values.used.toFixed(2),st.values.scheduled.toFixed(2),st.current.toFixed(2),st.available.toFixed(2)]}),
      ["TOTAL",u,state.totals.opening.toFixed(2),state.totals.earned.toFixed(2),state.totals.used.toFixed(2),state.totals.scheduled.toFixed(2),state.totals.current.toFixed(2),state.totals.available.toFixed(2)],
      ["SCHEDULED SHORTFALL",u,"","","","","",state.totals.shortfall.toFixed(2)]
    ];
    const csv=data.map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(",")).join("\n");
    const a=document.createElement("a"),url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    a.href=url;a.download="time-off-tracker.csv";a.click();URL.revokeObjectURL(url);
    $("#to-status").textContent="CSV export prepared from the current valid tracker.";
  }

  root.addEventListener("input",event=>{if(event.target.matches("input[type=number]"))calc()});
  $("#to-unit").addEventListener("change",()=>{calc();$("#to-storage-status").textContent="Unit changed to "+unit()+". Existing numbers were not converted; save again if you want this unit in the local copy."});
  $("#to-save").addEventListener("click",saveLocal);
  $("#to-clear-saved").addEventListener("click",clearLocal);
  $("#to-copy").addEventListener("click",copySummary);
  $("#to-print").addEventListener("click",()=>window.print());
  $("#to-csv").addEventListener("click",downloadCsv);
  $("#to-example").addEventListener("click",()=>{
    const values=unit()==="days"?[[10,3,2,1],[5,1,2,0],[2,0,0,0],[1,0,0,2]]:[[40,24,16,8],[24,8,12,4],[16,0,4,0],[8,0,0,12]];
    rows.forEach((row,i)=>{
      const v=values[i];
      row.querySelector("[data-opening]").value=String(v[0]);
      row.querySelector("[data-earned]").value=String(v[1]);
      row.querySelector("[data-used]").value=String(v[2]);
      row.querySelector("[data-scheduled]").value=String(v[3]);
    });
    calc();$("#to-storage-status").textContent="Example loaded on screen. It has not been saved in this browser.";
  });
  $("#to-reset").addEventListener("click",()=>{
    rows.forEach(row=>row.querySelectorAll("input[type=number]").forEach(input=>input.value="0"));
    $("#to-unit").value="hours";calc();
    $("#to-storage-status").textContent="Visible tracker reset. Any previously saved browser copy remains until you clear it or save again.";
  });

  restoreLocal();
})();
