document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("diagnosisForm");
  const resultBox = document.getElementById("resultBox");
  const resultText = document.getElementById("resultText");

  // Fetch gejala
  fetch("https://gg0l3mpr-3000.asse.devtunnels.msapi/gejala")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("gejalaList");
      data.forEach(gejala => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `gejala-${gejala.id}`;
        checkbox.value = gejala.id;
        checkbox.classList.add("gejala-item");

        const label = document.createElement("label");
        label.htmlFor = `gejala-${gejala.id}`;
        label.textContent = gejala.nama;
        label.classList.add("block", "mb-2");

        const wrapper = document.createElement("div");
        wrapper.classList.add("mb-2");
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
      });
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const checked = Array.from(document.querySelectorAll(".gejala-item"))
      .filter(cb => cb.checked)
      .map(cb => parseInt(cb.value));

    fetch("https://gg0l3mpr-3000.asse.devtunnels.msapi/rulebase")
      .then(res => res.json())
      .then(rules => {
        const grouped = {};

        rules.forEach(rule => {
          if (!grouped[rule.diagnosis_id]) grouped[rule.diagnosis_id] = [];
          grouped[rule.diagnosis_id].push(rule.gejala_id);
        });

        let bestMatch = null;
        let bestMatchCount = 0;

        Object.entries(grouped).forEach(([diagnosis_id, rule_gejala]) => {
          const matchCount = rule_gejala.filter(id => checked.includes(id)).length;
          if (matchCount > bestMatchCount && matchCount === rule_gejala.length) {
            bestMatch = diagnosis_id;
            bestMatchCount = matchCount;
          }
        });

        if (bestMatch) {
          fetch(`https://gg0l3mpr-3000.asse.devtunnels.msapi/diagnosis`)
            .then(res => res.json())
            .then(diagnosisList => {
              const found = diagnosisList.find(d => d.id == bestMatch);
              resultText.innerHTML = `<strong>${found.nama}</strong><br>${found.saran}`;

              // Simpan riwayat
              fetch("https://gg0l3mpr-3000.asse.devtunnels.msapi/riwayat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  gejala: checked.join(","),
                  diagnosis_id: found.id
                })
              });

              resultBox.classList.remove("hidden");
            });
        } else {
          resultText.textContent = "Tidak ditemukan diagnosa yang sesuai.";
          resultBox.classList.remove("hidden");
        }
      });
  });
});
