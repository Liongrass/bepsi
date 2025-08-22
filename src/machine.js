const { Gpio } = require("onoff");
const { sleep, nowTimestamp } = require("./common");

let isDispensing = false;

const dispenseFromPayments = async (pinNo, duration) => {
  // Can only dispense one at a time to avoid overloading
  if (isDispensing) return;
  isDispensing = true;

  try {
    const pin = new Gpio(pinNo, "out");
    const button = new Gpio(535, "in", "rising", {debounceTimeout: 10});
    // Makes the machine hot, ready to dispense
    pin.writeSync(0);
    console.log(`Waiting for button to be pressed. Pin ${pinNo}`);
    // Listens for a signal on button, wired to pin 535 (GPIO23)
    button.watch((error, value) => pin.writeSync(1));
    button.watch((error, value) => console.log(`Dispensed pin ${pinNo} for ${duration}ms successfully`));
  } catch (error) {
    console.log(error);
   }
  isDispensing = false;
};

module.exports = {
  dispenseFromPayments,
};
