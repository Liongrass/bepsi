const { Gpio } = require("onoff");
const { sleep, nowTimestamp } = require("./common");
const { PRODUCTION } = require("./env")

const p = process.env.PRODUCTION;
let state = 0;
const stateLabel = ["cold", "hot"]
var timetaken = "Time until button was pressed:";

// A function that opens the circuit, triggered by the LightningListener //
// The `state` variable turns to True //
// Logs that the circuit was opened //
function makeMachineHot(pinOut) {
  console.time(timetaken);
  const pino = new Gpio(pinOut, "out");
// On the test relay the pins are inverted, in production they should be 1 to open
  pino.writeSync(p);
  state = 1;
  console.log(`Machine is now ${stateLabel[state]}. Pin ${pinOut}`);
}

// A function that closes the circuit, triggered by the button
// If variable is True, log the time and what item was dispensed and close the machine
// If variable is False, do nothing
async function makeMachineCold(pinOut, label) {
// First, the code sleeps for half a second to allow the machine to dispense the pop
  await sleep(500);
  if (state == 1) {
    console.timeEnd(timetaken)
    console.log(`Dispensed ${label[tray]} at pin ${pinOut} successfully`);
    const pino = new Gpio(pinOut, "out");
// On the test relay the pins are inverted, in production they should be 0 to close
    pino.writeSync(1-p);
    state = 0;
    console.log(`Machine is now ${stateLabel[state]}.`)
  }
// If condition 0 & 1 are not met, it will do nothing.
  else {
  console.log(`Machine is already ${stateLabel[state]}. Making machine cold anyway.`)
  const pino = new Gpio(pinOut, "out");
  pino.writeSync(1-p);
  }
}

module.exports = {
  makeMachineHot,
  makeMachineCold,
  p
};