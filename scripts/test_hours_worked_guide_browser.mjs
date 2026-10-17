import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9897,debugPort=9246,base="http://127.0.0.1:"+port,userDir="/tmp/ht-hours-worked-guide-chrome";
await rm(userDir,{recursive:true,force:true});
const mime=f=>f.endsWith(".js")?"application/javascript":f.endsWith(".css")?"text/css":f.endsWith(".png")?"image/png":f.endsWith(".svg")?"image/svg+xml":"text/html";
const server=createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,base).pathname);if(p.endsWith("/"))p+="index.html";const target=path.join(root,p);if(!target.startsWith(root))throw 0;const data=await readFile(target);res.writeHead(200,{"content-type":mime(target)});res.end(data)}catch{res.writeHead(404);res.end("not found")}});
await new Promise(r=>server.listen(port,"127.0.0.1",r));

const chrome=spawn("/usr/bin/chromium",["--headless","--no-sandbox","--disable-gpu","--remote-debugging-address=127.0.0.1","--remote-debugging-port="+debugPort,"--user-data-dir="+userDir,"--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1","about:blank"],{stdio:"ignore"});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),check=(c,m)=>{if(!c)throw new Error(m)};
for(let i=0;i<50;i++){try{if((await fetch("http://127.0.0.1:"+debugPort+"/json/version")).ok)break}catch{}await sleep(100)}
const tr=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/how-to-calculate-hours-worked/"),{method:"PUT"});check(tr.ok,"target");
const target=await tr.json(),ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.addEventListener("open",r,{once:true});ws.addEventListener("error",j,{once:true})});

let seq=0;const pending=new Map(),runtimeErrors=[],consoleErrors=[];
ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.method==="Runtime.exceptionThrown")runtimeErrors.push("runtime");if(m.method==="Runtime.consoleAPICalled"&&m.params?.type==="error")consoleErrors.push("console");if(!m.id||!pending.has(m.id))return;const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result||{})});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||"eval");return r.result?.value};

try{
  await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});await send("Page.navigate",{url:base+"/how-to-calculate-hours-worked/"});
  for(let i=0;i<50;i++){if(await ev('document.readyState==="complete"&&document.querySelector("h1")?.textContent.includes("How to Calculate Hours Worked")'))break;await sleep(100)}
  await sleep(80);

  let s=await ev('({title:document.title,h1:document.querySelector("h1")?.textContent.trim(),canonical:document.querySelector(\'link[rel="canonical"]\')?.href,updated:document.querySelector(".page-hero .eyebrow")?.textContent.trim(),faq:document.querySelectorAll(".faq details").length,codes:[...document.querySelectorAll("article code")].map(x=>x.textContent.trim()),articleInputs:document.querySelectorAll("article input,article select,article textarea").length,links:[...document.querySelectorAll("article a")].map(x=>x.getAttribute("href")),tables:document.querySelectorAll("article table").length,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,bodyText:document.querySelector("article")?.innerText||""})');
  check(s.title==="How to Calculate Hours Worked (With Breaks & Examples)","1 title");
  check(s.h1==="How to Calculate Hours Worked","2 h1");
  check(s.canonical==="https://hostedtimesheets.com/how-to-calculate-hours-worked/","3 canonical");
  check(s.updated.includes("October 17, 2026"),"4 visible update");
  check(s.faq===8,"5 FAQ count");
  check(s.codes.includes("=MOD(B2-A2,1)*24-(C2/60)")&&s.codes.includes("=MOD(B2-A2,1)-(C2/1440)")&&s.codes.includes("=SUM(D2:D8)"),"6 spreadsheet formulas");
  check(s.bodyText.includes("A minutes-first method that is easy to audit")&&s.bodyText.includes("What to do with missing or ambiguous punches"),"7 information gain");
  check(s.bodyText.includes("1,800")&&s.bodyText.includes("450 minutes")&&s.bodyText.includes("7.50 decimal hours"),"8 overnight audit example");
  check(s.bodyText.includes("07:45 to 16:20")&&s.bodyText.includes("8h 00m"),"9 24-hour example");
  check(s.articleInputs===0,"10 guide-only ownership");
  check(s.links.includes("/work-hours-calculator/")&&s.links.includes("/weekly-timesheet-calculator/")&&s.links.includes("/timesheet-calculator-with-lunch/")&&s.links.includes("/decimal-hours-calculator/")&&s.links.includes("/payroll-hours-calculator/")&&s.links.includes("/overtime-calculator/"),"11 internal ownership links");
  check(s.tables>=4,"12 useful tables");
  check(!s.overflow,"13 mobile overflow");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});await send("Page.navigate",{url:base+"/how-to-calculate-hours-worked/"});
  for(let i=0;i<50;i++){if(await ev('document.readyState==="complete"&&document.querySelector(".faq details")'))break;await sleep(100)}
  s=await ev('({faq:document.querySelectorAll(".faq details").length,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,h1:document.querySelector("h1")?.textContent.trim()})');
  check(s.faq===8&&s.h1==="How to Calculate Hours Worked"&&!s.overflow,"14 desktop regression");
  check(runtimeErrors.length===0&&consoleErrors.length===0,"15 browser errors");
  console.log("Hours Worked guide 15-case rendered regression: PASS");
} finally {
  try{ws.close()}catch{}
  chrome.kill("SIGTERM");
  server.close();
}
