const WebSocket = require("ws");
const { makeMachineHot } = require("../machine");
const { PIN_OUT } = require("../env");
const { LIGHTNING_LNBITS_URL } = require("../env");
const { WS_PING } = require("../env");
const { WS_RECONNECT } = require("../env");

// The WebSocket URL is obtained from LNBits using the Bitcoin Switch extension and defined in the .env file.
const wsUrl = LIGHTNING_LNBITS_URL;
const wsPing = JSON.parse(process.env.WS_PING);
const wsReconnect = JSON.parse(process.env.WS_RECONNECT);
const pinOut = JSON.parse(process.env.PIN_OUT);

// This function connects to an LNbits server over a websocket and listens to incoming messages in the format "pin-ms"
// e.g. "21-1000". It then triggers the dispenseFromPayments() function in machine.js to dispense the can at the defined pin.
// When the websocket is interrupted, a reconnection attempt is made every minute.
const startLightningListener = async () => {
// Create a new WebSocket connection
  const ws = new WebSocket(wsUrl);

// Event listener starts when the connection is open
  ws.on("open", function open() {
    console.log(`Connected to LNbits ${wsUrl}`);
    console.log(`Configured ping interval: ${wsPing} seconds`)
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
// console.log(`Pinging websocket ${wsUrl} after ${wsPing}ms`)
      }
    }, wsPing*1000);
  });
  
// The received message is validated, the machine is triggered
  ws.on("message", function message(data) {
    const messageStr = data.toString("utf-8"); // Convert buffer to string
    console.log(`Received message from LNbits server: ${messageStr}`);
    // example: 0-1000
    targetPin = parseInt(messageStr.split("-")[0]);
    if (pinOut == targetPin) {
      makeMachineHot(pinOut);
    } else {
      console.log(`Cannot dispense on pin ${targetPin}. Expected pin: ${pinOut}`)
    }
  });
  
// When the connection is disrupted or the server unavailable, the machine will try to reconnect
  ws.onclose = (event) => {
    const reconnectInterval = wsReconnect*1000; // 60000 milliseconds = 1 minute
    console.log(`Connection cannot be established. Reconnecting in ${wsReconnect} seconds`);
    setTimeout(startLightningListener, reconnectInterval);
};

  ws.onerror = (error) => {
  console.error(`WebSocket error: ${error.message}`);
};
  
};

module.exports = {
  pinOut,
  startLightningListener
};