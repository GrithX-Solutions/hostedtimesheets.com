import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9888;
const debugPort=9235;
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
  "--user-data-dir=/tmp/ht-hourly-wage-chrome",
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

const tr=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/hourly-wage-calculator/"),{method:"PUT"});
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
  rate:document.querySelector("#hw-rate").value,
  hours:document.querySelector("#hw-hours").value,
  weeks:document.querySelector("#hw-weeks").value,
  days:document.querySelector("#hw-days").value,
  ot:document.querySelector("#hw-ot-hours").value,
  mult:document.querySelector("#hw-ot-multiplier").value,
  daily:document.querySelector("#hw-daily").textContent.trim(),
  weekly:document.querySelector("#hw-weekly").textContent.trim(),
  biweekly:document.querySelector("#hw-biweekly").textContent.trim(),
  monthly:document.querySelector("#hw-monthly").textContent.trim(),
  annual:document.querySelector("#hw-annual").textContent.trim(),
  otPay:document.querySelector("#hw-ot-pay").textContent.trim(),
  weeklyTotal:document.querySelector("#hw-weekly-total").textContent.trim(),
  annualTotal:document.querySelector("#hw-annual-total").textContent.trim(),
  formula:document.querySelector("#hw-formula").textContent.trim(),
  status:document.querySelector("#hw-status").textContent.trim(),
  overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
})`);}
async function field(selector,errorSelector){return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)}),er=document.querySelector(${JSON.stringify(errorSelector)});return {aria:el.getAttribute("aria-invalid"),error:er.textContent.trim(),hidden:er.hidden};})()`);}

try{
  await send("Page.enable");await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/hourly-wage-calculator/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#hw-annual")?.textContent.includes("52,000")'))break;await sleep(100)}
  await sleep(100);

  let s=await snap();
  check(s.weekly.includes("1,000.00")&&s.biweekly.includes("2,000.00"),"1 default weekly/biweekly");
  check(s.monthly.includes("4,333.33")&&s.annual.includes("52,000.00"),"2 default monthly/annual");
  check(s.otPay.includes("0.00")&&s.annualTotal.includes("52,000.00"),"3 default overtime totals");
  check(s.status.includes("Valid estimate")&&s.overflow===false,"4 default status/mobile overflow");

  await click("#hw-example");await sleep(20);s=await snap();
  check(s.rate==="22.50"&&s.hours==="40"&&s.ot==="5"&&s.mult==="1.5","5 example inputs");
  check(s.otPay.includes("168.75")&&s.weeklyTotal.includes("1,068.75"),"6 example weekly overtime");
  check(s.annualTotal.includes("55,575.00")&&s.status.includes("all 52 paid weeks"),"7 example annual overtime");

  await setValue("#hw-rate","25");await setValue("#hw-hours","32");await setValue("#hw-weeks","50");await setValue("#hw-days","4");await setValue("#hw-ot-hours","0");
  s=await snap();check(s.weekly.includes("800.00")&&s.annual.includes("40,000.00"),"8 part-time calculation");

  await setValue("#hw-rate","0");s=await snap();
  check(s.weekly.includes("0.00")&&s.annual.includes("0.00"),"9 zero rate valid");
  let inv=await field("#hw-rate","#hw-rate-error");check(inv.aria==="false"&&inv.hidden===true,"10 zero rate state");

  await setValue("#hw-rate","");s=await snap();inv=await field("#hw-rate","#hw-rate-error");
  check(inv.aria==="true"&&!inv.hidden&&s.annual==="—","11 blank rate invalid");

  await setValue("#hw-rate","25");await setValue("#hw-hours","");s=await snap();inv=await field("#hw-hours","#hw-hours-error");
  check(inv.aria==="true"&&!inv.hidden&&s.weekly==="—","12 blank hours invalid");

  await setValue("#hw-hours","40");await setValue("#hw-weeks","0");s=await snap();inv=await field("#hw-weeks","#hw-weeks-error");
  check(inv.aria==="true"&&inv.error.includes("1 to 53")&&s.annual==="—","13 weeks zero invalid");

  await setValue("#hw-weeks","54");inv=await field("#hw-weeks","#hw-weeks-error");check(inv.aria==="true","14 weeks high invalid");
  await setValue("#hw-weeks","52.5");inv=await field("#hw-weeks","#hw-weeks-error");check(inv.aria==="true"&&inv.error.includes("whole number"),"15 weeks fractional invalid");

  await setValue("#hw-weeks","52");await setValue("#hw-days","0");inv=await field("#hw-days","#hw-days-error");check(inv.aria==="true","16 days zero invalid");
  await setValue("#hw-days","8");inv=await field("#hw-days","#hw-days-error");check(inv.aria==="true","17 days high invalid");
  await setValue("#hw-days","5.5");inv=await field("#hw-days","#hw-days-error");check(inv.aria==="true"&&inv.error.includes("whole number"),"18 days fractional invalid");

  await setValue("#hw-days","5");await setValue("#hw-ot-hours","");s=await snap();inv=await field("#hw-ot-hours","#hw-ot-hours-error");
  check(inv.aria==="false"&&inv.hidden===true&&s.otPay.includes("0.00"),"19 blank overtime valid zero");

  await setValue("#hw-ot-hours","-1");s=await snap();inv=await field("#hw-ot-hours","#hw-ot-hours-error");
  check(inv.aria==="true"&&!inv.hidden&&s.annual==="—","20 negative overtime invalid");

  await setValue("#hw-hours","160");await setValue("#hw-ot-hours","9");s=await snap();inv=await field("#hw-ot-hours","#hw-ot-hours-error");
  check(inv.aria==="true"&&inv.error.includes("cannot exceed 168")&&s.annual==="—","21 combined weekly hours invalid");

  await setValue("#hw-hours","40");await setValue("#hw-ot-hours","5");await setValue("#hw-ot-multiplier","0.5");s=await snap();inv=await field("#hw-ot-multiplier","#hw-ot-multiplier-error");
  check(inv.aria==="true"&&!inv.hidden&&s.annual==="—","22 overtime multiplier invalid");

  await setValue("#hw-ot-hours","0");await setValue("#hw-ot-multiplier","");s=await snap();inv=await field("#hw-ot-multiplier","#hw-ot-multiplier-error");
  check(inv.aria==="false"&&inv.hidden===true&&s.annual.includes("52,000.00"),"23 blank multiplier harmless without overtime");

  await setValue("#hw-ot-hours","5");s=await snap();inv=await field("#hw-ot-multiplier","#hw-ot-multiplier-error");
  check(inv.aria==="true"&&s.annual==="—","24 blank multiplier invalid with overtime");

  await setValue("#hw-ot-multiplier","1.5");await setValue("#hw-ot-hours","0");await setValue("#hw-currency","EUR","change");s=await snap();
  check(/€|EUR/.test(s.weekly)&&s.weekly.includes("1,000.00"),"25 currency formatting");

  await setValue("#hw-currency","USD","change");
  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true});');
  const copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#hw-copy").click();await new Promise(r=>setTimeout(r,20));return window.__copied;})()');
  check(copied.includes("Hourly wage:")&&copied.includes("Annual regular pay:")&&copied.includes("Annual pay including overtime:"),"26 copy result");

  await setValue("#hw-rate","");
  const noCopy=await evaluate('(async()=>{window.__copied="sentinel";document.querySelector("#hw-copy").click();await new Promise(r=>setTimeout(r,20));return {copied:window.__copied,status:document.querySelector("#hw-status").textContent.trim()};})()');
  check(noCopy.copied==="sentinel"&&noCopy.status.includes("valid values"),"27 invalid copy suppression");

  await click("#hw-reset");await sleep(20);s=await snap();
  check(s.rate==="25"&&s.hours==="40"&&s.weeks==="52"&&s.days==="5"&&s.ot==="0"&&s.mult==="1.5","28 reset inputs");
  check(s.annual.includes("52,000.00")&&s.overflow===false,"29 reset result");

  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,metrics:document.querySelectorAll("[data-hourly-wage] .metric").length,tax:!!document.querySelector("#hw-tax-rate"),filing:!!document.querySelector("#hw-filing-status"),copy:!!document.querySelector("#hw-copy"),hasSkip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/hourly-wage-calculator/","30 canonical");
  check(seo.faq===7&&seo.metrics===8&&seo.copy&&seo.hasSkip&&!seo.tax&&!seo.filing,"31 scope/schema UI contract");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate",{url:base+"/hourly-wage-calculator/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#hw-annual")?.textContent.includes("52,000")'))break;await sleep(100)}
  const desktop=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,metrics:document.querySelectorAll("[data-hourly-wage] .metric").length,annual:document.querySelector("#hw-annual").textContent.trim(),faq:document.querySelectorAll(".faq details").length})');
  check(desktop.overflow===false&&desktop.metrics===8&&desktop.annual.includes("52,000.00")&&desktop.faq===7,"32 desktop UI regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"33 browser errors");

  console.log("Hourly Wage 33-case calculation/UI matrix: PASS");
} finally {
  try{ws.close()}catch{}
  chrome.kill("SIGTERM");server.close();
}
