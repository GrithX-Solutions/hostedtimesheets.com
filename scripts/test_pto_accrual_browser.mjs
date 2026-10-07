import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9889;
const debugPort=9236;
const base="http://127.0.0.1:"+port;
const mime=file=>file.endsWith(".js")?"application/javascript":file.endsWith(".css")?"text/css":file.endsWith(".png")?"image/png":file.endsWith(".svg")?"image/svg+xml":"text/html";

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
  }catch{
    res.writeHead(404);res.end("not found");
  }
});
await new Promise(resolve=>server.listen(port,"127.0.0.1",resolve));

const chrome=spawn("/usr/bin/chromium",[
  "--headless","--no-sandbox","--disable-gpu",
  "--remote-debugging-address=127.0.0.1",
  "--remote-debugging-port="+debugPort,
  "--user-data-dir=/tmp/ht-pto-accrual-chrome",
  "--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1",
  "about:blank"
],{stdio:"ignore"});

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const check=(condition,message)=>{if(!condition)throw new Error(message);};

async function waitForDebug(){
  for(let i=0;i<50;i++){
    try{const r=await fetch("http://127.0.0.1:"+debugPort+"/json/version");if(r.ok)return}catch{}
    await sleep(100);
  }
  throw new Error("Chromium debug endpoint did not start");
}
await waitForDebug();

const tr=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/pto-accrual-calculator/"),{method:"PUT"});
check(tr.ok,"Unable to create Chromium target");
const target=await tr.json();
const ws=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});

let seq=0;const pending=new Map();const runtimeErrors=[];const consoleErrors=[];
ws.addEventListener("message",event=>{
  const msg=JSON.parse(event.data);
  if(msg.method==="Runtime.exceptionThrown")runtimeErrors.push(msg.params?.exceptionDetails?.text||"exception");
  if(msg.method==="Runtime.consoleAPICalled"&&msg.params?.type==="error")consoleErrors.push("console.error");
  if(!msg.id||!pending.has(msg.id))return;
  const item=pending.get(msg.id);pending.delete(msg.id);
  msg.error?item.reject(new Error(JSON.stringify(msg.error))):item.resolve(msg.result||{});
});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"Runtime evaluation failed");return r.result?.value;};
async function setValue(selector,value,event="input"){return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));return el.value;})()`);}
async function click(selector){return evaluate(`(()=>{document.querySelector(${JSON.stringify(selector)}).click();return true;})()`);}
async function snap(){return evaluate(`({
  method:document.querySelector("#pto-method").value,
  current:document.querySelector("#pto-current").value,
  used:document.querySelector("#pto-used").value,
  carry:document.querySelector("#pto-carry").value,
  cap:document.querySelector("#pto-cap").value,
  dayHours:document.querySelector("#pto-day-hours").value,
  projected:document.querySelector("#pto-projected").textContent.trim(),
  days:document.querySelector("#pto-days").textContent.trim(),
  earned:document.querySelector("#pto-earned").textContent.trim(),
  capReduction:document.querySelector("#pto-cap-reduction").textContent.trim(),
  usedOut:document.querySelector("#pto-used-out").textContent.trim(),
  carryOut:document.querySelector("#pto-carry-out").textContent.trim(),
  formula:document.querySelector("#pto-formula").textContent.trim(),
  status:document.querySelector("#pto-status").textContent.trim(),
  overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
})`);}
async function field(selector,errorSelector){return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)}),er=document.querySelector(${JSON.stringify(errorSelector)});return {aria:el.getAttribute("aria-invalid"),error:er.textContent.trim(),hidden:er.hidden};})()`);}

try{
  await send("Page.enable");await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/pto-accrual-calculator/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#pto-projected")?.textContent.includes("8.00")'))break;await sleep(100)}
  await sleep(100);

  let s=await snap();
  check(s.method==="hours"&&s.earned==="8.00 h"&&s.projected==="8.00 h","1 default hourly result");
  check(s.days==="1.00 days"&&s.capReduction==="0.00 h","2 default days/cap");
  check(s.formula.includes("160.00 eligible hours × 0.0500")&&s.status.includes("No final-balance cap"),"3 default formula/status");
  check(s.overflow===false,"4 mobile overflow");

  await click("#pto-example");await sleep(20);s=await snap();
  check(s.method==="annual"&&s.current==="12"&&s.used==="8"&&s.carry==="4"&&s.cap==="64","5 example inputs");
  check(s.earned==="60.00 h"&&s.projected==="64.00 h"&&s.capReduction==="4.00 h","6 annual example result");
  check(s.days==="8.00 days"&&s.formula.includes("120.00 annual PTO hours ÷ 26 periods × 13 completed"),"7 annual formula/days");
  check(s.status.includes("reduced the arithmetic projection by 4.00 hours"),"8 annual cap status");

  await setValue("#pto-method","hours","change");
  await setValue("#pto-current","0");await setValue("#pto-used","0");await setValue("#pto-carry","0");await setValue("#pto-cap","0");
  await setValue("#pto-rate","0.03846");await setValue("#pto-worked","160");s=await snap();
  check(s.earned==="6.15 h"&&s.projected==="6.15 h","9 decimal hourly accrual");

  await setValue("#pto-method","period","change");await setValue("#pto-periods","2");await setValue("#pto-per-period","4.5");s=await snap();
  check(s.earned==="9.00 h"&&s.projected==="9.00 h"&&s.formula.includes("2 eligible pay periods × 4.50"),"10 pay-period accrual");

  await setValue("#pto-method","fixed","change");await setValue("#pto-fixed","8");s=await snap();
  check(s.earned==="8.00 h"&&s.formula==="8.00 PTO hours added","11 fixed accrual/formula");

  await setValue("#pto-method","hours","change");await setValue("#pto-rate","0.05");await setValue("#pto-worked","160");await setValue("#pto-used","10");s=await snap();
  check(s.projected==="-2.00 h"&&s.days==="-0.25 days","12 negative arithmetic balance");

  await setValue("#pto-current","100");await setValue("#pto-used","0");await setValue("#pto-carry","10");await setValue("#pto-rate","1");await setValue("#pto-worked","20");await setValue("#pto-cap","120");s=await snap();
  check(s.earned==="20.00 h"&&s.projected==="120.00 h"&&s.capReduction==="10.00 h","13 cap arithmetic");

  await click("#pto-reset");await setValue("#pto-current","");s=await snap();let inv=await field("#pto-current","#pto-current-error");
  check(inv.aria==="true"&&!inv.hidden&&s.projected==="—","14 blank current invalid");
  await setValue("#pto-current","-1");inv=await field("#pto-current","#pto-current-error");check(inv.aria==="true","15 negative current invalid");

  await setValue("#pto-current","0");await setValue("#pto-used","");inv=await field("#pto-used","#pto-used-error");check(inv.aria==="true","16 blank used invalid");
  await setValue("#pto-used","-1");inv=await field("#pto-used","#pto-used-error");check(inv.aria==="true","17 negative used invalid");

  await setValue("#pto-used","0");await setValue("#pto-carry","");inv=await field("#pto-carry","#pto-carry-error");check(inv.aria==="true","18 blank carry invalid");
  await setValue("#pto-carry","-1");inv=await field("#pto-carry","#pto-carry-error");check(inv.aria==="true","19 negative carry invalid");

  await setValue("#pto-carry","0");await setValue("#pto-cap","");s=await snap();inv=await field("#pto-cap","#pto-cap-error");
  check(inv.aria==="false"&&inv.hidden===true&&s.projected==="8.00 h","20 blank cap means none");
  await setValue("#pto-cap","-1");inv=await field("#pto-cap","#pto-cap-error");check(inv.aria==="true","21 negative cap invalid");

  await setValue("#pto-cap","0");await setValue("#pto-day-hours","");inv=await field("#pto-day-hours","#pto-day-hours-error");check(inv.aria==="true","22 blank workday invalid");
  await setValue("#pto-day-hours","0");inv=await field("#pto-day-hours","#pto-day-hours-error");check(inv.aria==="true","23 zero workday invalid");
  await setValue("#pto-day-hours","25");inv=await field("#pto-day-hours","#pto-day-hours-error");check(inv.aria==="true","24 workday over 24 invalid");

  await setValue("#pto-day-hours","8");await setValue("#pto-rate","");inv=await field("#pto-rate","#pto-rate-error");check(inv.aria==="true","25 blank hourly rate invalid");
  await setValue("#pto-rate","-0.01");inv=await field("#pto-rate","#pto-rate-error");check(inv.aria==="true","26 negative hourly rate invalid");
  await setValue("#pto-rate","0.05");await setValue("#pto-worked","");inv=await field("#pto-worked","#pto-worked-error");check(inv.aria==="true","27 blank worked invalid");
  await setValue("#pto-worked","-1");inv=await field("#pto-worked","#pto-worked-error");check(inv.aria==="true","28 negative worked invalid");

  await setValue("#pto-worked","160");await setValue("#pto-method","period","change");await setValue("#pto-periods","1.5");inv=await field("#pto-periods","#pto-periods-error");
  check(inv.aria==="true"&&inv.error.includes("whole number"),"29 fractional periods invalid");
  await setValue("#pto-periods","-1");inv=await field("#pto-periods","#pto-periods-error");check(inv.aria==="true","30 negative periods invalid");
  await setValue("#pto-periods","2");await setValue("#pto-per-period","");inv=await field("#pto-per-period","#pto-per-period-error");check(inv.aria==="true","31 blank per-period invalid");

  await setValue("#pto-per-period","4");await setValue("#pto-method","annual","change");await setValue("#pto-periods-year","0");inv=await field("#pto-periods-year","#pto-periods-year-error");
  check(inv.aria==="true","32 annual periods/year zero invalid");
  await setValue("#pto-periods-year","26.5");inv=await field("#pto-periods-year","#pto-periods-year-error");check(inv.aria==="true"&&inv.error.includes("whole number"),"33 annual periods/year fractional invalid");
  await setValue("#pto-periods-year","26");await setValue("#pto-periods-elapsed","27");inv=await field("#pto-periods-elapsed","#pto-periods-elapsed-error");
  check(inv.aria==="true"&&inv.error.includes("cannot exceed"),"34 elapsed exceeds year invalid");
  await setValue("#pto-periods-elapsed","13.5");inv=await field("#pto-periods-elapsed","#pto-periods-elapsed-error");check(inv.aria==="true"&&inv.error.includes("whole number"),"35 annual elapsed fractional invalid");

  await setValue("#pto-periods-elapsed","13");await setValue("#pto-method","fixed","change");await setValue("#pto-fixed","");inv=await field("#pto-fixed","#pto-fixed-error");
  check(inv.aria==="true","36 blank fixed invalid");

  await setValue("#pto-method","hours","change");await setValue("#pto-rate","0");await setValue("#pto-worked","0");s=await snap();
  check(s.earned==="0.00 h"&&s.projected==="0.00 h"&&s.days==="0.00 days","37 explicit zero accrual valid");

  await click("#pto-example");
  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true});');
  const copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#pto-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied;})()');
  check(copied.includes("PTO accrual method: From annual allowance")&&copied.includes("Projected PTO balance: 64.00 hours")&&copied.includes("Projected workdays: 8.00"),"38 copy valid result");

  await setValue("#pto-current","");
  const noCopy=await evaluate('(async()=>{window.__copied="sentinel";document.querySelector("#pto-copy").click();await new Promise(r=>setTimeout(r,20));return {copied:window.__copied,status:document.querySelector("#pto-status").textContent.trim()};})()');
  check(noCopy.copied==="sentinel"&&noCopy.status.includes("valid values"),"39 invalid copy suppression");

  await click("#pto-reset");await sleep(20);s=await snap();
  check(s.method==="hours"&&s.current==="0"&&s.used==="0"&&s.carry==="0"&&s.cap==="0"&&s.dayHours==="8","40 reset inputs");
  check(s.earned==="8.00 h"&&s.projected==="8.00 h"&&s.days==="1.00 days","41 reset result");

  const visibility=await evaluate('({hours:[...document.querySelectorAll("[data-hours-fields]")].every(x=>!x.hidden),period:[...document.querySelectorAll("[data-period-fields]")].every(x=>x.hidden),annual:[...document.querySelectorAll("[data-annual-fields]")].every(x=>x.hidden),fixed:[...document.querySelectorAll("[data-fixed-fields]")].every(x=>x.hidden)})');
  check(visibility.hours&&visibility.period&&visibility.annual&&visibility.fixed,"42 reset method visibility");

  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,metrics:document.querySelectorAll("[data-pto-accrual] .metric").length,state:!!document.querySelector("#pto-state"),payout:!!document.querySelector("#pto-payout"),waiting:!!document.querySelector("#pto-waiting-period"),copy:!!document.querySelector("#pto-copy"),skip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/pto-accrual-calculator/","43 canonical");
  check(seo.faq===8&&seo.metrics===6&&seo.copy&&seo.skip&&!seo.state&&!seo.payout&&!seo.waiting,"44 scope/schema UI contract");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:base+"/pto-accrual-calculator/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#pto-projected")?.textContent.includes("8.00")'))break;await sleep(100)}
  const desktop=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,metrics:document.querySelectorAll("[data-pto-accrual] .metric").length,projected:document.querySelector("#pto-projected").textContent.trim(),faq:document.querySelectorAll(".faq details").length})');
  check(desktop.overflow===false&&desktop.metrics===6&&desktop.projected==="8.00 h"&&desktop.faq===8,"45 desktop UI regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"46 browser errors");

  console.log("PTO Accrual 46-case calculation/UI matrix: PASS");
} finally {
  try{ws.close()}catch{}
  chrome.kill("SIGTERM");server.close();
}
