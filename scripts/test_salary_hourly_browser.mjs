import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9896,debugPort=9245,base="http://127.0.0.1:"+port,userDir="/tmp/ht-salary-hourly-chrome";
await rm(userDir,{recursive:true,force:true});
const mime=f=>f.endsWith(".js")?"application/javascript":f.endsWith(".css")?"text/css":f.endsWith(".png")?"image/png":f.endsWith(".svg")?"image/svg+xml":"text/html";
const server=createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,base).pathname);if(p.endsWith("/"))p+="index.html";const target=path.join(root,p);if(!target.startsWith(root))throw 0;const data=await readFile(target);res.writeHead(200,{"content-type":mime(target)});res.end(data)}catch{res.writeHead(404);res.end("not found")}});
await new Promise(r=>server.listen(port,"127.0.0.1",r));

const chrome=spawn("/usr/bin/chromium",["--headless","--no-sandbox","--disable-gpu","--remote-debugging-address=127.0.0.1","--remote-debugging-port="+debugPort,"--user-data-dir="+userDir,"--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1","about:blank"],{stdio:"ignore"});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),check=(c,m)=>{if(!c)throw new Error(m)};
for(let i=0;i<50;i++){try{if((await fetch("http://127.0.0.1:"+debugPort+"/json/version")).ok)break}catch{}await sleep(100)}
const tr=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/salary-to-hourly-calculator/"),{method:"PUT"});check(tr.ok,"target");
const target=await tr.json(),ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.addEventListener("open",r,{once:true});ws.addEventListener("error",j,{once:true})});

let seq=0;const pending=new Map(),runtimeErrors=[],consoleErrors=[];
ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.method==="Runtime.exceptionThrown")runtimeErrors.push("runtime");if(m.method==="Runtime.consoleAPICalled"&&m.params?.type==="error")consoleErrors.push("console");if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result||{})});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval");return r.result?.value};
const q=s=>JSON.stringify(s);
const set=async(sel,v,event="input")=>ev(`(()=>{const e=document.querySelector(${q(sel)});e.value=${q(String(v))};e.dispatchEvent(new Event(${q(event)},{bubbles:true}));return e.value})()`);
const click=sel=>ev(`document.querySelector(${q(sel)}).click()`);
const typeRaw=async(sel,text)=>{await ev(`(()=>{const e=document.querySelector(${q(sel)});e.focus();e.value="";e.dispatchEvent(new Event("input",{bubbles:true}));return true})()`);await send("Input.insertText",{text});await sleep(30);return ev(`document.querySelector(${q(sel)}).validity.badInput`)};
const snap=()=>ev('({salary:document.querySelector("#sh-salary").value,hours:document.querySelector("#sh-hours").value,weeks:document.querySelector("#sh-weeks").value,days:document.querySelector("#sh-days").value,hourly:document.querySelector("#sh-hourly").textContent.trim(),daily:document.querySelector("#sh-daily").textContent.trim(),weekly:document.querySelector("#sh-weekly").textContent.trim(),biweekly:document.querySelector("#sh-biweekly").textContent.trim(),monthly:document.querySelector("#sh-monthly").textContent.trim(),annualHours:document.querySelector("#sh-annual-hours").textContent.trim(),formula:document.querySelector("#sh-formula").textContent.trim(),status:document.querySelector("#sh-status").textContent.trim(),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})');
const field=(sel,err)=>ev(`(()=>{const x=document.querySelector(${q(sel)}),e=document.querySelector(${q(err)});return {aria:x.getAttribute("aria-invalid"),error:e.textContent.trim(),hidden:e.hidden}})()`);

try{
  await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});await send("Page.navigate",{url:base+"/salary-to-hourly-calculator/"});
  for(let i=0;i<50;i++){if(await ev('document.readyState==="complete"&&document.querySelector("#sh-hourly")?.textContent.includes("25.00")'))break;await sleep(100)}
  await sleep(80);

  let s=await snap();
  check(s.salary==="52000"&&s.hours==="40"&&s.weeks==="52"&&s.days==="5","1 default inputs");
  check(s.hourly.includes("25.00")&&s.daily.includes("200.00")&&s.weekly.includes("1,000.00"),"2 default hourly/daily/weekly");
  check(s.biweekly.includes("2,000.00")&&s.monthly.includes("4,333.33")&&s.annualHours==="2,080","3 default period outputs");
  check(s.status.includes("Valid gross conversion")&&!s.overflow,"4 default status/mobile overflow");

  await click("#sh-example");await sleep(20);s=await snap();
  check(s.salary==="60000"&&s.hours==="37.5"&&s.weeks==="52"&&s.days==="5","5 example inputs");
  check(s.annualHours==="1,950"&&s.hourly.includes("30.77"),"6 example annual hours/hourly");
  check(s.daily.includes("230.77")&&s.weekly.includes("1,153.85")&&s.biweekly.includes("2,307.69")&&s.monthly.includes("5,000.00"),"7 example breakdown");

  await set("#sh-hours","40");s=await snap();
  check(s.hourly.includes("28.85")&&s.annualHours==="2,080","8 60k standard schedule");

  await set("#sh-weeks","50");s=await snap();
  check(s.annualHours==="2,000"&&s.hourly.includes("30.00")&&s.weekly.includes("1,200.00")&&s.biweekly.includes("2,400.00"),"9 50 paid weeks");
  check(s.monthly.includes("5,000.00")&&!s.monthly.includes("4,800"),"10 monthly uses annual divided by 12");

  await set("#sh-weeks","50.5");s=await snap();
  check(s.annualHours==="2,020"&&s.hourly.includes("29.70"),"11 fractional paid weeks valid");
  let f=await field("#sh-weeks","#sh-weeks-error");check(f.aria==="false"&&f.hidden===true,"12 fractional weeks field state");

  await set("#sh-salary","0");s=await snap();f=await field("#sh-salary","#sh-salary-error");
  check(s.hourly.includes("0.00")&&s.weekly.includes("0.00")&&f.aria==="false","13 zero salary valid");

  await set("#sh-salary","");s=await snap();f=await field("#sh-salary","#sh-salary-error");
  check(s.hourly==="—"&&f.aria==="true"&&!f.hidden&&f.error.includes("required"),"14 blank salary invalid");

  await set("#sh-salary","-1");s=await snap();f=await field("#sh-salary","#sh-salary-error");
  check(s.hourly==="—"&&f.aria==="true","15 negative salary invalid");

  await set("#sh-salary","");const badSalary=await typeRaw("#sh-salary","1e");s=await snap();
  check(badSalary&&s.hourly==="—","16 malformed salary invalid");

  await set("#sh-salary","60000");await set("#sh-hours","");s=await snap();f=await field("#sh-hours","#sh-hours-error");
  check(s.hourly==="—"&&f.aria==="true","17 blank hours invalid");

  await set("#sh-hours","0");s=await snap();f=await field("#sh-hours","#sh-hours-error");
  check(s.hourly==="—"&&f.aria==="true"&&f.error.includes("greater than 0"),"18 zero hours invalid");

  await set("#sh-hours","169");s=await snap();f=await field("#sh-hours","#sh-hours-error");
  check(s.hourly==="—"&&f.aria==="true","19 hours over 168 invalid");

  await set("#sh-hours","");const badHours=await typeRaw("#sh-hours","1e");s=await snap();
  check(badHours&&s.hourly==="—","20 malformed hours invalid");

  await set("#sh-hours","40");await set("#sh-weeks","");s=await snap();f=await field("#sh-weeks","#sh-weeks-error");
  check(s.hourly==="—"&&f.aria==="true","21 blank weeks invalid");

  await set("#sh-weeks","0");s=await snap();f=await field("#sh-weeks","#sh-weeks-error");
  check(s.hourly==="—"&&f.aria==="true"&&f.error.includes("greater than 0"),"22 zero weeks invalid");

  await set("#sh-weeks","54");s=await snap();f=await field("#sh-weeks","#sh-weeks-error");
  check(s.hourly==="—"&&f.aria==="true","23 weeks over 53 invalid");

  await set("#sh-weeks","");const badWeeks=await typeRaw("#sh-weeks","1e");s=await snap();
  check(badWeeks&&s.hourly==="—","24 malformed weeks invalid");

  await set("#sh-weeks","52");await set("#sh-days","0");s=await snap();f=await field("#sh-days","#sh-days-error");
  check(s.hourly==="—"&&f.aria==="true","25 days zero invalid");

  await set("#sh-days","8");s=await snap();f=await field("#sh-days","#sh-days-error");
  check(s.hourly==="—"&&f.aria==="true","26 days over 7 invalid");

  await set("#sh-days","5.5");s=await snap();f=await field("#sh-days","#sh-days-error");
  check(s.hourly==="—"&&f.aria==="true"&&f.error.includes("whole number"),"27 fractional days invalid");

  await set("#sh-days","5");await set("#sh-currency","GBP","change");s=await snap();
  check(/£|GBP/.test(s.hourly)&&s.hourly.includes("28.85"),"28 currency formatting");

  await set("#sh-currency","USD","change");
  await ev('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true})');
  const copied=await ev('(async()=>{window.__copied="";document.querySelector("#sh-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied})()');
  check(copied.includes("Salary to hourly conversion")&&copied.includes("Paid weeks per year: 52")&&copied.includes("Average monthly equivalent: $5,000.00")&&copied.includes("no FX conversion"),"29 copy valid");

  await set("#sh-hours","");
  const noCopy=await ev('(async()=>{window.__copied="sentinel";document.querySelector("#sh-copy").click();await new Promise(r=>setTimeout(r,20));return {copied:window.__copied,status:document.querySelector("#sh-status").textContent.trim()}})()');
  check(noCopy.copied==="sentinel"&&noCopy.status.includes("valid values"),"30 invalid copy suppression");

  await set("#sh-hours","40");await ev('window.__printed=false;window.print=()=>window.__printed=true');await click("#sh-print");
  check(await ev("window.__printed===true"),"31 print");

  await click("#sh-reset");s=await snap();
  check(s.salary==="52000"&&s.hours==="40"&&s.weeks==="52"&&s.days==="5"&&s.hourly.includes("25.00"),"32 reset");

  const seo=await ev('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,metrics:document.querySelectorAll("[data-salary-hourly] .metric").length,runtime:[...document.scripts].find(x=>x.src.includes("salary-to-hourly.js"))?.src,tax:!!document.querySelector("#sh-tax"),overtime:!!document.querySelector("#sh-overtime"),copy:!!document.querySelector("#sh-copy"),print:!!document.querySelector("#sh-print"),skip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/salary-to-hourly-calculator/","33 canonical");
  check(seo.faq===8&&seo.metrics===6&&seo.runtime.includes("20261009-remediation1")&&seo.copy&&seo.print&&seo.skip&&!seo.tax&&!seo.overtime,"34 scope/schema/runtime");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});await send("Page.navigate",{url:base+"/salary-to-hourly-calculator/"});
  for(let i=0;i<50;i++){if(await ev('document.readyState==="complete"&&document.querySelector("#sh-hourly")?.textContent.includes("25.00")'))break;await sleep(100)}
  s=await snap();check(!s.overflow&&s.hourly.includes("25.00"),"35 desktop regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"36 browser errors");

  console.log("Salary to Hourly 36-case calculation/UI matrix: PASS");
} finally {
  try{ws.close()}catch{}
  chrome.kill("SIGTERM");
  server.close();
}
