import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9881;
const debugPort=9228;
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
  }catch(error){res.writeHead(404);res.end("not found");}
});
await new Promise(resolve=>server.listen(port,"127.0.0.1",resolve));

const chrome=spawn("/usr/bin/chromium",[
  "--headless","--no-sandbox","--disable-gpu",
  "--remote-debugging-address=127.0.0.1",
  "--remote-debugging-port="+debugPort,
  "--user-data-dir=/tmp/ht-decimal-hours-chrome",
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
const targetResponse=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/decimal-hours-calculator/"),{method:"PUT"});
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

async function setValue(selector,value,event="input"){
  return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));return el.value;})()`);
}

async function setMode(value){
  return evaluate(`(()=>{const el=document.querySelector('input[name="dh-mode"][value="${value}"]');el.checked=true;el.dispatchEvent(new Event("change",{bubbles:true}));return {timeHidden:document.querySelector("#dh-time-fields").hidden,decimalHidden:document.querySelector("#dh-decimal-fields").hidden};})()`);
}

async function snapshot(){
  return evaluate(`({
    primary:document.querySelector("#dh-primary").textContent.trim(),
    secondary:document.querySelector("#dh-secondary").textContent.trim(),
    totalMinutes:document.querySelector("#dh-total-minutes").textContent.trim(),
    totalSeconds:document.querySelector("#dh-total-seconds").textContent.trim(),
    pay:document.querySelector("#dh-pay").textContent.trim(),
    formula:document.querySelector("#dh-formula").textContent.trim(),
    status:document.querySelector("#dh-status").textContent.trim(),
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  })`);
}

async function invalidState(selector,errorSelector){
  return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});const err=document.querySelector(${JSON.stringify(errorSelector)});return {value:el.value,aria:el.getAttribute("aria-invalid"),error:err.textContent.trim(),hidden:err.hidden};})()`);
}

try{
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/decimal-hours-calculator/"});
  for(let i=0;i<50;i++){
    const ready=await evaluate('document.readyState==="complete"&&document.querySelector("#dh-primary")?.textContent.trim()==="8.5000"');
    if(ready)break;
    await sleep(100);
  }
  await sleep(150);

  let s=await snapshot();
  check(s.primary==="8.5000","Initial 4-place decimal mismatch");
  check(s.secondary==="8h 30m 0s","Initial normalized time mismatch");
  check(s.totalMinutes==="510"&&s.totalSeconds==="30,600","Initial totals mismatch");
  check(s.pay==="—","Blank optional rate should not create pay");
  check(s.overflow===false,"Mobile page has horizontal overflow");

  // Time -> Decimal basics.
  await setValue("#dh-hours",0);await setValue("#dh-minutes",0);await setValue("#dh-seconds",0);
  s=await snapshot();check(s.primary==="0.0000"&&s.totalSeconds==="0","Zero conversion failed");

  await setValue("#dh-hours",8);await setValue("#dh-minutes",30);await setValue("#dh-seconds",0);
  s=await snapshot();check(s.primary==="8.5000","8h30m conversion failed");

  await setValue("#dh-hours",8);await setValue("#dh-minutes",1);await setValue("#dh-seconds",0);
  s=await snapshot();check(s.primary==="8.0167"&&s.totalSeconds==="28,860","8h1m conversion failed");

  await setValue("#dh-hours",7);await setValue("#dh-minutes",45);await setValue("#dh-seconds",30);
  s=await snapshot();check(s.primary==="7.7583"&&s.totalMinutes==="465.5"&&s.totalSeconds==="27,930","Seconds conversion failed");

  await setValue("#dh-hours",30);await setValue("#dh-minutes",0);await setValue("#dh-seconds",0);
  s=await snapshot();check(s.primary==="30.0000"&&s.secondary==="30h 0m 0s","Above-24-hour conversion failed");

  // Validation: invalid values must stay visible and must not clamp.
  await setValue("#dh-minutes",59);
  let inv=await invalidState("#dh-minutes","#dh-minutes-error");
  check(inv.aria==="false"&&inv.value==="59","59 minutes should be valid");

  await setValue("#dh-minutes",60);
  inv=await invalidState("#dh-minutes","#dh-minutes-error");
  s=await snapshot();
  check(inv.value==="60"&&inv.aria==="true"&&!inv.hidden&&inv.error.includes("0 to 59"),"60 minutes was not rejected explicitly");
  check(s.primary==="—","Invalid minutes did not suppress output");

  await setValue("#dh-minutes",-1);
  inv=await invalidState("#dh-minutes","#dh-minutes-error");
  check(inv.value==="-1"&&inv.aria==="true","Negative minutes were not rejected");

  await setValue("#dh-minutes",1.5);
  inv=await invalidState("#dh-minutes","#dh-minutes-error");
  check(inv.value==="1.5"&&inv.aria==="true","Fractional minutes were not rejected");

  await setValue("#dh-minutes",0);await setValue("#dh-seconds",59);
  inv=await invalidState("#dh-seconds","#dh-seconds-error");
  check(inv.aria==="false"&&inv.value==="59","59 seconds should be valid");

  await setValue("#dh-seconds",60);
  inv=await invalidState("#dh-seconds","#dh-seconds-error");
  check(inv.value==="60"&&inv.aria==="true","60 seconds were not rejected");

  await setValue("#dh-seconds",-1);
  inv=await invalidState("#dh-seconds","#dh-seconds-error");
  check(inv.value==="-1"&&inv.aria==="true","Negative seconds were not rejected");

  await setValue("#dh-seconds",0);await setValue("#dh-hours",1.5);
  inv=await invalidState("#dh-hours","#dh-hours-error");
  check(inv.value==="1.5"&&inv.aria==="true","Fractional whole hours were not rejected");

  await setValue("#dh-hours",-1);
  inv=await invalidState("#dh-hours","#dh-hours-error");
  check(inv.value==="-1"&&inv.aria==="true","Negative hours were not rejected");

  // Precision and exact-pay independence.
  await setValue("#dh-hours",8);await setValue("#dh-minutes",1);await setValue("#dh-seconds",0);await setValue("#dh-rate",25);
  await setValue("#dh-precision",2,"change");
  s=await snapshot();check(s.primary==="8.02"&&s.pay==="$200.42"&&s.totalSeconds==="28,860","2-place precision or exact pay failed");
  await setValue("#dh-precision",3,"change");
  s=await snapshot();check(s.primary==="8.017"&&s.pay==="$200.42"&&s.totalSeconds==="28,860","3-place precision changed exact math");
  await setValue("#dh-precision",4,"change");
  s=await snapshot();check(s.primary==="8.0167"&&s.pay==="$200.42"&&s.totalSeconds==="28,860","4-place precision changed exact math");

  await setValue("#dh-rate","");
  s=await snapshot();check(s.pay==="—","Blank rate should show em dash");
  await setValue("#dh-rate",0);
  s=await snapshot();check(s.pay==="$0.00","Explicit zero rate should be valid");
  await setValue("#dh-rate",-1);
  inv=await invalidState("#dh-rate","#dh-rate-error");
  s=await snapshot();
  check(inv.aria==="true"&&s.primary==="8.0167"&&s.pay==="—","Invalid rate should suppress pay only");

  // Decimal -> Time.
  await setValue("#dh-rate","");
  let modeState=await setMode("decimal-to-time");
  check(modeState.timeHidden===true&&modeState.decimalHidden===false,"Mode visibility mismatch");

  await setValue("#dh-decimal-input",7.75);
  s=await snapshot();check(s.primary==="7h 45m 0s"&&s.secondary==="7.75"&&s.totalMinutes==="465"&&s.totalSeconds==="27,900","7.75 reverse conversion failed");

  await setValue("#dh-decimal-input",8.5);
  s=await snapshot();check(s.primary==="8h 30m 0s","8.5 reverse conversion failed");

  await setValue("#dh-decimal-input","8.0166666667");
  s=await snapshot();check(s.primary==="8h 1m 0s","Nearest-second reverse conversion failed");

  await setValue("#dh-decimal-input",0);
  s=await snapshot();check(s.primary==="0h 0m 0s","Zero reverse conversion failed");

  await setValue("#dh-decimal-input",30.25);
  s=await snapshot();check(s.primary==="30h 15m 0s","Above-24 reverse conversion failed");

  await setValue("#dh-decimal-input",-1);
  inv=await invalidState("#dh-decimal-input","#dh-decimal-error");
  s=await snapshot();check(inv.value==="-1"&&inv.aria==="true"&&s.primary==="—","Negative decimal input not rejected");

  await setValue("#dh-decimal-input","");
  inv=await invalidState("#dh-decimal-input","#dh-decimal-error");
  check(inv.aria==="true"&&inv.error.includes("required"),"Blank decimal input should be invalid");

  await setValue("#dh-decimal-input",7.75);await setValue("#dh-rate",25);
  s=await snapshot();check(s.pay==="$193.75","Reverse-mode pay did not use exact decimal input");

  // Mode preservation.
  await setMode("time-to-decimal");
  await setValue("#dh-hours",12);await setValue("#dh-minutes",34);await setValue("#dh-seconds",56);
  await setMode("decimal-to-time");await setValue("#dh-decimal-input","2.5");
  await setMode("time-to-decimal");
  let preserved=await evaluate('({h:document.querySelector("#dh-hours").value,m:document.querySelector("#dh-minutes").value,s:document.querySelector("#dh-seconds").value})');
  check(preserved.h==="12"&&preserved.m==="34"&&preserved.s==="56","Time-mode values were not preserved");
  await setMode("decimal-to-time");
  preserved=await evaluate('document.querySelector("#dh-decimal-input").value');
  check(preserved==="2.5","Decimal-mode value was not preserved");

  // Copy is mode-aware.
  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true});');
  await setMode("time-to-decimal");await setValue("#dh-hours",8);await setValue("#dh-minutes",1);await setValue("#dh-seconds",0);await setValue("#dh-precision",3,"change");
  let copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#dh-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied;})()');
  check(copied==="8.017","Forward copy did not honor precision");

  await setMode("decimal-to-time");await setValue("#dh-decimal-input",7.75);
  copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#dh-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied;})()');
  check(copied==="7h 45m 0s","Reverse copy did not return normalized time");

  // Desktop regression.
  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:base+"/decimal-hours-calculator/"});
  for(let i=0;i<50;i++){
    const ready=await evaluate('document.readyState==="complete"&&document.querySelector("#dh-primary")?.textContent.trim()==="8.5000"');
    if(ready)break;
    await sleep(100);
  }
  const desktop=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,modeButtons:document.querySelectorAll(".dh-mode-option").length,faq:document.querySelectorAll(".faq details").length})');
  check(desktop.overflow===false,"Desktop page has horizontal overflow");
  check(desktop.modeButtons===2&&desktop.faq===6,"Desktop DOM contract mismatch");

  console.log("Decimal Hours rendered calculation/UI checks: PASS");
} finally {
  try{ws.close();}catch(error){}
  chrome.kill("SIGTERM");
  server.close();
}
