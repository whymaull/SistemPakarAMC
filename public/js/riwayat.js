document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("riwayatTableBody");

  fetch("https://gg0l3mpr-3000.asse.devtunnels.ms/api/riwayat")
    .then(res => res.json())
    .then(data => {
      data.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="px-6 py-4 text-sm">${index + 1}</td>
          <td class="px-6 py-4 text-sm">${new Date(item.waktu).toLocaleString()}</td>
          <td class="px-6 py-4 text-sm">${item.gejala}</td>
          <td class="px-6 py-4 text-sm">${item.diagnosis}</td>
        `;
        tbody.appendChild(tr);
      });
    });
});
