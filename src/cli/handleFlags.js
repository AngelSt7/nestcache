import { initRedis, listKeys, getKey, deleteKey, flushAll } from "../tools/tools.js";

export async function handleFlags() {
  const args = process.argv.slice(2);

  const validFlags = ["--list", "--get", "--del", "--flush"];
  const hasValidFlag = args.some(arg => validFlags.includes(arg));

  if (!hasValidFlag) {
    return false;
  }

  const portArgIndex = args.findIndex(a => a === "--port");
  const port = portArgIndex !== -1
    ? Number(args[portArgIndex + 1])
    : 12000;


  await initRedis(port);

  if (args.includes("--list")) {
    await listKeys();
    return true;
  }

  if (args.includes("--get")) {
    const key = args[args.indexOf("--get") + 1];
    if (!key) {
      console.log("❌ Debes indicar una key: --get myKey");
      process.exit(1);
    }
    await getKey(key);
    return true;
  }

  if (args.includes("--del")) {
    const key = args[args.indexOf("--del") + 1];
    if (!key) {
      console.log("❌ Debes indicar una key: --del myKey");
      process.exit(1);
    }
    await deleteKey(key);
    return true;
  }

  if (args.includes("--flush")) {
    await flushAll();
    return true;
  }

  return false;
}
