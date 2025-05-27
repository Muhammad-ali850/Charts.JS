let charts = [];

function showPage(id) {
  document.querySelectorAll(".page").forEach(page => page.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function clearCharts() {
  charts = [];
  ['bar-charts', 'pie-charts', 'doughnut-charts', 'radar-charts'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });
}

document.getElementById("csvFile").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const text = event.target.result;
    const rows = text.trim().split(/\r?\n/).map(r => r.split(','));
    const headers = rows[0];
    const data = {};

    headers.forEach(h => data[h] = {});

    for (let i = 1; i < rows.length; i++) {
      rows[i].forEach((val, idx) => {
        const col = headers[idx];
        if (!data[col][val]) data[col][val] = 0;
        data[col][val]++;
      });
    }

    clearCharts();

    headers.forEach(header => {
      const labels = Object.keys(data[header]);
      const counts = Object.values(data[header]);
      const colors = labels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));

      // Bar
      const barCanvas = document.createElement('canvas');
      document.getElementById('bar-charts').appendChild(barCanvas);
      charts.push(new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: header,
            data: counts,
            backgroundColor: colors,
          }]
        }
      }));

      // Pie
      const pieCanvas = document.createElement('canvas');
      document.getElementById('pie-charts').appendChild(pieCanvas);
      charts.push(new Chart(pieCanvas, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: header,
            data: counts,
            backgroundColor: colors,
          }]
        }
      }));

      // Doughnut
      const doughnutCanvas = document.createElement('canvas');
      document.getElementById('doughnut-charts').appendChild(doughnutCanvas);
      charts.push(new Chart(doughnutCanvas, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: header,
            data: counts,
            backgroundColor: colors,
          }]
        }
      }));

      // Radar
      const radarCanvas = document.createElement('canvas');
      document.getElementById('radar-charts').appendChild(radarCanvas);
      charts.push(new Chart(radarCanvas, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: header,
            data: counts,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            pointBackgroundColor: colors,
          }]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true
            }
          }
        }
      }));
    });
  };

  reader.readAsText(file);
});
