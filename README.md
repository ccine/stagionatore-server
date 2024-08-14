# Stagionatore Server

This server is designed to control and monitor the operations of a meat curing chamber. It communicates with an Arduino device that manages the chamber's environment (temperature, humidity, etc.) and provides a web interface for users to start, stop, and monitor the curing process.

## Features

- **Manual and Automatic Control:** Start the curing process manually by setting temperature and humidity or automatically based on predefined settings.
- **Real-time Monitoring:** Monitor the current state of the chamber, including sensor readings and relay statuses.
- **Historical Data:** Save and view historical data of the curing process.

## Installation

### Prerequisites

1. **Node.js:** Ensure Node.js is installed on your system. You can download it from [Node.js official website](https://nodejs.org/).
2. **SQLite:** SQLite is required to store the historical data. You can install it using your system's package manager.

### Setup

1. Clone the repository to your local machine:
    ```bash
    git clone <repository_url>
    cd stagionatore
    ```

2. Install the necessary Node.js dependencies:
    ```bash
    npm install
    ```

3. Initialize the SQLite database:
    ```bash
    sqlite3 chamberData.db < init.sql
    ```

### Running the Server

To start the server, run the following command:

```bash
node server.js
```

The server will start on the default port `3000`. You can access the web interface by navigating to `http://<server_ip>:3000` in your web browser.
