const { Gpio } = require("onoff");
const { sleep, nowTimestamp } = require("./common");
const { PIN_IN } = require("./env");
const { LABEL } = require("./env");


const pinIn = JSON.parse(process.env.PIN_IN);
const label = JSON.parse(process.env.LABEL);


let isDispensing = false;
const buttons = {};

function dispenseFromPayments(pinOut, duration) {
  // Can only dispense one at a time to avoid overloading
  if (isDispensing) return;
  isDispensing = true;
  const pino = new Gpio(pinOut, "out");
  console.log(`Waiting for a button to be pressed. Pin ${pinIn}`);

  for (pini of pinIn) {
    const button = new Gpio(pini, "in", "rising", {debounceTimeout: 200});
    buttons[pini] = button;
    // Makes the machine hot, ready to dispense
    pino.writeSync(0);
    // Listens for a signal on button, check for the .env file for the pin numbers
    button.watch((error, value) => {
      sleep(500)
      tray = pinIn.indexOf(pini)
      pino.writeSync(1);
      console.log(`Button press detected at tray ${tray}. Dispensed item ${label[tray]} at pin ${pini} successfully`);
      })
    }
  isDispensing = false;
};

module.exports = {
  dispenseFromPayments,
};