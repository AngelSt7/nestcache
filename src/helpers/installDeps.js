import { execSync } from "child_process";
import fs from "fs";
import { logError, logInfo, logSuccess } from "../cli/logger.js";

export function installIORedis() {
  try {
    const pkgJsonPath = "./package.json";
    if (fs.existsSync(pkgJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
      const deps = pkg.dependencies || {};
      const devDeps = pkg.devDependencies || {};

      if (deps["ioredis"] || devDeps["ioredis"]) {
        logInfo("ioredis is already installed. Skipping installation.");
        return;
      }
    }

    let command = "npm install ioredis";

    if (fs.existsSync("pnpm-lock.yaml")) {
      command = "pnpm add ioredis";
    } else if (fs.existsSync("yarn.lock")) {
      command = "yarn add ioredis";
    }

    logInfo(`Installing dependency with: ${command}`);
    execSync(command, { stdio: "inherit" });

    logSuccess("ioredis installed successfully");
  } catch (error) {
    logError(`Error installing ioredis: ${error.message}`);
    process.exit(1);
  }
}
