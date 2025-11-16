const { Gpio } = require("onoff");
const { PIN_IN } = require("../env");
const { LABEL } = require("../env");
const { makeMachineCold } = require("../machine");


const availableTray = [null, null, null, null, null, null];
const button = [];
const fullLabel = ["full", "empty"]
const pinIn = JSON.parse(process.env.PIN_IN);
const pinOut = JSON.parse(process.env.PIN_OUT);
const label = JSON.parse(process.env.LABEL);

// A function that always listens to buttons /
// Logs which button was pressed

function setupButtons() {
for (let pin of pinIn) {
    button[pin] = new Gpio(pin, "in", "rising", {debounceTimeout: 200});
    console.log(`Waiting for button to be pressed. Pin ${pin}`);
  }
}

const startButtonListener = async () => {
// Listens for a signal on button, check for the .env file for the pin numbers
  for (let pin of pinIn) {
    button[pin].watch((error, value) => {
      tray = pinIn.indexOf(pin);
      console.log(`Button press detected. Tray ${tray} at pin ${pin}. (${label[tray]})`);
      makeMachineCold(pinOut, label, tray);
      if (error) {
        throw error;
      }
    })
  }
}

// The output is suppoed to be an array where 0 represents unavailable and 1 represents available
// availableTray = [0, 0, 1, 0, 1, 1]
function checkTrays() {
  for (let pin of pinIn) {
    button[pin].read((error, value) => {
// Use the splice function to assemble the array always in the correct order. splice(position, numberOfItemsToRemove, item)
      availableTray.splice(pinIn.indexOf(pin), 1, value);
//      console.log(`Tray ${pinIn.indexOf(pin)} Value ${value}`)
      console.log(`Tray ${pinIn.indexOf(pin)} at ${pin} is ${fullLabel[value]} (${label[pinIn.indexOf(pin)]})`);
//      console.log(`Available trays: ${availableTray}`);
      if (error) {
        throw error;
      }
    })
  }
}


module.exports = {
  availableTray,
  checkTrays,
  label,
  startButtonListener,
  setupButtons
};
