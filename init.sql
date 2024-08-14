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
);
