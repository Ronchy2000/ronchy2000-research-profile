import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");
const source = join(projectRoot, "edgeone.json");
const targetDir = join(projectRoot, ".next");
const target = join(targetDir, "edgeone.json");

if (!existsSync(source)) {
  console.warn("[postbuild] edgeone.json not found; skipping copy.");
  process.exit(0);
}

if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

cpSync(source, target);
console.log("[postbuild] edgeone.json copied to build output.");
