const { Gpio } = require("onoff");
const axios = require("axios");
const { sleep, nowTimestamp } = require("./common");

let isDispensing = false;

const pinToItem = {
  4: "lime",
  5: "strawberry",
  6: "grapefruit",
  12: "cherry",
  13: "purple",
  16: "orange",
};

const getDispenseItemGivenPin = (pinNo) =>
  pinToItem[pinNo] || `unmarked-${pinNo}`;

const dispense = async (pinNo) => {
  // Can only dispense one at a time to avoid overloading
  if (isDispensing) return;
  isDispensing = true;

  try {
    const pin = new Gpio(pinNo, "out");
    pin.writeSync(0);
    await sleep(500);
    pin.writeSync(1);
    console.log(`dispense ${pinNo} successful`);
  } catch (e) {
    console.log("Unable to find GPIO pins, running in simulation..");
  }

  isDispensing = false;
};

const dispenseFromPayments = async (pinNo, currency) => {
  await axios
  console.log("dispensing " + pinNo);
  dispense(pinNo);
};

// Right to left, pins
// [4, 5, 6, 12, 13, 16, 9]

module.exports = {
  dispense,
  dispenseFromPayments,
};
