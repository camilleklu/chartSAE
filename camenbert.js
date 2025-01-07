fetch("results.json")
  .then((response) => response.json())
  .then((json) => {
    const table = json.find(
      (item) => item.type === "table" && item.name === "results"
    );
    const data = table.data;

    const statusCounts = data.reduce((acc, item) => {
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

    const ctx = document.getElementById("canvas3").getContext("2d");

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Pourcentage des Statuts",
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
          legend: {
            position: "top",
          },
        },
      },
    });
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des données JSON :", error)
  );
