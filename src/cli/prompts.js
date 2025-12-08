import { input, select } from "@inquirer/prompts";
import path from "path";

export async function askCacheMode() {
  return await select({
    message: "How would you like to configure Redis?",
    choices: [
      {
        name: "Automatic configuration (Recommended - requires Docker)",
        value: "AUTO",
      },
      {
        name: "Manual configuration (I will configure Redis myself)",
        value: "MANUAL",
      },
    ]
  });
}
export async function selectDockerCompose(yamlFiles) {
  const choices = yamlFiles.map(file => ({
    name: path.basename(file), 
    value: file                
  }));

  return await select({
    message: "Multiple Docker files were detected. Which one would you like to use?",
    choices
  });
}

export async function askForRedisPort(defaultPort = 12000) {
  const port = await input({
    message: "Enter the Redis port:",
    default: String(defaultPort),
    validate: value => {
      const n = Number(value);
      if (isNaN(n)) return "It must be a number";
      if (n < 1024 || n > 65535) return "Invalid port (1024 - 65535)";
      return true;
    }
  });

  return Number(port);
}
