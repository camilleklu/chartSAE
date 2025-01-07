fetch("results.json")
  .then((response) => response.json())
  .then((json) => {
    const table = json.find(
      (item) => item.type === "table" && item.name === "results"
    );
    const data = table.data;

    // Regrouper les données par nom et additionner les nb_variables
    const groupedData = data.reduce((acc, item) => {
      if (acc[item.name]) {
        // Ajouter le nombre de variables à l'existant
        acc[item.name].nb_variables += parseInt(item.nb_variables);
      } else {
        // Initialiser avec nb_variables
        acc[item.name] = {
          nb_variables: parseInt(item.nb_variables),
        };
      }
      return acc;
    }, {});

    // Convertir l'objet en tableau pour pouvoir l'utiliser dans le graphique
    const labels = Object.keys(groupedData);

    // Trier les données par nom
    labels.sort((a, b) => a.localeCompare(b));

    // Préparer le dataset pour le graphique
    const nbVariablesDataset = labels.map(
      (name) => groupedData[name].nb_variables
    );

    const ctx2 = document.getElementById("canvas2").getContext("2d");

    // Deuxième graphique : Nombre de variables
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
