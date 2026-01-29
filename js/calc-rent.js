import { money, num, clampMin } from "./app.js";

const form = document.getElementById("form");
const incomeModeEl = document.getElementById("incomeMode");
const incomeEl = document.getElementById("income");
const debtEl = document.getElementById("debt");
const utilitiesEl = document.getElementById("utilities");
const rulePctEl = document.getElementById("rulePct");
const dtiLimitEl = document.getElementById("dtiLimit");

const err = document.getElementById("err");
const out = document.getElementById("out");
const headline = document.getElementById("headline");
const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");
const resetBtn = document.getElementById("reset");

function calc(){
  err.textContent = "";

  const mode = incomeModeEl.value;
  const incomeRaw = clampMin(num(incomeEl.value), 0);
  const debt = clampMin(num(debtEl.value), 0);
  const utils = clampMin(num(utilitiesEl.value), 0);

  if (incomeRaw <= 0){
    out.hidden = true;
    err.textContent = "Enter a valid income amount.";
    return;
  }

  const monthlyIncome = mode === "annual" ? (incomeRaw / 12) : incomeRaw;

  const rentPct = clampMin(num(rulePctEl.value), 0) / 100;
  const dtiMax = clampMin(num(dtiLimitEl.value), 0) / 100;

  // Rule 1: % of income
  const rentByPct = monthlyIncome * rentPct;

  // Rule 2: total obligations (rent + utilities + debt) <= dtiMax * income
  const maxHousingTotal = (monthlyIncome * dtiMax) - debt;
  // “Housing total” includes rent + utilities (user provided)
  const rentByDTI = Math.max(0, maxHousingTotal - utils);

  // “3x rent” style (rent <= income/3)
  const rent3x = monthlyIncome / 3;

  // Recommended range: conservative min of these
  const conservative = Math.min(rentByPct, rentByDTI, rent3x);
  const aggressive = Math.min(rentByPct * 1.15, rentByDTI, rent3x * 1.1); // gentle upper band

  headline.textContent = `Estimated rent range: ${money(Math.max(0, conservative))} – ${money(Math.max(0, aggressive))} / month`;

  line1.textContent = `Monthly gross income used: ${money(monthlyIncome)} • Monthly debt: ${money(debt)} • Utilities: ${money(utils)}`;
  line2.textContent = `${Math.round(rentPct*100)}% rule says: ${money(rentByPct)} • “3× rent” style says: ${money(rent3x)}`;
  line3.textContent = `${Math.round(dtiMax*100)}% DTI check gives max rent: ${money(rentByDTI)} (after debt + utilities)`;

  out.hidden = false;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  calc();
});

resetBtn.addEventListener("click", () => {
  incomeModeEl.value = "monthly";
  incomeEl.value = "";
  debtEl.value = "0";
  utilitiesEl.value = "0";
  rulePctEl.value = "30";
  dtiLimitEl.value = "36";
  err.textContent = "";
  out.hidden = true;
});
