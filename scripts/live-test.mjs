// Startet die Live-Tests plattformübergreifend (Windows, macOS, Linux).
// Ersetzt die Unix-Schreibweise "RUN_LIVE_TESTS=true node ..." in package.json.
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projekt = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ergebnis = spawnSync(process.execPath, ["--test", "tests/live.test.mjs"], {
  cwd: projekt,
  stdio: "inherit",
  env: { ...process.env, RUN_LIVE_TESTS: "true" }
});

process.exit(ergebnis.status ?? 1);
