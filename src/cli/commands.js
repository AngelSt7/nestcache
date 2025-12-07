import { generateModule } from "../generator/fileGenerator.js";
import { createDefaultDockerCompose, detectAllYamlFiles, injectRedisIntoDocker } from "../helpers/index.js";
import { headline } from "../helpers/index.js";
import { installIORedis } from "../helpers/installDeps.js";
import { handleFlags } from "./handleFlags.js";
import { askCacheMode, selectDockerCompose, askForRedisPort } from "./prompts.js";
import path from "path";

export async function main() {
  const usedFlags = await handleFlags();
  if (usedFlags !== false) return;

  headline(`
======================================
   CREATE CACHE REDIS
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
      console.log("No se encontraron archivos docker-compose.");
      console.log("Se creará automáticamente: docker-compose.dev.yml");

      dockerUsedPath = createDefaultDockerCompose(port);

    } else if (yamls.length === 1) {
      console.log(
        `Archivo Docker detectado automáticamente: ${path.basename(yamls[0])}`
      );

      dockerUsedPath = yamls[0];
      console.log("Usando:", dockerUsedPath);

      injectRedisIntoDocker(dockerUsedPath, port);

    } else {
      const selectedDocker = await selectDockerCompose(yamls);

      dockerUsedPath = selectedDocker;
      console.log(
        `Docker seleccionado: ${path.basename(dockerUsedPath)}`
      );

      injectRedisIntoDocker(dockerUsedPath, port);
    }

    // ✅ MENSAJES FINALES POST-CREACIÓN
    console.log("\n✅ Redis configurado correctamente.\n");
    console.log("📌 Ahora debes ejecutar el siguiente comando desde la carpeta donde está tu docker-compose:\n");
    console.log("   👉 docker compose up -d\n");
    console.log("⚠️ Asegúrate de tener Docker instalado y en ejecución.");
    console.log("\n🔧 Si tienes problemas con el puerto:");
    console.log("   - Puedes cambiarlo en tu archivo docker-compose (servicio redis)");
    console.log("   - Y también en el archivo de servicio Redis generado (redisService)");
    console.log(`   - Puerto actual configurado: ${port}\n`);

  } else {
    console.log("Modo manual seleccionado, configure redis manualmente");
  }

  // ---- FUTURO ----
  const basePath = "src";
  const moduleName = "cache";

  installIORedis();
  await generateModule(basePath, moduleName, portFolder);
}
