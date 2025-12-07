import Redis from "ioredis";

let redis = null;

// ✅ SE INICIALIZA DESDE LAS FLAGS
export function initRedis(port = 12000) {
  redis = new Redis({
    host: "127.0.0.1",
    port
  });
}

// ✅ LISTAR TODAS LAS KEYS
export async function listKeys() {
  const keys = await redis.keys("*");

  if (keys.length === 0) {
    console.log("⚠️ No hay keys en Redis");
  } else {
    console.log("✅ Keys en Redis:");
    keys.forEach(k => console.log(" -", k));
  }

  process.exit(0);
}

// ✅ VER UNA KEY
export async function getKey(key) {
  const value = await redis.get(key);

  if (!value) console.log("⚠️ Key no encontrada");
  else console.log(key, value);
  process.exit(0);
}

// ✅ BORRAR UNA KEY
export async function deleteKey(key) {
  const result = await redis.del(key);

  if (result === 0) console.log("⚠️ Key no encontrada");
  else console.log("✅ Key eliminada correctamente");

  process.exit(0);
}

// ✅ BORRAR TODO
export async function flushAll() {
  await redis.flushall();
  console.log("🔥 Todas las keys eliminadas");
  process.exit(0);
}