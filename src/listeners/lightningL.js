const WebSocket = require("ws");
const { dispenseFromPayments } = require("../machine");
const { LIGHTNING_LNBITS_URL } = require("../env");

// This file connects to an LNbits server over a websocket and listens to incoming messages in the format "pin-ms", e.g. "21-1000". It then triggers the dispenseFromPayments() function in machine.js to dispense the can at the defined pin. When the websocket is interrupted, a reconnection attempt is made every minute.

// The WebSocket URL is obtained from LNBits using the Bitcoin Switch extension and defined in the .env file.
const wsUrl = LIGHTNING_LNBITS_URL;

const startLightningListener = async () => {
  // Create a new WebSocket connection
  const ws = new WebSocket(wsUrl);

  // Event listener for when the connection is open
  ws.on("open", function open() {
    console.log("Connected to LNbits " + wsUrl);
  });
  
  // Event listener for when a message is received from the server
  ws.on("message", function message(data) {
    const messageStr = data.toString("utf-8"); // Convert buffer to string
    console.log("Received message from LNbits server:", messageStr);
    // example: 0-1000
    pinOut = messageStr.split("-")[0];
    duration = messageStr.split("-")[1];
    dispenseFromPayments(pinOut, duration);
  });
  
 ws.onclose = (event) => {
    const reconnectInterval = 60000; // 60000 milliseconds = 1 minute
    console.log("Connection cannot be established. Reconnecting in 1 minute");
    setTimeout(startLightningListener, reconnectInterval);
};

  ws.onerror = (error) => {
  console.error("WebSocket error:", error.message);
};
  
};

module.exports = {
  startLightningListener,
};
