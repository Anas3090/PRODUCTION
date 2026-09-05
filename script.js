<!-- Firebase App (core SDK) -->
<script type="module">
  // Import Firebase SDKs
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
  import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

  // Your Firebase config snippet (from Firebase Console)
  const firebaseConfig = {
    apiKey: "AIzaSyALgzflHBREiKYAhy0HEcZR19gd1CJMBEQ",
    authDomain: "production-sheet-b5c65.firebaseapp.com",
    databaseURL: "https://production-sheet-b5c65-default-rtdb.firebaseio.com",
    projectId: "production-sheet-b5c65",
    storageBucket: "production-sheet-b5c65.appspot.com",
    messagingSenderId: "1088797956054",
    appId: "1:1088797956054:web:1f5397850eac7ad40f3677"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // Example: Save data
  function saveData(name, value) {
    set(ref(db, 'productionData/' + Date.now()), {
      name: name,
      value: value
    });
  }

  // Example: Load data
  function loadData() {
    const dbRef = ref(db);
    get(child(dbRef, 'productionData')).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    });
  }
</script>


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

      const data = JSON.parse(loadData("productionData") || "[]");
      data.push(entry);
      saveData("productionData", JSON.stringify(data));
      alert("Data saved successfully!");
      form.reset();
    });
  }

  // Load data in dashboard
  const tableBody = document.getElementById("dataRows");
  if (tableBody) {
    const data = JSON.parse(loadData("productionData") || "[]");
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
