const { createExitAwareAbortController } = require("./src/common");
const { startMachineChecker } = require("./src/listeners/machineL");
const { startLightningListener } = require("./src/listeners/lightningL");

const main = async () => {
  const abortController = createExitAwareAbortController();
  startLightningListener();
  startMachineChecker();
};

main();
