require("dotenv").config();

// Inject datetime into console.log
const myLog = console.log;
console.log = (...args) => {
  myLog.apply(
    console,
    [`[${new Date().toISOString().substring(11, 23)}] -`].concat(...args),
  );
};

// Sanity check
const ENV_VARS = [
  "LIGHTNING_LNBITS_URL",
  "PIN_IN",
  "LABEL",
];
let hasAllEnvVars = true;
for (let i = 0; i < ENV_VARS.length; i++) {
  const curVar = ENV_VARS[i];
  if (!process.env[curVar]) {
    console.log(`Missing ENV_VAR ${curVar}`);
    hasAllEnvVars = false;
  }
}
if (!hasAllEnvVars) {
  process.exit(1);
}

const {
  LIGHTNING_LNBITS_URL,
} = process.env;

module.exports = {
  LIGHTNING_LNBITS_URL
};