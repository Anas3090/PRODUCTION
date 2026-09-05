document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dataForm");

  // ✅ Step 1: Replace localStorage Save Logic
  async function saveToGoogleSheet(entry) {
    const SHEET_ID = "1n9WnRrAohbm7Uc1skG5DiE-yGHE-h4DpuXkmbg52PzE";   // from your sheet URL
    const API_KEY = "AIzaSyBgxhckOCJy3xbdEFgbZVtJ20KY9GTtX0w";     // from Google Cloud Console
    const range = "Sheet1!B2:M2";         // adjust based on your sheet columns

    const values = [[
      entry.workDate, entry.co186, entry.co252, entry.c210, entry.c18626,
      entry.anthem, entry.humana, entry.uhc, entry.roi,
      entry.total, entry.status, entry.percent
    ]];

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1n9WnRrAohbm7Uc1skG5DiE-yGHE-h4DpuXkmbg52PzE/values/Sheet1!B2:M2:append?valueInputOption=USER_ENTERED&key=AIzaSyBgxhckOCJy3xbdEFgbZVtJ20KY9GTtX0w`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values })
      }
    );

    alert("Data saved to Google Sheets!");
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
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

      await saveToGoogleSheet(entry);
      form.reset();
    });
  }

  // ✅ Step 2: Replace Dashboard Load Logic
  async function loadData() {
    const SHEET_ID = "1n9WnRrAohbm7Uc1skG5DiE-yGHE-h4DpuXkmbg52PzE";
    const API_KEY = "AIzaSyBgxhckOCJy3xbdEFgbZVtJ20KY9GTtX0w";
    const range = "Sheet1!B2:M2";

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1n9WnRrAohbm7Uc1skG5DiE-yGHE-h4DpuXkmbg52PzE/values/Sheet1!B2:M2?key=AIzaSyBgxhckOCJy3xbdEFgbZVtJ20KY9GTtX0w`
    );
    const data = await res.json();
    const rows = data.values || [];

    const tableBody = document.getElementById("dataRows");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    let totalSum = 0, percentSum = 0;

    rows.slice(1).forEach(row => { // skip header row
      const tr = document.createElement("tr");
      tr.innerHTML = row.map(val => `<td>${val}</td>`).join("");
      tableBody.appendChild(tr);

      totalSum += Number(row[9]) || 0;     // TOTAL column
      percentSum += parseFloat(row[11]) || 0; // PERCENT column
    });

    document.getElementById("totalSum").textContent = totalSum;
    document.getElementById("avgPercent").textContent = (percentSum/rows.length).toFixed(2) + "%";
  }

  loadData(); // run when dashboard loads
});
