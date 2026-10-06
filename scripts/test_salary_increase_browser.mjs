import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9882;
const debugPort=9229;
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
  "--user-data-dir=/tmp/ht-salary-increase-chrome",
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

const targetResponse=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/salary-increase-calculator/"),{method:"PUT"});
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
async function setMode(value){
  return setValue("#si-mode",value,"change");
}
async function snap(){
  return evaluate(`({
    currentAnnual:document.querySelector("#si-current-annual").textContent.trim(),
    next:document.querySelector("#si-new").textContent.trim(),
    annual:document.querySelector("#si-annual-change").textContent.trim(),
    pct:document.querySelector("#si-change").textContent.trim(),
    currentMonthly:document.querySelector("#si-current-monthly").textContent.trim(),
    newMonthly:document.querySelector("#si-new-monthly").textContent.trim(),
    monthly:document.querySelector("#si-monthly-change").textContent.trim(),
    currentBiweekly:document.querySelector("#si-current-biweekly").textContent.trim(),
    newBiweekly:document.querySelector("#si-new-biweekly").textContent.trim(),
    biweekly:document.querySelector("#si-biweekly-change").textContent.trim(),
    currentWeekly:document.querySelector("#si-current-weekly").textContent.trim(),
    newWeekly:document.querySelector("#si-new-weekly").textContent.trim(),
    weekly:document.querySelector("#si-weekly-change").textContent.trim(),
    annualHours:document.querySelector("#si-annual-hours").textContent.trim(),
    oldHourly:document.querySelector("#si-old-hourly").textContent.trim(),
    newHourly:document.querySelector("#si-new-hourly").textContent.trim(),
    hourly:document.querySelector("#si-hourly-change").textContent.trim(),
    annualLabel:document.querySelector("#si-annual-change-label").textContent.trim(),
    pctLabel:document.querySelector("#si-percent-change-label").textContent.trim(),
    status:document.querySelector("#si-status").textContent.trim(),
    schedule:document.querySelector("#si-schedule-status").textContent.trim(),
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  })`);
}
async function field(selector,errorSelector){
  return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)}),er=document.querySelector(${JSON.stringify(errorSelector)});return {value:el.value,aria:el.getAttribute("aria-invalid"),error:er.textContent.trim(),hidden:er.hidden};})()`);
}

try{
  await send("Page.enable");await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/salary-increase-calculator/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#si-new")?.textContent.trim()==="$63,000.00"'))break;
    await sleep(100);
  }
  await sleep(120);

  // 1-8 percentage mode.
  let s=await snap();
  check(s.next==="$63,000.00","1 percent new salary");
  check(s.annual==="$3,000.00","2 percent annual change");
  check(s.monthly==="$250.00","3 monthly change");
  check(s.biweekly==="$115.38","4 biweekly change");
  check(s.weekly==="$57.69","5 weekly change");
  check(s.overflow===false,"mobile overflow");

  await setValue("#si-current",0);await setValue("#si-percent",0);
  s=await snap();check(s.next==="$0.00"&&s.annual==="$0.00"&&s.pct==="0.00%","6 zero percent baseline");

  await setValue("#si-percent","");
  let inv=await field("#si-percent","#si-percent-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&s.next==="—","7 blank percentage invalid");

  await setValue("#si-percent",-1);
  inv=await field("#si-percent","#si-percent-error");
  check(inv.value==="-1"&&inv.aria==="true","8 negative percentage invalid");

  // 9-14 flat mode.
  await setMode("flat");await setValue("#si-current",60000);await setValue("#si-flat",3000);
  s=await snap();check(s.next==="$63,000.00"&&s.annual==="$3,000.00","9 flat new/annual");
  check(s.pct==="5.00%","10 flat percentage");

  await setValue("#si-current",0);await setValue("#si-flat",3000);
  s=await snap();check(s.next==="$3,000.00"&&s.pct==="N/A","11 flat zero baseline positive");

  await setValue("#si-flat",0);
  s=await snap();check(s.next==="$0.00"&&s.pct==="0.00%","12 flat zero/zero");

  await setValue("#si-flat","");
  inv=await field("#si-flat","#si-flat-error");check(inv.aria==="true"&&!inv.hidden,"13 blank flat invalid");
  await setValue("#si-flat",-1);
  inv=await field("#si-flat","#si-flat-error");check(inv.value==="-1"&&inv.aria==="true","14 negative flat invalid");

  // 15-20 compare mode.
  await setMode("compare");await setValue("#si-current",60000);await setValue("#si-new-input",63000);
  s=await snap();
  check(s.annual==="+$3,000.00"&&s.pct==="+5.00%","15 compare positive");
  check(s.annualLabel==="Annual change"&&s.pctLabel==="Percentage change","compare labels");

  await setValue("#si-current",63000);await setValue("#si-new-input",60000);
  s=await snap();
  check((s.annual==="-$3,000.00"||s.annual==="−$3,000.00")&&s.pct==="−4.7619%","16 compare decrease");

  await setValue("#si-current",0);await setValue("#si-new-input",0);
  s=await snap();check(s.annual==="$0.00"&&s.pct==="0.00%","17 compare zero zero");

  await setValue("#si-new-input",1000);
  s=await snap();check(s.annual==="+$1,000.00"&&s.pct==="N/A","18 compare zero positive");

  await setValue("#si-new-input","");
  inv=await field("#si-new-input","#si-new-error");check(inv.aria==="true"&&!inv.hidden,"19 blank new salary invalid");
  await setValue("#si-new-input",-1);
  inv=await field("#si-new-input","#si-new-error");check(inv.value==="-1"&&inv.aria==="true","20 negative new salary invalid");

  // 21-29 schedule validation. Return to valid salary.
  await setMode("percent");await setValue("#si-current",60000);await setValue("#si-percent",5);await setValue("#si-hours",40);await setValue("#si-weeks",52);
  s=await snap();check(s.annualHours==="2,080","21 annual hours");
  check(s.oldHourly==="$28.85","22 current hourly");
  check(s.newHourly==="$30.29","23 new hourly");

  await setValue("#si-hours","");
  inv=await field("#si-hours","#si-hours-error");s=await snap();
  check(inv.aria==="true"&&s.oldHourly==="—"&&s.next==="$63,000.00"&&s.monthly==="$250.00","24 blank hours only disables hourly");

  await setValue("#si-hours",40);await setValue("#si-weeks","");
  inv=await field("#si-weeks","#si-weeks-error");s=await snap();
  check(inv.aria==="true"&&s.newHourly==="—"&&s.next==="$63,000.00","25 blank weeks only disables hourly");

  await setValue("#si-weeks",53);
  inv=await field("#si-weeks","#si-weeks-error");s=await snap();
  check(inv.aria==="false"&&s.annualHours==="2,120","26 weeks 53 accepted");

  await setValue("#si-weeks",54);
  inv=await field("#si-weeks","#si-weeks-error");s=await snap();
  check(inv.value==="54"&&inv.aria==="true"&&s.oldHourly==="—"&&s.next==="$63,000.00","27 weeks 54 rejected");

  await setValue("#si-weeks",52.5);
  inv=await field("#si-weeks","#si-weeks-error");
  check(inv.value==="52.5"&&inv.aria==="true","28 fractional weeks rejected");

  await setValue("#si-weeks",52);await setValue("#si-hours",0.24);
  inv=await field("#si-hours","#si-hours-error");s=await snap();
  check(inv.aria==="true"&&s.oldHourly==="—"&&s.annual==="$3,000.00","29 hours below .25 rejected");

  // 30-34 cross-output consistency.
  await setValue("#si-hours",40);
  s=await snap();
  check(s.currentMonthly==="$5,000.00"&&s.newMonthly==="$5,250.00","30 monthly before/after");
  check(s.currentBiweekly==="$2,307.69"&&s.newBiweekly==="$2,423.08","31 biweekly before/after");
  check(s.currentWeekly==="$1,153.85"&&s.newWeekly==="$1,211.54","32 weekly before/after");
  check(s.monthly==="$250.00"&&s.biweekly==="$115.38"&&s.weekly==="$57.69","33 period differences");
  check(s.annual==="$3,000.00"&&s.pct==="5.00%"&&s.next==="$63,000.00","34 annual base consistency");

  // 35 mode preservation.
  await setValue("#si-percent",7.5);await setMode("flat");await setValue("#si-flat",4200);await setMode("compare");await setValue("#si-new-input",70000);
  await setMode("percent");
  let preserved=await evaluate('({pct:document.querySelector("#si-percent").value,flat:document.querySelector("#si-flat").value,next:document.querySelector("#si-new-input").value})');
  check(preserved.pct==="7.5"&&preserved.flat==="4200"&&preserved.next==="70000","35 mode values not preserved");

  // 36 compare labels after negative result.
  await setMode("compare");await setValue("#si-current",63000);await setValue("#si-new-input",60000);
  s=await snap();
  check(s.annualLabel==="Annual change"&&s.pctLabel==="Percentage change","36 comparison labels");

  // 37 canonical, 38 no synonym URL, 39 FAQ count, 40 examples/runtime.
  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,flatMode:!!document.querySelector(\'#si-mode option[value="flat"]\'),hrefs:[...document.querySelectorAll("a")].map(a=>a.getAttribute("href")||"")})');
  check(seo.canonical==="https://hostedtimesheets.com/salary-increase-calculator/","37 canonical");
  check(!seo.hrefs.some(h=>/pay-raise-calculator|pay-increase-calculator/.test(h)),"38 synonym URL introduced");
  check(seo.faq===7,"39 FAQ count/schema-visible contract");
  await evaluate('document.querySelector("#si-flat-example").click()');await sleep(40);s=await snap();
  check(s.next==="$63,000.00"&&s.annual==="$3,000.00"&&s.pct==="5.00%","40 flat example does not reproduce");

  // Desktop layout.
  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:base+"/salary-increase-calculator/"});
  for(let i=0;i<50;i++){
    if(await evaluate('document.readyState==="complete"&&document.querySelector("#si-new")?.textContent.trim()==="$63,000.00"'))break;
    await sleep(100);
  }
  const desktop=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,groups:document.querySelectorAll(".si-result-group").length,modes:document.querySelectorAll("#si-mode option").length})');
  check(desktop.overflow===false&&desktop.groups===2&&desktop.modes===3,"desktop UI regression");

  console.log("Salary Increase 40-case calculation/UI matrix: PASS");
} finally {
  try{ws.close();}catch{}
  chrome.kill("SIGTERM");
  server.close();
}
