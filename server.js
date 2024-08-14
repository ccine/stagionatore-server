import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { getHistoricalData, saveChamberStatus } from "./database.js";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.json());

// Indirizzo Arduino
const arduinoUrl = "http://192.168.0.251/";

// Funzione per ottenere i valori attuali dall'Arduino
async function getCurrentValuesFromArduino() {
  try {
    const response = await fetch(arduinoUrl + "status");
    const data = await response.json();
    return {
      temperatureUp: data.temperatureUp,
      humidityUp: data.humidityUp,
      temperatureDown: data.temperatureDown,
      humidityDown: data.humidityDown,
      targetTemperature: data.targetTemperature,
      targetHumidity: data.targetHumidity,
      cooling: data.cooling,
      heating: data.heating,
      fan: data.fan,
      dehumidifier: data.dehumidifier,
      humidifier: data.humidifier,
      isRunning: data.isRunning,
    };
  } catch (error) {
    console.error("Error getting current values from Arduino:", error);
    return null;
  }
}

// Avvio programma automatico
app.post("/start-program", async (req, res) => {
  await sendCommandToArduino("startAuto");
  res.json({ message: "Program started" });
});

// Avvio manuale
app.post("/start-manual", async (req, res) => {
  const { targetTemperature, targetHumidity } = req.body;
  await sendCommandToArduino("startManual", {
    targetTemperature,
    targetHumidity,
  });
  res.json({ message: "Manual mode started" });
});

// Stop stagionatore
app.post("/stop", async (req, res) => {
  await sendCommandToArduino("stop");
  res.json({ message: "Chamber stopped" });
});

// Lettura valori attuali dall'Arduino
app.get("/current-values", async (req, res) => {
  const currentValues = await getCurrentValuesFromArduino();
  if (currentValues) {
    res.json(currentValues);
  } else {
    res.status(500).json({ error: "Could not retrieve current values" });
  }
});

// Lettura valori storici dal database
app.get("/historical-data", async (req, res) => {
  const historicalData = await getHistoricalData();
  res.json(historicalData);
});

// Funzione per inviare comandi ad Arduino tramite richiesta GET
async function sendCommandToArduino(command, data = {}) {
  try {
    // Costruisci l'URL con i parametri di query
    const queryParams = new URLSearchParams({ command, ...data });
    const url = `${arduinoUrl}command?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (response.ok) {
      return await response.text();
    } else {
      console.error(
        `Errore nell'invio del comando ${command}:`,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Errore nella comunicazione con Arduino:", error);
  }
}

// Avvio del server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Funzione per raccogliere i dati dallo stagionatore e salvarli nel database
async function collectSensorData() {
  try {
    const data = await getCurrentValuesFromArduino();
    if (data && data.isRunning) {
      await saveChamberStatus(data);
      console.log("Data saved:", data);
    }
  } catch (error) {
    console.error("Error collecting sensor data:", error);
  }
}

// Intervallo per raccogliere dati ogni 5 minuti
setInterval(collectSensorData, 5 * 60 * 1000);
