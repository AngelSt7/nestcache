import fs from "fs";
import path from "path";

const IGNORE_FOLDERS = ["node_modules", ".git", "dist", "build"];

export function detectAllYamlFiles(basePath = process.cwd()) {
  const results = [];

  function scan(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!IGNORE_FOLDERS.includes(file)) {
          scan(fullPath);
        }
      } else {
        if (file.endsWith(".yml") || file.endsWith(".yaml")) {
          results.push(fullPath);
        }
      }
    }
  }

  scan(basePath);
  return results;
}
