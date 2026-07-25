import { GenerateTideSeries } from "../application/generate-tide-series.js";
import { NeapsStationRepository } from "../adapters/neaps/station-repository.js";
import { NeapsTidePredictor } from "../adapters/neaps/tide-predictor.js";
import {
  CliUsageError,
  TideEngineError,
} from "../domain/errors.js";
import { createStationId } from "../domain/stations.js";
import { pathToFileURL } from "node:url";
import { serializeTideSeries } from "./serialize-tide-series.js";

interface PredictArguments {
  readonly station: string;
  readonly date: string;
}

function parseArguments(arguments_: readonly string[]): PredictArguments {
  const values = new Map<string, string>();

  for (let index = 0; index < arguments_.length; index += 2) {
    const option = arguments_[index];
    const value = arguments_[index + 1];
    if (option === undefined || value === undefined) {
      throw new CliUsageError("options require a value");
    }
    if (option !== "--station" && option !== "--date") {
      throw new CliUsageError(`unknown option ${option}`);
    }
    if (values.has(option)) {
      throw new CliUsageError(`duplicate option ${option}`);
    }
    values.set(option, value);
  }

  const station = values.get("--station");
  const date = values.get("--date");
  if (station === undefined || date === undefined) {
    throw new CliUsageError("--station and --date are required");
  }

  return { station, date };
}

function utcDay(date: string): { readonly startUtc: Date; readonly endUtc: Date } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new CliUsageError("--date must use YYYY-MM-DD");
  }

  const startUtc = new Date(`${date}T00:00:00.000Z`);
  if (
    !Number.isFinite(startUtc.getTime()) ||
    startUtc.toISOString().slice(0, 10) !== date
  ) {
    throw new CliUsageError("--date must be a valid UTC calendar date");
  }

  const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60_000);
  return { startUtc, endUtc };
}

export async function runPredictCommand(
  arguments_: readonly string[],
): Promise<string> {
  const parsed = parseArguments(arguments_);
  const stationId = createStationId(parsed.station);
  const { startUtc, endUtc } = utcDay(parsed.date);
  const useCase = new GenerateTideSeries(
    new NeapsStationRepository(),
    new NeapsTidePredictor(),
  );
  const series = await useCase.execute({
    stationId,
    startUtc,
    endUtc,
    stepMinutes: 5,
  });
  return serializeTideSeries(series);
}

async function main(): Promise<void> {
  try {
    process.stdout.write(await runPredictCommand(process.argv.slice(2)));
  } catch (error: unknown) {
    if (error instanceof TideEngineError) {
      process.stderr.write(`${error.code}: ${error.message}\n`);
      process.exitCode = 1;
      return;
    }
    throw error;
  }
}

const entrypoint = process.argv[1];
if (
  entrypoint !== undefined &&
  import.meta.url === pathToFileURL(entrypoint).href
) {
  await main();
}
