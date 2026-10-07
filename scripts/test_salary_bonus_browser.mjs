import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9890,debugPort=9237,base="http://127.0.0.1:"+port;
const mime=file=>file.endsWith(".js")?"application/javascript":file.endsWith(".css")?"text/css":file.endsWith(".png")?"image/png":file.endsWith(".svg")?"image/svg+xml":"text/html";
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,base);let p=decodeURIComponent(url.pathname);if(p.endsWith("/"))p+="index.html";const target=path.join(root,p);if(!target.startsWith(root))throw new Error("path");const body=await readFile(target);res.writeHead(200,{"content-type":mime(target)});res.end(body)}catch{res.writeHead(404);res.end("not found")}});
await new Promise(r=>server.listen(port,"127.0.0.1",r));

const chrome=spawn("/usr/bin/chromium",["--headless","--no-sandbox","--disable-gpu","--remote-debugging-address=127.0.0.1","--remote-debugging-port="+debugPort,"--user-data-dir=/tmp/ht-salary-bonus-chrome","--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1","about:blank"],{stdio:"ignore"});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),check=(c,m)=>{if(!c)throw new Error(m)};
for(let i=0;i<50;i++){try{if((await fetch("http://127.0.0.1:"+debugPort+"/json/version")).ok)break}catch{}await sleep(100)}
const tr=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/salary-calculator-with-bonus/"),{method:"PUT"});check(tr.ok,"target");
const target=await tr.json(),ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.addEventListener("open",r,{once:true});ws.addEventListener("error",j,{once:true})});
let seq=0;const pending=new Map(),runtimeErrors=[],consoleErrors=[];
ws.addEventListener("message",event=>{const m=JSON.parse(event.data);if(m.method==="Runtime.exceptionThrown")runtimeErrors.push(m.params?.exceptionDetails?.text||"exception");if(m.method==="Runtime.consoleAPICalled"&&m.params?.type==="error")consoleErrors.push("console.error");if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result||{})});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const evaluate=async expression=>{const r=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval");return r.result?.value};
async function setValue(selector,value,event="input"){return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));return el.value})()`)}
async function click(selector){return evaluate(`(()=>{document.querySelector(${JSON.stringify(selector)}).click();return true})()`)}
async function snap(){return evaluate(`({mode:document.querySelector("#sb-mode").value,total:document.querySelector("#sb-total").textContent.trim(),bonus:document.querySelector("#sb-bonus").textContent.trim(),pct:document.querySelector("#sb-bonus-pct").textContent.trim(),monthly:document.querySelector("#sb-monthly").textContent.trim(),biweekly:document.querySelector("#sb-biweekly").textContent.trim(),weekly:document.querySelector("#sb-weekly").textContent.trim(),baseHourly:document.querySelector("#sb-base-hourly").textContent.trim(),totalHourly:document.querySelector("#sb-total-hourly").textContent.trim(),formula:document.querySelector("#sb-formula").textContent.trim(),status:document.querySelector("#sb-status").textContent.trim(),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})`)}
async function field(sel,err){return evaluate(`(()=>{const x=document.querySelector(${JSON.stringify(sel)}),e=document.querySelector(${JSON.stringify(err)});return {aria:x.getAttribute("aria-invalid"),error:e.textContent.trim(),hidden:e.hidden}})()`)}

try{
  await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});await send("Page.navigate",{url:base+"/salary-calculator-with-bonus/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#sb-total")?.textContent.includes("66,000")'))break;await sleep(100)}
  let s=await snap();
  check(s.mode==="percent"&&s.total.includes("66,000.00")&&s.bonus.includes("6,000.00")&&s.pct==="10.00%","1 default annual");
  check(s.monthly.includes("5,500.00")&&s.biweekly.includes("2,538.46")&&s.weekly.includes("1,269.23"),"2 default pay equivalents");
  check(s.baseHourly.includes("28.85")&&s.totalHourly.includes("31.73"),"3 default hourly");
  check(s.formula.includes("10.00%")&&s.status.includes("no exchange-rate conversion"),"4 default formula/status");
  check(s.overflow===false,"5 mobile overflow");

  await setValue("#sb-mode","fixed","change");await setValue("#sb-fixed","6000");s=await snap();
  check(s.total.includes("66,000.00")&&s.bonus.includes("6,000.00")&&s.pct==="10.00%","6 fixed mode");
  check(s.formula.includes("6,000.00 bonus")&&s.formula.includes("66,000.00 total"),"7 fixed formula");

  await setValue("#sb-salary","80000");await setValue("#sb-mode","target","change");await setValue("#sb-target","90000");s=await snap();
  check(s.total.includes("90,000.00")&&s.bonus.includes("10,000.00")&&s.pct==="12.50%","8 target mode");
  check(s.formula.includes("90,000.00 target")&&s.formula.includes("10,000.00 required bonus"),"9 target formula");

  await setValue("#sb-target","79000");let inv=await field("#sb-target","#sb-target-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&inv.error.includes("cannot be less")&&s.total==="—","10 target below salary invalid");

  await setValue("#sb-target","90000");await setValue("#sb-mode","fixed","change");await setValue("#sb-salary","0");await setValue("#sb-fixed","6000");s=await snap();
  check(s.total.includes("6,000.00")&&s.bonus.includes("6,000.00")&&s.pct==="N/A","11 zero salary fixed");
  check(s.status.includes("undefined because base salary is zero"),"12 zero salary status");

  await setValue("#sb-salary","60000");await setValue("#sb-mode","percent","change");await setValue("#sb-percent","0");s=await snap();
  check(s.total.includes("60,000.00")&&s.bonus.includes("0.00")&&s.pct==="0.00%","13 zero percent valid");
  await setValue("#sb-percent","150");s=await snap();check(s.bonus.includes("90,000.00")&&s.total.includes("150,000.00")&&s.pct==="150.00%","14 percent over 100 valid");

  await setValue("#sb-percent","10");await setValue("#sb-salary","");inv=await field("#sb-salary","#sb-salary-error");s=await snap();check(inv.aria==="true"&&s.total==="—","15 blank salary invalid");
  await setValue("#sb-salary","-1");inv=await field("#sb-salary","#sb-salary-error");check(inv.aria==="true","16 negative salary invalid");
  await setValue("#sb-salary","60000");await setValue("#sb-percent","");inv=await field("#sb-percent","#sb-percent-error");check(inv.aria==="true","17 blank percent invalid");
  await setValue("#sb-percent","-1");inv=await field("#sb-percent","#sb-percent-error");check(inv.aria==="true","18 negative percent invalid");

  await setValue("#sb-percent","10");await setValue("#sb-mode","fixed","change");await setValue("#sb-fixed","");inv=await field("#sb-fixed","#sb-fixed-error");check(inv.aria==="true","19 blank fixed invalid");
  await setValue("#sb-fixed","-1");inv=await field("#sb-fixed","#sb-fixed-error");check(inv.aria==="true","20 negative fixed invalid");
  await setValue("#sb-fixed","0");s=await snap();check(s.total.includes("60,000.00")&&s.pct==="0.00%","21 zero fixed valid");

  await setValue("#sb-mode","target","change");await setValue("#sb-target","");inv=await field("#sb-target","#sb-target-error");check(inv.aria==="true","22 blank target invalid");
  await setValue("#sb-target","-1");inv=await field("#sb-target","#sb-target-error");check(inv.aria==="true","23 negative target invalid");

  await setValue("#sb-target","90000");await setValue("#sb-hours","");inv=await field("#sb-hours","#sb-hours-error");check(inv.aria==="true","24 blank hours invalid");
  await setValue("#sb-hours","0");inv=await field("#sb-hours","#sb-hours-error");check(inv.aria==="true","25 zero hours invalid");
  await setValue("#sb-hours","0.24");inv=await field("#sb-hours","#sb-hours-error");check(inv.aria==="true","26 hours below min invalid");
  await setValue("#sb-hours","169");inv=await field("#sb-hours","#sb-hours-error");check(inv.aria==="true","27 hours over max invalid");

  await setValue("#sb-hours","40");await setValue("#sb-weeks","");inv=await field("#sb-weeks","#sb-weeks-error");check(inv.aria==="true","28 blank weeks invalid");
  await setValue("#sb-weeks","0");inv=await field("#sb-weeks","#sb-weeks-error");check(inv.aria==="true","29 zero weeks invalid");
  await setValue("#sb-weeks","54");inv=await field("#sb-weeks","#sb-weeks-error");check(inv.aria==="true","30 weeks over max invalid");
  await setValue("#sb-weeks","52.5");inv=await field("#sb-weeks","#sb-weeks-error");check(inv.aria==="true"&&inv.error.includes("whole number"),"31 fractional weeks invalid");

  await setValue("#sb-weeks","52");await setValue("#sb-mode","percent","change");await setValue("#sb-percent","10");await setValue("#sb-currency","GBP","change");s=await snap();
  check(s.total.includes("66,000.00")&&s.total.includes("£")&&s.bonus.includes("6,000.00"),"32 currency formatting");
  await setValue("#sb-currency","USD","change");await click("#sb-example");s=await snap();
  check(s.mode==="percent"&&s.total.includes("66,000.00")&&s.pct==="10.00%","33 example");
  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true})');
  const copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#sb-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied})()');
  check(copied.includes("Salary + bonus calculation: Percentage of salary")&&copied.includes("Total annual compensation: $66,000.00")&&copied.includes("no FX conversion"),"34 copy valid");
  await setValue("#sb-salary","");
  const noCopy=await evaluate('(async()=>{window.__copied="sentinel";document.querySelector("#sb-copy").click();await new Promise(r=>setTimeout(r,20));return {copied:window.__copied,status:document.querySelector("#sb-status").textContent.trim()}})()');
  check(noCopy.copied==="sentinel"&&noCopy.status.includes("valid values"),"35 invalid copy suppression");

  await click("#sb-reset");s=await snap();
  check(s.mode==="percent"&&s.total.includes("66,000.00")&&s.pct==="10.00%","36 reset");
  const vis=await evaluate('({percent:[...document.querySelectorAll("[data-percent-field]")].every(x=>!x.hidden),fixed:[...document.querySelectorAll("[data-fixed-field]")].every(x=>x.hidden),target:[...document.querySelectorAll("[data-target-field]")].every(x=>x.hidden)})');
  check(vis.percent&&vis.fixed&&vis.target,"37 reset visibility");

  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,metrics:document.querySelectorAll("[data-salary-bonus] .metric").length,tax:!!document.querySelector("#sb-tax"),state:!!document.querySelector("#sb-state"),equity:!!document.querySelector("#sb-equity"),copy:!!document.querySelector("#sb-copy"),skip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/salary-calculator-with-bonus/","38 canonical");
  check(seo.faq===8&&seo.metrics===8&&seo.copy&&seo.skip&&!seo.tax&&!seo.state&&!seo.equity,"39 scope/schema UI");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});await send("Page.navigate",{url:base+"/salary-calculator-with-bonus/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#sb-total")?.textContent.includes("66,000")'))break;await sleep(100)}
  const d=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,total:document.querySelector("#sb-total").textContent.trim(),faq:document.querySelectorAll(".faq details").length})');
  check(d.overflow===false&&d.total.includes("66,000.00")&&d.faq===8,"40 desktop regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"41 browser errors");
  console.log("Salary Bonus 41-case calculation/UI matrix: PASS");
} finally {
  try{ws.close()}catch{}
  chrome.kill("SIGTERM");server.close();
}
