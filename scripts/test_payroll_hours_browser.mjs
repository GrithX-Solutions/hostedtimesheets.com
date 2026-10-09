import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),".."),port=9894,debugPort=9243,base="http://127.0.0.1:"+port,userDir="/tmp/ht-payroll-hours-chrome";
await rm(userDir,{recursive:true,force:true});
const mime=f=>f.endsWith(".js")?"application/javascript":f.endsWith(".css")?"text/css":f.endsWith(".png")?"image/png":f.endsWith(".svg")?"image/svg+xml":"text/html";
const server=createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,base).pathname);if(p.endsWith("/"))p+="index.html";const target=path.join(root,p);if(!target.startsWith(root))throw 0;const data=await readFile(target);res.writeHead(200,{"content-type":mime(target)});res.end(data)}catch{res.writeHead(404);res.end("not found")}});
await new Promise(r=>server.listen(port,"127.0.0.1",r));
const chrome=spawn("/usr/bin/chromium",["--headless","--no-sandbox","--disable-gpu","--remote-debugging-address=127.0.0.1","--remote-debugging-port="+debugPort,"--user-data-dir="+userDir,"--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1","about:blank"],{stdio:"ignore"});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),check=(c,m)=>{if(!c)throw new Error(m)};
for(let i=0;i<50;i++){try{if((await fetch("http://127.0.0.1:"+debugPort+"/json/version")).ok)break}catch{}await sleep(100)}
const tr=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/payroll-hours-calculator/"),{method:"PUT"});check(tr.ok,"target");
const target=await tr.json(),ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.addEventListener("open",r,{once:true});ws.addEventListener("error",j,{once:true})});
let seq=0;const pending=new Map(),runtimeErrors=[],consoleErrors=[];
ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.method==="Runtime.exceptionThrown")runtimeErrors.push("runtime");if(m.method==="Runtime.consoleAPICalled"&&m.params?.type==="error")consoleErrors.push("console");if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result||{})});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval");return r.result?.value};
const q=s=>JSON.stringify(s),set=async(sel,v)=>ev(`(()=>{const e=document.querySelector(${q(sel)});e.value=${q(String(v))};e.dispatchEvent(new Event("input",{bubbles:true}));return e.value})()`),click=sel=>ev(`document.querySelector(${q(sel)}).click()`),typeRaw=async(sel,text)=>{await ev(`(()=>{const e=document.querySelector(${q(sel)});e.focus();e.value="";e.dispatchEvent(new Event("input",{bubbles:true}));return true})()`);await send("Input.insertText",{text});await sleep(30);return ev(`document.querySelector(${q(sel)}).validity.badInput`)};
const snap=()=>ev('({total:document.querySelector("#ph-total-decimal").textContent.trim(),minutes:document.querySelector("#ph-total-minutes").textContent.trim(),regular:document.querySelector("#ph-regular").textContent.trim(),ot:document.querySelector("#ph-overtime").textContent.trim(),gross:document.querySelector("#ph-gross").textContent.trim(),status:document.querySelector("#ph-status").textContent.trim(),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})');
try{
 await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});await send("Page.navigate",{url:base+"/payroll-hours-calculator/"});
 for(let i=0;i<50;i++){if(await ev('document.readyState==="complete"&&document.querySelector("#ph-total-decimal")?.textContent==="0.00"'))break;await sleep(100)}
 let s=await snap();check(s.total==="0.00"&&s.regular==="Not split"&&s.gross==="Not entered"&&!s.overflow,"1 defaults");await set('[data-payroll-row]:nth-child(7) [data-hours]',"");await set('[data-payroll-row]:nth-child(7) [data-minutes]',"");s=await snap();check(s.total==="0.00","1b blank day is zero");
 await click("#ph-example");s=await snap();check(s.minutes==="2490"&&s.total==="41.50","2 example total");check(s.regular==="40.00"&&s.ot==="1.50"&&s.gross==="$1,056.25","3 example pay");
 await set('[data-payroll-row]:nth-child(1) [data-minutes]',"60");s=await snap();check(s.total==="—"&&s.status.includes("paused"),"4 minutes invalid");
 await set('[data-payroll-row]:nth-child(1) [data-minutes]',"0");await set('[data-payroll-row]:nth-child(1) [data-hours]',"-1");s=await snap();check(s.total==="—","5 negative hours invalid");
 await set('[data-payroll-row]:nth-child(1) [data-hours]',"8.5");s=await snap();check(s.total==="—","6 fractional hours invalid");
 await set('[data-payroll-row]:nth-child(1) [data-hours]',"");const badDay=await typeRaw('[data-payroll-row]:nth-child(1) [data-hours]',"1e");s=await snap();check(badDay&&s.total==="—","6b malformed daily hours invalid");
 await set('[data-payroll-row]:nth-child(1) [data-hours]',"8");await set("#ph-rate","");await set("#ph-threshold","");await set("#ph-multiplier","");s=await snap();check(s.total==="41.50"&&s.regular==="Not split"&&s.gross==="Not entered","7 optional blanks");
 await set("#ph-threshold","40");s=await snap();check(s.total==="—","8 incomplete overtime pair");
 await set("#ph-multiplier","0");s=await snap();check(s.total==="—","9 zero multiplier invalid");
 await set("#ph-multiplier","1.5");await set("#ph-rate","0");s=await snap();check(s.total==="41.50"&&s.gross==="$0.00","10 explicit zero rate");
 await set("#ph-rate","-1");s=await snap();check(s.total==="—","11 negative rate invalid");
 await set("#ph-rate","");const badRate=await typeRaw("#ph-rate","1e");s=await snap();check(badRate&&s.total==="—","11b malformed rate invalid");
 await set("#ph-rate","25");await ev('window.__clip="";Object.defineProperty(navigator,"clipboard",{value:{writeText:async v=>{window.__clip=v}},configurable:true})');await click("#ph-copy");await sleep(20);check((await ev("window.__clip")).includes("Total: 2490 minutes = 41.50 payroll hours"),"12 copy");
 await ev('window.__blob=null;window.__download="";URL.createObjectURL=b=>{window.__blob=b;return "blob:test"};URL.revokeObjectURL=()=>{};HTMLAnchorElement.prototype.click=function(){window.__download=this.download}');await click("#ph-csv");await sleep(20);const csv=await ev('(async()=>({name:window.__download,text:await window.__blob.text()}))()');check(csv.name==="payroll-hours.csv"&&csv.text.includes('"TOTAL","","2490","41.50"'),"13 csv");
 await ev('window.__printed=false;window.print=()=>window.__printed=true');await click("#ph-print");check(await ev("window.__printed===true"),"14 print");
 const seo=await ev('({faq:document.querySelectorAll(".faq details").length,canonical:document.querySelector(\'link[rel="canonical"]\').href,runtime:[...document.scripts].find(x=>x.src.includes("payroll-hours.js"))?.src})');check(seo.faq===8&&seo.canonical==="https://hostedtimesheets.com/payroll-hours-calculator/"&&seo.runtime.includes("20261009-badinput1"),"15 SEO/runtime");
 await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});await send("Page.navigate",{url:base+"/payroll-hours-calculator/"});for(let i=0;i<50;i++){if(await ev('document.readyState==="complete"&&document.querySelector("#ph-total-decimal")'))break;await sleep(100)}check(!(await snap()).overflow,"16 desktop overflow");check(runtimeErrors.length===0&&consoleErrors.length===0,"17 browser errors");
 console.log("Payroll Hours 19-case calculation/UI matrix: PASS");
} finally {try{ws.close()}catch{}chrome.kill("SIGTERM");server.close()}
