import { money, num, clampMin } from "./app.js";

const KEY = "lumocalc_networth_v1";

const assetsEl = document.getElementById("assets");
const liabilitiesEl = document.getElementById("liabilities");
const addAssetBtn = document.getElementById("addAsset");
const addLiabilityBtn = document.getElementById("addLiability");
const resetBtn = document.getElementById("reset");

const netEl = document.getElementById("net");
const totalsEl = document.getElementById("totals");
const errEl = document.getElementById("err");

let state = load() || {
  assets: [
    { name: "Checking/Savings", amount: 0 },
    { name: "Investments", amount: 0 },
  ],
  liabilities: [
    { name: "Credit Cards", amount: 0 },
  ]
};

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  }catch{
    return null;
  }
}
function save(){
  localStorage.setItem(KEY, JSON.stringify(state));
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function itemRow(item, idx, kind){
  return `
    <div class="result" style="margin-top:10px;">
      <div class="row">
        <div class="field">
          <label>Label</label>
          <input data-kind="${kind}" data-i="${idx}" data-k="name" value="${escapeHtml(item.name ?? "")}" />
        </div>
        <div class="field">
          <label>Amount</label>
          <input data-kind="${kind}" data-i="${idx}" data-k="amount" inputmode="decimal" value="${item.amount ?? ""}" />
        </div>
      </div>
      <div class="row">
        <button class="btn" type="button" data-del="${kind}" data-i="${idx}">Remove</button>
      </div>
    </div>
  `;
}

function sum(list){
  return list.reduce((s, x) => s + clampMin(num(x.amount), 0), 0);
}

function render(){
  errEl.textContent = "";

  assetsEl.innerHTML = state.assets.map((a,i) => itemRow(a, i, "assets")).join("");
  liabilitiesEl.innerHTML = state.liabilities.map((l,i) => itemRow(l, i, "liabilities")).join("");

  document.querySelectorAll("input[data-kind]").forEach(inp => {
    inp.addEventListener("input", () => {
      const kind = inp.dataset.kind;
      const i = Number(inp.dataset.i);
      const k = inp.dataset.k;
      if (!state[kind] || !state[kind][i]) return;

      if (k === "name") state[kind][i][k] = inp.value;
      else state[kind][i][k] = num(inp.value);

      save();
      updateTotals();
    });
  });

  document.querySelectorAll("button[data-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.del;
      const i = Number(btn.dataset.i);
      state[kind].splice(i, 1);
      save();
      render();
    });
  });

  updateTotals();
}

function updateTotals(){
  const a = sum(state.assets);
  const l = sum(state.liabilities);
  const nw = a - l;

  netEl.textContent = `Net worth: ${money(nw)}`;
  totalsEl.textContent = `Assets: ${money(a)} • Liabilities: ${money(l)}`;
}

addAssetBtn.addEventListener("click", () => {
  state.assets.push({ name: `Asset ${state.assets.length + 1}`, amount: 0 });
  save();
  render();
});

addLiabilityBtn.addEventListener("click", () => {
  state.liabilities.push({ name: `Liability ${state.liabilities.length + 1}`, amount: 0 });
  save();
  render();
});

resetBtn.addEventListener("click", () => {
  if (!confirm("Reset all net worth items?")) return;
  localStorage.removeItem(KEY);
  state = { assets: [], liabilities: [] };
  render();
});

render();
