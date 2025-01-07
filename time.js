fetch("results.json")
  .then((response) => response.json())
  .then((json) => {
    const table = json.find(
      (item) => item.type === "table" && item.name === "results"
    );
    const data = table.data;

    const groupedData = {};
    data.forEach((item) => {
      const name = item.name;
      if (!groupedData[name]) {
        groupedData[name] = [];
      }
      groupedData[name].push(item);
    });

    const nameSelect = document.getElementById("nameSelect");
    Object.keys(groupedData).forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      nameSelect.appendChild(option);
    });

    function updateLineChart(name) {
      const nameData = groupedData[name];

      const sortedData = nameData
        .map((item) => [parseInt(item.nb_variables), parseFloat(item.time)])
        .sort((a, b) => a[0] - b[0]);

      const nbVariables = sortedData.map((item) => item[0]);
      const times = sortedData.map((item) => item[1]);

      const ctx = document.getElementById("canvas").getContext("2d");

      if (window.myLineChart) {
        window.myLineChart.data.labels = nbVariables;
        window.myLineChart.data.datasets[0].data = times;
        window.myLineChart.update();
      } else {
        window.myLineChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: nbVariables,
            datasets: [
              {
                label: `Temps pour ${name}`,
                data: times,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
              },
            ],
          },
          options: {
            scales: {
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: "Nombre de Variables",
                  },
                },
              ],
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: "Temps (s)",
                  },
                },
              ],
            },
          },
        });
      }
    }

    function updatePieChart(name) {
      const nameData = groupedData[name];

      const statusCounts = nameData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(statusCounts).reduce(
        (sum, count) => sum + count,
        0
      );

      const labels = Object.keys(statusCounts);
      const percentages = Object.values(statusCounts).map(
        (count) => (count / total) * 100
      );

      const ctx = document.getElementById("canvas4").getContext("2d");

      if (window.myPieChart) {
        window.myPieChart.data.labels = labels;
        window.myPieChart.data.datasets[0].data = percentages;
        window.myPieChart.update();
      } else {
        window.myPieChart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                label: `Status Distribution for ${name}`,
                data: percentages,
                backgroundColor: [
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                ],
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(54, 162, 235, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
          },
        });
      }
    }

    nameSelect.addEventListener("change", (event) => {
      const selectedName = event.target.value;
      if (selectedName) {
        updateLineChart(selectedName);
        updatePieChart(selectedName);
      }
    });
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des données JSON :", error)
  );
