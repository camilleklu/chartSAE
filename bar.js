fetch("results.json")
  .then((response) => response.json())
  .then((json) => {
    const table = json.find(
      (item) => item.type === "table" && item.name === "results"
    );
    const data = table.data;

    const groupedData = data.reduce((acc, item) => {
      if (acc[item.name]) {
        acc[item.name] += parseFloat(item.time);
      } else {
        acc[item.name] = parseFloat(item.time);
      }
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const dataset = labels.map((name) => groupedData[name]);

    labels.sort((a, b) => a.localeCompare(b));

    const sortedDataset = labels.map((name) => groupedData[name]);

    const ctx = document.getElementById("canvas1").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Temps d'exécution (en secondes)",
            data: sortedDataset,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des données JSON :", error)
  );
