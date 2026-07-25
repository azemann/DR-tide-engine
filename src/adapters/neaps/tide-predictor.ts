import { createTidePredictor } from "@neaps/tide-predictor";
import { InvalidPredictionResultError } from "../../domain/errors.js";
import {
  validatePredictionRequest,
  type PredictionRequest,
  type TideSample,
  type TideSeries,
} from "../../domain/prediction.js";
import type { TidePredictor } from "../../domain/ports.js";

function assertFiniteHeight(height: number, index: number): void {
  if (!Number.isFinite(height)) {
    throw new InvalidPredictionResultError(
      `sample ${index} contains a non-finite height`,
    );
  }
}

export class NeapsTidePredictor implements TidePredictor {
  public async predict(request: PredictionRequest): Promise<TideSeries> {
    validatePredictionRequest(request);

    const startMilliseconds = request.startUtc.getTime();
    const endMilliseconds = request.endUtc.getTime();
    const stepMilliseconds = request.stepMinutes * 60_000;
    const expectedSampleCount =
      (endMilliseconds - startMilliseconds) / stepMilliseconds;

    const predictor = createTidePredictor(
      [...request.station.harmonicConstituents],
      { offset: false },
    );
    const timeline = predictor.getTimelinePrediction({
      start: new Date(startMilliseconds),
      end: new Date(endMilliseconds),
      timeFidelity: request.stepMinutes * 60,
    });

    const samples: TideSample[] = timeline
      .filter((point) => point.time.getTime() < endMilliseconds)
      .map((point, index) => {
        const expectedTime = startMilliseconds + index * stepMilliseconds;
        if (point.time.getTime() !== expectedTime) {
          throw new InvalidPredictionResultError(
            `sample ${index} is not aligned with the requested interval`,
          );
        }

        assertFiniteHeight(point.level, index);
        return {
          datetimeUtc: point.time.toISOString(),
          height: point.level,
        };
      });

    if (samples.length !== expectedSampleCount) {
      throw new InvalidPredictionResultError(
        `expected ${expectedSampleCount} samples, received ${samples.length}`,
      );
    }

    return {
      station: {
        id: request.station.id,
        name: request.station.metadata.name,
        source: request.station.source,
        license: request.station.license,
      },
      startUtc: new Date(startMilliseconds).toISOString(),
      endUtc: new Date(endMilliseconds).toISOString(),
      stepMinutes: request.stepMinutes,
      samples,
    };
  }
}
