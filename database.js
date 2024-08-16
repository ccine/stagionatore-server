import Database from "better-sqlite3";
const db = new Database("../chamberData.db");

// Creazione della tabella se non esiste
db.exec(`
    CREATE TABLE IF NOT EXISTS ChamberStatus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        temperatureUp REAL,
        temperatureDown REAL,
        humidityUp INTEGER,
        humidityDown INTEGER,
        targetTemperature REAL,
        targetHumidity INTEGER,
        cooling BOOLEAN,
        heating BOOLEAN,
        fan BOOLEAN,
        dehumidifier BOOLEAN,
        humidifier BOOLEAN
    )
`);

// Funzione per salvare lo stato della camera
export function saveChamberStatus(status) {
  const {
    temperatureUp,
    temperatureDown,
    humidityUp,
    humidityDown,
    targetTemperature,
    targetHumidity,
    cooling,
    heating,
    fan,
    dehumidifier,
    humidifier,
  } = status;

  const stmt = db.prepare(`
        INSERT INTO ChamberStatus (
            temperatureUp, temperatureDown,
            humidityUp, humidityDown,
            targetTemperature, targetHumidity,
            cooling, heating, fan,
            dehumidifier, humidifier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

  stmt.run(
    temperatureUp,
    temperatureDown,
    humidityUp,
    humidityDown,
    targetTemperature,
    targetHumidity,
    cooling,
    heating,
    fan,
    dehumidifier,
    humidifier
  );
}

// Funzione per ottenere l'ultimo valore del sensore
export function getChamberStatus() {
  const stmt = db.prepare(`
        SELECT * FROM ChamberStatus ORDER BY timestamp DESC LIMIT 1
    `);
  return stmt.get();
}

// Funzione per ottenere i dati storici
export function getHistoricalData() {
  const stmt = db.prepare(`
        SELECT * FROM ChamberStatus ORDER BY timestamp DESC
    `);
  return stmt.all();
}
