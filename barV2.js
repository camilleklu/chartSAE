fetch("results.json")
  .then((response) => response.json())
  .then((json) => {
    const table = json.find(
      (item) => item.type === "table" && item.name === "results"
    );
    const data = table.data;

    const groupedData = data.reduce((acc, item) => {
      if (acc[item.name]) {
        acc[item.name].nb_variables += parseInt(item.nb_variables);
      } else {
        acc[item.name] = {
          nb_variables: parseInt(item.nb_variables),
        };
      }
      return acc;
    }, {});

    const labels = Object.keys(groupedData);

    labels.sort((a, b) => a.localeCompare(b));

    const nbVariablesDataset = labels.map(
      (name) => groupedData[name].nb_variables
    );

    const ctx2 = document.getElementById("canvas2").getContext("2d");

    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Nombre de variables",
            data: nbVariablesDataset,
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
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
