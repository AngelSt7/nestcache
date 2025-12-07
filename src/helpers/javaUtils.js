import path from "path";
import fs from "fs";

export function buildJavaPackage(basePath, moduleName, subPath = "domain/model") {
  const normalized = basePath.replace(/\\/g, "/");
  const idx = normalized.indexOf("src/main/java/");
  
  if (idx === -1) {
    throw new Error("La ruta base debe contener src/main/java/");
  }
  
  let pkg = normalized.substring(idx + "src/main/java/".length);
  pkg = pkg.replace(/\//g, ".");
  
  const sub = subPath.replace(/\//g, ".");
  return `${pkg}.${moduleName}.${sub}`;
}

export function getBasePackage(basePath) {
  const normalized = basePath.replace(/\\/g, "/");
  const javaSrcIndex = normalized.indexOf("src/main/java/") + "src/main/java/".length;
  return normalized.substring(javaSrcIndex).replace(/\//g, ".");
}

export function findJavaBasePath(startPath) {
  let current = startPath;
  
  while (current !== path.parse(current).root) {
    const candidate = path.join(current, "src", "main", "java");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    current = path.dirname(current);
  }
  
  throw new Error("No se encontró 'src/main/java' en ningún nivel superior.");
}