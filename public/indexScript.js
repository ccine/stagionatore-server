// Funzione per aggiornare l'interfaccia utente in base ai valori ricevuti
function updateUI(data) {
  const {
    temperatureUp,
    humidityUp,
    temperatureDown,
    humidityDown,
    targetTemperature,
    targetHumidity,
    cooling,
    heating,
    fan,
    dehumidifier,
    humidifier,
    isRunning
  } = data;

  // Aggiorna i valori attuali
  document.getElementById("temp-alto").textContent = `${temperatureUp}°C`;
  document.getElementById("umid-alto").textContent = `${humidityUp}%`;
  document.getElementById("temp-basso").textContent = `${temperatureDown}°C`;
  document.getElementById("umid-basso").textContent = `${humidityDown}%`;

  if (isRunning) {
    // Mostra i controlli e aggiorna lo stato dei dispositivi
    document.getElementById("controlli-stagionatore").style.display = "block";
    document.getElementById("form-stagionatura").style.display = "none";

    document.getElementById("status").textContent = "Acceso";
    document.getElementById("stato-stagionatore").classList.add("alert-success");
    document.getElementById("stato-stagionatore").classList.remove("alert-danger");

    document.getElementById("temp-impostata").textContent = `${targetTemperature}°C`;
    document.getElementById("umid-impostata").textContent = `${targetHumidity}%`;

    document.getElementById("fan-status").textContent = fan ? "Acceso" : "Spento";
    document.getElementById("fan-status").classList.toggle("text-success", fan);
    document.getElementById("fan-status").classList.toggle("text-danger", !fan);

    document.getElementById("heating-status").textContent = heating ? "Acceso" : "Spento";
    document.getElementById("heating-status").classList.toggle("text-success", heating);
    document.getElementById("heating-status").classList.toggle("text-danger", !heating);

    document.getElementById("cooling-status").textContent = cooling ? "Acceso" : "Spento";
    document.getElementById("cooling-status").classList.toggle("text-success", cooling);
    document.getElementById("cooling-status").classList.toggle("text-danger", !cooling);

    document.getElementById("humidifier-status").textContent = humidifier ? "Acceso" : "Spento";
    document.getElementById("humidifier-status").classList.toggle("text-success", humidifier);
    document.getElementById("humidifier-status").classList.toggle("text-danger", !humidifier);

    document.getElementById("dehumidifier-status").textContent = dehumidifier ? "Acceso" : "Spento";
    document.getElementById("dehumidifier-status").classList.toggle("text-success", dehumidifier);
    document.getElementById("dehumidifier-status").classList.toggle("text-danger", !dehumidifier);
  } else {
    // Mostra il form per l'avvio manuale
    document.getElementById("controlli-stagionatore").style.display = "none";
    document.getElementById("form-stagionatura").style.display = "block";

    document.getElementById("status").textContent = "Spento";
    document.getElementById("stato-stagionatore").classList.add("alert-danger");
    document.getElementById("stato-stagionatore").classList.remove("alert-success");
  }
}

// Funzione per ottenere i valori attuali dall'API
async function fetchCurrentValues() {
  try {
    const response = await fetch("/current-values");
    const data = await response.json();
    updateUI(data);
  } catch (error) {
    console.error("Error fetching current values:", error);
  }
}

// Event listener per avvio manuale
document.getElementById("manual-start-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const targetTemperature = document.getElementById("temp-set").value;
  const targetHumidity = document.getElementById("umid-set").value;

  try {
    const response = await fetch("/start-manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetTemperature, targetHumidity })
    });

    if (response.ok) {
      fetchCurrentValues(); // Aggiorna lo stato dell'interfaccia
    }
  } catch (error) {
    console.error("Error starting manual mode:", error);
  }
});

// Event listener per avvio automatico
document.getElementById("start-auto-btn").addEventListener("click", async () => {
  try {
    const response = await fetch("/start-program", { method: "POST" });
    if (response.ok) {
      fetchCurrentValues(); // Aggiorna lo stato dell'interfaccia
    }
  } catch (error) {
    console.error("Error starting program:", error);
  }
});

// Event listener per fermare lo stagionatore
document.getElementById("stop-btn").addEventListener("click", async () => {
  try {
    const response = await fetch("/stop", { method: "POST" });
    if (response.ok) {
      fetchCurrentValues(); // Aggiorna lo stato dell'interfaccia
    }
  } catch (error) {
    console.error("Error stopping chamber:", error);
  }
});

// Richiama i valori attuali al caricamento della pagina
fetchCurrentValues();
