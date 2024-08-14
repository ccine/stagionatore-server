document.addEventListener("DOMContentLoaded", function () {
  const historicalChart = document.getElementById("historicalChart");
  const dataTableBody = document.getElementById("data-table-body");
  let allData = []; // Array to store all the data
  let chart; // Chart instance

  // Fetch all historical data on page load
  fetch("/historical-data")
    .then((response) => response.json())
    .then((data) => {
      allData = data;
      renderChart(allData);
      populateTable(allData);
    });

  // Function to render the chart with the provided data
  function renderChart(data) {
    const labels = data.map((entry) => entry.timestamp);
    const temperatureUpData = data.map((entry) => entry.temperatureUp);
    const temperatureDownData = data.map((entry) => entry.temperatureDown);
    const humidityUpData = data.map((entry) => entry.humidityUp);
    const humidityDownData = data.map((entry) => entry.humidityDown);
    //const coolingData = data.map((entry) => (entry.cooling ? 1 : 0));
    //const heatingData = data.map((entry) => (entry.heating ? 1 : 0));
    //const fanData = data.map((entry) => (entry.fan ? 1 : 0));

    if (chart) {
      chart.destroy();
    }

    chart = new Chart(historicalChart, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Temperatura Superiore (°C)",
            data: temperatureUpData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: false,
          },
          {
            label: "Temperatura Inferiore (°C)",
            data: temperatureDownData,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
          },
          {
            label: "Umidità Superiore (%)",
            data: humidityUpData,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: false,
          },
          {
            label: "Umidità Inferiore (%)",
            data: humidityDownData,
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            text: "Grafico storico",
            display: true,
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "minute",
              displayFormats: {
                minute: "HH:mm",
              },
            },
            ticks: { source: "auto" },
            title: {
              display: true,
              text: "Data",
            },
          },
          y: {
            title: {
              display: true,
              text: "Valore",
            },
          },
        },
      },
    });
  }

  // Function to populate the table with the provided data
  function populateTable(data) {
    dataTableBody.innerHTML = ""; // Clear existing table data

    data.forEach((entry) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
                <td>${entry.temperatureUp}</td>
                <td>${entry.temperatureDown}</td>
                <td>${entry.humidityUp}</td>
                <td>${entry.humidityDown}</td>
                <td>${entry.cooling ? "Attivo" : "Inattivo"}</td>
                <td>${entry.heating ? "Attivo" : "Inattivo"}</td>
                <td>${entry.fan ? "Attivo" : "Inattivo"}</td>
                <td>${entry.dehumidifier ? "Attivo" : "Inattivo"}</td>
                <td>${entry.humidifier ? "Attivo" : "Inattivo"}</td>
            `;

      dataTableBody.appendChild(row);
    });
  }

  // Event listener for the filter button
  document.getElementById("filter-btn").addEventListener("click", function () {
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);

    const filteredData = allData.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });

    renderChart(filteredData);
    populateTable(filteredData);
  });

  // Event listener for the clear filter button
  document.getElementById("clear-btn").addEventListener("click", function () {
    renderChart(allData);
    populateTable(allData);
  });
});
