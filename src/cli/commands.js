import { generateModule } from "../generator/fileGenerator.js";
import { ensureGitignoreHasRedis } from "../helpers/ensureGitignoreHasRedis.js";
import { createDefaultDockerCompose, detectAllYamlFiles, injectRedisIntoDocker } from "../helpers/index.js";
import { installIORedis } from "../helpers/installDeps.js";
import { handleFlags } from "./handleFlags.js";
import { logInfo, logWarning, logSuccess, logStep, logTitle } from "./logger.js";
import { askCacheMode, selectDockerCompose, askForRedisPort } from "./prompts.js";
import path from "path";

export async function main() {
  const usedFlags = await handleFlags();
  if (usedFlags !== false) return;

  logTitle(`
======================================
       CREATE REDIS CACHE
======================================
`);

  const mode = await askCacheMode();
  let portFolder = 12000;

  if (mode === "AUTO") {
    const port = await askForRedisPort(12000);
    portFolder = port;

    const yamls = detectAllYamlFiles();
    let dockerUsedPath = null;

    if (yamls.length === 0) {
      logWarning("No .yml files were found.");
      logInfo("A new file will be created automatically: docker-compose.dev.yml");

      dockerUsedPath = createDefaultDockerCompose(port);

    } else if (yamls.length === 1) {
      logInfo(`Docker file detected automatically: ${path.basename(yamls[0])}`);

      dockerUsedPath = yamls[0];
      logStep(`Using: ${dockerUsedPath}`);

      injectRedisIntoDocker(dockerUsedPath, port);

    } else {
      const selectedDocker = await selectDockerCompose(yamls);

      dockerUsedPath = selectedDocker;
      logInfo(`Selected Docker file: ${path.basename(dockerUsedPath)}`);

      injectRedisIntoDocker(dockerUsedPath, port);
    }

    logSuccess("Redis configured successfully.");

    logInfo("Now run the following command from the folder where your docker-compose file is located:");
    logStep("docker compose up -d");

    logWarning("Make sure Docker is installed and running.");

    logInfo("If you have port issues:");
    logStep("You can change it in your docker-compose file (redis service)");
    logStep("And also in the generated Redis service file (redisService)");
    logInfo(`Current configured port: ${port}`);

  } else {
    logInfo("Manual mode selected, please configure Redis manually.");
  }

  const basePath = "src";
  const moduleName = "cache";

  logStep("Installing ioredis dependency...");
  installIORedis();

  logStep("Generating cache module...");
  await generateModule(basePath, moduleName, portFolder);
  ensureGitignoreHasRedis();

  logSuccess("Cache module generated successfully.");
}
