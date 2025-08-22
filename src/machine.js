const { Gpio } = require("onoff");
const axios = require("axios");
const { sleep, nowTimestamp } = require("./common");

let isDispensing = false;

const dispenseFromPayments = async (pinNo) => {
  await axios
  console.log("Waiting for button to be pressed. Pin " + pinNo );
  dispense(pinNo);
};

const dispense = async (pinNo, duration) => {
  // Can only dispense one at a time to avoid overloading
  if (isDispensing) return;
  isDispensing = true;

  try {
    const pin = new Gpio(pinNo, "out");
    // Listens for a signal on button, wired to pin 535 (GPIO23)
    const button = new Gpio(535, "in");
    pin.writeSync(1);
    button.watch(value);
    button.writeSync(value);
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
