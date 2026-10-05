const assert=require("node:assert/strict");
const {
  parseTime,parseDate,toIsoDate,dateInfo,visibleRowCount,createModel,readBreak,
  evaluateRow,formatMinutes,decimalHours,summarize,csvEscape,buildCsv
}=require("../assets/js/timesheet-template.js");

assert.equal(parseTime("09:00"),540);
assert.equal(parseTime("23:59"),1439);
assert.equal(parseTime("24:00"),null);
assert.equal(parseTime("09:60"),null);

assert.equal(toIsoDate(parseDate("2026-10-05")),"2026-10-05");
assert.equal(parseDate("2026-02-30"),null);
assert.deepEqual(dateInfo("",0),{iso:"",dayLabel:"Day 1",dateLabel:""});
assert.equal(dateInfo("2026-10-05",0).dayLabel,"Monday");
assert.equal(dateInfo("2026-10-31",1).iso,"2026-11-01");
assert.equal(dateInfo("2026-12-31",1).iso,"2027-01-01");

assert.equal(visibleRowCount("weekly"),7);
assert.equal(visibleRowCount("biweekly"),14);

const fresh=createModel();
assert.equal(fresh.length,14);
assert.ok(fresh.every(row=>row.breakValue==="0"));

assert.deepEqual(readBreak(""),{valid:true,value:0});
assert.deepEqual(readBreak("0"),{valid:true,value:0});
assert.equal(readBreak("-1").valid,false);
assert.equal(readBreak("7.5").valid,false);

const row=(start,end,breakValue="0")=>evaluateRow({start,end,breakValue});

let r=row("09:00","17:00","0");
assert.equal(r.status,"valid");
assert.equal(r.netMinutes,480);
assert.equal(formatMinutes(r.netMinutes),"8h 00m");

r=row("09:00","17:00","30");
assert.equal(r.netMinutes,450);
assert.equal(formatMinutes(r.netMinutes),"7h 30m");
assert.equal(decimalHours(r.netMinutes),"7.5000");

r=row("22:00","06:00","30");
assert.equal(r.grossMinutes,480);
assert.equal(r.netMinutes,450);

assert.equal(row("09:00","09:00","0").status,"equal-punches");
assert.equal(row("09:00","","0").status,"incomplete");
assert.equal(row("","17:00","0").status,"incomplete");
assert.equal(row("09:00","10:00","61").status,"break-overrun");
assert.equal(row("09:00","10:00","-1").status,"invalid-break");
assert.equal(row("09:00","10:00","7.5").status,"invalid-break");
assert.equal(row("09:00","10:00","60").netMinutes,0);
assert.equal(row("","","0").status,"empty");

const weekly=createModel();
for(let i=0;i<5;i++)weekly[i]={start:"09:00",end:"17:00",breakValue:"30"};
let s=summarize(weekly,"weekly");
assert.equal(s.week1Minutes,2250);
assert.equal(s.totalMinutes,2250);
assert.equal(s.week2Minutes,0);
assert.equal(s.validRows,5);
assert.equal(s.invalidRows,0);
assert.equal(formatMinutes(s.totalMinutes),"37h 30m");

const biweekly=createModel();
for(const i of [0,1,2,3,4,7,8,9,10,11]){
  biweekly[i]={start:"09:00",end:"17:00",breakValue:"30"};
}
s=summarize(biweekly,"biweekly");
assert.equal(s.week1Minutes,2250);
assert.equal(s.week2Minutes,2250);
assert.equal(s.totalMinutes,4500);
assert.equal(formatMinutes(s.totalMinutes),"75h 00m");

biweekly[5]={start:"09:00",end:"",breakValue:"0"};
s=summarize(biweekly,"biweekly");
assert.equal(s.totalMinutes,4500);
assert.equal(s.invalidRows,1);

const preserved=createModel();
preserved[0]={start:"08:00",end:"16:00",breakValue:"0"};
preserved[8]={start:"10:00",end:"18:00",breakValue:"30"};
const weekOnly=summarize(preserved,"weekly");
assert.equal(weekOnly.totalMinutes,480);
assert.equal(preserved[8].start,"10:00");
const backToBiweekly=summarize(preserved,"biweekly");
assert.equal(backToBiweekly.totalMinutes,930);

assert.equal(csvEscape('ACME, "West"'),'"ACME, ""West"""');

const csvModel=createModel();
csvModel[0]={start:"09:00",end:"17:00",breakValue:"30"};
const csv=buildCsv({
  employee:'Jane "JJ" Doe',
  company:"ACME, West",
  periodStart:"2026-10-05",
  type:"weekly",
  model:csvModel
});
assert.ok(csv.includes('"Employee","Jane ""JJ"" Doe"'));
assert.ok(csv.includes('"Company","ACME, West"'));
assert.ok(csv.includes('"Period Start","2026-10-05"'));
assert.ok(csv.includes('"1","2026-10-05","Monday","09:00","17:00","30","450","7.5000"'));
assert.equal(csv.split("\n").length,13);

const csvBiweekly=buildCsv({
  employee:"",
  company:"",
  periodStart:"2026-12-28",
  type:"biweekly",
  model:createModel()
});
assert.ok(csvBiweekly.includes('"2","2027-01-04","Monday"'));
assert.equal(csvBiweekly.split("\n").length,20);

console.log("Timesheet Template calculation tests: PASS");