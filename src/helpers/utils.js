export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}