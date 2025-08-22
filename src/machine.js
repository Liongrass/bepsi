const { Gpio } = require("onoff");
const axios = require("axios");
const { sleep, nowTimestamp } = require("./common");

let isDispensing = false;

const dispenseFromPayments = async (pinNo, duration) => {
  await axios
  console.log("Dispensing pin " + pinNo + " for " + duration + " ms");
  dispense(pinNo, duration);
};

const dispense = async (pinNo, duration) => {
  // Can only dispense one at a time to avoid overloading
  if (isDispensing) return;
  isDispensing = true;

  try {
    const pin = new Gpio(pinNo, "out");
    pin.writeSync(1);
    await sleep(duration);
    pin.writeSync(0);
    console.log(`Dispensed pin ${pinNo} for ${duration}ms successfully`);
  } catch (error) {
    console.log(error);
   }

  isDispensing = false;
};

module.exports = {
  dispense,
  dispenseFromPayments,
};
