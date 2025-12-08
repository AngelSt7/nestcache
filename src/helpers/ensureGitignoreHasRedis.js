import fs from "fs";
import path from "path";
import { logInfo, logSuccess } from "../cli/logger.js";

export function ensureGitignoreHasRedis() {
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  const entry = "redis/";

  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, `${entry}\n`);
    logSuccess("Created .gitignore and added redis/");
    return;
  }

  const content = fs.readFileSync(gitignorePath, "utf8");

  if (content.includes(entry)) {
    logInfo(".gitignore already contains redis/");
    return;
  }

  fs.appendFileSync(gitignorePath, `\n${entry}\n`);
  logSuccess("Added redis/ to .gitignore");
}
