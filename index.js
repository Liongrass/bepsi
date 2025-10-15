const { createExitAwareAbortController } = require("./src/common");
const { startButtonListener } = require("./src/machine");
const { startLightningListener } = require("./src/listeners/lightningL");

const main = async () => {
  console.log(`Starting 21UP`);
  const abortController = createExitAwareAbortController();
  startButtonListener();
  startLightningListener();
};

main();
