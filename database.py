import sqlite3

# Connessione al database
def get_db_connection():
    conn = sqlite3.connect('../chamberData.db')
    conn.row_factory = sqlite3.Row
    return conn

# Creazione della tabella se non esiste
conn = get_db_connection()
conn.execute('''
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
''')
conn.commit()
conn.close()

# Funzione per salvare lo stato della camera
def save_chamber_status(status):
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO ChamberStatus (
            temperatureUp, temperatureDown,
            humidityUp, humidityDown,
            targetTemperature, targetHumidity,
            cooling, heating, fan,
            dehumidifier, humidifier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        status["temperatureUp"],
        status["temperatureDown"],
        status["humidityUp"],
        status["humidityDown"],
        status["targetTemperature"],
        status["targetHumidity"],
        status["cooling"],
        status["heating"],
        status["fan"],
        status["dehumidifier"],
        status["humidifier"]
    ))
    conn.commit()
    conn.close()

# Funzione per ottenere l'ultimo valore del sensore
def get_chamber_status():
    conn = get_db_connection()
    status = conn.execute('''
        SELECT * FROM ChamberStatus ORDER BY timestamp DESC LIMIT 1
    ''').fetchone()
    conn.close()
    return dict(status) if status else None

# Funzione per ottenere i dati storici
def get_historical_data():
    conn = get_db_connection()
    data = conn.execute('''
        SELECT * FROM ChamberStatus ORDER BY timestamp DESC
    ''').fetchall()
    conn.close()
    return [dict(row) for row in data]
