import { colors } from "../constants/colors.js";

export function logSuccess(msg) {
  console.log(
    `${colors.green}${colors.bold}[SUCCESS] ✔ ${msg}${colors.reset}`
  );
}

export function logWarning(msg) {
  console.log(
    `${colors.yellow}${colors.bold}[WARNING] ⚠ ${msg}${colors.reset}`
  );
}

export function logError(msg) {
  console.log(
    `${colors.red}${colors.bold}[ERROR] ✖ ${msg}${colors.reset}`
  );
}

export function logInfo(msg) {
  console.log(
    `${colors.blue}${colors.bold}[INFO] ℹ ${msg}${colors.reset}`
  );
}

export function log(msg) {
  console.log(
    `${colors.gray}${colors.bold}[LOG] ${msg}${colors.reset}`
  );
}

export function logStep(msg) {
  console.log(
    `${colors.cyan}${colors.bold}[STEP] ➤ ${msg}${colors.reset}`
  );
}

export function logTitle(msg) {
  console.log(
    `${colors.magenta}${colors.bold}${msg}${colors.reset}`
  );
}
