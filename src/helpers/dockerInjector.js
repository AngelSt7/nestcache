import fs from "fs";
import { dockerRedisServiceTemplate } from "../templates/index.js";
import { logError, logSuccess, logWarning } from "../cli/logger.js";

export function injectRedisIntoDocker(filePath, port) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    if (content.includes("redis:")) {
      logWarning("Redis already exists in this docker-compose file. Nothing was added.");
      return;
    }

    const updated =
      content.trimEnd() + "\n\n" + dockerRedisServiceTemplate(port) + "\n";

    fs.writeFileSync(filePath, updated);

    logSuccess("Redis service added successfully");
  } catch (err) {
    logError(`Failed to inject Redis into file: ${err.message}`);
  }
}
