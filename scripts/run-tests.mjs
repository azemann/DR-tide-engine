import { readdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

async function findTestFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name)
  )) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findTestFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith(".test.js")) {
      files.push(path);
    }
  }

  return files;
}

const testFiles = await findTestFiles(resolve("dist/tests"));
if (testFiles.length === 0) {
  process.stderr.write("No compiled test file found in dist/tests.\n");
  process.exitCode = 1;
} else {
  const runner = spawn(process.execPath, ["--test", ...testFiles], {
    stdio: "inherit",
  });
  const exitCode = await new Promise((resolveExitCode, reject) => {
    runner.once("error", reject);
    runner.once("exit", (code, signal) => {
      if (signal !== null) {
        reject(new Error(`Test runner interrupted by ${signal}`));
      } else {
        resolveExitCode(code ?? 1);
      }
    });
  });
  process.exitCode = exitCode;
}
