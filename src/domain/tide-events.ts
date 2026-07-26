import {
  InvalidEventSourceSeriesError,
  InvalidPredictionResultError,
} from "./errors.js";
import type { TideSeries, TideSeriesStation } from "./prediction.js";
import type {
  StationId,
  StationLicense,
  StationSource,
} from "./stations.js";
import { analyzeTideSeries } from "./tide-series-diagnostics.js";

export type TideEventType = "high" | "low";

export type TideEventTime =
  | {
      readonly kind: "sample";
      readonly datetimeUtc: string;
    }
  | {
      readonly kind: "plateau";
      readonly firstSampleUtc: string;
      readonly lastSampleUtc: string;
    };

export type TideEventQualification = "strict" | "plateau";

export type TideEventDetectionMethod = "discrete-local-extremum-v1";

export interface TideEvent {
  readonly type: TideEventType;
  readonly time: TideEventTime;
  readonly rawHeight: number;
  readonly stationId: StationId;
  readonly source: StationSource;
  readonly license: StationLicense;
  readonly detectionMethod: TideEventDetectionMethod;
  readonly qualification: TideEventQualification;
}

export interface TideEventsResult {
  readonly station: TideSeriesStation;
  readonly sourceSeriesStartUtc: string;
  readonly sourceSeriesEndUtc: string;
  readonly sourceStepMinutes: number;
  readonly events: readonly TideEvent[];
}

function assertDetectableSeries(series: TideSeries): void {
  let diagnostics;
  try {
    diagnostics = analyzeTideSeries(series);
  } catch (error: unknown) {
    if (error instanceof InvalidPredictionResultError) {
      throw new InvalidEventSourceSeriesError(
        "metadata must define a valid divisible semi-open UTC window",
      );
    }
    throw error;
  }
  const invalid =
    diagnostics.missingSampleCount > 0 ||
    diagnostics.duplicateSampleCount > 0 ||
    diagnostics.invalidDatetimeSampleCount > 0 ||
    diagnostics.nonFiniteSampleCount > 0 ||
    diagnostics.outOfWindowSampleCount > 0 ||
    diagnostics.misalignedSampleCount > 0 ||
    !diagnostics.chronological ||
    !diagnostics.regularStep;

  if (invalid) {
    throw new InvalidEventSourceSeriesError(
      "samples must be complete, finite, strictly chronological and aligned",
    );
  }
}

function createEvent(
  series: TideSeries,
  type: TideEventType,
  firstIndex: number,
  lastIndex: number,
): TideEvent {
  const firstSample = series.samples[firstIndex]!;
  const lastSample = series.samples[lastIndex]!;
  const strict = firstIndex === lastIndex;

  return {
    type,
    time: strict
      ? {
          kind: "sample",
          datetimeUtc: firstSample.datetimeUtc,
        }
      : {
          kind: "plateau",
          firstSampleUtc: firstSample.datetimeUtc,
          lastSampleUtc: lastSample.datetimeUtc,
        },
    rawHeight: firstSample.height,
    stationId: series.station.id,
    source: series.station.source,
    license: series.station.license,
    detectionMethod: "discrete-local-extremum-v1",
    qualification: strict ? "strict" : "plateau",
  };
}

export function detectTideEvents(series: TideSeries): TideEventsResult {
  assertDetectableSeries(series);

  const events: TideEvent[] = [];
  let firstIndex = 0;

  while (firstIndex < series.samples.length) {
    let lastIndex = firstIndex;
    const height = series.samples[firstIndex]!.height;

    while (
      lastIndex + 1 < series.samples.length &&
      series.samples[lastIndex + 1]!.height === height
    ) {
      lastIndex += 1;
    }

    const previous = series.samples[firstIndex - 1];
    const next = series.samples[lastIndex + 1];
    if (previous !== undefined && next !== undefined) {
      if (height > previous.height && height > next.height) {
        events.push(
          createEvent(series, "high", firstIndex, lastIndex),
        );
      } else if (height < previous.height && height < next.height) {
        events.push(
          createEvent(series, "low", firstIndex, lastIndex),
        );
      }
    }

    firstIndex = lastIndex + 1;
  }

  return {
    station: series.station,
    sourceSeriesStartUtc: series.startUtc,
    sourceSeriesEndUtc: series.endUtc,
    sourceStepMinutes: series.stepMinutes,
    events,
  };
}
