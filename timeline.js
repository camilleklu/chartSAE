fetch("results.json")
  .then((response) => response.json())
  .then((json) => {
    // Extraire l'objet contenant "data"
    const table = json.find(
      (item) => item.type === "table" && item.name === "results"
    );
    const data = table.data;

    // Regrouper les données par nom
    const groupedData = {};

    data.forEach((item) => {
      const name = item.name;
      if (!groupedData[name]) {
        groupedData[name] = { times: [], nbVariables: [] };
      }
      groupedData[name].times.push(item.time);
      groupedData[name].nbVariables.push(item.nb_variables);
    });

    // Ajouter les options dans le select
    const nameSelect = document.getElementById("nameSelect");
    Object.keys(groupedData).forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      nameSelect.appendChild(option);
    });

    // Fonction pour trier les données et mettre à jour le graphique
    function updateChart(name) {
      let { times, nbVariables } = groupedData[name];

      // Trier les données en fonction du nombre de variables (axe X)
      const sortedData = nbVariables
        .map((nbVar, index) => [nbVar, times[index]]) // Créer des paires [nbVariables, times]
        .sort((a, b) => a[0] - b[0]); // Trier par nbVariables (axe X)

      // Extraire les données triées
      nbVariables = sortedData.map((item) => item[0]);
      times = sortedData.map((item) => item[1]);

      const ctx = document.getElementById("canvas").getContext("2d");

      // Effacer le graphique existant si nécessaire
      if (window.myChart) {
        window.myChart.destroy();
      }

      // Créer un nouveau graphique avec les données triées
      window.myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: nbVariables, // Nombre de variables sur l'axe X
          datasets: [
            {
              label: `Time for ${name}`,
              data: times, // Temps sur l'axe Y
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: { display: true, text: "Nb Variables" }, // Titre de l'axe X
            },
            y: {
              title: { display: true, text: "Time" }, // Titre de l'axe Y
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Écouter les changements dans le select et mettre à jour le graphique
    nameSelect.addEventListener("change", (event) => {
      const selectedName = event.target.value;
      if (selectedName) {
        updateChart(selectedName);
      }
    });
  });
