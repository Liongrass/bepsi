const { Gpio } = require("onoff");
const { sleep, nowTimestamp } = require("./common");
const { PIN_IN } = require("./env");
const { PIN_OUT } = require("./env");
const { LABEL } = require("./env");


const pinIn = JSON.parse(process.env.PIN_IN);
const pinOut = JSON.parse(process.env.PIN_OUT);
const label = JSON.parse(process.env.LABEL);

let state = 0;
const stateLabel = ["cold", "hot"]
var timetaken = "Time until button was pressed:";

// A function that always listens to buttons /
// Logs which button was pressed

const startButtonListener = async () => {
for (let pin of pinIn) {
    const button = new Gpio(pin, "in", "rising", {debounceTimeout: 200});
    console.log(`Waiting for button to be pressed. Pin ${pinIn[pinIn.indexOf(pin)]}`);
    // Listens for a signal on button, check for the .env file for the pin numbers
    button.watch((error, value) => {
      tray = pinIn.indexOf(pin);
      console.log(`Button press detected. Tray ${tray} at pin ${pin}. (${label[tray]})`);
      makeMachineCold(pinOut);
    })
  }
}

// A function that opens the circuit, triggered by the LightningListener /
// A variable that turns to True
// Logs that the circuit was opened /

function makeMachineHot(pinOut) {
  console.time(timetaken);
  const pino = new Gpio(pinOut, "out");
  pino.writeSync(0);
  state = 1;
  console.log(`Machine is now ${stateLabel[state]}. Pin ${pinOut}`);
}

// A function that closes the circuit, triggered by the button
// If variable is True, log the time and what item was dispensed and close the machine
// If variable is False, do nothing

async function makeMachineCold(pinOut) {
  await sleep(500);

  if (state == 1) {
  console.timeEnd(timetaken)
  console.log(`Dispensed ${label[tray]} at pin ${pinOut} successfully`);
  const pino = new Gpio(pinOut, "out");
  pino.writeSync(1);
  state = 0;
  console.log(`Machine is now ${stateLabel[state]}.`)
  }

  else {
  console.log(`Machine is already ${stateLabel[state]}. Doing nothing.`)
  }
}


module.exports = {
  startButtonListener,
  makeMachineHot,
  pinOut,
};