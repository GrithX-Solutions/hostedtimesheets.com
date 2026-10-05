import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9877;
const debugPort=9223;
const base="http://127.0.0.1:"+port;

const mime=file=>file.endsWith(".js")?"application/javascript":file.endsWith(".css")?"text/css":file.endsWith(".svg")?"image/svg+xml":"text/html";
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,base);
    let pathname=decodeURIComponent(url.pathname);
    if(pathname.endsWith("/"))pathname+="index.html";
    const target=path.join(root,pathname);
    if(!target.startsWith(root))throw new Error("invalid path");
    const body=await readFile(target);
    res.writeHead(200,{"content-type":mime(target)});
    res.end(body);
  }catch(error){res.writeHead(404);res.end("not found");}
});
await new Promise(resolve=>server.listen(port,"127.0.0.1",resolve));

const chrome=spawn("/usr/bin/chromium",[
  "--headless","--no-sandbox","--disable-gpu",
  "--remote-debugging-address=127.0.0.1",
  "--remote-debugging-port="+debugPort,
  "--user-data-dir=/tmp/ht-template-chrome",
  "--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1",
  "about:blank"
],{stdio:"ignore"});

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const check=(condition,message)=>{if(!condition)throw new Error(message);};

async function waitForDebug(){
  for(let i=0;i<50;i++){
    try{const response=await fetch("http://127.0.0.1:"+debugPort+"/json/version");if(response.ok)return;}catch(error){}
    await sleep(100);
  }
  throw new Error("Chromium debug endpoint did not start");
}

await waitForDebug();
const targetResponse=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/timesheet-template/"),{method:"PUT"});
check(targetResponse.ok,"Unable to create Chromium target");
const target=await targetResponse.json();
const ws=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});

let sequence=0;
const pending=new Map();
ws.addEventListener("message",event=>{
  const message=JSON.parse(event.data);
  if(!message.id||!pending.has(message.id))return;
  const item=pending.get(message.id);pending.delete(message.id);
  if(message.error)item.reject(new Error(JSON.stringify(message.error)));else item.resolve(message.result||{});
});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{
  const response=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});
  if(response.exceptionDetails)throw new Error(response.exceptionDetails.text||"Runtime evaluation failed");
  return response.result?.value;
};

try{
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/timesheet-template/"});
  for(let i=0;i<50;i++){
    const ready=await evaluate('document.readyState==="complete"&&document.querySelectorAll("[data-template-row]").length===7');
    if(ready)break;
    await sleep(100);
  }
  await sleep(250);

  const initial=await evaluate('({rows:document.querySelectorAll("[data-template-row]").length,breaks:[...document.querySelectorAll(\'[data-field="breakValue"]\')].map(x=>x.value),firstDay:document.querySelector("[data-day]").textContent.trim(),firstDate:document.querySelector("[data-date]").textContent.trim(),total:document.querySelector("#tt-total").textContent.trim(),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})');
  check(initial.rows===7,"Weekly mode did not render 7 rows");
  check(initial.breaks.every(value=>value==="0"),"Break inputs did not default to 0");
  check(initial.firstDay==="Day 1","Blank period start invented a weekday");
  check(initial.firstDate==="—","Blank period start invented a date");
  check(initial.total==="0h 00m","Initial total mismatch");
  check(initial.overflow===false,"Document-level mobile horizontal overflow detected");

  const dated=await evaluate('(()=>{const input=document.querySelector("#tt-start");input.value="2026-10-31";input.dispatchEvent(new Event("change",{bubbles:true}));const rows=[...document.querySelectorAll("[data-template-row]")];return {d0:rows[0].querySelector("[data-date]").textContent.trim(),day0:rows[0].querySelector("[data-day]").textContent.trim(),d1:rows[1].querySelector("[data-date]").textContent.trim(),day1:rows[1].querySelector("[data-day]").textContent.trim()};})()');
  check(dated.d0==="Oct 31, 2026"&&dated.day0==="Saturday","Start-date row mismatch");
  check(dated.d1==="Nov 1, 2026"&&dated.day1==="Sunday","Month-boundary date mismatch");

  const first=await evaluate('(()=>{const row=document.querySelector(\'[data-template-row][data-index="0"]\');const s=row.querySelector(\'[data-field="start"]\');const e=row.querySelector(\'[data-field="end"]\');const b=row.querySelector(\'[data-field="breakValue"]\');s.value="09:00";s.dispatchEvent(new Event("input",{bubbles:true}));e.value="17:00";e.dispatchEvent(new Event("input",{bubbles:true}));b.value="30";b.dispatchEvent(new Event("input",{bubbles:true}));return {hours:row.querySelector("[data-hours]").textContent.trim(),total:document.querySelector("#tt-total").textContent.trim(),valid:document.querySelector("#tt-valid-rows").textContent.trim()};})()');
  check(first.hours==="7h 30m","Daily calculation mismatch");
  check(first.total==="7h 30m","Weekly total mismatch");
  check(first.valid==="1","Completed-row count mismatch");

  const invalid=await evaluate('(()=>{const row=document.querySelector(\'[data-template-row][data-index="1"]\');const s=row.querySelector(\'[data-field="start"]\');s.value="09:00";s.dispatchEvent(new Event("input",{bubbles:true}));return {state:row.dataset.state,error:row.querySelector("[data-row-error]").textContent.trim(),total:document.querySelector("#tt-total").textContent.trim(),status:document.querySelector("#tt-status").textContent.trim(),aria:s.getAttribute("aria-invalid")};})()');
  check(invalid.state==="incomplete","Incomplete row state mismatch");
  check(invalid.error.includes("Enter both clock in and clock out"),"Incomplete row error missing");
  check(invalid.total==="7h 30m","Invalid row changed total");
  check(invalid.status.includes("1 row needs attention"),"Invalid summary missing");
  check(invalid.aria==="true","Invalid row did not expose aria-invalid");

  const biweekly=await evaluate('(()=>{const type=document.querySelector("#tt-type");type.value="biweekly";type.dispatchEvent(new Event("change",{bubbles:true}));const row=document.querySelector(\'[data-template-row][data-index="8"]\');const s=row.querySelector(\'[data-field="start"]\');const e=row.querySelector(\'[data-field="end"]\');const b=row.querySelector(\'[data-field="breakValue"]\');s.value="10:00";s.dispatchEvent(new Event("input",{bubbles:true}));e.value="18:00";e.dispatchEvent(new Event("input",{bubbles:true}));b.value="30";b.dispatchEvent(new Event("input",{bubbles:true}));return {rows:document.querySelectorAll("[data-template-row]").length,groups:document.querySelectorAll(".tt-week-heading").length,week1:document.querySelector("#tt-week1").textContent.trim(),week2:document.querySelector("#tt-week2").textContent.trim(),total:document.querySelector("#tt-total").textContent.trim(),row0:document.querySelector(\'[data-template-row][data-index="0"] [data-hours]\').textContent.trim(),row8:row.querySelector("[data-hours]").textContent.trim()};})()');
  check(biweekly.rows===14&&biweekly.groups===2,"Biweekly grouping mismatch");
  check(biweekly.week1==="7h 30m","Week 1 subtotal mismatch");
  check(biweekly.week2==="7h 30m","Week 2 subtotal mismatch");
  check(biweekly.total==="15h 00m","Biweekly total mismatch");
  check(biweekly.row0==="7h 30m"&&biweekly.row8==="7h 30m","Mode switch lost entered rows");

  const restored=await evaluate('(()=>{const type=document.querySelector("#tt-type");type.value="weekly";type.dispatchEvent(new Event("change",{bubbles:true}));const weeklyRows=document.querySelectorAll("[data-template-row]").length;type.value="biweekly";type.dispatchEvent(new Event("change",{bubbles:true}));const row8=document.querySelector(\'[data-template-row][data-index="8"]\');return {weeklyRows,row8Start:row8.querySelector(\'[data-field="start"]\').value,row8End:row8.querySelector(\'[data-field="end"]\').value,row8Break:row8.querySelector(\'[data-field="breakValue"]\').value,total:document.querySelector("#tt-total").textContent.trim()};})()');
  check(restored.weeklyRows===7,"Weekly restore row count mismatch");
  check(restored.row8Start==="10:00"&&restored.row8End==="18:00"&&restored.row8Break==="30","Week 2 data was not restored");
  check(restored.total==="15h 00m","Restored biweekly total mismatch");

  const meta=await evaluate('(()=>{const employee=document.querySelector("#tt-employee");const company=document.querySelector("#tt-company");employee.value="Jane Doe";employee.dispatchEvent(new Event("input",{bubbles:true}));company.value="ACME";company.dispatchEvent(new Event("input",{bubbles:true}));return {employee:document.querySelector("#tt-print-employee").textContent.trim(),company:document.querySelector("#tt-print-company").textContent.trim(),start:document.querySelector("#tt-print-start").textContent.trim()};})()');
  check(meta.employee==="Jane Doe"&&meta.company==="ACME"&&meta.start==="2026-10-31","Print metadata did not mirror inputs");

  await send("Emulation.setEmulatedMedia",{media:"print"});
  const printState=await evaluate('({meta:getComputedStyle(document.querySelector(".print-only")).display,controls:getComputedStyle(document.querySelector("#tt-print").closest(".no-print")).display})');
  check(printState.meta!=="none","Print metadata is hidden in print media");
  check(printState.controls==="none","Interactive controls remain visible in print media");

  console.log("Timesheet Template rendered browser checks: PASS");
} finally {
  try{ws.close();}catch(error){}
  chrome.kill("SIGTERM");
  server.close();
}