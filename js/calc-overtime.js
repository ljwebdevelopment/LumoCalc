import { money, num, clampMin } from "./app.js";

const form = document.getElementById("form");
const rateEl = document.getElementById("rate");
const hoursEl = document.getElementById("hours");
const thresholdEl = document.getElementById("threshold");
const multEl = document.getElementById("mult");

const err = document.getElementById("err");
const out = document.getElementById("out");
const grossEl = document.getElementById("gross");
const breakdownEl = document.getElementById("breakdown");
const resetBtn = document.getElementById("reset");

function calc(){
  err.textContent = "";

  const rate = clampMin(num(rateEl.value), 0);
  const hours = clampMin(num(hoursEl.value), 0);
  const threshold = clampMin(num(thresholdEl.value), 0);
  const mult = clampMin(num(multEl.value), 1);

  if (rate <= 0 || hours <= 0){
    out.hidden = true;
    err.textContent = "Enter a valid hourly rate and total hours.";
    return;
  }

  const regularHours = Math.min(hours, threshold);
  const overtimeHours = Math.max(0, hours - threshold);

  const regularPay = regularHours * rate;
  const overtimePay = overtimeHours * rate * mult;
  const gross = regularPay + overtimePay;

  grossEl.textContent = money(gross);
  breakdownEl.textContent =
    `Regular: ${regularHours.toFixed(2)} hrs × ${money(rate)} = ${money(regularPay)} • ` +
    `Overtime: ${overtimeHours.toFixed(2)} hrs × ${money(rate * mult)} = ${money(overtimePay)}`;

  out.hidden = false;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  calc();
});

resetBtn.addEventListener("click", () => {
  rateEl.value = "";
  hoursEl.value = "";
  thresholdEl.value = "40";
  multEl.value = "1.5";
  err.textContent = "";
  out.hidden = true;
});

["input","change"].forEach(evt => {
  rateEl.addEventListener(evt, () => out.hidden && err.textContent && calc());
  hoursEl.addEventListener(evt, () => out.hidden && err.textContent && calc());
});
