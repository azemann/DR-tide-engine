import type { PredictionRequest, TideSeries } from "./prediction.js";
import type { HarmonicStation, StationId } from "./stations.js";

export interface StationRepository {
  findById(id: StationId): Promise<HarmonicStation | null>;
}

export interface TidePredictor {
  predict(request: PredictionRequest): Promise<TideSeries>;
}
