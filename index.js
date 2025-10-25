const { createExitAwareAbortController } = require("./src/common");
const { setupButtons } = require("./src/machine");
const { checkTrays } = require("./src/machine");
const { startButtonListener } = require("./src/machine");
const { startLightningListener } = require("./src/listeners/lightningL");


const main = async () => {
  console.log(`Starting 21UP`);
  const abortController = createExitAwareAbortController();
  setupButtons();
  startButtonListener();
  checkTrays();
  startLightningListener();
};

main();