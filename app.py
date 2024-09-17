from flask import Flask, jsonify, request, send_from_directory
import requests
from database import get_historical_data, save_chamber_status
from apscheduler.schedulers.background import BackgroundScheduler
import os
from database import get_historical_data, save_chamber_status  # Importa le funzioni dal file database.py

app = Flask(__name__, static_folder="public")

arduino_url = "http://192.168.0.251/"

# Endpoint per servire la pagina principale
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# Endpoint per altri file statici (come HTML o JS)
@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)

# Funzione per ottenere i valori attuali dall'Arduino
def get_current_values_from_arduino():
    try:
        response = requests.get(f"{arduino_url}status")
        data = response.json()
        return {
            "temperatureUp": data["temperatureUp"],
            "humidityUp": data["humidityUp"],
            "temperatureDown": data["temperatureDown"],
            "humidityDown": data["humidityDown"],
            "targetTemperature": data["targetTemperature"],
            "targetHumidity": data["targetHumidity"],
            "cooling": data["cooling"],
            "heating": data["heating"],
            "fan": data["fan"],
            "dehumidifier": data["dehumidifier"],
            "humidifier": data["humidifier"],
            "isRunning": data["isRunning"],
        }
    except Exception as e:
        print(f"Error getting current values from Arduino: {e}")
        return None

# Avvio programma automatico
@app.route('/start-program', methods=['POST'])
def start_program():
    send_command_to_arduino("startAuto")
    return jsonify({"message": "Program started"})

# Avvio manuale
@app.route('/start-manual', methods=['POST'])
def start_manual():
    data = request.json
    send_command_to_arduino("startManual", data)
    return jsonify({"message": "Manual mode started"})

# Stop stagionatore
@app.route('/stop', methods=['POST'])
def stop():
    send_command_to_arduino("stop")
    return jsonify({"message": "Chamber stopped"})

# Lettura valori attuali dall'Arduino
@app.route('/current-values', methods=['GET'])
def current_values():
    current_values = get_current_values_from_arduino()
    if current_values:
        return jsonify(current_values)
    else:
        return jsonify({"error": "Could not retrieve current values"}), 500

# Lettura valori storici dal database
@app.route('/historical-data', methods=['GET'])
def historical_data():
    data = get_historical_data()
    return jsonify(data)

# Funzione per inviare comandi ad Arduino tramite richiesta GET
def send_command_to_arduino(command, data=None):
    try:
        params = {"command": command}
        if data:
            params.update(data)
        response = requests.get(f"{arduino_url}command", params=params)
        if response.ok:
            return response.text
        else:
            print(f"Error sending command {command}: {response.text}")
    except Exception as e:
        print(f"Error communicating with Arduino: {e}")

# Funzione per raccogliere i dati dallo stagionatore e salvarli nel database
def collect_sensor_data():
    try:
        data = get_current_values_from_arduino()
        if data and data["isRunning"]:
            save_chamber_status(data)
            print("Data saved:", data)
    except Exception as e:
        print(f"Error collecting sensor data: {e}")

# Avvio del server
if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=collect_sensor_data, trigger="interval", minutes=5)
    scheduler.start()
    app.run(host='0.0.0.0', port=3000)
