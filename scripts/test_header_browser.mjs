import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=9879;
const debugPort=9225;
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
  "--user-data-dir=/tmp/ht-header-chrome",
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

async function navigate(pathname,width,height,mobile){
  await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile});
  await send("Page.navigate",{url:base+pathname});
  for(let i=0;i<50;i++){
    const ready=await evaluate('document.readyState==="complete"&&!!document.querySelector(".site-header")');
    if(ready)return;
    await sleep(100);
  }
  throw new Error("Page did not finish loading: "+pathname);
}

async function assertHeader(pathname,width,height,mobile){
  await navigate(pathname,width,height,mobile);
  await sleep(180);
  const state=await evaluate('(()=>{const tools=document.querySelector(".nav-menu>summary").getBoundingClientRect();const search=document.querySelector(".mobile-search-toggle").getBoundingClientRect();const logo=document.querySelector(".brand-logo").getBoundingClientRect();const footerLogo=document.querySelector(".site-footer .brand-logo")?.getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,logoW:Math.round(logo.width),logoH:Math.round(logo.height),footerLogoH:footerLogo?Math.round(footerLogo.height):0,visibleDirect:[...document.querySelectorAll(".main-nav>a")].filter(a=>getComputedStyle(a).display!=="none").length,allToolsDisplay:getComputedStyle(document.querySelector(".header-all-tools")).display,tools:{x:tools.x,y:tools.y,width:tools.width,height:tools.height},search:{x:search.x,y:search.y,width:search.width,height:search.height},searchLabel:getComputedStyle(document.querySelector(".mobile-search-toggle"),"::after").content,searchForm:getComputedStyle(document.querySelector(".site-search")).display};})()');
  check(state.overflow===false,pathname+" header causes horizontal overflow at "+width);
  const minLogoWidth=width<=420?135:160;
  check(state.logoW>=minLogoWidth,pathname+" logo is too small: "+state.logoW);
  check(state.logoH>=27,pathname+" logo height is too small: "+state.logoH);
  if(state.footerLogoH)check(state.footerLogoH<=36,pathname+" footer logo was unintentionally resized: "+state.footerLogoH);
  check(state.visibleDirect===0,pathname+" redundant direct nav links are visible");
  check(state.allToolsDisplay==="none",pathname+" duplicate All Tools control is visible");
  check(Math.abs(state.tools.height-state.search.height)<=2,pathname+" Tools/Search heights are misaligned");
  check(Math.abs(state.tools.y-state.search.y)<=2,pathname+" Tools/Search vertical alignment is off");
  check(state.search.x>state.tools.x,pathname+" Search is not positioned after Tools");
  check(state.searchLabel.includes("Search"),pathname+" Search label is missing");
  check(state.searchForm==="none",pathname+" Search form should be closed initially");

  const opened=await evaluate('(()=>{const b=document.querySelector(".mobile-search-toggle");b.click();const i=document.querySelector("#site-tool-search");i.value="military";i.dispatchEvent(new Event("input",{bubbles:true}));return {expanded:b.getAttribute("aria-expanded"),form:getComputedStyle(document.querySelector(".site-search")).display,result:!!document.querySelector(\'.search-result[href="/military-time-converter/"]\')};})()');
  check(opened.expanded==="true"&&opened.form!=="none",pathname+" Search did not open");
  check(opened.result,pathname+" Search results did not work");

  const menu=await evaluate('(async()=>{const m=document.querySelector(".nav-menu");const s=m.querySelector(":scope > summary");s.click();await new Promise(resolve=>setTimeout(resolve,80));const panel=document.querySelector(".nav-panel");const style=getComputedStyle(panel);const rect=panel.getBoundingClientRect();return {open:m.open,classOpen:m.classList.contains("is-open"),expanded:s.getAttribute("aria-expanded"),searchOpen:document.querySelector(".site-header").classList.contains("search-open"),panel:style.display,position:style.position,left:Math.round(rect.left),right:Math.round(rect.right),width:Math.round(rect.width),viewport:window.innerWidth,top:Math.round(rect.top),height:Math.round(rect.height)};})()');
  check(menu.open===true&&menu.classOpen===true&&menu.expanded==="true",pathname+" explicit Tools state did not open");
  check(menu.searchOpen===false&&menu.panel!=="none",pathname+" Tools menu/search mutual exclusion failed");
  if(width<=760){
    check(menu.position==="absolute",pathname+" mobile Tools panel is not iOS-safe absolute positioning");
    check(Math.abs(menu.left)<=2&&Math.abs(menu.right-menu.viewport)<=2,pathname+" mobile Tools panel is not viewport aligned: "+JSON.stringify(menu));
  }
  check(menu.height>100,pathname+" Tools panel has insufficient rendered height: "+menu.height);

  const toolsOutside=await evaluate('(()=>{document.querySelector("main").dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));const m=document.querySelector(".nav-menu");const s=m.querySelector(":scope > summary");return {open:m.open,classOpen:m.classList.contains("is-open"),expanded:s.getAttribute("aria-expanded")};})()');
  check(toolsOutside.open===false&&toolsOutside.classOpen===false&&toolsOutside.expanded==="false",pathname+" outside click did not close Tools");

  const outside=await evaluate('(()=>{document.querySelector(".mobile-search-toggle").click();document.querySelector("main").dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));return {open:document.querySelector(".site-header").classList.contains("search-open")};})()');
  check(outside.open===false,pathname+" outside click did not close Search");
}

try{
  await send("Page.enable");
  await send("Runtime.enable");
  await assertHeader("/",390,844,true);
  await assertHeader("/time-card-calculator/",390,844,true);
  await assertHeader("/",1280,900,false);
  await assertHeader("/time-card-calculator/",1280,900,false);
  console.log("Global header rendered UI checks: PASS");
} finally {
  try{ws.close();}catch(error){}
  chrome.kill("SIGTERM");
  server.close();
}