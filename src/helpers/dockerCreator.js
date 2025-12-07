import fs from "fs";
import path from "path";
import { dockerRedisServiceTemplate } from "../templates/index.js";

export function createDefaultDockerCompose() {
  const filePath = path.join(process.cwd(), "docker-compose.dev.yml");

  const content = `
services:
${dockerRedisServiceTemplate()}
`.trimStart() + "\n";

  fs.writeFileSync(filePath, content);
  console.log("✅ docker-compose.dev.yml creado con Redis");
}
