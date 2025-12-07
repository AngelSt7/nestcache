import { execSync } from "child_process";
import fs from "fs";

export function installIORedis() {
  try {
    let command = "npm install ioredis";

    if (fs.existsSync("pnpm-lock.yaml")) {
      command = "pnpm add ioredis";
    } else if (fs.existsSync("yarn.lock")) {
      command = "yarn add ioredis";
    }

    console.log(`\n📦 Instalando dependencia con: ${command}\n`);
    execSync(command, { stdio: "inherit" });

    console.log("\n✅ ioredis instalado correctamente\n");
  } catch (error) {
    console.error("\n❌ Error instalando ioredis\n");
    process.exit(1);
  }
}
