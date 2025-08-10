const WebSocket = require("ws");
const { dispenseFromPayments } = require("../machine");
const { LIGHTNING_LNBITS_URL } = require("../env");

// This file connects to an LNbits server over a websocket and listens to incoming messages in the format "pin-ms", e.g. "21-1000". It then triggers the dispenseFromPayments() function in machine.js to dispense the can at the defined pin.

// The WebSocket URL is obtained from LNBits using the Bitcoin Switch extension and defined in the .env file.
const wsUrl = LIGHTNING_LNBITS_URL;

const startLightningListener = async () => {
  // Create a new WebSocket connection
  const ws = new WebSocket(wsUrl);

  // Event listener for when the connection is open
  await ws.on("open", function open() {
    console.log("Connected to LNbits " + wsUrl);
  });

  // Event listener for when a message is received from the server
  await ws.on("message", function message(data) {
    //console.log('Received message from server:', data);
    const messageStr = data.toString("utf-8"); // Convert buffer to string
    console.log("Received message from LNbits server:", messageStr);
    // example: 0-1000
    pinNo = messageStr.split("-")[0];
    duration = messageStr.split("-")[1];
    dispenseFromPayments(pinNo, duration);
  });

  // Event listener for handling errors
  ws.on("error", function error(err) {
    console.error("WebSocket error:", err.message);
});
};

module.exports = {
  startLightningListener,
};
