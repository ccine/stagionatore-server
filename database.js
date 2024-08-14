const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('chamberData.db');

// Creazione della tabella se non esiste
db.serialize(() => {
    db.run(`
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
});

// Funzione per salvare lo stato della camera
function saveChamberStatus(status) {
    return new Promise((resolve, reject) => {
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
            humidifier
        } = status;

        db.run(
            `INSERT INTO ChamberStatus (
                temperatureUp, temperatureDown,
                humidityUp, humidityDown,
                targetTemperature, targetHumidity,
                cooling, heating, fan,
                dehumidifier, humidifier
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                temperatureUp, temperatureDown,
                humidityUp, humidityDown,
                targetTemperature, targetHumidity,
                cooling, heating, fan,
                dehumidifier, humidifier
            ],
            function (err) {
                if (err) return reject(err);
                resolve();
            }
        );
    });
}

// Funzione per ottenere l'ultimo valore del sensore
function getChamberStatus() {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM ChamberStatus ORDER BY timestamp DESC LIMIT 1', (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

// Funzione per ottenere i dati storici
function getHistoricalData() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM ChamberStatus ORDER BY timestamp DESC', (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

module.exports = {
    getChamberStatus,
    getHistoricalData,
    saveChamberStatus
};
