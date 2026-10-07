import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9892,debugPort=9239,base="http://127.0.0.1:"+port;
const mime=file=>file.endsWith(".js")?"application/javascript":file.endsWith(".css")?"text/css":file.endsWith(".png")?"image/png":file.endsWith(".svg")?"image/svg+xml":"text/html";
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,base);let p=decodeURIComponent(url.pathname);if(p.endsWith("/"))p+="index.html";const target=path.join(root,p);if(!target.startsWith(root))throw new Error("path");const body=await readFile(target);res.writeHead(200,{"content-type":mime(target)});res.end(body)}catch{res.writeHead(404);res.end("not found")}});
await new Promise(r=>server.listen(port,"127.0.0.1",r));

const chrome=spawn("/usr/bin/chromium",["--headless","--no-sandbox","--disable-gpu","--remote-debugging-address=127.0.0.1","--remote-debugging-port="+debugPort,"--user-data-dir=/tmp/ht-billable-hours-chrome","--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1","about:blank"],{stdio:"ignore"});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),check=(c,m)=>{if(!c)throw new Error(m)};
for(let i=0;i<50;i++){try{if((await fetch("http://127.0.0.1:"+debugPort+"/json/version")).ok)break}catch{}await sleep(100)}
const tr=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/billable-hours-calculator/"),{method:"PUT"});check(tr.ok,"target");
const target=await tr.json(),ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.addEventListener("open",r,{once:true});ws.addEventListener("error",j,{once:true})});
let seq=0;const pending=new Map(),runtimeErrors=[],consoleErrors=[];
ws.addEventListener("message",event=>{const m=JSON.parse(event.data);if(m.method==="Runtime.exceptionThrown")runtimeErrors.push(m.params?.exceptionDetails?.text||"exception");if(m.method==="Runtime.consoleAPICalled"&&m.params?.type==="error")consoleErrors.push("console.error");if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result||{})});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const evaluate=async expression=>{const r=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval");return r.result?.value};
async function setValue(selector,value,event="input"){return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));return el.value})()`)}
async function click(selector){return evaluate(`(()=>{document.querySelector(${JSON.stringify(selector)}).click();return true})()`)}
async function snap(){return evaluate(`({util:document.querySelector("#bh-utilization").textContent.trim(),non:document.querySelector("#bh-nonbillable").textContent.trim(),value:document.querySelector("#bh-revenue").textContent.trim(),effective:document.querySelector("#bh-effective-rate").textContent.trim(),targetHours:document.querySelector("#bh-target-hours").textContent.trim(),hoursDelta:document.querySelector("#bh-target-delta").textContent.trim(),targetValue:document.querySelector("#bh-target-value").textContent.trim(),valueDelta:document.querySelector("#bh-value-delta").textContent.trim(),formula:document.querySelector("#bh-formula").textContent.trim(),status:document.querySelector("#bh-status").textContent.trim(),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})`)}
async function field(sel,err){return evaluate(`(()=>{const x=document.querySelector(${JSON.stringify(sel)}),e=document.querySelector(${JSON.stringify(err)});return {aria:x.getAttribute("aria-invalid"),error:e.textContent.trim(),hidden:e.hidden}})()`)}

try{
  await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});await send("Page.navigate",{url:base+"/billable-hours-calculator/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#bh-utilization")?.textContent==="75.0%"'))break;await sleep(100)}

  let s=await snap();
  check(s.util==="75.0%"&&s.non==="10.00","1 default utilization");
  check(s.value.includes("3,000.00")&&s.effective.includes("75.00"),"2 default value/effective");
  check(s.targetHours==="30.00"&&s.hoursDelta==="+0.00 hrs","3 default target hours");
  check(s.targetValue.includes("3,000.00")&&s.valueDelta.includes("+")&&s.valueDelta.includes("0.00"),"4 default target value");
  check(s.formula.includes("30.00 ÷ 40.00 × 100 = 75.0%")&&s.status.includes("does not perform FX conversion"),"5 default formula/status");
  check(s.overflow===false,"6 mobile overflow");

  await setValue("#bh-total","37.5");await setValue("#bh-billable","22.25");await setValue("#bh-rate","80");await setValue("#bh-target","60");s=await snap();
  check(s.util==="59.3%"&&s.non==="15.25","7 decimal hours valid");
  check(s.value.includes("1,780.00")&&s.effective.includes("47.47"),"8 decimal value/effective");
  check(s.targetHours==="22.50"&&s.hoursDelta==="-0.25 hrs","9 decimal target");
  check(s.targetValue.includes("1,800.00")&&s.valueDelta.includes("-")&&s.valueDelta.includes("20.00"),"10 decimal target value");

  await setValue("#bh-total","40");await setValue("#bh-billable","40");await setValue("#bh-rate","100");await setValue("#bh-target","75");s=await snap();
  check(s.util==="100.0%"&&s.non==="0.00"&&s.hoursDelta==="+10.00 hrs","11 billable equals total");

  await setValue("#bh-billable","41");let inv=await field("#bh-billable","#bh-billable-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&inv.error.includes("cannot exceed")&&s.util==="—"&&s.value==="—","12 billable over total invalid");

  await setValue("#bh-billable","30");await setValue("#bh-total","");inv=await field("#bh-total","#bh-total-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&s.util==="—","13 blank total invalid");
  await setValue("#bh-total","-1");inv=await field("#bh-total","#bh-total-error");check(inv.aria==="true","14 negative total invalid");

  await setValue("#bh-total","40");await setValue("#bh-billable","");inv=await field("#bh-billable","#bh-billable-error");check(inv.aria==="true","15 blank billable invalid");
  await setValue("#bh-billable","-1");inv=await field("#bh-billable","#bh-billable-error");check(inv.aria==="true","16 negative billable invalid");

  await setValue("#bh-total","0");await setValue("#bh-billable","0");await setValue("#bh-rate","100");await setValue("#bh-target","75");s=await snap();
  check(s.util==="N/A"&&s.non==="0.00"&&s.value.includes("0.00")&&s.effective==="N/A","17 zero hours N/A");
  check(s.targetHours==="0.00"&&s.hoursDelta==="+0.00 hrs"&&s.formula.includes("undefined"),"18 zero hours target/formula");

  await setValue("#bh-total","40");await setValue("#bh-billable","30");await setValue("#bh-rate","");s=await snap();inv=await field("#bh-rate","#bh-rate-error");
  check(inv.aria==="false"&&inv.hidden&&s.util==="75.0%"&&s.value==="—"&&s.effective==="—","19 blank rate valid");
  check(s.targetHours==="30.00"&&s.targetValue==="—"&&s.valueDelta==="—","20 blank rate target hours remain");

  await setValue("#bh-rate","0");s=await snap();
  check(s.value.includes("0.00")&&s.effective.includes("0.00")&&s.targetValue.includes("0.00"),"21 zero rate valid");

  await setValue("#bh-rate","-1");s=await snap();inv=await field("#bh-rate","#bh-rate-error");
  check(inv.aria==="true"&&!inv.hidden&&s.util==="75.0%"&&s.non==="10.00"&&s.value==="—"&&s.effective==="—","22 negative rate independent invalid");
  check(s.targetHours==="30.00"&&s.targetValue==="—"&&s.status.includes("billing rate"),"23 invalid rate keeps target hours");

  await setValue("#bh-rate","100");await setValue("#bh-target","");s=await snap();inv=await field("#bh-target","#bh-target-error");
  check(inv.aria==="false"&&inv.hidden&&s.util==="75.0%"&&s.value.includes("3,000.00"),"24 blank target valid");
  check(s.targetHours==="—"&&s.hoursDelta==="—"&&s.targetValue==="—"&&s.valueDelta==="—","25 blank target suppresses target outputs");

  await setValue("#bh-target","0");s=await snap();
  check(s.targetHours==="0.00"&&s.hoursDelta==="+30.00 hrs"&&s.targetValue.includes("0.00")&&s.valueDelta.includes("+")&&s.valueDelta.includes("3,000.00"),"26 zero target valid");

  await setValue("#bh-target","100");s=await snap();
  check(s.targetHours==="40.00"&&s.hoursDelta==="-10.00 hrs"&&s.targetValue.includes("4,000.00")&&s.valueDelta.includes("-")&&s.valueDelta.includes("1,000.00"),"27 100 target valid");

  await setValue("#bh-target","-1");s=await snap();inv=await field("#bh-target","#bh-target-error");
  check(inv.aria==="true"&&s.util==="75.0%"&&s.value.includes("3,000.00")&&s.targetHours==="—","28 negative target independent invalid");
  await setValue("#bh-target","101");inv=await field("#bh-target","#bh-target-error");check(inv.aria==="true"&&inv.error.includes("0% to 100%"),"29 target over 100 invalid");

  await setValue("#bh-target","75");await setValue("#bh-currency","GBP","change");s=await snap();
  check(s.util==="75.0%"&&s.value.includes("£")&&s.value.includes("3,000.00")&&s.effective.includes("£"),"30 currency formatting only");
  check(s.status.includes("does not perform FX conversion"),"31 currency status");

  await setValue("#bh-currency","USD","change");await click("#bh-example");s=await snap();
  check(s.util==="62.2%"&&s.non==="17.00","32 example utilization");
  check(s.value.includes("1,820.00")&&s.effective.includes("40.44"),"33 example value/effective");
  check(s.targetHours==="31.50"&&s.hoursDelta==="-3.50 hrs","34 example target hours");
  check(s.targetValue.includes("2,047.50")&&s.valueDelta.includes("-")&&s.valueDelta.includes("227.50"),"35 example target value");

  await click("#bh-reset");
  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true})');
  let copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#bh-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied})()');
  check(copied.includes("Billable utilization: 75.0%")&&copied.includes("Estimated billable value: $3,000.00")&&copied.includes("no FX conversion"),"36 copy valid");

  await setValue("#bh-rate","");await setValue("#bh-target","");copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#bh-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied})()');
  check(copied.includes("Billing rate: Not entered")&&copied.includes("Target utilization: Not entered"),"37 copy blank optional valid");

  await setValue("#bh-rate","-1");
  let noCopy=await evaluate('(async()=>{window.__copied="sentinel";document.querySelector("#bh-copy").click();await new Promise(r=>setTimeout(r,20));return {copied:window.__copied,status:document.querySelector("#bh-status").textContent.trim()}})()');
  check(noCopy.copied==="sentinel"&&noCopy.status.includes("valid worked and billable hours"),"38 invalid optional copy suppressed");

  await setValue("#bh-rate","100");await setValue("#bh-total","");
  noCopy=await evaluate('(async()=>{window.__copied="sentinel";document.querySelector("#bh-copy").click();await new Promise(r=>setTimeout(r,20));return {copied:window.__copied,status:document.querySelector("#bh-status").textContent.trim()}})()');
  check(noCopy.copied==="sentinel"&&noCopy.status.includes("valid worked and billable hours"),"39 invalid core copy suppressed");

  await click("#bh-reset");s=await snap();
  check(s.util==="75.0%"&&s.non==="10.00"&&s.value.includes("3,000.00")&&s.targetHours==="30.00","40 reset");

  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,metrics:document.querySelectorAll("[data-billable-hours] .metric").length,increment:!!document.querySelector("#bh-increment"),rounding:!!document.querySelector("#bh-rounding"),invoice:!!document.querySelector("#bh-invoice"),copy:!!document.querySelector("#bh-copy"),skip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/billable-hours-calculator/","41 canonical");
  check(seo.faq===8&&seo.metrics===8&&seo.copy&&seo.skip&&!seo.increment&&!seo.rounding&&!seo.invoice,"42 scope/schema UI");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});await send("Page.navigate",{url:base+"/billable-hours-calculator/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#bh-utilization")?.textContent==="75.0%"'))break;await sleep(100)}
  const d=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,util:document.querySelector("#bh-utilization").textContent.trim(),value:document.querySelector("#bh-revenue").textContent.trim(),faq:document.querySelectorAll(".faq details").length})');
  check(d.overflow===false&&d.util==="75.0%"&&d.value.includes("3,000.00")&&d.faq===8,"43 desktop regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"44 browser errors");
  console.log("Billable Hours 44-case calculation/UI matrix: PASS");
} finally {
  try{ws.close()}catch{}
  chrome.kill("SIGTERM");server.close();
}
