export function indexServicesTemplate() {
  return `
export * from './cache-utils.service';
export * from './redis.service';
`.trim();
}
