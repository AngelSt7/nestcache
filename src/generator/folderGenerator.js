import path from "path";
import fs from "fs";
import { MODULE_FOLDERS } from "../constants/folders.js";
import { colors } from "../constants/colors.js";
import { sleep } from "../helpers/index.js";
import { 
  logSuccess, 
  logStep 
} from "../cli/logger.js";

export async function createFolderStructure(moduleRoot) {
  logStep("Creating folder structure...");

  for (const folder of MODULE_FOLDERS) {
    const fullPath = path.join(moduleRoot, folder);
    fs.mkdirSync(fullPath, { recursive: true });

    process.stdout.write(`${colors.cyan}⠋ ${colors.reset}`);
    await sleep(40);
    process.stdout.clearLine?.();
    process.stdout.cursorTo?.(0);

    logSuccess(`Folder created: src/cache/${folder}`);
    await sleep(20);
  }
}
