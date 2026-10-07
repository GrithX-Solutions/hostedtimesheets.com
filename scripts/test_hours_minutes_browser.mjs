import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9891,debugPort=9238,base="http://127.0.0.1:"+port;
const mime=file=>file.endsWith(".js")?"application/javascript":file.endsWith(".css")?"text/css":file.endsWith(".png")?"image/png":file.endsWith(".svg")?"image/svg+xml":"text/html";
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,base);let p=decodeURIComponent(url.pathname);if(p.endsWith("/"))p+="index.html";const target=path.join(root,p);if(!target.startsWith(root))throw new Error("path");const body=await readFile(target);res.writeHead(200,{"content-type":mime(target)});res.end(body)}catch{res.writeHead(404);res.end("not found")}});
await new Promise(r=>server.listen(port,"127.0.0.1",r));

const chrome=spawn("/usr/bin/chromium",["--headless","--no-sandbox","--disable-gpu","--remote-debugging-address=127.0.0.1","--remote-debugging-port="+debugPort,"--user-data-dir=/tmp/ht-hours-minutes-chrome","--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1","about:blank"],{stdio:"ignore"});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),check=(c,m)=>{if(!c)throw new Error(m)};
for(let i=0;i<50;i++){try{if((await fetch("http://127.0.0.1:"+debugPort+"/json/version")).ok)break}catch{}await sleep(100)}
const tr=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/hours-and-minutes-calculator/"),{method:"PUT"});check(tr.ok,"target");
const target=await tr.json(),ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.addEventListener("open",r,{once:true});ws.addEventListener("error",j,{once:true})});
let seq=0;const pending=new Map(),runtimeErrors=[],consoleErrors=[];
ws.addEventListener("message",event=>{const m=JSON.parse(event.data);if(m.method==="Runtime.exceptionThrown")runtimeErrors.push(m.params?.exceptionDetails?.text||"exception");if(m.method==="Runtime.consoleAPICalled"&&m.params?.type==="error")consoleErrors.push("console.error");if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result||{})});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const evaluate=async expression=>{const r=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval");return r.result?.value};
async function setValue(selector,value,event="input"){return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));return el.value})()`)}
async function click(selector){return evaluate(`(()=>{document.querySelector(${JSON.stringify(selector)}).click();return true})()`)}
async function snap(){return evaluate(`({mode:document.querySelector("#hm-mode").value,minutes:document.querySelector("#hm-total-minutes").textContent.trim(),decimal:document.querySelector("#hm-decimal").textContent.trim(),hm:document.querySelector("#hm-hours-display").textContent.trim(),pay:document.querySelector("#hm-pay").textContent.trim(),formula:document.querySelector("#hm-formula").textContent.trim(),status:document.querySelector("#hm-status").textContent.trim(),secondHidden:[...document.querySelectorAll("[data-hm-second]")].every(x=>x.hidden),multiHidden:document.querySelector("#hm-extra-wrap").hidden,extraRows:document.querySelectorAll("[data-hm-extra-row]").length,addDisabled:document.querySelector("#hm-add-row").disabled,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})`)}
async function field(sel,err){return evaluate(`(()=>{const x=document.querySelector(${JSON.stringify(sel)}),e=document.querySelector(${JSON.stringify(err)});return {aria:x.getAttribute("aria-invalid"),error:e.textContent.trim(),hidden:e.hidden}})()`)}

try{
  await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});await send("Page.navigate",{url:base+"/hours-and-minutes-calculator/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#hm-total-minutes")?.textContent==="510"'))break;await sleep(100)}

  let s=await snap();
  check(s.mode==="convert"&&s.minutes==="510"&&s.decimal==="8.50"&&s.hm==="8h 30m","1 default duration");
  check(s.pay.includes("212.50")&&s.formula.includes("8 × 60 + 30 = 510"),"2 default pay/formula");
  check(s.secondHidden&&s.multiHidden&&s.status.includes("no FX conversion"),"3 default visibility/status");
  check(s.overflow===false,"4 mobile overflow");

  await setValue("#hm-mode","add","change");s=await snap();
  check(s.minutes==="590"&&s.decimal==="9.8333"&&s.hm==="9h 50m","5 add mode");
  check(s.pay.includes("245.83")&&s.formula.includes("= 590 minutes"),"6 add pay/formula");
  check(!s.secondHidden&&s.multiHidden,"7 add visibility");

  await setValue("#hm-mode","subtract","change");s=await snap();
  check(s.minutes==="430"&&s.decimal==="7.1667"&&s.hm==="7h 10m","8 subtract mode");
  check(s.pay.includes("179.17")&&s.formula.includes("= 430 minutes"),"9 subtract pay");

  await setValue("#hm-hours","1");await setValue("#hm-minutes","15");await setValue("#hm-hours-2","2");await setValue("#hm-minutes-2","0");s=await snap();
  check(s.minutes==="-45"&&s.decimal==="-0.75"&&s.hm==="-0h 45m","10 negative subtract");
  check(s.pay.includes("18.75")&&s.pay.includes("-"),"11 negative rate estimate");

  await click("#hm-reset");await setValue("#hm-rate","");s=await snap();
  check(s.minutes==="510"&&s.pay==="—"&&s.status.includes("Valid duration"),"12 blank rate valid");
  let inv=await field("#hm-rate","#hm-rate-error");check(inv.aria==="false"&&inv.hidden,"13 blank rate no error");

  await setValue("#hm-rate","-1");s=await snap();inv=await field("#hm-rate","#hm-rate-error");
  check(s.minutes==="510"&&s.decimal==="8.50"&&s.pay==="—","14 negative rate preserves duration");
  check(inv.aria==="true"&&!inv.hidden&&s.status.includes("Fix the hourly rate"),"15 negative rate invalid");

  await setValue("#hm-rate","0");s=await snap();inv=await field("#hm-rate","#hm-rate-error");
  check(inv.aria==="false"&&s.pay.includes("0.00"),"16 zero rate valid");

  await setValue("#hm-rate","25");await setValue("#hm-currency","GBP","change");s=await snap();
  check(s.minutes==="510"&&s.decimal==="8.50"&&s.pay.includes("£")&&s.pay.includes("212.50"),"17 currency formatting only");
  check(s.status.includes("no FX conversion"),"18 currency status");

  await setValue("#hm-currency","USD","change");await setValue("#hm-hours","");inv=await field("#hm-hours","#hm-hours-error");s=await snap();
  check(inv.aria==="true"&&!inv.hidden&&s.minutes==="—"&&s.decimal==="—"&&s.hm==="—"&&s.pay==="—","19 blank first hours invalid");
  await setValue("#hm-hours","-1");inv=await field("#hm-hours","#hm-hours-error");check(inv.aria==="true","20 negative first hours invalid");
  await setValue("#hm-hours","1.5");inv=await field("#hm-hours","#hm-hours-error");check(inv.aria==="true"&&inv.error.includes("whole number"),"21 fractional first hours invalid");

  await setValue("#hm-hours","8");await setValue("#hm-minutes","");inv=await field("#hm-minutes","#hm-minutes-error");check(inv.aria==="true","22 blank first minutes invalid");
  await setValue("#hm-minutes","-1");inv=await field("#hm-minutes","#hm-minutes-error");check(inv.aria==="true","23 negative first minutes invalid");
  await setValue("#hm-minutes","60");inv=await field("#hm-minutes","#hm-minutes-error");check(inv.aria==="true"&&inv.error.includes("0 to 59"),"24 minutes over 59 invalid");
  await setValue("#hm-minutes","1.5");inv=await field("#hm-minutes","#hm-minutes-error");check(inv.aria==="true"&&inv.error.includes("whole number"),"25 fractional first minutes invalid");

  await setValue("#hm-minutes","30");await setValue("#hm-mode","add","change");await setValue("#hm-hours-2","");inv=await field("#hm-hours-2","#hm-hours-2-error");s=await snap();
  check(inv.aria==="true"&&s.minutes==="—","26 blank second hours invalid when active");
  await setValue("#hm-hours-2","1");await setValue("#hm-minutes-2","60");inv=await field("#hm-minutes-2","#hm-minutes-2-error");check(inv.aria==="true","27 second minutes range invalid");

  await setValue("#hm-mode","convert","change");s=await snap();inv=await field("#hm-minutes-2","#hm-minutes-2-error");
  check(s.minutes==="510"&&inv.aria==="false"&&inv.hidden,"28 hidden second does not invalidate convert");

  await click("#hm-reset");await setValue("#hm-mode","multi","change");s=await snap();
  check(!s.secondHidden&&!s.multiHidden&&s.minutes==="590","29 multi base visibility/result");
  await click("#hm-add-row");await setValue("#hm-extra-3-hours","6");await setValue("#hm-extra-3-minutes","10");
  await click("#hm-add-row");await setValue("#hm-extra-4-hours","0");await setValue("#hm-extra-4-minutes","30");await setValue("#hm-extra-4-op","subtract","change");
  await setValue("#hm-hours","7");await setValue("#hm-minutes","45");await setValue("#hm-hours-2","8");await setValue("#hm-minutes-2","20");s=await snap();
  check(s.minutes==="1305"&&s.decimal==="21.75"&&s.hm==="21h 45m","30 multi arithmetic");
  check(s.pay.includes("543.75")&&s.formula.includes("465 + 500 + 370 − 30 = 1305 minutes"),"31 multi formula/pay");

  await setValue("#hm-extra-3-minutes","60");inv=await field("#hm-extra-3-minutes","#hm-extra-3-minutes-error");s=await snap();
  check(inv.aria==="true"&&s.minutes==="—","32 multi extra validation");
  await setValue("#hm-extra-3-minutes","10");s=await snap();check(s.minutes==="1305","33 multi recovers");

  await click('[data-hm-extra-row][data-row-index="4"] [data-hm-remove-row]');s=await snap();
  check(s.extraRows===1&&s.minutes==="1335","34 remove extra recalculates");

  await click("#hm-reset");await setValue("#hm-mode","multi","change");
  for(let i=0;i<8;i++)await click("#hm-add-row");
  s=await snap();
  check(s.extraRows===8&&s.addDisabled===true,"35 ten-duration limit");
  check(s.minutes==="590","36 zero extra rows preserve total");
  await click('[data-hm-extra-row] [data-hm-remove-row]');s=await snap();
  check(s.extraRows===7&&s.addDisabled===false,"37 remove re-enables add");

  await click("#hm-example");s=await snap();
  check(s.mode==="multi"&&s.extraRows===2&&s.minutes==="1305"&&s.decimal==="21.75"&&s.hm==="21h 45m"&&s.pay.includes("543.75"),"38 multi example");

  await click("#hm-reset");
  await evaluate('Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copied=value;}},configurable:true})');
  let copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#hm-copy-minutes").click();await new Promise(r=>setTimeout(r,20));return window.__copied})()');
  check(copied==="510","39 copy minutes");
  copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#hm-copy-decimal").click();await new Promise(r=>setTimeout(r,20));return window.__copied})()');
  check(copied==="8.50","40 copy decimal");
  copied=await evaluate('(async()=>{window.__copied="";document.querySelector("#hm-copy-result").click();await new Promise(r=>setTimeout(r,20));return window.__copied})()');
  check(copied.includes("Hours and minutes: 8h 30m")&&copied.includes("Total minutes: 510")&&copied.includes("no FX conversion"),"41 copy full result");

  await setValue("#hm-hours","");
  const noCopy=await evaluate('(async()=>{window.__copied="sentinel";document.querySelector("#hm-copy-result").click();await new Promise(r=>setTimeout(r,20));return {copied:window.__copied,status:document.querySelector("#hm-status").textContent.trim()}})()');
  check(noCopy.copied==="sentinel"&&noCopy.status.includes("valid duration values"),"42 stale copy suppressed");

  await click("#hm-reset");s=await snap();
  check(s.mode==="convert"&&s.minutes==="510"&&s.decimal==="8.50"&&s.extraRows===0&&s.secondHidden&&s.multiHidden,"43 reset state");

  const seo=await evaluate('({canonical:document.querySelector(\'link[rel="canonical"]\').href,faq:document.querySelectorAll(".faq details").length,metrics:document.querySelectorAll("[data-hours-minutes] .metric").length,reverse:!!document.querySelector("#hm-decimal-input"),start:!!document.querySelector("#hm-start-time"),end:!!document.querySelector("#hm-end-time"),breakInput:!!document.querySelector("#hm-break"),copy:!!document.querySelector("#hm-copy-result"),skip:!!document.querySelector(".skip-link")})');
  check(seo.canonical==="https://hostedtimesheets.com/hours-and-minutes-calculator/","44 canonical");
  check(seo.faq===8&&seo.metrics===4&&seo.copy&&seo.skip&&!seo.reverse&&!seo.start&&!seo.end&&!seo.breakInput,"45 scope/schema UI");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});await send("Page.navigate",{url:base+"/hours-and-minutes-calculator/"});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState==="complete"&&document.querySelector("#hm-total-minutes")?.textContent==="510"'))break;await sleep(100)}
  const d=await evaluate('({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,minutes:document.querySelector("#hm-total-minutes").textContent.trim(),decimal:document.querySelector("#hm-decimal").textContent.trim(),faq:document.querySelectorAll(".faq details").length})');
  check(d.overflow===false&&d.minutes==="510"&&d.decimal==="8.50"&&d.faq===8,"46 desktop regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"47 browser errors");
  console.log("Hours & Minutes 47-case calculation/UI matrix: PASS");
} finally {
  try{ws.close()}catch{}
  chrome.kill("SIGTERM");server.close();
}
