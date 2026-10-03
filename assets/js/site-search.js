(()=>{"use strict";const items=[
{t:"Timesheet Calculator With Lunch",u:"/timesheet-calculator-with-lunch/",c:"Timesheets",i:"T",k:["timesheet calculator with lunches","lunch timesheet","timecard with lunch break","work time calculator with lunch","lunch break calculator"]},
{t:"Weekly Timesheet Calculator",u:"/weekly-timesheet-calculator/",c:"Timesheets",i:"T",k:["weekly timesheet","weekly time card","weekly work hours"]},
{t:"Biweekly Timesheet Calculator",u:"/biweekly-timesheet-calculator/",c:"Timesheets",i:"T",k:["biweekly timesheet","two week timesheet","bi weekly time card"]},
{t:"Time Card Calculator",u:"/time-card-calculator/",c:"Timesheets",i:"T",k:["time card","clock in clock out calculator","timecard calculator"]},
{t:"Timesheet Pay Calculator",u:"/timesheet-pay-calculator/",c:"Timesheets",i:"T",k:["timesheet pay","hours and pay","gross pay from hours"]},
{t:"Timesheet Template",u:"/timesheet-template/",c:"Timesheets",i:"T",k:["free timesheet template","printable timesheet","csv timesheet"]},
{t:"Work Hours Calculator",u:"/work-hours-calculator/",c:"Hours & Payroll",i:"H",k:["work hours","hours worked calculator","free work hours calculator","shift hours"]},
{t:"Clock Out Time Calculator",u:"/clock-out-time-calculator/",c:"Hours & Payroll",i:"H",k:["clock out time calculator","what time should i clock out","what time do i clock out","clock out calculator","leave work time","8 hour shift with lunch"]},
{t:"Hours & Minutes Calculator",u:"/hours-and-minutes-calculator/",c:"Hours & Payroll",i:"H",k:["hours minutes","add hours and minutes","time duration"]},
{t:"Elapsed Time Calculator",u:"/elapsed-time-calculator/",c:"Hours & Payroll",i:"H",k:["elapsed time","time between two times","duration calculator"]},
{t:"Decimal Hours Calculator",u:"/decimal-hours-calculator/",c:"Hours & Payroll",i:"H",k:["decimal hours","minutes to decimal","payroll decimal time"]},
{t:"Payroll Hours Calculator",u:"/payroll-hours-calculator/",c:"Hours & Payroll",i:"H",k:["payroll hours","decimal payroll hours","payroll overtime calculator"]},
{t:"Overtime Calculator",u:"/overtime-calculator/",c:"Hours & Payroll",i:"H",k:["overtime calculator","payroll and overtime calculator","overtime pay"]},
{t:"Hourly Wage Calculator",u:"/hourly-wage-calculator/",c:"Salary & Pay",i:"$",k:["hourly wage","hourly to annual","hour rate to salary","yearly salary from hourly"]},
{t:"Salary to Hourly Calculator",u:"/salary-to-hourly-calculator/",c:"Salary & Pay",i:"$",k:["salary to hourly","annual salary to hourly conversion","convert salary to hourly"]},
{t:"Salary Increase Calculator",u:"/salary-increase-calculator/",c:"Salary & Pay",i:"$",k:["salary increase","pay raise percentage","percentage increase salary","pay increase"]},
{t:"Salary Calculator With Bonus",u:"/salary-calculator-with-bonus/",c:"Salary & Pay",i:"$",k:["salary with bonus","bonus calculator salary","base salary bonus","total compensation"]},
{t:"Biweekly Pay Calculator",u:"/biweekly-pay-calculator/",c:"Salary & Pay",i:"$",k:["biweekly pay","bi weekly pay calculator","pay every two weeks"]},
{t:"PTO Accrual Calculator",u:"/pto-accrual-calculator/",c:"PTO & Billing",i:"P",k:["pto accrual","vacation accrual","time off accrual","pto hours to days","accruing pto"]},
{t:"PTO Accrual Based on Hours Worked",u:"/pto-accrual-based-on-hours-worked/",c:"PTO & Billing",i:"P",k:["pto based on hours worked","hourly pto accrual","pto accrual rate"]},
{t:"Time Off Tracker",u:"/time-off-tracker/",c:"PTO & Billing",i:"P",k:["pto tracker","vacation tracker","sick leave balance","time off balance"]},
{t:"Billable Hours Calculator",u:"/billable-hours-calculator/",c:"PTO & Billing",i:"P",k:["billable hours","billable utilization","client billing hours","estimated revenue"]},
{t:"How to Calculate Hours Worked",u:"/how-to-calculate-hours-worked/",c:"Guides",i:"G",k:["calculate hours worked","work hours formula","shift calculation guide"]},
{t:"How to Calculate a Time Card",u:"/how-to-calculate-time-card/",c:"Guides",i:"G",k:["calculate time card","time card formula","timecard guide"]},
{t:"Time Card Hours With Lunch Break",u:"/time-card-hours-with-lunch-break/",c:"Guides",i:"G",k:["lunch break time card","30 minute lunch","60 minute lunch"]},
{t:"Minutes to Decimal Hours",u:"/minutes-to-decimal-hours/",c:"Guides",i:"G",k:["minutes to decimal hours","decimal conversion chart","payroll minutes chart"]},
{t:"How to Calculate PTO Accrual",u:"/how-to-calculate-pto-accrual/",c:"Guides",i:"G",k:["calculate pto accrual","pto formula","vacation accrual formula"]}
];const input=document.getElementById("site-tool-search"),box=document.getElementById("site-search-results"),clear=document.querySelector(".site-search-clear"),form=document.querySelector(".site-search");if(!input||!box||!form)return;let results=[],active=-1;const norm=s=>s.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();const rank=(x,q)=>{const t=norm(x.t),words=t.split(" "),keys=x.k.map(norm);if(t===q)return 0;if(t.startsWith(q))return 1;if(words.some(w=>w.startsWith(q)))return 2;if(keys.some(k=>k.startsWith(q)))return 3;if(t.includes(q))return 4;if(keys.some(k=>k.includes(q)))return 5;return 99};const hide=()=>{box.hidden=true;input.setAttribute("aria-expanded","false");active=-1};const setActive=n=>{active=n;box.querySelectorAll(".search-result").forEach((el,i)=>el.classList.toggle("is-active",i===active));if(active>=0){const el=box.querySelectorAll(".search-result")[active];el&&el.scrollIntoView({block:"nearest"})}};const render=()=>{const q=norm(input.value);clear.hidden=!q;if(!q){hide();return}results=items.map(x=>({x,s:rank(x,q)})).filter(v=>v.s<99).sort((a,b)=>a.s-b.s||a.x.t.localeCompare(b.x.t)).slice(0,8).map(v=>v.x);box.innerHTML=results.length?results.map((x,i)=>'<a class="search-result" role="option" data-index="'+i+'" href="'+x.u+'"><span class="search-result-icon" aria-hidden="true">'+x.i+'</span><span class="search-result-copy"><span class="search-result-title">'+x.t+'</span><span class="search-result-category">'+x.c+'</span></span></a>').join(""):'<div class="search-empty">No matching tool. Try hours, PTO, overtime, salary or lunch.</div>';box.hidden=false;input.setAttribute("aria-expanded","true");setActive(-1)};input.addEventListener("input",render);input.addEventListener("focus",()=>{if(input.value.trim())render()});input.addEventListener("keydown",e=>{if(box.hidden&&e.key==="ArrowDown"){render();return}if(e.key==="ArrowDown"&&results.length){e.preventDefault();setActive((active+1)%results.length)}else if(e.key==="ArrowUp"&&results.length){e.preventDefault();setActive(active<=0?results.length-1:active-1)}else if(e.key==="Enter"&&results.length){e.preventDefault();location.href=results[active>=0?active:0].u}else if(e.key==="Escape"){hide();input.blur()}});form.addEventListener("submit",e=>{e.preventDefault();if(results.length)location.href=results[active>=0?active:0].u});clear&&clear.addEventListener("click",()=>{input.value="";clear.hidden=true;hide();input.focus()});document.addEventListener("click",e=>{if(!form.contains(e.target))hide()});document.querySelectorAll(".nav-menu").forEach(d=>d.addEventListener("toggle",()=>{if(d.open)hide()}))})();

(()=>{"use strict";
const header=document.querySelector(".site-header");
const searchToggle=document.querySelector(".mobile-search-toggle");
const search=document.querySelector(".site-search");
const input=document.getElementById("site-tool-search");
const menu=document.querySelector(".nav-menu");
if(!header||!searchToggle||!search||!input)return;
const setSearch=open=>{
  header.classList.toggle("search-open",open);
  searchToggle.setAttribute("aria-expanded",String(open));
  if(open){
    if(menu&&menu.open)menu.open=false;
    setTimeout(()=>input.focus({preventScroll:true}),0);
  }else{
    const results=document.getElementById("site-search-results");
    if(results){results.hidden=true;input.setAttribute("aria-expanded","false")}
  }
};
searchToggle.addEventListener("click",()=>setSearch(!header.classList.contains("search-open")));
if(menu){
  menu.addEventListener("toggle",()=>{
    document.documentElement.classList.toggle("nav-open",menu.open);
    if(menu.open)setSearch(false);
  });
}
document.addEventListener("keydown",e=>{
  if(e.key!=="Escape")return;
  if(menu&&menu.open){menu.open=false;return}
  if(header.classList.contains("search-open"))setSearch(false);
});
window.addEventListener("resize",()=>{
  if(window.innerWidth>700){
    header.classList.remove("search-open");
    searchToggle.setAttribute("aria-expanded","false");
    document.documentElement.classList.remove("nav-open");
    if(menu)menu.open=false;
  }
});
})();

