import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");
const source = join(projectRoot, "edgeone.json");
const buildOutputs = [join(projectRoot, ".next"), join(projectRoot, "out")];

if (!existsSync(source)) {
  process.exit(0);
}

for (const outputDir of buildOutputs) {
  if (!existsSync(outputDir)) continue;
  const target = join(outputDir, "edgeone.json");
  const dir = dirname(target);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  cpSync(source, target);
}
