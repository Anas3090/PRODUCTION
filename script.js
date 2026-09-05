// Save data from form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dataForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const entry = {
        workDate: document.getElementById("workDate").value,
        co186: document.getElementById("co186").value || 0,
        co252: document.getElementById("co252").value || 0,
        c210: document.getElementById("c210").value || 0,
        c18626: document.getElementById("c18626").value || 0,
        anthem: document.getElementById("anthem").value || 0,
        humana: document.getElementById("humana").value || 0,
        uhc: document.getElementById("uhc").value || 0,
        roi: document.getElementById("roi").value || 0,
      };
      const total = Object.values(entry).slice(1).reduce((a,b)=>a+Number(b),0);
      entry.total = total;
      entry.status = total >= 64 ? "✅" : "❌";
      entry.percent = total ? ((total/64)*100).toFixed(2) + "%" : "";

      const data = JSON.parse(localStorage.getItem("productionData") || "[]");
      data.push(entry);
      localStorage.setItem("productionData", JSON.stringify(data));
      alert("Data saved successfully!");
      form.reset();
    });
  }

  // Load data in dashboard
  const tableBody = document.getElementById("dataRows");
  if (tableBody) {
    const data = JSON.parse(localStorage.getItem("productionData") || "[]");
    let totalSum = 0, percentSum = 0;
    data.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.workDate}</td>
        <td>${row.co186}</td>
        <td>${row.co252}</td>
        <td>${row.c210}</td>
        <td>${row.c18626}</td>
        <td>${row.anthem}</td>
        <td>${row.humana}</td>
        <td>${row.uhc}</td>
        <td>${row.roi}</td>
        <td>${row.total}</td>
        <td>${row.status}</td>
        <td>${row.percent}</td>
      `;
      tableBody.appendChild(tr);
      totalSum += row.total;
      percentSum += parseFloat(row.percent) || 0;
    });
    document.getElementById("totalSum").textContent = totalSum;
    document.getElementById("avgPercent").textContent = (percentSum/data.length).toFixed(2) + "%";
  }
});
