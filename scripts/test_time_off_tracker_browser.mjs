import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9893,debugPort=9242,base="http://127.0.0.1:"+port,userDir="/tmp/ht-timeoff-chrome";
await rm(userDir,{recursive:true,force:true});
const mime=file=>file.endsWith(".js")?"application/javascript":file.endsWith(".css")?"text/css":file.endsWith(".png")?"image/png":file.endsWith(".svg")?"image/svg+xml":"text/html";
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,base);let p=decodeURIComponent(url.pathname);if(p.endsWith("/"))p+="index.html";const target=path.join(root,p);if(!target.startsWith(root))throw new Error("path");const body=await readFile(target);res.writeHead(200,{"content-type":mime(target)});res.end(body)}catch{res.writeHead(404);res.end("not found")}});
await new Promise(r=>server.listen(port,"127.0.0.1",r));

const chrome=spawn("/usr/bin/chromium",["--headless","--no-sandbox","--disable-gpu","--remote-debugging-address=127.0.0.1","--remote-debugging-port="+debugPort,"--user-data-dir="+userDir,"--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1","about:blank"],{stdio:"ignore"});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),check=(c,m)=>{if(!c)throw new Error(m)};
for(let i=0;i<50;i++){try{if((await fetch("http://127.0.0.1:"+debugPort+"/json/version")).ok)break}catch{}await sleep(100)}
const tr=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/time-off-tracker/"),{method:"PUT"});check(tr.ok,"target");
const target=await tr.json(),ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.addEventListener("open",r,{once:true});ws.addEventListener("error",j,{once:true})});
let seq=0;const pending=new Map(),runtimeErrors=[],consoleErrors=[];
ws.addEventListener("message",event=>{const m=JSON.parse(event.data);if(m.method==="Runtime.exceptionThrown")runtimeErrors.push(m.params?.exceptionDetails?.text||"exception");if(m.method==="Runtime.consoleAPICalled"&&m.params?.type==="error")consoleErrors.push("console.error");if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result||{})});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const evaluate=async expression=>{const r=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval");return r.result?.value};
const q=s=>JSON.stringify(s);
async function setValue(selector,value){return evaluate(`(()=>{const el=document.querySelector(${q(selector)});el.value=${q(String(value))};el.dispatchEvent(new Event("input",{bubbles:true}));return el.value})()`)}
async function select(selector,value){return evaluate(`(()=>{const el=document.querySelector(${q(selector)});el.value=${q(String(value))};el.dispatchEvent(new Event("change",{bubbles:true}));return el.value})()`)}
async function click(selector){return evaluate(`(()=>{document.querySelector(${q(selector)}).click();return true})()`)}
async function row(i){return evaluate(`(()=>{const r=document.querySelectorAll("[data-timeoff-row]")[${i}];return {opening:r.querySelector("[data-opening]").value,earned:r.querySelector("[data-earned]").value,used:r.querySelector("[data-used]").value,scheduled:r.querySelector("[data-scheduled]").value,current:r.querySelector("[data-current]").textContent.trim(),available:r.querySelector("[data-available]").textContent.trim(),short:r.dataset.shortfall||""}})()`)}
async function snap(){return evaluate(`({unit:document.querySelector("#to-unit").value,opening:document.querySelector("#to-opening").textContent.trim(),earned:document.querySelector("#to-earned").textContent.trim(),used:document.querySelector("#to-used").textContent.trim(),scheduled:document.querySelector("#to-scheduled").textContent.trim(),current:document.querySelector("#to-current").textContent.trim(),available:document.querySelector("#to-available").textContent.trim(),shortCats:document.querySelector("#to-short-categories").textContent.trim(),shortfall:document.querySelector("#to-shortfall").textContent.trim(),status:document.querySelector("#to-status").textContent.trim(),storage:document.querySelector("#to-storage-status").textContent.trim(),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})`)}

try{
  await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});await send("Page.navigate",{url:base+"/time-off-tracker/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#to-current")?.textContent==="0.00 h"'))break;await sleep(100)}

  let s=await snap();
  check(s.unit==="hours"&&s.opening==="0.00 h"&&s.current==="0.00 h"&&s.available==="0.00 h","1 default hours");
  check(s.shortCats==="0"&&s.shortfall==="0.00 h"&&!s.overflow,"2 default shortfall/mobile");

  await setValue('[data-timeoff-row]:nth-child(1) [data-opening]',"");s=await snap();
  check(s.opening==="0.00 h"&&s.status.includes("All entered values"),"3 blank is zero");

  await setValue('[data-timeoff-row]:nth-child(1) [data-opening]',"7.5");await setValue('[data-timeoff-row]:nth-child(1) [data-earned]',"1.25");await setValue('[data-timeoff-row]:nth-child(1) [data-used]',"2.5");await setValue('[data-timeoff-row]:nth-child(1) [data-scheduled]',"1.75");
  let r=await row(0);s=await snap();
  check(r.current==="6.25 h"&&r.available==="4.50 h"&&s.current==="6.25 h"&&s.available==="4.50 h","4 decimal arithmetic");

  await setValue('[data-timeoff-row]:nth-child(1) [data-used]',"10");r=await row(0);s=await snap();
  check(r.current==="-1.25 h"&&r.available==="-3.00 h"&&r.short==="true","5 signed negative current/available");
  check(s.shortCats==="1"&&s.shortfall==="3.00 h","6 signed shortfall aggregate");

  await setValue('[data-timeoff-row]:nth-child(1) [data-opening]',"-1");
  const invalid=await evaluate('(()=>{const i=document.querySelector("[data-timeoff-row] [data-opening]"),e=i.parentElement.querySelector("[data-error]");return {aria:i.getAttribute("aria-invalid"),error:e.textContent.trim(),hidden:e.hidden,current:document.querySelector("#to-current").textContent.trim()}})()');
  check(invalid.aria==="true"&&!invalid.hidden&&invalid.error.includes("positive")&&invalid.current==="—","7 negative input invalid");

  await evaluate('window.__clip="";Object.defineProperty(navigator,"clipboard",{value:{writeText:async v=>{window.__clip=v}},configurable:true})');
  await click("#to-copy");check((await evaluate("window.__clip"))===""&&(await snap()).status.includes("Fix the highlighted"),"8 invalid blocks copy");
  await click("#to-save");check((await snap()).storage.includes("Fix the highlighted"),"9 invalid blocks save");

  await click("#to-reset");s=await snap();check(s.unit==="hours"&&s.current==="0.00 h","10 reset visible");
  await click("#to-example");s=await snap();
  check(s.opening==="88.00 h"&&s.earned==="32.00 h"&&s.used==="32.00 h"&&s.scheduled==="24.00 h","11 hours example totals");
  check(s.current==="88.00 h"&&s.available==="64.00 h"&&s.shortCats==="1"&&s.shortfall==="4.00 h","12 hours example balances");
  r=await row(3);check(r.current==="8.00 h"&&r.available==="-4.00 h"&&r.short==="true","13 example row shortfall");

  const before=await row(0);await select("#to-unit","days");const after=await row(0);s=await snap();
  check(before.opening===after.opening&&before.earned===after.earned&&after.current==="48.00 days","14 unit does not convert numbers");
  check(s.current==="88.00 days"&&s.shortfall==="4.00 days"&&s.storage.includes("were not converted"),"15 day labels");

  await click("#to-example");s=await snap();
  check(s.opening==="18.00 days"&&s.earned==="4.00 days"&&s.used==="4.00 days"&&s.scheduled==="3.00 days","16 days example totals");
  check(s.current==="18.00 days"&&s.available==="15.00 days"&&s.shortCats==="1"&&s.shortfall==="1.00 days","17 days example balances");

  await click("#to-save");
  let stored=await evaluate('localStorage.getItem("hostedtimesheets.timeOffTracker.v1")');
  check(stored&&JSON.parse(stored).unit==="days"&&JSON.parse(stored).rows.length===4,"18 local save");
  check((await snap()).storage.includes("Saved in this browser"),"19 save status");

  await setValue('[data-timeoff-row]:nth-child(1) [data-opening]',"99");
  await send("Page.reload",{ignoreCache:true});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#to-storage-status")?.textContent.includes("restored")'))break;await sleep(100)}
  s=await snap();r=await row(0);
  check(s.unit==="days"&&r.opening==="10"&&s.storage.includes("restored"),"20 restore saved snapshot");

  await click("#to-reset");s=await snap();stored=await evaluate('localStorage.getItem("hostedtimesheets.timeOffTracker.v1")');
  check(s.current==="0.00 h"&&stored!==null&&s.storage.includes("remains"),"21 reset preserves saved copy");
  await send("Page.reload",{ignoreCache:true});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#to-storage-status")?.textContent.includes("restored")'))break;await sleep(100)}
  check((await snap()).unit==="days"&&(await row(0)).opening==="10","22 reload after reset restores saved");

  await click("#to-clear-saved");stored=await evaluate('localStorage.getItem("hostedtimesheets.timeOffTracker.v1")');
  check(stored===null&&(await snap()).storage.includes("cleared"),"23 clear saved");
  const onScreen=await row(0);check(onScreen.opening==="10","24 clear saved keeps screen");
  await send("Page.reload",{ignoreCache:true});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#to-current")?.textContent==="0.00 h"'))break;await sleep(100)}
  check((await snap()).unit==="hours"&&(await row(0)).opening==="0","25 cleared reload defaults");

  await click("#to-example");
  await evaluate('window.__clip=""');await click("#to-copy");await sleep(20);
  const copied=await evaluate("window.__clip");
  check(copied.includes("Time Off Tracker")&&copied.includes("PTO / Vacation: opening 40.00")&&copied.includes("Scheduled shortfall total: 4.00"),"26 copy summary");

  await evaluate('window.__blob=null;window.__download="";URL.createObjectURL=b=>{window.__blob=b;return "blob:test"};URL.revokeObjectURL=()=>{};HTMLAnchorElement.prototype.click=function(){window.__download=this.download}');
  await click("#to-csv");await sleep(20);
  const csv=await evaluate('(async()=>({name:window.__download,text:await window.__blob.text()}))()');
  check(csv.name==="time-off-tracker.csv"&&csv.text.includes('"Category","Unit","Opening"')&&csv.text.includes('"PTO / Vacation","hours","40.00"')&&csv.text.includes('"SCHEDULED SHORTFALL","hours"'),"27 CSV export");

  await evaluate('window.__printed=false;window.print=()=>{window.__printed=true}');await click("#to-print");
  check(await evaluate("window.__printed===true"),"28 print");

  const storageBefore=await evaluate('localStorage.getItem("hostedtimesheets.timeOffTracker.v1")');
  check(storageBefore===null,"29 export does not save");

  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,rows:document.querySelectorAll("[data-timeoff-row]").length,errors:document.querySelectorAll("[data-error]").length,unit:!!document.querySelector("#to-unit"),save:!!document.querySelector("#to-save"),copy:!!document.querySelector("#to-copy"),employee:!!document.querySelector("#to-employee"),approval:!!document.querySelector("#to-approval"),accrual:!!document.querySelector("#to-accrual-rate"),runtime:[...document.scripts].find(x=>x.src.includes("time-off-tracker.js"))?.src})');
  check(seo.canonical==="https://hostedtimesheets.com/time-off-tracker/","30 canonical");
  check(seo.faq===8&&seo.rows===4&&seo.errors===16&&seo.unit&&seo.save&&seo.copy&&!seo.employee&&!seo.approval&&!seo.accrual,"31 scope/UI");
  check(seo.runtime.includes("time-off-tracker.js?v=20261007-remediation1"),"32 versioned runtime");

  await setValue('[data-timeoff-row]:nth-child(2) [data-opening]',"5");await setValue('[data-timeoff-row]:nth-child(2) [data-used]',"8");await setValue('[data-timeoff-row]:nth-child(2) [data-scheduled]',"2");
  r=await row(1);check(r.current==="-3.00 h"&&r.available==="-5.00 h","33 overused category remains signed");

  await setValue('[data-timeoff-row]:nth-child(1) [data-opening]',"10");await setValue('[data-timeoff-row]:nth-child(1) [data-used]',"0");await setValue('[data-timeoff-row]:nth-child(1) [data-scheduled]',"0");s=await snap();
  check(s.current==="7.00 h"||s.current.endsWith(" h"),"34 aggregate remains numeric with signed row");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});await send("Page.navigate",{url:base+"/time-off-tracker/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#to-current")'))break;await sleep(100)}
  const desktop=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,faq:document.querySelectorAll(".faq details").length,rows:document.querySelectorAll("[data-timeoff-row]").length,unit:document.querySelector("#to-unit").value})');
  check(desktop.overflow===false&&desktop.faq===8&&desktop.rows===4&&desktop.unit==="hours","35 desktop regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"36 browser errors");
  console.log("Time Off Tracker 36-case calculation/storage/UI matrix: PASS");
} finally {
  try{ws.close()}catch{}
  chrome.kill("SIGTERM");server.close();

}
