import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9885;
const debugPort=9232;
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
    res.writeHead(404);
    res.end("not found");
  }
});
await new Promise(resolve=>server.listen(port,"127.0.0.1",resolve));

const chrome=spawn("/usr/bin/chromium",[
  "--headless","--no-sandbox","--disable-gpu",
  "--remote-debugging-address=127.0.0.1",
  "--remote-debugging-port="+debugPort,
  "--user-data-dir=/tmp/ht-clock-out-chrome",
  "--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1",
  "about:blank"
],{stdio:"ignore"});

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const check=(condition,message)=>{if(!condition)throw new Error(message);};

async function waitForDebug(){
  for(let i=0;i<50;i++){
    try{
      const response=await fetch("http://127.0.0.1:"+debugPort+"/json/version");
      if(response.ok)return;
    }catch{}
    await sleep(100);
  }
  throw new Error("Chromium debug endpoint did not start");
}
await waitForDebug();

const targetResponse=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/clock-out-time-calculator/"),{method:"PUT"});
check(targetResponse.ok,"Unable to create Chromium target");
const target=await targetResponse.json();
const ws=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{
  ws.addEventListener("open",resolve,{once:true});
  ws.addEventListener("error",reject,{once:true});
});

let seq=0;
const pending=new Map();
const runtimeErrors=[];
const consoleErrors=[];
ws.addEventListener("message",event=>{
  const msg=JSON.parse(event.data);
  if(msg.method==="Runtime.exceptionThrown")runtimeErrors.push(msg.params?.exceptionDetails?.text||"exception");
  if(msg.method==="Runtime.consoleAPICalled"&&msg.params?.type==="error")consoleErrors.push("console.error");
  if(!msg.id||!pending.has(msg.id))return;
  const item=pending.get(msg.id);
  pending.delete(msg.id);
  msg.error?item.reject(new Error(JSON.stringify(msg.error))):item.resolve(msg.result||{});
});
const send=(method,params={})=>new Promise((resolve,reject)=>{
  const id=++seq;
  pending.set(id,{resolve,reject});
  ws.send(JSON.stringify({id,method,params}));
});
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
    start:document.querySelector("#co-start").value,
    hours:document.querySelector("#co-hours").value,
    minutes:document.querySelector("#co-minutes").value,
    breakValue:document.querySelector("#co-break").value,
    extra:document.querySelector("#co-extra-break").value,
    time12:document.querySelector("#co-time-12").textContent.trim(),
    time24:document.querySelector("#co-time-24").textContent.trim(),
    day:document.querySelector("#co-day").textContent.trim(),
    paid:document.querySelector("#co-paid").textContent.trim(),
    unpaid:document.querySelector("#co-unpaid").textContent.trim(),
    span:document.querySelector("#co-span").textContent.trim(),
    formula:document.querySelector("#co-formula").textContent.trim(),
    status:document.querySelector("#co-status").textContent.trim(),
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  })`);
}
async function field(selector,errorSelector){
  return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)}),er=document.querySelector(${JSON.stringify(errorSelector)});return {value:el.value,aria:el.getAttribute("aria-invalid"),error:er.textContent.trim(),hidden:er.hidden};})()`);
}

try{
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/clock-out-time-calculator/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#co-time-12")?.textContent.trim()==="5:00 PM"'))break;
    await sleep(100);
  }
  await sleep(100);

  let s=await snap();
  check(s.time12==="5:00 PM"&&s.time24==="17:00"&&s.day==="Same day","1 initial clock-out");
  check(s.paid==="8h 00m · 8.00 h"&&s.unpaid==="30m"&&s.span==="8h 30m","2 initial durations");
  check(s.formula.includes("8:30 AM")&&s.formula.includes("5:00 PM"),"3 initial formula");
  check(s.overflow===false,"4 mobile overflow");

  await evaluate('document.querySelector("#co-example-partial").click()');
  await sleep(20);
  s=await snap();
  check(s.start==="09:00"&&s.hours==="7"&&s.minutes==="30","5 partial inputs");
  check(s.time12==="4:30 PM"&&s.time24==="16:30"&&s.day==="Same day","6 partial result");
  check(s.paid==="7h 30m · 7.50 h"&&s.unpaid==="0m"&&s.span==="7h 30m","7 partial durations");

  await evaluate('document.querySelector("#co-example-overnight").click()');
  await sleep(20);
  s=await snap();
  check(s.time12==="6:00 AM"&&s.time24==="06:00"&&s.day==="Next day","8 overnight result");
  check(s.formula.includes("Next day"),"9 overnight formula");

  await setValue("#co-start","08:00");
  await setValue("#co-hours",8);
  await setValue("#co-minutes",0);
  await setValue("#co-break",30);
  await setValue("#co-extra-break",15);
  s=await snap();
  check(s.time12==="4:45 PM"&&s.time24==="16:45","10 multiple-break finish");
  check(s.unpaid==="45m"&&s.span==="8h 45m","11 multiple-break totals");

  await setValue("#co-extra-break","");
  s=await snap();
  check(s.time12==="4:30 PM"&&s.unpaid==="30m","12 optional blank extra break valid");

  await setValue("#co-hours","");
  let inv=await field("#co-hours","#co-hours-error");
  s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&s.time12==="—"&&s.time24==="—","13 blank hours invalid");

  await setValue("#co-hours","8.5");
  inv=await field("#co-hours","#co-hours-error");
  check(inv.aria==="true"&&inv.error.includes("whole number"),"14 decimal hours invalid");

  await setValue("#co-hours",-1);
  inv=await field("#co-hours","#co-hours-error");
  check(inv.aria==="true"&&inv.error.includes("between 0 and 72"),"15 negative hours invalid");

  await setValue("#co-hours",73);
  inv=await field("#co-hours","#co-hours-error");
  check(inv.aria==="true","16 hours upper boundary invalid");

  await setValue("#co-hours",8);
  await setValue("#co-minutes","");
  inv=await field("#co-minutes","#co-minutes-error");
  check(inv.aria==="true","17 blank minutes invalid");

  await setValue("#co-minutes","30.5");
  inv=await field("#co-minutes","#co-minutes-error");
  check(inv.aria==="true"&&inv.error.includes("whole number"),"18 decimal minutes invalid");

  await setValue("#co-minutes",-1);
  inv=await field("#co-minutes","#co-minutes-error");
  check(inv.aria==="true","19 negative minutes invalid");

  await setValue("#co-minutes",60);
  inv=await field("#co-minutes","#co-minutes-error");
  check(inv.aria==="true","20 minutes upper boundary invalid");

  await setValue("#co-minutes",0);
  await setValue("#co-break","");
  inv=await field("#co-break","#co-break-error");
  check(inv.aria==="true","21 blank primary break invalid");

  await setValue("#co-break","30.5");
  inv=await field("#co-break","#co-break-error");
  check(inv.aria==="true"&&inv.error.includes("whole number"),"22 decimal break invalid");

  await setValue("#co-break",-1);
  inv=await field("#co-break","#co-break-error");
  check(inv.aria==="true","23 negative break invalid");

  await setValue("#co-break",1441);
  inv=await field("#co-break","#co-break-error");
  check(inv.aria==="true","24 break upper boundary invalid");

  await setValue("#co-break",30);
  await setValue("#co-extra-break","15.5");
  inv=await field("#co-extra-break","#co-extra-break-error");
  check(inv.aria==="true","25 decimal extra break invalid");

  await setValue("#co-extra-break",-1);
  inv=await field("#co-extra-break","#co-extra-break-error");
  check(inv.aria==="true","26 negative extra break invalid");

  await setValue("#co-extra-break",1441);
  inv=await field("#co-extra-break","#co-extra-break-error");
  check(inv.aria==="true","27 extra break upper boundary invalid");

  await setValue("#co-extra-break",0);
  await setValue("#co-start","");
  inv=await field("#co-start","#co-start-error");
  s=await snap();
  check(inv.aria==="true"&&s.time12==="—"&&s.paid==="—","28 blank start invalid");

  await setValue("#co-start","00:00");
  await setValue("#co-hours",0);
  await setValue("#co-minutes",0);
  await setValue("#co-break",0);
  await setValue("#co-extra-break","");
  s=await snap();
  check(s.time12==="12:00 AM"&&s.time24==="00:00"&&s.day==="Same day","29 all-zero duration valid");
  check(s.paid==="0h 00m · 0.00 h"&&s.unpaid==="0m"&&s.span==="0h 00m","30 zero duration outputs");

  await setValue("#co-start","23:30");
  await setValue("#co-hours",72);
  await setValue("#co-minutes",59);
  await setValue("#co-break",1440);
  await setValue("#co-extra-break",1440);
  s=await snap();
  check(s.day==="5 days later","31 multi-day offset");
  check(s.time12==="12:29 AM"&&s.time24==="00:29","32 multi-day clock wrap");

  await evaluate('document.querySelector("[data-hours-preset=\"8.5\"]").click()');
  await sleep(20);
  s=await snap();
  check(s.hours==="8"&&s.minutes==="30","33 8.5-hour preset");

  await evaluate('document.querySelector("[data-break-preset=\"45\"]").click()');
  await sleep(20);
  s=await snap();
  check(s.breakValue==="45","34 break preset");

  await evaluate('document.querySelector("#co-reset").click()');
  await sleep(20);
  s=await snap();
  check(s.start==="08:30"&&s.hours==="8"&&s.minutes==="0"&&s.breakValue==="30"&&s.extra==="","35 reset values");
  check(s.time12==="5:00 PM"&&s.time24==="17:00","36 reset result");

  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true});');
  const copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#co-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied;})()');
  check(copied.includes("Clock in: 8:30 AM")&&copied.includes("Clock out: 5:00 PM (17:00) · Same day"),"37 copy schedule");

  const nowValue=await evaluate('(()=>{document.querySelector("#co-now").click();return document.querySelector("#co-start").value;})()');
  check(/^\d{2}:\d{2}$/.test(nowValue),"38 current-time input");

  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,end:!!document.querySelector("#co-end"),rate:!!document.querySelector("#co-rate"),overtime:!!document.querySelector("#co-overtime"),metrics:document.querySelectorAll("[data-clock-out] .metric").length,hasSkip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/clock-out-time-calculator/","39 canonical");
  check(seo.faq===7&&seo.metrics===5&&seo.hasSkip&&!seo.end&&!seo.rate&&!seo.overtime,"40 scope/schema UI contract");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:base+"/clock-out-time-calculator/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#co-time-12")?.textContent.trim()==="5:00 PM"'))break;
    await sleep(100);
  }
  const desktop=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,metrics:document.querySelectorAll("[data-clock-out] .metric").length,buttons:document.querySelectorAll("[data-clock-out] button").length,time:document.querySelector("#co-time-12").textContent.trim()})');
  check(desktop.overflow===false&&desktop.metrics===5&&desktop.buttons>=14&&desktop.time==="5:00 PM","41 desktop UI regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"42 browser errors");

  console.log("Clock Out 42-case calculation/UI matrix: PASS");
} finally {
  try{ws.close();}catch{}
  chrome.kill("SIGTERM");
  server.close();
}
