import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9883;
const debugPort=9230;
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
  }catch{res.writeHead(404);res.end("not found");}
});
await new Promise(resolve=>server.listen(port,"127.0.0.1",resolve));

const chrome=spawn("/usr/bin/chromium",[
  "--headless","--no-sandbox","--disable-gpu",
  "--remote-debugging-address=127.0.0.1",
  "--remote-debugging-port="+debugPort,
  "--user-data-dir=/tmp/ht-work-hours-chrome",
  "--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1",
  "about:blank"
],{stdio:"ignore"});

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const check=(condition,message)=>{if(!condition)throw new Error(message);};

async function waitForDebug(){
  for(let i=0;i<50;i++){
    try{const r=await fetch("http://127.0.0.1:"+debugPort+"/json/version");if(r.ok)return;}catch{}
    await sleep(100);
  }
  throw new Error("Chromium debug endpoint did not start");
}
await waitForDebug();

const targetResponse=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/work-hours-calculator/"),{method:"PUT"});
check(targetResponse.ok,"Unable to create Chromium target");
const target=await targetResponse.json();
const ws=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});

let seq=0;
const pending=new Map();
ws.addEventListener("message",event=>{
  const msg=JSON.parse(event.data);
  if(!msg.id||!pending.has(msg.id))return;
  const item=pending.get(msg.id);pending.delete(msg.id);
  msg.error?item.reject(new Error(JSON.stringify(msg.error))):item.resolve(msg.result||{});
});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{
  const r=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});
  if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"Runtime evaluation failed");
  return r.result?.value;
};
async function setValue(selector,value,event="input"){
  return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));return el.value;})()`);
}
async function snap(){
  return evaluate(`({
    gross:document.querySelector("#wh-gross").textContent.trim(),
    dailyTime:document.querySelector("#wh-daily-time").textContent.trim(),
    daily:document.querySelector("#wh-daily").textContent.trim(),
    totalTime:document.querySelector("#wh-total-time").textContent.trim(),
    total:document.querySelector("#wh-weekly").textContent.trim(),
    minutes:document.querySelector("#wh-minutes").textContent.trim(),
    pay:document.querySelector("#wh-pay").textContent.trim(),
    formula:document.querySelector("#wh-formula").textContent.trim(),
    status:document.querySelector("#wh-status").textContent.trim(),
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  })`);
}
async function field(selector,errorSelector){
  return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)}),er=document.querySelector(${JSON.stringify(errorSelector)});return {value:el.value,aria:el.getAttribute("aria-invalid"),error:er.textContent.trim(),hidden:er.hidden};})()`);
}

try{
  await send("Page.enable");await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/work-hours-calculator/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#wh-total-time")?.textContent.trim()==="40h 0m"'))break;
    await sleep(100);
  }
  await sleep(120);

  // 1-5 initial/default contract.
  let s=await snap();
  check(s.gross==="8h 30m","1 initial gross");
  check(s.dailyTime==="8h 0m"&&s.daily==="8.00","2 initial daily");
  check(s.totalTime==="40h 0m"&&s.total==="40.00","3 initial total");
  check(s.minutes==="2,400","4 initial minutes");
  check(s.pay==="—"&&s.overflow===false,"5 optional blank pay/mobile overflow");

  // 6-10 break and overnight arithmetic.
  await setValue("#wh-break",0);
  s=await snap();check(s.dailyTime==="8h 30m"&&s.total==="42.50","6 zero break");

  await setValue("#wh-start","22:00");await setValue("#wh-end","06:00");await setValue("#wh-break",30);await setValue("#wh-days",1);
  s=await snap();check(s.gross==="8h 0m"&&s.dailyTime==="7h 30m"&&s.total==="7.50","7 overnight");
  check(s.formula.includes("overnight shift"),"8 overnight formula");

  await setValue("#wh-start","09:00");await setValue("#wh-end","09:00");await setValue("#wh-break",0);
  s=await snap();check(s.gross==="0h 0m"&&s.total==="0.00","9 same start/end zero");

  await setValue("#wh-start","09:00");await setValue("#wh-end","10:00");await setValue("#wh-break",90);
  s=await snap();check(s.gross==="1h 0m"&&s.dailyTime==="0h 0m"&&s.total==="0.00","10 break longer than shift floors zero");

  // 11-16 break validation.
  await setValue("#wh-break",30);
  let inv=await field("#wh-break","#wh-break-error");check(inv.aria==="false","11 valid break");
  await setValue("#wh-break","");
  inv=await field("#wh-break","#wh-break-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&s.total==="—","12 blank break invalid/clears output");
  await setValue("#wh-break",-1);
  inv=await field("#wh-break","#wh-break-error");check(inv.value==="-1"&&inv.aria==="true","13 negative break invalid");
  await setValue("#wh-break",1.5);
  inv=await field("#wh-break","#wh-break-error");check(inv.value==="1.5"&&inv.aria==="true","14 fractional break invalid");
  await setValue("#wh-break",1000);await setValue("#wh-start","09:00");await setValue("#wh-end","10:00");
  s=await snap();check(s.daily==="0.00","15 large whole break valid and floors");
  await setValue("#wh-break",0);s=await snap();check(s.daily==="1.00","16 break recovers");

  // 17-23 workday validation/boundaries.
  await setValue("#wh-start","09:00");await setValue("#wh-end","17:00");await setValue("#wh-break",0);await setValue("#wh-days",1);
  s=await snap();check(s.total==="8.00"&&s.minutes==="480","17 one day");
  await setValue("#wh-days",31);
  s=await snap();check(s.total==="248.00"&&s.minutes==="14,880","18 31 days");
  await setValue("#wh-days",32);
  inv=await field("#wh-days","#wh-days-error");s=await snap();check(inv.aria==="true"&&s.total==="—","19 32 days invalid");
  await setValue("#wh-days",0);
  inv=await field("#wh-days","#wh-days-error");check(inv.aria==="true","20 zero days invalid");
  await setValue("#wh-days",1.5);
  inv=await field("#wh-days","#wh-days-error");check(inv.value==="1.5"&&inv.aria==="true","21 fractional days invalid");
  await setValue("#wh-days","");
  inv=await field("#wh-days","#wh-days-error");check(inv.aria==="true"&&!inv.hidden,"22 blank days invalid");
  await setValue("#wh-days",5);s=await snap();check(s.total==="40.00","23 days recovery");

  // 24-27 required time validation.
  await setValue("#wh-start","");
  inv=await field("#wh-start","#wh-start-error");s=await snap();check(inv.aria==="true"&&s.gross==="—"&&s.pay==="—","24 blank start clears outputs");
  await setValue("#wh-start","09:00");await setValue("#wh-end","");
  inv=await field("#wh-end","#wh-end-error");s=await snap();check(inv.aria==="true"&&s.total==="—","25 blank end clears outputs");
  await setValue("#wh-end","17:00");s=await snap();check(s.total==="40.00","26 time recovery");
  await setValue("#wh-start","23:30");await setValue("#wh-end","00:15");await setValue("#wh-days",1);
  s=await snap();check(s.gross==="0h 45m"&&s.total==="0.75"&&s.minutes==="45","27 45-minute overnight");

  // 28-34 optional pay behavior.
  await setValue("#wh-start","09:00");await setValue("#wh-end","17:00");await setValue("#wh-days",5);await setValue("#wh-break",0);await setValue("#wh-rate","");
  s=await snap();check(s.pay==="—"&&s.total==="40.00","28 blank rate valid");
  await setValue("#wh-rate",0);
  s=await snap();check(s.pay==="$0.00","29 explicit zero rate");
  await setValue("#wh-rate",25);
  s=await snap();check(s.pay==="$1,000.00","30 pay exact");
  await setValue("#wh-currency","GBP","change");
  s=await snap();check(s.pay.includes("£1,000.00"),"31 currency formatting");
  await setValue("#wh-rate",-1);
  inv=await field("#wh-rate","#wh-rate-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&s.total==="40.00"&&s.pay==="—","32 negative rate suppresses pay only");
  check(s.status.includes("Fix the hourly rate"),"33 rate-specific status");
  await setValue("#wh-rate",25);await setValue("#wh-start","09:00");await setValue("#wh-end","17:01");await setValue("#wh-days",1);await setValue("#wh-currency","USD","change");
  s=await snap();check(s.total==="8.02"&&s.minutes==="481"&&s.pay==="$200.42","34 pay uses exact minutes");

  // 35-38 examples/reset/copy.
  await evaluate('document.querySelector("#wh-example").click()');await sleep(30);s=await snap();
  check(s.totalTime==="40h 0m"&&s.total==="40.00"&&s.pay==="$1,000.00","35 standard example");

  await evaluate('document.querySelector("#wh-overnight").click()');await sleep(30);s=await snap();
  check(s.dailyTime==="7h 30m"&&s.total==="7.50"&&s.pay==="—","36 overnight example");

  await evaluate('document.querySelector("#wh-reset").click()');await sleep(30);s=await snap();
  check(s.total==="40.00"&&s.pay==="—","37 reset");

  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true});');
  const copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#wh-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied;})()');
  check(copied.includes("8h 0m per day")&&copied.includes("40.00 decimal hours")&&copied.includes("2,400 minutes"),"38 copy summary");

  // 39-41 SEO / scope contract.
  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,dayInputs:document.querySelectorAll("[data-day], .timesheet-row").length,hasSkip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/work-hours-calculator/","39 canonical");
  check(seo.faq===7&&seo.hasSkip===true,"40 FAQ/skip link");
  check(seo.dayInputs===0,"41 variable-day grid introduced");

  // 42 desktop layout.
  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:base+"/work-hours-calculator/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#wh-total-time")?.textContent.trim()==="40h 0m"'))break;
    await sleep(100);
  }
  const desktop=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,metrics:document.querySelectorAll(".wh-result-grid .metric").length,buttons:document.querySelectorAll(".wh-actions button").length})');
  check(desktop.overflow===false&&desktop.metrics===7&&desktop.buttons===3,"42 desktop UI regression");

  console.log("Work Hours 42-case calculation/UI matrix: PASS");
} finally {
  try{ws.close();}catch{}
  chrome.kill("SIGTERM");
  server.close();
}
