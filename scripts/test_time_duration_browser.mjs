import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9887;
const debugPort=9234;
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
  "--user-data-dir=/tmp/ht-time-duration-chrome",
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

const targetResponse=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/time-duration-calculator/"),{method:"PUT"});
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
async function click(selector){
  return evaluate(`(()=>{document.querySelector(${JSON.stringify(selector)}).click();return true;})()`);
}
async function snap(){
  return evaluate(`({
    mode:document.querySelector("#td-mode").value,
    sd:document.querySelector("#td-start-date").value,
    ed:document.querySelector("#td-end-date").value,
    st:document.querySelector("#td-start-time").value,
    et:document.querySelector("#td-end-time").value,
    br:document.querySelector("#td-break").value,
    duration:document.querySelector("#td-duration").textContent.trim(),
    decimal:document.querySelector("#td-decimal").textContent.trim(),
    days:document.querySelector("#td-days").textContent.trim(),
    minutes:document.querySelector("#td-minutes").textContent.trim(),
    seconds:document.querySelector("#td-seconds").textContent.trim(),
    net:document.querySelector("#td-net").textContent.trim(),
    netDecimal:document.querySelector("#td-net-decimal").textContent.trim(),
    formula:document.querySelector("#td-formula").textContent.trim(),
    status:document.querySelector("#td-status").textContent.trim(),
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  })`);
}
async function field(selector,errorSelector){
  return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)}),er=document.querySelector(${JSON.stringify(errorSelector)});return {value:el.value,aria:el.getAttribute("aria-invalid"),error:er.textContent.trim(),hidden:er.hidden};})()`);
}
async function setTimeRange(start,end,breakValue="0"){
  await setValue("#td-start-time",start);
  await setValue("#td-end-time",end);
  await setValue("#td-break",breakValue);
}

try{
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/time-duration-calculator/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#td-duration")?.textContent.trim()==="8h 30m 0s"'))break;
    await sleep(100);
  }
  await sleep(100);

  let s=await snap();
  check(s.duration==="8h 30m 0s"&&s.decimal==="8.50","1 default duration");
  check(s.days==="0.3542"&&s.minutes==="510"&&s.seconds==="30,600","2 default totals");
  check(s.net==="8h 30m 0s"&&s.netDecimal==="8.50","3 default net");
  check(s.overflow===false,"4 mobile overflow");

  await setTimeRange("13:20:15","17:05:45","0");
  s=await snap();
  check(s.duration==="3h 45m 30s"&&s.decimal==="3.7583","5 seconds duration");
  check(s.minutes==="225.50"&&s.seconds==="13,530","6 seconds totals");

  await setTimeRange("22:00:00","06:00:00","0");
  s=await snap();
  check(s.duration==="8h 0m 0s"&&s.decimal==="8.00","7 overnight duration");
  check(s.status.includes("next day"),"8 overnight status");

  await setTimeRange("09:00:00","09:00:00","0");
  s=await snap();
  check(s.duration==="0h 0m 0s"&&s.decimal==="0.00"&&s.days==="0.0000","9 equal zero");
  check(s.status.includes("duration is zero"),"10 equal status");

  await setTimeRange("09:00:00","17:30:00","30");
  s=await snap();
  check(s.duration==="8h 30m 0s"&&s.net==="8h 0m 0s"&&s.netDecimal==="8.00","11 break deduction");
  check(s.formula.includes("30m break"),"12 break formula");

  await setValue("#td-break","600");
  s=await snap();
  check(s.net==="0h 0m 0s"&&s.netDecimal==="0.00","13 break floor");
  check(s.status.includes("floored at zero"),"14 break floor status");

  await setValue("#td-break","");
  s=await snap();
  check(s.duration==="8h 30m 0s"&&s.net==="8h 30m 0s","15 blank break valid");
  let inv=await field("#td-break","#td-break-error");
  check(inv.aria==="false"&&inv.hidden===true,"16 blank break state");

  await setValue("#td-break","-1");
  inv=await field("#td-break","#td-break-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&s.duration==="—","17 negative break invalid");

  await setValue("#td-break","30.5");
  inv=await field("#td-break","#td-break-error");s=await snap();
  check(inv.aria==="true"&&inv.error.includes("whole number")&&s.duration==="—","18 fractional break invalid");

  await setValue("#td-break","0");
  await setValue("#td-start-time","");
  inv=await field("#td-start-time","#td-start-time-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&s.duration==="—","19 blank start time invalid");

  await setValue("#td-start-time","09:00:00");
  await setValue("#td-end-time","");
  inv=await field("#td-end-time","#td-end-time-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&s.duration==="—","20 blank end time invalid");

  await setValue("#td-end-time","17:30:00");
  await setValue("#td-mode","datetime","change");
  await sleep(20);
  s=await snap();
  check(s.mode==="datetime"&&/^\d{4}-\d{2}-\d{2}$/.test(s.sd)&&/^\d{4}-\d{2}-\d{2}$/.test(s.ed),"21 datetime initializes dates");

  await setValue("#td-start-date","");
  s=await snap();inv=await field("#td-start-date","#td-start-date-error");
  check(s.sd===""&&inv.aria==="true"&&!inv.hidden&&s.duration==="—","22 cleared date remains invalid");

  await setValue("#td-start-date","2026-10-04");
  await setValue("#td-end-date","2026-10-06");
  await setValue("#td-start-time","09:15:00");
  await setValue("#td-end-time","12:45:00");
  s=await snap();
  check(s.duration==="2d 3h 30m 0s"&&s.decimal==="51.50","23 multiday duration");
  check(s.days==="2.1458"&&s.minutes==="3,090"&&s.seconds==="185,400","24 multiday totals");

  await setValue("#td-start-date","2024-02-28");
  await setValue("#td-end-date","2024-03-01");
  await setValue("#td-start-time","00:00:00");
  await setValue("#td-end-time","00:00:00");
  s=await snap();
  check(s.duration==="2d 0h 0m 0s"&&s.decimal==="48.00","25 leap day span");

  await setValue("#td-start-date","2026-10-06");
  await setValue("#td-end-date","2026-10-04");
  s=await snap();inv=await field("#td-end-date","#td-end-date-error");
  check(inv.aria==="true"&&!inv.hidden&&s.duration==="—","26 earlier endpoint invalid");

  await click("#td-example-multiday");await sleep(20);s=await snap();
  check(s.mode==="datetime"&&s.sd==="2026-10-04"&&s.ed==="2026-10-06","27 multiday example inputs");
  check(s.duration==="2d 3h 30m 0s"&&s.decimal==="51.50","28 multiday example result");

  await click("#td-example-overnight");await sleep(20);s=await snap();
  check(s.mode==="time"&&s.st==="22:00:00"&&s.et==="06:00:00"&&s.br==="30","29 overnight example inputs");
  check(s.duration==="8h 0m 0s"&&s.net==="7h 30m 0s","30 overnight example result");

  await click("#td-swap");await sleep(20);s=await snap();
  check(s.st==="06:00:00"&&s.et==="22:00:00"&&s.duration==="16h 0m 0s","31 swap time-only");

  await click("#td-reset");await sleep(20);s=await snap();
  check(s.mode==="time"&&s.st==="09:00:00"&&s.et==="17:30:00"&&s.br==="0","32 reset inputs");
  check(s.duration==="8h 30m 0s"&&s.decimal==="8.50","33 reset result");

  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true});');
  const copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#td-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied;})()');
  check(copied.includes("Time duration: 8h 30m 0s")&&copied.includes("Total seconds: 30,600"),"34 copy result");

  await setValue("#td-break","-1");
  const noCopy=await evaluate('(async()=>{window.__copied="sentinel";document.querySelector("#td-copy").click();await new Promise(r=>setTimeout(r,20));return {copied:window.__copied,status:document.querySelector("#td-status").textContent.trim()};})()');
  check(noCopy.copied==="sentinel"&&noCopy.status.includes("valid values"),"35 invalid copy suppression");

  await click("#td-reset");
  const nowStart=await evaluate('(()=>{document.querySelector("#td-start-now").click();return document.querySelector("#td-start-time").value;})()');
  check(/^\d{2}:\d{2}:\d{2}$/.test(nowStart),"36 start now");
  const nowEnd=await evaluate('(()=>{document.querySelector("#td-end-now").click();return document.querySelector("#td-end-time").value;})()');
  check(/^\d{2}:\d{2}:\d{2}$/.test(nowEnd),"37 end now");

  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,metrics:document.querySelectorAll("[data-time-duration] .metric").length,timezone:!!document.querySelector("#td-timezone"),countdown:!!document.querySelector("#td-countdown"),pay:!!document.querySelector("#td-pay-rate"),hasSkip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/time-duration-calculator/","38 canonical");
  check(seo.faq===8&&seo.metrics===7&&seo.hasSkip&&!seo.timezone&&!seo.countdown&&!seo.pay,"39 scope/schema UI contract");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:base+"/time-duration-calculator/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#td-duration")?.textContent.trim()==="8h 30m 0s"'))break;
    await sleep(100);
  }
  const desktop=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,metrics:document.querySelectorAll("[data-time-duration] .metric").length,time:document.querySelector("#td-duration").textContent.trim(),faq:document.querySelectorAll(".faq details").length})');
  check(desktop.overflow===false&&desktop.metrics===7&&desktop.time==="8h 30m 0s"&&desktop.faq===8,"40 desktop UI regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"41 browser errors");

  console.log("Time Duration 41-case calculation/UI matrix: PASS");
} finally {
  try{ws.close();}catch{}
  chrome.kill("SIGTERM");
  server.close();
}
