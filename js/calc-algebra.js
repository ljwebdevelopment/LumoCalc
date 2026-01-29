const num = (v) => {
  const x = Number(String(v).trim());
  return Number.isFinite(x) ? x : NaN;
};

document.getElementById("solveLinear").addEventListener("click", () => {
  const a = num(document.getElementById("la").value);
  const b = num(document.getElementById("lb").value);
  const c = num(document.getElementById("lc").value);

  const out = document.getElementById("linearOut");
  const ans = document.getElementById("linearAns");
  const note = document.getElementById("linearNote");

  out.hidden = false;

  if (![a,b,c].every(Number.isFinite)){
    ans.textContent = "Error";
    note.textContent = "Enter valid numbers for a, b, and c.";
    return;
  }

  if (a === 0){
    if (b === c){
      ans.textContent = "Infinite solutions";
      note.textContent = "Because 0x + b = c is true for any x.";
    } else {
      ans.textContent = "No solution";
      note.textContent = "Because 0x + b cannot equal c.";
    }
    return;
  }

  const x = (c - b) / a;
  ans.textContent = `x = ${Number(x.toFixed(10))}`;
  note.textContent = `Computed from x = (c − b) / a.`;
});

document.getElementById("solveQuad").addEventListener("click", () => {
  const a = num(document.getElementById("qa").value);
  const b = num(document.getElementById("qb").value);
  const c = num(document.getElementById("qc").value);

  const out = document.getElementById("quadOut");
  const ans = document.getElementById("quadAns");
  const note = document.getElementById("quadNote");

  out.hidden = false;

  if (![a,b,c].every(Number.isFinite)){
    ans.textContent = "Error";
    note.textContent = "Enter valid numbers for a, b, and c.";
    return;
  }

  if (a === 0){
    ans.textContent = "Not quadratic";
    note.textContent = "a must be non-zero for a quadratic. Use the linear solver above.";
    return;
  }

  const D = b*b - 4*a*c;

  if (D < 0){
    const real = (-b) / (2*a);
    const imag = Math.sqrt(-D) / (2*a);
    ans.textContent = `x = ${Number(real.toFixed(10))} ± ${Number(imag.toFixed(10))}i`;
    note.textContent = "Discriminant is negative (complex roots).";
    return;
  }

  const sqrtD = Math.sqrt(D);
  const x1 = (-b + sqrtD) / (2*a);
  const x2 = (-b - sqrtD) / (2*a);

  if (Math.abs(x1 - x2) < 1e-12){
    ans.textContent = `x = ${Number(x1.toFixed(10))} (double root)`;
    note.textContent = "Discriminant is zero.";
  } else {
    ans.textContent = `x₁ = ${Number(x1.toFixed(10))},  x₂ = ${Number(x2.toFixed(10))}`;
    note.textContent = "Computed using the quadratic formula.";
  }
});
