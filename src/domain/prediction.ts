import { InvalidPredictionRequestError } from "./errors.js";
import type {
  HarmonicStation,
  StationId,
  StationLicense,
  StationSource,
} from "./stations.js";

export interface PredictionRequest {
  readonly station: HarmonicStation;
  readonly startUtc: Date;
  readonly endUtc: Date;
  readonly stepMinutes: number;
}

export interface TideSample {
  readonly datetimeUtc: string;
  readonly height: number;
}

export interface TideSeriesStation {
  readonly id: StationId;
  readonly name: string;
  readonly timezone: string;
  readonly source: StationSource;
  readonly license: StationLicense;
}

export interface TideSeries {
  readonly station: TideSeriesStation;
  readonly startUtc: string;
  readonly endUtc: string;
  readonly stepMinutes: number;
  readonly samples: readonly TideSample[];
}

export function validatePredictionRequest(
  request: PredictionRequest,
): PredictionRequest {
  const startMilliseconds = request.startUtc.getTime();
  const endMilliseconds = request.endUtc.getTime();

  if (!Number.isFinite(startMilliseconds) || !Number.isFinite(endMilliseconds)) {
    throw new InvalidPredictionRequestError("start and end must be valid dates");
  }

  if (startMilliseconds >= endMilliseconds) {
    throw new InvalidPredictionRequestError("start must be before end");
  }

  if (
    !Number.isSafeInteger(request.stepMinutes) ||
    request.stepMinutes <= 0
  ) {
    throw new InvalidPredictionRequestError(
      "stepMinutes must be a positive integer",
    );
  }

  const stepMilliseconds = request.stepMinutes * 60_000;
  if ((endMilliseconds - startMilliseconds) % stepMilliseconds !== 0) {
    throw new InvalidPredictionRequestError(
      "the prediction window must be divisible by stepMinutes",
    );
  }

  return request;
}
