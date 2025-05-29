document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("ruleTableBody");

  fetch("http://localhost:3000/api/rulebase")
    .then(res => res.json())
    .then(data => {
      data.forEach((rule, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="px-6 py-4 text-sm">${index + 1}</td>
          <td class="px-6 py-4 text-sm">${rule.nama_gejala}</td>
          <td class="px-6 py-4 text-sm">${rule.nama_diagnosis}</td>
        `;
        tbody.appendChild(tr);
      });
    });
});
