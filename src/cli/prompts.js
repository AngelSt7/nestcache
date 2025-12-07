import { input, select } from "@inquirer/prompts";
import path from "path";

export async function askCacheMode() {
  return await select({
    message: "¿Cómo deseas configurar Redis?",
    choices: [
      {
        name: "Automatic configuration (Recommended - required Docker)",
        value: "AUTO",
      },
      {
        name: "Manual configuration (I configure Redis)",
        value: "MANUAL",
      },
    ]
  });
}

export async function selectDockerCompose(yamlFiles) {
  const choices = yamlFiles.map(file => ({
    name: path.basename(file),  // 👈 solo el nombre bonito
    value: file                  // 👈 ruta real internamente
  }));

  return await select({
    message: "Se detectaron múltiples archivos Docker. ¿Cuál deseas usar?",
    choices
  });
}

export async function askForRedisPort(defaultPort = 12000) {
  const port = await input({
    message: "Ingresa el puerto para Redis:",
    default: String(defaultPort),
    validate: value => {
      const n = Number(value);
      if (isNaN(n)) return "Debe ser un número";
      if (n < 1024 || n > 65535) return "Puerto inválido (1024 - 65535)";
      return true;
    }
  });

  return Number(port);
}
