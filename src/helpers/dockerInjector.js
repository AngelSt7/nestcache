import fs from "fs";
import { dockerRedisServiceTemplate } from "../templates/index.js";

export function injectRedisIntoDocker(filePath, port) {
  const content = fs.readFileSync(filePath, "utf8");

  if (content.includes("redis:")) {
    console.log("⚠️ Redis ya existe en este docker-compose. No se agregó nada.");
    return;
  }

  const updated = content.trimEnd() + "\n\n" + dockerRedisServiceTemplate(port) + "\n";

  fs.writeFileSync(filePath, updated);
  console.log("✅ Servicio Redis agregado correctamente");
}
