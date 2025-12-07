import Redis from "ioredis";

let redis = null;

export async function initRedis(port = 12000) {
  if (redis) return redis;

  redis = new Redis({
    host: "127.0.0.1",
    port,
    lazyConnect: true 
  });

  try {
    await redis.connect();
    console.log(`✅ Conectado a Redis en 127.0.0.1:${port}`);
  } catch (err) {
    console.log(`❌ No se pudo conectar a Redis en 127.0.0.1:${port}`);
    console.log("   ➜ Asegúrate de haber ejecutado:");
    console.log("   ➜ docker compose up -d");
    console.log("   ➜ O que Redis esté activo manualmente");
    process.exit(1);
  }

  return redis;
}

export async function listKeys() {
  const keys = await redis.keys("*");

  if (!keys.length) {
    console.log("⚠️ No hay keys en Redis");
  } else {
    console.log("✅ Keys en Redis:");
    keys.forEach(k => console.log(" -", k));
  }

  process.exit(0);
}

export async function getKey(key) {
  const value = await redis.get(key);

  if (!value) console.log("⚠️ Key no encontrada");
  else console.log(`✅ ${key}:`, value);

  process.exit(0);
}

export async function deleteKey(key) {
  const result = await redis.del(key);

  if (result === 0) console.log("⚠️ Key no encontrada");
  else console.log("✅ Key eliminada correctamente");

  process.exit(0);
}

export async function flushAll() {
  await redis.flushall();
  console.log("🔥 Todas las keys eliminadas");

  process.exit(0);
}
