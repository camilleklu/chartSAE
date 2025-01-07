// Charger le fichier JSON
fetch("results.json")
  .then((response) => response.json()) // Convertir la réponse en JSON
  .then((json) => {
    // Extraire l'objet contenant "data"
    const table = json.find(
      (item) => item.type === "table" && item.name === "results"
    );
    const data = table.data; // Données de la table "results"

    // Préparer les données pour le graphique
    const labels = data.map((item) => item.name); // Utiliser les noms pour les labels
    const dataset = data.map((item) => parseFloat(item.time)); // Temps converti en nombres

    // Sélectionner le canvas du HTML
    const ctx = document.querySelector("canvas").getContext("2d");

    // Créer le graphique
    new Chart(ctx, {
      type: "bar", // Type de graphique (barre)
      data: {
        labels: labels, // Labels pour l'axe X
        datasets: [
          {
            label: "Temps d'exécution (en secondes)", // Légende
            data: dataset, // Données pour l'axe Y
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Couleur de fond
            borderColor: "rgba(75, 192, 192, 1)", // Couleur des bordures
            borderWidth: 1, // Épaisseur des bordures
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true, // Commencer à zéro sur l'axe Y
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
