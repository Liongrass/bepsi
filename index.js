const { createExitAwareAbortController } = require("./src/common");
const { p } = require("./src/machine")
const { setupButtons } = require("./src/listeners/buttonL");
const { startButtonListener } = require("./src/listeners/buttonL");
const { checkTrays } = require("./src/listeners/buttonL");
const { startLightningListener } = require("./src/listeners/lightningL");

const productionLabel = ["Machine is in TESTING mode", "Machine is running in PRODUCTION"]

const main = async () => {
  console.log(`Starting 21UP`);
  console.log(productionLabel[p]);
  const abortController = createExitAwareAbortController();
  setupButtons();
  startButtonListener();
  checkTrays();
  startLightningListener();
};

main();