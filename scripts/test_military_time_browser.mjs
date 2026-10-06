import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9886;
const debugPort=9233;
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
  "--user-data-dir=/tmp/ht-military-time-chrome",
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

const targetResponse=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/military-time-converter/"),{method:"PUT"});
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
async function setInput(value){
  return evaluate(`(()=>{const el=document.querySelector("#mt-input");el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event("input",{bubbles:true}));return el.value;})()`);
}
async function snap(){
  return evaluate(`({
    input:document.querySelector("#mt-input").value,
    military:document.querySelector("#mt-military").textContent.trim(),
    standard:document.querySelector("#mt-standard").textContent.trim(),
    clock24:document.querySelector("#mt-clock24").textContent.trim(),
    label:document.querySelector("#mt-label").textContent.trim(),
    spoken:document.querySelector("#mt-spoken").textContent.trim(),
    formula:document.querySelector("#mt-formula").textContent.trim(),
    status:document.querySelector("#mt-status").textContent.trim(),
    aria:document.querySelector("#mt-input").getAttribute("aria-invalid"),
    error:document.querySelector("#mt-input-error").textContent.trim(),
    errorHidden:document.querySelector("#mt-input-error").hidden,
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  })`);
}
async function expect(value,expected,label){
  await setInput(value);
  await sleep(10);
  const s=await snap();
  check(s.military===expected.military,label+" military");
  check(s.standard===expected.standard,label+" standard");
  check(s.clock24===expected.clock24,label+" clock24");
  if(expected.label)check(s.label===expected.label,label+" label");
  if(expected.spoken)check(s.spoken===expected.spoken,label+" spoken");
  check(s.aria==="false"&&s.errorHidden===true,label+" valid state");
  return s;
}
async function expectInvalid(value,label,contains=""){
  await setInput(value);
  await sleep(10);
  const s=await snap();
  check(s.military==="—"&&s.standard==="—"&&s.clock24==="—"&&s.label==="—"&&s.spoken==="—",label+" cleared");
  check(s.aria==="true"&&s.errorHidden===false,label+" invalid state");
  if(contains)check(s.error.includes(contains),label+" message");
  return s;
}

try{
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/military-time-converter/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#mt-military")?.textContent.trim()==="1730"'))break;
    await sleep(100);
  }
  await sleep(100);

  let s=await snap();
  check(s.military==="1730"&&s.standard==="5:30 PM"&&s.clock24==="17:30","1 initial conversion");
  check(s.label==="Evening"&&s.spoken==="Seventeen thirty hours","2 initial labels");
  check(s.aria==="false"&&s.errorHidden===true,"3 initial validation");
  check(s.overflow===false,"4 mobile overflow");

  await expect("0000",{military:"0000",standard:"12:00 AM",clock24:"00:00",label:"Midnight",spoken:"Zero hundred hours"},"5 midnight");
  await expect("1200",{military:"1200",standard:"12:00 PM",clock24:"12:00",label:"Noon",spoken:"Twelve hundred hours"},"6 noon");
  await expect("0730",{military:"0730",standard:"7:30 AM",clock24:"07:30",label:"Morning",spoken:"Zero seven thirty hours"},"7 leading zero");
  await expect("730",{military:"0730",standard:"7:30 AM",clock24:"07:30",spoken:"Zero seven thirty hours"},"8 shorthand");
  await expect("17:30",{military:"1730",standard:"5:30 PM",clock24:"17:30",spoken:"Seventeen thirty hours"},"9 colon 24h");
  await expect("5:30 PM",{military:"1730",standard:"5:30 PM",clock24:"17:30"},"10 standard PM");
  await expect("12:00 AM",{military:"0000",standard:"12:00 AM",clock24:"00:00"},"11 12am");
  await expect("12:00 PM",{military:"1200",standard:"12:00 PM",clock24:"12:00"},"12 12pm");
  await expect("noon",{military:"1200",standard:"12:00 PM",clock24:"12:00"},"13 noon word");
  await expect("midnight",{military:"0000",standard:"12:00 AM",clock24:"00:00"},"14 midnight word");
  await expect("7 PM",{military:"1900",standard:"7:00 PM",clock24:"19:00",label:"Evening",spoken:"Nineteen hundred hours"},"15 hour PM");
  await expect("930PM",{military:"2130",standard:"9:30 PM",clock24:"21:30",label:"Night",spoken:"Twenty-one thirty hours"},"16 compact PM");
  await expect("09:30 am",{military:"0930",standard:"9:30 AM",clock24:"09:30",label:"Morning",spoken:"Zero nine thirty hours"},"17 lowercase am");
  await expect("2359",{military:"2359",standard:"11:59 PM",clock24:"23:59",label:"Night",spoken:"Twenty-three fifty-nine hours"},"18 max time");
  await expect("1700",{military:"1700",standard:"5:00 PM",clock24:"17:00",label:"Evening",spoken:"Seventeen hundred hours"},"19 whole hour");
  await expect("5.30 PM",{military:"1730",standard:"5:30 PM",clock24:"17:30"},"20 dotted standard");

  await expectInvalid("","21 blank","Enter a time");
  await expectInvalid("2400","22 2400","Use 0000");
  await expectInvalid("2360","23 invalid minute");
  await expectInvalid("13:00 PM","24 invalid 12h hour");
  await expectInvalid("25:00","25 invalid 24h hour");
  await expectInvalid("hello","26 alphabetic junk");
  await expectInvalid("17::30","27 malformed punctuation");
  await expectInvalid("-100","28 negative");
  await expectInvalid("1260 PM","29 invalid pm minute");

  await evaluate('document.querySelector("[data-mt-preset=\"1430\"]").click()');
  await sleep(20);
  s=await snap();
  check(s.input==="1430"&&s.military==="1430"&&s.standard==="2:30 PM","30 preset");

  await evaluate('document.querySelector("#mt-reset").click()');
  await sleep(20);
  s=await snap();
  check(s.input==="1730"&&s.military==="1730"&&s.standard==="5:30 PM","31 reset");

  const nowValue=await evaluate('(()=>{document.querySelector("#mt-now").click();return document.querySelector("#mt-input").value;})()');
  check(/^\d{2}:\d{2}$/.test(nowValue),"32 current time");

  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true});');
  await setInput("1730");
  const copiedMilitary=await evaluate('(async()=>{window.__copied="";document.querySelector("#mt-copy-military").click();await new Promise(r=>setTimeout(r,20));return window.__copied;})()');
  check(copiedMilitary==="1730","33 copy military");
  const copiedStandard=await evaluate('(async()=>{window.__copied="";document.querySelector("#mt-copy-standard").click();await new Promise(r=>setTimeout(r,20));return window.__copied;})()');
  check(copiedStandard==="5:30 PM","34 copy standard");

  await setInput("2400");
  const noCopy=await evaluate('(async()=>{window.__copied="sentinel";document.querySelector("#mt-copy-military").click();await new Promise(r=>setTimeout(r,20));return {copied:window.__copied,status:document.querySelector("#mt-status").textContent.trim()};})()');
  check(noCopy.copied==="sentinel"&&noCopy.status.includes("valid time"),"35 invalid copy suppression");

  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,rows:document.querySelectorAll(".table-wrap tbody tr").length,metrics:document.querySelectorAll("[data-military-time] .metric").length,timezone:!!document.querySelector("#mt-timezone"),utc:!!document.querySelector("#mt-utc"),duration:!!document.querySelector("#mt-duration"),hasSkip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/military-time-converter/","36 canonical");
  check(seo.faq===8&&seo.rows===24&&seo.metrics===5&&seo.hasSkip&&!seo.timezone&&!seo.utc&&!seo.duration,"37 scope/schema UI contract");

  await send("Emulation.setEmulatedMedia",{media:"print"});
  const printState=await evaluate(`(()=>{const calc=getComputedStyle(document.querySelector(".calculator-section")).display;const grid=getComputedStyle(document.querySelector(".content-grid")).display;const side=getComputedStyle(document.querySelector(".sidebar-card")).display;const table=getComputedStyle(document.querySelector(".table-wrap")).overflow;return {calc,grid,side,table};})()`);
  check(printState.calc==="none"&&printState.grid==="grid"&&printState.side==="none"&&printState.table==="visible","38 print chart visibility");
  await send("Emulation.setEmulatedMedia",{media:"screen"});

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:base+"/military-time-converter/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#mt-military")?.textContent.trim()==="1730"'))break;
    await sleep(100);
  }
  const desktop=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,metrics:document.querySelectorAll("[data-military-time] .metric").length,rows:document.querySelectorAll(".table-wrap tbody tr").length,time:document.querySelector("#mt-standard").textContent.trim()})');
  check(desktop.overflow===false&&desktop.metrics===5&&desktop.rows===24&&desktop.time==="5:30 PM","39 desktop UI regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"40 browser errors");

  console.log("Military Time 40-case conversion/UI/print matrix: PASS");
} finally {
  try{ws.close();}catch{}
  chrome.kill("SIGTERM");
  server.close();
}
