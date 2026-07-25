import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";

import { runPredictCommand } from "../dist/src/cli/predict.js";
import { analyzeTideSeries } from "../dist/src/domain/tide-series-diagnostics.js";

const execFileAsync = promisify(execFile);
const outputPath = new URL(
  "../data/generated/observatory-data.json",
  import.meta.url,
);

const stations = [
  "ticon/ouistreham-311-fra-refmar",
  "ticon/le_havre-4-fra-refmar",
];

function readDate(arguments_) {
  if (arguments_.length === 0) {
    return new Date().toISOString().slice(0, 10);
  }
  if (arguments_.length !== 2 || arguments_[0] !== "--date") {
    throw new Error("usage: observatory:data -- [--date YYYY-MM-DD]");
  }
  return arguments_[1];
}

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
}

async function readGitState() {
  try {
    const [{ stdout: commit }, { stdout: branch }, { stdout: status }] =
      await Promise.all([
        execFileAsync("git", ["rev-parse", "--short", "HEAD"]),
        execFileAsync("git", ["branch", "--show-current"]),
        execFileAsync("git", ["status", "--porcelain"]),
      ]);
    return {
      commit: commit.trim(),
      branch: branch.trim(),
      dirty: status.trim().length > 0,
    };
  } catch {
    return { commit: null, branch: null, dirty: null };
  }
}

function readRoadmap(markdown) {
  return [...markdown.matchAll(/^- \[([ x])\] (.+);?$/gm)].map(
    ([, marker, label]) => ({
      label: label.replace(/;$/, ""),
      status: marker === "x" ? "complete" : "planned",
    }),
  );
}

function readOpenAudits(markdown) {
  return markdown
    .split("\n")
    .filter((line) => /^\| AUD-\d+ /.test(line) && /\| ouvert \|$/.test(line))
    .map((line) => {
      const cells = line.split("|").map((cell) => cell.trim());
      return {
        id: cells[1],
        summary: cells[2],
        severity: cells[3],
      };
    });
}

async function main() {
  const date = readDate(process.argv.slice(2));
  const [packageJson, packageLock, roadmap, audit, git] = await Promise.all([
    readJson("../package.json"),
    readJson("../package-lock.json"),
    readFile(new URL("../docs/050_Roadmap.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/095_Registre_Audit.md", import.meta.url), "utf8"),
    readGitState(),
  ]);

  const predictions = [];
  for (const station of stations) {
    const series = JSON.parse(
      await runPredictCommand(["--station", station, "--date", date]),
    );
    predictions.push({
      series,
      diagnostics: analyzeTideSeries(series),
    });
  }

  const snapshot = {
    schemaVersion: 1,
    generatedAtUtc: new Date().toISOString(),
    engine: {
      name: "DR Tide Engine",
      version: packageJson.version,
      maturity: "development",
      milestone: "M1 — série harmonique brute",
      git,
    },
    calculation: {
      dataAdapter: "@neaps/tide-database",
      dataAdapterVersion:
        packageLock.packages?.["node_modules/@neaps/tide-database"]?.version ??
        null,
      predictor: "@neaps/tide-predictor",
      predictorVersion:
        packageLock.packages?.["node_modules/@neaps/tide-predictor"]?.version ??
        null,
      verticalReference: "non qualifiée",
      resultQualification: "ordonnée harmonique brute non validée",
      navigationUse: false,
    },
    progress: readRoadmap(roadmap),
    openAudits: readOpenAudits(audit),
    predictions,
  };

  await mkdir(new URL("../data/generated/", import.meta.url), {
    recursive: true,
  });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  process.stdout.write(
    `Instantané de l'observatoire généré pour ${date}: ${predictions.length} stations.\n`,
  );
}

await main();
