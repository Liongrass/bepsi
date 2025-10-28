const { Gpio } = require("onoff");
const { sleep, nowTimestamp } = require("./common");
const { PIN_IN } = require("./env");
const { PIN_OUT } = require("./env");
const { LABEL } = require("./env");


const pinIn = JSON.parse(process.env.PIN_IN);
const pinOut = JSON.parse(process.env.PIN_OUT);
const label = JSON.parse(process.env.LABEL);

const availableTray = [null, null, null, null, null, null];
const button = [];
let state = 0;
const stateLabel = ["cold", "hot"]
const fullLabel = ["full", "empty"]
var timetaken = "Time until button was pressed:";

// A function that always listens to buttons /
// Logs which button was pressed

function setupButtons() {
//  let button = [];
for (let pin of pinIn) {
    button[pin] = new Gpio(pin, "in", "falling", {debounceTimeout: 500});
    console.log(`Waiting for button to be pressed. Pin ${pin}`);
  }
}

const startButtonListener = async () => {
    // Listens for a signal on button, check for the .env file for the pin numbers
  for (let pin of pinIn) {
    button[pin].watch((error, value) => {
      tray = pinIn.indexOf(pin);
      console.log(`Button press detected. Tray ${tray} at pin ${pin}. (${label[tray]})`);
      makeMachineCold(pinOut);
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

// A function that opens the circuit, triggered by the LightningListener /
// A variable that turns to True
// Logs that the circuit was opened /

function makeMachineHot(pinOut) {
  console.log(`Checking available trays: ${availableTray}`);
  console.time(timetaken);
  const pino = new Gpio(pinOut, "out");
// On the test relay the pins are inverted, in production they should be 1 to open
  pino.writeSync(1);
  state = 1;
  console.log(`Machine is now ${stateLabel[state]}. Pin ${pinOut}`);
}

// A function that closes the circuit, triggered by the button
// If variable is True, log the time and what item was dispensed and close the machine
// If variable is False, do nothing

async function makeMachineCold(pinOut) {
// First, the code sleeps for half a second to allow the machine to dispense the pop
  await sleep(500);
// Next, the machine will check whether the tray was previously marked unavailable
  if (availableTray[tray] == 1) {
    console.log(`Item ${label[tray]} at tray ${tray} unavailable`)
    return;
  }
// Third, the machine will check if it is actually hot, and only close the circuit then
  else if (state == 1) {
    console.timeEnd(timetaken)
    console.log(`Dispensed ${label[tray]} at pin ${pinOut} successfully`);
    const pino = new Gpio(pinOut, "out");
// On the test relay the pins are inverted, in production they should be 0 to close
    pino.writeSync(0);
    state = 0;
    console.log(`Machine is now ${stateLabel[state]}.`)
    checkTrays();
  }
// If condition 0 & 1 are not met, it will do nothing.
  else {
  console.log(`Machine is already ${stateLabel[state]}. Doing nothing.`)
  }
}


module.exports = {
  setupButtons,
  checkTrays,
  startButtonListener,
  makeMachineHot,
  pinOut,
};