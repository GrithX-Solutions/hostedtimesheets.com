const assert=require("node:assert/strict");
const {
  parseTime,decimalHours,applyRounding,readNonNegative,evaluateRow,summarize
}=require("../assets/js/timesheet-calculator.js");

const row=(start,end,breakValue="",increment=1,mode="nearest")=>
  evaluateRow({start,end,breakValue,increment,mode});

assert.equal(parseTime("09:00"),540);
assert.equal(parseTime("23:59"),1439);
assert.equal(parseTime("24:00"),null);

let r=row("09:00","17:30","30");
assert.equal(r.status,"valid");
assert.equal(r.workedMinutes,480);
assert.equal(decimalHours(r.workedMinutes),"8.00");

assert.equal(row("22:00","06:00","0").workedMinutes,480);
assert.equal(row("22:00","06:00","30").workedMinutes,450);

assert.equal(row("09:00","","30").status,"incomplete");
assert.equal(row("","17:00","30").status,"incomplete");
assert.equal(row("09:00","09:00","30").status,"ambiguous");
assert.equal(row("09:00","10:00","90").status,"break-overrun");
assert.equal(row("09:00","10:00","-1").status,"invalid-break");
assert.equal(row("09:00","10:00","7.5").status,"invalid-break");

r=row("08:07","17:08","30",15,"nearest");
assert.equal(r.rawNetMinutes,511);
assert.equal(r.workedMinutes,510);
assert.equal(decimalHours(r.workedMinutes),"8.50");
assert.equal(row("08:07","17:08","30",15,"up").workedMinutes,525);
assert.equal(row("08:07","17:08","30",15,"down").workedMinutes,510);
assert.equal(row("08:07","17:08","30",1,"nearest").workedMinutes,511);
assert.equal(decimalHours(511),"8.5167");

r=row("08:00","16:01","0");
assert.equal(r.workedMinutes,481);
assert.equal(decimalHours(481),"8.0167");
assert.equal(Math.round((481/60*25)*100)/100,200.42);

const five8=Array.from({length:5},()=>row("09:00","17:00","0"));
let s=summarize(five8,{threshold:"40",rate:"25",multiplier:"1.5"});
assert.equal(s.totalMinutes,2400);
assert.equal(s.regularMinutes,2400);
assert.equal(s.overtimeMinutes,0);
assert.equal(s.grossPay,1000);

const five9=Array.from({length:5},()=>row("09:00","18:00","0"));
s=summarize(five9,{threshold:"40",rate:"25",multiplier:"1.5"});
assert.equal(s.totalMinutes,2700);
assert.equal(s.regularMinutes,2400);
assert.equal(s.overtimeMinutes,300);
assert.equal(s.grossPay,1187.5);

s=summarize([row("09:00","17:00","0")],{threshold:"",rate:"25",multiplier:"1.5"});
assert.equal(s.regularMinutes,null);
assert.equal(s.overtimeMinutes,null);
assert.equal(s.grossPay,null);

s=summarize([row("09:00","17:00","0")],{threshold:"0",rate:"25",multiplier:"1.5"});
assert.equal(s.regularMinutes,0);
assert.equal(s.overtimeMinutes,480);
assert.equal(s.grossPay,300);

s=summarize([row("09:00","17:00","0")],{threshold:"40",rate:"25",multiplier:""});
assert.equal(s.regularMinutes,480);
assert.equal(s.overtimeMinutes,0);
assert.equal(s.grossPay,null);

s=summarize([row("09:00","17:00","0")],{threshold:"40",rate:"",multiplier:"1.5"});
assert.equal(s.totalMinutes,480);
assert.equal(s.grossPay,null);

s=summarize([row("09:00","17:00","0")],{threshold:"40",rate:"0",multiplier:"1.5"});
assert.equal(s.grossPay,0);

s=summarize([row("09:00","17:00","30"),row("09:00","","30")],{threshold:"40",rate:"25",multiplier:"1.5"});
assert.equal(s.totalMinutes,450);
assert.equal(s.totalBreakMinutes,30);
assert.equal(s.invalidRows,1);

assert.deepEqual(readNonNegative("",{optional:true}),{valid:true,value:null,blank:true});
assert.equal(readNonNegative("-1").valid,false);
assert.equal(applyRounding(511,15,"nearest"),510);

console.log("Time Card calculation tests: PASS");