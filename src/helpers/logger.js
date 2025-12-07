import { colors } from "../constants/colors.js";

export function error(msg) {
  console.log(`${colors.red}✖ ${msg}${colors.reset}`);
}

export function info(msg) {
  console.log(`${colors.blue}ℹ ${msg}${colors.reset}`);
}

export function success(msg) {
  console.log(`${colors.green}✔ ${msg}${colors.reset}`);
}

export function headline(msg) {
  console.log(`${colors.bold}${colors.magenta}${msg}${colors.reset}`);
}

export function step(msg) {
  console.log(`${colors.cyan}➤ ${msg}${colors.reset}`);
}