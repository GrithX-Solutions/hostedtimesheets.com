import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9884;
const debugPort=9231;
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
  "--user-data-dir=/tmp/ht-overtime-chrome",
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

const targetResponse=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/overtime-calculator/"),{method:"PUT"});
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
    mode:document.querySelector("#ot-mode").value,
    total:document.querySelector("#ot-total-out").textContent.trim(),
    regular:document.querySelector("#ot-regular-hours").textContent.trim(),
    overtime:document.querySelector("#ot-hours").textContent.trim(),
    double:document.querySelector("#ot-double-hours").textContent.trim(),
    regularPay:document.querySelector("#ot-regular-pay").textContent.trim(),
    overtimePay:document.querySelector("#ot-pay").textContent.trim(),
    doublePay:document.querySelector("#ot-double-pay").textContent.trim(),
    gross:document.querySelector("#ot-gross").textContent.trim(),
    formula:document.querySelector("#ot-formula").textContent.trim(),
    status:document.querySelector("#ot-status").textContent.trim(),
    totalHidden:document.querySelector("#ot-total-mode").hidden,
    classifiedHidden:document.querySelector("#ot-classified-mode").hidden,
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  })`);
}
async function field(selector,errorSelector){
  return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)}),er=document.querySelector(${JSON.stringify(errorSelector)});return {value:el.value,aria:el.getAttribute("aria-invalid"),error:er.textContent.trim(),hidden:er.hidden};})()`);
}

try{
  await send("Page.enable");await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/overtime-calculator/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#ot-gross")?.textContent.trim()==="$1,000.00"'))break;
    await sleep(100);
  }
  await sleep(120);

  let s=await snap();
  check(s.mode==="total"&&!s.totalHidden&&s.classifiedHidden,"1 initial total mode");
  check(s.total==="40.00"&&s.regular==="40.00"&&s.overtime==="0.00"&&s.double==="0.00","2 initial hours");
  check(s.regularPay==="$1,000.00"&&s.gross==="$1,000.00","3 initial pay");
  check(s.overflow===false,"4 mobile overflow");

  await setValue("#ot-total",45);
  s=await snap();
  check(s.regular==="40.00"&&s.overtime==="5.00","5 45-hour split");
  check(s.overtimePay==="$187.50"&&s.gross==="$1,187.50","6 time-and-a-half gross");
  check(s.formula.includes("5.00 overtime hrs")&&s.formula.includes("$37.50"),"7 formula rate");

  await setValue("#ot-total",42.5);
  s=await snap();check(s.overtime==="2.50"&&s.gross==="$1,093.75","8 decimal hours");

  await setValue("#ot-threshold",0);
  s=await snap();check(s.regular==="0.00"&&s.overtime==="42.50"&&s.gross==="$1,593.75","9 zero threshold valid");

  await setValue("#ot-total",0);
  s=await snap();check(s.total==="0.00"&&s.gross==="$0.00","10 zero total valid");

  await setValue("#ot-rate",0);
  s=await snap();check(s.gross==="$0.00"&&s.regularPay==="$0.00","11 zero rate valid");

  await setValue("#ot-rate","");
  let inv=await field("#ot-rate","#ot-rate-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&s.gross==="—","12 blank rate invalid");

  await setValue("#ot-rate",-1);
  inv=await field("#ot-rate","#ot-rate-error");
  check(inv.aria==="true"&&inv.error.includes("cannot be negative"),"13 negative rate invalid");

  await setValue("#ot-rate",25);await setValue("#ot-total","");
  inv=await field("#ot-total","#ot-total-error");s=await snap();
  check(inv.aria==="true"&&s.total==="—"&&s.gross==="—","14 blank total clears outputs");

  await setValue("#ot-total",-1);
  inv=await field("#ot-total","#ot-total-error");check(inv.aria==="true","15 negative total invalid");

  await setValue("#ot-total",45);await setValue("#ot-threshold","");
  inv=await field("#ot-threshold","#ot-threshold-error");check(inv.aria==="true","16 blank threshold invalid");

  await setValue("#ot-threshold",-1);
  inv=await field("#ot-threshold","#ot-threshold-error");check(inv.aria==="true","17 negative threshold invalid");

  await setValue("#ot-threshold",40);await setValue("#ot-multiplier",0);
  inv=await field("#ot-multiplier","#ot-multiplier-error");s=await snap();
  check(inv.aria==="true"&&s.gross==="—","18 zero multiplier invalid");

  await setValue("#ot-multiplier",-1);
  inv=await field("#ot-multiplier","#ot-multiplier-error");check(inv.aria==="true","19 negative multiplier invalid");

  await setValue("#ot-multiplier",1.5);
  await setValue("#ot-double-input",-9);
  s=await snap();
  check(s.mode==="total"&&s.gross==="$1,187.50","20 hidden classified invalid ignored");

  await setValue("#ot-mode","classified","change");
  s=await snap();
  check(s.mode==="classified"&&s.totalHidden&&s.classifiedHidden===false,"21 classified mode visible");
  check(s.gross==="—","22 classified invalid becomes active");

  await setValue("#ot-double-input",2);
  s=await snap();
  check(s.total==="47.00"&&s.regular==="40.00"&&s.overtime==="5.00"&&s.double==="2.00","23 classified totals");
  check(s.regularPay==="$1,000.00"&&s.overtimePay==="$187.50"&&s.doublePay==="$100.00"&&s.gross==="$1,287.50","24 classified gross");
  check(s.formula.includes("double-time hrs × $50.00"),"25 double-time formula");

  await setValue("#ot-regular-input","");
  inv=await field("#ot-regular-input","#ot-regular-input-error");s=await snap();
  check(inv.aria==="true"&&s.gross==="—","26 blank regular invalid");
  await setValue("#ot-regular-input",40);

  await setValue("#ot-overtime-input",-1);
  inv=await field("#ot-overtime-input","#ot-overtime-input-error");check(inv.aria==="true","27 negative overtime invalid");
  await setValue("#ot-overtime-input",5);

  await setValue("#ot-double-input",0);await setValue("#ot-double-multiplier",0);
  inv=await field("#ot-double-multiplier","#ot-double-multiplier-error");check(inv.aria==="true","28 double multiplier required positive even with zero DT hours");
  await setValue("#ot-double-multiplier",2);

  await setValue("#ot-regular-input",0);await setValue("#ot-overtime-input",0);await setValue("#ot-double-input",0);
  s=await snap();check(s.total==="0.00"&&s.gross==="$0.00","29 classified zero hours valid");

  await setValue("#ot-regular-input",40);await setValue("#ot-overtime-input",5);await setValue("#ot-double-input",2);
  await setValue("#ot-currency","GBP","change");
  s=await snap();check(s.gross.includes("£1,287.50"),"30 currency formatting");

  await evaluate('document.querySelector("#ot-example").click()');await sleep(30);s=await snap();
  check(s.mode==="total"&&s.gross==="$1,187.50"&&s.overtime==="5.00","31 standard example");

  await evaluate('document.querySelector("#ot-double-example").click()');await sleep(30);s=await snap();
  check(s.mode==="classified"&&s.gross==="$1,287.50"&&s.double==="2.00","32 double-time example");

  await evaluate('document.querySelector("#ot-reset").click()');await sleep(30);s=await snap();
  check(s.mode==="total"&&s.gross==="$1,000.00"&&s.total==="40.00","33 reset");

  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true});');
  const copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#ot-example").click();document.querySelector("#ot-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied;})()');
  check(copied.includes("Overtime hours: 5.00")&&copied.includes("Estimated gross pay: $1,187.50"),"34 copy summary");

  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,state:!!document.querySelector("#ot-state"),tax:!!document.querySelector("#ot-tax"),days:document.querySelectorAll("[data-day], .timesheet-row").length,hasSkip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/overtime-calculator/","35 canonical");
  check(seo.faq===7&&seo.hasSkip===true&&!seo.state&&!seo.tax&&seo.days===0,"36 scope/FAQ contract");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:base+"/overtime-calculator/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#ot-gross")?.textContent.trim()==="$1,000.00"'))break;
    await sleep(100);
  }
  const desktop=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,metrics:document.querySelectorAll(".ot-result-grid .metric").length,buttons:document.querySelectorAll("[data-overtime] .actions button").length})');
  check(desktop.overflow===false&&desktop.metrics===8&&desktop.buttons===4,"37 desktop UI regression");

  console.log("Overtime 37-case calculation/UI matrix: PASS");
} finally {
  try{ws.close();}catch{}
  chrome.kill("SIGTERM");
  server.close();
}
