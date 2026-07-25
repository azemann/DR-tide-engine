import { StationNotFoundError } from "../domain/errors.js";
import type { PredictionRequest, TideSeries } from "../domain/prediction.js";
import type { StationRepository, TidePredictor } from "../domain/ports.js";
import type { StationId } from "../domain/stations.js";

export interface GenerateTideSeriesInput {
  readonly stationId: StationId;
  readonly startUtc: Date;
  readonly endUtc: Date;
  readonly stepMinutes: number;
}

export class GenerateTideSeries {
  readonly #stationRepository: StationRepository;
  readonly #tidePredictor: TidePredictor;

  public constructor(
    stationRepository: StationRepository,
    tidePredictor: TidePredictor,
  ) {
    this.#stationRepository = stationRepository;
    this.#tidePredictor = tidePredictor;
  }

  public async execute(input: GenerateTideSeriesInput): Promise<TideSeries> {
    const station = await this.#stationRepository.findById(input.stationId);
    if (station === null) {
      throw new StationNotFoundError(input.stationId);
    }

    const request: PredictionRequest = {
      station,
      startUtc: input.startUtc,
      endUtc: input.endUtc,
      stepMinutes: input.stepMinutes,
    };

    return this.#tidePredictor.predict(request);
  }
}
