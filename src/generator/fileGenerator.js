import path from "path";
import fs from "fs";
import { createFolderStructure } from "./folderGenerator.js";
import { headline, success } from "../helpers/index.js";
import { cacheKeysTemplate, ttlsTemplate, indexConfigTemplate, cachedDecoratorTemplate, indexDecoratorTemplate, indexInterceptorTemplate, queryAwareCacheInterceptorTemplate, indexServicesTemplate, cacheUtilsServiceTemplate, redisServiceTemplate, cacheModuleTemplate, indexCacheModuleTemplate } from "../templates/index.js";

//**CONFIG */
function createIndexConfig() {
  const filePath = path.join("src", "cache", "config", "index.ts");
  fs.writeFileSync(filePath, indexConfigTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/config/index.ts`);
}

function createCacheKeys() {
  const filePath = path.join("src", "cache", "config", "cache-keys.ts");
  fs.writeFileSync(filePath, cacheKeysTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/config/cache-keys.ts`);
}

function createTtls() {
  const filePath = path.join("src", "cache", "config", "ttls.ts");
  fs.writeFileSync(filePath, ttlsTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/config/ttls.ts`);
}

//**Decorator */
function createIndexDecorator() {
  const filePath = path.join("src", "cache", "decorators", "index.ts");
  fs.writeFileSync(filePath, indexDecoratorTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/decorators/index.ts`);
}

function createDecorator(){
  const filePath = path.join("src", "cache", "decorators", "cached.decorator.ts");
  fs.writeFileSync(filePath, cachedDecoratorTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/decorators/cached.decorator.ts`);
}

//**Interceptors */
function createIndexInterceptor() {
  const filePath = path.join("src", "cache", "interceptors", "index.ts");
  fs.writeFileSync(filePath, indexInterceptorTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/interceptors/index.ts`);
}

function createInterceptor(){
  const filePath = path.join("src", "cache", "interceptors", "query-aware-cache.interceptor.ts");
  fs.writeFileSync(filePath, queryAwareCacheInterceptorTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/interceptors/query-aware-cache.interceptor.ts`);
}

//**Services */
function createIndexService(){
  const filePath = path.join("src", "cache", "services", "index.ts");
  fs.writeFileSync(filePath, indexServicesTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/services/index.ts`);
}

function createCacheUtilsService(){
  const filePath = path.join("src", "cache", "services", "cache-utils.service.ts");
  fs.writeFileSync(filePath, cacheUtilsServiceTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/services/cache-utils.service.ts`);
}

function createRedisService(port){
  const filePath = path.join("src", "cache", "services", "redis.service.ts");
  fs.writeFileSync(filePath, redisServiceTemplate(port), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/services/redis.service.ts`);
}

//** Module */
function createIndexModule(){
  const filePath = path.join("src", "cache", "module", "index.ts");
  fs.writeFileSync(filePath, indexCacheModuleTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/module/index.ts`);
}

function createCacheModule(){
  const filePath = path.join("src", "cache", "module", "cache.module.ts");
  fs.writeFileSync(filePath, cacheModuleTemplate(), { encoding: "utf-8" });
  success(`Archivo creado: src/cache/module/cache.module.ts`);
}

export async function generateModule(basePath, moduleName, port) {
  const moduleRoot = path.join(basePath, moduleName);
  await createFolderStructure(moduleRoot);

  createCacheKeys();
  createIndexConfig();
  createTtls();
  createIndexDecorator();
  createDecorator();
  createIndexInterceptor();
  createInterceptor();
  createIndexService();
  createCacheUtilsService();
  createRedisService(port);
  createIndexModule();
  createCacheModule();

  headline(`
------------------------------------------------------
      CACHE MODULE SUCCESSFULLY IMPLEMENTED
------------------------------------------------------
`);
}