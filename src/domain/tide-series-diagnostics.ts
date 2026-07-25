import { InvalidPredictionResultError } from "./errors.js";
import type { TideSeries } from "./prediction.js";

export interface TideSeriesDiagnostics {
  readonly sampleCount: number;
  readonly expectedSampleCount: number;
  readonly missingSampleCount: number;
  readonly duplicateSampleCount: number;
  readonly invalidDatetimeSampleCount: number;
  readonly nonFiniteSampleCount: number;
  readonly outOfWindowSampleCount: number;
  readonly misalignedSampleCount: number;
  readonly chronological: boolean;
  readonly regularStep: boolean;
  readonly minimumRawHeight: number | null;
  readonly maximumRawHeight: number | null;
  readonly rawRange: number | null;
}

function readWindow(series: TideSeries): {
  readonly startMilliseconds: number;
  readonly endMilliseconds: number;
  readonly stepMilliseconds: number;
  readonly expectedSampleCount: number;
} {
  const startMilliseconds = Date.parse(series.startUtc);
  const endMilliseconds = Date.parse(series.endUtc);
  const stepMilliseconds = series.stepMinutes * 60_000;
  const durationMilliseconds = endMilliseconds - startMilliseconds;

  if (
    !Number.isFinite(startMilliseconds) ||
    !Number.isFinite(endMilliseconds) ||
    !Number.isSafeInteger(series.stepMinutes) ||
    series.stepMinutes <= 0 ||
    durationMilliseconds <= 0 ||
    durationMilliseconds % stepMilliseconds !== 0
  ) {
    throw new InvalidPredictionResultError(
      "series metadata does not define a divisible semi-open UTC window",
    );
  }

  return {
    startMilliseconds,
    endMilliseconds,
    stepMilliseconds,
    expectedSampleCount: durationMilliseconds / stepMilliseconds,
  };
}

export function analyzeTideSeries(
  series: TideSeries,
): TideSeriesDiagnostics {
  const {
    startMilliseconds,
    endMilliseconds,
    stepMilliseconds,
    expectedSampleCount,
  } = readWindow(series);

  const seenTimestamps = new Set<number>();
  const alignedTimestamps = new Set<number>();
  let duplicateSampleCount = 0;
  let invalidDatetimeSampleCount = 0;
  let nonFiniteSampleCount = 0;
  let outOfWindowSampleCount = 0;
  let misalignedSampleCount = 0;
  let chronological = true;
  let regularStep = true;
  let previousTimestamp: number | null = null;
  let minimumRawHeight: number | null = null;
  let maximumRawHeight: number | null = null;

  for (const sample of series.samples) {
    const timestamp = Date.parse(sample.datetimeUtc);
    if (!Number.isFinite(timestamp)) {
      invalidDatetimeSampleCount += 1;
      chronological = false;
      regularStep = false;
    } else {
      if (seenTimestamps.has(timestamp)) {
        duplicateSampleCount += 1;
      }
      seenTimestamps.add(timestamp);

      if (timestamp < startMilliseconds || timestamp >= endMilliseconds) {
        outOfWindowSampleCount += 1;
      } else if ((timestamp - startMilliseconds) % stepMilliseconds !== 0) {
        misalignedSampleCount += 1;
      } else {
        alignedTimestamps.add(timestamp);
      }

      if (previousTimestamp !== null) {
        if (timestamp <= previousTimestamp) {
          chronological = false;
        }
        if (timestamp - previousTimestamp !== stepMilliseconds) {
          regularStep = false;
        }
      }
      previousTimestamp = timestamp;
    }

    if (!Number.isFinite(sample.height)) {
      nonFiniteSampleCount += 1;
      continue;
    }

    minimumRawHeight =
      minimumRawHeight === null
        ? sample.height
        : Math.min(minimumRawHeight, sample.height);
    maximumRawHeight =
      maximumRawHeight === null
        ? sample.height
        : Math.max(maximumRawHeight, sample.height);
  }

  return {
    sampleCount: series.samples.length,
    expectedSampleCount,
    missingSampleCount: Math.max(
      expectedSampleCount - alignedTimestamps.size,
      0,
    ),
    duplicateSampleCount,
    invalidDatetimeSampleCount,
    nonFiniteSampleCount,
    outOfWindowSampleCount,
    misalignedSampleCount,
    chronological,
    regularStep:
      regularStep && series.samples.length === expectedSampleCount,
    minimumRawHeight,
    maximumRawHeight,
    rawRange:
      minimumRawHeight === null || maximumRawHeight === null
        ? null
        : maximumRawHeight - minimumRawHeight,
  };
}
