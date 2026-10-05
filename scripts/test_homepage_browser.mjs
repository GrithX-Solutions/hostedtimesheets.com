import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9878;
const debugPort=9224;
const base="http://127.0.0.1:"+port;
const mime=file=>file.endsWith(".js")?"application/javascript":file.endsWith(".css")?"text/css":file.endsWith(".svg")?"image/svg+xml":file.endsWith(".png")?"image/png":"text/html";

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
  "--user-data-dir=/tmp/ht-home-chrome",
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
const targetResponse=await fetch("http://127.0.0.1:"+debugPort+"/json/new?"+encodeURIComponent(base+"/"),{method:"PUT"});
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

try{
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Page.navigate",{url:base+"/"});
  for(let i=0;i<50;i++){
    const ready=await evaluate('document.readyState==="complete"&&document.querySelectorAll(".popular-card").length===6');
    if(ready)break;
    await sleep(100);
  }
  await sleep(250);

  const mobile=await evaluate('({h1:document.querySelector("h1").textContent.replace(/\\s+/g," ").trim(),categories:document.querySelectorAll(".category-card").length,popular:document.querySelectorAll(".popular-card").length,popularColumns:getComputedStyle(document.querySelector(".popular-grid")).gridTemplateColumns.split(" ").filter(Boolean).length,heroHref:document.querySelector(".featured-calculator-preview .button").getAttribute("href"),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})');
  check(mobile.h1==="Free Timesheet, Work Hours & Payroll Calculators","Mobile H1 mismatch");
  check(mobile.categories===6,"Expected 6 category cards");
  check(mobile.popular===6,"Expected 6 popular cards");
  check(mobile.popularColumns===1,"Popular cards are not single-column on mobile");
  check(mobile.heroHref==="/time-card-calculator/","Featured hero destination mismatch");
  check(mobile.overflow===false,"Homepage has document-level mobile horizontal overflow");

  const menu=await evaluate('(()=>{const details=document.querySelector(".nav-menu");details.querySelector("summary").click();return {open:details.open,panel:getComputedStyle(details.querySelector(".nav-panel")).display};})()');
  check(menu.open===true&&menu.panel!=="none","Mobile Tools menu did not open");
  await evaluate('document.querySelector(".nav-menu > summary").click()');

  const search=await evaluate('(()=>{const button=document.querySelector(".mobile-search-toggle");button.click();const input=document.querySelector(".site-search-input");input.value="military";input.dispatchEvent(new Event("input",{bubbles:true}));return {expanded:button.getAttribute("aria-expanded"),form:getComputedStyle(document.querySelector(".site-search")).display,result:[...document.querySelectorAll(".search-result")].find(a=>a.getAttribute("href")==="/military-time-converter/")?.getAttribute("href")||""};})()');
  check(search.expanded==="true"&&search.form!=="none","Mobile search did not open");
  check(search.result==="/military-time-converter/","Military Time search result missing");
  await evaluate('document.querySelector(".mobile-search-toggle").click()');

  const allTools=await evaluate('(()=>{const details=document.querySelector("#all-tools");details.querySelector("summary").click();return {open:details.open,clock:!!details.querySelector(\'a[href="/clock-out-time-calculator/"]\'),military:!!details.querySelector(\'a[href="/military-time-converter/"]\')};})()');
  check(allTools.open&&allTools.clock&&allTools.military,"All-tools priority links missing");

  await send("Emulation.setDeviceMetricsOverride",{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await sleep(150);
  const desktop=await evaluate('({popularColumns:getComputedStyle(document.querySelector(".popular-grid")).gridTemplateColumns.split(" ").filter(Boolean).length,categoryColumns:getComputedStyle(document.querySelector(".category-grid")).gridTemplateColumns.split(" ").filter(Boolean).length,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,heroTop:document.querySelector(".featured-calculator-preview").getBoundingClientRect().top})');
  check(desktop.popularColumns===6,"Desktop popular grid is not six columns");
  check(desktop.categoryColumns===6,"Desktop category grid changed unexpectedly");
  check(desktop.overflow===false,"Homepage has document-level desktop horizontal overflow");
  check(desktop.heroTop<900,"Featured calculator is not visible in initial desktop viewport");

  console.log("Homepage rendered layout/navigation checks: PASS");
} finally {
  try{ws.close();}catch(error){}
  chrome.kill("SIGTERM");
  server.close();
}