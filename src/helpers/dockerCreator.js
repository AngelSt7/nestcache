import fs from "fs";
import path from "path";
import { dockerRedisServiceTemplate } from "../templates/index.js";
import { logError, logSuccess } from "../cli/logger.js";

export function createDefaultDockerCompose() {
  try {
    const filePath = path.join(process.cwd(), "docker-compose.dev.yml");

    const content = `
services:
${dockerRedisServiceTemplate()}
`.trimStart() + "\n";

    fs.writeFileSync(filePath, content);

    logSuccess("docker-compose.dev.yml created with Redis");
  } catch (err) {
    logError(`Failed to create docker-compose.dev.yml: ${err.message}`);
  }
}
