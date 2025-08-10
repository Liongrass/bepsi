const { Gpio } = require("onoff");
const axios = require("axios");
const { sleep, nowTimestamp } = require("./common");

let isDispensing = false;

const dispenseFromPayments = async (pinNo, duration) => {
  await axios
  console.log("dispensing pin " + pinNo + " for " + duration + " ms");
  dispense(pinNo);
};

const dispense = async (pinNo) => {
  // Can only dispense one at a time to avoid overloading
  if (isDispensing) return;
  isDispensing = true;

  try {
    const pin = new Gpio(pinNo, "out");
    pin.writeSync(0);
    await sleep(500);
    pin.writeSync(1);
    console.log(`dispensed pin ${pinNo} successful`);
  } catch (e) {
    console.log(e);
   }

  isDispensing = false;
};

module.exports = {
  dispense,
  dispenseFromPayments,
};
