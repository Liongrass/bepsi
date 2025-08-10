const { createExitAwareAbortController } = require("./src/common");
const { startLightningListener } = require("./src/listeners/lightningL");

const main = async () => {
  const abortController = createExitAwareAbortController();
  startLightningListener();
};

main();
